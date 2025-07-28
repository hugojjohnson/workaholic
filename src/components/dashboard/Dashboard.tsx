"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useLogs } from "~/hooks/LogsContext";
import { useTimer } from "~/hooks/TimerContext";
import { useState } from "react";
import { useUser } from "~/hooks/UserContext";

export default function Dashboard() {
    const logs = useLogs();
    const user = useUser();
    const timer = useTimer();
    const [description, setDescription] = useState<string>(timer.timer?.description ?? "");

    if (!user.user) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex flex-col gap-8 items-center justify-center max-w-screen-sm mx-auto pt-28 top-20 md:top-0 w-screen fixed md:static">
            {/* Project & Duration Selectors */}
            <div className="flex flex-row gap-4 mx-5 lg:mx-0">
                <Select
                    value={timer.timer?.subjectId ?? ""}
                    onValueChange={(subjectId) => {
                        timer.onUpdateTimerInfo({ subjectId });
                    }}
                >
                    <SelectTrigger className="text-lg w-64 relative">
                        <span className="ml-32"></span> {/* To move the chevron to the other side */}
                        <span className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
                            <SelectValue placeholder="Select project" />
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        {user.user.subjects.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                                {s.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


                <Select
                    value={`${timer.timer?.duration ? timer.timer.duration : "--"} min`}
                    onValueChange={(val) => {
                        const first = val?.split(" ")[0];
                        const n = first ? parseInt(first, 10) : null;
                        const duration = Number.isNaN(n) ? null : n;

                        if (!duration) {
                            throw new Error("time is not valid.");
                        }
                        timer.onUpdateTimerInfo({ duration });
                    }}
                >
                    <SelectTrigger className="text-lg w-28">
                        <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((dur) => (
                            <SelectItem key={dur} value={`${dur} min`}>
                                {dur} min
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Timer Display & Stop Button */}
            <div className="relative flex flex-row gap-3">
                <p className="text-8xl font-mono dark:text-white w-[500px] text-center">
                    {timer.isLoading
                        ? "--:--"
                        : `${timer.minutesLeft}:${timer.secondsLeft.toString().padStart(2, "0")}`}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-10 mt-9 rounded-full w-10 h-10"
                    onClick={() => timer.stop()}
                    disabled={timer.disabled}
                >
                    X
                </Button>
            </div>

            {/* Description Input */}
            <div className="w-full max-w-screen-sm px-5">
                <p className="text-sm text-gray-400 mb-1">I made progress on</p>
                <Input
                    className="dark:bg-[#323232] text-lg rounded-md"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={(e) => timer.onUpdateTimerInfo({ description })}
                    placeholder="Describe your progress..."
                />
            </div>

            {/* Pause/Start Button */}
            <Button
                className="w-28 text-lg rounded-md"
                variant={
                    timer.paused && timer.timer?.startedAt !== undefined
                        ? "secondary"
                        : "default"
                }
                onClick={() => timer.pause()}
            // disabled={timer.paused && timer.timer.id !== undefined}
            >
                {timer.paused && timer.timer?.startedAt !== undefined ? "Pause" : "Start"}
            </Button>

            {/* Hours Studied */}
            <div className="text-center">
                <h1 className="text-xl font-semibold mb-1">Hours studied today</h1>
                <p className="text-2xl text-red-400 font-mono">
                    0h 0min
                    {/* {timeStudiedToday[0]}h {timeStudiedToday[1]}min */}
                </p>
            </div>

            {/* Confetti */}
            {/* <img
                className={`fixed top-0 left-0 transition-all duration-50 ${confetti ? "h-full w-full" : "h-0 w-0"
                    }`}
                src="/confetti.gif"
                alt="confetti"
            /> */}
        </div>
    );
}