/**
 * Route API — Détail et mise à jour d'un devis spécifique
 *
 * GET   /api/devis/[id]  — Récupère le détail d'un devis
 * PATCH /api/devis/[id]  — Met à jour le statut ou ajoute la signature du client
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET — Récupère un devis avec les infos de la mission et de l'artisan
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const devis = await prisma.devis.findUnique({
    where: { id: params.id },
    include: {
      mission: {
        include: {
          artisan: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!devis) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  }

  return NextResponse.json(devis);
}

/**
 * PATCH — Met à jour un devis
 * Actions possibles :
 * - Changer le statut (ACCEPTED, REFUSED, etc.)
 * - Ajouter la signature du client (signatureData + horodatage)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const { status, signatureData } = body as { status?: string; signatureData?: string };

  const devis = await prisma.devis.update({
    where: { id: params.id },
    data: {
      ...(status && { status: status as never }),
      ...(signatureData && { signatureData, signedAt: new Date() }),
    },
  });

  return NextResponse.json(devis);
}
