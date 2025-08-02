// components/welcome/ClientIntroWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import IntroModal from "./IntroModal";
import { api } from "~/trpc/react";

export default function ClientIntroWrapper() {
  const [showIntro, setShowIntro] = useState(false);

  const completeIntro = api.preferences.completeIntro.useMutation({
    onSuccess: () => setShowIntro(false),
  });

  useEffect(() => {
    // if (!isLoading && user?.completedIntro === false) {
      setShowIntro(true);
    // }
  }, []);

  if (!showIntro) return null;

  return <IntroModal onComplete={() => completeIntro.mutate()} />;
}
