/**
 * Page "Mes missions".
 * Liste toutes les missions du client avec filtrage par onglets (Toutes, Terminées, Validées, Litiges).
 * Chaque mission est dépliable pour voir le détail : stepper séquestre, infos, documents, actions.
 * Utilise les données API si disponibles, sinon affiche des données mock (prototype).
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Check,
  Download,
  Shield,
  AlertTriangle,
  FileText,
  Lock,
  MapPin,
  Radio,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { StarRating } from "@/components/features/star-rating";
import { useFetch } from "@/hooks/use-fetch";
import { cn, formatPrice, getInitials } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MissionData {
  id: string;
  type: string;
  status: string;
  amount: number | null;
  scheduledDate: string | null;
  category?: string | null;
  address?: string | null;
  description?: string | null;
  artisan: { user: { name: string; avatar: string | null } };
  devis?: { number: string; totalHT: number; totalTTC: number; tva: number } | null;
  invoice?: { number: string } | null;
}

/* ------------------------------------------------------------------ */
/*  Données mock (affichées quand l'API ne retourne rien)              */
/* ------------------------------------------------------------------ */

const mockMissions: MissionData[] = [
  {
    id: "active-1",
    type: "Plomberie urgente",
    status: "IN_PROGRESS",
    amount: 180,
    scheduledDate: "2026-03-31T14:00:00",
    category: "Plomberie",
    address: "42 rue de Rivoli, 75004 Paris",
    description: "Fuite importante sous le ballon d'eau chaude. Intervention urgente demandée.",
    artisan: { user: { name: "Marc D.", avatar: null } },
    devis: { number: "DEV-2026-052", totalHT: 150, totalTTC: 180, tva: 30 },
    invoice: null,
  },
  {
    id: "active-2",
    type: "Serrurerie",
    status: "ACCEPTED",
    amount: 220,
    scheduledDate: "2026-04-01T09:30:00",
    category: "Serrurerie",
    address: "15 rue de Vaugirard, 75006 Paris",
    description: "Remplacement cylindre de serrure et copie de 3 clés.",
    artisan: { user: { name: "Yassine K.", avatar: null } },
    devis: { number: "DEV-2026-053", totalHT: 183.33, totalTTC: 220, tva: 36.67 },
    invoice: null,
  },
  {
    id: "1",
    type: "Plomberie",
    status: "COMPLETED",
    amount: 320,
    scheduledDate: "2026-03-12T10:00:00",
    category: "Plomberie",
    address: "12 rue de la Paix, 75002 Paris",
    description: "Réparation fuite sous évier cuisine. Remplacement du siphon et des joints.",
    artisan: { user: { name: "Jean-Michel P.", avatar: null } },
    devis: { number: "DEV-2026-041", totalHT: 266.67, totalTTC: 320, tva: 53.33 },
    invoice: { number: "FAC-2026-041" },
  },
  {
    id: "2",
    type: "Électricité",
    status: "COMPLETED",
    amount: 195,
    scheduledDate: "2026-03-10T14:00:00",
    category: "Électricité",
    address: "8 avenue Victor Hugo, 75016 Paris",
    description: "Installation de deux prises supplémentaires dans le salon et vérification du tableau électrique.",
    artisan: { user: { name: "Sophie M.", avatar: null } },
    devis: { number: "DEV-2026-038", totalHT: 162.5, totalTTC: 195, tva: 32.5 },
    invoice: { number: "FAC-2026-038" },
  },
  {
    id: "3",
    type: "Serrurerie",
    status: "VALIDATED",
    amount: 280,
    scheduledDate: "2026-03-05T09:00:00",
    category: "Serrurerie",
    address: "25 boulevard Haussmann, 75009 Paris",
    description: "Changement de la serrure 3 points de la porte d'entrée.",
    artisan: { user: { name: "Karim B.", avatar: null } },
    devis: { number: "DEV-2026-032", totalHT: 233.33, totalTTC: 280, tva: 46.67 },
    invoice: { number: "FAC-2026-032" },
  },
  {
    id: "4",
    type: "Plomberie",
    status: "DISPUTED",
    amount: 450,
    scheduledDate: "2026-02-28T11:00:00",
    category: "Plomberie",
    address: "3 rue du Commerce, 75015 Paris",
    description: "Remplacement chauffe-eau 200L avec pose et raccordement.",
    artisan: { user: { name: "Thomas R.", avatar: null } },
    devis: { number: "DEV-2026-027", totalHT: 375, totalTTC: 450, tva: 75 },
    invoice: null,
  },
];

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

/** Onglets de filtrage */
const tabs = [
  { id: "all", label: "Toutes" },
  { id: "IN_PROGRESS", label: "En cours" },
  { id: "COMPLETED", label: "Terminées" },
  { id: "VALIDATED", label: "Validées" },
  { id: "DISPUTED", label: "Litiges" },
];

/** Apparence des badges de statut */
const statusBadge: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "En attente", cls: "bg-gold/10 text-gold" },
  ACCEPTED: { label: "Acceptée", cls: "bg-forest/10 text-forest" },
  IN_PROGRESS: { label: "En cours", cls: "bg-forest/10 text-forest" },
  COMPLETED: { label: "Terminée", cls: "bg-success/10 text-success" },
  VALIDATED: { label: "Validée", cls: "bg-gold/10 text-gold" },
  DISPUTED: { label: "Litige", cls: "bg-red/10 text-red" },
};

/** Labels des 4 étapes du séquestre */
const escrowSteps = [
  "Paiement bloqué",
  "Mission en cours",
  "Nous validons",
  "Artisan payé",
];

/** Détermine l'étape du séquestre selon le statut de la mission */
function getEscrowStep(status: string): number {
  const map: Record<string, number> = {
    PENDING: 0,
    ACCEPTED: 1,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    VALIDATED: 3,
    DISPUTED: 2,
  };
  return map[status] ?? 0;
}

/* ------------------------------------------------------------------ */
/*  Composant Stepper horizontal du séquestre                          */
/* ------------------------------------------------------------------ */

function EscrowStepperHorizontal({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center w-full">
      {escrowSteps.map((label, i) => {
        const done = i < currentStep;   // étape terminée
        const active = i === currentStep; // étape en cours
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              {/* Cercle numéroté ou coché */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  done && "bg-success text-white",
                  active && "border-2 border-forest text-forest bg-white",
                  !done && !active && "bg-gray-100 text-grayText",
                )}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {/* Label de l'étape */}
              <span
                className={cn(
                  "text-[10px] font-semibold text-center leading-tight whitespace-nowrap",
                  done ? "text-success" : active ? "text-forest" : "text-grayText",
                )}
              >
                {label}
              </span>
            </div>
            {/* Barre de connexion entre les étapes */}
            {i < escrowSteps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 mt-[-18px]",
                  i < currentStep ? "bg-success" : "bg-gray-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function MissionsPage() {
  /** Onglet actif */
  const [tab, setTab] = useState("all");
  /** ID de la mission dépliée (null = toutes repliées) */
  const [expandedId, setExpandedId] = useState<string | null>(null);
  /** Notes données par le client (clé = missionId, valeur = nombre d'étoiles) */
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const router = useRouter();
  const { data: apiMissions, loading } = useFetch<MissionData[]>("/api/missions");

  /* Données API ou mock en fallback */
  const missions = apiMissions && apiMissions.length > 0 ? apiMissions : mockMissions;

  /* Filtrage selon l'onglet sélectionné */
  const filteredMissions = missions.filter((m) => {
    if (tab === "all") return true;
    if (tab === "IN_PROGRESS") return m.status === "IN_PROGRESS" || m.status === "ACCEPTED";
    if (tab === "COMPLETED") return m.status === "COMPLETED";
    return m.status === tab;
  });

  /* Missions actives (en cours / acceptées) pour la bannière en haut */
  const activeMissions = missions.filter(
    (m) => m.status === "IN_PROGRESS" || m.status === "ACCEPTED"
  );

  /** Bascule le déplié d'une mission */
  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="max-w-[900px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-1">
        Mes missions
      </h1>
      <p className="text-sm text-grayText mb-6">Suivez vos interventions</p>

      {/* Bannière interventions en cours */}
      {activeMissions.length > 0 && (
        <div className="mb-6 space-y-3">
          {activeMissions.map((m) => {
            const name = m.artisan.user.name ?? "Artisan";
            const initials = getInitials(name);
            const isInProgress = m.status === "IN_PROGRESS";
            return (
              <div
                key={m.id}
                className={cn(
                  "relative overflow-hidden rounded-[14px] border-2 p-4",
                  isInProgress
                    ? "border-forest bg-gradient-to-r from-forest/5 to-sage/10"
                    : "border-gold/40 bg-gradient-to-r from-gold/5 to-gold/10",
                )}
              >
                {/* Pastille live */}
                {isInProgress && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest" />
                    </span>
                    <span className="text-[11px] font-bold text-forest uppercase tracking-wide">
                      En direct
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {initials}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-heading font-bold text-[15px] text-navy">
                        {m.type}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold",
                          isInProgress
                            ? "bg-forest/10 text-forest"
                            : "bg-gold/10 text-gold",
                        )}
                      >
                        {isInProgress ? "En cours" : "Acceptée"}
                      </span>
                    </div>
                    <div className="text-sm text-grayText flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{m.address ?? "---"}</span>
                    </div>
                    <div className="text-xs text-grayText mt-0.5">
                      {name} ·{" "}
                      {m.scheduledDate
                        ? new Date(m.scheduledDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "---"}
                    </div>
                  </div>

                  {/* Montant + bouton suivi */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {m.amount != null && (
                      <span className="font-mono font-bold text-navy">
                        {formatPrice(m.amount)}
                      </span>
                    )}
                    {isInProgress ? (
                      <button
                        onClick={() => router.push(`/tracking/${m.id}`)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-forest text-white text-xs font-bold hover:-translate-y-0.5 transition-transform shadow-md"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        Suivi en direct
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => toggle(m.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-gold/20 text-gold text-xs font-bold hover:bg-gold/30 transition-colors"
                      >
                        Voir détails
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Onglets de filtrage */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 rounded-[5px] text-[13px] font-semibold whitespace-nowrap transition-all",
              tab === t.id
                ? "bg-deepForest text-white"
                : "bg-white border border-border text-navy hover:bg-surface",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste des missions */}
      {loading ? (
        /* Squelettes de chargement */
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={80} />
          ))}
        </div>
      ) : filteredMissions.length > 0 ? (
        <div className="space-y-2">
          {filteredMissions.map((m) => {
            const name = m.artisan.user.name ?? "Artisan";
            const initials = getInitials(name);
            const badge = statusBadge[m.status] ?? { label: m.status, cls: "bg-surface text-forest" };
            const expanded = expandedId === m.id;
            const step = getEscrowStep(m.status);
            const rating = ratings[m.id] ?? 0;

            return (
              <div
                key={m.id}
                className="bg-white border border-border shadow-sm rounded-[5px] overflow-hidden transition-all"
              >
                {/* Ligne résumée (cliquable pour déplier) */}
                <button
                  onClick={() => toggle(m.id)}
                  className="w-full flex items-center gap-3.5 p-4 text-left hover:bg-surface/30 transition-colors"
                >
                  {/* Avatar initiales */}
                  <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {initials}
                  </div>

                  {/* Nom + type + date */}
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-semibold text-sm text-navy truncate">
                      {name}
                    </div>
                    <div className="text-sm text-grayText truncate">
                      {m.type}
                      {m.scheduledDate && (
                        <span className="ml-2 text-sm text-grayText">
                          {new Date(m.scheduledDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Montant */}
                  {m.amount != null && (
                    <span className="font-mono font-bold text-sm text-navy shrink-0">
                      {formatPrice(m.amount)}
                    </span>
                  )}

                  {/* Badge statut */}
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold shrink-0",
                      badge.cls,
                    )}
                  >
                    {badge.label}
                  </span>

                  {/* Chevron déplier/replier */}
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-grayText shrink-0 transition-transform duration-200",
                      expanded && "rotate-180",
                    )}
                  />
                </button>

                {/* Contenu déplié */}
                {expanded && (
                  <div className="px-5 pb-5 border-t border-border animate-in slide-in-from-top-2 duration-200">
                    {/* Stepper séquestre */}
                    <div className="py-5">
                      <EscrowStepperHorizontal currentStep={step} />
                    </div>

                    {/* Grille d'informations 2x2 */}
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <span className="text-[11px] text-grayText">Catégorie</span>
                        <div className="font-medium text-navy">{m.category ?? m.type}</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-grayText">Adresse</span>
                        <div className="font-medium text-navy">{m.address ?? "---"}</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-grayText">Date / heure</span>
                        <div className="font-medium text-navy">
                          {m.scheduledDate
                            ? new Date(m.scheduledDate).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "---"}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-grayText">Artisan</span>
                        <div className="font-medium text-navy">{name}</div>
                      </div>
                    </div>

                    {/* Description de la mission */}
                    {m.description && (
                      <div className="mb-4">
                        <span className="text-[11px] text-grayText">Description</span>
                        <p className="text-sm text-navy mt-1">{m.description}</p>
                      </div>
                    )}

                    {/* Détail financier (si devis disponible) */}
                    {m.devis && (
                      <div className="bg-surface/50 rounded-[5px] p-4 mb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-grayText">Montant HT</span>
                          <span className="font-mono font-semibold text-navy">
                            {formatPrice(m.devis.totalHT)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-grayText">TVA (20%)</span>
                          <span className="font-mono font-semibold text-navy">
                            {formatPrice(m.devis.tva)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                          <span className="font-semibold text-navy">Total TTC</span>
                          <span className="font-mono text-lg font-bold text-navy">
                            {formatPrice(m.devis.totalTTC)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Boutons téléchargement documents */}
                    <div className="flex gap-2 mb-5">
                      {m.devis && (
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[5px] bg-surface text-forest text-sm font-medium hover:bg-border transition-colors">
                          <Download className="w-4 h-4" />
                          Devis #{m.devis.number}
                        </button>
                      )}
                      {m.invoice && (
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[5px] bg-surface text-forest text-sm font-medium hover:bg-border transition-colors">
                          <Download className="w-4 h-4" />
                          Facture #{m.invoice.number}
                        </button>
                      )}
                    </div>

                    {/* Actions selon le statut */}

                    {/* Mission en cours : bouton suivi en direct */}
                    {(m.status === "IN_PROGRESS" || m.status === "ACCEPTED") && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 rounded-[5px] bg-forest/5 text-forest text-sm font-semibold">
                          <Shield className="w-5 h-5 shrink-0" />
                          Paiement sécurisé en séquestre — l&apos;artisan sera payé après votre validation
                        </div>
                        {m.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => router.push(`/tracking/${m.id}`)}
                            className="w-full py-3 rounded-[5px] bg-forest text-white font-bold font-heading text-sm hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
                          >
                            <Radio className="w-4 h-4" />
                            Suivre l&apos;intervention en direct
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {m.status === "ACCEPTED" && (
                          <div className="flex items-center gap-2 p-3 rounded-[5px] bg-gold/10 text-gold text-sm font-semibold">
                            <MapPin className="w-5 h-5 shrink-0" />
                            L&apos;artisan a accepté — le suivi en direct sera disponible au début de l&apos;intervention
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mission terminée : noter + valider ou signaler */}
                    {m.status === "COMPLETED" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-grayText">Notez l&apos;artisan :</span>
                          <StarRating
                            value={rating}
                            onChange={(v) => setRatings((prev) => ({ ...prev, [m.id]: v }))}
                            size="lg"
                          />
                        </div>
                        <button
                          onClick={() => router.push(`/mission/${m.id}`)}
                          className="w-full py-3 rounded-[5px] bg-deepForest text-white font-bold font-heading text-sm hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Valider — Libérer le paiement
                        </button>
                        <button className="w-full py-2.5 rounded-[5px] text-red text-sm font-semibold hover:bg-red/5 transition-colors flex items-center justify-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" />
                          Signaler un litige
                        </button>
                      </div>
                    )}

                    {/* Mission validée : paiement effectué */}
                    {m.status === "VALIDATED" && (
                      <div className="flex items-center gap-2 p-3 rounded-[5px] bg-success/10 text-success text-sm font-semibold">
                        <Check className="w-5 h-5" />
                        Paiement versé à l&apos;artisan
                      </div>
                    )}

                    {/* Mission en litige : paiement bloqué */}
                    {m.status === "DISPUTED" && (
                      <div className="flex items-center gap-2 p-3 rounded-[5px] bg-red/10 text-red text-sm font-semibold">
                        <Lock className="w-5 h-5" />
                        Paiement bloqué — Litige en cours de résolution
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* État vide */
        <EmptyState
          icon={
            tab === "DISPUTED" ? (
              <AlertTriangle className="w-6 h-6 text-grayText" />
            ) : (
              <FileText className="w-6 h-6 text-grayText" />
            )
          }
          title={tab === "DISPUTED" ? "Aucun litige" : "Aucune mission"}
          description={
            tab === "all"
              ? "Réservez un artisan pour voir vos missions ici"
              : undefined
          }
        />
      )}
    </div>
  );
}
