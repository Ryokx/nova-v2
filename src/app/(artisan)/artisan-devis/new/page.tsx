"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Shield, Plus, Trash2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const stepLabels = ["Client", "Lignes", "Envoi"];

interface LineItem {
  label: string;
  qty: number;
  unitPrice: number;
}

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

export default function CreateDevisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 0: Client info
  const [clientName, setClientName] = useState("Caroline Lefevre");
  const [clientEmail, setClientEmail] = useState("caroline.l@email.com");
  const [clientPhone, setClientPhone] = useState("06 12 34 56 78");
  const [clientAddress, setClientAddress] = useState("12 rue de Clichy 75009");

  // Step 1: Line items
  const [lines, setLines] = useState<LineItem[]>([
    { label: "Remplacement robinet mitigeur", qty: 1, unitPrice: 85 },
    { label: "Main d'œuvre", qty: 2, unitPrice: 65 },
  ]);

  // Step 2: Message
  const [message, setMessage] = useState("Bonjour, voici le devis détaillé pour l'intervention prévue. N'hésitez pas à me contacter pour toute question.");

  const totalHT = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const tva = Math.round(totalHT * 0.2 * 100) / 100;
  const totalTTC = totalHT + tva;

  const addLine = () => setLines([...lines, { label: "", qty: 1, unitPrice: 0 }]);
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lines];
    const line = updated[i];
    if (!line) return;
    if (field === "label") line.label = value as string;
    else if (field === "qty") line.qty = Number(value) || 0;
    else line.unitPrice = Number(value) || 0;
    setLines(updated);
  };

  const handleSend = async () => {
    setSubmitting(true);
    // In real app, would POST to /api/devis
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    router.push("/artisan-documents");
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Nouveau devis</h1>

      {/* 3-step progress bar */}
      <div className="flex items-center mb-8">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  i < step
                    ? "bg-deepForest text-white"
                    : i === step
                      ? "bg-deepForest text-white"
                      : "bg-border text-grayText"
                )}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold",
                  i <= step ? "text-navy" : "text-grayText"
                )}
              >
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 rounded-full mx-3 mt-[-18px]",
                  i < step ? "bg-deepForest" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Client */}
      {step === 0 && (
        <div className="bg-white border border-border shadow-sm rounded-[20px] p-5">
          <h2 className="font-heading text-base font-bold text-navy mb-4">Informations client</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-grayText mb-1 block">Nom du client</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-white border border-border rounded-xl p-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-grayText mb-1 block">Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-white border border-border rounded-xl p-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-grayText mb-1 block">Téléphone</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-white border border-border rounded-xl p-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-grayText mb-1 block">Adresse</label>
              <input
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full bg-white border border-border rounded-xl p-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(1)}
            disabled={!clientName || !clientEmail}
            className="w-full mt-5 flex items-center justify-center gap-2 bg-deepForest text-white text-sm font-bold py-3 rounded-[14px] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Suivant <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 1: Lines */}
      {step === 1 && (
        <div className="bg-white border border-border shadow-sm rounded-[20px] p-5">
          <h2 className="font-heading text-base font-bold text-navy mb-4">Lignes du devis</h2>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_60px_80px_80px_32px] gap-2 text-[11px] font-semibold text-grayText uppercase tracking-wide mb-2 px-1">
            <span>Description</span>
            <span className="text-center">Qté</span>
            <span className="text-right">P.U.</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          <div className="space-y-2 mb-4">
            {lines.map((line, i) => (
              <div key={i} className="grid grid-cols-[1fr_60px_80px_80px_32px] gap-2 items-center">
                <input
                  placeholder="Description"
                  value={line.label}
                  onChange={(e) => updateLine(i, "label", e.target.value)}
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <input
                  type="number"
                  min={1}
                  value={line.qty}
                  onChange={(e) => updateLine(i, "qty", e.target.value)}
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-navy text-center focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={line.unitPrice}
                  onChange={(e) => updateLine(i, "unitPrice", e.target.value)}
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-navy text-right focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <span className="font-mono text-sm font-semibold text-navy text-right">
                  {formatPrice(line.qty * line.unitPrice)}
                </span>
                {lines.length > 1 && (
                  <button
                    onClick={() => removeLine(i)}
                    className="text-grayText hover:text-red transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addLine}
            className="flex items-center gap-1.5 text-sm text-forest font-bold mb-5 hover:underline"
          >
            <Plus className="w-4 h-4" /> Ajouter une ligne
          </button>

          {/* Totals */}
          <div className="bg-surface/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-grayText">Total HT</span>
              <span className="font-mono font-medium text-navy">{formatPrice(totalHT)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-grayText">TVA (20%)</span>
              <span className="font-mono font-medium text-navy">{formatPrice(tva)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-bold text-navy">Total TTC</span>
              <span className="font-mono text-xl font-bold text-navy">{formatPrice(totalTTC)}</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-2 px-5 py-3 bg-surface text-navy text-sm font-bold rounded-[14px] hover:-translate-y-0.5 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" /> Précédent
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={lines.length === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-deepForest text-white text-sm font-bold py-3 rounded-[14px] hover:-translate-y-0.5 transition-transform disabled:opacity-50"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Send */}
      {step === 2 && (
        <div className="bg-white border border-border shadow-sm rounded-[20px] p-5">
          <h2 className="font-heading text-base font-bold text-navy mb-4">Envoyer le devis</h2>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-surface mb-4">
            <div className="text-xs text-grayText mb-1">Devis pour {clientName}</div>
            <div className="font-mono text-xl font-bold text-navy">{formatPrice(totalTTC)}</div>
            <div className="text-xs text-grayText mt-0.5">
              {lines.length} ligne{lines.length > 1 ? "s" : ""} &middot; TVA {formatPrice(tva)}
            </div>
          </div>

          <label className="text-xs font-semibold text-grayText mb-1 block">Message pour le client</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message au client..."
            className="w-full h-[100px] bg-white border border-border rounded-xl p-3 text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none mb-4"
          />

          {/* Escrow info badge */}
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-surface border border-forest/10 mb-5">
            <Shield className="w-5 h-5 text-forest shrink-0" />
            <div>
              <div className="text-sm font-semibold text-navy">Paiement sécurisé par séquestre</div>
              <div className="text-xs text-grayText">
                Le montant sera bloqué jusqu&apos;à validation de l&apos;intervention par le client
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3 bg-surface text-navy text-sm font-bold rounded-[14px] hover:-translate-y-0.5 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" /> Précédent
            </button>
            <button
              onClick={handleSend}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-deepForest text-white text-sm font-bold py-3 rounded-[14px] hover:-translate-y-0.5 transition-transform disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Envoyer le devis
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
