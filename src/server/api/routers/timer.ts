import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const timerRouter = createTRPCRouter({
  // Upsert preferences for current user
  get: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const timer = await ctx.db.timer.findFirst({
        where: {
          userId: input.userId,
        },
      });
      if (!timer) {
        throw new Error("Timer could not be found.");
      }
      return timer;
    }),

  update: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
        startedAt: z.date().nullable(),
        pausedAt: z.date().nullable(),
        deadlineAt: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.timer.update({
        where: {
          id: input.timerId,
        },
        data: {
          startedAt: input.startedAt,
          pausedAt: input.pausedAt,
          deadlineAt: input.deadlineAt,
        },
      });
    }),

  updateInfo: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
        description: z.optional(z.string()),
        duration: z.optional(z.number().int()),
        tags: z.optional(z.array(z.string())),
        subjectId: z.optional(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.timer.update({
        where: {
          id: input.timerId,
        },
        data: {
          description: input.description,
          duration: input.duration,
          tags: input.tags,
          subjectId: input.subjectId,
        },
      });
    }),
});
