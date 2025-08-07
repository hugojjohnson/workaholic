'use client'

import * as React from 'react'
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { api } from '~/trpc/react'

export default function BugDialogue({ userId }: { userId: string }) {
  const [finished, setFinished] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")

  const sendBug = api.feedback.sendBug.useMutation({
    onMutate: () => {
      setFinished(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    },
  });

  const handleSubmit = () => {
    sendBug.mutate({
      userId,
      title,
      body: description
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 mr-3">Report a bug</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {finished
          ? <>
            <DialogHeader>
              Thank you!
            </DialogHeader>
            <p>I&apos;ll get back to you as soon as I can!</p>
          </>
          : <><DialogHeader>
            <DialogTitle>Submit a bug</DialogTitle>
          </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className='text-sm'>Something not working? Send me a message and I&apos;ll get it fixed as soon as I can!</p>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Describe your feedback..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogTrigger>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </>
        }
      </DialogContent>
    </Dialog>
  )
}
