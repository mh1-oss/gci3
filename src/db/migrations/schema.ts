import { pgTable, uuid, text, numeric, timestamp, unique, date, foreignKey, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const materials = pgTable("materials", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	unit: text().default('pcs'),
	costPrice: numeric("cost_price", { precision: 10, scale:  2 }).default('0'),
	sellingPrice: numeric("selling_price", { precision: 10, scale:  2 }).default('0'),
	stockQuantity: numeric("stock_quantity", { precision: 10, scale:  2 }).default('0'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const posts = pgTable("posts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	content: text(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	role: text().default('user'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("categories_name_unique").on(table.name),
]);

export const quotes = pgTable("quotes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	customerName: text("customer_name").notNull(),
	projectName: text("project_name"),
	phone: text(),
	email: text(),
	quoteDate: date("quote_date").defaultNow(),
	refNumber: text("ref_number"),
	status: text().default('draft'),
	totalAmount: numeric("total_amount", { precision: 12, scale:  2 }).default('0'),
	totalCost: numeric("total_cost", { precision: 12, scale:  2 }).default('0'),
	currency: text().default('USD'),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const quoteItems = pgTable("quote_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	quoteId: uuid("quote_id"),
	description: text().notNull(),
	width: numeric({ precision: 10, scale:  2 }),
	height: numeric({ precision: 10, scale:  2 }),
	quantity: numeric({ precision: 10, scale:  2 }).default('1'),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).default('0'),
	totalPrice: numeric("total_price", { precision: 12, scale:  2 }),
	sectionProfile: text("section_profile"),
	notes: text(),
	productId: uuid("product_id"),
}, (table) => [
	foreignKey({
			columns: [table.quoteId],
			foreignColumns: [quotes.id],
			name: "quote_items_quote_id_quotes_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "quote_items_product_id_products_id_fk"
		}).onDelete("set null"),
]);

export const products = pgTable("products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	imageUrl: text("image_url").default('/images/product.png'),
	category: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	price: text().notNull(),
	pdfUrl: text("pdf_url"),
	stock: text().default('0'),
	subsidiaryId: uuid("subsidiary_id"),
	imageKey: text("image_key"),
	imageSource: text("image_source").default('external'),
	pdfKey: text("pdf_key"),
	pdfSource: text("pdf_source").default('external'),
	hasSizes: text("has_sizes").default('false'),
	sizes: jsonb(),
	hasColors: text("has_colors").default('false'),
	colors: jsonb(),
	variantInventory: jsonb("variant_inventory"),
	unifyPrice: text("unify_price").default('true'),
}, (table) => [
	foreignKey({
			columns: [table.subsidiaryId],
			foreignColumns: [subsidiaries.id],
			name: "products_subsidiary_id_subsidiaries_id_fk"
		}),
]);

export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	imageUrl: text("image_url").default('/images/project.png'),
	category: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	imageKey: text("image_key"),
	imageSource: text("image_source").default('external'),
});

export const siteSettings = pgTable("site_settings", {
	id: text().default('main').primaryKey().notNull(),
	companyName: text("company_name").default('مجموعة الوليد للتجارة العامة (AGT)'),
	email: text().default('info@agt-group.com'),
	phone: text().default('+964 000 000 0000'),
	address: text().default('العراق، بغداد'),
	facebook: text(),
	instagram: text(),
	whatsapp: text(),
	linkedin: text(),
	maintenanceMode: text("maintenance_mode").default('false'),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	workingHours: text("working_hours").default('السبت - الخميس: 8:00 صباحاً - 5:00 مساءً'),
	exchangeRate: numeric("exchange_rate", { precision: 10, scale:  2 }).default('1500'),
	phoneNational: text("phone_national").default('+964 000 000 0000'),
	phoneGci: text("phone_gci").default('+964 000 000 0000'),
	showPrice: text("show_price").default('true'),
	showStock: text("show_stock").default('true'),
});

export const messages = pgTable("messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	phone: text(),
	subject: text(),
	message: text().notNull(),
	isRead: text("is_read").default('false'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	replied: text().default('false'),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().default('admin').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const subsidiaries = pgTable("subsidiaries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	logoUrl: text("logo_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	logoKey: text("logo_key"),
	logoSource: text("logo_source").default('external'),
	slogan: text(),
});

export const loginAttempts = pgTable("login_attempts", {
	ip: text().primaryKey().notNull(),
	count: numeric({ precision: 10, scale:  0 }).default('0'),
	lastAttempt: timestamp("last_attempt", { withTimezone: true, mode: 'string' }).defaultNow(),
});
