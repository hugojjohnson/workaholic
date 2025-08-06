"use client";

import React, { createContext, useContext } from "react";
import { api } from "~/trpc/react";
import type { Log } from "@prisma/client";
import { useSession } from "next-auth/react";

export interface AddLogT {
  subjectId: string;
  duration: number;
  description: string;
  startedAt: Date;
}
const sumMinutes = (arr: Log[]): number => {
  return arr.reduce((total, current: { duration: number }) => {
    return total + current.duration;
  }, 0);
};
const filterToday = (arr: Log[]) =>
  arr.filter(
    ({ startedAt }) => startedAt.toDateString() === new Date().toDateString(),
  );

const funConversions = [
  { title: "Ikea candles burned", hours: 4 },
  { title: "Cups of coffee brewed", hours: 0.08333 },
  { title: "% of The Lord of the Rings Extended Trilogy", hours: 11.5 },
  { title: "TikToks watched:", hours: 0.00416667 },
  { title: "Walking trips from Sydney to Newcastle", hours: 30 },
  { title: "Heartbeats wasted", hours: 0.0002314815 },
  { title: "Km walked by Tourtise", hours: 4 },
  { title: "Walking trips from Athens to Sparta", hours: 20 },
];
function getRandomFact(totalMinutes: number) {
  const funFact =
    funConversions[Math.floor(Math.random() * funConversions.length)];
  if (!funFact) {
    throw new Error("Could not find fun fact");
  }
  return {
    title: funFact.title,
    number: Number((totalMinutes / 60 / funFact.hours).toFixed(2)),
  };
}

interface LogsContextT {
  test: string;
  addLog: ({ subjectId, duration, description, startedAt }: AddLogT) => void;
  editLog: (log: Log) => void;
  deleteLog: (id: string) => void;
  logs: Log[];
  minutesToday: number;
  minutesToDate: number;
  funFact: { title: string; number: number };
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
  const deleteLogMutation = api.logs.delete.useMutation();

  const addLog = api.logs.add.useMutation({
    onMutate: async (newLog) => {
      if (!userId) {
        throw new Error("userId is undefined");
      }
      await utils.logs.getAll.cancel(); // cancel any outgoing fetches
      const previousLogs = utils.logs.getAll.getData();
      utils.logs.getAll.setData({ userId }, (oldLogs) => {
        if (!oldLogs) return oldLogs;
        return [
          ...oldLogs,
          {
            ...newLog,
            id: "undefined so far", // TODO
            tags: [],
          },
        ];
      });
      return { previousLogs };
    },
    onError: (_err, _newSubject, context) => {
      if (context?.previousLogs && userId) {
        utils.logs.getAll.setData({ userId: userId }, context.previousLogs);
      }
    },
    onSettled: async () => {
      await utils.logs.getAll.invalidate();
    },
  });

  const editLog = api.logs.edit.useMutation({
    onMutate: async (updatedLog) => {
      const userId = updatedLog.userId;
      await utils.user.get.cancel();
      const previousUser = utils.user.get.getData();
      utils.logs.getAll.setData({ userId }, (oldlogs) => {
        if (!oldlogs) return oldlogs;
        return oldlogs.map((log) =>
          log.id === updatedLog.logId
            ? {
              ...log,
              ...updatedLog,
            }
            : log,
        );
      });
      return { previousUser };
    },
    onError: (_err, _updatedLog, context) => {
      const userId = _updatedLog.userId;
      if (context?.previousUser && userId) {
        utils.user.get.setData({ userId }, context.previousUser);
      }
    },
    onSettled: async () => {
      await utils.user.get.invalidate();
    },
  });

  const deleteLog = api.logs.delete.useMutation({
    onMutate: async ({ userId, logId }) => {
      if (!userId) throw new Error("userId is undefined");

      await utils.logs.getAll.cancel(); // cancel ongoing fetches

      // Snapshot previous logs
      const previousLogs = utils.logs.getAll.getData({ userId });

      // Optimistically remove the log from cache
      utils.logs.getAll.setData({ userId }, (oldLogs) => {
        if (!oldLogs) return oldLogs;
        return oldLogs.filter((log) => log.id !== logId);
      });

      return { previousLogs };
    },
    onError: (_err, _variables, context) => {
      // Rollback if mutation fails
      if (context?.previousLogs && userId) {
        utils.logs.getAll.setData({ userId }, context.previousLogs);
      }
    },
    onSettled: async () => {
      await utils.logs.getAll.invalidate({ userId });
    },
  });

  function onDeleteLog(logId: string) {
    if (!userId) {
      throw new Error("userId is undefined");
    }
    deleteLog.mutate({
      userId,
      logId
    })

  }

  function onAddLog(newLog: AddLogT) {
    if (!userId) {
      throw new Error("userId is undefined");
    }
    addLog.mutate({
      ...newLog,
      userId: userId,
      endedAt: new Date(new Date().getTime() + newLog.duration * 60_000),
    });
  }

  function onEditLog(log: Log) {
    if (!userId) {
      throw new Error("userId is undefined");
    }
    editLog.mutate({
      ...log,
      logId: log.id,
      userId,
      description: log.description ? log.description : undefined
    });
  }

  // Provide the context value with your query data plus your mutations
  return (
    <LogsContext.Provider
      value={{
        test: "test", // you can remove or replace this with real stuff
        addLog: onAddLog,
        editLog: onEditLog,
        deleteLog: onDeleteLog,
        logs: logsQuery.data ?? [],
        minutesToday: sumMinutes(filterToday(logsQuery.data ?? [])),
        minutesToDate: sumMinutes(logsQuery.data ?? []),
        funFact: getRandomFact(sumMinutes(logsQuery.data ?? [])),
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
