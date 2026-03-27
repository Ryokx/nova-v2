/**
 * Route API — Gestion des paiements par l'admin
 *
 * PATCH /api/admin/payments
 *
 * Permet à l'administrateur de :
 * - Libérer un paiement séquestre (action: "release") → paiement à l'artisan
 * - Rembourser un client (action: "refund") → annulation de la mission
 *
 * Utilisé principalement pour la résolution de litiges.
 * Réservé aux administrateurs.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-middleware";

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { paymentId, action } = body as { paymentId: string; action: "release" | "refund" };

  /* Validation des paramètres requis */
  if (!paymentId || !action) {
    return NextResponse.json({ error: "paymentId et action requis" }, { status: 400 });
  }

  /* Recherche du paiement */
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
  }

  if (action === "release") {
    /* Libération du séquestre → l'artisan reçoit le paiement */
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "RELEASED", releasedAt: new Date() },
    });
    await prisma.mission.update({
      where: { id: payment.missionId },
      data: { status: "VALIDATED" },
    });
  } else {
    /* Remboursement → le client récupère son argent */
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "REFUNDED" },
    });
    await prisma.mission.update({
      where: { id: payment.missionId },
      data: { status: "CANCELLED" },
    });
  }

  return NextResponse.json({ success: true });
}
