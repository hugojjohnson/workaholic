import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, Flame, HeartHandshake, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center gap-12 p-6 md:p-16">
      <section className="max-w-3xl text-center">
        <h1 className="mb-4 text-5xl font-bold">
          Study smarter. Stay consistent.
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Track your study habits, stay accountable, and reflect at the end of
          the semester. No leaderboards. No pressure. Just you, your goals, and
          your friends cheering you on.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Log In
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Clock className="text-primary" />
              <h2 className="text-xl font-semibold">
                Pomodoro & Free-form Timing
              </h2>
            </div>
            <p className="text-muted-foreground">
              Whether you&apos;re a Pomodoro pro or just want to log a chill two-hour
              sesh, we&apos;ve got you. You choose how you track.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <HeartHandshake className="text-primary" />
              <h2 className="text-xl font-semibold">Friend Accountability</h2>
            </div>
            <p className="text-muted-foreground">
              Add friends, share what you&apos;re working on, and hype each other up
              through the weekly GenAI email summaries. No rankings. Just good
              vibes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Flame className="text-primary" />
              <h2 className="text-xl font-semibold">
                Heatmaps, Streaks & End-of-Sem Insights
              </h2>
            </div>
            <p className="text-muted-foreground">
              Visualise your grind with semester heatmaps and streaks. Get a
              nerdy breakdown at the end of the term like &quot;Weeks &lt;15hrs
              averaged 68%.&quot; Use it to reflect & improve.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <ArrowRight className="text-primary" />
              <h2 className="text-xl font-semibold">
                Put Money Where Your Study Is
              </h2>
            </div>
            <p className="text-muted-foreground">
              Feeling brave? Pledge a donation if you don&apos;t hit your goal. If
              you slack off, the money goes to a cause. Motivation = maxed.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold">Your semester, visualised</h2>
        <p className="text-muted-foreground mb-4">
          Every minute you log contributes to your heatmap. Share it on socials,
          look back on your term, and compare habits to grades.
        </p>
        <Image
          src="/demo-heatmap.png"
          alt="Study Heatmap Demo"
          className="mx-auto rounded-xl shadow-md"
        />
      </section>

      <footer className="text-muted-foreground mt-16 text-center text-sm">
        &copy; {new Date().getFullYear()} StudyTrack. No ads. No spam. Just
        study.
      </footer>
    </main>
  );
}
