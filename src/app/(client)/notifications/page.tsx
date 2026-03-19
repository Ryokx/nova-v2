"use client";

import { useState } from "react";
import { Bell, FileText, CheckCircle, CreditCard, UserPlus } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface NotifData {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const mockNotifications: NotifData[] = [
  {
    id: "1",
    type: "DEVIS_RECEIVED",
    title: "Nouveau devis reçu",
    body: "Jean Dupont vous a envoyé un devis pour votre intervention plomberie.",
    read: false,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "MISSION_CONFIRMED",
    title: "Mission confirmée",
    body: "Votre mission avec Pierre Martin a été confirmée pour le 22 mars.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "PAYMENT_RELEASED",
    title: "Paiement validé par Nova",
    body: "Le paiement de 450€ a été libéré au profit de l'artisan.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "WELCOME",
    title: "Bienvenue sur Nova",
    body: "Découvrez nos artisans certifiés et réservez votre première intervention.",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const iconConfig: Record<string, { icon: React.ReactNode; bg: string }> = {
  DEVIS_RECEIVED: {
    icon: <FileText className="w-5 h-5 text-forest" />,
    bg: "bg-forest/10",
  },
  MISSION_CONFIRMED: {
    icon: <CheckCircle className="w-5 h-5 text-success" />,
    bg: "bg-success/10",
  },
  PAYMENT_RELEASED: {
    icon: <CreditCard className="w-5 h-5 text-gold" />,
    bg: "bg-gold/10",
  },
  WELCOME: {
    icon: <UserPlus className="w-5 h-5 text-grayText" />,
    bg: "bg-gray-100",
  },
};

const actionLabels: Record<string, string> = {
  DEVIS_RECEIVED: "Voir le devis",
  MISSION_CONFIRMED: "Voir la mission",
  PAYMENT_RELEASED: "Détails",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Hier" : `Il y a ${days} jours`;
}

export default function NotificationsPage() {
  const { data: apiNotifications, loading, refetch } = useFetch<NotifData[]>("/api/notifications");
  const [localNotifs, setLocalNotifs] = useState<NotifData[] | null>(null);

  const notifications = localNotifs ?? apiNotifications ?? mockNotifications;
  const hasUnread = notifications.some((n) => !n.read);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true }),
      });
      refetch();
    } catch {
      // Fallback: mark locally
      setLocalNotifs(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[26px] font-extrabold text-navy">Notifications</h1>
        {hasUnread && (
          <button
            onClick={markAllRead}
            className="text-sm text-forest font-semibold hover:underline"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={100} />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const config = iconConfig[n.type] ?? {
              icon: <Bell className="w-5 h-5 text-grayText" />,
              bg: "bg-gray-100",
            };
            const action = actionLabels[n.type];

            return (
              <div
                key={n.id}
                className="bg-white rounded-[20px] p-5 border border-border flex items-start gap-3"
              >
                {/* Unread indicator */}
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-forest shrink-0 mt-2" />
                )}

                {/* Icon circle */}
                <div
                  className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center shrink-0`}
                >
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-navy">{n.title}</div>
                  <p className="text-sm text-grayText mt-0.5">{n.body}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-grayText font-mono">{timeAgo(n.createdAt)}</span>
                    {action && (
                      <button className="text-sm text-forest font-semibold hover:underline">
                        {action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-6 h-6 text-grayText" />}
          title="Aucune notification"
          description="Vous serez notifié des mises à jour de vos missions"
        />
      )}
    </div>
  );
}
