/**
 * Route API — Test Stripe Checkout (mode test uniquement)
 *
 * POST /api/payments/test
 *
 * Crée une session Stripe Checkout directement, sans mission ni artisan.
 * Permet de tester le flow de paiement end-to-end avec les cartes test Stripe.
 *
 * ATTENTION : cette route ne doit JAMAIS être déployée en production.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  /* Bloque en production */
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Route de test désactivée en production" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const amount = Math.round((body.amount ?? 320) * 100); // centimes
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_intent_data: {
        capture_method: "manual", // Séquestre (capture différée)
        metadata: { test: "true", createdAt: new Date().toISOString() },
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Test paiement séquestre Nova",
              description: "Paiement de test — capture différée (séquestre)",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment/test?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/test?status=cancelled`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id }, { status: 201 });
  } catch (err) {
    console.error("[STRIPE TEST] Error:", err);
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** GET /api/payments/test?session_id=xxx — Récupère le statut d'une session */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Route de test désactivée en production" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id requis" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    const pi = session.payment_intent as import("stripe").default.PaymentIntent | null;

    return NextResponse.json({
      sessionId: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      paymentIntent: pi
        ? {
            id: pi.id,
            status: pi.status,
            amount: pi.amount / 100,
            captureMethod: pi.capture_method,
            amountCapturable: pi.amount_capturable / 100,
          }
        : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
