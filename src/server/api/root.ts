import {
	createCallerFactory,
	createTRPCContext,
	createTRPCRouter,
} from "~/server/api/trpc";
import { appointmentRouter } from "./routers/appointment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	appointment: appointmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

const headers = new Headers();

const context = await createTRPCContext({
	headers,
});

// Create the caller with the context
export const res = createCaller(context);
