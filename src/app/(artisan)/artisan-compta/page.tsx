"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface AccountingService {
  id: string;
  name: string;
  desc: string;
  color: string;
  letter: string;
}

const services: AccountingService[] = [
  { id: "pennylane", name: "Pennylane", desc: "Comptabilité tout-en-un TPE/PME", color: "#7C3AED", letter: "P" },
  { id: "indy", name: "Indy", desc: "Automatisée pour indépendants", color: "#2563EB", letter: "I" },
  { id: "quickbooks", name: "QuickBooks", desc: "Facturation internationale", color: "#22C88A", letter: "Q" },
  { id: "tiime", name: "Tiime", desc: "Gratuit pour auto-entrepreneurs", color: "#1F2937", letter: "T" },
];

const summaryRows = [
  { label: "Revenus bruts", value: 4820, color: "text-navy" },
  { label: "Commission Nova", value: -482, color: "text-red" },
  { label: "Revenus nets", value: 4338, color: "text-forest", bold: true },
  { label: "TVA collectée", value: 803.33, color: "text-navy" },
];

export default function ArtisanComptaPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ pennylane: true });
  const [autoExport, setAutoExport] = useState(false);

  const toggle = (id: string) => setConnected((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-5">Comptabilité</h1>

      {/* Info banner */}
      <div className="bg-surface rounded-xl p-4 flex items-start gap-3 mb-5">
        <FileText className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div>
          <div className="text-[13px] font-bold text-navy">Simplifiez votre comptabilité</div>
          <p className="text-xs text-grayText">Connectez votre logiciel. Factures et paiements envoyés automatiquement.</p>
        </div>
      </div>

      {/* Accounting services — 2x2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {services.map((svc) => {
          const isConnected = !!connected[svc.id];
          return (
            <div
              key={svc.id}
              className={cn(
                "bg-white rounded-[20px] p-5 border flex flex-col gap-3",
                isConnected ? "border-forest" : "border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-heading text-lg font-extrabold shrink-0"
                  style={{ background: svc.color }}
                >
                  {svc.letter}
                </div>
                <div className="flex-1 min-w-0">
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
              </div>
              <button
                onClick={() => toggle(svc.id)}
                className={cn(
                  "w-full px-3 py-2 rounded-[14px] text-xs font-bold transition-all hover:-translate-y-0.5",
                  isConnected
                    ? "bg-white border border-border text-red hover:bg-red/5"
                    : "bg-forest/10 text-forest hover:bg-forest/20",
                )}
              >
                {isConnected ? "Déconnecter" : "Connecter"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Export section */}
      <div className="bg-white rounded-[20px] p-5 border border-border mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-navy">Export automatique</div>
            <div className="text-xs text-grayText">Envoyer chaque nouvelle facture</div>
          </div>
          <button
            onClick={() => setAutoExport(!autoExport)}
            className={cn("relative w-12 h-7 rounded-full transition-colors", autoExport ? "bg-forest" : "bg-border")}
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
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-surface text-navy text-xs font-bold py-2.5 rounded-[14px] hover:-translate-y-0.5 transition-transform">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-surface text-navy text-xs font-bold py-2.5 rounded-[14px] hover:-translate-y-0.5 transition-transform">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Monthly summary */}
      <div className="bg-white rounded-[20px] p-5 border border-border">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Mars 2026</h2>
        <div className="divide-y divide-border">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex justify-between py-2.5">
              <span className="text-sm text-grayText">{row.label}</span>
              <span className={cn(
                "font-mono",
                row.bold ? "text-base font-bold" : "text-sm font-semibold",
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
      </div>
    </div>
  );
}
