"use client";

import React, { createContext, useContext } from "react";
import { api } from "~/trpc/react";
import { useUser } from "./useUser";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

interface TimerContextT {
    timer: inferProcedureOutput<AppRouter["timer"]["get"]> | undefined;
    loading: boolean;
}

const TimerContext = createContext<TimerContextT | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();

  const timerQuery = api.timer.get.useQuery({ userId: user.id });

  // Provide the context value with your query data plus your mutations
  return (
    <TimerContext.Provider
      value={{
        timer: timerQuery.data,
        loading: timerQuery.status === "pending"
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// Optional helper hook for consuming the context (less boilerplate in consumers)
export const useTimer = (): TimerContextT => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useLogs must be used within a LogsProvider");
  }
  return context;
};
