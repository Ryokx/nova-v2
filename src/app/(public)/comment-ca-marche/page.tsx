/**
 * Page "Comment ça marche" — /comment-ca-marche
 *
 * Ancienne landing page transformée en page explicative.
 * Structure en 7 sections :
 * 1. HERO : titre accrocheur + mockup téléphone flottant
 * 2. TRUST (Bento grid) : séquestre, certifications, validation
 * 3. HOW IT WORKS : 4 étapes du parcours utilisateur
 * 4. DEMO PREVIEW : cartes pour tester en mode client ou artisan
 * 5. MOBILE APP : présentation de l'application mobile + features
 * 6. TESTIMONIALS : avis clients (1 mis en avant + 2 empilés)
 * 7. FINAL CTA : appel à l'action pour créer un compte
 *
 * Page statique (Server Component) — pas de "use client".
 */
import Link from "next/link";
import {
  Shield,
  Lock,
  Check,
  FileText,
  Home,
  Search,
  ClipboardList,
  Bell,
  User,
  Smartphone,
  PenTool,
  Video,
  Moon,
  AlertTriangle,
  Wrench,
  Star,
  ArrowRight,
  ChevronRight,
  Zap,
  BadgeCheck,
  MapPin,
} from "lucide-react";

/* ━━━ Icônes SVG personnalisées ━━━ */

/** Icône bouclier avec coche (utilisée dans les sections confiance) */
const ShieldIcon = ({ size = 28, color = "#1B6B4E" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill={color} opacity=".12" />
    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Icône cadenas (utilisée dans les sections séquestre) */
const LockIcon = ({ size = 18, color = "#1B6B4E" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M8 11V7a4 4 0 118 0v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill={color} />
  </svg>
);

/** Icône d'onglet pour la barre de navigation du mockup téléphone */
const TabIcon = ({ icon: Icon, active = false }: { icon: React.ElementType; active?: boolean }) => (
  <Icon className={`w-[14px] h-[14px] ${active ? "text-forest" : "text-grayText/40"}`} strokeWidth={active ? 2.5 : 1.5} />
);

import { ScrollRevealInit } from "@/components/features/scroll-reveal";

/** Séparateur oblique — couleur = section du dessus, se superpose sur la section du dessous */
const SlantDivider = ({ color, flip = false }: { color: string; flip?: boolean }) => (
  <div className="relative h-[60px] md:h-[80px] -mb-[60px] md:-mb-[80px] pointer-events-none" style={{ zIndex: 2 }}>
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="w-full h-full"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M0,0 L1440,0 L1440,40 L0,80 Z" fill={color} />
    </svg>
  </div>
);

export default function HomePage() {
  return (
    <div>
      <ScrollRevealInit />
      {/* ══════════════════════════════════════════════════
          SECTION 1 — HERO
          Titre accrocheur + badges de confiance + CTAs
          + mockup téléphone flottant à droite (desktop)
      ══════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden min-h-[calc(100vh-72px)] flex items-center px-5 md:px-10"
        style={{ background: "linear-gradient(160deg, #F5FAF7 0%, #E8F5EE 35%, #D4EBE0 70%, #C8E6D5 100%)" }}
      >
        {/* Blobs décoratifs d'arrière-plan */}
        <div className="absolute -top-[120px] -right-[80px] w-[500px] h-[500px] rounded-full bg-forest/[0.06] blur-[100px]" />
        <div className="absolute -bottom-[100px] -left-[60px] w-[350px] h-[350px] rounded-full bg-gold/[0.05] blur-[80px]" />
        <div className="absolute top-[30%] left-[25%] w-[250px] h-[250px] rounded-full bg-sage/[0.04] blur-[60px]" />

        <div className="max-w-[1140px] mx-auto w-full flex items-center gap-20 relative z-10">

          {/* ── Colonne gauche : contenu texte ── */}
          <div className="flex-1 min-w-0 py-16 md:py-20">

            {/* Titre principal en 2 lignes */}
            <h1 className="font-heading text-[36px] md:text-[54px] font-extrabold text-navy leading-[1.08] tracking-[-1.5px] mb-2 motion-safe:animate-pageIn motion-safe:[animation-delay:80ms]" style={{ textWrap: "balance" as never }}>
              Fini les artisans{" "}
              <span className="text-red/50 line-through decoration-[3px] decoration-red/30">douteux</span>
            </h1>
            <h1 className="font-heading text-[36px] md:text-[54px] font-extrabold leading-[1.08] tracking-[-1.5px] mb-7 motion-safe:animate-pageIn motion-safe:[animation-delay:160ms]">
              <span className="inline-block overflow-hidden whitespace-nowrap animate-typing border-r-[3px] border-forest">
                <span className="bg-gradient-to-r from-deepForest via-forest to-sage bg-clip-text text-transparent">
                  Place aux certifiés.
                </span>
              </span>
            </h1>

            {/* Sous-titre explicatif */}
            <p className="text-[17px] text-navy/60 leading-[1.75] max-w-[480px] mb-5 motion-safe:animate-pageIn motion-safe:[animation-delay:240ms]">
              Nova vérifie chaque artisan <span className="font-semibold text-navy">(SIRET, décennale, RGE)</span> et bloque votre paiement en <span className="font-semibold text-navy">séquestre</span> jusqu&apos;à validation de l&apos;intervention.
            </p>

            {/* Micro-badges de confiance */}
            <div className="flex gap-5 mb-9 flex-wrap motion-safe:animate-pageIn motion-safe:[animation-delay:320ms]">
              {[
                { icon: <Shield className="w-4 h-4 text-forest" />, text: "Artisans vérifiés" },
                { icon: <Lock className="w-4 h-4 text-forest" />, text: "Paiement séquestre" },
                { icon: <BadgeCheck className="w-4 h-4 text-forest" />, text: "0% d'impayés" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-[13px] font-semibold text-deepForest/80">
                  <div className="w-7 h-7 rounded-lg bg-forest/[0.07] flex items-center justify-center">{b.icon}</div>
                  {b.text}
                </div>
              ))}
            </div>

            {/* Boutons d'appel à l'action */}
            <div className="flex gap-3 flex-wrap motion-safe:animate-pageIn motion-safe:[animation-delay:400ms]">
              <Link
                href="/"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-deepForest to-forest text-white text-[15px] font-bold font-heading shadow-[0_8px_24px_rgba(10,64,48,0.3)] hover:shadow-[0_12px_32px_rgba(10,64,48,0.4)] active:scale-[0.97] transition-all duration-200 cursor-pointer"
              >
                Trouver mon artisan
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              {/* App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-black text-white hover:bg-black/90 active:scale-[0.97] transition-all duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[9px] leading-none opacity-80">Télécharger sur</div>
                  <div className="text-[14px] font-semibold leading-tight">App Store</div>
                </div>
              </a>
              {/* Google Play */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white text-navy border border-border/60 hover:bg-gray-50 active:scale-[0.97] transition-all duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.61 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.61-.92z" fill="#4285F4"/>
                  <path d="M17.658 8.344L5.796.756C5.1.35 4.345.292 3.61 1.814L13.793 12l3.865-3.656z" fill="#EA4335"/>
                  <path d="M3.61 22.186c.735 1.522 1.49 1.464 2.186 1.058l11.862-7.588L13.793 12 3.61 22.186z" fill="#34A853"/>
                  <path d="M20.847 10.262l-3.19-1.918L13.794 12l3.865 3.656 3.19-1.918c1.078-.672 1.078-2.804-.002-3.476z" fill="#FBBC05"/>
                </svg>
                <div className="text-left">
                  <div className="text-[9px] leading-none text-grayText">Disponible sur</div>
                  <div className="text-[14px] font-semibold leading-tight">Google Play</div>
                </div>
              </a>
            </div>

            {/* Preuve sociale (avatars + texte) */}
            <div className="flex items-center gap-3 mt-8 motion-safe:animate-pageIn motion-safe:[animation-delay:500ms]">
              <div className="flex">
                {["SL", "PM", "CD", "AM"].map((ini, i) => (
                  <div key={ini} className="w-8 h-8 rounded-full border-[2.5px] border-bgPage flex items-center justify-center text-[9px] font-bold text-forest shadow-sm" style={{ background: `hsl(${150 + i * 25}, 30%, 87%)`, marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }}>
                    {ini}
                  </div>
                ))}
              </div>
              <div className="text-[13px] text-navy/50">
                <span className="font-bold text-navy/80">Rejoignez-les</span> — Gratuit, sans engagement
              </div>
            </div>
          </div>

          {/* ── Colonne droite : mockup téléphone flottant (desktop uniquement) ── */}
          <div className="hidden lg:block flex-none w-[320px] relative motion-safe:animate-pageIn motion-safe:[animation-delay:300ms]">
            <div className="w-[280px] h-[560px] rounded-[36px] bg-navy p-2.5 shadow-[0_40px_100px_rgba(10,22,40,0.25)] motion-safe:animate-float">
              {/* Dynamic Island (encoche iPhone) */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[90px] h-[26px] rounded-b-2xl bg-navy z-10">
                <div className="w-11 h-1 rounded-full bg-white/[0.12] mx-auto mt-3.5" />
              </div>
              {/* Écran du téléphone */}
              <div className="w-full h-full rounded-[32px] overflow-hidden" style={{ background: "linear-gradient(170deg, #E8F5EE, #F5FAF7)" }}>
                <div className="pt-[34px] px-3.5">
                  {/* Barre de navigation app */}
                  <div className="flex items-center mb-3">
                    <span className="font-heading text-[13px] font-extrabold text-navy tracking-tight">Nova</span>
                    <div className="w-[3px] h-[3px] rounded-full bg-gold ml-0.5" />
                    <div className="ml-auto w-6 h-6 rounded-lg bg-surface flex items-center justify-center">
                      <LockIcon size={12} />
                    </div>
                  </div>
                  <div className="font-heading text-sm font-extrabold text-navy mb-3">Bonjour Sophie</div>

                  {/* Mini cartes de statistiques */}
                  <div className="flex gap-[5px] mb-2.5">
                    {[{ v: "2", l: "En cours", c: "text-success" }, { v: "570€", l: "Séquestre", c: "text-forest" }].map((k) => (
                      <div key={k.l} className="flex-1 bg-white rounded-lg py-[7px] px-1.5 text-center border border-border/50 shadow-sm">
                        <div className={`font-mono text-xs font-bold ${k.c}`}>{k.v}</div>
                        <div className="text-[7px] text-grayText">{k.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Cartes de missions dans le mockup */}
                  {[
                    { ini: "JM", name: "Jean-Michel P.", desc: "Réparation fuite", badge: "En cours", bColor: "#22C88A" },
                    { ini: "SM", name: "Sophie M.", desc: "Prise électrique", badge: "Terminée", bColor: "#1B6B4E" },
                    { ini: "KB", name: "Karim B.", desc: "Serrure", badge: "Validée", bColor: "#F5A623" },
                  ].map((m) => (
                    <div key={m.ini} className="bg-white rounded-lg p-2 mb-[5px] border border-border/30 shadow-sm flex gap-2 items-center">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-surface to-border flex items-center justify-center text-[8px] font-bold text-forest">{m.ini}</div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-navy">{m.name}</div>
                        <div className="text-[8px] text-grayText">{m.desc}</div>
                      </div>
                      <span className="text-[7px] font-bold px-[5px] py-[2px] rounded-sm" style={{ color: m.bColor, background: m.bColor + "15" }}>{m.badge}</span>
                    </div>
                  ))}

                  {/* Carte séquestre dans le mockup */}
                  <div className="bg-gradient-to-br from-deepForest to-forest rounded-xl p-2.5 mt-2 shadow-[0_4px_16px_rgba(10,64,48,0.2)]">
                    <div className="flex items-center gap-[5px] mb-1">
                      <LockIcon size={10} color="#8ECFB0" />
                      <span className="text-[8px] font-bold text-lightSage">Paiement en séquestre</span>
                    </div>
                    <div className="font-mono text-base font-bold text-white">570,00 €</div>
                    <div className="w-full h-1 rounded-full bg-white/10 mt-1.5">
                      <div className="w-[65%] h-full rounded-full bg-lightSage/60" />
                    </div>
                    <div className="text-[7px] text-white/50 mt-1">Protégé jusqu&apos;à validation</div>
                  </div>

                  {/* Barre d'onglets du téléphone */}
                  <div className="flex justify-around pt-2.5 mt-2.5 border-t border-surface">
                    <TabIcon icon={Home} active />
                    <TabIcon icon={Search} />
                    <TabIcon icon={ClipboardList} />
                    <TabIcon icon={Bell} />
                    <TabIcon icon={User} />
                  </div>
                </div>
              </div>
            </div>

            {/* Carte flottante — "Intervention validée" */}
            <div className="absolute top-16 -left-[70px] bg-white rounded-xl px-3.5 py-2.5 shadow-lg border border-border/40 flex items-center gap-2.5 max-w-[210px] motion-safe:animate-pageIn motion-safe:[animation-delay:700ms]">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div className="absolute inset-0 rounded-lg bg-success/20 motion-safe:animate-pulse-ring" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-navy">Intervention validée</div>
                <div className="text-[9px] text-grayText">Paiement libéré • 320€</div>
              </div>
            </div>

            {/* Carte flottante — "Artisan certifié" */}
            <div className="absolute bottom-[90px] -right-[40px] bg-white rounded-xl px-3.5 py-2.5 shadow-lg border border-border/40 flex items-center gap-2.5 motion-safe:animate-pageIn motion-safe:[animation-delay:900ms]">
              <div className="w-8 h-8 rounded-lg bg-forest/[0.08] flex items-center justify-center">
                <ShieldIcon size={16} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-navy">Artisan certifié</div>
                <div className="text-[9px] text-grayText">SIRET • Décennale • RGE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SlantDivider color="#C8E6D5" />

      {/* ══════════════════════════════════════════════════
          SECTION 2 — TRUST (Bento Grid)
          3 cartes : séquestre (mise en avant), certifications, validation
      ══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-5 md:px-10 bg-white">
        <div data-reveal className="reveal-up max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-[32px] md:text-[38px] font-extrabold text-navy mb-3" style={{ textWrap: "balance" as never }}>
              Un système de confiance unique
            </h2>
            <p className="text-[16px] text-navy/50 max-w-[460px] mx-auto leading-relaxed">
              Votre argent est protégé, vos artisans sont vérifiés, chaque mission est contrôlée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Carte principale — Séquestre (occupe 2 rangées) */}
            <div className="md:row-span-2 group relative p-8 rounded-2xl overflow-hidden cursor-default" style={{ background: "linear-gradient(160deg, #0A4030 0%, #1B6B4E 100%)" }}>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <LockIcon size={28} color="#8ECFB0" />
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-white mb-2">Paiement séquestre</h3>
                <p className="text-[15px] text-white/70 leading-relaxed mb-6 max-w-[380px]">
                  Votre argent est bloqué sur un compte sécurisé dès la signature du devis. L&apos;artisan n&apos;est payé qu&apos;après votre validation.
                </p>

                {/* Visualisation du flux séquestre en 4 étapes */}
                <div className="flex items-center gap-3 mb-4">
                  {[
                    { label: "Vous payez", icon: <CreditCardIcon /> },
                    { label: "Séquestre", icon: <Lock className="w-4 h-4 text-lightSage" /> },
                    { label: "Validation", icon: <Check className="w-4 h-4 text-lightSage" /> },
                    { label: "Artisan payé", icon: <BadgeCheck className="w-4 h-4 text-lightSage" /> },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.12] flex items-center justify-center">{step.icon}</div>
                        <span className="text-[9px] font-semibold text-white/60 whitespace-nowrap">{step.label}</span>
                      </div>
                      {i < 3 && <div className="w-6 h-[2px] bg-lightSage/30 rounded-full mt-[-14px]" />}
                    </div>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 text-[13px] font-bold text-lightSage">
                  <Lock className="w-3.5 h-3.5" /> 0€ de risque pour vous
                </div>
              </div>
              {/* Effet lumineux décoratif */}
              <div className="absolute -bottom-20 -right-20 w-[250px] h-[250px] rounded-full bg-sage/[0.15] blur-[80px]" />
            </div>

            {/* Carte — Certifications artisans */}
            <div className="group p-7 rounded-2xl bg-bgPage border border-border/50 hover:border-forest/20 hover:shadow-lg active:scale-[0.99] transition-all duration-200 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-forest/[0.08] group-hover:bg-forest/[0.12] flex items-center justify-center mb-4 transition-colors">
                <ShieldIcon size={26} />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Artisans certifiés</h3>
              <p className="text-[14px] text-navy/55 leading-relaxed mb-4">
                Chaque artisan est audité et vérifié avant d&apos;être référencé. Documents obligatoires contrôlés par notre équipe.
              </p>
              <div className="flex flex-wrap gap-2">
                {["SIRET vérifié", "Décennale", "Pièce d'identité"].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-[11px] font-bold text-forest bg-forest/[0.06] px-2.5 py-1 rounded-lg">
                    <Check className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Carte — Validation Nova */}
            <div className="group p-7 rounded-2xl bg-bgPage border border-border/50 hover:border-forest/20 hover:shadow-lg active:scale-[0.99] transition-all duration-200 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-forest/[0.08] group-hover:bg-forest/[0.12] flex items-center justify-center mb-4 transition-colors">
                <Check className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Validation Nova</h3>
              <p className="text-[14px] text-navy/55 leading-relaxed mb-4">
                Notre équipe contrôle et valide chaque mission avant de libérer le paiement. Vous gardez le contrôle total.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-success">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-success motion-safe:animate-pulse-ring" />
                  </div>
                  100% des missions contrôlées
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SlantDivider color="#ffffff" flip />

      {/* ══════════════════════════════════════════════════
          SECTION 3 — COMMENT ÇA MARCHE (4 étapes)
      ══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-5 md:px-10 bg-bgPage">
        <div data-reveal className="reveal-up max-w-[960px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-[32px] md:text-[38px] font-extrabold text-navy mb-3">Comment ça marche</h2>
            <p className="text-[16px] text-navy/50">De la recherche à la validation, en 4 étapes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0 relative">
            {/* Ligne de connexion entre les étapes (desktop) */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-[2px] bg-border/60 z-0" />

            {[
              { icon: <Search className="w-5 h-5" />, title: "Trouvez", desc: "Recherchez un artisan certifié par catégorie ou urgence", accent: "from-forest to-sage" },
              { icon: <FileText className="w-5 h-5" />, title: "Réservez", desc: "Prenez rendez-vous et acceptez le devis en ligne", accent: "from-forest to-sage" },
              { icon: <Lock className="w-5 h-5" />, title: "Payez en séquestre", desc: "Votre argent est bloqué, pas débité", accent: "from-deepForest to-forest" },
              { icon: <Check className="w-5 h-5" />, title: "On valide", desc: "Nova vérifie la mission et libère le paiement", accent: "from-deepForest to-forest" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center mb-4 shadow-[0_4px_14px_rgba(10,64,48,0.2)]`}>
                  {s.icon}
                </div>
                <h4 className="text-[15px] font-bold text-navy mb-1.5">{s.title}</h4>
                <p className="text-[13px] text-navy/45 leading-snug px-2 max-w-[180px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SlantDivider color="#F5FAF7" />

      {/* ══════════════════════════════════════════════════
          SECTION 4 — DEMO PREVIEW
          2 cartes glassmorphism : mode client / mode artisan
      ══════════════════════════════════════════════════ */}
      <section data-navbar-dark className="pt-32 pb-20 px-5 md:px-10 overflow-hidden" style={{ background: "linear-gradient(170deg, #0A4030 0%, #143D2E 50%, #1B6B4E 100%)" }}>
        <div data-reveal className="reveal-up max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/[0.08] rounded-lg px-4 py-2 mb-5 text-[12px] font-semibold text-white/70">
              <Zap className="w-3.5 h-3.5" /> Découvrez la plateforme
            </div>
            <h2 className="font-heading text-[32px] md:text-[40px] font-extrabold text-white mb-3" style={{ textWrap: "balance" as never }}>
              Testez Nova en mode démo
            </h2>
            <p className="text-[16px] text-white/55 max-w-[480px] mx-auto leading-relaxed">
              Explorez l&apos;interface complète sans créer de compte.
            </p>
          </div>

          {/* Cartes démo : client et artisan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[840px] mx-auto mb-14">
            {/* Carte — Mode client */}
            <Link href="/login" className="group relative bg-white/[0.06] backdrop-blur-xl rounded-2xl p-7 border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.18] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-lightSage/[0.04] rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/[0.1] flex items-center justify-center mb-5">
                  <Home className="w-7 h-7 text-lightSage" />
                </div>
                <h3 className="font-heading text-[22px] font-extrabold text-white mb-2">Je suis particulier</h3>
                <p className="text-[14px] text-white/55 leading-relaxed mb-5">
                  Trouvez un artisan certifié, réservez en ligne, payez en séquestre. Suivi temps réel.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {["Recherche artisans", "Réservation", "Vidéo diagnostic", "Signature devis", "Paiement 3x/4x", "Suivi live"].map((f) => (
                    <span key={f} className="px-2.5 py-1 rounded-lg bg-lightSage/[0.12] text-lightSage/90 text-[11px] font-semibold">{f}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-lightSage font-bold text-[15px] group-hover:gap-3 transition-all duration-200">
                  Explorer le mode client <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Carte — Mode artisan */}
            <Link href="/login" className="group relative bg-white/[0.06] backdrop-blur-xl rounded-2xl p-7 border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.18] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gold/[0.04] rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/[0.1] flex items-center justify-center mb-5">
                  <Wrench className="w-7 h-7 text-[#F5D090]" />
                </div>
                <h3 className="font-heading text-[22px] font-extrabold text-white mb-2">Je suis artisan</h3>
                <p className="text-[14px] text-white/55 leading-relaxed mb-5">
                  Gérez vos missions, créez vos devis et factures, suivez vos paiements.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {["Dashboard KPIs", "Devis en ligne", "Facturation auto", "Comptabilité", "QR code profil", "Carnet clients"].map((f) => (
                    <span key={f} className="px-2.5 py-1 rounded-lg bg-gold/[0.12] text-[#F5D090]/90 text-[11px] font-semibold">{f}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[#F5D090] font-bold text-[15px] group-hover:gap-3 transition-all duration-200">
                  Explorer le mode artisan <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* Fonctionnalités clés en grille */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[900px] mx-auto">
            {[
              { icon: <LockIcon size={20} color="#8ECFB0" />, title: "Séquestre", desc: "Paiement bloqué" },
              { icon: <ShieldIcon size={20} color="#8ECFB0" />, title: "Certifications", desc: "SIRET, décennale, RGE" },
              { icon: <MapPin className="w-5 h-5 text-lightSage" />, title: "Suivi live", desc: "En route → sur place → fini" },
              { icon: <FileText className="w-5 h-5 text-lightSage" />, title: "100% en ligne", desc: "Devis, facture, compta" },
            ].map((f) => (
              <div key={f.title} className="text-center py-4 px-3 rounded-xl bg-white/[0.03]">
                <div className="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center mx-auto mb-2">{f.icon}</div>
                <div className="text-[13px] font-bold text-white mb-0.5">{f.title}</div>
                <div className="text-[11px] text-white/45">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SlantDivider color="#1B6B4E" flip />

      {/* ══════════════════════════════════════════════════
          SECTION 5 — APPLICATION MOBILE
          Mockup téléphone + liste de fonctionnalités + boutons stores
      ══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-5 md:px-10 bg-white overflow-hidden">
        <div data-reveal className="reveal-up max-w-[1140px] mx-auto flex items-center gap-20 flex-wrap">

          {/* Mockup téléphone (desktop uniquement) */}
          <div className="hidden md:block flex-none relative">
            <div className="w-[260px] h-[530px] rounded-[36px] bg-navy p-2.5 shadow-[0_24px_64px_rgba(10,22,40,0.18)] relative">
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[90px] h-[24px] rounded-b-[16px] bg-navy z-10">
                <div className="w-[46px] h-1 rounded-full bg-white/[0.12] mx-auto mt-3" />
              </div>
              <div className="w-full h-full rounded-[32px] overflow-hidden" style={{ background: "linear-gradient(170deg, #E8F5EE 0%, #F5FAF7 100%)" }}>
                <div className="pt-3 px-4 flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-navy">9:41</span>
                  <div className="w-3 h-2 rounded-sm border border-navy"><div className="w-[70%] h-full bg-navy rounded-sm" /></div>
                </div>
                <div className="px-3.5 pt-3">
                  <div className="flex items-center gap-1.5 mb-3">
                    <ShieldIcon size={15} />
                    <span className="font-heading text-[13px] font-extrabold text-navy">Nova</span>
                  </div>
                  <div className="text-[10px] text-grayText mb-0.5">Bonjour Sophie</div>
                  <div className="font-heading text-[14px] font-extrabold text-navy mb-2.5">Votre espace</div>
                  <div className="flex gap-1 mb-2.5">
                    {[{ v: "2", l: "En cours" }, { v: "570€", l: "Séquestre" }, { v: "8", l: "Terminées" }].map((k) => (
                      <div key={k.l} className="flex-1 bg-white rounded-lg py-1.5 px-1 text-center border border-border/40 shadow-sm">
                        <div className="font-mono text-[11px] font-bold text-forest">{k.v}</div>
                        <div className="text-[7px] text-grayText">{k.l}</div>
                      </div>
                    ))}
                  </div>
                  {[
                    { ini: "JM", name: "Jean-Michel P.", desc: "Réparation fuite • 15 mars", status: "En cours", color: "text-success" },
                    { ini: "SM", name: "Sophie M.", desc: "Prise électrique • 10 mars", status: "Terminée", color: "text-forest" },
                  ].map((m) => (
                    <div key={m.ini} className="bg-white rounded-lg p-2 mb-1.5 border border-border/30 shadow-sm flex gap-2 items-center">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-surface to-border flex items-center justify-center text-[9px] font-bold text-forest">{m.ini}</div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-navy">{m.name}</div>
                        <div className="text-[8px] text-grayText">{m.desc}</div>
                      </div>
                      <span className={`text-[7px] font-bold ${m.color} bg-surface px-1.5 py-0.5 rounded-sm`}>{m.status}</span>
                    </div>
                  ))}
                  <div className="flex justify-around pt-2 mt-2 border-t border-surface">
                    <TabIcon icon={Home} active />
                    <TabIcon icon={Search} />
                    <TabIcon icon={ClipboardList} />
                    <TabIcon icon={Bell} />
                    <TabIcon icon={User} />
                  </div>
                </div>
              </div>
            </div>
            {/* Badge "Nouveau" */}
            <div className="absolute top-8 -right-3 bg-red text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-[0_4px_12px_rgba(232,48,42,0.25)]">Nouveau</div>
          </div>

          {/* Contenu texte : fonctionnalités de l'app */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-flex items-center gap-2 bg-forest/[0.05] rounded-lg px-4 py-2 mb-6 text-[12px] font-semibold text-deepForest/70">
              <Smartphone className="w-4 h-4" /> Application mobile
            </div>
            <h2 className="font-heading text-[30px] md:text-[36px] font-extrabold text-navy mb-3" style={{ textWrap: "balance" as never }}>Nova dans votre poche</h2>
            <p className="text-[15px] text-navy/50 leading-relaxed mb-8 max-w-[440px]">
              Notifications en temps réel, suivi artisan, signature de devis et paiement en séquestre — où que vous soyez.
            </p>

            {/* Liste des fonctionnalités mobiles */}
            <div className="flex flex-col gap-4 mb-8">
              {[
                { icon: <Bell className="w-5 h-5 text-forest" />, title: "Notifications push", desc: "Nouveau devis, artisan en route, intervention terminée" },
                { icon: <PenTool className="w-5 h-5 text-forest" />, title: "Signature tactile", desc: "Signez vos devis directement sur l'écran" },
                { icon: <Video className="w-5 h-5 text-forest" />, title: "Vidéo diagnostic", desc: "Filmez votre problème avant l'intervention" },
                { icon: <Moon className="w-5 h-5 text-forest" />, title: "Mode sombre", desc: "Interface confortable de jour comme de nuit" },
              ].map((f) => (
                <div key={f.title} className="flex gap-3.5 items-start group">
                  <div className="w-10 h-10 rounded-xl bg-forest/[0.06] group-hover:bg-forest/[0.1] border border-border/40 flex items-center justify-center shrink-0 transition-colors">{f.icon}</div>
                  <div>
                    <div className="text-[14px] font-bold text-navy mb-0.5">{f.title}</div>
                    <div className="text-[13px] text-navy/45 leading-snug">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Boutons App Store / Google Play */}
            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2.5 bg-navy rounded-xl px-5 py-2.5 cursor-pointer hover:bg-navy/90 active:scale-[0.97] transition-all" aria-label="Télécharger sur l'App Store">
                <svg width="22" height="22" viewBox="0 0 814 1000" fill="#fff" aria-hidden="true"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.6-105.6-210.8-105.6-334.1C0 397.1 78.6 283.9 190.5 283.9c64.2 0 117.8 42.8 155.5 42.8 39 0 99.7-45.2 172.8-45.2 27.8 0 127.7 2.5 193.3 59.4z" /><path d="M554.1 0c-7.8 66.3-67.8 134.3-134.2 134.3-12 0-24-1.3-24-13.3 0-5.8 5.8-28.3 29-57.7C449.8 32.7 515.5 0 554.1 0z" /></svg>
                <div>
                  <div className="text-[9px] text-white/60">Télécharger sur</div>
                  <div className="text-[14px] font-semibold text-white">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-2.5 bg-navy rounded-xl px-5 py-2.5 cursor-pointer hover:bg-navy/90 active:scale-[0.97] transition-all" aria-label="Disponible sur Google Play">
                <svg width="20" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l12.8 8.5a1 1 0 010 1.6l-12.8 8.5c-.66.5-1.6.03-1.6-.8z" fill="#fff" /></svg>
                <div>
                  <div className="text-[9px] text-white/60">Disponible sur</div>
                  <div className="text-[14px] font-semibold text-white">Google Play</div>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-navy/30 mt-3">iOS 15+ et Android 12+. Gratuit.</p>
          </div>
        </div>
      </section>

      <SlantDivider color="#ffffff" />

      {/* ══════════════════════════════════════════════════
          SECTION 6 — TÉMOIGNAGES
          1 avis mis en avant (large) + 2 avis empilés
      ══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-5 md:px-10 bg-bgPage">
        <div data-reveal className="reveal-up max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-[32px] md:text-[38px] font-extrabold text-navy mb-3">Ils nous font confiance</h2>
            <p className="text-[16px] text-navy/50">Des particuliers satisfaits partout en France.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Témoignage principal (occupe 2 colonnes) */}
            <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-[17px] text-navy/70 leading-relaxed mb-6 max-w-[520px]">
                &ldquo;Le séquestre m&apos;a rassurée. Je savais que mon argent était protégé tant que l&apos;intervention n&apos;était pas terminée. L&apos;artisan était ponctuel, professionnel, et le suivi en temps réel m&apos;a permis de voir exactement quand il arrivait.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-surface to-border flex items-center justify-center text-sm font-bold text-forest">CL</div>
                <div>
                  <div className="text-[14px] font-bold text-navy">Caroline L.</div>
                  <div className="text-[12px] text-navy/40">Paris 4e — Plomberie</div>
                </div>
              </div>
            </div>

            {/* Témoignages secondaires empilés */}
            <div className="flex flex-col gap-5">
              {[
                { name: "Pierre M.", city: "Lyon 6e", service: "Urgence", text: "Fuite d'eau un dimanche soir, intervention en 1h30. Le suivi en temps réel est top." },
                { name: "Amélie R.", city: "Bordeaux", service: "Électricité", text: "J'ai signé le devis en ligne, payé en 3x. Aucune surprise sur la facture." },
              ].map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm hover:shadow-md transition-shadow flex-1">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-[13px] text-navy/60 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-surface to-border flex items-center justify-center text-[10px] font-bold text-forest">
                      {t.name[0]}{t.name.split(" ")[1]?.[0]}
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-navy">{t.name}</div>
                      <div className="text-[10px] text-navy/35">{t.city} — {t.service}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SlantDivider color="#F5FAF7" flip />

      {/* ══════════════════════════════════════════════════
          SECTION 7 — CTA FINAL
          Appel à l'action pour créer un compte (fond vert dégradé)
      ══════════════════════════════════════════════════ */}
      <section data-navbar-dark className="relative pt-32 pb-24 px-5 md:px-10 text-center overflow-hidden" style={{ background: "linear-gradient(160deg, #0A4030 0%, #1B6B4E 50%, #2D9B6E 100%)" }}>
        {/* Effets lumineux décoratifs */}
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[8%] w-[300px] h-[300px] rounded-full bg-white/[0.03] blur-[80px]" />
          <div className="absolute bottom-[10%] right-[12%] w-[350px] h-[350px] rounded-full bg-gold/[0.03] blur-[100px]" />
        </div>

        <div data-reveal className="reveal-up relative z-10 max-w-[600px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] rounded-lg px-4 py-2 mb-6 text-[12px] font-semibold text-white/70">
            <Shield className="w-3.5 h-3.5" /> 100% gratuit, sans engagement
          </div>
          <h2 className="font-heading text-[32px] md:text-[44px] font-extrabold text-white mb-4 leading-[1.1]" style={{ textWrap: "balance" as never }}>
            Prêt à trouver votre artisan de confiance ?
          </h2>
          <p className="text-[16px] text-white/55 mb-9 leading-relaxed">
            Rejoignez des milliers de particuliers qui font confiance à Nova pour leurs travaux.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-white text-deepForest text-[15px] font-bold shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              Créer un compte gratuitement
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/devenir-partenaire"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/[0.08] border border-white/[0.15] text-white text-[15px] font-semibold hover:bg-white/[0.12] active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              Je suis artisan
            </Link>
          </div>
          <p className="text-[11px] text-white/35 mt-6">Aucune carte bancaire requise</p>
        </div>
      </section>
    </div>
  );
}

/** Icône carte de crédit (utilisée dans la visualisation du flux séquestre) */
function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-lightSage" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
