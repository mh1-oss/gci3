import { pgTable, text, timestamp, decimal, uuid, AnyPgColumn, date } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  role: text("role").default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  category: text("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  category: text("category"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  stock: decimal("stock", { precision: 10, scale: 2 }).default("0"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const materials = pgTable("materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit").default("pcs"),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }).default("0"),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).default("0"),
  stockQuantity: decimal("stock_quantity", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: text("customer_name").notNull(),
  projectName: text("project_name"),
  phone: text("phone"),
  email: text("email"),
  quoteDate: date("quote_date").defaultNow(),
  refNumber: text("ref_number"),
  status: text("status").default("draft"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).default("0"),
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).default("0"),
  currency: text("currency").default("USD"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const quoteItems = pgTable("quote_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id").references((): AnyPgColumn => quotes.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references((): AnyPgColumn => products.id, { onDelete: "set null" }),
  description: text("description").notNull(),
  width: decimal("width", { precision: 10, scale: 2 }),
  height: decimal("height", { precision: 10, scale: 2 }),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).default("1"),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).default("0"),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }), // Stored or generated in code
  sectionProfile: text("section_profile"),
  notes: text("notes"),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: text("is_read").default("false"),
  replied: text("replied").default("false"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("main"),
  companyName: text("company_name").default("شركة أصباغ GCI"),
  email: text("email").default("info@gcipaints.com"),
  phone: text("phone").default("+123 456 7890"),
  address: text("address").default("المنطقة الصناعية، الشارع الرئيسي"),
  workingHours: text("working_hours").default("السبت - الخميس: 8:00 صباحاً - 5:00 مساءً"),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 2 }).default("1500"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  whatsapp: text("whatsapp"),
  linkedin: text("linkedin"),
  maintenanceMode: text("maintenance_mode").default("false"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
