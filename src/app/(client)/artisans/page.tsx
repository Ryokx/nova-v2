"use client";

import { useState } from "react";
import { Search, Star, Shield } from "lucide-react";
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
  hourlyRate: number | null;
  responseTime: string | null;
  city: string | null;
  isVerified: boolean;
  user: { id: string; name: string; avatar: string | null };
}

const categories = [
  { id: "all", label: "Tous" },
  { id: "Plombier", label: "Plombier" },
  { id: "Électricien", label: "Électricien" },
  { id: "Serrurier", label: "Serrurier" },
  { id: "Chauffagiste", label: "Chauffagiste" },
  { id: "Peintre", label: "Peintre" },
];

const mockArtisans = [
  { id: "jean-michel-p", name: "Jean-Michel P.", trade: "Plombier", rating: 4.9, reviewCount: 127, hourlyRate: 65, initials: "JM", category: "Plombier" },
  { id: "sophie-m", name: "Sophie M.", trade: "Électricienne", rating: 4.8, reviewCount: 94, hourlyRate: 70, initials: "SM", category: "Électricien" },
  { id: "karim-b", name: "Karim B.", trade: "Serrurier", rating: 5.0, reviewCount: 83, hourlyRate: 60, initials: "KB", category: "Serrurier" },
  { id: "marie-d", name: "Marie D.", trade: "Peintre", rating: 4.7, reviewCount: 61, hourlyRate: 55, initials: "MD", category: "Peintre" },
  { id: "christophe-d", name: "Christophe D.", trade: "Chauffagiste", rating: 4.9, reviewCount: 89, hourlyRate: 75, initials: "CD", category: "Chauffagiste" },
  { id: "fatima-h", name: "Fatima H.", trade: "Plombier", rating: 4.8, reviewCount: 91, hourlyRate: 70, initials: "FH", category: "Plombier" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ArtisansPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const url = `/api/artisans?category=${category}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
  const { data: apiArtisans, loading } = useFetch<ArtisanData[]>(url);

  // Filter mock artisans by category
  const filteredMock = mockArtisans.filter((a) => {
    if (category !== "all" && a.category !== category) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.trade.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Use API data if available, otherwise fall back to mock data
  const hasApiData = apiArtisans && apiArtisans.length > 0;

  return (
    <div className="max-w-[900px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-1">
        Trouver un artisan
      </h1>
      <p className="text-sm text-grayText mb-6">Artisans certifiés près de chez vous</p>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
        <input
          type="text"
          placeholder="Rechercher un artisan, un métier, une ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-10 pr-4 rounded-[14px] border border-border bg-white text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              "px-4 py-2 rounded-[14px] text-[13px] font-bold whitespace-nowrap transition-all hover:-translate-y-0.5",
              category === c.id
                ? "bg-deepForest text-white"
                : "bg-white border border-border text-navy hover:bg-surface",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={140} />
          ))}
        </div>
      ) : hasApiData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apiArtisans.map((a) => {
            const initials = getInitials(a.user.name ?? "A");
            return (
              <Link
                key={a.id}
                href={`/artisan/${a.id}`}
                className="block bg-white border border-border shadow-sm rounded-[20px] p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3.5">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-forest to-sage flex items-center justify-center shrink-0">
                    <span className="text-white font-heading font-bold text-sm">{initials}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-navy truncate">{a.user.name ?? "Artisan"}</h3>
                      {a.isVerified && <Shield className="w-3.5 h-3.5 text-forest shrink-0" />}
                    </div>
                    <p className="text-sm text-grayText">{a.trade}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                      <span className="text-xs font-semibold text-navy">{a.rating}</span>
                      <span className="text-xs text-grayText">({a.reviewCount} avis)</span>
                    </div>
                  </div>

                  {/* Price */}
                  {a.hourlyRate && (
                    <div className="shrink-0">
                      <span className="font-mono font-bold text-forest">{a.hourlyRate}€/h</span>
                    </div>
                  )}
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
              className="block bg-white border border-border shadow-sm rounded-[20px] p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-forest to-sage flex items-center justify-center shrink-0">
                  <span className="text-white font-heading font-bold text-sm">{a.initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-navy truncate">{a.name}</h3>
                  <p className="text-sm text-grayText">{a.trade}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    <span className="text-xs font-semibold text-navy">{a.rating}</span>
                    <span className="text-xs text-grayText">({a.reviewCount} avis)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="shrink-0">
                  <span className="font-mono font-bold text-forest">{a.hourlyRate}€/h</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun artisan trouvé"
          description="Essayez de modifier vos critères de recherche"
        />
      )}
    </div>
  );
}
