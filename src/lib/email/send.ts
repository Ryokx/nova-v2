/**
 * Envoi d'emails via Resend
 *
 * En production : envoie via l'API Resend
 * En développement (sans clé API) : log dans la console sans envoyer
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/** Envoie un email. Retourne true si succès, false si erreur. */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Nova <noreply@nova.fr>";

  // Mode développement : on log l'email au lieu de l'envoyer
  if (!resendApiKey) {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL] (No RESEND_API_KEY — email logged, not sent)`);
    return true;
  }

  // Mode production : envoi via l'API Resend
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({ from: fromEmail, to, subject, html }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[EMAIL] Send failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[EMAIL] Error:", error);
    return false;
  }
}
