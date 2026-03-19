export type UserRole = "CLIENT" | "ARTISAN" | "ADMIN";

export type MissionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "VALIDATED"
  | "DISPUTED"
  | "CANCELLED";

export type PaymentStatus = "HELD" | "RELEASED" | "REFUNDED" | "DISPUTED";

export type DocumentType = "SIRET" | "DECENNALE" | "IDENTITY" | "RGE" | "QUALIBAT" | "KBIS";

export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}
