/**
 * Route API — Demande de réinitialisation de mot de passe
 *
 * POST /api/auth/forgot-password
 *
 * Étapes :
 * 1. Reçoit l'email de l'utilisateur
 * 2. Génère un token sécurisé (32 octets aléatoires)
 * 3. Stocke le hash du token en base (expire dans 1h)
 * 4. Envoie un email avec le lien de réinitialisation
 *
 * SÉCURITÉ : retourne toujours un succès, même si l'email n'existe pas,
 * pour empêcher l'énumération des comptes.
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";

/* ━━━ Template HTML de l'email de réinitialisation ━━━ */
const baseStyles = `
  body { margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5FAF7; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; }
  .header { background: linear-gradient(135deg, #0A4030, #1B6B4E); padding: 32px 40px; text-align: center; }
  .logo { font-family: 'Manrope', sans-serif; font-size: 24px; font-weight: 800; color: #fff; }
  .gold-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #F5A623; }
  .content { padding: 40px; }
  .cta { display: inline-block; background: linear-gradient(135deg, #0A4030, #1B6B4E); color: #fff; padding: 14px 32px; border-radius: 14px; font-weight: 700; text-decoration: none; font-size: 15px; }
  .footer { background: #F5FAF7; padding: 24px 40px; text-align: center; border-top: 1px solid #D4EBE0; }
  .footer-text { font-size: 11px; color: #6B7280; line-height: 1.6; }
`;

/** Génère le HTML de l'email de réinitialisation de mot de passe */
function resetPasswordEmail(resetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Réinitialisation de mot de passe</title><style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">Nova <span class="gold-dot"></span></div>
    <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 8px 0 0;">Artisans certifiés, paiement garanti</p>
  </div>
  <div class="content">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 800; color: #0A1628; margin: 0 0 8px;">Réinitialisation de votre mot de passe</h1>
    <p style="color: #6B7280; font-size: 14px; line-height: 1.7;">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="cta">Réinitialiser mon mot de passe</a>
    </div>
    <p style="color: #6B7280; font-size: 12px; line-height: 1.6;">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    <p style="color: #6B7280; font-size: 11px; line-height: 1.6; margin-top: 24px;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br><a href="${resetUrl}" style="color: #1B6B4E; word-break: break-all;">${resetUrl}</a></p>
  </div>
  <div class="footer">
    <p class="footer-text">Nova SAS — Artisans certifiés, paiement sécurisé par séquestre<br><a href="https://nova.fr/cgu" style="color: #1B6B4E;">CGU</a> · <a href="https://nova.fr/confidentialite" style="color: #1B6B4E;">Confidentialité</a> · <a href="https://nova.fr" style="color: #1B6B4E;">nova.fr</a></p>
  </div>
</div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    /* Validation basique de l'email */
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    /* Recherche de l'utilisateur (sans révéler s'il existe ou non) */
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      /* Génération d'un token aléatoire sécurisé */
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      /* Le token expire dans 1 heure */
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      /* Suppression des anciens tokens pour cet email */
      await prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      /* Stockage du token hashé en base */
      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: hashedToken,
          expires,
        },
      });

      /* Construction de l'URL de réinitialisation */
      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

      /* Envoi de l'email */
      await sendEmail({
        to: normalizedEmail,
        subject: "Nova — Réinitialisation de votre mot de passe",
        html: resetPasswordEmail(resetUrl),
      });
    }

    /* Réponse toujours identique (empêche l'énumération des emails) */
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
