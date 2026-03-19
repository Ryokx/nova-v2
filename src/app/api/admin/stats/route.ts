export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-middleware";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalArtisans,
    totalClients,
    totalMissions,
    activeMissions,
    disputedMissions,
    pendingValidation,
    recentPayments,
    escrowPayments,
    avgRating,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ARTISAN" } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.mission.count(),
    prisma.mission.count({ where: { status: { in: ["PENDING", "ACCEPTED", "IN_PROGRESS"] } } }),
    prisma.mission.count({ where: { status: "DISPUTED" } }),
    prisma.mission.count({ where: { status: "COMPLETED" } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { releasedAt: { gte: weekAgo } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "ESCROWED" } }),
    prisma.artisanProfile.aggregate({ _avg: { rating: true } }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalArtisans,
    totalClients,
    totalMissions,
    activeMissions,
    disputedMissions,
    pendingValidation,
    revenue7d: recentPayments._sum.amount ?? 0,
    escrowBalance: escrowPayments._sum.amount ?? 0,
    avgRating: Math.round((avgRating._avg.rating ?? 0) * 10) / 10,
  });
}
