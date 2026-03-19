"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";

interface InvoiceData {
  id: string;
  number: string;
  totalHT: number;
  totalTTC: number;
  tva: number;
  paidAt: string | null;
  items: Array<{ label: string; total: number }>;
  mission: { type: string; client: { name: string } };
}

export default function ArtisanInvoicesPage() {
  const router = useRouter();
  const { data: invoices, loading } = useFetch<InvoiceData[]>("/api/invoices");

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Factures</h1>
      <p className="text-sm text-grayText mb-5">Factures générées automatiquement après validation</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={120} />)}
        </div>
      ) : invoices && invoices.length > 0 ? (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <Card key={inv.id}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-forest font-semibold">#{inv.number}</span>
                <Badge variant={inv.paidAt ? "success" : "warning"}>
                  {inv.paidAt ? "Payée" : "En attente"}
                </Badge>
              </div>
              <div className="text-sm font-semibold text-navy">{inv.mission.client.name}</div>
              <div className="text-xs text-grayText">{inv.mission.type}</div>

              <div className="mt-3 pt-3 border-t border-border space-y-1">
                {(inv.items as Array<{ label: string; total: number }>).map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-grayText">{item.label}</span>
                    <span className="font-mono text-navy">{formatPrice(item.total)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-border text-sm">
                  <span className="font-bold text-navy">Total TTC</span>
                  <span className="font-mono text-lg font-bold text-navy">{formatPrice(inv.totalTTC)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1 text-xs">Envoyer au client</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Download className="w-3 h-3" /> PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="w-6 h-6 text-grayText" />}
          title="Aucune facture"
          description="Les factures sont générées automatiquement après validation des missions"
        />
      )}
    </div>
  );
}
