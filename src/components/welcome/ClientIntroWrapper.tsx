// components/welcome/ClientIntroWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import IntroModal from "./IntroModal";
import { api } from "~/trpc/react";
import { useUser } from "~/hooks/UserContext";

export default function ClientIntroWrapper() {
  const user = useUser();
  const [showIntro, setShowIntro] = useState(false);

  const completeIntro = api.preferences.completeIntro.useMutation({
    onSuccess: () => setShowIntro(false),
  });

  useEffect(() => {
    if (user && user?.user?.preferences.completedIntro) {
      setShowIntro(true);
    }
  }, []);

  if (!showIntro) return null;

  return <IntroModal onComplete={() => completeIntro.mutate()} />;
}
