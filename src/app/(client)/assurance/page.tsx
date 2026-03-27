/**
 * Page Simulateur Assurance.
 * Parcours en plusieurs étapes pour estimer la couverture d'un sinistre :
 *   1 - Type de sinistre (dégâts des eaux, incendie, vol, etc.)
 *   2 - Banque du client
 *   3 - Type de carte bancaire
 *   4 - Description libre (uniquement si type = "autre")
 * Résultat : analyse de couverture (bonne, partielle, non couverte) avec actions recommandées.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  Flame,
  Lock,
  Mountain,
  GlassWater,
  HelpCircle,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  ClipboardList,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Données                                                            */
/* ------------------------------------------------------------------ */

/** Types de sinistres */
const incidentTypes = [
  { id: "degats_eaux", label: "Dégâts des eaux", icon: Droplets },
  { id: "incendie", label: "Incendie", icon: Flame },
  { id: "vol", label: "Vol / Cambriolage", icon: Lock },
  { id: "catastrophe", label: "Catastrophe naturelle", icon: Mountain },
  { id: "bris_glace", label: "Bris de glace", icon: GlassWater },
  { id: "autre", label: "Autre", icon: HelpCircle },
];

/** Liste des banques */
const banks = [
  "BNP Paribas",
  "Crédit Agricole",
  "Société Générale",
  "LCL",
  "Banque Populaire",
  "Caisse d'Épargne",
  "Autre",
];

/** Types de cartes bancaires */
const cardTypes = [
  "Visa Classic",
  "Visa Premier",
  "Mastercard Gold",
  "Mastercard Platinum",
  "American Express",
];

/* ------------------------------------------------------------------ */
/*  Types et logique d'analyse                                         */
/* ------------------------------------------------------------------ */

interface AnalysisResult {
  coverage: "bonne" | "partielle" | "non_couverte";
  franchise: number;
  plafond: number;
  actions: string[];
}

/**
 * Détermine le niveau de couverture en fonction des sélections.
 * Logique simplifiée : carte premium + grande banque = meilleure couverture.
 */
function getAnalysis(incident: string, bank: string, card: string): AnalysisResult {
  /* Cas "autre" : pas de couverture identifiable */
  if (incident === "autre") {
    return {
      coverage: "non_couverte",
      franchise: 0,
      plafond: 0,
      actions: [
        "Vérifiez votre contrat d'assurance habitation",
        "Contactez votre assureur pour connaître votre couverture",
        "Conservez tous les justificatifs",
      ],
    };
  }

  const isPremiumCard = ["Visa Premier", "Mastercard Gold", "Mastercard Platinum", "American Express"].includes(card);
  const isMajorBank = ["BNP Paribas", "Crédit Agricole", "Société Générale"].includes(bank);

  /* Carte premium + grande banque = bonne couverture */
  if (isPremiumCard && isMajorBank) {
    return {
      coverage: "bonne",
      franchise: 150,
      plafond: 30000,
      actions: [
        "Déclarez le sinistre dans les 5 jours",
        "Prenez des photos des dégâts avant toute réparation",
        "Conservez les factures des biens endommagés",
        "Faites intervenir un artisan certifié via Nova",
      ],
    };
  }

  /* Un des deux critères = couverture partielle */
  if (isPremiumCard || isMajorBank) {
    return {
      coverage: "partielle",
      franchise: 300,
      plafond: 15000,
      actions: [
        "Vérifiez les exclusions de votre contrat",
        "Déclarez le sinistre sous 2 jours ouvrés",
        "Demandez un devis avant toute intervention",
        "Contactez votre banque pour les garanties carte",
      ],
    };
  }

  /* Cas par défaut : couverture partielle basique */
  return {
    coverage: "partielle",
    franchise: 500,
    plafond: 10000,
    actions: [
      "Vérifiez votre contrat d'assurance habitation",
      "Déclarez le sinistre le plus rapidement possible",
      "Demandez un devis détaillé à un artisan Nova",
    ],
  };
}

/** Configuration visuelle des niveaux de couverture */
const coverageConfig = {
  bonne: { label: "Bonne couverture", icon: CheckCircle, color: "text-success", bg: "bg-success/15" },
  partielle: { label: "Couverture partielle", icon: AlertTriangle, color: "text-gold", bg: "bg-gold/15" },
  non_couverte: { label: "Non couverte", icon: XCircle, color: "text-red", bg: "bg-red/10" },
};

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function InsuranceSimulatorPage() {
  const router = useRouter();

  /** Étape courante */
  const [step, setStep] = useState(1);
  /** Sélections de l'utilisateur */
  const [incident, setIncident] = useState("");
  const [bank, setBank] = useState("");
  const [cardType, setCardType] = useState("");
  const [description, setDescription] = useState("");

  /* Nombre total d'étapes (4 si "autre", 3 sinon) */
  const totalSteps = incident === "autre" ? 4 : 3;
  const needsDescription = incident === "autre";

  /** Vérifie si on peut passer à l'étape suivante */
  const canNext = () => {
    if (step === 1) return !!incident;
    if (step === 2) return !!bank;
    if (step === 3 && !needsDescription) return !!cardType;
    if (step === 3 && needsDescription) return !!cardType;
    if (step === 4) return description.trim().length >= 10;
    return false;
  };

  /** Passe à l'étape suivante ou affiche les résultats */
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setStep(totalSteps + 1); // affiche les résultats
    }
  };

  /* Calcul de l'analyse (uniquement après la dernière étape) */
  const analysis = step > totalSteps ? getAnalysis(incident, bank, cardType) : null;
  const coverageInfo = analysis ? coverageConfig[analysis.coverage] : null;

  /* ================================================================ */
  /*  Vue résultat : analyse de couverture                             */
  /* ================================================================ */
  if (analysis && coverageInfo) {
    const CoverageIcon = coverageInfo.icon;
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8 animate-pageIn">
        <button
          onClick={() => setStep(totalSteps)}
          className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Analyse de couverture</h1>
        <p className="text-sm text-grayText mb-5">
          Basée sur vos informations
        </p>

        {/* Carte niveau de couverture */}
        <Card className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", coverageInfo.bg)}>
              <CoverageIcon className={cn("w-5 h-5", coverageInfo.color)} />
            </div>
            <div>
              <div className={cn("text-sm font-bold", coverageInfo.color)}>{coverageInfo.label}</div>
              <div className="text-[11px] text-grayText">
                {incidentTypes.find((t) => t.id === incident)?.label} — {bank}
              </div>
            </div>
          </div>

          {/* Franchise et plafond (si couvert) */}
          {analysis.coverage !== "non_couverte" && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface rounded-xl p-3 text-center">
                <div className="text-[11px] text-grayText mb-0.5">Franchise estimée</div>
                <div className="font-mono text-lg font-bold text-navy">{formatPrice(analysis.franchise)}</div>
              </div>
              <div className="bg-surface rounded-xl p-3 text-center">
                <div className="text-[11px] text-grayText mb-0.5">Plafond estimé</div>
                <div className="font-mono text-lg font-bold text-navy">{formatPrice(analysis.plafond)}</div>
              </div>
            </div>
          )}

          {/* Actions recommandées */}
          <div className="border-t border-border pt-3">
            <div className="text-xs font-bold text-navy mb-2">Actions recommandées</div>
            <div className="space-y-2">
              {analysis.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-forest mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-grayText">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* CTA Nova */}
        <Card className="bg-gradient-to-br from-surface to-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-forest" />
            </div>
            <div>
              <div className="text-sm font-bold text-navy">Nova vous accompagne</div>
              <div className="text-[11px] text-grayText">Simplifiez vos démarches</div>
            </div>
          </div>

          <div className="space-y-2.5 mb-4">
            {[
              { icon: FileText, text: "Déclaration simplifiée" },
              { icon: ClipboardList, text: "Suivi du dossier en temps réel" },
              { icon: Wrench, text: "Artisan certifié dépêché sous 24h" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-forest flex-shrink-0" />
                  <span className="text-sm text-navy font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>

          <Button className="w-full" onClick={() => router.push("/urgence")}>
            Lancer la procédure
          </Button>
        </Card>

        <p className="text-[10px] text-grayText/60 text-center mt-4">
          Cette analyse est indicative et ne constitue pas un avis juridique. Consultez votre assureur pour les détails de votre contrat.
        </p>
      </div>
    );
  }

  /* ================================================================ */
  /*  Formulaire par étapes                                            */
  /* ================================================================ */
  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">

      {/* Bouton retour */}
      <button
        onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
        className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Simulateur assurance</h1>
      <p className="text-sm text-grayText mb-5">
        Estimez votre couverture en quelques clics
      </p>

      {/* Barre de progression */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all",
              i < step ? "bg-forest" : "bg-border",
            )}
          />
        ))}
      </div>

      {/* Étape 1 : Type de sinistre */}
      {step === 1 && (
        <div className="animate-pageIn">
          <h2 className="font-heading text-base font-bold text-navy mb-3">Type de sinistre</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {incidentTypes.map((type) => {
              const Icon = type.icon;
              const selected = incident === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setIncident(type.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer bg-transparent",
                    selected ? "border-forest bg-forest/5" : "border-border hover:bg-surface",
                  )}
                >
                  <Icon className={cn("w-6 h-6", selected ? "text-forest" : "text-grayText")} />
                  <span className={cn("text-xs font-semibold text-center", selected ? "text-forest" : "text-navy")}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Étape 2 : Banque */}
      {step === 2 && (
        <div className="animate-pageIn">
          <h2 className="font-heading text-base font-bold text-navy mb-3">Votre banque</h2>
          <div className="space-y-2">
            {banks.map((b) => {
              const selected = bank === b;
              return (
                <button
                  key={b}
                  onClick={() => setBank(b)}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer bg-transparent",
                    selected ? "border-forest bg-forest/5" : "border-border hover:bg-surface",
                  )}
                >
                  <span className={cn("text-sm font-semibold", selected ? "text-forest" : "text-navy")}>{b}</span>
                  <div
                    className={cn(
                      "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center",
                      selected ? "border-forest bg-forest" : "border-border",
                    )}
                  >
                    {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Étape 3 : Type de carte */}
      {step === 3 && (
        <div className="animate-pageIn">
          <h2 className="font-heading text-base font-bold text-navy mb-3">Type de carte bancaire</h2>
          <div className="space-y-2">
            {cardTypes.map((c) => {
              const selected = cardType === c;
              return (
                <button
                  key={c}
                  onClick={() => setCardType(c)}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer bg-transparent",
                    selected ? "border-forest bg-forest/5" : "border-border hover:bg-surface",
                  )}
                >
                  <span className={cn("text-sm font-semibold", selected ? "text-forest" : "text-navy")}>{c}</span>
                  <div
                    className={cn(
                      "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center",
                      selected ? "border-forest bg-forest" : "border-border",
                    )}
                  >
                    {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Étape 4 : Description (uniquement pour "autre") */}
      {step === 4 && needsDescription && (
        <div className="animate-pageIn">
          <h2 className="font-heading text-base font-bold text-navy mb-1">Décrivez votre sinistre</h2>
          <p className="text-xs text-grayText mb-3">Minimum 10 caractères</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez la nature du sinistre, les circonstances, les dégâts constatés..."
            rows={5}
            className="w-full px-3.5 py-3 rounded-xl border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest resize-none box-border"
          />
          <div className="text-right text-[11px] text-grayText mt-1">
            {description.length} caractère{description.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Bouton suivant / analyser */}
      <Button
        className="w-full mt-6 gap-2"
        size="lg"
        disabled={!canNext()}
        onClick={handleNext}
      >
        {step < totalSteps ? "Continuer" : "Analyser ma couverture"}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
