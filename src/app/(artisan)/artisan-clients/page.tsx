"use client";

import { useState } from "react";
import { Search, Phone, Users, Briefcase, TrendingUp, Calendar, Mail, MapPin, ChevronRight, X } from "lucide-react";


interface Client {
  id: string;
  name: string;
  initials: string;
  missions: number;
  lastDate: string;
  total: string;
  phone?: string;
  email?: string;
  address?: string;
  missionsList?: { label: string; date: string; amount: string; status: string }[];
}

const stats = [
  { value: "4", label: "Clients actifs", color: "border-forest", icon: Users },
  { value: "10", label: "Missions totales", color: "border-sage", icon: Briefcase },
  { value: "2 985 EUR", label: "Chiffre d'affaires", color: "border-gold", icon: TrendingUp },
];

const clients: Client[] = [
  {
    id: "c1",
    name: "Pierre Martin",
    initials: "PM",
    missions: 4,
    lastDate: "15 mars 2026",
    total: "1 280 EUR",
    phone: "06 12 34 56 78",
    email: "pierre.martin@email.fr",
    address: "12 rue des Lilas, 75011 Paris",
    missionsList: [
      { label: "Renovation salle de bain", date: "15 mars 2026", amount: "480 EUR", status: "Terminee" },
      { label: "Installation chauffe-eau", date: "2 mars 2026", amount: "320 EUR", status: "Terminee" },
      { label: "Depannage fuite cuisine", date: "18 fev 2026", amount: "180 EUR", status: "Terminee" },
      { label: "Remplacement robinetterie", date: "5 fev 2026", amount: "300 EUR", status: "Terminee" },
    ],
  },
  {
    id: "c2",
    name: "Sophie Lefevre",
    initials: "SL",
    missions: 2,
    lastDate: "10 mars 2026",
    total: "475 EUR",
    phone: "06 98 76 54 32",
    email: "sophie.lefevre@email.fr",
    address: "8 avenue Victor Hugo, 92100 Boulogne",
    missionsList: [
      { label: "Pose carrelage entree", date: "10 mars 2026", amount: "275 EUR", status: "Terminee" },
      { label: "Reparation chasse d'eau", date: "22 fev 2026", amount: "200 EUR", status: "Terminee" },
    ],
  },
  {
    id: "c3",
    name: "Caroline Durand",
    initials: "CD",
    missions: 1,
    lastDate: "2 mars 2026",
    total: "280 EUR",
    email: "caroline.durand@email.fr",
    address: "45 boulevard Haussmann, 75008 Paris",
    missionsList: [
      { label: "Diagnostic plomberie", date: "2 mars 2026", amount: "280 EUR", status: "Terminee" },
    ],
  },
  {
    id: "c4",
    name: "Antoine Moreau",
    initials: "AM",
    missions: 3,
    lastDate: "22 fev 2026",
    total: "950 EUR",
    phone: "06 55 44 33 22",
    email: "antoine.moreau@email.fr",
    address: "3 rue de la Paix, 75002 Paris",
    missionsList: [
      { label: "Renovation douche italienne", date: "22 fev 2026", amount: "520 EUR", status: "En cours" },
      { label: "Installation mitigeur", date: "10 fev 2026", amount: "230 EUR", status: "Terminee" },
      { label: "Entretien chaudiere", date: "28 jan 2026", amount: "200 EUR", status: "Terminee" },
    ],
  },
];

export default function ArtisanClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0]);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[28px] font-extrabold text-navy mb-6">Repertoire clients</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-[5px] p-5 border border-border shadow-sm border-l-[3px] ${s.color} flex items-center gap-4`}
          >
            <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5 text-forest" />
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-navy">{s.value}</div>
              <div className="text-[13px] text-grayText">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Master-detail layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left panel — Client list */}
        <div className="lg:col-span-5">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-grayText" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-border rounded-[5px] py-4 px-5 pl-11 text-[15px] text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          {/* Table header */}
          <div className="bg-surface rounded-[5px] px-5 py-2.5 mb-2 grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5 text-[13px] font-semibold text-grayText uppercase tracking-wide">Client</div>
            <div className="col-span-2 text-[13px] font-semibold text-grayText uppercase tracking-wide text-center">Missions</div>
            <div className="col-span-3 text-[13px] font-semibold text-grayText uppercase tracking-wide text-right">CA</div>
            <div className="col-span-2 text-[13px] font-semibold text-grayText uppercase tracking-wide text-right">Dernier</div>
          </div>

          {/* Client rows */}
          <div className="space-y-2">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className={`w-full text-left bg-white rounded-[5px] p-5 border shadow-sm grid grid-cols-12 gap-2 items-center transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                    selectedClient?.id === c.id
                      ? "border-forest ring-1 ring-forest/20"
                      : "border-border"
                  }`}
                >
                  {/* Client name + avatar */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-[40px] h-[40px] rounded-[5px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-bold text-[13px] shrink-0">
                      {c.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-semibold text-[15px] text-navy truncate">{c.name}</div>
                    </div>
                  </div>

                  {/* Missions count */}
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-[5px] bg-surface font-mono text-[13px] font-bold text-forest">
                      {c.missions}
                    </span>
                  </div>

                  {/* CA */}
                  <div className="col-span-3 text-right">
                    <span className="font-mono font-bold text-[15px] text-navy">{c.total}</span>
                  </div>

                  {/* Last contact */}
                  <div className="col-span-2 text-right flex items-center justify-end gap-1">
                    <span className="text-xs text-grayText whitespace-nowrap">{c.lastDate.split(" ").slice(0, 2).join(" ")}</span>
                    <ChevronRight className="w-4 h-4 text-grayText/40 shrink-0 hidden lg:block" />
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[5px] border border-border">
                <div className="w-16 h-16 rounded-[5px] bg-surface flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-grayText" />
                </div>
                <h3 className="font-heading text-lg font-bold text-navy">Aucun client trouve</h3>
                <p className="text-[13px] text-grayText mt-1">Modifiez votre recherche pour trouver un client.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel — Client detail */}
        <div className="lg:col-span-7">
          {selectedClient ? (
            <div className="bg-white rounded-[5px] border border-border shadow-sm sticky top-8">
              {/* Detail header */}
              <div className="p-5 border-b border-border flex items-center gap-4">
                <div className="w-[52px] h-[52px] rounded-[5px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-bold text-[15px] shrink-0">
                  {selectedClient.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading font-bold text-xl text-navy">{selectedClient.name}</h2>
                  <div className="text-[13px] text-grayText mt-0.5">
                    {selectedClient.missions} mission{selectedClient.missions > 1 ? "s" : ""} -- Dernier contact : {selectedClient.lastDate}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="w-9 h-9 rounded-[5px] bg-surface flex items-center justify-center text-grayText hover:text-navy transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact info */}
              <div className="p-5 border-b border-border">
                <h3 className="font-heading font-semibold text-[15px] text-navy mb-3">Coordonnees</h3>
                <div className="space-y-2.5">
                  {selectedClient.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-forest" />
                      </div>
                      <a href={`tel:${selectedClient.phone.replace(/\s/g, "")}`} className="text-[15px] text-navy hover:text-forest transition-colors">
                        {selectedClient.phone}
                      </a>
                    </div>
                  )}
                  {selectedClient.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-forest" />
                      </div>
                      <a href={`mailto:${selectedClient.email}`} className="text-[15px] text-navy hover:text-forest transition-colors">
                        {selectedClient.email}
                      </a>
                    </div>
                  )}
                  {selectedClient.address && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-forest" />
                      </div>
                      <span className="text-[15px] text-grayText">{selectedClient.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary row */}
              <div className="p-5 border-b border-border grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-navy">{selectedClient.missions}</div>
                  <div className="text-[13px] text-grayText">Missions</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-forest">{selectedClient.total}</div>
                  <div className="text-[13px] text-grayText">CA total</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-navy">{selectedClient.lastDate.split(" ").slice(0, 2).join(" ")}</div>
                  <div className="text-[13px] text-grayText">Dernier contact</div>
                </div>
              </div>

              {/* Missions list */}
              <div className="p-5">
                <h3 className="font-heading font-semibold text-[15px] text-navy mb-3">Historique des missions</h3>
                <div className="space-y-2">
                  {selectedClient.missionsList?.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-bgPage rounded-[5px] border border-border/50"
                    >
                      <div className="w-8 h-8 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 text-forest" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-medium text-navy truncate">{m.label}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-grayText" />
                          <span className="text-xs text-grayText">{m.date}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-[15px] text-navy">{m.amount}</div>
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-[5px] mt-0.5 ${
                            m.status === "Terminee"
                              ? "bg-green-50 text-green-700"
                              : "bg-gold/10 text-gold"
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 border-t border-border flex flex-wrap gap-3">
                {selectedClient.phone && (
                  <a
                    href={`tel:${selectedClient.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[5px] text-sm font-bold bg-forest text-white hover:-translate-y-0.5 transition-transform"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                )}
                {selectedClient.email && (
                  <a
                    href={`mailto:${selectedClient.email}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[5px] text-sm font-bold bg-surface text-forest hover:-translate-y-0.5 transition-transform"
                  >
                    <Mail className="w-4 h-4" />
                    Envoyer un email
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[5px] border border-border shadow-sm flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-[5px] bg-surface flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-grayText" />
              </div>
              <h3 className="font-heading text-lg font-bold text-navy">Selectionnez un client</h3>
              <p className="text-[13px] text-grayText mt-1 max-w-[260px]">
                Cliquez sur un client dans la liste pour afficher ses informations detaillees.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
