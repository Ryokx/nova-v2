/**
 * Page des mentions légales — /mentions-legales
 *
 * Page statique obligatoire (loi n° 2004-575 du 21 juin 2004).
 * Contient les informations sur l'éditeur du site, l'hébergeur,
 * l'activité, la propriété intellectuelle et la médiation.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Nova",
  description: "Mentions légales de la plateforme Nova — informations sur l'éditeur et l'hébergeur.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8 py-12">
      <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">Mentions Légales</h1>
      <p className="text-sm text-grayText mb-8">Conformément à l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004</p>

      <div className="prose prose-sm max-w-none text-navy">
        {/* Informations sur l'entreprise éditrice */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">Éditeur du site</h2>
        <p className="text-grayText leading-relaxed">
          Nova SAS<br />
          Société par actions simplifiée au capital de 10 000€<br />
          Siège social : Paris, France<br />
          RCS Paris (en cours d&apos;immatriculation)<br />
          TVA intracommunautaire : FR XX XXXXXXXXX<br />
          Directeur de la publication : [Nom du dirigeant]<br />
          Email : contact@nova.fr
        </p>

        {/* Informations sur l'hébergeur */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">Hébergeur</h2>
        <p className="text-grayText leading-relaxed">
          Vercel Inc.<br />
          340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
          Site web : vercel.com
        </p>

        {/* Description de l'activité de la plateforme */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">Activité</h2>
        <p className="text-grayText leading-relaxed">
          Nova est une plateforme de mise en relation entre particuliers et artisans certifiés du bâtiment, avec paiement sécurisé par séquestre. Nova agit en qualité d&apos;intermédiaire et n&apos;est pas partie prenante aux contrats de prestation conclus entre les utilisateurs.
        </p>

        {/* Droits d'auteur et propriété intellectuelle */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">Propriété intellectuelle</h2>
        <p className="text-grayText leading-relaxed">
          L&apos;ensemble des contenus (textes, images, logo, design) du site nova.fr est protégé par le droit de la propriété intellectuelle. Toute reproduction est interdite sans autorisation préalable écrite de Nova SAS.
        </p>

        {/* Informations sur la médiation des litiges */}
        <h2 className="font-heading text-lg font-bold mt-8 mb-3">Médiation</h2>
        <p className="text-grayText leading-relaxed">
          Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, en cas de litige non résolu, le consommateur peut recourir gratuitement au service de médiation. Médiateur : [À désigner].
        </p>
      </div>
    </div>
  );
}
