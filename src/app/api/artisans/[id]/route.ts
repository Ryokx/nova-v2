/**
 * Route API — Fiche détaillée d'un artisan (publique)
 *
 * GET /api/artisans/[id]
 *
 * Retourne le profil complet d'un artisan :
 * - Informations personnelles (nom, avatar, téléphone)
 * - Les 10 derniers avis avec le nom de l'auteur
 * - Les documents vérifiés (type uniquement, pas le contenu)
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const artisan = await prisma.artisanProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, avatar: true, phone: true } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10, // Limite aux 10 derniers avis
      },
      documents: {
        where: { verified: true }, // Uniquement les documents vérifiés
        select: { type: true, verified: true },
      },
    },
  });

  if (!artisan) {
    return NextResponse.json({ error: "Artisan introuvable" }, { status: 404 });
  }

  return NextResponse.json(artisan);
}
