import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import type { Preferences } from "@prisma/client";


// Designed for use in the main body of my app, where the user is signed in and has preferences.
// At the moment it throws an error when one of these is undefined, but eventually it'll redirect.
type SafeUser = Omit<NonNullable<Session["user"]>, "preferences"> & {
  preferences: Preferences;
};
export function useUser(): SafeUser {
  const { data: session, status } = useSession();

  if (status === "loading") {
    throw new Error("Session is still loading"); // or return null, your choice
  }

  if (!session?.user) {
    throw new Error("User is not authenticated");
  }
  if (!session?.user.preferences) {
    throw new Error("Preferences are not set up.");
  }

  // Asserting preferences is well defined
  return session.user as SafeUser;
}