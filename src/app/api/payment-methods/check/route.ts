/**
 * Route API — Vérifie si l'utilisateur a un moyen de paiement enregistré
 *
 * GET /api/payment-methods/check
 *
 * Retourne { hasPaymentMethod: boolean }
 * Utilisé par urgency-modal pour vérifier avant de continuer.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { stripe } from "@/lib/stripe";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user!.id },
      select: { stripeCustomerId: true },
    });

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json({ hasPaymentMethod: false });
    }

    // Vérifie les moyens de paiement enregistrés chez Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: dbUser.stripeCustomerId,
      type: "card",
      limit: 1,
    });

    return NextResponse.json({
      hasPaymentMethod: paymentMethods.data.length > 0,
    });
  } catch (err) {
    console.error("[payment-methods/check] Error:", err);
    return NextResponse.json({ hasPaymentMethod: false });
  }
}
