import Link from "next/link";
import { Star, Shield, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ArtisanCardProps {
  id: string;
  name: string;
  trade: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number | null;
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
  hourlyRate,
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
        <Avatar name={name} src={avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-bold text-navy truncate">{name}</h3>
            {isVerified && (
              <Shield className="w-3.5 h-3.5 text-forest shrink-0" />
            )}
          </div>
          <p className="text-xs text-grayText">{trade}{city ? ` • ${city}` : ""}</p>

          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="text-xs font-semibold text-navy">{rating}</span>
            <span className="text-xs text-grayText">• {reviewCount} avis</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          {hourlyRate && (
            <div className="font-mono text-sm font-bold text-navy">{hourlyRate}€<span className="text-xs font-normal text-grayText">/h</span></div>
          )}
          {responseTime && (
            <div className="flex items-center gap-1 mt-1 justify-end">
              <Clock className="w-3 h-3 text-grayText" />
              <span className="text-[10px] text-grayText">{responseTime}</span>
            </div>
          )}
        </div>
      </div>

      {isVerified && (
        <div className="mt-3 flex gap-1.5">
          <Badge variant="success" className="text-[10px]">Certifié Nova</Badge>
          <Badge variant="info" className="text-[10px]">Décennale</Badge>
        </div>
      )}
    </Link>
  );
}
