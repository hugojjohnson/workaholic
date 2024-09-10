import React, { useEffect, useState } from "react";
// import { post } from "../Network";
import { Log } from "../Interfaces";
import useUser from "../hooks/useUser";
import useTimer from "../hooks/useTimer";

export default function Dashboard(): React.ReactElement {
    const timer = useTimer()
    const [user, setUser] = useUser()
    const [description, setDescription] = useState("")
    const [confetti] = useState(false)

    const today = new Date()
    const logsForToday = user.logs.filter(log =>
        new Date(log.timeStarted).getFullYear() === today.getFullYear() &&
        new Date(log.timeStarted).getMonth() === today.getMonth() &&
        new Date(log.timeStarted).getDate() === today.getDate()
    );
    let minutesStudiedToday = 0;
    for (const idk of logsForToday) { minutesStudiedToday += idk.duration }
    
    
    /** ========== JSX ========== **/
    return <div className="flex flex-col gap-8 items-center max-w-screen-sm mx-auto">
        <select className="p-3 bg-transparent border-2 border-white rounded-md text-center" value={user.project} onChange={(e) => setUser({ ...user, project: e.target.value })}>
            { user.projects.map((projec, index) => <option key={index}>{projec}</option>) }
        </select>
        <div className="flex flex-row gap-3 justify-center">
            {timer.minutes === 11570 ? <p className="text-8xl">--:--</p>
            : <p className="text-8xl">{timer.minutes}:{timer.seconds > 9 ? timer.seconds : ("0" + timer.seconds)}</p>}
            <button className={`absolute ml-[320px] mt-9 rounded-full border-2 ${user.timerId ? "border-white text-white" : "border-gray-500 text-gray-500"} w-10 h-10`} onClick={() => timer.stop()}>X</button>
        </div>
        <div className="w-full max-w-screen-sm px-5">
            <p className="text-sm text-gray-400">I made progress on</p>
            <input className="w-full px-3 py-1 text-lg border-[1px] border-white bg-transparent rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <button className={`w-30 w-28 px-4 py-2 text-lg border-[1px] ${user.paused === undefined && user.timerId !== undefined ? "border-gray-500 text-gray-500" : "border-white"} rounded-md`} onClick={() => timer.pause()}>{user.paused === undefined && user.timerId !== undefined ? "Pause" : "Start"}</button>

        <div>
            <h1>Hours studied today</h1>
            <p className="self-center text-center text-2xl text-red-300">{Math.floor(minutesStudiedToday / 60)}h {minutesStudiedToday % 60}min</p>
        </div>
        <img className={`fixed ${confetti ? "h-full w-full top-0" : "h-0 w-0"} transition-all duration-50`} src={"/confetti.gif"} alt="confetti" />
    </div>
}