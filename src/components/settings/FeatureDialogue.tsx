'use client'

import { BlocksIcon } from 'lucide-react'
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
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { api } from '~/trpc/react'


const FEATURES = [
    {
        value: "Friend Activity",
        label: "friendActivity",
        description: "Add friends and see live when they're studying - motivate each other and grow together.",
    },
    {
        value: "Export to csv/json",
        label: "csv",
        description: "Download your data and analyse it yourself!",
    },
    {
        value: "Weekly emails",
        label: "weeklyEmails",
        description: "Optional weekly emails breaking down your habits for the week, analysed with ai. Option to out at any time.",
    },
    {
        value: "Sign up with email",
        label: "emailSignUp",
        description: "Sign up with your email instead of Google.",
    },
    {
        value: "other",
        label: "Other",
        description: "Suggest your own feature!",
    },
] as const

export default function FeatureDialogue({ userId, vote }: { userId: string, vote: string | null }) {
    const [finished, setFinished] = React.useState(!!vote);
    const [open, setOpen] = React.useState(false);
    const [feature, setFeature] = React.useState<string>("")
    const [otherText, setOtherText] = React.useState<string>("")
    const [firstRender, setFirstRender] = React.useState(true);


    const sendVote = api.feedback.featureVote.useMutation({
        onMutate: () => {
            setFinished(true);
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        },
        onSuccess: () => {
            console.log("success!")
        }
    });


    const handleSubmit = () => {
        sendVote.mutate({ userId, feature})
    }

    return (
        <Dialog open={open} onOpenChange={open => {
            setFirstRender(open)
            setOpen(open)
            const timeout = setTimeout(() => setFirstRender(!open), 3);
            return () => clearTimeout(timeout);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="hover:cursor-pointer w-10 h-10 mr-8">
                    <BlocksIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {finished
                    ? <>
                        <DialogHeader>
                            <DialogTitle>Thank you!</DialogTitle>
                        </DialogHeader>
                        <div>
                            Your vote has been recorded.
                        </div>
                    </>
                    : <>
                        <DialogHeader>
                            <DialogTitle>Request a Feature</DialogTitle>
                        </DialogHeader>
                        <p className='text-sm'>Help shape the next steps of Workaholic: vote for what you want to see!</p>
                        <div className="grid gap-4 py-4">
                            <RadioGroup
                                value={feature}
                                onValueChange={setFeature}
                                className="grid gap-0"
                            >
                                {!firstRender && FEATURES.map((f) => (
                                    <Tooltip key={f.value} delayDuration={300}>

                                        <TooltipTrigger asChild>
                                            <Label
                                                htmlFor={f.value}
                                                className="flex items-center gap-3 border rounded-md px-4 py-2 hover:bg-muted cursor-pointer"
                                            >
                                                <RadioGroupItem id={f.value} value={f.value} />
                                                <span className="capitalize">{f.label}</span>
                                            </Label>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs">
                                            <p className="text-sm text-muted-foreground">{f.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </RadioGroup>

                            {feature === "other" && (
                                <div className="grid gap-2">
                                    <Label htmlFor="otherText">Suggest a feature</Label>
                                    <Input
                                        id="otherText"
                                        placeholder="Your idea..."
                                        value={otherText}
                                        onChange={(e) => setOtherText(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <DialogTrigger asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogTrigger>
                            <Button
                                onClick={handleSubmit}
                                disabled={!feature || (feature === "other" && !otherText)}
                            >
                                Submit
                            </Button>
                        </DialogFooter>
                    </>
                }
            </DialogContent>
        </Dialog>
    )
}
