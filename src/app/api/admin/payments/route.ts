export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-middleware";

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { paymentId, action } = body as { paymentId: string; action: "release" | "refund" };

  if (!paymentId || !action) {
    return NextResponse.json({ error: "paymentId et action requis" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
  }

  if (action === "release") {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "RELEASED", releasedAt: new Date() },
    });
    await prisma.mission.update({
      where: { id: payment.missionId },
      data: { status: "VALIDATED" },
    });
  } else {
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
