"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MessageCircle, Phone, Calendar, Zap, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/features/star-rating";
import { useFetch } from "@/hooks/use-fetch";

interface ArtisanDetail {
  id: string;
  trade: string;
  description: string | null;
  hourlyRate: number | null;
  travelFee: number;
  responseTime: string | null;
  rating: number;
  reviewCount: number;
  missionCount: number;
  isVerified: boolean;
  city: string | null;
  certifications: string[] | null;
  rgeNumber: string | null;
  user: { id: string; name: string; avatar: string | null };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { name: string };
  }>;
}

export default function ArtisanDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: artisan, loading, error } = useFetch<ArtisanDetail>(`/api/artisans/${slug}`);

  if (loading) {
    return (
      <div className="max-w-[700px] mx-auto p-5 md:p-8 space-y-5">
        <Skeleton height={24} width={100} />
        <Skeleton variant="rectangular" height={280} />
        <Skeleton variant="rectangular" height={200} />
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="max-w-[700px] mx-auto p-5 md:p-8 text-center py-20">
        <p className="text-grayText">Artisan introuvable</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/artisans")}>
          Retour aux artisans
        </Button>
      </div>
    );
  }

  const name = artisan.user.name ?? "Artisan";

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-forest font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      {/* Profile card */}
      <Card className="text-center mb-5">
        <div className="flex flex-col items-center">
          <Avatar name={name} src={artisan.user.avatar} size="lg" className="w-20 h-20 text-lg mb-3" />
          <h1 className="font-heading text-2xl font-extrabold text-navy">{name}</h1>
          <p className="text-sm text-grayText">{artisan.trade}{artisan.city && ` • ${artisan.city}`}</p>

          <div className="flex items-center gap-2 mt-2">
            <StarRating value={Math.round(artisan.rating)} readonly size="sm" />
            <span className="text-sm font-semibold text-navy">{artisan.rating}</span>
            <span className="text-xs text-grayText">• {artisan.missionCount} missions</span>
          </div>

          {/* Badges */}
          <div className="flex gap-1.5 mt-3 flex-wrap justify-center">
            {artisan.isVerified && <Badge variant="success">Certifié Nova</Badge>}
            <Badge variant="info">Décennale</Badge>
            {artisan.rgeNumber && <Badge className="bg-amber-900/10 text-amber-900">RGE</Badge>}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
          <div className="text-center">
            <div className="font-mono text-base font-bold text-navy">{artisan.hourlyRate ?? "—"}€/h</div>
            <div className="text-[11px] text-grayText">Tarif</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-base font-bold text-navy">
              {artisan.travelFee === 0 ? "Gratuit" : `${artisan.travelFee}€`}
            </div>
            <div className="text-[11px] text-grayText">Déplacement</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-base font-bold text-success">Gratuit</div>
            <div className="text-[11px] text-grayText">Devis</div>
          </div>
        </div>
      </Card>

      {/* Description */}
      {artisan.description && (
        <Card className="mb-5">
          <h2 className="font-heading text-sm font-bold text-navy mb-2">À propos</h2>
          <p className="text-sm text-grayText leading-relaxed">{artisan.description}</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            {artisan.responseTime && (
              <div className="flex items-center gap-1.5 text-xs text-grayText">
                <Clock className="w-3.5 h-3.5" /> Répond en {artisan.responseTime}
              </div>
            )}
            {artisan.city && (
              <div className="flex items-center gap-1.5 text-xs text-grayText">
                <MapPin className="w-3.5 h-3.5" /> {artisan.city}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Maintenance contract CTA */}
      <Card className="mb-5 bg-gradient-to-br from-surface to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-sm font-bold text-navy">Contrat d&apos;entretien</h3>
            <p className="text-xs text-grayText mt-0.5">Entretien annuel à partir de 90€/an</p>
          </div>
          <Link
            href={`/entretien/${slug}`}
            className="px-4 py-2 rounded-sm text-xs font-semibold bg-forest/10 text-forest hover:bg-forest/20 transition-colors"
          >
            Voir les plans →
          </Link>
        </div>
      </Card>

      {/* Reviews */}
      <Card className="mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-4">
          Avis clients ({artisan.reviewCount})
        </h2>
        {artisan.reviews && artisan.reviews.length > 0 ? (
          <div className="space-y-4">
            {artisan.reviews.map((r) => (
              <div key={r.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-navy">{r.user.name ?? "Client"}</span>
                  <StarRating value={r.rating} readonly size="sm" />
                </div>
                {r.comment && <p className="text-sm text-grayText leading-relaxed">{r.comment}</p>}
                <div className="text-[10px] text-grayText/60 mt-1">
                  {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-grayText text-center py-4">Aucun avis pour le moment</p>
        )}
      </Card>

      {/* CTA buttons */}
      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="outline" size="md" className="gap-2">
            <MessageCircle className="w-4 h-4" /> Chat
          </Button>
          <Button variant="outline" size="md" className="gap-2">
            <Phone className="w-4 h-4" /> Appeler
          </Button>
        </div>
        <Link href={`/booking/${slug}`}>
          <Button className="w-full gap-2" size="lg">
            <Calendar className="w-4 h-4" /> Prendre rendez-vous
          </Button>
        </Link>
        <Link href="/urgence">
          <Button variant="danger" className="w-full gap-2" size="md">
            <Zap className="w-4 h-4" /> Urgence
          </Button>
        </Link>
      </div>
    </div>
  );
}
