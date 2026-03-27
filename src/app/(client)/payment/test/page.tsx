/**
 * Page de test Stripe Checkout.
 *
 * Permet de tester le flow complet :
 * 1. Choisir un montant
 * 2. Redirection vers Stripe Checkout (page hébergée par Stripe)
 * 3. Retour avec statut success/cancelled
 * 4. Vérification du PaymentIntent (séquestre)
 *
 * Cartes de test Stripe affichées pour faciliter les tests.
 */

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Shield,
  Database,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Cartes de test Stripe                                              */
/* ------------------------------------------------------------------ */

const testCards = [
  { number: "4242 4242 4242 4242", label: "Succès", color: "text-success", bg: "bg-success/10" },
  { number: "4000 0000 0000 0002", label: "Refusée", color: "text-red", bg: "bg-red/10" },
  { number: "4000 0000 0000 9995", label: "Fonds insuffisants", color: "text-red", bg: "bg-red/10" },
  { number: "4000 0000 0000 0069", label: "Carte expirée", color: "text-gold", bg: "bg-gold/10" },
  { number: "4000 0000 0000 3220", label: "3D Secure requis", color: "text-forest", bg: "bg-forest/10" },
  { number: "4000 0000 0000 0341", label: "Échec après auth", color: "text-red", bg: "bg-red/10" },
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SessionResult {
  sessionId: string;
  status: string;
  paymentStatus: string;
  paymentIntent: {
    id: string;
    status: string;
    amount: number;
    captureMethod: string;
    amountCapturable: number;
  } | null;
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function PaymentTestPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");

  const [amount, setAmount] = useState(320);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  /** Récupère le statut de la session Stripe après retour */
  useEffect(() => {
    if (status === "success" && sessionId) {
      setLoadingResult(true);
      fetch(`/api/payments/test?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => setSessionResult(data))
        .catch(() => setError("Impossible de récupérer le statut"))
        .finally(() => setLoadingResult(false));
    }
  }, [status, sessionId]);

  /** Crée une session Checkout et redirige */
  const handlePay = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors de la création de la session");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  /** Copie un numéro de carte dans le presse-papier */
  const copyCard = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ""));
    setCopiedCard(number);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  /* ================================================================ */
  /*  Retour après paiement Stripe                                     */
  /* ================================================================ */
  if (status) {
    return (
      <div className="max-w-[560px] mx-auto px-5 py-8">
        <Link
          href="/payment/test"
          className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors no-underline"
        >
          <ArrowLeft className="w-4 h-4" /> Nouveau test
        </Link>

        {/* Statut du paiement */}
        <div className="text-center mb-6 animate-pageIn">
          {status === "success" ? (
            <>
              <div className="w-[72px] h-[72px] rounded-2xl bg-success/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-success" />
              </div>
              <h1 className="font-heading text-2xl font-extrabold text-navy mb-1">Paiement autorisé</h1>
              <p className="text-sm text-grayText">Le montant est bloqué en séquestre (capture différée)</p>
            </>
          ) : (
            <>
              <div className="w-[72px] h-[72px] rounded-2xl bg-red/10 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-9 h-9 text-red" />
              </div>
              <h1 className="font-heading text-2xl font-extrabold text-navy mb-1">Paiement annulé</h1>
              <p className="text-sm text-grayText">Le client a annulé sur la page Stripe Checkout</p>
            </>
          )}
        </div>

        {/* Détails du PaymentIntent */}
        {loadingResult && (
          <Card className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-forest animate-spin" />
            <span className="ml-2 text-sm text-grayText">Chargement du statut Stripe...</span>
          </Card>
        )}

        {sessionResult && (
          <Card className="space-y-3">
            <h2 className="font-heading text-sm font-bold text-navy">Détails Stripe</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-grayText">Session</span>
                <span className="font-mono text-xs text-navy truncate max-w-[240px]">{sessionResult.sessionId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-grayText">Statut session</span>
                <Badge variant={sessionResult.status === "complete" ? "success" : "default"}>
                  {sessionResult.status}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-grayText">Statut paiement</span>
                <Badge variant={sessionResult.paymentStatus === "paid" ? "success" : "warning"}>
                  {sessionResult.paymentStatus}
                </Badge>
              </div>

              {sessionResult.paymentIntent && (
                <>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-grayText">PaymentIntent</span>
                    <span className="font-mono text-xs text-navy truncate max-w-[240px]">
                      {sessionResult.paymentIntent.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-grayText">Statut PI</span>
                    <Badge
                      variant={
                        sessionResult.paymentIntent.status === "requires_capture"
                          ? "warning"
                          : sessionResult.paymentIntent.status === "succeeded"
                            ? "success"
                            : "default"
                      }
                    >
                      {sessionResult.paymentIntent.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-grayText">Montant</span>
                    <span className="font-mono font-bold text-navy">
                      {formatPrice(sessionResult.paymentIntent.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-grayText">Capture method</span>
                    <span className="font-mono text-xs text-navy">{sessionResult.paymentIntent.captureMethod}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-grayText">Montant capturable</span>
                    <span className="font-mono font-bold text-forest">
                      {formatPrice(sessionResult.paymentIntent.amountCapturable)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Explication du résultat */}
            {sessionResult.paymentIntent?.status === "requires_capture" && (
              <div className="bg-success/5 border border-success/20 rounded-xl p-3 flex items-start gap-2">
                <Database className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <p className="text-xs text-grayText">
                  <span className="font-bold text-navy">Séquestre actif.</span> Le montant de{" "}
                  {formatPrice(sessionResult.paymentIntent.amountCapturable)} est autorisé mais pas encore capturé.
                  En production, il sera capturé (libéré vers l&apos;artisan) après validation du client.
                </p>
              </div>
            )}
          </Card>
        )}

        {error && (
          <div className="bg-red/5 border border-red/20 rounded-xl p-3 text-sm text-red font-medium mt-4">
            {error}
          </div>
        )}
      </div>
    );
  }

  /* ================================================================ */
  /*  Formulaire de test                                               */
  /* ================================================================ */
  return (
    <div className="max-w-[560px] mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="font-heading text-[22px] font-extrabold text-navy">Test Stripe Checkout</h1>
        <Badge variant="warning">TEST</Badge>
      </div>
      <p className="text-sm text-grayText mb-6">
        Teste le flow de paiement par séquestre avec les cartes test Stripe.
      </p>

      {/* Bannière mode test */}
      <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 mb-5 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <p className="text-xs text-grayText">
          <span className="font-bold text-navy">Mode test Stripe.</span> Aucun vrai paiement ne sera effectué.
          Utilise les cartes ci-dessous sur la page Stripe Checkout.
        </p>
      </div>

      {/* Montant */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Montant du test</h2>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[50, 150, 320, 1000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={cn(
                "py-2.5 rounded-xl text-center transition-all cursor-pointer border-none",
                amount === v ? "bg-deepForest text-white" : "bg-surface text-navy hover:bg-border",
              )}
            >
              <div className="font-mono text-sm font-bold">{formatPrice(v)}</div>
            </button>
          ))}
        </div>
        <div>
          <label className="text-xs font-semibold text-grayText mb-1.5 block">Montant personnalisé</label>
          <div className="relative">
            <input
              type="number"
              min={1}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-11 pl-4 pr-10 rounded-xl border border-border bg-bgPage text-sm text-navy font-mono focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-grayText font-mono">EUR</span>
          </div>
        </div>
      </Card>

      {/* Cartes de test */}
      <Card className="mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-forest" /> Cartes de test Stripe
        </h2>
        <p className="text-xs text-grayText mb-3">
          Copie un numéro et utilise-le sur la page Stripe. Expiration : n&apos;importe quelle date future. CVC : n&apos;importe quels 3 chiffres.
        </p>
        <div className="space-y-2">
          {testCards.map((card) => (
            <button
              key={card.number}
              onClick={() => copyCard(card.number)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-surface transition-all text-left cursor-pointer bg-transparent"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", card.bg)}>
                <CreditCard className={cn("w-4 h-4", card.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-navy">{card.number}</div>
                <div className={cn("text-[11px] font-semibold", card.color)}>{card.label}</div>
              </div>
              {copiedCard === card.number ? (
                <Check className="w-4 h-4 text-success shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-grayText shrink-0" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Info séquestre */}
      <div className="bg-surface rounded-xl p-3 mb-5 flex items-center gap-2 border border-forest/10">
        <Shield className="w-4 h-4 text-forest shrink-0" />
        <span className="text-xs text-forest font-medium">
          Capture différée activée — le montant sera autorisé mais pas capturé (séquestre).
        </span>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red/5 border border-red/20 rounded-xl p-3 mb-4 text-sm text-red font-medium">{error}</div>
      )}

      {/* Bouton payer */}
      <Button className="w-full gap-2" size="lg" loading={submitting} onClick={handlePay}>
        <Lock className="w-4 h-4" /> Tester le paiement — {formatPrice(amount)}
      </Button>

      {/* Footer sécurité */}
      <div className="flex justify-center gap-6 mt-5">
        {[
          { icon: <Shield className="w-4 h-4 text-forest" />, label: "Stripe Checkout" },
          { icon: <Lock className="w-4 h-4 text-forest" />, label: "Capture différée" },
          { icon: <Database className="w-4 h-4 text-forest" />, label: "Séquestre" },
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-1">
            {badge.icon}
            <span className="text-[10px] text-grayText font-medium">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
