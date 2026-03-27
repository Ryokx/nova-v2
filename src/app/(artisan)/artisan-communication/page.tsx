/**
 * Page Communications artisan.
 * Gestion complète du marketing client :
 * - Onglet Campagnes : créer, envoyer et suivre des campagnes email/SMS
 * - Onglet Templates : bibliothèque de modèles réutilisables
 * - Onglet Historique : suivi des envois (ouvert, cliqué, erreur)
 * - Onglet Contacts : répertoire avec opt-in email/SMS
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Megaphone,
  LayoutTemplate,
  History,
  Users,
  Plus,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Clock,
  FileText,
  Heart,
  Tag,
  Wrench,
  Star,
  Search,
  Download,
  Eye,
  MousePointerClick,
  X,
  Calendar,
  Filter,
  Edit3,
  BarChart3,
} from "lucide-react";

/* ──────────────── Types ──────────────── */

/* Onglets disponibles */
type Tab = "campagnes" | "templates" | "historique" | "contacts";
/* Canal d'envoi de la campagne */
type Channel = "email" | "sms" | "both";
/* Segment de destinataires */
type Segment = "all" | "new" | "loyal" | "inactive";

interface Campaign {
  id: string;
  name: string;
  channel: "Email" | "SMS";
  recipients: number;
  openRate: number;
  date: string;
}

interface Template {
  id: string;
  name: string;
  channel: "SMS" | "Email" | "Email + SMS";
  icon: React.ReactNode;
  body: string;
}

interface HistoryEntry {
  id: string;
  type: "Email" | "SMS";
  recipient: string;
  subject: string;
  date: string;
  status: "Envoyé" | "Ouvert" | "Cliqué" | "Erreur";
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  optInEmail: boolean;
  optInSms: boolean;
  lastContact: string;
}

/* ──────────────── Données mockées ──────────────── */

/* Campagnes précédemment envoyées */
const campaigns: Campaign[] = [
  { id: "c1", name: "Offre Printemps -15%", channel: "Email", recipients: 142, openRate: 72, date: "28 mars 2026" },
  { id: "c2", name: "Rappel entretien chaudière", channel: "SMS", recipients: 67, openRate: 89, date: "15 mars 2026" },
  { id: "c3", name: "Bienvenue nouveaux clients", channel: "Email", recipients: 23, openRate: 65, date: "1 mars 2026" },
];

/* Templates de messages réutilisables */
const templates: Template[] = [
  { id: "t1", name: "Rappel de rendez-vous", channel: "SMS", icon: <Clock size={20} />, body: "Bonjour {prénom}, nous vous rappelons votre rendez-vous le {date} à {heure}. À bientôt !" },
  { id: "t2", name: "Devis envoyé", channel: "Email", icon: <FileText size={20} />, body: "Bonjour {prénom},\n\nVotre devis #{numéro} a bien été envoyé. Vous pouvez le consulter et le signer directement depuis votre espace Nova.\n\nCordialement" },
  { id: "t3", name: "Merci pour votre confiance", channel: "Email", icon: <Heart size={20} />, body: "Bonjour {prénom},\n\nMerci d'avoir fait appel à nos services ! Nous espérons que l'intervention vous a pleinement satisfait.\n\nN'hésitez pas à laisser un avis.\n\nCordialement" },
  { id: "t4", name: "Promotion saisonnière", channel: "Email", icon: <Tag size={20} />, body: "Bonjour {prénom},\n\nProfitez de notre offre spéciale {saison} : -{réduction}% sur {service}.\n\nOffre valable jusqu'au {date_fin}.\n\nÀ bientôt !" },
  { id: "t5", name: "Rappel entretien annuel", channel: "SMS", icon: <Wrench size={20} />, body: "Bonjour {prénom}, il est temps de planifier votre entretien annuel {type}. Contactez-nous pour prendre RDV !" },
  { id: "t6", name: "Demande d'avis", channel: "Email + SMS", icon: <Star size={20} />, body: "Bonjour {prénom},\n\nVotre avis compte ! Suite à notre intervention du {date}, pourriez-vous nous laisser une évaluation ?\n\nMerci !" },
];

/* Historique des envois individuels */
const historyEntries: HistoryEntry[] = [
  { id: "h1", type: "Email", recipient: "Pierre Martin", subject: "Offre Printemps -15%", date: "28 mars 2026 09:30", status: "Ouvert" },
  { id: "h2", type: "Email", recipient: "Sophie Durand", subject: "Offre Printemps -15%", date: "28 mars 2026 09:30", status: "Cliqué" },
  { id: "h3", type: "SMS", recipient: "Jean Lefèvre", subject: "Rappel entretien", date: "15 mars 2026 14:00", status: "Envoyé" },
  { id: "h4", type: "Email", recipient: "Marie Bernard", subject: "Bienvenue chez nous", date: "1 mars 2026 10:00", status: "Ouvert" },
  { id: "h5", type: "Email", recipient: "Luc Petit", subject: "Offre Printemps -15%", date: "28 mars 2026 09:30", status: "Erreur" },
  { id: "h6", type: "SMS", recipient: "Amélie Roux", subject: "Rappel RDV demain", date: "14 mars 2026 18:00", status: "Envoyé" },
  { id: "h7", type: "Email", recipient: "Thomas Moreau", subject: "Merci pour votre confiance", date: "10 mars 2026 11:00", status: "Ouvert" },
  { id: "h8", type: "SMS", recipient: "Claire Dubois", subject: "Rappel entretien", date: "15 mars 2026 14:00", status: "Envoyé" },
];

/* Répertoire des contacts clients */
const contacts: Contact[] = [
  { id: "co1", name: "Pierre Martin", email: "pierre.martin@mail.com", phone: "06 12 34 56 78", optInEmail: true, optInSms: true, lastContact: "28 mars 2026" },
  { id: "co2", name: "Sophie Durand", email: "sophie.durand@mail.com", phone: "06 23 45 67 89", optInEmail: true, optInSms: false, lastContact: "28 mars 2026" },
  { id: "co3", name: "Jean Lefèvre", email: "jean.lefevre@mail.com", phone: "06 34 56 78 90", optInEmail: true, optInSms: true, lastContact: "15 mars 2026" },
  { id: "co4", name: "Marie Bernard", email: "marie.bernard@mail.com", phone: "06 45 67 89 01", optInEmail: true, optInSms: true, lastContact: "1 mars 2026" },
  { id: "co5", name: "Luc Petit", email: "luc.petit@mail.com", phone: "06 56 78 90 12", optInEmail: false, optInSms: true, lastContact: "28 fév 2026" },
  { id: "co6", name: "Amélie Roux", email: "amelie.roux@mail.com", phone: "06 67 89 01 23", optInEmail: true, optInSms: true, lastContact: "14 mars 2026" },
  { id: "co7", name: "Thomas Moreau", email: "thomas.moreau@mail.com", phone: "06 78 90 12 34", optInEmail: true, optInSms: false, lastContact: "10 mars 2026" },
  { id: "co8", name: "Claire Dubois", email: "claire.dubois@mail.com", phone: "06 89 01 23 45", optInEmail: true, optInSms: true, lastContact: "15 mars 2026" },
];

/* ──────────────── Helpers ──────────────── */

/* Couleurs CSS pour chaque statut d'envoi */
const statusColor: Record<HistoryEntry["status"], string> = {
  Envoyé: "bg-blue-100 text-blue-700",
  Ouvert: "bg-emerald-100 text-emerald-700",
  Cliqué: "bg-forest/10 text-forest",
  Erreur: "bg-red/10 text-red",
};

/* ──────────────── Page ──────────────── */

export default function ArtisanCommunicationPage() {
  /* Onglet actif */
  const [tab, setTab] = useState<Tab>("campagnes");
  /* Campagne et template dépliés (détail visible) */
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  /* Affiche/masque la modale de création de campagne */
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  /* --- Formulaire nouvelle campagne --- */
  const [campaignName, setCampaignName] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [segment, setSegment] = useState<Segment>("all");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduleNow, setScheduleNow] = useState(true);     // Envoyer maintenant ou programmer
  const [scheduleDate, setScheduleDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  /* --- Filtres de l'historique --- */
  const [historyTypeFilter, setHistoryTypeFilter] = useState<"all" | "Email" | "SMS">("all");
  const [historyDateFrom, setHistoryDateFrom] = useState("");
  const [historyDateTo, setHistoryDateTo] = useState("");

  /* --- Recherche dans les contacts --- */
  const [contactSearch, setContactSearch] = useState("");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "campagnes", label: "Campagnes", icon: <Megaphone size={18} /> },
    { key: "templates", label: "Templates", icon: <LayoutTemplate size={18} /> },
    { key: "historique", label: "Historique", icon: <History size={18} /> },
    { key: "contacts", label: "Contacts", icon: <Users size={18} /> },
  ];

  const filteredHistory = historyEntries.filter((e) => {
    if (historyTypeFilter !== "all" && e.type !== historyTypeFilter) return false;
    return true;
  });

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(contactSearch.toLowerCase()),
  );

  /* Réinitialise tous les champs du formulaire de campagne */
  const resetCampaignForm = () => {
    setCampaignName("");
    setChannel("email");
    setSegment("all");
    setSelectedTemplate("");
    setSubject("");
    setBody("");
    setScheduleNow(true);
    setScheduleDate("");
    setShowPreview(false);
  };

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">
          Communications
        </h1>
        <p className="text-[15px] text-grayText">
          Gérez vos campagnes, templates et contacts clients
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-5 py-2.5 rounded-[5px] text-[13px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors",
              tab === t.key
                ? "bg-deepForest text-white"
                : "bg-surface text-grayText hover:bg-border",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ───── Campagnes Tab ───── */}
      {tab === "campagnes" && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              { label: "Campagnes envoyées", value: "12", icon: <Send size={20} className="text-forest" /> },
              { label: "Taux d'ouverture moyen", value: "68%", icon: <Eye size={20} className="text-forest" /> },
              { label: "Taux de clic", value: "24%", icon: <MousePointerClick size={20} className="text-forest" /> },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-[5px] shadow-sm border border-border p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center">{s.icon}</div>
                <div>
                  <p className="font-mono text-xl font-bold text-navy">{s.value}</p>
                  <p className="text-[13px] text-grayText">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* New campaign button */}
          <Button onClick={() => { setShowNewCampaign(true); resetCampaignForm(); }} className="gap-2 px-5 py-2.5 rounded-[5px] text-sm">
            <Plus size={16} /> Nouvelle campagne
          </Button>

          {/* New campaign form modal */}
          {showNewCampaign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
              <div className="bg-white rounded-[5px] shadow-xl border border-border w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-heading text-lg font-bold text-navy">Nouvelle campagne</h2>
                  <button onClick={() => setShowNewCampaign(false)} className="text-grayText hover:text-navy">
                    <X size={20} />
                  </button>
                </div>

                {!showPreview ? (
                  <div className="space-y-4">
                    {/* Campaign name */}
                    <div>
                      <label className="text-[13px] font-semibold text-navy block mb-1">Nom de la campagne</label>
                      <input
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Ex: Offre Printemps"
                        className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                      />
                    </div>

                    {/* Channel selector */}
                    <div>
                      <label className="text-[13px] font-semibold text-navy block mb-1">Canal</label>
                      <div className="flex gap-2">
                        {([["email", "Email", <Mail key="m" size={14} />], ["sms", "SMS", <MessageSquare key="s" size={14} />], ["both", "Les deux", <Send key="b" size={14} />]] as const).map(([val, lbl, ico]) => (
                          <button
                            key={val}
                            onClick={() => setChannel(val as Channel)}
                            className={cn(
                              "px-5 py-2.5 rounded-[5px] text-[13px] font-semibold flex items-center gap-1.5 transition-colors",
                              channel === val ? "bg-deepForest text-white" : "bg-surface text-grayText hover:bg-border",
                            )}
                          >
                            {ico} {lbl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Segment */}
                    <div>
                      <label className="text-[13px] font-semibold text-navy block mb-1">Destinataires</label>
                      <select
                        value={segment}
                        onChange={(e) => setSegment(e.target.value as Segment)}
                        className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                      >
                        <option value="all">Tous les clients</option>
                        <option value="new">Nouveaux clients</option>
                        <option value="loyal">Clients fidèles</option>
                        <option value="inactive">Inactifs &gt; 3 mois</option>
                      </select>
                    </div>

                    {/* Template selector */}
                    <div>
                      <label className="text-[13px] font-semibold text-navy block mb-1">Template</label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => {
                          setSelectedTemplate(e.target.value);
                          const tpl = templates.find((t) => t.id === e.target.value);
                          if (tpl) {
                            setBody(tpl.body);
                            setSubject(tpl.name);
                          }
                        }}
                        className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                      >
                        <option value="">Aucun (rédiger manuellement)</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subject (email) */}
                    {(channel === "email" || channel === "both") && (
                      <div>
                        <label className="text-[13px] font-semibold text-navy block mb-1">Objet de l&apos;email</label>
                        <input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Objet du message"
                          className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                      </div>
                    )}

                    {/* Body */}
                    <div>
                      <label className="text-[13px] font-semibold text-navy block mb-1">Message</label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={6}
                        placeholder="Rédigez votre message..."
                        className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                      />
                      <p className="text-[13px] text-grayText mt-1 text-right font-mono">{body.length} caractères</p>
                    </div>

                    {/* Schedule */}
                    <div>
                      <label className="text-[13px] font-semibold text-navy block mb-2">Programmation</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setScheduleNow(true)}
                          className={cn(
                            "px-5 py-2.5 rounded-[5px] text-[13px] font-semibold transition-colors",
                            scheduleNow ? "bg-deepForest text-white" : "bg-surface text-grayText hover:bg-border",
                          )}
                        >
                          Envoyer maintenant
                        </button>
                        <button
                          onClick={() => setScheduleNow(false)}
                          className={cn(
                            "px-5 py-2.5 rounded-[5px] text-[13px] font-semibold flex items-center gap-1.5 transition-colors",
                            !scheduleNow ? "bg-deepForest text-white" : "bg-surface text-grayText hover:bg-border",
                          )}
                        >
                          <Calendar size={14} /> Programmer
                        </button>
                      </div>
                      {!scheduleNow && (
                        <input
                          type="datetime-local"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="mt-2 w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" onClick={() => setShowPreview(true)} className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
                        <Eye size={15} /> Prévisualiser
                      </Button>
                      <Button
                        onClick={() => setShowNewCampaign(false)}
                        disabled={!campaignName || !body}
                        className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm"
                      >
                        <Send size={15} /> Envoyer
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Preview */
                  <div className="space-y-4">
                    <div className="rounded-[5px] border border-border overflow-hidden">
                      <div className="bg-deepForest text-white px-5 py-4 text-[15px] font-heading font-bold">Nova</div>
                      <div className="bg-white p-5">
                        {subject && <p className="font-semibold text-navy mb-3">{subject}</p>}
                        <p className="text-[15px] text-navy whitespace-pre-line">{body}</p>
                      </div>
                      <div className="bg-gray-50 px-5 py-4 text-[13px] text-grayText">
                        Se désabonner -- Nova Plateforme
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setShowPreview(false)} className="px-5 py-2.5 rounded-[5px] text-sm">
                        Retour
                      </Button>
                      <Button onClick={() => setShowNewCampaign(false)} disabled={!campaignName || !body} className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
                        <Send size={15} /> Envoyer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campaign list */}
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.id} className="bg-white rounded-[5px] shadow-sm border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedCampaign(expandedCampaign === c.id ? null : c.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-9 h-9 rounded-[5px] flex items-center justify-center shrink-0",
                      c.channel === "Email" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600",
                    )}>
                      {c.channel === "Email" ? <Mail size={18} /> : <MessageSquare size={18} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy text-[15px] truncate">{c.name}</p>
                      <p className="text-[13px] text-grayText">{c.channel} -- {c.recipients} destinataires -- {c.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[15px] font-bold text-forest">{c.openRate}%</span>
                    {expandedCampaign === c.id ? <ChevronUp size={18} className="text-grayText" /> : <ChevronDown size={18} className="text-grayText" />}
                  </div>
                </button>
                {expandedCampaign === c.id && (
                  <div className="px-5 pb-5 border-t border-border pt-3">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center">
                        <p className="font-mono text-lg font-bold text-navy">{c.recipients}</p>
                        <p className="text-[13px] text-grayText">Destinataires</p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono text-lg font-bold text-forest">{c.openRate}%</p>
                        <p className="text-[13px] text-grayText">{c.channel === "SMS" ? "Taux de lecture" : "Taux d'ouverture"}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono text-lg font-bold text-navy">{Math.round(c.recipients * c.openRate / 100)}</p>
                        <p className="text-[13px] text-grayText">{c.channel === "SMS" ? "Lus" : "Ouverts"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
                        <BarChart3 size={15} /> Statistiques détaillées
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
                        <Edit3 size={15} /> Réutiliser
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───── Templates Tab ───── */}
      {tab === "templates" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {templates.map((t) => (
              <div key={t.id} className="bg-white rounded-[5px] shadow-sm border border-border p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center text-forest">
                    {t.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy text-[15px] truncate">{t.name}</p>
                    <p className="text-[13px] text-grayText">{t.channel}</p>
                  </div>
                </div>

                {expandedTemplate === t.id && (
                  <div className="mb-3 p-3 bg-surface rounded-[5px] text-[13px] text-navy whitespace-pre-line">
                    {t.body}
                  </div>
                )}

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setExpandedTemplate(expandedTemplate === t.id ? null : t.id)}
                    className="px-5 py-2.5 rounded-[5px] text-sm font-semibold text-forest bg-surface hover:bg-border transition-colors"
                  >
                    {expandedTemplate === t.id ? "Masquer" : "Aperçu"}
                  </button>
                  <Button size="sm" className="px-5 py-2.5 rounded-[5px] text-sm">Utiliser</Button>
                  <button className="px-5 py-2.5 rounded-[5px] text-sm font-semibold text-grayText hover:text-navy hover:bg-surface transition-colors">
                    Modifier
                  </button>
                </div>
              </div>
            ))}

            {/* Create template card */}
            <button className="bg-surface rounded-[5px] border-2 border-dashed border-border p-5 flex flex-col items-center justify-center gap-2 min-h-[160px] hover:border-forest/40 transition-colors group">
              <div className="w-10 h-10 rounded-[5px] bg-white flex items-center justify-center text-forest group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <p className="text-[15px] font-semibold text-grayText group-hover:text-navy transition-colors">Créer un template</p>
            </button>
          </div>
        </div>
      )}

      {/* ───── Historique Tab ───── */}
      {tab === "historique" && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-1.5 text-[15px] text-grayText">
              <Filter size={16} />
              <span className="font-semibold">Filtres</span>
            </div>
            <div className="flex gap-2">
              {(["all", "Email", "SMS"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setHistoryTypeFilter(t)}
                  className={cn(
                    "px-5 py-2.5 rounded-[5px] text-[13px] font-semibold transition-colors",
                    historyTypeFilter === t ? "bg-deepForest text-white" : "bg-surface text-grayText hover:bg-border",
                  )}
                >
                  {t === "all" ? "Tous" : t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center ml-auto">
              <input
                type="date"
                value={historyDateFrom}
                onChange={(e) => setHistoryDateFrom(e.target.value)}
                className="px-5 py-2.5 rounded-[5px] border border-border text-[13px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
              <span className="text-[13px] text-grayText">au</span>
              <input
                type="date"
                value={historyDateTo}
                onChange={(e) => setHistoryDateTo(e.target.value)}
                className="px-5 py-2.5 rounded-[5px] border border-border text-[13px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            {filteredHistory.map((e) => (
              <div key={e.id} className="bg-white rounded-[5px] shadow-sm border border-border p-5 flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-[5px] flex items-center justify-center shrink-0",
                  e.type === "Email" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600",
                )}>
                  {e.type === "Email" ? <Mail size={16} /> : <MessageSquare size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-navy truncate">{e.subject}</p>
                  <p className="text-[13px] text-grayText">{e.recipient} -- {e.date}</p>
                </div>
                <span className={cn("px-2.5 py-1 rounded-[5px] text-[13px] font-semibold shrink-0", statusColor[e.status])}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───── Contacts Tab ───── */}
      {tab === "contacts" && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              { label: "Total contacts", value: "89" },
              { label: "Opt-in email", value: "76" },
              { label: "Opt-in SMS", value: "54" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-[5px] shadow-sm border border-border p-5 text-center">
                <p className="font-mono text-xl font-bold text-navy">{s.value}</p>
                <p className="text-[13px] text-grayText">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search + export */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-grayText" />
              <input
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Rechercher un contact..."
                className="w-full pl-10 pr-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
              <Download size={16} /> Exporter CSV
            </Button>
          </div>

          {/* Contact list */}
          <div className="space-y-2">
            {filteredContacts.map((c) => (
              <div key={c.id} className="bg-white rounded-[5px] shadow-sm border border-border p-5 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white text-[15px] font-bold shrink-0">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-navy">{c.name}</p>
                  <p className="text-[13px] text-grayText truncate">{c.email} -- {c.phone}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "px-2 py-0.5 rounded-[5px] text-[11px] font-semibold",
                    c.optInEmail ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-grayText",
                  )}>
                    Email {c.optInEmail ? "OUI" : "NON"}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-[5px] text-[11px] font-semibold",
                    c.optInSms ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-grayText",
                  )}>
                    SMS {c.optInSms ? "OUI" : "NON"}
                  </span>
                </div>
                <p className="text-[13px] text-grayText shrink-0 hidden md:block">{c.lastContact}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
