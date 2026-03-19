"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Download, Share2, Shield, Truck, CreditCard, FileText, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const useCases = [
  { icon: <Truck className="w-4 h-4" />, label: "Véhicule" },
  { icon: <CreditCard className="w-4 h-4" />, label: "Cartes de visite" },
  { icon: <FileText className="w-4 h-4" />, label: "Devis et factures" },
  { icon: <Mail className="w-4 h-4" />, label: "Signature email" },
  { icon: <Smartphone className="w-4 h-4" />, label: "Réseaux sociaux" },
];

export default function ArtisanQRCodePage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const name = session?.user?.name ?? "Artisan";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Generate a simple QR-like grid pattern
  const qrPattern = Array.from({ length: 100 }, (_, i) => {
    const row = Math.floor(i / 10);
    const col = i % 10;
    // Corner patterns + pseudo-random interior
    const isCorner = (row < 3 && col < 3) || (row < 3 && col > 6) || (row > 6 && col < 3);
    const isRandom = (i * 7 + 13) % 3 !== 0;
    return isCorner || isRandom;
  });

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-5">Mon QR code</h1>

      {/* QR Code display */}
      <Card className="text-center mb-5">
        <div className="w-[200px] h-[200px] mx-auto rounded-lg bg-surface p-3 mb-4">
          <div className="w-full h-full grid grid-cols-10 gap-[2px]">
            {qrPattern.map((filled, i) => (
              <div
                key={i}
                className={`rounded-[1px] ${filled ? "bg-navy" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>

        <div className="font-heading text-lg font-extrabold text-navy">{name}</div>
        <div className="text-[13px] text-grayText">Plombier-Chauffagiste</div>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Shield className="w-3.5 h-3.5 text-forest" />
          <span className="text-xs font-semibold text-forest">Certifié Nova #2847</span>
        </div>
        <div className="font-mono text-[11px] text-grayText mt-2">
          nova.fr/p/{name.toLowerCase().replace(/\s+/g, "-")}-2847
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant={saved ? "secondary" : "primary"}
            size="sm"
            className="flex-1"
            onClick={handleSave}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            {saved ? "Enregistré ✓" : "Enregistrer"}
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Share2 className="w-3.5 h-3.5 mr-1" /> Partager
          </Button>
        </div>
      </Card>

      {/* Usage */}
      <Card>
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Où l&apos;utiliser</h2>
        <div className="divide-y divide-border">
          {useCases.map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3 text-sm text-navy">
              <div className="text-forest">{item.icon}</div>
              {item.label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
