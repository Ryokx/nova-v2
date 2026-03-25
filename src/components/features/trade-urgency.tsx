"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap, Clock, Shield, Lock, Star, ArrowRight, Phone,
  MapPin, BadgeCheck, ChevronRight, Check, CheckCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UrgencyModal } from "@/components/features/urgency-modal";
import type { TradeConfig } from "@/lib/trades";

interface TradeUrgencyProps {
  trade: TradeConfig;
}

const mockUrgentArtisans = [
  { name: "Karim B.", initials: "KB", rating: 5.0, reviews: 83, time: "20 min", city: "Paris 9e", distance: "1.8 km", certif: ["Décennale", "RGE"] },
  { name: "Jean-Michel P.", initials: "JM", rating: 4.9, reviews: 127, time: "30 min", city: "Paris 11e", distance: "2.4 km", certif: ["Décennale", "Qualibat"] },
  { name: "Fatima H.", initials: "FH", rating: 4.8, reviews: 91, time: "35 min", city: "Paris 15e", distance: "3.1 km", certif: ["Décennale"] },
];

export function TradeUrgency({ trade }: TradeUrgencyProps) {
  const [urgencyModalOpen, setUrgencyModalOpen] = useState(false);

  const categoryMap: Record<string, string> = {
    serrurier: "Serrurier", plombier: "Plombier", electricien: "Électricien",
    chauffagiste: "Chauffagiste", peintre: "Peintre", menuisier: "Menuisier",
    carreleur: "Carreleur", macon: "Maçon",
  };
  const searchLink = `/artisans?category=${encodeURIComponent(categoryMap[trade.slug] ?? "all")}&urgency=true`;

  return (
    <div className="min-h-screen bg-bgPage">

      {/* ━━━ HERO + ESCROW — Two-column layout ━━━ */}
      <section
        className="relative overflow-hidden px-5 md:px-10 pt-6 pb-10"
        style={{ background: "linear-gradient(160deg, #FFFBFB 0%, #FEF2F2 30%, #F5FAF7 100%)" }}
      >
        <div className="max-w-[700px] mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px] text-navy/35 mb-4">
            <Link href="/" className="hover:text-navy transition-colors">Accueil</Link>
            <span>/</span>
            <Link href={`/${trade.slug}`} className="hover:text-navy transition-colors">{trade.name}</Link>
            <span>/</span>
            <span className="text-red font-semibold">Urgence</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5 justify-center">
            <div className="inline-flex items-center gap-1.5 bg-red/[0.07] border border-red/12 rounded-[5px] px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-red" />
              <span className="text-[12px] font-bold text-red">24h/24</span>
              <div className="w-px h-3 bg-red/15" />
              <Clock className="w-3 h-3 text-red" />
              <span className="text-[12px] font-bold text-red">&lt; 2h</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-forest/[0.05] border border-forest/12 rounded-[5px] px-3 py-1.5">
              <Lock className="w-3.5 h-3.5 text-forest" />
              <span className="text-[12px] font-bold text-forest">Paiement séquestre</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-[26px] md:text-[36px] font-extrabold text-navy leading-[1.1] tracking-[-0.5px] mb-3" style={{ textWrap: "balance" as never }}>
            {trade.urgencyHeadline}
          </h1>
          <p className="text-[15px] text-navy/50 leading-[1.7] max-w-[500px] mb-5">
            {trade.urgencyDescription}
          </p>

          {/* Urgency examples */}
          <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
            {trade.urgencyExamples.map((ex) => (
              <span key={ex} className="px-3 py-1.5 rounded-[5px] bg-white border border-border text-[12px] font-medium text-navy/70">
                {ex}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setUrgencyModalOpen(true)}
            className="inline-flex items-center px-7 py-3.5 rounded-[5px] bg-red text-white text-[14px] font-bold shadow-[0_6px_20px_rgba(232,48,42,0.2)] hover:bg-red/90 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            Intervention {trade.name.toLowerCase()} immédiate
          </button>

          {/* Reassurance */}
          <div className="flex items-center gap-3.5 mt-4 flex-wrap justify-center">
            {["Artisan certifié", "Devis sur place", "Remboursé si non conforme"].map((t) => (
              <div key={t} className="flex items-center gap-1 text-[11px] text-grayText">
                <Check className="w-3 h-3 text-success" />
                {t}
              </div>
            ))}
          </div>

          {/* Escrow process — progress bar */}
          <div className="w-full mt-10 pt-8 border-t border-border/40">
            <div className="flex items-center gap-1.5 justify-center mb-6">
              <Shield className="w-4 h-4 text-forest" />
              <span className="text-[12px] font-bold text-navy">Comment votre argent est protégé</span>
            </div>

            {(() => {
              const steps = [
                { icon: CreditCard, title: "Paiement", desc: "Bloqué en séquestre" },
                { icon: Lock, title: "Intervention", desc: "Argent verrouillé" },
                { icon: Shield, title: "Vérification", desc: "Contrôlé par Nova" },
                { icon: CheckCircle, title: "Validation", desc: "Libéré ou remboursé" },
              ];
              return (
                <div className="relative max-w-[560px] mx-auto">
                  {/* Progress bar line */}
                  <div className="absolute top-[14px] left-[28px] right-[28px] h-[3px] rounded-full bg-border" />
                  <div className="absolute top-[14px] left-[28px] right-[28px] h-[3px] rounded-full bg-gradient-to-r from-forest via-forest/60 to-success" />

                  <div className="relative flex justify-between">
                    {steps.map((s, i) => {
                      const StepIcon = s.icon;
                      return (
                        <div key={i} className="flex flex-col items-center w-[80px]">
                          <div className="w-[30px] h-[30px] rounded-full bg-white border-[3px] border-forest flex items-center justify-center shadow-[0_0_0_3px_rgba(27,107,78,0.1)]">
                            <StepIcon className="w-3.5 h-3.5 text-forest" />
                          </div>
                          <p className="text-[11px] font-bold text-navy mt-2">{s.title}</p>
                          <p className="text-[10px] text-grayText mt-0.5 leading-snug">{s.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <p className="mt-5 text-[10px] text-forest/50">
              <Lock className="w-2.5 h-2.5 inline mr-0.5 -mt-px" />
              Non conforme = remboursé sous 48h
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ AVAILABLE ARTISANS ━━━ */}
      <section className="px-5 md:px-10 py-10 bg-white border-t border-border/40">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-[18px] md:text-[22px] font-extrabold text-navy">
                {trade.namePlural} disponibles maintenant
              </h2>
              <p className="text-[12px] text-grayText mt-0.5">Certifiés, assurés, prêts à intervenir</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] bg-success/[0.08] text-success text-[11px] font-bold shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              En ligne
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mockUrgentArtisans.map((a) => (
              <button
                key={a.name}
                onClick={() => setUrgencyModalOpen(true)}
                className="group bg-white border border-border rounded-[5px] p-4 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(10,64,48,0.05)] hover:border-forest/20 transition-all duration-300 text-left cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-deepForest to-forest flex items-center justify-center shrink-0">
                    <span className="text-white font-heading font-bold text-[11px]">{a.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-bold text-[13px] text-navy">{a.name}</h3>
                      <BadgeCheck className="w-3.5 h-3.5 text-forest shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="w-3 h-3 fill-gold text-gold" />
                      <span className="text-[11px] font-bold text-navy">{a.rating}</span>
                      <span className="text-[11px] text-grayText">({a.reviews})</span>
                      <span className="text-grayText/30">·</span>
                      <MapPin className="w-2.5 h-2.5 text-grayText" />
                      <span className="text-[11px] text-grayText">{a.city}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/60">
                  <div className="flex gap-1">
                    {a.certif.map((c) => (
                      <span key={c} className="px-1.5 py-0.5 rounded bg-forest/[0.06] text-[9px] font-semibold text-forest">{c}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-red/[0.06]">
                    <Clock className="w-3 h-3 text-red" />
                    <span className="text-[11px] font-bold text-red">{a.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href={searchLink}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-forest hover:underline cursor-pointer"
            >
              Voir tous les {trade.namePlural.toLowerCase()}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ CTA FINAL ━━━ */}
      <section className="px-5 md:px-10 py-10 bg-gradient-to-br from-deepForest to-forest relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-50" />

        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-[12px] font-bold text-gold">Intervention en moins de 2h</span>
            </div>
            <h2 className="font-heading text-[22px] md:text-[28px] font-extrabold text-white">
              Besoin d&apos;un {trade.name.toLowerCase()} maintenant ?
            </h2>
            <div className="flex items-center gap-3 mt-2">
              {["Certifié", "Séquestre", "Devis sur place"].map((t) => (
                <span key={t} className="text-[11px] text-white/40">{t}</span>
              ))}
              <span className="text-white/20">·</span>
              <Phone className="w-3 h-3 text-white/25" />
              <span className="text-[11px] text-white/35 font-bold">01 86 65 00 00</span>
            </div>
          </div>

          <button
            onClick={() => setUrgencyModalOpen(true)}
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-[5px] bg-white text-deepForest text-[14px] font-bold shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:scale-[0.97] transition-all cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4 text-red" />
            Intervention immédiate
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ━━━ Cross-link other urgency trades ━━━ */}
      <section className="px-5 md:px-10 py-8 bg-white border-t border-border/40">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[12px] text-grayText mb-3">Autres urgences 24h/24</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { slug: "serrurier", label: "Serrurier" },
              { slug: "plombier", label: "Plombier" },
              { slug: "electricien", label: "Électricien" },
              { slug: "chauffagiste", label: "Chauffagiste" },
              { slug: "macon", label: "Maçon" },
            ]
              .filter((s) => s.slug !== trade.slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}-urgence`}
                  className="px-3.5 py-2 rounded-[5px] bg-bgPage border border-border text-[12px] font-semibold text-navy hover:border-forest/30 hover:bg-surface transition-all cursor-pointer"
                >
                  {s.label} urgence
                </Link>
              ))}
          </div>
        </div>
      </section>

      <UrgencyModal open={urgencyModalOpen} onClose={() => setUrgencyModalOpen(false)} />
    </div>
  );
}
