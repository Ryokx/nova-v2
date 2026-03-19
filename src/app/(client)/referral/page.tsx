"use client";

import { useState } from "react";
import { Gift, Copy, Check, MessageCircle, Mail, Link2, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const code = "NOVA-SL25";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareButtons = [
    { label: "WhatsApp", icon: MessageCircle, color: "bg-[#25D366] text-white" },
    { label: "SMS", icon: Smartphone, color: "bg-navy/80 text-white" },
    { label: "Email", icon: Mail, color: "bg-forest text-white" },
    { label: "Lien", icon: Link2, color: "bg-grayText text-white" },
  ];

  return (
    <div className="max-w-[500px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-1">Parrainage</h1>
      <p className="text-sm text-grayText mb-6">Invitez vos proches et gagnez des récompenses</p>

      {/* Bonus banner */}
      <Card className="bg-gradient-to-br from-deepForest to-forest text-white mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading text-lg font-bold">Gagnez 20€ par parrainage</div>
            <p className="text-xs text-white/70">Pour chaque ami inscrit qui réalise sa première mission</p>
          </div>
        </div>
      </Card>

      {/* Code */}
      <Card className="mb-5">
        <div className="text-xs text-grayText text-center mb-2">Votre code de parrainage</div>
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-xl font-bold text-forest">{code}</span>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
              copied ? "bg-success/10 text-success" : "bg-forest/10 text-forest hover:bg-forest/20"
            }`}
          >
            {copied ? <><Check className="w-3 h-3 inline mr-1" />Copié</> : <><Copy className="w-3 h-3 inline mr-1" />Copier</>}
          </button>
        </div>
      </Card>

      {/* Share buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {shareButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl ${btn.color} hover:opacity-90 transition-opacity`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <Card>
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Vos statistiques</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { value: "3", label: "Invitations" },
            { value: "1", label: "Inscrit" },
            { value: "20€", label: "Crédit gagné" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono text-xl font-bold text-forest">{s.value}</div>
              <div className="text-[11px] text-grayText">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
