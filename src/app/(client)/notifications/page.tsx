"use client";

import { Bell, FileText, CheckCircle, CreditCard, UserPlus, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
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

const iconMap: Record<string, React.ReactNode> = {
  DEVIS_RECEIVED: <FileText className="w-4 h-4 text-forest" />,
  DEVIS_ACCEPTED: <FileText className="w-4 h-4 text-forest" />,
  MISSION_CONFIRMED: <CheckCircle className="w-4 h-4 text-success" />,
  PAYMENT_RELEASED: <CreditCard className="w-4 h-4 text-gold" />,
  WELCOME: <UserPlus className="w-4 h-4 text-forest" />,
  URGENT_REQUEST: <Zap className="w-4 h-4 text-red" />,
  APPOINTMENT_CONFIRMED: <CheckCircle className="w-4 h-4 text-forest" />,
  CERTIFICATION_RENEWED: <CheckCircle className="w-4 h-4 text-success" />,
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Hier" : `Il y a ${days} jours`;
}

export default function NotificationsPage() {
  const { data: notifications, loading, refetch } = useFetch<NotifData[]>("/api/notifications");

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readAll: true }),
    });
    refetch();
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[26px] font-extrabold text-navy">Notifications</h1>
        {notifications && notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="text-xs text-forest font-semibold hover:underline"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} />)}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn(
                "flex items-start gap-3 py-3.5 px-4",
                !n.read && "border-forest/20 bg-forest/[0.02]",
              )}
            >
              {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-forest shrink-0 mt-1" />}
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                {iconMap[n.type] ?? <Bell className="w-4 h-4 text-grayText" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-navy">{n.title}</div>
                <p className="text-[13px] text-grayText leading-relaxed mt-0.5">{n.body}</p>
                <div className="text-[11px] text-grayText/60 mt-1">{timeAgo(n.createdAt)}</div>
              </div>
            </Card>
          ))}
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
