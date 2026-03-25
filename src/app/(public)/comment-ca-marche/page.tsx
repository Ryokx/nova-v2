"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield, Lock, Check, X, Star, ArrowRight, Clock,
  MapPin, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";

const heroWords = ["un plombier", "un électricien", "un serrurier"];

const categories = [
  { name: "Plomberie", emoji: "\u{1F527}", desc: "Fuites, robinetterie, chauffe-eau" },
  { name: "Électricité", emoji: "\u26A1", desc: "Tableaux, prises, dépannage" },
  { name: "Serrurerie", emoji: "\u{1F511}", desc: "Ouverture, blindage, cylindres" },
  { name: "Chauffage", emoji: "\u{1F525}", desc: "Chaudières, radiateurs, PAC" },
  { name: "Peinture", emoji: "\u{1F3A8}", desc: "Intérieur, extérieur, enduits" },
  { name: "Maçonnerie", emoji: "\u{1F9F1}", desc: "Murs, terrasses, rénovation" },
];

const horrorStories = [
  { name: "Laurent P.", city: "Bordeaux", cat: "Plomberie", init: "LP", amount: "200\u20AC perdus", text: "Plombier trouvé sur un site d\u2019annonces. 200\u20AC d\u2019avance en liquide. Le lendemain, la fuite avait repris. Numéro coupé. Plus personne." },
  { name: "Marine K.", city: "Paris 9e", cat: "Serrurerie", init: "MK", amount: "650\u20AC pour 3 min", text: "Serrurier Google : 89\u20AC au téléphone. Sur place : 650\u20AC. Enfermée dehors, pas le choix. Il ouvre en 3 minutes avec un outil basique." },
  { name: "Fabien R.", city: "Lyon", cat: "Électricité", init: "FR", amount: "4 800\u20AC à refaire", text: "\"Électricien\" sans décennale. Tableau refait. 3 mois plus tard : court-circuit. Installation non conforme aux normes. Tout à refaire." },
];

const successStories = [
  { name: "Sophie M.", city: "Paris 15e", cat: "Plomberie urgente", init: "SM", amount: "380\u20AC \u2014 prix juste, validé", text: "Fuite d\u2019eau un dimanche soir. Plombier trouvé en 10 min. Arrivé en 45 min. Tout réparé proprement. J\u2019ai payé uniquement quand Nova a confirmé que le travail était conforme." },
  { name: "Claire D.", city: "Paris 11e", cat: "Serrurerie", init: "CD", amount: "195\u20AC \u2014 tarif transparent", text: "Porte claquée à 22h. Serrurier trouvé en 15 min sur Nova. Il était là en 30 min. Et surtout, le prix correspondait au devis fait sur place. Pas un euro de plus." },
  { name: "Thomas G.", city: "Lyon 3e", cat: "Électricité", init: "TG", amount: "1 450\u20AC \u2014 devis respecté", text: "Tableau électrique à refaire. L\u2019artisan est venu, a fait le devis devant moi, et a tout refait en une journée. Nova a vérifié avant de le payer. La tranquillité totale." },
];

const comparisonRows = [
  { label: "Trouver un artisan", sans: "Au hasard sur Google ou bouche-à-oreille", avec: "Artisans certifiés : SIRET, décennale, qualifications" },
  { label: "Vérification", sans: "Aucune \u2014 vous faites confiance aveuglément", avec: "Documents analysés par IA + équipe Nova" },
  { label: "Le devis", sans: "Annoncé au téléphone, gonflé sur place", avec: "Fait sur place, devant vous, sans surprise" },
  { label: "Le paiement", sans: "En liquide ou virement direct \u2014 aucune garantie", avec: "Séquestre sécurisé \u2014 l\u2019artisan n\u2019est payé qu\u2019après validation" },
  { label: "Si ça se passe mal", sans: "Aucun recours, artisan injoignable", avec: "Nova arbitre avec preuves (photos, devis signé)" },
  { label: "Les avis", sans: "Invérifiables, achetés, parfois faux", avec: "100% liés à une mission réelle et un paiement" },
  { label: "En urgence", sans: "Vous prenez le premier venu, dans la panique", avec: "Artisan vérifié en 45 min, paiement toujours sécurisé" },
];

const trustPillars = [
  { num: "01", title: "Artisans audités", desc: "SIRET, décennale, qualifications. Documents analysés par IA." },
  { num: "02", title: "Séquestre sécurisé", desc: "Votre argent est bloqué. L\u2019artisan n\u2019est payé qu\u2019après notre validation." },
  { num: "03", title: "Nous validons", desc: "Vous ne validez pas vous-même. Nova est le tiers de confiance." },
  { num: "04", title: "Avis authentiques", desc: "Chaque note est liée à une mission réelle et un paiement vérifié." },
  { num: "05", title: "Urgences 45 min", desc: "Artisans disponibles, déjà vérifiés. Paiement sécurisé même en urgence." },
  { num: "06", title: "Protection litiges", desc: "Nova arbitre avec preuves. 97% résolus en faveur du client." },
];

const faqItems = [
  { q: "C\u2019est vraiment gratuit pour les particuliers ?", a: "Oui, totalement. Aucun frais d\u2019inscription, aucun abonnement, aucun frais caché. Vous payez uniquement le montant de l\u2019intervention de l\u2019artisan. La commission Nova est incluse dans le prix affiché \u2014 ce que vous voyez est ce que vous payez." },
  { q: "Comment fonctionne le paiement sécurisé ?", a: "Quand vous réservez un artisan, vous payez en ligne par carte bancaire. L\u2019argent est immédiatement bloqué sur un compte séquestre sécurisé. L\u2019artisan intervient chez vous. Ensuite, Nova vérifie que l\u2019intervention est conforme au devis signé. Ce n\u2019est qu\u2019après cette validation que le paiement est libéré à l\u2019artisan. Si l\u2019intervention n\u2019est pas conforme, vous êtes remboursé." },
  { q: "Comment les artisans sont-ils vérifiés ?", a: "Chaque artisan passe un processus de vérification en 3 étapes : vérification du SIRET actif via l\u2019INSEE, contrôle de l\u2019assurance décennale en cours de validité, et validation des qualifications professionnelles (RGE, Qualibat, etc.). Les documents sont analysés par notre IA puis vérifiés par notre équipe." },
  { q: "Combien coûte une intervention ?", a: "Le prix dépend de l\u2019intervention. L\u2019artisan se déplace chez vous et fait le devis sur place, devant vous \u2014 jamais au téléphone. Vous voyez exactement ce qui sera fait et à quel prix avant de confirmer." },
  { q: "Que se passe-t-il en cas de litige ?", a: "Nova est votre tiers de confiance. En cas de problème, notre équipe intervient et arbitre avec les preuves disponibles : photos avant/après, devis signé numériquement, horodatage de l\u2019intervention. Si le travail n\u2019est pas conforme au devis, vous êtes remboursé via le séquestre." },
  { q: "En combien de temps suis-je remboursé ?", a: "En cas de non-conformité validée par Nova, le remboursement est déclenché sous 48h ouvrées. Le montant est recrédité sur votre carte bancaire dans un délai de 3 à 5 jours selon votre banque." },
  { q: "Je peux avoir un artisan en urgence ?", a: "Oui. Notre service urgence met en relation avec des artisans disponibles immédiatement dans votre secteur. L\u2019artisan arrive en 45 minutes en moyenne. Le paiement reste sécurisé par séquestre, même en urgence." },
  { q: "Quelles zones géographiques sont couvertes ?", a: "Nova est disponible à Paris et en Île-de-France au lancement. L\u2019expansion vers Lyon, Marseille et Bordeaux est prévue dans les prochains mois." },
  { q: "Comment s\u2019inscrire ?", a: "L\u2019inscription prend 30 secondes. Vous créez votre compte avec votre email, sans carte bancaire requise. Vous pouvez immédiatement chercher des artisans. La carte bancaire n\u2019est demandée qu\u2019au moment de réserver." },
  { q: "Les avis sont-ils fiables ?", a: "100% fiables. Seuls les clients ayant payé et finalisé une mission réelle via Nova peuvent laisser un avis. Chaque note est liée à une transaction vérifiée. Il est impossible de poster un faux avis." },
];

export default function CommentCaMarchePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [searchCat, setSearchCat] = useState("");
  const [searchVille, setSearchVille] = useState("");
  const [searchDesc, setSearchDesc] = useState("");
  const [searchPhotos, setSearchPhotos] = useState(0);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % heroWords.length), 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveStory((i) => (i + 1) % 3), 6000);
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  const openSearch = () => {
    router.push("/artisans");
  };

  return (
    <>
      {/* ══════ HERO ══════ */}
      <section className="relative overflow-hidden bg-bgPage">
        {/* Decorative blobs */}
        <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[80%] bg-[radial-gradient(ellipse,rgba(27,107,78,0.07),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-[15%] -left-[8%] w-[40%] h-[60%] bg-[radial-gradient(ellipse,rgba(45,155,110,0.05),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #1B6B4E 1px, transparent 0)", backgroundSize: "36px 36px" }} />

        <div className="max-w-[700px] mx-auto px-5 md:px-10 pt-10 md:pt-24 pb-6 md:pb-10 text-center relative z-10">
          {/* Double badge */}
          <div className="flex gap-2 justify-center flex-wrap mb-3.5 animate-fadeIn">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface text-forest">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] font-semibold">Paiement 100% sécurisé</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-border">
              <span className="font-heading text-[13px] font-extrabold text-forest">0&euro;</span>
              <span className="font-mono text-[11px] font-semibold text-grayText">Gratuit pour les particuliers</span>
            </span>
          </div>

          {/* Offer pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[5px] bg-gradient-to-br from-deepForest to-forest mb-5 animate-fadeIn">
            <span className="text-sm">&#127873;</span>
            <span className="font-body text-xs font-semibold text-white">1er déplacement offert à l&apos;inscription</span>
          </div>

          {/* H1 */}
          <h1 className="font-heading text-[32px] md:text-[50px] font-extrabold text-navy leading-[1.12] tracking-tight mb-4">
            Vous cherchez<br />
            <span key={wordIndex} className="text-forest inline-block animate-fadeIn">{heroWords[wordIndex]}</span>{" "}
            de confiance ?
          </h1>

          {/* Subtitle */}
          <p className="font-body text-[15px] md:text-lg text-grayText leading-relaxed max-w-[520px] mx-auto mb-7">
            Artisans vérifiés SIRET + décennale. Paiement bloqué en séquestre. L&apos;artisan n&apos;est payé qu&apos;après validation par Nova.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 justify-center flex-wrap mb-5">
            <Button size="lg" onClick={openSearch} className="bg-deepForest hover:bg-deepForest/90">
              Trouver un artisan <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById("s-how")?.scrollIntoView({ behavior: "smooth" })}>
              Comment ça marche
            </Button>
          </div>

          {/* Trust micro-pills */}
          <div className="flex gap-4 md:gap-5 justify-center flex-wrap">
            {[
              { icon: <Shield className="w-3.5 h-3.5 text-forest" />, text: "Artisans vérifiés" },
              { icon: <Lock className="w-3.5 h-3.5 text-forest" />, text: "Séquestre sécurisé" },
              { icon: <Check className="w-3.5 h-3.5 text-forest" />, text: "Sans carte bancaire" },
              { icon: <Clock className="w-3.5 h-3.5 text-forest" />, text: "Inscription 30 sec" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {p.icon}
                <span className="font-body text-[11px] text-grayText font-medium">{p.text}</span>
              </div>
            ))}
          </div>

          {/* Activity indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="font-body text-[11px] text-grayText">14 interventions réalisées aujourd&apos;hui</span>
          </div>
        </div>

        {/* ══════ BEFORE/AFTER STORIES ══════ */}
        <div className="max-w-[1060px] mx-auto px-5 md:px-10 pb-12 md:pb-20 relative z-10">
          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[11px] text-grayText tracking-widest uppercase">Avant vs Avec Nova</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-lg border border-border">
            {/* SANS NOVA */}
            <div className="bg-[#FFFBFB] p-6 md:p-8 relative md:border-r border-b md:border-b-0 border-border">
              <div className="absolute top-0 left-0 w-full md:w-1 h-1 md:h-full bg-gradient-to-b from-red to-[#F5841F]" />
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-red shadow-[0_0_8px_rgba(232,48,42,0.3)] animate-pulse" />
                <span className="font-mono text-[11px] font-bold text-red tracking-widest uppercase">Sans Nova</span>
                <div className="ml-auto flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <button key={i} onClick={() => setActiveStory(i)}
                      className={`h-[7px] rounded-full border-0 transition-all ${activeStory === i ? "w-5 bg-red" : "w-[7px] bg-border"}`} />
                  ))}
                </div>
              </div>

              {horrorStories.map((story, i) => (
                <div key={i} className={`${activeStory === i ? "block animate-fadeIn" : "hidden"}`}>
                  <p className="font-body text-[15px] md:text-[17px] text-navy leading-relaxed mb-5 min-h-0 md:min-h-[100px]">&ldquo;{story.text}&rdquo;</p>
                  <div className="inline-flex items-center gap-2 bg-red/10 rounded-[5px] px-4 py-2.5 mb-4">
                    <X className="w-3.5 h-3.5 text-red" />
                    <span className="font-heading text-[15px] font-extrabold text-red">{story.amount}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[5px] bg-red/10 flex items-center justify-center font-mono text-[11px] font-semibold text-red">{story.init}</div>
                    <div>
                      <div className="font-body text-[13px] font-semibold text-navy">{story.name}</div>
                      <div className="font-body text-[11px] text-grayText">{story.city} &mdash; {story.cat}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-5 pt-4 border-t border-red/10 space-y-1.5">
                {["Aucune vérification", "Paiement sans garantie", "Zéro recours possible"].map((t, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red/10 flex items-center justify-center shrink-0"><X className="w-2.5 h-2.5 text-red" /></div>
                    <span className="font-body text-xs text-grayText">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AVEC NOVA */}
            <div className="bg-bgPage p-6 md:p-8 relative">
              <div className="absolute top-0 right-0 w-full md:w-1 h-1 md:h-full bg-gradient-to-b from-forest to-success" />
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,200,138,0.3)]" />
                <span className="font-mono text-[11px] font-bold text-forest tracking-widest uppercase">Avec Nova</span>
                <div className="ml-auto flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
                </div>
              </div>

              {successStories.map((story, i) => (
                <div key={i} className={`${activeStory === i ? "block animate-fadeIn" : "hidden"}`}>
                  <p className="font-body text-[15px] md:text-[17px] text-navy leading-relaxed mb-5 min-h-0 md:min-h-[100px]">&ldquo;{story.text}&rdquo;</p>
                  <div className="inline-flex items-center gap-2 bg-surface rounded-[5px] px-4 py-2.5 mb-4">
                    <Check className="w-4 h-4 text-forest" />
                    <span className="font-heading text-[15px] font-extrabold text-forest">{story.amount}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[5px] bg-gradient-to-br from-forest to-sage flex items-center justify-center font-mono text-[11px] font-semibold text-white">{story.init}</div>
                    <div>
                      <div className="font-body text-[13px] font-semibold text-navy">{story.name}</div>
                      <div className="font-body text-[11px] text-grayText">{story.city} &mdash; {story.cat}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-5 pt-4 border-t border-border space-y-1.5">
                {["Artisan certifié SIRET + décennale", "Devis fait sur place, pas au téléphone", "Paiement séquestre \u2014 vous ne risquez rien"].map((t, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-surface flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-forest" /></div>
                    <span className="font-body text-xs text-navy/70">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex gap-4 md:gap-6 justify-center mt-7 flex-wrap">
            {[
              { v: "1 200+", l: "artisans vérifiés" },
              { v: "4.7/5", l: "satisfaction" },
              { v: "0", l: "arnaque" },
              { v: "45 min", l: "délai urgence" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-heading text-base font-extrabold text-deepForest">{s.v}</span>
                <span className="font-body text-xs text-grayText">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ COMPARISON TABLE ══════ */}
      <section className="px-5 md:px-10 py-12 md:py-20 bg-bgPage">
        <div className="max-w-[820px] mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <div className="font-mono text-xs text-forest tracking-widest uppercase mb-2.5">Comparatif</div>
            <h2 className="font-heading text-2xl md:text-[34px] font-extrabold text-navy">La différence est claire</h2>
          </div>

          {/* Column headers */}
          <div className="hidden md:grid grid-cols-3 mb-1">
            <div />
            <div className="px-5 py-3.5 bg-red/10 rounded-tl-xl text-center">
              <span className="font-mono text-[11px] font-bold text-red tracking-wider uppercase">Sans Nova</span>
            </div>
            <div className="px-5 py-3.5 bg-deepForest rounded-tr-xl text-center">
              <span className="font-mono text-[11px] font-bold text-white tracking-wider uppercase">Avec Nova</span>
            </div>
          </div>

          {/* Rows */}
          {comparisonRows.map((row, i) => (
            <div key={i} className={`grid grid-cols-1 md:grid-cols-3 border-b border-border ${i % 2 === 0 ? "bg-white" : "bg-bgPage"} ${i === comparisonRows.length - 1 ? "rounded-b-xl border-b-0" : ""}`}>
              <div className="hidden md:flex items-center px-5 py-4">
                <span className="font-heading text-[13px] font-bold text-navy">{row.label}</span>
              </div>
              <div className="flex items-start gap-2.5 px-4 md:px-5 py-3 md:py-4 md:border-l border-border md:border-r">
                <div className="md:hidden font-heading text-[10px] font-bold text-grayText uppercase mb-1 w-full">{row.label}</div>
                <div className="w-4 h-4 rounded bg-red/10 flex items-center justify-center shrink-0 mt-0.5"><X className="w-2.5 h-2.5 text-red" /></div>
                <span className="font-body text-xs text-grayText leading-relaxed">{row.sans}</span>
              </div>
              <div className="flex items-start gap-2.5 px-4 md:px-5 py-3 md:py-4">
                <div className="w-4 h-4 rounded bg-surface flex items-center justify-center shrink-0 mt-0.5"><Check className="w-2.5 h-2.5 text-forest" /></div>
                <span className="font-body text-xs text-navy leading-relaxed font-medium">{row.avec}</span>
              </div>
            </div>
          ))}

          {/* Synthesis card */}
          <div className="mt-7 bg-white rounded-2xl border border-border p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 md:gap-8 shadow-sm">
            <div className="flex-1">
              <h3 className="font-heading text-lg md:text-[22px] font-extrabold text-navy mb-2">En résumé : 0 risque pour vous.</h3>
              <p className="font-body text-[13px] text-grayText leading-relaxed">Artisan vérifié, devis sur place, paiement bloqué jusqu&apos;à notre validation. Vous ne payez que quand tout est conforme. Et c&apos;est gratuit.</p>
            </div>
            <Button size="lg" onClick={openSearch} className="shrink-0 whitespace-nowrap bg-deepForest hover:bg-deepForest/90">
              Trouver un artisan <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ══════ 3 STEPS ══════ */}
      <section id="s-how" className="px-5 md:px-10 py-12 md:py-20 bg-white scroll-mt-16">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="font-mono text-xs text-forest tracking-widest uppercase mb-2.5">Simple et sécurisé</div>
            <h2 className="font-heading text-2xl md:text-[34px] font-extrabold text-navy">3 étapes. Zéro risque.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { s: "01", t: "Réservez un artisan certifié", d: "Choisissez parmi des artisans vérifiés. Vous payez et l\u2019argent est bloqué.", h: "Votre argent est protégé" },
              { s: "02", t: "L\u2019artisan chiffre sur place", d: "Il se déplace, diagnostique et fait le devis devant vous. Pas de surprise.", h: "Le devis est fait devant vous" },
              { s: "03", t: "Nous validons, il est payé", d: "Nova vérifie. Ce n\u2019est pas vous qui validez \u2014 c\u2019est nous.", h: "Nous sommes votre garantie" },
            ].map((step, i) => (
              <div key={i} className="p-6 md:p-7 rounded-[5px] bg-bgPage border border-border flex flex-col">
                <div className="font-mono text-4xl font-extrabold text-border mb-2">{step.s}</div>
                <h3 className="font-heading text-[17px] md:text-[19px] font-extrabold text-navy mb-2.5">{step.t}</h3>
                <p className="font-body text-[13px] text-grayText leading-relaxed flex-1">{step.d}</p>
                <div className="mt-4 px-3.5 py-2 rounded-lg bg-surface flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-forest" />
                  <span className="font-body text-xs font-semibold text-forest">{step.h}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ ESCROW VISUAL ══════ */}
      <section className="px-5 md:px-10 py-10 md:py-16 bg-gradient-to-br from-deepForest to-forest">
        <div className="max-w-[800px] mx-auto text-center">
          <h3 className="font-heading text-lg md:text-[22px] font-bold text-white mb-6 md:mb-8">Le parcours de votre paiement</h3>
          <div className="flex flex-col md:flex-row">
            {[
              { l: "Paiement bloqué", d: "Vous payez en ligne", n: "01" },
              { l: "Mission en cours", d: "L\u2019artisan intervient", n: "02" },
              { l: "Nous validons", d: "Nova vérifie", n: "03" },
              { l: "Artisan payé", d: "Tout est conforme", n: "04" },
            ].map((step, i) => (
              <div key={i} className="flex-1 text-center py-3.5 md:py-4 md:px-2.5 relative">
                {i < 3 && <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-0.5 bg-white/10" />}
                <div className="w-[42px] h-[42px] rounded-full bg-white/10 border-2 border-white/25 flex items-center justify-center mx-auto mb-2 font-mono font-bold text-sm text-lightSage relative z-10">
                  {step.n}
                </div>
                <div className="font-body text-[13px] font-bold text-white">{step.l}</div>
                <div className="font-body text-[11px] text-white/50 mt-0.5">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TRUST PILLARS ══════ */}
      <section className="px-5 md:px-10 py-12 md:py-20 bg-bgPage">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="font-mono text-xs text-forest tracking-widest uppercase mb-2.5">Nos garanties</div>
            <h2 className="font-heading text-2xl md:text-[34px] font-extrabold text-navy">Pourquoi nous faire confiance ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-4">
            {trustPillars.map((p, i) => (
              <div key={i} className="p-5 md:p-6 rounded-[5px] bg-white border border-border hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="w-9 h-9 rounded-[5px] bg-surface flex items-center justify-center font-mono text-xs font-bold text-forest mb-3.5">{p.num}</div>
                <h3 className="font-heading text-base font-bold text-navy mb-1.5">{p.title}</h3>
                <p className="font-body text-[13px] text-grayText leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="px-5 md:px-10 py-12 md:py-20 bg-bgPage">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-8">
            <div className="font-mono text-xs text-forest tracking-widest uppercase mb-2.5">FAQ</div>
            <h2 className="font-heading text-[22px] md:text-[28px] font-extrabold text-navy">Questions fréquentes</h2>
          </div>
          <div className="divide-y divide-border">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-4.5 text-left group">
                  <span className="font-body text-sm md:text-[15px] font-semibold text-navy pr-4">{item.q}</span>
                  <span className={`font-mono text-lg text-forest shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="pb-4 font-body text-[13px] text-grayText leading-relaxed animate-fadeIn">{item.a}</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="font-body text-sm text-grayText mb-4">Vous avez encore des questions ? Trouvez un artisan et voyez par vous-même.</p>
            <Button onClick={openSearch} className="bg-deepForest hover:bg-deepForest/90">
              Trouver un artisan <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="px-5 md:px-10 py-12 md:py-20 bg-gradient-to-br from-deepForest to-forest text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(142,207,176,0.08),transparent_70%)]" />
        <div className="absolute top-[10%] right-[8%] opacity-[0.04]">
          <Shield className="w-[120px] h-[120px] text-white" />
        </div>

        <div className="max-w-[640px] mx-auto relative z-10">
          {/* Pain reminder */}
          <div className="inline-flex items-center gap-2 bg-white/[0.08] rounded-full px-4 py-1.5 mb-6 border border-white/10">
            <X className="w-3.5 h-3.5 text-white/50" />
            <span className="font-body text-xs text-white/60">200&euro; perdus, 650&euro; pour 3 min, 4 800&euro; à refaire...</span>
          </div>

          <h2 className="font-heading text-[26px] md:text-[40px] font-extrabold text-white mb-3.5 leading-[1.15]">
            Ne prenez plus<br />ce risque.
          </h2>
          <p className="font-body text-[15px] md:text-[17px] text-white/65 leading-relaxed max-w-[480px] mx-auto mb-9">
            Artisan vérifié SIRET + décennale. Paiement bloqué jusqu&apos;à validation. C&apos;est gratuit pour vous.
          </p>

          <Button size="lg" onClick={openSearch}
            className="bg-white text-deepForest hover:bg-white/90 text-[17px] font-extrabold px-10 py-5 rounded-[5px] animate-[pulse_2s_infinite] mb-4">
            Trouver un artisan <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="flex justify-center gap-1.5 mb-8 flex-wrap">
            {["30 secondes", "Sans carte bancaire", "Gratuit"].map((t, i) => (
              <span key={i} className="font-mono text-[11px] text-white/40">{t}{i < 2 ? " \u00B7" : ""}</span>
            ))}
          </div>

          <div className="flex gap-3 md:gap-5 justify-center flex-wrap">
            {[
              { icon: <Shield className="w-4 h-4 text-lightSage" />, text: "Artisans vérifiés" },
              { icon: <Lock className="w-4 h-4 text-lightSage" />, text: "Paiement séquestre" },
              { icon: <Check className="w-4 h-4 text-lightSage" />, text: "Validation Nova" },
            ].map((g, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/[0.06] rounded-[5px] px-3.5 py-2">
                {g.icon}
                <span className="font-body text-xs text-white/60 font-medium">{g.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SEARCH MODAL ══════ */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-navy/50 backdrop-blur-sm"
          onClick={() => setShowSearch(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[520px] bg-white rounded-3xl shadow-2xl max-h-[88vh] overflow-y-auto animate-slideUp">

            {/* Step 0: Category + City */}
            {searchStep === 0 && (
              <div className="p-6 md:p-9">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="font-heading text-xl md:text-2xl font-extrabold text-navy mb-1">Trouvez votre artisan</h2>
                    <p className="font-body text-[13px] text-grayText">Gratuit et sans engagement</p>
                  </div>
                  <button onClick={() => setShowSearch(false)}
                    className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-surface">
                    <X className="w-3.5 h-3.5 text-grayText" />
                  </button>
                </div>

                {/* Offer reminder */}
                <div className="flex items-center gap-2 bg-gradient-to-br from-deepForest to-forest rounded-[5px] px-3.5 py-2.5 mb-5">
                  <span className="text-base">&#127873;</span>
                  <div>
                    <div className="font-body text-[11px] font-bold text-white">1er déplacement offert</div>
                    <div className="font-body text-[10px] text-white/60">Pour votre première intervention à l&apos;inscription</div>
                  </div>
                </div>

                {/* Category grid */}
                <div className="mb-5">
                  <div className="font-body text-xs font-semibold text-grayText mb-2.5">De quel artisan avez-vous besoin ?</div>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat, i) => (
                      <button key={i} onClick={() => setSearchCat(cat.name)}
                        className={`p-3.5 rounded-xl text-center transition-all ${searchCat === cat.name ? "bg-surface border-2 border-forest" : "bg-bgPage border-2 border-transparent"}`}>
                        <div className="text-[22px] mb-1">{cat.emoji}</div>
                        <div className={`font-body text-[11px] font-semibold ${searchCat === cat.name ? "text-forest" : "text-navy"}`}>{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* City */}
                <div className="mb-6">
                  <div className="font-body text-xs font-semibold text-grayText mb-2">Dans quelle ville ?</div>
                  <div className="flex gap-2">
                    <input value={searchVille} onChange={(e) => setSearchVille(e.target.value)}
                      placeholder="Ex : Paris 15e, Lyon..."
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-bgPage font-body text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30" />
                    <button onClick={() => {
                      setGeoLoading(true);
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          () => { setSearchVille("Ma position actuelle"); setGeoLoading(false); },
                          () => { setSearchVille("Paris"); setGeoLoading(false); }
                        );
                      } else { setSearchVille("Paris"); setGeoLoading(false); }
                    }}
                      className="px-3.5 py-3 rounded-xl border border-border bg-bgPage hover:bg-surface transition-colors shrink-0">
                      {geoLoading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-border border-t-forest animate-spin" />
                      ) : (
                        <MapPin className="w-[18px] h-[18px] text-forest" />
                      )}
                    </button>
                  </div>
                </div>

                <button disabled={!searchCat || !searchVille.trim()} onClick={() => setSearchStep(1)}
                  className={`w-full py-3.5 rounded-xl border-0 font-heading text-[15px] font-bold flex items-center justify-center gap-2 transition-all ${searchCat && searchVille.trim() ? "bg-deepForest text-white cursor-pointer" : "bg-border text-grayText cursor-default"}`}>
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex justify-center gap-4 mt-4">
                  {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? "w-5 bg-forest" : "w-2 bg-border"}`} />)}
                </div>
              </div>
            )}

            {/* Step 1: Describe */}
            {searchStep === 1 && (
              <div className="p-6 md:p-9 animate-fadeIn">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="font-heading text-lg md:text-[22px] font-extrabold text-navy mb-1">Décrivez votre besoin</h2>
                    <p className="font-body text-[13px] text-grayText">{searchCat} à {searchVille}</p>
                  </div>
                  <button onClick={() => setSearchStep(0)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-white font-body text-[11px] text-grayText hover:bg-surface">
                    Retour
                  </button>
                </div>

                <div className="mb-5">
                  <div className="font-body text-xs font-semibold text-grayText mb-2">Quel est le problème ?</div>
                  <textarea value={searchDesc} onChange={(e) => setSearchDesc(e.target.value)}
                    placeholder="Ex : Fuite sous l&apos;évier de la cuisine, le joint semble usé..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bgPage font-body text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 resize-y leading-relaxed" />
                </div>

                <div className="mb-6">
                  <div className="font-body text-xs font-semibold text-grayText mb-2">
                    Photos <span className="font-normal text-grayText/70">(optionnel)</span>
                  </div>
                  <div className="flex gap-2.5">
                    {[0, 1, 2].map((i) => (
                      <button key={i} onClick={() => setSearchPhotos(Math.max(searchPhotos, i + 1))}
                        className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${i < searchPhotos ? "border-forest bg-surface" : "border-border bg-bgPage"}`}>
                        {i < searchPhotos ? (
                          <>
                            <Check className="w-4 h-4 text-forest" />
                            <span className="font-body text-[9px] text-forest mt-1">Photo {i + 1}</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-5 h-5 text-grayText" />
                            <span className="font-body text-[9px] text-grayText mt-1">Ajouter</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => { setSearchStep(2); setTimeout(() => setSearchStep(3), 2200); }}
                  className="w-full py-3.5 rounded-xl bg-deepForest text-white font-heading text-[15px] font-bold flex items-center justify-center gap-2 border-0 cursor-pointer">
                  Rechercher des artisans <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => { setSearchStep(2); setTimeout(() => setSearchStep(3), 2200); }}
                  className="w-full py-2.5 bg-transparent border-0 text-grayText font-body text-xs mt-2 cursor-pointer">
                  Passer cette étape
                </button>

                <div className="flex justify-center gap-4 mt-4">
                  {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 rounded-full transition-all ${i <= 1 ? "bg-forest" : "bg-border"} ${i === 1 ? "w-5" : "w-2"}`} />)}
                </div>
              </div>
            )}

            {/* Step 2: Loading */}
            {searchStep === 2 && (
              <div className="px-9 py-16 text-center">
                <div className="w-12 h-12 rounded-full border-[3px] border-border border-t-forest animate-spin mx-auto mb-5" />
                <h3 className="font-heading text-lg font-bold text-navy mb-1.5">Recherche en cours...</h3>
                <p className="font-body text-[13px] text-grayText mb-5">
                  Nous cherchons les meilleurs artisans en {searchCat} à {searchVille}
                </p>
                {searchDesc && (
                  <div className="font-body text-[11px] text-grayText bg-bgPage rounded-lg px-3 py-2 max-w-[300px] mx-auto">
                    Votre description sera transmise aux artisans
                  </div>
                )}
                <div className="flex justify-center gap-4 mt-5">
                  {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 rounded-full ${i <= 2 ? "bg-forest" : "bg-border"} ${i === 2 ? "w-5" : "w-2"}`} />)}
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {searchStep === 3 && (
              <div className="p-6 md:p-8 animate-fadeIn">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-heading text-lg md:text-[22px] font-extrabold text-navy mb-1">3 artisans disponibles</h2>
                    <p className="font-body text-xs text-grayText">{searchCat} à {searchVille}</p>
                  </div>
                  <button onClick={() => setShowSearch(false)}
                    className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-surface">
                    <X className="w-3.5 h-3.5 text-grayText" />
                  </button>
                </div>

                {/* Offer reminder */}
                <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 mb-2.5">
                  <span className="text-sm">&#127873;</span>
                  <span className="font-body text-[11px] font-semibold text-forest">Rappel : 1er déplacement offert à l&apos;inscription</span>
                </div>

                {/* Urgency */}
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 bg-gold/5 border border-gold/10">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
                  <span className="font-body text-[11px] text-grayText">
                    <span className="font-semibold text-navy">{7 + Math.floor(Math.random() * 8)} personnes</span> recherchent un artisan en {searchCat} dans votre secteur
                  </span>
                </div>

                {/* Artisan results */}
                <div className="space-y-3 mb-5">
                  {[
                    { name: "Paul Lefevre", note: 4.8, missions: 127, delai: "Disponible demain", init: "PL", verified: ["SIRET", "Décennale", "RGE"], available: false },
                    { name: "Nicolas Martin", note: 4.9, missions: 89, delai: "Disponible aujourd\u2019hui", init: "NM", verified: ["SIRET", "Décennale"], available: true },
                    { name: "David Richard", note: 4.6, missions: 54, delai: "Disponible lundi", init: "DR", verified: ["SIRET", "Décennale", "Qualibat"], available: false },
                  ].map((artisan, i) => (
                    <div key={i} className="p-4 md:p-5 rounded-2xl bg-bgPage border border-border hover:border-forest/25 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-forest to-sage flex items-center justify-center font-mono text-sm font-bold text-white">{artisan.init}</div>
                        <div className="flex-1">
                          <div className="font-heading text-[15px] font-bold text-navy">{artisan.name}</div>
                          <div className="font-body text-[11px] text-grayText">{artisan.missions} missions réalisées</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          <span className="font-mono text-sm font-bold text-navy">{artisan.note}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 mb-2.5 flex-wrap">
                        {artisan.verified.map((v, j) => (
                          <span key={j} className="inline-flex items-center gap-1 bg-surface rounded-md px-2 py-0.5">
                            <Check className="w-3 h-3 text-forest" />
                            <span className="font-mono text-[9px] font-semibold text-forest">{v}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${artisan.available ? "bg-success" : "bg-grayText"}`} />
                        <span className={`font-body text-[11px] ${artisan.available ? "text-success font-semibold" : "text-grayText"}`}>{artisan.delai}</span>
                      </div>
                      <button onClick={() => window.location.href = "/login"}
                        className="w-full py-2.5 rounded-[5px] bg-deepForest text-white font-body text-[13px] font-semibold flex items-center justify-center gap-1.5 border-0 cursor-pointer hover:bg-deepForest/90 transition-colors">
                        Contacter cet artisan <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Login gate */}
                <div className="bg-bgPage rounded-xl p-3.5 border border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <div className="font-body text-xs font-semibold text-navy">Inscrivez-vous pour contacter un artisan</div>
                    <div className="font-body text-[11px] text-grayText">30 sec &bull; Sans carte bancaire &bull; 1er déplacement offert</div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 rounded-full bg-forest ${i === 3 ? "w-5" : "w-2"}`} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
