"use client";

import { Bell, Zap, FileText, CreditCard, Calendar, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

interface NotifData {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
  URGENT_REQUEST: { icon: <Zap className="w-4 h-4 text-red" />, bg: "bg-red/10" },
  DEVIS_ACCEPTED: { icon: <FileText className="w-4 h-4 text-success" />, bg: "bg-success/10" },
  PAYMENT_RELEASED: { icon: <CreditCard className="w-4 h-4 text-gold" />, bg: "bg-gold/10" },
  APPOINTMENT_CONFIRMED: { icon: <Calendar className="w-4 h-4 text-forest" />, bg: "bg-forest/10" },
  CERTIFICATION_REMINDER: { icon: <Shield className="w-4 h-4 text-grayText" />, bg: "bg-gray-100" },
};

const actionLabels: Record<string, string> = {
  URGENT_REQUEST: "Voir",
  DEVIS_ACCEPTED: "Voir le devis",
  PAYMENT_RELEASED: "Détails",
  APPOINTMENT_CONFIRMED: "Voir",
};

// Mock notifications for display
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
  const { data: apiNotifications, loading, refetch } = useFetch<NotifData[]>("/api/notifications");

  const notifications = apiNotifications && apiNotifications.length > 0 ? apiNotifications : mockNotifications;

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readAll: true }),
    });
    refetch();
  };

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[26px] font-extrabold text-navy">Notifications</h1>
        {notifications && notifications.some((n) => !n.read) && (
          <button onClick={markAllRead} className="text-xs text-forest font-semibold hover:underline">
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} />)}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const config = iconMap[n.type] ?? { icon: <Bell className="w-4 h-4 text-grayText" />, bg: "bg-gray-100" };
            const actionLabel = actionLabels[n.type];
            return (
              <div
                key={n.id}
                className="bg-white rounded-[20px] p-5 border border-border flex items-start gap-3"
              >
                {/* Unread dot */}
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-forest shrink-0 mt-2" />
                )}

                {/* Icon circle */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  config.bg,
                )}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-sm font-semibold text-navy">{n.title}</div>
                  <p className="text-sm text-grayText leading-relaxed mt-0.5">{n.body}</p>
                  <div className="text-xs font-mono text-grayText mt-1">{formatTime(n.createdAt)}</div>
                </div>

                {/* Action button */}
                {actionLabel && (
                  <button className="shrink-0 text-forest text-sm font-semibold hover:underline mt-1">
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
