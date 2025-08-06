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

  const tabs = [
    { id: "timer", label: "Timer" },
    { id: "bugs", label: "Bugs and Features" },
    { id: "notifications", label: "Notifications" },
  ]

  const [activeTab, setActiveTab] = useState<string>("timer")

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-6 text-4xl lg:px-32 px-6 pt-10">Settings</h1>
      <div className="flex flex-1 border-t">
        {/* Sidebar */}
        <div className="w-64 border-r p-4 space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          {activeTab === "timer" && <TimerTab />}
          {activeTab === "bugs" && <BugsTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  )
}


// 👇 Dummy tab components
function TimerTab() {
  const user = useUser();
  const logs = useLogs();
  const settings = useSettings();
  const timer = useTimer();

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

  return <div>
    <h2 className="text-3xl font-semibold">Timer Settings</h2>
    <div>
      {/* Daily Goal */}
      <h2 className="mt-10 mb-3 text-2xl font-semibold">
        Daily goal (hours)
      </h2>
      <Input
        type="number"
        defaultValue={user.user?.preferences.goal}
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
        Change Theme
      </h2>
      <DarkModeToggle />
    </div>

    <h2 className="mt-10 mb-3 text-2xl font-semibold">Change Projects</h2>
    <Card className="bg-muted flex w-full flex-col gap-4 p-4 lg:w-[600px]">
      {user.user?.subjects.map((subject, index) => (
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
}

function BugsTab() {
  const user = useUser();
  const logs = useLogs();
  const settings = useSettings();
  const timer = useTimer();

  if (!user.user) {
    return <p>Loading user...</p>
  }

  return <div>
    <h2 className="text-3xl font-semibold">Account Settings</h2>
    <BugDialogue userId={user.user.id} />
    <FeatureDialogue userId={user.user.id} vote={user.user.preferences.lastFeatureVote} />
    <ShowHeatmap />
  </div>
}

function NotificationsTab() {
  return <div><h2 className="text-xl font-semibold">Notification Settings</h2></div>
}