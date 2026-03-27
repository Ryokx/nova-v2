/**
 * Configuration NextAuth.js — Authentification utilisateur
 *
 * Fournisseurs supportés :
 * - Google OAuth (si les variables d'env sont définies)
 * - Apple OAuth (si les variables d'env sont définies)
 * - Credentials (email + mot de passe hashé avec bcrypt)
 *
 * La session utilise des JWT stockés côté client (durée : 30 jours).
 * Les callbacks gèrent la création automatique d'utilisateur OAuth
 * et l'enrichissement du token avec le rôle et le téléphone.
 */

import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  // --- Configuration de session ---
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  // Page de connexion personnalisée
  pages: {
    signIn: "/login",
  },

  // --- Fournisseurs d'authentification ---
  providers: [
    // Google OAuth (conditionnel : uniquement si les clés sont présentes)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),

    // Apple OAuth (conditionnel : uniquement si les clés sont présentes)
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? [AppleProvider({
          clientId: process.env.APPLE_CLIENT_ID,
          clientSecret: process.env.APPLE_CLIENT_SECRET,
        })]
      : []),

    // Authentification par email + mot de passe
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Vérification des champs requis
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        // Recherche de l'utilisateur en base
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Email ou mot de passe incorrect");
        }

        // Vérification du mot de passe avec bcrypt
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Email ou mot de passe incorrect");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],

  // --- Callbacks ---
  callbacks: {
    /**
     * Callback signIn — Gère la création d'utilisateur via OAuth
     * Crée l'utilisateur en base s'il n'existe pas encore,
     * puis lie le compte OAuth (Google/Apple) à l'utilisateur.
     */
    async signIn({ user, account, profile }) {
      // Traitement spécifique aux connexions OAuth
      if (account?.provider === "google" || account?.provider === "apple") {
        const email = user.email ?? profile?.email;
        if (!email) return false;

        try {
          // Cherche ou crée l'utilisateur en base
          let dbUser = await prisma.user.findUnique({ where: { email } });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email,
                name: user.name ?? profile?.name ?? email.split("@")[0],
                avatar: user.image ?? null,
                role: "CLIENT",
                emailVerified: new Date(),
              },
            });
          }

          // Lie le compte OAuth s'il n'est pas déjà lié
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token ?? null,
                refresh_token: account.refresh_token ?? null,
                expires_at: account.expires_at ?? null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
              },
            });
          }

          return true;
        } catch (error) {
          console.error("[AUTH] OAuth signIn error:", error);
          return false;
        }
      }

      // Connexion par credentials : on laisse passer
      return true;
    },

    /** Callback redirect — Redirige vers /artisans par défaut après connexion */
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/artisans`;
    },

    /**
     * Callback JWT — Enrichit le token avec les infos utilisateur
     * Ajoute l'id, le rôle et la présence d'un téléphone au token.
     * Rafraîchit hasPhone si le token est mis à jour (trigger "update").
     */
    async jwt({ token, user, trigger, account }) {
      if (user) {
        if (account?.provider === "google" || account?.provider === "apple") {
          // OAuth : récupère les infos depuis la base par email
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, role: true, phone: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.hasPhone = !!dbUser.phone;
          }
        } else {
          // Credentials : récupère les infos directement depuis l'objet user
          token.id = user.id;
          token.role = (user as { role?: string }).role ?? "CLIENT";
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { phone: true },
          });
          token.hasPhone = !!dbUser?.phone;
        }
      }

      // Rafraîchissement du token (ex: après ajout de téléphone)
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { phone: true },
        });
        token.hasPhone = !!dbUser?.phone;
      }

      return token;
    },

    /** Callback session — Expose l'id, le rôle et hasPhone dans la session */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.hasPhone = token.hasPhone as boolean;
      }
      return session;
    },
  },
};
