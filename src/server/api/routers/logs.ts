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
                // tagIds: z.array(z.string()),
                notes: z.string(),
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

            const newLog = await ctx.db.log.create({
                data: {
                    subjectId: input.subjectId,
                    startedAt: input.startedAt,
                    endedAt: input.endedAt,
                    tags: [],
                    notes: input.notes,
                    userId: input.userId
                }
            })
            const logs = await ctx.db.log.findMany({
                where: { userId: input.userId }
            })
            return logs;
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