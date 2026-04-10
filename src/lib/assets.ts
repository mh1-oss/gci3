import { getPublicUrl } from "./s3";

/**
 * Normalizes a row from the database, ensuring R2 assets use the current public URL.
 */
export function normalizeSubsidiary(sub: any): any {
  if (!sub) return sub;
  return {
    ...sub,
    logoUrl: sub.logoKey ? getPublicUrl(sub.logoKey) : sub.logoUrl
  };
}

export function normalizeProduct(product: any): any {
  if (!product) return product;
  return {
    ...product,
    imageUrl: product.imageKey ? getPublicUrl(product.imageKey) : product.imageUrl,
    pdfUrl: product.pdfKey ? getPublicUrl(product.pdfKey) : product.pdfUrl
  };
}

export function normalizeProject(project: any): any {
  if (!project) return project;
  return {
    ...project,
    imageUrl: project.imageKey ? getPublicUrl(project.imageKey) : project.imageUrl
  };
}
