import { useState, useEffect } from "react";
// import useSound from 'use-sound';
// import alarm from "/alarm.wav";
import { TimerInterface, User } from "../Interfaces";

const SECOND = 1_000;
const MINUTE = SECOND * 60;

export default function useTimer([user, setUser]: User): TimerInterface {
    // const [playSound] = useSound(alarm)
    const [timeLeft, setTimeLeft] = useState(42000)

    /** ========== Functions ========== **/
    const pause = () => {
        console.log("pausing")
        
        if (!user) { return }
        const user2 = structuredClone(user)
        if (user.timerId === undefined) {
            user2.timerId = new Date().toISOString()
            user2.paused = undefined
            user2.deadline = new Date(new Date().getTime() + user.duration * MINUTE).toISOString()
            setUser(user2)
            return
        }
        if (user.paused === undefined) {
            user2.paused = new Date().toISOString()
            setUser(user2)
            return
        }
        if (user.deadline) {
            const rem = new Date(user.deadline).getTime() - new Date(user.paused).getTime()
            user2.deadline = new Date(new Date().getTime() + rem).toISOString()
            user2.paused = undefined
            setUser(user2)
            return
        }
        throw new Error("Timer shouldn't have reached this stage.")
    }

    const reset = () => {
        if (!user) { return }
        setTimeLeft(user.duration * MINUTE)
    }

    /** ========== useEffects ========== **/
    useEffect(() => {
        if (!user) { return }
        setTimeLeft((new Date(user.deadline || "sigh").getTime() - new Date().getTime()));

        let intervalId: number;
        if (user.deadline !== undefined && user.paused === undefined) {
            intervalId = setInterval(() => {
                setTimeLeft((new Date(user.deadline || "sigh").getTime() - new Date().getTime()));
            }, SECOND);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [user?.paused, user?.deadline]);

    // /* If the initial deadline value changes */
    // useEffect(() => {
    // if (!user) { return }
    //     setTimeLeft((new Date(deadline).getTime() - new Date().getTime()));
    // }, [deadline]);

    // Check if the clock is paused
    useEffect(() => {
        console.log(timeLeft)
        if (!user) { return }
        const minutes = Math.floor((timeLeft / MINUTE))
        const seconds = Math.floor((timeLeft / SECOND) % 60)
        document.title = "Workaholic - " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        // if (timeLeft < 1000 && !finished && timeStarted !== undefined) {
        //     setFinished(true)
        //     setTimeLeft(0)
        //     playSound()
        //     Notification.requestPermission()
        //     const img = "/vite.svg";
        //     const text = `HEY! Your task is now overdue.`;
        //     new Notification("To do list", { body: text, icon: img });
        // }
    }, [timeLeft])


    if (!user) {
        return {
            minutes: 0,
            seconds: 0,
            pause: () => {},
            reset: () => {}
        }
    }
    /** ========== JSX ========== **/
    return {
        minutes: Math.floor(timeLeft / MINUTE),
        seconds: Math.floor((timeLeft / SECOND) % 60),
        pause,
        reset
    }
}