"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useTimer } from "~/hooks/TimerContext";

export function ConfirmCancel() {
  const [open, setOpen] = React.useState(false);

  const timer = useTimer();

  const handleLog = () => {
    if (!timer.timer) {
        throw new Error("timer.timer is undefined.");
    }
    const minutesLeft = timer.timer?.duration - (timer.minutesLeft + timer.secondsLeft/60);
    console.log(`gonna log with ${minutesLeft} minutes left.`);
    timer.addHalfLog(minutesLeft);
    setOpen(false);
  };

  const handleDoNotLog = () => {
    timer.stop();
    setOpen(false);
  };

  React.useEffect(() => {
    console.log(`${open}, ${!timer.paused}`)
    if (open && !timer.paused) {
        timer.pause();
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute right-10 mt-9 h-10 w-10 rounded-full"
        //   onClick={() => timer.stop()}
        //   disabled={timer.disabled}
        >
          X
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to log the time you've spent so far?</DialogTitle>
          <DialogDescription>
            You can log your work now or choose not to log it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="secondary" onClick={handleDoNotLog}>
            Do Not Log
          </Button>
          <Button onClick={handleLog}>
            Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}