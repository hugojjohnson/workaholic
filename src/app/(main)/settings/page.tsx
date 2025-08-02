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

export default function Settings() {
  const user = useUser();
  const logs = useLogs();
  const settings = useSettings();
  const timer = useTimer();

  const [tempLog, setTempLog] = useState<AddLogT>({
    subjectId: timer.timer?.subjectId ?? user.user?.subjects[0]?.id ?? "",
    duration: timer.timer?.duration ?? 30,
    description: "",
    startedAt: new Date(),
  });

  useEffect(() => {
    const t = timer.timer;
    if (t?.subjectId && t?.duration) {
      setTempLog(prev => ({
        ...prev,
        subjectId: t.subjectId,
        duration: t.duration,
      }));
    }
  }, [timer.timer, timer.timer?.subjectId, timer.timer?.duration]);

  if (!user.user) {
    return <LoadingPage />;
  }

  const SubjectItem = React.memo(function SubjectItem({
    subject,
    updateSubject,
    deleteSubject,
  }: {
    subject: Subject;
    updateSubject: (id: string, name: string) => void;
    deleteSubject: (id: string) => void;
  }) {
    return (
      <div className="flex flex-row gap-4">
        <Input
          className="bg-transparent text-lg"
          defaultValue={subject.name}
          onBlur={(e) => updateSubject(subject.id, e.target.value)}
        />

        <div className="ml-auto flex items-center gap-3">
          <Select
            value={colourOptions[subject.colour]?.hex ?? "#000000"}
            onValueChange={(val) =>
              settings.updateSubject(subject.id, undefined, val)
            }
          >
            <SelectTrigger className="flex items-center gap-2">
              <div
                className="h-4 w-8 rounded-full"
                style={{
                  backgroundColor:
                    colourOptions[subject.colour]?.hex ?? "#000000",
                }}
              />
            </SelectTrigger>
            <SelectContent className="w-2">
              {Object.entries(colourOptions).map(([name, val]) => (
                <SelectItem key={val.hex} value={name}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-8 rounded-full"
                      style={{ backgroundColor: val.hex }}
                    />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="bg-destructive/30 hover:bg-destructive/50 text-white"
            onClick={() => deleteSubject(subject.id)}
          >
            X
          </Button>
        </div>
      </div>
    );
  });

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
        className="bg-muted relative w-full gap-0 border-2 border-dashed p-4"
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
        <p className="mt-2 text-sm">{log.description}</p>
      </Card>
    );
  });

  return (
    <div className="px-6 pt-10 lg:px-32">
      <h1 className="mb-6 text-4xl font-bold">Settings</h1>
      <div className="flex flex-row justify-between">
        <div>
          <div className="flex flex-col justify-between gap-16 lg:flex-row">
            {/* Settings Column */}
            <div className="flex-1">
              {/* Projects */}
              <h2 className="mb-3 text-2xl font-semibold">Projects</h2>
              <Card className="bg-muted flex w-full flex-col gap-4 p-4 lg:w-96">
                {user.user.subjects.map((subject, index) => (
                  <div key={index}>
                    <SubjectItem
                      subject={subject}
                      updateSubject={settings.updateSubject}
                      deleteSubject={settings.deleteSubject}
                    />
                    <Separator className="mt-4" />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  className="h-10 w-10"
                  onClick={() =>
                    settings.createSubject(
                      "",
                      "RED",
                      user.user?.subjects.length ?? 0,
                    )
                  }
                >
                  +
                </Button>
              </Card>
            </div>
            <div>
              <BugDialogue userId={user.user.id} />
              <FeatureDialogue userId={user.user.id} vote={user.user.preferences.lastFeatureVote} />
              <ShowHeatmap />
            </div>
          </div>

          <div className="flex flex-row gap-32">
            <div>
              {/* Daily Goal */}
              <h2 className="mt-10 mb-3 text-2xl font-semibold">
                Daily goal (hours)
              </h2>
              <Input
                type="number"
                defaultValue={user.user.preferences.goal}
                className="w-full lg:w-96"
                onBlur={(e) => {
                  const goalNum = parseInt(e.target.value);
                  if (!isNaN(goalNum)) {
                    settings.updateGoal(goalNum);
                  }
                }}
              />
            </div>

            <div>
              {/* Theme */}
              <h2 className="mt-10 mb-3 text-2xl font-semibold">
                Change theme
              </h2>
              <DarkModeToggle />
            </div>
          </div>

          {/* Add Log */}
          <div className="my-12 max-w-[700px] rounded-md border-2 border-dashed px-5 py-6">
            <h2 className="text-2xl font-semibold">Add Log</h2>

            <div className="mt-4 space-y-4">
              <div className="flex flex-row gap-10">
                <div>
                  <Label>Project</Label>
                  <Select
                    value={tempLog.subjectId}
                    onValueChange={(val) => {
                      setTempLog({ ...tempLog, subjectId: val });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {user.user.subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Select
                    value={`${tempLog.duration} minutes`}
                    onValueChange={(val) => {
                      const myMins = parseInt(val.split(" ")[0] ?? ""); // returns NaN anyway
                      if (isNaN(myMins)) {
                        return;
                      }

                      setTempLog({
                        ...tempLog,
                        duration: myMins,
                        startedAt: new Date(Date.now() - myMins * 60_000),
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const val = (i + 1) * 5;
                        return (
                          <SelectItem key={val} value={`${val} minutes`}>
                            {val} minutes
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  className="text-lg"
                  defaultValue={tempLog.description}
                  onBlur={(e) => {
                    setTempLog({ ...tempLog, description: e.target.value });
                  }}
                // TODO: Implement this instead
                // value={tempLog.description}
                // onChange={(e) => setTempLog({ ...tempLog, description: e.target.value })}
                />
              </div>

              <div>
                <Label>Time Started</Label>
                <Input
                  type="datetime-local"
                  className="text-lg"
                  value={toDatetimeLocal(tempLog.startedAt)}
                  onChange={(e) => {
                    const temp = structuredClone(tempLog);
                    temp.startedAt = new Date(e.target.value);
                    setTempLog(temp);
                  }}
                />
              </div>

              {/* <Button className="mt-4" onClick={addLog}> */}
              <Button className="mt-4" onClick={() => settings.addLog(tempLog)}>
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Logs Column */}
        <div className="w-full lg:w-1/3">
          <h2 className="mb-6 text-2xl font-semibold">Logs</h2>
          <ScrollArea className="h-[850px] pr-2">
            <div className="flex flex-col gap-6">
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
      </div>
    </div>
  );
}
