import { useState } from "react"
import { post } from "../Network"
import useUser from "../hooks/useUser"
import { Colours, Log } from "../Interfaces"
import ColourPicker from "./charts/ColourPicker"


export default function Settings() {
    const [user, setUser, setUserLocal] = useUser()

    const [newProject, setNewProject] = useState(user.projects[0])
    const [newDuration, setNewDuration] = useState(30)
    const [newDescription, setNewDescription] = useState("")
    const [newTimeStarted, setNewTimeStarted] = useState(new Date().toISOString().slice(0, 16))

    const addLog = async () => {
        const timeFinished = new Date(new Date(newTimeStarted).getTime() + user.duration * 60_000)
        const response = await post<Log>("/add-log", { token: user.token }, {
            log: {
                project: newProject.name, duration: newDuration, description: newDescription, timeStarted: new Date(newTimeStarted), timeFinished: timeFinished
            }
        })
        if (response.success) {
            const user2 = structuredClone(user)
            user2.logs.push(response.data)
            setUser(user2)
        }
    }


    /** ========== JSX ========== **/
    const projectHTML = (index: number) => {
        return <div key={index} className="w-full lg:w-96 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md">
            <input className="text-lg bg-transparent w-20" value={user.projects[index].name} onBlur={() => setUser(user)} onChange={(e) => {
                const user2 = [...user.projects]
                user2[index].name = e.target.value
                setUserLocal({ ...user, projects: user2 })
            }} />
            <div className="flex flex-row items-center gap-5 ml-auto">
                <ColourPicker start={user.projects[index].colour} callback={(colour: Colours) => {
                    const user2 = structuredClone(user)
                    user2.projects[index].colour = colour
                    setUser({ ...user, projects: user2.projects })
                }}/>
                <button className="w-7 h-7 text-sm rounded-sm bg-[#424242]" onClick={() => {
                    const user2 = structuredClone(user)
                    user2.projects.splice(index, 1)
                    setUser(user2)
                }}>X</button>
            </div>
        </div>
    }

    const logHTML = (log: Log) => {
        return <div key={log._id} className="w-64 p-2 outline-dashed outline-2 rounded-md relative">
            <h1 className="text-xl">{log.project}</h1>
            <p className="text-gray-400">{new Date(log.timeStarted).toLocaleString().slice(0, -3)}-{new Date(new Date(log.timeStarted).getTime() + log.duration * 60_000).toLocaleString().slice(-8, -3)}</p>
            <p className="text-gray-200 absolute top-2 right-3 italic">{log.duration} minutes</p>
            <p className="text-sm mt-2">{log.description}</p>
        </div>
    }

    return <div className="px-7 lg:px-32 pt-10">
        <h1 className="text-4xl mb-5">Settings</h1>
        <div className="flex flex-col lg:flex-row justify-between">
            <div>
                <h3 className="text-2xl mb-3">Projects</h3>
                <div className="flex flex-col gap-3">
                    {
                        user.projects.map((_, index) => projectHTML(index))
                    }
                    <button className="w-10 h-10 self-start bg-[#323232] rounded-md" onClick={() => {
                        const user2 = structuredClone(user)
                        user2.projects.push({ name: "Default", colour: "red" })
                        setUser(user2)
                    }}>+</button>
                </div>

                <h3 className="text-2xl mb-3 mt-10">Daily goal (hours)</h3>
                <input type="number" className=" w-full lg:2-96 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md" defaultValue={user.goal} onBlur={e => setUser({ ...user, goal: parseFloat(e.target.value) })} />

                <div className="rounded-md outline-dashed outline-2 lg:pl-6 lg:w-[512px] px-3 py-4 mb-3 mt-12 md:mt-24">
                    <h3 className="text-2xl">Add log</h3>

                    <p className="mt-2">Project</p>
                    <select className="w-full p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newProject.name} onChange={(e) => setNewProject({ name: e.target.value, colour: "red" })}>
                        {
                            user.projects.map((_, index) => <option key={index}>{user.projects[index].name}</option>)
                        }
                    </select>

                    <p className="mt-2">Duration</p>
                    <select className="w-full p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newDuration + " minutes"} onChange={(e) => {
                        const myMins = parseInt(e.target.value.substring(0, e.target.value.indexOf(" minutes"))) || -1
                        setNewDuration(myMins)
                    }}>
                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((duration, index) => <option key={index}>{duration} minutes</option>)}
                    </select>

                    <p className="mt-2">Description</p>
                    <input className="w-full p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newDescription} onChange={e => setNewDescription(e.target.value)} />

                    <p className="mt-2">Time started</p>
                    <input className="w-full p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" type="datetime-local" value={newTimeStarted} onChange={e => { setNewTimeStarted(e.target.value) }} />

                    <button className="border-2 border-white rounded-md py-1 px-2 mt-5" onClick={addLog}>Add</button>
                </div>
            </div>
            
            {/* Past logs */}
            <div className="w-1/3 pr-32">
                <h1 className="text-2xl my-8 lg:mt-0">Logs</h1>
                <div className="flex flex-col gap-7 w-full">
                    {
                        user.logs.sort((l1, l2) => new Date(l1.timeStarted) > new Date(l2.timeStarted) ? -1 : 1).slice(0, Math.min(user.logs.length, 5)).map(log => logHTML(log))
                    }
                </div>
            </div>
        </div>
    </div>
}