"use client";

import { useState } from "react";
import { MessageCircle, Mail, Link2, Smartphone } from "lucide-react";

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const code = "NOVA-SL25";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareButtons = [
    { label: "WhatsApp", icon: MessageCircle, color: "bg-[#25D366]" },
    { label: "SMS", icon: Smartphone, color: "bg-gray-500" },
    { label: "Email", icon: Mail, color: "bg-forest" },
    { label: "Lien", icon: Link2, color: "bg-gray-400" },
  ];

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">
        Inviter des proches
      </h1>

      {/* Dark green gradient banner */}
      <div className="bg-gradient-to-br from-deepForest to-forest rounded-[20px] px-6 py-8 text-center mb-6">
        <div className="text-4xl mb-3">🎁</div>
        <div className="font-heading text-[22px] font-extrabold text-white mb-2">
          Gagnez 20€ par parrainage
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          Invitez un ami. Quand il réalise sa première intervention, vous recevez chacun 20€.
        </p>
      </div>

      {/* Referral code card */}
      <div className="bg-white border border-border shadow-sm rounded-[20px] p-5 mb-5">
        <div className="text-sm font-bold text-navy mb-2.5">Votre code</div>
        <div className="flex gap-2">
          <div className="flex-1 bg-surface rounded-xl px-4 py-3.5 font-mono text-lg font-bold text-forest tracking-wider">
            {code}
          </div>
          <button
            onClick={handleCopy}
            className={`px-5 py-3.5 rounded-xl text-[13px] font-semibold text-white transition-all ${
              copied ? "bg-success" : "bg-forest hover:bg-forest/90"
            }`}
          >
            {copied ? "Copié ✓" : "Copier"}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-4 gap-2.5 mb-6">
        {shareButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              className={`flex flex-col items-center gap-1 py-4 px-2 rounded-[14px] ${btn.color} text-white hover:opacity-90 transition-opacity cursor-pointer`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-semibold">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="bg-white border border-border shadow-sm rounded-[20px] p-5">
        <div className="text-xs text-grayText mb-2.5">Vos parrainages</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "3", label: "Invitations" },
            { value: "1", label: "Inscrit" },
            { value: "20€", label: "Crédit gagné" },
          ].map((s) => (
            <div key={s.label} className="text-center py-3 rounded-xl bg-surface">
              <div className="font-mono text-[22px] font-bold text-forest">{s.value}</div>
              <div className="text-[10px] text-grayText mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
