"use client";

import { useState } from "react";
import type { FormEvent } from "react";
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

	// Stavy pro sledování vstupů filtru
	const [lastNameFilter, setLastNameFilter] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [timeFilter, setTimeFilter] = useState("");
	const [idDesignFilter, setIdDesignFilter] = useState("");
	const [durationFilter, setDurationFilter] = useState("");

	// Stav pro sledování filtrovaných řádků
	const [filteredRows, setFilteredRows] = useState(rows);

	const handleRowClick = (index: number) => {
		setActiveRowIndex(index);

		const selectedRow = filteredRows[index];

		// Z tohoto kliknutého řádku získáme `id_appointment`
		const id_appointment = selectedRow?.id_appointment;

		// Ensure `id_appointment` is defined before proceeding
		if (id_appointment !== undefined && id_appointment !== null) {
			// Vytvoříme nový objekt URLSearchParams a nastavíme parametr `id_appointment`
			const updatedSearchParams = new URLSearchParams(searchParams.toString());

			updatedSearchParams.set("id_appointment", id_appointment.toString());

			// URL bude vypadat nějak takhle: /form?id_appointment=1
			router.replace(`${pathname}?${updatedSearchParams.toString()}`);
		}
	};

	// Funcke pro odeslání formuláře filtru
	const handleFilterSubmit = (e: FormEvent) => {
		e.preventDefault();

		// Filtrujeme řádky na základě vstupů
		const filtered = rows.filter((row) => {
			const lastNameMatch = lastNameFilter
				? row.lastName?.toLowerCase().includes(lastNameFilter.toLowerCase())
				: true;
			const dateMatch = dateFilter ? row.date === dateFilter : true;
			const timeMatch = timeFilter ? row.time === timeFilter : true;
			const idDesignMatch = idDesignFilter
				? row.id_design?.toString() === idDesignFilter
				: true;
			const durationMatch = durationFilter
				? row.duration?.toString() === durationFilter
				: true;

			// Vrátime true, pokud všechny filtry odpovídají
			return (
				lastNameMatch &&
				dateMatch &&
				timeMatch &&
				idDesignMatch &&
				durationMatch
			);
		});

		// Updatneme stav s filtrovanými řádky
		setFilteredRows(filtered);
	};

	return (
		<div className="container mt-3">
			{/* Heading */}
			<h2 className="mb-4 text-center">
				Tetovací salón SigilArt - evidence termínů
			</h2>

			{/* Filters Form */}
			<div className="row mb-5 mt-2">
				<div className="col">
					<h3 className="mb-3">Filtry:</h3>
					<form className="form-inline" onSubmit={handleFilterSubmit}>
						<input
							type="text"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="Příjmení zákazníka"
							value={lastNameFilter}
							onChange={(e) => setLastNameFilter(e.target.value)}
						/>
						<input
							type="date"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="Datum termínu"
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
						/>
						<input
							type="time"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="Čas termínu"
							value={timeFilter}
							onChange={(e) => setTimeFilter(e.target.value)}
						/>
						<input
							type="text"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="ID Návrhu"
							value={idDesignFilter}
							onChange={(e) => setIdDesignFilter(e.target.value)}
						/>
						<input
							type="text"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="Délka termínu"
							value={durationFilter}
							onChange={(e) => setDurationFilter(e.target.value)}
						/>
						<button type="submit" className="btn btn-secondary mx-3 my-2">
							Aplikovat filtry
						</button>
					</form>
				</div>
			</div>

			{/* Appointments Table */}
			<div className="row">
				<div className="col">
					<table className="table table-hover">
						<thead className="thead-dark">
							<tr>
								<th scope="col">ID Termínu</th>
								<th scope="col">Datum termínu</th>
								<th scope="col">Čas termínu</th>
								<th scope="col">Jméno zákazníka</th>
								<th scope="col">Příjmení zákazníka</th>
								<th scope="col">ID Návrhu</th>
								<th scope="col">Délka termínu (minut)</th>
							</tr>
						</thead>
						<tbody>
							{filteredRows.map((row, index) => (
								<tr
									key={row.id_appointment}
									className={` ${
										index === activeRowIndex ? "table-active" : ""
									}`}
									style={{ cursor: "pointer" }}
									onClick={() => handleRowClick(index)}
								>
									<th scope="row">{row.id_appointment}</th>
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
