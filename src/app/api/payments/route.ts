export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { z } from "zod";

const createPaymentSchema = z.object({
  missionId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["card", "transfer", "apple_pay"]).default("card"),
  installments: z.enum(["1", "3", "4"]).default("1"),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createPaymentSchema.parse(body);

    // Verify mission belongs to user
    const mission = await prisma.mission.findFirst({
      where: { id: data.missionId, clientId: user!.id },
    });

    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
    }

    const commissionRate = 0.05;
    const commissionAmount = data.amount * commissionRate;

    const payment = await prisma.payment.create({
      data: {
        missionId: data.missionId,
        amount: data.amount,
        status: "ESCROWED",
        escrowedAt: new Date(),
        commissionAmount,
        commissionRate,
      },
    });

    // Update mission amount and status
    await prisma.mission.update({
      where: { id: data.missionId },
      data: { amount: data.amount, status: "ACCEPTED" },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error("Payment error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
