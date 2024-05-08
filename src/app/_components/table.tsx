"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { CombinedAppointmentData } from "~/server/api/routers/appointment";
import useActiveRowStore from "../store";

const Table = ({ rows }: { rows: CombinedAppointmentData[] }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const activeRowIndex = useActiveRowStore((state) => state.activeRowIndex);
	const setActiveRowIndex = useActiveRowStore(
		(state) => state.setActiveRowIndex
	);

	const handleRowClick = (index: number) => {
		setActiveRowIndex(index);

		const selectedRow = rows[index];

		// Retrieve the `id_appointment` of the clicked row
		const id_appointment = selectedRow?.id_appointment;

		// Ensure `id_appointment` is defined before proceeding
		if (id_appointment !== undefined && id_appointment !== null) {
			// Create a new URLSearchParams object and set the `id_appointment` parameter
			const updatedSearchParams = new URLSearchParams(
				searchParams.toString()
			);

			updatedSearchParams.set(
				"id_appointment",
				id_appointment.toString()
			);

			// Replace the URL with the updated search parameters
			router.replace(`${pathname}?${updatedSearchParams.toString()}`);
		}
	};

	return (
		<div className='container mt-3 '>
			{/* Heading */}
			<h2 className='mb-4 text-center'>
				Tetovací salón SigilArt - evidence termínů
			</h2>

			{/* Filters Form */}
			<div className='row mb-5 mt-2'>
				<div className='col'>
					<h3 className='mb-3'>Filtry:</h3>
					<form className='form-inline'>
						<input
							type='text'
							className='form-control mx-3 my-2 d-inline-block w-25'
							placeholder='Příjmení zákazníka'
						/>
						<input
							type='date'
							className='form-control mx-3 my-2 d-inline-block w-25'
							placeholder='Datum termínu'
						/>
						<input
							type='time'
							className='form-control mx-3 my-2 d-inline-block w-25'
							placeholder='Čas termínu'
						/>
						<input
							type='text'
							className='form-control mx-3 my-2 d-inline-block w-25'
							placeholder='ID Návrhu'
						/>
						<input
							type='text'
							className='form-control mx-3 my-2 d-inline-block w-25'
							placeholder='Délka termínu'
						/>
						<button
							type='submit'
							className='btn btn-secondary mx-3 my-2'
						>
							Aplikovat filtry
						</button>
					</form>
				</div>
			</div>

			{/* Appointments Table */}
			<div className='row'>
				<div className='col'>
					<table className='table table-hover'>
						<thead className='thead-dark'>
							<tr>
								<th scope='col'>ID Termínu</th>
								<th scope='col'>Datum termínu</th>
								<th scope='col'>Čas termínu</th>
								<th scope='col'>Jméno zákazníka</th>
								<th scope='col'>Příjmení zákazníka</th>
								<th scope='col'>ID Návrhu</th>
								<th scope='col'>Délka termínu (minut)</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row, index) => (
								<tr
									key={row.id_appointment}
									className={` ${
										index === activeRowIndex
											? "table-active"
											: ""
									}`}
									style={{
										cursor: "pointer",
									}}
									onClick={() => handleRowClick(index)}
								>
									<th scope='row'>{row.id_appointment}</th>
									<td>{row.date}</td>
									<td>{row.time}</td>
									<td>{row.firstName}</td>
									<td>{row.lastName}</td>
									<td>{row.id_design}</td>
									<td>{row.duration}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Table;
