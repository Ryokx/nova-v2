export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/api-middleware";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getAuthenticatedUser();

  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
    include: {
      artisan: {
        include: { user: { select: { id: true, name: true, avatar: true, phone: true } } },
      },
      payment: true,
      devis: true,
      invoice: true,
      review: true,
      messages: {
        include: { sender: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!mission) {
    return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
  }

  // Verify user is client or artisan of this mission
  if (user && mission.clientId !== user.id && mission.artisan.userId !== user.id) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  return NextResponse.json(mission);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body as { status?: string };

  if (status) {
    await prisma.mission.update({
      where: { id: params.id },
      data: { status: status as never },
    });
  }

  return NextResponse.json({ success: true });
}
