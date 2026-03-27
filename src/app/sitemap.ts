/**
 * Sitemap XML dynamique — Référencement SEO
 *
 * Génère automatiquement le sitemap avec :
 * - Pages statiques (accueil, inscription, CGU, etc.)
 * - Pages métier (une par corps de métier)
 * - Pages urgence (pour les métiers d'urgence)
 *
 * Les priorités reflètent l'importance SEO de chaque page.
 */

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nova.fr";

  // Liste de tous les métiers
  const trades = ["serrurier", "plombier", "electricien", "chauffagiste", "peintre", "menuisier", "carreleur", "macon"];

  // Métiers avec une page urgence dédiée
  const urgencyTrades = ["serrurier", "plombier", "electricien", "chauffagiste", "macon"];

  return [
    // --- Pages statiques ---
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/devenir-partenaire`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/comment-ca-marche`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/artisans`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/cgu`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },

    // --- Pages métier (landing SEO) ---
    ...trades.map((t) => ({
      url: `${baseUrl}/${t}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // --- Pages urgence (SEO haute priorité) ---
    ...urgencyTrades.map((t) => ({
      url: `${baseUrl}/${t}-urgence`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
