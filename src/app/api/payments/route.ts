/**
 * Route API — Création d'un paiement séquestre via Stripe Checkout
 *
 * POST /api/payments
 *
 * Quand le client accepte un devis :
 * 1. Vérifie que la mission appartient au client
 * 2. Vérifie que l'artisan a un compte Stripe Connect actif
 * 3. Crée un record Payment en statut PENDING
 * 4. Crée une session Stripe Checkout avec capture différée (séquestre)
 * 5. Retourne l'URL de redirection Stripe
 *
 * Le webhook Stripe gère ensuite le passage en ESCROWED puis RELEASED.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";

/* Schéma de validation du paiement */
const createPaymentSchema = z.object({
  missionId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["card", "transfer", "apple_pay"]).default("card"),
  installments: z.enum(["1", "2", "3", "4"]).default("1"),
});

/** Taux de commission Nova : 5% */
const COMMISSION_RATE = 0.05;

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createPaymentSchema.parse(body);

    /* Vérifie que la mission appartient bien au client connecté */
    const mission = await prisma.mission.findFirst({
      where: { id: data.missionId, clientId: user!.id },
      include: { artisan: true },
    });

    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
    }

    /* Vérifie que l'artisan a un compte Stripe Connect */
    if (!mission.artisan.stripeAccountId) {
      return NextResponse.json(
        { error: "L'artisan n'a pas encore configuré son compte de paiement" },
        { status: 400 },
      );
    }

    /* Montant en centimes pour Stripe */
    const amountCents = Math.round(data.amount * 100);
    const commissionAmount = data.amount * COMMISSION_RATE;

    /* Crée le record Payment en PENDING (sera ESCROWED via webhook) */
    const payment = await prisma.payment.create({
      data: {
        missionId: data.missionId,
        amount: data.amount,
        status: "PENDING",
        commissionAmount,
        commissionRate: COMMISSION_RATE,
      },
    });

    /* Mise à jour du montant sur la mission */
    await prisma.mission.update({
      where: { id: data.missionId },
      data: { amount: data.amount },
    });

    /* Crée la session Stripe Checkout avec capture différée */
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const session = await createCheckoutSession({
      amount: amountCents,
      missionId: data.missionId,
      artisanStripeAccountId: mission.artisan.stripeAccountId,
      successUrl: `${baseUrl}/tracking/${data.missionId}?payment=success`,
      cancelUrl: `${baseUrl}/payment/${data.missionId}?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url, paymentId: payment.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error("Payment error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
