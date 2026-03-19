/**
 * Klarna Integration Stub
 * 3x/4x payment installments
 *
 * In production: Klarna handles the installment plan.
 * Nova receives 100% upfront. Klarna manages collection from client.
 *
 * TODO: Implement when Klarna API credentials are available
 */

export interface KlarnaSessionParams {
  amount: number; // Total amount in cents
  currency?: string;
  installments: 3 | 4;
  clientEmail: string;
  clientName: string;
  missionId: string;
}

export interface KlarnaSession {
  sessionId: string;
  clientToken: string;
  installmentAmount: number;
  totalAmount: number;
  installments: number;
}

/**
 * Create a Klarna payment session (STUB)
 */
export async function createKlarnaSession(params: KlarnaSessionParams): Promise<KlarnaSession> {
  console.log("[KLARNA STUB] Creating session:", params);

  const installmentAmount = Math.ceil(params.amount / params.installments);

  return {
    sessionId: `klarna_stub_${Date.now()}`,
    clientToken: `ct_stub_${Math.random().toString(36).slice(2)}`,
    installmentAmount,
    totalAmount: params.amount,
    installments: params.installments,
  };
}

/**
 * Confirm a Klarna payment (STUB)
 */
export async function confirmKlarnaPayment(sessionId: string): Promise<{ success: boolean; orderId: string }> {
  console.log("[KLARNA STUB] Confirming payment:", sessionId);
  return { success: true, orderId: `klarna_order_${Date.now()}` };
}
