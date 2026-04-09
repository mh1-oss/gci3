-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"unit" text DEFAULT 'pcs',
	"cost_price" numeric(10, 2) DEFAULT '0',
	"selling_price" numeric(10, 2) DEFAULT '0',
	"stock_quantity" numeric(10, 2) DEFAULT '0',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'user',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_name" text NOT NULL,
	"project_name" text,
	"phone" text,
	"email" text,
	"quote_date" date DEFAULT now(),
	"ref_number" text,
	"status" text DEFAULT 'draft',
	"total_amount" numeric(12, 2) DEFAULT '0',
	"total_cost" numeric(12, 2) DEFAULT '0',
	"currency" text DEFAULT 'USD',
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quote_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_id" uuid,
	"description" text NOT NULL,
	"width" numeric(10, 2),
	"height" numeric(10, 2),
	"quantity" numeric(10, 2) DEFAULT '1',
	"unit_price" numeric(10, 2) DEFAULT '0',
	"total_price" numeric(12, 2),
	"section_profile" text,
	"notes" text,
	"product_id" uuid
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text DEFAULT '/images/product.png',
	"category" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"price" text NOT NULL,
	"pdf_url" text,
	"stock" text DEFAULT '0',
	"subsidiary_id" uuid,
	"image_key" text,
	"image_source" text DEFAULT 'external',
	"pdf_key" text,
	"pdf_source" text DEFAULT 'external',
	"has_sizes" text DEFAULT 'false',
	"sizes" jsonb,
	"has_colors" text DEFAULT 'false',
	"colors" jsonb,
	"variant_inventory" jsonb,
	"unify_price" text DEFAULT 'true'
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text DEFAULT '/images/project.png',
	"category" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"image_key" text,
	"image_source" text DEFAULT 'external'
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'main' NOT NULL,
	"company_name" text DEFAULT 'مجموعة الوليد للتجارة العامة (AGT)',
	"email" text DEFAULT 'info@agt-group.com',
	"phone" text DEFAULT '+964 000 000 0000',
	"address" text DEFAULT 'العراق، بغداد',
	"facebook" text,
	"instagram" text,
	"whatsapp" text,
	"linkedin" text,
	"maintenance_mode" text DEFAULT 'false',
	"updated_at" timestamp with time zone DEFAULT now(),
	"working_hours" text DEFAULT 'السبت - الخميس: 8:00 صباحاً - 5:00 مساءً',
	"exchange_rate" numeric(10, 2) DEFAULT '1500',
	"phone_national" text DEFAULT '+964 000 000 0000',
	"phone_gci" text DEFAULT '+964 000 000 0000',
	"show_price" text DEFAULT 'true',
	"show_stock" text DEFAULT 'true'
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"is_read" text DEFAULT 'false',
	"created_at" timestamp with time zone DEFAULT now(),
	"replied" text DEFAULT 'false'
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "subsidiaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"logo_key" text,
	"logo_source" text DEFAULT 'external',
	"slogan" text
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"ip" text PRIMARY KEY NOT NULL,
	"count" numeric(10, 0) DEFAULT '0',
	"last_attempt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_subsidiary_id_subsidiaries_id_fk" FOREIGN KEY ("subsidiary_id") REFERENCES "public"."subsidiaries"("id") ON DELETE no action ON UPDATE no action;
*/