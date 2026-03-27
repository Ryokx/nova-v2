/**
 * Route API — Création d'un SetupIntent Stripe (empreinte bancaire à 0€)
 *
 * POST /api/setup-intent
 *
 * Crée un SetupIntent pour enregistrer un moyen de paiement sans prélèvement.
 * Utilisé par : booking, urgency-modal, payment-methods.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { getOrCreateCustomer, createSetupIntent } from "@/lib/stripe";

export async function POST() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user!.id },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Récupère ou crée le Stripe Customer
    const customerId = await getOrCreateCustomer({
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name ?? undefined,
      existingCustomerId: dbUser.stripeCustomerId,
    });

    // Sauvegarde le customerId si nouveau
    if (!dbUser.stripeCustomerId) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Crée le SetupIntent
    const setupIntent = await createSetupIntent(customerId);

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error("[setup-intent] Error:", err);
    return NextResponse.json({ error: "Erreur lors de la création du SetupIntent" }, { status: 500 });
  }
}
