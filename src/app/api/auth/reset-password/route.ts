/**
 * Route API — Réinitialisation du mot de passe
 *
 * POST /api/auth/reset-password
 *
 * Étapes :
 * 1. Reçoit le token, l'email et le nouveau mot de passe
 * 2. Valide la robustesse du mot de passe (8+ car., 1 majuscule, 1 chiffre)
 * 3. Vérifie que le token hashé correspond et n'est pas expiré
 * 4. Met à jour le mot de passe de l'utilisateur
 * 5. Supprime le token utilisé
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

/* Regex : au moins 8 caractères, 1 majuscule, 1 chiffre */
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, email, password } = body as {
      token?: string;
      email?: string;
      password?: string;
    };

    /* Vérification que tous les champs sont fournis */
    if (!token || !email || !password) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 },
      );
    }

    /* Vérification de la robustesse du mot de passe */
    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        {
          error:
            "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    /* Hash du token reçu pour le comparer avec celui stocké en base */
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    /* Recherche d'un token valide (non expiré) pour cet email */
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token: hashedToken,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Lien expiré ou invalide" },
        { status: 400 },
      );
    }

    /* Hash du nouveau mot de passe */
    const passwordHash = await bcrypt.hash(password, 12);

    /* Mise à jour du mot de passe en base */
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { passwordHash },
    });

    /* Suppression du token utilisé (usage unique) */
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: normalizedEmail,
          token: hashedToken,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
