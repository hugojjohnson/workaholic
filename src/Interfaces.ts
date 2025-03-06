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

export interface Project {
    name: string;
    colour: Colours
}

export type SafeData = {
    username: string;
    token: string;
    projects: Project[];
    logs: Log[];
    
    timerId?: string; // actually timeStarted
    paused?: string;
    deadline?: string;
    duration: number;
    project: Project;
    description: string;
    goal: number;
};
export type UserData = SafeData | null | undefined;
export type Safe = [SafeData, Dispatch<SetStateAction<SafeData>>]
export type User = [UserData, Dispatch<SetStateAction<UserData>>]

type RequestResponseSuccess<T> = {
    success: true;
    data: T;
    status: number;
};
type RequestResponseFailure = {
    success: false;
    data: string;
    status: number;
};
export type RequestResponse<T> = RequestResponseSuccess<T> | RequestResponseFailure;

export type SocketTimerInterface = {
    projects: Project[],
    timerId?: string; // actually timeStarted
    paused?: string;
    deadline?: string;
    duration: number;
    project: Project;
    description: string;
};

export type Colours = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "grey"
export enum BorderColours {
    red = "rgb(255, 99, 132)",
    orange = "rgb(255, 159, 64)",
    yellow = "rgb(255, 205, 86)",
    green = "rgb(75, 192, 192)",
    blue = "rgb(54, 162, 235)",
    purple = "rgb(153, 102, 255)",
    grey = "rgb(201, 203, 207)"
}
export enum BackgroundColours {
    red = "rgba(255, 99, 132, 0.5)",
    orange = "rgba(255, 159, 64, 0.5)",
    yellow = "rgba(255, 205, 86, 0.5)",
    green = "rgba(75, 192, 192, 0.5)",
    blue = "rgba(54, 162, 235, 0.5)",
    purple = "rgba(153, 102, 255, 0.5)",
    grey = "rgba(201, 203, 207, 0.5)",
}