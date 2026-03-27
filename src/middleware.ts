/**
 * Middleware Next.js — Protection des routes par authentification
 *
 * - Les routes listées dans `matcher` passent par ce middleware
 * - Les routes /admin sont réservées aux utilisateurs avec le rôle ADMIN
 * - En développement, l'accès est autorisé sans connexion (authorized: () => true)
 * - Les routes publiques (auth, webhooks, upload, pusher) sont exclues du matcher
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Bloque l'accès admin si le rôle n'est pas ADMIN
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // En dev : autorise tout le monde (pas besoin de login)
      authorized: () => true,
    },
    pages: {
      signIn: "/login",
    },
  },
);

/** Routes protégées par le middleware */
export const config = {
  matcher: [
    // Routes client
    "/dashboard/:path*",
    "/booking/:path*",
    "/missions/:path*",
    "/mission/:path*",
    "/artisan/:path*",
    // Routes artisan
    "/artisan-dashboard/:path*",
    "/artisan-payments/:path*",
    "/artisan-documents/:path*",
    "/artisan-devis/:path*",
    "/artisan-invoices/:path*",
    "/artisan-clients/:path*",
    "/artisan-compta/:path*",
    "/artisan-profile/:path*",
    "/artisan-notifications/:path*",
    "/artisan-qr-code/:path*",
    "/artisan-subscription/:path*",
    "/artisan-addons/:path*",
    "/artisan-pricing/:path*",
    "/artisan-instant-pay/:path*",
    "/artisan-website/:path*",
    "/artisan-communication/:path*",
    "/artisan-newsletter/:path*",
    // Routes admin
    "/admin/:path*",
    // Routes API (sauf auth, webhooks, upload, pusher)
    "/api/((?!auth|webhooks|upload|pusher).*)/:path*",
  ],
};
