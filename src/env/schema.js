import { z } from "zod";

export const serverSchema = {
  AUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string()
      : z.string().optional(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
};

export const clientSchema = {
  NEXT_PUBLIC_ENV: z.enum(["development", "test", "production"]),
};

export const sharedSchema = {
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
};

