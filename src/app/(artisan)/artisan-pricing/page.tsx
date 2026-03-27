/**
 * Page Tarification artisan.
 * Permet de configurer :
 * - Frais de déplacement par tranche kilométrique
 * - Devis payant ou gratuit
 * - Majorations (urgence +50%, week-end +30%, nuit +80%)
 * Un aperçu en temps réel simule le coût d'une intervention type.
 */
"use client";

import { useState } from "react";
import { Car, FileText, AlertTriangle, Eye, Save } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

/* Tranche kilométrique avec prix associé */
interface DeplacementTier {
  label: string;
  price: number;
}

/* Tarifs par défaut des frais de déplacement */
const defaultTiers: DeplacementTier[] = [
  { label: "0 – 10 km", price: 0 },
  { label: "10 – 20 km", price: 15 },
  { label: "20 – 30 km", price: 25 },
  { label: "30+ km", price: 40 },
];

export default function ArtisanPricingPage() {
  /* Activation des frais de déplacement */
  const [deplacementEnabled, setDeplacementEnabled] = useState(true);
  /* Tarifs par tranche kilométrique */
  const [tiers, setTiers] = useState(defaultTiers);
  /* Devis payant activé/désactivé */
  const [devisPayant, setDevisPayant] = useState(false);
  /* Prix du devis si payant */
  const [devisPrice, setDevisPrice] = useState(0);
  /* Activation des majorations */
  const [majorationUrgence, setMajorationUrgence] = useState(true);
  const [majorationWeekend, setMajorationWeekend] = useState(true);
  const [majorationNuit, setMajorationNuit] = useState(false);

  /* Pourcentages de majoration (fixes) */
  const urgencePct = 50;
  const weekendPct = 30;
  const nuitPct = 80;

  /* Simulation d'aperçu : intervention à 15 km */
  const previewKm = 15;
  const deplacementCost = deplacementEnabled ? (tiers.find((_, i) => i === 1)?.price ?? 15) : 0;

  /* Met à jour le prix d'une tranche kilométrique */
  const updateTierPrice = (index: number, price: number) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, price } : t)));
  };

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[28px] font-extrabold text-navy mb-2">Tarification</h1>
      <p className="text-[15px] text-grayText mb-6">Configurez vos tarifs et frais de déplacement</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left column: settings */}
        <div className="lg:col-span-3 space-y-5">
          {/* Section: Frais de déplacement */}
          <div className="bg-white rounded-[5px] border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center">
                  <Car className="w-5 h-5 text-forest" />
                </div>
                <h2 className="font-heading text-[15px] font-bold text-navy">Frais de déplacement</h2>
              </div>
              <button
                onClick={() => setDeplacementEnabled(!deplacementEnabled)}
                className={cn(
                  "relative w-12 h-7 rounded-[5px] transition-all",
                  deplacementEnabled ? "bg-forest" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-5 h-5 rounded-[5px] bg-white shadow-sm transition-all",
                    deplacementEnabled ? "left-6" : "left-1"
                  )}
                />
              </button>
            </div>

            {deplacementEnabled && (
              <div className="space-y-2.5">
                {tiers.map((tier, i) => (
                  <div key={tier.label} className="flex items-center justify-between bg-surface rounded-[5px] px-5 py-4">
                    <span className="text-[15px] text-navy font-medium">{tier.label}</span>
                    {i === 0 ? (
                      <span className="text-[15px] text-forest font-semibold">Gratuit</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => updateTierPrice(i, Number(e.target.value))}
                          className="w-16 text-right font-mono text-[15px] font-bold text-navy bg-white border border-border rounded-[5px] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                        <span className="text-[13px] text-grayText">€</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Devis */}
          <div className="bg-white rounded-[5px] border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center">
                  <FileText className="w-5 h-5 text-forest" />
                </div>
                <h2 className="font-heading text-[15px] font-bold text-navy">Devis payant</h2>
              </div>
              <button
                onClick={() => setDevisPayant(!devisPayant)}
                className={cn(
                  "relative w-12 h-7 rounded-[5px] transition-all",
                  devisPayant ? "bg-forest" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-5 h-5 rounded-[5px] bg-white shadow-sm transition-all",
                    devisPayant ? "left-6" : "left-1"
                  )}
                />
              </button>
            </div>

            {devisPayant && (
              <div className="flex items-center gap-3 bg-surface rounded-[5px] px-5 py-4">
                <span className="text-[15px] text-navy font-medium">Prix du devis</span>
                <div className="flex items-center gap-1 ml-auto">
                  <input
                    type="number"
                    value={devisPrice}
                    onChange={(e) => setDevisPrice(Number(e.target.value))}
                    className="w-20 text-right font-mono text-[15px] font-bold text-navy bg-white border border-border rounded-[5px] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                  <span className="text-[13px] text-grayText">€</span>
                </div>
              </div>
            )}

            {!devisPayant && (
              <div className="bg-surface rounded-[5px] px-5 py-4">
                <span className="text-[15px] text-forest font-semibold">Devis gratuit</span>
              </div>
            )}
          </div>

          {/* Section: Majorations */}
          <div className="bg-white rounded-[5px] border border-border shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-gold" />
              </div>
              <h2 className="font-heading text-[15px] font-bold text-navy">Majorations</h2>
            </div>

            <div className="space-y-3">
              {/* Urgence */}
              <div className="flex items-center justify-between bg-surface rounded-[5px] px-5 py-4">
                <div>
                  <span className="text-[15px] text-navy font-medium">Urgence</span>
                  <span className="text-[13px] text-grayText ml-2">+{urgencePct}%</span>
                </div>
                <button
                  onClick={() => setMajorationUrgence(!majorationUrgence)}
                  className={cn(
                    "relative w-12 h-7 rounded-[5px] transition-all",
                    majorationUrgence ? "bg-forest" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-5 h-5 rounded-[5px] bg-white shadow-sm transition-all",
                      majorationUrgence ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </div>

              {/* Week-end */}
              <div className="flex items-center justify-between bg-surface rounded-[5px] px-5 py-4">
                <div>
                  <span className="text-[15px] text-navy font-medium">Week-end</span>
                  <span className="text-[13px] text-grayText ml-2">+{weekendPct}%</span>
                </div>
                <button
                  onClick={() => setMajorationWeekend(!majorationWeekend)}
                  className={cn(
                    "relative w-12 h-7 rounded-[5px] transition-all",
                    majorationWeekend ? "bg-forest" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-5 h-5 rounded-[5px] bg-white shadow-sm transition-all",
                      majorationWeekend ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </div>

              {/* Nuit */}
              <div className="flex items-center justify-between bg-surface rounded-[5px] px-5 py-4">
                <div>
                  <span className="text-[15px] text-navy font-medium">Nuit</span>
                  <span className="text-[13px] text-grayText ml-2">+{nuitPct}%</span>
                </div>
                <button
                  onClick={() => setMajorationNuit(!majorationNuit)}
                  className={cn(
                    "relative w-12 h-7 rounded-[5px] transition-all",
                    majorationNuit ? "bg-forest" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-5 h-5 rounded-[5px] bg-white shadow-sm transition-all",
                      majorationNuit ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: preview */}
        <div className="lg:col-span-2 space-y-5">
          {/* Preview card */}
          <div className="bg-white rounded-[5px] border border-border shadow-sm p-5 lg:sticky lg:top-8">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center">
                <Eye className="w-5 h-5 text-forest" />
              </div>
              <h2 className="font-heading text-[15px] font-bold text-navy">Aperçu intervention</h2>
            </div>

            <p className="text-[13px] text-grayText mb-4">
              Exemple : déplacement de {previewKm} km
            </p>

            <div className="space-y-3 text-[15px]">
              <div className="flex justify-between">
                <span className="text-grayText">Déplacement ({previewKm} km)</span>
                <span className="font-mono text-navy">{formatPrice(deplacementCost)}</span>
              </div>
              {devisPayant && devisPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-grayText">Devis</span>
                  <span className="font-mono text-navy">{formatPrice(devisPrice)}</span>
                </div>
              )}
              {majorationUrgence && (
                <div className="flex justify-between">
                  <span className="text-grayText">Majoration urgence</span>
                  <span className="font-mono text-navy">+{urgencePct}%</span>
                </div>
              )}
              {majorationWeekend && (
                <div className="flex justify-between">
                  <span className="text-grayText">Majoration week-end</span>
                  <span className="font-mono text-navy">+{weekendPct}%</span>
                </div>
              )}
              {majorationNuit && (
                <div className="flex justify-between">
                  <span className="text-grayText">Majoration nuit</span>
                  <span className="font-mono text-navy">+{nuitPct}%</span>
                </div>
              )}
            </div>

            <div className="border-t border-border mt-5 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-bold text-navy">Frais fixes estimés</span>
                <span className="font-mono text-[20px] font-bold text-navy">
                  {formatPrice(deplacementCost + (devisPayant ? devisPrice : 0))}
                </span>
              </div>
              <p className="text-[13px] text-grayText mt-1">Hors majorations (appliquées sur le total)</p>
            </div>
          </div>

          {/* Save button */}
          <button className="w-full flex items-center justify-center gap-2 bg-deepForest text-white px-5 py-2.5 rounded-[5px] font-bold text-sm hover:-translate-y-0.5 transition-all">
            <Save className="w-5 h-5" />
            Enregistrer les tarifs
          </button>
        </div>
      </div>
    </div>
  );
}
