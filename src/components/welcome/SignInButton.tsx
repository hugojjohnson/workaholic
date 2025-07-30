"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import type { ClientSafeProvider } from "node_modules/next-auth/lib/client";
import { useEffect, useState } from "react";

export default function SignInButton() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    void fetch("/api/auth/providers")
      .then((res) => res.json())
      .then(setProviders);
  }, []);

  if (!providers) return <p>Loading sign-in options...</p>;

  return (
    <div>
      {Object.values(providers).map((provider) => (
        <button
          key={provider.name}
          onClick={() => signIn(provider.id)}
          className="inline-block rounded-md border-[2px] border-gray-300 bg-white px-3 py-3 transition hover:bg-gray-50"
        >
          Sign in with {provider.name}
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google logo"
            className="ml-5 inline-block h-5 w-5"
          />
        </button>
      ))}
    </div>
  );
}
