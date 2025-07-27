import { SessionProvider } from "next-auth/react";

import LandingPage from "~/components/welcome/LandingPage";
import SetUpPreferences from "~/components/welcome/SetUpPreferences";
import SignInButton from "~/components/welcome/SignInButton";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <LandingPage />
  }
  return (
    <HydrateClient>
      <SessionProvider>
      {
        session?.user.preferences
        ? <div>hi</div>
        : <SetUpPreferences />
      }
      </SessionProvider>
      <div>hi</div>
    </HydrateClient>
  );
}
