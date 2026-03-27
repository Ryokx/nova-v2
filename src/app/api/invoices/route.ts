/**
 * Route API — Liste des factures de l'artisan connecté
 *
 * GET /api/invoices
 *
 * Retourne toutes les factures associées au profil artisan,
 * avec les infos de la mission et du client.
 * Réservé aux artisans authentifiés.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireArtisan } from "@/lib/api-middleware";

export async function GET() {
  const { user, error } = await requireArtisan();
  if (error) return error;

  /* Récupération du profil artisan */
  const profile = await prisma.artisanProfile.findUnique({
    where: { userId: user!.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  /* Liste des factures triées par date décroissante */
  const invoices = await prisma.invoice.findMany({
    where: { artisanId: profile.id },
    include: {
      mission: {
        include: { client: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}
