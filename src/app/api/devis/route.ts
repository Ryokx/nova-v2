/**
 * Route API — Gestion des devis (côté artisan)
 *
 * GET  /api/devis  — Liste tous les devis de l'artisan connecté
 * POST /api/devis  — Crée un nouveau devis pour une mission
 *
 * Un devis contient les lignes de facturation (items), les montants HT/TTC,
 * et un numéro auto-généré (ex: DEV-2026-001).
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireArtisan } from "@/lib/api-middleware";
import { z } from "zod";

/* Schéma d'une ligne de devis */
const lineItemSchema = z.object({
  label: z.string(),
  qty: z.number().positive(),
  unitPrice: z.number().positive(),
  total: z.number(),
});

/* Schéma complet pour la création d'un devis */
const createDevisSchema = z.object({
  missionId: z.string(),
  clientId: z.string(),
  items: z.array(lineItemSchema).min(1),
  totalHT: z.number(),
  totalTTC: z.number(),
  tva: z.number(),
  validUntil: z.string().optional(),
  message: z.string().optional(),
});

/**
 * GET — Liste les devis de l'artisan connecté
 * Inclut les infos de la mission et du client associé
 */
export async function GET() {
  const { user, error } = await requireArtisan();
  if (error) return error;

  /* Récupération du profil artisan */
  const profile = await prisma.artisanProfile.findUnique({
    where: { userId: user!.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  const devis = await prisma.devis.findMany({
    where: { artisanId: profile.id },
    include: {
      mission: {
        include: { client: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(devis);
}

/**
 * POST — Crée un nouveau devis
 * Génère automatiquement un numéro de devis séquentiel (DEV-AAAA-NNN)
 */
export async function POST(request: Request) {
  const { user, error } = await requireArtisan();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createDevisSchema.parse(body);

    const profile = await prisma.artisanProfile.findUnique({
      where: { userId: user!.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    /* Génération du numéro de devis : DEV-AAAA-NNN */
    const count = await prisma.devis.count({ where: { artisanId: profile.id } });
    const number = `DEV-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    /* Création du devis avec une validité par défaut de 30 jours */
    const devis = await prisma.devis.create({
      data: {
        missionId: data.missionId,
        artisanId: profile.id,
        clientId: data.clientId,
        number,
        items: data.items,
        totalHT: data.totalHT,
        totalTTC: data.totalTTC,
        tva: data.tva,
        status: "SENT",
        validUntil: data.validUntil ? new Date(data.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(devis, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: err.issues }, { status: 400 });
    }
    console.error("Create devis error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
