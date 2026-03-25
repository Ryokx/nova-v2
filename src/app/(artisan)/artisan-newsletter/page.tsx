"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Users,
  Eye,
  MousePointerClick,
  UserMinus,
  ChevronDown,
  ChevronUp,
  Send,
  Save,
  Calendar,
  Image as ImageIcon,
  Link2,
  Download,
  BarChart3,
  Copy,
  Check,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Clock,
  Mail,
  FileText,
} from "lucide-react";

/* ──────────────── Types ──────────────── */

interface Newsletter {
  id: string;
  title: string;
  date: string;
  sent: number;
  openRate: number;
  clickRate: number;
  preview: string;
}

interface Subscriber {
  name: string;
  email: string;
  date: string;
}

/* ──────────────── Mock data ──────────────── */

const newsletters: Newsletter[] = [
  {
    id: "n1",
    title: "Conseils d'hiver : protégez vos canalisations",
    date: "12 mars 2026",
    sent: 234,
    openRate: 71,
    clickRate: 15,
    preview: "Bonjour,\n\nAvec les températures qui baissent, il est essentiel de protéger vos canalisations contre le gel. Voici nos conseils :\n\n1. Isolez les tuyaux exposés\n2. Laissez couler un filet d'eau par grand froid\n3. Purgez les robinets extérieurs\n\nBesoin d'aide ? Nous sommes là pour vous !",
  },
  {
    id: "n2",
    title: "Nouvelle offre entretien annuel",
    date: "28 fév 2026",
    sent: 228,
    openRate: 68,
    clickRate: 22,
    preview: "Bonjour,\n\nDécouvrez notre nouvelle offre d'entretien annuel : chaudière, climatisation et plomberie à prix préférentiel.\n\nProfitez de -20% jusqu'à fin mars !\n\nÀ très bientôt.",
  },
  {
    id: "n3",
    title: "Les bons gestes avant l'été",
    date: "15 fév 2026",
    sent: 220,
    openRate: 74,
    clickRate: 18,
    preview: "Bonjour,\n\nL'été approche ! Pensez à faire réviser votre climatisation et vos installations sanitaires.\n\nNos conseils pour un été serein :\n- Vérifiez les filtres de votre clim\n- Contrôlez l'étanchéité de vos robinets\n- Faites un bilan plomberie\n\nPrenez rendez-vous dès maintenant.",
  },
];

const recentSubscribers: Subscriber[] = [
  { name: "Camille Leroy", email: "camille.leroy@mail.com", date: "22 mars 2026" },
  { name: "Hugo Fontaine", email: "hugo.fontaine@mail.com", date: "20 mars 2026" },
  { name: "Inès Garnier", email: "ines.garnier@mail.com", date: "18 mars 2026" },
  { name: "Raphaël Bonnet", email: "raphael.bonnet@mail.com", date: "16 mars 2026" },
  { name: "Léa Marchand", email: "lea.marchand@mail.com", date: "14 mars 2026" },
];

const embedSnippet = `<div id="nova-newsletter-widget" data-artisan="VOTRE_ID"></div>
<script src="https://nova.fr/widget/newsletter.js" async></script>`;

const templateOptions = [
  { value: "", label: "Aucun template" },
  { value: "actualites", label: "Actualités" },
  { value: "promotion", label: "Promotion" },
  { value: "conseils", label: "Conseils" },
  { value: "saisonnier", label: "Saisonnier" },
];

const dayOptions = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

/* ──────────────── Page ──────────────── */

export default function ArtisanNewsletterPage() {
  const [expandedNewsletter, setExpandedNewsletter] = useState<string | null>(null);

  /* Compose state */
  const [nlSubject, setNlSubject] = useState("");
  const [nlBody, setNlBody] = useState("");
  const [nlTemplate, setNlTemplate] = useState("");
  const [nlCtaText, setNlCtaText] = useState("");
  const [nlCtaUrl, setNlCtaUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  /* Subscribers */
  const [autoSubscribe, setAutoSubscribe] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);

  /* Settings */
  const [frequency, setFrequency] = useState("mensuel");
  const [sendDay, setSendDay] = useState("Mardi");
  const [sendTime, setSendTime] = useState("09:00");
  const [senderName, setSenderName] = useState("Martin Plomberie");
  const [replyEmail, setReplyEmail] = useState("contact@martin-plomberie.fr");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedSnippet).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const canSend = nlSubject.trim().length > 0 && nlBody.trim().length > 0;

  /* Mock growth bars */
  const growthData = [
    { month: "Oct", count: 180 },
    { month: "Nov", count: 195 },
    { month: "Déc", count: 205 },
    { month: "Jan", count: 212 },
    { month: "Fév", count: 224 },
    { month: "Mar", count: 234 },
  ];
  const maxCount = Math.max(...growthData.map((d) => d.count));

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">
          Newsletter
        </h1>
        <p className="text-[15px] text-grayText">
          Fidélisez vos clients avec des newsletters régulières
        </p>
      </div>

      {/* Stats header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
        {[
          { label: "Abonnés", value: "234", icon: <Users size={20} className="text-forest" /> },
          { label: "Taux d'ouverture", value: "72%", icon: <Eye size={20} className="text-forest" /> },
          { label: "Taux de clic", value: "18%", icon: <MousePointerClick size={20} className="text-forest" /> },
          { label: "Désabonnements ce mois", value: "3", icon: <UserMinus size={20} className="text-red" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[5px] shadow-sm border border-border p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center shrink-0">{s.icon}</div>
            <div>
              <p className="font-mono text-xl font-bold text-navy">{s.value}</p>
              <p className="text-[13px] text-grayText">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ───── Dernières newsletters ───── */}
      <section className="mb-8">
        <h2 className="font-heading text-lg font-bold text-navy mb-4">Dernières newsletters</h2>
        <div className="space-y-3">
          {newsletters.map((nl) => (
            <div key={nl.id} className="bg-white rounded-[5px] shadow-sm border border-border overflow-hidden">
              <button
                onClick={() => setExpandedNewsletter(expandedNewsletter === nl.id ? null : nl.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-[5px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-navy text-[15px] truncate">{nl.title}</p>
                    <p className="text-[13px] text-grayText">{nl.date} -- {nl.sent} envoyés -- {nl.openRate}% ouvert</p>
                  </div>
                </div>
                {expandedNewsletter === nl.id
                  ? <ChevronUp size={18} className="text-grayText shrink-0" />
                  : <ChevronDown size={18} className="text-grayText shrink-0" />}
              </button>
              {expandedNewsletter === nl.id && (
                <div className="px-5 pb-5 border-t border-border pt-3 space-y-3">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-navy">{nl.sent}</p>
                      <p className="text-[13px] text-grayText">Envoyés</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-forest">{nl.openRate}%</p>
                      <p className="text-[13px] text-grayText">Taux d&apos;ouverture</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-forest">{nl.clickRate}%</p>
                      <p className="text-[13px] text-grayText">Taux de clic</p>
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="rounded-[5px] border border-border overflow-hidden">
                    <div className="bg-deepForest text-white px-5 py-2.5 text-[15px] font-heading font-bold">Nova</div>
                    <div className="bg-white p-5 text-[15px] text-navy whitespace-pre-line">{nl.preview}</div>
                    <div className="bg-gray-50 px-5 py-2.5 text-[13px] text-grayText">Se désabonner -- Nova Plateforme</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ───── Composer une newsletter ───── */}
      <section className="mb-8">
        <h2 className="font-heading text-lg font-bold text-navy mb-4">Composer une newsletter</h2>
        <div className="bg-white rounded-[5px] shadow-sm border border-border p-5">
          <div className={cn("grid gap-5", showPreview ? "md:grid-cols-2" : "grid-cols-1")}>
            {/* Editor */}
            <div className="space-y-4">
              {/* Template selector */}
              <div>
                <label className="text-[13px] font-semibold text-navy block mb-1">Template</label>
                <select
                  value={nlTemplate}
                  onChange={(e) => setNlTemplate(e.target.value)}
                  className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  {templateOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[13px] font-semibold text-navy block mb-1">Objet</label>
                <input
                  value={nlSubject}
                  onChange={(e) => setNlSubject(e.target.value)}
                  placeholder="Objet de votre newsletter"
                  className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>

              {/* Greeting */}
              <div className="px-5 py-2.5 rounded-[5px] bg-surface text-[15px] text-grayText">
                Bonjour &#123;prénom&#125;,
              </div>

              {/* Body */}
              <div>
                <label className="text-[13px] font-semibold text-navy block mb-1">Contenu</label>
                <textarea
                  value={nlBody}
                  onChange={(e) => setNlBody(e.target.value)}
                  rows={8}
                  placeholder="Rédigez le contenu de votre newsletter..."
                  className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none min-h-[200px]"
                />
              </div>

              {/* Image upload zone */}
              <div>
                <label className="text-[13px] font-semibold text-navy block mb-1">Image</label>
                <div className="border-2 border-dashed border-border rounded-[5px] p-6 flex flex-col items-center gap-2 text-grayText hover:border-forest/40 transition-colors cursor-pointer">
                  <ImageIcon size={24} />
                  <p className="text-[15px]">Glissez une image ou cliquez pour ajouter</p>
                  <p className="text-[13px]">PNG, JPG -- Max 2 Mo</p>
                </div>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-semibold text-navy block mb-1">Texte du bouton CTA</label>
                  <input
                    value={nlCtaText}
                    onChange={(e) => setNlCtaText(e.target.value)}
                    placeholder="Ex: Prendre rendez-vous"
                    className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-navy block mb-1">URL du bouton</label>
                  <div className="relative">
                    <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grayText" />
                    <input
                      value={nlCtaUrl}
                      onChange={(e) => setNlCtaUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full pl-9 pr-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="px-5 py-2.5 rounded-[5px] bg-surface text-[13px] text-grayText">
                Le pied de page inclut automatiquement un lien de désabonnement et vos coordonnées.
              </div>

              {/* Preview toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-[15px] font-semibold text-forest flex items-center gap-1.5 hover:underline"
              >
                <Eye size={16} /> {showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
              </button>
            </div>

            {/* Preview pane */}
            {showPreview && (
              <div className="rounded-[5px] border border-border overflow-hidden self-start sticky top-4">
                <div className="bg-deepForest text-white px-5 py-4 font-heading font-bold text-[15px] flex items-center gap-2">
                  <FileText size={18} /> Nova Newsletter
                </div>
                <div className="bg-white p-5 space-y-3">
                  {nlSubject && <h3 className="font-heading font-bold text-navy text-base">{nlSubject}</h3>}
                  <p className="text-[15px] text-grayText">Bonjour &#123;prénom&#125;,</p>
                  <p className="text-[15px] text-navy whitespace-pre-line">{nlBody || "Votre contenu apparaîtra ici..."}</p>
                  {nlCtaText && (
                    <div className="pt-2">
                      <span className="inline-block px-5 py-2.5 bg-deepForest text-white text-sm font-bold rounded-[5px]">
                        {nlCtaText}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-5 py-4 text-[13px] text-grayText">
                  <p>Se désabonner -- Nova Plateforme</p>
                  <p className="mt-1">{senderName} -- {replyEmail}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
            <Button disabled={!canSend} className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
              <Send size={15} /> Envoyer la newsletter
            </Button>
            <Button variant="outline" disabled={!canSend} className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
              <Calendar size={15} /> Programmer
            </Button>
            <Button variant="ghost" className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
              <Save size={15} /> Sauvegarder le brouillon
            </Button>
          </div>
        </div>
      </section>

      {/* ───── Abonnés ───── */}
      <section className="mb-8">
        <h2 className="font-heading text-lg font-bold text-navy mb-4">Abonnés</h2>
        <div className="bg-white rounded-[5px] shadow-sm border border-border p-5 space-y-5">
          {/* Growth chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[15px] font-semibold text-navy flex items-center gap-1.5">
                <BarChart3 size={17} className="text-forest" /> Croissance des abonnés
              </p>
              <p className="font-mono text-[15px] font-bold text-forest">+54 en 6 mois</p>
            </div>
            <div className="flex items-end gap-3 h-[100px]">
              {growthData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="font-mono text-[11px] font-bold text-navy">{d.count}</span>
                  <div
                    className="w-full bg-gradient-to-t from-deepForest to-sage rounded-t-md transition-all"
                    style={{ height: `${(d.count / maxCount) * 70}px` }}
                  />
                  <span className="text-[11px] text-grayText">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent subscribers */}
          <div>
            <p className="text-[15px] font-semibold text-navy mb-2">Derniers abonnés</p>
            <div className="space-y-2">
              {recentSubscribers.map((s) => (
                <div key={s.email} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-navy">{s.name}</p>
                    <p className="text-[13px] text-grayText truncate">{s.email}</p>
                  </div>
                  <p className="text-[13px] text-grayText shrink-0">{s.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="outline" size="sm" className="gap-1.5 px-5 py-2.5 rounded-[5px] text-sm">
              <Download size={16} /> Exporter la liste
            </Button>
            <button
              onClick={() => setAutoSubscribe(!autoSubscribe)}
              className="flex items-center gap-2 text-[15px] text-navy"
            >
              {autoSubscribe
                ? <ToggleRight size={28} className="text-forest" />
                : <ToggleLeft size={28} className="text-grayText" />}
              <span className={cn("font-semibold", autoSubscribe ? "text-forest" : "text-grayText")}>
                Inscription automatique nouveaux clients
              </span>
            </button>
          </div>

          {/* Embed widget */}
          <div>
            <p className="text-[15px] font-semibold text-navy mb-2 flex items-center gap-1.5">
              <ExternalLink size={16} className="text-forest" /> Ajoutez ce formulaire sur votre site
            </p>
            <div className="relative">
              <pre className="bg-navy rounded-[5px] p-5 text-[13px] text-lightSage font-mono overflow-x-auto">
                {embedSnippet}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 p-2 rounded-[5px] bg-white/10 hover:bg-white/20 text-lightSage transition-colors"
              >
                {codeCopied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Paramètres ───── */}
      <section className="mb-8">
        <h2 className="font-heading text-lg font-bold text-navy mb-4">Paramètres</h2>
        <div className="bg-white rounded-[5px] shadow-sm border border-border p-5 space-y-5">
          {/* Frequency */}
          <div>
            <label className="text-[13px] font-semibold text-navy block mb-2">Fréquence d&apos;envoi</label>
            <div className="flex gap-2">
              {[
                { value: "hebdomadaire", label: "Hebdomadaire" },
                { value: "bimensuel", label: "Bimensuel" },
                { value: "mensuel", label: "Mensuel" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value)}
                  className={cn(
                    "px-5 py-2.5 rounded-[5px] text-[13px] font-semibold transition-colors",
                    frequency === f.value
                      ? "bg-deepForest text-white"
                      : "bg-surface text-grayText hover:bg-border",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day + time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-navy block mb-1">Jour d&apos;envoi préféré</label>
              <select
                value={sendDay}
                onChange={(e) => setSendDay(e.target.value)}
                className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-navy block mb-1">Heure d&apos;envoi</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grayText" />
                <input
                  type="time"
                  value={sendTime}
                  onChange={(e) => setSendTime(e.target.value)}
                  className="w-full pl-9 pr-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>
          </div>

          {/* Sender info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-navy block mb-1">Nom de l&apos;expéditeur</label>
              <input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-navy block mb-1">Email de réponse</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grayText" />
                <input
                  value={replyEmail}
                  onChange={(e) => setReplyEmail(e.target.value)}
                  className="w-full pl-9 pr-5 py-2.5 rounded-[5px] border border-border text-[15px] text-navy bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
