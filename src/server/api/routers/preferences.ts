import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const preferencesRouter = createTRPCRouter({
  // Upsert preferences for current user
  upsert: protectedProcedure
    .input(
      z.object({
        shareActivity: z.boolean(),
        goal: z.number().min(1).max(168), // max hours/week = 7*24
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prefs = await ctx.db.preferences.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          shareActivity: input.shareActivity,
          goal: input.goal,
        },
        create: {
          userId: ctx.session.user.id,
          shareActivity: input.shareActivity,
          goal: input.goal,
        },
      });
      return prefs;
    }),
});