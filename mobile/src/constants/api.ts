// API configuration — points to the Next.js backend
// Change this to your deployed URL in production
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000"
  : "https://nova.vercel.app";

export const API_ROUTES = {
  // Auth
  login: "/api/auth/callback/credentials",
  register: "/api/auth/register",
  session: "/api/auth/session",

  // Artisans
  artisans: "/api/artisans",
  artisanDetail: (id: string) => `/api/artisans/${id}`,

  // Missions
  missions: "/api/missions",
  missionDetail: (id: string) => `/api/missions/${id}`,

  // Payments
  payments: "/api/payments",

  // Reviews
  reviews: "/api/reviews",

  // Notifications
  notifications: "/api/notifications",

  // Devis
  devis: "/api/devis",
  devisDetail: (id: string) => `/api/devis/${id}`,

  // Upload
  upload: "/api/upload",

  // Artisan stats
  artisanStats: "/api/artisan/stats",
  artisanClients: "/api/artisan/clients",

  // Invoices
  invoices: "/api/invoices",
} as const;
