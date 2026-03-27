/**
 * Configuration robots.txt — Contrôle de l'indexation par les moteurs de recherche
 *
 * Autorise l'indexation de toutes les pages publiques.
 * Bloque les espaces privés (dashboard, admin, artisan, API, etc.).
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/admin",
          "/artisan-",
          "/api/",
          "/tracking/",
          "/mission/",
          "/payment/",
          "/sign-devis/",
          "/booking/",
        ],
      },
    ],
    sitemap: "https://nova.fr/sitemap.xml",
  };
}
