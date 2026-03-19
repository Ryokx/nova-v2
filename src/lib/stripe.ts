import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("[STRIPE] No STRIPE_SECRET_KEY — Stripe calls will fail in production");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

/**
 * Create a Stripe Connect account for an artisan
 */
export async function createConnectedAccount(email: string, name: string) {
  const account = await stripe.accounts.create({
    type: "express",
    country: "FR",
    email,
    business_type: "individual",
    individual: { first_name: name.split(" ")[0], last_name: name.split(" ").slice(1).join(" ") || name },
    capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
  });
  return account;
}

/**
 * Generate onboarding link for artisan
 */
export async function createOnboardingLink(accountId: string, returnUrl: string) {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: returnUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });
  return link.url;
}

/**
 * Create PaymentIntent with deferred capture (escrow)
 * Money is authorized but NOT captured — this is the "séquestre"
 */
export async function createEscrowPayment(params: {
  amount: number; // in cents
  currency?: string;
  artisanStripeAccountId: string;
  commissionRate?: number;
  metadata?: Record<string, string>;
}) {
  const { amount, currency = "eur", artisanStripeAccountId, commissionRate = 0.05, metadata } = params;
  const commissionAmount = Math.round(amount * commissionRate);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    capture_method: "manual", // Deferred capture = escrow
    transfer_data: {
      destination: artisanStripeAccountId,
    },
    application_fee_amount: commissionAmount,
    metadata: {
      ...metadata,
      commission_rate: String(commissionRate),
      commission_amount: String(commissionAmount),
    },
  });

  return paymentIntent;
}

/**
 * Capture (release) escrowed payment — artisan gets paid
 */
export async function releaseEscrowPayment(paymentIntentId: string) {
  const captured = await stripe.paymentIntents.capture(paymentIntentId);
  return captured;
}

/**
 * Cancel/refund escrowed payment — client gets money back
 */
export async function refundEscrowPayment(paymentIntentId: string) {
  const canceled = await stripe.paymentIntents.cancel(paymentIntentId);
  return canceled;
}

/**
 * Create Checkout Session for client payment
 */
export async function createCheckoutSession(params: {
  amount: number;
  missionId: string;
  artisanStripeAccountId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const { amount, missionId, artisanStripeAccountId, successUrl, cancelUrl } = params;
  const commissionAmount = Math.round(amount * 0.05);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_intent_data: {
      capture_method: "manual",
      transfer_data: { destination: artisanStripeAccountId },
      application_fee_amount: commissionAmount,
      metadata: { missionId },
    },
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: "Paiement séquestre Nova" },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { missionId },
  });

  return session;
}
