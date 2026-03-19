import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session.user;
}

export function unauthorized() {
  return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) return { user: null, error: unauthorized() };
  return { user, error: null };
}

export async function requireRole(role: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { user: null, error: unauthorized() };
  if (user.role !== role) return { user: null, error: forbidden() };
  return { user, error: null };
}

export async function requireArtisan() {
  return requireRole("ARTISAN");
}

export async function requireClient() {
  return requireRole("CLIENT");
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}
