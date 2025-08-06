"use client";

import type { Log, Subject } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { useLogs, type AddLogT } from "~/hooks/LogsContext";
import { useTimer } from "~/hooks/TimerContext";
import { useUser } from "~/hooks/UserContext";
import { useSettings } from "~/hooks/useSettings";
import DarkModeToggle from "~/components/settings/DarkModeToggle";
import LoadingPage from "~/components/welcome/LoadingPage";
import BugDialogue from "~/components/settings/BugDialogue";
import FeatureDialogue from "~/components/settings/FeatureDialogue";
import ShowHeatmap from "~/components/settings/ShowHeatmap";
import { AddLogDialogue } from "~/components/logs/AddLogDialogue";

// TODO: Update these with the actual colours
const colourOptions: Record<string, { hex: string }> = {
  RED: { hex: "#EF4444" },
  BLUE: { hex: "#3B82F6" },
  GREEN: { hex: "#10B981" },
  YELLOW: { hex: "#FACC15" },
  PURPLE: { hex: "#8B5CF6" },
  PINK: { hex: "#EC4899" },
  ORANGE: { hex: "#F97316" },
};
function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export default function LogsTab() {
  const user = useUser();
  const logs = useLogs();
  const settings = useSettings();
  const timer = useTimer();

  if (!user.user) {
    return <LoadingPage />;
  }

  const LogCard = React.memo(function LogCard({
    log,
    subjects,
  }: {
    log: Log;
    subjects: Subject[] | undefined;
  }) {
    if (!subjects) {
      return <p></p>;
    }
    const subjectName = subjects.find((s) => s.id === log.subjectId)?.name;

    return (
      <Card
        key={log.id}
        className="bg-muted relative w-[400px] gap-0 border-2 border-dashed p-4"
      >
        <h1 className="text-xl font-semibold">{subjectName ?? "Unknown"}</h1>
        <p className="text-muted-foreground">
          {new Date(log.startedAt).toLocaleString().slice(0, 10)} |{" "}
          {new Date(log.startedAt).toLocaleString().slice(-8, -3)} -{" "}
          {new Date(log.startedAt.getTime() + log.duration * 60_000)
            .toLocaleString()
            .slice(-8, -3)}
        </p>
        <p className="text-muted-foreground absolute top-2 right-3 italic">
          {log.duration} min
        </p>
        <p className="mt-1 text-sm">{log.description}</p>
      </Card>
    );
  });

  return (
    <div className="px-6 pt-10 lg:px-32">
      <h1 className="mb-6 text-4xl font-bold">Logs</h1>
      <AddLogDialogue />
      <ScrollArea className="h-[850px] pr-2 mt-10">
        <div className="flex flex-row flex-wrap gap-6">
          {logs.logs
            .sort((a, b) =>
              new Date(a.startedAt) > new Date(b.startedAt) ? -1 : 1,
            )
            .slice(0, Math.min(logs.logs.length, 5))
            .map((log) => (
              <LogCard
                key={log.id}
                log={log}
                subjects={user.user?.subjects}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
