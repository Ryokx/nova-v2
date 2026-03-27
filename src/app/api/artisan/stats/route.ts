/**
 * Route API — Statistiques du tableau de bord artisan
 *
 * GET /api/artisan/stats
 *
 * Retourne les KPIs de l'artisan connecté :
 * - Chiffre d'affaires du mois en cours
 * - Nombre de missions actives
 * - Nombre de devis en attente
 * - Note moyenne et nombre d'avis
 * - Prochains rendez-vous (5 max)
 *
 * Réservé aux artisans authentifiés.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireArtisan } from "@/lib/api-middleware";

export async function GET() {
  const { user, error } = await requireArtisan();
  if (error) return error;

  /* Récupération du profil avec les missions et devis en attente */
  const profile = await prisma.artisanProfile.findUnique({
    where: { userId: user!.id },
    include: {
      missions: {
        include: {
          payment: true,
          client: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      devis: { where: { status: "SENT" } },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profil artisan introuvable" }, { status: 404 });
  }

  /* Calcul du CA du mois en cours (paiements libérés depuis le 1er du mois) */
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthRevenue = profile.missions
    .filter((m) => m.payment?.releasedAt && m.payment.releasedAt >= monthStart)
    .reduce((sum, m) => sum + (m.payment?.amount ?? 0), 0);

  /* Comptage des missions actives (en attente, acceptées, en cours) */
  const activeMissions = profile.missions.filter((m) =>
    ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(m.status),
  );

  /* Nombre de devis envoyés non encore acceptés */
  const pendingDevis = profile.devis.length;

  /* 5 prochains rendez-vous planifiés */
  const upcomingAppointments = profile.missions
    .filter((m) => m.scheduledDate && m.scheduledDate >= now && ["PENDING", "ACCEPTED"].includes(m.status))
    .slice(0, 5)
    .map((m) => ({
      id: m.id,
      client: m.client.name ?? "Client",
      type: m.type,
      date: m.scheduledDate,
      slot: m.scheduledSlot,
      status: m.status,
    }));

  return NextResponse.json({
    monthRevenue,
    activeMissions: activeMissions.length,
    pendingDevis,
    rating: profile.rating,
    reviewCount: profile.reviewCount,
    upcomingAppointments,
  });
}
