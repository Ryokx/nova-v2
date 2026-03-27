/**
 * Composant TradeUrgencyJsonLd — Génère les données structurées JSON-LD pour le SEO.
 *
 * Injecte 5 schémas Schema.org dans le <head> :
 * 1. FAQPage : questions/réponses fréquentes du métier
 * 2. Service : description du service d'urgence
 * 3. BreadcrumbList : fil d'Ariane (Accueil > Métier > Urgence)
 * 4. HowTo : étapes du parcours d'intervention
 * 5. Organization : informations sur Nova
 *
 * Ces schémas améliorent l'affichage dans les résultats Google (rich snippets).
 */

import type { TradeConfig } from "@/lib/trades";

/** URL de base du site (utilisée pour construire les URLs absolues) */
const BASE_URL = "https://nova.fr";

export function TradeUrgencyJsonLd({ trade }: { trade: TradeConfig }) {
  // Schéma FAQ — Affiche les questions/réponses dans les résultats Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: trade.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  // Schéma Service — Décrit le service d'urgence proposé
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${trade.name} urgence 24h/24`,
    description: trade.urgencyDescription,
    provider: {
      "@type": "Organization",
      name: "Nova",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    serviceType: `${trade.name} d'urgence`,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${BASE_URL}/${trade.slugUrgency}`,
      availableLanguage: "fr",
    },
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  };

  // Schéma Breadcrumb — Fil d'Ariane pour la navigation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: trade.name,
        item: `${BASE_URL}/${trade.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${trade.name} urgence`,
        item: `${BASE_URL}/${trade.slugUrgency}`,
      },
    ],
  };

  // Schéma HowTo — Les 4 étapes du parcours d'intervention urgente
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Comment fonctionne l'intervention d'urgence ${trade.name.toLowerCase()} Nova`,
    description: `Demandez un ${trade.name.toLowerCase()} en urgence via Nova. Paiement sécurisé par séquestre, artisan certifié, intervention en moins de 2h.`,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Décrivez votre urgence",
        text: "Indiquez le type de problème et votre adresse. Nova recherche automatiquement les artisans disponibles à proximité.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paiement sécurisé par séquestre",
        text: "Votre paiement est bloqué en séquestre Nova. L'artisan ne reçoit rien tant que vous n'avez pas validé l'intervention.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Intervention de l'artisan certifié",
        text: "Un artisan certifié (SIRET, décennale) arrive chez vous en moins de 2h. Il établit un devis sur place avant de commencer.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Validation et libération du paiement",
        text: "Après l'intervention, vous validez le travail. Le paiement est libéré vers l'artisan. Si non conforme, vous êtes remboursé sous 48h.",
      },
    ],
  };

  // Schéma Organization — Informations sur Nova (pour le Knowledge Panel Google)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nova",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: "Plateforme de mise en relation entre particuliers et artisans certifiés. Paiement sécurisé par séquestre.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+33-1-86-65-00-00",
      contactType: "customer service",
      availableLanguage: "French",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
  };

  // Injection des schémas JSON-LD dans le HTML via des balises <script>
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
