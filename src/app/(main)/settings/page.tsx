"use client";

import type { Log, Subject } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { useLogs, type AddLogT } from "~/hooks/LogsContext";
import { useTimer } from "~/hooks/TimerContext";
import { useUser } from "~/hooks/UserContext";
import { useSettings } from "~/hooks/useSettings";

// TODO: Update these with the actual colours
const colourOptions: Record<string, { hex: string }> = {
    "RED": { hex: "#EF4444" },
    "BLUE": { hex: "#3B82F6" },
    "GREEN": { hex: "#10B981" },
    "YELLOW": { hex: "#FACC15" },
    "PURPLE": { hex: "#8B5CF6" },
    "PINK": { hex: "#EC4899" },
    "ORANGE": { hex: "#F97316" }
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
        startedAt: new Date()
    })

    if (!user.user) {
        return <p>loading</p> // TODO: replace with loading skeleton.
    }

    const SubjectItem = React.memo(function SubjectItem({
        subject,
        index,
        updateSubject,
        deleteSubject
    }: {
        subject: Subject;
        index: number;
        updateSubject: (id: string, name: string) => void;
        deleteSubject: (id: string) => void;
    }) {
        return (
            <div className="flex flex-row gap-4">
                <Input
                    className="text-lg bg-transparent"
                    defaultValue={subject.name}
                    onBlur={(e) => updateSubject(subject.id, e.target.value)}
                />

                <div className="flex items-center gap-3 ml-auto">
                    <Select value={colourOptions[subject.colour]?.hex ?? "#000000"} onValueChange={val => settings.updateSubject(subject.id, undefined, val)}>
                        <SelectTrigger className="w-[200px] flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: colourOptions[subject.colour]?.hex ?? "#000000" }}
                            />
                            <span>{subject.colour}</span>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(colourOptions).map(([name, val]) => (
                                <SelectItem key={val.hex} value={name}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: val.hex }}
                                        />
                                        {val.hex}
                                        {name}
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
        subjects
    }: {
        log: Log;
        subjects: Subject[] | undefined;
    }) {
        if (!subjects) {
            return <p></p>
        }
        const subjectName = subjects.find((s) => s.id === log.subjectId)?.name;

        return (
            <Card key={log.id} className="w-64 p-4 relative border-dashed border-2">
                <h1 className="text-xl font-semibold">{subjectName ?? "Unknown"}</h1>
                <p className="text-muted-foreground">
                    {new Date(log.startedAt).toLocaleString().slice(0, -3)} -{" "}
                    {new Date(
                        new Date(log.startedAt).getTime() + log.endedAt.getTime() * 60_000
                    )
                        .toLocaleString()
                        .slice(-8, -3)}
                </p>
                <p className="absolute top-2 right-3 italic text-muted-foreground">
                    {log.duration} min
                </p>
                <p className="text-sm mt-3">{log.notes}</p>
            </Card>
        );
    });


    return (
        <div className="px-6 lg:px-32 pt-10">
            <h1 className="text-4xl font-bold mb-6">Settings</h1>

            <div className="flex flex-col lg:flex-row justify-between gap-16">
                {/* Settings Column */}
                <div className="flex-1">
                    {/* Projects */}
                    <h2 className="text-2xl font-semibold mb-3">Projects</h2>
                    <Card className="w-full lg:w-96 p-4 flex flex-col gap-4 bg-muted">
                        {user.user.subjects.map((subject, index) => <div key={index}>
                            <SubjectItem
                                subject={subject}
                                index={index}
                                updateSubject={settings.updateSubject}
                                deleteSubject={settings.deleteSubject}
                            />
                            <Separator className="mt-4" />
                        </div>)}
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
                                                startedAt: new Date(Date.now() - myMins * 60_000)
                                            })
                                        }}
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
                                        const temp = structuredClone(tempLog)
                                        temp.startedAt = new Date(e.target.value)
                                        setTempLog(temp)
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
                    <h2 className="text-2xl font-semibold mb-6">Logs</h2>
                    <ScrollArea className="h-[30rem] pr-2">
                        <div className="flex flex-col gap-6">
                            {logs.logs
                                .sort((a, b) =>
                                    new Date(a.startedAt) > new Date(b.startedAt) ? -1 : 1
                                )
                                .slice(0, Math.min(logs.logs.length, 5))
                                .map(log => <LogCard key={log.id} log={log} subjects={user.user?.subjects} />)
                            }
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
