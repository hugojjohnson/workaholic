'use client'

import { BugIcon } from 'lucide-react'
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

export default function BugDialogue() {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")

  const handleSubmit = () => {
    alert(`Feedback submitted!\n\nTitle: ${title}\nDescription: ${description}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:cursor-pointer w-10 h-10 mr-3">
          <BugIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit a bug</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className='text-sm'>Something not working? Send me a message and I'll get it fixed as soon as I can!</p>
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
      </DialogContent>
    </Dialog>
  )
}
