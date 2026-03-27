/**
 * Intégration comptabilité — Stubs (Pennylane, Indy, QuickBooks, Tiime)
 *
 * Ces fonctions préparent l'interface API pour quand les vraies
 * clés d'API seront disponibles. Pour l'instant, elles loguent
 * les actions dans la console et retournent des données simulées.
 *
 * TODO: Implémenter les flux OAuth et appels API réels pour chaque fournisseur
 */

// --- Types ---

/** Fournisseurs de comptabilité supportés */
export type AccountingProvider = "pennylane" | "indy" | "quickbooks" | "tiime";

/** Connexion à un fournisseur de comptabilité */
export interface AccountingConnection {
  provider: AccountingProvider;
  connected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

/** Données d'une facture à exporter */
export interface InvoiceExportData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  items: Array<{ label: string; amount: number }>;
  totalHT: number;
  totalTTC: number;
  tva: number;
}

// --- Fonctions ---

/** Connecte un fournisseur de comptabilité (STUB — simule la connexion) */
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

/** Déconnecte un fournisseur de comptabilité (STUB) */
export async function disconnectProvider(provider: AccountingProvider): Promise<void> {
  console.log(`[ACCOUNTING STUB] Disconnecting from ${provider}`);
}

/** Exporte une facture vers le fournisseur connecté (STUB) */
export async function exportInvoice(
  provider: AccountingProvider,
  _accessToken: string,
  data: InvoiceExportData,
): Promise<{ success: boolean; externalId: string }> {
  console.log(`[ACCOUNTING STUB] Exporting invoice ${data.invoiceNumber} to ${provider}`);
  return { success: true, externalId: `${provider}_inv_${Date.now()}` };
}

/** Génère un export CSV des factures (format compatible tableur) */
export function generateCSV(invoices: InvoiceExportData[]): string {
  const header = "Numéro;Date;Client;Total HT;TVA;Total TTC\n";
  const rows = invoices
    .map((inv) => `${inv.invoiceNumber};${inv.date};${inv.clientName};${inv.totalHT};${inv.tva};${inv.totalTTC}`)
    .join("\n");
  return header + rows;
}
