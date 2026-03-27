/**
 * Route API — Complétion du profil utilisateur (ajout du téléphone)
 *
 * POST /api/auth/complete-profile
 *
 * Appelée après l'inscription pour ajouter le numéro de téléphone.
 * Nécessite d'être authentifié.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

/* Schéma de validation : numéro de téléphone (min 10 caractères) */
const phoneSchema = z.object({
  phone: z.string().min(10, "Numéro de téléphone invalide"),
});

export async function POST(request: Request) {
  /* Vérification de l'authentification */
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone } = phoneSchema.parse(body);

    /* Mise à jour du numéro de téléphone */
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
