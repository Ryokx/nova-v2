/**
 * Upload de fichiers — Cloudflare R2 (compatible S3)
 *
 * Gère l'upload de documents, photos, vidéos et avatars.
 * En développement, peut utiliser MinIO en local comme fallback.
 *
 * Trois modes d'upload :
 * 1. URL présignée pour upload direct depuis le navigateur
 * 2. URL présignée pour lecture de fichier privé
 * 3. Upload direct depuis le serveur (pièces jointes email, etc.)
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// --- Configuration R2 ---
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? "nova-uploads";

// Client S3 compatible Cloudflare R2 (ou MinIO en local)
const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ACCOUNT_ID
    ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "http://localhost:9000",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/** Catégories de fichiers autorisées */
type UploadCategory = "documents" | "photos" | "videos" | "avatars";

/** Génère une URL présignée pour upload direct côté client (expire en 10 min) */
export async function getPresignedUploadUrl(params: {
  fileName: string;
  contentType: string;
  category: UploadCategory;
  userId: string;
}) {
  const { fileName, contentType, category, userId } = params;

  // Chemin unique : catégorie/userId/timestamp-nom-nettoyé
  const key = `${category}/${userId}/${Date.now()}-${sanitizeFileName(fileName)}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

  // URL publique si configurée, sinon juste la clé
  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : key;

  return { presignedUrl, key, publicUrl };
}

/** Génère une URL présignée pour lire un fichier privé (expire en 1h) */
export async function getPresignedReadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

/** Upload direct depuis le serveur (ex: pièces jointes email) */
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

/** Nettoie un nom de fichier (minuscules, caractères spéciaux remplacés par des tirets) */
function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}
