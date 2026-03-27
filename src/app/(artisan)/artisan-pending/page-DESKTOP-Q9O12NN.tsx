/**
 * Page d'attente de validation artisan.
 * Affichée tant que les documents de l'artisan n'ont pas été vérifiés par l'équipe Nova.
 * Montre un stepper 3 étapes (déposés → vérification → visible) et un message d'info.
 */
"use client";

import Link from "next/link";
import { Clock, ShieldCheck, Eye, EyeOff, ArrowRight, FileCheck } from "lucide-react";

/* Étapes de validation avec état (terminée, en cours, à venir) */
const steps = [
  { icon: FileCheck, label: "Documents déposés", done: true },
  { icon: ShieldCheck, label: "Vérification en cours", done: false, active: true },
  { icon: Eye, label: "Profil visible", done: false },
];

export default function ArtisanPendingPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[600px] text-center">
        {/* Icon */}
        <div className="w-24 h-24 rounded-[5px] bg-gold/10 flex items-center justify-center mx-auto mb-8">
          <Clock className="w-12 h-12 text-gold" />
        </div>

        {/* Title */}
        <h1 className="font-heading text-[28px] font-extrabold text-navy mb-3">
          Inscription en cours de validation
        </h1>
        <p className="text-[15px] text-grayText leading-relaxed max-w-[460px] mx-auto mb-10">
          Notre équipe vérifie vos documents. Vous recevrez un email de confirmation
          sous 24 à 48h. En attendant, vous pouvez naviguer sur votre compte.
        </p>

        {/* Progress steps */}
        <div className="bg-white rounded-[5px] border border-border shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-0 flex-1">
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      s.done
                        ? "bg-forest text-white"
                        : s.active
                          ? "bg-gold/15 text-gold border-2 border-gold"
                          : "bg-surface text-grayText"
                    }`}
                  >
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[13px] font-semibold leading-tight ${
                      s.done ? "text-forest" : s.active ? "text-gold" : "text-grayText"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-10 shrink-0 -mt-6 ${
                      s.done ? "bg-forest" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-gold/5 border border-gold/20 rounded-[5px] p-5 mb-8 flex items-start gap-4 text-left">
          <EyeOff className="w-6 h-6 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-[15px] font-semibold text-navy mb-1">Compte en attente de validation</p>
            <p className="text-[13px] text-grayText leading-relaxed">
              Votre profil est invisible aux yeux des particuliers tant que vos documents
              n&apos;ont pas été validés par notre équipe.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/artisan-dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-deepForest text-white font-heading font-bold text-sm hover:-translate-y-0.5 transition-all"
        >
          Accéder à mon espace
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
