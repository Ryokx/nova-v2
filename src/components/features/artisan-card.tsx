/**
 * ArtisanCard — Carte de présentation d'un artisan
 *
 * Affiche les informations clés d'un artisan :
 * - Avatar, nom, métier, ville
 * - Note moyenne + nombre d'avis
 * - Temps de réponse moyen
 * - Badges "Certifié Nova" et "Décennale" si vérifié
 *
 * Lien cliquable vers la fiche complète de l'artisan.
 */

import Link from "next/link";
import { Star, Shield, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/* ━━━ Types ━━━ */
interface ArtisanCardProps {
  id: string;
  name: string;
  trade: string;
  rating: number;
  reviewCount: number;
  responseTime: string | null;
  city: string | null;
  isVerified: boolean;
  avatar?: string | null;
}

export function ArtisanCard({
  id,
  name,
  trade,
  rating,
  reviewCount,
  responseTime,
  city,
  isVerified,
  avatar,
}: ArtisanCardProps) {
  return (
    <Link
      href={`/artisan/${id}`}
      className="block bg-white rounded-xl border border-border p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
    >
      <div className="flex gap-3.5 items-start">
        {/* Avatar de l'artisan */}
        <Avatar name={name} src={avatar} size="lg" />

        {/* Infos principales : nom, métier, ville, note */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-bold text-navy truncate">{name}</h3>
            {/* Icône de vérification si l'artisan est certifié */}
            {isVerified && (
              <Shield className="w-3.5 h-3.5 text-forest shrink-0" />
            )}
          </div>
          <p className="text-xs text-grayText">{trade}{city ? ` • ${city}` : ""}</p>

          {/* Note moyenne + nombre d'avis */}
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="text-xs font-semibold text-navy">{rating}</span>
            <span className="text-xs text-grayText">• {reviewCount} avis</span>
          </div>
        </div>

        {/* Temps de réponse moyen */}
        <div className="text-right shrink-0">
          {responseTime && (
            <div className="flex items-center gap-1 mt-1 justify-end">
              <Clock className="w-3 h-3 text-grayText" />
              <span className="text-[10px] text-grayText">{responseTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Badges de certification (affichés si l'artisan est vérifié) */}
      {isVerified && (
        <div className="mt-3 flex gap-1.5">
          <Badge variant="success" className="text-[10px]">Certifié Nova</Badge>
          <Badge variant="info" className="text-[10px]">Décennale</Badge>
        </div>
      )}
    </Link>
  );
}
