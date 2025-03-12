import { useContext, useEffect } from 'react';
import socketService from '../services/socketService';
import { baseURL } from '../Network';
import { SafeData, SocketTimerInterface } from '../Interfaces';
import { UserContext } from '../Context';

export default function useSocket() {
    const [user, setUserLocal] = useContext(UserContext)

    if (user === undefined || user === null) {
        throw new Error("User is undefined or null")
    }

    /** ========== Functions ========== **/
    const emit = (user2?: SafeData) => {
        if (!user) { return }
        if (!user2) { user2 = user }
        console.log("About to update socket")
        socketService.sendMessage("update", {
            projects: user2.projects,
            logs: user2.logs,
            timerId: user2.timerId,
            paused: user2.paused,
            deadline: user2.deadline,
            duration: user2.duration,
            project: user2.project,
            description: user2.description,
            goal: user2.goal
        })
        return
    }

    /** ========== useEffects ========== **/
    useEffect(() => {
        console.log("Woah")
        const updateHandler = (timer: SocketTimerInterface) => {
            console.log("Socket triggered")
            if (!user) { return }
            socketService.connect(baseURL, user.token);
            setUserLocal({
                ...user,
                projects: timer.projects,
                logs: timer.logs, // Need this to have the LOGS SYNC!
                timerId: timer.timerId,
                paused: timer.paused,
                deadline: timer.deadline,
                duration: timer.duration,
                project: timer.project,
                description: timer.description,
                goal: timer.goal,
            })
            
            socketService.onMessage('update', updateHandler)
        }
        return () => {
            socketService.disconnect();
        };
    }, [user]);

    
    return {
        emit
    }
}
