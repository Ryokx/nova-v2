/**
 * Dashboard principal de l'artisan.
 * Page d'accueil après connexion, affichant :
 * - Message d'accueil personnalisé + statut de validation
 * - 4 KPIs cliquables avec sparklines (revenus, missions, devis, note)
 * - 3 graphiques (revenus mensuels, nouveaux clients, semaine en cours)
 * - Mini calendrier interactif avec synchronisation externe (Google, Outlook, etc.)
 * - Prochains rendez-vous avec détail du jour sélectionné
 * - Accès rapide aux outils (abonnement, site web, communication, etc.)
 * - Alerte urgences en temps réel
 */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { useState } from "react";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  TrendingUp,
  Wrench,
  FileText,
  Star,
  Zap,
  Clock,
  Globe,
  Megaphone,
  Mail,
  BadgeDollarSign,
  Puzzle,
  Users,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Link2,
  Check,
  ExternalLink,
} from "lucide-react";

/* Statistiques retournées par l'API /api/artisan/stats */
interface ArtisanStats {
  monthRevenue: number;
  activeMissions: number;
  pendingDevis: number;
  rating: number;
  upcomingAppointments: Array<{
    id: string;
    client: string;
    type: string;
    date: string;
    slot: string | null;
    status: string;
  }>;
}

/* Configuration des couleurs par statut de rendez-vous */
const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "#F5A623" },
  ACCEPTED: { label: "Confirmé", color: "#22C88A" },
  IN_PROGRESS: { label: "En cours", color: "#1B6B4E" },
};

/* Demandes d'intervention urgente (temps réel) */
const urgentDemands = [
  { id: "u1", type: "Fuite d'eau", sector: "Paris 9e", time: "Il y a 4 min" },
  { id: "u2", type: "Panne électrique", sector: "Paris 11e", time: "Il y a 12 min" },
  { id: "u3", type: "Serrure bloquée", sector: "Paris 4e", time: "Il y a 25 min" },
];

/* Rendez-vous mockés (affichés si l'API ne retourne rien) */
const mockRdv = [
  { id: "m1", client: "Pierre M.", type: "Installation robinet", date: "Auj. 14h", status: "Confirmé", sColor: "#22C88A" },
  { id: "m2", client: "Amélie R.", type: "Réparation chauffe-eau", date: "Dem. 9h", status: "En cours", sColor: "#1B6B4E" },
  { id: "m3", client: "Luc D.", type: "Diagnostic fuite", date: "18 mars 11h", status: "En attente", sColor: "#F5A623" },
];

/* Composant SVG : mini graphique en ligne (sparkline) pour les cartes KPI */
function Sparkline({ data, color, height = 40, width = 120 }: { data: number[]; color: string; height?: number; width?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color.replace("#", "")})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={parseFloat(points[points.length - 1]!.split(",")[1]!)} r="2.5" fill={color} />
    </svg>
  );
}

/* Données du graphique revenus de la semaine */
const revenueWeekly = [
  { day: "Lun", value: 320 },
  { day: "Mar", value: 180 },
  { day: "Mer", value: 450 },
  { day: "Jeu", value: 600 },
  { day: "Ven", value: 280 },
  { day: "Sam", value: 520 },
  { day: "Dim", value: 90 },
];
const revenueMax = Math.max(...revenueWeekly.map((d) => d.value));

/* Données du graphique revenus mensuels (6 derniers mois) */
const monthlyRevenue = [
  { month: "Oct", value: 3200 },
  { month: "Nov", value: 3800 },
  { month: "Déc", value: 2900 },
  { month: "Jan", value: 4100 },
  { month: "Fév", value: 4500 },
  { month: "Mar", value: 4820 },
];
const monthlyMax = Math.max(...monthlyRevenue.map((d) => d.value));

/* Données du graphique nouveaux clients (6 derniers mois) */
const monthlyClients = [
  { month: "Oct", value: 8 },
  { month: "Nov", value: 12 },
  { month: "Déc", value: 9 },
  { month: "Jan", value: 15 },
  { month: "Fév", value: 18 },
  { month: "Mar", value: 22 },
];
const clientsMax = Math.max(...monthlyClients.map((d) => d.value));

/* Helpers pour le mini calendrier */
const DAYS_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/* Retourne le nombre de jours dans un mois donné */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
/* Retourne le jour de la semaine du 1er du mois (0=Lundi) */
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

/* Événements mockés du calendrier (jour du mois -> liste d'événements) */
const calendarEvents: Record<number, { time: string; client: string; type: string; color: string }[]> = {
  24: [{ time: "14h", client: "Pierre M.", type: "Installation robinet", color: "#22C88A" }],
  25: [{ time: "9h", client: "Amélie R.", type: "Réparation chauffe-eau", color: "#1B6B4E" }],
  27: [{ time: "11h", client: "Luc D.", type: "Diagnostic fuite", color: "#F5A623" }],
  28: [
    { time: "10h", client: "Caroline L.", type: "Chauffe-eau", color: "#1B6B4E" },
    { time: "15h", client: "Marc T.", type: "Fuite salle de bain", color: "#22C88A" },
  ],
  31: [{ time: "8h30", client: "Sophie L.", type: "Entretien chaudière", color: "#6366F1" }],
};

/* Fournisseurs de calendrier pour la synchronisation */
const calendarProviders = [
  {
    id: "google",
    name: "Google Calendar",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#4285F4" />
        <rect x="3" y="3" width="18" height="5" rx="2" fill="#1967D2" />
        <path d="M7 12h10M7 16h7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="12" r="0.5" fill="#fff" /><circle cx="7" cy="16" r="0.5" fill="#fff" />
      </svg>
    ),
    color: "#4285F4",
  },
  {
    id: "outlook",
    name: "Outlook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#0078D4" />
        <ellipse cx="10" cy="13.5" rx="4" ry="4.5" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M15 8h4v8h-4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    color: "#0078D4",
  },
  {
    id: "apple",
    name: "Apple Calendar",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#1a1a1a" />
        <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="system-ui">24</text>
        <rect x="3" y="3" width="18" height="5" rx="2" fill="#FF3B30" />
      </svg>
    ),
    color: "#1a1a1a",
  },
  {
    id: "ical",
    name: "Fichier iCal",
    icon: <CalendarDays className="w-4 h-4 text-grayText" />,
    color: "#6B7280",
  },
];

export default function ArtisanDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: stats, loading } = useFetch<ArtisanStats>("/api/artisan/stats");

  const isPendingValidation = true;

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());
  const [showUrgent, setShowUrgent] = useState(false);
  const [statsMonth, setStatsMonth] = useState(now.getMonth());
  const [statsYear, setStatsYear] = useState(now.getFullYear());
  const [connectedCals, setConnectedCals] = useState<Set<string>>(new Set());

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const monthName = new Date(calYear, calMonth).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
    setSelectedDay(null);
  };

  const toggleCalSync = (id: string) => {
    setConnectedCals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="max-w-[1320px] mx-auto" style={{ padding: "32px 20px" }}>
        <Skeleton height={32} width={300} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={110} />)}
        </div>
        <Skeleton variant="rectangular" height={300} className="mt-5" />
      </div>
    );
  }

  const appointments = stats?.upcomingAppointments ?? [];
  const rdvList = appointments.length > 0
    ? appointments.map((a) => {
        const st = statusConfig[a.status] ?? { label: a.status, color: "#6B7280" };
        const dateStr = a.date
          ? new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
          : "";
        return { id: a.id, client: a.client, type: a.type, date: `${dateStr}${a.slot ? ` ${a.slot}` : ""}`, status: st.label, sColor: st.color };
      })
    : mockRdv;

  const revenue = stats?.monthRevenue ?? 4820;
  const activeMissions = stats?.activeMissions ?? 3;
  const pendingDevis = stats?.pendingDevis ?? 2;
  const rating = stats?.rating ?? 4.9;

  return (
    <div className="max-w-[1320px] mx-auto" style={{ padding: "32px 20px" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-[24px] font-extrabold text-navy" style={{ margin: "0 0 2px" }}>
            Bonjour {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-[13px] text-grayText m-0">Artisan Certifié Nova • #2847</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <MonthPicker month={statsMonth} year={statsYear} onChange={(m, y) => { setStatsMonth(m); setStatsYear(y); }} />
          {/* Urgent demands */}
          {urgentDemands.length > 0 && (
            <div className="relative mr-1">
              <button
                onClick={() => setShowUrgent(!showUrgent)}
                className="flex items-center gap-2 bg-red rounded-[5px] px-3.5 py-2 shadow-[0_2px_12px_rgba(232,48,42,0.35)] cursor-pointer border-none"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                <span className="text-[12px] font-bold text-white whitespace-nowrap">
                  {urgentDemands.length} urgence{urgentDemands.length > 1 ? "s" : ""}
                </span>
                <ChevronRight className={`w-3 h-3 text-white/80 transition-transform ${showUrgent ? "rotate-90" : ""}`} />
              </button>
              {showUrgent && (
                <div className="absolute top-full right-0 mt-1.5 w-[340px] bg-white rounded-[5px] border border-border shadow-lg z-50 overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-border bg-red/[0.03]">
                    <span className="text-[11px] font-bold text-red uppercase tracking-wider">Interventions urgentes</span>
                  </div>
                  {urgentDemands.map((u, i) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-surface/40 transition-colors"
                      style={{ borderTop: i ? "1px solid #D4EBE0" : "none" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-red shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-navy">{u.type}</div>
                        <div className="text-[11px] text-grayText">{u.sector} • {u.time}</div>
                      </div>
                      <button className="px-2.5 py-1 rounded-[5px] bg-red text-white border-none text-[11px] font-bold cursor-pointer hover:bg-red/90 transition-colors shrink-0">
                        Voir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Link href="/artisan-devis/new" className="px-5 py-2 rounded-[5px] bg-deepForest text-white text-[13px] font-semibold">
            Créer un devis
          </Link>
          <Link href="/artisan-invoices" className="px-5 py-2 rounded-[5px] bg-white text-navy text-[13px] font-semibold border border-border">
            Facture
          </Link>
        </div>
      </div>

      {/* Pending validation */}
      {isPendingValidation && (
        <div className="bg-gold/[0.03] border border-gold/15 rounded-[5px] p-3.5 mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-[5px] bg-gold/10 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-navy m-0">Compte en attente de validation</p>
            <div className="flex items-center gap-1 text-[11px] text-grayText">
              <EyeOff className="w-3 h-3" />
              <span>Invisible pour les particuliers tant que vos documents ne sont pas validés.</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-[5px] bg-gold/10 text-[10px] font-bold text-gold uppercase tracking-wider shrink-0">En cours</span>
        </div>
      )}

      {/* Mobile action buttons */}
      <div className="flex md:hidden gap-2 mb-5">
        <Link href="/artisan-devis/new" className="flex-1 text-center px-4 py-2.5 rounded-[5px] bg-deepForest text-white text-[13px] font-semibold">
          Créer un devis
        </Link>
        <Link href="/artisan-invoices" className="flex-1 text-center px-4 py-2.5 rounded-[5px] bg-white text-navy text-[13px] font-semibold border border-border">
          Facture
        </Link>
      </div>

      {/* Stats — 4 cards with sparklines, each with its own color */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {/* Revenus → forest */}
        <div onClick={() => router.push("/artisan-payments")} className="bg-white rounded-[5px] p-4 border-l-[3px] border-l-forest border border-border cursor-pointer hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-grayText uppercase tracking-wider">Revenus</span>
            <div className="flex items-center gap-0.5 text-[11px] font-semibold text-forest">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </div>
          </div>
          <div className="font-mono text-[22px] font-bold text-navy leading-none">{revenue.toLocaleString("fr-FR")}€</div>
          <div className="mt-2">
            <Sparkline data={[3200, 3800, 2900, 4100, 4500, 4820]} color="#1B6B4E" width={160} />
          </div>
        </div>

        {/* Missions → sage */}
        <div onClick={() => router.push("/artisan-documents")} className="bg-white rounded-[5px] p-4 border-l-[3px] border-l-sage border border-border cursor-pointer hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-grayText uppercase tracking-wider">Missions</span>
            <div className="flex items-center gap-0.5 text-[11px] font-semibold text-sage">
              <ArrowUpRight className="w-3 h-3" /> +2
            </div>
          </div>
          <div className="font-mono text-[22px] font-bold text-navy leading-none">{activeMissions}</div>
          <div className="mt-2">
            <Sparkline data={[5, 3, 7, 4, 6, 3]} color="#2D9B6E" width={160} />
          </div>
        </div>

        {/* Devis → navy */}
        <div onClick={() => router.push("/artisan-documents")} className="bg-white rounded-[5px] p-4 border-l-[3px] border-l-navy border border-border cursor-pointer hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-grayText uppercase tracking-wider">Devis</span>
            {pendingDevis > 0 && (
              <span className="w-[18px] h-[18px] rounded-[5px] bg-navy/10 flex items-center justify-center text-[10px] font-bold text-navy">{pendingDevis}</span>
            )}
          </div>
          <div className="font-mono text-[22px] font-bold text-navy leading-none">{pendingDevis}</div>
          <div className="mt-2">
            <Sparkline data={[4, 2, 5, 3, 1, 2]} color="#0A1628" width={160} />
          </div>
        </div>

        {/* Note → gold */}
        <div onClick={() => router.push("/artisan-profile")} className="bg-white rounded-[5px] p-4 border-l-[3px] border-l-gold border border-border cursor-pointer hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-grayText uppercase tracking-wider">Note</span>
            <div className="flex gap-[2px]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-2.5 h-2.5" fill={s <= Math.round(rating) ? "#F5A623" : "none"} stroke={s <= Math.round(rating) ? "#F5A623" : "#D4EBE0"} />
              ))}
            </div>
          </div>
          <div className="font-mono text-[22px] font-bold text-navy leading-none">{rating}</div>
          <div className="mt-2">
            <Sparkline data={[4.6, 4.7, 4.7, 4.8, 4.8, 4.9]} color="#F5A623" width={160} />
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {/* Revenue bar chart — 6 months */}
        <div className="bg-white rounded-[5px] border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[13px] font-bold text-navy m-0">Revenus mensuels</h3>
              <p className="text-[11px] text-grayText m-0 mt-0.5">6 derniers mois</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-success">
              <ArrowUpRight className="w-3 h-3" /> +7% ce mois
            </div>
          </div>
          <div className="flex items-end gap-3" style={{ height: 130 }}>
            {monthlyRevenue.map((d, i) => {
              const h = Math.max((d.value / monthlyMax) * 100, 4);
              const isLast = i === monthlyRevenue.length - 1;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="text-[10px] font-mono font-semibold text-grayText mb-1">{(d.value / 1000).toFixed(1)}k</div>
                  <div
                    className={`w-full rounded-[5px] transition-colors ${isLast ? "bg-forest" : "bg-forest/[0.10] hover:bg-forest/[0.20]"}`}
                    style={{ height: `${h}px` }}
                  />
                  <span className={`text-[11px] font-medium mt-2 ${isLast ? "text-navy font-semibold" : "text-grayText"}`}>{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clients bar chart — 6 months → sage (matches Missions) */}
        <div className="bg-white rounded-[5px] border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[13px] font-bold text-navy m-0">Nouveaux clients</h3>
              <p className="text-[11px] text-grayText m-0 mt-0.5">6 derniers mois</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-sage">
              <ArrowUpRight className="w-3 h-3" /> +22% ce mois
            </div>
          </div>
          <div className="flex items-end gap-3" style={{ height: 130 }}>
            {monthlyClients.map((d, i) => {
              const h = Math.max((d.value / clientsMax) * 100, 4);
              const isLast = i === monthlyClients.length - 1;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="text-[10px] font-mono font-semibold text-grayText mb-1">{d.value}</div>
                  <div
                    className={`w-full rounded-[5px] transition-colors ${isLast ? "bg-sage" : "bg-sage/[0.12] hover:bg-sage/[0.25]"}`}
                    style={{ height: `${h}px` }}
                  />
                  <span className={`text-[11px] font-medium mt-2 ${isLast ? "text-navy font-semibold" : "text-grayText"}`}>{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue weekly → forest (matches Revenus stat) */}
        <div className="bg-white rounded-[5px] border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-bold text-navy m-0">Cette semaine</h3>
              <p className="text-[11px] text-grayText m-0 mt-0.5">{revenueWeekly.reduce((s, d) => s + d.value, 0).toLocaleString("fr-FR")}€ total</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-forest">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </div>
          </div>
          <div className="flex items-end gap-2" style={{ height: 130 }}>
            {revenueWeekly.map((d) => {
              const h = Math.max((d.value / revenueMax) * 100, 3);
              const isToday = d.day === "Sam";
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div className="text-[9px] font-mono font-semibold text-grayText opacity-0 group-hover:opacity-100 transition-opacity mb-1">{d.value}€</div>
                  <div
                    className={`w-full rounded-[5px] transition-colors ${isToday ? "bg-forest" : "bg-forest/[0.10] group-hover:bg-forest/[0.22]"}`}
                    style={{ height: `${h}px` }}
                  />
                  <span className={`text-[10px] font-medium mt-1.5 ${isToday ? "text-navy font-semibold" : "text-grayText"}`}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendar + RDV + Tools */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

        {/* ━━━ Mini Calendar ━━━ */}
        <div className="md:col-span-4 bg-white rounded-[5px] border border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <h3 className="text-[13px] font-bold text-navy m-0 capitalize">{monthName}</h3>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="w-6 h-6 rounded-[5px] border border-border flex items-center justify-center hover:bg-surface transition-colors cursor-pointer bg-white">
                <ChevronLeft className="w-3 h-3 text-navy" />
              </button>
              <button onClick={nextMonth} className="w-6 h-6 rounded-[5px] border border-border flex items-center justify-center hover:bg-surface transition-colors cursor-pointer bg-white">
                <ChevronRight className="w-3 h-3 text-navy" />
              </button>
            </div>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 px-3 pt-2">
            {DAYS_LABELS.map((d) => (
              <div key={d} className="text-center text-[9px] font-semibold text-grayText uppercase py-1">{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 px-3 pb-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} className="h-9" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = calendarEvents[day];
              const isToday = day === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
              const isSelected = day === selectedDay;
              const hasEvents = events && events.length > 0;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                  className={`h-9 flex flex-col items-center justify-center rounded-[5px] transition-colors cursor-pointer border-none relative ${
                    isSelected ? "bg-forest/[0.07]" : "hover:bg-surface/60 bg-transparent"
                  }`}
                >
                  <span className={`text-[11px] font-medium w-[22px] h-[22px] flex items-center justify-center rounded-[5px] ${
                    isToday ? "bg-forest text-white font-bold" : isSelected ? "text-forest font-bold" : "text-navy"
                  }`}>{day}</span>
                  {hasEvents && (
                    <div className="flex gap-[2px] mt-0.5">
                      {events.slice(0, 3).map((e, ei) => (
                        <div key={ei} className="w-1 h-1 rounded-full" style={{ background: e.color }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sync section — always visible */}
          <div className="border-t border-border px-4 py-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Link2 className="w-3 h-3 text-grayText" />
              <span className="text-[10px] font-semibold text-grayText uppercase tracking-wider">Synchroniser</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {calendarProviders.map((p) => {
                const connected = connectedCals.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleCalSync(p.id)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-[5px] border text-[10px] font-medium transition-all cursor-pointer ${
                      connected ? "border-forest/20 bg-forest/[0.04] text-forest" : "border-border bg-white text-navy hover:border-navy/15"
                    }`}
                  >
                    {p.icon}
                    <span className="flex-1 text-left truncate">{p.name}</span>
                    {connected && <Check className="w-2.5 h-2.5 text-forest shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ━━━ RDV du jour / sélectionné ━━━ */}
        <div className="md:col-span-5 bg-white rounded-[5px] border border-border">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <h3 className="text-[13px] font-bold text-navy m-0">
              {selectedDay
                ? `${selectedDay} ${new Date(calYear, calMonth).toLocaleDateString("fr-FR", { month: "long" })}`
                : "Prochains rendez-vous"
              }
            </h3>
            <CalendarDays className="w-3.5 h-3.5 text-grayText" />
          </div>

          {/* Events for selected day */}
          {selectedDay && calendarEvents[selectedDay] ? (
            <div className="divide-y divide-border">
              {calendarEvents[selectedDay]!.map((e, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-surface/30 transition-colors cursor-pointer">
                  <div className="w-[3px] h-10 rounded-[5px] shrink-0" style={{ background: e.color }} />
                  <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-forest">{e.client.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-navy">{e.client}</div>
                    <div className="text-[11px] text-grayText">{e.type}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[12px] font-mono font-semibold text-navy">{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDay ? (
            <div className="px-4 py-8 text-center">
              <CalendarDays className="w-6 h-6 text-border mx-auto mb-2" />
              <p className="text-[12px] text-grayText m-0">Aucun rendez-vous ce jour</p>
            </div>
          ) : (
            /* Default: show all upcoming RDV */
            <div className="divide-y divide-border">
              {rdvList.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface/30 transition-colors cursor-pointer">
                  <div className="w-[3px] h-10 rounded-[5px] shrink-0" style={{ background: r.sColor }} />
                  <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-forest">{r.client.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-navy">{r.client}</div>
                    <div className="text-[11px] text-grayText">{r.type}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-grayText">{r.date}</div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[5px]" style={{ color: r.sColor, background: r.sColor + "10" }}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ━━━ Quick tools ━━━ */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-[5px] border border-border">
            <div className="px-4 py-2.5 border-b border-border">
              <h3 className="text-[13px] font-bold text-navy m-0">Outils</h3>
            </div>
            <div className="flex flex-col">
              {[
                { label: "Mon abonnement", icon: Star, href: "/artisan-subscription", color: "text-forest" },
                { label: "Mon site web", icon: Globe, href: "/artisan-website", color: "text-sage" },
                { label: "Communication", icon: Megaphone, href: "/artisan-communication", color: "text-forest" },
                { label: "Newsletter", icon: Mail, href: "/artisan-newsletter", color: "text-sage" },
                { label: "Instant Pay", icon: Zap, href: "/artisan-instant-pay", color: "text-gold" },
                { label: "Mes tarifs", icon: BadgeDollarSign, href: "/artisan-pricing", color: "text-forest" },
                { label: "Options", icon: Puzzle, href: "/artisan-addons", color: "text-sage" },
                { label: "Mes clients", icon: Users, href: "/artisan-clients", color: "text-forest" },
              ].map((a, i) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-surface/40 transition-colors group"
                  style={{ borderTop: i ? "1px solid #D4EBE0" : "none" }}
                >
                  <a.icon className={`w-[14px] h-[14px] ${a.color}`} />
                  <span className="flex-1 text-[12px] font-medium text-navy">{a.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-border group-hover:text-grayText transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
