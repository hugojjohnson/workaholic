"use client";

import type { Subject } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { useUser } from "~/hooks/UserContext";
import { useSettings } from "~/hooks/useSettings";
import DarkModeToggle from "~/components/settings/DarkModeToggle";
import BugDialogue from "~/components/settings/BugDialogue";
import FeatureDialogue from "~/components/settings/FeatureDialogue";
import ShowHeatmap from "~/components/settings/ShowHeatmap";
import { DeleteAccountDialogue } from "~/components/settings/DeleteAccountDialogue";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Menu, ChevronLeft } from "lucide-react";

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

export default function Settings() {
  const tabs = [
    { id: "timer", label: "Timer" },
    { id: "bugs", label: "Bugs and Features" },
    { id: "profile", label: "Profile" },
  ]

  const [activeTab, setActiveTab] = useState<string>("timer")

  return (
    <div className="h-full flex flex-col">

      <div className="mb-6 text-4xl lg:px-32 px-6 pt-10 flex flex-row gap-5 justify-between">
        <h1 className="">Settings</h1>

        {/* Hamburger menu: mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Menu size={25} />

            </SheetTrigger>
            <SheetContent side="left" className="w-64 space-y-2 p-4">
              {/* Required for accessibility */}
              <div className="hidden">
                <SheetTitle>Navigation Menu</SheetTitle>
              </div>

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
            </SheetContent>
          </Sheet>
        </div>
      </div>


      <div className="flex flex-1 border-t">
        {/* Sidebar */}
        <div className="w-64 border-r p-4 space-y-2 hidden md:block">
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
        <div className="flex-1 p-6 mb-32 md:mb-0">
          {activeTab === "timer" && <TimerTab />}
          {activeTab === "bugs" && <BugsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  )
}


// 👇 Dummy tab components
function TimerTab() {
  const user = useUser();
  const settings = useSettings();

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
      <h2 className="mt-10 mb-3 text-2xl font-semibold">Change Theme</h2>
      <DarkModeToggle />
      <ShowHeatmap />
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

  if (!user.user) {
    return <p>Loading user...</p>
  }

  return <div>
    <h2 className="text-3xl font-semibold mb-5">Bugs and Features</h2>
    <BugDialogue userId={user.user.id} />
    <FeatureDialogue userId={user.user.id} vote={user.user.preferences.lastFeatureVote} />
  </div>
}

function ProfileTab() {
  const user = useUser();
  const router = useRouter();

  return (
    <div>
      <h2 className="text-3xl font-semibold">Profile</h2>

      <div>
        <h3 className="text-xl mt-5 mb-1">Personal information</h3>
        {/* <Separator className="w-[35%] mt-2" /> */}
        <p className="text-muted-foreground">
          Username: {user.user?.name}
        </p>
        {/* <p>Email: {user?.email}</p> */}
        {/* <p>Profile photo</p> */}
      </div>

      {/* Sign out */}
      {/* <h3 className="text-2xl mt-8">Sign Out</h3> */}
      {/* <Separator className="w-[35%] mt-2" /> */}
      <Button
        variant="outline"
        className="mt-4 w-40 border-white text-white"
        onClick={async () => {
          await signOut();
          router.replace("/");
        }}
      >
        Sign out
      </Button>

      <div>
        <h3 className="mt-8 text-2xl">Danger</h3>
        <DeleteAccountDialogue userId={user.user?.id ?? ""} />
      </div>
    </div>
  );

}