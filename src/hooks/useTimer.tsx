import { useState, useEffect } from "react";
import useSound from 'use-sound';
import alarm from "/alarm.wav";
import { Log, SafeData, TimerInterface } from "../Interfaces";
import useUser from "./useUser";
import { post } from "../Network";

export default function useTimer(): TimerInterface {
    const [user, setUser] = useUser()
    const [playSound] = useSound(alarm)
    const [timeLeft, setTimeLeft] = useState(694200000)
    const SECOND = 1_000;
    const MINUTE = SECOND * 60;

    /** ========== Functions ========== **/
    const pause = (user2: SafeData) => {
        if (user.timerId === undefined) {
            console.debug("starting timer")
            user2.timerId = new Date().toISOString()
            user2.paused = undefined
            user2.deadline = new Date(new Date().getTime() + user.duration * (import.meta.env.DEV ? 1_000 : 60_000)).toISOString()
        } else if (user.paused === undefined) {
            console.debug("pausing timer")
            user2.paused = new Date().toISOString()
        } else if (user.deadline) {
            console.debug("playing timer")
            const rem = new Date(user.deadline).getTime() - new Date(user.paused).getTime()
            user2.deadline = new Date(new Date().getTime() + rem).toISOString()
            user2.paused = undefined
        } else {
            throw new Error("Timer shouldn't have reached this stage.")
        }
        setUser(user2)
    }

    const stop = (user2?: SafeData) => {
        console.log("timer.stop")
        console.log(user.logs)
        if (!user2) { user2 = structuredClone(user) }
        user2.timerId = undefined
        user2.deadline = undefined
        user2.paused = undefined
        user2.description = ""
        setTimeLeft(user2.duration * MINUTE)
        setUser(user2)
    }

    /** ========== useEffects ========== **/
    useEffect(() => {
        if (!user || !user.deadline) {
            return
        } else {
            let intervalId: NodeJS.Timeout;
            const x = user.deadline
            setTimeLeft((new Date(x).getTime() - new Date().getTime()));
            intervalId = setInterval(() => {
                setTimeLeft((new Date(x).getTime() - new Date().getTime()));
            }, SECOND);
            return () => { clearInterval(intervalId); };
        }
    }, [user, user.paused, user.deadline, user.logs]);

    useEffect(() => {
        if (user.paused && user.deadline) {
            const tml = new Date(user.deadline).getTime() - new Date(user.paused).getTime()
            setTimeLeft(tml)
        } else if (user.deadline) {
            const tml = new Date(user.deadline).getTime() - new Date().getTime()
            setTimeLeft(tml)
        } else {
            setTimeLeft(user.duration * MINUTE)
        }
    }, [user])

    // Check if the clock is paused
    useEffect(() => {
        const minutes = Math.floor((timeLeft / MINUTE))
        const seconds = Math.floor((timeLeft / SECOND) % 60)
        document.title = "Workaholic - " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        if (timeLeft < 1100 && user.timerId !== undefined) {
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
                    project: user.project.name, duration: user.duration, description: user.description, timeStarted: user.timerId, timeFinished: user.deadline
                    }
                })
                if (response.success) {
                    const user2 = structuredClone(user)
                    console.log("finished")
                    console.log(user.logs)
                    user2.logs.push(response.data)
                    stop(user2)
                } else {
                    console.error(response.data)
                    const existingData = localStorage.getItem("workaholicBackup");
                    const data: string[] = existingData ? JSON.parse(existingData) : [];
                    data.push(JSON.stringify({
                        project: user.project, duration: user.duration, description: user.description, timeStarted: user.timerId, timeFinished: user.deadline
                    }))
                    localStorage.setItem("workaholicBackup", JSON.stringify(data));
                    stop()
                }
            }
            doStuff()
        }
    }, [timeLeft, user, user.logs, user.timerId])
    
    /** ========== JSX ========== **/
    return {
        minutes: Math.floor(timeLeft / MINUTE),
        seconds: Math.floor((timeLeft / SECOND) % 60),
        pause,
        stop
    }
}