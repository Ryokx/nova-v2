"use client";

import { useState } from "react";
import { ChevronDown, Download, Send, Copy, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

interface Document {
  id: string;
  number: string;
  client: string;
  date: string;
  amount: number;
  status: string;
  statusLabel: string;
  statusClasses: string;
  lines: LineItem[];
  tvaRate: number;
}

const mockDevis: Document[] = [
  {
    id: "1",
    number: "DEV-2026-089",
    client: "Caroline L.",
    date: "12 mars 2026",
    amount: 236.5,
    status: "accepted",
    statusLabel: "Accepté",
    statusClasses: "bg-success/10 text-success",
    lines: [
      { description: "Robinet mitigeur", qty: 1, unitPrice: 85 },
      { description: "Main d'œuvre", qty: 2, unitPrice: 65 },
      { description: "Déplacement", qty: 1, unitPrice: 21.5 },
    ],
    tvaRate: 0.1,
  },
  {
    id: "2",
    number: "DEV-2026-085",
    client: "Pierre M.",
    date: "8 mars 2026",
    amount: 890,
    status: "pending",
    statusLabel: "En attente",
    statusClasses: "bg-gold/10 text-gold",
    lines: [
      { description: "Chauffe-eau thermodynamique", qty: 1, unitPrice: 580 },
      { description: "Installation", qty: 4, unitPrice: 65 },
      { description: "Mise en service", qty: 1, unitPrice: 50 },
    ],
    tvaRate: 0.1,
  },
];

const mockFactures: Document[] = [
  {
    id: "3",
    number: "FAC-2026-127",
    client: "Amélie R.",
    date: "10 mars 2026",
    amount: 450,
    status: "paid",
    statusLabel: "Payée",
    statusClasses: "bg-success/10 text-success",
    lines: [
      { description: "Intervention plomberie", qty: 1, unitPrice: 350 },
      { description: "Pièces détachées", qty: 1, unitPrice: 59.09 },
    ],
    tvaRate: 0.1,
  },
  {
    id: "4",
    number: "FAC-2026-119",
    client: "Luc D.",
    date: "5 mars 2026",
    amount: 320,
    status: "paid",
    statusLabel: "Payée",
    statusClasses: "bg-success/10 text-success",
    lines: [
      { description: "Débouchage canalisation", qty: 1, unitPrice: 220 },
      { description: "Déplacement", qty: 1, unitPrice: 70.91 },
    ],
    tvaRate: 0.1,
  },
];

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function DocumentCard({ doc }: { doc: Document }) {
  const [expanded, setExpanded] = useState(false);

  const totalHT = doc.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const tva = Math.round(totalHT * doc.tvaRate * 100) / 100;
  const totalTTC = totalHT + tva;

  return (
    <div className="bg-white border border-border shadow-sm rounded-[20px] overflow-hidden transition-all">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-forest" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-sm font-semibold text-forest">{doc.number}</span>
            <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold", doc.statusClasses)}>
              {doc.statusLabel}
            </span>
          </div>
          <div className="text-sm text-navy font-medium">{doc.client}</div>
          <div className="text-xs text-grayText">{doc.date}</div>
        </div>

        <div className="text-right shrink-0 flex items-center gap-3">
          <span className="font-mono text-base font-bold text-navy">{formatPrice(doc.amount)}</span>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-grayText transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          {/* Line items table */}
          <div className="mt-4 mb-3">
            <div className="grid grid-cols-[1fr_50px_80px_80px] gap-2 text-[11px] font-semibold text-grayText uppercase tracking-wide mb-2 px-1">
              <span>Description</span>
              <span className="text-center">Qté</span>
              <span className="text-right">P.U.</span>
              <span className="text-right">Total</span>
            </div>
            {doc.lines.map((line, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_50px_80px_80px] gap-2 text-sm py-2 px-1 border-b border-border/50 last:border-0"
              >
                <span className="text-navy">{line.description}</span>
                <span className="text-center text-grayText font-mono">{line.qty}</span>
                <span className="text-right text-grayText font-mono">{formatPrice(line.unitPrice)}</span>
                <span className="text-right text-navy font-mono font-semibold">
                  {formatPrice(line.qty * line.unitPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-surface/50 rounded-xl p-3 space-y-1.5 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-grayText">Total HT</span>
              <span className="font-mono font-medium text-navy">{formatPrice(totalHT)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-grayText">TVA ({doc.tvaRate * 100}%)</span>
              <span className="font-mono font-medium text-navy">{formatPrice(tva)}</span>
            </div>
            <div className="flex justify-between text-sm pt-1.5 border-t border-border">
              <span className="font-bold text-navy">Total TTC</span>
              <span className="font-mono text-lg font-bold text-navy">{formatPrice(totalTTC)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-surface text-navy text-sm font-bold rounded-[14px] hover:-translate-y-0.5 transition-transform">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-surface text-navy text-sm font-bold rounded-[14px] hover:-translate-y-0.5 transition-transform">
              <Copy className="w-4 h-4" />
              Dupliquer
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-forest text-white text-sm font-bold rounded-[14px] hover:-translate-y-0.5 transition-transform ml-auto">
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArtisanDocumentsPage() {
  const [tab, setTab] = useState<"devis" | "factures">("devis");

  const docs = tab === "devis" ? mockDevis : mockFactures;

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-1">Documents</h1>
      <p className="text-sm text-grayText mb-5">Vos devis et factures</p>

      {/* Pill-style tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "devis" as const, label: "Devis" },
          { id: "factures" as const, label: "Factures" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[13px] font-bold transition-all",
              tab === t.id
                ? "bg-deepForest text-white"
                : "bg-white border border-border text-navy hover:bg-surface"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {docs.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
