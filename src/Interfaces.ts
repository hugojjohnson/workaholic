import { Dispatch, SetStateAction } from "react";

export interface TimerInterface {
    minutes: number;
    seconds: number;
    paused: boolean;
    timeStarted: Date | undefined;
    finished: boolean;
    pressPause: () => void;
    resetClock: (time: number) => void;
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
    // email: string;
    token: string;

    projects: string[];
    logs: Log[];
    
    duration: number;
    project: string;
};
export type UserData = SafeData | null | undefined;

export type Safe = [SafeData, Dispatch<SetStateAction<SafeData>>]
export type User = [UserData, Dispatch<SetStateAction<UserData>>]

export interface requestResponse<T> {
    success: boolean;
    data: T | string;
}