/**
 * Templates HTML pour les emails Nova
 *
 * Deux templates principaux :
 * 1. artisanWelcomeEmail — Email de bienvenue pour un nouvel artisan
 * 2. missionNotificationEmail — Notification générique liée à une mission
 *
 * Les styles sont inline pour compatibilité maximale avec les clients mail.
 * Design basé sur le design system Nova (couleurs deepForest, forest, gold, etc.)
 */

// --- Types des données pour chaque template ---

interface ArtisanWelcomeData {
  artisanName: string;
  trade: string;
  monthRevenue?: number;
  missionsCompleted?: number;
  rating?: number;
  ctaUrl: string;
}

interface MissionNotifData {
  recipientName: string;
  missionType: string;
  artisanName?: string;
  clientName?: string;
  amount?: number;
  date?: string;
  ctaUrl: string;
  ctaLabel: string;
}

// --- Styles CSS de base (communs à tous les templates) ---
const baseStyles = `
  body { margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5FAF7; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; }
  .header { background: linear-gradient(135deg, #0A4030, #1B6B4E); padding: 32px 40px; text-align: center; }
  .logo { font-family: 'Manrope', sans-serif; font-size: 24px; font-weight: 800; color: #fff; }
  .gold-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #F5A623; }
  .content { padding: 40px; }
  .stat-grid { display: flex; gap: 12px; margin: 24px 0; }
  .stat-card { flex: 1; background: #E8F5EE; border-radius: 12px; padding: 16px; text-align: center; }
  .stat-value { font-family: 'DM Mono', monospace; font-size: 20px; font-weight: 700; color: #1B6B4E; }
  .stat-label { font-size: 11px; color: #6B7280; margin-top: 4px; }
  .cta { display: inline-block; background: linear-gradient(135deg, #0A4030, #1B6B4E); color: #fff; padding: 14px 32px; border-radius: 14px; font-weight: 700; text-decoration: none; font-size: 15px; }
  .footer { background: #F5FAF7; padding: 24px 40px; text-align: center; border-top: 1px solid #D4EBE0; }
  .footer-text { font-size: 11px; color: #6B7280; line-height: 1.6; }
`;

/** Template email de bienvenue artisan (avec stats optionnelles) */
export function artisanWelcomeEmail(data: ArtisanWelcomeData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Bienvenue sur Nova</title><style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">Nova <span class="gold-dot"></span></div>
    <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 8px 0 0;">Artisans certifiés, paiement garanti</p>
  </div>
  <div class="content">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: 24px; font-weight: 800; color: #0A1628; margin: 0 0 8px;">Bienvenue, ${data.artisanName} !</h1>
    <p style="color: #6B7280; font-size: 14px; line-height: 1.7;">Votre compte artisan ${data.trade} est maintenant actif sur Nova. Vous pouvez dès maintenant recevoir des demandes de clients dans votre zone.</p>
    ${data.monthRevenue ? `
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-value">${data.monthRevenue}€</div>
        <div class="stat-label">Revenus</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${data.missionsCompleted ?? 0}</div>
        <div class="stat-label">Missions</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">★ ${data.rating ?? 0}</div>
        <div class="stat-label">Note</div>
      </div>
    </div>` : ""}
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.ctaUrl}" class="cta">Accéder à mon espace</a>
    </div>
    <p style="color: #6B7280; font-size: 12px; line-height: 1.6;">Prochaines étapes :<br>1. Complétez votre profil<br>2. Envoyez vos documents (SIRET, décennale, identité)<br>3. Recevez votre badge Certifié Nova</p>
  </div>
  <div class="footer">
    <p class="footer-text">Nova SAS — Artisans certifiés, paiement sécurisé par séquestre<br>Cet email a été envoyé à votre adresse professionnelle.<br><a href="https://nova.fr/cgu" style="color: #1B6B4E;">CGU</a> · <a href="https://nova.fr/confidentialite" style="color: #1B6B4E;">Confidentialité</a> · <a href="https://nova.fr" style="color: #1B6B4E;">nova.fr</a></p>
  </div>
</div>
</body>
</html>`;
}

/** Template email de notification mission (devis, paiement, validation, etc.) */
export function missionNotificationEmail(data: MissionNotifData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Notification Nova</title><style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">Nova <span class="gold-dot"></span></div>
  </div>
  <div class="content">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 800; color: #0A1628; margin: 0 0 8px;">Bonjour ${data.recipientName},</h1>
    <div style="background: #E8F5EE; border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
      <p style="font-size: 14px; font-weight: 600; color: #0A1628; margin: 0 0 4px;">${data.missionType}</p>
      ${data.artisanName ? `<p style="font-size: 13px; color: #6B7280; margin: 0;">Artisan : ${data.artisanName}</p>` : ""}
      ${data.clientName ? `<p style="font-size: 13px; color: #6B7280; margin: 0;">Client : ${data.clientName}</p>` : ""}
      ${data.amount ? `<p style="font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 700; color: #1B6B4E; margin: 8px 0 0;">${data.amount.toLocaleString("fr-FR")} €</p>` : ""}
      ${data.date ? `<p style="font-size: 12px; color: #6B7280; margin: 4px 0 0;">${data.date}</p>` : ""}
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${data.ctaUrl}" class="cta">${data.ctaLabel}</a>
    </div>
  </div>
  <div class="footer">
    <p class="footer-text">Nova SAS — nova.fr<br><a href="https://nova.fr/confidentialite" style="color: #1B6B4E;">Se désabonner</a></p>
  </div>
</div>
</body>
</html>`;
}
