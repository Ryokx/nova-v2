/**
 * Page des notifications artisan.
 * Affiche les notifications (urgences, devis acceptés, paiements, RDV, rappels)
 * avec filtres par type et possibilité de tout marquer comme lu.
 * Utilise l'API /api/notifications avec fallback sur des données mockées.
 */
"use client";

import { useState } from "react";
import { Bell, Zap, FileText, CreditCard, Calendar, Shield, Filter, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

/* Structure d'une notification */
interface NotifData {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

/* Icône et couleur de fond pour chaque type de notification */
const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
  URGENT_REQUEST: { icon: <Zap className="w-5 h-5 text-red" />, bg: "bg-red/10" },
  DEVIS_ACCEPTED: { icon: <FileText className="w-5 h-5 text-success" />, bg: "bg-success/10" },
  PAYMENT_RELEASED: { icon: <CreditCard className="w-5 h-5 text-gold" />, bg: "bg-gold/10" },
  APPOINTMENT_CONFIRMED: { icon: <Calendar className="w-5 h-5 text-forest" />, bg: "bg-forest/10" },
  CERTIFICATION_REMINDER: { icon: <Shield className="w-5 h-5 text-grayText" />, bg: "bg-gray-100" },
};

/* Libellé du bouton d'action selon le type de notification */
const actionLabels: Record<string, string> = {
  URGENT_REQUEST: "Voir",
  DEVIS_ACCEPTED: "Voir le devis",
  PAYMENT_RELEASED: "Détails",
  APPOINTMENT_CONFIRMED: "Voir",
};

/* Onglets de filtre disponibles */
const filterTabs = [
  { key: "all", label: "Toutes" },
  { key: "unread", label: "Non lues" },
  { key: "URGENT_REQUEST", label: "Urgences" },
  { key: "DEVIS_ACCEPTED", label: "Devis" },
  { key: "PAYMENT_RELEASED", label: "Paiements" },
  { key: "APPOINTMENT_CONFIRMED", label: "Rendez-vous" },
  { key: "CERTIFICATION_REMINDER", label: "Rappels" },
];

/* Notifications mockées (affichées si l'API ne retourne rien) */
const mockNotifications: NotifData[] = [
  {
    id: "1",
    type: "URGENT_REQUEST",
    title: "Demande urgente",
    body: "Fuite d'eau importante — Mme Dubois, 15e arrondissement",
    read: false,
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  {
    id: "2",
    type: "DEVIS_ACCEPTED",
    title: "Devis accepté",
    body: "Votre devis pour la rénovation salle de bain a été accepté",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    type: "PAYMENT_RELEASED",
    title: "Paiement libéré — 450€",
    body: "Le paiement pour la mission #1247 a été libéré du séquestre",
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "4",
    type: "APPOINTMENT_CONFIRMED",
    title: "Nouveau RDV — Pierre M.",
    body: "Rendez-vous confirmé pour le 22 mars à 9h00",
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "5",
    type: "CERTIFICATION_REMINDER",
    title: "Rappel certification",
    body: "Votre assurance décennale expire dans 30 jours",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
];

/* Formate un timestamp en durée relative ("Il y a 2h", "Hier", etc.) */
function formatTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Hier" : `Il y a ${days} jours`;
}

export default function ArtisanNotificationsPage() {
  /* Récupération des notifications via l'API */
  const { data: apiNotifications, loading, refetch } = useFetch<NotifData[]>("/api/notifications");
  /* Filtre actif (par défaut : toutes) */
  const [activeFilter, setActiveFilter] = useState("all");

  /* Utilise les données API si disponibles, sinon les données mockées */
  const notifications = apiNotifications && apiNotifications.length > 0 ? apiNotifications : mockNotifications;

  /* Filtrage des notifications selon l'onglet sélectionné */
  const filteredNotifications = notifications
    ? notifications.filter((n) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "unread") return !n.read;
        return n.type === activeFilter;
      })
    : [];

  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 0;

  /* Marque toutes les notifications comme lues via l'API */
  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readAll: true }),
    });
    refetch();
  };

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold text-navy">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-[13px] text-grayText mt-1">
              {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {notifications && notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] text-sm font-bold text-forest bg-surface hover:bg-forest/10 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-grayText shrink-0" />
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              "px-5 py-2.5 rounded-[5px] text-sm font-bold whitespace-nowrap transition-colors",
              activeFilter === tab.key
                ? "bg-deepForest text-white"
                : "bg-white border border-border text-navy hover:bg-surface"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={96} />)}
        </div>
      ) : filteredNotifications && filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((n) => {
            const config = iconMap[n.type] ?? { icon: <Bell className="w-5 h-5 text-grayText" />, bg: "bg-gray-100" };
            const actionLabel = actionLabels[n.type];
            return (
              <div
                key={n.id}
                className={cn(
                  "bg-white rounded-[5px] p-5 border border-border flex items-start gap-4 transition-colors",
                  !n.read && "border-l-4 border-l-forest bg-forest/[0.02]"
                )}
              >
                {/* Icon circle */}
                <div className={cn(
                  "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
                  config.bg,
                )}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-[15px] font-semibold text-navy">{n.title}</span>
                    {!n.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-forest shrink-0" />
                    )}
                  </div>
                  <p className="text-[15px] text-grayText leading-relaxed mt-1">{n.body}</p>
                  <div className="text-[13px] font-mono text-grayText mt-2">{formatTime(n.createdAt)}</div>
                </div>

                {/* Action button */}
                {actionLabel && (
                  <button className="shrink-0 px-5 py-2.5 rounded-[5px] text-sm font-bold text-forest bg-surface hover:bg-forest/10 transition-colors mt-1">
                    {actionLabel}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-6 h-6 text-grayText" />}
          title="Aucune notification"
          description="Vous serez notifié des nouvelles demandes et paiements"
        />
      )}
    </div>
  );
}
