export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { z } from "zod";

const createReviewSchema = z.object({
  missionId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createReviewSchema.parse(body);

    const mission = await prisma.mission.findFirst({
      where: { id: data.missionId, clientId: user!.id },
      include: { artisan: true },
    });

    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        missionId: data.missionId,
        userId: user!.id,
        artisanProfileId: mission.artisan.id,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Update mission status to VALIDATED
    await prisma.mission.update({
      where: { id: data.missionId },
      data: { status: "VALIDATED" },
    });

    // Release payment
    await prisma.payment.updateMany({
      where: { missionId: data.missionId },
      data: { status: "RELEASED", releasedAt: new Date() },
    });

    // Update artisan rating
    const reviews = await prisma.review.findMany({
      where: { artisanProfileId: mission.artisan.id },
    });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.artisanProfile.update({
      where: { id: mission.artisan.id },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error("Review error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
