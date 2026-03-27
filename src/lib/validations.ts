/**
 * Schémas de validation Zod — Inscription et Connexion
 *
 * Utilisés côté client (formulaires) et côté serveur (API)
 * pour valider les données utilisateur.
 */

import { z } from "zod";

/** Schéma d'inscription — nom, email, mot de passe sécurisé, rôle */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),
  email: z
    .string()
    .email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  role: z.enum(["CLIENT", "ARTISAN"]).default("CLIENT"),
});

/** Schéma de connexion — email + mot de passe */
export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

/** Type TypeScript déduit du schéma d'inscription */
export type RegisterInput = z.infer<typeof registerSchema>;

/** Type TypeScript déduit du schéma de connexion */
export type LoginInput = z.infer<typeof loginSchema>;
