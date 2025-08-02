'use client'

import { BlocksIcon, BugIcon } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const FEATURES = [
    {
        value: "multiplayer",
        label: "Multiplayer",
        description: "Play with or against other people in real-time",
    },
    {
        value: "gamification",
        label: "Gamification",
        description: "Add points, badges, and levels to keep users engaged",
    },
    {
        value: "other",
        label: "Other",
        description: "Suggest your own feature idea",
    },
] as const

export default function FeatureDialogue() {
    const [feature, setFeature] = React.useState<string>("")
    const [otherText, setOtherText] = React.useState<string>("")
    const [firstRender, setFirstRender] = React.useState(true);


    const handleSubmit = () => {
        const output =
            feature === "other"
                ? `Feature requested: Other - ${otherText}`
                : `Feature requested: ${feature}`

        alert(output)
    }

    return (
        <Dialog onOpenChange={open => {
            setFirstRender(open)
            const timeout = setTimeout(() => setFirstRender(!open), 3);
            return () => clearTimeout(timeout);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="hover:cursor-pointer w-10 h-10 mr-8">
                    <BlocksIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
                            <Label htmlFor="otherText">Tell us more</Label>
                            <Input
                                id="otherText"
                                placeholder="Your custom idea..."
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
            </DialogContent>
        </Dialog>
    )
}
