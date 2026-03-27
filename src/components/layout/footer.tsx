/**
 * Composant Footer — Pied de page affiché sur toutes les pages publiques.
 * Contient le logo, une description, et les colonnes de liens (plateforme, urgences, métiers, légal).
 */

import Link from "next/link";

/** Colonnes de liens affichées dans le footer */
const columns = [
  {
    title: "Plateforme",
    links: [
      { label: "Accueil", href: "/" },
      { label: "Comment ça marche", href: "/comment-ca-marche" },
      { label: "Trouver un artisan", href: "/artisans" },
      { label: "Devenir partenaire", href: "/devenir-partenaire" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Urgences 24h/24",
    links: [
      { label: "Serrurier urgence", href: "/serrurier-urgence" },
      { label: "Plombier urgence", href: "/plombier-urgence" },
      { label: "Électricien urgence", href: "/electricien-urgence" },
      { label: "Chauffagiste urgence", href: "/chauffagiste-urgence" },
      { label: "Maçon urgence", href: "/macon-urgence" },
    ],
  },
  {
    title: "Métiers",
    links: [
      { label: "Serrurier", href: "/serrurier" },
      { label: "Plombier", href: "/plombier" },
      { label: "Électricien", href: "/electricien" },
      { label: "Chauffagiste", href: "/chauffagiste" },
      { label: "Peintre", href: "/peintre" },
      { label: "Menuisier", href: "/menuisier" },
      { label: "Carreleur", href: "/carreleur" },
      { label: "Maçon", href: "/macon" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "CGU", href: "/cgu" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Mentions légales", href: "/mentions" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-12 pb-8 px-10">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10">
        {/* Bloc marque : logo + description */}
        <div>
          <div className="relative inline-flex items-center mb-3">
            <span className="font-heading text-xl font-extrabold text-navy tracking-tight">
              Nova
            </span>
            {/* Point doré décoratif à côté du logo */}
            <div className="w-[5px] h-[5px] rounded-full bg-gold absolute -top-0.5 -right-1.5" />
          </div>
          <p className="text-[13px] text-grayText leading-relaxed max-w-[300px]">
            La plateforme de mise en relation entre particuliers et artisans certifiés.
            Paiement sécurisé par séquestre.
          </p>
        </div>

        {/* Colonnes de liens */}
        {columns.map((col) => (
          <div key={col.title}>
            <div className="text-[13px] font-bold text-navy mb-3">{col.title}</div>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-[13px] text-grayText mb-2 hover:text-navy transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="max-w-[1100px] mx-auto mt-6 pt-5 border-t border-border text-center">
        <span className="text-xs text-grayText/60">
          © 2026 Nova SAS — Tous droits réservés
        </span>
      </div>
    </footer>
  );
}
