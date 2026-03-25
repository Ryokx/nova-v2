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
/*  Mock data (used when API returns nothing — prototype feel)         */
/* ------------------------------------------------------------------ */

const mockMissions: MissionData[] = [
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
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */

const tabs = [
  { id: "all", label: "Toutes" },
  { id: "COMPLETED", label: "Terminées" },
  { id: "VALIDATED", label: "Validées" },
  { id: "DISPUTED", label: "Litiges" },
];

/* ------------------------------------------------------------------ */
/*  Status config                                                      */
/* ------------------------------------------------------------------ */

const statusBadge: Record<string, { label: string; cls: string }> = {
  IN_PROGRESS: { label: "En cours", cls: "bg-forest/10 text-forest" },
  COMPLETED: { label: "Terminée", cls: "bg-success/10 text-success" },
  VALIDATED: { label: "Validée", cls: "bg-gold/10 text-gold" },
  DISPUTED: { label: "Litige", cls: "bg-red/10 text-red" },
};

/* ------------------------------------------------------------------ */
/*  Escrow step helper                                                 */
/* ------------------------------------------------------------------ */

const escrowSteps = [
  "Paiement bloqué",
  "Mission en cours",
  "Nous validons",
  "Artisan payé",
];

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

function EscrowStepperHorizontal({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center w-full">
      {escrowSteps.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
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
              <span
                className={cn(
                  "text-[10px] font-semibold text-center leading-tight whitespace-nowrap",
                  done ? "text-success" : active ? "text-forest" : "text-grayText",
                )}
              >
                {label}
              </span>
            </div>
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
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function MissionsPage() {
  const [tab, setTab] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const router = useRouter();
  const { data: apiMissions, loading } = useFetch<MissionData[]>("/api/missions");

  // Use API data if available, otherwise fall back to mock
  const missions = apiMissions && apiMissions.length > 0 ? apiMissions : mockMissions;

  const filteredMissions = missions.filter((m) => {
    if (tab === "all") return true;
    if (tab === "COMPLETED") return m.status === "COMPLETED";
    return m.status === tab;
  });

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="max-w-[900px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-1">
        Mes missions
      </h1>
      <p className="text-sm text-grayText mb-6">Suivez vos interventions</p>

      {/* Tab pills */}
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

      {/* Mission list */}
      {loading ? (
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
                {/* Summary row */}
                <button
                  onClick={() => toggle(m.id)}
                  className="w-full flex items-center gap-3.5 p-4 text-left hover:bg-surface/30 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {initials}
                  </div>

                  {/* Name + type + date */}
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

                  {/* Amount */}
                  {m.amount != null && (
                    <span className="font-mono font-bold text-sm text-navy shrink-0">
                      {formatPrice(m.amount)}
                    </span>
                  )}

                  {/* Status badge */}
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold shrink-0",
                      badge.cls,
                    )}
                  >
                    {badge.label}
                  </span>

                  {/* Expand chevron */}
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-grayText shrink-0 transition-transform duration-200",
                      expanded && "rotate-180",
                    )}
                  />
                </button>

                {/* Expanded content */}
                {expanded && (
                  <div className="px-5 pb-5 border-t border-border animate-in slide-in-from-top-2 duration-200">
                    {/* Escrow stepper */}
                    <div className="py-5">
                      <EscrowStepperHorizontal currentStep={step} />
                    </div>

                    {/* Info grid 2x2 */}
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

                    {/* Description */}
                    {m.description && (
                      <div className="mb-4">
                        <span className="text-[11px] text-grayText">Description</span>
                        <p className="text-sm text-navy mt-1">{m.description}</p>
                      </div>
                    )}

                    {/* Financial */}
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

                    {/* Documents */}
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

                    {/* Actions: Terminée */}
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

                    {/* Actions: Validée */}
                    {m.status === "VALIDATED" && (
                      <div className="flex items-center gap-2 p-3 rounded-[5px] bg-success/10 text-success text-sm font-semibold">
                        <Check className="w-5 h-5" />
                        Paiement versé à l&apos;artisan
                      </div>
                    )}

                    {/* Actions: Litige */}
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
