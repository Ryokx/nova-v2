/**
 * Accounting Integration Stubs
 * Pennylane / Indy / QuickBooks / Tiime
 *
 * These stubs prepare the API surface for when real credentials are available.
 * Each integration will export invoices and payment data automatically.
 *
 * TODO: Implement OAuth flows and API calls for each provider
 */

export type AccountingProvider = "pennylane" | "indy" | "quickbooks" | "tiime";

export interface AccountingConnection {
  provider: AccountingProvider;
  connected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface InvoiceExportData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  items: Array<{ label: string; amount: number }>;
  totalHT: number;
  totalTTC: number;
  tva: number;
}

/**
 * Connect to an accounting provider (STUB)
 */
export async function connectProvider(
  provider: AccountingProvider,
  _authCode: string,
): Promise<AccountingConnection> {
  console.log(`[ACCOUNTING STUB] Connecting to ${provider}`);
  return {
    provider,
    connected: true,
    accessToken: `stub_token_${provider}_${Date.now()}`,
    refreshToken: `stub_refresh_${provider}`,
    expiresAt: new Date(Date.now() + 3600000),
  };
}

/**
 * Disconnect from an accounting provider (STUB)
 */
export async function disconnectProvider(provider: AccountingProvider): Promise<void> {
  console.log(`[ACCOUNTING STUB] Disconnecting from ${provider}`);
}

/**
 * Export an invoice to connected accounting provider (STUB)
 */
export async function exportInvoice(
  provider: AccountingProvider,
  _accessToken: string,
  data: InvoiceExportData,
): Promise<{ success: boolean; externalId: string }> {
  console.log(`[ACCOUNTING STUB] Exporting invoice ${data.invoiceNumber} to ${provider}`);
  return { success: true, externalId: `${provider}_inv_${Date.now()}` };
}

/**
 * Generate CSV export of invoices
 */
export function generateCSV(invoices: InvoiceExportData[]): string {
  const header = "Numéro;Date;Client;Total HT;TVA;Total TTC\n";
  const rows = invoices.map((inv) =>
    `${inv.invoiceNumber};${inv.date};${inv.clientName};${inv.totalHT};${inv.tva};${inv.totalTTC}`,
  ).join("\n");
  return header + rows;
}
