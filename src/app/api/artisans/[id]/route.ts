export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const artisan = await prisma.artisanProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, avatar: true, phone: true } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      documents: {
        where: { verified: true },
        select: { type: true, verified: true },
      },
    },
  });

  if (!artisan) {
    return NextResponse.json({ error: "Artisan introuvable" }, { status: 404 });
  }

  return NextResponse.json(artisan);
}
