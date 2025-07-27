import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import LandingPage from "~/components/welcome/LandingPage";
import SignInButton from "~/components/welcome/SignInButton";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <LandingPage />
    return (
      <main className="flex flex-col items-center justify-center bg-gray-50 px-4 h-screen">
        <div className="max-w-md w-full rounded-lg border border-gray-200 bg-white p-10 text-center shadow-md">
          <h1 className="mb-6 text-3xl font-semibold text-gray-900">
            Sign in to your workspace
          </h1>
          <p className="mb-8 text-gray-600">
            Welcome back! Please sign in to continue managing your data.
          </p>
          <SignInButton />
        </div>
        <footer className="mt-12 text-center text-gray-400">
          © {new Date().getFullYear()} Hugo's Airtable Clone
        </footer>
      </main>
    );
  }

  if (!session?.user.preferences) {
    return (
      <main className="flex flex-col items-center justify-center bg-gray-50 px-4 h-screen">
        <div className="max-w-md w-full rounded-lg border border-gray-200 bg-white p-10 text-center shadow-md">
          <h1 className="mb-6 text-3xl font-semibold text-gray-900">
            Sign in to your workspace
          </h1>
          <p className="mb-8 text-gray-600">
            Welcome back! Please sign in to continue managing your data.
          </p>
          {/* <SignInButton /> */}
        </div>
        <footer className="mt-12 text-center text-gray-400">
          © {new Date().getFullYear()} Hugo's Airtable Clone
        </footer>
      </main>
    );
  }

  return (
    <HydrateClient>
      <div>hi</div>
    </HydrateClient>
  );
}
