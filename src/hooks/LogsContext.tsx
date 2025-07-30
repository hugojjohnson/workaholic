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
  deleteLog: (id: string) => Promise<void>;
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

  const deleteLog = async (id: string) => {
    try {
      await deleteLogMutation.mutateAsync({ logId: id, userId });
      await utils.logs.getAll.invalidate();
    } catch (err) {
      console.error("deleteLog failed", err);
    }
  };

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

  // Provide the context value with your query data plus your mutations
  return (
    <LogsContext.Provider
      value={{
        test: "test", // you can remove or replace this with real stuff
        addLog: onAddLog,
        deleteLog,
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
