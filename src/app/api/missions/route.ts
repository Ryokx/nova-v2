export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";
import { z } from "zod";

const createMissionSchema = z.object({
  artisanId: z.string(),
  type: z.string().min(1),
  category: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  scheduledDate: z.string().optional(),
  scheduledSlot: z.string().optional(),
});

export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { clientId: user!.id };
  if (status && status !== "all") {
    where.status = status;
  }

  const missions = await prisma.mission.findMany({
    where,
    include: {
      artisan: {
        include: { user: { select: { name: true, avatar: true } } },
      },
      payment: true,
      devis: true,
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(missions);
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createMissionSchema.parse(body);

    const mission = await prisma.mission.create({
      data: {
        clientId: user!.id,
        artisanId: data.artisanId,
        type: data.type,
        category: data.category,
        description: data.description,
        address: data.address,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
        scheduledSlot: data.scheduledSlot,
      },
      include: {
        artisan: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    return NextResponse.json(mission, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: err.issues }, { status: 400 });
    }
    console.error("Create mission error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
