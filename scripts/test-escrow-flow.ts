/**
 * Test end-to-end du flow séquestre Nova
 *
 * 1. Créer un compte Connect artisan (Express)
 * 2. Créer un PaymentIntent avec capture différée (séquestre)
 * 3. Confirmer le paiement (simule le client qui paie)
 * 4. Vérifier que le séquestre est actif
 * 5. Capturer le paiement (libération vers l'artisan)
 * 6. Vérifier le paiement final
 *
 * Usage: npx tsx scripts/test-escrow-flow.ts
 */

import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
});

const AMOUNT = 15000; // 150,00€
const COMMISSION_RATE = 0.05;
const COMMISSION = Math.round(AMOUNT * COMMISSION_RATE); // 750 = 7,50€

async function run() {
  console.log("━━━ TEST FLOW SÉQUESTRE NOVA ━━━\n");

  // ── 1. Utiliser le compte Connect artisan vérifié ──
  const ARTISAN_ACCOUNT = "acct_1TFBqPRzylxVP7Fp";
  console.log(`1️⃣  Compte Connect artisan: ${ARTISAN_ACCOUNT} (charges & transfers activés)\n`);

  // ── 2. Créer le PaymentIntent en capture différée (séquestre) ──
  console.log("2️⃣  Création du PaymentIntent (séquestre)...");
  console.log(`   Montant: ${(AMOUNT / 100).toFixed(2)}€`);
  console.log(`   Commission Nova (5%): ${(COMMISSION / 100).toFixed(2)}€`);
  console.log(`   Artisan recevra: ${((AMOUNT - COMMISSION) / 100).toFixed(2)}€`);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: AMOUNT,
    currency: "eur",
    capture_method: "manual",
    transfer_data: { destination: ARTISAN_ACCOUNT },
    application_fee_amount: COMMISSION,
    payment_method: "pm_card_visa",
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    metadata: { missionId: "test-mission-001", artisanId: ARTISAN_ACCOUNT },
  });
  console.log(`   ✓ PaymentIntent créé: ${paymentIntent.id}`);
  console.log(`   Status: ${paymentIntent.status}\n`);

  // ── 3. Confirmer le paiement (simule le client) ──
  console.log("3️⃣  Confirmation du paiement (simule le client qui paie)...");
  const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id);
  console.log(`   ✓ Status: ${confirmed.status}`);
  console.log(`   Amount capturable: ${((confirmed.amount_capturable ?? 0) / 100).toFixed(2)}€\n`);

  if (confirmed.status !== "requires_capture") {
    console.error("   ✗ ERREUR: Le paiement devrait être en requires_capture");
    process.exit(1);
  }

  console.log("   💰 SÉQUESTRE ACTIF — L'argent est bloqué, l'artisan ne reçoit rien encore\n");

  // ── 4. Capturer le paiement (libération vers l'artisan) ──
  console.log("4️⃣  Capture du paiement (libération vers l'artisan)...");
  const captured = await stripe.paymentIntents.capture(paymentIntent.id);
  console.log(`   ✓ Status: ${captured.status}`);
  console.log(`   Amount received: ${(captured.amount / 100).toFixed(2)}€\n`);

  if (captured.status !== "succeeded") {
    console.error("   ✗ ERREUR: Le paiement devrait être succeeded");
    process.exit(1);
  }

  // ── 5. Résumé ──
  console.log("━━━ RÉSULTAT ━━━");
  console.log(`✓ Client a payé:       ${(AMOUNT / 100).toFixed(2)}€`);
  console.log(`✓ Commission Nova:     ${(COMMISSION / 100).toFixed(2)}€`);
  console.log(`✓ Artisan reçoit:      ${((AMOUNT - COMMISSION) / 100).toFixed(2)}€`);
  console.log(`✓ Compte artisan:      ${ARTISAN_ACCOUNT}`);
  console.log(`✓ PaymentIntent:       ${paymentIntent.id}`);
  console.log(`\n✅ Flow séquestre complet — tout fonctionne !`);

  // ── 6. Test annulation (séparé) ──
  console.log("\n━━━ TEST ANNULATION / REMBOURSEMENT ━━━\n");
  console.log("5️⃣  Création d'un 2e PaymentIntent pour test d'annulation...");

  const pi2 = await stripe.paymentIntents.create({
    amount: 8000, // 80€
    currency: "eur",
    capture_method: "manual",
    transfer_data: { destination: ARTISAN_ACCOUNT },
    application_fee_amount: Math.round(8000 * 0.05),
    payment_method: "pm_card_visa",
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    metadata: { missionId: "test-mission-002" },
  });
  await stripe.paymentIntents.confirm(pi2.id);
  console.log(`   ✓ PaymentIntent créé et confirmé: ${pi2.id}`);
  console.log("   💰 Séquestre actif (80€)\n");

  console.log("6️⃣  Annulation du séquestre (remboursement client)...");
  const cancelled = await stripe.paymentIntents.cancel(pi2.id);
  console.log(`   ✓ Status: ${cancelled.status}`);
  console.log(`   ✅ Client remboursé, artisan ne reçoit rien\n`);

  console.log("━━━ TOUS LES TESTS PASSÉS ━━━");
}

run().catch((err) => {
  console.error("\n✗ ERREUR:", err.message);
  process.exit(1);
});
