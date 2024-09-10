import { Dispatch, SetStateAction } from "react";

export interface TimerInterface {
    minutes: number;
    seconds: number;
    init: () => void;
    pause: () => void;
    stop: (user2?: SafeData) => void;
}


export interface Log {
    _id: string,
    project: string;
    duration: number;
    description: string;
    timeStarted: Date;
    timeFinished: Date;
    user: string;
}

export type SafeData = {
    username: string;
    token: string;
    projects: string[];
    logs: Log[];
    
    timerId?: string; // actually timeStarted
    paused?: string;
    deadline?: string;
    duration: number;
    project: string;
};
export type UserData = SafeData | null | undefined;
export type Safe = [SafeData, Dispatch<SetStateAction<SafeData>>]
export type User = [UserData, Dispatch<SetStateAction<UserData>>]

type RequestResponseSuccess<T> = {
    success: true;
    data: T;
    status?: number;
};
type RequestResponseFailure = {
    success: false;
    data: string;
    status?: number;
};
export type RequestResponse<T> = RequestResponseSuccess<T> | RequestResponseFailure;

export type SocketTimerInterface = {
    projects: string[],
    timerId?: string; // actually timeStarted
    paused?: string;
    deadline?: string;
    duration: number;
    project: string;
};