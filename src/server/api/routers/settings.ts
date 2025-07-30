import { z } from "zod";
import { ColourType } from "@prisma/client"; // Assuming your Prisma enum
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const settingsRouter = createTRPCRouter({
  createSubject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        colour: z.nativeEnum(ColourType),
        order: z.number().int().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) throw new Error("Unauthorized");
      await ctx.db.subject.create({
        data: {
          userId,
          name: input.name,
          colour: input.colour,
          order: input.order ?? 0,
        },
      });
    }),

  deleteSubject: protectedProcedure
    .input(
      z.object({
        subjectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) throw new Error("Unauthorized");
      // Optional: verify subject belongs to user before deleting
      await ctx.db.subject.deleteMany({
        where: { id: input.subjectId, userId },
      });
    }),

  updateSubject: protectedProcedure
    .input(
      z.object({
        subjectId: z.string(),
        newName: z.string().optional(),
        newColour: z.nativeEnum(ColourType).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) throw new Error("Unauthorized");

      const dataToUpdate: Partial<{ name: string; colour: ColourType }> = {};
      if (input.newName !== undefined) dataToUpdate.name = input.newName;
      if (input.newColour !== undefined) dataToUpdate.colour = input.newColour;

      if (Object.keys(dataToUpdate).length === 0) return; // nothing to update

      await ctx.db.subject.updateMany({
        where: { id: input.subjectId, userId },
        data: dataToUpdate,
      });
    }),

  updateGoal: protectedProcedure
    .input(
      z.object({
        newGoal: z.number().int().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) throw new Error("Unauthorized");

      // Upsert user preferences with new goal
      await ctx.db.preferences.upsert({
        where: { userId },
        update: { goal: input.newGoal },
        create: { userId, goal: input.newGoal, shareActivity: false },
      });
    }),
});
