import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { useTimerLogic } from "./useTimerLogic";
import { createContext, useContext } from "react";

export interface TimerContextT {
  timer: inferProcedureOutput<AppRouter["timer"]["get"]> | undefined;
  isLoading: boolean;
  secondsLeft: number;
  minutesLeft: number;
  pause: () => void;
  stop: () => void;
  paused: boolean;
  disabled: boolean;
  status: string;
  onUpdateTimerInfo: ({
    description,
    duration,
    tags,
    subjectId,
  }: {
    description?: string;
    duration?: number;
    tags?: string[];
    subjectId?: string;
  }) => void;
}

export const TimerContext = createContext<TimerContextT | undefined>(undefined);


export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const timerContext = useTimerLogic();

  if (!timerContext) return null; // or loading spinner or error

  return (
    <TimerContext.Provider value={timerContext}>
      {children}
    </TimerContext.Provider>
  );
};


export const useTimer = (): TimerContextT => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a UserProvider");
  }
  
  return context;
};