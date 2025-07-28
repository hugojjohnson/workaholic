"use client";

import React, { createContext, useContext } from "react";
import { api } from "~/trpc/react";
import type { Log } from "@prisma/client";
import { useUser } from "./UserContext";
import { useSession } from "next-auth/react";

interface LogsContextT {
  test: string;
  addLog: (newLog: Log) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  logs: Log[];
}

const LogsContext = createContext<LogsContextT | undefined>(undefined);

export const LogsProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const userId = session.data?.user.id;

  if (!userId) {
    throw new Error("session.data is undefined.");
  }

  const logsQuery = api.logs.getAll.useQuery({ userId });

  const utils = api.useUtils(); // for cache invalidation
  const addLogMutation = api.logs.add.useMutation();
  const deleteLogMutation = api.logs.delete.useMutation();

  const addLog = async (newLog: Log) => {
    try {
      await addLogMutation.mutateAsync({
        userId,
        subjectId: "", // TODO: update as needed
        startedAt: new Date(), // TODO: update with real data
        endedAt: new Date(),
        notes: "",
      });
      await utils.logs.getAll.invalidate();
    } catch (err) {
      console.error("addLog failed", err);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      await deleteLogMutation.mutateAsync({ logId: id, userId });
      await utils.logs.getAll.invalidate();
    } catch (err) {
      console.error("deleteLog failed", err);
    }
  };

  // Provide the context value with your query data plus your mutations
  return (
    <LogsContext.Provider
      value={{
        test: "test", // you can remove or replace this with real stuff
        addLog,
        deleteLog,
        logs: logsQuery.data ? logsQuery.data : []
      }}
    >
      {children}
    </LogsContext.Provider>
  );
};

// Optional helper hook for consuming the context (less boilerplate in consumers)
export const useLogs = (): LogsContextT => {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error("useLogs must be used within a LogsProvider");
  }
  return context;
};
