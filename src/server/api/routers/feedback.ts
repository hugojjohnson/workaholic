import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const feedbackRouter = createTRPCRouter({
  sendBug: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        body: z.string()

      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (input.userId !== userId) {
        throw new Error("Unauthorized.");
      }
      // Intentionally no-op: feedback is accepted but not forwarded anywhere.
    }),

  featureVote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        feature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (input.userId !== userId) {
        throw new Error("Unauthorized.");
      }

      await ctx.db.preferences.update({
        where: { userId },
        data: { lastFeatureVote: input.feature }
      })
      // Intentionally no-op: vote is stored only.
    }),
});
