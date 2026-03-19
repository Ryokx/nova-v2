"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, FileText } from "lucide-react";

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

const invoiceLines = [
  { description: "Robinet mitigeur", qty: 1, unitPrice: 85 },
  { description: "Main d'œuvre", qty: 2, unitPrice: 65 },
];

const totalHT = invoiceLines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
const tva = Math.round(totalHT * 0.1 * 100) / 100;
const totalTTC = totalHT + tva;

export default function ArtisanInvoicesPage() {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-1">Nouvelle facture</h1>
      <p className="text-sm text-grayText mb-6">
        Facture auto-générée depuis la mission validée
      </p>

      {/* Invoice preview card */}
      <div className="bg-white border border-border shadow-sm rounded-[20px] p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center">
              <FileText className="w-5 h-5 text-forest" />
            </div>
            <div>
              <span className="font-mono text-sm font-semibold text-forest">#FAC-2026-128</span>
              <div className="text-xs text-grayText mt-0.5">Caroline L. &middot; 15 mars 2026</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
            Payée
          </span>
        </div>

        {/* Line items */}
        <div className="mb-4">
          <div className="grid grid-cols-[1fr_50px_80px_80px] gap-2 text-[11px] font-semibold text-grayText uppercase tracking-wide mb-2 px-1">
            <span>Description</span>
            <span className="text-center">Qté</span>
            <span className="text-right">P.U.</span>
            <span className="text-right">Total</span>
          </div>
          {invoiceLines.map((line, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_50px_80px_80px] gap-2 text-sm py-2.5 px-1 border-b border-border/50 last:border-0"
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
        <div className="bg-surface/50 rounded-xl p-4 space-y-2 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-grayText">Total HT</span>
            <span className="font-mono font-medium text-navy">{formatPrice(totalHT)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-grayText">TVA (10%)</span>
            <span className="font-mono font-medium text-navy">{formatPrice(tva)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-bold text-navy">Total TTC</span>
            <span className="font-mono text-xl font-bold text-navy">{formatPrice(totalTTC)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 flex items-center justify-center gap-2 bg-deepForest text-white text-sm font-bold py-3 rounded-[14px] hover:-translate-y-0.5 transition-transform disabled:opacity-50"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Envoyer au client
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-surface text-navy text-sm font-bold rounded-[14px] hover:-translate-y-0.5 transition-transform">
            <Download className="w-4 h-4" /> Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
}
