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

export type UserData = {
    username: string;
    // email: string;
    token: string;

    projects: string[];
    logs: Log[];
    
    duration: number;
    project: string;
} | null | undefined;


export type User = [UserData, Dispatch<SetStateAction<UserData>>]

export interface requestResponse<T> {
    success: boolean;
    data: T | string;
}