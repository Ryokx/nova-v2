/**
 * Route API — Authentification Pusher (temps réel)
 *
 * POST /api/pusher/auth
 *
 * Pusher exige une authentification côté serveur avant de laisser
 * un client s'abonner à un canal privé.
 *
 * Vérifications :
 * - L'utilisateur est authentifié
 * - Pour les canaux "private-user-{id}", l'ID doit correspondre au user connecté
 * - Pour les canaux mission, tout utilisateur authentifié a accès (pour l'instant)
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-middleware";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  /* Vérification de l'authentification */
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  /* Récupération des paramètres Pusher depuis le formulaire */
  const formData = await request.formData();
  const socketId = formData.get("socket_id") as string;
  const channel = formData.get("channel_name") as string;

  if (!socketId || !channel) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  /* Vérification d'accès pour les canaux privés utilisateur */
  if (channel.startsWith("private-user-")) {
    const userId = channel.replace("private-user-", "");
    if (userId !== user.id) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }
  }

  /* Autorisation du canal via le SDK Pusher côté serveur */
  const auth = pusherServer.authorizeChannel(socketId, channel);
  return NextResponse.json(auth);
}
