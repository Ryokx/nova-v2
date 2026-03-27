/**
 * Page Abonnement artisan.
 * Affiche les 3 forfaits Nova (Starter, Pro, Expert) avec :
 * - Résumé du forfait actuel
 * - Toggle mensuel/annuel (-20EUR/mois)
 * - Comparaison détaillée des fonctionnalités et commissions
 * - Services à la carte (add-ons) activables individuellement
 * - Info sur le système de commission Nova
 */
"use client";

import { useState, useEffect } from "react";
import {
  Check, X, Star, Sparkles, Info, Crown, Rocket, ShieldCheck,
  Calculator, FileText, BarChart3,
  CalendarSync, Globe, Percent, CreditCard, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/* Cycle de facturation : mensuel ou annuel */
type BillingCycle = "monthly" | "annual";

/* Structure d'un forfait */
interface Plan {
  id: string;
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  priceNote: string;
  color: string;
  colorClass: string;
  textClass: string;
  bgClass: string;
  ctaClass: string;
  popular?: boolean;
  commissionClassic: string;
  commissionUrgent: string;
  features: { text: string; included: boolean }[];
  limits: string;
}

/* Structure d'un service à la carte */
interface Addon {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceValue: number;
  icon: React.ElementType;
  includedIn: string[];
}

/* Les 3 forfaits disponibles avec leurs fonctionnalités et taux de commission */
const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: "Gratuit",
    priceAnnual: "Gratuit",
    priceNote: "Pour démarrer sur Nova",
    color: "#6B7280",
    colorClass: "text-grayText",
    textClass: "text-grayText",
    bgClass: "bg-gray-100",
    ctaClass: "bg-gray-100 text-grayText cursor-pointer hover:bg-gray-200",
    commissionClassic: "10%",
    commissionUrgent: "15%",
    features: [
      { text: "Devis illimités", included: true },
      { text: "Profil artisan", included: true },
      { text: "Paiement par séquestre", included: true },
      { text: "Badge Certifié Nova", included: true },
      { text: "Virement instantané", included: true },
      { text: "Contrats d'entretien", included: true },
      { text: "Support par email", included: true },
      { text: "Connexion comptable (Pennylane, Indy)", included: false },
      { text: "Relance client automatique", included: false },
      { text: "Synchronisation Google Calendar", included: false },
      { text: "Site web personnalisable", included: false },
      { text: "Pack Communication (supports pro)", included: false },
      { text: "Statistiques avancées", included: false },
    ],
    limits: "Toutes les fonctionnalités de base",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: "69,99€",
    priceAnnual: "49,99€",
    priceNote: "/mois - sans engagement",
    color: "#1B6B4E",
    colorClass: "text-forest",
    textClass: "text-forest",
    bgClass: "bg-forest/10",
    ctaClass: "bg-deepForest text-white cursor-pointer hover:-translate-y-0.5",
    popular: true,
    commissionClassic: "7%",
    commissionUrgent: "13%",
    features: [
      { text: "Devis illimités", included: true },
      { text: "Profil artisan complet", included: true },
      { text: "Paiement par séquestre", included: true },
      { text: "Badge Certifié Nova", included: true },
      { text: "Virement instantané", included: true },
      { text: "Contrats d'entretien", included: true },
      { text: "Relance client automatique", included: true },
      { text: "Synchronisation Google Calendar", included: true },
      { text: "Support prioritaire par chat", included: true },
      { text: "Connexion comptable (Pennylane, Indy)", included: false },
      { text: "Statistiques avancées", included: false },
      { text: "Newsletter fidélisation clients", included: false },
      { text: "Site web personnalisable", included: false },
      { text: "Pack Communication (supports pro)", included: false },
    ],
    limits: "Tout Starter + commissions réduites",
  },
  {
    id: "expert",
    name: "Expert",
    priceMonthly: "119,99€",
    priceAnnual: "99,99€",
    priceNote: "/mois - sans engagement",
    color: "#F5A623",
    colorClass: "text-gold",
    textClass: "text-gold",
    bgClass: "bg-gold/10",
    ctaClass: "bg-gold text-white cursor-pointer hover:-translate-y-0.5",
    commissionClassic: "5%",
    commissionUrgent: "10%",
    features: [
      { text: "Devis illimités", included: true },
      { text: "Profil artisan premium", included: true },
      { text: "Paiement par séquestre", included: true },
      { text: "Badge Certifié Nova + Expert", included: true },
      { text: "Virement instantané", included: true },
      { text: "Contrats d'entretien annuels", included: true },
      { text: "Connexion comptable (Pennylane, Indy)", included: true },
      { text: "Relance client automatique", included: true },
      { text: "Synchronisation Google Calendar", included: true },
      { text: "Site web personnalisable", included: true },
      { text: "Newsletter fidélisation clients", included: true },
      { text: "Pack Communication (supports pro)", included: true },
      { text: "Support dédié 7j/7 par téléphone", included: true },
      { text: "Statistiques avancées + export", included: true },
    ],
    limits: "Tout Pro + commissions les plus basses",
  },
];

/* Services à la carte disponibles */
const addonOptions: Addon[] = [
  { id: "compta", name: "Connexion comptable", desc: "Pennylane, Indy — export automatique", price: "9,99€", priceValue: 9.99, icon: Calculator, includedIn: ["pro", "expert"] },
  { id: "relance", name: "Relance client automatique", desc: "Rappels devis, factures impayées, RDV", price: "7,99€", priceValue: 7.99, icon: FileText, includedIn: ["pro", "expert"] },
  { id: "calendar", name: "Synchronisation calendrier", desc: "Google Calendar, Outlook — temps réel", price: "4,99€", priceValue: 4.99, icon: CalendarSync, includedIn: ["pro", "expert"] },
  { id: "website", name: "Site web personnalisable", desc: "Votre vitrine pro hébergée par Nova", price: "14,99€", priceValue: 14.99, icon: Globe, includedIn: ["expert"] },
  { id: "stats", name: "Statistiques avancées", desc: "Tableaux de bord, exports CSV, KPIs", price: "5,99€", priceValue: 5.99, icon: BarChart3, includedIn: ["pro", "expert"] },
];

export default function ArtisanSubscriptionPage() {
  /* Cycle de facturation sélectionné */
  const [billing, setBilling] = useState<BillingCycle>("annual");
  /* Add-ons déjà payés/actifs (chargés depuis l'API) */
  const [savedAddons, setSavedAddons] = useState<Record<string, boolean>>({});
  /* Add-ons sélectionnés (inclut les sauvegardés + les nouveaux cochés) */
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  /* État de chargement lors de la redirection Stripe */
  const [subscribing, setSubscribing] = useState<string | null>(null);
  /* État de chargement du paiement add-ons */
  const [payingAddons, setPayingAddons] = useState(false);
  /* Forfait actuel chargé depuis l'API */
  const [currentPlanId, setCurrentPlanId] = useState<string>("starter");
  /* Bannière de succès après paiement */
  const [successBanner, setSuccessBanner] = useState<{ type: "plan" | "addons"; planName?: string } | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  /* Notifications de retour Stripe (query params) */
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      const plan = searchParams.get("plan");
      const planName = plans.find((p) => p.id === plan)?.name ?? plan ?? "";
      setSuccessBanner({ type: "plan", planName });
    }
    if (searchParams.get("addons_success") === "true") {
      setSuccessBanner({ type: "addons" });
    }
    if (searchParams.get("cancelled") === "true" || searchParams.get("addons_cancelled") === "true") {
      toast("Paiement annulé", "warning");
    }
  }, [searchParams]);

  /* Charge le forfait actuel et les add-ons actifs */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user?.artisanProfile?.currentPlan) {
            setCurrentPlanId(data.user.artisanProfile.currentPlan);
          }
          if (data.user?.artisanProfile?.activeAddons) {
            const addons: Record<string, boolean> = {};
            for (const id of data.user.artisanProfile.activeAddons) {
              addons[id] = true;
            }
            setSavedAddons(addons);
            setSelectedAddons(addons);
          }
        }
      } catch {}
    })();
  }, []);

  /** Lance le paiement Stripe Checkout pour un forfait */
  const handleSubscribe = async (planId: string) => {
    if (planId === "starter" || planId === currentPlanId) return;
    setSubscribing(planId);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billing }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast(data.error || "Erreur lors de la création de l'abonnement", "error");
        setSubscribing(null);
      }
    } catch {
      toast("Erreur de connexion", "error");
      setSubscribing(null);
    }
  };

  /* Bascule un add-on (ne touche que selectedAddons, pas savedAddons) */
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* Add-ons en attente de paiement (sélectionnés mais pas encore payés, et pas inclus dans le forfait) */
  const pendingAddons = addonOptions.filter(
    (a) => selectedAddons[a.id] && !savedAddons[a.id] && !a.includedIn.includes(currentPlanId)
  );
  const pendingTotal = pendingAddons.reduce((sum, a) => sum + a.priceValue, 0);
  const hasPendingAddons = pendingAddons.length > 0;

  /** Lance le paiement Stripe Checkout pour les add-ons sélectionnés */
  const handlePayAddons = async () => {
    if (!hasPendingAddons) return;
    setPayingAddons(true);
    try {
      const res = await fetch("/api/subscriptions/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addonIds: pendingAddons.map((a) => a.id) }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast(data.error || "Erreur lors de l'activation des services", "error");
        setPayingAddons(false);
      }
    } catch {
      toast("Erreur de connexion", "error");
      setPayingAddons(false);
    }
  };

  /* Retourne le prix selon le cycle de facturation */
  const getPrice = (plan: Plan) => billing === "annual" ? plan.priceAnnual : plan.priceMonthly;
  /* Retourne la mention sous le prix (engagement ou non) */
  const getPriceNote = (plan: Plan) => {
    if (plan.id === "starter") return "";
    return billing === "annual" ? "/mois - engagement annuel" : "/mois - sans engagement";
  };

  const currentPlan = plans.find((p) => p.id === currentPlanId)!;

  return (
    <div className="max-w-[1320px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">Mon abonnement</h1>
      <p className="text-[15px] text-grayText mb-6">Choisissez le forfait adapté à votre activité</p>

      {/* Bannière de succès après paiement */}
      {successBanner && (
        <div className="relative mb-6 overflow-hidden rounded-[5px] border-2 border-success/30 bg-gradient-to-r from-success/10 via-success/5 to-forest/5 p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-success" />
          <button
            onClick={() => setSuccessBanner(null)}
            className="absolute top-3 right-3 text-grayText hover:text-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center shrink-0">
              <Check className="w-8 h-8 text-success" strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-heading text-xl font-extrabold text-navy">
                {successBanner.type === "plan"
                  ? `Forfait ${successBanner.planName} activé !`
                  : "Services activés avec succès !"}
              </h2>
              <p className="text-[15px] text-grayText mt-1">
                {successBanner.type === "plan"
                  ? `Votre abonnement ${successBanner.planName} est maintenant actif. Profitez de vos nouveaux avantages dès maintenant.`
                  : "Vos services à la carte sont maintenant actifs sur votre compte."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current plan summary */}
      <div
        className="flex items-center gap-5 bg-white rounded-[5px] p-5 mb-5 shadow-sm"
        style={{ border: `1.5px solid ${currentPlan.color}30` }}
      >
        <div
          className="w-[52px] h-[52px] rounded-[5px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: currentPlan.color + "15" }}
        >
          <ShieldCheck className="w-6 h-6" style={{ color: currentPlan.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-heading text-xl font-extrabold text-navy">{currentPlan.name}</span>
            <span className="flex items-center gap-1 bg-success/10 text-success text-[11px] font-semibold px-2 py-0.5 rounded-[5px]">
              <span className="w-1.5 h-1.5 rounded-[5px] bg-success" /> Actif
            </span>
          </div>
          <div className="font-mono text-lg text-navy">
            {getPrice(currentPlan)}
            <span className="text-[13px] text-grayText font-normal ml-1">{getPriceNote(currentPlan)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[5px]" style={{ backgroundColor: currentPlan.color + "10", color: currentPlan.color }}>
              Commission classique {currentPlan.commissionClassic}
            </span>
            <span className="font-mono text-[11px] text-red px-2 py-0.5 rounded-[5px] bg-red/5">
              Commission urgence {currentPlan.commissionUrgent}
            </span>
          </div>
          <div className="text-[13px] text-grayText mt-1.5">Prochain renouvellement : 20 avril 2026</div>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setBilling("monthly")}
          className={cn(
            "px-5 py-2.5 rounded-[5px] text-sm font-semibold transition-all border",
            billing === "monthly"
              ? "bg-deepForest text-white border-deepForest"
              : "bg-white border-border text-navy hover:bg-surface"
          )}
        >
          Mensuel
        </button>
        <button
          onClick={() => setBilling("annual")}
          className={cn(
            "px-5 py-2.5 rounded-[5px] text-sm font-semibold transition-all flex items-center gap-1.5 border",
            billing === "annual"
              ? "bg-deepForest text-white border-deepForest"
              : "bg-white border-border text-navy hover:bg-surface"
          )}
        >
          Annuel
          <span className={cn(
            "text-[11px] font-bold px-1.5 py-0.5 rounded-[5px]",
            billing === "annual" ? "bg-white/20 text-white" : "bg-gold/15 text-gold"
          )}>
            -20€/mois
          </span>
        </button>
      </div>

      {/* Plan cards */}
      <h2 className="font-heading text-lg font-bold text-navy mb-5">Tous les forfaits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const price = getPrice(plan);
          const priceNote = getPriceNote(plan);

          return (
            <div
              key={plan.id}
              className={cn(
                "relative bg-white rounded-[5px] border shadow-sm flex flex-col overflow-hidden",
                isCurrent ? "ring-2 ring-forest" : "border-border"
              )}
            >
              {/* Popular banner */}
              {plan.popular && (
                <div className="bg-forest text-white text-center text-[13px] font-semibold py-2">
                  Le plus populaire
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Badge zone */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    {plan.id === "expert" && <Sparkles className="w-5 h-5 text-gold" />}
                    {plan.id === "pro" && <Star className="w-5 h-5 text-forest" />}
                    {plan.id === "starter" && <Rocket className="w-5 h-5 text-grayText" />}
                    <h3 className={cn("font-heading text-lg font-extrabold", plan.textClass)}>
                      {plan.name}
                    </h3>
                  </div>
                  {isCurrent && (
                    <span className="bg-forest text-white text-[11px] font-bold px-2.5 py-1 rounded-[5px]">
                      Actuel
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="font-mono text-[28px] font-bold text-navy leading-none">{price}</span>
                  {billing === "annual" && plan.id !== "starter" && (
                    <span className="font-mono text-[15px] text-grayText line-through ml-2">{plan.priceMonthly}</span>
                  )}
                </div>
                <div className="text-[13px] text-grayText mb-3">{priceNote || plan.priceNote}</div>

                {/* Commission rates */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span
                    className="font-mono text-[11px] font-medium px-2 py-1 rounded-[5px]"
                    style={{ backgroundColor: plan.color + "10", color: plan.color }}
                  >
                    Commission classique {plan.commissionClassic}
                  </span>
                  <span className="font-mono text-[11px] font-medium text-red px-2 py-1 rounded-[5px] bg-red/5">
                    Urgence {plan.commissionUrgent}
                  </span>
                </div>

                {/* Limits subtitle */}
                <div className="text-[13px] text-grayText font-medium mb-3 pb-3 border-b border-border">
                  {plan.limits}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-[15px] leading-snug">
                      {f.included ? (
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                      )}
                      <span className={f.included ? "text-navy" : "text-gray-400"}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  disabled={isCurrent || subscribing === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                  className={cn(
                    "w-full px-5 py-2.5 rounded-[5px] text-sm font-bold transition-all border-none flex items-center justify-center gap-2",
                    isCurrent
                      ? "bg-surface text-forest cursor-default"
                      : subscribing === plan.id
                        ? "bg-border text-grayText cursor-default"
                        : plan.ctaClass
                  )}
                >
                  {subscribing === plan.id ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirection...
                    </>
                  ) : isCurrent ? (
                    "Plan actuel"
                  ) : plans.indexOf(plan) > plans.indexOf(currentPlan) ? (
                    `Passer à ${plan.name}`
                  ) : (
                    `Descendre à ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Services à la carte */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-navy">Services à la carte</h2>
            <p className="text-[15px] text-grayText mt-0.5">Ajoutez des services individuellement à votre forfait</p>
          </div>
          <Link
            href="/artisan-addons"
            className="px-5 py-2.5 rounded-[5px] text-sm text-forest font-semibold hover:underline"
          >
            Voir tout
          </Link>
        </div>

        <div className="space-y-2.5 mb-5">
          {addonOptions.map((addon) => {
            const Icon = addon.icon;
            const isSelected = selectedAddons[addon.id];
            const isSaved = savedAddons[addon.id];
            const isIncluded = addon.includedIn.includes(currentPlanId);
            const isPending = isSelected && !isSaved && !isIncluded;

            return (
              <div
                key={addon.id}
                className={cn(
                  "flex items-center gap-3.5 bg-white rounded-[5px] border px-5 py-4 transition-all",
                  isPending ? "border-gold/40 shadow-sm bg-gold/[0.02]" : isSelected || isSaved ? "border-forest/25 shadow-sm" : "border-border"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-[5px] flex items-center justify-center shrink-0",
                  isSelected || isIncluded || isSaved ? "bg-forest/10" : "bg-surface"
                )}>
                  <Icon className={cn("w-5 h-5", isSelected || isIncluded || isSaved ? "text-forest" : "text-grayText")} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[15px] font-bold text-navy">{addon.name}</span>
                    {isIncluded && (
                      <span className="flex items-center gap-0.5 bg-forest/10 text-forest text-[11px] font-bold px-1.5 py-0.5 rounded-[5px] shrink-0">
                        <Check className="w-3 h-3" /> Inclus
                      </span>
                    )}
                    {!isIncluded && isSaved && (
                      <span className="flex items-center gap-0.5 bg-success/10 text-success text-[11px] font-bold px-1.5 py-0.5 rounded-[5px] shrink-0">
                        <Check className="w-3 h-3" /> Actif
                      </span>
                    )}
                    {isPending && (
                      <span className="flex items-center gap-0.5 bg-gold/10 text-gold text-[11px] font-bold px-1.5 py-0.5 rounded-[5px] shrink-0">
                        En attente de paiement
                      </span>
                    )}
                    {!isIncluded && !isSaved && !isPending && addon.includedIn.includes("expert") && (
                      <span className="flex items-center gap-0.5 bg-gold/10 text-gold text-[11px] font-bold px-1.5 py-0.5 rounded-[5px] shrink-0">
                        <Crown className="w-3 h-3" /> Expert
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-grayText leading-snug mt-0.5">{addon.desc}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!isIncluded && (
                    <>
                      <span className="font-mono text-[15px] font-bold text-navy whitespace-nowrap">
                        {addon.price}
                        <span className="text-[13px] text-grayText font-normal">/mois</span>
                      </span>
                      <button
                        onClick={() => toggleAddon(addon.id)}
                        disabled={isSaved}
                        className={cn(
                          "relative w-11 h-6 rounded-[5px] transition-all shrink-0",
                          isSaved ? "bg-forest opacity-60 cursor-not-allowed" : isSelected ? "bg-forest" : "bg-gray-200"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-[5px] bg-white shadow-sm transition-all",
                          isSelected || isSaved ? "left-[22px]" : "left-0.5"
                        )} />
                      </button>
                    </>
                  )}
                  {isIncluded && (
                    <span className="text-[13px] text-forest font-semibold">Inclus</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barre de paiement add-ons — apparaît quand des options sont en attente */}
        {hasPendingAddons && (
          <div className="flex items-center justify-between bg-white rounded-[5px] border border-gold/30 p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-bold text-navy">
                {pendingAddons.length} service{pendingAddons.length > 1 ? "s" : ""} sélectionné{pendingAddons.length > 1 ? "s" : ""}
              </div>
              <div className="text-[13px] text-grayText mt-0.5">
                {pendingAddons.map((a) => a.name).join(", ")}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-navy">
                  {pendingTotal.toFixed(2).replace(".", ",")}€
                </span>
                <span className="text-[13px] text-grayText font-normal ml-1">/mois</span>
              </div>
              <button
                onClick={handlePayAddons}
                disabled={payingAddons}
                className="flex items-center gap-2 bg-deepForest text-white px-6 py-3 rounded-[5px] text-sm font-bold hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-default disabled:translate-y-0"
              >
                {payingAddons ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirection...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Passer au paiement
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Commission info */}
      <div className="flex items-start gap-3 bg-forest/5 rounded-[5px] p-5 mb-5 border border-forest/10">
        <Percent className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div>
          <div className="text-[15px] font-semibold text-forest mb-1">Commission Nova</div>
          <div className="text-[13px] text-[#4A5568] leading-relaxed">
            Le taux de commission dépend de votre forfait. Plus votre abonnement est élevé, plus vos commissions sont réduites. La commission couvre la gestion du séquestre, la protection acheteur et le support.
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 bg-surface rounded-[5px] p-5">
        <Info className="w-5 h-5 text-forest shrink-0" />
        <span className="text-[15px] text-forest font-medium">
          Changement de forfait effectif immédiatement. Prorata appliqué sur la période en cours.
        </span>
      </div>
    </div>
  );
}
