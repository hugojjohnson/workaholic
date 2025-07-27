import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const timerRouter = createTRPCRouter({
  // Upsert preferences for current user
  get: protectedProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
        const timer = ctx.db.timer.findFirst({
            where: {
                userId: input.userId
            }
        })
        if (!timer) {
            throw new Error("Timer could not be found.");
        }
        return timer;
    }),
});