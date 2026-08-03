import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const logsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot access logs for another user." });
      }
      const preferences = await ctx.db.preferences.findUnique({
        where: { userId: input.userId },
        select: { semester: true },
      });
      if (!preferences) {
        throw new Error("Preferences could not be found.");
      }
      const logs = await ctx.db.log.findMany({
        where: {
          userId: input.userId,
          subject: { semester: preferences.semester },
        },
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
      if (input.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot add logs for another user." });
      }
      const preferences = await ctx.db.preferences.findUnique({
        where: { userId: input.userId },
        select: { semester: true },
      });
      if (!preferences) {
        throw new Error("Preferences could not be found.");
      }
      const subject = await ctx.db.subject.findFirst({
        where: {
          id: input.subjectId,
          userId: input.userId,
          semester: preferences.semester,
        },
      });
      if (!subject) {
        throw new Error("Subject could not be found.");
      }

      const existingLog = await ctx.db.log.findFirst({
        where: { userId: input.userId, startedAt: input.startedAt }
      })
      if (existingLog === null) {
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
      } else {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A log for this time has already been submitted." })
      }
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
      if (input.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot edit logs for another user." });
      }
      const preferences = await ctx.db.preferences.findUnique({
        where: { userId: input.userId },
        select: { semester: true },
      });
      if (!preferences) {
        throw new Error("Preferences could not be found.");
      }
      const log = await ctx.db.log.findFirst({
        where: {
          id: input.logId,
          userId: input.userId,
          subject: { semester: preferences.semester },
        },
      });
      if (!log) {
        throw new Error("Log could not be found.");
      }

      // If subjectId is provided, check if the subject exists
      if (input.subjectId) {
        const subject = await ctx.db.subject.findFirst({
          where: {
            id: input.subjectId,
            userId: input.userId,
            semester: preferences.semester,
          },
        });
        if (!subject) {
          throw new Error("Subject could not be found.");
        }
      }

      // Only include fields that are defined
      const data: {
        subjectId?: string;
        startedAt?: Date;
        endedAt?: Date;
        duration?: number;
        description?: string;
      } = {};
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
      if (input.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete logs for another user." });
      }
      await ctx.db.log.delete({
        where: {
          id: input.logId,
          userId: input.userId,
        },
      });
    }),
});
