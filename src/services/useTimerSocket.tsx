import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import socketService from './socketService';
import { baseURL } from '../Network';
import useSound from 'use-sound';
import alarm from "/alarm.wav";
import { SocketTimerInterface } from '../Interfaces';
import { UserData } from '../Interfaces';
import { UserContext } from '../Context';

const SECOND = 1_000;
const MINUTE = SECOND * 60;

export default function useTimerSocket({ user, setUser }: { user: NonNullable<UserData>, setUser: Dispatch<SetStateAction<UserData>> }) {
    // const [user, setUser] = useContext(UserContext)
    const [playSound] = useSound(alarm)
    const [timeLeft, setTimeLeft] = useState(42000) // in milliseconds

    // useEffect(() => {
    //     socketService.connect(baseURL);
    //     socketService.onMessage('changeTimer', (timer: SocketTimerInterface) => {
    //         if (user) {
    //             setUser({
    //                 ...user,
    //                 timeStarted: timer.timeStarted || undefined,
    //                 paused: timer.paused || undefined,
    //                 deadline: timer.deadline || undefined,
    //                 project: timer.project || "",
    //                 duration: timer.duration || 0,
    //             })
    //         }
    //     });
    //     return () => {
    //         socketService.disconnect();
    //     };
    // }, []);


    // Every second.
    useEffect(() => {
        let intervalId: number;
        if (user.deadline !== undefined && user.paused === undefined) {
            intervalId = setInterval(() => {
                setTimeLeft((new Date(user.deadline).getTime() - new Date().getTime()));
            }, SECOND);
        }

        const minutes = Math.floor((timeLeft / MINUTE))
        const seconds = Math.floor((timeLeft / SECOND) % 60)
        document.title = "Workaholic - " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        if (timeLeft < 1000 && user?.deadline !== undefined && user.timeStarted !== undefined) {
            setTimeLeft(0)
            playSound()
            Notification.requestPermission()
            const img = "/vite.svg";
            const text = `HEY! Your task is now overdue.`;
            new Notification("To do list", { body: text, icon: img });
            // Make socket request
        }
        return () => clearInterval(intervalId);
    }, [user, timeLeft]);


    const togglePause = () => {
        if (user.timeStarted === undefined) {
            const user2 = structuredClone(user)
            user2.timeStarted = new Date().toISOString()
            user2.paused = undefined
            user2.deadline = new Date(new Date().getTime() + (user2.duration * 60_000)).toISOString()
            setUser(user2)
            return
        }

        if (user.paused === undefined) {
            const user2 = structuredClone(user)
            user2.paused = new Date().toISOString()
            setUser(user2)
        } else {
            if (user === undefined || user.deadline === undefined) { console.error("User or deadline is undefined."); return;
            } else {
                const timeLeftYay: number = new Date(user.deadline).getTime() - new Date(user.paused).getTime()
                const user2 = structuredClone(user)
                user2.deadline = new Date(new Date().getTime() + timeLeftYay).toISOString()
                user2.paused = undefined
                setUser(user2)
            }
        }
    }

    const init = () => {
        if (user) {
            setTimeLeft(user?.duration * 60_000 || 42 * 60_000)
        }
    }

    const reset = () => {
        if (user) {
            setUser({
                ...user,
                timeStarted: undefined,
                paused: undefined,
                deadline: undefined
            })
        }
    }

    return {
        minutes: user?.paused === undefined ? Math.floor(timeLeft / MINUTE) : Math.floor((new Date(user.deadline).getTime() - new Date().getTime())/60_000),
        seconds: user?.paused === undefined ? Math.floor((timeLeft / SECOND) % 60) : Math.floor((new Date(user.deadline).getTime() - new Date().getTime())/1_000 % 60),
        paused: user?.paused === undefined ? false : true,
        togglePause,
        reset,
        init
    }
}
