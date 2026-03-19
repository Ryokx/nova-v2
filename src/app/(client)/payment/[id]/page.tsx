"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Building, Smartphone, Lock, CheckCircle, Shield, ShieldCheck, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MissionPayment {
  id: string;
  type: string;
  amount: number | null;
  artisan: { user: { name: string } };
  devis: { totalTTC: number } | null;
}

const methods = [
  { id: "card", label: "Carte bancaire", icon: CreditCard, desc: "Visa, Mastercard" },
  { id: "transfer", label: "Virement", icon: Building, desc: "SEPA" },
  { id: "apple_pay", label: "Apple Pay", icon: Smartphone, desc: "Paiement mobile" },
];

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: mission, loading } = useFetch<MissionPayment>(`/api/missions/${id}`);

  const [method, setMethod] = useState("card");
  const [installment, setInstallment] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const amount = mission?.devis?.totalTTC ?? mission?.amount ?? 320;

  const handlePay = async () => {
    if (!mission) return;
    setSubmitting(true);
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
      if (res.ok) setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[560px] mx-auto px-5 py-8">
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="max-w-[500px] mx-auto px-5 pt-36 pb-16 text-center animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">Paiement bloqué !</h1>
        <p className="text-sm text-grayText mb-2">
          {formatPrice(amount)} bloqués en séquestre pour votre mission avec {mission?.artisan.user.name}.
        </p>
        <p className="text-xs text-grayText/70 mb-6">
          Le paiement sera libéré uniquement après validation de l&apos;intervention.
        </p>
        <Button onClick={() => router.push("/missions")}>Voir mes missions</Button>
      </div>
    );
  }

  // Installment amounts
  const installmentOptions = [
    { id: "1", label: "1x", amount: formatPrice(amount) },
    { id: "3", label: "3x", amount: `${formatPrice(amount / 3)}/mois` },
    { id: "4", label: "4x", amount: `${formatPrice(amount / 4)}/mois` },
  ];

  return (
    <div className="max-w-[560px] mx-auto px-5 py-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      {/* Title + amount */}
      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Paiement</h1>
      <p className="text-sm text-grayText mb-5">
        {mission?.type ?? "Réparation fuite sous évier"} — {mission?.artisan.user.name ?? "Jean-Michel P."}
      </p>

      {/* Amount card */}
      <Card className="text-center mb-5 bg-gradient-to-br from-surface to-white">
        <div className="text-xs text-grayText mb-1">Montant à bloquer en séquestre</div>
        <div className="font-mono text-3xl font-bold text-navy">{formatPrice(amount)}</div>
      </Card>

      {/* Payment method selector */}
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

      {/* Klarna installments */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Fractionnement Klarna</h2>
        <div className="grid grid-cols-3 gap-2">
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

      {/* Card input fields (shown when card method selected) */}
      {method === "card" && (
        <Card className="mb-4">
          <h2 className="font-heading text-sm font-bold text-navy mb-3">Informations de carte</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-grayText mb-1 block">Numéro de carte</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3.5 py-3 rounded-xl border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest font-mono box-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-grayText mb-1 block">Expiration</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full px-3.5 py-3 rounded-xl border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest font-mono box-border"
                />
              </div>
              <div>
                <label className="text-xs text-grayText mb-1 block">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3.5 py-3 rounded-xl border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest font-mono box-border"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Escrow info badge */}
      <div className="bg-surface rounded-xl p-3 mb-5 flex items-center gap-2 border border-forest/10">
        <Shield className="w-4 h-4 text-forest flex-shrink-0" />
        <span className="text-xs text-forest font-medium">
          Votre paiement sera sécurisé par séquestre — L&apos;artisan est payé après validation
        </span>
      </div>

      {/* Pay button */}
      <Button className="w-full gap-2" size="lg" loading={submitting} onClick={handlePay}>
        <Lock className="w-4 h-4" /> Payer {formatPrice(amount)}
      </Button>

      {/* Security badges */}
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
    </div>
  );
}
