/**
 * Page de création/aperçu d'une facture artisan.
 * Affiche une facture auto-générée depuis une mission validée avec :
 * - En-tête (numéro, client, statut)
 * - Lignes de facturation (description, qté, prix unitaire, total)
 * - Totaux HT / TVA / TTC
 * - Actions : envoyer au client, télécharger PDF
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, FileText } from "lucide-react";

/* Formateur de prix en français (ex: "85,00 EUR") */
function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " EUR";
}

/* Données mockées : lignes de la facture */
const invoiceLines = [
  { description: "Robinet mitigeur", qty: 1, unitPrice: 85 },
  { description: "Main d'oeuvre", qty: 2, unitPrice: 65 },
];

/* Calcul des totaux */
const totalHT = invoiceLines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
const tva = Math.round(totalHT * 0.1 * 100) / 100;
const totalTTC = totalHT + tva;

export default function ArtisanInvoicesPage() {
  const router = useRouter();
  /* État de chargement lors de l'envoi */
  const [sending, setSending] = useState(false);

  /* Simule l'envoi de la facture au client (en prod : POST /api/invoices) */
  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
  };

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[15px] text-forest font-medium mb-5 hover:underline"
      >
        <ArrowLeft className="w-5 h-5" /> Retour
      </button>

      <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">Nouvelle facture</h1>
      <p className="text-[15px] text-grayText mb-6">
        Facture auto-générée depuis la mission validée
      </p>

      {/* Invoice preview card */}
      <div className="bg-white border border-border shadow-sm rounded-[5px] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[5px] bg-forest/5 flex items-center justify-center">
              <FileText className="w-6 h-6 text-forest" />
            </div>
            <div>
              <span className="font-mono text-[15px] font-semibold text-forest">#FAC-2026-128</span>
              <div className="text-[13px] text-grayText mt-0.5">Caroline L. -- 15 mars 2026</div>
            </div>
          </div>
          <span className="px-5 py-2.5 rounded-[5px] text-[13px] font-semibold bg-success/10 text-success">
            Payée
          </span>
        </div>

        {/* Line items */}
        <div className="mb-5">
          <div className="grid grid-cols-[1fr_80px_120px_120px] gap-3 text-[13px] font-semibold text-grayText uppercase tracking-wide mb-3 px-2">
            <span>Description</span>
            <span className="text-center">Qté</span>
            <span className="text-right">P.U.</span>
            <span className="text-right">Total</span>
          </div>
          {invoiceLines.map((line, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_80px_120px_120px] gap-3 text-[15px] py-4 px-2 border-b border-border/50 last:border-0"
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
        <div className="bg-surface/50 rounded-[5px] p-5 space-y-3 mb-6">
          <div className="flex justify-between text-[15px]">
            <span className="text-grayText">Total HT</span>
            <span className="font-mono font-medium text-navy">{formatPrice(totalHT)}</span>
          </div>
          <div className="flex justify-between text-[15px]">
            <span className="text-grayText">TVA (10%)</span>
            <span className="font-mono font-medium text-navy">{formatPrice(tva)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-bold text-[15px] text-navy">Total TTC</span>
            <span className="font-mono text-xl font-bold text-navy">{formatPrice(totalTTC)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 flex items-center justify-center gap-2 bg-deepForest text-white text-sm font-bold px-5 py-2.5 rounded-[5px] hover:-translate-y-0.5 transition-transform disabled:opacity-50"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" /> Envoyer au client
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface text-navy text-sm font-bold rounded-[5px] hover:-translate-y-0.5 transition-transform">
            <Download className="w-5 h-5" /> Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
}
