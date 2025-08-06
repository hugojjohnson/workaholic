import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useLogs } from "./LogsContext";
import useSound from "use-sound";
import { env } from "~/env";
import type { TimerContextT } from "./TimerContext"; // if you extracted the interface
import type { AppRouter } from "~/server/api/root";
import type { inferProcedureOutput } from "@trpc/server";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

enum TimerStatus {
  Unset = "Unset",
  Paused = "Paused",
  Playing = "Playing",
  Error = "Error",
}

function getTimerStatus(
  timer: inferProcedureOutput<AppRouter["timer"]["get"]>,
): TimerStatus {
  if (!timer) return TimerStatus.Error;
  if (timer.startedAt === null) return TimerStatus.Unset;
  if (timer.pausedAt === null && timer.deadlineAt) return TimerStatus.Playing;
  if (timer.pausedAt && timer.deadlineAt) return TimerStatus.Paused;
  return TimerStatus.Error;
}

function minutesToMs(minutes: number): number {
  return minutes * MINUTE;
}

async function notify() {
  if (typeof Notification !== "undefined") {
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      new Notification("Timer finished", {
        body: "Take a break!",
        icon: "/logo.png",
      });
    }
  }
}

export function useTimerLogic(): TimerContextT | undefined {
  const { data: session, status } = useSession();
  const logs = useLogs();
  const [playSound] = useSound("/alarm.wav");
  const utils = api.useUtils();
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  if (status !== "authenticated" || !session?.user.id) return undefined;

  const userId = session.user.id;
  const { data: timer } = api.timer.get.useQuery({ userId });

  const updateTimer = api.timer.update.useMutation({
    onMutate: async (updatedTimer) => {
      await utils.timer.get.cancel();
      const prev = utils.timer.get.getData({ userId });

      utils.timer.get.setData({ userId }, (old) => {
        if (!old) return old;
        return {
          ...old,
          ...updatedTimer,
        };
      });

      return { previousData: prev };
    },
    onError: (_err, _newData, ctx) => {
      if (ctx?.previousData) {
        utils.timer.get.setData({ userId }, ctx.previousData);
      }
    },
    onSettled: async () => {
      await utils.timer.get.invalidate({ userId });
    },
  });

  const updateInfo = api.timer.updateInfo.useMutation({
    onMutate: async (newData) => {
      await utils.timer.get.cancel();
      const prev = utils.timer.get.getData({ userId });

      utils.timer.get.setData({ userId }, (t) => {
        if (!t || t.id !== newData.timerId) return t;

        return {
          ...t,
          ...(newData.description !== undefined && { description: newData.description }),
          ...(newData.subjectId !== undefined && { subjectId: newData.subjectId }),
          ...(newData.duration !== undefined && { duration: newData.duration }),
        };
      });


      return { previousTimers: prev };
    },
    onError: (_err, _new, ctx) => {
      if (ctx?.previousTimers) {
        utils.timer.get.setData({ userId }, ctx.previousTimers);
      }
    },
    onSettled: async () => {
      await utils.timer.get.invalidate({ userId });
    },
  });

  const duration = timer?.duration
    ? minutesToMs(timer.duration)
    : minutesToMs(42);

  const [timeLeft, setTimeLeft] = useState<number>(duration);

  const pause = useCallback(() => {
    if (!timer) return;

    let startedAt = timer.startedAt;
    let pausedAt = timer.pausedAt;
    let deadlineAt = timer.deadlineAt;

    switch (getTimerStatus(timer)) {
      case TimerStatus.Unset:
        startedAt = new Date();
        pausedAt = null;
        deadlineAt = new Date(
          Date.now() +
          timer.duration *
          (env.NEXT_PUBLIC_ENV === "development" ? SECOND : MINUTE),
        );
        break;
      case TimerStatus.Paused:
        if (!deadlineAt || !pausedAt) return;
        const remaining = deadlineAt.getTime() - pausedAt.getTime();
        deadlineAt = new Date(Date.now() + remaining);
        pausedAt = null;
        break;
      case TimerStatus.Playing:
        pausedAt = new Date();
        break;
      case TimerStatus.Error:
        return;
    }

    updateTimer.mutate({
      timerId: timer.id,
      startedAt,
      pausedAt,
      deadlineAt,
    });
  }, [timer, updateTimer]);

  const stop = useCallback(() => {
    if (!timer) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    updateTimer.mutate({
      timerId: timer.id,
      startedAt: null,
      pausedAt: null,
      deadlineAt: null,
    });
    updateInfo.mutate({ timerId: timer.id, description: "" })
    setTimeLeft(minutesToMs(timer.duration));
  }, [timer, updateTimer]);

  const onUpdateTimerInfo = useCallback(
    ({
      description,
      duration,
      tags,
      subjectId,
    }: {
      description?: string;
      duration?: number;
      tags?: string[];
      subjectId?: string;
    }) => {
      if (!timer) return;
      updateInfo.mutate({
        timerId: timer.id,
        description,
        duration,
        tags,
        subjectId,
      });
    },
    [timer, updateInfo],
  );

  useEffect(() => {
    if (!timer) return;

    const deadline = timer.deadlineAt?.getTime();
    const paused = timer.pausedAt?.getTime();

    switch (getTimerStatus(timer)) {
      case TimerStatus.Unset:
        setTimeLeft(minutesToMs(timer.duration));
        break;
      case TimerStatus.Paused:
        if (!paused || !deadline) return;
        setTimeLeft(deadline - paused);
        break;
      case TimerStatus.Playing:
        if (!deadline) return;
        setTimeLeft(deadline - Date.now());
        intervalRef.current = setInterval(() => {
          setTimeLeft(deadline - Date.now());
        }, SECOND);
        break;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [timer]);

  useEffect(() => {
    if (!timer) return;
    document.title = `Workaholic - ${Math.floor(timeLeft / MINUTE)}:${String(
      Math.floor((timeLeft % MINUTE) / SECOND),
    ).padStart(2, "0")}`;

    if (timeLeft < SECOND * 1.1 && timer.startedAt !== null) {
      setTimeLeft(0);
      try {
        playSound();
      } catch (e) {
        console.error(e);
      }
      void notify();
      stop();

      logs.addLog({
        subjectId: timer.subjectId,
        duration: timer.duration,
        description: timer.description ?? "",
        startedAt: timer.startedAt!,
      });
    }
  }, [timeLeft, timer, playSound, stop, logs]);

  return {
    timer,
    isLoading: !timer,
    minutesLeft: Math.floor(timeLeft / MINUTE),
    secondsLeft: Math.floor((timeLeft / SECOND) % 60),
    pause,
    stop,
    paused: !timer?.pausedAt && !!timer?.startedAt,
    disabled: timer?.startedAt === null,
    status: timer ? getTimerStatus(timer) : TimerStatus.Error,
    onUpdateTimerInfo,
  };
}
