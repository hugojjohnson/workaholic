"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useLogs } from "~/hooks/LogsContext";
import { useUser } from "~/hooks/useUser";
import { useTimer } from "~/hooks/TimerContext";

export default function Dashboard() {
    const logs = useLogs();
    const user = useUser();
    const timer = useTimer();
    if (!timer.timer) {
        return <p>loading</p>;
    }
    return (
        <div className="flex flex-col gap-8 items-center justify-center max-w-screen-sm mx-auto pt-10 top-20 md:top-0 w-screen fixed md:static">
            {/* Project & Duration Selectors */}
            <div className="flex flex-row gap-4 mx-5 lg:mx-0">
                <Select
                    value={timer.timer.id}
                    // onValueChange={(val) =>
                    //     setUser({ ...user, project: { name: val, colour: "red" } })
                    // }
                    // className="w-64"
                >
                    <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                        {user.subjects.map((s, i) => <SelectItem key={i} value={s.name}>
                                {s.name}
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>

                <Select
                    value={`${timer.timer.duration} min`}
                    // onValueChange={(val) => {
                    //     const newUser = structuredClone(user);
                    //     newUser.duration = parseInt(val.split(" ")[0]) || -1;
                    //     timer.stop(newUser);
                    // }}
                    // className="w-24"
                >
                    <SelectTrigger className="text-lg">
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
            <div className="relative flex flex-row gap-3 justify-center items-center">
                <p className="text-8xl font-mono text-white">
                    {`${timer.minutesLeft}:${timer.secondsLeft.toString().padStart(2, "0")}`}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    className="absolute ml-[320px] mt-9 rounded-full w-10 h-10"
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
                    className="bg-[#323232] text-lg rounded-md"
                    value=""
                    // value={description}
                    // onChange={(e) => setDescription(e.target.value)}
                    // onBlur={(e) =>
                    //     setUser({ ...user, description: e.target.value })
                    // }
                    placeholder="Describe your progress..."
                />
            </div>

            {/* Pause/Start Button */}
            <p>{timer.status}</p>
            <Button
                className="w-28 text-lg rounded-md"
                variant={
                    timer.paused && timer.timer.startedAt !== undefined
                        ? "secondary"
                        : "default"
                }
                onClick={() => timer.pause()}
                // disabled={timer.paused && timer.timer.id !== undefined}
            >
                {timer.paused && timer.timer.startedAt !== undefined ? "Pause" : "Start"}
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