"use client";

import { useState } from "react";
import type { CombinedAppointmentData } from "~/server/api/routers/appointment";

const Table = ({
	rows,
}: {
	rows: CombinedAppointmentData[]; // Use an array of the appropriate type
}) => {
	const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
	const [activeRowData, setActiveRowData] =
		useState<CombinedAppointmentData | null>(null);

	const handleRowClick = (index: number) => {
		setActiveRowIndex(index);
		setActiveRowData(rows[index] ?? null);
	};

	return (
		<div className='container mt-5'>
			{/* Heading */}
			<h1 className='mb-4 text-center'>
				Tetovací salón SigilArt - evidence termínů
			</h1>

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
					<table className='table'>
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
									className={
										index === activeRowIndex
											? "table-active"
											: ""
									}
									style={{ cursor: "pointer" }}
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

			{/* Tabs */}
			<ul className='nav nav-tabs' id='myTab' role='tablist'>
				<li className='nav-item' role='presentation'>
					<button
						className='nav-link active'
						id='details-tab'
						data-bs-toggle='tab'
						data-bs-target='#details'
						type='button'
						role='tab'
						aria-controls='details'
						aria-selected='true'
					>
						Podrobnosti
					</button>
				</li>
				<li className='nav-item' role='presentation'>
					<button
						className='nav-link'
						id='customer-tab'
						data-bs-toggle='tab'
						data-bs-target='#customer'
						type='button'
						role='tab'
						aria-controls='customer'
						aria-selected='false'
					>
						Zákazník
					</button>
				</li>
				<li className='nav-item' role='presentation'>
					<button
						className='nav-link'
						id='design-tab'
						data-bs-toggle='tab'
						data-bs-target='#design'
						type='button'
						role='tab'
						aria-controls='design'
						aria-selected='false'
					>
						Návrh
					</button>
				</li>
			</ul>

			<div className='tab-content' id='myTabContent'>
				{/* Details tab */}
				<div
					className='tab-pane fade show active'
					id='details'
					role='tabpanel'
					aria-labelledby='details-tab'
				>
					<div className='row mt-4'>
						<div className='col-2'>
							<h5>Termín</h5>
							<div className='mb-2'>
								<label
									htmlFor='idTerminu'
									className='form-label'
								>
									ID Termínu:
								</label>
								<input
									type='text'
									id='idTerminu'
									className='form-control'
									defaultValue={
										activeRowData?.id_appointment ?? ""
									}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='datumTerminu'
									className='form-label'
								>
									Datum:
								</label>
								<input
									type='date'
									id='datumTerminu'
									className='form-control'
									defaultValue={activeRowData?.date ?? ""}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='casTerminu'
									className='form-label'
								>
									Čas:
								</label>
								<input
									type='time'
									id='casTerminu'
									className='form-control'
									defaultValue={activeRowData?.time ?? ""}
								/>
							</div>
						</div>

						<div className='col-2'>
							<h5>Zákazník</h5>
							<div className='mb-2'>
								<label
									htmlFor='idZakaznika'
									className='form-label'
								>
									ID Zákazníka:
								</label>
								<input
									type='text'
									id='idZakaznika'
									className='form-control'
									style={{
										backgroundColor: "#e9ecef",
										cursor: "default",
									}}
									readOnly
									defaultValue={
										activeRowData?.id_customer ?? ""
									}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='jmenoZakaznika'
									className='form-label'
								>
									Jméno:
								</label>
								<input
									type='text'
									id='jmenoZakaznika'
									className='form-control'
									style={{
										backgroundColor: "#e9ecef",
										cursor: "default",
									}}
									readOnly
									defaultValue={
										activeRowData?.firstName ?? ""
									}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='prijmeniZakaznika'
									className='form-label'
								>
									Příjmení:
								</label>
								<input
									type='text'
									id='prijmeniZakaznika'
									className='form-control'
									style={{
										backgroundColor: "#e9ecef",
										cursor: "default",
									}}
									readOnly
									defaultValue={activeRowData?.lastName ?? ""}
								/>
							</div>
						</div>

						<div className='col-2'>
							<h5>Návrh</h5>
							<div className='mb-2'>
								<label
									htmlFor='idNavrhu'
									className='form-label'
								>
									ID Návrhu:
								</label>
								<input
									type='text'
									id='idNavrhu'
									className='form-control'
									style={{
										backgroundColor: "#e9ecef",
										cursor: "default",
									}}
									readOnly
									defaultValue={
										activeRowData?.id_design ?? ""
									}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='nazevNavrhu'
									className='form-label'
								>
									Název:
								</label>
								<input
									type='text'
									id='nazevNavrhu'
									className='form-control'
									style={{
										backgroundColor: "#e9ecef",
										cursor: "default",
									}}
									readOnly
									defaultValue={
										activeRowData?.designName ?? ""
									}
								/>
							</div>
						</div>

						<div className='col-2'>
							<h5>&nbsp;</h5>
							<div className='mb-2'>
								<label
									htmlFor='delkaVytetovani'
									className='form-label'
								>
									Délka vytetování:
								</label>
								<input
									type='text'
									id='delkaVytetovani'
									className='form-control'
									style={{
										backgroundColor: "#e9ecef",
										cursor: "default",
									}}
									readOnly
									defaultValue={activeRowData?.duration ?? ""}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Customer tab */}
				<div
					className='tab-pane fade'
					id='customer'
					role='tabpanel'
					aria-labelledby='customer-tab'
				>
					<div className='row mt-4'>
						{/* First column: Basic details */}
						<div className='col-3'>
							<h5>Základní údaje:</h5>
							<div className='mb-2'>
								<label
									htmlFor='idZakaznika'
									className='form-label'
								>
									ID Zákazníka:
								</label>
								<input
									type='text'
									id='idZakaznika-2'
									className='form-control'
									defaultValue={
										activeRowData?.id_customer ?? ""
									}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='jmenoZakaznika'
									className='form-label'
								>
									Jméno:
								</label>
								<input
									type='text'
									id='jmenoZakaznika'
									className='form-control'
									defaultValue={
										activeRowData?.firstName ?? ""
									}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='prijmeniZakaznika'
									className='form-label'
								>
									Příjmení:
								</label>
								<input
									type='text'
									id='prijmeniZakaznika'
									className='form-control'
									defaultValue={activeRowData?.lastName ?? ""}
								/>
							</div>
						</div>

						{/* Second column: Contact details */}
						<div className='col-3'>
							<h5>Kontaktní údaje:</h5>
							<div className='mb-2'>
								<label
									htmlFor='emailZakaznika'
									className='form-label'
								>
									Email:
								</label>
								<input
									type='email'
									id='emailZakaznika'
									className='form-control'
									defaultValue={activeRowData?.email ?? ""}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='telefonZakaznika'
									className='form-label'
								>
									Telefon:
								</label>
								<input
									type='text'
									id='telefonZakaznika'
									className='form-control'
									defaultValue={activeRowData?.phone ?? ""}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Design tab */}
				<div
					className='tab-pane fade'
					id='design'
					role='tabpanel'
					aria-labelledby='design-tab'
				>
					<div className='row mt-4'>
						{/* First column: Basic details */}
						<div className='col-3'>
							<h5>Základní údaje:</h5>
							<div className='mb-2'>
								<label
									htmlFor='idNavrhu'
									className='form-label'
								>
									ID Návrhu:
								</label>
								<input
									type='text'
									id='idNavrhu-2'
									className='form-control'
									defaultValue={
										activeRowData?.id_design ?? ""
									}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='nazevNavrhu'
									className='form-label'
								>
									Název:
								</label>
								<input
									type='text'
									id='nazevNavrhu'
									className='form-control'
									defaultValue={
										activeRowData?.designName ?? ""
									}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='delkaVytetovani'
									className='form-label'
								>
									Délka vytetování:
								</label>
								<input
									type='text'
									id='delkaVytetovani'
									className='form-control'
									defaultValue={activeRowData?.duration ?? ""}
								/>
							</div>
						</div>

						{/* Second column: Size and placement */}
						<div className='col-3'>
							<h5>Velikost a Umístění:</h5>
							<div className='mb-2'>
								<label
									htmlFor='sirkaNavrhu'
									className='form-label'
								>
									Šířka:
								</label>
								<input
									type='number'
									id='sirkaNavrhu'
									className='form-control'
									defaultValue={activeRowData?.width ?? ""}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='vyskaNavrhu'
									className='form-label'
								>
									Výška:
								</label>
								<input
									type='number'
									id='vyskaNavrhu'
									className='form-control'
									defaultValue={activeRowData?.height ?? ""}
								/>
							</div>
							<div className='mb-2'>
								<label
									htmlFor='umisteniNavrhu'
									className='form-label'
								>
									Umístění:
								</label>
								<input
									type='text'
									id='umisteniNavrhu'
									className='form-control'
									defaultValue={
										activeRowData?.placement ?? ""
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Table;
