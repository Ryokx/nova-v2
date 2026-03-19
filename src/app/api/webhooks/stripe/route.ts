export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { missionNotificationEmail } from "@/lib/email/templates";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.amount_capturable_updated": {
      // Payment authorized (escrow created)
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

    case "payment_intent.succeeded": {
      // Payment captured (escrow released to artisan)
      const pi = event.data.object as Stripe.PaymentIntent;
      const missionId = pi.metadata.missionId;
      if (missionId) {
        await prisma.payment.updateMany({
          where: { missionId },
          data: { status: "RELEASED", releasedAt: new Date() },
        });

        // Send email to artisan
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

    case "payment_intent.canceled": {
      // Payment refunded
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

    case "account.updated": {
      // Artisan Stripe account updated
      const account = event.data.object as Stripe.Account;
      if (account.charges_enabled) {
        await prisma.artisanProfile.updateMany({
          where: { stripeAccountId: account.id },
          data: { isVerified: true },
        });
      }
      break;
    }

    default:
      console.log(`[STRIPE WEBHOOK] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
