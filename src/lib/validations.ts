import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "العنوان مطلوب"),
  description: z.string().optional(),
  price: z.string().min(1, "السعر مطلوب"),
  stock: z.string().optional().default("0"),
  category: z.string().min(1, "التصنيف مطلوب"),
  subsidiaryId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(2, "العنوان مطلوب"),
  description: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const subsidiarySchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

export const settingsSchema = z.object({
  companyName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  phoneNational: z.string().optional(),
  phoneGCI: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string().optional(),
  exchangeRate: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  linkedin: z.string().optional(),
  showPrice: z.enum(["true", "false"]),
  showStock: z.enum(["true", "false"]),
});
