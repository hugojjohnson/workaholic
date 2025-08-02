// app/layout.tsx
import "~/styles/globals.css";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { auth } from "~/server/auth";
import { type Metadata } from "next";
import Navbar from "~/components/main/Navbar";
import { ThemeProvider } from "~/components/main/ThemeProvider";
import { ProviderWrapper } from "~/components/main/ProviderWrapper";
import { HydrateClient } from "~/trpc/server";
import ClientIntroWrapper from "~/components/welcome/ClientIntroWrapper";


export const metadata: Metadata = {
  title: "Workaholic",
  description: "Make study a science.",
  icons: [{ rel: "icon", url: "/logo.jpg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return (
      <html lang="en" className={geist.variable} suppressHydrationWarning>
        <body className="h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <HydrateClient>{children}</HydrateClient>
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <HydrateClient>
              <ProviderWrapper session={session}>
                <Navbar />
                {/* Client component to handle intro modal logic */}
                <ClientIntroWrapper />
                {children}
              </ProviderWrapper>
            </HydrateClient>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
