/**
 * Route API — Notifications de l'utilisateur connecté
 *
 * GET   /api/notifications        — Récupère les 20 dernières notifications
 * PATCH /api/notifications        — Marque une ou toutes les notifications comme lues
 *
 * Le PATCH accepte deux modes :
 * - { id: "..." }    → marque une notification spécifique comme lue
 * - { readAll: true } → marque toutes les notifications non lues comme lues
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";

/**
 * GET — Récupère les 20 dernières notifications de l'utilisateur
 */
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const notifications = await prisma.notification.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(notifications);
}

/**
 * PATCH — Marque les notifications comme lues
 */
export async function PATCH(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { id, readAll } = body as { id?: string; readAll?: boolean };

  if (readAll) {
    /* Marque TOUTES les notifications non lues comme lues */
    await prisma.notification.updateMany({
      where: { userId: user!.id, read: false },
      data: { read: true },
    });
  } else if (id) {
    /* Marque UNE notification spécifique comme lue */
    await prisma.notification.updateMany({
      where: { id, userId: user!.id },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
