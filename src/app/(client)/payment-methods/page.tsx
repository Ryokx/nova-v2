/**
 * Page "Moyens de paiement".
 * Affiche les cartes bancaires enregistrées, permet de choisir la carte par défaut,
 * d'en ajouter une nouvelle via Stripe SetupIntent, et de voir les autres méthodes.
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Building, Plus, Shield, Check, CreditCard, X as XIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SavedCard {
  id: string;
  type: string;
  last4: string;
  holder: string;
  expiry: string;
  gradient: string;
}

/* ------------------------------------------------------------------ */
/*  Données mock (cartes enregistrées)                                 */
/* ------------------------------------------------------------------ */

const initialCards: SavedCard[] = [
  {
    id: "1",
    type: "Visa",
    last4: "6411",
    holder: "Sophie Lefevre",
    expiry: "09/28",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "8923",
    holder: "Sophie Lefevre",
    expiry: "03/27",
    gradient: "from-red-500 to-gold",
  },
];

/* ------------------------------------------------------------------ */
/*  Formulaire Stripe (dans le modal)                                  */
/* ------------------------------------------------------------------ */

function AddCardForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Erreur lors de l'enregistrement");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 p-4 rounded-[5px] border border-border bg-bgPage">
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red/5 border border-red/20 rounded-[5px] px-4 py-3 mb-4 text-sm text-red font-medium">
          {error}
        </div>
      )}

      <div className="bg-deepForest/5 rounded-[5px] p-3.5 flex items-center gap-3 mb-5 border border-forest/10">
        <Lock className="w-5 h-5 text-forest shrink-0" />
        <div className="text-left">
          <div className="text-xs font-bold text-navy">Empreinte à 0,00 €</div>
          <div className="text-[11px] text-grayText">
            Simple vérification — aucun prélèvement ne sera effectué.
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-[5px] bg-white border border-border text-navy font-semibold text-sm hover:bg-surface transition-all cursor-pointer"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className={cn(
            "flex-1 py-3 rounded-[5px] text-white font-bold text-sm transition-all flex items-center justify-center gap-2",
            !stripe || loading
              ? "bg-border text-grayText cursor-default"
              : "bg-deepForest hover:-translate-y-0.5",
          )}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Vérification...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Enregistrer la carte
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function PaymentMethodsPage() {
  /** ID de la carte sélectionnée par défaut */
  const [defaultCard, setDefaultCard] = useState("1");
  /** Liste des cartes (mock + ajoutées) */
  const [cards, setCards] = useState<SavedCard[]>(initialCards);
  /** Modal ouvert */
  const [showAddCard, setShowAddCard] = useState(false);
  /** Client secret pour le SetupIntent */
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  /** Confirmation d'ajout réussi */
  const [addSuccess, setAddSuccess] = useState(false);

  /** Crée un SetupIntent quand on ouvre le modal */
  const openAddCard = useCallback(async () => {
    setShowAddCard(true);
    setAddSuccess(false);
    setClientSecret(null);
    try {
      const res = await fetch("/api/setup-intent", { method: "POST" });
      const data = await res.json();
      if (data.clientSecret) setClientSecret(data.clientSecret);
    } catch (err) {
      console.error("Failed to create SetupIntent:", err);
    }
  }, []);

  /** Carte ajoutée avec succès */
  const handleCardAdded = () => {
    setAddSuccess(true);
    const newCard: SavedCard = {
      id: String(Date.now()),
      type: "Carte",
      last4: "••••",
      holder: "Nouvelle carte",
      expiry: "••/••",
      gradient: "from-forest to-sage",
    };
    setCards((prev) => [...prev, newCard]);
    setDefaultCard(newCard.id);
    setTimeout(() => setShowAddCard(false), 1500);
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">

      {/* En-tête avec bouton retour */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="w-9 h-9 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-navy" />
        </Link>
        <h1 className="font-heading text-[26px] font-extrabold text-navy">Moyens de paiement</h1>
      </div>

      {/* Liste des cartes enregistrées */}
      <div className="space-y-3 mb-5">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setDefaultCard(card.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-[5px] transition-all text-left",
              defaultCard === card.id
                ? "border-2 border-forest bg-white"
                : "border border-border bg-white hover:border-forest/30"
            )}
          >
            {/* Mini-carte colorée */}
            <div
              className={cn(
                "w-12 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-[8px] font-bold shadow-sm",
                card.gradient
              )}
            >
              {card.type}
            </div>

            {/* Détails de la carte */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-navy">
                  {card.type} &bull;&bull;&bull;&bull; {card.last4}
                </span>
                {/* Badge "Par défaut" */}
                {defaultCard === card.id && (
                  <span className="px-2 py-0.5 rounded-full bg-forest/10 text-forest text-xs font-semibold">
                    Par défaut
                  </span>
                )}
              </div>
              <div className="text-xs text-grayText mt-0.5">
                Exp. {card.expiry}{card.holder ? ` — ${card.holder}` : ""}
              </div>
            </div>

            {/* Indicateur radio */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                defaultCard === card.id ? "border-forest bg-forest" : "border-gray-300"
              )}
            >
              {defaultCard === card.id && <Check className="w-3 h-3 text-white" />}
            </div>
          </button>
        ))}
      </div>

      {/* Bouton ajouter une carte */}
      <button
        onClick={openAddCard}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-[5px] border-2 border-dashed border-border text-grayText text-sm font-medium hover:border-forest/30 hover:text-navy transition-all mb-6 cursor-pointer bg-transparent"
      >
        <Plus className="w-4 h-4" /> Ajouter une carte
      </button>

      {/* Modal d'ajout de carte */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="bg-white rounded-[5px] w-full max-w-[480px] p-6 shadow-xl relative animate-pageIn">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowAddCard(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors cursor-pointer border-none"
            >
              <XIcon className="w-4 h-4 text-navy" />
            </button>

            {addSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-navy mb-1">Carte enregistrée !</h3>
                <p className="text-sm text-grayText">Votre moyen de paiement a été ajouté avec succès.</p>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-lg font-extrabold text-navy mb-1 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-forest" /> Ajouter une carte
                </h3>
                <p className="text-xs text-grayText mb-5">
                  Enregistrez un nouveau moyen de paiement. Aucun montant ne sera prélevé.
                </p>

                {/* Méthodes acceptées */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[11px] text-grayText">Accepté :</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-semibold text-navy">Visa</span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-semibold text-navy">Mastercard</span>
                    <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-semibold">Apple Pay</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-border text-[10px] font-semibold text-navy">Google Pay</span>
                  </div>
                </div>

                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#0A4030",
                          borderRadius: "5px",
                          fontFamily: "DM Sans, system-ui, sans-serif",
                        },
                      },
                    }}
                  >
                    <AddCardForm onSuccess={handleCardAdded} onCancel={() => setShowAddCard(false)} />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center gap-3 py-12">
                    <span className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
                    <span className="text-sm text-grayText">Chargement...</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Autres méthodes de paiement */}
      <div className="bg-white rounded-[5px] p-5 border border-border mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-4">Autres méthodes</h2>
        <div className="space-y-4">
          {[
            {
              icon: Smartphone,
              label: "Apple Pay",
              status: "Configuré",
              ok: true,
            },
            {
              icon: Building,
              label: "Virement bancaire",
              status: "RIB non renseigné",
              ok: false,
            },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                  <Icon className="w-5 h-5 text-forest" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy">{m.label}</div>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    m.ok ? "text-success" : "text-grayText"
                  )}
                >
                  {m.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note de sécurité */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-[5px] bg-surface">
        <Shield className="w-4 h-4 text-forest shrink-0 mt-0.5" />
        <p className="text-xs text-grayText leading-relaxed">
          Vos données bancaires sont chiffrées et sécurisées par un protocole SSL 256 bits.
          Nova ne stocke jamais vos informations bancaires.
        </p>
      </div>
    </div>
  );
}
