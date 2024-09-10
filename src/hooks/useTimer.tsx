import { useState, useEffect } from "react";
import useSound from 'use-sound';
import alarm from "/alarm.wav";
import { Log, SafeData, TimerInterface } from "../Interfaces";
import useSocket from "../hooks/useSocket";
import useUser from "./useUser";
import { post } from "../Network";

export default function useTimer(): TimerInterface {
    const [user, setUser] = useUser()
    const [playSound] = useSound(alarm)
    const [timeLeft, setTimeLeft] = useState(694200000)
    const socket = useSocket()
    const SECOND = 1_000;
    const MINUTE = SECOND * 60;

    /** ========== Functions ========== **/
    const pause = () => {
        const user2 = structuredClone(user)
        if (user.timerId === undefined) {
            console.log("starting timer")
            user2.timerId = new Date().toISOString()
            user2.paused = undefined
            user2.deadline = new Date(new Date().getTime() + user.duration * 1_000).toISOString()
            setUser(user2)
            socket.emit(user2)
            return
        }
        if (user.paused === undefined) {
            console.log("pausing timer")
            user2.paused = new Date().toISOString()
            setUser(user2)
            socket.emit(user2)
            return
        }
        if (user.deadline) {
            console.log("playing timer")
            const rem = new Date(user.deadline).getTime() - new Date(user.paused).getTime()
            user2.deadline = new Date(new Date().getTime() + rem).toISOString()
            user2.paused = undefined
            setUser(user2)
            socket.emit(user2)
            return
        }
        throw new Error("Timer shouldn't have reached this stage.")
    }

    const init = () => {
        if (user.paused && user.deadline) {
            const tml = new Date(user.deadline).getTime() - new Date(user.paused).getTime()
            setTimeLeft(tml)
        } else if (user.deadline) {
            const tml = new Date(user.deadline).getTime() - new Date().getTime()
            setTimeLeft(tml)
        } else {
            setTimeLeft(user.duration * MINUTE)
        }
    }

    const stop = (user2?: SafeData) => {
        if (!user2) { user2 = structuredClone(user) }
        user2.timerId = undefined
        user2.deadline = undefined
        user2.paused = undefined
        setUser(user2)
        socket.emit(user2)
        setTimeLeft(user2.duration * MINUTE)
    }

    /** ========== useEffects ========== **/
    useEffect(() => {
        if (!user || !user.deadline) { return }
        let intervalId: NodeJS.Timeout;
        if (user.deadline !== undefined && user.paused === undefined) {
            intervalId = setInterval(() => {
                setTimeLeft((new Date(user.deadline || "sigh").getTime() - new Date().getTime()));
            }, SECOND);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [user, user?.paused, user?.deadline]);

    useEffect(() => {
        init()
    }, [user])

    // Check if the clock is paused
    useEffect(() => {
        const minutes = Math.floor((timeLeft / MINUTE))
        const seconds = Math.floor((timeLeft / SECOND) % 60)
        document.title = "Workaholic - " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        if (timeLeft < 1100 && user.timerId !== undefined) {
            stop()
            setTimeLeft(0)
            playSound()
            Notification.requestPermission()
            const img = "/vite.svg";
            const text = "Take a break!";
            new Notification("Timer finished", { body: text, icon: img });

            // Send request to the server
            async function doStuff() {
                if (!user.deadline || !user.timerId) { throw new Error("Timer not set properly.") }

                const response = await post<Log>("/add-log", { token: user.token }, { log: {
                    project: user.project, duration: user.duration, description: "TODO: Add", timeStarted: user.timerId, timeFinished: user.deadline
                    }
                })
                if (!response.success) {
                    const existingData = localStorage.getItem("workaholicBackup");
                    const data: string[] = existingData ? JSON.parse(existingData) : [];
                    data.push(JSON.stringify({
                        project: user.project, duration: user.duration, description: "TODO: Add", timeStarted: user.timerId, timeFinished: user.deadline
                    }))
                    localStorage.setItem("workaholicBackup", JSON.stringify(data));
                }
            }
            doStuff()
        }
    }, [timeLeft, MINUTE, user])


    /** ========== JSX ========== **/
    return {
        minutes: Math.floor(timeLeft / MINUTE),
        seconds: Math.floor((timeLeft / SECOND) % 60),
        init,
        pause,
        stop
    }
}