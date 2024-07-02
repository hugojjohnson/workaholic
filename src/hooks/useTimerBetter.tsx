import { useState, useEffect } from "react";
import useSound from 'use-sound';
import alarm from "/alarm.wav";

const SECOND = 1_000;
const interval = SECOND;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function useTimerBetter() {
    const [playSound] = useSound(alarm)
    const [deadline, setDeadline] = useState(new Date())
    const [timeLeft, setTimeLeft] = useState(30000) // in milliseconds

    const [paused, setPaused] = useState(true)
    const [finished, setFinished] = useState(false)
    const [timeStarted, settimeStarted] = useState(undefined)

    useEffect(() => {
        let intervalId;
        if (!paused && !finished) {
            intervalId = setInterval(() => {
                setTimeLeft((new Date(deadline) - new Date()));
            }, interval);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [interval, paused, finished]);

    /* If the initial deadline value changes */
    useEffect(() => {
        setTimeLeft((new Date(deadline) - new Date()));
    }, [deadline]);

    const resetClock = (time) => {
        setPaused(true)
        setFinished(false)
        settimeStarted(undefined)
        setDeadline(new Date().setTime(new Date().getTime() + time * 60_000 + 1000))
    }

    const pressPause = () => {
        if (timeStarted === undefined) {
            settimeStarted(new Date())
        }
        if (paused) {
            setDeadline(new Date().setTime(new Date().getTime() + timeLeft))
        }
        setPaused(!paused)
    }

    // Check if the clock is paused
    useEffect(() => {
        const minutes = Math.floor((timeLeft / MINUTE))
        const seconds = Math.floor((timeLeft / SECOND) % 60)
        document.title = "Workaholic - " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        if (timeLeft < 1000 && !finished && timeStarted !== undefined) {
            setFinished(true)
            setTimeLeft(0)
            playSound()
            Notification.requestPermission()
            const img = "/vite.svg";
            const text = `HEY! Your task is now overdue.`;
            const notification = new Notification("To do list", { body: text, icon: img });
        }
    }, [timeLeft])

    return {
        minutes: Math.floor(timeLeft/ MINUTE),
        seconds: Math.floor((timeLeft/SECOND)%60),
        paused: paused,
        timeStarted,
        finished: finished,
        pressPause,
        resetClock
    }
}