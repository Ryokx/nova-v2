"use client";

import { X, LogIn, UserPlus, Shield } from "lucide-react";
import Link from "next/link";

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
  /** URL to redirect to after login/signup */
  callbackUrl: string;
  /** What action triggered the gate */
  action?: "booking" | "urgence" | "contact";
}

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

  const { title, desc } = actionLabels[action] ?? actionLabels.contact;
  const encodedCallback = encodeURIComponent(callbackUrl);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[5px] shadow-[0_20px_60px_rgba(10,22,40,0.2)] w-full max-w-[420px] overflow-hidden animate-pageIn">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-deepForest via-forest to-sage" />

        <div className="p-7">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
          >
            <X className="w-4 h-4 text-grayText" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 rounded-[5px] bg-forest/[0.08] flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-forest" />
          </div>

          {/* Title */}
          <h2 className="font-heading text-[22px] font-extrabold text-navy text-center mb-2">
            {title}
          </h2>
          <p className="text-sm text-grayText text-center leading-relaxed mb-7">
            {desc}
          </p>

          {/* CTA Buttons */}
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

          {/* Trust badges */}
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
