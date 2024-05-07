import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator(
	(name) => `uro-bootstrap-projekt_${name}`
);

export const customers = createTable("customer", {
	id_customer: int("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	name: text("name", { length: 100 }),
	surname: text("surname", { length: 100 }),
	email: text("email", { length: 100 }),
	phone: text("phone", { length: 100 }),
});

export const designs = createTable("design", {
	id_design: int("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	name: text("name", { length: 100 }),
	duration_of_tattooing: int("duration_of_tattooing", { mode: "number" }),
	width: int("width", { mode: "number" }),
	height: int("height", { mode: "number" }),
	placement: text("placement", { length: 100 }),
});

export const appointments = createTable("appointment", {
	id_appointment: int("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	date: text("date", { length: 100 }),
	time: text("time", { length: 100 }),
	id_customer: int("id_customer", { mode: "number" }).references(
		() => customers.id_customer
	),
	id_design: int("id_design", { mode: "number" })
		.references(() => designs.id_design)
		.unique(),
});
