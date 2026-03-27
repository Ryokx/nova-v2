/**
 * Route API — Webhook Stripe
 *
 * POST /api/webhooks/stripe
 *
 * Reçoit les événements Stripe et met à jour la base de données Nova.
 * Événements gérés :
 *
 * - checkout.session.completed               → Checkout terminé → lie le PaymentIntent à la mission
 * - payment_intent.amount_capturable_updated → Paiement autorisé → séquestre créé
 * - payment_intent.succeeded                 → Paiement capturé → séquestre libéré + email artisan
 * - payment_intent.canceled                  → Paiement annulé → remboursement
 * - charge.dispute.created                   → Litige Stripe → mission marquée DISPUTED
 * - account.updated                          → Compte Stripe artisan activé → vérification profil
 *
 * SÉCURITÉ : vérifie la signature Stripe avant de traiter l'événement.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { stripe, cancelSubscription } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { missionNotificationEmail } from "@/lib/email/templates";
import type Stripe from "stripe";

export async function POST(request: Request) {
  /* Lecture du corps brut et de la signature Stripe */
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  /* Vérification de la signature pour s'assurer que l'événement vient bien de Stripe */
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  /* Traitement de l'événement selon son type */
  switch (event.type) {

    /* ── Checkout terminé : lier le PaymentIntent à la mission OU enregistrer l'abonnement ── */
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      /* Cas add-ons à la carte */
      if (session.mode === "subscription" && session.metadata?.type === "addons" && session.metadata?.addonIds) {
        const profileId = session.metadata.artisanProfileId;
        const newAddonIds = session.metadata.addonIds.split(",");
        if (profileId) {
          const profile = await prisma.artisanProfile.findUnique({
            where: { id: profileId },
            select: { activeAddons: true },
          });
          const currentAddons = (profile?.activeAddons as string[]) || [];
          const merged = [...new Set([...currentAddons, ...newAddonIds])];
          await prisma.artisanProfile.update({
            where: { id: profileId },
            data: { activeAddons: merged },
          });
        }
        break;
      }

      /* Cas abonnement artisan */
      if (session.mode === "subscription" && session.subscription && session.metadata?.planId) {
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        if (customerId) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
            select: { artisanProfile: { select: { id: true } } },
          });
          if (user?.artisanProfile) {
            /* Annule l'ancien abonnement si changement de plan */
            const previousSubId = session.metadata.previousSubscriptionId;
            if (previousSubId) {
              try {
                await stripe.subscriptions.cancel(previousSubId);
              } catch (err) {
                console.warn("[STRIPE WEBHOOK] Could not cancel previous subscription:", err);
              }
            }

            await prisma.artisanProfile.update({
              where: { id: user.artisanProfile.id },
              data: {
                stripeSubscriptionId: session.subscription as string,
                currentPlan: session.metadata.planId,
              },
            });
          }
        }
        break;
      }

      /* Cas paiement mission */
      const missionId = session.metadata?.missionId;
      if (missionId && session.payment_intent) {
        await prisma.payment.updateMany({
          where: { missionId },
          data: { stripePaymentIntentId: session.payment_intent as string },
        });
      }
      break;
    }

    /* ── Paiement autorisé : le séquestre est créé ── */
    case "payment_intent.amount_capturable_updated": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const missionId = pi.metadata.missionId;
      if (missionId) {
        await prisma.payment.updateMany({
          where: { missionId },
          data: { stripePaymentIntentId: pi.id, status: "ESCROWED", escrowedAt: new Date() },
        });
        await prisma.mission.update({
          where: { id: missionId },
          data: { status: "ACCEPTED" },
        });
      }
      break;
    }

    /* ── Paiement capturé : le séquestre est libéré vers l'artisan ── */
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const missionId = pi.metadata.missionId;
      if (missionId) {
        /* Mise à jour du statut du paiement */
        await prisma.payment.updateMany({
          where: { missionId },
          data: { status: "RELEASED", releasedAt: new Date() },
        });

        /* Envoi d'un email de notification à l'artisan */
        const mission = await prisma.mission.findUnique({
          where: { id: missionId },
          include: { artisan: { include: { user: true } }, client: true },
        });
        if (mission?.artisan.user.email) {
          const html = missionNotificationEmail({
            recipientName: mission.artisan.user.name ?? "Artisan",
            missionType: `Paiement libéré — ${mission.type}`,
            clientName: mission.client.name ?? undefined,
            amount: pi.amount / 100,
            ctaUrl: `${process.env.NEXTAUTH_URL}/artisan-payments`,
            ctaLabel: "Voir mes paiements",
          });
          await sendEmail({
            to: mission.artisan.user.email,
            subject: `Paiement libéré — ${(pi.amount / 100).toFixed(2)}€`,
            html,
          });
        }
      }
      break;
    }

    /* ── Paiement annulé : remboursement du client ── */
    case "payment_intent.canceled": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const missionId = pi.metadata.missionId;
      if (missionId) {
        await prisma.payment.updateMany({
          where: { missionId },
          data: { status: "REFUNDED" },
        });
        await prisma.mission.update({
          where: { id: missionId },
          data: { status: "CANCELLED" },
        });
      }
      break;
    }

    /* ── Compte Stripe artisan mis à jour : vérification auto du profil ── */
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      if (account.charges_enabled) {
        await prisma.artisanProfile.updateMany({
          where: { stripeAccountId: account.id },
          data: { isVerified: true },
        });
      }
      break;
    }

    /* ── Litige ouvert : marquer la mission comme disputée ── */
    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      const pi = dispute.payment_intent;
      if (pi) {
        const payment = await prisma.payment.findFirst({
          where: { stripePaymentIntentId: typeof pi === "string" ? pi : pi.id },
        });
        if (payment) {
          await prisma.mission.update({
            where: { id: payment.missionId },
            data: { status: "DISPUTED" },
          });
        }
      }
      break;
    }

    default:
      console.log(`[STRIPE WEBHOOK] Unhandled event: ${event.type}`);
  }

  /* Stripe attend une réponse 200 pour confirmer la réception */
  return NextResponse.json({ received: true });
}
