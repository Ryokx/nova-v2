"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { BadgeVariant } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: "En attente", variant: "warning" },
  ACCEPTED: { label: "Acceptée", variant: "info" },
  IN_PROGRESS: { label: "En cours", variant: "success" },
  COMPLETED: { label: "Terminée", variant: "info" },
  VALIDATED: { label: "Validée", variant: "success" },
  DISPUTED: { label: "Litige", variant: "danger" },
  CANCELLED: { label: "Annulée", variant: "default" },
};

interface MissionCardProps {
  id: string;
  type: string;
  status: string;
  amount: number | null;
  artisanName: string;
  artisanAvatar?: string | null;
  scheduledDate: string | null;
  onClick?: () => void;
  className?: string;
}

export function MissionCard({
  type,
  status,
  amount,
  artisanName,
  artisanAvatar,
  scheduledDate,
  onClick,
  className,
}: MissionCardProps) {
  const config = statusConfig[status] ?? { label: status, variant: "default" as BadgeVariant };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 p-4 rounded-lg bg-white border border-border hover:bg-surface/50 transition-colors text-left",
        className,
      )}
    >
      <Avatar name={artisanName} src={artisanAvatar} size="md" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-navy truncate">{artisanName}</div>
        <div className="text-xs text-grayText truncate">{type}</div>
      </div>
      <div className="text-right shrink-0">
        {amount ? (
          <div className="font-mono text-sm font-bold text-navy">{formatPrice(amount)}</div>
        ) : (
          <div className="text-xs text-grayText">En attente</div>
        )}
        {scheduledDate && (
          <div className="text-[10px] text-grayText mt-0.5">
            {new Date(scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
          </div>
        )}
      </div>
      <Badge variant={config.variant}>{config.label}</Badge>
    </button>
  );
}
