/**
 * Route API — Réservation + Création de compte (flow unifié)
 *
 * POST /api/book-and-register
 *
 * Crée un compte client, une mission, et des notifications
 * en une seule transaction atomique. Retourne un mot de passe
 * temporaire pour l'auto sign-in côté client.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getOrCreateCustomer } from "@/lib/stripe";
import { bookAndRegisterSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /* Validation des données */
    const parsed = bookAndRegisterSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Données invalides";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      firstName, lastName, email, phone, address, description,
      artisanId, category, scheduledDate, scheduledSlot,
      paymentMethod, isUrgency,
    } = parsed.data;

    /* Vérifier unicité de l'email */
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email. Veuillez vous connecter.", code: "EMAIL_EXISTS" },
        { status: 409 },
      );
    }

    /* Résoudre l'artisan (urgence : trouver un artisan disponible) */
    let resolvedArtisanId = artisanId;
    if (!resolvedArtisanId) {
      const availableArtisan = await prisma.artisanProfile.findFirst({
        where: { trade: category, isAvailable: true },
        orderBy: { rating: "desc" },
        select: { id: true },
      });
      if (!availableArtisan) {
        return NextResponse.json(
          { error: "Aucun artisan disponible actuellement pour cette catégorie. Réessayez dans quelques minutes." },
          { status: 503 },
        );
      }
      resolvedArtisanId = availableArtisan.id;
    }

    /* Générer un mot de passe aléatoire (base64url contient majuscules + chiffres) */
    const tempPassword = randomBytes(24).toString("base64url");
    const passwordHash = await bcrypt.hash(tempPassword, 12);
    const fullName = `${firstName} ${lastName}`;

    /* Transaction atomique : User + Mission + Notifications */
    const result = await prisma.$transaction(async (tx) => {
      /* 1. Créer l'utilisateur */
      const user = await tx.user.create({
        data: {
          name: fullName,
          email,
          passwordHash,
          phone: phone || null,
          role: "CLIENT",
        },
      });

      /* 2. Créer le Stripe Customer si paiement en ligne */
      if (paymentMethod === "online") {
        const customerId = await getOrCreateCustomer({
          userId: user.id,
          email,
          name: fullName,
        });
        await tx.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }

      /* 3. Créer la mission */
      const missionType = description.split("\n")[0]?.slice(0, 80) ?? "Intervention";
      const mission = await tx.mission.create({
        data: {
          clientId: user.id,
          artisanId: resolvedArtisanId!,
          type: missionType,
          category,
          description,
          address,
          status: "PENDING",
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
          scheduledSlot: isUrgency ? "ASAP" : scheduledSlot || null,
        },
      });

      /* 4. Récupérer l'artisan pour la notification */
      const artisan = await tx.artisanProfile.findUnique({
        where: { id: resolvedArtisanId! },
        select: { userId: true, user: { select: { name: true } } },
      });

      /* 5. Notification client */
      await tx.notification.create({
        data: {
          userId: user.id,
          type: "MISSION_CREATED",
          title: "Demande envoyée !",
          body: `Votre demande a été envoyée à ${artisan?.user.name ?? "l'artisan"}. Vous serez notifié dès qu'il accepte. En cas de refus, un autre artisan prendra la relève.`,
          data: { missionId: mission.id },
        },
      });

      /* 6. Notification artisan */
      if (artisan) {
        await tx.notification.create({
          data: {
            userId: artisan.userId,
            type: "NEW_MISSION",
            title: "Nouvelle demande",
            body: `${fullName} a fait une demande de ${category}. Consultez les détails pour accepter ou refuser.`,
            data: { missionId: mission.id },
          },
        });
      }

      return { user, mission };
    });

    return NextResponse.json(
      {
        user: { id: result.user.id, email: result.user.email, name: result.user.name },
        mission: { id: result.mission.id },
        tempPassword,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[book-and-register] Error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Veuillez réessayer." }, { status: 500 });
  }
}
