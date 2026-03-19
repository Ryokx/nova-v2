export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireArtisan } from "@/lib/api-middleware";

export async function GET() {
  const { user, error } = await requireArtisan();
  if (error) return error;

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

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthRevenue = profile.missions
    .filter((m) => m.payment?.releasedAt && m.payment.releasedAt >= monthStart)
    .reduce((sum, m) => sum + (m.payment?.amount ?? 0), 0);

  const activeMissions = profile.missions.filter((m) =>
    ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(m.status),
  );

  const pendingDevis = profile.devis.length;

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
