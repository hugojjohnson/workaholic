import { useState } from "react"
import { post } from "../Network"
import useUser from "../hooks/useUser"
import useTimer from "../hooks/useTimer"
import { Log } from "../Interfaces"


export default function Settings() {
    const [user, setUser] = useUser()
    const timer = useTimer()

    const [newProject, setNewProject] = useState(user.projects[0] || "undefined")
    const [newDuration, setNewDuration] = useState(30)
    const [newDescription, setNewDescription] = useState("")
    const [newTimeStarted, setNewTimeStarted] = useState(new Date().toISOString().slice(0, 16))
    // const [viewingLogs, setViewingLogs] = useState(false)
    console.log(newTimeStarted)

    /** ========== Functions ========== **/
    const updateUser = async (projects: string[]) => {
        console.log(projects)
        const user2 = structuredClone(user)
        if (projects) {
            user2.projects = projects
        }
        timer.stop(user2)
        const response = await post<string>("/update-projects", { token: user.token }, { projects: projects })
        if (!response.success) {
            console.error(response.data)
        }
    }

    const addLog = async () => {
        const timeFinished = new Date(new Date(newTimeStarted).getTime() + user.duration * 60_000)
        await post<string>("/add-log", { token: user.token }, {
            log: {
                project: newProject, duration: newDuration, description: newDescription, timeStarted: new Date(newTimeStarted), timeFinished: timeFinished
            }
        })
    }


    /** ========== JSX ========== **/
    const projectHTML = (index: number) => {
        return <div key={index} className="w-64 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md">
            <input className="mr-auto text-lg bg-transparent" value={user.projects[index]} onBlur={() => updateUser(user.projects)} onChange={(e) => {
                const test = [...user.projects]
                test[index] = e.target.value
                setUser({ ...user, projects: test })
            }} />
            <button className="w-7 h-7 text-sm rounded-sm bg-[#424242]" onClick={() => {
                const user2 = structuredClone(user)
                user2.projects.splice(index, 1)
                setUser(user2)
            }}>X</button>
        </div>
    }

    const logHTML = (log: Log) => {
        return <div className="p-2 outline-dashed outline-2 rounded-md">
            <h1 className="text-xl">{log.project}</h1>
            <p className="text-gray-400">{new Date(log.timeStarted).toLocaleString().slice(0, -3)}</p>
            <p className="text-sm mt-2">{log.description}</p>
        </div>
    }

    return <div className="px-7 md:px-32 pt-10">
        <h1 className="text-4xl mb-5">Settings</h1>
        <div className="flex flex-row justify-between">
            <div>
                <h3 className="text-2xl mb-3">Projects</h3>
                <div className="flex flex-col gap-3">
                    {
                        user.projects.map((_, index) => projectHTML(index))
                    }
                    <button className="w-10 h-10 self-start bg-[#323232] rounded-md" onClick={() => {
                        const user2 = structuredClone(user)
                        user2.projects.push("")
                        setUser(user2)
                    }}>+</button>
                </div>

                <div className="rounded-md outline-dashed outline-2 w-fit pl-6 pr-32 py-4 mb-3 mt-24">
                    <h3 className="text-2xl">Add log</h3>

                    <p className="mt-2">Project</p>
                    <select className="w-80 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newProject} onChange={(e) => setNewProject(e.target.value)}>
                        {
                            user.projects.map((_, index) => <option key={index}>{user.projects[index]}</option>)
                        }
                    </select>

                    <p className="mt-2">Duration</p>
                    <select className="w-80 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newDuration + " minutes"} onChange={(e) => {
                        const myMins = parseInt(e.target.value.substring(0, e.target.value.indexOf(" minutes"))) || -1
                        setNewDuration(myMins)
                    }}>
                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((duration, index) => <option key={index}>{duration} minutes</option>)}
                    </select>

                    <p className="mt-2">Description</p>
                    <input className="w-80 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newDescription} onChange={e => setNewDescription(e.target.value)} />

                    <p className="mt-2">Time started</p>
                    <input className="w-80 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" type="datetime-local" value={newTimeStarted} onChange={e => { setNewTimeStarted(e.target.value); console.log(e.target.value) }} />


                    <button className="border-2 border-white rounded-md py-1 px-2 mt-5" onClick={addLog}>Add</button>
                </div>
            </div>
            
            {/* Past logs */}
            <div className="w-1/3 pr-32">
                <h1 className="text-2xl mb-3">Logs</h1>
                <div className="flex flex-col gap-7">
                    {
                        user.logs.slice(0, Math.min(user.logs.length, 5)).map(log => logHTML(log))
                    }
                </div>
            </div>
        </div>
    </div>
}