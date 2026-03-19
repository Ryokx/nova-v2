"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Building, Plus, Shield, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  {
    id: "1",
    type: "Visa",
    last4: "6411",
    holder: "Sophie Lefevre",
    expiry: "09/28",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "8923",
    holder: "Sophie Lefevre",
    expiry: "03/27",
    gradient: "from-red-500 to-gold",
  },
];

export default function PaymentMethodsPage() {
  const [defaultCard, setDefaultCard] = useState("1");

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="w-9 h-9 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-navy" />
        </Link>
        <h1 className="font-heading text-[26px] font-extrabold text-navy">Moyens de paiement</h1>
      </div>

      {/* Saved cards */}
      <div className="space-y-3 mb-5">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setDefaultCard(card.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-[20px] transition-all text-left",
              defaultCard === card.id
                ? "border-2 border-forest bg-white"
                : "border border-border bg-white hover:border-forest/30"
            )}
          >
            {/* Card icon */}
            <div
              className={cn(
                "w-12 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-[8px] font-bold shadow-sm",
                card.gradient
              )}
            >
              {card.type}
            </div>

            {/* Card info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-navy">
                  {card.type} &bull;&bull;&bull;&bull; {card.last4}
                </span>
                {defaultCard === card.id && (
                  <span className="px-2 py-0.5 rounded-full bg-forest/10 text-forest text-xs font-semibold">
                    Par défaut
                  </span>
                )}
              </div>
              <div className="text-xs text-grayText mt-0.5">
                Exp. {card.expiry}{card.holder ? ` — ${card.holder}` : ""}
              </div>
            </div>

            {/* Radio indicator */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                defaultCard === card.id ? "border-forest bg-forest" : "border-gray-300"
              )}
            >
              {defaultCard === card.id && <Check className="w-3 h-3 text-white" />}
            </div>
          </button>
        ))}
      </div>

      {/* Add card button */}
      <button className="w-full flex items-center justify-center gap-2 p-4 rounded-[20px] border-2 border-dashed border-border text-grayText text-sm font-medium hover:border-forest/30 hover:text-navy transition-all mb-6">
        <Plus className="w-4 h-4" /> Ajouter une carte
      </button>

      {/* Other methods */}
      <div className="bg-white rounded-[20px] p-5 border border-border mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-4">Autres méthodes</h2>
        <div className="space-y-4">
          {[
            {
              icon: Smartphone,
              label: "Apple Pay",
              status: "Configuré",
              ok: true,
            },
            {
              icon: Building,
              label: "Virement bancaire",
              status: "RIB non renseigné",
              ok: false,
            },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                  <Icon className="w-5 h-5 text-forest" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy">{m.label}</div>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    m.ok ? "text-success" : "text-grayText"
                  )}
                >
                  {m.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-[14px] bg-surface">
        <Shield className="w-4 h-4 text-forest shrink-0 mt-0.5" />
        <p className="text-xs text-grayText leading-relaxed">
          Vos données bancaires sont chiffrées et sécurisées par un protocole SSL 256 bits.
          Nova ne stocke jamais vos informations bancaires.
        </p>
      </div>
    </div>
  );
}
