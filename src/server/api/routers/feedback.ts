import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";

// src/server/telegram/sendMessage.ts
export async function sendTelegramMessage(message: string): Promise<void> {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Missing Telegram config");
  }

  // Who would need to await this? XD
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });
}

export const feedbackRouter = createTRPCRouter({
  sendBug: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        body: z.string()

      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: input.userId }
      })
      const msg = `You received feedback from ${ user?.name }:

${input.title}

${input.body}
      `
      await sendTelegramMessage(msg)
    }),

    featureVote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        feature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: input.userId },
      })
      const msg = `${ user?.name } voted for a feature:

${input.feature}
      `

      await ctx.db.preferences.update({
        where: { userId: input.userId },
        data: { lastFeatureVote: input.feature }
      })
      await sendTelegramMessage(msg)
    }),
});
