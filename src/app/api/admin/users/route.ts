/**
 * Route API — Liste des utilisateurs pour l'administration
 *
 * GET /api/admin/users?role=ARTISAN&search=dupont
 *
 * Retourne les 50 derniers utilisateurs, avec filtres optionnels :
 * - role   : filtre par rôle (CLIENT, ARTISAN, ADMIN)
 * - search : recherche dans le nom ou l'email
 *
 * Inclut le profil artisan si le rôle est ARTISAN.
 * Réservé aux administrateurs.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-middleware";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  /* Lecture des filtres depuis les query params */
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const search = searchParams.get("search");

  /* Construction dynamique du filtre Prisma */
  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      artisanProfile: {
        select: { trade: true, isVerified: true, rating: true, missionCount: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(users);
}
