import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const logsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const logs = await ctx.db.log.findMany({
        where: { userId: input.userId },
      });
      return logs;
    }),

  add: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        subjectId: z.string(),
        startedAt: z.date(),
        endedAt: z.date(),
        duration: z.number(),
        // tagIds: z.array(z.string()),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: input.userId },
      });
      const subject = await ctx.db.subject.findFirst({
        where: { id: input.subjectId },
      });
      if (!user) {
        throw new Error("User could not be found.");
      }
      if (!subject) {
        throw new Error("Subject could not be found.");
      }

      await ctx.db.log.create({
        data: {
          subjectId: input.subjectId,
          startedAt: input.startedAt,
          endedAt: input.endedAt,
          duration: input.duration,
          tags: [],
          description: input.description,
          userId: input.userId,
        },
      });
      // TODO: Return on error on failure
    }),

  edit: protectedProcedure
    .input(
      z.object({
        logId: z.string(),
        userId: z.string(),
        subjectId: z.string().optional(),
        startedAt: z.date().optional(),
        endedAt: z.date().optional(),
        duration: z.number().optional(),
        description: z.string().optional(),
        // tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const log = await ctx.db.log.findFirst({
        where: { id: input.logId },
      });
      if (!log) {
        throw new Error("Log could not be found.");
      }

      const user = await ctx.db.user.findFirst({
        where: { id: input.userId },
      });
      if (!user) {
        throw new Error("User could not be found.");
      }

      // If subjectId is provided, check if the subject exists
      if (input.subjectId) {
        const subject = await ctx.db.subject.findFirst({
          where: { id: input.subjectId },
        });
        if (!subject) {
          throw new Error("Subject could not be found.");
        }
      }

      // Only include fields that are defined
      const data: any = {};
      if (input.subjectId) data.subjectId = input.subjectId;
      if (input.startedAt) data.startedAt = input.startedAt;
      if (input.endedAt) data.endedAt = input.endedAt;
      if (input.duration) data.duration = input.duration;
      if (input.description) data.description = input.description;
      // TODO: handle tags if needed

      await ctx.db.log.update({
        where: { id: input.logId },
        data,
      });

      return { success: true };
    }),


  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        logId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.log.delete({
        where: {
          id: input.logId,
          userId: input.userId,
        },
      });
    }),
});
