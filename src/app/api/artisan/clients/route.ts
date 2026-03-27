/**
 * Route API — Liste des clients d'un artisan
 *
 * GET /api/artisan/clients
 *
 * Récupère toutes les missions de l'artisan connecté,
 * puis regroupe les données par client unique :
 * - Nombre de missions
 * - Chiffre d'affaires total (paiements libérés uniquement)
 * - Date de la dernière mission
 *
 * Résultats triés par date de dernière mission décroissante.
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

  /* Récupération de toutes les missions avec les infos client et paiement */
  const missions = await prisma.mission.findMany({
    where: { artisanId: profile.id },
    include: {
      client: { select: { id: true, name: true, phone: true, email: true, avatar: true } },
      payment: { select: { amount: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  /* Regroupement par client : on agrège les missions et le CA */
  const clientMap = new Map<string, {
    id: string;
    name: string;
    phone: string | null;
    email: string;
    avatar: string | null;
    missions: number;
    lastDate: Date;
    total: number;
  }>();

  for (const m of missions) {
    const c = m.client;
    /* Ne comptabilise que les paiements effectivement libérés */
    const amount = m.payment?.status === "RELEASED" ? (m.payment.amount ?? 0) : 0;
    const existing = clientMap.get(c.id);

    if (existing) {
      existing.missions += 1;
      existing.total += amount;
      if (m.createdAt > existing.lastDate) existing.lastDate = m.createdAt;
    } else {
      clientMap.set(c.id, {
        id: c.id,
        name: c.name ?? "Client",
        phone: c.phone,
        email: c.email,
        avatar: c.avatar,
        missions: 1,
        lastDate: m.createdAt,
        total: amount,
      });
    }
  }

  /* Tri par date de dernière mission (plus récent en premier) */
  const clients = Array.from(clientMap.values()).sort((a, b) => b.lastDate.getTime() - a.lastDate.getTime());

  return NextResponse.json({
    clients,
    totalClients: clients.length,
    totalMissions: missions.length,
    totalRevenue: clients.reduce((sum, c) => sum + c.total, 0),
  });
}
