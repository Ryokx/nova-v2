/**
 * Route API — Activation d'add-ons artisan via Stripe Checkout
 *
 * POST /api/subscriptions/addons
 * Body: { addonIds: string[] }
 *
 * Crée une session Checkout Stripe one-time pour les add-ons sélectionnés.
 * Retourne { url } pour rediriger l'artisan vers Stripe.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { getOrCreateCustomer, stripe } from "@/lib/stripe";
import { z } from "zod";

/** Prix Stripe des add-ons (à créer dans le dashboard Stripe) */
const ADDON_PRICES: Record<string, { priceId: string; name: string }> = {
  sms: { priceId: "price_addon_sms", name: "Notifications SMS" },
  priority: { priceId: "price_addon_priority", name: "Mise en avant prioritaire" },
  analytics: { priceId: "price_addon_analytics", name: "Statistiques avancées" },
  badge: { priceId: "price_addon_badge", name: "Badge Vérifié Nova" },
  instant: { priceId: "price_addon_instant", name: "Instant Pay" },
};

const addonsSchema = z.object({
  addonIds: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = addonsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { addonIds } = parsed.data;

    // Vérifie que les add-ons demandés existent
    const lineItems = addonIds
      .filter((id) => ADDON_PRICES[id])
      .map((id) => ({
        price: ADDON_PRICES[id]!.priceId,
        quantity: 1,
      }));

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "Aucun add-on valide sélectionné" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user!.id },
      select: { id: true, email: true, name: true, stripeCustomerId: true, role: true },
    });

    if (!dbUser || dbUser.role !== "ARTISAN") {
      return NextResponse.json({ error: "Accès réservé aux artisans" }, { status: 403 });
    }

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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: lineItems,
      success_url: `${baseUrl}/artisan-subscription?addons=success`,
      cancel_url: `${baseUrl}/artisan-subscription?addons=canceled`,
      metadata: { addonIds: addonIds.join(",") },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[subscriptions/addons] Error:", err);
    return NextResponse.json({ error: "Erreur lors de l'activation des services" }, { status: 500 });
  }
}
