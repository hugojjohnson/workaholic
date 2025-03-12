import { useState, useEffect } from "react"
import useSound from 'use-sound'
import alarm from "/alarm.wav"
import { Log, SafeData, TimerInterface } from "../Interfaces"
import useUser from "./useUser"
import { post } from "../Network"

enum TimerStatus {
    Unset, Paused, Playing, Error
}
/**
 * timerId, paused, deadline
 * Unset: undefined, _, _
 * Playing: set, undefined, set (as the time left)
 * Paused: set, set, set
 */
function getTimerStatus(user2: SafeData): TimerStatus {
    if (user2.timerId === undefined) {
        return TimerStatus.Unset
    } else if (user2.paused === undefined && user2.deadline) {
        return TimerStatus.Playing
    } else if (user2.paused && user2.deadline) {
        return TimerStatus.Paused
    }
    return TimerStatus.Error
}

export default function useTimer(): TimerInterface {
    const [user, setUser] = useUser()
    const [playSound] = useSound(alarm)
    const [timeLeft, setTimeLeft] = useState(694200000)
    const SECOND = 1_000
    const MINUTE = SECOND * 60

    /** ========== Functions ========== **/
    const pause = (user2: SafeData) => {
        switch(getTimerStatus(user2)) {
            case TimerStatus.Unset:
                user2.timerId = new Date().toISOString()
                user2.paused = undefined
                user2.deadline = new Date(new Date().getTime() + user.duration * (import.meta.env.DEV ? 1_000 : 60_000)).toISOString()
                break
            case TimerStatus.Paused:
                if (!user2.deadline || !user2.paused) throw new Error("This is just for the compiler1")
                const rem = new Date(user2.deadline).getTime() - new Date(user2.paused).getTime()
                user2.deadline = new Date(new Date().getTime() + rem).toISOString()
                user2.paused = undefined
                break
            case TimerStatus.Playing:
                if (!user2.deadline) throw new Error("This is just for the compiler")
                user2.paused = new Date().toISOString()
                break
            case TimerStatus.Error:
                throw new Error("Timer shouldn't have reached this stage.")
        }
        setUser(user2)
    }

    const stop = (user2?: SafeData) => {
        if (!user2) {
            user2 = structuredClone(user)
        }
        user2 = { ...user2, timerId: undefined, deadline: undefined, paused: undefined, description: "" }
        setTimeLeft(user2.duration * MINUTE)
        setUser(user2)
    }

    /** ========== useEffects ========== **/
    useEffect(() => {
        if (!user) { return }
        let intervalId: NodeJS.Timeout
        // Update timeLeft
        const deadline = user.deadline ? new Date(user.deadline).getTime() : undefined
        const paused = user.paused ? new Date(user.paused).getTime() : undefined
        switch (getTimerStatus(user)) {
            case TimerStatus.Unset:
                setTimeLeft(user.duration * MINUTE)
                break
            case TimerStatus.Paused:
                if (!paused || !deadline) throw new Error("This is just for the compiler")
                setTimeLeft(deadline - paused)
                break
            case TimerStatus.Playing:
                if (!deadline) throw new Error("This is just for the compiler")
                setTimeLeft(deadline - new Date().getTime())
                intervalId = setInterval(() => {
                    if (!deadline) throw new Error("This is just for the compiler")
                    setTimeLeft(deadline - new Date().getTime())
                }, SECOND)
                break
            case TimerStatus.Error:
                break;
        }
        return () => { if (intervalId) clearInterval(intervalId) }
    }, [user])


    // This runs like the other use effect, but also every second when the timer is playing.
    useEffect(() => {
        // Update tab
        const minutes = Math.floor((timeLeft / MINUTE))
        const seconds = Math.floor((timeLeft / SECOND) % 60)
        document.title = "Workaholic - " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds

        if (timeLeft < 1100 && user.timerId !== undefined) {
            setTimeLeft(0)
            playSound()
            Notification.requestPermission()
            new Notification("Timer finished", { body: "Take a break!", icon: "/vite.svg" })

            stop()
            // Send request to the server
            async function doStuff() {
                if (!user.deadline || !user.timerId) { throw new Error("Timer not set properly.") }
                const response = await post<Log>("/add-log", { token: user.token }, { log: {
                    project: user.project.name, duration: user.duration, description: user.description, timeStarted: user.timerId, timeFinished: user.deadline
                    }
                })
                if (response.success) {
                    const user2 = structuredClone(user)
                    user2.logs.push(response.data)
                    stop(user2)
                } 
                else {
                    console.error(response.data)
                    const existingData = localStorage.getItem("workaholicBackup")
                    const data: string[] = existingData ? JSON.parse(existingData) : []
                    data.push(JSON.stringify({
                        project: user.project, duration: user.duration, description: user.description, timeStarted: user.timerId, timeFinished: user.deadline
                    }))
                    localStorage.setItem("workaholicBackup", JSON.stringify(data))
                }
            }
            doStuff()
        }
    }, [timeLeft, user])
    
    /** ========== JSX ========== **/
    return {
        minutes: Math.floor(timeLeft / MINUTE),
        seconds: Math.floor((timeLeft / SECOND) % 60),
        pause,
        stop
    }
}