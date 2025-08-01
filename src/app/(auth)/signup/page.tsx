"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import type { ClientSafeProvider } from "node_modules/next-auth/lib/client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import LoadingPage from "~/components/welcome/LoadingPage";

export default function Signup() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    void fetch("/api/auth/providers")
      .then((res) => res.json())
      .then(setProviders);
  }, []);

  // if (!providers) return <p>Loading sign-in options...</p>;

  // return <AuthForm mode="signup" />

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent className="mx-auto">
          {providers
          ? Object.values(providers).map((provider) => (
            <Button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="p-5"
            >
              Sign up with {provider.name}
              <Image
                width={8}
                height={8}
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google logo"
                className="ml-5 inline-block h-6 w-6"
              />
            </Button>
          ))
          : <LoadingPage />
        }
        </CardContent>
      </Card>
    </main>
  );
}
