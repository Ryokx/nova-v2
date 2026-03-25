"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  { id: "chaudiere", icon: "🔥", name: "Entretien chaudière", price: "120", freq: "1 visite/an", desc: "Vérification obligatoire, nettoyage, attestation" },
  { id: "clim", icon: "❄️", name: "Entretien climatisation", price: "150", freq: "1 visite/an", desc: "Filtres, fluide, contrôle performance" },
  { id: "plomberie", icon: "🔧", name: "Check-up plomberie", price: "90", freq: "1 visite/an", desc: "Inspection canalisations, détection fuites" },
  { id: "complet", icon: "⭐", name: "Pack Sérénité", price: "299", freq: "3 visites/an", desc: "Tout inclus + intervention prioritaire", popular: true },
];

export default function EntretienPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-36 text-center animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-[5px] bg-success flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-white" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-navy mb-2">
          Contrat souscrit !
        </h2>
        <p className="text-sm text-grayText mb-6">
          L&apos;artisan vous contactera pour planifier la première intervention.
        </p>
        <Button className="w-full" onClick={() => router.push("/missions")}>
          Voir mes missions
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto px-6 py-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">
        Contrat d&apos;entretien annuel
      </h1>

      <div className="flex flex-col gap-2.5 mb-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={cn(
              "relative bg-white rounded-[5px] shadow-sm p-4 text-left transition-all cursor-pointer",
              selected === plan.id
                ? "border-2 border-forest bg-surface"
                : plan.popular
                  ? "border-2 border-gold"
                  : "border border-border"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-px right-4 bg-gold text-white text-[9px] font-bold px-2.5 py-1 rounded-b-lg">
                POPULAIRE
              </div>
            )}
            <div className="flex gap-3.5 items-start">
              <div className="w-11 h-11 rounded-[5px] bg-surface flex items-center justify-center text-xl shrink-0">
                {plan.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-navy">{plan.name}</span>
                  <div>
                    <span className="font-mono text-lg font-bold text-forest">{plan.price}€</span>
                    <span className="text-[10px] text-grayText">/an</span>
                  </div>
                </div>
                <div className="text-xs text-grayText mb-1">{plan.desc}</div>
                <div className="text-[11px] font-semibold text-forest">{plan.freq}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Button
        className="w-full gap-2"
        size="lg"
        disabled={!selected}
        onClick={() => setDone(true)}
      >
        <Lock className="w-4 h-4" /> Souscrire le contrat
      </Button>
    </div>
  );
}
