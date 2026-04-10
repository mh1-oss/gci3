import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "agt-group";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g., https://pub-xxx.r2.dev

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Helper to construct the public URL from a key safely.
 */
export function getPublicUrl(key: string | null): string | null {
  if (!key || !R2_PUBLIC_URL) return null;
  
  // Strip trailing slash from base if present
  const base = R2_PUBLIC_URL.endsWith('/') ? R2_PUBLIC_URL.slice(0, -1) : R2_PUBLIC_URL;
  // Ensure key doesn't start with a slash
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  
  return `${base}/${cleanKey}`;
}

/**
 * Uploads a file to Cloudflare R2.
 */
export async function uploadToR2(file: File, folder: string = "general") {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
    throw new Error("Cloudflare R2 environment variables are not properly configured.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fileExtension = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  // Return the public URL and the storage key
  return {
    url: getPublicUrl(fileName) || fileName,
    key: fileName,
  };
}

/**
 * Deletes an object from Cloudflare R2 bucket.
 */
export async function deleteFromR2(key: string | null) {
  if (!key || !R2_ACCOUNT_ID) return;
  
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error(`Failed to delete asset ${key} from R2:`, error);
  }
}
