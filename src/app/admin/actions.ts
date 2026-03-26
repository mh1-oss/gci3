"use server";

import { db } from "@/db";
import { products, categories, siteSettings, messages, quotes, quoteItems, projects, subsidiaries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  
  if (email === "admin@gcipaints.com" && password === "123456") {
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'admin_token',
      value: 'authenticated',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    redirect("/admin/dashboard");
  } else {
    // Basic redirect back to login, ignoring errors for now (could use actionState)
    redirect("/admin/login?error=1");
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect("/admin/login");
}

// Site Settings
export async function getSettings() {
  const settings = await db.select().from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
  if (settings.length === 0) {
    // Seed default if not exists
    const [newSettings] = await db.insert(siteSettings).values({ id: "main" }).returning();
    return newSettings;
  }
  return settings[0];
}

export async function updateSettings(formData: FormData) {
  const data = {
    companyName: formData.get("companyName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    phoneNational: formData.get("phoneNational") as string,
    phoneGCI: formData.get("phoneGCI") as string,
    address: formData.get("address") as string,
    workingHours: formData.get("workingHours") as string,
    exchangeRate: formData.get("exchangeRate") as string,
    facebook: formData.get("facebook") as string,
    instagram: formData.get("instagram") as string,
    whatsapp: formData.get("whatsapp") as string,
    linkedin: formData.get("linkedin") as string,
    showPrice: formData.get("showPrice") === "on" ? "true" : "false",
    showStock: formData.get("showStock") === "on" ? "true" : "false",
    updatedAt: new Date(),
  };

  await db.update(siteSettings).set(data).where(eq(siteSettings.id, "main"));
  revalidatePath("/", "layout");
  revalidatePath("/admin/dashboard/settings");
}

// Subsidiaries
export async function getSubsidiaries() {
  return await db.select().from(subsidiaries);
}

export async function createSubsidiary(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;

  await db.insert(subsidiaries).values({
    name,
    description,
    logoUrl,
  });

  revalidatePath("/admin/dashboard/subsidiaries");
  revalidatePath("/");
  redirect("/admin/dashboard/subsidiaries");
}

export async function updateSubsidiary(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;

  await db.update(subsidiaries).set({
    name,
    description,
    logoUrl,
  }).where(eq(subsidiaries.id, id));

  revalidatePath("/admin/dashboard/subsidiaries");
  revalidatePath("/");
  redirect("/admin/dashboard/subsidiaries");
}

export async function deleteSubsidiary(id: string) {
  await db.delete(subsidiaries).where(eq(subsidiaries.id, id));
  revalidatePath("/admin/dashboard/subsidiaries");
  revalidatePath("/");
}

// Contact Messages
export async function sendMessage(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  await db.insert(messages).values(data);
  
  // Notify all connected SSE clients immediately
  try {
    const { emitNewMessage } = await import("@/lib/messageEmitter");
    emitNewMessage();
  } catch {}
  
  revalidatePath("/admin/dashboard/messages");
  return { success: true };
}

export async function deleteMessage(id: string) {
  await db.delete(messages).where(eq(messages.id, id));
  revalidatePath("/admin/dashboard/messages");
}

// Accounting / Quotes / Invoices
export async function createQuote(formData: FormData) {
  const customerName = formData.get("customerName") as string;
  const projectName = formData.get("projectName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const totalAmount = formData.get("totalAmount") as string;
  const itemsJson = formData.get("items") as string;
  const items = JSON.parse(itemsJson || "[]");
  
  const refNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

  const [newQuote] = await db.insert(quotes).values({
    customerName,
    projectName,
    phone,
    email,
    totalAmount,
    refNumber,
    status: "sent",
  }).returning();

  if (items.length > 0) {
    for (const item of items) {
      // Insert item
      await db.insert(quoteItems).values({
        quoteId: newQuote.id,
        productId: item.productId,
        description: item.title,
        quantity: item.quantity.toString(),
        unitPrice: item.price.toString(),
        totalPrice: item.total.toString(),
      });

      // Deduct stock
      const [product] = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
      if (product) {
        const newStock = Math.max(0, Number(product.stock) - Number(item.quantity));
        await db.update(products).set({ stock: newStock.toString() }).where(eq(products.id, item.productId));
      }
    }
  }

  revalidatePath("/admin/dashboard/accounting");
  revalidatePath("/admin/dashboard/inventory");
  revalidatePath("/products");
  redirect("/admin/dashboard/accounting");
}

export async function deleteQuote(id: string) {
  await db.delete(quotes).where(eq(quotes.id, id));
  revalidatePath("/admin/dashboard/accounting");
}

export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/dashboard/products");
  revalidatePath("/products");
}

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string || "0";
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string || "/images/product.png";
  const pdfUrl = formData.get("pdfUrl") as string;
  const subsidiaryId = formData.get("subsidiaryId") as string;

  await db.insert(products).values({
    title,
    category,
    price,
    stock,
    description,
    imageUrl,
    pdfUrl,
    subsidiaryId: subsidiaryId || null,
  });

  revalidatePath("/admin/dashboard/products");
  revalidatePath("/admin/dashboard/inventory");
  revalidatePath("/products");
  redirect("/admin/dashboard/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string || "/images/product.png";
  const pdfUrl = formData.get("pdfUrl") as string;
  const subsidiaryId = formData.get("subsidiaryId") as string;

  const updateData: any = {
    title,
    category,
    price,
    description,
    imageUrl,
    pdfUrl,
    subsidiaryId: subsidiaryId || null,
  };

  if (stock !== null) {
    updateData.stock = stock;
  }

  await db.update(products).set(updateData).where(eq(products.id, id));

  revalidatePath("/admin/dashboard/products");
  revalidatePath("/admin/dashboard/inventory");
  revalidatePath("/products");
  redirect("/admin/dashboard/products");
}

export async function updateStock(productId: string, quantity: string) {
  await db.update(products).set({ stock: quantity }).where(eq(products.id, productId));
  revalidatePath("/admin/dashboard/inventory");
  revalidatePath("/products");
  return { success: true };
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  
  if (name) {
    await db.insert(categories).values({ name });
  }

  revalidatePath("/admin/dashboard/categories");
  redirect("/admin/dashboard/categories");
}


export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/dashboard/categories");
}

export async function markMessageAsReplied(id: string) {
  await db.update(messages).set({ replied: "true" }).where(eq(messages.id, id));
  revalidatePath("/admin/dashboard/messages");
}

export async function deleteRepliedMessages() {
  await db.delete(messages).where(eq(messages.replied, "true"));
  revalidatePath("/admin/dashboard/messages");
}


export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string || "/images/project.png";

  await db.insert(projects).values({
    title,
    description,
    category,
    imageUrl,
  });

  revalidatePath("/admin/dashboard/projects");
  revalidatePath("/projects");
  redirect("/admin/dashboard/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string || "/images/project.png";

  await db.update(projects).set({
    title,
    description,
    category,
    imageUrl,
  }).where(eq(projects.id, id));

  revalidatePath("/admin/dashboard/projects");
  revalidatePath("/projects");
  redirect("/admin/dashboard/projects");
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/admin/dashboard/projects");
  revalidatePath("/projects");
}
