"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";


export default function Signin() {
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then(setProviders);
  }, []);

  if (!providers) return <p>Loading sign-in options...</p>;

  // return <AuthForm mode="signup" />

  return (
    <main className="min-h-screen flex justify-center items-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Log In
          </CardTitle>
        </CardHeader>
        <CardContent className="mx-auto">
          {Object.values(providers).map((provider) => (
            <Button key={provider.name} onClick={() => signIn(provider.id)} className="p-5">
              Log in with {provider.name}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google logo"
                className="inline-block w-6 h-6 ml-5"
              />
            </Button>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
