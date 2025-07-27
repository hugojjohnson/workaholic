"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

export default function SetUpPreferences() {
  const { data: session } = useSession()
  const router = useRouter()
  const [shareActivity, setShareActivity] = useState(true)
  const [goal, setGoal] = useState(24) // default hours per week

  const utils = api.useUtils()
  const create = api.preferences.upsert.useMutation({
    onSuccess: async () => {
      await utils.invalidate()
    },
  })

  const handleContinue = () => {
    create.mutate({ shareActivity, goal })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-2xl border-2 border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome, {session?.user?.name?.split(" ")[0]} 👋</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Before you dive in, let’s get a few things set up so we can help you build better study habits this semester.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="goal">🎯 What’s your weekly study goal (hours)?</Label>
            <Input
              id="goal"
              type="number"
              min={1}
              max={100}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share">📣 Share your study activity with friends?</Label>
              <p className="text-muted-foreground text-sm">They’ll see your current subjects, when you’re studying, and kudos in the weekly recap.</p>
            </div>
            <Switch
              id="share"
              checked={shareActivity}
              onCheckedChange={setShareActivity}
            />
          </div>

          <div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground">
            This isn’t a competition. There are no leaderboards or public rankings. It’s just you, your goals, and a way to stay accountable.
          </div>

          <Button
            className="w-full text-md"
            onClick={handleContinue}
            // disabled={create.status === "pending"}
          >
            Let’s get started 🚀
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}