/**
 * Types TypeScript globaux — Partagés dans toute l'application
 */

/** Rôles utilisateur : client, artisan ou administrateur */
export type UserRole = "CLIENT" | "ARTISAN" | "ADMIN";

/** Statuts possibles d'une mission (cycle de vie complet) */
export type MissionStatus =
  | "PENDING"      // En attente d'acceptation
  | "ACCEPTED"     // Acceptée par l'artisan
  | "IN_PROGRESS"  // Intervention en cours
  | "COMPLETED"    // Terminée par l'artisan
  | "VALIDATED"    // Validée par le client (paiement libéré)
  | "DISPUTED"     // Litige ouvert
  | "CANCELLED";   // Annulée

/** Statuts du paiement séquestre */
export type PaymentStatus = "HELD" | "RELEASED" | "REFUNDED" | "DISPUTED";

/** Types de documents artisan (obligatoires et facultatifs) */
export type DocumentType = "SIRET" | "DECENNALE" | "IDENTITY" | "RGE" | "QUALIBAT" | "KBIS";

/** Lien de navigation (navbar, sidebar, etc.) */
export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}
