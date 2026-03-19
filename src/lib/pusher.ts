import PusherServer from "pusher";
import PusherClient from "pusher-js";

/**
 * Server-side Pusher instance
 */
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID ?? "",
  key: process.env.PUSHER_KEY ?? "",
  secret: process.env.PUSHER_SECRET ?? "",
  cluster: process.env.PUSHER_CLUSTER ?? "eu",
  useTLS: true,
});

/**
 * Client-side Pusher instance (singleton)
 */
let pusherClientInstance: PusherClient | null = null;

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

// ━━━ Channel naming conventions ━━━
export const channels = {
  /** Private chat channel for a mission */
  missionChat: (missionId: string) => `private-mission-${missionId}`,

  /** Private channel for tracking updates */
  missionTracking: (missionId: string) => `private-tracking-${missionId}`,

  /** Private channel for user notifications */
  userNotifications: (userId: string) => `private-user-${userId}`,
};

// ━━━ Event names ━━━
export const events = {
  NEW_MESSAGE: "new-message",
  STATUS_UPDATE: "status-update",
  NOTIFICATION: "notification",
  TYPING: "client-typing",
};

// ━━━ Server-side trigger helpers ━━━

export async function sendChatMessage(missionId: string, message: {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
}) {
  await pusherServer.trigger(
    channels.missionChat(missionId),
    events.NEW_MESSAGE,
    message,
  );
}

export async function sendStatusUpdate(missionId: string, update: {
  status: string;
  timestamp: string;
  message?: string;
}) {
  await pusherServer.trigger(
    channels.missionTracking(missionId),
    events.STATUS_UPDATE,
    update,
  );
}

export async function sendNotification(userId: string, notification: {
  id: string;
  type: string;
  title: string;
  body: string;
}) {
  await pusherServer.trigger(
    channels.userNotifications(userId),
    events.NOTIFICATION,
    notification,
  );
}
