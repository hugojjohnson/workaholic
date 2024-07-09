import { useContext } from 'react';
import { Safe } from '../Interfaces';
import { UserContext } from '../Context';

function useUser() {
    const userContext = useContext(UserContext);
    if (!userContext[0]) {
        throw new Error('ERROR: User is null or undefined.');
    }
    return userContext as Safe;
}

export default useUser;
