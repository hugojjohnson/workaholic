"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";


export default function Signup() {
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
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent className="mx-auto">
          {Object.values(providers).map((provider) => (
            <button key={provider.name} onClick={() => signIn(provider.id)} className="border-[2px] border-gray-300 inline-block rounded-md px-3 py-3 transition bg-white hover:bg-gray-50">
              Sign up with {provider.name}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google logo"
                className="inline-block w-5 h-5 ml-5"
              />
            </button>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
