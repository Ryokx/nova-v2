"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  CreditCard, FileText, BarChart3, Users, QrCode, Gift, Settings, HelpCircle,
  ChevronRight, Star, Tag, Zap, Globe, Megaphone, Mail, Pencil, Check, X,
  ShieldCheck, Upload, Trash2, Plus, Award, Calendar, AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

interface ArtisanProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  artisanProfile: {
    companyName: string | null;
    trade: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
  } | null;
}

interface Certification {
  id: string;
  name: string;
  organisme: string;
  dateObtention: string;
  dateExpiration: string;
  numero: string;
  status: "valid" | "expiring" | "expired";
  fichier: string | null;
}

interface Assurance {
  id: string;
  type: string;
  compagnie: string;
  numero: string;
  dateDebut: string;
  dateFin: string;
  montantGaranti: string;
  status: "valid" | "expiring" | "expired";
  fichier: string | null;
}

const menuItems = [
  { label: "Mon abonnement", icon: Star, href: "/artisan-subscription", sub: "Forfait Pro -- gérer ou changer" },
  { label: "Mes tarifs", icon: Tag, href: "/artisan-pricing", sub: "Déplacement, devis, urgences" },
  { label: "Paiements", icon: CreditCard, href: "/artisan-payments" },
  { label: "Instant Pay", icon: Zap, href: "/artisan-instant-pay", sub: "Paiement immédiat" },
  { label: "Documents", icon: FileText, href: "/artisan-documents" },
  { label: "Comptabilité", icon: BarChart3, href: "/artisan-compta" },
  { label: "Clients", icon: Users, href: "/artisan-clients" },
  { label: "Mon site web", icon: Globe, href: "/artisan-website", sub: "Personnaliser votre page" },
  { label: "Communication", icon: Megaphone, href: "/artisan-communication", sub: "Campagnes SMS & email" },
  { label: "Newsletter", icon: Mail, href: "/artisan-newsletter", sub: "234 abonnés" },
  { label: "QR code", icon: QrCode, href: "/artisan-qr-code" },
  { label: "Inviter un artisan", icon: Gift, href: "/referral", highlight: true },
  { label: "Paramètres", icon: Settings, href: "/settings" },
  { label: "Support", icon: HelpCircle, href: "/support" },
];

const mockCertifications: Certification[] = [
  {
    id: "c1", name: "RGE QualiPAC", organisme: "Qualit'EnR",
    dateObtention: "2024-06-15", dateExpiration: "2028-06-15",
    numero: "RGE-PAC-2024-4521", status: "valid", fichier: "rge-qualipac.pdf",
  },
  {
    id: "c2", name: "Qualibat 5412", organisme: "Qualibat",
    dateObtention: "2023-03-20", dateExpiration: "2027-03-20",
    numero: "QB-5412-2023-789", status: "valid", fichier: "qualibat-5412.pdf",
  },
  {
    id: "c3", name: "Habilitation électrique BR", organisme: "APAVE",
    dateObtention: "2023-09-10", dateExpiration: "2026-09-10",
    numero: "HAB-BR-2023-156", status: "expiring", fichier: "habilitation-br.pdf",
  },
];

const mockAssurances: Assurance[] = [
  {
    id: "a1", type: "Décennale", compagnie: "AXA Entreprises",
    numero: "DEC-2024-78901", dateDebut: "2024-01-01", dateFin: "2034-12-31",
    montantGaranti: "10 000 000 €", status: "valid", fichier: "decennale-axa.pdf",
  },
  {
    id: "a2", type: "Responsabilité Civile Pro", compagnie: "MAAF Pro",
    numero: "RCP-2025-34567", dateDebut: "2025-01-01", dateFin: "2026-01-01",
    montantGaranti: "3 000 000 €", status: "expiring", fichier: "rc-pro-maaf.pdf",
  },
  {
    id: "a3", type: "Protection juridique", compagnie: "Groupama",
    numero: "PJ-2025-11234", dateDebut: "2025-03-01", dateFin: "2026-03-01",
    montantGaranti: "50 000 €", status: "valid", fichier: null,
  },
];

const statusConfig = {
  valid: { label: "Valide", color: "text-success", bg: "bg-success/10" },
  expiring: { label: "Expire bientôt", color: "text-gold", bg: "bg-gold/10" },
  expired: { label: "Expiré", color: "text-red", bg: "bg-red/10" },
};

export default function ArtisanProfilePage() {
  const { data: session } = useSession();
  const { data: user, loading } = useFetch<ArtisanProfileData>("/api/auth/me");

  // Personal info editing
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    nom: "Jean-Michel Petit",
    email: "jm.petit@plomberie-pro.fr",
    telephone: "06 12 34 56 78",
  });

  // Company info editing
  const [editingCompany, setEditingCompany] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    raisonSociale: "JM Plomberie Pro",
    siret: "123 456 789 00012",
    tva: "FR 12 123456789",
    adresse: "8 rue des Artisans, 75011 Paris",
    codeApe: "4322A",
    metier: "Plombier-Chauffagiste",
  });

  // Certifications & Assurances
  const [certifications, setCertifications] = useState(mockCertifications);
  const [assurances, setAssurances] = useState(mockAssurances);
  const [addingCert, setAddingCert] = useState(false);
  const [addingAssurance, setAddingAssurance] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", organisme: "", numero: "", dateObtention: "", dateExpiration: "" });
  const [newAssurance, setNewAssurance] = useState({ type: "", compagnie: "", numero: "", dateDebut: "", dateFin: "", montantGaranti: "" });

  // Save feedback
  const [saved, setSaved] = useState<string | null>(null);
  const showSaved = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-[1320px] mx-auto p-5 md:p-8 space-y-4">
        <Skeleton height={28} width={120} />
        <Skeleton variant="rectangular" height={180} />
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  const name = personalInfo.nom || user?.name || session?.user?.name || "Artisan";
  const profile = user?.artisanProfile;
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleAddCert = () => {
    if (!newCert.name || !newCert.organisme) return;
    setCertifications((prev) => [
      ...prev,
      { ...newCert, id: `c${Date.now()}`, status: "valid", fichier: null },
    ]);
    setNewCert({ name: "", organisme: "", numero: "", dateObtention: "", dateExpiration: "" });
    setAddingCert(false);
    showSaved("certifications");
  };

  const handleAddAssurance = () => {
    if (!newAssurance.type || !newAssurance.compagnie) return;
    setAssurances((prev) => [
      ...prev,
      { ...newAssurance, id: `a${Date.now()}`, status: "valid", fichier: null },
    ]);
    setNewAssurance({ type: "", compagnie: "", numero: "", dateDebut: "", dateFin: "", montantGaranti: "" });
    setAddingAssurance(false);
    showSaved("assurances");
  };

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[28px] font-extrabold text-navy mb-6">Mon profil</h1>

      {/* Stats summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-[5px] p-5 border border-border border-l-[3px] border-l-forest">
          <div className="text-[13px] text-grayText mb-1">Note moyenne</div>
          <div className="font-heading text-xl font-extrabold text-navy">4.9 / 5</div>
          <div className="text-xs text-grayText mt-0.5">127 avis clients</div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border border-border border-l-[3px] border-l-sage">
          <div className="text-[13px] text-grayText mb-1">Missions réalisées</div>
          <div className="font-heading text-xl font-extrabold text-navy">342</div>
          <div className="text-xs text-grayText mt-0.5">Depuis votre inscription</div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border border-border border-l-[3px] border-l-gold">
          <div className="text-[13px] text-grayText mb-1">Certifications</div>
          <div className="font-heading text-xl font-extrabold text-navy">{certifications.length}</div>
          <div className="text-xs text-grayText mt-0.5">{certifications.filter(c => c.status === "valid").length} valides</div>
        </div>
        <div className="bg-white rounded-[5px] p-5 border border-border border-l-[3px] border-l-navy">
          <div className="text-[13px] text-grayText mb-1">Assurances</div>
          <div className="font-heading text-xl font-extrabold text-navy">{assurances.length}</div>
          <div className="text-xs text-grayText mt-0.5">{assurances.filter(a => a.status === "valid").length} à jour</div>
        </div>
      </div>

      {/* Avatar + identity */}
      <div className="bg-white rounded-[5px] p-5 border border-border mb-6">
        <div className="flex items-center gap-5">
          <div className="w-[80px] h-[80px] rounded-[5px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-heading text-2xl font-extrabold shrink-0 relative">
            {initials}
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-surface transition-colors">
              <Pencil className="w-3.5 h-3.5 text-forest" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-xl font-extrabold text-navy">{name}</div>
            <div className="text-[15px] text-grayText mt-1">
              {companyInfo.metier} -- Certifié Nova #2847
            </div>
            <div className="flex items-center gap-2 mt-2">
              {profile?.isVerified !== false && (
                <span className="inline-flex items-center gap-1 bg-forest/10 text-forest text-xs font-semibold rounded-[5px] px-2.5 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Certifié Nova
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-gold/10 text-gold text-xs font-semibold rounded-[5px] px-2.5 py-0.5">
                <Star className="w-3.5 h-3.5" /> Pro
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-column: Personal info + Company info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Personal info (editable) */}
        <div className="bg-white rounded-[5px] p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-[15px] font-bold text-navy">Informations personnelles</h2>
            {!editingPersonal ? (
              <button
                onClick={() => setEditingPersonal(true)}
                className="flex items-center gap-1 text-[13px] text-forest font-semibold hover:underline"
              >
                <Pencil className="w-3.5 h-3.5" /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingPersonal(false); showSaved("personal"); }}
                  className="flex items-center gap-1 text-[13px] text-success font-semibold hover:underline"
                >
                  <Check className="w-3.5 h-3.5" /> Enregistrer
                </button>
                <button
                  onClick={() => setEditingPersonal(false)}
                  className="flex items-center gap-1 text-[13px] text-grayText font-semibold hover:underline"
                >
                  <X className="w-3.5 h-3.5" /> Annuler
                </button>
              </div>
            )}
          </div>
          {saved === "personal" && (
            <div className="flex items-center gap-2 bg-success/10 text-success text-xs font-semibold rounded-[5px] px-3 py-2 mb-3">
              <Check className="w-4 h-4" /> Modifications enregistrées
            </div>
          )}
          <div className="space-y-3">
            {[
              { key: "nom", label: "Nom complet" },
              { key: "email", label: "Email" },
              { key: "telephone", label: "Téléphone" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-[13px] text-grayText mb-1 block">{f.label}</label>
                {editingPersonal ? (
                  <input
                    type={f.key === "email" ? "email" : "text"}
                    value={personalInfo[f.key as keyof typeof personalInfo]}
                    onChange={(e) => setPersonalInfo((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-[5px] border border-border bg-white text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest box-border"
                  />
                ) : (
                  <div className="text-[15px] font-semibold text-navy">
                    {personalInfo[f.key as keyof typeof personalInfo]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Company info (editable) */}
        <div className="bg-white rounded-[5px] p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-[15px] font-bold text-navy">Informations entreprise</h2>
            {!editingCompany ? (
              <button
                onClick={() => setEditingCompany(true)}
                className="flex items-center gap-1 text-[13px] text-forest font-semibold hover:underline"
              >
                <Pencil className="w-3.5 h-3.5" /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingCompany(false); showSaved("company"); }}
                  className="flex items-center gap-1 text-[13px] text-success font-semibold hover:underline"
                >
                  <Check className="w-3.5 h-3.5" /> Enregistrer
                </button>
                <button
                  onClick={() => setEditingCompany(false)}
                  className="flex items-center gap-1 text-[13px] text-grayText font-semibold hover:underline"
                >
                  <X className="w-3.5 h-3.5" /> Annuler
                </button>
              </div>
            )}
          </div>
          {saved === "company" && (
            <div className="flex items-center gap-2 bg-success/10 text-success text-xs font-semibold rounded-[5px] px-3 py-2 mb-3">
              <Check className="w-4 h-4" /> Modifications enregistrées
            </div>
          )}
          <div className="space-y-3">
            {[
              { key: "raisonSociale", label: "Raison sociale" },
              { key: "metier", label: "Métier / Spécialité" },
              { key: "siret", label: "SIRET" },
              { key: "tva", label: "N° TVA intracommunautaire" },
              { key: "adresse", label: "Adresse" },
              { key: "codeApe", label: "Code APE" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-[13px] text-grayText mb-1 block">{f.label}</label>
                {editingCompany ? (
                  <input
                    type="text"
                    value={companyInfo[f.key as keyof typeof companyInfo]}
                    onChange={(e) => setCompanyInfo((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-[5px] border border-border bg-white text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest box-border"
                  />
                ) : (
                  <div className="text-[15px] font-semibold text-navy">
                    {companyInfo[f.key as keyof typeof companyInfo]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-column: Certifications + Assurances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Certifications */}
        <div className="bg-white rounded-[5px] p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-forest" />
              <h2 className="font-heading text-[15px] font-bold text-navy">Certifications & Qualifications</h2>
            </div>
            <button
              onClick={() => setAddingCert(true)}
              className="flex items-center gap-1 text-[13px] text-forest font-semibold bg-forest/5 px-5 py-2.5 rounded-[5px] hover:bg-forest/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          {saved === "certifications" && (
            <div className="flex items-center gap-2 bg-success/10 text-success text-xs font-semibold rounded-[5px] px-3 py-2 mb-3">
              <Check className="w-4 h-4" /> Certification ajoutée
            </div>
          )}

          <div className="space-y-3">
            {certifications.map((cert) => {
              const st = statusConfig[cert.status];
              return (
                <div key={cert.id} className="border border-border rounded-[5px] p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[15px] font-bold text-navy">{cert.name}</div>
                      <div className="text-[13px] text-grayText">{cert.organisme}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-[5px]", st.color, st.bg)}>
                        {st.label}
                      </span>
                      <button
                        onClick={() => setCertifications((prev) => prev.filter((c) => c.id !== cert.id))}
                        className="p-1 rounded-[5px] hover:bg-red/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <span className="text-grayText">N° </span>
                      <span className="font-mono text-navy">{cert.numero}</span>
                    </div>
                    <div>
                      <span className="text-grayText">Valide jusqu&apos;au </span>
                      <span className="text-navy">{new Date(cert.dateExpiration).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  {cert.fichier && (
                    <div className="flex items-center gap-1.5 mt-2 text-[13px] text-forest font-medium">
                      <FileText className="w-3.5 h-3.5" /> {cert.fichier}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add certification form */}
          {addingCert && (
            <div className="mt-4 border-2 border-dashed border-forest/20 rounded-[5px] p-5">
              <h3 className="text-[15px] font-bold text-navy mb-3">Nouvelle certification</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Nom de la certification *</label>
                    <input
                      type="text" placeholder="Ex: RGE QualiPAC" value={newCert.name}
                      onChange={(e) => setNewCert((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Organisme *</label>
                    <input
                      type="text" placeholder="Ex: Qualit'EnR" value={newCert.organisme}
                      onChange={(e) => setNewCert((p) => ({ ...p, organisme: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] text-grayText mb-1 block">Numéro de certification</label>
                  <input
                    type="text" placeholder="Ex: RGE-PAC-2024-4521" value={newCert.numero}
                    onChange={(e) => setNewCert((p) => ({ ...p, numero: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Date d&apos;obtention</label>
                    <input
                      type="date" value={newCert.dateObtention}
                      onChange={(e) => setNewCert((p) => ({ ...p, dateObtention: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Date d&apos;expiration</label>
                    <input
                      type="date" value={newCert.dateExpiration}
                      onChange={(e) => setNewCert((p) => ({ ...p, dateExpiration: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                </div>
                <div className="border-2 border-dashed border-border rounded-[5px] p-5 text-center cursor-pointer hover:bg-surface transition-colors">
                  <Upload className="w-5 h-5 text-grayText mx-auto mb-1" />
                  <span className="text-[13px] text-grayText">Télécharger le justificatif (PDF, JPG)</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddCert} className="flex-1 px-5 py-2.5 rounded-[5px] bg-deepForest text-white text-sm font-bold hover:-translate-y-0.5 transition-all">
                    Ajouter
                  </button>
                  <button onClick={() => setAddingCert(false)} className="px-5 py-2.5 rounded-[5px] bg-surface text-navy text-sm font-semibold">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assurances */}
        <div className="bg-white rounded-[5px] p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-forest" />
              <h2 className="font-heading text-[15px] font-bold text-navy">Assurances</h2>
            </div>
            <button
              onClick={() => setAddingAssurance(true)}
              className="flex items-center gap-1 text-[13px] text-forest font-semibold bg-forest/5 px-5 py-2.5 rounded-[5px] hover:bg-forest/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          {saved === "assurances" && (
            <div className="flex items-center gap-2 bg-success/10 text-success text-xs font-semibold rounded-[5px] px-3 py-2 mb-3">
              <Check className="w-4 h-4" /> Assurance ajoutée
            </div>
          )}

          {/* Required notice */}
          <div className="flex items-center gap-2 bg-gold/10 rounded-[5px] px-3 py-3 mb-4">
            <AlertCircle className="w-5 h-5 text-gold shrink-0" />
            <span className="text-[13px] text-gold font-medium">
              La décennale et la RC Pro sont obligatoires pour exercer sur Nova
            </span>
          </div>

          <div className="space-y-3">
            {assurances.map((assur) => {
              const st = statusConfig[assur.status];
              return (
                <div key={assur.id} className="border border-border rounded-[5px] p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-navy">{assur.type}</span>
                        {(assur.type === "Décennale" || assur.type === "Responsabilité Civile Pro") && (
                          <span className="text-[10px] font-bold text-red bg-red/10 px-1.5 py-0.5 rounded-[5px]">OBLIGATOIRE</span>
                        )}
                      </div>
                      <div className="text-[13px] text-grayText">{assur.compagnie}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-[5px]", st.color, st.bg)}>
                        {st.label}
                      </span>
                      <button
                        onClick={() => setAssurances((prev) => prev.filter((a) => a.id !== assur.id))}
                        className="p-1 rounded-[5px] hover:bg-red/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <span className="text-grayText">N° police </span>
                      <span className="font-mono text-navy">{assur.numero}</span>
                    </div>
                    <div>
                      <span className="text-grayText">Montant garanti </span>
                      <span className="font-mono text-navy">{assur.montantGaranti}</span>
                    </div>
                    <div>
                      <span className="text-grayText">Du </span>
                      <span className="text-navy">{new Date(assur.dateDebut).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div>
                      <span className="text-grayText">Au </span>
                      <span className="text-navy">{new Date(assur.dateFin).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  {assur.fichier ? (
                    <div className="flex items-center gap-1.5 mt-2 text-[13px] text-forest font-medium">
                      <FileText className="w-3.5 h-3.5" /> {assur.fichier}
                    </div>
                  ) : (
                    <button className="flex items-center gap-1.5 mt-2 text-[13px] text-gold font-medium hover:underline">
                      <Upload className="w-3.5 h-3.5" /> Ajouter le justificatif
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add assurance form */}
          {addingAssurance && (
            <div className="mt-4 border-2 border-dashed border-forest/20 rounded-[5px] p-5">
              <h3 className="text-[15px] font-bold text-navy mb-3">Nouvelle assurance</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Type d&apos;assurance *</label>
                    <select
                      value={newAssurance.type}
                      onChange={(e) => setNewAssurance((p) => ({ ...p, type: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white box-border"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Décennale">Décennale</option>
                      <option value="Responsabilité Civile Pro">Responsabilité Civile Pro</option>
                      <option value="Protection juridique">Protection juridique</option>
                      <option value="Multirisque pro">Multirisque pro</option>
                      <option value="Garantie de bon fonctionnement">Garantie de bon fonctionnement</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Compagnie d&apos;assurance *</label>
                    <input
                      type="text" placeholder="Ex: AXA Entreprises" value={newAssurance.compagnie}
                      onChange={(e) => setNewAssurance((p) => ({ ...p, compagnie: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">N° de police</label>
                    <input
                      type="text" placeholder="Ex: DEC-2024-78901" value={newAssurance.numero}
                      onChange={(e) => setNewAssurance((p) => ({ ...p, numero: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Montant garanti</label>
                    <input
                      type="text" placeholder="Ex: 10 000 000 €" value={newAssurance.montantGaranti}
                      onChange={(e) => setNewAssurance((p) => ({ ...p, montantGaranti: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Date de début</label>
                    <input
                      type="date" value={newAssurance.dateDebut}
                      onChange={(e) => setNewAssurance((p) => ({ ...p, dateDebut: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] text-grayText mb-1 block">Date de fin</label>
                    <input
                      type="date" value={newAssurance.dateFin}
                      onChange={(e) => setNewAssurance((p) => ({ ...p, dateFin: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-[5px] border border-border text-[15px] text-navy focus:outline-none focus:ring-2 focus:ring-forest/30 box-border"
                    />
                  </div>
                </div>
                <div className="border-2 border-dashed border-border rounded-[5px] p-5 text-center cursor-pointer hover:bg-surface transition-colors">
                  <Upload className="w-5 h-5 text-grayText mx-auto mb-1" />
                  <span className="text-[13px] text-grayText">Télécharger l&apos;attestation (PDF, JPG)</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddAssurance} className="flex-1 px-5 py-2.5 rounded-[5px] bg-deepForest text-white text-sm font-bold hover:-translate-y-0.5 transition-all">
                    Ajouter
                  </button>
                  <button onClick={() => setAddingAssurance(false)} className="px-5 py-2.5 rounded-[5px] bg-surface text-navy text-sm font-semibold">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation menu */}
      <div className="bg-white rounded-[5px] border border-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3.5 px-5 py-4 hover:bg-surface transition-colors border-b border-border md:odd:border-r"
              >
                <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${item.highlight ? "text-gold" : "text-forest"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-navy flex items-center gap-1.5">
                    {item.label}
                    {item.highlight && (
                      <span className="text-[11px] font-bold text-gold">20 EUR</span>
                    )}
                  </div>
                  {item.sub && (
                    <div className="text-[13px] text-grayText mt-0.5">{item.sub}</div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-grayText shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
