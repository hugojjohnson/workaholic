import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { preferencesRouter } from "./routers/preferences";
import { logsRouter } from "./routers/logs";
import { timerRouter } from "./routers/timer";
import { settingsRouter } from "./routers/settings";
import { userRouter } from "./routers/user";
import { feedbackRouter } from "./routers/feedback";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  preferences: preferencesRouter,
  logs: logsRouter,
  timer: timerRouter,
  settings: settingsRouter,
  user: userRouter,
  feedback: feedbackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
