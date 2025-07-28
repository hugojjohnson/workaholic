import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const logsRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(
            z.object({
                userId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const logs = await ctx.db.log.findMany({
                where: { userId: input.userId }
            })
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
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findFirst({
                where: { id: input.userId }
            })
            const subject = await ctx.db.subject.findFirst({
                where: { id: input.subjectId }
            })
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
                    userId: input.userId
                }
            })
            // TODO: Return on error on failure
        }),
    
        delete: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                logId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db.log.delete({
                where: {
                    id: input.logId,
                    userId: input.userId
                }
            })
        }),
});