/**
 * Route API — Inscription d'un nouvel utilisateur
 *
 * POST /api/auth/register
 *
 * Étapes :
 * 1. Valide les données reçues (nom, email, mot de passe, rôle) avec Zod
 * 2. Vérifie qu'aucun compte n'existe déjà avec cet email
 * 3. Hash le mot de passe avec bcrypt (12 rounds)
 * 4. Crée l'utilisateur en base de données
 * 5. Retourne les infos du nouvel utilisateur (sans le mot de passe)
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    /* Validation des données d'entrée via le schéma Zod */
    const body = await request.json();
    const validated = registerSchema.parse(body);

    /* Vérification de l'unicité de l'email */
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse email" },
        { status: 409 },
      );
    }

    /* Hash du mot de passe (12 rounds de salt) */
    const passwordHash = await bcrypt.hash(validated.password, 12);

    /* Création de l'utilisateur en base */
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: validated.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    /* Erreur de validation Zod */
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error },
        { status: 400 },
      );
    }
    /* Erreur inattendue */
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
