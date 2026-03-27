"use client";

/**
 * Composant AuthGateModal — Modale qui bloque l'accès aux actions protégées.
 * Affichée quand un utilisateur non connecté tente de réserver, contacter, ou
 * demander une urgence. Propose de se connecter ou créer un compte.
 */

import { X, LogIn, UserPlus, Shield } from "lucide-react";
import Link from "next/link";

interface AuthGateModalProps {
  /** Contrôle l'ouverture de la modale */
  open: boolean;
  /** Fonction pour fermer la modale */
  onClose: () => void;
  /** URL de redirection après connexion/inscription */
  callbackUrl: string;
  /** Type d'action qui a déclenché la modale (adapte le texte affiché) */
  action?: "booking" | "urgence" | "contact";
}

/** Textes adaptés à chaque type d'action */
const actionLabels: Record<string, { title: string; desc: string }> = {
  booking: {
    title: "Prenez rendez-vous",
    desc: "Connectez-vous ou créez un compte gratuit pour réserver cet artisan.",
  },
  urgence: {
    title: "Intervention urgente",
    desc: "Connectez-vous ou créez un compte gratuit pour demander une intervention d'urgence.",
  },
  contact: {
    title: "Contactez cet artisan",
    desc: "Connectez-vous ou créez un compte gratuit pour contacter cet artisan.",
  },
};

export function AuthGateModal({ open, onClose, callbackUrl, action = "contact" }: AuthGateModalProps) {
  if (!open) return null;

  const { title, desc } = (actionLabels[action] ?? actionLabels.contact)!;
  const encodedCallback = encodeURIComponent(callbackUrl);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Fond semi-transparent cliquable pour fermer */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Contenu de la modale */}
      <div className="relative bg-white rounded-[5px] shadow-[0_20px_60px_rgba(10,22,40,0.2)] w-full max-w-[420px] overflow-hidden animate-pageIn">
        {/* Barre d'accent colorée en haut */}
        <div className="h-1.5 bg-gradient-to-r from-deepForest via-forest to-sage" />

        <div className="p-7">
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
          >
            <X className="w-4 h-4 text-grayText" />
          </button>

          {/* Icône bouclier */}
          <div className="w-14 h-14 rounded-[5px] bg-forest/[0.08] flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-forest" />
          </div>

          {/* Titre et description */}
          <h2 className="font-heading text-[22px] font-extrabold text-navy text-center mb-2">
            {title}
          </h2>
          <p className="text-sm text-grayText text-center leading-relaxed mb-7">
            {desc}
          </p>

          {/* Boutons d'action : inscription et connexion */}
          <div className="flex flex-col gap-3">
            <Link
              href={`/signup?callbackUrl=${encodedCallback}`}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-[5px] bg-gradient-to-br from-deepForest to-forest text-white font-bold text-[15px] shadow-[0_6px_20px_rgba(10,64,48,0.25)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(10,64,48,0.35)] transition-all"
            >
              <UserPlus className="w-4.5 h-4.5" />
              Créer un compte gratuit
            </Link>

            <Link
              href={`/login?callbackUrl=${encodedCallback}`}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-[5px] bg-white border-2 border-border text-navy font-bold text-[15px] hover:-translate-y-0.5 hover:border-forest/40 transition-all"
            >
              <LogIn className="w-4.5 h-4.5" />
              J&apos;ai déjà un compte
            </Link>
          </div>

          {/* Badges de confiance */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-border/60">
            {["Inscription gratuite", "Sans engagement", "Données protégées"].map((t) => (
              <span key={t} className="text-[11px] text-grayText font-medium">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
