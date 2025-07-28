"use client";
import { LogsProvider } from "~/hooks/LogsContext";
import { TimerProvider } from "~/hooks/TimerContext";


interface Props {
    children: React.ReactNode;
}
export function ProviderWrapper({ children }: Props) {

    return <LogsProvider>
        <TimerProvider>
            {children}
        </TimerProvider>
    </LogsProvider>
}