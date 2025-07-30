"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useLogs } from "~/hooks/LogsContext";
import { useTimer } from "~/hooks/TimerContext";
import { useState } from "react";
import { useUser } from "~/hooks/UserContext";
import LoadingPage from "../welcome/LoadingPage";

export default function Dashboard() {
  const logs = useLogs();
  const user = useUser();
  const timer = useTimer();
  const [description, setDescription] = useState<string>(
    timer.timer?.description ?? "",
  );

  if (!user.user) {
    return <LoadingPage />;
  }

  return (
    <div className="fixed top-20 mx-auto flex w-screen max-w-screen-sm flex-col items-center justify-center gap-8 pt-28 md:static md:top-0">
      {/* Project & Duration Selectors */}
      <div className="mx-5 flex flex-row gap-4 lg:mx-0">
        <Select
          value={timer.timer?.subjectId ?? ""}
          onValueChange={(subjectId) => {
            timer.onUpdateTimerInfo({ subjectId });
          }}
        >
          <SelectTrigger className="relative w-64 text-lg">
            <span className="ml-32"></span>{" "}
            {/* To move the chevron to the other side */}
            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2">
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
          value={`${timer.timer?.duration ?? "--"} min`}
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
          <SelectTrigger className="w-28 text-lg">
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
        <p className="w-[500px] text-center text-8xl dark:text-white">
          {timer.isLoading
            ? "--:--"
            : `${timer.minutesLeft}:${timer.secondsLeft.toString().padStart(2, "0")}`}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="absolute right-10 mt-9 h-10 w-10 rounded-full"
          onClick={() => timer.stop()}
          disabled={timer.disabled}
        >
          X
        </Button>
      </div>

      {/* Description Input */}
      <div className="w-full max-w-screen-sm px-5">
        <p className="mb-1 text-sm text-gray-400">I made progress on</p>
        <Input
          className="rounded-md text-lg dark:bg-[#323232]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => timer.onUpdateTimerInfo({ description })}
          placeholder="Describe your progress..."
        />
      </div>

      {/* Pause/Start Button */}
      <Button
        className="w-28 rounded-md text-lg"
        variant={
          timer.paused && timer.timer?.startedAt !== undefined
            ? "secondary"
            : "default"
        }
        onClick={() => timer.pause()}
        // disabled={timer.paused && timer.timer.id !== undefined}
      >
        {timer.paused && timer.timer?.startedAt !== undefined
          ? "Pause"
          : "Start"}
      </Button>

      {/* Hours Studied */}
      <div className="text-center">
        <h1 className="mb-1 text-xl font-semibold">Hours studied today</h1>
        <p className="text-2xl text-red-400">
          {Math.floor(logs.minutesToday / 60)}h{" "}
          {Math.floor(logs.minutesToday % 60)}min
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
