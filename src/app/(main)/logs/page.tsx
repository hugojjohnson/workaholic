"use client";

import type { Log, Subject } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useLogs } from "~/hooks/LogsContext";
import { useUser } from "~/hooks/UserContext";
import LoadingPage from "~/components/welcome/LoadingPage";
import { AddLogDialogue } from "~/components/logs/AddLogDialogue";
import { EditLogDialogue } from "~/components/logs/EditLogDialogue";

// TODO: Update these with the actual colours
export default function LogsTab() {
  const user = useUser();
  const logs = useLogs();
  const [editingLog, setEditingLog] = useState<Log | null>(null);

  const LISTSIZE = 12;
  const [listView, setListView] = useState(0)
  const changeLogView = (forward: boolean) => {
    const maxVal = Math.ceil(logs.logs.length / LISTSIZE) - 1;
    if (forward) {
      if (listView >= maxVal) {
        console.log(0);
        setListView(0);
        return;
      }
      console.log(listView + 1);
      setListView(prev => prev + 1);
      return;
    }
    if (listView === 0) {
      console.log(maxVal);
      setListView(maxVal);
      return;
    }
    console.log(listView - 1);
    setListView(prev => prev - 1);
  }


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
      <div className="relative group">
        <Card className="bg-muted w-[300px] md:w-[400px] gap-0 border-2 border-dashed p-4">
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

          {/* Edit icon */}
          {/* <button
            onClick={() => setEditingLog(log)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
          >
            ✏️
          </button> */}
          <Button
            onClick={() => setEditingLog(log)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
          >
            Edit
          </Button>
        </Card>
      </div>

    );
  });

  return (
    <div className="px-6 pt-10 lg:px-32">
      <h1 className="mb-6 text-4xl font-bold">Logs</h1>

      <div className="flex flex-row gap-5">
        <AddLogDialogue />
        <EditLogDialogue log={editingLog} onClose={() => setEditingLog(null)} />
        <div className="flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => changeLogView(false)}>
            &lt;
          </Button>
          <Button variant="outline" onClick={() => changeLogView(true)}>
            &gt;
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[850px] pr-2 mt-10">
        <div className="flex flex-row flex-wrap gap-6">
          {logs.logs
            .sort((a, b) =>
              new Date(a.startedAt) > new Date(b.startedAt) ? -1 : 1,
            )
            .slice(LISTSIZE * listView, Math.min(logs.logs.length, LISTSIZE * (listView + 1)))
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
