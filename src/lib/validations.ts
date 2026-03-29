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
  hasSizes: z.enum(["true", "false"]).optional().default("false"),
  sizes: z.array(z.object({
    name: z.string().min(1, "اسم الحجم مطلوب"),
    price: z.string().min(1, "سعر الحجم مطلوب"),
    stock: z.string().default("0"),
  })).optional().nullable(),
  hasColors: z.enum(["true", "false"]).optional().default("false"),
  colors: z.array(z.object({
    name: z.string().min(1, "اسم اللون مطلوب"),
    hex: z.string().startsWith("#", "يجب أن يبدأ رمز اللون بـ #").min(4, "رمز اللون غير صالح"),
  })).optional().nullable(),
  variantInventory: z.array(z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    stock: z.string().default("0"),
    price: z.string().optional(),
  })).optional().nullable(),
  unifyPrice: z.enum(["true", "false"]).optional().default("true"),
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
