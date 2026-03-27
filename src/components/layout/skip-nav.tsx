/**
 * Composant SkipNav — Lien d'accessibilité "Aller au contenu principal".
 *
 * Invisible par défaut (sr-only), il apparaît uniquement quand il reçoit le focus
 * (navigation au clavier avec Tab). Permet aux utilisateurs de clavier/lecteur
 * d'écran de sauter directement au contenu sans parcourir toute la navbar.
 *
 * L'ancre #main-content doit être placée sur le conteneur principal de chaque page.
 */

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-deepForest focus:text-white focus:font-semibold focus:text-sm focus:shadow-lg"
    >
      Aller au contenu principal
    </a>
  );
}
