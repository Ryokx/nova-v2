"use client";

/**
 * TradeLanding — Page d'atterrissage pour chaque corps de métier (plombier, serrurier, etc.)
 *
 * Affiche les sections principales :
 * - Hero avec badges de confiance et CTA
 * - Comparaison "Sans Nova" vs "Avec Nova"
 * - Liste des services proposés
 * - Fonctionnement en 4 étapes
 * - Avantages Nova
 * - FAQ avec accordéon
 * - CTA final avec statistiques
 * - Liens vers les autres métiers (maillage interne SEO)
 */

import { useState } from "react";
import Link from "next/link";
import {
  Shield, Lock, Star, ArrowRight, ChevronDown, Clock,
  BadgeCheck, Search, CreditCard, ClipboardList, Check,
  Zap, AlertTriangle, CheckCircle, Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TradeConfig } from "@/lib/trades";

/* ━━━ Types ━━━ */
interface TradeLandingProps {
  trade: TradeConfig;
}

/* ━━━ Données statiques : avatars pour la preuve sociale ━━━ */
const socialProof = [
  { ini: "SL", color: "hsl(150,30%,87%)" },
  { ini: "PM", color: "hsl(175,30%,87%)" },
  { ini: "CD", color: "hsl(200,30%,87%)" },
  { ini: "AM", color: "hsl(225,30%,87%)" },
];

/* ━━━ Correspondance slug → nom affiché pour les catégories ━━━ */
const categoryMap: Record<string, string> = {
  serrurier: "Serrurier",
  plombier: "Plombier",
  electricien: "Électricien",
  chauffagiste: "Chauffagiste",
  peintre: "Peintre",
  menuisier: "Menuisier",
  carreleur: "Carreleur",
  macon: "Maçon",
};

export function TradeLanding({ trade }: TradeLandingProps) {
  /* État pour l'accordéon FAQ : index de la question ouverte (ou null) */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* Icône du métier (composant React dynamique) */
  const Icon = trade.icon;

  /* Liens de navigation construits à partir du slug du métier */
  const categoryParam = categoryMap[trade.slug] ?? "all";
  const searchLink = `/artisans?category=${encodeURIComponent(categoryParam)}`;
  const urgencyLink = `/${trade.slugUrgency}`;

  /* ━━━ Étapes "Comment ça marche" ━━━ */
  const steps = [
    { num: "01", title: "Décrivez votre besoin", desc: `Recherchez un ${trade.name.toLowerCase()} certifié disponible dans votre zone.`, icon: Search },
    { num: "02", title: "Devis sur place", desc: "L'artisan se déplace et fait le devis devant vous. Jamais de prix par téléphone.", icon: ClipboardList },
    { num: "03", title: "Paiement sécurisé", desc: "Vous payez en ligne. L'argent est bloqué en séquestre — personne n'y touche.", icon: Lock },
    { num: "04", title: "Validation & libération", desc: "L'artisan intervient. Vous validez. Seulement alors, le paiement est libéré.", icon: CheckCircle },
  ];

  /* ━━━ Badges de confiance affichés dans le hero ━━━ */
  const trustBadges = [
    { icon: Shield, text: "SIRET + décennale vérifiés" },
    { icon: Lock, text: "Paiement séquestre" },
    { icon: BadgeCheck, text: "Avis 100% vérifiés" },
  ];

  /* ━━━ Étapes du schéma séquestre (colonne droite du hero) ━━━ */
  const escrowSteps = [
    { num: "1", icon: CreditCard, title: "Vous payez", desc: "L'argent est bloqué en séquestre sécurisé.", highlight: "L'artisan ne reçoit rien", color: "#0A4030" },
    { num: "2", icon: ClipboardList, title: "L'artisan intervient", desc: "Le travail est réalisé selon le devis signé.", highlight: "Argent toujours verrouillé", color: "#1B6B4E" },
    { num: "3", icon: Shield, title: "Nova vérifie", desc: "Le prix et le travail sont contrôlés par Nova.", highlight: "Avant tout déblocage", color: "#2D9B6E" },
    { num: "4", icon: CheckCircle, title: "Déblocage", desc: "Vous ou Nova libérez le paiement à l'artisan.", highlight: "Non conforme = remboursé", color: "#22C88A" },
  ];

  /* ━━━ Points négatifs "Sans Nova" ━━━ */
  const withoutNova = [
    "Prix annoncé par téléphone, gonflé sur place",
    "Aucune vérification : ni SIRET, ni décennale",
    "Paiement en liquide — aucun recours",
    "Avis invérifiables, souvent faux",
    "En cas de litige, vous êtes seul",
    "Aucune garantie sur le travail",
  ];

  /* ━━━ Points positifs "Avec Nova" ━━━ */
  const withNova = [
    "Devis fait sur place, devant vous — pas de surprise",
    `${trade.name} vérifié : SIRET, décennale, identité`,
    "Paiement par carte, bloqué en séquestre",
    "Avis 100% liés à des missions réelles",
    "Nova arbitre en cas de litige (97% résolus)",
    "Remboursement si travail non conforme",
  ];

  /* ━━━ Avantages "Pourquoi Nova" ━━━ */
  const whyNova = [
    { icon: BadgeCheck, title: "Artisans certifiés", desc: `Chaque ${trade.name.toLowerCase()} est vérifié : SIRET actif, décennale valide, identité contrôlée par notre équipe.` },
    { icon: Lock, title: "Paiement séquestre", desc: "Votre argent est bloqué en sécurité. L'artisan n'est payé qu'après votre validation du travail." },
    { icon: ClipboardList, title: "Devis sur place uniquement", desc: "Jamais de prix par téléphone. Le devis est fait devant vous, sans surprise, sans pression." },
    { icon: Shield, title: "Protection litiges", desc: "En cas de problème, Nova arbitre avec les preuves (photos, devis signé). 97% résolus en faveur du client." },
    { icon: Star, title: "Avis 100% vérifiés", desc: "Chaque avis est lié à une mission réelle et un paiement vérifié via séquestre. 0 faux avis." },
    { icon: Clock, title: "Urgence 24h/24", desc: `${trade.namePlural} disponibles en urgence. Mêmes garanties de paiement sécurisé, même en pleine nuit.` },
  ];

  /* ━━━ Garanties affichées sous le schéma séquestre ━━━ */
  const escrowGuarantees = [
    { icon: Lock, text: "Argent bloqué jusqu'à validation" },
    { icon: Shield, text: "Prix et travail vérifiés par Nova" },
    { icon: CheckCircle, text: "Le client peut débloquer l'argent" },
  ];

  /* ━━━ Statistiques du CTA final ━━━ */
  const ctaStats = [
    { value: trade.avgResponseTime, label: "réponse" },
    { value: `${trade.avgRating}/5`, label: "note moyenne" },
    { value: trade.artisanCount, label: "certifiés" },
  ];

  /* ━━━ Liste des autres métiers pour le maillage interne ━━━ */
  const allTrades = ["serrurier", "plombier", "electricien", "chauffagiste", "peintre", "menuisier", "carreleur", "macon"];

  /** Convertit un slug en nom avec majuscule/accent */
  function formatTradeName(slug: string): string {
    if (slug === "electricien") return "Électricien";
    if (slug === "macon") return "Maçon";
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }

  /** Convertit le nom du métier en nom de domaine d'intervention (ex: "Plombier" → "plomberie") */
  function getInterventionDomain(): string {
    const name = trade.name.toLowerCase();
    const mapping: Record<string, string> = {
      "maçon": "maçonnerie",
      serrurier: "serrurerie",
      plombier: "plomberie",
      menuisier: "menuiserie",
    };
    if (mapping[name]) return mapping[name];
    return name.replace(/eur$/, "erie").replace(/ien$/, "icité");
  }

  return (
    <div className="min-h-screen bg-bgPage">

      {/* ══════════════════════════════════════════════
          SECTION HERO — Titre, badges, CTA, schéma séquestre
      ══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-5 md:px-10 pt-8 pb-14"
        style={{ background: "linear-gradient(160deg, #F5FAF7 0%, #E8F5EE 40%, #D4EBE0 100%)" }}
        data-navbar-dark
      >
        {/* Cercles décoratifs floutés en arrière-plan */}
        <div className="absolute -top-[120px] -right-[80px] w-[500px] h-[500px] rounded-full bg-forest/[0.06] blur-[100px]" />
        <div className="absolute -bottom-[100px] -left-[60px] w-[350px] h-[350px] rounded-full bg-gold/[0.05] blur-[80px]" />

        <div className="max-w-[1050px] mx-auto relative z-10">
          {/* Fil d'Ariane */}
          <div className="flex items-center gap-2 text-[13px] text-navy/40 mb-6">
            <Link href="/" className="hover:text-navy transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/artisans" className="hover:text-navy transition-colors">Artisans</Link>
            <span>/</span>
            <span className="text-navy font-semibold">{trade.name}</span>
          </div>

          {/* Disposition deux colonnes : texte à gauche, séquestre à droite */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* ── Colonne gauche : texte + CTA ── */}
            <div className="flex-1 min-w-0">
              {/* Badge "X artisans certifiés" + note moyenne */}
              <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-md border border-forest/10 rounded-[5px] px-4 py-2.5 mb-5">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[13px] font-bold text-deepForest">{trade.artisanCount} {trade.namePlural.toLowerCase()} certifiés</span>
                <span className="text-[11px] text-grayText">·</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-gold text-gold" />
                  <span className="text-[12px] font-bold text-navy">{trade.avgRating}/5</span>
                </div>
              </div>

              {/* Titre principal */}
              <h1 className="font-heading text-[30px] md:text-[42px] font-extrabold text-navy leading-[1.08] tracking-[-1.5px] mb-4" style={{ textWrap: "balance" as never }}>
                {trade.headline}
              </h1>
              <p className="text-[16px] text-navy/55 leading-[1.75] max-w-[480px] mb-6">
                {trade.heroDescription}
              </p>

              {/* Micro-badges de confiance */}
              <div className="flex gap-4 mb-7 flex-wrap">
                {trustBadges.map((b) => (
                  <div key={b.text} className="flex items-center gap-1.5 text-[12px] font-semibold text-deepForest/70">
                    <b.icon className="w-3.5 h-3.5 text-forest" />
                    {b.text}
                  </div>
                ))}
              </div>

              {/* Boutons d'action principaux */}
              <div className="flex gap-3 flex-wrap mb-5">
                <Link
                  href={searchLink}
                  className="group flex items-center gap-2.5 px-7 py-3.5 rounded-[5px] bg-gradient-to-br from-deepForest to-forest text-white text-[15px] font-bold shadow-[0_8px_24px_rgba(10,64,48,0.3)] hover:shadow-[0_12px_32px_rgba(10,64,48,0.4)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
                >
                  Trouver un {trade.name.toLowerCase()}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href={urgencyLink}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-[5px] bg-white/80 backdrop-blur-md text-navy border border-border/60 text-[15px] font-semibold hover:bg-white hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-red" />
                  Urgence 24/7
                </Link>
              </div>

              {/* Preuve sociale : avatars empilés + texte */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {socialProof.map((p, i) => (
                    <div
                      key={p.ini}
                      className="w-7 h-7 rounded-full border-[2px] border-bgPage flex items-center justify-center text-[8px] font-bold text-forest"
                      style={{ background: p.color, marginLeft: i > 0 ? -6 : 0, zIndex: 4 - i }}
                    >
                      {p.ini}
                    </div>
                  ))}
                </div>
                <p className="text-[12px] text-navy/50">
                  <span className="font-bold text-navy/70">Rejoignez-les</span> — Gratuit, sans engagement
                </p>
              </div>
            </div>

            {/* ── Colonne droite : schéma du paiement séquestre ── */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white/90 backdrop-blur-md border border-border rounded-[5px] p-5 shadow-sm">
                {/* En-tête de la carte séquestre */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-[4px] bg-deepForest flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-heading font-bold text-[13px] text-navy">Paiement par séquestre</span>
                </div>

                {/* 4 étapes verticales du séquestre */}
                <div className="space-y-0">
                  {escrowSteps.map((s, i) => {
                    const StepIcon = s.icon;
                    return (
                      <div key={s.num} className="relative flex gap-3 py-3">
                        {/* Ligne verticale entre les étapes */}
                        {i < 3 && (
                          <div className="absolute left-[13px] top-[42px] w-[2px] h-[calc(100%-30px)] bg-border" />
                        )}
                        <div className="relative z-10 w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0" style={{ background: s.color }}>
                          <StepIcon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-bold text-[13px] text-navy">{s.title}</h4>
                            <span className="font-mono text-[9px] font-bold text-forest/25">{s.num}</span>
                          </div>
                          <p className="text-[11px] text-grayText leading-snug mt-0.5">{s.desc}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold text-forest">{s.highlight}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Garanties en bas de la carte */}
                <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
                  {escrowGuarantees.map((g) => (
                    <div key={g.text} className="flex items-center gap-1.5 text-[11px] font-semibold text-navy/60">
                      <g.icon className="w-3 h-3 text-forest shrink-0" />
                      {g.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION COMPARAISON — "Sans Nova" vs "Avec Nova"
          Effet psychologique : aversion à la perte
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-16 bg-bgPage">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-[24px] md:text-[30px] font-extrabold text-navy mb-8 text-center">
            {trade.name} trouvé sur Google vs {trade.name} certifié Nova
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Carte "Sans Nova" — risques */}
            <div className="bg-white rounded-[5px] border border-red/15 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red/40 to-red/20" />
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-[5px] bg-red/[0.08] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red" />
                </div>
                <span className="font-heading font-extrabold text-[15px] text-navy">Sans Nova</span>
              </div>
              <div className="space-y-3.5">
                {withoutNova.map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <Ban className="w-4 h-4 text-red/50 shrink-0 mt-0.5" />
                    <span className="text-[13px] text-navy/60 leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte "Avec Nova" — avantages */}
            <div className="bg-white rounded-[5px] border border-forest/20 p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(10,64,48,0.06)]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-deepForest to-forest" />
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-[5px] bg-forest/[0.08] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-forest" />
                </div>
                <span className="font-heading font-extrabold text-[15px] text-navy">Avec Nova</span>
                <span className="ml-auto px-2 py-0.5 rounded-[5px] bg-forest/[0.08] text-[10px] font-bold text-forest">RECOMMANDÉ</span>
              </div>
              <div className="space-y-3.5">
                {withNova.map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <span className="text-[13px] text-navy leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION SERVICES — Grille des interventions proposées
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-16 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-[24px] md:text-[30px] font-extrabold text-navy mb-2">
            Nos interventions en {getInterventionDomain()}
          </h2>
          <p className="text-[15px] text-grayText mb-8">
            Chaque intervention est couverte par l&apos;assurance décennale et le paiement séquestre Nova.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trade.services.map((svc) => (
              <div
                key={svc.title}
                className="bg-bgPage border border-border rounded-[5px] p-5"
              >
                <div className="w-10 h-10 rounded-[5px] bg-forest/[0.08] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-heading font-bold text-[15px] text-navy mb-1">{svc.title}</h3>
                <p className="text-[13px] text-grayText leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>

          {/* Bouton sous la grille */}
          <div className="mt-8 text-center">
            <Link
              href={searchLink}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[5px] bg-gradient-to-br from-deepForest to-forest text-white text-[15px] font-bold shadow-[0_4px_16px_rgba(10,64,48,0.2)] hover:shadow-[0_8px_24px_rgba(10,64,48,0.3)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Trouver un {trade.name.toLowerCase()} certifié
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION "COMMENT ÇA MARCHE" — 4 étapes numérotées
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-16 bg-bgPage">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-[24px] md:text-[30px] font-extrabold text-navy mb-2 text-center">
            Comment ça marche
          </h2>
          <p className="text-[15px] text-grayText mb-10 text-center">
            4 étapes simples pour une intervention sereine et sécurisée.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div key={step.num} className="relative bg-white rounded-[5px] border border-border p-5 hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-deepForest to-forest flex items-center justify-center shrink-0">
                      <StepIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-mono text-[22px] font-bold text-forest/15">{step.num}</span>
                  </div>
                  <h3 className="font-heading font-bold text-[15px] text-navy mb-1">{step.title}</h3>
                  <p className="text-[13px] text-grayText leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION "POURQUOI NOVA" — Piliers de confiance
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-16 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-[24px] md:text-[30px] font-extrabold text-navy mb-8 text-center">
            Pourquoi choisir Nova pour votre {trade.name.toLowerCase()} ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyNova.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 p-5 rounded-[5px] border border-transparent hover:bg-bgPage hover:border-border transition-all duration-200">
                  <div className="w-11 h-11 rounded-[5px] bg-forest/[0.06] flex items-center justify-center shrink-0">
                    <ItemIcon className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[15px] text-navy mb-1">{item.title}</h3>
                    <p className="text-[13px] text-grayText leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION FAQ — Accordéon de questions fréquentes
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-16 bg-bgPage">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-heading text-[24px] md:text-[30px] font-extrabold text-navy mb-2 text-center">
            Questions fréquentes
          </h2>
          <p className="text-[15px] text-grayText mb-8 text-center">
            Les réponses aux questions les plus posées sur nos {trade.namePlural.toLowerCase()}.
          </p>

          <div className="space-y-2.5">
            {trade.faq.map((item, i) => (
              <div key={i} className="bg-white rounded-[5px] border border-border overflow-hidden">
                {/* Bouton pour ouvrir/fermer la réponse */}
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <span className="text-[14px] font-bold text-navy pr-4">{item.q}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-grayText shrink-0 transition-transform duration-200",
                    openFaq === i && "rotate-180",
                  )} />
                </button>
                {/* Contenu de la réponse (visible si ouvert) */}
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-[13px] text-grayText leading-[1.7]">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION CTA FINAL — Fond sombre, statistiques, double CTA
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-16 bg-gradient-to-br from-deepForest via-forest to-deepForest relative overflow-hidden">
        {/* Motif SVG subtil en fond */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-50" />

        <div className="max-w-[700px] mx-auto text-center relative z-10">
          <Lock className="w-6 h-6 text-lightSage mx-auto mb-4" />
          <h2 className="font-heading text-[24px] md:text-[34px] font-extrabold text-white mb-3 leading-tight">
            Besoin d&apos;un {trade.name.toLowerCase()} de confiance ?
          </h2>
          <p className="text-[15px] text-white/60 mb-4 max-w-[460px] mx-auto">
            Artisans certifiés. Paiement sécurisé par séquestre. Devis sur place, sans surprise.
          </p>

          {/* Statistiques clés */}
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            {ctaStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-[20px] font-bold text-white">{s.value}</div>
                <div className="text-[11px] text-white/40">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Double CTA : recherche + urgence */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href={searchLink}
              className="group flex items-center gap-2 px-8 py-4 rounded-[5px] bg-white text-deepForest text-[15px] font-bold shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-[0.97] transition-all cursor-pointer"
            >
              Trouver un {trade.name.toLowerCase()}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href={urgencyLink}
              className="flex items-center gap-2 px-6 py-4 rounded-[5px] bg-white/[0.08] text-white border border-white/15 text-[15px] font-semibold hover:bg-white/[0.14] active:scale-[0.97] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-gold" />
              Urgence 24/7
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION LIENS INTERNES — Maillage SEO vers les autres métiers
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-10 bg-white border-t border-border/60">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[13px] text-grayText mb-4">Autres artisans certifiés Nova</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {allTrades
              .filter((s) => s !== trade.slug)
              .map((s) => (
                <Link
                  key={s}
                  href={`/${s}`}
                  className="px-4 py-2 rounded-[5px] bg-bgPage border border-border text-[13px] font-semibold text-navy hover:border-forest/30 hover:bg-surface transition-all cursor-pointer"
                >
                  {formatTradeName(s)}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
