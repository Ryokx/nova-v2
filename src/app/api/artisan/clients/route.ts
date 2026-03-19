import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireArtisan } from "@/lib/api-middleware";

export async function GET() {
  const { user, error } = await requireArtisan();
  if (error) return error;

  const profile = await prisma.artisanProfile.findUnique({
    where: { userId: user!.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  const missions = await prisma.mission.findMany({
    where: { artisanId: profile.id },
    include: {
      client: { select: { id: true, name: true, phone: true, email: true, avatar: true } },
      payment: { select: { amount: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by client
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
    const existing = clientMap.get(c.id);
    const amount = m.payment?.status === "RELEASED" ? (m.payment.amount ?? 0) : 0;

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

  const clients = Array.from(clientMap.values()).sort((a, b) => b.lastDate.getTime() - a.lastDate.getTime());

  return NextResponse.json({
    clients,
    totalClients: clients.length,
    totalMissions: missions.length,
    totalRevenue: clients.reduce((sum, c) => sum + c.total, 0),
  });
}
