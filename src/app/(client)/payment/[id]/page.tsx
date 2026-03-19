"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Building, Smartphone, Lock, CheckCircle } from "lucide-react";
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
  { id: "transfer", label: "Virement bancaire", icon: Building, desc: "SEPA" },
  { id: "apple_pay", label: "Apple Pay", icon: Smartphone, desc: "Paiement mobile" },
];

const installments = [
  { id: "1", label: "1×", desc: "Payer en une fois" },
  { id: "3", label: "3×", desc: "3× sans frais via Klarna" },
  { id: "4", label: "4×", desc: "4× sans frais via Klarna" },
];

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: mission, loading } = useFetch<MissionPayment>(`/api/missions/${id}`);

  const [method, setMethod] = useState("card");
  const [installment, setInstallment] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const amount = mission?.devis?.totalTTC ?? mission?.amount ?? 0;

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
      <div className="max-w-[500px] mx-auto p-5 md:p-8">
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-[500px] mx-auto p-5 md:p-8 text-center py-16 animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">Paiement bloqué ! 🔒</h1>
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

  return (
    <div className="max-w-[500px] mx-auto p-5 md:p-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Paiement</h1>
      <p className="text-sm text-grayText mb-5">{mission?.type} — {mission?.artisan.user.name}</p>

      {/* Amount */}
      <Card className="text-center mb-5 bg-gradient-to-br from-surface to-white">
        <div className="text-xs text-grayText mb-1">Montant à bloquer en séquestre</div>
        <div className="font-mono text-3xl font-bold text-navy">{formatPrice(amount)}</div>
      </Card>

      {/* Payment method */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Méthode de paiement</h2>
        <div className="space-y-2">
          {methods.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-lg border transition-all text-left",
                  method === m.id ? "border-forest bg-forest/5" : "border-border hover:bg-surface",
                )}
              >
                <Icon className={cn("w-5 h-5", method === m.id ? "text-forest" : "text-grayText")} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy">{m.label}</div>
                  <div className="text-[11px] text-grayText">{m.desc}</div>
                </div>
                <div className={cn(
                  "w-4 h-4 rounded-full border-2",
                  method === m.id ? "border-forest bg-forest" : "border-border",
                )}>
                  {method === m.id && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-[3px]" />}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Installments */}
      <Card className="mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Fractionnement</h2>
        <div className="grid grid-cols-3 gap-2">
          {installments.map((inst) => (
            <button
              key={inst.id}
              onClick={() => setInstallment(inst.id)}
              className={cn(
                "py-3 rounded-lg text-center transition-all",
                installment === inst.id
                  ? "bg-deepForest text-white"
                  : "bg-surface text-navy hover:bg-border",
              )}
            >
              <div className="text-base font-bold">{inst.label}</div>
              <div className="text-[10px] opacity-70">{inst.desc}</div>
            </button>
          ))}
        </div>
        {installment !== "1" && (
          <p className="text-[11px] text-grayText mt-2">
            Paiement en {installment}× de {formatPrice(amount / parseInt(installment))} via Klarna. Klarna gère le fractionnement, Nova reçoit 100%.
          </p>
        )}
      </Card>

      <Button className="w-full gap-2" size="lg" loading={submitting} onClick={handlePay}>
        <Lock className="w-4 h-4" /> Bloquer le paiement — {formatPrice(amount)}
      </Button>

      <p className="text-[10px] text-grayText/60 text-center mt-3">
        Paiement sécurisé par séquestre Nova. L&apos;artisan n&apos;est payé qu&apos;après votre validation.
      </p>
    </div>
  );
}
