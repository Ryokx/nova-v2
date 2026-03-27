/**
 * Route API — Gestion des abonnements artisan
 *
 * POST /api/subscriptions
 *
 * Redirige toujours vers Stripe Checkout pour le paiement.
 * Si un abonnement existe déjà, l'ancien est annulé après le paiement du nouveau (via webhook).
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import {
  getOrCreateCustomer,
  createSubscriptionCheckout,
} from "@/lib/stripe";
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
    const data = subscriptionSchema.parse(body);

    /* Récupère l'utilisateur + profil artisan */
    const dbUser = await prisma.user.findUnique({
      where: { id: user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        role: true,
        artisanProfile: {
          select: {
            id: true,
            stripeSubscriptionId: true,
            currentPlan: true,
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    if (dbUser.role !== "ARTISAN" || !dbUser.artisanProfile) {
      return NextResponse.json({ error: "Réservé aux artisans" }, { status: 403 });
    }

    /* Crée ou récupère le Customer Stripe */
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

    const profile = dbUser.artisanProfile;
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    /* Toujours rediriger vers Stripe Checkout pour valider le paiement */
    const session = await createSubscriptionCheckout({
      customerId,
      planId: data.planId,
      billing: data.billing,
      successUrl: `${baseUrl}/artisan-subscription?success=true&plan=${data.planId}`,
      cancelUrl: `${baseUrl}/artisan-subscription?cancelled=true`,
      existingSubscriptionId: profile.stripeSubscriptionId ?? undefined,
    });

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error("Subscription error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
