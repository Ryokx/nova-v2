"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  { id: "BOILER", icon: "🔥", name: "Entretien chaudière", price: 120, desc: "Vérification, nettoyage et réglage de votre chaudière", frequency: "1 visite/an" },
  { id: "AC", icon: "❄️", name: "Entretien climatisation", price: 150, desc: "Nettoyage filtres, vérification du fluide et des performances", frequency: "1 visite/an" },
  { id: "PLUMBING", icon: "🔧", name: "Check-up plomberie", price: 90, desc: "Inspection des canalisations, robinetterie et sanitaires", frequency: "1 visite/an" },
  { id: "FULL", icon: "⭐", name: "Pack Sérénité", price: 299, desc: "Chaudière + climatisation + plomberie, couverture totale", frequency: "3 visites/an", popular: true },
];

export default function EntretienPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 text-center py-16 animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">Contrat souscrit !</h1>
        <p className="text-sm text-grayText mb-6">
          L&apos;artisan vous contactera prochainement pour planifier la première visite.
        </p>
        <Button onClick={() => router.push(`/artisan/${slug}`)}>Retour au profil</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Contrat d&apos;entretien</h1>
      <p className="text-sm text-grayText mb-6">Choisissez un plan pour un entretien régulier</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all",
              selected === plan.id
                ? "border-forest bg-forest/5"
                : "border-border bg-white hover:border-forest/30",
            )}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gold text-white text-[10px] font-bold">
                POPULAIRE
              </span>
            )}
            <div className="text-2xl mb-2">{plan.icon}</div>
            <div className="text-sm font-bold text-navy">{plan.name}</div>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="font-mono text-xl font-bold text-navy">{plan.price}€</span>
              <span className="text-xs text-grayText">/an</span>
            </div>
            <p className="text-xs text-grayText mt-1.5 leading-relaxed">{plan.desc}</p>
            <div className="text-[11px] text-forest font-medium mt-2">{plan.frequency}</div>
          </button>
        ))}
      </div>

      <Button
        className="w-full gap-2"
        size="lg"
        disabled={!selected}
        onClick={() => setDone(true)}
      >
        <Lock className="w-4 h-4" /> Souscrire au contrat
      </Button>
    </div>
  );
}
