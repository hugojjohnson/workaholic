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
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { env } from "~/env";
import { useSession } from "next-auth/react";
import useSound from 'use-sound'
import { useLogs } from "./LogsContext";

interface TimerContextT {
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
const SECOND = 1_000;
const MINUTE = SECOND * 60;

const TimerContext = createContext<TimerContextT | undefined>(undefined);

enum TimerStatus {
  Unset,
  Paused,
  Playing,
  Error,
}
/**
 * startedAt, pausedAt, deadlineAt
 * Unset: undefined, _, _
 * Playing: set, undefined, set (as the time left)
 * Paused: set, set, set
 */
function getTimerStatus(
  timer: inferProcedureOutput<AppRouter["timer"]["get"]>,
): TimerStatus {
  if (!timer) {
    return TimerStatus.Error;
  }
  if (timer.startedAt === null) {
    return TimerStatus.Unset;
  } else if (timer.pausedAt === null && timer.deadlineAt) {
    return TimerStatus.Playing;
  } else if (timer.pausedAt && timer.deadlineAt) {
    return TimerStatus.Paused;
  }
  return TimerStatus.Error;
}
async function notification() {
  if (typeof Notification !== "undefined") {
    await Notification.requestPermission?.().then(p => {
      if (p === "granted") new Notification("Timer finished", { body: "Take a break!", icon: "/logo.png" });
    })
  }
}

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const logs = useLogs();
  const [playSound] = useSound("/alarm.wav")

  const userId = session.data?.user.id;
  if (!userId) {
    throw new Error("userId is undefined.");
  }

  const utils = api.useUtils();
  const { data: timer } = api.timer.get.useQuery({ userId });

  const updateTimerMutation = api.timer.update.useMutation({
    // Optimistically update the cache
    onMutate: async (updatedTimer) => {
      await utils.timer.get.cancel(); // Cancel any outgoing refetches

      const previousData = utils.timer.get.getData({ userId });

      // Optimistically update the cached data
      utils.timer.get.setData({ userId }, (oldData) => {
        if (!oldData) return oldData;
        if (!timer) return oldData;

        return {
          ...timer,
          startedAt: updatedTimer.startedAt ?? timer.startedAt,
          pausedAt: updatedTimer.pausedAt ?? timer.pausedAt,
          deadlineAt: updatedTimer.deadlineAt ?? timer.deadlineAt,
        };
      });

      // Return context for rollback
      return { previousData };
    },

    // If it fails, roll back
    onError: (_err, _updatedTimer, context) => {
      if (context?.previousData) {
        utils.timer.get.setData({ userId }, context.previousData);
      }
    },

    // Invalidate to revalidate with fresh server data
    onSettled: async () => {
      await utils.timer.get.invalidate({ userId });
    },
  });

  const updateInfoMutation = api.timer.updateInfo.useMutation({
    // Optimistically update the cache
    onMutate: async (newData) => {
      await utils.timer.get.cancel();
      const previousTimers = utils.timer.get.getData();

      // Optimistic update: clone and apply the changes locally
      utils.timer.get.setData({ userId }, (timer) => {
        if (!timer) return timer;
        if (timer.id !== newData.timerId) return timer;

        return {
          ...timer,
          ...(newData.description !== undefined && {
            description: newData.description,
          }),
          ...(newData.duration !== undefined && {
            duration: newData.duration,
          }),
          ...(newData.tags !== undefined && {
            tags: newData.tags,
          }),
          ...(newData.subjectId !== undefined && {
            subjectId: newData.subjectId,
          }),
        };
      });

      return { previousTimers };
    },

    // If mutation fails, rollback
    onError: (_err, _newData, context) => {
      if (context?.previousTimers) {
        utils.timer.get.setData({ userId }, context.previousTimers);
      }
    },

    // After mutation, refetch to be safe
    onSettled: async () => {
      await utils.timer.get.invalidate();
    },
  });

  const durationSeconds: number | undefined = timer?.duration
    ? timer.duration * MINUTE
    : 42 * MINUTE;

  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const togglePause = () => {
    if (!timer) {
      return;
    }
    let startedAt: Date | null = timer.startedAt;
    let pausedAt: Date | null = timer.pausedAt;
    let deadlineAt: Date | null = timer.deadlineAt;

    switch (getTimerStatus(timer)) {
      case TimerStatus.Unset:
        startedAt = new Date();
        pausedAt = null;
        deadlineAt = new Date(
          new Date().getTime() +
          timer.duration *
          (env.NEXT_PUBLIC_ENV === "development" ? SECOND : MINUTE),
        );
        break;
      case TimerStatus.Paused:
        if (!timer.deadlineAt || !timer.pausedAt)
          throw new Error("This is just for the compiler1");
        const rem =
          new Date(timer.deadlineAt).getTime() -
          new Date(timer.pausedAt).getTime();
        deadlineAt = new Date(new Date().getTime() + rem);
        pausedAt = null;
        break;
      case TimerStatus.Playing:
        if (!timer.deadlineAt) throw new Error("This is just for the compiler");
        pausedAt = new Date();
        break;
      case TimerStatus.Error:
        throw new Error("Timer shouldn't have reached this stage.");
    }
    updateTimerMutation.mutate({
      timerId: timer.id,
      startedAt,
      pausedAt,
      deadlineAt,
    });
  };

  const stop = useCallback(() => {
    if (!timer) {
      console.error("timer is undefined");
      return;
    }
    // Cancel it later
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    updateTimerMutation.mutate({
      timerId: timer.id,
      startedAt: null,
      pausedAt: null,
      deadlineAt: null,
    });
    setTimeLeft(timer.duration * MINUTE);
  }, [timer, updateTimerMutation, setTimeLeft, intervalRef]);

  function onUpdateTimerInfo({
    description,
    duration,
    tags,
    subjectId,
  }: {
    description?: string;
    duration?: number;
    tags?: string[];
    subjectId?: string;
  }) {
    if (!timer) {
      throw new Error("timer is undefined");
    }
    updateInfoMutation.mutate({
      timerId: timer.id,
      description,
      duration,
      tags,
      subjectId,
    });
  }

  //** ========== useEffects ========== **/
  useEffect(() => {
    if (!timer) {
      return;
    }
    // Update timeLeft
    const deadline = timer.deadlineAt
      ? new Date(timer.deadlineAt).getTime()
      : undefined;
    const paused = timer.pausedAt?.getTime();
    switch (getTimerStatus(timer)) {
      case TimerStatus.Unset:
        setTimeLeft(timer.duration * MINUTE);
        break;
      case TimerStatus.Paused:
        if (!paused || !deadline)
          throw new Error("This is just for the compiler");
        setTimeLeft(deadline - paused);
        break;
      case TimerStatus.Playing:
        if (!deadline) {
          throw new Error("This is just for the compiler");
        }
        setTimeLeft(deadline - new Date().getTime());
        intervalRef.current = setInterval(() => {
          // if (!deadline) {
          //     throw new Error("This is just for the compiler")
          // }
          setTimeLeft(deadline - new Date().getTime());
        }, SECOND);
        break;
      case TimerStatus.Error:
        break;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [timer]);

  // This runs like the other use effect, but also every second when the timer is playing.
  useEffect(() => {
    if (!timer) {
      return;
    }
    // Update tab
    const minutes = Math.floor(timeLeft / MINUTE);
    const seconds = Math.floor(timeLeft % SECOND);
    document.title = "Workaholic - " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    if (timeLeft < 1.1 * SECOND && timer.startedAt !== undefined) {
      setTimeLeft(0);
      try {
        playSound()
      } catch (e) {
        console.error(e)
      }
      void notification();

      stop();
      // // Send request to the server
      if (!timer.startedAt) {
        throw new Error("timer.startedAt should not be null.");
      }
      logs.addLog({
        subjectId: timer.subjectId,
        duration: timer.duration,
        description: timer.description ?? "",
        startedAt: timer.startedAt,
      });
    }
  }, [timeLeft, timer, logs, stop, playSound]);

  return (
    <TimerContext.Provider
      value={{
        timer: timer,
        isLoading: !timer,
        minutesLeft: Math.floor(timeLeft / MINUTE),
        secondsLeft: Math.floor((timeLeft / SECOND) % 60),
        pause: togglePause,
        stop,
        paused: !!timer?.pausedAt,
        disabled: timer?.startedAt === null,
        status: ["Unset", "Paused", "Playing", "Error"][
          getTimerStatus(timer!)
        ]!,
        onUpdateTimerInfo,
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
