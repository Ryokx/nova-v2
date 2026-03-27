/**
 * Route API — Création d'un avis client
 *
 * POST /api/reviews
 *
 * Quand un client laisse un avis :
 * 1. Vérifie que la mission appartient bien au client
 * 2. Crée l'avis (note + commentaire)
 * 3. Passe la mission en statut "VALIDATED"
 * 4. Libère le paiement séquestre (statut "RELEASED")
 * 5. Recalcule la note moyenne de l'artisan
 *
 * C'est le point central du flux Nova : l'avis déclenche la libération du paiement.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { releaseEscrowPayment } from "@/lib/stripe";
import { z } from "zod";

/* Schéma de validation : note de 1 à 5 + commentaire optionnel */
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

    /* Vérifie que la mission appartient au client connecté */
    const mission = await prisma.mission.findFirst({
      where: { id: data.missionId, clientId: user!.id },
      include: { artisan: true },
    });

    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
    }

    /* Création de l'avis */
    const review = await prisma.review.create({
      data: {
        missionId: data.missionId,
        userId: user!.id,
        artisanProfileId: mission.artisan.id,
        rating: data.rating,
        comment: data.comment,
      },
    });

    /* Passage de la mission en "VALIDATED" */
    await prisma.mission.update({
      where: { id: data.missionId },
      data: { status: "VALIDATED" },
    });

    /* Libération du paiement séquestre via Stripe (capture réelle) */
    const payment = await prisma.payment.findFirst({
      where: { missionId: data.missionId },
    });

    if (payment?.stripePaymentIntentId) {
      await releaseEscrowPayment(payment.stripePaymentIntentId);
      /* Le webhook payment_intent.succeeded mettra à jour le statut RELEASED */
    } else {
      /* Fallback si pas de PaymentIntent Stripe (legacy / mode test sans Stripe) */
      await prisma.payment.updateMany({
        where: { missionId: data.missionId },
        data: { status: "RELEASED", releasedAt: new Date() },
      });
    }

    /* Recalcul de la note moyenne de l'artisan */
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
