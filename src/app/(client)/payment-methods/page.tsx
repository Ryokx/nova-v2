"use client";

import { useState } from "react";
import { Smartphone, Building, Plus, Lock, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const cards = [
  { id: "1", type: "Visa", last4: "6411", holder: "Sophie Laurent", expiry: "09/28", gradient: "from-blue-600 to-blue-800" },
  { id: "2", type: "Mastercard", last4: "8294", holder: "Sophie Laurent", expiry: "03/27", gradient: "from-orange-500 to-red-600" },
];

export default function PaymentMethodsPage() {
  const [defaultCard, setDefaultCard] = useState("1");

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Moyens de paiement</h1>

      {/* Cards */}
      <div className="space-y-3 mb-5">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setDefaultCard(card.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              defaultCard === card.id ? "border-forest bg-forest/5" : "border-border bg-white hover:border-forest/30",
            )}
          >
            {/* Card visual */}
            <div className={cn("w-12 h-8 rounded-md bg-gradient-to-br flex items-center justify-center text-white text-[8px] font-bold", card.gradient)}>
              {card.type}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-navy">•••• {card.last4}</div>
              <div className="text-[11px] text-grayText">{card.holder} • Exp. {card.expiry}</div>
            </div>
            {defaultCard === card.id && (
              <span className="px-2 py-0.5 rounded bg-forest/10 text-forest text-[10px] font-bold">
                Par défaut
              </span>
            )}
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              defaultCard === card.id ? "border-forest bg-forest" : "border-border",
            )}>
              {defaultCard === card.id && <Check className="w-3 h-3 text-white" />}
            </div>
          </button>
        ))}
      </div>

      {/* Add card */}
      <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border text-grayText text-sm font-medium hover:border-forest/30 hover:text-navy transition-all mb-6">
        <Plus className="w-4 h-4" /> Ajouter une carte
      </button>

      {/* Other methods */}
      <Card className="mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Autres méthodes</h2>
        <div className="space-y-3">
          {[
            { icon: Smartphone, label: "Apple Pay", status: "Configuré", ok: true },
            { icon: Building, label: "Virement bancaire", status: "RIB non renseigné", ok: false },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                  <Icon className="w-4 h-4 text-forest" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy">{m.label}</div>
                </div>
                <span className={cn("text-[11px] font-medium", m.ok ? "text-success" : "text-grayText")}>
                  {m.status}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Security */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-surface text-xs text-grayText">
        <Lock className="w-3.5 h-3.5 text-forest" />
        Vos données bancaires sont chiffrées et sécurisées
      </div>
    </div>
  );
}
