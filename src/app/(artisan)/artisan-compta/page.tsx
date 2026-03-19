"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

interface AccountingService {
  id: string;
  name: string;
  desc: string;
  color: string;
  letter: string;
}

const services: AccountingService[] = [
  { id: "pennylane", name: "Pennylane", desc: "Comptabilité tout-en-un TPE/PME", color: "#6366F1", letter: "P" },
  { id: "indy", name: "Indy", desc: "Automatisée pour indépendants", color: "#3B82F6", letter: "I" },
  { id: "quickbooks", name: "QuickBooks", desc: "Facturation internationale", color: "#2CA01C", letter: "Q" },
  { id: "tiime", name: "Tiime", desc: "Gratuit pour auto-entrepreneurs", color: "#0A1628", letter: "T" },
];

const summaryRows = [
  { label: "Revenus bruts", value: 4820, color: "text-navy" },
  { label: "Commission Nova", value: -482, color: "text-red" },
  { label: "Revenus nets", value: 4338, color: "text-forest", bold: true },
  { label: "TVA collectée", value: 803.33, color: "text-navy" },
];

export default function ArtisanComptaPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [autoExport, setAutoExport] = useState(false);

  const toggle = (id: string) => setConnected((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-5">Comptabilité</h1>

      {/* Info banner */}
      <Card className="bg-surface mb-5 flex items-start gap-3">
        <FileText className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div>
          <div className="text-[13px] font-bold text-navy">Simplifiez votre comptabilité</div>
          <p className="text-xs text-grayText">Connectez votre logiciel. Factures et paiements envoyés automatiquement.</p>
        </div>
      </Card>

      {/* Accounting services */}
      <div className="space-y-3 mb-6">
        {services.map((svc) => {
          const isConnected = !!connected[svc.id];
          return (
            <Card
              key={svc.id}
              className={cn(
                "flex items-center gap-3.5",
                isConnected ? "border-2 border-forest" : "border border-border",
              )}
            >
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white font-heading text-lg font-extrabold shrink-0"
                style={{ background: svc.color }}
              >
                {svc.letter}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-navy">{svc.name}</span>
                  {isConnected && (
                    <span className="text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">
                      CONNECTÉ
                    </span>
                  )}
                </div>
                <div className="text-xs text-grayText">{svc.desc}</div>
              </div>
              <button
                onClick={() => toggle(svc.id)}
                className={cn(
                  "px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors",
                  isConnected
                    ? "bg-white border border-border text-red hover:bg-red/5"
                    : "bg-forest/10 text-forest hover:bg-forest/20",
                )}
              >
                {isConnected ? "Déconnecter" : "Connecter"}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Auto-export toggle */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-navy">Export automatique</div>
            <div className="text-xs text-grayText">Envoyer chaque nouvelle facture</div>
          </div>
          <button
            onClick={() => setAutoExport(!autoExport)}
            className={cn("relative w-12 h-7 rounded-[14px] transition-colors", autoExport ? "bg-forest" : "bg-border")}
            role="switch"
            aria-checked={autoExport}
          >
            <div className={cn(
              "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform",
              autoExport ? "translate-x-[22px]" : "translate-x-0.5",
            )} />
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs gap-1">
            <Download className="w-3 h-3" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs gap-1">
            <Download className="w-3 h-3" /> Export PDF
          </Button>
        </div>
      </Card>

      {/* Monthly summary */}
      <Card>
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Récapitulatif mars 2026</h2>
        <div className="divide-y divide-border">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex justify-between py-2.5">
              <span className="text-sm text-grayText">{row.label}</span>
              <span className={cn(
                "font-mono font-semibold",
                row.bold ? "text-base font-bold" : "text-sm",
                row.color,
              )}>
                {row.value < 0 ? "- " : ""}{formatPrice(Math.abs(row.value))}
              </span>
            </div>
          ))}
          <div className="flex justify-between py-2.5">
            <span className="text-sm text-grayText">Factures</span>
            <span className="font-mono text-sm font-semibold text-navy">12</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
