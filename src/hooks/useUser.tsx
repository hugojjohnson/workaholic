import { useContext } from 'react';
import { Safe, SafeData } from '../Interfaces';
import { UserContext } from '../Context';
import useSocket from './useSocket';
import { post } from '../Network';

function useUser() {
    const userContext = useContext(UserContext);
    const socket = useSocket()

    if (userContext[0] === null) {
        throw new Error('ERROR: User is null.');
    }
    if (userContext[0] === undefined) {
        throw new Error('ERROR: User isundefined.');
    }

    const modifyUser = async (user2: SafeData) => {
        if (user2 == null || user2 == undefined) {
            return
        }
        const response = await post("users/update-user", { token: user2.token }, {
            projects: user2.projects,
            timerId: user2.timerId,
            paused: user2.paused,
            deadline: user2.deadline,
            duration: user2.duration,
            project: user2.project,
            description: user2.description,
            goal: user2.goal,
        })
        if (!response.success) {
            console.error(response.data)
            return false
        }
        socket.emit(user2)
        userContext[1](user2)

    }
    return [userContext[0], modifyUser, userContext[1]] as Safe;
}

export default useUser;