"use client";

import { useState } from "react";
import { FileText, Download, TrendingUp, Receipt, Wallet, BarChart3, ArrowUpRight, ArrowDownRight, CalendarDays } from "lucide-react";
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

const stats = [
  { label: "Revenus nets", value: 4338, icon: TrendingUp, accent: "border-forest", trend: "+12%", trendUp: true },
  { label: "Factures émises", value: 12, icon: Receipt, accent: "border-sage", trend: "+3", trendUp: true, raw: true },
  { label: "TVA collectée", value: 803.33, icon: Wallet, accent: "border-gold", trend: null, trendUp: false },
  { label: "Commission Nova", value: 482, icon: BarChart3, accent: "border-navy", trend: "-2%", trendUp: false },
];

export default function ArtisanComptaPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ pennylane: true });
  const [autoExport, setAutoExport] = useState(false);

  const toggle = (id: string) => setConnected((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold text-navy">Comptabilité</h1>
          <p className="text-[15px] text-grayText mt-1">Suivez vos finances et connectez vos outils comptables</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[13px] text-grayText bg-surface px-4 py-2.5 rounded-[5px] border border-border">
          <CalendarDays className="w-4.5 h-4.5" />
          <span className="font-semibold text-navy">Mars 2026</span>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-surface rounded-[5px] p-5 flex items-start gap-3 mb-6">
        <FileText className="w-6 h-6 text-forest shrink-0 mt-0.5" />
        <div>
          <div className="text-[15px] font-bold text-navy">Simplifiez votre comptabilité</div>
          <p className="text-[13px] text-grayText mt-0.5">Connectez votre logiciel. Factures et paiements envoyés automatiquement.</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                "bg-white rounded-[5px] p-5 border border-border border-l-[3px]",
                stat.accent,
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-grayText" />
                {stat.trend && (
                  <span className={cn(
                    "flex items-center gap-0.5 text-xs font-semibold",
                    stat.trendUp ? "text-success" : "text-red",
                  )}>
                    {stat.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="font-mono text-xl font-bold text-navy">
                {stat.raw ? stat.value : formatPrice(stat.value)}
              </div>
              <div className="text-[13px] text-grayText mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* 2-column grid: services left, summary right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column — services + export */}
        <div className="lg:col-span-3 space-y-6">
          {/* Accounting services */}
          <div>
            <h2 className="font-heading text-[15px] font-bold text-navy mb-3">Services comptables</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc) => {
                const isConnected = !!connected[svc.id];
                return (
                  <div
                    key={svc.id}
                    className={cn(
                      "bg-white rounded-[5px] p-5 border flex flex-col gap-3",
                      isConnected ? "border-forest" : "border-border",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-[5px] flex items-center justify-center text-white font-heading text-lg font-extrabold shrink-0"
                        style={{ background: svc.color }}
                      >
                        {svc.letter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-bold text-navy">{svc.name}</span>
                          {isConnected && (
                            <span className="text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-[5px]">
                              CONNECTÉ
                            </span>
                          )}
                        </div>
                        <div className="text-[13px] text-grayText">{svc.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(svc.id)}
                      className={cn(
                        "w-full px-5 py-2.5 rounded-[5px] text-sm font-bold transition-all hover:-translate-y-0.5",
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
          </div>

          {/* Export section */}
          <div className="bg-white rounded-[5px] p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[15px] font-semibold text-navy">Export automatique</div>
                <div className="text-[13px] text-grayText">Envoyer chaque nouvelle facture</div>
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
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-surface text-navy text-sm font-bold px-5 py-2.5 rounded-[5px] hover:-translate-y-0.5 transition-transform">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-surface text-navy text-sm font-bold px-5 py-2.5 rounded-[5px] hover:-translate-y-0.5 transition-transform">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Right column — monthly summary */}
        <div className="lg:col-span-2">
          <h2 className="font-heading text-[15px] font-bold text-navy mb-3">Résumé mensuel</h2>
          <div className="bg-white rounded-[5px] p-5 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-forest" />
              <h3 className="font-heading text-[15px] font-bold text-navy">Mars 2026</h3>
            </div>
            <div className="divide-y divide-border">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex justify-between py-3">
                  <span className="text-[15px] text-grayText">{row.label}</span>
                  <span className={cn(
                    "font-mono",
                    row.bold ? "text-lg font-bold" : "text-[15px] font-semibold",
                    row.color,
                  )}>
                    {row.value < 0 ? "- " : ""}{formatPrice(Math.abs(row.value))}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-3">
                <span className="text-[15px] text-grayText">Factures</span>
                <span className="font-mono text-[15px] font-semibold text-navy">12</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-grayText">Résultat net du mois</span>
                <span className="font-mono text-xl font-bold text-forest">{formatPrice(4338)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
