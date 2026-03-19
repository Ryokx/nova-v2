"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/components/ui/badge";

interface DevisDoc {
  id: string;
  number: string;
  totalTTC: number;
  status: string;
  createdAt: string;
  mission: { type: string; client: { name: string } };
}

interface InvoiceDoc {
  id: string;
  number: string;
  totalTTC: number;
  paidAt: string | null;
  createdAt: string;
  mission: { type: string; client: { name: string } };
}

const devisStatusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  DRAFT: { label: "Brouillon", variant: "default" },
  SENT: { label: "Envoyé", variant: "info" },
  SIGNED: { label: "Accepté", variant: "success" },
  REFUSED: { label: "Refusé", variant: "danger" },
};

export default function ArtisanDocumentsPage() {
  const [tab, setTab] = useState<"devis" | "factures">("devis");
  const { data: devis, loading: loadingDevis } = useFetch<DevisDoc[]>("/api/devis");
  const { data: invoices, loading: loadingInvoices } = useFetch<InvoiceDoc[]>("/api/invoices");

  const loading = tab === "devis" ? loadingDevis : loadingInvoices;

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-1">Documents</h1>
      <p className="text-sm text-grayText mb-5">Vos devis et factures</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "devis" as const, label: "Devis" },
          { id: "factures" as const, label: "Factures" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all",
              tab === t.id
                ? "bg-deepForest text-white"
                : "bg-white border border-border text-navy hover:bg-surface",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} />)}
        </div>
      ) : tab === "devis" ? (
        devis && devis.length > 0 ? (
          <div className="space-y-2">
            {devis.map((d) => {
              const status = devisStatusMap[d.status] ?? { label: d.status, variant: "default" as BadgeVariant };
              return (
                <Card key={d.id} className="flex items-center gap-3 py-3.5 px-4">
                  <div className="w-9 h-9 rounded-lg bg-forest/5 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-navy">{d.mission.client.name}</div>
                    <div className="text-xs text-grayText">{d.mission.type} • <span className="font-mono">{d.number}</span></div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm font-bold text-navy">{formatPrice(d.totalTTC)}</div>
                    <Badge variant={status.variant} className="text-[10px] mt-0.5">{status.label}</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={<FileText className="w-6 h-6 text-grayText" />} title="Aucun devis" description="Créez votre premier devis" />
        )
      ) : invoices && invoices.length > 0 ? (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <Card key={inv.id} className="flex items-center gap-3 py-3.5 px-4">
              <div className="w-9 h-9 rounded-lg bg-forest/5 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-forest" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-navy">{inv.mission.client.name}</div>
                <div className="text-xs text-grayText">{inv.mission.type} • <span className="font-mono">{inv.number}</span></div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-sm font-bold text-navy">{formatPrice(inv.totalTTC)}</div>
                <Badge variant={inv.paidAt ? "success" : "warning"} className="text-[10px] mt-0.5">
                  {inv.paidAt ? "Payée" : "En attente"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={<FileText className="w-6 h-6 text-grayText" />} title="Aucune facture" />
      )}
    </div>
  );
}
