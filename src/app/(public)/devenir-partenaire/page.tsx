"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, Check, ChevronDown, ArrowRight, X, Plus } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* ━━━ FAQ DATA ━━━ */
const faqItems = [
  { q: "Combien ça coûte ?", a: "L'inscription est gratuite. Votre 1er mois, vous bénéficiez du forfait Expert offert : seulement 5% de commission au lieu de 10-15%. Ensuite, elle passe à 10-15%. Pas d'abonnement obligatoire." },
  { q: "Comment fonctionne le séquestre ?", a: "Quand un client vous réserve, il paie immédiatement sur un compte sécurisé géré par un prestataire agréé. Vous intervenez. Nova vérifie que tout est OK. Les fonds sont virés sur votre compte sous 48h." },
  { q: "Comment fonctionne la gestion des interventions ?", a: "Chaque intervention est enregistrée avec tous les détails : date, client, montant, statut. Vous pouvez exporter l'historique complet en CSV ou PDF, télécharger vos factures individuellement ou par lot, et générer un récapitulatif mensuel pour votre comptable." },
  { q: "Et si le client conteste ?", a: "Nova arbitre avec les preuves : photos avant/après, devis signé numériquement, horodatage de l'intervention. Vous n'êtes plus seul face au litige. 97% des artisans sont payés intégralement après examen." },
  { q: "C'est quoi les partenariats syndics ?", a: "Nova signe des partenariats avec des syndics de copropriété et gestionnaires immobiliers. En tant qu'artisan certifié, vous êtes automatiquement proposé pour les interventions dans leurs immeubles. C'est un carnet de commandes récurrent sans prospection." },
  { q: "Le badge Certifié, je peux l'utiliser ailleurs ?", a: "Oui. Le badge Certifié Nova est utilisable sur vos devis, cartes de visite, véhicule et signature email. Il renforce votre crédibilité auprès de tous vos clients, même ceux trouvés hors plateforme." },
  { q: "Quels documents dois-je fournir ?", a: "SIRET actif, attestation d'assurance décennale en cours de validité, et pièce d'identité. Documents facultatifs : RGE, Qualibat, Kbis. Le processus de vérification prend 48-72h." },
  { q: "Je peux recevoir des urgences ?", a: "Oui. Activez le mode 'Urgences' dans votre profil et définissez vos créneaux de disponibilité. Les urgences sont majorées de 15 à 25%, et les clients ont déjà payé avant de vous appeler." },
  { q: "Comment sont calculés les avis ?", a: "Seuls les clients ayant finalisé et validé une mission via Nova peuvent laisser un avis. Impossible de tricher — chaque avis est lié à une mission réelle et un paiement séquestre." },
];

/* ━━━ SIGNUP MODAL ━━━ */
function SignupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [metier, setMetier] = useState("");
  const [city, setCity] = useState("");
  const [siret, setSiret] = useState("");
  const [cgu, setCgu] = useState(false);
  const [docs, setDocs] = useState<Record<string, boolean>>({ siret: false, decennale: false, identite: false, rge: false, qualibat: false, kbis: false });

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const uploadedRequired = [docs.siret, docs.decennale, docs.identite].filter(Boolean).length;
  const allRequiredDocs = docs.siret && docs.decennale && docs.identite;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideUp" onClick={(e) => e.stopPropagation()}>

        {/* ── Step 0: Email + Password ── */}
        {step === 0 && (
          <div className="p-6 md:p-9">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-heading text-[22px] md:text-[26px] font-extrabold text-navy mb-1">Créer votre compte artisan</h2>
                <p className="font-body text-[13px] text-grayText">Gratuit — 1er mois du forfait Expert offert</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-grayText hover:text-navy transition-colors shrink-0">
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Offer banner */}
            <div className="flex items-center gap-2 bg-surface rounded-[10px] px-3.5 py-2.5 mb-5">
              <span className="text-base">🎁</span>
              <div>
                <div className="font-body text-xs font-semibold text-forest">1 mois du forfait Expert offert</div>
                <div className="font-body text-[10px] text-grayText">Commission à 5% au lieu de 10-15% — offert à l&apos;inscription</div>
              </div>
            </div>

            <div className="mb-3.5">
              <label className="font-body text-xs font-semibold text-grayText mb-1.5 block">Email professionnel</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bgPage text-sm font-body text-navy focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
              />
            </div>
            <div className="mb-3.5">
              <label className="font-body text-xs font-semibold text-grayText mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-bgPage text-sm font-body text-navy focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-grayText">
                  {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {password && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={cn("flex-1 h-[3px] rounded-full transition-all", i * 3 <= password.length ? (password.length >= 10 ? "bg-success" : "bg-gold") : "bg-border")} />
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={!email.includes("@") || password.length < 8}
              onClick={() => setStep(1)}
              className={cn(
                "w-full py-3.5 rounded-xl border-none text-[15px] font-bold font-heading flex items-center justify-center gap-2 transition-all",
                email.includes("@") && password.length >= 8 ? "bg-deepForest text-white cursor-pointer hover:-translate-y-0.5" : "bg-border text-grayText cursor-default"
              )}
            >
              Continuer <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className={cn("h-1 rounded-full", i === 0 ? "w-5 bg-forest" : "w-2 bg-border")} />)}
            </div>
          </div>
        )}

        {/* ── Step 1: Informations ── */}
        {step === 1 && (
          <div className="p-6 md:p-9 animate-fadeIn">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setStep(0)} className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-grayText hover:text-navy transition-colors shrink-0">
                <ChevronDown className="w-3.5 h-3.5 rotate-90" />
              </button>
              <h2 className="font-heading text-xl md:text-2xl font-extrabold text-navy">Vos informations</h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-0">
              <div className="mb-3.5">
                <label className="font-body text-xs font-semibold text-grayText mb-1.5 block">Prénom</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bgPage text-sm font-body text-navy focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" />
              </div>
              <div className="mb-3.5">
                <label className="font-body text-xs font-semibold text-grayText mb-1.5 block">Nom</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bgPage text-sm font-body text-navy focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" />
              </div>
            </div>

            <div className="mb-3.5">
              <label className="font-body text-xs font-semibold text-grayText mb-1.5 block">Téléphone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bgPage text-sm font-body text-navy focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" />
            </div>

            <div className="mb-3.5">
              <label className="font-body text-xs font-semibold text-grayText mb-1.5 block">Métier</label>
              <select value={metier} onChange={(e) => setMetier(e.target.value)}
                className={cn("w-full px-4 py-3 rounded-xl border border-border bg-bgPage text-sm font-body appearance-none focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10", metier ? "text-navy" : "text-grayText")}>
                <option value="">Sélectionner votre métier</option>
                {["Plombier", "Électricien", "Serrurier", "Chauffagiste", "Peintre", "Maçon", "Autre"].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-0">
              <div className="mb-3.5">
                <label className="font-body text-xs font-semibold text-grayText mb-1.5 block">Ville</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris, Lyon..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bgPage text-sm font-body text-navy focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" />
              </div>
              <div className="mb-3.5">
                <label className="font-body text-xs font-semibold text-grayText mb-1.5 block">N° SIRET</label>
                <input value={siret} onChange={(e) => setSiret(e.target.value)} placeholder="123 456 789 00012"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bgPage text-sm font-body text-navy focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" />
              </div>
            </div>

            {/* CGU */}
            <div className="flex items-start gap-2.5 mb-5 mt-1">
              <div
                onClick={() => setCgu(!cgu)}
                className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer shrink-0 mt-0.5 transition-all",
                  cgu ? "border-forest bg-forest" : "border-border bg-white")}
              >
                {cgu && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="font-body text-[11px] text-grayText leading-relaxed">
                J&apos;accepte les <span className="text-forest font-semibold">Conditions Générales</span> et la <span className="text-forest font-semibold">Politique de Confidentialité</span>
              </span>
            </div>

            <button
              disabled={!firstName || !lastName || !phone || !metier || !city || !siret || !cgu}
              onClick={() => setStep(2)}
              className={cn(
                "w-full py-3.5 rounded-xl border-none text-[15px] font-bold font-heading transition-all",
                firstName && lastName && phone && metier && city && siret && cgu ? "bg-deepForest text-white cursor-pointer hover:-translate-y-0.5" : "bg-border text-grayText cursor-default"
              )}
            >
              Continuer
            </button>

            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className={cn("h-1 rounded-full", i <= 1 ? "w-5 bg-forest" : "w-2 bg-border")} />)}
            </div>
          </div>
        )}

        {/* ── Step 2: Documents ── */}
        {step === 2 && (
          <div className="p-6 md:p-9 animate-fadeIn">
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => setStep(1)} className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-grayText hover:text-navy transition-colors shrink-0">
                <ChevronDown className="w-3.5 h-3.5 rotate-90" />
              </button>
              <div>
                <h2 className="font-heading text-xl md:text-2xl font-extrabold text-navy">Vos documents</h2>
                <p className="font-body text-xs text-grayText">Nécessaires pour la vérification de votre profil</p>
              </div>
            </div>

            {/* Obligatoires */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red" />
                <span className="font-body text-xs font-bold text-navy">Documents obligatoires</span>
              </div>
              {[
                { key: "siret", label: "Extrait SIRET / Avis de situation INSEE", desc: "Justificatif d'immatriculation de votre entreprise" },
                { key: "decennale", label: "Attestation d'assurance décennale", desc: "En cours de validité — document émis par votre assureur" },
                { key: "identite", label: "Pièce d'identité", desc: "CNI, passeport ou titre de séjour en cours de validité" },
              ].map((doc) => (
                <button
                  key={doc.key}
                  onClick={() => setDocs((d) => ({ ...d, [doc.key]: !d[doc.key] }))}
                  className={cn(
                    "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] border-[1.5px] text-left transition-all mb-2",
                    docs[doc.key] ? "border-forest bg-surface" : "border-border bg-bgPage"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-all",
                    docs[doc.key] ? "bg-forest" : "bg-white border-[1.5px] border-dashed border-border"
                  )}>
                    {docs[doc.key] ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-[18px] h-[18px] text-grayText" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-[13px] font-semibold text-navy">{doc.label}</div>
                    <div className="font-body text-[11px] text-grayText leading-snug">{doc.desc}</div>
                    <div className="font-mono text-[9px] text-grayText mt-0.5">PDF, JPG — max 5 Mo</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Facultatifs */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-grayText" />
                <span className="font-body text-xs font-bold text-navy">Documents facultatifs</span>
                <span className="font-body text-[10px] text-grayText">— accélèrent la vérification</span>
              </div>
              {[
                { key: "rge", label: "Certification RGE", desc: "Si vous intervenez en rénovation énergétique" },
                { key: "qualibat", label: "Certification Qualibat", desc: "Certification de qualification professionnelle" },
                { key: "kbis", label: "Extrait Kbis", desc: "Moins de 3 mois — pour les sociétés (SARL, SAS...)" },
              ].map((doc) => (
                <button
                  key={doc.key}
                  onClick={() => setDocs((d) => ({ ...d, [doc.key]: !d[doc.key] }))}
                  className={cn(
                    "w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] border-[1.5px] text-left transition-all mb-2",
                    docs[doc.key] ? "border-forest bg-surface" : "border-border bg-white"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all",
                    docs[doc.key] ? "bg-forest" : "bg-white border-[1.5px] border-dashed border-border"
                  )}>
                    {docs[doc.key] ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-4 h-4 text-border" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-xs font-semibold text-navy">{doc.label}</div>
                    <div className="font-body text-[10px] text-grayText">{doc.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2.5 bg-bgPage rounded-[10px] px-3.5 py-2.5 mb-5">
              <span className={cn("font-mono text-[13px] font-bold", allRequiredDocs ? "text-success" : "text-gold")}>{uploadedRequired}/3</span>
              <div className="flex-1">
                <div className="font-body text-[11px] font-semibold text-navy">
                  {allRequiredDocs ? "Tous les documents obligatoires sont prêts" : "Documents obligatoires requis"}
                </div>
                <div className="h-[3px] rounded-full bg-border mt-1">
                  <div className={cn("h-[3px] rounded-full transition-all", allRequiredDocs ? "bg-success" : "bg-gold")} style={{ width: `${(uploadedRequired / 3) * 100}%` }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className={cn(
                "w-full py-3.5 rounded-xl border-none text-[15px] font-bold font-heading transition-all",
                allRequiredDocs ? "bg-deepForest text-white cursor-pointer hover:-translate-y-0.5" : "bg-border text-grayText cursor-default"
              )}
              disabled={!allRequiredDocs}
            >
              Créer mon compte artisan
            </button>
            <button onClick={() => setStep(3)} className="w-full text-center py-2.5 text-xs font-body text-grayText hover:underline mt-2">
              Envoyer les documents plus tard
            </button>

            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className={cn("h-1 rounded-full", i <= 2 ? "w-5 bg-forest" : "w-2 bg-border")} />)}
            </div>
          </div>
        )}

        {/* ── Step 3: Confirmation ── */}
        {step === 3 && (
          <div className="p-6 md:p-9 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-[20px] bg-surface flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-forest" />
            </div>
            <h2 className="font-heading text-[22px] md:text-[26px] font-extrabold text-navy mb-1.5">
              Bienvenue{firstName ? `, ${firstName}` : ""} !
            </h2>
            <p className="font-body text-sm text-grayText leading-relaxed mb-6">
              {allRequiredDocs
                ? "Votre compte et vos documents ont été envoyés. Voici la suite :"
                : "Votre inscription est enregistrée. Envoyez vos documents pour accélérer la vérification."}
            </p>

            {/* Timeline */}
            <div className="text-left max-w-[320px] mx-auto mb-6">
              {[
                { label: "Inscription", desc: "C'est fait !", done: true },
                { label: "Documents envoyés", desc: allRequiredDocs ? `${Object.values(docs).filter(Boolean).length} documents transmis` : "À compléter par email", done: allRequiredDocs },
                { label: "Vérification Nova", desc: "Notre équipe vérifie — 48 à 72h", done: false },
                { label: "Premier client", desc: "Demandes dans votre zone", done: false },
              ].map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center w-6">
                    <div className={cn(
                      "w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0",
                      s.done ? "bg-forest" : "bg-surface border-2 border-border"
                    )}>
                      {s.done ? <Check className="w-2.5 h-2.5 text-white" /> : <span className="font-mono text-[9px] font-bold text-grayText">{i + 1}</span>}
                    </div>
                    {i < 3 && <div className={cn("w-0.5 h-7", s.done ? "bg-forest" : "bg-border")} />}
                  </div>
                  <div className={cn("pb-3 pt-px", i >= 3 && "pb-0")}>
                    <div className={cn("font-heading text-xs font-bold", s.done ? "text-forest" : "text-navy")}>{s.label}</div>
                    <div className="font-body text-[11px] text-grayText">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-1.5 justify-center flex-wrap mb-5">
              {["1er mois Expert offert", "Paiement garanti", "0% d'impayés"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-lg bg-surface text-[11px] font-semibold text-forest">{t}</span>
              ))}
            </div>

            <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-deepForest text-white text-[15px] font-bold font-heading cursor-pointer hover:-translate-y-0.5 transition-all">
              {allRequiredDocs ? "C'est compris" : "Fermer — j'enverrai mes documents par email"}
            </button>
            <p className="font-body text-[11px] text-grayText mt-3">Un email avec les instructions a été envoyé à {email}</p>

            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className="w-5 h-1 rounded-full bg-forest" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━ PAGE ━━━ */
export default function DevenirPartenairePage() {
  const [showModal, setShowModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [simCA, setSimCA] = useState(4820);
  const [simPlan, setSimPlan] = useState<"essentiel" | "pro" | "expert">("pro");

  /* Simulator calculations */
  const plans = { essentiel: { abo: 0, rate: 0.10 }, pro: { abo: 49, rate: 0.07 }, expert: { abo: 99, rate: 0.05 } };
  const costEssentiel = simCA * plans.essentiel.rate;
  const selected = plans[simPlan];
  const costSelected = simCA * selected.rate + selected.abo;
  const saving = costEssentiel - costSelected;
  const savingAnnual = saving * 12;
  const isProfitable = saving > 0;
  const seuilPro = Math.ceil(49 / 0.03);
  const seuilExpert = Math.ceil(99 / 0.05);
  const seuil = simPlan === "pro" ? seuilPro : simPlan === "expert" ? seuilExpert : 0;

  return (
    <>
      {/* ━━━ HERO ━━━ */}
      <section className="relative overflow-hidden bg-bgPage pt-16 md:pt-24 pb-10 md:pb-20 px-5 md:px-[5%]">
        {/* Decorative background */}
        <div className="absolute -top-[10%] -right-[5%] w-[50%] h-[80%] bg-[radial-gradient(ellipse,rgba(27,107,78,0.07),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-[15%] -left-[8%] w-[40%] h-[60%] bg-[radial-gradient(ellipse,rgba(45,155,110,0.05),transparent_70%)] pointer-events-none" />
        <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #1B6B4E 1px, transparent 0)", backgroundSize: "36px 36px" }} />

        <div className="max-w-[720px] mx-auto text-center relative z-10">
          {/* Badges */}
          <div className="flex gap-2 justify-center flex-wrap mb-3 md:mb-3.5">
            <div className="inline-flex items-center gap-1.5 bg-surface rounded-full px-3.5 py-1 md:py-1.5">
              <Lock className="w-3.5 h-3.5 text-forest" />
              <span className="font-mono text-[11px] font-semibold text-forest">Paiement garanti</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white rounded-full px-3.5 py-1 md:py-1.5 border border-border">
              <span className="font-heading text-[13px] font-extrabold text-forest">0%</span>
              <span className="font-mono text-[11px] font-semibold text-grayText">d&apos;impayés</span>
            </div>
          </div>

          {/* Offer banner */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-br from-deepForest to-forest rounded-[10px] px-4 py-[7px] mb-4 md:mb-5">
            <span className="text-sm">🎁</span>
            <span className="font-body text-xs font-semibold text-white">1 mois du forfait Expert offert</span>
          </div>

          {/* H1 */}
          <h1 className="font-heading text-[26px] md:text-[50px] font-extrabold text-navy leading-[1.1] tracking-tight mb-3 md:mb-4">
            Zéro impayé.{" "}<span className="hidden md:inline"><br /></span>Vos clients{" "}<span className="text-forest">paient avant.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-sm md:text-lg text-grayText leading-relaxed max-w-[520px] mx-auto mb-5 md:mb-7">
            Nova est la plateforme artisan qui bloque le paiement du client en séquestre <strong className="text-navy">avant votre intervention</strong>. Vous intervenez sereinement. On valide. Vous êtes payé sous 48h.
          </p>

          {/* Friction killers — desktop only */}
          <div className="hidden md:flex gap-5 justify-center flex-wrap mb-7">
            {["Inscription gratuite", "Sans engagement", "Paiement sous 48h", "30 secondes"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-forest" />
                <span className="font-body text-[11px] text-grayText font-medium">{t}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2.5 md:gap-3 justify-center flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="px-7 md:px-9 py-3.5 md:py-4 rounded-[14px] bg-deepForest text-white text-sm md:text-base font-extrabold font-heading inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
            >
              S&apos;inscrire gratuitement <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => document.getElementById("simulateur")?.scrollIntoView({ behavior: "smooth" })}
              className="px-5 md:px-7 py-3.5 md:py-4 rounded-[14px] bg-white text-navy text-[13px] md:text-[15px] font-semibold font-body border border-border hover:-translate-y-0.5 transition-all"
            >
              Simuler mes économies
            </button>
          </div>

          {/* Bottom friction line */}
          <div className="flex justify-center gap-1.5 mt-2.5 md:mt-3.5">
            <span className="font-mono text-[10px] md:text-[11px] text-grayText">30 secondes &middot;</span>
            <span className="font-mono text-[10px] md:text-[11px] text-grayText">Sans carte bancaire &middot;</span>
            <span className="font-mono text-[10px] md:text-[11px] text-grayText">Sans engagement</span>
          </div>
        </div>
      </section>

      {/* ━━━ BEFORE / AFTER ━━━ */}
      <section className="px-5 md:px-[5%] py-12 md:py-[72px] bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-7 md:mb-10">
            <div className="font-mono text-xs text-forest tracking-[2px] uppercase mb-2.5">Comparatif</div>
            <h2 className="font-heading text-2xl md:text-[34px] font-extrabold text-navy leading-tight">Votre quotidien, transformé.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-[0_12px_48px_rgba(10,64,48,0.06)] border border-border">
            {/* SANS NOVA */}
            <div className="relative bg-[#FFFBFB] p-6 md:p-8 md:border-r border-b md:border-b-0 border-border">
              {/* Accent bar */}
              <div className="absolute top-0 left-0 md:w-1 w-full h-1 md:h-full bg-gradient-to-b from-red to-[#F5841F]" />

              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-red shadow-[0_0_8px_rgba(232,48,42,0.3)]" />
                <span className="font-mono text-[11px] font-bold text-red tracking-[1.5px] uppercase">Sans Nova</span>
              </div>

              {[
                { metric: "12%", label: "de factures impayées", desc: "Vous travaillez mais l'argent ne vient pas" },
                { metric: "6h", label: "de paperasse / semaine", desc: "Devis Word, relances, comptabilité manuelle" },
                { metric: "0€", label: "garantie de paiement", desc: "Vous faites confiance. Parfois ça passe, parfois non" },
                { metric: "3 mois", label: "de trésorerie instable", desc: "Certains mois c'est plein, d'autres c'est vide" },
              ].map((item, i) => (
                <div key={i} className={cn("flex gap-3.5 items-start", i < 3 && "mb-4")}>
                  <div className="font-mono text-xl font-extrabold text-red min-w-[52px] text-right leading-none">{item.metric}</div>
                  <div>
                    <div className="font-body text-[13px] font-bold text-navy">{item.label}</div>
                    <div className="font-body text-[11px] text-grayText leading-snug">{item.desc}</div>
                  </div>
                </div>
              ))}

              <div className="mt-5 pt-4 border-t border-[#F0E0E0]">
                <div className="flex items-center gap-2 bg-red/10 rounded-[10px] px-3.5 py-2.5">
                  <X className="w-3.5 h-3.5 text-red shrink-0" />
                  <span className="font-body text-xs font-semibold text-red">Résultat : stress, impayés, perte de temps</span>
                </div>
              </div>
            </div>

            {/* AVEC NOVA */}
            <div className="relative bg-bgPage p-6 md:p-8">
              {/* Accent bar */}
              <div className="absolute top-0 right-0 md:w-1 w-full h-1 md:h-full bg-gradient-to-b from-forest to-success" />

              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,200,138,0.3)]" />
                <span className="font-mono text-[11px] font-bold text-forest tracking-[1.5px] uppercase">Avec Nova</span>
              </div>

              {[
                { metric: "0%", label: "d'impayés", desc: "Le client paie avant. Argent bloqué en séquestre" },
                { metric: "1h", label: "de gestion / semaine", desc: "Devis auto, factures générées, export comptable en 1 clic" },
                { metric: "48h", label: "pour être payé", desc: "Nova valide, vous recevez le virement" },
                { metric: "+40%", label: "de clients en plus", desc: "Visibilité boostée, urgences rémunérées, partenariats syndics" },
              ].map((item, i) => (
                <div key={i} className={cn("flex gap-3.5 items-start", i < 3 && "mb-4")}>
                  <div className="font-mono text-xl font-extrabold text-forest min-w-[52px] text-right leading-none">{item.metric}</div>
                  <div>
                    <div className="font-body text-[13px] font-bold text-navy">{item.label}</div>
                    <div className="font-body text-[11px] text-grayText leading-snug">{item.desc}</div>
                  </div>
                </div>
              ))}

              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center gap-2 bg-surface rounded-[10px] px-3.5 py-2.5">
                  <Check className="w-3.5 h-3.5 text-forest shrink-0" />
                  <span className="font-body text-xs font-semibold text-forest">Résultat : sérénité, revenus garantis, temps libéré</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 3 KEY ADVANTAGES ━━━ */}
      <section className="px-5 md:px-[5%] py-12 md:py-[72px] bg-bgPage">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-heading text-[22px] md:text-[30px] font-extrabold text-navy text-center mb-2">
            Ce que vous ne trouverez nulle part ailleurs
          </h2>
          <p className="text-[13px] md:text-[15px] text-grayText text-center mb-9">
            Trois avantages concrets qui changent votre quotidien d&apos;artisan.
          </p>

          {/* Card 1 — Gestion */}
          <div className="bg-white rounded-[20px] p-6 md:p-7 md:px-7 border border-forest/[0.06] mb-4 flex flex-col md:flex-row gap-4 md:gap-7 items-start md:items-center">
            <div className="w-14 md:w-16 h-14 md:h-16 rounded-[18px] bg-surface flex items-center justify-center shrink-0">
              <span className="font-mono text-xs md:text-sm font-bold text-forest">PDF</span>
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-[17px] md:text-[19px] font-bold text-navy mb-1.5">
                Gestion des interventions et comptabilité
              </h3>
              <p className="text-sm text-grayText leading-relaxed mb-3.5">
                Toutes vos interventions sont enregistrées et accessibles à tout moment. Exportez votre historique, vos factures et vos devis en PDF ou CSV en un clic. Générez un récapitulatif mensuel avec le détail des revenus et commissions — prêt à envoyer à votre comptable.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Export PDF / CSV", "Récapitulatif mensuel", "Factures conformes", "Historique complet"].map((tag) => (
                  <div key={tag} className="flex items-center gap-1.5 bg-surface rounded-lg px-3 py-1">
                    <Check className="w-2.5 h-2.5 text-forest" />
                    <span className="text-xs font-semibold text-forest">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2 — Protection (DARK) */}
          <div className="bg-deepForest rounded-[20px] p-6 md:p-7 md:px-7 mb-4 flex flex-col md:flex-row gap-4 md:gap-7 items-start md:items-center">
            <div className="w-14 md:w-16 h-14 md:h-16 rounded-[18px] bg-white/10 flex items-center justify-center shrink-0">
              <Shield className="w-[26px] md:w-[30px] h-[26px] md:h-[30px] text-lightSage" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-[17px] md:text-[19px] font-bold text-white mb-1.5">
                Protégé en cas de litige
              </h3>
              <p className="text-sm text-white/75 leading-relaxed">
                Un client mécontent qui conteste ? Vous n&apos;êtes plus seul. Nova arbitre chaque litige avec des preuves : devis signé, photos avant/après, horodatage de l&apos;intervention. Si votre travail est conforme, vous êtes payé intégralement. En cas de désaccord, notre équipe tranche sous 48h. Vous vous concentrez sur votre métier, on gère le reste.
              </p>
              <div className="mt-3.5 inline-block bg-white/[0.08] rounded-[10px] px-3.5 py-2.5">
                <span className="font-mono text-sm md:text-base font-bold text-lightSage">97% des artisans payés</span>
                <span className="text-xs text-white/50 ml-2">après examen de litige</span>
              </div>
            </div>
          </div>

          {/* Card 3 — Syndics */}
          <div className="bg-white rounded-[20px] p-6 md:p-7 md:px-7 border border-forest/[0.06] flex flex-col md:flex-row gap-4 md:gap-7 items-start md:items-center">
            <div className="w-14 md:w-16 h-14 md:h-16 rounded-[18px] bg-surface flex items-center justify-center shrink-0">
              <span className="font-mono text-lg md:text-[22px] font-bold text-forest">B2B</span>
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-[17px] md:text-[19px] font-bold text-navy mb-1.5">
                Accès aux marchés syndics et copropriétés
              </h3>
              <p className="text-sm text-grayText leading-relaxed">
                Les syndics et gestionnaires immobiliers ont besoin d&apos;artisans fiables en continu, mais ne savent pas où les trouver. Nova noue des partenariats B2B et vous donne accès à un carnet de commandes récurrent. Un seul partenariat syndic peut vous apporter 5 à 10 interventions régulières par mois, sans aucune prospection de votre part.
              </p>
              <div className="flex gap-3 md:gap-5 mt-3.5">
                {[["Interventions/syndic", "5-10/mois"], ["Prospection", "Zéro"]].map(([label, val]) => (
                  <div key={label}>
                    <div className="text-[11px] text-grayText mb-0.5">{label}</div>
                    <div className="font-mono text-base md:text-lg font-bold text-forest">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SIMULATOR ━━━ */}
      <section id="simulateur" className="px-5 md:px-[5%] py-12 md:py-20 bg-white scroll-mt-16">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-7 md:mb-10">
            <div className="font-mono text-xs text-forest tracking-[2px] uppercase mb-2.5">Simulateur</div>
            <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-navy mb-2.5">Combien allez-vous économiser ?</h2>
            <p className="text-sm md:text-base text-grayText max-w-[540px] mx-auto">Entrez votre chiffre d&apos;affaires mensuel pour voir l&apos;économie réelle avec nos plans premium.</p>
          </div>

          <div className="bg-bgPage rounded-[20px] p-6 md:p-9 border border-border">
            {/* CA Input */}
            <div className="mb-7">
              <div className="font-body text-[13px] font-semibold text-grayText mb-2.5">Votre chiffre d&apos;affaires mensuel sur Nova</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="range" min="500" max="15000" step="100" value={simCA}
                    onChange={(e) => setSimCA(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none"
                    style={{ background: `linear-gradient(to right, #1B6B4E ${((simCA - 500) / 14500) * 100}%, #D4EBE0 0%)` }}
                  />
                </div>
                <div className="flex items-center bg-white rounded-[10px] border border-border px-3.5 py-2 min-w-[130px]">
                  <input
                    type="number" value={simCA}
                    onChange={(e) => setSimCA(Math.max(0, Math.min(50000, Number(e.target.value) || 0)))}
                    className="border-none bg-transparent font-mono text-[22px] font-bold text-navy w-20 outline-none text-right"
                  />
                  <span className="font-mono text-lg text-grayText ml-1">€</span>
                </div>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="font-mono text-[10px] text-grayText">500 €</span>
                <span className="font-mono text-[10px] text-grayText">15 000 €</span>
              </div>
            </div>

            {/* Plan selector */}
            <div className="flex gap-2 md:gap-3 mb-7">
              {([
                { key: "essentiel" as const, label: "Essentiel", price: "Gratuit", commission: "10%", desc: "Plan standard" },
                { key: "pro" as const, label: "Pro", price: "49€/mois", commission: "7%", desc: "Le plus populaire" },
                { key: "expert" as const, label: "Expert", price: "99€/mois", commission: "5%", desc: "Maximum d'économies" },
              ]).map((plan) => {
                const active = simPlan === plan.key;
                return (
                  <div
                    key={plan.key}
                    onClick={() => setSimPlan(plan.key)}
                    className={cn(
                      "flex-1 p-3.5 md:p-[18px] md:px-5 rounded-[14px] cursor-pointer transition-all border-2",
                      active ? "border-forest bg-surface" : "border-border bg-white"
                    )}
                  >
                    <div className={cn("font-heading text-sm md:text-base font-bold", active ? "text-deepForest" : "text-navy")}>{plan.label}</div>
                    <div className="font-mono text-xs md:text-sm font-semibold text-forest mt-1">{plan.price}</div>
                    <div className="font-body text-[11px] text-grayText mt-1">Commission {plan.commission}</div>
                    {plan.key === "pro" && (
                      <div className="inline-block mt-1.5 px-2 py-0.5 rounded bg-border text-[10px] font-bold text-forest">Recommandé</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Results */}
            {/* Comparison boxes */}
            <div className="flex gap-2.5 md:gap-4 mb-6">
              <div className="flex-1 bg-white rounded-[14px] p-4 md:p-5 border border-border">
                <div className="font-body text-[11px] text-grayText mb-2">Avec le plan Essentiel</div>
                <div className="font-mono text-[22px] md:text-[28px] font-bold text-navy">{costEssentiel.toLocaleString("fr-FR")} €</div>
                <div className="font-body text-[11px] text-grayText mt-1">Commission 10% / mois</div>
              </div>
              <div className={cn(
                "flex-1 rounded-[14px] p-4 md:p-5 border",
                isProfitable ? "bg-surface border-sage/30" : "bg-red/5 border-red/30"
              )}>
                <div className="font-body text-[11px] text-grayText mb-2">Avec le plan {simPlan === "pro" ? "Pro" : simPlan === "expert" ? "Expert" : "Essentiel"}</div>
                <div className="font-mono text-[22px] md:text-[28px] font-bold text-navy">{costSelected.toLocaleString("fr-FR")} €</div>
                <div className="font-body text-[11px] text-grayText mt-1">
                  {simPlan !== "essentiel" ? `Commission ${selected.rate * 100}% + abo ${selected.abo}€` : "Commission 10% / mois"}
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            {simPlan !== "essentiel" && (
              <div className={cn(
                "rounded-2xl p-5 md:p-6 md:px-7 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-5",
                isProfitable ? "bg-gradient-to-br from-deepForest to-forest" : "bg-red/5"
              )}>
                <div className="flex-1">
                  <div className={cn("font-body text-[13px] mb-1.5", isProfitable ? "text-white/70" : "text-red")}>
                    {isProfitable ? `Votre économie avec le plan ${simPlan === "pro" ? "Pro" : "Expert"}` : "Le plan n'est pas encore rentable"}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className={cn("font-heading text-[32px] md:text-[42px] font-extrabold", isProfitable ? "text-white" : "text-red")}>
                      {isProfitable ? "+" : ""}{saving.toLocaleString("fr-FR")} €
                    </span>
                    <span className={cn("font-body text-sm", isProfitable ? "text-white/60" : "text-red")}>/ mois</span>
                  </div>
                  {isProfitable && (
                    <div className="font-mono text-[13px] text-white/50 mt-2">
                      Soit {savingAnnual.toLocaleString("fr-FR")} € d&apos;économie par an
                    </div>
                  )}
                  {!isProfitable && seuil > 0 && (
                    <div className="font-body text-xs text-red mt-2">
                      Rentable à partir de {seuil.toLocaleString("fr-FR")} €/mois de CA
                    </div>
                  )}
                </div>
                {isProfitable && (
                  <div className="flex gap-3">
                    {[
                      { label: "0% impayés", sub: "Paiement garanti" },
                      { label: `${(selected.rate * 100).toFixed(0)}%`, sub: "Commission" },
                      { label: "1 clic", sub: "Export compta" },
                    ].map((k) => (
                      <div key={k.label} className="text-center bg-white/10 rounded-[10px] p-3 px-3.5 min-w-[80px]">
                        <div className="font-heading text-base font-extrabold text-white">{k.label}</div>
                        <div className="font-body text-[10px] text-white/50 mt-0.5">{k.sub}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comparison table */}
            {simPlan !== "essentiel" && isProfitable && (
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                {[
                  { label: "Commission mensuelle", ess: `${costEssentiel.toLocaleString("fr-FR")} €`, plan: `${(simCA * selected.rate).toLocaleString("fr-FR")} €`, bold: false, green: false },
                  { label: "Abonnement", ess: "0 €", plan: `${selected.abo} €`, bold: false, green: false },
                  { label: "Coût total / mois", ess: `${costEssentiel.toLocaleString("fr-FR")} €`, plan: `${costSelected.toLocaleString("fr-FR")} €`, bold: true, green: false },
                  { label: "Économie mensuelle", ess: "—", plan: `+${saving.toLocaleString("fr-FR")} €`, bold: false, green: true },
                  { label: "Économie annuelle", ess: "—", plan: `+${savingAnnual.toLocaleString("fr-FR")} €`, bold: true, green: true },
                ].map((r, i) => (
                  <div key={i} className={cn("flex px-5 py-2.5", i < 4 && "border-b border-border", r.bold && "bg-bgPage")}>
                    <div className={cn("flex-1 font-body text-xs text-grayText", r.bold && "font-semibold")}>{r.label}</div>
                    <div className="w-[120px] text-right font-mono text-xs text-grayText">{r.ess}</div>
                    <div className={cn("w-[120px] text-right font-mono text-xs font-semibold", r.green ? "text-success" : "text-navy")}>{r.plan}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <section className="px-5 md:px-[5%] py-12 md:py-[72px] bg-bgPage scroll-mt-16">
        <div className="max-w-[640px] mx-auto">
          <h2 className="font-heading text-[22px] md:text-[28px] font-extrabold text-navy text-center mb-8">Questions fréquentes</h2>
          <div>
            {faqItems.map((item, i) => (
              <div key={i} className="border-b border-border cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="py-4 md:py-[18px] flex justify-between items-center">
                  <span className="text-sm md:text-[15px] font-semibold text-navy pr-4">{item.q}</span>
                  <span className={cn(
                    "font-mono text-lg text-forest shrink-0 ml-4 transition-transform duration-300",
                    openFaq === i && "rotate-45"
                  )}>+</span>
                </div>
                {openFaq === i && (
                  <div className="pb-[18px] text-[13px] text-grayText leading-relaxed animate-fadeIn">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FINAL CTA ━━━ */}
      <section className="relative overflow-hidden px-5 md:px-[5%] py-14 md:py-20 text-center bg-gradient-to-br from-deepForest to-forest">
        {/* Decorative circle */}
        <div className="absolute -top-10 right-[10%] w-[180px] h-[180px] rounded-full bg-white/[0.03]" />

        <div className="relative z-10 max-w-[560px] mx-auto">
          {/* Pain reminder badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.08] rounded-full px-4 py-1.5 mb-6 border border-white/10">
            <X className="w-3 h-3 text-red" />
            <span className="font-body text-xs text-white/60">12% d&apos;impayés, 6h de paperasse, clients qui négocient...</span>
          </div>

          <h2 className="font-heading text-[26px] md:text-[38px] font-extrabold text-white mb-3.5 leading-[1.15]">
            Arrêtez de travailler<br />sans garantie de paiement.
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-[460px] mx-auto mb-8">
            Vos clients paient avant l&apos;intervention. Vous intervenez sereinement. Nova valide. Vous êtes payé sous 48h. Et c&apos;est gratuit.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2.5 px-8 md:px-10 py-4 rounded-[14px] bg-white text-deepForest text-[15px] md:text-[17px] font-extrabold font-heading shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
          >
            S&apos;inscrire gratuitement <ArrowRight className="w-4 h-4" />
          </button>

          {/* Friction killers */}
          <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
            <span className="font-mono text-[11px] text-white/40">30 secondes &bull;</span>
            <span className="font-mono text-[11px] text-white/40">Sans carte bancaire &bull;</span>
            <span className="font-mono text-[11px] text-white/40">1er mois Expert offert</span>
          </div>

          {/* 3 guarantee pills */}
          <div className="flex gap-2.5 md:gap-5 justify-center mt-7 flex-wrap">
            {[
              { icon: <Shield className="w-4 h-4 text-lightSage" />, text: "Paiement garanti" },
              { icon: <Check className="w-3 h-3 text-lightSage" />, text: "0% impayé" },
              { icon: <Check className="w-3 h-3 text-lightSage" />, text: "Sous 48h" },
            ].map((g) => (
              <div key={g.text} className="flex items-center gap-1.5 bg-white/[0.06] rounded-[10px] px-3.5 py-2">
                {g.icon}
                <span className="font-body text-xs text-white/60 font-medium">{g.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SignupModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
