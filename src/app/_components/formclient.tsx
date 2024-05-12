"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CombinedAppointmentData } from "~/server/api/routers/appointment";
import useActiveRowStore from "../store";
import { Modal } from "react-bootstrap";

const Formclient = ({
	appointment,
	handleSubmit,
}: {
	appointment: CombinedAppointmentData;
	handleSubmit: (formData: FormData) => Promise<
		| {
				success: boolean;
				message: string;
		  }
		| undefined
	>;
}) => {
	const router = useRouter();

	const [formData, setFormData] =
		useState<CombinedAppointmentData>(appointment);

	const setActiveRowIndex = useActiveRowStore(
		(state) => state.setActiveRowIndex
	);

	const [showModal, setShowModal] = useState(false);

	const handleShow = () => setShowModal(true);
	const handleClose = () => setShowModal(false);

	useEffect(() => {
		setFormData(appointment);
	}, [appointment]);

	// Handle form submission
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Create a FormData object from the current state
		const formDataObject = new FormData();

		Object.entries(formData).forEach(([key, value]) => {
			// Check if the value is not undefined or null
			if (value !== undefined && value !== null) {
				// Append the key and value to formDataObject
				formDataObject.append(key, value.toString());
			}
		});

		try {
			// Call the server action
			const response = await handleSubmit(formDataObject);

			if (response?.success) {
				// Refresh the page
				router.refresh();
			} else {
				console.error("Form submission failed:", response?.message);
			}
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleNew = () => {
		setActiveRowIndex(null);
		router.push("http://localhost:3000");
	};

	return (
		<form onSubmit={onSubmit}>
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
									name='id_appointment'
									type='text'
									id='id_appointment'
									className='form-control'
									value={formData?.id_appointment ?? ""}
									onChange={handleChange}
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
									name='date'
									type='date'
									id='datumTerminu'
									className='form-control'
									value={formData?.date ?? ""}
									onChange={handleChange}
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
									name='time'
									type='time'
									id='casTerminu'
									className='form-control'
									value={formData?.time ?? ""}
									onChange={handleChange}
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
										appointment?.id_customer ?? ""
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
									defaultValue={appointment?.firstName ?? ""}
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
									defaultValue={appointment?.lastName ?? ""}
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
									defaultValue={appointment?.id_design ?? ""}
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
									defaultValue={appointment?.designName ?? ""}
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
									defaultValue={appointment?.duration ?? ""}
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
									name='id_customer'
									type='text'
									id='idZakaznika-2'
									className='form-control'
									value={formData?.id_customer ?? ""}
									onChange={handleChange}
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
									name='firstName'
									type='text'
									id='jmenoZakaznika'
									className='form-control'
									value={formData?.firstName ?? ""}
									onChange={handleChange}
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
									name='lastName'
									type='text'
									id='prijmeniZakaznika'
									className='form-control'
									value={formData?.lastName ?? ""}
									onChange={handleChange}
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
									name='email'
									type='email'
									id='emailZakaznika'
									className='form-control'
									value={formData?.email ?? ""}
									onChange={handleChange}
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
									name='phone'
									type='text'
									id='telefonZakaznika'
									className='form-control'
									value={formData?.phone ?? ""}
									onChange={handleChange}
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
									name='id_design'
									type='text'
									id='idNavrhu-2'
									className='form-control'
									value={formData?.id_design ?? ""}
									onChange={handleChange}
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
									name='designName'
									type='text'
									id='nazevNavrhu'
									className='form-control'
									value={formData?.designName ?? ""}
									onChange={handleChange}
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
									name='duration'
									type='text'
									id='delkaVytetovani'
									className='form-control'
									value={formData?.duration ?? ""}
									onChange={handleChange}
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
									name='width'
									type='number'
									id='sirkaNavrhu'
									className='form-control'
									value={formData?.width ?? ""}
									onChange={handleChange}
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
									name='height'
									type='number'
									id='vyskaNavrhu'
									className='form-control'
									value={formData?.height ?? ""}
									onChange={handleChange}
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
									name='placement'
									type='text'
									id='umisteniNavrhu'
									className='form-control'
									value={formData?.placement ?? ""}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='row mt-4 mb-4'>
				<div className='col text-center'>
					<button type='submit' className='btn btn-primary'>
						Uložit
					</button>
					<button
						className='btn btn-secondary mx-3'
						onClick={() => handleNew()}
					>
						Nový záznam
					</button>
					<button className='btn btn-secondary' onClick={handleShow}>
						Nápověda
					</button>

					<Modal show={showModal} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Nápověda</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							Tlačítkem{" "}
							<span className='fw-bold '>Nový záznam</span>{" "}
							vyčistíte vstupní pole, aby bylo možné zadat nové
							hodnoty.
							<br /> Tlačítkem{" "}
							<span className='fw-bold '>Uložit</span> uložíte
							záznam do seznamu
							<br />
							Tvůrce: Jan Bojko, Login: BOJ0043.
							<br />
							<br />
							Program: Projekt Bootstrap do předmětu URO. Slouží
							jako evidence termínů zákazníků pro tetovací salón.
						</Modal.Body>
						<Modal.Footer>
							<button
								className='btn btn-secondary'
								onClick={handleClose}
							>
								Zavřít nápovědu
							</button>
						</Modal.Footer>
					</Modal>
				</div>
			</div>
		</form>
	);
};

export default Formclient;
