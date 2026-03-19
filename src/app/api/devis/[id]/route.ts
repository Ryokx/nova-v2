import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const devis = await prisma.devis.findUnique({
    where: { id: params.id },
    include: {
      mission: {
        include: {
          artisan: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!devis) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  }

  return NextResponse.json(devis);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const { status, signatureData } = body as { status?: string; signatureData?: string };

  const devis = await prisma.devis.update({
    where: { id: params.id },
    data: {
      ...(status && { status: status as never }),
      ...(signatureData && { signatureData, signedAt: new Date() }),
    },
  });

  return NextResponse.json(devis);
}
