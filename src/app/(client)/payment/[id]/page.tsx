/**
 * Page de paiement d'une mission.
 * Permet de choisir la méthode (carte, virement, Apple Pay),
 * de fractionner en 2x/3x/4x via Klarna, et de payer.
 * Le paiement est bloqué en séquestre (libéré après validation).
 * Après succès : écran de confirmation.
 */

"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Building,
  Smartphone,
  Lock,
  CheckCircle,
  Shield,
  ShieldCheck,
  Database,
  Calendar,
  ArrowRight,
  Banknote,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MissionPayment {
  id: string;
  type: string;
  amount: number | null;
  artisan: { user: { name: string } };
  devis: { totalTTC: number } | null;
}

/* ------------------------------------------------------------------ */
/*  Constantes                                                         */
/* ------------------------------------------------------------------ */

/** Méthodes de paiement disponibles */
const methods = [
  { id: "card", label: "Carte bancaire", icon: CreditCard, desc: "Visa, Mastercard" },
  { id: "transfer", label: "Virement", icon: Building, desc: "SEPA" },
  { id: "apple_pay", label: "Apple Pay", icon: Smartphone, desc: "Paiement mobile" },
];

/* ------------------------------------------------------------------ */
/*  Utilitaires                                                        */
/* ------------------------------------------------------------------ */

/** Ajoute N mois à une date */
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Formate une date en français (ex: "25 mars 2026") */
function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: mission, loading } = useFetch<MissionPayment>(`/api/missions/${id}`);

  /** Méthode de paiement sélectionnée */
  const [method, setMethod] = useState("card");
  /** Nombre de mensualités (1 = paiement comptant) */
  const [installment, setInstallment] = useState("1");
  /** État de soumission */
  const [submitting, setSubmitting] = useState(false);
  /** Paiement réussi */
  const [success, ] = useState(false);

  /** Montant total à payer */
  const amount = mission?.devis?.totalTTC ?? mission?.amount ?? 320;

  /** Calcul de l'échéancier Klarna (si paiement fractionné) */
  const installmentSchedule = useMemo(() => {
    const n = parseInt(installment);
    if (n <= 1) return [];
    const perPayment = amount / n;
    const now = new Date();
    return Array.from({ length: n }, (_, i) => ({
      date: addMonths(now, i),
      amount: perPayment,
      label: i === 0 ? "Aujourd'hui" : formatDate(addMonths(now, i)),
    }));
  }, [installment, amount]);

  /** Erreur de paiement */
  const [payError, setPayError] = useState<string | null>(null);

  /** Envoie le paiement à l'API → redirige vers Stripe Checkout */
  const handlePay = async () => {
    if (!mission) return;
    setSubmitting(true);
    setPayError(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId: mission.id,
          amount,
          method,
          installments: installment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        /* Redirection vers Stripe Checkout */
        window.location.href = data.url;
      } else {
        setPayError(data.error || "Erreur lors de la création du paiement");
      }
    } catch {
      setPayError("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  /* Squelette de chargement */
  if (loading) {
    return (
      <div className="max-w-[560px] mx-auto px-5 py-8">
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  /* ================================================================ */
  /*  Écran de succès                                                  */
  /* ================================================================ */
  if (success) {
    return (
      <div className="max-w-[500px] mx-auto px-5 pt-36 pb-16 text-center animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-[5px] bg-success/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">Paiement bloqué !</h1>
        <p className="text-sm text-grayText mb-2">
          {formatPrice(amount)} bloqués en séquestre pour votre mission avec {mission?.artisan.user.name}.
        </p>
        {/* Info fractionnement si applicable */}
        {installment !== "1" && (
          <p className="text-xs text-grayText/70 mb-2">
            Paiement en {installment}x de {formatPrice(amount / parseInt(installment))} via Klarna.
          </p>
        )}
        <p className="text-xs text-grayText/70 mb-6">
          Le paiement sera libéré uniquement après validation de l&apos;intervention.
        </p>
        <Button onClick={() => router.push("/missions")}>Voir mes missions</Button>
      </div>
    );
  }

  /** Options de fractionnement */
  const installmentOptions = [
    { id: "1", label: "1x", amount: formatPrice(amount) },
    { id: "2", label: "2x", amount: `${formatPrice(amount / 2)}/mois` },
    { id: "3", label: "3x", amount: `${formatPrice(amount / 3)}/mois` },
    { id: "4", label: "4x", amount: `${formatPrice(amount / 4)}/mois` },
  ];

  /* ================================================================ */
  /*  Formulaire de paiement                                           */
  /* ================================================================ */
  return (
    <div className="max-w-[560px] mx-auto px-5 py-8">

      {/* Bouton retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      {/* Titre */}
      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Paiement</h1>
      <p className="text-sm text-grayText mb-5">
        {mission?.type ?? "Réparation fuite sous évier"} — {mission?.artisan.user.name ?? "Jean-Michel P."}
      </p>

      {/* Carte montant */}
      <Card className="text-center mb-5 bg-gradient-to-br from-surface to-white">
        <div className="text-xs text-grayText mb-1">Montant à bloquer en séquestre</div>
        <div className="font-mono text-3xl font-bold text-navy">{formatPrice(amount)}</div>
      </Card>

      {/* Sélection méthode de paiement */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Méthode de paiement</h2>
        <div className="space-y-2">
          {methods.map((m) => {
            const Icon = m.icon;
            const selected = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer bg-transparent",
                  selected ? "border-forest bg-forest/5" : "border-border hover:bg-surface",
                )}
              >
                <Icon className={cn("w-5 h-5", selected ? "text-forest" : "text-grayText")} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy">{m.label}</div>
                  <div className="text-[11px] text-grayText">{m.desc}</div>
                </div>
                {/* Radio button visuel */}
                <div
                  className={cn(
                    "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center",
                    selected ? "border-forest bg-forest" : "border-border",
                  )}
                >
                  {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Fractionnement Klarna */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-heading text-sm font-bold text-navy">Fractionnement</h2>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold"
            style={{ backgroundColor: "#FFB3C7", color: "#17120F" }}
          >
            Klarna
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {installmentOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setInstallment(opt.id)}
              className={cn(
                "py-3 rounded-xl text-center transition-all cursor-pointer border-none",
                installment === opt.id
                  ? "bg-deepForest text-white"
                  : "bg-surface text-navy hover:bg-border",
              )}
            >
              <div className="text-base font-bold">{opt.label}</div>
              <div className="text-[10px] opacity-70 font-mono">{opt.amount}</div>
            </button>
          ))}
        </div>
        {installment !== "1" && (
          <p className="text-[11px] text-grayText mt-2.5">
            Paiement en {installment}x de {formatPrice(amount / parseInt(installment))} via Klarna. Klarna gère le fractionnement, Nova reçoit 100%.
          </p>
        )}
      </Card>

      {/* Détail de l'échéancier Klarna (affiché si fractionnement) */}
      {installment !== "1" && (
        <Card className="mb-4 border-2" style={{ borderColor: "#FFB3C7" }}>
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ backgroundColor: "#FFB3C7", color: "#17120F" }}
            >
              Klarna
            </span>
            <span className="text-sm font-bold text-navy">Échéancier de paiement</span>
          </div>

          {/* Timeline des mensualités */}
          <div className="space-y-0 mb-4">
            {installmentSchedule.map((payment, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                {/* Ligne verticale de connexion */}
                {i < installmentSchedule.length - 1 && (
                  <div className="absolute left-[13px] top-[28px] w-px h-[20px] bg-border" />
                )}
                <div
                  className={cn(
                    "w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0",
                    i === 0 ? "bg-success/15" : "bg-surface",
                  )}
                >
                  <Calendar className={cn("w-3.5 h-3.5", i === 0 ? "text-success" : "text-grayText")} />
                </div>
                <div className="flex-1 flex items-center justify-between pb-4">
                  <div>
                    <div className={cn("text-xs font-semibold", i === 0 ? "text-navy" : "text-grayText")}>
                      {payment.label}
                    </div>
                    {i === 0 && <div className="text-[10px] text-success font-medium">Premier prélèvement</div>}
                  </div>
                  <div className="font-mono text-sm font-bold text-navy">{formatPrice(payment.amount)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Avantages Klarna */}
          <div className="border-t border-border pt-3 space-y-2">
            {[
              { icon: CheckCircle, text: "Aucun frais supplémentaire" },
              { icon: RefreshCw, text: "Prélèvement automatique" },
              { icon: Banknote, text: "Remboursement anticipé possible" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.text} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                  <span className="text-xs text-grayText">{f.text}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Info Stripe Checkout */}
      {method === "card" && (
        <div className="bg-surface rounded-xl p-3 mb-4 flex items-center gap-2 border border-border">
          <CreditCard className="w-4 h-4 text-forest flex-shrink-0" />
          <span className="text-xs text-grayText">
            Vous serez redirigé vers la page de paiement sécurisée Stripe pour entrer vos informations bancaires.
          </span>
        </div>
      )}

      {/* Erreur de paiement */}
      {payError && (
        <div className="bg-red/5 border border-red/20 rounded-xl p-3 mb-4 text-sm text-red font-medium">
          {payError}
        </div>
      )}

      {/* Badge séquestre */}
      <div className="bg-surface rounded-xl p-3 mb-5 flex items-center gap-2 border border-forest/10">
        <Shield className="w-4 h-4 text-forest flex-shrink-0" />
        <span className="text-xs text-forest font-medium">
          {installment !== "1"
            ? `Séquestre sécurisé — ${installment}x ${formatPrice(amount / parseInt(installment))} via Klarna. L'artisan est payé après validation.`
            : "Votre paiement sera sécurisé par séquestre — L'artisan est payé après validation"}
        </span>
      </div>

      {/* Bouton payer */}
      <Button className="w-full gap-2" size="lg" loading={submitting} onClick={handlePay}>
        <Lock className="w-4 h-4" /> Payer {formatPrice(amount)}
      </Button>

      {/* Badges de sécurité */}
      <div className="flex justify-center gap-6 mt-5">
        {[
          { icon: <ShieldCheck className="w-4 h-4 text-forest" />, label: "Paiement sécurisé" },
          { icon: <Lock className="w-4 h-4 text-forest" />, label: "Données chiffrées" },
          { icon: <Database className="w-4 h-4 text-forest" />, label: "Séquestre garanti" },
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-1">
            {badge.icon}
            <span className="text-[10px] text-grayText font-medium">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* Lien vers le crédit travaux */}
      <Link href="/credit-travaux" className="block mt-5 no-underline">
        <div className="rounded-[5px] border-2 border-dashed border-border p-4 flex items-center gap-3 hover:bg-surface transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#6366F1" + "1A" }}>
            <Banknote className="w-5 h-5" style={{ color: "#6366F1" }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-navy mb-0.5">Besoin de financer vos travaux ?</div>
            <div className="text-[11px] text-grayText">
              Crédit de 500€ à 75 000€ via Cofidis ou Alma
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-grayText flex-shrink-0" />
        </div>
      </Link>
    </div>
  );
}
