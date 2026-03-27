/**
 * Page "Mon site web" artisan (~1300 lignes).
 * Éditeur WYSIWYG complet pour créer un site vitrine personnalisé :
 *
 * SECTIONS ÉDITABLES :
 * 1. Informations générales (nom, slogan, description, logo)
 * 2. Coordonnées (téléphone, email, adresse, horaires)
 * 3. Services proposés (avec fourchettes de prix)
 * 4. Galerie photos (ajout/suppression, max 12)
 * 5. Témoignages clients (import auto Nova + ajout manuel)
 * 6. Apparence (thème couleur, police, style de couverture)
 * 7. Domaine (sous-domaine Nova + domaine personnalisé premium)
 *
 * COMPOSANTS INTERNES :
 * - SectionCard : carte pliable pour chaque section
 * - TextInput, FieldLabel : champs de formulaire réutilisables
 * - Toggle : interrupteur on/off
 * - StarRating : notation étoiles cliquable
 * - LivePreview : aperçu en temps réel (desktop/mobile)
 *
 * Le panneau droit affiche un aperçu live qui se met à jour en temps réel.
 * Un bouton "Publier" en bas fixe déploie le site sur un sous-domaine Nova.
 */
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Globe,
  Upload,
  Image as ImageIcon,
  Plus,
  X,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  Eye,
  Smartphone,
  Monitor,
  Check,
  ExternalLink,
  Share2,
  GripVertical,
  Sparkles,
  ChevronDown,
  Link2,
  Crown,
  Palette,
  MessageSquareQuote,
  Camera,
  Briefcase,
  Info,
  Trash2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/* Service proposé par l'artisan (affiché sur le site) */
interface ServiceItem {
  label: string;
  active: boolean;
  priceMin: string;
  priceMax: string;
}

/* Témoignage client affiché sur le site */
interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

/* Horaires d'ouverture */
interface Schedule {
  label: string;
  enabled: boolean;
  open: string;
  close: string;
}

/* Clés de personnalisation d'apparence */
type ThemeKey = "vert" | "bleu" | "noir" | "blanc" | "orange";
type FontKey = "moderne" | "classique" | "elegant";
type CoverKey = "photo" | "gradient" | "minimal";
type PreviewMode = "mobile" | "desktop";

/* ------------------------------------------------------------------ */
/*  Constantes de configuration                                        */
/* ------------------------------------------------------------------ */

/* Thèmes de couleur disponibles */
const THEMES: Record<ThemeKey, { label: string; color: string; bg: string; accent: string }> = {
  vert: { label: "Vert Nova", color: "#1B6B4E", bg: "#F5FAF7", accent: "#2D9B6E" },
  bleu: { label: "Bleu Pro", color: "#1E40AF", bg: "#EFF6FF", accent: "#3B82F6" },
  noir: { label: "Noir Élégant", color: "#18181B", bg: "#FAFAFA", accent: "#52525B" },
  blanc: { label: "Blanc Épuré", color: "#0F172A", bg: "#FFFFFF", accent: "#64748B" },
  orange: { label: "Orange Énergie", color: "#C2410C", bg: "#FFF7ED", accent: "#F97316" },
};

/* Polices disponibles */
const FONTS: Record<FontKey, { label: string; family: string }> = {
  moderne: { label: "Moderne", family: "'DM Sans', sans-serif" },
  classique: { label: "Classique", family: "Georgia, serif" },
  elegant: { label: "Élégant", family: "'Playfair Display', serif" },
};

/* Styles de couverture hero */
const COVER_STYLES: Record<CoverKey, string> = {
  photo: "Photo plein écran",
  gradient: "Dégradé",
  minimal: "Minimaliste",
};

/* Services par défaut */
const DEFAULT_SERVICES: ServiceItem[] = [
  { label: "Plomberie", active: true, priceMin: "60", priceMax: "200" },
  { label: "Chauffage", active: true, priceMin: "80", priceMax: "350" },
  { label: "Climatisation", active: false, priceMin: "", priceMax: "" },
  { label: "Électricité", active: false, priceMin: "", priceMax: "" },
  { label: "Serrurerie", active: false, priceMin: "", priceMax: "" },
  { label: "Rénovation", active: false, priceMin: "", priceMax: "" },
  { label: "Salle de bain", active: false, priceMin: "", priceMax: "" },
  { label: "Cuisine", active: false, priceMin: "", priceMax: "" },
];

/* Horaires par défaut */
const DEFAULT_SCHEDULE: Schedule[] = [
  { label: "Lun - Ven", enabled: true, open: "08:00", close: "18:00" },
  { label: "Samedi", enabled: true, open: "09:00", close: "14:00" },
  { label: "Dimanche", enabled: false, open: "09:00", close: "12:00" },
];

/* Témoignages par défaut */
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Marie Dupont",
    text: "Intervention rapide et très professionnelle. Je recommande vivement !",
    rating: 5,
  },
  {
    id: "2",
    name: "Pierre Martin",
    text: "Excellent travail sur la rénovation de ma salle de bain. Propre et soigné.",
    rating: 4,
  },
];

/* ------------------------------------------------------------------ */
/*  Sous-composants réutilisables                                      */
/* ------------------------------------------------------------------ */

/* Carte pliable pour chaque section de l'éditeur */
function SectionCard({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-[5px] shadow-sm border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[5px] bg-surface flex items-center justify-center text-forest">
            <Icon size={20} />
          </div>
          <h3 className="font-heading font-bold text-navy text-[15px]">{title}</h3>
        </div>
        <ChevronDown
          size={20}
          className={cn("text-grayText transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">{children}</div>}
    </div>
  );
}

/* Label de champ de formulaire */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[13px] font-medium text-navy mb-1.5">{children}</label>;
}

/* Champ texte réutilisable avec styles Nova */
function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  readOnly?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        "w-full px-5 py-2.5 rounded-[5px] border border-border bg-white text-navy text-[15px]",
        "placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest",
        "transition-all duration-200",
        readOnly && "bg-surface cursor-default",
        className,
      )}
    />
  );
}

/* Interrupteur on/off réutilisable */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0",
        checked ? "bg-forest" : "bg-gray-200",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

/* Composant notation étoiles (cliquable si onChange fourni) */
function StarRating({
  rating,
  onChange,
  size = 16,
}: {
  rating: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          className={cn("transition-colors", onChange && "cursor-pointer hover:scale-110")}
        >
          <Star
            size={size}
            className={cn(i <= rating ? "text-gold fill-gold" : "text-gray-200")}
          />
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant d'aperçu en direct du site                              */
/* ------------------------------------------------------------------ */

/* Prévisualisation miniature du site (desktop ou mobile) */
function LivePreview({
  mode,
  companyName,
  slogan,
  description,
  phone,
  email,
  address,
  services,
  schedule,
  theme,
  font,
  cover,
  testimonials,
  galleryCount,
}: {
  mode: PreviewMode;
  companyName: string;
  slogan: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  services: ServiceItem[];
  schedule: Schedule[];
  theme: ThemeKey;
  font: FontKey;
  cover: CoverKey;
  testimonials: Testimonial[];
  galleryCount: number;
}) {
  const t = THEMES[theme];
  const f = FONTS[font];
  const activeServices = services.filter((s) => s.active);

  const heroStyle = useMemo(() => {
    if (cover === "photo") {
      return {
        background: `linear-gradient(135deg, ${t.color}dd 0%, ${t.color}99 100%)`,
      };
    }
    if (cover === "gradient") {
      return {
        background: `linear-gradient(135deg, ${t.color} 0%, ${t.accent} 100%)`,
      };
    }
    return { background: t.bg, borderBottom: `2px solid ${t.color}20` };
  }, [cover, t]);

  const isMinimal = cover === "minimal";
  const isMobile = mode === "mobile";
  const activeSchedule = schedule.filter((s) => s.enabled);

  return (
    <div
      className={cn(
        "rounded-[5px] overflow-hidden border shadow-sm transition-all duration-300",
        isMobile ? "max-w-[320px] mx-auto" : "w-full",
      )}
      style={{ fontFamily: f.family, background: t.bg, borderColor: `${t.color}15` }}
    >
      {/* ━━━ Navbar ━━━ */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: isMinimal ? t.bg : t.color, borderBottom: `1px solid ${t.color}15` }}>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-[3px] flex items-center justify-center text-[11px] font-bold"
            style={{ background: isMinimal ? t.color : "rgba(255,255,255,0.15)", color: isMinimal ? "#fff" : "#fff" }}
          >
            {companyName.charAt(0).toUpperCase() || "N"}
          </div>
          <span className={cn("text-[11px] font-bold", isMinimal ? "" : "text-white")} style={isMinimal ? { color: t.color } : undefined}>
            {companyName || "Mon entreprise"}
          </span>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-3">
            {["Services", "Réalisations", "Avis", "Contact"].map((link) => (
              <span key={link} className={cn("text-[9px] font-medium", isMinimal ? "text-gray-500" : "text-white/70")}>{link}</span>
            ))}
            <div className="px-2.5 py-1 rounded-[3px] text-[9px] font-bold text-white" style={{ background: t.accent }}>
              Devis gratuit
            </div>
          </div>
        )}
      </div>

      {/* ━━━ Hero ━━━ */}
      <div style={heroStyle} className={cn(isMobile ? "px-4 py-8" : "px-6 py-10")}>
        <div className={cn(isMobile ? "" : "max-w-[70%]")}>
          <h2
            className={cn("font-bold leading-tight mb-1.5", isMinimal ? "" : "text-white", isMobile ? "text-[16px]" : "text-[20px]")}
            style={isMinimal ? { color: t.color } : undefined}
          >
            {companyName || "Nom de l'entreprise"}
          </h2>
          <p className={cn("mb-2", isMinimal ? "text-gray-500" : "text-white/80", isMobile ? "text-[11px]" : "text-[12px]")}>
            {slogan || "Votre slogan ici"}
          </p>
          {description && (
            <p className={cn("leading-relaxed line-clamp-2 mb-3", isMinimal ? "text-gray-600" : "text-white/60", isMobile ? "text-[10px]" : "text-[11px]")}>
              {description}
            </p>
          )}
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-[3px] text-[10px] font-bold text-white" style={{ background: t.accent }}>
              Demander un devis
            </div>
            <div className={cn("px-3 py-1.5 rounded-[3px] text-[10px] font-medium border", isMinimal ? "text-gray-600 border-gray-300" : "text-white border-white/30")}>
              Appeler
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ Trust bar ━━━ */}
      <div className="flex items-center justify-center gap-4 py-2.5 border-b" style={{ borderColor: `${t.color}10`, background: `${t.color}04` }}>
        {[
          { label: "Certifié Nova", icon: "shield" },
          { label: "Devis gratuit", icon: "file" },
          { label: "Avis vérifiés", icon: "star" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <Check size={8} style={{ color: t.accent }} />
            <span className="text-[8px] font-semibold" style={{ color: t.color }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ━━━ Services grid ━━━ */}
      {activeServices.length > 0 && (
        <div className={cn("p-4", isMobile ? "" : "px-6")}>
          <h3 className="text-[11px] font-bold mb-2.5 uppercase tracking-wider" style={{ color: t.color }}>
            Nos services
          </h3>
          <div className={cn("grid gap-2", isMobile ? "grid-cols-2" : "grid-cols-3")}>
            {activeServices.map((s) => (
              <div
                key={s.label}
                className="rounded-[3px] p-2.5 border"
                style={{ background: `${t.color}04`, borderColor: `${t.color}10` }}
              >
                <div className="text-[10px] font-semibold mb-0.5" style={{ color: t.color }}>{s.label}</div>
                {s.priceMin && s.priceMax && (
                  <div className="text-[9px] font-mono" style={{ color: t.accent }}>
                    {s.priceMin} - {s.priceMax} EUR
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ Gallery ━━━ */}
      {galleryCount > 0 && (
        <div className={cn("px-4 pb-3", isMobile ? "" : "px-6")}>
          <h3 className="text-[11px] font-bold mb-2.5 uppercase tracking-wider" style={{ color: t.color }}>
            Réalisations
          </h3>
          <div className={cn("grid gap-1.5", isMobile ? "grid-cols-3" : "grid-cols-4")}>
            {Array.from({ length: Math.min(galleryCount, isMobile ? 6 : 8) }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-[3px] flex items-center justify-center"
                style={{ background: `${t.color}06` }}
              >
                <ImageIcon size={12} style={{ color: `${t.color}30` }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ Testimonials ━━━ */}
      {testimonials.length > 0 && (
        <div className={cn("px-4 pb-3", isMobile ? "" : "px-6")}>
          <h3 className="text-[11px] font-bold mb-2.5 uppercase tracking-wider" style={{ color: t.color }}>
            Avis clients
          </h3>
          <div className={cn("grid gap-2", isMobile ? "grid-cols-1" : "grid-cols-2")}>
            {testimonials.slice(0, isMobile ? 2 : 4).map((t2) => (
              <div
                key={t2.id}
                className="rounded-[3px] p-3 border"
                style={{ background: `${t.color}03`, borderColor: `${t.color}08` }}
              >
                <div className="flex mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={8} className={cn(s <= t2.rating ? "text-gold fill-gold" : "text-gray-200")} />
                  ))}
                </div>
                <p className="text-[9px] text-gray-500 line-clamp-2 mb-1.5">{t2.text}</p>
                <span className="text-[9px] font-semibold" style={{ color: t.color }}>{t2.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ Contact / Footer ━━━ */}
      <div className="p-4 border-t" style={{ background: t.color, borderColor: `${t.color}20` }}>
        <div className={cn(isMobile ? "" : "flex justify-between")}>
          <div>
            <h3 className="text-[11px] font-bold text-white mb-2">Contact</h3>
            <div className="space-y-1">
              {phone && (
                <div className="flex items-center gap-1.5 text-[9px] text-white/70">
                  <Phone size={8} className="text-white/50" /> {phone}
                </div>
              )}
              {email && (
                <div className="flex items-center gap-1.5 text-[9px] text-white/70">
                  <Mail size={8} className="text-white/50" /> {email}
                </div>
              )}
              {address && (
                <div className="flex items-center gap-1.5 text-[9px] text-white/70">
                  <MapPin size={8} className="text-white/50" /> {address}
                </div>
              )}
            </div>
          </div>
          {activeSchedule.length > 0 && !isMobile && (
            <div>
              <h3 className="text-[11px] font-bold text-white mb-2">Horaires</h3>
              {activeSchedule.map((s) => (
                <div key={s.label} className="flex gap-4 text-[9px] text-white/70 py-0.5">
                  <span className="w-14">{s.label}</span>
                  <span className="font-mono">{s.open} - {s.close}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3 pt-2.5 border-t border-white/10 text-[8px] text-white/30">
          <Sparkles size={7} />
          Site propulsé par Nova
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page principale de l'éditeur de site                               */
/* ------------------------------------------------------------------ */

export default function ArtisanWebsitePage() {
  /* --- Informations générales --- */
  const [companyName, setCompanyName] = useState("Jean-Michel Plomberie");
  const [slogan, setSlogan] = useState("Votre plombier de confiance depuis 2010");
  const [description, setDescription] = useState(
    "Artisan plombier-chauffagiste certifié, intervenant sur Paris et Île-de-France. Plus de 15 ans d'expérience au service de votre confort.",
  );
  const [hasLogo, setHasLogo] = useState(false);

  /* --- Coordonnées --- */
  const [phone, setPhone] = useState("06 12 34 56 78");
  const [email, setEmail] = useState("contact@jm-plomberie.fr");
  const [address, setAddress] = useState("42 rue des Artisans, 75011 Paris");
  const [schedule, setSchedule] = useState<Schedule[]>(DEFAULT_SCHEDULE);

  /* --- Services proposés --- */
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);

  /* --- Galerie photos --- */
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(["mock1", "mock2", "mock3", "mock4"]);

  /* --- Témoignages clients --- */
  const [autoImportReviews, setAutoImportReviews] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [newTestimonialName, setNewTestimonialName] = useState("");
  const [newTestimonialText, setNewTestimonialText] = useState("");
  const [newTestimonialRating, setNewTestimonialRating] = useState(5);

  /* --- Apparence (thème, police, couverture) --- */
  const [theme, setTheme] = useState<ThemeKey>("vert");
  const [font, setFont] = useState<FontKey>("moderne");
  const [cover, setCover] = useState<CoverKey>("gradient");

  /* --- Domaine personnalisé (premium) --- */
  const [customDomainEnabled, setCustomDomainEnabled] = useState(false);
  const [customDomain, setCustomDomain] = useState("");

  /* --- Aperçu et publication --- */
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [isPublished, setIsPublished] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  /* Génère le sous-domaine à partir du nom d'entreprise */
  const subdomain = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const siteUrl = `${subdomain || "mon-entreprise"}.nova-artisan.fr`;

  /* --- Handlers de mise à jour --- */

  /* Bascule l'activation d'un service */
  function toggleService(idx: number) {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, active: !s.active } : s)),
    );
  }

  /* Met à jour la fourchette de prix d'un service */
  function updateServicePrice(idx: number, field: "priceMin" | "priceMax", val: string) {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    );
  }

  /* Met à jour un champ d'horaire */
  function updateSchedule(idx: number, field: keyof Schedule, val: string | boolean) {
    setSchedule((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    );
  }

  /* Ajoute un témoignage manuellement */
  function addTestimonial() {
    if (!newTestimonialName.trim() || !newTestimonialText.trim()) return;
    setTestimonials((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newTestimonialName,
        text: newTestimonialText,
        rating: newTestimonialRating,
      },
    ]);
    setNewTestimonialName("");
    setNewTestimonialText("");
    setNewTestimonialRating(5);
  }

  function removeTestimonial(id: string) {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  }

  function addGalleryPhoto() {
    if (galleryPhotos.length >= 12) return;
    setGalleryPhotos((prev) => [...prev, `mock${prev.length + 1}`]);
  }

  function removeGalleryPhoto(idx: number) {
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  /* Sauvegarde les données dans localStorage pour la page preview */
  function savePreviewData() {
    const previewData = {
      companyName, slogan, description, phone, email, address,
      services, schedule, theme, font, cover, testimonials,
      galleryCount: galleryPhotos.length,
    };
    localStorage.setItem("nova-website-preview", JSON.stringify(previewData));
  }

  /* Ouvre l'aperçu plein écran dans un nouvel onglet */
  function openFullPreview() {
    savePreviewData();
    window.open("/artisan-website/preview", "_blank");
  }

  /* Simule la publication du site (en prod : POST /api/website/publish) */
  function handlePublish() {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setIsPublished(true);
      setShowPublishModal(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 1500);
  }

  return (
    <>
      <div className="min-h-screen bg-bgPage pb-24">
        {/* Header */}
        <div className="bg-white border-b border-border">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-deepForest to-forest flex items-center justify-center">
                  <Globe size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-heading font-extrabold text-navy text-[28px]">Mon site web</h1>
                  <p className="text-[15px] text-grayText">
                    Personnalisez votre vitrine en ligne
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "px-3 py-1.5 rounded-[5px] text-[13px] font-semibold",
                    isPublished
                      ? "bg-green-50 text-green-700"
                      : "bg-gold/10 text-gold",
                  )}
                >
                  {isPublished ? "En ligne" : "Brouillon"}
                </div>
                {isPublished && (
                  <a
                    href={`https://${siteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[15px] text-forest hover:underline"
                  >
                    {siteUrl}
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-[1320px] mx-auto px-5 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left panel -- Editor */}
            <div className="flex-1 min-w-0 space-y-4 lg:max-w-[60%]">
              {/* Section 1: General Info */}
              <SectionCard icon={Info} title="Informations générales">
                <div>
                  <FieldLabel>Nom de l&apos;entreprise</FieldLabel>
                  <TextInput
                    value={companyName}
                    onChange={setCompanyName}
                    placeholder="Ex: Dupont Plomberie"
                  />
                </div>
                <div>
                  <FieldLabel>Slogan / Accroche</FieldLabel>
                  <TextInput
                    value={slogan}
                    onChange={setSlogan}
                    placeholder="Votre plombier de confiance depuis 2010"
                  />
                </div>
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre activité en quelques lignes..."
                    rows={3}
                    className="w-full px-5 py-2.5 rounded-[5px] border border-border bg-white text-navy text-[15px] placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <FieldLabel>Logo</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setHasLogo(!hasLogo)}
                    className={cn(
                      "w-full py-8 rounded-[5px] border-2 border-dashed transition-all duration-200 flex flex-col items-center gap-2",
                      hasLogo
                        ? "border-forest bg-forest/5"
                        : "border-border hover:border-forest/50 hover:bg-surface/50",
                    )}
                  >
                    {hasLogo ? (
                      <>
                        <div className="w-14 h-14 rounded-[5px] bg-gradient-to-br from-deepForest to-forest flex items-center justify-center text-white font-bold text-xl">
                          {companyName.charAt(0) || "N"}
                        </div>
                        <span className="text-[13px] text-forest font-medium">
                          Logo importé -- Cliquer pour changer
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="text-grayText/40" />
                        <span className="text-[15px] text-grayText">
                          Cliquer pour importer votre logo
                        </span>
                        <span className="text-[13px] text-grayText/60">PNG, JPG, SVG -- max 2 Mo</span>
                      </>
                    )}
                  </button>
                </div>
              </SectionCard>

              {/* Section 2: Contact */}
              <SectionCard icon={Phone} title="Coordonnées">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Téléphone</FieldLabel>
                    <TextInput
                      value={phone}
                      onChange={setPhone}
                      placeholder="06 00 00 00 00"
                      type="tel"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <TextInput
                      value={email}
                      onChange={setEmail}
                      placeholder="contact@exemple.fr"
                      type="email"
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Adresse</FieldLabel>
                  <TextInput
                    value={address}
                    onChange={setAddress}
                    placeholder="12 rue Exemple, 75001 Paris"
                  />
                </div>
                <div>
                  <FieldLabel>Horaires d&apos;ouverture</FieldLabel>
                  <div className="space-y-2.5">
                    {schedule.map((s, idx) => (
                      <div key={s.label} className="flex items-center gap-3">
                        <Toggle
                          checked={s.enabled}
                          onChange={(v) => updateSchedule(idx, "enabled", v)}
                        />
                        <span className="text-[15px] text-navy font-medium w-20 flex-shrink-0">
                          {s.label}
                        </span>
                        {s.enabled ? (
                          <div className="flex items-center gap-2 text-[15px]">
                            <input
                              type="time"
                              value={s.open}
                              onChange={(e) => updateSchedule(idx, "open", e.target.value)}
                              className="px-2.5 py-1.5 rounded-[5px] border border-border text-navy text-[15px] focus:outline-none focus:ring-2 focus:ring-forest/20"
                            />
                            <span className="text-grayText">à</span>
                            <input
                              type="time"
                              value={s.close}
                              onChange={(e) => updateSchedule(idx, "close", e.target.value)}
                              className="px-2.5 py-1.5 rounded-[5px] border border-border text-navy text-[15px] focus:outline-none focus:ring-2 focus:ring-forest/20"
                            />
                          </div>
                        ) : (
                          <span className="text-[15px] text-grayText/60 italic">Fermé</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* Section 3: Services */}
              <SectionCard icon={Briefcase} title="Services proposés">
                <div className="space-y-2">
                  {services.map((s, idx) => (
                    <div
                      key={s.label}
                      className={cn(
                        "rounded-[5px] border p-3 transition-all duration-200",
                        s.active ? "border-forest/30 bg-forest/5" : "border-border bg-white",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Toggle
                            checked={s.active}
                            onChange={() => toggleService(idx)}
                          />
                          <span
                            className={cn(
                              "text-[15px] font-medium",
                              s.active ? "text-navy" : "text-grayText",
                            )}
                          >
                            {s.label}
                          </span>
                        </div>
                      </div>
                      {s.active && (
                        <div className="mt-3 ml-14 flex items-center gap-2">
                          <span className="text-[13px] text-grayText flex-shrink-0">
                            Fourchette de prix :
                          </span>
                          <input
                            type="text"
                            value={s.priceMin}
                            onChange={(e) =>
                              updateServicePrice(idx, "priceMin", e.target.value)
                            }
                            placeholder="Min"
                            className="w-20 px-2.5 py-1.5 rounded-[5px] border border-border text-[15px] text-navy text-center font-mono focus:outline-none focus:ring-2 focus:ring-forest/20"
                          />
                          <span className="text-grayText text-[13px]">à</span>
                          <input
                            type="text"
                            value={s.priceMax}
                            onChange={(e) =>
                              updateServicePrice(idx, "priceMax", e.target.value)
                            }
                            placeholder="Max"
                            className="w-20 px-2.5 py-1.5 rounded-[5px] border border-border text-[15px] text-navy text-center font-mono focus:outline-none focus:ring-2 focus:ring-forest/20"
                          />
                          <span className="text-[13px] text-grayText">EUR</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Section 4: Gallery */}
              <SectionCard icon={Camera} title="Galerie photos">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {galleryPhotos.map((_, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-[5px] bg-surface border border-border flex items-center justify-center group"
                    >
                      <ImageIcon size={20} className="text-grayText/30" />
                      <div className="absolute inset-0 rounded-[5px] bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => removeGalleryPhoto(idx)}
                          className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-red hover:bg-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="absolute top-1.5 left-1.5 text-grayText/30">
                        <GripVertical size={12} />
                      </div>
                    </div>
                  ))}
                  {galleryPhotos.length < 12 && (
                    <button
                      type="button"
                      onClick={addGalleryPhoto}
                      className="aspect-square rounded-[5px] border-2 border-dashed border-border hover:border-forest/50 hover:bg-surface/50 flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <Plus size={20} className="text-grayText/40" />
                      <span className="text-[10px] text-grayText">Ajouter</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-grayText/60">
                  <GripVertical size={12} />
                  Glissez pour réordonner -- {galleryPhotos.length}/12 photos
                </div>
              </SectionCard>

              {/* Section 5: Testimonials */}
              <SectionCard icon={MessageSquareQuote} title="Témoignages clients">
                <div className="flex items-center justify-between p-3 rounded-[5px] bg-surface">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-forest" />
                    <span className="text-[15px] text-navy font-medium">
                      Importer automatiquement les avis Nova
                    </span>
                  </div>
                  <Toggle
                    checked={autoImportReviews}
                    onChange={setAutoImportReviews}
                  />
                </div>

                {/* Existing testimonials */}
                <div className="space-y-2">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-start justify-between p-3 rounded-[5px] border border-border bg-white"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[15px] font-semibold text-navy">{t.name}</span>
                          <StarRating rating={t.rating} size={12} />
                        </div>
                        <p className="text-[13px] text-grayText line-clamp-2">{t.text}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(t.id)}
                        className="ml-2 p-1.5 rounded-[5px] hover:bg-red/10 text-grayText hover:text-red transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new */}
                <div className="p-5 rounded-[5px] border border-dashed border-border space-y-3">
                  <p className="text-[13px] font-semibold text-navy">
                    Ajouter un témoignage manuellement
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      value={newTestimonialName}
                      onChange={setNewTestimonialName}
                      placeholder="Nom du client"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-grayText flex-shrink-0">Note :</span>
                      <StarRating
                        rating={newTestimonialRating}
                        onChange={setNewTestimonialRating}
                      />
                    </div>
                  </div>
                  <textarea
                    value={newTestimonialText}
                    onChange={(e) => setNewTestimonialText(e.target.value)}
                    placeholder="Le témoignage du client..."
                    rows={2}
                    className="w-full px-5 py-2.5 rounded-[5px] border border-border bg-white text-navy text-[15px] placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all duration-200 resize-none"
                  />
                  <Button size="sm" variant="secondary" onClick={addTestimonial} className="px-5 py-2.5 rounded-[5px] text-sm">
                    <Plus size={16} />
                    Ajouter
                  </Button>
                </div>
              </SectionCard>

              {/* Section 6: Appearance */}
              <SectionCard icon={Palette} title="Apparence">
                {/* Theme */}
                <div>
                  <FieldLabel>Thème de couleur</FieldLabel>
                  <div className="flex gap-3">
                    {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(
                      ([key, t]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTheme(key)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 group",
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full border-2 transition-all",
                              theme === key
                                ? "border-forest scale-110 shadow-md"
                                : "border-transparent hover:scale-105",
                            )}
                            style={{ background: t.color }}
                          />
                          <span
                            className={cn(
                              "text-[10px] font-medium transition-colors",
                              theme === key ? "text-navy" : "text-grayText",
                            )}
                          >
                            {t.label}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Font */}
                <div>
                  <FieldLabel>Style de police</FieldLabel>
                  <div className="flex gap-2">
                    {(Object.entries(FONTS) as [FontKey, typeof FONTS[FontKey]][]).map(
                      ([key, f]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFont(key)}
                          className={cn(
                            "flex-1 py-4 px-5 rounded-[5px] border text-[15px] font-medium transition-all",
                            font === key
                              ? "border-forest bg-forest/5 text-forest"
                              : "border-border text-grayText hover:border-forest/30",
                          )}
                          style={{ fontFamily: f.family }}
                        >
                          {f.label}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Cover style */}
                <div>
                  <FieldLabel>Style de couverture</FieldLabel>
                  <div className="flex gap-2">
                    {(Object.entries(COVER_STYLES) as [CoverKey, string][]).map(
                      ([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCover(key)}
                          className={cn(
                            "flex-1 py-4 px-5 rounded-[5px] border text-[15px] font-medium transition-all",
                            cover === key
                              ? "border-forest bg-forest/5 text-forest"
                              : "border-border text-grayText hover:border-forest/30",
                          )}
                        >
                          {label}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Section 7: Domain */}
              <SectionCard icon={Link2} title="Domaine" defaultOpen={false}>
                <div>
                  <FieldLabel>Sous-domaine Nova</FieldLabel>
                  <div className="flex items-center gap-0">
                    <TextInput
                      value={subdomain || "mon-entreprise"}
                      readOnly
                      className="rounded-r-none border-r-0 font-mono text-forest"
                    />
                    <div className="px-5 py-2.5 rounded-r-[5px] border border-border bg-surface text-[15px] text-grayText font-mono whitespace-nowrap">
                      .nova-artisan.fr
                    </div>
                  </div>
                  <p className="mt-1.5 text-[13px] text-grayText">
                    Votre site sera accessible à l&apos;adresse{" "}
                    <span className="font-mono text-forest">{siteUrl}</span>
                  </p>
                </div>

                <div className="p-5 rounded-[5px] border border-border bg-surface/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown size={16} className="text-gold" />
                      <span className="text-[15px] font-medium text-navy">
                        Domaine personnalisé
                      </span>
                      <span className="px-2 py-0.5 rounded-[5px] bg-gold/10 text-gold text-[10px] font-bold">
                        PREMIUM
                      </span>
                    </div>
                    <Toggle
                      checked={customDomainEnabled}
                      onChange={setCustomDomainEnabled}
                    />
                  </div>
                  {customDomainEnabled && (
                    <div>
                      <TextInput
                        value={customDomain}
                        onChange={setCustomDomain}
                        placeholder="www.mon-entreprise.fr"
                      />
                      <p className="mt-1.5 text-[13px] text-grayText">
                        Configurez un enregistrement CNAME pointant vers{" "}
                        <span className="font-mono text-forest">proxy.nova-artisan.fr</span>
                      </p>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* Right panel -- Live Preview */}
            <div className="w-full lg:w-[40%] lg:flex-shrink-0">
              <div className="lg:sticky lg:top-6 space-y-3">
                {/* Preview controls */}
                <div className="bg-white rounded-[5px] shadow-sm border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-navy text-[15px]">Aperçu en direct</h3>
                    <div className="flex bg-surface rounded-[5px] p-0.5">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("desktop")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-[13px] font-medium transition-all",
                          previewMode === "desktop"
                            ? "bg-white shadow-sm text-navy"
                            : "text-grayText hover:text-navy",
                        )}
                      >
                        <Monitor size={15} />
                        Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("mobile")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-[13px] font-medium transition-all",
                          previewMode === "mobile"
                            ? "bg-white shadow-sm text-navy"
                            : "text-grayText hover:text-navy",
                        )}
                      >
                        <Smartphone size={15} />
                        Mobile
                      </button>
                    </div>
                  </div>

                  <LivePreview
                    mode={previewMode}
                    companyName={companyName}
                    slogan={slogan}
                    description={description}
                    phone={phone}
                    email={email}
                    address={address}
                    services={services}
                    schedule={schedule}
                    theme={theme}
                    font={font}
                    cover={cover}
                    testimonials={testimonials}
                    galleryCount={galleryPhotos.length}
                  />
                </div>

                {/* URL preview card */}
                <div className="bg-white rounded-[5px] shadow-sm border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={16} className="text-forest" />
                    <span className="text-[13px] font-semibold text-navy">
                      Adresse de votre site
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-[5px] bg-surface">
                    <span className="text-[13px] font-mono text-forest truncate">{siteUrl}</span>
                    <button
                      type="button"
                      className="flex-shrink-0 p-1 rounded-[5px] hover:bg-white transition-colors"
                      title="Copier"
                    >
                      <ExternalLink size={14} className="text-grayText" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar -- Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "px-3 py-1.5 rounded-[5px] text-[13px] font-semibold",
                isPublished ? "bg-green-50 text-green-700" : "bg-gold/10 text-gold",
              )}
            >
              {isPublished ? "En ligne" : "Brouillon"}
            </div>
            <span className="text-[13px] text-grayText">
              <Clock size={14} className="inline mr-1" />
              Dernière sauvegarde il y a 2 min
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="px-5 py-2.5 rounded-[5px] text-sm" onClick={openFullPreview}>
              <Eye size={16} />
              Aperçu plein écran
            </Button>
            <Button size="sm" onClick={handlePublish} loading={publishing} className="px-5 py-2.5 rounded-[5px] text-sm">
              <Globe size={16} />
              Publier
            </Button>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed right-4 sm:right-6 top-4 sm:top-6 z-[200] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-white rounded-[5px] shadow-lg border border-forest/20 p-5 flex items-center gap-3 min-w-[280px] sm:min-w-[340px]">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
              <Check size={20} className="text-success" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-bold text-navy">Site publié avec succès !</div>
              <div className="text-[13px] text-grayText mt-0.5">
                Accessible sur <span className="font-mono text-forest">{siteUrl}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="p-1 rounded-[5px] hover:bg-surface transition-colors shrink-0"
            >
              <X size={16} className="text-grayText" />
            </button>
          </div>
        </div>
      )}

      {/* Publish success modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setShowPublishModal(false)}
          />
          <div className="relative bg-white rounded-[5px] shadow-2xl border border-border p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-success" />
              </div>
              <h2 className="font-heading font-extrabold text-navy text-[28px] mb-2">
                Votre site est en ligne !
              </h2>
              <p className="text-[15px] text-grayText mb-2">
                Votre site vitrine est maintenant accessible à tous.
              </p>
              <p className="text-[13px] text-grayText mb-4">
                Les modifications seront visibles immédiatement. Vous pouvez modifier votre site à tout moment.
              </p>
              <div className="flex items-center justify-center gap-2 px-5 py-4 rounded-[5px] bg-surface mb-6">
                <Globe size={16} className="text-forest" />
                <span className="font-mono text-[15px] text-forest font-medium">{siteUrl}</span>
                <button
                  type="button"
                  className="p-1 rounded-[5px] hover:bg-white transition-colors"
                  onClick={() => navigator.clipboard?.writeText(`https://${siteUrl}`)}
                  title="Copier le lien"
                >
                  <Link2 size={14} className="text-grayText" />
                </button>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 px-5 py-2.5 rounded-[5px] text-sm"
                  onClick={() => setShowPublishModal(false)}
                >
                  <Share2 size={16} />
                  Partager
                </Button>
                <Button className="flex-1 px-5 py-2.5 rounded-[5px] text-sm" onClick={() => setShowPublishModal(false)}>
                  <ExternalLink size={16} />
                  Voir le site
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
