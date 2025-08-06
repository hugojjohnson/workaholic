"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { useUser } from "~/hooks/UserContext";
import { useSettings } from "~/hooks/useSettings";
import { useTimer } from "~/hooks/TimerContext";
import type { Log } from "@prisma/client";
import { useLogs } from "~/hooks/LogsContext";



export function EditLogDialogue({ log, onClose }: { log: Log | null, onClose: () => void }) {
  const user = useUser();
  const timer = useTimer();
  const settings = useSettings();
  const logs = useLogs();

  const [tempLog, setTempLog] = useState({
    subjectId: "",
    duration: 0,
    description: "",
    startedAt: new Date(),
  });

  useEffect(() => {
    if (log) {
      setTempLog(prev => ({
        ...prev,
        subjectId: log.subjectId,
        duration: log.duration,
        description: log.description ?? "",
        startedAt: log.startedAt,
      }));
    }
  }, [log]);

  if (!log) {
    return null;
  }
  return (
    <Dialog open={!!log} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Log Entry</DialogTitle>
          <DialogDescription>
            Change in the details below to edit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex flex-row gap-10">
            <div className="flex-1">
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
                  {user.user?.subjects.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label>Duration</Label>
              <Select
                value={`${tempLog.duration} minutes`}
                onValueChange={(val) => {
                  const myMins = parseInt(val.split(" ")[0] ?? "");
                  if (isNaN(myMins)) return;

                  setTempLog({
                    ...tempLog,
                    duration: myMins,
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
            // Recommended: make this a controlled input instead
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
        </div>

        <DialogFooter>
          <Button variant="destructive" className="mr-auto">Delete</Button>
          <Button onClick={() => {
            logs.editLog({
              ...log,
              subjectId: tempLog.subjectId,
              duration: tempLog.duration,
              description: tempLog.description ?? "",
              startedAt: tempLog.startedAt,
            });
            onClose()
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Utility
function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
