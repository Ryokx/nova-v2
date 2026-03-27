/**
 * Page de détail d'un artisan.
 * Affiche le profil complet (avatar, note, certifications, description),
 * les avis clients, et deux CTA : "Prendre rendez-vous" et "Urgence".
 * Si l'utilisateur n'est pas connecté, une modale d'authentification s'affiche.
 */

"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, Zap, Shield, MapPin, Clock, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { AuthGateModal } from "@/components/ui/auth-gate-modal";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Données détaillées d'un artisan */
interface ArtisanDetail {
  id: string;
  trade: string;
  description: string | null;
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

/* ------------------------------------------------------------------ */
/*  Données mock (prototype)                                           */
/* ------------------------------------------------------------------ */

const mockReviews = [
  { id: "r1", name: "Caroline L.", rating: 5, date: "Il y a 3 jours", comment: "Intervention rapide et soignée. Jean-Michel a parfaitement diagnostiqué la fuite et tout réparé en moins d'une heure. Je recommande vivement !" },
  { id: "r2", name: "Pierre M.", rating: 5, date: "Il y a 1 semaine", comment: "Très professionnel, ponctuel et travail de qualité. Le devis était respecté à l'euro près. Artisan de confiance." },
  { id: "r3", name: "Amélie R.", rating: 4, date: "Il y a 2 semaines", comment: "Bon travail dans l'ensemble, artisan ponctuel et propre. Petit délai sur la livraison des pièces mais rien de grave." },
];

/* ------------------------------------------------------------------ */
/*  Utilitaires                                                        */
/* ------------------------------------------------------------------ */

/** Retourne les initiales d'un nom */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Affiche 5 étoiles (pleines ou vides) selon la note */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= Math.round(rating) ? "fill-gold text-gold" : "fill-none text-border"}`}
        />
      ))}
    </div>
  );
}

/** Version plus petite des étoiles pour les avis */
function SmallStars({ rating }: { rating: number }) {
  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-gold text-gold" : "fill-none text-border"}`}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function ArtisanDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: artisan, loading } = useFetch<ArtisanDetail>(`/api/artisans/${slug}`);

  /* État de la modale d'authentification */
  const [gateOpen, setGateOpen] = useState(false);
  const [gateAction, setGateAction] = useState<"booking" | "urgence">("booking");

  const isAuthenticated = !!session?.user;

  /**
   * Gère le clic sur "Prendre RDV" ou "Urgence".
   * Redirige si connecté, ouvre la modale d'auth sinon.
   */
  function handleProtectedAction(action: "booking" | "urgence") {
    const target = action === "urgence"
      ? `/booking/${slug}?mode=urgence`
      : `/booking/${slug}`;

    if (isAuthenticated) {
      window.location.href = target;
    } else {
      setGateAction(action);
      setGateOpen(true);
    }
  }

  /* Squelette de chargement */
  if (loading) {
    return (
      <div className="max-w-[700px] mx-auto p-5 md:p-8 space-y-5">
        <Skeleton height={24} width={100} />
        <Skeleton variant="rectangular" height={280} />
        <Skeleton variant="rectangular" height={200} />
      </div>
    );
  }

  /* Valeurs avec fallback mock pour le prototype */
  const name = artisan?.user?.name ?? "Jean-Michel P.";
  const initials = getInitials(name);
  const trade = artisan?.trade ?? "Plombier";
  const rating = artisan?.rating ?? 4.9;
  const missionCount = artisan?.missionCount ?? 127;
  const travelFee = artisan?.travelFee ?? 0;
  const rgeNumber = artisan?.rgeNumber ?? "RGE-2024";
  const city = artisan?.city ?? "Paris 11e";
  const description = artisan?.description ?? "Plombier certifié avec plus de 15 ans d'expérience. Spécialiste en réparation de fuites, installation sanitaire et dépannage urgent. Intervention rapide et devis gratuit.";
  const reviews = artisan?.reviews && artisan.reviews.length > 0
    ? artisan.reviews
    : null;

  /* URL de redirection après connexion */
  const callbackUrl = gateAction === "urgence"
    ? `/booking/${slug}?mode=urgence`
    : `/booking/${slug}`;

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">

      {/* Lien retour */}
      <Link
        href="/artisans"
        className="inline-flex items-center gap-1.5 text-sm text-forest font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux artisans
      </Link>

      {/* Carte profil de l'artisan */}
      <div className="bg-white border border-border shadow-sm rounded-[5px] p-6 text-center mb-5">
        {/* Avatar initiales */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-[5px] bg-gradient-to-br from-forest to-sage flex items-center justify-center">
            <span className="text-white font-heading font-bold text-xl">{initials}</span>
          </div>
        </div>

        {/* Nom et métier */}
        <h1 className="font-heading text-2xl font-extrabold text-navy">{name}</h1>
        <p className="text-grayText mt-0.5">{trade}</p>

        {/* Localisation */}
        <div className="flex items-center justify-center gap-1 mt-1.5 text-sm text-grayText">
          <MapPin className="w-3.5 h-3.5" />
          {city}
        </div>

        {/* Note et nombre de missions */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <Stars rating={rating} />
          <span className="text-sm font-semibold text-navy">{rating}</span>
          <span className="text-sm text-grayText">· {missionCount} missions</span>
        </div>

        {/* Badges de certifications */}
        <div className="flex gap-2 mt-4 justify-center flex-wrap">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-forest text-white">
            <Shield className="w-3 h-3" /> Certifié Nova
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            Décennale
          </span>
          {rgeNumber && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              RGE
            </span>
          )}
        </div>

        {/* Description de l'artisan */}
        <p className="text-sm text-grayText leading-relaxed mt-4 max-w-[500px] mx-auto">
          {description}
        </p>

        {/* Cartes info : déplacement + devis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <div className="bg-surface rounded-xl p-4 text-center">
            <div className="font-mono font-bold text-navy text-lg">
              {travelFee === 0 ? "Offert" : `${travelFee}€`}
            </div>
            <div className="text-xs text-grayText mt-0.5">Déplacement</div>
          </div>
          <div className="bg-surface rounded-xl p-4 text-center">
            <div className="font-mono font-bold text-success text-lg">Gratuit</div>
            <div className="text-xs text-grayText mt-0.5">Devis</div>
          </div>
        </div>
      </div>

      {/* Section avis clients */}
      <div className="bg-white border border-border shadow-sm rounded-[5px] p-6 mb-5">
        <h2 className="font-heading text-base font-bold text-navy mb-4">Avis clients</h2>

        {reviews ? (
          /* Avis provenant de l'API */
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-navy">{r.user.name ?? "Client"}</span>
                  <SmallStars rating={r.rating} />
                </div>
                <div className="text-xs text-grayText mb-1.5">
                  {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                {r.comment && <p className="text-sm text-grayText leading-relaxed">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          /* Avis mock (fallback prototype) */
          <div className="space-y-4">
            {mockReviews.map((r) => (
              <div key={r.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-navy">{r.name}</span>
                  <SmallStars rating={r.rating} />
                </div>
                <div className="text-xs text-grayText mb-1.5">{r.date}</div>
                <p className="text-sm text-grayText leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Boutons d'action (protégés par authentification) */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleProtectedAction("booking")}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-deepForest text-white font-bold rounded-[5px] hover:-translate-y-0.5 transition-transform text-sm shadow-[0_6px_20px_rgba(10,64,48,0.25)]"
        >
          <Calendar className="w-4 h-4" /> Prendre rendez-vous
        </button>
        <button
          onClick={() => handleProtectedAction("urgence")}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red text-white font-bold rounded-[5px] hover:-translate-y-0.5 transition-transform text-sm shadow-[0_6px_16px_rgba(232,48,42,0.2)]"
        >
          <Zap className="w-4 h-4" /> Urgence
        </button>
      </div>

      {/* Indication pour les non-connectés */}
      {!isAuthenticated && (
        <p className="text-center text-xs text-grayText mt-3">
          Connectez-vous ou créez un compte gratuit pour contacter cet artisan
        </p>
      )}

      {/* Modale d'authentification obligatoire */}
      <AuthGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        callbackUrl={callbackUrl}
        action={gateAction}
      />
    </div>
  );
}
