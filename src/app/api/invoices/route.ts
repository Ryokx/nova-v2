export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireArtisan } from "@/lib/api-middleware";

export async function GET() {
  const { user, error } = await requireArtisan();
  if (error) return error;

  const profile = await prisma.artisanProfile.findUnique({
    where: { userId: user!.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { artisanId: profile.id },
    include: {
      mission: {
        include: { client: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}
