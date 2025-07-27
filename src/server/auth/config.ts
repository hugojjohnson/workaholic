import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Preferences } from "@prisma/client";
import { type DefaultSession, type NextAuthConfig, type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      preferences?: Preferences;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: async ({ session, user }): Promise<Session> => {
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { preferences: true },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          preferences: dbUser?.preferences ?? undefined
        },
      }
    },
  },
} satisfies NextAuthConfig;
