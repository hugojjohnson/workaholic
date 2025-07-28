"use client";

import type { Log, Subject } from "@prisma/client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { useLogs } from "~/hooks/LogsContext";
import { useUser } from "~/hooks/UserContext";
import { useSettings } from "~/hooks/useSettings";

export default function Settings() {
    const user = useUser();
    const logs = useLogs();
    const settings = useSettings();
    const [editingSubjectId, setEditingSubjectId] = useState<string | undefined>(undefined);
    const [tempSubjectName, setTempSubjectName] = useState<string>("");

    if (!user.user) {
        return <p>loading</p> // TODO: replace with loading skeleton.
    }

    const subjectHTML = (subject: Subject, index: number) => (
        <div key={index} className="flex flex-row gap-4">
            <Input
                className="text-lg bg-transparent"
                value={editingSubjectId === subject.id ? tempSubjectName : subject.name}
                onSelect={() => {
                    setEditingSubjectId(subject.id)
                    setTempSubjectName(subject.name)
                }}
                onChange={e => setTempSubjectName(e.target.value)}
                onBlur={() => settings.updateSubject(subject.id, tempSubjectName)}
            />

            <div className="flex items-center gap-3 ml-auto">
                {/* <ColourPicker
        start={user.user.projects[index].colour}
        callback={(colour: Colours) => {
          const user2 = structuredClone(user);
          user2.projects[index].colour = colour;
          setUser({ ...user, projects: user2.projects });
        }}
      /> */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-destructive/30 hover:bg-destructive/50 text-white"
                    onClick={() => settings.deleteSubject(subject.id)}
                >
                    X
                </Button>
            </div>

        </div>
    );

    const logHTML = (log: Log) => {
        if (!user.user) {
            return <></>
        }
        return <Card key={log.id} className="w-64 p-4 relative border-dashed border-2">
            <h1 className="text-xl font-semibold">{user.user.subjects.find(subject => subject.id === log.subjectId)?.name ?? undefined}</h1>
            <p className="text-muted-foreground">
                {new Date(log.startedAt).toLocaleString().slice(0, -3)} -{" "}
                {new Date(
                    new Date(log.startedAt).getTime() + log.endedAt.getTime() * 60_000 // TODO: Sus
                )
                    .toLocaleString()
                    .slice(-8, -3)}
            </p>
            <p className="absolute top-2 right-3 italic text-muted-foreground">
                {log.duration} min
            </p>
            <p className="text-sm mt-3">{log.notes}</p>
        </Card>
    }

    return (
        <div className="px-6 lg:px-32 pt-10">
            <h1 className="text-4xl font-bold mb-6">Settings</h1>

            <div className="flex flex-col lg:flex-row justify-between gap-16">
                {/* Settings Column */}
                <div className="flex-1">
                    {/* Projects */}
                    <h2 className="text-2xl font-semibold mb-3">Projects</h2>
                    <Card className="w-full lg:w-96 p-4 flex flex-col gap-4 bg-muted">
                        {user.user.subjects.map((subject, index) => <>
                            {subjectHTML(subject, index)}
                            <Separator />
                        </>)}
                        <Button
                            variant="secondary"
                            className="w-10 h-10"
                            onClick={() => settings.createSubject("", "RED", user.user?.subjects.length ? user.user.subjects.length : 0)}
                        >
                            +
                        </Button>
                    </Card>

                    {/* Daily Goal */}
                    <h2 className="text-2xl font-semibold mt-10 mb-3">Daily goal (hours)</h2>
                    <Input
                        type="number"
                        defaultValue={user.user.preferences.goal}
                        className="w-full lg:w-96"
                        onBlur={e => {
                            const goalNum = parseInt(e.target.value)
                            if (!isNaN(goalNum)) {
                                settings.updateGoal(goalNum)
                            }
                        }}
                    />

                    {/* Add Log */}
                    <div className="mt-12 px-5 py-6 border-dashed border-2 rounded-md max-w-[700px]">
                        <h2 className="text-2xl font-semibold">Add Log</h2>

                        <div className="mt-4 space-y-4">
                            <div className="flex flex-row gap-10">
                                <div>
                                    <Label>Project</Label>
                                    <Select
                                        value=""
                                    // value={newProject.name}
                                    // onValueChange={(val) =>
                                    //   setNewProject({ name: val, colour: "red" })
                                    // }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {user.user.subjects.map((subject, index) => (
                                                <SelectItem key={index} value={subject.name}>
                                                    {subject.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                <Label>Duration</Label>
                                <Select
                                    // value={`${newDuration} minutes`}
                                    value={`XXX minutes`}
                                // onValueChange={(val) => {
                                //   const myMins = parseInt(val.split(" ")[0]);
                                //   setNewDuration(myMins);
                                //   setNewTimeStarted(
                                //     new Date(
                                //       Date.now() -
                                //         new Date().getTimezoneOffset() * 60_000 -
                                //         myMins * 60_000
                                //     )
                                //       .toISOString()
                                //       .slice(0, 16)
                                //   );
                                // }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[...Array(12)].map((_, i) => {
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
                                    value="description here"
                                // value={newDescription}
                                // onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Time Started</Label>
                                <Input
                                    type="datetime-local"
                                    className="text-lg"
                                    value={new Date().getTime()}
                                // value={newTimeStarted}
                                // onChange={(e) => setNewTimeStarted(e.target.value)}
                                />
                            </div>

                            {/* <Button className="mt-4" onClick={addLog}> */}
                            <Button className="mt-4">
                                Add
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Logs Column */}
                <div className="w-full lg:w-1/3">
                    <h2 className="text-2xl font-semibold mb-6">Logs</h2>
                    <ScrollArea className="h-[30rem] pr-2">
                        <div className="flex flex-col gap-6">
                            {logs.logs
                                .sort((a, b) =>
                                    new Date(a.startedAt) > new Date(b.startedAt) ? -1 : 1
                                )
                                .slice(0, Math.min(logs.logs.length, 5))
                                .map(logHTML)}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
