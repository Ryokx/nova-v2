"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Wrench,
  Flame,
  Zap,
  Hammer,
  Home,
  Bath,
  ChefHat,
  HelpCircle,
  Clock,
  FileSignature,
  Banknote,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

const quickAmounts = [1000, 3000, 5000, 10000, 20000];
const durations = [6, 12, 24, 36, 48, 60];

const workTypes = [
  { id: "plomberie", label: "Plomberie", icon: Wrench },
  { id: "chauffage", label: "Chauffage", icon: Flame },
  { id: "electricite", label: "Électricité", icon: Zap },
  { id: "renovation", label: "Rénovation", icon: Hammer },
  { id: "toiture", label: "Toiture", icon: Home },
  { id: "salle_bain", label: "Salle de bain", icon: Bath },
  { id: "cuisine", label: "Cuisine", icon: ChefHat },
  { id: "autre", label: "Autre", icon: HelpCircle },
];

function calcMonthly(amount: number, months: number, taeg: number): number {
  if (taeg === 0) return amount / months;
  const r = taeg / 100 / 12;
  return (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function CreditTravauxPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(24);
  const [workType, setWorkType] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<"cofidis" | "alma" | "">("");
  const [submitting, setSubmitting] = useState(false);

  const cofidisMonthly = useMemo(() => calcMonthly(amount, duration, 0.9), [amount, duration]);
  const almaMonthly = useMemo(() => calcMonthly(amount, duration, 0), [amount, duration]);
  const cofidisTotal = cofidisMonthly * duration;
  const almaTotal = almaMonthly * duration;

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setStep(3);
  };

  // Step 3: Success
  if (step === 3) {
    const timeline = [
      { icon: Send, label: "Demande envoyée", sub: "Aujourd'hui", done: true },
      { icon: Clock, label: "Étude du dossier", sub: "24-48h", done: false },
      { icon: FileSignature, label: "Signature électronique", sub: "En attente", done: false },
      { icon: Banknote, label: "Déblocage des fonds", sub: "Sous 72h", done: false },
    ];

    return (
      <div className="max-w-[600px] mx-auto px-5 pt-20 pb-16 text-center animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-[5px] bg-success/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">Demande envoyée !</h1>
        <p className="text-sm text-grayText mb-6">
          Votre demande de crédit de {formatPrice(amount)} sur {duration} mois via {selectedOffer === "cofidis" ? "Cofidis" : "Alma"} a été transmise.
        </p>

        <Card className="text-left mb-5">
          <h2 className="font-heading text-sm font-bold text-navy mb-4">Prochaines étapes</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3 relative">
                  {/* Vertical line */}
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[15px] top-[32px] w-px h-[28px] bg-border" />
                  )}
                  <div
                    className={cn(
                      "w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0",
                      item.done ? "bg-success/15" : "bg-surface",
                    )}
                  >
                    <Icon className={cn("w-4 h-4", item.done ? "text-success" : "text-grayText")} />
                  </div>
                  <div className="pb-5">
                    <div className={cn("text-sm font-semibold", item.done ? "text-navy" : "text-grayText")}>
                      {item.label}
                      {item.done && <CheckCircle className="w-3.5 h-3.5 text-success inline ml-1.5" />}
                    </div>
                    <div className="text-[11px] text-grayText">{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Button className="w-full" onClick={() => router.push("/missions")}>
          Retour à mes missions
        </Button>

        <p className="text-[10px] text-grayText/60 mt-6 leading-relaxed">
          Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Aucun versement de quelque nature que ce soit ne peut être exigé d&apos;un particulier avant l&apos;obtention d&apos;un ou plusieurs prêts d&apos;argent.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      {/* Back */}
      <button
        onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
        className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Crédit travaux</h1>
      <p className="text-sm text-grayText mb-5">
        Financez vos travaux de 500€ à 75 000€
      </p>

      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={cn("h-1 flex-1 rounded-full transition-all", s <= step ? "bg-forest" : "bg-border")}
          />
        ))}
      </div>

      {/* Step 1: Form */}
      {step === 1 && (
        <div className="animate-pageIn">
          {/* Amount */}
          <Card className="mb-4">
            <h2 className="font-heading text-sm font-bold text-navy mb-3">Montant souhaité</h2>
            <div className="text-center mb-3">
              <span className="font-mono text-3xl font-bold text-navy">{formatPrice(amount)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={75000}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-forest mb-3"
            />
            <div className="flex justify-between text-[10px] text-grayText font-mono mb-3">
              <span>500€</span>
              <span>75 000€</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none",
                    amount === q ? "bg-deepForest text-white" : "bg-surface text-navy hover:bg-border",
                  )}
                >
                  {q >= 1000 ? `${q / 1000}k€` : `${q}€`}
                </button>
              ))}
            </div>
          </Card>

          {/* Duration */}
          <Card className="mb-4">
            <h2 className="font-heading text-sm font-bold text-navy mb-3">Durée de remboursement</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "py-2.5 rounded-xl text-center transition-all cursor-pointer border-none",
                    duration === d ? "bg-deepForest text-white" : "bg-surface text-navy hover:bg-border",
                  )}
                >
                  <div className="text-sm font-bold">{d} mois</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Work type */}
          <Card className="mb-4">
            <h2 className="font-heading text-sm font-bold text-navy mb-3">Type de travaux</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {workTypes.map((type) => {
                const Icon = type.icon;
                const selected = workType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setWorkType(type.id)}
                    className={cn(
                      "flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer bg-transparent text-left",
                      selected ? "border-forest bg-forest/5" : "border-border hover:bg-surface",
                    )}
                  >
                    <Icon className={cn("w-5 h-5 flex-shrink-0", selected ? "text-forest" : "text-grayText")} />
                    <span className={cn("text-xs font-semibold", selected ? "text-forest" : "text-navy")}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Preview */}
          <Card className="bg-gradient-to-br from-surface to-white mb-4">
            <h2 className="font-heading text-sm font-bold text-navy mb-3">Estimation mensuelle</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 border border-border text-center">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ backgroundColor: "#E30613" }}>
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div className="text-[10px] text-grayText mb-0.5">Cofidis</div>
                <div className="font-mono text-base font-bold text-navy">{formatPrice(cofidisMonthly)}</div>
                <div className="text-[10px] text-grayText">/mois</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-border text-center">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ backgroundColor: "#FA5022" }}>
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div className="text-[10px] text-grayText mb-0.5">Alma</div>
                <div className="font-mono text-base font-bold text-navy">{formatPrice(almaMonthly)}</div>
                <div className="text-[10px] text-grayText">/mois</div>
              </div>
            </div>
          </Card>

          <Button
            className="w-full gap-2"
            size="lg"
            disabled={!workType}
            onClick={() => setStep(2)}
          >
            Voir les offres <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Offers */}
      {step === 2 && (
        <div className="animate-pageIn">
          {/* Recap card */}
          <Card className="mb-4 bg-surface">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-grayText">Montant</span>
              <span className="font-mono text-sm font-bold text-navy">{formatPrice(amount)}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-grayText">Durée</span>
              <span className="text-sm font-bold text-navy">{duration} mois</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-grayText">Travaux</span>
              <span className="text-sm font-bold text-navy">
                {workTypes.find((t) => t.id === workType)?.label}
              </span>
            </div>
          </Card>

          {/* Cofidis offer */}
          <button
            onClick={() => setSelectedOffer("cofidis")}
            className={cn(
              "w-full text-left mb-3 bg-white rounded-[5px] border-2 p-5 transition-all cursor-pointer",
              selectedOffer === "cofidis" ? "border-forest shadow-md" : "border-border hover:border-forest/30",
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#E30613" }}>
                  <span className="text-white text-lg font-bold">C</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-navy">Cofidis</div>
                  <div className="text-[11px] text-grayText">TAEG à partir de 0,90%</div>
                </div>
              </div>
              <Badge variant="warning" className="text-[10px]">Recommandé</Badge>
            </div>

            <div className="bg-surface rounded-xl p-3 mb-3 text-center">
              <div className="text-[11px] text-grayText mb-0.5">Mensualité estimée</div>
              <div className="font-mono text-2xl font-bold text-navy">{formatPrice(cofidisMonthly)}</div>
              <div className="text-[10px] text-grayText">par mois pendant {duration} mois</div>
            </div>

            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-grayText">Coût total</span>
              <span className="font-mono font-bold text-navy">{formatPrice(cofidisTotal)}</span>
            </div>

            <div className="space-y-1.5">
              {["Réponse sous 24h", "Signature 100% en ligne", "Déblocage rapide des fonds"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                  <span className="text-xs text-grayText">{f}</span>
                </div>
              ))}
            </div>

            {selectedOffer === "cofidis" && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-forest">
                <CheckCircle className="w-4 h-4" /> Sélectionné
              </div>
            )}
          </button>

          {/* Alma offer */}
          <button
            onClick={() => setSelectedOffer("alma")}
            className={cn(
              "w-full text-left mb-4 bg-white rounded-[5px] border-2 p-5 transition-all cursor-pointer",
              selectedOffer === "alma" ? "border-forest shadow-md" : "border-border hover:border-forest/30",
            )}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FA5022" }}>
                <span className="text-white text-lg font-bold">A</span>
              </div>
              <div>
                <div className="text-sm font-bold text-navy">Alma</div>
                <div className="text-[11px] text-grayText">TAEG à partir de 0%</div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-3 mb-3 text-center">
              <div className="text-[11px] text-grayText mb-0.5">Mensualité estimée</div>
              <div className="font-mono text-2xl font-bold text-navy">{formatPrice(almaMonthly)}</div>
              <div className="text-[10px] text-grayText">par mois pendant {duration} mois</div>
            </div>

            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-grayText">Coût total</span>
              <span className="font-mono font-bold text-navy">{formatPrice(almaTotal)}</span>
            </div>

            <div className="space-y-1.5">
              {["0% d'intérêts (sous conditions)", "Paiement flexible", "Intégration Nova simplifiée"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                  <span className="text-xs text-grayText">{f}</span>
                </div>
              ))}
            </div>

            {selectedOffer === "alma" && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-forest">
                <CheckCircle className="w-4 h-4" /> Sélectionné
              </div>
            )}
          </button>

          <Button
            className="w-full gap-2"
            size="lg"
            disabled={!selectedOffer}
            loading={submitting}
            onClick={handleSubmit}
          >
            Envoyer ma demande <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-[10px] text-grayText/60 text-center mt-4 leading-relaxed">
            Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Aucun versement de quelque nature que ce soit ne peut être exigé d&apos;un particulier avant l&apos;obtention d&apos;un ou plusieurs prêts d&apos;argent.
          </p>
        </div>
      )}
    </div>
  );
}
