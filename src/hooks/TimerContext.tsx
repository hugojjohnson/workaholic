"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { api } from "~/trpc/react";
import { useUser } from "./useUser";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

interface TimerContextT {
  timer: inferProcedureOutput<AppRouter["timer"]["get"]> | undefined;
  secondsLeft: number;
  minutesLeft: number;
  pause: () => void;
  stop: () => void;
  paused: boolean;
  disabled: boolean;
}

const TimerContext = createContext<TimerContextT | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const timerQuery = api.timer.get.useQuery({ userId: user.id });

  const durationSeconds =
    timerQuery.data?.duration != null
      ? timerQuery.data.duration * 60
      : 30;

  const [secondsLeft, setSecondsLeft] = useState<number>(durationSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current!);
        return 0;
      }
      return prev - 1;
    });
  }, []);

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stop = () => {
    pause();
    setSecondsLeft(durationSeconds); // reset
  };

  useEffect(() => {
    // Auto start when timer is loaded
    if (timerQuery.data && intervalRef.current === null) {
      intervalRef.current = setInterval(tick, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerQuery.data, tick]);

  return (
    <TimerContext.Provider
      value={{
        timer: timerQuery.data,
        secondsLeft,
        minutesLeft: Math.floor(secondsLeft / 60),
        pause,
        stop,
        paused: timerQuery.isPaused,
        disabled: timerQuery.data?.startedAt === null
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextT => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};