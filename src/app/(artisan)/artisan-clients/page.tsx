"use client";

import { useState } from "react";
import { Search, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";

interface ClientBookData {
  clients: Array<{
    id: string;
    name: string;
    phone: string | null;
    email: string;
    missions: number;
    lastDate: string;
    total: number;
  }>;
  totalClients: number;
  totalMissions: number;
  totalRevenue: number;
}

export default function ArtisanClientsPage() {
  const [search, setSearch] = useState("");
  const { data, loading } = useFetch<ClientBookData>("/api/artisan/clients");

  const clients = data?.clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  ) ?? [];

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-5">Mes clients</h1>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { value: data.totalClients, label: "Clients" },
            { value: data.totalMissions, label: "Missions" },
            { value: formatPrice(data.totalRevenue), label: "CA total" },
          ].map((s) => (
            <Card key={s.label} className="text-center py-3">
              <div className="font-mono text-xl font-bold text-forest">{s.value}</div>
              <div className="text-[10px] text-grayText">{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-white text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30"
        />
      </div>

      {/* Client list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} />)}
        </div>
      ) : clients.length > 0 ? (
        <div className="space-y-2">
          {clients.map((c) => (
            <Card key={c.id} className="flex items-center gap-3.5 py-3.5 px-4">
              <Avatar name={c.name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-navy">{c.name}</div>
                <div className="text-xs text-grayText">
                  {c.missions} mission{c.missions > 1 ? "s" : ""} • Dernier :{" "}
                  {new Date(c.lastDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                </div>
                {c.phone && (
                  <div className="flex items-center gap-1 text-[11px] text-grayText mt-0.5">
                    <Phone className="w-3 h-3" /> {c.phone}
                  </div>
                )}
              </div>
              <div className="font-mono text-[15px] font-bold text-forest shrink-0">
                {formatPrice(c.total)}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Aucun client trouvé" />
      )}
    </div>
  );
}
