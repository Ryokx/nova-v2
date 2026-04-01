/**
 * Landing page V2 — Structure inspirée Europ Assistance avec DA Nova
 *
 * Hero : fond dégradé vert + image, badge, titre, sous-texte, CTA, stats
 * Barre de recherche : à cheval entre hero et contenu blanc
 * Bandeau réassurance : défilant horizontal sous la barre
 * Sections : Comment ça marche, Avantages, CTA final
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Shield,
  Clock,
  Star,
  Wrench,
  Zap,
  Droplets,
  Flame,
  PaintBucket,
  Hammer,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const LocationMap = dynamic(() => import("@/components/features/location-map"), { ssr: false });

/* ------------------------------------------------------------------ */
/*  Données                                                            */
/* ------------------------------------------------------------------ */

const TRADES = [
  { id: "plombier", name: "Plomberie", desc: "Fuites, robinets, chauffe-eau, canalisations", img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=250&fit=crop", slug: "plombier" },
  { id: "electricien", name: "Electricite", desc: "Prises, tableau electrique, eclairage, panne", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop", slug: "electricien" },
  { id: "serrurier", name: "Serrurerie", desc: "Portes, serrures, blindage, ouverture", img: "https://images.unsplash.com/photo-1677951570313-b0750351c461?w=400&h=250&fit=crop", slug: "serrurier" },
  { id: "chauffagiste", name: "Chauffage / Clim", desc: "Chaudiere, radiateurs, climatisation", img: "https://images.unsplash.com/photo-1599028274511-e02a767949a3?w=400&h=250&fit=crop", slug: "chauffagiste" },
  { id: "peintre", name: "Peinture", desc: "Interieur, exterieur, revetements, finitions", img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=250&fit=crop", slug: "peintre" },
  { id: "menuisier", name: "Menuiserie", desc: "Portes, fenetres, parquet, meubles sur mesure", img: "https://images.unsplash.com/photo-1626081062126-d3b192c1fcb0?w=400&h=250&fit=crop", slug: "menuisier" },
  { id: "carreleur", name: "Carrelage", desc: "Sols, murs, salles de bain, terrasses", img: "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=400&h=250&fit=crop", slug: "carreleur" },
  { id: "mecanicien", name: "Mecaniciens", desc: "Entretien, reparation, diagnostic automobile", img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=250&fit=crop", slug: "macon" },
];

const steps = [
  {
    num: "01",
    title: "Decrivez votre besoin",
    desc: "Choisissez le type d'intervention et decrivez votre probleme en quelques mots.",
    icon: Search,
  },
  {
    num: "02",
    title: "Un artisan certifie est assigne",
    desc: "Nova selectionne l'artisan le plus qualifie et le plus proche de chez vous.",
    icon: BadgeCheck,
  },
  {
    num: "03",
    title: "Paiement securise par sequestre",
    desc: "Vous payez en ligne. L'argent est bloque jusqu'a la fin de l'intervention.",
    icon: Shield,
  },
  {
    num: "04",
    title: "Validez et l'artisan est paye",
    desc: "Satisfait ? Validez l'intervention et le paiement est libere automatiquement.",
    icon: CheckCircle2,
  },
];

const avantages = [
  {
    icon: BadgeCheck,
    title: "Artisans certifies",
    desc: "SIRET verifie, assurance decennale, piece d'identite — chaque artisan est controle.",
  },
  {
    icon: Shield,
    title: "Paiement sequestre",
    desc: "Votre argent est protege. L'artisan n'est paye qu'apres votre validation.",
  },
  {
    icon: Clock,
    title: "Intervention rapide",
    desc: "Urgence ou rendez-vous planifie, un artisan disponible est assigne en quelques minutes.",
  },
  {
    icon: Banknote,
    title: "Prix transparent",
    desc: "Devis clair avant intervention. Aucun frais cache, aucune mauvaise surprise.",
  },
];

const trustBadges = [
  "Certifie",
  "Assurance Decennale",
  "Stripe Verified",
  "RGPD Conforme",
  "RGE Qualifie",
  "Qualibat",
  "Garantie Sequestre",
  "Support 7j/7",
];

/* ------------------------------------------------------------------ */
/*  Barre de recherche                                                 */
/* ------------------------------------------------------------------ */

function HeroSearchBar() {
  const router = useRouter();
  const [metier, setMetier] = useState("");
  const [ville, setVille] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtrer les TRADES selon la saisie
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const suggestions = metier.trim().length > 0
    ? TRADES.filter((t) =>
        normalize(t.name).includes(normalize(metier)) ||
        normalize(t.desc).includes(normalize(metier))
      )
    : [];

  const handleSelect = (trade: typeof TRADES[number]) => {
    setMetier(trade.name);
    setShowSuggestions(false);
    router.push(`/${trade.slug}`);
  };

  const handleSearch = () => {
    if (metier.trim()) {
      const match = TRADES.find(
        (t) => normalize(t.name) === normalize(metier.trim())
      );
      if (match) {
        router.push(`/${match.slug}`);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  // Fermer les suggestions au clic exterieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
    <div className="bg-white rounded-[16px] shadow-lg p-2 flex items-center gap-2">
      {/* Champ metier */}
      <div className="flex items-center gap-2.5 flex-[7] px-4 py-2.5">
        <Search className="w-5 h-5 text-grayText shrink-0" />
        <input
          type="text"
          placeholder="Quel type de travaux ?"
          value={metier}
          onChange={(e) => { setMetier(e.target.value); setShowSuggestions(true); }}
          onFocus={() => metier.trim().length > 0 && setShowSuggestions(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="bg-transparent text-sm text-navy placeholder:text-grayText outline-none w-full font-body"
        />
      </div>

      {/* Separateur */}
      <div className="w-px h-8 bg-border shrink-0" />

      {/* Champ ville */}
      <div className="flex items-center gap-2.5 flex-[3] px-4 py-2.5">
        <MapPin className="w-5 h-5 text-grayText shrink-0" />
        <input
          type="text"
          placeholder="Votre ville"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="bg-transparent text-sm text-navy placeholder:text-grayText outline-none w-full font-body"
        />
      </div>

      {/* Bouton */}
      <button
        onClick={handleSearch}
        className="shrink-0 px-7 py-2.5 rounded-[12px] bg-forest text-white text-sm font-bold font-heading hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        Rechercher
      </button>
    </div>

    {/* Suggestions live */}
    {showSuggestions && suggestions.length > 0 && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-lg border border-border overflow-hidden z-50">
        {suggestions.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface/50 transition-colors text-left"
          >
            <Image
              src={t.img}
              alt={t.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-[8px] object-cover shrink-0"
            />
            <div>
              <div className="text-sm font-heading font-bold text-navy">{t.name}</div>
              <div className="text-xs text-grayText">{t.desc}</div>
            </div>
          </button>
        ))}
      </div>
    )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bandeau reassurance defilant                                       */
/* ------------------------------------------------------------------ */

function TrustBanner() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame: number;
    let pos = 0;
    const speed = 0.5;

    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Double les items pour boucle infinie
  const items = [...trustBadges, ...trustBadges];

  return (
    <div className="bg-white border-t border-border">
      <div
        ref={scrollRef}
        className="flex items-center gap-8 py-4 overflow-hidden whitespace-nowrap max-w-6xl mx-auto"
      >
        {items.map((label, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-forest" />
            <span className="text-sm font-semibold text-grayText">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingV2() {
  return (
    <div className={`min-h-screen bg-bgPage -mt-[72px] ${jakarta.className}`}>
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative bg-forest overflow-hidden" data-navbar-dark>
        {/* Cercles decoratifs en fond */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-sage/20" />
          <div className="absolute top-1/3 left-[15%] w-[300px] h-[300px] rounded-full bg-sage/15" />
          <div className="absolute -bottom-32 left-[5%] w-[400px] h-[400px] rounded-full bg-deepForest/30" />
          <div className="absolute top-[10%] left-[30%] w-[200px] h-[200px] rounded-full bg-sage/10" />
        </div>

        <div className="flex flex-col lg:flex-row h-[80vh]">
          {/* Colonne gauche : texte sur fond vert uni */}
          <div className="relative z-10 w-full lg:w-[42%] px-6 md:px-12 lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))] pt-36 pb-16 lg:pb-20 flex flex-col justify-center">
            <div className="max-w-xl">
              {/* Titre */}
              <h1 className="font-heading text-[38px] md:text-[50px] font-extrabold text-white leading-[1.1] mb-5">
                Avec Nova, faites vos travaux en toute confiance
              </h1>

              {/* Sous-texte */}
              <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8">
                Votre argent est protege jusqu&apos;a validation des travaux.
                <span className="text-white/60"> Artisans certifies &middot; Devis gratuits &middot; Paiement securise</span>
              </p>

              {/* Barre de recherche — deborde a droite sous l'image */}
              <div className="mt-6" style={{ width: "50vw" }}>
                <HeroSearchBar />
              </div>

              {/* Stats + Store buttons */}
              <div className="flex items-center gap-6 mt-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/70" />
                  <span className="font-mono text-sm font-bold text-white">2 400+</span>
                  <span className="text-sm text-white/70">proprietaires</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  <span className="font-mono text-sm font-bold text-white">4.8/5</span>
                  <span className="text-sm text-white/70">(850 avis)</span>
                </div>

                {/* Boutons stores */}
                <div className="flex items-center gap-2 ml-2">
                  <a href="#" className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-black/80 hover:bg-black transition-colors">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-white/70 leading-none">Telecharger sur</span>
                      <span className="text-[12px] font-bold text-white leading-tight">App Store</span>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-black/80 hover:bg-black transition-colors">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.18 23.67c-.413-.009-.817-.126-1.17-.34-.512-.337-.903-.837-1.105-1.41a3.09 3.09 0 01-.135-.52L.76 21.28V2.72l.01-.12c.04-.257.117-.507.23-.74.206-.563.59-1.05 1.09-1.38A2.25 2.25 0 013.27.16l.09.02 8.83 5.1c.09.05.17.1.24.16l8.09 4.67a2.26 2.26 0 011.12 1.94 2.26 2.26 0 01-1.12 1.95l-8.09 4.67c-.07.05-.15.1-.24.16l-8.83 5.1-.09.02c-.273.08-.56.12-.85.12l-.24-.02zm.82-2.07l8.56-4.94 2.83-1.64-4.76-2.75-6.63 3.83v5.5zm0-7.6l4.76-2.75L3.99 8.5v5.5h.01zm6.87-3.97l3.48-2.01L5.52 2.4l5.35 7.63zm4.7 2.72l-3.47-2.01-5.36 7.63 8.83-5.1v-.52z"/>
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-white/70 leading-none">Disponible sur</span>
                      <span className="text-[12px] font-bold text-white leading-tight">Google Play</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite : image 50% height, collee en haut, bas en diagonale */}
          <div className="relative w-full lg:w-[58%] min-h-[250px] lg:min-h-0">
            {/* Image — 50% du hero, haut droit, bas coupe en diagonale */}
            <div
              className="absolute top-28 left-0 right-[max(2rem,calc((100vw-1280px)/2))] h-[50%] bg-cover bg-center hidden lg:block"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1400&q=80")`,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%)",
              }}
            />
            {/* Image mobile */}
            <div
              className="absolute inset-0 bg-cover bg-center lg:hidden"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1400&q=80")`,
              }}
            />
          </div>


        </div>
      </section>

      {/* ============================================================ */}
      {/*  BANDEAU REASSURANCE                                          */}
      {/* ============================================================ */}
      <TrustBanner />

      {/* ============================================================ */}
      {/*  CARTE INTERACTIVE + SERVICES                                  */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Cercles decoratifs en fond */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 w-[450px] h-[450px] rounded-full bg-forest/[0.04]" />
          <div className="absolute top-[40%] -left-20 w-[350px] h-[350px] rounded-full bg-sage/[0.06]" />
          <div className="absolute bottom-20 right-[10%] w-[250px] h-[250px] rounded-full bg-forest/[0.03]" />
          <div className="absolute top-[20%] right-[30%] w-[180px] h-[180px] rounded-full bg-sage/[0.05]" />
          <div className="absolute -bottom-16 left-[15%] w-[300px] h-[300px] rounded-full bg-deepForest/[0.03]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider mb-4">
            Trouvez un artisan
          </span>
          <h2 className="font-heading text-[32px] md:text-[40px] font-extrabold text-navy leading-tight">
            Des artisans certifies pres de chez vous
          </h2>
          <p className="text-grayText mt-3 max-w-lg mx-auto">
            Localisez les artisans disponibles autour de vous en temps reel sur la carte interactive.
          </p>
        </div>

        {/* Carte interactive */}
        <div className="relative rounded-[20px] border border-border shadow-md mb-16" style={{ isolation: "isolate" }}>
          <LocationMap />
        </div>

        {/* Services */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider mb-4">
            Nos services
          </span>
          <h2 className="font-heading text-[28px] md:text-[36px] font-extrabold text-navy leading-tight">
            Tous les corps de metier
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRADES.map((t) => (
            <Link
              key={t.id}
              href={`/${t.slug}`}
              className="group relative flex flex-col rounded-[16px] border border-border bg-white overflow-hidden hover:border-forest/30 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              {/* Image */}
              <div className="relative h-28 md:h-32 overflow-hidden">
                <Image
                  src={t.img}
                  alt={t.name}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Texte */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-sm font-heading font-bold text-navy mb-1">{t.name}</div>
                <div className="text-xs text-grayText leading-snug">{t.desc}</div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  COMMENT CA MARCHE                                            */}
      {/* ============================================================ */}
      <section className="relative">
        {/* Diagonale en haut */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-bgPage" style={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)" }} />
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider mb-4">
            Simple et rapide
          </span>
          <h2 className="font-heading text-[32px] md:text-[40px] font-extrabold text-navy leading-tight">
            Comment ca marche ?
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative group">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-0.5 bg-gradient-to-r from-forest/30 to-forest/10" />
              )}
              <div className="relative bg-white rounded-[20px] border border-border p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-forest" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-forest/15">{s.num}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-sm text-grayText leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  AVANTAGES                                                    */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-deepForest via-forest to-sage pt-32 pb-24">
        {/* Diagonale en haut */}
        <div className="absolute top-0 left-0 right-0 h-16" style={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)", background: "inherit" }}>
          <div className="w-full h-full bg-bgPage" />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-lightSage text-xs font-bold uppercase tracking-wider mb-4">
              Pourquoi Nova
            </span>
            <h2 className="font-heading text-[32px] md:text-[40px] font-extrabold text-white leading-tight">
              La confiance au coeur du service
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((a, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-[20px] p-6 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-[12px] bg-white/15 flex items-center justify-center mb-5">
                  <a.icon className="w-6 h-6 text-lightSage" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2">{a.title}</h3>
                <p className="text-sm text-lightSage/70 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA FINAL                                                    */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-24">
        {/* Diagonale en haut */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-bgPage" style={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)" }} />
        <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white rounded-[24px] border border-border shadow-md p-10 md:p-14">
          <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8 text-forest" />
          </div>
          <h2 className="font-heading text-[28px] md:text-[36px] font-extrabold text-navy mb-4">
            Besoin d&apos;un artisan maintenant ?
          </h2>
          <p className="text-grayText text-base mb-8 max-w-lg mx-auto">
            Decrivez votre besoin, un artisan certifie est assigne en quelques minutes.
            Paiement protege, intervention garantie.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-[14px] bg-deepForest text-white font-heading font-bold text-base hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Commencer ma demande
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}
