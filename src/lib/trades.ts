/**
 * Configuration des métiers (corps de métier) — Données SEO et landing pages
 *
 * Chaque métier contient :
 * - Infos générales (nom, slug, icône)
 * - Textes pour les pages normales et urgences
 * - Liste de services proposés
 * - FAQ pour le SEO
 * - Métadonnées SEO (title, description)
 * - Statistiques affichées (temps de réponse, note, nombre d'artisans)
 */

import {
  Droplets, Plug, KeyRound, Flame, PaintBucket, Hammer,
  LayoutGrid, Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// --- Types ---

/** Service proposé par un métier */
export interface TradeService {
  title: string;
  desc: string;
}

/** Question/réponse FAQ d'un métier */
export interface TradeFaq {
  q: string;
  a: string;
}

/** Configuration complète d'un métier */
export interface TradeConfig {
  slug: string;
  slugUrgency: string;
  name: string;
  namePlural: string;
  icon: LucideIcon;
  headline: string;
  subheadline: string;
  heroDescription: string;
  urgencyHeadline: string;
  urgencySubheadline: string;
  urgencyDescription: string;
  urgencyExamples: string[];
  services: TradeService[];
  faq: TradeFaq[];
  seo: {
    title: string;
    description: string;
    urgencyTitle: string;
    urgencyDescription: string;
  };
  avgResponseTime: string;
  avgRating: string;
  artisanCount: string;
}

// --- Données de chaque métier ---

export const trades: Record<string, TradeConfig> = {
  // ━━━ Serrurier ━━━
  serrurier: {
    slug: "serrurier",
    slugUrgency: "serrurier-urgence",
    name: "Serrurier",
    namePlural: "Serruriers",
    icon: KeyRound,
    headline: "Trouvez un serrurier certifié près de chez vous",
    subheadline: "Ouverture de porte, changement de serrure, blindage — artisans vérifiés, paiement sécurisé.",
    heroDescription: "Tous nos serruriers sont certifiés (SIRET, décennale, identité vérifiée). Votre paiement est bloqué en séquestre jusqu'à ce que l'intervention soit validée. Zéro mauvaise surprise.",
    urgencyHeadline: "Serrurier en urgence — intervention en moins de 2h",
    urgencySubheadline: "Porte claquée, serrure cassée, effraction ? Un serrurier certifié arrive chez vous.",
    urgencyDescription: "Ne restez pas enfermé dehors. Nos serruriers d'urgence sont disponibles 24h/24, 7j/7. Intervention rapide, prix transparent, paiement sécurisé par séquestre.",
    urgencyExamples: ["Porte claquée", "Serrure cassée", "Tentative d'effraction", "Clé perdue ou volée", "Porte blindée bloquée"],
    services: [
      { title: "Ouverture de porte", desc: "Porte claquée ou verrouillée, ouverture sans dégât par un professionnel qualifié." },
      { title: "Changement de serrure", desc: "Remplacement de cylindre, installation de serrure multipoints haute sécurité." },
      { title: "Blindage de porte", desc: "Pose de blindage, porte blindée, cornières anti-pinces et protection renforcée." },
      { title: "Double de clés", desc: "Reproduction de clés standard, clés brevetées et badges d'accès immeuble." },
      { title: "Réparation après effraction", desc: "Remplacement de la serrure et renforcement de la porte suite à une intrusion." },
      { title: "Installation digicode", desc: "Pose de digicode, interphone et contrôle d'accès pour copropriétés." },
    ],
    faq: [
      { q: "Combien coûte une ouverture de porte ?", a: "Le prix dépend de la serrure et de l'heure d'intervention. Le serrurier fait le devis sur place, devant vous, avant de commencer. Vous ne payez que si vous acceptez. En moyenne, une ouverture simple coûte entre 90€ et 180€." },
      { q: "Le serrurier peut-il venir en urgence la nuit ?", a: "Oui, nos serruriers d'urgence sont disponibles 24h/24, 7j/7. Un serrurier certifié peut être chez vous en moins de 2h, même en pleine nuit." },
      { q: "Comment éviter les arnaques de serruriers ?", a: "Avec Nova, c'est simple : chaque serrurier est certifié (SIRET, décennale). Le devis est fait sur place et votre paiement est bloqué en séquestre. L'artisan n'est payé qu'après votre validation." },
      { q: "Mon assurance couvre-t-elle l'intervention ?", a: "Dans la plupart des cas, oui. Votre assurance habitation couvre les interventions suite à effraction ou sinistre. Nova fournit une facture conforme pour votre déclaration." },
      { q: "Puis-je choisir mon serrurier ?", a: "Oui, vous pouvez consulter les profils, notes et avis de tous les serruriers disponibles dans votre zone et choisir celui qui vous convient." },
    ],
    seo: {
      title: "Serrurier certifié | Nova — Ouverture de porte, dépannage serrurerie",
      description: "Trouvez un serrurier certifié près de chez vous. Ouverture de porte, changement de serrure, blindage. Paiement sécurisé par séquestre. Intervention rapide.",
      urgencyTitle: "Serrurier urgence 24h/24 | Nova — Intervention en moins de 2h",
      urgencyDescription: "Porte claquée, serrure cassée ? Serrurier certifié en urgence, disponible 24h/24. Intervention en moins de 2h, paiement sécurisé par séquestre Nova.",
    },
    avgResponseTime: "25 min",
    avgRating: "4.9",
    artisanCount: "48",
  },

  // ━━━ Plombier ━━━
  plombier: {
    slug: "plombier",
    slugUrgency: "plombier-urgence",
    name: "Plombier",
    namePlural: "Plombiers",
    icon: Droplets,
    headline: "Trouvez un plombier certifié près de chez vous",
    subheadline: "Fuite d'eau, débouchage, chauffe-eau — artisans vérifiés, paiement sécurisé.",
    heroDescription: "Tous nos plombiers sont certifiés (SIRET, décennale, identité vérifiée). Votre paiement est bloqué en séquestre jusqu'à validation de l'intervention. Plus de mauvaises surprises.",
    urgencyHeadline: "Plombier en urgence — intervention en moins de 2h",
    urgencySubheadline: "Fuite d'eau, canalisation bouchée, dégât des eaux ? Un plombier certifié arrive chez vous.",
    urgencyDescription: "Chaque minute compte lors d'une fuite. Nos plombiers d'urgence sont disponibles 24h/24, 7j/7. Intervention rapide, devis sur place, paiement sécurisé.",
    urgencyExamples: ["Fuite d'eau", "Canalisation bouchée", "Dégât des eaux", "Chauffe-eau en panne", "WC bouchés"],
    services: [
      { title: "Réparation de fuite", desc: "Détection et réparation de fuites sur tuyauterie, raccords, joints et vannes." },
      { title: "Débouchage", desc: "Débouchage de canalisations, WC, éviers et douches par hydrocurage ou furet." },
      { title: "Chauffe-eau", desc: "Installation, réparation et remplacement de chauffe-eau électrique ou thermodynamique." },
      { title: "Robinetterie", desc: "Remplacement de robinets, mitigeurs, douchettes et colonnes de douche." },
      { title: "Installation sanitaire", desc: "Pose de WC, lavabo, baignoire, douche à l'italienne et receveur." },
      { title: "Recherche de fuite", desc: "Détection non destructive par caméra thermique et gaz traceur." },
    ],
    faq: [
      { q: "Combien coûte un dépannage plomberie ?", a: "Le tarif dépend de l'intervention. Le plombier établit un devis sur place, devant vous. En moyenne, un dépannage simple coûte entre 80€ et 250€. Vous ne payez que si vous acceptez le devis." },
      { q: "Le plombier peut-il intervenir en urgence ?", a: "Oui, nos plombiers d'urgence interviennent 24h/24 et 7j/7. Temps moyen d'arrivée : 35 minutes." },
      { q: "Comment couper l'eau en cas de fuite ?", a: "Fermez immédiatement le robinet d'arrêt général (souvent sous l'évier de la cuisine ou dans les toilettes). Si la fuite vient d'un appareil, fermez le robinet d'arrêt de l'appareil. Puis contactez un plombier d'urgence via Nova." },
      { q: "Mon assurance couvre-t-elle le dégât des eaux ?", a: "Oui, la plupart des assurances habitation couvrent les dégâts des eaux. Nova fournit une facture détaillée conforme pour votre déclaration de sinistre." },
      { q: "Puis-je demander un devis avant intervention ?", a: "Oui, le devis est toujours fait sur place, devant vous, avant le début des travaux. Pas de devis par téléphone — c'est notre règle pour éviter les mauvaises surprises." },
    ],
    seo: {
      title: "Plombier certifié | Nova — Dépannage, fuite, installation plomberie",
      description: "Trouvez un plombier certifié près de chez vous. Fuite d'eau, débouchage, chauffe-eau. Paiement sécurisé par séquestre. Intervention rapide 24h/24.",
      urgencyTitle: "Plombier urgence 24h/24 | Nova — Intervention en moins de 2h",
      urgencyDescription: "Fuite d'eau, canalisation bouchée ? Plombier certifié en urgence 24h/24. Intervention en moins de 2h, paiement sécurisé par séquestre Nova.",
    },
    avgResponseTime: "35 min",
    avgRating: "4.8",
    artisanCount: "62",
  },

  // ━━━ Électricien ━━━
  electricien: {
    slug: "electricien",
    slugUrgency: "electricien-urgence",
    name: "Électricien",
    namePlural: "Électriciens",
    icon: Plug,
    headline: "Trouvez un électricien certifié près de chez vous",
    subheadline: "Panne électrique, tableau, prises — artisans vérifiés, paiement sécurisé.",
    heroDescription: "Tous nos électriciens sont certifiés (SIRET, décennale, identité vérifiée). Votre paiement est sécurisé par séquestre jusqu'à validation. Travaux aux normes NF C 15-100.",
    urgencyHeadline: "Électricien en urgence — intervention en moins de 2h",
    urgencySubheadline: "Panne de courant, court-circuit, odeur de brûlé ? Un électricien certifié intervient.",
    urgencyDescription: "Une panne électrique peut être dangereuse. Nos électriciens d'urgence sont disponibles 24h/24 pour sécuriser votre installation. Intervention rapide, paiement sécurisé.",
    urgencyExamples: ["Panne de courant", "Court-circuit", "Tableau qui disjoncte", "Odeur de brûlé électrique", "Prise ou interrupteur HS"],
    services: [
      { title: "Dépannage électrique", desc: "Diagnostic et réparation de pannes, courts-circuits et défauts d'isolement." },
      { title: "Tableau électrique", desc: "Mise aux normes, remplacement et installation de tableau électrique NF C 15-100." },
      { title: "Prises et interrupteurs", desc: "Installation, remplacement et déplacement de prises, interrupteurs et points lumineux." },
      { title: "Éclairage", desc: "Installation de luminaires, spots encastrés, LED et éclairage extérieur." },
      { title: "Mise aux normes", desc: "Diagnostic et mise en conformité de votre installation électrique." },
      { title: "Borne de recharge", desc: "Installation de borne de recharge pour véhicule électrique à domicile." },
    ],
    faq: [
      { q: "Combien coûte un dépannage électrique ?", a: "Le prix varie selon la panne. Le diagnostic est fait sur place avec un devis avant intervention. Un dépannage simple coûte en moyenne 100€ à 300€." },
      { q: "Mon tableau disjoncte souvent, que faire ?", a: "C'est souvent un signe de surcharge ou d'un appareil défectueux. Un électricien certifié peut diagnostiquer le problème et mettre votre installation aux normes." },
      { q: "L'électricien peut-il venir en urgence ?", a: "Oui, nos électriciens sont disponibles 24h/24 en urgence. Temps moyen d'intervention : 40 minutes." },
      { q: "Les travaux sont-ils aux normes ?", a: "Tous nos électriciens respectent la norme NF C 15-100. Chaque intervention est documentée et un certificat de conformité peut être fourni." },
      { q: "Puis-je faire installer une borne de recharge ?", a: "Oui, nos électriciens sont qualifiés IRVE pour l'installation de bornes de recharge à domicile." },
    ],
    seo: {
      title: "Électricien certifié | Nova — Dépannage, installation électrique",
      description: "Trouvez un électricien certifié près de chez vous. Panne, tableau électrique, prises. Travaux aux normes NF C 15-100. Paiement sécurisé par séquestre.",
      urgencyTitle: "Électricien urgence 24h/24 | Nova — Intervention en moins de 2h",
      urgencyDescription: "Panne de courant, court-circuit ? Électricien certifié en urgence 24h/24. Intervention en moins de 2h. Paiement sécurisé par séquestre Nova.",
    },
    avgResponseTime: "40 min",
    avgRating: "4.8",
    artisanCount: "53",
  },

  // ━━━ Chauffagiste ━━━
  chauffagiste: {
    slug: "chauffagiste",
    slugUrgency: "chauffagiste-urgence",
    name: "Chauffagiste",
    namePlural: "Chauffagistes",
    icon: Flame,
    headline: "Trouvez un chauffagiste certifié près de chez vous",
    subheadline: "Chaudière, radiateurs, pompe à chaleur — artisans RGE vérifiés, paiement sécurisé.",
    heroDescription: "Tous nos chauffagistes sont certifiés (SIRET, décennale, RGE). Installation, entretien et dépannage de chaudière, pompe à chaleur et radiateurs. Paiement sécurisé.",
    urgencyHeadline: "Chauffagiste en urgence — intervention en moins de 2h",
    urgencySubheadline: "Panne de chauffage, fuite de gaz, chaudière en panne ? Un chauffagiste certifié intervient.",
    urgencyDescription: "En plein hiver, une panne de chauffage est une urgence. Nos chauffagistes sont disponibles 24h/24. Intervention rapide, diagnostic sur place, paiement sécurisé.",
    urgencyExamples: ["Panne de chaudière", "Fuite de gaz", "Radiateur qui ne chauffe pas", "Chauffage au sol en panne", "Pompe à chaleur HS"],
    services: [
      { title: "Dépannage chaudière", desc: "Diagnostic et réparation de chaudière gaz, fioul et condensation." },
      { title: "Entretien annuel", desc: "Révision obligatoire de chaudière avec certificat de conformité." },
      { title: "Pompe à chaleur", desc: "Installation, entretien et dépannage de PAC air/eau et air/air." },
      { title: "Radiateurs", desc: "Installation, remplacement et désembouage de radiateurs." },
      { title: "Plancher chauffant", desc: "Installation et réparation de chauffage au sol hydraulique ou électrique." },
      { title: "Climatisation", desc: "Installation et entretien de climatisation réversible." },
    ],
    faq: [
      { q: "Combien coûte un dépannage de chaudière ?", a: "Le diagnostic est fait sur place avec un devis avant intervention. Un dépannage simple coûte en moyenne 120€ à 350€ selon la panne." },
      { q: "L'entretien annuel est-il obligatoire ?", a: "Oui, l'entretien annuel de votre chaudière est obligatoire par la loi. Nos chauffagistes fournissent un certificat de conformité valable pour votre assurance." },
      { q: "Le chauffagiste est-il certifié RGE ?", a: "La majorité de nos chauffagistes sont certifiés RGE, ce qui vous permet de bénéficier des aides de l'État (MaPrimeRénov', CEE)." },
      { q: "Que faire en cas d'odeur de gaz ?", a: "Ouvrez les fenêtres, n'allumez rien, coupez le gaz au compteur et sortez du logement. Appelez GRDF au 0 800 47 33 33 puis contactez un chauffagiste via Nova." },
      { q: "Combien coûte l'installation d'une pompe à chaleur ?", a: "L'installation d'une PAC coûte entre 8 000€ et 15 000€ selon le modèle, mais les aides peuvent réduire la facture de 40 à 60%." },
    ],
    seo: {
      title: "Chauffagiste certifié | Nova — Chaudière, pompe à chaleur, dépannage",
      description: "Trouvez un chauffagiste certifié RGE. Dépannage chaudière, installation pompe à chaleur, entretien annuel. Paiement sécurisé par séquestre Nova.",
      urgencyTitle: "Chauffagiste urgence 24h/24 | Nova — Intervention en moins de 2h",
      urgencyDescription: "Panne de chaudière, fuite de gaz ? Chauffagiste certifié en urgence 24h/24. Intervention en moins de 2h. Paiement sécurisé Nova.",
    },
    avgResponseTime: "45 min",
    avgRating: "4.9",
    artisanCount: "37",
  },

  // ━━━ Peintre ━━━
  peintre: {
    slug: "peintre",
    slugUrgency: "peintre-urgence",
    name: "Peintre",
    namePlural: "Peintres",
    icon: PaintBucket,
    headline: "Trouvez un peintre certifié près de chez vous",
    subheadline: "Peinture intérieure, extérieure, enduits — artisans vérifiés, paiement sécurisé.",
    heroDescription: "Tous nos peintres sont certifiés (SIRET, décennale). Peinture intérieure, ravalement de façade, enduits décoratifs. Devis sur place, paiement sécurisé par séquestre.",
    urgencyHeadline: "Peintre en urgence — intervention rapide",
    urgencySubheadline: "Dégât des eaux, sinistre ? Un peintre certifié intervient rapidement.",
    urgencyDescription: "Après un dégât des eaux ou un sinistre, la remise en état rapide de vos murs est essentielle. Nos peintres peuvent intervenir rapidement.",
    urgencyExamples: ["Dégât des eaux", "Remise en état après sinistre", "Tache d'humidité", "Mur abîmé", "Plafond endommagé"],
    services: [
      { title: "Peinture intérieure", desc: "Peinture de murs, plafonds, boiseries et radiateurs en finition soignée." },
      { title: "Peinture extérieure", desc: "Ravalement de façade, peinture de volets, portails et balcons." },
      { title: "Enduits décoratifs", desc: "Enduit à la chaux, béton ciré, stucco et effets texturés." },
      { title: "Tapisserie", desc: "Pose et dépose de papier peint, toile de verre et revêtements muraux." },
      { title: "Lessivage & préparation", desc: "Lessivage, ponçage, rebouchage et préparation de surfaces." },
      { title: "Conseil couleur", desc: "Aide au choix des couleurs et finitions pour votre intérieur." },
    ],
    faq: [
      { q: "Combien coûte la peinture d'une pièce ?", a: "En moyenne entre 25€ et 45€/m² (fourniture et main-d'œuvre). Le peintre évalue sur place la surface exacte et fait un devis détaillé." },
      { q: "Combien de temps prend la peinture d'un appartement ?", a: "Un T2 prend en général 3 à 5 jours. Le peintre vous donne un planning précis après son devis sur place." },
      { q: "Le peintre fournit-il la peinture ?", a: "Oui, le peintre fournit généralement la peinture de qualité professionnelle. Le coût est inclus dans le devis." },
      { q: "Faut-il vider les meubles avant ?", a: "Idéalement oui, ou au moins les regrouper au centre de la pièce. Le peintre protège le sol et les meubles avec des bâches." },
      { q: "Quelle peinture choisir pour une cuisine ?", a: "Une peinture satinée ou brillante, lessivable et résistante à l'humidité. Le peintre vous conseillera sur le meilleur produit." },
    ],
    seo: {
      title: "Peintre certifié | Nova — Peinture intérieure, extérieure, enduits",
      description: "Trouvez un peintre certifié près de chez vous. Peinture intérieure, extérieure, enduits décoratifs. Devis sur place, paiement sécurisé par séquestre.",
      urgencyTitle: "Peintre urgence | Nova — Intervention rapide après sinistre",
      urgencyDescription: "Dégât des eaux, sinistre ? Peintre certifié pour intervention rapide. Remise en état, peinture, enduits. Paiement sécurisé par séquestre Nova.",
    },
    avgResponseTime: "2h",
    avgRating: "4.7",
    artisanCount: "41",
  },

  // ━━━ Menuisier ━━━
  menuisier: {
    slug: "menuisier",
    slugUrgency: "menuisier-urgence",
    name: "Menuisier",
    namePlural: "Menuisiers",
    icon: Hammer,
    headline: "Trouvez un menuisier certifié près de chez vous",
    subheadline: "Portes, fenêtres, placards sur mesure — artisans vérifiés, paiement sécurisé.",
    heroDescription: "Tous nos menuisiers sont certifiés (SIRET, décennale). Pose de portes, fenêtres, placards sur mesure et parquet. Devis sur place, paiement sécurisé.",
    urgencyHeadline: "Menuisier en urgence — intervention rapide",
    urgencySubheadline: "Porte défoncée, fenêtre cassée ? Un menuisier certifié intervient rapidement.",
    urgencyDescription: "Porte arrachée, volet cassé par la tempête ? Nos menuisiers interviennent rapidement pour sécuriser votre logement. Paiement sécurisé.",
    urgencyExamples: ["Porte défoncée", "Fenêtre cassée", "Volet arraché", "Parquet soulevé", "Escalier endommagé"],
    services: [
      { title: "Portes intérieures", desc: "Pose, remplacement et ajustement de portes intérieures, coulissantes et battantes." },
      { title: "Fenêtres", desc: "Installation et remplacement de fenêtres bois, PVC et aluminium." },
      { title: "Placards sur mesure", desc: "Conception et pose de placards, dressings et rangements sur mesure." },
      { title: "Parquet", desc: "Pose, rénovation et vitrification de parquet massif et contrecollé." },
      { title: "Escaliers", desc: "Fabrication et pose d'escaliers bois, rénovation de marches et garde-corps." },
      { title: "Terrasse bois", desc: "Construction de terrasses et bardage en bois traité ou composite." },
    ],
    faq: [
      { q: "Combien coûte la pose d'une porte intérieure ?", a: "Entre 150€ et 400€ pose comprise selon le type de porte. Le menuisier fait un devis sur place." },
      { q: "Combien coûte un placard sur mesure ?", a: "Entre 500€ et 2 500€ selon les dimensions et les finitions. Devis détaillé après prise de mesures." },
      { q: "Le menuisier peut-il rénover un vieux parquet ?", a: "Oui, nos menuisiers rénovent les parquets anciens : ponçage, vitrification, huilage ou cirage." },
      { q: "Combien de temps prend la pose de fenêtres ?", a: "1 à 2 heures par fenêtre en moyenne. Un appartement complet se fait en 1 à 2 jours." },
      { q: "Quels matériaux pour les fenêtres ?", a: "Bois, PVC ou aluminium. Le menuisier vous conseillera selon votre budget, l'isolation souhaitée et l'esthétique." },
    ],
    seo: {
      title: "Menuisier certifié | Nova — Portes, fenêtres, placards sur mesure",
      description: "Trouvez un menuisier certifié. Pose de portes, fenêtres, placards sur mesure, parquet. Devis sur place, paiement sécurisé par séquestre Nova.",
      urgencyTitle: "Menuisier urgence | Nova — Intervention rapide",
      urgencyDescription: "Porte défoncée, fenêtre cassée ? Menuisier certifié en urgence pour sécuriser votre logement. Paiement sécurisé par séquestre Nova.",
    },
    avgResponseTime: "1h30",
    avgRating: "4.6",
    artisanCount: "29",
  },

  // ━━━ Carreleur ━━━
  carreleur: {
    slug: "carreleur",
    slugUrgency: "carreleur-urgence",
    name: "Carreleur",
    namePlural: "Carreleurs",
    icon: LayoutGrid,
    headline: "Trouvez un carreleur certifié près de chez vous",
    subheadline: "Carrelage sol et mur, faïence, mosaïque — artisans vérifiés, paiement sécurisé.",
    heroDescription: "Tous nos carreleurs sont certifiés (SIRET, décennale). Pose de carrelage sol et mur, faïence de salle de bain, mosaïque décorative. Paiement sécurisé par séquestre.",
    urgencyHeadline: "Carreleur en urgence — intervention rapide",
    urgencySubheadline: "Carrelage fissuré, infiltration ? Un carreleur certifié intervient rapidement.",
    urgencyDescription: "Un carrelage cassé peut provoquer des infiltrations. Nos carreleurs interviennent rapidement pour réparer et éviter les dégâts.",
    urgencyExamples: ["Carrelage fissuré", "Infiltration d'eau", "Joints abîmés", "Carreaux décollés", "Réparation urgente douche"],
    services: [
      { title: "Carrelage sol", desc: "Pose de carrelage, grès cérame, pierre naturelle et grands formats." },
      { title: "Faïence murale", desc: "Pose de faïence de salle de bain, cuisine et crédence." },
      { title: "Mosaïque", desc: "Pose de mosaïque décorative, piscine et douche à l'italienne." },
      { title: "Joints", desc: "Réfection de joints, étanchéité et traitement anti-moisissure." },
      { title: "Ragréage", desc: "Préparation et ragréage de sol avant pose de revêtement." },
      { title: "Terrasse extérieure", desc: "Pose de dalles et carrelage extérieur antidérapant." },
    ],
    faq: [
      { q: "Combien coûte la pose de carrelage ?", a: "Entre 30€ et 70€/m² (pose seule) selon le type et le format. Le carreleur fait un devis après visite." },
      { q: "Combien de temps prend la pose ?", a: "Une salle de bain complète prend 3 à 5 jours. Un sol de pièce standard 1 à 2 jours." },
      { q: "Le carreleur fournit-il le carrelage ?", a: "Il peut le fournir ou travailler avec un carrelage que vous avez choisi. Il vous conseillera sur les quantités et la qualité." },
      { q: "Peut-on poser du carrelage sur du carrelage existant ?", a: "Oui, c'est possible si le sol existant est sain et bien adhérent. Le carreleur évalue la faisabilité sur place." },
      { q: "Quel carrelage choisir pour une salle de bain ?", a: "Un carrelage antidérapant classe B ou C minimum. Le carreleur vous oriente sur les bonnes options." },
    ],
    seo: {
      title: "Carreleur certifié | Nova — Carrelage sol, faïence, mosaïque",
      description: "Trouvez un carreleur certifié. Pose de carrelage sol et mur, faïence, mosaïque. Devis sur place, paiement sécurisé par séquestre Nova.",
      urgencyTitle: "Carreleur urgence | Nova — Intervention rapide",
      urgencyDescription: "Carrelage fissuré, infiltration ? Carreleur certifié pour intervention rapide. Réparation, joints, étanchéité. Paiement sécurisé Nova.",
    },
    avgResponseTime: "2h",
    avgRating: "4.7",
    artisanCount: "25",
  },

  // ━━━ Maçon ━━━
  macon: {
    slug: "macon",
    slugUrgency: "macon-urgence",
    name: "Maçon",
    namePlural: "Maçons",
    icon: Wrench,
    headline: "Trouvez un maçon certifié près de chez vous",
    subheadline: "Murs, terrasses, fondations, rénovation — artisans vérifiés, paiement sécurisé.",
    heroDescription: "Tous nos maçons sont certifiés (SIRET, décennale). Construction de murs, terrasses, rénovation et gros œuvre. Devis détaillé sur place, paiement sécurisé.",
    urgencyHeadline: "Maçon en urgence — intervention rapide",
    urgencySubheadline: "Fissure structurelle, effondrement, dégât ? Un maçon certifié intervient rapidement.",
    urgencyDescription: "Un problème structurel peut être dangereux. Nos maçons d'urgence interviennent pour sécuriser, étayer et réparer. Paiement sécurisé.",
    urgencyExamples: ["Fissure de mur", "Effondrement partiel", "Mur de soutènement abîmé", "Dégât après sinistre", "Problème de fondation"],
    services: [
      { title: "Construction de murs", desc: "Murs porteurs, cloisons, murs de clôture en parpaing, brique ou pierre." },
      { title: "Terrasses", desc: "Construction de terrasses en béton, dalles et aménagements extérieurs." },
      { title: "Rénovation", desc: "Rénovation de maçonnerie ancienne, rejointoiement et ravalement." },
      { title: "Fondations", desc: "Coulage de fondations, dalles béton et vide sanitaire." },
      { title: "Ouvertures", desc: "Création d'ouverture dans mur porteur avec pose de linteau IPN." },
      { title: "Démolition", desc: "Démolition de cloisons, murs et structures avec évacuation des gravats." },
    ],
    faq: [
      { q: "Combien coûte la construction d'un mur ?", a: "Entre 40€ et 120€/m² selon le matériau (parpaing, brique, pierre). Le maçon fait un devis détaillé après visite." },
      { q: "Peut-on ouvrir un mur porteur ?", a: "Oui, avec un bureau d'études et un IPN. Le maçon coordonne l'intervention et garantit la stabilité de la structure." },
      { q: "Combien de temps prend une terrasse ?", a: "Une terrasse béton de 20m² prend 3 à 5 jours. Le maçon vous donne un planning après devis." },
      { q: "Le maçon gère-t-il l'évacuation des gravats ?", a: "Oui, l'évacuation des gravats et le nettoyage de chantier sont inclus dans le devis." },
      { q: "Faut-il un permis pour une extension ?", a: "Pour une extension de moins de 20m², une déclaration préalable suffit. Au-delà, un permis de construire est nécessaire." },
    ],
    seo: {
      title: "Maçon certifié | Nova — Construction, rénovation, terrasses",
      description: "Trouvez un maçon certifié. Construction murs, terrasses, fondations, rénovation. Devis détaillé sur place, paiement sécurisé par séquestre Nova.",
      urgencyTitle: "Maçon urgence | Nova — Intervention rapide",
      urgencyDescription: "Fissure structurelle, effondrement ? Maçon certifié en urgence pour sécuriser votre bâtiment. Paiement sécurisé par séquestre Nova.",
    },
    avgResponseTime: "2h",
    avgRating: "4.9",
    artisanCount: "31",
  },
};

/** Liste de tous les métiers sous forme de tableau */
export const tradeList = Object.values(trades);

/** Récupère la config d'un métier par son slug */
export function getTradeBySlug(slug: string): TradeConfig | undefined {
  return trades[slug];
}

/** Métiers disponibles en page urgence */
export const urgencyTrades = ["serrurier", "plombier", "electricien", "chauffagiste", "macon"] as const;
