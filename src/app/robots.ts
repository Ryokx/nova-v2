import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/artisan-", "/api/", "/tracking/", "/mission/", "/payment/", "/sign-devis/", "/booking/"],
      },
    ],
    sitemap: "https://nova.fr/sitemap.xml",
  };
}
