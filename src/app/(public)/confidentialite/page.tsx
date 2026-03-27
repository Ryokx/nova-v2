/**
 * Page de politique de confidentialité — /confidentialite
 *
 * Page statique obligatoire (RGPD).
 * Détaille les données collectées, les finalités du traitement,
 * les droits des utilisateurs et les sous-traitants utilisés.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Nova",
  description: "Politique de confidentialité et protection des données personnelles RGPD de Nova.",
};

export default function ConfidentialitePage() {
  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8 py-12">
      <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">Politique de Confidentialité</h1>
      <p className="text-sm text-grayText mb-8">Dernière mise à jour : 19 mars 2026 — Conforme RGPD</p>

      <div className="prose prose-sm max-w-none text-navy">
        {/* Responsable du traitement des données */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">1. Responsable du traitement</h2>
        <p className="text-grayText leading-relaxed">Nova SAS, société par actions simplifiée, dont le siège social est situé à Paris, France. Contact : privacy@nova.fr</p>

        {/* Types de données collectées par rôle utilisateur */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">2. Données collectées</h2>
        <p className="text-grayText leading-relaxed"><strong>Particuliers</strong> : nom, email, téléphone, adresse.<br /><strong>Artisans</strong> : nom, email, téléphone, SIRET, attestation décennale, pièce d&apos;identité, certifications (RGE, Qualibat), coordonnées bancaires (IBAN).<br /><strong>Données de navigation</strong> : cookies techniques, analytics anonymisés.</p>

        {/* Pourquoi ces données sont collectées */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">3. Finalités du traitement</h2>
        <p className="text-grayText leading-relaxed">Gestion des comptes utilisateurs. Mise en relation clients-artisans. Gestion du paiement par séquestre. Vérification des certifications artisans. Communication (notifications, emails transactionnels). Amélioration du service.</p>

        {/* Base juridique du traitement */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">4. Base légale</h2>
        <p className="text-grayText leading-relaxed">Exécution du contrat (CGU), consentement (cookies marketing), obligation légale (facturation, KYC), intérêt légitime (amélioration du service).</p>

        {/* Combien de temps les données sont conservées */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">5. Durée de conservation</h2>
        <p className="text-grayText leading-relaxed">Données de compte : durée du compte + 3 ans. Données de facturation : 10 ans (obligation légale). Documents artisans : durée de validité + 1 an. Logs de navigation : 13 mois.</p>

        {/* Droits des utilisateurs conformément au RGPD */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">6. Vos droits (RGPD)</h2>
        <p className="text-grayText leading-relaxed">Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, de portabilité, d&apos;opposition et de limitation du traitement. Pour exercer vos droits : privacy@nova.fr. Délai de réponse : 30 jours. Réclamation auprès de la CNIL : www.cnil.fr</p>

        {/* Services tiers utilisés pour le traitement des données */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">7. Sous-traitants</h2>
        <p className="text-grayText leading-relaxed">Hébergement : Vercel (EU). Base de données : Neon (EU). Paiement : Stripe (certifié PCI-DSS). Email : Resend. Stockage fichiers : Cloudflare R2 (EU).</p>

        {/* Politique de cookies */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">8. Cookies</h2>
        <p className="text-grayText leading-relaxed">Cookies strictement nécessaires : authentification, session. Cookies analytics : mesure d&apos;audience anonymisée (opt-in). Aucun cookie publicitaire.</p>
      </div>
    </div>
  );
}
