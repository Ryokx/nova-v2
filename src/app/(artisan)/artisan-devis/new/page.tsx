"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Lock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";

const stepLabels = ["Client", "Lignes", "Envoi"];

interface LineItem {
  label: string;
  qty: number;
  unitPrice: number;
}

export default function CreateDevisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 0: Client info
  const [clientName, setClientName] = useState("Caroline Lefèvre");
  const [clientEmail, setClientEmail] = useState("caroline.l@email.com");
  const [clientPhone, setClientPhone] = useState("06 12 34 56 78");
  const [clientAddress, setClientAddress] = useState("12 rue de Clichy, 75009");

  // Step 1: Line items
  const [lines, setLines] = useState<LineItem[]>([
    { label: "Remplacement robinet mitigeur", qty: 1, unitPrice: 85 },
    { label: "Main d'œuvre", qty: 2, unitPrice: 65 },
  ]);

  // Step 2: Message
  const [message, setMessage] = useState("Bonjour, voici le devis pour l'intervention.");

  const totalHT = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const tva = Math.round(totalHT * 0.1 * 100) / 100;
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
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-5">Nouveau devis</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
              i <= step ? "bg-deepForest text-white" : "bg-border text-grayText",
            )}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={cn("text-xs font-medium", i <= step ? "text-navy" : "text-grayText")}>{label}</span>
            {i < stepLabels.length - 1 && (
              <div className={cn("flex-1 h-0.5 rounded", i < step ? "bg-deepForest" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Client */}
      {step === 0 && (
        <Card>
          <h2 className="font-heading text-sm font-bold text-navy mb-4">Informations client</h2>
          <div className="space-y-2.5">
            <Input label="Nom du client" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <Input label="Email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            <Input label="Téléphone" type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            <Input label="Adresse" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
          </div>
          <Button className="w-full mt-5" onClick={() => setStep(1)} disabled={!clientName || !clientEmail}>
            Suivant
          </Button>
        </Card>
      )}

      {/* Step 1: Lines */}
      {step === 1 && (
        <Card>
          <h2 className="font-heading text-sm font-bold text-navy mb-4">Lignes du devis</h2>
          <div className="space-y-3 mb-4">
            {lines.map((line, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1">
                  <input
                    placeholder="Description"
                    value={line.label}
                    onChange={(e) => updateLine(i, "label", e.target.value)}
                    className="w-full h-10 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>
                <input
                  type="number"
                  min={1}
                  value={line.qty}
                  onChange={(e) => updateLine(i, "qty", e.target.value)}
                  className="w-16 h-10 px-2 rounded-sm border border-border bg-white text-sm text-navy text-center focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={line.unitPrice}
                  onChange={(e) => updateLine(i, "unitPrice", e.target.value)}
                  className="w-20 h-10 px-2 rounded-sm border border-border bg-white text-sm text-navy text-right focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <span className="font-mono text-sm font-semibold text-navy w-20 text-right">
                  {formatPrice(line.qty * line.unitPrice)}
                </span>
                {lines.length > 1 && (
                  <button onClick={() => removeLine(i)} className="text-grayText hover:text-red transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={addLine} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-5 hover:underline">
            <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
          </button>

          {/* Totals */}
          <div className="pt-4 border-t border-border space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-grayText">HT</span>
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

          <div className="flex gap-2 mt-5">
            <Button variant="outline" onClick={() => setStep(0)}>Retour</Button>
            <Button className="flex-1" onClick={() => setStep(2)} disabled={lines.length === 0}>
              Suivant
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Send */}
      {step === 2 && (
        <Card>
          <h2 className="font-heading text-sm font-bold text-navy mb-4">Envoyer le devis</h2>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-surface mb-4">
            <div className="text-xs text-grayText mb-1">Devis pour {clientName}</div>
            <div className="font-mono text-lg font-bold text-navy">{formatPrice(totalTTC)}</div>
            <div className="text-xs text-grayText mt-0.5">{lines.length} ligne{lines.length > 1 ? "s" : ""} • TVA {formatPrice(tva)}</div>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message au client..."
            className="w-full h-[80px] px-4 py-3 rounded-md border border-border bg-white text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none mb-4"
          />

          <div className="flex items-center gap-2 p-3 rounded-lg bg-forest/5 border border-forest/10 mb-5">
            <Lock className="w-4 h-4 text-forest" />
            <span className="text-xs text-forest font-medium">Le client recevra le devis sur son espace Nova</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
            <Button className="flex-1" loading={submitting} onClick={handleSend}>
              Envoyer le devis
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
