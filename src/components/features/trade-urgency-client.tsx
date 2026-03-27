"use client";

/**
 * Composants client interactifs pour la page d'urgence métier.
 *
 * Ces composants sont séparés du serveur component (TradeUrgency)
 * car ils utilisent useState pour gérer l'ouverture de la modal d'urgence.
 *
 * Exports :
 * - UrgencyCtaButton : bouton rouge "Intervention immédiate" (hero)
 * - UrgencyCtaFinal  : bouton blanc "Intervention immédiate" (CTA final)
 * - UrgencyArtisanCard : carte artisan cliquable qui ouvre la modal
 */

import { useState, useEffect } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { UrgencyModal } from "@/components/features/urgency-modal";

/* ━━━ Types ━━━ */
interface TradeUrgencyClientProps {
  tradeName: string;
}

/** Lecture synchrone du query param "resume" au montage */
function getResumeFromUrl(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("resume") === "true";
}

/**
 * Bouton CTA rouge dans le hero de la page urgence.
 * Ouvre la modal de recherche d'artisan en urgence.
 */
export function UrgencyCtaButton({ tradeName }: TradeUrgencyClientProps) {
  const [urgencyModalOpen, setUrgencyModalOpen] = useState(false);
  const [isResume, setIsResume] = useState(false);

  /* Auto-ouvre la modal au retour de login/signup (?resume=true) */
  useEffect(() => {
    const hasResume = getResumeFromUrl();
    console.log("[UrgencyCtaButton] mount — URL:", window.location.href, "resume:", hasResume);
    if (hasResume) {
      setIsResume(true);
      setUrgencyModalOpen(true);
      /* Nettoie le param de l'URL sans recharger la page */
      const url = new URL(window.location.href);
      url.searchParams.delete("resume");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, []);

  const handleClose = () => {
    setUrgencyModalOpen(false);
    setIsResume(false);
  };

  return (
    <>
      <button
        onClick={() => { setIsResume(false); setUrgencyModalOpen(true); }}
        className="inline-flex items-center px-7 py-3.5 rounded-[5px] bg-red text-white text-[14px] font-bold shadow-[0_6px_20px_rgba(232,48,42,0.2)] hover:bg-red/90 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
      >
        Intervention {tradeName.toLowerCase()} immédiate
      </button>
      <UrgencyModal open={urgencyModalOpen} onClose={handleClose} tradeName={tradeName} resume={isResume} />
    </>
  );
}

/**
 * Bouton CTA blanc dans la section finale de la page urgence.
 * Ouvre la modal de recherche d'artisan en urgence.
 */
export function UrgencyCtaFinal({ tradeName }: TradeUrgencyClientProps) {
  const [urgencyModalOpen, setUrgencyModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setUrgencyModalOpen(true)}
        className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-[5px] bg-white text-deepForest text-[14px] font-bold shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:scale-[0.97] transition-all cursor-pointer shrink-0"
      >
        <Zap className="w-4 h-4 text-red" />
        Intervention immédiate
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
      <UrgencyModal open={urgencyModalOpen} onClose={() => setUrgencyModalOpen(false)} tradeName={tradeName} />
    </>
  );
}

/**
 * Carte artisan cliquable qui ouvre la modal d'urgence.
 * Le contenu (children) est passé par le composant parent.
 */
export function UrgencyArtisanCard({ tradeName, children }: { tradeName: string; children: React.ReactNode }) {
  const [urgencyModalOpen, setUrgencyModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setUrgencyModalOpen(true)}
        className="group bg-white border border-border rounded-[5px] p-4 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(10,64,48,0.05)] hover:border-forest/20 transition-all duration-300 text-left cursor-pointer w-full"
      >
        {children}
      </button>
      <UrgencyModal open={urgencyModalOpen} onClose={() => setUrgencyModalOpen(false)} tradeName={tradeName} />
    </>
  );
}
