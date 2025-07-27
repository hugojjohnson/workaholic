"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    useCallback,
} from "react";
import { api } from "~/trpc/react";
import { useUser } from "./useUser";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { env } from "~/env";

interface TimerContextT {
    timer: inferProcedureOutput<AppRouter["timer"]["get"]> | undefined;
    secondsLeft: number;
    minutesLeft: number;
    pause: () => void;
    stop: () => void;
    paused: boolean;
    disabled: boolean;
    status: string;
}
const SECOND = 1_000
const MINUTE = SECOND * 60;

const TimerContext = createContext<TimerContextT | undefined>(undefined);

enum TimerStatus {
    Unset, Paused, Playing, Error
}
/**
 * startedAt, pausedAt, deadlineAt
 * Unset: undefined, _, _
 * Playing: set, undefined, set (as the time left)
 * Paused: set, set, set
 */
function getTimerStatus(timer: inferProcedureOutput<AppRouter["timer"]["get"]>): TimerStatus {
    if (!timer) {
        return TimerStatus.Error
    }
    if (timer.startedAt === null) {
        return TimerStatus.Unset
    } else if (timer.pausedAt === null && timer.deadlineAt) {
        return TimerStatus.Playing
    } else if (timer.pausedAt && timer.deadlineAt) {
        return TimerStatus.Paused
    }
    return TimerStatus.Error
}

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const user = useUser();

    const utils = api.useUtils();
    const { data: timer, isLoading } = api.timer.get.useQuery({ userId: user.id });

    const updateTimerMutation = api.timer.update.useMutation({
        onSettled: () => {
            utils.timer.get.invalidate({ userId: user.id })
        }
    });

    const durationSeconds =
        timer?.duration
            ? timer.duration * MINUTE
            : 42 * MINUTE;

    const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const togglePause = () => {
        if (!timer) {
            return;
        }
        let startedAt: Date | null = timer.startedAt;
        let pausedAt: Date | null = timer.pausedAt;
        let deadlineAt: Date | null = timer.deadlineAt;

        switch (getTimerStatus(timer)) {
            case TimerStatus.Unset:
                startedAt = new Date();
                pausedAt = null;
                deadlineAt = new Date(new Date().getTime() + timer.duration * (env.NEXT_PUBLIC_ENV === "development" ? SECOND : MINUTE));
                break
            case TimerStatus.Paused:
                if (!timer.deadlineAt || !timer.pausedAt) throw new Error("This is just for the compiler1");
                const rem = new Date(timer.deadlineAt).getTime() - new Date(timer.pausedAt).getTime();
                deadlineAt = new Date(new Date().getTime() + rem);
                pausedAt = null;
                break
            case TimerStatus.Playing:
                if (!timer.deadlineAt) throw new Error("This is just for the compiler");
                pausedAt = new Date();
                break
            case TimerStatus.Error:
                throw new Error("Timer shouldn't have reached this stage.");
        }
        updateTimerMutation.mutate({ timerId: timer.id, startedAt, pausedAt, deadlineAt })
    }

    const stop = () => {
        if (!timer) {
            console.error("timer is undefined");
            return;
        }
        updateTimerMutation.mutate({ timerId: timer.id, startedAt: null, pausedAt: null, deadlineAt: null })
        setTimeLeft(timer.duration * MINUTE)
    }

    //** ========== useEffects ========== **/
    useEffect(() => {
        if (!timer) { return }
        // Update timeLeft
        const deadline = timer.deadlineAt ? new Date(timer.deadlineAt).getTime() : undefined
        const paused = timer.pausedAt?.getTime()
        switch (getTimerStatus(timer)) {
            case TimerStatus.Unset:
                setTimeLeft((timer.duration * MINUTE))
                break
            case TimerStatus.Paused:
                if (!paused || !deadline) throw new Error("This is just for the compiler")
                setTimeLeft((deadline - paused))
                break
            case TimerStatus.Playing:
                if (!deadline) {
                    throw new Error("This is just for the compiler")
                }
                // setSecondsLeft((deadline - new Date().getTime()))
                intervalRef.current = setInterval(() => {
                    // if (!deadline) {
                    //     throw new Error("This is just for the compiler")
                    // }
                    setTimeLeft((deadline - new Date().getTime()))
                }, SECOND)
                break
            case TimerStatus.Error:
                break;
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = undefined;
            }
        };
    }, [timer])

    // This runs like the other use effect, but also every second when the timer is playing.
    useEffect(() => {
        if (!timer) { return }
        // Update tab
        const minutes = Math.floor((timeLeft / MINUTE))
        const seconds = Math.floor(timeLeft % SECOND)
        document.title = "Workaholic - " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds

        if (timeLeft < 1.1 * SECOND && timer.startedAt !== undefined) {
            setTimeLeft(0)
            // try {
            //     playSound()
            // } catch (e) {
            //     console.error(e)
            // }
            // if (typeof Notification !== "undefined") {
            //     Notification.requestPermission?.().then(p => {
            //     if (p === "granted") new Notification("Timer finished", { body: "Take a break!", icon: "/vite.svg" });
            //     })
            // }

            stop()
            // // Send request to the server
            // async function doStuff() {
            //     if (!user.deadline || !user.timerId) { throw new Error("Timer not set properly.") }
            //     const response = await post<Log>("/add-log", { token: user.token }, { log: {
            //         project: user.project.name, duration: user.duration, description: user.description, timeStarted: user.timerId, timeFinished: user.deadline
            //         }
            //     })
            //     if (response.success) {
            //         const user2 = structuredClone(user)
            //         user2.logs.push(response.data)
            //         stop(user2)
            //     } 
            //     else {
            //         console.error(response.data)
            //         const existingData = localStorage.getItem("workaholicBackup")
            //         const data: string[] = existingData ? JSON.parse(existingData) : []
            //         data.push(JSON.stringify({
            //             project: user.project, duration: user.duration, description: user.description, timeStarted: user.timerId, timeFinished: user.deadline
            //         }))
            //         localStorage.setItem("workaholicBackup", JSON.stringify(data))
            //     }
            // }
            // doStuff()
        }
    }, [timeLeft, timer])

    return (
        <TimerContext.Provider
            value={{
                timer: timer,
                minutesLeft: Math.floor(timeLeft / MINUTE),
                secondsLeft: Math.floor((timeLeft / SECOND) % 60),
                pause: togglePause,
                stop,
                paused: !!timer?.pausedAt,
                disabled: timer?.startedAt === null,
                status: ["Unset", "Paused", "Playing", "Error"][getTimerStatus(timer!)]!
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = (): TimerContextT => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
};