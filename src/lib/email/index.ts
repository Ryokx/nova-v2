/**
 * Nova Email Service
 * Centralized email sending for all transactional emails
 */

import { sendEmail } from "./send";
import { artisanWelcomeEmail, missionNotificationEmail } from "./templates";

export async function sendWelcomeEmail(params: { email: string; name: string; trade: string }) {
  const html = artisanWelcomeEmail({
    artisanName: params.name,
    trade: params.trade,
    ctaUrl: `${process.env.NEXTAUTH_URL}/artisan-dashboard`,
  });
  return sendEmail({ to: params.email, subject: "Bienvenue sur Nova !", html });
}

export async function sendDevisReceivedEmail(params: {
  clientEmail: string;
  clientName: string;
  artisanName: string;
  devisNumber: string;
  amount: number;
  missionType: string;
}) {
  const html = missionNotificationEmail({
    recipientName: params.clientName,
    missionType: `Nouveau devis reçu — ${params.missionType}`,
    artisanName: params.artisanName,
    amount: params.amount,
    ctaUrl: `${process.env.NEXTAUTH_URL}/missions`,
    ctaLabel: `Voir le devis ${params.devisNumber}`,
  });
  return sendEmail({ to: params.clientEmail, subject: `Nouveau devis de ${params.artisanName}`, html });
}

export async function sendDevisSignedEmail(params: {
  artisanEmail: string;
  artisanName: string;
  clientName: string;
  devisNumber: string;
  amount: number;
}) {
  const html = missionNotificationEmail({
    recipientName: params.artisanName,
    missionType: `Devis signé par ${params.clientName}`,
    clientName: params.clientName,
    amount: params.amount,
    ctaUrl: `${process.env.NEXTAUTH_URL}/artisan-documents`,
    ctaLabel: `Voir le devis ${params.devisNumber}`,
  });
  return sendEmail({ to: params.artisanEmail, subject: `Devis ${params.devisNumber} signé !`, html });
}

export async function sendPaymentEscrowedEmail(params: {
  clientEmail: string;
  clientName: string;
  artisanName: string;
  amount: number;
  missionType: string;
}) {
  const html = missionNotificationEmail({
    recipientName: params.clientName,
    missionType: `Paiement bloqué en séquestre — ${params.missionType}`,
    artisanName: params.artisanName,
    amount: params.amount,
    ctaUrl: `${process.env.NEXTAUTH_URL}/missions`,
    ctaLabel: "Suivre ma mission",
  });
  return sendEmail({ to: params.clientEmail, subject: `${params.amount.toFixed(2)}€ bloqués en séquestre`, html });
}

export async function sendMissionCompletedEmail(params: {
  clientEmail: string;
  clientName: string;
  artisanName: string;
  missionType: string;
  missionId: string;
}) {
  const html = missionNotificationEmail({
    recipientName: params.clientName,
    missionType: `Intervention terminée — ${params.missionType}`,
    artisanName: params.artisanName,
    ctaUrl: `${process.env.NEXTAUTH_URL}/mission/${params.missionId}`,
    ctaLabel: "Valider l'intervention",
  });
  return sendEmail({ to: params.clientEmail, subject: `Intervention terminée — validez pour libérer le paiement`, html });
}

export async function sendPaymentReleasedEmail(params: {
  artisanEmail: string;
  artisanName: string;
  clientName: string;
  amount: number;
  missionType: string;
}) {
  const html = missionNotificationEmail({
    recipientName: params.artisanName,
    missionType: `Paiement libéré — ${params.missionType}`,
    clientName: params.clientName,
    amount: params.amount,
    ctaUrl: `${process.env.NEXTAUTH_URL}/artisan-payments`,
    ctaLabel: "Voir mes paiements",
  });
  return sendEmail({ to: params.artisanEmail, subject: `${params.amount.toFixed(2)}€ virés sur votre compte`, html });
}
