import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? "nova-uploads";

const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ACCOUNT_ID
    ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "http://localhost:9000", // Local MinIO fallback
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

type UploadCategory = "documents" | "photos" | "videos" | "avatars";

/**
 * Generate a presigned URL for direct client-side upload
 */
export async function getPresignedUploadUrl(params: {
  fileName: string;
  contentType: string;
  category: UploadCategory;
  userId: string;
}) {
  const { fileName, contentType, category, userId } = params;
  const key = `${category}/${userId}/${Date.now()}-${sanitizeFileName(fileName)}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // 10 min

  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : key;

  return { presignedUrl, key, publicUrl };
}

/**
 * Generate a presigned URL for reading a private file
 */
export async function getPresignedReadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
}

/**
 * Upload a file directly from the server (for email attachments, etc.)
 */
export async function uploadFile(params: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
  });

  await s3Client.send(command);

  return process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${params.key}`
    : params.key;
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}
