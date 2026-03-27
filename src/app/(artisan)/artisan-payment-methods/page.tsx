/**
 * Page "Moyens de paiement" côté artisan.
 * Gère le compte bancaire pour recevoir les virements (Stripe Connect),
 * et affiche le statut du compte Stripe de l'artisan.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Building, Shield, Check, CreditCard, ExternalLink,
  AlertCircle, CheckCircle, Clock, BanknoteIcon, Zap, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BankAccount {
  id: string;
  label: string;
  iban: string;
  bic: string;
  isDefault: boolean;
  status: "verified" | "pending" | "failed";
}

/* ------------------------------------------------------------------ */
/*  Données mock                                                       */
/* ------------------------------------------------------------------ */

const initialAccounts: BankAccount[] = [
  {
    id: "1",
    label: "Compte professionnel",
    iban: "FR76 •••• •••• •••• •••• •••• 4521",
    bic: "BNPAFRPP",
    isDefault: true,
    status: "verified",
  },
];

const stripeStatus = {
  connected: true,
  chargesEnabled: true,
  payoutsEnabled: true,
  detailsSubmitted: true,
};

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function ArtisanPaymentMethodsPage() {
  const [accounts] = useState<BankAccount[]>(initialAccounts);
  const [defaultAccount, setDefaultAccount] = useState("1");

  const statusIcon = (s: BankAccount["status"]) => {
    if (s === "verified") return <CheckCircle className="w-4 h-4 text-success" />;
    if (s === "pending") return <Clock className="w-4 h-4 text-gold" />;
    return <AlertCircle className="w-4 h-4 text-red" />;
  };

  const statusLabel = (s: BankAccount["status"]) => {
    if (s === "verified") return "Vérifié";
    if (s === "pending") return "En attente";
    return "Erreur";
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">

      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/artisan-payments"
          className="w-9 h-9 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-navy" />
        </Link>
        <h1 className="font-heading text-[26px] font-extrabold text-navy">Moyens de paiement</h1>
      </div>

      {/* Statut Stripe Connect */}
      <div className="bg-white rounded-[20px] p-5 border border-border mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-forest" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-sm font-bold text-navy">Compte Stripe Connect</h2>
            <p className="text-xs text-grayText">Statut de votre compte de réception</p>
          </div>
          {stripeStatus.connected ? (
            <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Actif
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> À configurer
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Paiements", ok: stripeStatus.chargesEnabled },
            { label: "Virements", ok: stripeStatus.payoutsEnabled },
            { label: "Profil complet", ok: stripeStatus.detailsSubmitted },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "rounded-xl p-3 text-center text-xs font-medium",
                item.ok ? "bg-success/5 text-success" : "bg-gold/5 text-gold"
              )}
            >
              {item.ok ? <CheckCircle className="w-4 h-4 mx-auto mb-1" /> : <Clock className="w-4 h-4 mx-auto mb-1" />}
              {item.label}
            </div>
          ))}
        </div>

        {!stripeStatus.connected && (
          <button className="w-full mt-4 py-3 rounded-[14px] bg-deepForest text-white font-bold text-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" /> Configurer mon compte Stripe
          </button>
        )}
      </div>

      {/* Comptes bancaires */}
      <div className="bg-white rounded-[20px] p-5 border border-border mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-4 flex items-center gap-2">
          <Building className="w-4 h-4 text-forest" /> Comptes bancaires
        </h2>

        <div className="space-y-3">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => setDefaultAccount(account.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-[14px] transition-all text-left",
                defaultAccount === account.id
                  ? "border-2 border-forest bg-white"
                  : "border border-border bg-white hover:border-forest/30"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deepForest to-forest flex items-center justify-center">
                <BanknoteIcon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-navy">{account.label}</span>
                  {defaultAccount === account.id && (
                    <span className="px-2 py-0.5 rounded-full bg-forest/10 text-forest text-xs font-semibold">
                      Par défaut
                    </span>
                  )}
                </div>
                <div className="text-xs text-grayText mt-0.5 font-mono">{account.iban}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-grayText">BIC : {account.bic}</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    {statusIcon(account.status)} {statusLabel(account.status)}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  defaultAccount === account.id ? "border-forest bg-forest" : "border-gray-300"
                )}
              >
                {defaultAccount === account.id && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instant Pay */}
      <div className="bg-white rounded-[20px] p-5 border border-border mb-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-sm font-bold text-navy">Instant Pay</h2>
            <p className="text-xs text-grayText">Recevez vos virements en 30 min (4% de frais)</p>
          </div>
        </div>
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-gold/5 border border-gold/10">
          <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          <p className="text-xs text-grayText leading-relaxed">
            Activez Instant Pay directement depuis la page Paiements sur chaque paiement en séquestre éligible.
          </p>
        </div>
      </div>

      {/* Note de sécurité */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-[14px] bg-surface">
        <Shield className="w-4 h-4 text-forest shrink-0 mt-0.5" />
        <p className="text-xs text-grayText leading-relaxed">
          Vos données bancaires sont sécurisées par Stripe. Nova ne stocke jamais
          vos informations bancaires directement — tout transite par un protocole chiffré SSL 256 bits.
        </p>
      </div>
    </div>
  );
}
