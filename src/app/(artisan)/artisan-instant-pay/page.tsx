"use client";

import { useState } from "react";
import { Zap, ArrowRight, CheckCircle, Clock, TrendingUp, Banknote, Info } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface InstantPayTransaction {
  id: string;
  mission: string;
  client: string;
  amount: number;
  fee: number;
  date: string;
  status: "completed" | "processing";
}

const transactions: InstantPayTransaction[] = [
  { id: "ip1", mission: "Réparation fuite salle de bain", client: "Caroline L.", amount: 450, fee: 18, date: "20 mars 2026", status: "completed" },
  { id: "ip2", mission: "Installation robinet cuisine", client: "Pierre M.", amount: 320, fee: 12.80, date: "18 mars 2026", status: "completed" },
  { id: "ip3", mission: "Débouchage canalisation", client: "Amélie R.", amount: 180, fee: 7.20, date: "15 mars 2026", status: "completed" },
  { id: "ip4", mission: "Diagnostic plomberie", client: "Luc D.", amount: 95, fee: 3.80, date: "12 mars 2026", status: "completed" },
  { id: "ip5", mission: "Remplacement chauffe-eau", client: "Sophie T.", amount: 890, fee: 35.60, date: "10 mars 2026", status: "completed" },
];

const steps = [
  { icon: CheckCircle, title: "Mission validée", description: "Le client valide l'intervention terminée" },
  { icon: Zap, title: "Demande Instant Pay", description: "Demandez le versement instantané" },
  { icon: Banknote, title: "Virement en 30 min", description: "Recevez vos fonds sur votre compte" },
];

const totalVerse = transactions.reduce((sum, t) => sum + t.amount - t.fee, 0);
const totalDemandes = transactions.length;

export default function ArtisanInstantPayPage() {
  const [autoEnabled, setAutoEnabled] = useState(false);

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[28px] font-extrabold text-navy mb-6">Instant Pay</h1>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-deepForest to-forest rounded-[5px] p-6 mb-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-[5px] bg-white/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-extrabold">Recevez vos paiements immédiatement</h2>
            <p className="text-white/70 text-[15px] mt-0.5">
              Plus besoin d'attendre 48h pour recevoir vos fonds
            </p>
          </div>
        </div>
      </div>

      {/* 2-column layout: info/features left, transactions right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* How it works */}
          <div className="bg-white rounded-[5px] border border-border shadow-sm p-5">
            <h2 className="font-heading text-[15px] font-bold text-navy mb-5">Comment ça marche</h2>
            <div className="flex flex-col gap-5">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-[5px] bg-surface flex items-center justify-center">
                        <Icon className="w-5 h-5 text-forest" />
                      </div>
                      <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-deepForest text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-heading text-[15px] font-bold text-navy">{step.title}</div>
                      <div className="text-[13px] text-grayText mt-0.5">{step.description}</div>
                    </div>
                    {i < steps.length - 1 && (
                      <ArrowRight className="hidden sm:block w-5 h-5 text-grayText absolute" style={{ display: "none" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fee info */}
          <div className="flex items-center gap-3 bg-surface rounded-[5px] p-5">
            <Info className="w-5 h-5 text-forest shrink-0" />
            <span className="text-[15px] text-forest font-medium">
              Frais Instant Pay : 4% du montant (vs 48h gratuit standard)
            </span>
          </div>

          {/* Auto toggle */}
          <div className={cn(
            "bg-white rounded-[5px] border shadow-sm p-5 transition-all",
            autoEnabled ? "border-forest/30 ring-1 ring-forest/10" : "border-border"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-[5px] flex items-center justify-center transition-colors",
                  autoEnabled ? "bg-forest/10" : "bg-surface"
                )}>
                  <Zap className={cn("w-5 h-5", autoEnabled ? "text-forest" : "text-grayText")} />
                </div>
                <div>
                  <div className="font-heading text-[15px] font-bold text-navy">Virement instantané automatique</div>
                  <div className="text-[13px] text-grayText mt-0.5">
                    Chaque mission validée sera versée instantanément (frais de 1,5%)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAutoEnabled(!autoEnabled)}
                className={cn(
                  "relative w-12 h-7 rounded-full transition-all shrink-0",
                  autoEnabled ? "bg-forest" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all",
                    autoEnabled ? "left-6" : "left-1"
                  )}
                />
              </button>
            </div>

            {autoEnabled && (
              <div className="mt-5 pt-5 border-t border-border space-y-4">
                {/* Confirmation banner */}
                <div className="flex items-center gap-2 bg-forest/5 rounded-[5px] px-4 py-3">
                  <CheckCircle className="w-5 h-5 text-forest shrink-0" />
                  <span className="text-[13px] text-forest font-medium">
                    Activé -- tous vos paiements validés seront virés en 30 minutes
                  </span>
                </div>

                {/* Seuil minimum */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold text-navy">Seuil minimum</div>
                    <div className="text-[13px] text-grayText">Instant Pay uniquement au-dessus de ce montant</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      defaultValue={0}
                      min={0}
                      step={10}
                      className="w-20 text-right font-mono text-[15px] font-bold text-navy bg-surface border border-border rounded-[5px] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                    <span className="text-[13px] text-grayText">EUR</span>
                  </div>
                </div>

                {/* IBAN */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold text-navy">Compte bancaire</div>
                    <div className="text-[13px] text-grayText">IBAN vérifié pour les virements</div>
                  </div>
                  <span className="font-mono text-[13px] text-navy bg-surface px-3 py-1.5 rounded-[5px]">
                    FR76 **** **** 4521
                  </span>
                </div>

                {/* Notification preference */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold text-navy">Notification à chaque virement</div>
                    <div className="text-[13px] text-grayText">Email + notification push</div>
                  </div>
                  <button className="relative w-10 h-6 rounded-full bg-forest transition-all">
                    <span className="absolute top-0.5 left-4.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm" style={{ left: 18 }} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-[5px] border border-border shadow-sm p-5 text-center">
              <div className="font-mono text-[18px] font-bold text-navy">{formatPrice(totalVerse)}</div>
              <div className="text-[13px] text-grayText mt-1">Total versé</div>
            </div>
            <div className="bg-white rounded-[5px] border border-border shadow-sm p-5 text-center">
              <div className="font-mono text-[18px] font-bold text-navy">{totalDemandes}</div>
              <div className="text-[13px] text-grayText mt-1">Demandes</div>
            </div>
            <div className="bg-white rounded-[5px] border border-border shadow-sm p-5 text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-5 h-5 text-forest" />
                <span className="font-mono text-[18px] font-bold text-navy">~240h</span>
              </div>
              <div className="text-[13px] text-grayText mt-1">Temps gagné</div>
            </div>
          </div>
        </div>

        {/* Right column: Transactions */}
        <div className="space-y-5">
          <div className="bg-white rounded-[5px] border border-border shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <TrendingUp className="w-5 h-5 text-forest" />
              <h2 className="font-heading text-[15px] font-bold text-navy">Historique Instant Pay</h2>
            </div>

            <div className="space-y-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 py-3.5 border-b border-border last:border-0">
                  <div className="w-9 h-9 rounded-[5px] bg-forest/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading text-[15px] font-semibold text-navy truncate">{tx.mission}</div>
                    <div className="text-[13px] text-grayText">{tx.client} -- {tx.date}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-[15px] font-bold text-navy">{formatPrice(tx.amount - tx.fee)}</div>
                    <div className="text-[13px] text-grayText">frais {formatPrice(tx.fee)}</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-forest shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="w-full flex items-center justify-center gap-2 bg-deepForest text-white px-5 py-2.5 rounded-[5px] font-bold text-sm hover:-translate-y-0.5 transition-all">
            <Zap className="w-5 h-5" />
            Demander un versement
          </button>
        </div>
      </div>
    </div>
  );
}
