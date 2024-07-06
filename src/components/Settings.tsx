import { useContext, useState } from "react"
import { UserContext } from "../Context"
import { TimerInterface } from "../Interfaces"
import { post } from "../Network"


export default function Settings({ timer }: { timer: TimerInterface }) {

    const possibleDurations = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    const [duration, setDuration] = useState(30)
    const [user, setUser] = useContext(UserContext)
    const [projects, setProjects] = useState(user?.projects || [])
    const [uselessVar, setUselessVar] = useState(0) // Just here so I can trigger re-renders safely.

    const [newProject, setNewProject] = useState(projects[0] || "undefined")
    const [newDuration, setNewDuration] = useState(30)
    const [newDescription, setNewDescription] = useState("")
    const [newTimeStarted, setNewTimeStarted] = useState(new Date().toUTCString())

    const updateUser = async (myMins: number | null = null) => {
        let actualMins = duration // Updating the UI and the user doesn't happen the same frame so this is why we have this.
        if (myMins) {
            actualMins = myMins
        }
        if (user !== undefined && user !== null) {
            setUser({ ...user, duration: actualMins, projects: projects })
        }
        await post<unknown>("/update-projects-duration", { token: user?.token }, { projects: projects, duration: actualMins })
    }

    const addProject = async () => {
        const timeFinished = new Date(new Date(newTimeStarted).getTime() + 11 * 60_000 * 60 + duration * 60_000)
        const response = await post<string>("/add-log", { token: user?.token }, { log: {
            project: newProject, duration: newDuration, description: newDescription, timeStarted: new Date(new Date(newTimeStarted).getTime() + 11 * 60_000 * 60), timeFinished: timeFinished
        }})
        console.log(response)
    }


    const projectHTML = (index: number) => {
        return <div key={index} className="w-64 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md">
            <input className="mr-auto text-lg bg-transparent" value={projects[index]} onBlur={() => updateUser()} onChange={(e) => {
                const test = [...projects]
                test[index] = e.target.value
                setProjects(test)
            }} />
            <button className="w-7 h-7 text-sm rounded-sm bg-[#424242]" onClick={() => {
                user?.projects.splice(index, 1)
                setUselessVar(uselessVar + 1)
                updateUser()
            }}>X</button>
            {/* <button className="w-7 h-7 text-sm rounded-sm bg-[#424242]">✔</button> */}
        </div>
    }

    return <div className="px-7 md:px-32 pt-10">
        <h1 className="text-4xl mb-5">Settings</h1>
        <h3 className="text-2xl mb-3">Projects</h3>
        <div className="flex flex-col gap-3">
            {
                projects.map((_, index) => projectHTML(index))
            }
            <button className="w-10 h-10 self-start bg-[#323232] rounded-md" onClick={() => {
                projects.push("")
                setUselessVar(uselessVar + 1)
                updateUser()
            }}>+</button>
        </div>

        <h3 className="text-2xl mb-3 mt-6">Study Timer</h3>
        <select className="w-64 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={user?.duration + " minutes"} onChange={(e) => {
            const myMins = parseInt(e.target.value.substring(0, e.target.value.indexOf(" minutes"))) || -1
            setDuration(myMins)
            updateUser(myMins)
            timer.resetClock(myMins)
        }}>
            {
                possibleDurations.map((duration, index) => <option key={index}>{duration} minutes</option>)
            }
        </select>

        <h3 className="text-2xl mb-3 mt-6">Add log</h3>

        <p className="mt-2">Project</p>
        <select className="w-80 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newProject} onChange={(e) => setNewProject(e.target.value)}>
        {
            projects.map((_, index) => <option key={index}>{projects[index]}</option>)
        }
        </select>

        <p className="mt-2">Duration</p>
        <select className="w-80 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newDuration + " minutes"} onChange={(e) => {
            const myMins = parseInt(e.target.value.substring(0, e.target.value.indexOf(" minutes"))) || -1
            console.log(myMins)
            setNewDuration(myMins)
        }}>
            { possibleDurations.map((duration, index) => <option key={index}>{duration} minutes</option>) }
        </select>

        <p className="mt-2">Description</p>
        <input className="w-80 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={newDescription} onChange={e => setNewDescription(e.target.value)} />

        <p className="mt-2">Time started</p>
        <input className="w-80 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" type="datetime-local" value={newTimeStarted} onChange={e => setNewTimeStarted(e.target.value)} />


        <button className="border-2 border-white rounded-md py-1 px-2 mt-5" onClick={addProject}>Add</button>
    </div>
}