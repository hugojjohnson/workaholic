import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, Flame, HeartHandshake, Clock } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-16 flex flex-col items-center gap-12">
      <section className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">Study smarter. Stay consistent.</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Track your study habits, stay accountable, and reflect at the end of the semester.
          No leaderboards. No pressure. Just you, your goals, and your friends cheering you on.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Log In</Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-primary" />
              <h2 className="text-xl font-semibold">Pomodoro & Free-form Timing</h2>
            </div>
            <p className="text-muted-foreground">
              Whether you're a Pomodoro pro or just want to log a chill two-hour sesh, we’ve got you. You choose how you track.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HeartHandshake className="text-primary" />
              <h2 className="text-xl font-semibold">Friend Accountability</h2>
            </div>
            <p className="text-muted-foreground">
              Add friends, share what you're working on, and hype each other up through the weekly GenAI email summaries. No rankings. Just good vibes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="text-primary" />
              <h2 className="text-xl font-semibold">Heatmaps, Streaks & End-of-Sem Insights</h2>
            </div>
            <p className="text-muted-foreground">
              Visualise your grind with semester heatmaps and streaks. Get a nerdy breakdown at the end of the term like "Weeks &lt;15hrs averaged 68%." Use it to reflect & improve.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ArrowRight className="text-primary" />
              <h2 className="text-xl font-semibold">Put Money Where Your Study Is</h2>
            </div>
            <p className="text-muted-foreground">
              Feeling brave? Pledge a donation if you don't hit your goal. If you slack off, the money goes to a cause. Motivation = maxed.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">Your semester, visualised</h2>
        <p className="text-muted-foreground mb-4">
          Every minute you log contributes to your heatmap. Share it on socials, look back on your term, and compare habits to grades.
        </p>
        <img
          src="/demo-heatmap.png"
          alt="Study Heatmap Demo"
          className="rounded-xl shadow-md mx-auto"
        />
      </section>

      <footer className="text-center mt-16 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} StudyTrack. No ads. No spam. Just study.
      </footer>
    </main>
  );
}
