import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? [AppleProvider({
          clientId: process.env.APPLE_CLIENT_ID,
          clientSecret: process.env.APPLE_CLIENT_SECRET,
        })]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Email ou mot de passe incorrect");
        }

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
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "apple") {
        const email = user.email ?? profile?.email;
        if (!email) return false;

        try {
          // Check if user already exists
          let dbUser = await prisma.user.findUnique({ where: { email } });

          if (!dbUser) {
            // Create new user from OAuth
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

          // Link OAuth account if not already linked
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
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/artisans`;
    },
    async jwt({ token, user, trigger, account }) {
      if (user) {
        if (account?.provider === "google" || account?.provider === "apple") {
          // Fetch the DB user by email for OAuth
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
          // Credentials provider
          token.id = user.id;
          token.role = (user as { role?: string }).role ?? "CLIENT";
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { phone: true },
          });
          token.hasPhone = !!dbUser?.phone;
        }
      }
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { phone: true },
        });
        token.hasPhone = !!dbUser?.phone;
      }
      return token;
    },
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
