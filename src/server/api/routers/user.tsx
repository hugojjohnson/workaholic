import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id: input.userId,
        },
        include: {
          preferences: true,
          subjects: true,
        },
      });
      if (!user) {
        throw new Error("User could not be found.");
      }
      if (!user.preferences) {
        throw new Error("Preferences could not be found.");
      }
      // Convince the compiler preferences is safe.
      return {
        ...user,
        preferences: user.preferences,
      };
    }),
});
