import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { customers } from "~/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export const customerRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				surname: z.string(),
				email: z.string(),
				phone: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			await ctx.db.insert(customers).values({
				name: input.name,
				surname: input.surname,
				email: input.email,
				phone: input.phone,
			});

			return {
				success: true,
				message: "Customer created successfully",
			};
		}),

	getAll: publicProcedure.query(async ({ ctx }) => {
		const customersData = await ctx.db.query.customers.findMany();
		return customersData;
	}),
});

export type CustomersType = InferSelectModel<typeof customers>;
