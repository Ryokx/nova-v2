/**
 * Route API — Abonnement artisan via Stripe Checkout
 *
 * POST /api/subscriptions
 * Body: { planId: "pro" | "expert", billing: "monthly" | "annual" }
 *
 * Crée une session Checkout Stripe en mode subscription.
 * Retourne { url } pour rediriger l'artisan vers Stripe.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { getOrCreateCustomer, createSubscriptionCheckout } from "@/lib/stripe";
import { z } from "zod";

const subscriptionSchema = z.object({
  planId: z.enum(["pro", "expert"]),
  billing: z.enum(["monthly", "annual"]),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = subscriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { planId, billing } = parsed.data;

    const dbUser = await prisma.user.findUnique({
      where: { id: user!.id },
      select: { id: true, email: true, name: true, stripeCustomerId: true, role: true },
    });

    if (!dbUser || dbUser.role !== "ARTISAN") {
      return NextResponse.json({ error: "Accès réservé aux artisans" }, { status: 403 });
    }

    // Récupère ou crée le Stripe Customer
    const customerId = await getOrCreateCustomer({
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name ?? undefined,
      existingCustomerId: dbUser.stripeCustomerId,
    });

    if (!dbUser.stripeCustomerId) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const session = await createSubscriptionCheckout({
      customerId,
      planId,
      billing,
      successUrl: `${baseUrl}/artisan-subscription?success=true`,
      cancelUrl: `${baseUrl}/artisan-subscription?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[subscriptions] Error:", err);
    return NextResponse.json({ error: "Erreur lors de la création de l'abonnement" }, { status: 500 });
  }
}
