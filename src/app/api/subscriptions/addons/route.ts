/**
 * Route API — Activation des services à la carte (add-ons)
 *
 * POST /api/subscriptions/addons
 *
 * Crée une session Stripe Checkout pour les add-ons sélectionnés.
 * Après paiement, les add-ons sont activés via le webhook.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { getOrCreateCustomer, stripe } from "@/lib/stripe";
import { z } from "zod";

/** Prix Stripe par add-on (à créer dans le dashboard Stripe) */
const ADDON_PRICES: Record<string, { priceId: string; name: string }> = {
  compta: { priceId: "price_addon_compta", name: "Connexion comptable" },
  relance: { priceId: "price_addon_relance", name: "Relance client automatique" },
  calendar: { priceId: "price_addon_calendar", name: "Synchronisation calendrier" },
  website: { priceId: "price_addon_website", name: "Site web personnalisable" },
  stats: { priceId: "price_addon_stats", name: "Statistiques avancées" },
};

const addonsSchema = z.object({
  addonIds: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { addonIds } = addonsSchema.parse(body);

    /* Valide que tous les IDs sont connus */
    const validIds = addonIds.filter((id) => ADDON_PRICES[id]);
    if (validIds.length === 0) {
      return NextResponse.json({ error: "Aucun service valide sélectionné" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        role: true,
        artisanProfile: {
          select: { id: true, activeAddons: true },
        },
      },
    });

    if (!dbUser || dbUser.role !== "ARTISAN" || !dbUser.artisanProfile) {
      return NextResponse.json({ error: "Réservé aux artisans" }, { status: 403 });
    }

    /* Filtre les add-ons déjà actifs */
    const currentAddons = (dbUser.artisanProfile.activeAddons as string[]) || [];
    const newAddonIds = validIds.filter((id) => !currentAddons.includes(id));

    if (newAddonIds.length === 0) {
      return NextResponse.json({ error: "Ces services sont déjà actifs" }, { status: 400 });
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

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    /* Crée la session Checkout avec les add-ons comme abonnements récurrents */
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: newAddonIds.map((id) => ({
        price: ADDON_PRICES[id].priceId,
        quantity: 1,
      })),
      success_url: `${baseUrl}/artisan-subscription?addons_success=true&addons=${newAddonIds.join(",")}`,
      cancel_url: `${baseUrl}/artisan-subscription?addons_cancelled=true`,
      metadata: {
        type: "addons",
        addonIds: newAddonIds.join(","),
        artisanProfileId: dbUser.artisanProfile.id,
      },
    });

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error("Addons subscription error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
