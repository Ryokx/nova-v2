"use client";

import { useState } from "react";
import { Search, Phone } from "lucide-react";


interface Client {
  id: string;
  name: string;
  initials: string;
  missions: number;
  lastDate: string;
  total: string;
  phone?: string;
}

const stats = [
  { value: "4", label: "Clients" },
  { value: "10", label: "Missions" },
  { value: "2 985€", label: "CA total" },
];

const clients: Client[] = [
  { id: "c1", name: "Pierre Martin", initials: "PM", missions: 4, lastDate: "15 mars", total: "1 280€", phone: "06 12 34 56 78" },
  { id: "c2", name: "Sophie Lefevre", initials: "SL", missions: 2, lastDate: "10 mars", total: "475€", phone: "06 98 76 54 32" },
  { id: "c3", name: "Caroline Durand", initials: "CD", missions: 1, lastDate: "2 mars", total: "280€" },
  { id: "c4", name: "Antoine Moreau", initials: "AM", missions: 3, lastDate: "22 fév", total: "950€", phone: "06 55 44 33 22" },
];

export default function ArtisanClientsPage() {
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Mes clients</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface rounded-xl p-4 text-center">
            <div className="font-mono text-xl font-bold text-forest">{s.value}</div>
            <div className="text-xs text-grayText mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-border rounded-xl p-3 pl-10 text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30"
        />
      </div>

      {/* Client list */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-[20px] p-5 border border-border shadow-sm flex items-center gap-3.5"
            >
              {/* Avatar */}
              <div className="w-[44px] h-[44px] rounded-[12px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-bold text-sm shrink-0">
                {c.initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-heading font-semibold text-[15px] text-navy">{c.name}</div>
                <div className="text-xs text-grayText mt-0.5">
                  {c.missions} mission{c.missions > 1 ? "s" : ""} · Dernier : {c.lastDate}
                </div>
              </div>

              {/* CA */}
              <div className="font-mono font-bold text-[15px] text-forest shrink-0">
                {c.total}
              </div>

              {/* Phone button */}
              {c.phone && (
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-forest hover:-translate-y-0.5 transition-transform shrink-0"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-grayText" />
            </div>
            <h3 className="font-heading text-lg font-bold text-navy">Aucun client trouvé</h3>
          </div>
        )}
      </div>
    </div>
  );
}
