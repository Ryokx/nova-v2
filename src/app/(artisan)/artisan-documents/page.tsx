"use client";

import { useState } from "react";
import Link from "next/link";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  ChevronDown,
  Download,
  Send,
  Copy,
  FileText,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive,
  Printer,
  Mail,
  ArrowUpRight,
  Eye,
  Trash2,
  MoreHorizontal,
  CalendarDays,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

interface Document {
  id: string;
  number: string;
  client: string;
  email: string;
  date: string;
  dueDate?: string;
  amount: number;
  status: string;
  statusLabel: string;
  statusColor: string;
  lines: LineItem[];
  tvaRate: number;
  signed?: boolean;
  sentAt?: string;
  viewedAt?: string;
}

const mockDevis: Document[] = [
  {
    id: "1", number: "DEV-2026-089", client: "Caroline L.", email: "caroline.l@email.fr",
    date: "12 mars 2026", dueDate: "12 avr. 2026", amount: 236.5, status: "accepted", statusLabel: "Accepté", statusColor: "#22C88A",
    lines: [
      { description: "Robinet mitigeur", qty: 1, unitPrice: 85 },
      { description: "Main d'œuvre", qty: 2, unitPrice: 65 },
      { description: "Déplacement", qty: 1, unitPrice: 21.5 },
    ],
    tvaRate: 0.1, signed: true, sentAt: "12 mars 10h30", viewedAt: "12 mars 11h45",
  },
  {
    id: "2", number: "DEV-2026-085", client: "Pierre M.", email: "pierre.m@email.fr",
    date: "8 mars 2026", dueDate: "8 avr. 2026", amount: 890, status: "pending", statusLabel: "En attente", statusColor: "#F5A623",
    lines: [
      { description: "Chauffe-eau thermodynamique", qty: 1, unitPrice: 580 },
      { description: "Installation", qty: 4, unitPrice: 65 },
      { description: "Mise en service", qty: 1, unitPrice: 50 },
    ],
    tvaRate: 0.1, signed: false, sentAt: "8 mars 14h00",
  },
  {
    id: "5", number: "DEV-2026-078", client: "Sophie L.", email: "sophie.l@email.fr",
    date: "2 mars 2026", amount: 155, status: "expired", statusLabel: "Expiré", statusColor: "#E8302A",
    lines: [
      { description: "Dépannage serrure", qty: 1, unitPrice: 120 },
      { description: "Déplacement", qty: 1, unitPrice: 20.91 },
    ],
    tvaRate: 0.1,
  },
  {
    id: "6", number: "DEV-2026-072", client: "Marc T.", email: "marc.t@email.fr",
    date: "25 fév. 2026", amount: 1250, status: "draft", statusLabel: "Brouillon", statusColor: "#6B7280",
    lines: [
      { description: "Rénovation salle de bain", qty: 1, unitPrice: 950 },
      { description: "Fournitures", qty: 1, unitPrice: 186.36 },
    ],
    tvaRate: 0.1,
  },
];

const mockFactures: Document[] = [
  {
    id: "3", number: "FAC-2026-127", client: "Amélie R.", email: "amelie.r@email.fr",
    date: "10 mars 2026", amount: 450, status: "paid", statusLabel: "Payée", statusColor: "#22C88A",
    lines: [
      { description: "Intervention plomberie", qty: 1, unitPrice: 350 },
      { description: "Pièces détachées", qty: 1, unitPrice: 59.09 },
    ],
    tvaRate: 0.1, sentAt: "10 mars 16h00", viewedAt: "10 mars 17h20",
  },
  {
    id: "4", number: "FAC-2026-119", client: "Luc D.", email: "luc.d@email.fr",
    date: "5 mars 2026", amount: 320, status: "paid", statusLabel: "Payée", statusColor: "#22C88A",
    lines: [
      { description: "Débouchage canalisation", qty: 1, unitPrice: 220 },
      { description: "Déplacement", qty: 1, unitPrice: 70.91 },
    ],
    tvaRate: 0.1, sentAt: "5 mars 12h00",
  },
  {
    id: "7", number: "FAC-2026-112", client: "Caroline L.", email: "caroline.l@email.fr",
    date: "28 fév. 2026", amount: 185, status: "overdue", statusLabel: "En retard", statusColor: "#E8302A",
    lines: [
      { description: "Réparation fuite", qty: 1, unitPrice: 140 },
      { description: "Joint + raccord", qty: 1, unitPrice: 28.18 },
    ],
    tvaRate: 0.1, sentAt: "28 fév. 10h00",
  },
];

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

/* ━━━ Document row ━━━ */
function DocumentRow({ doc, onSelect, isSelected }: { doc: Document; onSelect: (d: Document) => void; isSelected: boolean }) {
  return (
    <button
      onClick={() => onSelect(doc)}
      className={cn(
        "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors border-none cursor-pointer",
        isSelected ? "bg-forest/[0.04]" : "bg-white hover:bg-surface/40"
      )}
    >
      <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-forest" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-sm font-semibold text-forest">{doc.number}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-[5px]" style={{ color: doc.statusColor, background: doc.statusColor + "12" }}>
            {doc.statusLabel}
          </span>
        </div>
        <div className="text-[15px] font-medium text-navy truncate">{doc.client}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-[15px] font-bold text-navy">{formatPrice(doc.amount)}</div>
        <div className="text-xs text-grayText">{doc.date}</div>
      </div>
    </button>
  );
}

export default function ArtisanDocumentsPage() {
  const [tab, setTab] = useState<"devis" | "factures">("devis");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [docMonth, setDocMonth] = useState(new Date().getMonth());
  const [docYear, setDocYear] = useState(new Date().getFullYear());

  const allDocs = tab === "devis" ? mockDevis : mockFactures;
  const docs = allDocs.filter((d) => {
    const matchSearch = !search || d.client.toLowerCase().includes(search.toLowerCase()) || d.number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusOptions = tab === "devis"
    ? [{ value: "all", label: "Tous" }, { value: "draft", label: "Brouillon" }, { value: "pending", label: "En attente" }, { value: "accepted", label: "Accepté" }, { value: "expired", label: "Expiré" }]
    : [{ value: "all", label: "Toutes" }, { value: "paid", label: "Payée" }, { value: "overdue", label: "En retard" }];

  // Stats
  const totalAmount = allDocs.reduce((s, d) => s + d.amount, 0);
  const pendingCount = allDocs.filter((d) => ["pending", "draft", "overdue"].includes(d.status)).length;
  const acceptedCount = allDocs.filter((d) => ["accepted", "paid"].includes(d.status)).length;

  // Detail panel
  const detail = selectedDoc;
  const detailHT = detail ? detail.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0) : 0;
  const detailTVA = detail ? Math.round(detailHT * detail.tvaRate * 100) / 100 : 0;
  const detailTTC = detailHT + detailTVA;

  return (
    <div className="max-w-[1320px] mx-auto" style={{ padding: "32px 20px" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold text-navy" style={{ margin: "0 0 4px" }}>Documents</h1>
          <p className="text-[15px] text-grayText m-0">Devis, factures et documents comptables</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <MonthPicker month={docMonth} year={docYear} onChange={(m, y) => { setDocMonth(m); setDocYear(y); }} />
          <Link href="/artisan-devis/new" className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-deepForest text-white text-sm font-semibold">
            <Plus className="w-4 h-4" /> Nouveau devis
          </Link>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-white text-navy text-sm font-semibold border border-border cursor-pointer">
            <Receipt className="w-4 h-4" /> Générer facture
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-[5px] p-5 border-l-[3px] border-l-forest border border-border">
          <span className="text-xs font-medium text-grayText uppercase tracking-wider">Total {tab}</span>
          <div className="font-mono text-[24px] font-bold text-navy mt-1.5">{formatPrice(totalAmount)}</div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border-l-[3px] border-l-sage border border-border">
          <span className="text-xs font-medium text-grayText uppercase tracking-wider">{tab === "devis" ? "Acceptés" : "Payées"}</span>
          <div className="font-mono text-[24px] font-bold text-navy mt-1.5">{acceptedCount}</div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border-l-[3px] border-l-gold border border-border">
          <span className="text-xs font-medium text-grayText uppercase tracking-wider">En attente</span>
          <div className="font-mono text-[24px] font-bold text-navy mt-1.5">{pendingCount}</div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border-l-[3px] border-l-navy border border-border">
          <span className="text-xs font-medium text-grayText uppercase tracking-wider">Ce mois</span>
          <div className="font-mono text-[24px] font-bold text-navy mt-1.5">{allDocs.length}</div>
        </div>
      </div>

      {/* Tabs + Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-surface rounded-[5px] p-1">
          {([
            { id: "devis" as const, label: "Devis" },
            { id: "factures" as const, label: "Factures" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSelectedDoc(null); setStatusFilter("all"); }}
              className={cn(
                "px-5 py-2 rounded-[5px] text-sm font-semibold transition-colors cursor-pointer border-none",
                tab === t.id ? "bg-white text-navy shadow-sm" : "text-grayText hover:text-navy bg-transparent"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-white border border-border rounded-[5px] px-4 py-2.5 flex-1 min-w-[220px] max-w-[340px]">
          <Search className="w-4 h-4 text-grayText" />
          <input
            type="text"
            placeholder="Rechercher par client ou n°..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none text-sm text-navy placeholder:text-grayText/50 w-full bg-transparent"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5">
          {statusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={cn(
                "px-4 py-2 rounded-[5px] text-[13px] font-semibold transition-colors cursor-pointer border",
                statusFilter === s.value
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-grayText border-border hover:text-navy hover:border-navy/20"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        <div className="ml-auto hidden md:flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-[5px] border border-border bg-white text-[13px] font-medium text-grayText hover:text-navy transition-colors cursor-pointer">
            <Archive className="w-4 h-4" /> Archiver
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-[5px] border border-border bg-white text-[13px] font-medium text-grayText hover:text-navy transition-colors cursor-pointer">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Main content: List + Detail panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Document list */}
        <div className="md:col-span-5 bg-white rounded-[5px] border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {docs.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <FileText className="w-8 h-8 text-border mx-auto mb-3" />
                <p className="text-sm text-grayText m-0">Aucun document trouvé</p>
              </div>
            ) : (
              docs.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} onSelect={setSelectedDoc} isSelected={selectedDoc?.id === doc.id} />
              ))
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="md:col-span-7">
          {detail ? (
            <div className="bg-white rounded-[5px] border border-border">
              {/* Detail header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-mono text-lg font-bold text-forest">{detail.number}</span>
                    <span className="text-[13px] font-semibold px-2.5 py-1 rounded-[5px]" style={{ color: detail.statusColor, background: detail.statusColor + "12" }}>
                      {detail.statusLabel}
                    </span>
                  </div>
                  <div className="text-sm text-grayText">{detail.client} &middot; {detail.email}</div>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-[5px] border border-border flex items-center justify-center hover:bg-surface transition-colors cursor-pointer bg-white">
                    <Printer className="w-4 h-4 text-navy" />
                  </button>
                  <button className="w-9 h-9 rounded-[5px] border border-border flex items-center justify-center hover:bg-surface transition-colors cursor-pointer bg-white">
                    <Download className="w-4 h-4 text-navy" />
                  </button>
                  <button className="w-9 h-9 rounded-[5px] border border-border flex items-center justify-center hover:bg-surface transition-colors cursor-pointer bg-white">
                    <MoreHorizontal className="w-4 h-4 text-navy" />
                  </button>
                </div>
              </div>

              {/* Timeline / tracking */}
              <div className="px-6 py-3.5 border-b border-border bg-surface/20">
                <div className="flex items-center gap-5 text-[13px]">
                  <div className="flex items-center gap-1.5 text-grayText">
                    <CalendarDays className="w-4 h-4" /> Créé le {detail.date}
                  </div>
                  {detail.sentAt && (
                    <div className="flex items-center gap-1.5 text-forest">
                      <Send className="w-4 h-4" /> Envoyé {detail.sentAt}
                    </div>
                  )}
                  {detail.viewedAt && (
                    <div className="flex items-center gap-1.5 text-sage">
                      <Eye className="w-4 h-4" /> Vu {detail.viewedAt}
                    </div>
                  )}
                  {detail.signed && (
                    <div className="flex items-center gap-1.5 text-success">
                      <CheckCircle2 className="w-4 h-4" /> Signé
                    </div>
                  )}
                  {detail.dueDate && (
                    <div className="flex items-center gap-1.5 text-grayText ml-auto">
                      <Clock className="w-4 h-4" /> Échéance {detail.dueDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Line items table */}
              <div className="px-6 py-5">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs font-semibold text-grayText uppercase tracking-wider">
                      <th className="text-left pb-3 font-semibold">Description</th>
                      <th className="text-center pb-3 w-[70px] font-semibold">Qté</th>
                      <th className="text-right pb-3 w-[120px] font-semibold">P.U. HT</th>
                      <th className="text-right pb-3 w-[120px] font-semibold">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.lines.map((line, i) => (
                      <tr key={i} className="border-t border-border/50 text-[15px]">
                        <td className="py-3.5 text-navy">{line.description}</td>
                        <td className="py-3.5 text-center text-grayText font-mono">{line.qty}</td>
                        <td className="py-3.5 text-right text-grayText font-mono">{formatPrice(line.unitPrice)}</td>
                        <td className="py-3.5 text-right text-navy font-mono font-semibold">{formatPrice(line.qty * line.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mx-6 mb-5 bg-surface/40 rounded-[5px] p-5">
                <div className="flex justify-between text-[15px] mb-1.5">
                  <span className="text-grayText">Total HT</span>
                  <span className="font-mono font-medium text-navy">{formatPrice(detailHT)}</span>
                </div>
                <div className="flex justify-between text-[15px] mb-1.5">
                  <span className="text-grayText">TVA ({detail.tvaRate * 100}%)</span>
                  <span className="font-mono font-medium text-navy">{formatPrice(detailTVA)}</span>
                </div>
                <div className="flex justify-between text-base pt-3 border-t border-border">
                  <span className="font-bold text-navy">Total TTC</span>
                  <span className="font-mono text-[22px] font-bold text-navy">{formatPrice(detailTTC)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 px-6 py-4 border-t border-border">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-forest text-white text-sm font-semibold cursor-pointer hover:bg-forest/90 transition-colors border-none">
                  <Send className="w-4 h-4" /> Envoyer au client
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-white text-navy text-sm font-semibold cursor-pointer border border-border hover:bg-surface transition-colors">
                  <Copy className="w-4 h-4" /> Dupliquer
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-white text-navy text-sm font-semibold cursor-pointer border border-border hover:bg-surface transition-colors">
                  <Mail className="w-4 h-4" /> Relance
                </button>
                {tab === "devis" && detail.status === "accepted" && (
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-navy text-white text-sm font-semibold cursor-pointer hover:bg-navy/90 transition-colors border-none ml-auto">
                    <Receipt className="w-4 h-4" /> Convertir en facture
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[5px] bg-white text-red text-sm font-semibold cursor-pointer border border-red/15 hover:bg-red/[0.04] transition-colors ml-auto">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="bg-white rounded-[5px] border border-border flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 rounded-[5px] bg-surface flex items-center justify-center mb-5">
                <FileText className="w-8 h-8 text-border" />
              </div>
              <p className="text-base font-semibold text-navy mb-1">Sélectionnez un document</p>
              <p className="text-sm text-grayText">Cliquez sur un {tab === "devis" ? "devis" : "une facture"} pour voir le détail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
