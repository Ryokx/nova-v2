/**
 * Middleware API — Vérification d'authentification et de rôle
 *
 * Fonctions utilitaires pour sécuriser les routes API :
 * - getAuthenticatedUser() : récupère l'utilisateur connecté
 * - requireAuth() : exige une authentification
 * - requireRole() / requireArtisan() / requireClient() / requireAdmin() : exige un rôle
 *
 * Retourne des réponses JSON normalisées (401, 403) en cas d'erreur.
 */

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/** Récupère l'utilisateur authentifié depuis la session, ou null */
export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session.user;
}

/** Réponse 401 — Non authentifié */
export function unauthorized() {
  return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
}

/** Réponse 403 — Accès interdit */
export function forbidden() {
  return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
}

/** Exige une authentification. Retourne l'utilisateur ou une erreur 401. */
export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) return { user: null, error: unauthorized() };
  return { user, error: null };
}

/** Exige un rôle spécifique. Retourne l'utilisateur ou une erreur 401/403. */
export async function requireRole(role: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { user: null, error: unauthorized() };
  if (user.role !== role) return { user: null, error: forbidden() };
  return { user, error: null };
}

/** Raccourci : exige le rôle ARTISAN */
export async function requireArtisan() {
  return requireRole("ARTISAN");
}

/** Raccourci : exige le rôle CLIENT */
export async function requireClient() {
  return requireRole("CLIENT");
}

/** Raccourci : exige le rôle ADMIN */
export async function requireAdmin() {
  return requireRole("ADMIN");
}
