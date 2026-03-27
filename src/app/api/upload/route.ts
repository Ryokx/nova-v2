/**
 * Route API — Génération d'URL d'upload pré-signée (Cloudflare R2)
 *
 * POST /api/upload
 *
 * Génère une URL pré-signée permettant au client d'uploader un fichier
 * directement vers Cloudflare R2 sans passer par le serveur Nova.
 *
 * Catégories acceptées : documents, photos, videos, avatars
 * Nécessite d'être authentifié.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-middleware";
import { getPresignedUploadUrl } from "@/lib/upload";
import { z } from "zod";

/* Schéma de validation de la demande d'upload */
const uploadSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  category: z.enum(["documents", "photos", "videos", "avatars"]),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = uploadSchema.parse(body);

    /* Génération de l'URL pré-signée via le helper R2 */
    const result = await getPresignedUploadUrl({
      fileName: data.fileName,
      contentType: data.contentType,
      category: data.category,
      userId: user!.id,
    });

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error("Upload presign error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
