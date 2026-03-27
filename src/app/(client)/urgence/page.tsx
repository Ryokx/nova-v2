/**
 * Page Urgence 24h/24.
 * Première vue : sélection du domaine d'intervention (plomberie, électricité, etc.).
 * Deuxième vue : liste des artisans disponibles avec temps d'arrivée estimé.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Données                                                            */
/* ------------------------------------------------------------------ */

/** Catégories d'urgence disponibles */
const categories = [
  { id: "plomberie", label: "Plomberie" },
  { id: "electricite", label: "Électricité" },
  { id: "serrurerie", label: "Serrurerie" },
  { id: "chauffage", label: "Chauffage" },
  { id: "autre", label: "Autre domaine" },
];

/** Artisans disponibles en urgence (mock) */
const urgentArtisans = [
  { name: "Karim B.", initials: "KB", time: "15 min" },
  { name: "Jean-Michel P.", initials: "JM", time: "25 min" },
  { name: "Fatima H.", initials: "FH", time: "40 min" },
];

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function UrgencePage() {
  /** Catégorie sélectionnée (null = écran de sélection) */
  const [cat, setCat] = useState<string | null>(null);

  /* ================================================================ */
  /*  Vue 1 : Sélection de la catégorie                                */
  /* ================================================================ */
  if (!cat) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <h1 className="font-heading text-[26px] font-extrabold text-navy mb-2">
          Urgence 24h/24
        </h1>
        <p className="text-sm text-grayText mb-6">
          Sélectionnez le domaine de l&apos;intervention
        </p>

        {/* Bandeau rouge d'urgence */}
        <div className="bg-gradient-to-r from-red to-red/80 rounded-2xl p-5 mb-6 text-center">
          <div className="text-base font-bold text-white flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Intervention en moins de 2h
          </div>
          <div className="text-[13px] text-white/85 mt-1">
            Devis gratuit et immédiat
          </div>
        </div>

        {/* Liste des catégories */}
        <div className="flex flex-col gap-2.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className="flex items-center justify-between bg-white border border-border rounded-[5px] shadow-sm p-4 hover:bg-surface hover:border-l-4 hover:border-l-forest transition-all"
            >
              <span className="text-base font-bold text-navy">{c.label}</span>
              <ChevronRight className="w-4 h-4 text-grayText" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Vue 2 : Artisans disponibles                                     */
  /* ================================================================ */
  return (
    <div className="max-w-[700px] mx-auto px-5 py-8">

      {/* Bouton retour à la sélection */}
      <button
        onClick={() => setCat(null)}
        className="flex items-center gap-1.5 text-sm text-grayText font-medium mb-5 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-2xl font-extrabold text-navy mb-5">
        Artisans disponibles
      </h1>

      {/* Cartes artisans */}
      <div className="flex flex-col gap-3">
        {urgentArtisans.map((a) => (
          <div
            key={a.name}
            className="bg-white border border-border shadow-sm rounded-[5px] p-4"
          >
            <div className="flex items-center gap-3.5 mb-3.5">
              {/* Avatar initiales */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-surface to-border flex items-center justify-center text-base font-bold text-forest">
                {a.initials}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-navy">{a.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-red">
                    Dispo en {a.time}
                  </span>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-red hover:bg-red/90 text-[13px] rounded-[5px]"
                size="sm"
              >
                Intervention immédiate
              </Button>
              <Link
                href="/artisans"
                className="px-4 py-2.5 rounded-[5px] bg-surface text-navy border border-border text-[13px] font-semibold hover:bg-border transition-colors text-center"
              >
                Profil
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
