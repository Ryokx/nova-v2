export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-middleware";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const formData = await request.formData();
  const socketId = formData.get("socket_id") as string;
  const channel = formData.get("channel_name") as string;

  if (!socketId || !channel) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // Verify the user has access to this channel
  if (channel.startsWith("private-user-")) {
    const userId = channel.replace("private-user-", "");
    if (userId !== user.id) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }
  }

  // For mission channels, we could verify the user is part of the mission
  // For now, allow authenticated users access to any mission channel

  const auth = pusherServer.authorizeChannel(socketId, channel);
  return NextResponse.json(auth);
}
