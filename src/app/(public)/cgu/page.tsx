/**
 * Page des conditions générales d'utilisation — /cgu
 *
 * Page statique obligatoire.
 * Définit les règles d'utilisation de la plateforme Nova :
 * inscription, paiement par séquestre, litiges, responsabilité.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Nova",
  description: "Conditions générales d'utilisation de la plateforme Nova.",
};

export default function CguPage() {
  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8 py-12">
      <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">Conditions Générales d&apos;Utilisation</h1>
      <p className="text-sm text-grayText mb-8">Dernière mise à jour : 19 mars 2026</p>

      <div className="prose prose-sm max-w-none text-navy">
        {/* Objet des CGU */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">1. Objet</h2>
        <p className="text-grayText leading-relaxed">Les présentes CGU régissent l&apos;utilisation de la plateforme Nova (ci-après &ldquo;la Plateforme&rdquo;), éditée par Nova SAS, permettant la mise en relation entre particuliers et artisans certifiés pour des travaux de rénovation et d&apos;entretien, avec paiement sécurisé par séquestre.</p>

        {/* Définitions des termes clés */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">2. Définitions</h2>
        <p className="text-grayText leading-relaxed"><strong>Client</strong> : Particulier inscrit sur la Plateforme cherchant un artisan.<br /><strong>Artisan</strong> : Professionnel du bâtiment inscrit et vérifié sur la Plateforme.<br /><strong>Séquestre</strong> : Mécanisme de blocage du paiement sur un compte tiers jusqu&apos;à validation de l&apos;intervention.<br /><strong>Mission</strong> : Prestation de service convenue entre un Client et un Artisan via la Plateforme.</p>

        {/* Conditions d'inscription et vérification des artisans */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">3. Inscription et comptes</h2>
        <p className="text-grayText leading-relaxed">L&apos;inscription est gratuite pour les particuliers. Les artisans doivent fournir les documents obligatoires (SIRET, attestation décennale, pièce d&apos;identité) pour être référencés. Nova vérifie l&apos;authenticité des documents sous 48 à 72 heures.</p>

        {/* Fonctionnement du paiement par séquestre */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">4. Paiement et séquestre</h2>
        <p className="text-grayText leading-relaxed">Le client paie 100% du montant du devis signé. Le paiement est bloqué en séquestre. L&apos;artisan est payé sous 48 heures après validation de l&apos;intervention par le client. Nova prélève une commission de 5% à 10% selon le forfait de l&apos;artisan.</p>

        {/* Procédure en cas de litige */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">5. Litiges</h2>
        <p className="text-grayText leading-relaxed">En cas de litige, le client dispose de 72 heures après l&apos;intervention pour signaler un problème. Nova examine le dossier sous 48 heures et peut décider de libérer le paiement, d&apos;un remboursement partiel ou total.</p>

        {/* Responsabilité de Nova en tant qu'intermédiaire */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">6. Responsabilité</h2>
        <p className="text-grayText leading-relaxed">Nova agit en qualité d&apos;intermédiaire. La responsabilité de l&apos;exécution de la prestation incombe à l&apos;artisan. Nova s&apos;engage à vérifier les certifications des artisans référencés.</p>

        {/* Juridiction applicable */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">7. Droit applicable</h2>
        <p className="text-grayText leading-relaxed">Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.</p>
      </div>
    </div>
  );
}
