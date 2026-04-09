import { relations } from "drizzle-orm/relations";
import { quotes, quoteItems, products, subsidiaries } from "./schema";

export const quoteItemsRelations = relations(quoteItems, ({one}) => ({
	quote: one(quotes, {
		fields: [quoteItems.quoteId],
		references: [quotes.id]
	}),
	product: one(products, {
		fields: [quoteItems.productId],
		references: [products.id]
	}),
}));

export const quotesRelations = relations(quotes, ({many}) => ({
	quoteItems: many(quoteItems),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	quoteItems: many(quoteItems),
	subsidiary: one(subsidiaries, {
		fields: [products.subsidiaryId],
		references: [subsidiaries.id]
	}),
}));

export const subsidiariesRelations = relations(subsidiaries, ({many}) => ({
	products: many(products),
}));