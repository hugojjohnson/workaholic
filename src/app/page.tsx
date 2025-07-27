import { SessionProvider } from "next-auth/react";
import Dashboard from "~/components/dashboard/Dashboard";

import LandingPage from "~/components/welcome/LandingPage";
import SetUpPreferences from "~/components/welcome/SetUpPreferences";
import { LogsProvider } from "~/hooks/LogsContext";
import { TimerProvider } from "~/hooks/TimerContext";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <LandingPage />
  }

  if (!session?.user.preferences) {
    return <HydrateClient>
      <SessionProvider session={session}>
        <SetUpPreferences />
      </SessionProvider>
    </HydrateClient>
  }

  return (
    <HydrateClient>
      <SessionProvider session={session}>
        <LogsProvider>
          <TimerProvider>
            <Dashboard />
          </TimerProvider>
        </LogsProvider>
      </SessionProvider>
    </HydrateClient>
  );
}
