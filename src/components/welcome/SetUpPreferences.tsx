"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash2, UserIcon, UsersIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";


const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export default function FadeComponent() {
  const { data: session } = useSession();
  const [shareActivity, setShareActivity] = useState(false); // Just gonna leave like this
  const [goal, setGoal] = useState(4);
  const [subjects, setSubjects] = useState<string[]>([""]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);
  const [hidePage, setHidePage] = useState(false);
  const utils = api.useUtils();
  const [transitionNum, transitionTailwind] = [500, "duration-500"]

  const create = api.preferences.upsert.useMutation({
    onSuccess: async () => {
      window.location.reload();
      // await utils.invalidate();
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
    setHidePage(true);
    const filteredSubjects = subjects.filter((s) => s.trim() !== "");
    create.mutate({ shareActivity, goal, subjects: filteredSubjects });
  };


  const welcomePage = <>
    <CardHeader>
      <CardTitle className="text-2xl font-bold">
        Welcome, {session?.user?.name?.split(" ")[0]}!
      </CardTitle>
      <p className="text-muted-foreground mt-2 text-sm">
        Before you dive in, let’s get a few things set up so we can help you
        build better study habits this semester.
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
    </CardContent>
  </>


  const hoursPage = <>
    <CardHeader>
      <CardTitle className="text-2xl font-bold">
        1. Choose your goal
      </CardTitle>
      <p className="text-muted-foreground mt-2 text-sm">
        Choose how many hours to aim for each day. The most important part is to <em>not 
          overestimate it!</em> &nbsp; 3-4 is more than enough. You can change this later in settings.
        {/* <ul className="list-disc list-inside">
          <li>2 hours (14 hours / week): Pass your subjects</li>
          <li>3 hours (21 hours / week): Do well in your subjects</li>
          <li>4 hours (28 hours / week): All you should need</li>
          <p>You can change this later in settings.</p>
        </ul> */}
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <Input
        className="mt-2"
        id="goal"
        type="number"
        min={1}
        max={100}
        value={goal}
        onChange={(e) => setGoal(Number(e.target.value))}
      />
    </CardContent>
  </>

  const subjectsPage = <>
    <CardHeader>
      <CardTitle className="text-2xl font-bold">
        2. Add your subjects
      </CardTitle>
      <p className="text-muted-foreground mt-2 text-sm mb-2">
        Add the subjects you're doing this sem, e.g. MATH1002
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        {subjects.map((subject, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              placeholder={`Subject ${idx + 1}`}
              value={subject}
              onChange={(e) => handleSubjectChange(idx, e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => handleRemoveSubject(idx)}
              disabled={subjects.length === 1}
            >
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        type="button"
        onClick={handleAddSubject}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add subject
      </Button>
    </CardContent>
  </>


  // const sharePage = <>
  //     <CardHeader>
  //       <CardTitle className="text-2xl font-bold">
  //         3. Choose to add friends
  //       </CardTitle>
  //       <p className="text-muted-foreground mt-2 text-sm mb-2">
  //       </p>
  //     </CardHeader>
  //     <CardContent className="space-y-6">
  //       <div>
  //                     <Label htmlFor="share">
  //                       📣 Share your study activity with friends?
  //                     </Label>
  //                     <p className="text-muted-foreground text-sm">
  //                       They’ll see your current subjects, when you’re studying, and
  //                       kudos in the weekly recap.
  //                     </p>
  //                   </div>
  //                   <div className="flex flex-row gap-32">
  //                     <UserIcon />
  //                     <UsersIcon />
  //                   </div>
  //                   {/* <Switch
  //                     id="share"
  //                     checked={shareActivity}
  //                     onCheckedChange={setShareActivity}
  //                   /> */}
  //     </CardContent>
  //   </>

  const pages = [welcomePage, hoursPage, subjectsPage];
  const animatePageTransition = async (currentIndex: number, offset: 1 | -1): Promise<void> => {
    setVisible(false);
    await sleep(transitionNum + 500);
    setPageIndex((currentIndex + offset) % pages.length);
    setVisible(true);
  };
  const canGoBack = pageIndex > 0;
  const canGoForward = pageIndex < pages.length - 1;

  return (
    <div className="flex flex-col justify-center items-center mt-32">
      <Card className={`${hidePage ? "opacity-0" : ""} transition-opacity ${transitionTailwind} border-border w-full max-w-xl border-2 shadow-2xl`}>
        <div
          className={`transition-opacity ${transitionTailwind} ${visible ? "opacity-100" : "opacity-0"
            }`}
        >
          {
            pages[pageIndex]
          }
        </div>

        <div className=" flex items-center space-x-2 mt-20 bottom-32 self-center">
          <Button
            variant="outline"
            onClick={() => canGoBack && animatePageTransition(pageIndex, -1)}
            disabled={!canGoBack}
            className={`transition-colors ${canGoBack
              ? "text-black hover:bg-muted"
              : "text-muted-foreground cursor-not-allowed"
              }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* <span className="text-sm text-muted-foreground">
            Page {pageIndex + 1} / {pages.length}
          </span> */}

          {
            canGoForward
            ? <Button
              variant="outline"
              onClick={() => canGoForward && animatePageTransition(pageIndex, 1)}
              // disabled={!canGoForward}
              className={`transition-colors ml-auto ${canGoForward
                ? "text-black hover:bg-muted"
                : "text-muted-foreground cursor-not-allowed"
                }`}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            : <Button
              variant="outline"
              onClick={handleContinue}
              className="transition-colors text-black hover:bg-muted"
            >
              Finish
            </Button>
          }
        </div>
      </Card>
    </div>
  );
}
