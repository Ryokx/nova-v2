"use client";

import { useState } from "react";
import { Lock, CheckCircle, FileText, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice, cn } from "@/lib/utils";

interface EscrowItem {
  id: string; client: string; mission: string; amount: number; ht: number; tva: number;
  days: number; ref: string; factureId: string; date: string;
}

interface ReceivedItem {
  id: string; client: string; mission: string; amount: number; ht: number; tva: number;
  date: string; ref: string; factureId: string; iban: string;
}

const escrowItems: EscrowItem[] = [
  { id: "e0", client: "Caroline L.", mission: "Remplacement robinet", amount: 236.5, ht: 197.08, tva: 39.42, days: 3, ref: "#ESQ-2026-044", factureId: "#FAC-2026-128", date: "14 mars 2026" },
  { id: "e1", client: "Pierre M.", mission: "Installation cumulus", amount: 890, ht: 741.67, tva: 148.33, days: 5, ref: "#ESQ-2026-043", factureId: "#FAC-2026-127", date: "12 mars 2026" },
];

const receivedItems: ReceivedItem[] = [
  { id: "r0", client: "Amélie R.", mission: "Réparation chauffe-eau", amount: 450, ht: 375, tva: 75, date: "12 mars 2026", ref: "#VIR-2026-089", factureId: "#FAC-2026-125", iban: "FR76 •••• •••• •••• 4521" },
  { id: "r1", client: "Luc D.", mission: "Diagnostic fuite", amount: 320, ht: 266.67, tva: 53.33, date: "5 mars 2026", ref: "#VIR-2026-082", factureId: "#FAC-2026-119", iban: "FR76 •••• •••• •••• 4521" },
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
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-5">Mes paiements</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setOpenId(null); }}
            className={cn("px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all",
              tab === t.id ? "bg-deepForest text-white" : "bg-white border border-border text-navy hover:bg-surface")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Escrow tab */}
      {tab === "escrow" && (
        <>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-forest/5 border border-forest/10 mb-4">
            <Lock className="w-4 h-4 text-forest" />
            <span className="text-xs text-forest font-medium">Fonds sécurisés — virés sous 48h après validation</span>
          </div>
          <div className="space-y-3">
            {escrowItems.map((item) => (
              <Card key={item.id} className="p-0 overflow-hidden">
                <button onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-navy">{item.client}</div>
                    <div className="text-xs text-grayText">{item.mission}</div>
                  </div>
                  <div className="font-mono text-sm font-bold text-navy">{formatPrice(item.amount)}</div>
                  <ChevronDown className={cn("w-4 h-4 text-grayText transition-transform", openId === item.id && "rotate-180")} />
                </button>
                {/* Progress bar */}
                <div className="px-4 pb-2">
                  <div className="h-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-forest to-success" style={{ width: `${((7 - item.days) / 7) * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-grayText mt-1">Validation dans {item.days} jours</div>
                </div>
                {openId === item.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-border space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-grayText">Référence séquestre</span><span className="font-mono text-xs text-navy">{item.ref}</span></div>
                    <div className="flex justify-between"><span className="text-grayText">Date de blocage</span><span className="text-navy">{item.date}</span></div>
                    <div className="flex justify-between"><span className="text-grayText">Montant HT</span><span className="font-mono text-navy">{formatPrice(item.ht)}</span></div>
                    <div className="flex justify-between"><span className="text-grayText">TVA (20%)</span><span className="font-mono text-navy">{formatPrice(item.tva)}</span></div>
                    <div className="flex justify-between pt-2 border-t border-border"><span className="font-semibold text-navy">Total TTC</span><span className="font-mono font-bold text-navy">{formatPrice(item.amount)}</span></div>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 px-3 py-2 rounded-sm bg-forest/5 text-forest text-xs font-medium hover:bg-forest/10 transition-colors">Reçu séquestre</button>
                      <button className="flex-1 px-3 py-2 rounded-sm bg-forest/5 text-forest text-xs font-medium hover:bg-forest/10 transition-colors">Facture {item.factureId}</button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Received tab */}
      {tab === "received" && (
        <div className="space-y-3">
          {receivedItems.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden">
              <button onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy">{item.client}</div>
                  <div className="text-xs text-grayText">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-success">{formatPrice(item.amount)}</div>
                  <div className="flex items-center gap-1 text-[10px] text-success">
                    <CheckCircle className="w-3 h-3" /> Virement effectué
                  </div>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-grayText transition-transform", openId === item.id && "rotate-180")} />
              </button>
              {openId === item.id && (
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-grayText">Référence virement</span><span className="font-mono text-xs text-navy">{item.ref}</span></div>
                  <div className="flex justify-between"><span className="text-grayText">Mission</span><span className="text-navy">{item.mission}</span></div>
                  <div className="flex justify-between"><span className="text-grayText">Date virement</span><span className="text-navy">{item.date}</span></div>
                  <div className="flex justify-between"><span className="text-grayText">IBAN créditeur</span><span className="font-mono text-xs text-navy">{item.iban}</span></div>
                  <div className="flex justify-between"><span className="text-grayText">Montant HT</span><span className="font-mono text-navy">{formatPrice(item.ht)}</span></div>
                  <div className="flex justify-between"><span className="text-grayText">TVA</span><span className="font-mono text-navy">{formatPrice(item.tva)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-border"><span className="font-semibold text-navy">Net versé</span><span className="font-mono font-bold text-navy">{formatPrice(item.amount)}</span></div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 px-3 py-2 rounded-sm bg-forest/5 text-forest text-xs font-medium hover:bg-forest/10 transition-colors">Reçu PDF</button>
                    <button className="flex-1 px-3 py-2 rounded-sm bg-forest/5 text-forest text-xs font-medium hover:bg-forest/10 transition-colors">Facture {item.factureId}</button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Pending tab */}
      {tab === "pending" && (
        <EmptyState icon={<FileText className="w-6 h-6 text-grayText" />} title="Aucun paiement en attente" />
      )}
    </div>
  );
}
