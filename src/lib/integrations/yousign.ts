/**
 * Intégration Yousign — Signature électronique de devis
 *
 * En production : Yousign fournit des signatures électroniques
 * légalement valides, conformes au règlement eIDAS.
 *
 * Pour l'instant : fonctions STUB qui simulent les appels API.
 * TODO: Implémenter quand les clés API Yousign seront disponibles
 */

// --- Types ---

/** Paramètres pour créer une demande de signature */
export interface SignatureRequest {
  documentName: string;
  documentUrl: string;
  signerName: string;
  signerEmail: string;
  missionId: string;
}

/** Résultat d'une demande de signature */
export interface SignatureResult {
  signatureId: string;
  status: "pending" | "signed" | "declined" | "expired";
  signedDocumentUrl?: string;
  signedAt?: string;
}

// --- Fonctions ---

/** Crée une demande de signature électronique (STUB) */
export async function createSignatureRequest(params: SignatureRequest): Promise<SignatureResult> {
  console.log("[YOUSIGN STUB] Creating signature request:", params.documentName);
  return {
    signatureId: `ys_stub_${Date.now()}`,
    status: "pending",
  };
}

/** Vérifie le statut d'une signature (STUB — retourne toujours "signed") */
export async function getSignatureStatus(signatureId: string): Promise<SignatureResult> {
  console.log("[YOUSIGN STUB] Checking status:", signatureId);
  return {
    signatureId,
    status: "signed",
    signedDocumentUrl: `/uploads/signed-${signatureId}.pdf`,
    signedAt: new Date().toISOString(),
  };
}

/** Annule une demande de signature en attente (STUB) */
export async function cancelSignatureRequest(signatureId: string): Promise<void> {
  console.log("[YOUSIGN STUB] Cancelling:", signatureId);
}
