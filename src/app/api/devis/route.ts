import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireArtisan } from "@/lib/api-middleware";
import { z } from "zod";

const lineItemSchema = z.object({
  label: z.string(),
  qty: z.number().positive(),
  unitPrice: z.number().positive(),
  total: z.number(),
});

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

export async function GET() {
  const { user, error } = await requireArtisan();
  if (error) return error;

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

    // Generate devis number
    const count = await prisma.devis.count({ where: { artisanId: profile.id } });
    const number = `DEV-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

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
