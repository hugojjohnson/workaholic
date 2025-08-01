"use client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { LogsProvider } from "~/hooks/LogsContext";
import { TimerProvider } from "~/hooks/TimerContext";
import { UserProvider } from "~/hooks/UserContext";

interface Props {
  children: React.ReactNode;
  session: Session;
}

export function ProviderWrapper({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <LogsProvider>
          <TimerProvider>{children}</TimerProvider>
        </LogsProvider>
      </UserProvider>
    </SessionProvider>
  );
}
