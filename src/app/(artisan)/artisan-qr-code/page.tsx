"use client";

import { useState } from "react";
import { Save, Share2, CheckCircle, Smartphone, Car, Mail, Globe, CreditCard, Users } from "lucide-react";

const suggestions = [
  { label: "Véhicule", description: "Collez votre QR code sur votre véhicule professionnel", icon: Car },
  { label: "Cartes de visite", description: "Ajoutez-le au dos de vos cartes pour un accès rapide", icon: CreditCard },
  { label: "Devis et factures", description: "Intégrez-le dans vos documents commerciaux", icon: Mail },
  { label: "Signature email", description: "Insérez-le dans votre signature électronique", icon: Globe },
  { label: "Réseaux sociaux", description: "Partagez-le sur vos profils professionnels", icon: Users },
  { label: "Smartphone", description: "Enregistrez-le dans votre galerie pour le montrer à vos clients", icon: Smartphone },
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
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[28px] font-extrabold text-navy mb-8 text-center">Mon QR Code</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column — QR Code card */}
        <div className="bg-white rounded-[5px] border border-border shadow-sm p-8 flex flex-col items-center">
          {/* QR visual */}
          <div className="w-[240px] h-[240px] bg-white p-5 rounded-[5px] border border-border shadow-sm mb-6">
            <div className="w-full h-full grid grid-cols-10 gap-[2px]">
              {qrPattern.map((filled, i) => (
                <div
                  key={i}
                  className={`rounded-[5px] ${filled ? "bg-navy" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>

          {/* Identity */}
          <div className="font-heading font-bold text-[22px] text-navy">Jean-Michel Petit</div>
          <div className="text-grayText text-[15px] mt-1">Plombier-Chauffagiste</div>
          <div className="bg-surface text-forest font-mono text-[13px] font-semibold px-5 py-2 rounded-[5px] mt-4">
            Certifié Nova #2847
          </div>

          {/* URL */}
          <div className="font-mono text-[15px] text-grayText mt-4">
            nova.fr/p/jean-michel-petit-2847
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-8 w-full max-w-sm">
            <button
              onClick={handleSave}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-[5px] font-bold text-sm transition-transform hover:-translate-y-0.5 ${
                saved
                  ? "bg-success text-white"
                  : "bg-deepForest text-white"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Enregistré
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enregistrer
                </>
              )}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-[5px] font-bold text-sm bg-white border border-border text-navy hover:-translate-y-0.5 transition-transform">
              <Share2 className="w-5 h-5" />
              Partager
            </button>
          </div>
        </div>

        {/* Right column — Usage tips grid */}
        <div>
          <h2 className="font-heading text-[18px] font-bold text-navy mb-5">Où utiliser votre QR code</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-[5px] border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <div className="font-heading text-[15px] font-semibold text-navy">{s.label}</div>
                  <p className="text-[13px] text-grayText leading-relaxed mt-1">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats card */}
          <div className="bg-surface rounded-[5px] border border-border p-5 mt-5">
            <h3 className="font-heading text-[15px] font-bold text-navy mb-3">Statistiques de scan</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="font-mono text-[22px] font-bold text-forest">47</div>
                <div className="text-[13px] text-grayText">Ce mois</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[22px] font-bold text-forest">183</div>
                <div className="text-[13px] text-grayText">Total</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[22px] font-bold text-forest">12</div>
                <div className="text-[13px] text-grayText">Contacts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
