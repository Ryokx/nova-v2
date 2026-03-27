/**
 * Page d'aperçu plein écran du site vitrine artisan.
 * Ouverte dans un nouvel onglet depuis l'éditeur (artisan-website).
 * Lit les données depuis localStorage ("nova-website-preview") et écoute
 * les changements en temps réel via l'événement StorageEvent.
 *
 * Affiche le site complet avec :
 * - Navbar, Hero, Barre de confiance
 * - Services, Galerie, Témoignages
 * - Section contact avec formulaire
 * - Footer
 *
 * Le thème (couleurs, police, style hero) est appliqué dynamiquement.
 */
"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Phone, Mail, MapPin, Clock, Star, Sparkles,
  ChevronRight, Shield, FileText, ArrowRight,
} from "lucide-react";
import { Image as ImageIcon } from "lucide-react";

/* Types partagés avec l'éditeur */
interface ServiceItem { label: string; active: boolean; priceMin: string; priceMax: string; }
interface Testimonial { id: string; name: string; text: string; rating: number; }
interface Schedule { label: string; enabled: boolean; open: string; close: string; }

/* Données complètes du site transmises via localStorage */
interface SiteData {
  companyName: string;
  slogan: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  services: ServiceItem[];
  schedule: Schedule[];
  theme: string;
  font: string;
  cover: string;
  testimonials: Testimonial[];
  galleryCount: number;
}

/* Thèmes de couleur (identiques à l'éditeur) */
const THEMES: Record<string, { label: string; color: string; bg: string; accent: string }> = {
  vert: { label: "Vert Nova", color: "#1B6B4E", bg: "#F5FAF7", accent: "#2D9B6E" },
  bleu: { label: "Bleu Pro", color: "#1E40AF", bg: "#EFF6FF", accent: "#3B82F6" },
  noir: { label: "Noir Elegant", color: "#18181B", bg: "#FAFAFA", accent: "#52525B" },
  blanc: { label: "Blanc Epure", color: "#0F172A", bg: "#FFFFFF", accent: "#64748B" },
  orange: { label: "Orange Energie", color: "#C2410C", bg: "#FFF7ED", accent: "#F97316" },
};

/* Polices disponibles */
const FONTS: Record<string, { family: string }> = {
  moderne: { family: "'DM Sans', sans-serif" },
  classique: { family: "Georgia, serif" },
  elegant: { family: "'Playfair Display', serif" },
};

export default function WebsitePreviewPage() {
  /* Données du site chargées depuis localStorage */
  const [data, setData] = useState<SiteData | null>(null);

  /* Charge les données au montage et écoute les mises à jour en temps réel */
  useEffect(() => {
    const raw = localStorage.getItem("nova-website-preview");
    if (raw) {
      try { setData(JSON.parse(raw)); } catch { /* ignore */ }
    }
    /* Écoute les changements depuis l'onglet éditeur */
    const handler = (e: StorageEvent) => {
      if (e.key === "nova-website-preview" && e.newValue) {
        try { setData(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /* Résolution du thème et de la police sélectionnés */
  const t = (THEMES[data?.theme ?? "vert"] ?? THEMES.vert)!;
  const f = (FONTS[data?.font ?? "moderne"] ?? FONTS.moderne)!;

  /* Style dynamique du hero selon le type de couverture */
  const heroStyle = useMemo(() => {
    const cover = data?.cover;
    if (cover === "photo") return { background: `linear-gradient(135deg, ${t.color}dd 0%, ${t.color}99 100%)` };
    if (cover === "gradient") return { background: `linear-gradient(135deg, ${t.color} 0%, ${t.accent} 100%)` };
    return { background: t.bg, borderBottom: `2px solid ${t.color}20` };
  }, [data?.cover, t]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Chargement de l&apos;apercu...</p>
      </div>
    );
  }

  const activeServices = data.services.filter((s) => s.active);
  const activeSchedule = data.schedule.filter((s) => s.enabled);
  const isMinimal = data.cover === "minimal";

  return (
    <div style={{ fontFamily: f.family, background: t.bg }} className="min-h-screen">
      {/* ━━━ Navbar ━━━ */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: isMinimal ? `${t.bg}ee` : `${t.color}f5`, borderColor: `${t.color}15` }}>
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[5px] flex items-center justify-center text-white font-bold text-lg" style={{ background: isMinimal ? t.color : "rgba(255,255,255,0.15)" }}>
              {data.companyName.charAt(0).toUpperCase() || "N"}
            </div>
            <span className={cn("text-lg font-bold", isMinimal ? "" : "text-white")} style={isMinimal ? { color: t.color } : undefined}>
              {data.companyName}
            </span>
          </div>
          <div className="flex items-center gap-8">
            {["Services", "Realisations", "Avis", "Contact"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className={cn("text-sm font-medium transition-colors hover:opacity-100", isMinimal ? "text-gray-600 hover:text-gray-900" : "text-white/70 hover:text-white")}>
                {link}
              </a>
            ))}
            <a href="#contact" className="px-5 py-2.5 rounded-[5px] text-sm font-bold text-white transition-colors" style={{ background: t.accent }}>
              Devis gratuit
            </a>
          </div>
        </div>
      </nav>

      {/* ━━━ Hero ━━━ */}
      <section style={heroStyle} className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="max-w-[650px]">
            <h1 className={cn("text-[42px] font-extrabold leading-[1.1] mb-4", isMinimal ? "" : "text-white")} style={isMinimal ? { color: t.color } : undefined}>
              {data.companyName || "Nom de l'entreprise"}
            </h1>
            <p className={cn("text-xl mb-3", isMinimal ? "text-gray-500" : "text-white/80")}>
              {data.slogan || "Votre slogan ici"}
            </p>
            {data.description && (
              <p className={cn("text-base leading-relaxed mb-8", isMinimal ? "text-gray-600" : "text-white/60")}>
                {data.description}
              </p>
            )}
            <div className="flex gap-3">
              <a href="#contact" className="px-8 py-3.5 rounded-[5px] text-base font-bold text-white inline-flex items-center gap-2" style={{ background: t.accent }}>
                Demander un devis <ArrowRight className="w-4 h-4" />
              </a>
              {data.phone && (
                <a href={`tel:${data.phone}`} className={cn("px-8 py-3.5 rounded-[5px] text-base font-medium border inline-flex items-center gap-2", isMinimal ? "text-gray-700 border-gray-300" : "text-white border-white/30")}>
                  <Phone className="w-4 h-4" /> Appeler
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Trust bar ━━━ */}
      <section className="border-b py-5 px-6" style={{ borderColor: `${t.color}10`, background: `${t.color}04` }}>
        <div className="max-w-[1100px] mx-auto flex items-center justify-center gap-10">
          {[
            { icon: Shield, label: "Artisan certifie Nova" },
            { icon: FileText, label: "Devis gratuit sous 24h" },
            { icon: Star, label: "Avis clients verifies" },
            { icon: Clock, label: "Intervention rapide" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon className="w-4 h-4" style={{ color: t.accent }} />
              <span className="text-sm font-medium" style={{ color: t.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ Services ━━━ */}
      {activeServices.length > 0 && (
        <section id="services" className="py-16 px-6">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[28px] font-extrabold mb-2" style={{ color: t.color }}>Nos services</h2>
            <p className="text-base text-gray-500 mb-8">Decouvrez nos prestations et tarifs indicatifs</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeServices.map((s) => (
                <div key={s.label} className="rounded-[5px] border p-6 transition-all hover:shadow-md" style={{ borderColor: `${t.color}15`, background: `${t.color}03` }}>
                  <div className="w-10 h-10 rounded-[5px] flex items-center justify-center mb-4" style={{ background: `${t.color}10` }}>
                    <Sparkles className="w-5 h-5" style={{ color: t.accent }} />
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: t.color }}>{s.label}</h3>
                  {s.priceMin && s.priceMax && (
                    <p className="text-sm font-mono" style={{ color: t.accent }}>
                      A partir de {s.priceMin} EUR
                    </p>
                  )}
                  <a href="#contact" className="inline-flex items-center gap-1 mt-3 text-sm font-medium" style={{ color: t.accent }}>
                    Demander un devis <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ Gallery ━━━ */}
      {data.galleryCount > 0 && (
        <section id="realisations" className="py-16 px-6" style={{ background: `${t.color}04` }}>
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[28px] font-extrabold mb-2" style={{ color: t.color }}>Nos realisations</h2>
            <p className="text-base text-gray-500 mb-8">Quelques exemples de nos interventions</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: Math.min(data.galleryCount, 8) }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-[5px] flex items-center justify-center" style={{ background: `${t.color}08` }}>
                  <ImageIcon className="w-8 h-8" style={{ color: `${t.color}25` }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ Testimonials ━━━ */}
      {data.testimonials.length > 0 && (
        <section id="avis" className="py-16 px-6">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[28px] font-extrabold mb-2" style={{ color: t.color }}>Ce que disent nos clients</h2>
            <p className="text-base text-gray-500 mb-8">Avis verifies sur la plateforme Nova</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.testimonials.map((review) => (
                <div key={review.id} className="rounded-[5px] border p-6" style={{ borderColor: `${t.color}10`, background: `${t.color}02` }}>
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={cn("w-4 h-4", s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">&laquo; {review.text} &raquo;</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: t.accent }}>
                      {review.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: t.color }}>{review.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ Contact / CTA ━━━ */}
      <section id="contact" className="py-16 px-6" style={{ background: `${t.color}06` }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-[28px] font-extrabold mb-2" style={{ color: t.color }}>Contactez-nous</h2>
              <p className="text-base text-gray-500 mb-6">Devis gratuit et sans engagement</p>
              <div className="space-y-4">
                {data.phone && (
                  <a href={`tel:${data.phone}`} className="flex items-center gap-3 text-base" style={{ color: t.color }}>
                    <div className="w-10 h-10 rounded-[5px] flex items-center justify-center" style={{ background: `${t.color}10` }}>
                      <Phone className="w-5 h-5" style={{ color: t.accent }} />
                    </div>
                    {data.phone}
                  </a>
                )}
                {data.email && (
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-base" style={{ color: t.color }}>
                    <div className="w-10 h-10 rounded-[5px] flex items-center justify-center" style={{ background: `${t.color}10` }}>
                      <Mail className="w-5 h-5" style={{ color: t.accent }} />
                    </div>
                    {data.email}
                  </a>
                )}
                {data.address && (
                  <div className="flex items-center gap-3 text-base" style={{ color: t.color }}>
                    <div className="w-10 h-10 rounded-[5px] flex items-center justify-center" style={{ background: `${t.color}10` }}>
                      <MapPin className="w-5 h-5" style={{ color: t.accent }} />
                    </div>
                    {data.address}
                  </div>
                )}
              </div>

              {activeSchedule.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-3" style={{ color: t.color }}>Horaires</h3>
                  <div className="space-y-2">
                    {activeSchedule.map((s) => (
                      <div key={s.label} className="flex justify-between text-sm py-1.5 border-b" style={{ borderColor: `${t.color}08` }}>
                        <span style={{ color: t.color }}>{s.label}</span>
                        <span className="font-mono" style={{ color: t.accent }}>{s.open} - {s.close}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact form placeholder */}
            <div className="rounded-[5px] border p-8" style={{ background: "#fff", borderColor: `${t.color}12` }}>
              <h3 className="text-lg font-bold mb-5" style={{ color: t.color }}>Demande de devis</h3>
              <div className="space-y-3">
                <input placeholder="Votre nom" className="w-full px-4 py-3 rounded-[5px] border text-sm" style={{ borderColor: `${t.color}15` }} readOnly />
                <input placeholder="Email" className="w-full px-4 py-3 rounded-[5px] border text-sm" style={{ borderColor: `${t.color}15` }} readOnly />
                <input placeholder="Telephone" className="w-full px-4 py-3 rounded-[5px] border text-sm" style={{ borderColor: `${t.color}15` }} readOnly />
                <textarea placeholder="Decrivez votre besoin..." rows={4} className="w-full px-4 py-3 rounded-[5px] border text-sm resize-none" style={{ borderColor: `${t.color}15` }} readOnly />
                <button className="w-full py-3.5 rounded-[5px] text-white text-sm font-bold" style={{ background: t.accent }}>
                  Envoyer ma demande
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="py-10 px-6" style={{ background: t.color }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[5px] flex items-center justify-center text-sm font-bold" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
                {data.companyName.charAt(0).toUpperCase() || "N"}
              </div>
              <span className="text-white font-bold">{data.companyName}</span>
            </div>
            <div className="flex items-center gap-6">
              {["Services", "Realisations", "Avis", "Contact"].map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-white/50 hover:text-white/80 transition-colors">{link}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-5 flex items-center justify-between">
            <span className="text-xs text-white/30">{new Date().getFullYear()} {data.companyName}. Tous droits reserves.</span>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Sparkles className="w-3 h-3" /> Site propulse par Nova
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
