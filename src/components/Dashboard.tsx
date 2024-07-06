import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context";
import { post } from "../Network";
import { Log, TimerInterface } from "../Interfaces";

export default function Dashboard({ timer }: { timer: TimerInterface}): React.ReactElement {
    const [user, setUser] = useContext(UserContext)
    const [description, setDescription] = useState("")
    const [confetti, setConfetti] = useState(false)

    const today = new Date()
    const test: Log[] = user?.logs.map(idk => {
        idk.timeStarted = new Date(idk.timeStarted)
        idk.timeFinished = new Date(idk.timeFinished)
        return idk
    }) || []
    const logsForToday = test.filter(log =>
        log.timeStarted.getFullYear() === today.getFullYear() &&
        log.timeStarted.getMonth() === today.getMonth() &&
        log.timeStarted.getDate() === today.getDate()
    ) || [];
    let minutesStudiedToday = 0;
    for (const idk of logsForToday) { minutesStudiedToday += idk.duration }


    useEffect(() => {
        timer.resetClock(user?.duration || 0)
    }, [user])

    useEffect(() => {
        if (timer.finished) {
            sendLog()
        }
    }, [timer])

    const sendLog = async () => {
        const newLog = {
            project: user?.project || "Undefined",
            duration: user?.duration || 30,
            description: description,
            timeStarted: timer.timeStarted,
            timeFinished: new Date()
        }
        const response = await post<Log>("add-log", { token: user?.token }, { log: newLog })

        if (typeof response.data !== "string") {
            timer.resetClock(user?.duration || 0)
            setDescription("")
            setConfetti(true)
            setTimeout(() => {
                setConfetti(false);
            }, 1500);
            user?.logs.push(response.data)
        }
    }

    return <div className="flex flex-col gap-8 items-center max-w-screen-sm mx-auto">
        <select className="p-3 bg-transparent border-2 border-white rounded-md text-center" value={user?.project} onChange={(e) => {
            if (user !== undefined && user !== null) {
                setUser({ ...user, project: e.target.value })
            }
        }}>
            {
                user?.projects.map((projec, index) => <option key={index}>{projec}</option>)
            }
        </select>
        <div className="flex flex-row gap-3 justify-center">
            <p className="text-8xl">{timer.minutes}:{timer.seconds > 9 ? timer.seconds : ("0" + timer.seconds)}</p>
        </div>
        <div className="w-full max-w-screen-sm px-5">
            <p className="text-sm text-gray-400">I made progress on</p>
            <input className="w-full px-3 py-1 text-lg border-[1px] border-white bg-transparent rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <button className={`w-30 w-28 px-4 py-2 text-lg border-[1px] ${!timer.paused ? "border-gray-500 text-gray-500" : "border-white"} rounded-md`} onClick={() => timer.pressPause()}>{timer.paused ? "Start" : "Pause"}</button>


        <div>
            <h1>Hours studied today</h1>
            <p className="self-center text-center text-2xl text-red-300">{Math.floor(minutesStudiedToday / 60)}h {minutesStudiedToday % 60}min</p>
        </div>
        <img className={`fixed ${confetti ? "h-full w-full top-0" : "h-0 w-0"} transition-all duration-50`} src={"/confetti.gif"} alt="confetti" />
    </div>
}