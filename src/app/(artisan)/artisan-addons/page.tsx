"use client";

import { useState } from "react";
import {
  Calculator,
  FileText,
  TrendingUp,
  Leaf,
  MessageSquare,
  Users,
  Camera,
  BarChart3,
  Crown,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ElementType;
  includedInExpert?: boolean;
  active?: boolean;
}

const addons: Addon[] = [
  {
    id: "comptable",
    name: "Connexion comptable",
    description: "Synchronisez avec Pennylane, Indy ou votre logiciel comptable",
    price: 9,
    icon: Calculator,
    active: true,
  },
  {
    id: "factures",
    name: "Suivi factures avancé",
    description: "Relances automatiques, échéanciers et exports détaillés",
    price: 7,
    icon: FileText,
  },
  {
    id: "boost",
    name: "Boost visibilité",
    description: "Multipliez par 3 les vues sur votre profil artisan",
    price: 15,
    icon: TrendingUp,
    active: true,
  },
  {
    id: "eco",
    name: "Badge Éco-Responsable",
    description: "Affichez votre engagement environnemental sur votre profil",
    price: 5,
    icon: Leaf,
    includedInExpert: true,
  },
  {
    id: "sms",
    name: "SMS rappel clients",
    description: "Envoi automatique de rappels SMS avant chaque intervention",
    price: 12,
    icon: MessageSquare,
  },
  {
    id: "multi",
    name: "Multi-utilisateurs",
    description: "Ajoutez jusqu'à 3 comptes collaborateurs à votre espace",
    price: 19,
    icon: Users,
    includedInExpert: true,
  },
  {
    id: "galerie",
    name: "Galerie photo HD",
    description: "Jusqu'à 200 photos haute résolution de vos réalisations",
    price: 8,
    icon: Camera,
  },
  {
    id: "rapports",
    name: "Rapports mensuels PDF",
    description: "Rapports d'activité détaillés générés automatiquement chaque mois",
    price: 6,
    icon: BarChart3,
    includedInExpert: true,
  },
];

export default function ArtisanAddonsPage() {
  const [activeAddons, setActiveAddons] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    addons.forEach((a) => {
      initial[a.id] = !!a.active;
    });
    return initial;
  });

  const toggleAddon = (id: string) => {
    setActiveAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalMonthlyCost = addons.reduce((sum, addon) => {
    if (activeAddons[addon.id]) return sum + addon.price;
    return sum;
  }, 0);

  const activeCount = Object.values(activeAddons).filter(Boolean).length;

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[28px] font-extrabold text-navy mb-2">Options</h1>
      <p className="text-[15px] text-grayText mb-6">
        Personnalisez votre expérience avec des modules complémentaires
      </p>

      {/* Addons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {addons.map((addon) => {
          const Icon = addon.icon;
          const isActive = activeAddons[addon.id];

          return (
            <div
              key={addon.id}
              className={cn(
                "bg-white rounded-[5px] border shadow-sm p-5 transition-all",
                isActive ? "border-forest/30 ring-1 ring-forest/20" : "border-border"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-[5px] flex items-center justify-center",
                    isActive ? "bg-forest/10" : "bg-surface"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-forest" : "text-grayText")} />
                </div>
                {addon.includedInExpert && (
                  <span className="flex items-center gap-1 bg-gold/10 text-gold text-[11px] font-bold px-2 py-0.5 rounded-[5px]">
                    <Crown className="w-3 h-3" />
                    Inclus dans Expert
                  </span>
                )}
              </div>

              {/* Content */}
              <h3 className="font-heading text-[15px] font-bold text-navy mb-1">{addon.name}</h3>
              <p className="text-[13px] text-grayText mb-5 leading-relaxed">{addon.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[15px] font-bold text-navy">
                  {formatPrice(addon.price)}
                  <span className="text-[13px] text-grayText font-normal">/mois</span>
                </span>
                <button
                  onClick={() => toggleAddon(addon.id)}
                  className={cn(
                    "relative w-12 h-7 rounded-[5px] transition-all",
                    isActive ? "bg-forest" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-5 h-5 rounded-[5px] bg-white shadow-sm transition-all",
                      isActive ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total summary */}
      <div className="bg-white rounded-[5px] border border-border shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-heading text-[15px] font-bold text-navy">Coût mensuel total</div>
            <div className="text-[13px] text-grayText mt-0.5">
              {activeCount} option{activeCount !== 1 ? "s" : ""} active{activeCount !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[24px] font-bold text-navy">
              {formatPrice(totalMonthlyCost)}
            </div>
            <div className="text-[13px] text-grayText">/mois</div>
          </div>
        </div>
      </div>
    </div>
  );
}
