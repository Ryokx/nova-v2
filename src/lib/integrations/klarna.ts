/**
 * Intégration Klarna — Paiement en 3x ou 4x
 *
 * Klarna gère l'échelonnement des paiements côté client.
 * Nova reçoit 100% du montant immédiatement.
 * Klarna se charge de la collecte auprès du client.
 *
 * Pour l'instant : fonctions STUB qui simulent les appels API.
 * TODO: Implémenter quand les clés API Klarna seront disponibles
 */

// --- Types ---

/** Paramètres pour créer une session Klarna */
export interface KlarnaSessionParams {
  amount: number; // Montant total en centimes
  currency?: string;
  installments: 3 | 4; // Nombre de mensualités
  clientEmail: string;
  clientName: string;
  missionId: string;
}

/** Session Klarna créée */
export interface KlarnaSession {
  sessionId: string;
  clientToken: string;
  installmentAmount: number; // Montant de chaque mensualité
  totalAmount: number;
  installments: number;
}

// --- Fonctions ---

/** Crée une session de paiement Klarna (STUB) */
export async function createKlarnaSession(params: KlarnaSessionParams): Promise<KlarnaSession> {
  console.log("[KLARNA STUB] Creating session:", params);

  // Calcul du montant par mensualité (arrondi au centime supérieur)
  const installmentAmount = Math.ceil(params.amount / params.installments);

  return {
    sessionId: `klarna_stub_${Date.now()}`,
    clientToken: `ct_stub_${Math.random().toString(36).slice(2)}`,
    installmentAmount,
    totalAmount: params.amount,
    installments: params.installments,
  };
}

/** Confirme un paiement Klarna après validation client (STUB) */
export async function confirmKlarnaPayment(sessionId: string): Promise<{ success: boolean; orderId: string }> {
  console.log("[KLARNA STUB] Confirming payment:", sessionId);
  return { success: true, orderId: `klarna_order_${Date.now()}` };
}
