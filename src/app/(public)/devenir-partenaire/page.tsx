"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, Check, ChevronDown, ChevronUp, FileText, Building, X, Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ━━━ FAQ DATA ━━━ */
const faqItems = [
  { q: "Combien coûte Nova pour les artisans ?", a: "L'inscription est gratuite. Nova prélève une commission de 5% à 10% sur chaque mission selon votre forfait. Le forfait Essentiel est 100% gratuit, le forfait Pro est à 49€/mois (7% de commission) et le forfait Expert à 99€/mois (5% de commission)." },
  { q: "Comment fonctionne le séquestre ?", a: "Le client paie 100% du montant à la signature du devis. L'argent est bloqué sur un compte séquestre sécurisé. Vous êtes payé sous 48h après validation de l'intervention par le client." },
  { q: "Comment gérer mes interventions ?", a: "Depuis votre dashboard, vous gérez vos devis, factures, planning et paiements. Tout est centralisé dans une seule application." },
  { q: "Que se passe-t-il si un client conteste ?", a: "Nova examine le litige sous 48h. Dans 97% des cas, l'artisan est payé après examen des preuves (photos avant/après, messages, devis signé)." },
  { q: "Comment fonctionnent les partenariats syndics ?", a: "Nova vous met en relation avec des syndics de copropriété. Chaque syndic génère en moyenne 5 à 10 interventions régulières, sans aucune prospection de votre part." },
  { q: "Le badge Certifié Nova est-il réutilisable ?", a: "Oui ! Vous pouvez l'afficher sur votre véhicule, vos cartes de visite, vos devis et factures, votre signature email et vos réseaux sociaux." },
  { q: "Quels documents sont nécessaires ?", a: "Documents obligatoires : extrait SIRET, attestation décennale, pièce d'identité. Documents facultatifs : RGE, Qualibat, Kbis." },
  { q: "Comment fonctionnent les urgences ?", a: "Les demandes urgentes arrivent en notification push. Vous choisissez d'accepter ou non. Les urgences sont majorées de 15 à 25%." },
  { q: "Comment sont calculés les avis ?", a: "Seuls les clients ayant réalisé une mission peuvent laisser un avis. La note est la moyenne pondérée de toutes les évaluations vérifiées." },
];

const beforeAfter = {
  sans: [
    { stat: "12%", label: "d'impayés" },
    { stat: "6h", label: "de paperasse/semaine" },
    { stat: "0", label: "garantie paiement" },
    { stat: "3 mois", label: "trésorerie instable" },
  ],
  avec: [
    { stat: "0%", label: "d'impayés" },
    { stat: "1h", label: "gestion/semaine" },
    { stat: "48h", label: "pour être payé" },
    { stat: "+40%", label: "clients supplémentaires" },
  ],
};

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
  const [docs, setDocs] = useState<string[]>([]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const pwStrength = Math.min(4, Math.floor(password.length / 3));
  const requiredDocs = ["siret", "decennale", "identite"];
  const uploadedRequired = docs.filter((d) => requiredDocs.includes(d)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-white rounded-xl shadow-lg animate-slideUp max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-grayText hover:text-navy hover:bg-surface transition-colors z-10" aria-label="Fermer">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Step 0: Email/Password */}
          {step === 0 && (
            <>
              <h2 className="font-heading text-xl font-extrabold text-navy mb-1">Créer votre compte artisan</h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-5">🎁 1 mois du forfait Expert offert</div>
              <div className="space-y-3">
                <input placeholder="Email professionnel" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
                <div className="relative">
                  <input placeholder="Mot de passe (min. 8 caractères)" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 px-4 pr-10 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-grayText">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-1">{[0, 1, 2, 3].map((i) => <div key={i} className={cn("flex-1 h-1 rounded-full", i < pwStrength ? (pwStrength < 3 ? "bg-gold" : "bg-success") : "bg-border")} />)}</div>
              </div>
              <Button className="w-full mt-5" disabled={!email || password.length < 8} onClick={() => setStep(1)}>Continuer</Button>
            </>
          )}

          {/* Step 1: Info */}
          {step === 1 && (
            <>
              <button onClick={() => setStep(0)} className="text-xs text-forest font-medium mb-3">← Retour</button>
              <h2 className="font-heading text-xl font-extrabold text-navy mb-4">Vos informations</h2>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
                  <input placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
                </div>
                <input placeholder="Téléphone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
                <select value={metier} onChange={(e) => setMetier(e.target.value)} className="w-full h-11 px-4 rounded-md border border-border text-sm text-navy focus:outline-none focus:ring-2 focus:ring-forest/30">
                  <option value="">Métier</option>
                  {["Plombier", "Électricien", "Serrurier", "Chauffagiste", "Peintre", "Maçon"].map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
                <input placeholder="SIRET" value={siret} onChange={(e) => setSiret(e.target.value)} className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
                <label className="flex items-center gap-2 text-xs text-grayText cursor-pointer">
                  <input type="checkbox" checked={cgu} onChange={(e) => setCgu(e.target.checked)} className="rounded" />
                  J&apos;accepte les CGU et la politique de confidentialité
                </label>
              </div>
              <Button className="w-full mt-4" disabled={!firstName || !lastName || !metier || !city || !cgu} onClick={() => setStep(2)}>Continuer</Button>
            </>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="text-xs text-forest font-medium mb-3">← Retour</button>
              <h2 className="font-heading text-xl font-extrabold text-navy mb-4">Documents</h2>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-navy">Obligatoires</p>
                {[
                  { id: "siret", label: "Extrait SIRET / Avis INSEE" },
                  { id: "decennale", label: "Attestation décennale" },
                  { id: "identite", label: "Pièce d'identité" },
                ].map((doc) => (
                  <button key={doc.id} onClick={() => setDocs((d) => d.includes(doc.id) ? d : [...d, doc.id])}
                    className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all",
                      docs.includes(doc.id) ? "border-success bg-success/5" : "border-border hover:border-forest/30")}>
                    <div className={cn("w-2 h-2 rounded-full", docs.includes(doc.id) ? "bg-success" : "bg-red")} />
                    <span className="flex-1 text-sm text-navy">{doc.label}</span>
                    {docs.includes(doc.id) ? <Check className="w-4 h-4 text-success" /> : <Upload className="w-4 h-4 text-grayText" />}
                  </button>
                ))}
                <p className="text-xs font-semibold text-grayText mt-2">Facultatifs</p>
                {[
                  { id: "rge", label: "Certification RGE" },
                  { id: "qualibat", label: "Certification Qualibat" },
                  { id: "kbis", label: "Extrait Kbis" },
                ].map((doc) => (
                  <button key={doc.id} onClick={() => setDocs((d) => d.includes(doc.id) ? d : [...d, doc.id])}
                    className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all",
                      docs.includes(doc.id) ? "border-success bg-success/5" : "border-border hover:border-forest/30")}>
                    <div className={cn("w-2 h-2 rounded-full", docs.includes(doc.id) ? "bg-success" : "bg-grayText/30")} />
                    <span className="flex-1 text-sm text-navy">{doc.label}</span>
                    {docs.includes(doc.id) ? <Check className="w-4 h-4 text-success" /> : <Upload className="w-4 h-4 text-grayText" />}
                  </button>
                ))}
                <div className="text-xs text-grayText">{uploadedRequired}/3 documents obligatoires</div>
              </div>
              <Button className="w-full mt-4" onClick={() => setStep(3)}>Créer mon compte artisan</Button>
              <button onClick={() => setStep(3)} className="w-full text-center text-xs text-grayText mt-2 hover:underline">Envoyer documents plus tard</button>
            </>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h2 className="font-heading text-xl font-extrabold text-navy mb-2">Bienvenue, {firstName || "Artisan"} !</h2>
              <div className="space-y-3 text-left mt-6">
                {[
                  { label: "Inscription", done: true },
                  { label: "Documents envoyés", done: uploadedRequired === 3 },
                  { label: "Vérification Nova (48-72h)", done: false },
                  { label: "Premier client", done: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                      s.done ? "bg-success text-white" : "bg-border text-grayText")}>
                      {s.done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={cn("text-sm", s.done ? "text-navy font-semibold" : "text-grayText")}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-center mt-5 text-[10px] text-grayText">
                <span>1er mois Expert offert</span> · <span>Paiement garanti</span> · <span>0% d&apos;impayés</span>
              </div>
              <Button className="w-full mt-5" onClick={onClose}>Fermer</Button>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {[0, 1, 2, 3].map((i) => <div key={i} className={cn("w-2 h-2 rounded-full", i <= step ? "bg-deepForest" : "bg-border")} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━ PAGE ━━━ */
export default function DevenirPartenairePage() {
  const [showModal, setShowModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [counter, setCounter] = useState(312);

  useEffect(() => {
    const interval = setInterval(() => setCounter((c) => c + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bgPage via-surface to-border px-5 md:px-10 py-16 md:py-24">
        <div className="absolute top-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-forest/5 blur-[80px]" />
        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold"><Shield className="w-3 h-3" /> Paiement garanti</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-navy text-xs font-semibold"><Lock className="w-3 h-3" /> 0% d&apos;impayés</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-bold mb-5">🎁 1 mois du forfait Expert offert</div>
          <h1 className="font-heading text-4xl md:text-[56px] font-extrabold text-navy leading-[1.1] tracking-tight mb-4 max-w-[700px]">
            Zéro impayé.<br />Vos clients <span className="text-forest">paient avant.</span>
          </h1>
          <p className="text-lg text-grayText max-w-[560px] leading-relaxed mb-6">
            Nova bloque le paiement en séquestre à la signature du devis. Vous êtes payé sous 48h après validation, sans exception.
          </p>
          <div className="hidden md:flex gap-3 mb-6 text-xs text-grayText">
            {["Inscription gratuite", "Sans engagement", "Paiement sous 48h", "30 secondes"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-white/70 border border-border">{t}</span>
            ))}
          </div>
          <div className="flex gap-3 mb-6">
            <Button size="lg" onClick={() => setShowModal(true)}>S&apos;inscrire gratuitement</Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById("simulateur")?.scrollIntoView({ behavior: "smooth" })}>
              Simuler mes économies
            </Button>
          </div>
          <p className="text-xs text-grayText"><span className="font-mono font-bold text-forest">{counter}</span> artisans déjà inscrits</p>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="px-5 md:px-10 py-16 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy text-center mb-10">Avant vs Avec Nova</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-xl border border-red/15 bg-red/[0.02] p-6 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red to-red/30" />
              <h3 className="font-heading text-lg font-bold text-red mb-4">Sans Nova</h3>
              <div className="space-y-4">
                {beforeAfter.sans.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="font-mono text-xl font-bold text-red">{item.stat}</span>
                    <span className="text-sm text-grayText">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 px-3 py-2 rounded-lg bg-red/5 text-xs text-red font-medium">
                Résultat : stress, impayés, perte de temps
              </div>
            </div>
            <div className="relative rounded-xl border border-success/15 bg-success/[0.02] p-6 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-success to-forest" />
              <h3 className="font-heading text-lg font-bold text-forest mb-4">Avec Nova</h3>
              <div className="space-y-4">
                {beforeAfter.avec.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="font-mono text-xl font-bold text-success">{item.stat}</span>
                    <span className="text-sm text-grayText">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 px-3 py-2 rounded-lg bg-success/5 text-xs text-success font-medium">
                Résultat : sérénité, revenus garantis, temps libéré
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="px-5 md:px-10 py-16 bg-bgPage">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy text-center mb-10">Pourquoi rejoindre Nova ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <FileText className="w-6 h-6" />, title: "Gestion complète", desc: "Devis, factures, planning, paiements. Tout centralisé dans une seule application. Export PDF conforme." },
              { icon: <Shield className="w-6 h-6" />, title: "Protection litiges", desc: "97% des artisans sont payés après examen Nova. Photos, messages et devis signé font preuve.", dark: true },
              { icon: <Building className="w-6 h-6" />, title: "Marchés syndics", desc: "5 à 10 interventions par syndic en moyenne. Zéro prospection, les missions viennent à vous." },
            ].map((card) => (
              <div key={card.title} className={cn(
                "rounded-xl p-7",
                card.dark ? "bg-gradient-to-br from-deepForest to-forest text-white" : "bg-white border border-border",
              )}>
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                  card.dark ? "bg-white/15" : "bg-forest/5 text-forest")}>{card.icon}</div>
                <h3 className={cn("font-heading text-base font-bold mb-2", card.dark ? "text-white" : "text-navy")}>{card.title}</h3>
                <p className={cn("text-sm leading-relaxed", card.dark ? "text-white/70" : "text-grayText")}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMULATOR */}
      <section id="simulateur" className="px-5 md:px-10 py-16 bg-white">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy mb-3">Simulateur d&apos;économies</h2>
          <p className="text-sm text-grayText mb-8">Estimez vos gains avec Nova selon votre chiffre d&apos;affaires</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { name: "Essentiel", comm: "10%", price: "Gratuit" },
              { name: "Pro", comm: "7%", price: "49€/mois", rec: true },
              { name: "Expert", comm: "5%", price: "99€/mois" },
            ].map((plan) => (
              <div key={plan.name} className={cn(
                "relative rounded-xl p-4 border-2 text-center",
                plan.rec ? "border-forest bg-forest/5" : "border-border",
              )}>
                {plan.rec && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-forest text-white text-[10px] font-bold">Recommandé</span>}
                <div className="font-heading text-base font-bold text-navy">{plan.name}</div>
                <div className="font-mono text-xl font-bold text-forest mt-1">{plan.comm}</div>
                <div className="text-xs text-grayText">commission</div>
                <div className="text-xs font-semibold text-navy mt-2">{plan.price}</div>
              </div>
            ))}
          </div>
          <Button size="lg" onClick={() => setShowModal(true)}>S&apos;inscrire — 1er mois Expert offert</Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 md:px-10 py-16 bg-bgPage">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-white overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-semibold text-navy pr-4">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-grayText shrink-0" /> : <ChevronDown className="w-4 h-4 text-grayText shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-grayText leading-relaxed animate-fadeIn">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 md:px-10 py-16 bg-gradient-to-br from-deepForest to-forest text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <p className="text-sm text-white/50 mb-3">12% d&apos;impayés, 6h de paperasse, clients qui négocient...</p>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-4">
            Arrêtez de travailler sans garantie de paiement.
          </h2>
          <div className="flex gap-2 justify-center mb-5 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/10">Paiement garanti</span>
            <span className="px-3 py-1 rounded-full bg-white/10">0% impayé</span>
            <span className="px-3 py-1 rounded-full bg-white/10">Sous 48h</span>
          </div>
          <Button size="lg" className="bg-white text-deepForest hover:bg-white/90" onClick={() => setShowModal(true)}>
            S&apos;inscrire gratuitement
          </Button>
          <div className="flex gap-2 justify-center mt-4 text-[10px] text-white/40">
            <span>30 secondes</span> · <span>Sans carte bancaire</span> · <span>1er mois Expert offert</span>
          </div>
        </div>
      </section>

      <SignupModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
