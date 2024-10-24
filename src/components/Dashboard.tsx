import React, { useState } from "react";
import useUser from "../hooks/useUser";
import useTimer from "../hooks/useTimer";
import useSocket from "../hooks/useSocket";

export default function Dashboard(): React.ReactElement {
    const timer = useTimer()
    const socket = useSocket()
    const [user, setUser] = useUser()
    const [confetti] = useState(false)

    const today = new Date()

    /** ========== Functions ========== **/
    const logsForToday = user.logs.filter(log =>
        new Date(log.timeStarted).getFullYear() === today.getFullYear() &&
        new Date(log.timeStarted).getMonth() === today.getMonth() &&
        new Date(log.timeStarted).getDate() === today.getDate()
    );
    let minutesStudiedToday = 0;
    for (const idk of logsForToday) { minutesStudiedToday += idk.duration }
    
    /** ========== JSX ========== **/
    return <div className="flex flex-col gap-8 items-center justify-center max-w-screen-sm mx-auto mt-10">
        <div className="flex flex-row gap-2">
            <select className="w-64 p-2 flex flex-row items-center gap-2 rounded-md text-lg text-center border-[0.5px] border-white bg-transparent" value={user.project} onChange={(e) => { socket.emit({ ...user, project: e.target.value }); setUser({ ...user, project: e.target.value })} }>
                { user.projects.map((projec, index) => <option key={index}>{projec}</option>) }
            </select>
            <select className="w-24 p-2 flex flex-row items-center gap-2 rounded-md text-lg border-[0.5px] border-white bg-transparent" value={user.duration + " min"} onChange={(e) => {
                const user2 = structuredClone(user)
                user2.duration = parseInt(e.target.value.substring(0, e.target.value.indexOf(" min"))) || -1
                timer.stop(user2)
            }}>
                { [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((duration, index) => <option key={index}>{duration} min</option>) }
            </select>
        </div>
        <div className="flex flex-row gap-3 justify-center">
            {timer.minutes === 11570 ? <p className="text-8xl">--:--</p>
            : <p className="text-8xl">{timer.minutes}:{timer.seconds > 9 ? timer.seconds : ("0" + timer.seconds)}</p>}
            <button className={`absolute ml-[320px] mt-9 rounded-full border-2 ${user.timerId ? "border-white text-white" : "border-gray-500 text-gray-500"} w-10 h-10`} onClick={() => timer.stop()}>X</button>
        </div>
        <div className="w-full max-w-screen-sm px-5">
            <p className="text-sm text-gray-400">I made progress on</p>
            {/* className="w-full px-3 py-1 text-lg border-[1px] border-white bg-transparent rounded-md" */}
            <input className="w-full p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={user.description} onChange={(e) => setUser({ ...user, description: e.target.value })} onBlur={e => socket.emit({ ...user, description: e.target.value })} />
        </div>

        <button className={`w-30 w-28 px-4 py-2 text-lg border-[1px] ${user.paused === undefined && user.timerId !== undefined ? "border-gray-500 text-gray-500" : "border-white"} rounded-md`} onClick={() => timer.pause()}>{user.paused === undefined && user.timerId !== undefined ? "Pause" : "Start"}</button>

        <div>
            <h1>Hours studied today</h1>
            <p className="self-center text-center text-2xl text-red-300">{Math.floor(minutesStudiedToday / 60)}h {minutesStudiedToday % 60}min</p>
        </div>

        <img className={`fixed ${confetti ? "h-full w-full top-0" : "h-0 w-0"} transition-all duration-50`} src={"/confetti.gif"} alt="confetti" />
    </div>
}