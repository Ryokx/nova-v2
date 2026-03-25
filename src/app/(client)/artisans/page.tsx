"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Search, Star, Shield, Zap, Clock, MapPin, ChevronRight,
  Droplets, Plug, KeyRound, Flame, PaintBucket, Hammer,
  LayoutGrid, Wrench, Filter, X, SlidersHorizontal,
  ClipboardList, CreditCard, BadgeCheck, Phone, ArrowRight,
} from "lucide-react";
import { UrgencyModal } from "@/components/features/urgency-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ArtisanData {
  id: string;
  trade: string;
  rating: number;
  reviewCount: number;
  responseTime: string | null;
  city: string | null;
  isVerified: boolean;
  user: { id: string; name: string; avatar: string | null };
}

const categories = [
  { id: "all", label: "Tous les métiers", icon: LayoutGrid },
  { id: "Plombier", label: "Plombier", icon: Droplets },
  { id: "Électricien", label: "Électricien", icon: Plug },
  { id: "Serrurier", label: "Serrurier", icon: KeyRound },
  { id: "Chauffagiste", label: "Chauffagiste", icon: Flame },
  { id: "Peintre", label: "Peintre", icon: PaintBucket },
  { id: "Menuisier", label: "Menuisier", icon: Hammer },
  { id: "Carreleur", label: "Carreleur", icon: LayoutGrid },
  { id: "Maçon", label: "Maçon", icon: Wrench },
];

const urgencySpecialties = [
  { id: "Plombier", label: "Plombier", icon: Droplets, desc: "Fuite, canalisation, WC, chauffe-eau" },
  { id: "Électricien", label: "Électricien", icon: Plug, desc: "Panne, court-circuit, tableau électrique" },
  { id: "Serrurier", label: "Serrurier", icon: KeyRound, desc: "Porte claquée, serrure cassée, effraction" },
  { id: "Chauffagiste", label: "Chauffagiste", icon: Flame, desc: "Panne chauffage, fuite gaz, chaudière" },
  { id: "Maçon", label: "Maçon", icon: Wrench, desc: "Dégât structurel, fissure, effondrement" },
];

const mockArtisans = [
  { id: "jean-michel-p", name: "Jean-Michel Petit", trade: "Plombier", rating: 4.9, reviewCount: 127, initials: "JM", category: "Plombier", responseTime: "30 min", city: "Paris 11e", urgencyAvailable: true, certifications: ["Décennale", "RGE"] },
  { id: "sophie-m", name: "Sophie Martin", trade: "Électricienne", rating: 4.8, reviewCount: 94, initials: "SM", category: "Électricien", responseTime: "45 min", city: "Paris 15e", urgencyAvailable: true, certifications: ["Décennale", "Qualibat"] },
  { id: "karim-b", name: "Karim Benali", trade: "Serrurier", rating: 5.0, reviewCount: 83, initials: "KB", category: "Serrurier", responseTime: "20 min", city: "Paris 9e", urgencyAvailable: true, certifications: ["Décennale"] },
  { id: "marie-d", name: "Marie Dupont", trade: "Peintre", rating: 4.7, reviewCount: 61, initials: "MD", category: "Peintre", responseTime: "2h", city: "Lyon 6e", urgencyAvailable: false, certifications: ["Décennale", "RGE"] },
  { id: "christophe-d", name: "Christophe Dubois", trade: "Chauffagiste", rating: 4.9, reviewCount: 89, initials: "CD", category: "Chauffagiste", responseTime: "1h", city: "Paris 17e", urgencyAvailable: true, certifications: ["Décennale", "RGE", "Qualibat"] },
  { id: "fatima-h", name: "Fatima Hadj", trade: "Plombier", rating: 4.8, reviewCount: 91, initials: "FH", category: "Plombier", responseTime: "35 min", city: "Bordeaux", urgencyAvailable: true, certifications: ["Décennale"] },
  { id: "lucas-r", name: "Lucas Renaud", trade: "Menuisier", rating: 4.6, reviewCount: 47, initials: "LR", category: "Menuisier", responseTime: "1h30", city: "Nantes", urgencyAvailable: false, certifications: ["Décennale", "Qualibat"] },
  { id: "ahmed-k", name: "Ahmed Kessab", trade: "Maçon", rating: 4.9, reviewCount: 112, initials: "AK", category: "Maçon", responseTime: "2h", city: "Marseille", urgencyAvailable: false, certifications: ["Décennale", "RGE"] },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getGradient(name: string): string {
  const gradients = [
    "from-deepForest to-forest",
    "from-forest to-sage",
    "from-sage to-forest",
    "from-deepForest to-sage",
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

export default function ArtisansPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [search, setSearch] = useState("");
  const [isUrgency, setIsUrgency] = useState(searchParams.get("urgency") === "true");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "response">("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [urgencyModalOpen, setUrgencyModalOpen] = useState(false);
  const [selectedUrgencySpec, setSelectedUrgencySpec] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const url = `/api/artisans?category=${category}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
  const { data: apiArtisans, loading } = useFetch<ArtisanData[]>(url);

  // Filter & sort mock artisans
  const filteredMock = mockArtisans
    .filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.trade.toLowerCase().includes(search.toLowerCase()) && !a.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (isUrgency && !a.urgencyAvailable) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      return 0;
    });

  const hasApiData = apiArtisans && apiArtisans.length > 0;
  const resultCount = hasApiData ? apiArtisans.length : filteredMock.length;
  const firstName = session?.user?.name?.split(" ")[0];

  // Focus search on Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="max-w-[1080px] mx-auto px-5 md:px-8 pt-6 pb-16">

      {/* ━━━ Header ━━━ */}
      <div className="mb-6">
        <h1 className="font-heading text-[24px] md:text-[28px] font-extrabold text-navy leading-tight">
          {firstName ? `${firstName}, trouvez votre artisan` : "Trouvez votre artisan"}
        </h1>
        <p className="text-sm text-grayText mt-1">
          Tous nos artisans sont certifiés et vos paiements sont sécurisés par séquestre
        </p>
      </div>

      {/* ━━━ Search bar ━━━ */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-grayText/60" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Rechercher un métier, un artisan, une ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-[52px] pl-11 pr-28 rounded-2xl border border-border bg-white text-[15px] text-navy placeholder:text-grayText/50 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest shadow-sm transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {search && (
            <button
              onClick={() => setSearch("")}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface transition-colors text-grayText"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden md:flex items-center gap-0.5 px-2 py-1 rounded-lg bg-surface text-[11px] text-grayText font-mono">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* ━━━ Mode toggle: Normal / Urgence ━━━ */}
      <div className="flex gap-2.5 mb-5">
        <button
          onClick={() => setIsUrgency(false)}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200",
            !isUrgency
              ? "bg-deepForest text-white shadow-[0_2px_12px_rgba(10,64,48,0.2)]"
              : "bg-white text-navy border border-border hover:border-forest/30 hover:-translate-y-0.5",
          )}
        >
          <Search className="w-3.5 h-3.5" />
          Recherche
        </button>
        <button
          onClick={() => setIsUrgency(true)}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200",
            isUrgency
              ? "bg-red text-white shadow-[0_2px_12px_rgba(232,48,42,0.2)]"
              : "bg-white text-navy border border-border hover:border-red/30 hover:-translate-y-0.5",
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          Urgence 24/7
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 border",
            showFilters
              ? "bg-forest/[0.06] text-forest border-forest/20"
              : "bg-white text-grayText border-border hover:text-navy hover:border-forest/20",
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filtres</span>
        </button>
      </div>

      {/* ━━━ Urgency specialty selector ━━━ */}
      {isUrgency && (
        <div className="bg-red/[0.03] border border-red/15 rounded-2xl p-5 mb-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-red" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-navy">Connexion directe — Urgence 24/7</p>
              <p className="text-xs text-grayText mt-0.5">
                Sélectionnez la spécialité, on trouve un artisan disponible immédiatement
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red/10 text-red text-xs font-bold shrink-0">
              <Clock className="w-3 h-3" />
              &lt; 2h
            </div>
          </div>

          {/* Specialty grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {urgencySpecialties.map((spec) => {
              const Icon = spec.icon;
              return (
                <button
                  key={spec.id}
                  onClick={() => {
                    setSelectedUrgencySpec(spec.id);
                    setUrgencyModalOpen(true);
                  }}
                  className="group flex items-center gap-3 p-3.5 rounded-xl bg-white border border-border hover:border-red/30 hover:shadow-[0_4px_16px_rgba(232,48,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-red/[0.06] group-hover:bg-red/[0.12] flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-5 h-5 text-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-navy">{spec.label}</p>
                    <p className="text-[11px] text-grayText mt-0.5 truncate">{spec.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-grayText/30 group-hover:text-red group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Phone fallback */}
          <div className="flex items-center justify-center gap-2 mt-4 pt-3.5 border-t border-red/10">
            <Phone className="w-3.5 h-3.5 text-grayText" />
            <p className="text-xs text-grayText">
              Urgence vitale ? Appelez le <span className="font-bold text-navy">01 86 65 00 00</span>
            </p>
          </div>
        </div>
      )}

      {/* ━━━ Sort bar (collapsible) ━━━ */}
      {showFilters && (
        <div className="bg-white border border-border rounded-2xl px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-grayText uppercase tracking-wider">Trier par</span>
          {([
            { key: "rating" as const, label: "Meilleures notes" },
            { key: "reviews" as const, label: "Plus d'avis" },
            { key: "response" as const, label: "Réponse rapide" },
          ]).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                sortBy === s.key
                  ? "bg-forest/[0.08] text-forest"
                  : "text-navy/50 hover:text-navy hover:bg-surface",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* ━━━ Category grid ━━━ */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mb-7">
        {categories.map((c) => {
          const Icon = c.icon;
          const active = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center transition-all duration-200 group",
                active
                  ? "bg-deepForest text-white shadow-[0_2px_12px_rgba(10,64,48,0.15)]"
                  : "bg-white border border-border text-navy hover:border-forest/30 hover:-translate-y-0.5 hover:shadow-sm",
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                active ? "bg-white/15" : "bg-forest/[0.06] group-hover:bg-forest/[0.1]",
              )}>
                <Icon className={cn("w-4 h-4", active ? "text-white" : "text-forest")} />
              </div>
              <span className={cn(
                "text-[11px] font-semibold leading-tight",
                active ? "text-white" : "text-navy/70",
              )}>
                {c.id === "all" ? "Tous" : c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ━━━ Results count ━━━ */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-grayText">
          <span className="font-semibold text-navy">{resultCount}</span> artisan{resultCount > 1 ? "s" : ""}{" "}
          {category !== "all" ? `en ${categories.find((c) => c.id === category)?.label}` : "disponibles"}
          {isUrgency ? " en urgence" : ""}
        </p>
      </div>

      {/* ━━━ Results grid ━━━ */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex gap-3.5">
                <Skeleton variant="rectangular" width={52} height={52} className="rounded-xl" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton width="60%" height={16} />
                  <Skeleton width="40%" height={12} />
                  <Skeleton width="50%" height={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : hasApiData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apiArtisans.map((a) => {
            const initials = getInitials(a.user.name ?? "A");
            const gradient = getGradient(a.user.name ?? "A");
            return (
              <Link
                key={a.id}
                href={`/artisan/${a.id}`}
                className="group block bg-white border border-border rounded-2xl p-5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(10,64,48,0.08)] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-[52px] h-[52px] rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", gradient)}>
                    <span className="text-white font-heading font-bold text-sm">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-[15px] text-navy truncate">{a.user.name ?? "Artisan"}</h3>
                      {a.isVerified && (
                        <div className="w-4.5 h-4.5 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                          <BadgeCheck className="w-3 h-3 text-forest" />
                        </div>
                      )}
                    </div>
                    <p className="text-[13px] text-grayText mt-0.5">{a.trade}{a.city ? ` · ${a.city}` : ""}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                        <span className="text-xs font-bold text-navy">{a.rating}</span>
                        <span className="text-xs text-grayText">({a.reviewCount})</span>
                      </div>
                      {a.responseTime && (
                        <div className="flex items-center gap-1 text-xs text-grayText">
                          <Clock className="w-3 h-3" />
                          {a.responseTime}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-grayText/30 group-hover:text-forest group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : filteredMock.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMock.map((a) => (
            <Link
              key={a.id}
              href={`/artisan/${a.id}`}
              className={cn(
                "group block bg-white border rounded-2xl p-5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(10,64,48,0.08)] transition-all duration-300",
                isUrgency ? "border-red/15" : "border-border",
              )}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={cn(
                  "w-[52px] h-[52px] rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
                  isUrgency ? "from-red to-red/70" : getGradient(a.name),
                )}>
                  <span className="text-white font-heading font-bold text-sm">{a.initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-[15px] text-navy truncate">{a.name}</h3>
                    <div className="w-4.5 h-4.5 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                      <BadgeCheck className="w-3 h-3 text-forest" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[13px] text-grayText">{a.trade}</p>
                    <span className="text-grayText/30">·</span>
                    <div className="flex items-center gap-0.5 text-[13px] text-grayText">
                      <MapPin className="w-3 h-3" />
                      {a.city}
                    </div>
                  </div>

                  {/* Rating + response time */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                      <span className="text-xs font-bold text-navy">{a.rating}</span>
                      <span className="text-xs text-grayText">({a.reviewCount} avis)</span>
                    </div>
                    {isUrgency ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red/[0.06]">
                        <Clock className="w-3 h-3 text-red" />
                        <span className="text-[11px] font-bold text-red">{a.responseTime}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-grayText">
                        <Clock className="w-3 h-3" />
                        {a.responseTime}
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="flex gap-1.5 mt-2.5">
                    {a.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-2 py-0.5 rounded-md bg-forest/[0.06] text-[10px] font-semibold text-forest"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-grayText/30 group-hover:text-forest group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search className="w-7 h-7 text-grayText/40" />}
          title="Aucun artisan trouvé"
          description={
            isUrgency
              ? "Aucun artisan disponible en urgence pour ces critères. Essayez en recherche normale."
              : "Essayez de modifier vos critères de recherche ou explorez une autre catégorie."
          }
          action={
            (search || category !== "all") && (
              <button
                onClick={() => { setSearch(""); setCategory("all"); setIsUrgency(false); }}
                className="px-5 py-2.5 rounded-xl bg-deepForest text-white text-sm font-bold hover:-translate-y-0.5 transition-all"
              >
                Réinitialiser les filtres
              </button>
            )
          }
        />
      )}

      {/* ━━━ Urgency modal ━━━ */}
      <UrgencyModal
        open={urgencyModalOpen}
        onClose={() => {
          setUrgencyModalOpen(false);
          setSelectedUrgencySpec(null);
        }}
      />

      {/* ━━━ Trust footer ━━━ */}
      <div className="mt-10 pt-8 border-t border-border/60">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Shield, title: "Artisans vérifiés", desc: "SIRET, décennale et identité contrôlés" },
            { icon: CreditCard, title: "Paiement séquestre", desc: "Votre argent est bloqué jusqu'à validation" },
            { icon: ClipboardList, title: "Suivi en temps réel", desc: "Suivez chaque étape de l'intervention" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest/[0.06] flex items-center justify-center shrink-0">
                <item.icon className="w-4.5 h-4.5 text-forest" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-navy">{item.title}</p>
                <p className="text-xs text-grayText mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
