"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CombinedAppointmentData } from "~/server/api/routers/appointment";
import useActiveRowStore from "../store";
import Image from "next/image";

const Table = ({ rows }: { rows: CombinedAppointmentData[] }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const activeRowIndex = useActiveRowStore((state) => state.activeRowIndex);
	const setActiveRowIndex = useActiveRowStore(
		(state) => state.setActiveRowIndex
	);

	// Stav pro filtry
	const [filterLastName, setFilterLastName] = useState("");
	const [filterDate, setFilterDate] = useState("");
	const [filterTime, setFilterTime] = useState("");
	const [filterDesignId, setFilterDesignId] = useState("");
	const [filterDuration, setFilterDuration] = useState("");
	const [isFilterApplied, setIsFilterApplied] = useState(false);

	// Stav pro stránkování
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 4; // Počet řádků na stránku

	const handleRowClick = (index: number) => {
		const adjustedIndex = indexOfFirstRow + index;

		setActiveRowIndex(adjustedIndex);

		const selectedRow = filteredRows[adjustedIndex];

		const id_appointment = selectedRow?.id_appointment;

		if (id_appointment !== undefined && id_appointment !== null) {
			const updatedSearchParams = new URLSearchParams(searchParams.toString());
			updatedSearchParams.set("id_appointment", id_appointment.toString());

			router.replace(`${pathname}?${updatedSearchParams.toString()}`);
		}
	};

	const handleFormSubmit = (event: FormEvent) => {
		event.preventDefault();
		setIsFilterApplied(true);
	};

	// Filtruje řádky na základě hodnot filtrů a stavu isFilterApplied
	const filteredRows = isFilterApplied
		? rows.filter((row) => {
				const isLastNameMatch = row.lastName
					?.toLowerCase()
					.includes(filterLastName.toLowerCase());
				const isDateMatch = filterDate ? row.date === filterDate : true;
				const isTimeMatch = filterTime ? row.time === filterTime : true;
				const isDesignIdMatch = filterDesignId
					? row.id_design?.toString() === filterDesignId
					: true;
				const isDurationMatch = filterDuration
					? row.duration?.toString() === filterDuration
					: true;

				return (
					isLastNameMatch &&
					isDateMatch &&
					isTimeMatch &&
					isDesignIdMatch &&
					isDurationMatch
				);
		  })
		: rows;

	// Počítání celkového počtu stránek
	const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

	// Výpočet rozsahu řádků pro zobrazení na aktuální stránce
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

	// Ovládací prvky pro stránkování
	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
		setActiveRowIndex(null);
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
		setActiveRowIndex(null);
	};

	// Zpracování změny hodnot filtrů a reset isFilterApplied, pokud je to nutné
	const handleLastNameChange = (e: FormEvent<HTMLInputElement>) => {
		const newValue = e.currentTarget.value;
		setFilterLastName(newValue);
		if (newValue === "") {
			setIsFilterApplied(false);
		}
	};

	const handleDateChange = (e: FormEvent<HTMLInputElement>) => {
		const newValue = e.currentTarget.value;
		setFilterDate(newValue);
		if (newValue === "") {
			setIsFilterApplied(false);
		}
	};

	const handleTimeChange = (e: FormEvent<HTMLInputElement>) => {
		const newValue = e.currentTarget.value;
		setFilterTime(newValue);
		if (newValue === "") {
			setIsFilterApplied(false);
		}
	};

	const handleDesignIdChange = (e: FormEvent<HTMLInputElement>) => {
		const newValue = e.currentTarget.value;
		setFilterDesignId(newValue);
		if (newValue === "") {
			setIsFilterApplied(false);
		}
	};

	const handleDurationChange = (e: FormEvent<HTMLInputElement>) => {
		const newValue = e.currentTarget.value;
		setFilterDuration(newValue);
		if (newValue === "") {
			setIsFilterApplied(false);
		}
	};

	return (
		<div className="container mt-3">
			{/* Nadpis */}
			<div className="d-flex justify-content-center align-items-center">
				<Image
					className="mx-5"
					src="/sigilart.png"
					alt="SigilArt logo"
					width={150}
					height={150}
				/>
				<h2 className="mb-4 text-center">
					Tetovací salón SigilArt - evidence termínů
				</h2>
				<Image
					className="mx-5"
					src="/sigilart.png"
					alt="SigilArt logo"
					width={150}
					height={150}
				/>
			</div>

			{/* Formulář s filtry */}
			<div className="row mb-5 mt-2">
				<div className="col">
					<h3 className="mb-3">Filtry:</h3>
					<form className="form-inline" onSubmit={handleFormSubmit}>
						<input
							type="text"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="Příjmení zákazníka"
							value={filterLastName}
							onChange={handleLastNameChange}
						/>
						<input
							type="date"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="Datum termínu"
							value={filterDate}
							onChange={handleDateChange}
						/>
						<input
							type="time"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="Čas termínu"
							value={filterTime}
							onChange={handleTimeChange}
						/>
						<input
							type="text"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="ID Návrhu"
							value={filterDesignId}
							onChange={handleDesignIdChange}
						/>
						<input
							type="text"
							className="form-control mx-3 my-2 d-inline-block w-25"
							placeholder="Délka termínu"
							value={filterDuration}
							onChange={handleDurationChange}
						/>
						<button type="submit" className="btn btn-secondary mx-3 my-2">
							Aplikovat filtry
						</button>
					</form>
				</div>
			</div>

			{/* Tabulka termínů */}
			<div className="row">
				<div className="col" style={{ height: "230px", overflowY: "auto" }}>
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
							{currentRows.map((row, index) => (
								<tr
									key={row.id_appointment}
									className={index === activeRowIndex ? "table-active" : ""}
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

			{/* Ovládání stránkování */}
			<div className="d-flex justify-content-center ">
				<div className="d-flex justify-content-between align-items-center  w-25 ">
					<button
						className="btn btn-primary"
						onClick={handlePreviousPage}
						disabled={currentPage === 1}
					>
						Předchozí
					</button>
					<span className="mx-3">
						Stránka {currentPage} z {totalPages}
					</span>
					<button
						className="btn btn-primary"
						onClick={handleNextPage}
						disabled={currentPage === totalPages}
					>
						Další
					</button>
				</div>
			</div>
		</div>
	);
};

export default Table;
