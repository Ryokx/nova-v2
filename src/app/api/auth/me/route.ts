/**
 * Route API — Profil de l'utilisateur connecté
 *
 * GET  /api/auth/me — Récupère les infos du profil (+ profil artisan si applicable)
 * PUT  /api/auth/me — Met à jour le nom, téléphone ou email
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

/**
 * GET — Récupère le profil complet de l'utilisateur connecté
 * Inclut le profil artisan (métier, entreprise, note) si le rôle est ARTISAN
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
      createdAt: true,
      artisanProfile: {
        select: {
          id: true,
          trade: true,
          companyName: true,
          isVerified: true,
          rating: true,
          reviewCount: true,
          currentPlan: true,
          activeAddons: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json(user);
}

/* Schéma de validation pour la mise à jour du profil */
const updateSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100).optional(),
  phone: z.string().min(10, "Numéro de téléphone invalide").max(20).optional(),
  email: z.string().email("Email invalide").optional(),
});

/**
 * PUT — Met à jour les informations du profil utilisateur
 * Vérifie que le nouvel email n'est pas déjà pris par un autre compte
 */
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    /* Vérifie que le nouvel email n'est pas déjà utilisé */
    if (data.email) {
      const existing = await prisma.user.findFirst({
        where: { email: data.email, id: { not: session.user.id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
      }
    }

    /* Mise à jour sélective (seuls les champs fournis sont modifiés) */
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstError = err.issues[0]?.message ?? "Données invalides";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
