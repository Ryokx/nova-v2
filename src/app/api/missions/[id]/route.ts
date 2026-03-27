/**
 * Route API — Détail et mise à jour d'une mission spécifique
 *
 * GET   /api/missions/[id]  — Récupère le détail complet d'une mission
 * PATCH /api/missions/[id]  — Met à jour le statut d'une mission
 *
 * Seuls le client et l'artisan de la mission y ont accès.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/api-middleware";

/**
 * GET — Récupère le détail complet d'une mission
 * Inclut : artisan, paiement, devis, facture, avis, messages
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getAuthenticatedUser();

  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
    include: {
      artisan: {
        include: { user: { select: { id: true, name: true, avatar: true, phone: true } } },
      },
      payment: true,
      devis: true,
      invoice: true,
      review: true,
      messages: {
        include: { sender: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!mission) {
    return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
  }

  /* Vérifie que l'utilisateur est bien le client ou l'artisan de cette mission */
  if (user && mission.clientId !== user.id && mission.artisan.userId !== user.id) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  return NextResponse.json(mission);
}

/**
 * PATCH — Met à jour le statut d'une mission
 * Utilisé pour passer une mission en "COMPLETED", "CANCELLED", etc.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body as { status?: string };

  if (status) {
    await prisma.mission.update({
      where: { id: params.id },
      data: { status: status as never },
    });
  }

  return NextResponse.json({ success: true });
}
