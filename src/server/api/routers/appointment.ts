import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { appointments, customers, designs } from "~/server/db/schema";
import { db } from "~/server/db";
import type { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { eq } from "drizzle-orm";

export type CombinedAppointmentData = {
	id_appointment: number | null;
	date: string | null;
	time: string | null;
	id_customer: number | undefined | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	phone: string | null;
	id_design: number | null;
	designName: string | null;
	duration: number | null;
	width: number | null;
	height: number | null;
	placement: string | null;
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
	// Define the `getOne` query
	getOne: publicProcedure
		// Define input validation using `zod`
		.input(
			z.object({
				appointment_id: z.number().int().optional(),
			})
		)
		.query(async ({ input }) => {
			// Destructure the `appointment_id` from the input
			const { appointment_id } = input;

			// Check if `appointment_id` is provided
			if (appointment_id === undefined) {
				// Return an object with null values for all fields if `appointment_id` is not provided
				return {
					id_appointment: null,
					date: null,
					time: null,
					id_customer: null,
					firstName: null,
					lastName: null,
					email: null,
					phone: null,
					id_design: null,
					designName: null,
					duration: null,
					width: null,
					height: null,
					placement: null,
				} as CombinedAppointmentData;
			}

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
				)
				.leftJoin(
					designs,
					eq(appointments.id_design, designs.id_design)
				)
				// Add the `where` clause to filter by `appointment_id`
				.where(eq(appointments.id_appointment, appointment_id))
				.execute();

			// Check if combinedData is empty
			if (combinedData.length === 0) {
				throw new Error(
					`No appointment found with id ${appointment_id}`
				);
			}

			// Transform the combined data to match the CombinedAppointmentData type
			const data = combinedData[0]; // Since we're fetching only one row

			// Ensure that `data` is not undefined
			if (!data) {
				throw new Error("No data found.");
			}

			const transformedData: CombinedAppointmentData = {
				id_appointment: data.id_appointment,
				date: data.date ?? "N/A",
				time: data.time ?? "N/A",
				id_customer: data.customer?.id ?? null,
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
			};

			// Return the transformed data
			return transformedData;
		}),
	updateOrCreate: publicProcedure
		.input(
			z.object({
				id_appointment: z.number(),
				date: z.string(),
				time: z.string(),
				id_customer: z.number(),
				firstName: z.string(),
				lastName: z.string(),
				email: z.string(),
				phone: z.string(),
				id_design: z.number(),
				designName: z.string(),
				duration: z.number(),
				width: z.number(),
				height: z.number(),
				placement: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Destructure the input

			const {
				id_appointment,
				date,
				time,
				id_customer,
				firstName,
				lastName,
				email,
				phone,
				id_design,
				designName,
				duration,
				width,
				height,
				placement,
			} = input;

			// check if id_appointment, id_customer, and id_design are provided
			if (
				id_appointment === undefined ||
				id_customer === undefined ||
				id_design === undefined
			) {
				throw new Error(
					"`id_appointment`, `id_customer`, and `id_design` are required fields."
				);
			}

			// check if id_appointment , id_customer and id_design already exists in database
			const appointmentExists = await db
				.select({
					id_appointment: appointments.id_appointment,
					customer: {
						id: customers.id_customer,
					},
					design: {
						id: designs.id_design,
					},
				})
				.from(appointments)
				.leftJoin(
					customers,
					eq(appointments.id_customer, customers.id_customer)
				)
				.leftJoin(
					designs,
					eq(appointments.id_design, designs.id_design)
				)
				// Add the `where` clause to filter by `appointment_id`
				.where(eq(appointments.id_appointment, id_appointment))
				.execute();

			// Check if appointmentExists is empty
			if (appointmentExists.length === 0) {
				// Create a new appointment, customer, and design
				await ctx.db.insert(customers).values({
					id_customer: id_customer,
					name: firstName,
					surname: lastName,
					email: email,
					phone: phone,
				});

				await ctx.db.insert(designs).values({
					id_design: id_design,
					name: designName,
					duration_of_tattooing: duration,
					width: width,
					height: height,
					placement: placement,
				});

				await ctx.db.insert(appointments).values({
					id_appointment: id_appointment,
					date: date,
					time: time,
					id_customer: id_customer,
					id_design: id_design,
				});
			} else {
				// Update the existing appointment, customer and design
				await ctx.db
					.update(customers)
					.set({
						name: firstName,
						surname: lastName,
						email: email,
						phone: phone,
					})
					.where(eq(customers.id_customer, id_customer));

				await ctx.db
					.update(designs)
					.set({
						name: designName,
						duration_of_tattooing: duration,
						width: width,
						height: height,
						placement: placement,
					})
					.where(eq(designs.id_design, id_design));

				await ctx.db
					.update(appointments)
					.set({
						date: date,
						time: time,
						id_customer: id_customer,
						id_design: id_design,
					})
					.where(eq(appointments.id_appointment, id_appointment));

				return {
					success: true,
					message: "Appointment updated successfully",
				};
			}
		}),
});

export type AppointmentType = InferSelectModel<typeof appointments>;
