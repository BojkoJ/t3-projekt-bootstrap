import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { designs } from "~/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export const designRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				duration_of_tattooing: z.number(),
				width: z.number(),
				height: z.number(),
				placement: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			await ctx.db.insert(designs).values({
				name: input.name,
				duration_of_tattooing: input.duration_of_tattooing,
				width: input.width,
				height: input.height,
				placement: input.placement,
			});

			return {
				success: true,
				message: "Design created successfully",
			};
		}),

	getAll: publicProcedure.query(async ({ ctx }) => {
		const customersData = await ctx.db.query.customers.findMany();
		return customersData;
	}),
});

export type DesignsType = InferSelectModel<typeof designs>;
