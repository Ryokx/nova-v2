/**
 * TradeUrgency — Page d'urgence pour chaque corps de métier
 *
 * Composant serveur (SSR) pour un meilleur SEO.
 * Affiche :
 * - Hero avec badges urgence + CTA
 * - Barre de progression du séquestre
 * - Liste des artisans disponibles (données fictives)
 * - Contenu éditorial SEO (fonctionnement + tarifs indicatifs)
 * - FAQ avec balise <details> (crawlable par Google)
 * - CTA final + liens vers les autres urgences
 */

import Link from "next/link";
import {
  Zap, Clock, Shield, Lock, Star, ArrowRight, Phone,
  MapPin, BadgeCheck, Check, CheckCircle,
  CreditCard, ChevronDown,
} from "lucide-react";
import type { TradeConfig } from "@/lib/trades";
import { UrgencyCtaButton, UrgencyCtaFinal } from "@/components/features/trade-urgency-client";

/* ━━━ Types ━━━ */
interface TradeUrgencyProps {
  trade: TradeConfig;
}

/* ━━━ Données fictives : artisans disponibles en urgence ━━━ */
const mockUrgentArtisans = [
  { name: "Karim B.", initials: "KB", rating: 5.0, reviews: 83, time: "20 min", city: "Paris 9e", distance: "1.8 km", certif: ["Décennale", "RGE"] },
  { name: "Jean-Michel P.", initials: "JM", rating: 4.9, reviews: 127, time: "30 min", city: "Paris 11e", distance: "2.4 km", certif: ["Décennale", "Qualibat"] },
  { name: "Fatima H.", initials: "FH", rating: 4.8, reviews: 91, time: "35 min", city: "Paris 15e", distance: "3.1 km", certif: ["Décennale"] },
];

/* ━━━ Contenu éditorial par métier (SEO) : explication + tarifs indicatifs ━━━ */
const editorialContent: Record<string, { howItWorks: string; pricing: { label: string; range: string }[] }> = {
  serrurier: {
    howItWorks: "Lorsque vous êtes bloqué devant votre porte ou que votre serrure est endommagée, chaque minute compte. Avec Nova, il suffit de décrire votre problème et d'indiquer votre adresse. Notre algorithme identifie immédiatement les serruriers certifiés disponibles dans un rayon de 5 km autour de vous. En moins de 2 minutes, un artisan accepte votre demande et se met en route. Vous suivez son trajet en temps réel sur votre téléphone. À son arrivée, le serrurier établit un devis sur place, devant vous, avant de commencer toute intervention. Votre paiement est sécurisé par le système de séquestre Nova : l'argent est bloqué et l'artisan ne le reçoit qu'après votre validation. Si le travail n'est pas conforme, vous êtes remboursé sous 48 heures. Tous nos serruriers sont vérifiés : SIRET valide, assurance décennale, pièce d'identité contrôlée. Zéro arnaque, zéro mauvaise surprise.",
    pricing: [
      { label: "Ouverture de porte (jour)", range: "90 € — 180 €" },
      { label: "Ouverture de porte (nuit/dimanche)", range: "150 € — 300 €" },
      { label: "Changement de cylindre", range: "120 € — 250 €" },
      { label: "Installation serrure multipoints", range: "200 € — 500 €" },
      { label: "Réparation après effraction", range: "150 € — 400 €" },
    ],
  },
  plombier: {
    howItWorks: "Une fuite d'eau peut causer des dégâts considérables en quelques minutes seulement. Avec Nova, déclarez votre urgence en décrivant le problème (fuite, canalisation bouchée, dégât des eaux) et votre localisation. Notre plateforme contacte automatiquement les plombiers certifiés disponibles à proximité. Un artisan qualifié accepte votre demande et arrive chez vous en moins de 2 heures — souvent en 30 à 45 minutes. À son arrivée, il diagnostique le problème et vous présente un devis détaillé avant toute intervention. Votre paiement est protégé par le séquestre Nova : l'argent est bloqué jusqu'à ce que vous validiez le travail effectué. Si l'intervention ne correspond pas au devis, vous êtes intégralement remboursé sous 48 heures. Chaque plombier sur Nova est certifié : SIRET vérifié, assurance décennale active, identité contrôlée. En cas de dégât des eaux, Nova fournit une facture conforme pour votre déclaration d'assurance.",
    pricing: [
      { label: "Réparation de fuite simple", range: "80 € — 200 €" },
      { label: "Débouchage canalisation", range: "100 € — 300 €" },
      { label: "Réparation chauffe-eau", range: "150 € — 400 €" },
      { label: "Remplacement robinetterie", range: "80 € — 200 €" },
      { label: "Recherche de fuite (caméra)", range: "200 € — 500 €" },
    ],
  },
  electricien: {
    howItWorks: "Une panne électrique peut être dangereuse : risque d'incendie, court-circuit, électrocution. Ne prenez aucun risque et faites appel à un électricien certifié via Nova. Décrivez votre problème (panne de courant, tableau qui disjoncte, odeur de brûlé) et indiquez votre adresse. En quelques secondes, notre plateforme identifie les électriciens disponibles près de chez vous. Un artisan certifié accepte la mission et arrive en moins de 2 heures. Il sécurise d'abord votre installation, puis établit un diagnostic complet avec un devis transparent. Votre paiement est sécurisé par séquestre : l'artisan n'est payé qu'après votre validation. Tous nos électriciens respectent la norme NF C 15-100 et disposent des certifications obligatoires (SIRET, décennale). Pour les installations plus complexes (borne de recharge, mise aux normes), un deuxième rendez-vous peut être planifié avec le même artisan via Nova.",
    pricing: [
      { label: "Diagnostic + dépannage simple", range: "100 € — 250 €" },
      { label: "Remplacement disjoncteur", range: "80 € — 200 €" },
      { label: "Remise en service tableau", range: "120 € — 350 €" },
      { label: "Remplacement prise/interrupteur", range: "60 € — 150 €" },
      { label: "Mise aux normes partielle", range: "300 € — 800 €" },
    ],
  },
  chauffagiste: {
    howItWorks: "En plein hiver, une panne de chauffage est une situation d'urgence, surtout avec des enfants ou des personnes âgées au domicile. Avec Nova, déclarez votre urgence chauffage en quelques clics : décrivez le problème (chaudière en panne, fuite de gaz, radiateurs froids) et votre localisation. Notre plateforme alerte immédiatement les chauffagistes certifiés disponibles dans votre zone. Un artisan qualifié accepte la mission et intervient chez vous en moins de 2 heures. Après un diagnostic complet, il vous présente un devis détaillé. Votre paiement est sécurisé par séquestre Nova : l'argent est bloqué et ne sera libéré qu'après votre validation. En cas de suspicion de fuite de gaz, appelez d'abord GRDF (0 800 47 33 33), puis contactez un chauffagiste via Nova pour la réparation. Nos chauffagistes sont certifiés (SIRET, décennale) et la majorité possède la certification RGE, vous donnant accès aux aides de l'État.",
    pricing: [
      { label: "Diagnostic + dépannage chaudière", range: "120 € — 350 €" },
      { label: "Remplacement pièce chaudière", range: "150 € — 500 €" },
      { label: "Désembouage radiateurs", range: "300 € — 600 €" },
      { label: "Entretien annuel chaudière", range: "80 € — 150 €" },
      { label: "Réparation pompe à chaleur", range: "200 € — 600 €" },
    ],
  },
  macon: {
    howItWorks: "Une fissure structurelle, un effondrement partiel ou un mur de soutènement fragilisé représentent un danger immédiat pour les occupants du bâtiment. Avec Nova, déclarez votre urgence maçonnerie et décrivez la situation (fissure, affaissement, dégât après sinistre). Notre plateforme identifie les maçons certifiés disponibles à proximité. Un artisan qualifié arrive chez vous rapidement pour sécuriser la zone : étaiement, mise en sécurité, bâchage d'urgence. Il établit ensuite un diagnostic et un devis complet pour les travaux de réparation. Votre paiement est protégé par séquestre Nova tout au long du processus. Pour les travaux de gros œuvre nécessitant un permis ou une étude structurelle, le maçon coordonne avec un bureau d'études si nécessaire. Tous nos maçons sont certifiés (SIRET, décennale) et couverts par une assurance responsabilité civile professionnelle.",
    pricing: [
      { label: "Intervention d'urgence + sécurisation", range: "200 € — 500 €" },
      { label: "Réparation fissure mur", range: "300 € — 800 €" },
      { label: "Étaiement temporaire", range: "250 € — 600 €" },
      { label: "Réparation mur de soutènement", range: "500 € — 2 000 €" },
      { label: "Bâchage + protection urgente", range: "150 € — 400 €" },
    ],
  },
};

/* ━━━ Correspondance slug → nom pour les liens internes ━━━ */
const categoryMap: Record<string, string> = {
  serrurier: "Serrurier", plombier: "Plombier", electricien: "Électricien",
  chauffagiste: "Chauffagiste", peintre: "Peintre", menuisier: "Menuisier",
  carreleur: "Carreleur", macon: "Maçon",
};

/* ━━━ Étapes du séquestre affichées dans la barre de progression ━━━ */
const escrowSteps = [
  { icon: CreditCard, title: "Paiement", desc: "Bloqué en séquestre" },
  { icon: Lock, title: "Intervention", desc: "Argent verrouillé" },
  { icon: Shield, title: "Vérification", desc: "Contrôlé par Nova" },
  { icon: CheckCircle, title: "Validation", desc: "Libéré ou remboursé" },
];

/* ━━━ Liens vers les autres pages urgence (maillage interne) ━━━ */
const urgencyTradeLinks = [
  { slug: "serrurier", label: "Serrurier" },
  { slug: "plombier", label: "Plombier" },
  { slug: "electricien", label: "Électricien" },
  { slug: "chauffagiste", label: "Chauffagiste" },
  { slug: "macon", label: "Maçon" },
];

export function TradeUrgency({ trade }: TradeUrgencyProps) {
  /* Lien de recherche filtré par métier + mode urgence */
  const searchLink = `/artisans?category=${encodeURIComponent(categoryMap[trade.slug] ?? "all")}&urgency=true`;

  /* Contenu éditorial spécifique au métier (peut être absent) */
  const content = editorialContent[trade.slug];

  return (
    <div className="min-h-screen bg-bgPage">

      {/* ══════════════════════════════════════════════
          SECTION HERO — Badges urgence, titre, CTA, barre séquestre
      ══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-5 md:px-10 pt-6 pb-10"
        style={{ background: "linear-gradient(160deg, #FFFBFB 0%, #FEF2F2 30%, #F5FAF7 100%)" }}
      >
        <div className="max-w-[700px] mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Fil d'Ariane */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-[12px] text-navy/35 mb-4">
            <Link href="/" className="hover:text-navy transition-colors">Accueil</Link>
            <span>/</span>
            <Link href={`/${trade.slug}`} className="hover:text-navy transition-colors">{trade.name}</Link>
            <span>/</span>
            <span className="text-red font-semibold">Urgence</span>
          </nav>

          {/* Badges : disponibilité 24h/24 + délai < 2h + séquestre */}
          <div className="flex flex-wrap gap-2 mb-5 justify-center">
            <div className="inline-flex items-center gap-1.5 bg-red/[0.07] border border-red/12 rounded-[5px] px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-red" />
              <span className="text-[12px] font-bold text-red">24h/24</span>
              <div className="w-px h-3 bg-red/15" />
              <Clock className="w-3 h-3 text-red" />
              <span className="text-[12px] font-bold text-red">&lt; 2h</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-forest/[0.05] border border-forest/12 rounded-[5px] px-3 py-1.5">
              <Lock className="w-3.5 h-3.5 text-forest" />
              <span className="text-[12px] font-bold text-forest">Paiement séquestre</span>
            </div>
          </div>

          {/* Titre principal + description */}
          <h1 className="font-heading text-[26px] md:text-[36px] font-extrabold text-navy leading-[1.1] tracking-[-0.5px] mb-3" style={{ textWrap: "balance" as never }}>
            {trade.urgencyHeadline}
          </h1>
          <p className="text-[15px] text-navy/50 leading-[1.7] max-w-[500px] mb-5">
            {trade.urgencyDescription}
          </p>

          {/* Exemples d'urgences courantes (tags) */}
          <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
            {trade.urgencyExamples.map((ex) => (
              <span key={ex} className="px-3 py-1.5 rounded-[5px] bg-white border border-border text-[12px] font-medium text-navy/70">
                {ex}
              </span>
            ))}
          </div>

          {/* Bouton CTA principal (ouvre la modal d'urgence) */}
          <UrgencyCtaButton tradeName={trade.name} />

          {/* Points de réassurance */}
          <div className="flex items-center gap-3.5 mt-4 flex-wrap justify-center">
            {["Artisan certifié", "Devis sur place", "Remboursé si non conforme"].map((t) => (
              <div key={t} className="flex items-center gap-1 text-[11px] text-grayText">
                <Check className="w-3 h-3 text-success" />
                {t}
              </div>
            ))}
          </div>

          {/* ── Barre de progression du séquestre ── */}
          <div className="w-full mt-10 pt-8 border-t border-border/40">
            <div className="flex items-center gap-1.5 justify-center mb-6">
              <Shield className="w-4 h-4 text-forest" />
              <h2 className="text-[14px] font-bold text-navy">Comment votre argent est protégé</h2>
            </div>

            <div className="relative max-w-[560px] mx-auto">
              {/* Ligne de progression (fond + remplie) */}
              <div className="absolute top-[14px] left-[28px] right-[28px] h-[3px] rounded-full bg-border" />
              <div className="absolute top-[14px] left-[28px] right-[28px] h-[3px] rounded-full bg-gradient-to-r from-forest via-forest/60 to-success" />

              {/* 4 étapes du séquestre */}
              <div className="relative flex justify-between">
                {escrowSteps.map((s, i) => {
                  const StepIcon = s.icon;
                  return (
                    <div key={i} className="flex flex-col items-center w-[80px]">
                      <div className="w-[30px] h-[30px] rounded-full bg-white border-[3px] border-forest flex items-center justify-center shadow-[0_0_0_3px_rgba(27,107,78,0.1)]">
                        <StepIcon className="w-3.5 h-3.5 text-forest" />
                      </div>
                      <p className="text-[11px] font-bold text-navy mt-2">{s.title}</p>
                      <p className="text-[10px] text-grayText mt-0.5 leading-snug">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-5 text-[10px] text-forest/50">
              <Lock className="w-2.5 h-2.5 inline mr-0.5 -mt-px" />
              Non conforme = remboursé sous 48h
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION ARTISANS DISPONIBLES — Grille de cartes artisan
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-10 bg-white border-t border-border/40">
        <div className="max-w-[1200px] mx-auto">
          {/* En-tête avec indicateur "En ligne" */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-[18px] md:text-[22px] font-extrabold text-navy">
                {trade.namePlural} disponibles maintenant
              </h2>
              <p className="text-[12px] text-grayText mt-0.5">Certifiés, assurés, prêts à intervenir</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] bg-success/[0.08] text-success text-[11px] font-bold shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              En ligne
            </div>
          </div>

          {/* Grille des artisans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mockUrgentArtisans.map((a) => (
              <div
                key={a.name}
                className="group bg-white border border-border rounded-[5px] p-4 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(10,64,48,0.05)] hover:border-forest/20 transition-all duration-300 text-left"
              >
                {/* Avatar + infos de l'artisan */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-deepForest to-forest flex items-center justify-center shrink-0">
                    <span className="text-white font-heading font-bold text-[11px]">{a.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-bold text-[13px] text-navy">{a.name}</h3>
                      <BadgeCheck className="w-3.5 h-3.5 text-forest shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="w-3 h-3 fill-gold text-gold" />
                      <span className="text-[11px] font-bold text-navy">{a.rating}</span>
                      <span className="text-[11px] text-grayText">({a.reviews})</span>
                      <span className="text-grayText/30">·</span>
                      <MapPin className="w-2.5 h-2.5 text-grayText" />
                      <span className="text-[11px] text-grayText">{a.city}</span>
                    </div>
                  </div>
                </div>
                {/* Certifications + temps d'arrivée estimé */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/60">
                  <div className="flex gap-1">
                    {a.certif.map((c) => (
                      <span key={c} className="px-1.5 py-0.5 rounded bg-forest/[0.06] text-[9px] font-semibold text-forest">{c}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-red/[0.06]">
                    <Clock className="w-3 h-3 text-red" />
                    <span className="text-[11px] font-bold text-red">{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lien vers la liste complète */}
          <div className="mt-4 text-center">
            <Link
              href={searchLink}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-forest hover:underline cursor-pointer"
            >
              Voir tous les {trade.namePlural.toLowerCase()}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION CONTENU ÉDITORIAL SEO — Fonctionnement + tarifs
      ══════════════════════════════════════════════ */}
      {content && (
        <section className="px-5 md:px-10 py-10 bg-bgPage border-t border-border/40">
          <div className="max-w-[800px] mx-auto">
            {/* Explication détaillée du fonctionnement */}
            <h2 className="font-heading text-[18px] md:text-[22px] font-extrabold text-navy mb-4">
              Comment fonctionne l&apos;intervention d&apos;urgence {trade.name.toLowerCase()} Nova
            </h2>
            <p className="text-[14px] text-navy/70 leading-[1.8] mb-8">
              {content.howItWorks}
            </p>

            {/* Tableau des tarifs indicatifs */}
            <h2 className="font-heading text-[18px] md:text-[22px] font-extrabold text-navy mb-4">
              Tarifs indicatifs — {trade.name.toLowerCase()} urgence
            </h2>
            <p className="text-[12px] text-grayText mb-3">
              Les tarifs ci-dessous sont indicatifs. Le devis définitif est toujours établi sur place par l&apos;artisan, avant le début de l&apos;intervention.
            </p>
            <div className="overflow-hidden rounded-[8px] border border-border">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-forest/[0.06]">
                    <th className="text-left px-4 py-2.5 font-bold text-navy">Type d&apos;intervention</th>
                    <th className="text-right px-4 py-2.5 font-bold text-navy">Fourchette de prix</th>
                  </tr>
                </thead>
                <tbody>
                  {content.pricing.map((p, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-bgPage/50"}>
                      <td className="px-4 py-2.5 text-navy/80">{p.label}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-navy">{p.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-grayText mt-2">
              * Tarifs moyens constatés en Île-de-France. Les prix peuvent varier selon la complexité et l&apos;heure d&apos;intervention.
            </p>

            <div className="mt-6 text-center">
              <Link
                href="/comment-ca-marche"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-forest hover:underline"
              >
                En savoir plus sur le fonctionnement Nova
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SECTION FAQ — Balises <details> pour le SEO (crawlable)
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-10 bg-white border-t border-border/40">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-heading text-[18px] md:text-[22px] font-extrabold text-navy mb-6">
            Questions fréquentes — {trade.name.toLowerCase()} urgence
          </h2>
          <div className="space-y-3">
            {trade.faq.map((f, i) => (
              <details
                key={i}
                className="group rounded-[8px] border border-border bg-bgPage/50 overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[14px] font-bold text-navy pr-4">{f.q}</h3>
                  <ChevronDown className="w-4 h-4 text-grayText shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-[13px] text-navy/70 leading-[1.7]">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION CTA FINAL — Fond sombre + bouton intervention
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-10 bg-gradient-to-br from-deepForest to-forest relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-50" />

        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-[12px] font-bold text-gold">Intervention en moins de 2h</span>
            </div>
            <h2 className="font-heading text-[22px] md:text-[28px] font-extrabold text-white">
              Besoin d&apos;un {trade.name.toLowerCase()} maintenant ?
            </h2>
            <div className="flex items-center gap-3 mt-2">
              {["Certifié", "Séquestre", "Devis sur place"].map((t) => (
                <span key={t} className="text-[11px] text-white/40">{t}</span>
              ))}
              <span className="text-white/20">·</span>
              <Phone className="w-3 h-3 text-white/25" />
              <span className="text-[11px] text-white/35 font-bold">01 86 65 00 00</span>
            </div>
          </div>

          {/* Bouton CTA final (ouvre la modal d'urgence) */}
          <UrgencyCtaFinal tradeName={trade.name} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION LIENS INTERNES — Maillage vers les autres urgences
      ══════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-8 bg-white border-t border-border/40">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[12px] text-grayText mb-3">Autres urgences 24h/24</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {urgencyTradeLinks
              .filter((s) => s.slug !== trade.slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}-urgence`}
                  className="px-3.5 py-2 rounded-[5px] bg-bgPage border border-border text-[12px] font-semibold text-navy hover:border-forest/30 hover:bg-surface transition-all cursor-pointer"
                >
                  {s.label} urgence
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
