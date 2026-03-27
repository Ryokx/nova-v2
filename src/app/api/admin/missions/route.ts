/**
 * Route API — Liste des missions pour l'administration
 *
 * GET /api/admin/missions?status=DISPUTED
 *
 * Retourne les 50 dernières missions, avec filtre optionnel par statut.
 * Inclut les infos du client, de l'artisan et du paiement.
 * Réservé aux administrateurs.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-middleware";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  /* Lecture du filtre de statut depuis les query params */
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  /* Requête avec les relations utiles */
  const missions = await prisma.mission.findMany({
    where,
    include: {
      client: { select: { name: true } },
      artisan: { include: { user: { select: { name: true } } } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(missions);
}
