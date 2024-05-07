import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { appointments, customers, designs } from "~/server/db/schema";
import { db } from "~/server/db";
import type { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { eq } from "drizzle-orm"; // Ensure you import the `eq` function for comparing columns

export type CombinedAppointmentData = {
	id_appointment: number;
	date: string | null; // Allow null
	time: string | null; // Allow null
	id_customer: number | undefined;
	firstName: string | null; // Allow null
	lastName: string | null; // Allow null
	email: string | null; // Allow null
	phone: string | null; // Allow null
	id_design: number | null; // Allow null
	designName: string | null; // Allow null
	duration: number | null; // Allow null
	width: number | null; // Allow null
	height: number | null; // Allow null
	placement: string | null; // Allow null
};

export const appointmentRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				date: z.string(),
				time: z.string(),
				id_customer: z.number(),
				id_design: z.number(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(appointments).values({
				date: input.date,
				time: input.time,
				id_customer: input.id_customer,
				id_design: input.id_design,
			});

			return {
				success: true,
				message: "Appointment created successfully",
			};
		}),

	getAll: publicProcedure.query(async ({}) => {
		// Execute the query using `leftJoin` and the join condition
		const combinedData = await db
			.select({
				id_appointment: appointments.id_appointment,
				date: appointments.date,
				time: appointments.time,
				customer: {
					id: customers.id_customer,
					name: customers.name,
					surname: customers.surname,
					email: customers.email,
					phone: customers.phone,
				},
				design: {
					id: designs.id_design,
					name: designs.name,
					duration_of_tattooing: designs.duration_of_tattooing,
					width: designs.width,
					height: designs.height,
					placement: designs.placement,
				},
			})
			.from(appointments)
			.leftJoin(
				customers,
				eq(appointments.id_customer, customers.id_customer)
			) // Pass the join condition here
			.leftJoin(designs, eq(appointments.id_design, designs.id_design))
			.execute();

		// Transform the combined data to match the CombinedAppointmentData type
		const transformedData: CombinedAppointmentData[] = combinedData.map(
			(data) => ({
				id_appointment: data.id_appointment,
				date: data.date ?? "N/A",
				time: data.time ?? "N/A",
				id_customer: data.customer?.id,
				firstName: data.customer?.name ?? "N/A",
				lastName: data.customer?.surname ?? "N/A",
				email: data.customer?.email ?? "N/A",
				phone: data.customer?.phone ?? "N/A",
				id_design: data.design?.id ?? null,
				designName: data.design?.name ?? "N/A",
				duration: data.design?.duration_of_tattooing ?? null,
				width: data.design?.width ?? null,
				height: data.design?.height ?? null,
				placement: data.design?.placement ?? "N/A",
			})
		);

		// Return the transformed data
		return transformedData;
	}),
});

export type AppointmentType = InferSelectModel<typeof appointments>;
