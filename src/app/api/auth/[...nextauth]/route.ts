/**
 * Route API NextAuth — Point d'entrée pour l'authentification
 *
 * Gère automatiquement les endpoints GET et POST de NextAuth :
 * - GET  : page de connexion, callback OAuth, déconnexion
 * - POST : soumission du formulaire de connexion, callback OAuth
 *
 * La configuration complète (providers, callbacks) est dans /lib/auth.ts
 */

export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/* Création du handler NextAuth avec la config centralisée */
const handler = NextAuth(authOptions);

/* Export du même handler pour GET et POST */
export { handler as GET, handler as POST };
