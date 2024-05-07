import { res } from "~/server/api/root";
import Table from "./_components/table";

export default async function Home() {
	const appointments = await res.appointment.getAll();

	return <Table rows={appointments} />;
}
