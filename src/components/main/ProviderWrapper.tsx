"use client";
import { SessionProvider } from "next-auth/react";
import { LogsProvider } from "~/hooks/LogsContext";
import { TimerProvider } from "~/hooks/TimerContext";

interface Props {
  children: React.ReactNode;
  session: any;
}

export function ProviderWrapper({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <LogsProvider>
        <TimerProvider>{children}</TimerProvider>
      </LogsProvider>
    </SessionProvider>
  );
}
