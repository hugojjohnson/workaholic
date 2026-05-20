"use client";

import { createEnv } from "@t3-oss/env-nextjs";

import { clientSchema } from "./schema.js";

export const env = createEnv({
  client: clientSchema,
  experimental__runtimeEnv: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV ?? process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
