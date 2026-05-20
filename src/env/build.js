import { createEnv } from "@t3-oss/env-nextjs";

import { clientSchema, serverSchema, sharedSchema } from "./schema.js";

createEnv({
  server: serverSchema,
  client: clientSchema,
  shared: sharedSchema,
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV ?? process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

