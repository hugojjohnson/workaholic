import Dashboard from "~/components/dashboard/Dashboard";
import LandingPage from "~/components/welcome/LandingPage";
import SetUpPreferences from "~/components/welcome/SetUpPreferences";
import { useUser } from "~/hooks/UserContext";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <LandingPage />;
  }

  if (!session.user.hasSetPreferences) {
    return <SetUpPreferences />;
  }
  return <Dashboard />;
}
