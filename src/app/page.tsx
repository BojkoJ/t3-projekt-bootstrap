import { res } from "~/server/api/root";
import Table from "./_components/table";
import Form from "./_components/form";

export default async function Page({
	searchParams,
}: {
	searchParams: { id_appointment?: string };
}) {
	const appointments = await res.appointment.getAll();

	return (
		<div style={{ height: "100vh", overflowY: "hidden" }}>
			{/* Pass formData and handleRowClick function to the client component */}
			<Table rows={appointments} />

			{/* Pass formData as a prop to the server component */}
			<Form searchParams={searchParams} />
		</div>
	);
}
