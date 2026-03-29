"use server";

import { db } from "@/db";
import { products, categories, siteSettings, messages, quotes, quoteItems, projects, subsidiaries, users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

import { requireAdmin } from "@/lib/auth-helpers";
import { uploadToR2, deleteFromR2 } from "@/lib/s3";
import { settingsSchema, subsidiarySchema, productSchema } from "@/lib/validations";

export async function loginAdmin(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return redirect("/admin/login?error=1");
        default:
          return redirect("/admin/login?error=2");
      }
    }
    throw error;
  }
}

export async function logoutAdmin() {
  await signOut({ redirectTo: "/admin/login" });
}

/**
 * Helper to handle the "Latest Input Wins" logic for media fields.
 */
async function handleMediaUpdate(
  manualUrl: string | null,
  uploadFile: File | null,
  currentUrl: string | null,
  currentKey: string | null,
  folder: string
) {
  console.log(`[MediaUpdate] Folder: ${folder}, File: ${uploadFile?.name || 'none'}, ManualURL: ${manualUrl || 'none'}`);

  // 1. If a NEW file is uploaded, it ALWAYS wins.
  if (uploadFile && uploadFile.size > 0) {
    console.log(`[MediaUpdate] Uploading new file to R2: ${uploadFile.name}`);
    // Delete old R2 asset if it was stored in R2
    if (currentKey) {
      console.log(`[MediaUpdate] Deleting old key: ${currentKey}`);
      await deleteFromR2(currentKey);
    }
    
    // Upload new asset
    try {
      const { url, key } = await uploadToR2(uploadFile, folder);
      console.log(`[MediaUpdate] Upload success: ${url}`);
      return { url, key, source: 'r2' };
    } catch (err) {
      console.error(`[MediaUpdate] Upload failure:`, err);
      throw err;
    }
  }

  // 2. If NO new file, but a NEW manual URL is provided that DIFFERS from the current URL
  if (manualUrl && manualUrl !== currentUrl) {
    console.log(`[MediaUpdate] Manual URL provided: ${manualUrl}`);
    // Delete old R2 asset if it was stored in R2 (switching to external)
    if (currentKey) {
      console.log(`[MediaUpdate] Deleting old key (switching to external): ${currentKey}`);
      await deleteFromR2(currentKey);
    }
    return { url: manualUrl, key: null, source: 'external' };
  }

  // 3. No change - keep current
  return { 
    url: currentUrl, 
    key: currentKey, 
    source: currentKey ? 'r2' : 'external' 
  };
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
  await requireAdmin();
  
  const rawData = {
    companyName: (formData.get("companyName") as string) || "",
    email: (formData.get("email") as string) || "",
    phone: (formData.get("phone") as string) || "",
    phoneNational: (formData.get("phoneNational") as string) || "",
    phoneGCI: (formData.get("phoneGCI") as string) || "",
    address: (formData.get("address") as string) || "",
    workingHours: (formData.get("workingHours") as string) || "",
    exchangeRate: (formData.get("exchangeRate") as string) || "1500",
    facebook: (formData.get("facebook") as string) || "",
    instagram: (formData.get("instagram") as string) || "",
    whatsapp: (formData.get("whatsapp") as string) || "",
    linkedin: (formData.get("linkedin") as string) || "",
    showPrice: formData.get("showPrice") === "on" ? "true" : "false",
    showStock: formData.get("showStock") === "on" ? "true" : "false",
  };

  const validated = settingsSchema.parse(rawData);

  await db.update(siteSettings).set({
    ...validated,
    updatedAt: new Date(),
  }).where(eq(siteSettings.id, "main"));
  
  revalidatePath("/", "layout");
  revalidatePath("/admin/dashboard/settings");
}

export async function updateAdminPassword(formData: FormData) {
  await requireAdmin();
  
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update all admins (usually just one)
  await db.update(users).set({
    password: hashedPassword,
  }).where(eq(users.role, "admin"));

  revalidatePath("/admin/dashboard/settings");
  return { success: true, message: "تم تحديث كلمة المرور بنجاح" };
}

// Subsidiaries
export async function getSubsidiaries() {
  return await db.select().from(subsidiaries);
}

export async function createSubsidiary(formData: FormData) {
  await requireAdmin();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const logoFile = formData.get("logoFile") as File;

  const { url, key, source } = await handleMediaUpdate(logoUrl, logoFile, null, null, "subsidiaries");

  await db.insert(subsidiaries).values({
    name,
    description,
    logoUrl: url,
    logoKey: key,
    logoSource: source,
  });

  revalidatePath("/admin/dashboard/subsidiaries");
  revalidatePath("/");
  return { success: true };
}

export async function updateSubsidiary(id: string, formData: FormData) {
  await requireAdmin();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const logoFile = formData.get("logoFile") as File;

  const [current] = await db.select().from(subsidiaries).where(eq(subsidiaries.id, id)).limit(1);
  if (!current) throw new Error("Subsidiary not found");

  const { url, key, source } = await handleMediaUpdate(
    logoUrl, 
    logoFile, 
    current.logoUrl, 
    current.logoKey, 
    "subsidiaries"
  );

  await db.update(subsidiaries).set({
    name,
    description,
    logoUrl: url,
    logoKey: key,
    logoSource: source,
  }).where(eq(subsidiaries.id, id));

  revalidatePath("/admin/dashboard/subsidiaries");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSubsidiary(id: string) {
  await requireAdmin();
  
  try {
    const [current] = await db.select().from(subsidiaries).where(eq(subsidiaries.id, id)).limit(1);
    if (current?.logoKey) {
      await deleteFromR2(current.logoKey);
    }

    await db.delete(subsidiaries).where(eq(subsidiaries.id, id));
    revalidatePath("/admin/dashboard/subsidiaries");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete Subsidiary Error:", error);
    return { error: "لا يمكن حذف هذه الشركة لأنها مرتبطة بمنتجات حالياً." };
  }
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
  await requireAdmin();
  try {
    await db.delete(messages).where(eq(messages.id, id));
    revalidatePath("/admin/dashboard/messages");
    return { success: true };
  } catch (error) {
    return { error: "فشل حذف الرسالة." };
  }
}

// Accounting / Quotes / Invoices
export async function createQuote(formData: FormData) {
  await requireAdmin();
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
      await db.insert(quoteItems).values({
        quoteId: newQuote.id,
        productId: item.productId,
        description: item.title,
        quantity: item.quantity.toString(),
        unitPrice: item.price.toString(),
        totalPrice: item.total.toString(),
      });

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
  await requireAdmin();
  try {
    await db.delete(quotes).where(eq(quotes.id, id));
    revalidatePath("/admin/dashboard/accounting");
    return { success: true };
  } catch (error) {
    return { error: "فشل حذف الفاتورة." };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  
  try {
    const [current] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (current) {
      if (current.imageKey) await deleteFromR2(current.imageKey);
      if (current.pdfKey) await deleteFromR2(current.pdfKey);
    }

    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { error: "فشل حذف المنتج." };
  }
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string || "0";
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    const pdfUrl = formData.get("pdfUrl") as string;
    const pdfFile = formData.get("pdfFile") as File;
    const subsidiaryId = formData.get("subsidiaryId") as string;
    const hasSizes = formData.get("hasSizes") === "on" ? "true" : "false";
    const hasColors = formData.get("hasColors") === "on" ? "true" : "false";
    const sizesRaw = formData.get("sizes") as string;
    const colorsRaw = formData.get("colors") as string;
    const variantInventoryRaw = formData.get("variantInventory") as string;
    const unifyPrice = formData.get("unifyPrice") === "on" ? "true" : "false";
    
    let sizes = sizesRaw ? JSON.parse(sizesRaw) : [];
    let colors = colorsRaw ? JSON.parse(colorsRaw) : [];
    let variantInventory = variantInventoryRaw ? JSON.parse(variantInventoryRaw) : [];

    // If sizes are enabled, set price to the first size's price and calculate total stock
    let finalPrice = price;
    let finalStock = stock;
    
    if (hasSizes === "true" && hasColors === "true" && variantInventory.length > 0) {
      finalPrice = variantInventory[0].price || price;
      const totalStock = variantInventory.reduce((acc: number, curr: any) => acc + (Math.floor(Number(curr.stock)) || 0), 0);
      finalStock = totalStock.toString();
    } else if (hasSizes === "true" && sizes.length > 0) {
      finalPrice = sizes[0].price;
      const totalStock = sizes.reduce((acc: number, curr: any) => acc + (Math.floor(Number(curr.stock)) || 0), 0);
      finalStock = totalStock.toString();
    } else if (hasColors === "true" && variantInventory.length > 0) {
      finalPrice = variantInventory[0].price || price;
      const totalStock = variantInventory.reduce((acc: number, curr: any) => acc + (Math.floor(Number(curr.stock)) || 0), 0);
      finalStock = totalStock.toString();
    } else {
      finalStock = Math.floor(Number(stock) || 0).toString();
    }

    const image = await handleMediaUpdate(imageUrl, imageFile, null, null, "products/images");
    const pdf = await handleMediaUpdate(pdfUrl, pdfFile, null, null, "products/pdfs");

    await db.insert(products).values({
      title,
      category,
      price: finalPrice,
      stock: finalStock,
      description,
      imageUrl: image.url || "/images/product.png",
      imageKey: image.key,
      imageSource: image.source,
      pdfUrl: pdf.url,
      pdfKey: pdf.key,
      pdfSource: pdf.source,
      subsidiaryId: subsidiaryId || null,
      hasSizes,
      sizes,
      hasColors,
      colors,
      variantInventory,
      unifyPrice,
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { error: "فشل إنشاء المنتج. يرجى التحقق من المدخلات." };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  
  try {
    const [current] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!current) throw new Error("Product not found");

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    const pdfUrl = formData.get("pdfUrl") as string;
    const pdfFile = formData.get("pdfFile") as File;
    const subsidiaryId = formData.get("subsidiaryId") as string;
    const hasSizes = formData.get("hasSizes") === "on" ? "true" : "false";
    const hasColors = formData.get("hasColors") === "on" ? "true" : "false";
    const sizesRaw = formData.get("sizes") as string;
    const colorsRaw = formData.get("colors") as string;
    const variantInventoryRaw = formData.get("variantInventory") as string;
    const unifyPrice = formData.get("unifyPrice") === "on" ? "true" : "false";
    
    let sizes = sizesRaw ? JSON.parse(sizesRaw) : [];
    let colors = colorsRaw ? JSON.parse(colorsRaw) : [];
    let variantInventory = variantInventoryRaw ? JSON.parse(variantInventoryRaw) : [];

    // If sizes are enabled, set price to the first size's price and calculate total stock
    let finalPrice = price;
    let finalStock = stock;

    if (hasSizes === "true" && hasColors === "true" && variantInventory.length > 0) {
      finalPrice = variantInventory[0].price || price;
      const totalStock = variantInventory.reduce((acc: number, curr: any) => acc + (Math.floor(Number(curr.stock)) || 0), 0);
      finalStock = totalStock.toString();
    } else if (hasSizes === "true" && sizes.length > 0) {
      finalPrice = sizes[0].price;
      const totalStock = sizes.reduce((acc: number, curr: any) => acc + (Math.floor(Number(curr.stock)) || 0), 0);
      finalStock = totalStock.toString();
    } else if (hasColors === "true" && variantInventory.length > 0) {
      finalPrice = variantInventory[0].price || price;
      const totalStock = variantInventory.reduce((acc: number, curr: any) => acc + (Math.floor(Number(curr.stock)) || 0), 0);
      finalStock = totalStock.toString();
    } else {
      finalStock = Math.floor(Number(stock) || 0).toString();
    }

    const image = await handleMediaUpdate(
      imageUrl, 
      imageFile, 
      current.imageUrl, 
      current.imageKey, 
      "products/images"
    );
    
    const pdf = await handleMediaUpdate(
      pdfUrl, 
      pdfFile, 
      current.pdfUrl, 
      current.pdfKey, 
      "products/pdfs"
    );

    const updateData: any = {
      title,
      category,
      price: finalPrice,
      description,
      imageUrl: image.url || "/images/product.png",
      imageKey: image.key,
      imageSource: image.source,
      pdfUrl: pdf.url,
      pdfKey: pdf.key,
      pdfSource: pdf.source,
      subsidiaryId: subsidiaryId || null,
      hasSizes,
      sizes,
      hasColors,
      colors,
      variantInventory,
      unifyPrice,
    };

    if (finalStock !== null) {
      updateData.stock = finalStock;
    }

    await db.update(products).set(updateData).where(eq(products.id, id));

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { error: "فشل تحديث المنتج. تأكد من إعدادات التخزين." };
  }
}

export async function updateStock(productId: string, quantity: string) {
  const cleanQuantity = Math.floor(Number(quantity) || 0).toString();
  await db.update(products).set({ stock: cleanQuantity }).where(eq(products.id, productId));
  revalidatePath("/admin/dashboard/inventory");
  revalidatePath("/products");
  return { success: true };
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  
  if (name) {
    await db.insert(categories).values({ name });
  }

  revalidatePath("/admin/dashboard/categories");
  redirect("/admin/dashboard/categories");
}


export async function deleteCategory(id: string) {
  await requireAdmin();
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/dashboard/categories");
    return { success: true };
  } catch (error) {
    return { error: "فشل حذف القسم." };
  }
}

export async function markMessageAsReplied(id: string) {
  await requireAdmin();
  await db.update(messages).set({ replied: "true" }).where(eq(messages.id, id));
  revalidatePath("/admin/dashboard/messages");
}

export async function deleteRepliedMessages() {
  await requireAdmin();
  await db.delete(messages).where(eq(messages.replied, "true"));
  revalidatePath("/admin/dashboard/messages");
}


export async function createProject(formData: FormData) {
  await requireAdmin();
  
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;

    const image = await handleMediaUpdate(imageUrl, imageFile, null, null, "projects");

    await db.insert(projects).values({
      title,
      description,
      category,
      imageUrl: image.url || "/images/project.png",
      imageKey: image.key,
      imageSource: image.source,
    });

    revalidatePath("/admin/dashboard/projects");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Create Project Error:", error);
    return { error: "فشل إنشاء المشروع." };
  }
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  
  try {
    const [current] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (!current) throw new Error("Project not found");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;

    const image = await handleMediaUpdate(
      imageUrl, 
      imageFile, 
      current.imageUrl, 
      current.imageKey, 
      "projects"
    );

    await db.update(projects).set({
      title,
      description,
      category,
      imageUrl: image.url || "/images/project.png",
      imageKey: image.key,
      imageSource: image.source,
    }).where(eq(projects.id, id));

    revalidatePath("/admin/dashboard/projects");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Update Project Error:", error);
    return { error: "فشل تحديث المشروع." };
  }
}

export async function deleteProject(id: string) {
  await requireAdmin();
  
  try {
    const [current] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (current?.imageKey) {
      await deleteFromR2(current.imageKey);
    }

    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/admin/dashboard/projects");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return { error: "فشل حذف المشروع." };
  }
}
