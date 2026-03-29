import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { ConfirmModal } from "../../components/ui";
import { API_BASE_URL, API_ROUTES } from "../../constants/api";

/* ── Plans ── */
interface Plan {
  id: string;
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  priceNote: string;
  icon: string;
  color: string;
  popular?: boolean;
  commissionClassic: string;
  commissionUrgent: string;
  features: { text: string; included: boolean }[];
  limits: string;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: "Gratuit",
    priceAnnual: "Gratuit",
    priceNote: "Pour démarrer sur Nova",
    icon: "rocket-launch-outline",
    color: Colors.textSecondary,
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
    priceNote: "/mois • sans engagement",
    icon: "shield-check",
    color: Colors.forest,
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
    priceNote: "/mois • sans engagement",
    icon: "crown",
    color: Colors.gold,
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

/* ── Options à la carte ── */
interface AddonOption {
  id: string;
  name: string;
  desc: string;
  price: string;
  icon: string;
  includedIn: string[]; // plan ids where this is included for free
}

const addonOptions: AddonOption[] = [
  { id: "compta", name: "Connexion comptable", desc: "Pennylane, Indy — export automatique", price: "9,99€/mois", icon: "calculator", includedIn: ["pro", "expert"] },
  { id: "relance", name: "Relance client automatique", desc: "Rappels devis, factures impayées, RDV", price: "7,99€/mois", icon: "email-fast", includedIn: ["pro", "expert"] },
  { id: "calendar", name: "Synchronisation calendrier", desc: "Google Calendar, Outlook — temps réel", price: "4,99€/mois", icon: "calendar-sync", includedIn: ["pro", "expert"] },
  { id: "website", name: "Site web personnalisable", desc: "Votre vitrine pro hébergée par Nova", price: "14,99€/mois", icon: "web", includedIn: ["expert"] },
  { id: "stats", name: "Statistiques avancées", desc: "Tableaux de bord, exports CSV, KPIs", price: "5,99€/mois", icon: "chart-bar", includedIn: ["pro", "expert"] },
];

const CURRENT_PLAN = "pro";

export function SubscriptionScreen({ navigation }: { navigation: any }) {
  const [activePlan, setActivePlan] = useState(CURRENT_PLAN);
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const getPrice = (plan: Plan) => billingAnnual ? plan.priceAnnual : plan.priceMonthly;
  const getPriceNote = (plan: Plan) => plan.id === "starter" ? "" : billingAnnual ? "/mois • engagement annuel" : "/mois • sans engagement";
  const [modal, setModal] = useState({ visible: false, type: "info" as const, title: "", message: "", actions: [] as any[] });

  const currentPlan = plans.find((p) => p.id === activePlan)!;

  const startCheckout = async (plan: Plan) => {
    if (plan.id === "starter") return;
    try {
      setLoadingPlan(plan.id);
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.subscriptions}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.id,
          billing: billingAnnual ? "annual" : "monthly",
        }),
      });
      const data = await res.json();
      if (data?.url) {
        await Linking.openURL(data.url);
      } else {
        throw new Error("No checkout URL");
      }
    } catch {
      Alert.alert("Erreur", "Impossible de lancer le paiement. Veuillez réessayer.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleChangePlan = (plan: Plan) => {
    if (plan.id === activePlan) return;

    const isUpgrade = plans.indexOf(plan) > plans.indexOf(currentPlan);

    setModal({
      visible: true,
      type: isUpgrade ? ("info" as any) : ("warning" as any),
      title: isUpgrade ? `Passer à ${plan.name}` : `Descendre à ${plan.name}`,
      message: isUpgrade
        ? `Votre abonnement passera à ${plan.name} (${getPrice(plan)}${getPriceNote(plan)}) immédiatement.\n\nVous allez être redirigé vers le paiement sécurisé Stripe.`
        : `Votre abonnement passera à ${plan.name} (${getPrice(plan)}${getPriceNote(plan)}) à la fin de votre période en cours (20 avril 2026).\n\nVous conservez les avantages ${currentPlan.name} jusqu'à cette date.`,
      actions: [
        { label: "Annuler", variant: "outline", onPress: () => setModal((m) => ({ ...m, visible: false })) },
        {
          label: isUpgrade ? "Payer maintenant" : "Confirmer",
          onPress: () => {
            setModal((m) => ({ ...m, visible: false }));
            if (isUpgrade && plan.id !== "starter") {
              startCheckout(plan);
            } else {
              setActivePlan(plan.id);
              setCancelling(false);
              setModal({
                visible: true,
                type: "success" as any,
                title: "Changement programmé",
                message: `Votre passage à ${plan.name} prendra effet le 20 avril 2026.`,
                actions: [{ label: "Parfait", onPress: () => setModal((m) => ({ ...m, visible: false })) }],
              });
            }
          },
        },
      ],
    });
  };

  const handleCancel = () => {
    setModal({
      visible: true,
      type: "danger" as any,
      title: "Résilier l'abonnement",
      message: `Êtes-vous sûr de vouloir résilier votre abonnement ${currentPlan.name} ?\n\nVotre abonnement restera actif jusqu'à la date d'anniversaire (20 avril 2026). Vous conserverez tous les avantages jusqu'à cette date.\n\nAprès cette date, vous passerez automatiquement au forfait Starter (gratuit).`,
      actions: [
        { label: "Non, garder", variant: "outline", onPress: () => setModal((m) => ({ ...m, visible: false })) },
        {
          label: "Confirmer",
          variant: "danger",
          onPress: () => {
            setCancelling(true);
            setModal({
              visible: true,
              type: "info" as any,
              title: "Résiliation programmée",
              message: `Votre abonnement ${currentPlan.name} prendra fin le 20 avril 2026. Vous conservez tous les avantages jusqu'à cette date.\n\nVous recevrez un email de confirmation.`,
              actions: [{ label: "OK", onPress: () => setModal((m) => ({ ...m, visible: false })) }],
            });
          },
        },
      ],
    });
  };

  const handleReactivate = () => {
    setCancelling(false);
    setModal({
      visible: true,
      type: "success" as any,
      title: "Abonnement réactivé !",
      message: `Votre abonnement ${currentPlan.name} a été réactivé. Il se renouvellera normalement le 20 avril 2026.`,
      actions: [{ label: "Parfait", onPress: () => setModal((m) => ({ ...m, visible: false })) }],
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon abonnement</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current plan summary */}
        <View style={[styles.currentCard, { borderColor: currentPlan.color + "30" }]}>
          <View style={[styles.currentIconWrap, { backgroundColor: currentPlan.color + "15" }]}>
            <MaterialCommunityIcons name={currentPlan.icon as any} size={24} color={currentPlan.color} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={styles.currentName}>{currentPlan.name}</Text>
              {cancelling ? (
                <View style={styles.cancellingBadge}>
                  <Text style={styles.cancellingBadgeText}>Résiliation programmée</Text>
                </View>
              ) : (
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Actif</Text>
                </View>
              )}
            </View>
            <Text style={styles.currentPrice}>
              {getPrice(currentPlan)}
              <Text style={styles.currentPriceNote}> {getPriceNote(currentPlan)}</Text>
            </Text>
            <View style={styles.currentCommissionRow}>
              <View style={[styles.currentCommissionBadge, { backgroundColor: currentPlan.color + "10" }]}>
                <Text style={[styles.currentCommissionText, { color: currentPlan.color }]}>Commission classique {currentPlan.commissionClassic}</Text>
              </View>
              <View style={[styles.currentCommissionBadge, { backgroundColor: "rgba(232,48,42,0.08)" }]}>
                <Text style={[styles.currentCommissionText, { color: Colors.red }]}>Commission urgence {currentPlan.commissionUrgent}</Text>
              </View>
            </View>
            <Text style={styles.currentRenewal}>
              {cancelling
                ? "Prend fin le 20 avril 2026"
                : "Prochain renouvellement : 20 avril 2026"}
            </Text>
          </View>
        </View>

        {cancelling && (
          <TouchableOpacity style={styles.reactivateBtn} activeOpacity={0.85} onPress={handleReactivate}>
            <MaterialCommunityIcons name="refresh" size={16} color={Colors.forest} />
            <Text style={styles.reactivateBtnText}>Réactiver mon abonnement</Text>
          </TouchableOpacity>
        )}

        {/* Billing toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.billingOption, !billingAnnual && styles.billingOptionActive]}
            onPress={() => setBillingAnnual(false)}
            activeOpacity={0.85}
          >
            <Text style={[styles.billingOptionText, !billingAnnual && styles.billingOptionTextActive]}>Mensuel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.billingOption, billingAnnual && styles.billingOptionActive]}
            onPress={() => setBillingAnnual(true)}
            activeOpacity={0.85}
          >
            <Text style={[styles.billingOptionText, billingAnnual && styles.billingOptionTextActive]}>Annuel</Text>
            <View style={styles.billingSaveBadge}>
              <Text style={styles.billingSaveText}>-20€/mois</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>Tous les forfaits</Text>

        {plans.map((plan) => {
          const isCurrent = plan.id === activePlan;
          const isExpanded = expanded === plan.id;

          return (
            <View key={plan.id} style={[styles.planCard, isCurrent && { borderColor: plan.color + "40", borderWidth: 2 }]}>
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Le plus populaire</Text>
                </View>
              )}

              {/* Plan header */}
              <TouchableOpacity
                style={styles.planHeader}
                activeOpacity={0.8}
                onPress={() => setExpanded(isExpanded ? null : plan.id)}
              >
                <View style={[styles.planIconWrap, { backgroundColor: plan.color + "12" }]}>
                  <MaterialCommunityIcons name={plan.icon as any} size={22} color={plan.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{getPrice(plan)}</Text>
                    {billingAnnual && plan.id !== "starter" && (
                      <Text style={styles.planPriceBarred}>{plan.priceMonthly}</Text>
                    )}
                    <Text style={styles.planPriceNote}>{getPriceNote(plan)}</Text>
                  </View>
                  {/* Commission badges */}
                  <View style={styles.commissionRow}>
                    <View style={[styles.commissionBadge, { backgroundColor: plan.color + "10" }]}>
                      <Text style={[styles.commissionBadgeText, { color: plan.color }]}>Commission classique {plan.commissionClassic}</Text>
                    </View>
                    <View style={[styles.commissionBadge, { backgroundColor: "rgba(232,48,42,0.08)" }]}>
                      <Text style={[styles.commissionBadgeText, { color: Colors.red }]}>Commission urgence {plan.commissionUrgent}</Text>
                    </View>
                  </View>
                </View>
                {isCurrent ? (
                  <View style={[styles.currentBadge, { backgroundColor: plan.color + "15" }]}>
                    <Text style={[styles.currentBadgeText, { color: plan.color }]}>Actuel</Text>
                  </View>
                ) : (
                  <MaterialCommunityIcons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={Colors.textMuted} />
                )}
              </TouchableOpacity>

              {/* Features list */}
              {(isExpanded || isCurrent) && (
                <View style={styles.planFeatures}>
                  <Text style={styles.planLimits}>{plan.limits}</Text>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <MaterialCommunityIcons
                        name={f.included ? "check-circle" : "close-circle"}
                        size={16}
                        color={f.included ? Colors.success : Colors.border}
                      />
                      <Text style={[styles.featureText, !f.included && styles.featureTextDisabled]}>
                        {f.text}
                      </Text>
                    </View>
                  ))}

                  {/* CTA */}
                  {!isCurrent && (
                    <TouchableOpacity
                      style={[styles.planCta, { backgroundColor: plan.color }, loadingPlan === plan.id && { opacity: 0.7 }]}
                      activeOpacity={0.85}
                      onPress={() => handleChangePlan(plan)}
                      disabled={loadingPlan !== null}
                    >
                      <Text style={styles.planCtaText}>
                        {loadingPlan === plan.id ? "Chargement..." : (plans.indexOf(plan) > plans.indexOf(currentPlan) ? "Passer à " : "Descendre à ") + plan.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Link to à la carte — hidden for Expert */}
        {activePlan !== "expert" && (
          <TouchableOpacity
            style={styles.addonLinkCard}
            activeOpacity={0.85}
            onPress={() => (navigation as any).navigate("Addons")}
          >
            <View style={styles.addonLinkIcon}>
              <MaterialCommunityIcons name="puzzle" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addonLinkTitle}>Services à la carte</Text>
              <Text style={styles.addonLinkDesc}>Ajoutez des services individuellement à votre forfait</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.forest} />
          </TouchableOpacity>
        )}

        {/* Commission info */}
        <View style={styles.commissionCard}>
          <MaterialCommunityIcons name="percent" size={16} color={Colors.forest} />
          <View style={{ flex: 1 }}>
            <Text style={styles.commissionTitle}>Commission Nova</Text>
            <Text style={styles.commissionDesc}>
              Le taux de commission dépend de votre forfait. Plus votre abonnement est élevé, plus vos commissions sont réduites. La commission couvre la gestion du séquestre, la protection acheteur et le support.
            </Text>
          </View>
        </View>

        {/* Cancel */}
        {activePlan !== "starter" && !cancelling && (
          <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.7} onPress={handleCancel}>
            <MaterialCommunityIcons name="close-circle-outline" size={16} color={Colors.red} />
            <Text style={styles.cancelBtnText}>Résilier mon abonnement</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmModal
        visible={modal.visible}
        onClose={() => setModal((m) => ({ ...m, visible: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingBottom: 12,
  },
  backBtn: { backgroundColor: "rgba(27,107,78,0.08)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "700" },
  headerTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 20, color: Colors.navy },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Current plan */
  currentCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: Colors.white, borderRadius: 20, padding: 18,
    marginBottom: 16, borderWidth: 1.5, ...Shadows.sm,
  },
  currentIconWrap: {
    width: 52, height: 52, borderRadius: 17,
    alignItems: "center", justifyContent: "center",
  },
  currentName: { fontFamily: "Manrope_800ExtraBold", fontSize: 20, color: Colors.navy },
  currentPrice: { fontFamily: "DMMono_500Medium", fontSize: 18, color: Colors.navy, marginTop: 2 },
  currentPriceNote: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary },
  currentCommissionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  currentCommissionBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  currentCommissionText: { fontFamily: "DMMono_500Medium", fontSize: 10 },
  currentRenewal: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  activeText: { fontFamily: "DMSans_600SemiBold", fontSize: 11, color: Colors.success },
  cancellingBadge: { backgroundColor: "rgba(245,166,35,0.1)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  cancellingBadgeText: { fontFamily: "DMSans_600SemiBold", fontSize: 10, color: Colors.gold },

  /* Reactivate */
  reactivateBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "rgba(27,107,78,0.06)", borderRadius: 14,
    paddingVertical: 12, marginBottom: 16,
    borderWidth: 1, borderColor: "rgba(27,107,78,0.12)",
  },
  reactivateBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.forest },

  /* Billing toggle */
  billingToggle: {
    flexDirection: "row", backgroundColor: Colors.white, borderRadius: 14,
    padding: 4, marginBottom: 16, borderWidth: 1, borderColor: "rgba(10,22,40,0.06)",
  },
  billingOption: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 11,
  },
  billingOptionActive: { backgroundColor: Colors.forest, ...Shadows.sm },
  billingOptionText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.textSecondary },
  billingOptionTextActive: { color: Colors.white },
  billingSaveBadge: { backgroundColor: Colors.gold, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  billingSaveText: { fontFamily: "DMMono_500Medium", fontSize: 9, color: Colors.white },

  sectionTitle: { fontFamily: "Manrope_700Bold", fontSize: 16, color: Colors.navy, marginBottom: 12 },

  /* Plan card */
  planCard: {
    backgroundColor: Colors.white, borderRadius: 20, overflow: "hidden",
    marginBottom: 12, borderWidth: 1, borderColor: "rgba(10,22,40,0.06)", ...Shadows.sm,
  },
  popularBadge: {
    backgroundColor: Colors.forest, paddingVertical: 5, alignItems: "center",
  },
  popularBadgeText: { fontFamily: "DMSans_600SemiBold", fontSize: 11, color: Colors.white },
  planHeader: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 16,
  },
  planIconWrap: {
    width: 46, height: 46, borderRadius: 15,
    alignItems: "center", justifyContent: "center",
  },
  planName: { fontFamily: "Manrope_700Bold", fontSize: 16, color: Colors.navy },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 1 },
  planPrice: { fontFamily: "DMMono_500Medium", fontSize: 16, color: Colors.navy },
  planPriceBarred: { fontFamily: "DMMono_500Medium", fontSize: 12, color: Colors.textMuted, textDecorationLine: "line-through" },
  planPriceNote: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary },
  currentBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  currentBadgeText: { fontFamily: "DMSans_600SemiBold", fontSize: 11 },
  commissionRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 5 },
  commissionBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  commissionBadgeText: { fontFamily: "DMMono_500Medium", fontSize: 9 },

  /* Plan features */
  planFeatures: {
    paddingHorizontal: 16, paddingBottom: 16,
    borderTopWidth: 1, borderTopColor: Colors.surface, paddingTop: 12,
  },
  planLimits: { fontFamily: "DMSans_500Medium", fontSize: 12, color: Colors.textSecondary, marginBottom: 10 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 5 },
  featureText: { fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.navy, flex: 1 },
  featureTextDisabled: { color: Colors.textMuted },
  planCta: {
    height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center",
    marginTop: 12, ...Shadows.md,
  },
  planCtaText: { fontFamily: "Manrope_700Bold", fontSize: 14, color: Colors.white },

  /* Addon link */
  addonLinkCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: Colors.white, borderRadius: 18, padding: 16,
    marginBottom: 16, borderWidth: 1.5, borderColor: "rgba(27,107,78,0.12)", ...Shadows.sm,
  },
  addonLinkIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.forest, alignItems: "center", justifyContent: "center",
  },
  addonLinkTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  addonLinkDesc: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 1 },

  /* Commission */
  commissionCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 14, padding: 14,
    marginTop: 4, marginBottom: 8,
    borderWidth: 1, borderColor: "rgba(27,107,78,0.08)",
  },
  commissionTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: "#14523B", marginBottom: 2 },
  commissionDesc: { fontFamily: "DMSans_400Regular", fontSize: 11.5, color: "#4A5568", lineHeight: 17 },

  /* Cancel */
  cancelBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 14, marginTop: 8,
  },
  cancelBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.red },
});
