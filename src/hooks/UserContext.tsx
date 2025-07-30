"use client";

import React, {
  createContext,
  useContext,
} from "react";
import { api } from "~/trpc/react";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { useSession } from "next-auth/react";

interface UserContextT {
  user: inferProcedureOutput<AppRouter["user"]["get"]> | undefined;
}

const UserContext = createContext<UserContextT | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  if (!session.data) {
    throw new Error("Session data is undefined.");
  }
  const { data: user } = api.user.get.useQuery({
    userId: session.data.user.id,
  });

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextT => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useTimer must be used within a UserProvider");
  }
  if (context.user) {
    if (!context?.user.preferences) {
      throw new Error("Preferences are not set up.");
    }
    if (!context?.user.subjects) {
      throw new Error("Subjects is undefined.");
    }
    if (context?.user.subjects?.length == 0) {
      throw new Error("The user has no subjects.");
    }
  }
  return context;
};
