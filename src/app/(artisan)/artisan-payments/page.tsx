"use client";

import { useState } from "react";
import { Shield, CheckCircle, FileText, ChevronDown, Download } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice, cn } from "@/lib/utils";

interface EscrowItem {
  id: string; client: string; mission: string; amount: number; ht: number; tva: number;
  daysElapsed: number; daysTotal: number; ref: string; factureId: string; date: string;
}

interface ReceivedItem {
  id: string; client: string; mission: string; amount: number; ht: number; tva: number;
  date: string; ref: string; factureId: string; iban: string; missionLink: string;
}

const escrowItems: EscrowItem[] = [
  { id: "e0", client: "Caroline L.", mission: "Remplacement robinet", amount: 236.5, ht: 197.08, tva: 39.42, daysElapsed: 3, daysTotal: 5, ref: "ESQ-2026-044", factureId: "FAC-2026-128", date: "14 mars 2026" },
  { id: "e1", client: "Pierre M.", mission: "Installation cumulus", amount: 890, ht: 741.67, tva: 148.33, daysElapsed: 5, daysTotal: 5, ref: "ESQ-2026-043", factureId: "FAC-2026-127", date: "12 mars 2026" },
];

const receivedItems: ReceivedItem[] = [
  { id: "r0", client: "Amélie R.", mission: "Réparation chauffe-eau", amount: 450, ht: 375, tva: 75, date: "12 mars 2026", ref: "VIR-2026-089", factureId: "FAC-2026-125", iban: "FR76 •••• •••• 4521", missionLink: "#" },
  { id: "r1", client: "Luc D.", mission: "Diagnostic fuite", amount: 320, ht: 266.67, tva: 53.33, date: "5 mars 2026", ref: "VIR-2026-082", factureId: "FAC-2026-119", iban: "FR76 •••• •••• 4521", missionLink: "#" },
];

const tabs = [
  { id: "escrow", label: "En séquestre" },
  { id: "received", label: "Reçus" },
  { id: "pending", label: "En attente" },
];

export default function ArtisanPaymentsPage() {
  const [tab, setTab] = useState("escrow");
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Paiements</h1>

      {/* Tab pills */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setOpenId(null); }}
            className={cn(
              "px-4 py-2 rounded-full text-[13px] font-semibold transition-all",
              tab === t.id
                ? "bg-deepForest text-white"
                : "bg-white border border-border text-navy hover:bg-surface"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Escrow tab */}
      {tab === "escrow" && (
        <>
          {/* Info banner */}
          <div className="flex items-center gap-3 bg-surface rounded-xl p-4 mb-5">
            <Shield className="w-5 h-5 text-forest shrink-0" />
            <span className="text-sm text-forest font-medium">
              Fonds sécurisés — virés sous 48h après validation
            </span>
          </div>

          <div className="space-y-3">
            {escrowItems.map((item) => {
              const isOpen = openId === item.id;
              const progressPct = (item.daysElapsed / item.daysTotal) * 100;

              return (
                <div key={item.id} className="bg-white border border-border shadow-sm rounded-[20px] overflow-hidden">
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-heading text-[15px] font-semibold text-navy">{item.client}</div>
                      <div className="text-xs text-grayText mt-0.5">{item.mission}</div>
                    </div>
                    <div className="font-mono text-[15px] font-bold text-navy">{formatPrice(item.amount)}</div>
                    <ChevronDown className={cn("w-4 h-4 text-grayText transition-transform", isOpen && "rotate-180")} />
                  </button>

                  {/* Progress bar */}
                  <div className="px-5 pb-3">
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-forest to-sage transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[11px] text-grayText font-mono">J+{item.daysElapsed}</span>
                      <span className="text-[11px] text-grayText font-mono">J+{item.daysTotal}</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-3 border-t border-border space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-grayText">Référence séquestre</span>
                        <span className="font-mono text-xs text-navy">{item.ref}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grayText">Date de blocage</span>
                        <span className="text-navy">{item.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grayText">Montant HT</span>
                        <span className="font-mono text-navy">{formatPrice(item.ht)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grayText">TVA (20%)</span>
                        <span className="font-mono text-navy">{formatPrice(item.tva)}</span>
                      </div>
                      <div className="flex justify-between pt-2.5 border-t border-border">
                        <span className="font-semibold text-navy">Total TTC</span>
                        <span className="font-mono font-bold text-navy">{formatPrice(item.amount)}</span>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[14px] bg-surface text-forest text-xs font-bold hover:-translate-y-0.5 transition-transform">
                          <Download className="w-3.5 h-3.5" />
                          Reçu séquestre
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[14px] bg-surface text-forest text-xs font-bold hover:-translate-y-0.5 transition-transform">
                          <Download className="w-3.5 h-3.5" />
                          Facture {item.factureId}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Received tab */}
      {tab === "received" && (
        <div className="space-y-3">
          {receivedItems.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="bg-white border border-border shadow-sm rounded-[20px] overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-heading text-[15px] font-semibold text-navy">{item.client}</div>
                    <div className="text-xs text-grayText mt-0.5">{item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[15px] font-bold text-success">{formatPrice(item.amount)}</div>
                    <div className="flex items-center gap-1 text-[11px] text-success font-medium">
                      <CheckCircle className="w-3 h-3" /> Virement effectué
                    </div>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-grayText transition-transform", isOpen && "rotate-180")} />
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-3 border-t border-border space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-grayText">Référence virement</span>
                      <span className="font-mono text-xs text-navy">{item.ref}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grayText">Mission</span>
                      <a href={item.missionLink} className="text-forest font-medium hover:underline">{item.mission}</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grayText">Date virement</span>
                      <span className="text-navy">{item.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grayText">IBAN créditeur</span>
                      <span className="font-mono text-xs text-navy">{item.iban}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grayText">Montant HT</span>
                      <span className="font-mono text-navy">{formatPrice(item.ht)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grayText">TVA (20%)</span>
                      <span className="font-mono text-navy">{formatPrice(item.tva)}</span>
                    </div>
                    <div className="flex justify-between pt-2.5 border-t border-border">
                      <span className="font-semibold text-navy">Net versé</span>
                      <span className="font-mono font-bold text-navy">{formatPrice(item.amount)}</span>
                    </div>
                    <div className="flex gap-2 pt-3">
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[14px] bg-surface text-forest text-xs font-bold hover:-translate-y-0.5 transition-transform">
                        <Download className="w-3.5 h-3.5" />
                        Reçu PDF
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[14px] bg-surface text-forest text-xs font-bold hover:-translate-y-0.5 transition-transform">
                        <Download className="w-3.5 h-3.5" />
                        Facture {item.factureId}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pending tab */}
      {tab === "pending" && (
        <EmptyState
          icon={<FileText className="w-6 h-6 text-grayText" />}
          title="Aucun paiement en attente"
        />
      )}
    </div>
  );
}
