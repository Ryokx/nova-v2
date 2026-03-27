/**
 * Pusher — Communication temps réel
 *
 * Utilisé pour :
 * - Chat en direct entre client et artisan (par mission)
 * - Suivi en temps réel du statut d'une mission
 * - Notifications push utilisateur
 *
 * Le serveur envoie les événements, le client les reçoit via un singleton.
 */

import PusherServer from "pusher";
import PusherClient from "pusher-js";

// --- Instance serveur (utilisée dans les API routes) ---
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID ?? "",
  key: process.env.PUSHER_KEY ?? "",
  secret: process.env.PUSHER_SECRET ?? "",
  cluster: process.env.PUSHER_CLUSTER ?? "eu",
  useTLS: true,
});

// --- Instance client (singleton, utilisée côté navigateur) ---
let pusherClientInstance: PusherClient | null = null;

/** Retourne l'instance Pusher côté client (crée le singleton si nécessaire) */
export function getPusherClient(): PusherClient {
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
        channelAuthorization: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
      },
    );
  }
  return pusherClientInstance;
}

// --- Noms des canaux (conventions de nommage) ---
export const channels = {
  /** Canal privé de chat pour une mission */
  missionChat: (missionId: string) => `private-mission-${missionId}`,
  /** Canal privé pour le suivi de mission */
  missionTracking: (missionId: string) => `private-tracking-${missionId}`,
  /** Canal privé pour les notifications utilisateur */
  userNotifications: (userId: string) => `private-user-${userId}`,
};

// --- Noms des événements ---
export const events = {
  NEW_MESSAGE: "new-message",
  STATUS_UPDATE: "status-update",
  NOTIFICATION: "notification",
  TYPING: "client-typing",
};

// --- Fonctions d'envoi côté serveur ---

/** Envoie un message de chat dans le canal d'une mission */
export async function sendChatMessage(missionId: string, message: {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
}) {
  await pusherServer.trigger(channels.missionChat(missionId), events.NEW_MESSAGE, message);
}

/** Envoie une mise à jour de statut pour une mission */
export async function sendStatusUpdate(missionId: string, update: {
  status: string;
  timestamp: string;
  message?: string;
}) {
  await pusherServer.trigger(channels.missionTracking(missionId), events.STATUS_UPDATE, update);
}

/** Envoie une notification push à un utilisateur */
export async function sendNotification(userId: string, notification: {
  id: string;
  type: string;
  title: string;
  body: string;
}) {
  await pusherServer.trigger(channels.userNotifications(userId), events.NOTIFICATION, notification);
}
