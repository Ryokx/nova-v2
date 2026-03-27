/**
 * Page Paiements artisan.
 * Suivi complet des encaissements :
 * - Stats (total encaissé, en séquestre, virements reçus, commission Nova 5%)
 * - Onglets : En séquestre / Reçus / En attente
 * - Détail par paiement avec option Instant Pay (virement instantané à 4%)
 * - Sidebar : graphique revenus 6 mois, compte bancaire, résumé mensuel, exports
 */
"use client";

import { useState } from "react";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  Shield, CheckCircle, ChevronDown, Download, Zap, Info,
  TrendingUp, ArrowUpRight, Clock, Wallet, BanknoteIcon,
  Search, ExternalLink,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

/* Structure d'un paiement en séquestre */
interface EscrowItem {
  id: string; client: string; mission: string; amount: number; ht: number; tva: number;
  daysElapsed: number; daysTotal: number; ref: string; factureId: string; date: string;
}

/* Structure d'un virement reçu */
interface ReceivedItem {
  id: string; client: string; mission: string; amount: number; ht: number; tva: number;
  date: string; ref: string; factureId: string; iban: string; missionLink: string;
}

/* Données mockées : paiements en séquestre */
const escrowItems: EscrowItem[] = [
  { id: "e0", client: "Caroline L.", mission: "Remplacement robinet", amount: 236.5, ht: 197.08, tva: 39.42, daysElapsed: 3, daysTotal: 5, ref: "ESQ-2026-044", factureId: "FAC-2026-128", date: "14 mars 2026" },
  { id: "e1", client: "Pierre M.", mission: "Installation cumulus", amount: 890, ht: 741.67, tva: 148.33, daysElapsed: 5, daysTotal: 5, ref: "ESQ-2026-043", factureId: "FAC-2026-127", date: "12 mars 2026" },
];

/* Données mockées : virements reçus */
const receivedItems: ReceivedItem[] = [
  { id: "r0", client: "Amelie R.", mission: "Reparation chauffe-eau", amount: 450, ht: 375, tva: 75, date: "12 mars 2026", ref: "VIR-2026-089", factureId: "FAC-2026-125", iban: "FR76 **** **** 4521", missionLink: "#" },
  { id: "r1", client: "Luc D.", mission: "Diagnostic fuite", amount: 320, ht: 266.67, tva: 53.33, date: "5 mars 2026", ref: "VIR-2026-082", factureId: "FAC-2026-119", iban: "FR76 **** **** 4521", missionLink: "#" },
  { id: "r2", client: "Sophie L.", mission: "Depannage serrure", amount: 155, ht: 129.17, tva: 25.83, date: "28 fev. 2026", ref: "VIR-2026-075", factureId: "FAC-2026-112", iban: "FR76 **** **** 4521", missionLink: "#" },
];

/* Onglets de navigation avec compteur */
const tabs = [
  { id: "escrow", label: "En sequestre", count: escrowItems.length },
  { id: "received", label: "Recus", count: receivedItems.length },
  { id: "pending", label: "En attente", count: 0 },
];

/* Données mensuelles pour le graphique de la sidebar */
const monthlyPayments = [
  { month: "Oct", value: 1850 },
  { month: "Nov", value: 2400 },
  { month: "Dec", value: 1900 },
  { month: "Jan", value: 3100 },
  { month: "Fev", value: 3600 },
  { month: "Mar", value: 4820 },
];
const monthlyMax = Math.max(...monthlyPayments.map((d) => d.value));

export default function ArtisanPaymentsPage() {
  /* Onglet actif (séquestre, reçus, en attente) */
  const [tab, setTab] = useState("escrow");
  /* Mois/année pour le filtre MonthPicker */
  const [payMonth, setPayMonth] = useState(new Date().getMonth());
  const [payYear, setPayYear] = useState(new Date().getFullYear());
  /* ID du paiement déplié (détail visible) */
  const [openId, setOpenId] = useState<string | null>(null);
  /* Recherche dans la liste */
  const [search, setSearch] = useState("");
  /* État Instant Pay par paiement (activé/désactivé) */
  const [instantPayEnabled, setInstantPayEnabled] = useState<Record<string, boolean>>({});
  /* Confirmation Instant Pay par paiement (irréversible) */
  const [instantPayConfirmed, setInstantPayConfirmed] = useState<Record<string, boolean>>({});

  /* Bascule l'option Instant Pay (impossible si déjà confirmé) */
  const toggleInstantPay = (id: string) => {
    if (instantPayConfirmed[id]) return;
    setInstantPayEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* Confirme définitivement l'activation d'Instant Pay */
  const confirmInstantPay = (id: string) => {
    setInstantPayConfirmed((prev) => ({ ...prev, [id]: true }));
  };

  /* Calculs des totaux pour les cartes statistiques */
  const totalEscrow = escrowItems.reduce((s, e) => s + e.amount, 0);
  const totalReceived = receivedItems.reduce((s, e) => s + e.amount, 0);
  const totalAll = totalEscrow + totalReceived;
  const commission = totalAll * 0.05; // Commission Nova à 5%

  return (
    <div className="max-w-[1320px] mx-auto" style={{ padding: "32px 20px" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold text-navy" style={{ margin: "0 0 4px" }}>Paiements</h1>
          <p className="text-[15px] text-grayText m-0">Suivi des encaissements et virements</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <MonthPicker month={payMonth} year={payYear} onChange={(m, y) => { setPayMonth(m); setPayYear(y); }} />
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-white text-navy text-sm font-semibold border border-border cursor-pointer">
            <Download className="w-4 h-4" /> Export comptable
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-[5px] p-5 border-l-[3px] border-l-forest border border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-grayText uppercase tracking-wider">Total encaisse</span>
            <TrendingUp className="w-4 h-4 text-forest" />
          </div>
          <div className="font-mono text-[24px] font-bold text-navy">{formatPrice(totalAll)}</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-forest mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18% vs mois dernier
          </div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border-l-[3px] border-l-gold border border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-grayText uppercase tracking-wider">En sequestre</span>
            <Shield className="w-4 h-4 text-gold" />
          </div>
          <div className="font-mono text-[24px] font-bold text-navy">{formatPrice(totalEscrow)}</div>
          <div className="text-xs text-grayText mt-1">{escrowItems.length} paiement{escrowItems.length > 1 ? "s" : ""} en cours</div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border-l-[3px] border-l-sage border border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-grayText uppercase tracking-wider">Virements recus</span>
            <Wallet className="w-4 h-4 text-sage" />
          </div>
          <div className="font-mono text-[24px] font-bold text-navy">{formatPrice(totalReceived)}</div>
          <div className="text-xs text-grayText mt-1">{receivedItems.length} virement{receivedItems.length > 1 ? "s" : ""} ce mois</div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border-l-[3px] border-l-navy border border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-grayText uppercase tracking-wider">Commission Nova</span>
            <BanknoteIcon className="w-4 h-4 text-navy" />
          </div>
          <div className="font-mono text-[24px] font-bold text-navy">{formatPrice(commission)}</div>
          <div className="text-xs text-grayText mt-1">5% par transaction</div>
        </div>
      </div>

      {/* Main layout: list + chart sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: tabs + list */}
        <div className="md:col-span-8">
          {/* Tabs + search */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex gap-1 bg-surface rounded-[5px] p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setOpenId(null); }}
                  className={cn(
                    "px-5 py-2 rounded-[5px] text-sm font-semibold transition-colors cursor-pointer border-none flex items-center gap-2",
                    tab === t.id ? "bg-white text-navy shadow-sm" : "text-grayText hover:text-navy bg-transparent"
                  )}
                >
                  {t.label}
                  {t.count > 0 && (
                    <span className={cn(
                      "text-[11px] font-bold w-5 h-5 rounded-[5px] flex items-center justify-center",
                      tab === t.id ? "bg-navy text-white" : "bg-border text-grayText"
                    )}>{t.count}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2.5 bg-white border border-border rounded-[5px] px-4 py-2.5 flex-1 min-w-[200px] max-w-[280px]">
              <Search className="w-4 h-4 text-grayText" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-none outline-none text-sm text-navy placeholder:text-grayText/50 w-full bg-transparent"
              />
            </div>
          </div>

          {/* Info banner for escrow */}
          {tab === "escrow" && (
            <div className="flex items-center gap-3 bg-forest/[0.04] border border-forest/10 rounded-[5px] p-4 mb-4">
              <Shield className="w-5 h-5 text-forest shrink-0" />
              <span className="text-sm text-forest font-medium">
                Fonds securises — vires sous 48h apres validation ou instantanement avec Instant Pay
              </span>
            </div>
          )}

          {/* Escrow tab */}
          {tab === "escrow" && (
            <div className="space-y-3">
              {escrowItems.map((item) => {
                const isOpen = openId === item.id;
                const progressPct = (item.daysElapsed / item.daysTotal) * 100;
                const ipEnabled = instantPayEnabled[item.id] ?? false;
                const ipConfirmed = instantPayConfirmed[item.id] ?? false;
                const fee = item.amount * 0.04;
                const netInstant = item.amount - fee;

                return (
                  <div key={item.id} className="bg-white border border-border rounded-[5px] overflow-hidden">
                    <button
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer border-none bg-white hover:bg-surface/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-[5px] bg-gold/[0.06] flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-semibold text-navy">{item.client}</div>
                        <div className="text-sm text-grayText mt-0.5">{item.mission}</div>
                      </div>
                      <div className="text-right shrink-0 mr-2">
                        <div className="font-mono text-base font-bold text-navy">{formatPrice(item.amount)}</div>
                        <div className="text-xs text-grayText mt-0.5">J+{item.daysElapsed}/{item.daysTotal}</div>
                      </div>
                      {/* Progress bar mini */}
                      <div className="w-20 shrink-0">
                        <div className="h-2 rounded-[5px] bg-border overflow-hidden">
                          <div
                            className="h-full rounded-[5px] bg-gradient-to-r from-forest to-sage transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                      <ChevronDown className={cn("w-5 h-5 text-grayText transition-transform shrink-0", isOpen && "rotate-180")} />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                          <div>
                            <span className="text-xs text-grayText block mb-1">Reference</span>
                            <span className="font-mono text-sm text-navy">{item.ref}</span>
                          </div>
                          <div>
                            <span className="text-xs text-grayText block mb-1">Date de blocage</span>
                            <span className="text-sm text-navy">{item.date}</span>
                          </div>
                          <div>
                            <span className="text-xs text-grayText block mb-1">Montant HT</span>
                            <span className="font-mono text-sm text-navy">{formatPrice(item.ht)}</span>
                          </div>
                          <div>
                            <span className="text-xs text-grayText block mb-1">TVA (20%)</span>
                            <span className="font-mono text-sm text-navy">{formatPrice(item.tva)}</span>
                          </div>
                        </div>

                        {/* Instant Pay */}
                        <div className={cn(
                          "rounded-[5px] border p-4 mb-4 transition-all",
                          ipConfirmed
                            ? "border-gold/30 bg-gold/[0.03]"
                            : ipEnabled
                              ? "border-forest/30 bg-forest/[0.03]"
                              : "border-border bg-surface/30"
                        )}>
                          {ipConfirmed ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-[5px] bg-gold/10 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-gold" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-bold text-navy flex items-center gap-2">
                                  Virement instantane active
                                  <CheckCircle className="w-4 h-4 text-success" />
                                </div>
                                <div className="text-sm text-grayText mt-0.5">
                                  {formatPrice(netInstant)} vires en 30 min des validation (frais {formatPrice(fee)})
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-10 h-10 rounded-[5px] flex items-center justify-center shrink-0",
                                    ipEnabled ? "bg-forest/10" : "bg-surface"
                                  )}>
                                    <Zap className={cn("w-5 h-5", ipEnabled ? "text-forest" : "text-grayText")} />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-navy">Virement instantane</div>
                                    <div className="text-sm text-grayText mt-0.5">Paiement en 30 min apres validation</div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleInstantPay(item.id)}
                                  className={cn(
                                    "relative w-12 h-7 rounded-[5px] transition-all shrink-0 border-none cursor-pointer",
                                    ipEnabled ? "bg-forest" : "bg-gray-200"
                                  )}
                                >
                                  <span className={cn(
                                    "absolute top-1 w-5 h-5 rounded-[5px] bg-white shadow-sm transition-all",
                                    ipEnabled ? "left-6" : "left-1"
                                  )} />
                                </button>
                              </div>

                              {ipEnabled && (
                                <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-grayText">Montant du sequestre</span>
                                    <span className="font-mono text-navy">{formatPrice(item.amount)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-grayText">Frais Instant Pay (4%)</span>
                                    <span className="font-mono text-red">-{formatPrice(fee)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm pt-3 border-t border-border/50">
                                    <span className="font-semibold text-navy">Montant verse instantanement</span>
                                    <span className="font-mono font-bold text-forest">{formatPrice(netInstant)}</span>
                                  </div>

                                  <div className="flex items-start gap-2.5 bg-gold/[0.04] rounded-[5px] p-3 mt-1">
                                    <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                                    <span className="text-[13px] text-gold leading-relaxed">
                                      Le virement sera declenche automatiquement des que le client valide la mission. Sans Instant Pay, le virement est gratuit sous 48h.
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => confirmInstantPay(item.id)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-[5px] bg-deepForest text-white text-sm font-bold cursor-pointer border-none hover:bg-forest transition-colors"
                                  >
                                    <Zap className="w-4 h-4" />
                                    Activer le virement instantane
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-surface text-forest text-sm font-semibold cursor-pointer border-none hover:bg-border/30 transition-colors">
                            <Download className="w-4 h-4" /> Recu sequestre
                          </button>
                          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-surface text-forest text-sm font-semibold cursor-pointer border-none hover:bg-border/30 transition-colors">
                            <Download className="w-4 h-4" /> Facture {item.factureId}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Received tab */}
          {tab === "received" && (
            <div className="bg-white rounded-[5px] border border-border overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_120px_120px_100px_40px] gap-3 px-5 py-3 border-b border-border text-xs font-semibold text-grayText uppercase tracking-wider">
                <span>Client</span>
                <span>Mission</span>
                <span className="text-right">Montant</span>
                <span className="text-right">Date</span>
                <span className="text-center">Statut</span>
                <span />
              </div>
              {receivedItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_1fr_120px_120px_100px_40px] gap-3 px-5 py-4 border-b border-border/50 hover:bg-surface/30 transition-colors items-center"
                >
                  <div>
                    <div className="text-[15px] font-semibold text-navy">{item.client}</div>
                    <div className="text-xs text-grayText font-mono">{item.ref}</div>
                  </div>
                  <div className="text-sm text-navy">{item.mission}</div>
                  <div className="text-right font-mono text-[15px] font-bold text-navy">{formatPrice(item.amount)}</div>
                  <div className="text-right text-sm text-grayText">{item.date}</div>
                  <div className="flex justify-center">
                    <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-[5px]">
                      <CheckCircle className="w-3.5 h-3.5" /> Recu
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <button className="w-8 h-8 rounded-[5px] border border-border flex items-center justify-center hover:bg-surface transition-colors cursor-pointer bg-white">
                      <Download className="w-4 h-4 text-navy" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending tab */}
          {tab === "pending" && (
            <div className="bg-white rounded-[5px] border border-border py-16 text-center">
              <div className="w-14 h-14 rounded-[5px] bg-surface flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-border" />
              </div>
              <p className="text-base font-semibold text-navy mb-1">Aucun paiement en attente</p>
              <p className="text-sm text-grayText">Les paiements en attente de validation apparaitront ici</p>
            </div>
          )}
        </div>

        {/* Right sidebar: chart + IBAN + quick info */}
        <div className="md:col-span-4 space-y-3">
          {/* Revenue chart */}
          <div className="bg-white rounded-[5px] border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-navy m-0">Encaissements</h3>
                <p className="text-xs text-grayText m-0 mt-0.5">6 derniers mois</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-forest">
                <ArrowUpRight className="w-3.5 h-3.5" /> +34%
              </div>
            </div>
            <div className="flex items-end gap-2" style={{ height: 120 }}>
              {monthlyPayments.map((d, i) => {
                const h = Math.max((d.value / monthlyMax) * 90, 4);
                const isLast = i === monthlyPayments.length - 1;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="text-[10px] font-mono font-semibold text-grayText opacity-0 group-hover:opacity-100 transition-opacity mb-1">{(d.value / 1000).toFixed(1)}k</div>
                    <div
                      className={`w-full rounded-[5px] transition-colors ${isLast ? "bg-forest" : "bg-forest/[0.10] group-hover:bg-forest/[0.22]"}`}
                      style={{ height: `${h}px` }}
                    />
                    <span className={`text-[11px] font-medium mt-1.5 ${isLast ? "text-navy font-semibold" : "text-grayText"}`}>{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bank account */}
          <div className="bg-white rounded-[5px] border border-border p-5">
            <h3 className="text-sm font-bold text-navy m-0 mb-3">Compte bancaire</h3>
            <div className="space-y-2.5">
              <div>
                <span className="text-xs text-grayText block mb-0.5">IBAN</span>
                <span className="font-mono text-sm text-navy">FR76 **** **** **** **** 4521</span>
              </div>
              <div>
                <span className="text-xs text-grayText block mb-0.5">BIC</span>
                <span className="font-mono text-sm text-navy">BNPAFRPP</span>
              </div>
              <div>
                <span className="text-xs text-grayText block mb-0.5">Titulaire</span>
                <span className="text-sm text-navy">Jean-Michel Petit</span>
              </div>
            </div>
            <button className="mt-3 text-sm text-forest font-semibold hover:underline cursor-pointer bg-transparent border-none p-0">
              Modifier le RIB
            </button>
          </div>

          {/* Quick summary */}
          <div className="bg-white rounded-[5px] border border-border p-5">
            <h3 className="text-sm font-bold text-navy m-0 mb-3">Ce mois</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-grayText">Missions terminees</span>
                <span className="font-mono font-semibold text-navy">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-grayText">Taux de validation</span>
                <span className="font-mono font-semibold text-success">100%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-grayText">Delai moyen virement</span>
                <span className="font-mono font-semibold text-navy">36h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-grayText">Instant Pay utilise</span>
                <span className="font-mono font-semibold text-gold">1 fois</span>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="bg-white rounded-[5px] border border-border p-5">
            <h3 className="text-sm font-bold text-navy m-0 mb-3">Exports</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-[5px] border border-border text-sm font-medium text-navy hover:bg-surface transition-colors cursor-pointer bg-white">
                <Download className="w-4 h-4 text-forest" /> Releve mensuel PDF
              </button>
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-[5px] border border-border text-sm font-medium text-navy hover:bg-surface transition-colors cursor-pointer bg-white">
                <Download className="w-4 h-4 text-forest" /> Export CSV comptable
              </button>
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-[5px] border border-border text-sm font-medium text-navy hover:bg-surface transition-colors cursor-pointer bg-white">
                <ExternalLink className="w-4 h-4 text-forest" /> Envoyer au comptable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
