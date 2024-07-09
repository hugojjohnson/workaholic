import { useContext } from 'react';
import { Safe } from '../Interfaces';
import { UserContext } from '../Context';

function useUser() {
    const userContext = useContext(UserContext);
    if (userContext[0] === null) {
        throw new Error('ERROR: User is null.');
    }
    if (userContext[0] === undefined) {
        throw new Error('ERROR: User isundefined.');
    }
    return userContext as Safe;
}

export default useUser;
