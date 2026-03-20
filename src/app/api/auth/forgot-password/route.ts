export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";

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

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Look up user — but don't leak whether they exist
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Generate secure random token
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Delete any existing tokens for this email
      await prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      // Store hashed token
      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: hashedToken,
          expires,
        },
      });

      // Build reset URL
      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

      // Send email
      await sendEmail({
        to: normalizedEmail,
        subject: "Nova — Réinitialisation de votre mot de passe",
        html: resetPasswordEmail(resetUrl),
      });
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
