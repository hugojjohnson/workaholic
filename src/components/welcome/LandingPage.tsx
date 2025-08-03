import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, Flame, HeartHandshake, Clock } from "lucide-react";
import DemoHeatmap from "~/components/reports/DemoHeatmap";
import Link from "next/link";
import DemoReport from "../reports/DemoReport";

export default function LandingPage() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center gap-12 p-6 md:p-16">
      <section className="max-w-3xl text-center">
        <h1 className="mb-4 text-5xl font-bold">
          Study smarter. Stay consistent.
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Turn studying into a science this semester by systematically tracking your study sessions.
          Log when and what you study, then analyze your habits over time to optimize the way you learn.
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
                Identify peak productivity times
              </h2>
            </div>
            <p className="text-muted-foreground">
              Discover the hours when your brain is firing on all cylinders.
              Use this insight to schedule your toughest study sessions for maximum focus and efficiency.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <HeartHandshake className="text-primary" />
              <h2 className="text-xl font-semibold">Manage your subject spread</h2>
            </div>
            <p className="text-muted-foreground">
              Keep a balanced approach by tracking how much time you spend on each subject.
              Avoid last-minute cramming by distributing your effort evenly across all topics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Flame className="text-primary" />
              <h2 className="text-xl font-semibold">
                Stay accountable and motivated
              </h2>
            </div>
            <p className="text-muted-foreground">
              Seeing your study log grow keeps you honest and driven.
              Celebrate your progress and turn consistency into a habit you actually stick to.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <ArrowRight className="text-primary" />
              <h2 className="text-xl font-semibold">
                Make data-driven adjustments
              </h2>
            </div>
            <p className="text-muted-foreground">
              Analyze your study patterns to find what’s working—and what’s not.
              Adapt your strategy based on real data, not just guesswork, for smarter learning.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold">Your semester, visualised</h2>
        <p className="text-muted-foreground mb-4">
          Every minute you log contributes to your heatmap. Maximise your consistency,
          look back on your term, and compare habits to grades.
        </p>
        <DemoReport />
        <DemoHeatmap />
      </section>

      <Link href="/signup">
        <Button size="lg">Get Started</Button>
      </Link>

      <footer className="text-muted-foreground mt-16 text-center text-sm">
        &copy; {new Date().getFullYear()} Workaholic
      </footer>
    </main>
  );
}
