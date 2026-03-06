import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot access another user." });
      }
      const preferences = await ctx.db.preferences.findUnique({
        where: { userId: input.userId },
      });
      if (!preferences) {
        throw new Error("Preferences could not be found.");
      }
      const user = await ctx.db.user.findFirst({
        where: {
          id: input.userId,
        },
        include: {
          preferences: true,
          subjects: {
            where: { semester: preferences.semester },
            orderBy: { order: "asc" },
          },
        },
      });
      if (!user) {
        throw new Error("User could not be found.");
      }
      // Convince the compiler preferences is safe.
      return {
        ...user,
        preferences,
      };
    }),

    delete: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.delete({
        where: {
          id: input.userId
        }
      })
    }),

});
