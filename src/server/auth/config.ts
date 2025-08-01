import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  type DefaultSession,
  type NextAuthConfig,
  type Session,
} from "next-auth";
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
      hasSetPreferences: boolean;
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
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async redirect() {
      // Customize this logic as needed
      return `/`; // or any page you want
    },
    session: async ({ session, user }): Promise<Session> => {
      const userPreferences = await db.preferences.findUnique({
        where: { userId: user.id },
      });

      return {
        ...session,
        user: {
          ...session.user,
          hasSetPreferences: !!userPreferences,
          // id: user.id,
          // preferences: dbUser?.preferences ?? undefined,
          // timer: dbUser?.timer ?? undefined,
          // subjects: dbUser?.subjects ?? undefined
        },
      };
    },
  },
} satisfies NextAuthConfig;
