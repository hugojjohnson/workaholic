import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
      const user = await ctx.db.user.findFirst({
        where: { id: userId },
      });
      if (!user) {
        throw new Error("User could not be found.");
      }
      if (input.semesterStart >= input.semesterFinish) {
        throw new Error("semesterFinish must be after semesterStart.");
      }

      await ctx.db.preferences.upsert({
        where: { userId: userId },
        update: {
          shareActivity: input.shareActivity,
          goal: input.goal,
        },
        create: {
          userId: userId,
          shareActivity: input.shareActivity,
          goal: input.goal,
          semesterStart: input.semesterStart,
          semesterFinish: input.semesterFinish
        },
      });
      await ctx.db.subject.createMany({
        data: input.subjects.map((subject, i) => ({
          userId,
          name: subject,
          colour: "RED",
          order: i,
        })),
      });

      const firstSubject = await ctx.db.subject.findFirst({
        where: { userId },
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

    completeIntro: protectedProcedure
    .mutation(async ({ ctx }) => {
      // await ctx.db.user.update({
      //   where: { id: ctx.session.user.id },
      //   data: { completedIntro: true },
      // });
    }),
});
