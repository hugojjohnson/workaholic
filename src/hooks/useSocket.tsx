import { useEffect } from 'react';
import socketService from '../services/socketService';
import { baseURL } from '../Network';
import { SafeData, SocketTimerInterface } from '../Interfaces';
import useUser from './useUser';

export default function useSocket() {
    const [user, setUser] = useUser()

    /** ========== Functions ========== **/
    const emit = (user2?: SafeData) => {
        if (!user2) { user2 = user }
        socketService.sendMessage("update", {
            projects: user2.projects,
            timerId: user2.timerId,
            paused: user2.paused,
            deadline: user2.deadline,
            duration: user2.duration,
            project: user2.project,
            description: user2.description
        })
        return
    }

    /** ========== useEffects ========== **/
    useEffect(() => {
        socketService.connect(baseURL, user.token);
        socketService.onMessage('update', (timer: SocketTimerInterface) => {
            setUser({
                ...user,
                projects: timer.projects,
                timerId: timer.timerId,
                paused: timer.paused,
                deadline: timer.deadline,
                project: timer.project,
                duration: timer.duration,
                description: timer.description
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
