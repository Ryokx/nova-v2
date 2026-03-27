/**
 * Client Prisma — Connexion à la base de données PostgreSQL
 *
 * En développement, on stocke l'instance dans `globalThis` pour éviter
 * de créer une nouvelle connexion à chaque rechargement à chaud (HMR).
 * En production, une seule instance est créée normalement.
 */

import { PrismaClient } from "@prisma/client";

// Typage de globalThis pour y stocker l'instance Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Réutilise l'instance existante ou en crée une nouvelle
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// En dev, on garde l'instance en mémoire globale (évite les connexions multiples)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
