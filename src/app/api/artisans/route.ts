/**
 * Route API — Recherche d'artisans (publique)
 *
 * GET /api/artisans?category=Plombier&search=Paris
 *
 * Retourne les artisans disponibles, avec filtres optionnels :
 * - category : filtre par métier (ex: "Plombier", "Électricien")
 * - search   : recherche dans le nom, le métier ou la ville
 *
 * Résultats triés par note décroissante.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  /* Construction dynamique du filtre Prisma */
  const where: Record<string, unknown> = { isAvailable: true };

  /* Filtre par catégorie de métier */
  if (category && category !== "all") {
    where.trade = { contains: category, mode: "insensitive" };
  }

  /* Filtre de recherche textuelle (nom, métier, ville) */
  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { trade: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const artisans = await prisma.artisanProfile.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { rating: "desc" },
  });

  return NextResponse.json(artisans);
}
