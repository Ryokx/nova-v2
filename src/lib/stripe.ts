/**
 * Intégration Stripe Connect — Paiement par séquestre
 *
 * Nova utilise Stripe Connect pour :
 * 1. Créer des comptes artisans (Express)
 * 2. Bloquer l'argent du client en séquestre (capture différée)
 * 3. Libérer le paiement après validation de l'intervention
 * 4. Prélever la commission Nova (5%) automatiquement
 */

import Stripe from "stripe";

// Avertissement si la clé Stripe manque
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("[STRIPE] No STRIPE_SECRET_KEY — Stripe calls will fail in production");
}

/** Instance Stripe configurée pour l'API */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

/** Crée un compte Stripe Connect Express pour un artisan */
export async function createConnectedAccount(email: string, name: string) {
  const [firstName, ...lastParts] = name.split(" ");
  const lastName = lastParts.join(" ") || name;

  const account = await stripe.accounts.create({
    type: "express",
    country: "FR",
    email,
    business_type: "individual",
    individual: { first_name: firstName, last_name: lastName },
    capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
  });

  return account;
}

/** Génère le lien d'onboarding Stripe pour un artisan */
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
 * Crée un PaymentIntent avec capture différée (séquestre)
 * L'argent est autorisé mais PAS capturé — c'est le mécanisme de séquestre Nova.
 * La commission (5% par défaut) est prélevée automatiquement via application_fee_amount.
 */
export async function createEscrowPayment(params: {
  amount: number; // en centimes
  currency?: string;
  artisanStripeAccountId: string;
  commissionRate?: number;
  metadata?: Record<string, string>;
}) {
  const { amount, currency = "eur", artisanStripeAccountId, commissionRate = 0.05, metadata } = params;

  // Calcul de la commission Nova
  const commissionAmount = Math.round(amount * commissionRate);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    capture_method: "manual", // Capture différée = séquestre
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

/** Capture le paiement séquestré — l'artisan reçoit son argent */
export async function releaseEscrowPayment(paymentIntentId: string) {
  return stripe.paymentIntents.capture(paymentIntentId);
}

/** Annule le paiement séquestré — le client est remboursé */
export async function refundEscrowPayment(paymentIntentId: string) {
  return stripe.paymentIntents.cancel(paymentIntentId);
}

/**
 * Récupère ou crée un Stripe Customer pour un utilisateur Nova.
 * Le customerId est stocké dans User.stripeCustomerId.
 */
export async function getOrCreateCustomer(params: {
  userId: string;
  email: string;
  name?: string;
  existingCustomerId?: string | null;
}) {
  const { userId, email, name, existingCustomerId } = params;

  if (existingCustomerId) {
    return existingCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { novaUserId: userId },
  });

  return customer.id;
}

/**
 * Crée un SetupIntent (empreinte bancaire à 0€).
 * Permet de sauvegarder le moyen de paiement du client
 * avant de confirmer une demande d'intervention.
 */
export async function createSetupIntent(customerId: string) {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    usage: "off_session",
  });

  return setupIntent;
}

/**
 * Crée une session Checkout Stripe pour le paiement client
 * Utilise aussi la capture différée (séquestre) + commission 5%.
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

/* ------------------------------------------------------------------ */
/*  Abonnements artisan                                                */
/* ------------------------------------------------------------------ */

/** Prix Stripe par forfait et cycle (à créer dans le dashboard Stripe) */
const SUBSCRIPTION_PRICES: Record<string, Record<string, string>> = {
  pro: {
    monthly: "price_1TFJ4xRsf8ol27VdeOlSRhlP",
    annual: "price_1TFJ68Rsf8ol27VdF8UtAePv",
  },
  expert: {
    monthly: "price_1TFJ6bRsf8ol27VdpKRX2b8Z",
    annual: "price_1TFJ7JRsf8ol27VdkdmHM6tM",
  },
};

/**
 * Crée une session Checkout Stripe pour un abonnement artisan.
 * Redirige vers Stripe pour collecter le paiement récurrent.
 */
export async function createSubscriptionCheckout(params: {
  customerId: string;
  planId: string;
  billing: "monthly" | "annual";
  successUrl: string;
  cancelUrl: string;
  existingSubscriptionId?: string;
}) {
  const { customerId, planId, billing, successUrl, cancelUrl, existingSubscriptionId } = params;

  const prices = SUBSCRIPTION_PRICES[planId];
  if (!prices) throw new Error(`Plan inconnu: ${planId}`);

  const priceId = prices[billing];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      planId,
      billing,
      ...(existingSubscriptionId && { previousSubscriptionId: existingSubscriptionId }),
    },
  });

  return session;
}

/**
 * Change le forfait d'un abonnement existant avec prorata.
 * Stripe calcule automatiquement la différence et facture/crédite le client.
 */
export async function updateSubscription(params: {
  subscriptionId: string;
  newPlanId: string;
  billing: "monthly" | "annual";
}) {
  const { subscriptionId, newPlanId, billing } = params;

  const prices = SUBSCRIPTION_PRICES[newPlanId];
  if (!prices) throw new Error(`Plan inconnu: ${newPlanId}`);

  const newPriceId = prices[billing];

  /* Récupère l'abonnement pour trouver l'item à modifier */
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const itemId = subscription.items.data[0]?.id;

  if (!itemId) throw new Error("Aucun item trouvé sur l'abonnement");

  return stripe.subscriptions.update(subscriptionId, {
    items: [{ id: itemId, price: newPriceId }],
    proration_behavior: "always_invoice",
    metadata: { planId: newPlanId, billing },
  });
}

/** Annule un abonnement Stripe (fin de période) */
export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/** Retourne le price ID pour un plan et cycle donnés */
export function getSubscriptionPriceId(planId: string, billing: "monthly" | "annual") {
  return SUBSCRIPTION_PRICES[planId]?.[billing];
}
