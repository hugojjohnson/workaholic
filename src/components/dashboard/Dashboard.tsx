import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useLogs } from "~/hooks/LogsContext";
import { useUser } from "~/hooks/useUser";

export default function Dashboard() {
    const logs = useLogs();
    const user = useUser();
    return (
        <div className="flex flex-col gap-8 items-center justify-center max-w-screen-sm mx-auto mt-10 top-20 md:top-0 w-screen fixed md:static">
            {/* Project & Duration Selectors */}
            <div className="flex flex-row gap-4 mx-5 lg:mx-0">
                <Select
                    value={user.project.name}
                    onValueChange={(val) =>
                        setUser({ ...user, project: { name: val, colour: "red" } })
                    }
                    className="w-64"
                >
                    <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                        {user.projects.map((projec, idx) => (
                            <SelectItem key={idx} value={projec.name}>
                                {projec.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={`${user.duration} min`}
                    onValueChange={(val) => {
                        const newUser = structuredClone(user);
                        newUser.duration = parseInt(val.split(" ")[0]) || -1;
                        timer.stop(newUser);
                    }}
                    className="w-24"
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
                <p className="text-8xl font-mono">
                    {timer.minutes === 11570
                        ? "--:--"
                        : `${timer.minutes}:${timer.seconds.toString().padStart(2, "0")}`}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    className="absolute ml-[320px] mt-9 rounded-full w-10 h-10"
                    onClick={() => timer.stop()}
                    disabled={!user.timerId}
                >
                    X
                </Button>
            </div>

            {/* Description Input */}
            <div className="w-full max-w-screen-sm px-5">
                <p className="text-sm text-gray-400 mb-1">I made progress on</p>
                <Input
                    className="bg-[#323232] text-lg rounded-md"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={(e) =>
                        setUser({ ...user, description: e.target.value })
                    }
                    placeholder="Describe your progress..."
                />
            </div>

            {/* Pause/Start Button */}
            <Button
                className="w-28 text-lg rounded-md"
                variant={
                    user.paused === undefined && user.timerId !== undefined
                        ? "secondary"
                        : "default"
                }
                onClick={() => timer.pause(structuredClone(user))}
                disabled={user.paused === undefined && user.timerId !== undefined}
            >
                {user.paused === undefined && user.timerId !== undefined ? "Pause" : "Start"}
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