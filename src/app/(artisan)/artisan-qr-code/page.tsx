"use client";

import { useState } from "react";
import { Save, Share2, Check } from "lucide-react";

const suggestions = [
  "Véhicule",
  "Cartes de visite",
  "Devis et factures",
  "Signature email",
  "Réseaux sociaux",
];

export default function ArtisanQRCodePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Generate a simple QR-like grid pattern
  const qrPattern = Array.from({ length: 100 }, (_, i) => {
    const row = Math.floor(i / 10);
    const col = i % 10;
    const isCorner = (row < 3 && col < 3) || (row < 3 && col > 6) || (row > 6 && col < 3);
    const isRandom = (i * 7 + 13) % 3 !== 0;
    return isCorner || isRandom;
  });

  return (
    <div className="max-w-md mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6 text-center">Mon QR Code</h1>

      {/* QR Code card */}
      <div className="flex flex-col items-center">
        {/* QR visual */}
        <div className="w-[200px] h-[200px] bg-white p-4 rounded-2xl border border-border shadow-sm mb-5">
          <div className="w-full h-full grid grid-cols-10 gap-[2px]">
            {qrPattern.map((filled, i) => (
              <div
                key={i}
                className={`rounded-[1px] ${filled ? "bg-navy" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>

        {/* Identity */}
        <div className="font-heading font-bold text-xl text-navy">Jean-Michel Petit</div>
        <div className="text-grayText text-sm mt-1">Plombier-Chauffagiste</div>
        <div className="bg-surface text-forest font-mono text-xs font-semibold px-3 py-1.5 rounded-full mt-3">
          Certifié Nova #2847
        </div>

        {/* URL */}
        <div className="font-mono text-sm text-grayText mt-3">
          nova.fr/p/jean-michel-petit-2847
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6 w-full">
          <button
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[14px] font-bold text-sm transition-transform hover:-translate-y-0.5 ${
              saved
                ? "bg-success text-white"
                : "bg-deepForest text-white"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Enregistré ✓
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[14px] font-bold text-sm bg-white border border-border text-navy hover:-translate-y-0.5 transition-transform">
            <Share2 className="w-4 h-4" />
            Partager
          </button>
        </div>

        {/* Usage suggestions */}
        <div className="mt-8 w-full">
          <h2 className="font-heading text-sm font-bold text-navy mb-3 text-center">Où l&apos;utiliser</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <span
                key={s}
                className="bg-surface text-forest text-xs rounded-full px-3 py-1.5"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
