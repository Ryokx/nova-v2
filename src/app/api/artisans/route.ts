import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { isAvailable: true };

  if (category && category !== "all") {
    where.trade = { contains: category, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { trade: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const artisans = await prisma.artisanProfile.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { rating: "desc" },
  });

  return NextResponse.json(artisans);
}
