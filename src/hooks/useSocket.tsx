import { useContext, useEffect } from 'react';
import socketService from '../services/socketService';
import { baseURL } from '../Network';
import { SafeData, SocketTimerInterface } from '../Interfaces';
import { UserContext } from '../Context';

export default function useSocket() {
    const [user, setUser] = useContext(UserContext)

    if (user === undefined || user === null) {
        throw new Error("User is undefined or null")
    }

    /** ========== Functions ========== **/
    const emit = (user2?: SafeData) => {
        if (!user) { return }
        if (!user2) { user2 = user }
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
        if (!user) { return }
        socketService.connect(baseURL, user.token);
        socketService.onMessage('update', (timer: SocketTimerInterface) => {
            setUser({
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
        });
        return () => {
            socketService.disconnect();
        };
    }, []);

    
    return {
        emit
    }
}
