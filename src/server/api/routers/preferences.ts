import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { ColourType } from "@prisma/client";

const COLOURS: ColourType[] = ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "PINK", "PURPLE"]
const defaultSemesterFromDate = (date: Date): string =>
  `${date.getFullYear()}S${date.getMonth() < 6 ? "1" : "2"}`;

export const preferencesRouter = createTRPCRouter({
  // Upsert preferences for current user
  upsert: protectedProcedure
    .input(
      z.object({
        shareActivity: z.boolean(),
        goal: z.number().min(1).max(168), // max hours/week = 7*24
        subjects: z.array(z.string()).min(1),
        semesterStart: z.date(),
        semesterFinish: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (input.semesterStart >= input.semesterFinish) {
        throw new Error("semesterFinish must be after semesterStart.");
      }
      const semester = defaultSemesterFromDate(input.semesterStart);

      await ctx.db.preferences.upsert({
        where: { userId: userId },
        update: {
          shareActivity: input.shareActivity,
          goal: input.goal,
          semester,
          semesterStart: input.semesterStart,
          semesterFinish: input.semesterFinish,
        },
        create: {
          userId: userId,
          shareActivity: input.shareActivity,
          goal: input.goal,
          semester,
          semesterStart: input.semesterStart,
          semesterFinish: input.semesterFinish
        },
      });
      await ctx.db.subject.createMany({
        data: input.subjects.map((subject, i) => ({
          userId,
          semester,
          name: subject,
          colour: COLOURS[i] ?? "RED",
          order: i,
        })),
        skipDuplicates: true,
      });

      const firstSubject = await ctx.db.subject.findFirst({
        where: { userId, semester },
      });
      if (!firstSubject) {
        throw new Error("could not find firstSubject.");
      }

      await ctx.db.timer.create({
        data: {
          userId,
          subjectId: firstSubject.id,
          duration: 30,
          tags: [],
          description: "",
        },
      });
    }),

  rolloverSemester: protectedProcedure
    .input(
      z.object({
        semester: z.string().trim().min(1),
        semesterStart: z.date(),
        semesterFinish: z.date(),
        subjects: z.array(z.string().trim().min(1)).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (input.semesterStart >= input.semesterFinish) {
        throw new Error("semesterFinish must be after semesterStart.");
      }

      await ctx.db.$transaction(async (tx) => {
        await tx.preferences.update({
          where: { userId },
          data: {
            semester: input.semester,
            semesterStart: input.semesterStart,
            semesterFinish: input.semesterFinish,
          },
        });

        await tx.subject.createMany({
          data: input.subjects.map((subject, i) => ({
            userId,
            semester: input.semester,
            name: subject,
            colour: COLOURS[i] ?? "RED",
            order: i,
          })),
          skipDuplicates: true,
        });

        const firstSubject = await tx.subject.findFirst({
          where: { userId, semester: input.semester },
          orderBy: { order: "asc" },
        });
        if (!firstSubject) {
          throw new Error("could not find firstSubject.");
        }

        await tx.timer.update({
          where: { userId },
          data: {
            subjectId: firstSubject.id,
            startedAt: null,
            pausedAt: null,
            deadlineAt: null,
          },
        });
      });
    }),

  completeIntro: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.preferences.update({
        where: { userId: ctx.session.user.id },
        data: { completedIntro: new Date() },
      });
    }),

  updateShowHeatmap: protectedProcedure
    .input(z.object({
      newVal: z.boolean()
    }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.preferences.update({
        where: { userId: ctx.session.user.id },
        data: { showHeatmap: input.newVal },
      });
    }),
});
