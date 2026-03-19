import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-middleware";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const notifications = await prisma.notification.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { id, readAll } = body as { id?: string; readAll?: boolean };

  if (readAll) {
    await prisma.notification.updateMany({
      where: { userId: user!.id, read: false },
      data: { read: true },
    });
  } else if (id) {
    await prisma.notification.updateMany({
      where: { id, userId: user!.id },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
