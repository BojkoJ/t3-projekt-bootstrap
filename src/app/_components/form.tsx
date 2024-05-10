import { z } from "zod";
import { res } from "~/server/api/root";
import Formclient from "./formclient";

const Form = async ({
	searchParams,
}: {
	searchParams: { id_appointment?: string };
}) => {
	let id_appointment: string | undefined = "1";
	id_appointment = searchParams.id_appointment;

	let appointment_id: number | undefined;

	if (id_appointment !== undefined) {
		appointment_id = parseInt(id_appointment, 10);
	} else {
		appointment_id = undefined;
	}

	const appointment = await res.appointment.getOne({
		appointment_id: appointment_id,
	});

	const handleSubmit = async (formData: FormData) => {
		"use server";

		// Convert form data to an object for easier processing
		const data = {
			id_appointment: parseInt(formData.get("id_appointment") as string, 10),
			date: formData.get("date") as string,
			time: formData.get("time") as string,
			id_customer: parseInt(formData.get("id_customer") as string, 10),
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			id_design: parseInt(formData.get("id_design") as string, 10),
			designName: formData.get("designName") as string,
			duration: parseInt(formData.get("duration") as string, 10),
			width: parseInt(formData.get("width") as string, 10),
			height: parseInt(formData.get("height") as string, 10),
			placement: formData.get("placement") as string,
		};

		// Validate data with schema
		const schema = z.object({
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
		});

		const validatedData = schema.parse(data);

		const response = res.appointment.updateOrCreate(validatedData);

		return response;
	};

	return (
		<div className="container">
			<Formclient appointment={appointment} handleSubmit={handleSubmit} />
		</div>
	);
};

export default Form;
