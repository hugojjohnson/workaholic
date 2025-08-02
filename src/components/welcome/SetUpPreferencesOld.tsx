"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Trash2, Plus } from "lucide-react";

export default function SetUpPreferences() {
  const { data: session } = useSession();
  const [shareActivity, setShareActivity] = useState(true);
  const [goal, setGoal] = useState(24);
  const [subjects, setSubjects] = useState<string[]>([""]);

  const utils = api.useUtils();
  const create = api.preferences.upsert.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const handleSubjectChange = (index: number, value: string) => {
    const updated = [...subjects];
    updated[index] = value;
    setSubjects(updated);
  };

  const handleAddSubject = () => {
    setSubjects((prev) => [...prev, ""]);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    const filteredSubjects = subjects.filter((s) => s.trim() !== "");
    create.mutate({ shareActivity, goal, subjects: filteredSubjects });
  };

  return (
    <div className="to-muted flex min-h-screen items-center justify-center bg-gradient-to-b from-white p-4">
      <Card className="border-border w-full max-w-xl border-2 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Welcome, {session?.user?.name?.split(" ")[0]} 👋
          </CardTitle>
          <p className="text-muted-foreground mt-2 text-sm">
            Before you dive in, let’s get a few things set up so we can help you
            build better study habits this semester.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share">
                📣 Share your study activity with friends?
              </Label>
              <p className="text-muted-foreground text-sm">
                They’ll see your current subjects, when you’re studying, and
                kudos in the weekly recap.
              </p>
            </div>
            <Switch
              id="share"
              checked={shareActivity}
              onCheckedChange={setShareActivity}
            />
          </div>

          <div>
            <Label className="mb-2 block">📚 Your Subjects</Label>
          </div>

          <div className="bg-muted text-muted-foreground rounded-xl p-4 text-sm">
            This isn’t a competition. There are no leaderboards or public
            rankings. It’s just you, your goals, and a way to stay accountable.
          </div>

          <Button
            className="text-md w-full"
            onClick={handleContinue}
            // disabled={create.status === "pending"}
          >
            Let’s get started 🚀
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
