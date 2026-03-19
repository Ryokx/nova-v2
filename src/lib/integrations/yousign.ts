/**
 * Yousign Integration Stub
 * Electronic signature for legal documents (devis)
 *
 * In production: Yousign provides legally binding electronic signatures
 * compliant with eIDAS regulation.
 *
 * TODO: Implement when Yousign API credentials are available
 */

export interface SignatureRequest {
  documentName: string;
  documentUrl: string;
  signerName: string;
  signerEmail: string;
  missionId: string;
}

export interface SignatureResult {
  signatureId: string;
  status: "pending" | "signed" | "declined" | "expired";
  signedDocumentUrl?: string;
  signedAt?: string;
}

/**
 * Create a signature request (STUB)
 */
export async function createSignatureRequest(params: SignatureRequest): Promise<SignatureResult> {
  console.log("[YOUSIGN STUB] Creating signature request:", params.documentName);
  return {
    signatureId: `ys_stub_${Date.now()}`,
    status: "pending",
  };
}

/**
 * Check signature status (STUB)
 */
export async function getSignatureStatus(signatureId: string): Promise<SignatureResult> {
  console.log("[YOUSIGN STUB] Checking status:", signatureId);
  return {
    signatureId,
    status: "signed",
    signedDocumentUrl: `/uploads/signed-${signatureId}.pdf`,
    signedAt: new Date().toISOString(),
  };
}

/**
 * Cancel a pending signature request (STUB)
 */
export async function cancelSignatureRequest(signatureId: string): Promise<void> {
  console.log("[YOUSIGN STUB] Cancelling:", signatureId);
}
