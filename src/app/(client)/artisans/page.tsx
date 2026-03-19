"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ArtisanCard } from "@/components/features/artisan-card";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

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

export default function ArtisansPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const url = `/api/artisans?category=${category}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
  const { data: artisans, loading } = useFetch<ArtisanData[]>(url);

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
          className="w-full h-12 pl-10 pr-4 rounded-md border border-border bg-white text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              "px-4 py-2 rounded-[10px] text-[13px] font-semibold whitespace-nowrap transition-all",
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
      ) : artisans && artisans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artisans.map((a) => (
            <ArtisanCard
              key={a.id}
              id={a.id}
              name={a.user.name ?? "Artisan"}
              trade={a.trade}
              rating={a.rating}
              reviewCount={a.reviewCount}
              hourlyRate={a.hourlyRate}
              responseTime={a.responseTime}
              city={a.city}
              isVerified={a.isVerified}
              avatar={a.user.avatar}
            />
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
