import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Shadows } from "../../constants/theme";
import { ConfirmModal } from "../../components/ui";

/* ── Options à la carte ── */
interface Addon {
  id: string;
  name: string;
  desc: string;
  detail: string;
  price: string;
  priceValue: number;
  icon: string;
  includedIn: string[];
}

const addons: Addon[] = [
  {
    id: "compta",
    name: "Connexion comptable",
    desc: "Pennylane, Indy — export automatique",
    detail: "Synchronisez vos factures et devis directement avec votre logiciel comptable. Export automatique à chaque transaction.",
    price: "9,99€/mois",
    priceValue: 9.99,
    icon: "calculator",
    includedIn: ["expert"],
  },
  {
    id: "relance",
    name: "Relance client automatique",
    desc: "Rappels devis, factures impayées, RDV",
    detail: "Envoi automatique de rappels personnalisés pour les devis en attente, les factures impayées et les rendez-vous à venir. Configurable par type.",
    price: "7,99€/mois",
    priceValue: 7.99,
    icon: "email-fast",
    includedIn: ["pro", "expert"],
  },
  {
    id: "calendar",
    name: "Synchronisation calendrier",
    desc: "Google Calendar, Outlook — temps réel",
    detail: "Vos rendez-vous Nova apparaissent automatiquement dans votre Google Calendar ou Outlook. Synchronisation bidirectionnelle en temps réel.",
    price: "4,99€/mois",
    priceValue: 4.99,
    icon: "calendar-sync",
    includedIn: ["pro", "expert"],
  },
  {
    id: "website",
    name: "Site web personnalisable",
    desc: "Votre vitrine pro hébergée par Nova",
    detail: "Un site web professionnel à votre image avec vos réalisations, avis clients et formulaire de contact. Nom de domaine personnalisé inclus. Hébergement et maintenance par Nova.\n\n⚠️ La mise en place et la personnalisation de votre site se font depuis la version web desktop de Nova (nova.fr/artisan).",
    price: "14,99€/mois",
    priceValue: 14.99,
    icon: "web",
    includedIn: ["expert"],
  },
  {
    id: "stats",
    name: "Statistiques avancées",
    desc: "Tableaux de bord, exports CSV, KPIs",
    detail: "Accédez à des tableaux de bord détaillés : chiffre d'affaires, taux d'acceptation, délais moyens, performance par catégorie. Export CSV pour votre comptabilité.",
    price: "5,99€/mois",
    priceValue: 5.99,
    icon: "chart-bar",
    includedIn: ["expert"],
  },
  {
    id: "newsletter",
    name: "Newsletter fidélisation clients",
    desc: "Envoi automatique tous les 4-5 mois",
    detail: "Vos clients reçoivent automatiquement une newsletter par email présentant votre entreprise, vos actualités et promotions. Envoi tous les 4 à 5 mois pour maintenir le lien sans être intrusif. Contenu personnalisable depuis la version web.",
    price: "9,99€/mois",
    priceValue: 9.99,
    icon: "newspaper-variant-outline",
    includedIn: ["expert"],
  },
  {
    id: "pack-comm",
    name: "Pack Communication",
    desc: "Cartes de visite, affiche, autocollant, flyer",
    detail: "Tout pour votre visibilité terrain :\n\n• Cartes de visite avec QR code — 4,90€\n• Signature email professionnelle — 4,90€\n• Affiche A3 vitrine — 4,90€\n• Autocollant véhicule — 4,90€\n• Modèle de flyer personnalisé — 4,90€\n\nOu le pack complet des 5 supports à 19,90€ (au lieu de 24,50€).\n\nTous les visuels sont personnalisés aux couleurs de votre entreprise et générés depuis la version web.",
    price: "19,90€ le pack",
    priceValue: 19.90,
    icon: "card-account-details-star",
    includedIn: ["expert"],
  },
];

// Mock: current plan is "pro"
const CURRENT_PLAN = "pro";

export function AddonsScreen({ navigation }: { navigation: any }) {
  const [activeAddons, setActiveAddons] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState({ visible: false, type: "info" as const, title: "", message: "", actions: [] as any[] });

  const available = useMemo(
    () => addons.filter((a) => !a.includedIn.includes(CURRENT_PLAN)),
    [],
  );

  const included = useMemo(
    () => addons.filter((a) => a.includedIn.includes(CURRENT_PLAN)),
    [],
  );

  const totalMonthly = useMemo(() => {
    let total = 0;
    available.forEach((a) => { if (activeAddons.has(a.id)) total += a.priceValue; });
    return total;
  }, [activeAddons, available]);

  const handleToggle = (addon: Addon) => {
    const isActive = activeAddons.has(addon.id);
    if (isActive) {
      setModal({
        visible: true,
        type: "warning" as any,
        title: `Désactiver ${addon.name}`,
        message: `Vous allez désactiver « ${addon.name} ».\n\nLe service restera actif jusqu'à la fin de la période en cours. Aucun frais supplémentaire ne sera prélevé.`,
        actions: [
          { label: "Annuler", variant: "outline", onPress: () => setModal((m) => ({ ...m, visible: false })) },
          {
            label: "Confirmer",
            onPress: () => {
              const next = new Set(activeAddons);
              next.delete(addon.id);
              setActiveAddons(next);
              setModal((m) => ({ ...m, visible: false }));
            },
          },
        ],
      });
    } else {
      setModal({
        visible: true,
        type: "info",
        title: `Ajouter ${addon.name}`,
        message: `Vous allez activer « ${addon.name} » pour ${addon.price}.\n\nCe montant sera ajouté à votre facturation mensuelle. Vous pouvez désactiver cette option à tout moment, sans engagement.`,
        actions: [
          { label: "Annuler", variant: "outline", onPress: () => setModal((m) => ({ ...m, visible: false })) },
          {
            label: "Activer",
            onPress: () => {
              const next = new Set(activeAddons);
              next.add(addon.id);
              setActiveAddons(next);
              setModal((m) => ({ ...m, visible: false }));
            },
          },
        ],
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Services à la carte</Text>
          <Text style={styles.headerSub}>Personnalisez votre expérience Nova</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Explainer */}
        <View style={styles.explainer}>
          <View style={styles.explainerIconWrap}>
            <MaterialCommunityIcons name="puzzle" size={22} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.explainerTitle}>Composez votre offre</Text>
            <Text style={styles.explainerDesc}>
              Ajoutez uniquement les services dont vous avez besoin, sans changer de forfait. Sans engagement, résiliable à tout moment.
            </Text>
          </View>
        </View>

        {/* Available addons */}
        {available.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Disponibles à l'ajout</Text>
            {available.map((addon) => {
              const isActive = activeAddons.has(addon.id);
              const isExpanded = expandedId === addon.id;
              return (
                <View key={addon.id} style={[styles.addonCard, isActive && styles.addonCardActive]}>
                  <TouchableOpacity
                    style={styles.addonTop}
                    activeOpacity={0.8}
                    onPress={() => setExpandedId(isExpanded ? null : addon.id)}
                  >
                    <View style={[styles.addonIconWrap, { backgroundColor: isActive ? Colors.forest + "15" : Colors.bgPage }]}>
                      <MaterialCommunityIcons name={addon.icon as any} size={22} color={isActive ? Colors.forest : Colors.textSecondary} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.addonName} numberOfLines={1}>{addon.name}</Text>
                      <Text style={styles.addonDesc}>{addon.desc}</Text>
                      <View style={styles.addonBottomRow}>
                        <Text style={[styles.addonPrice, isActive && { color: Colors.forest }]}>{addon.price}</Text>
                        {isActive && (
                          <View style={styles.activePill}>
                            <Text style={styles.activePillText}>Actif</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.addonDetail}>
                      <Text style={styles.addonDetailText}>{addon.detail}</Text>
                      <TouchableOpacity
                        style={[styles.addonCta, isActive && styles.addonCtaActive]}
                        activeOpacity={0.85}
                        onPress={() => handleToggle(addon)}
                      >
                        <MaterialCommunityIcons
                          name={isActive ? "close" : "plus"}
                          size={16}
                          color={isActive ? Colors.red : Colors.white}
                        />
                        <Text style={[styles.addonCtaText, isActive && { color: Colors.red }]}>
                          {isActive ? "Désactiver" : `Ajouter pour ${addon.price}`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* Included in plan */}
        {included.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Inclus dans votre forfait Pro</Text>
            {included.map((addon) => (
              <View key={addon.id} style={styles.includedCard}>
                <View style={[styles.addonIconWrap, { backgroundColor: Colors.success + "12" }]}>
                  <MaterialCommunityIcons name={addon.icon as any} size={20} color={Colors.success} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.addonName}>{addon.name}</Text>
                  <Text style={styles.addonDesc}>{addon.desc}</Text>
                </View>
                <View style={styles.includedBadge}>
                  <MaterialCommunityIcons name="check" size={14} color={Colors.success} />
                  <Text style={styles.includedBadgeText}>Inclus</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Total */}
        {activeAddons.size > 0 && (
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Coût mensuel des options</Text>
            <Text style={styles.totalValue}>+{totalMonthly.toFixed(2).replace(".", ",")}€/mois</Text>
            <View style={styles.totalSep} />
            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>Forfait Pro</Text>
              <Text style={styles.totalRowValue}>49,99€</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>Options ({activeAddons.size})</Text>
              <Text style={styles.totalRowValue}>{totalMonthly.toFixed(2).replace(".", ",")}€</Text>
            </View>
            <View style={[styles.totalRow, styles.totalRowFinal]}>
              <Text style={styles.totalRowFinalLabel}>Total mensuel</Text>
              <Text style={styles.totalRowFinalValue}>{(49.99 + totalMonthly).toFixed(2).replace(".", ",")}€</Text>
            </View>
          </View>
        )}

        {/* Upsell */}
        <View style={styles.upsellCard}>
          <MaterialCommunityIcons name="crown" size={18} color={Colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.upsellTitle}>Tout inclus avec Expert</Text>
            <Text style={styles.upsellDesc}>
              Passez au forfait Expert (99,99€/mois) pour bénéficier de tous les services inclus, des commissions les plus basses et du support dédié.
            </Text>
          </View>
        </View>
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
  headerTitle: { fontFamily: "Manrope_700Bold", fontSize: 18, color: Colors.navy },
  headerSub: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Explainer */
  explainer: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    backgroundColor: Colors.white, borderRadius: 18, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: "rgba(27,107,78,0.1)", ...Shadows.sm,
  },
  explainerIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.forest, alignItems: "center", justifyContent: "center",
  },
  explainerTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy, marginBottom: 2 },
  explainerDesc: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  sectionTitle: { fontFamily: "Manrope_700Bold", fontSize: 16, color: Colors.navy, marginBottom: 12 },

  /* Addon card */
  addonCard: {
    backgroundColor: Colors.white, borderRadius: 18, overflow: "hidden",
    marginBottom: 10, borderWidth: 1.5, borderColor: "rgba(10,22,40,0.06)", ...Shadows.sm,
  },
  addonCardActive: { borderColor: Colors.forest + "30" },
  addonTop: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 14,
  },
  addonIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  addonName: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  addonDesc: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  addonBottomRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  addonPrice: { fontFamily: "DMMono_500Medium", fontSize: 12, color: Colors.navy },
  activePill: { backgroundColor: Colors.success + "15", borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  activePillText: { fontFamily: "DMSans_600SemiBold", fontSize: 10, color: Colors.success },

  /* Addon detail */
  addonDetail: {
    paddingHorizontal: 14, paddingBottom: 14,
    borderTopWidth: 1, borderTopColor: Colors.surface, paddingTop: 12,
  },
  addonDetailText: { fontFamily: "DMSans_400Regular", fontSize: 12.5, color: "#4A5568", lineHeight: 19, marginBottom: 12 },
  addonCta: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    height: 44, borderRadius: 12, backgroundColor: Colors.forest, ...Shadows.md,
  },
  addonCtaActive: { backgroundColor: "rgba(232,48,42,0.08)", elevation: 0 },
  addonCtaText: { fontFamily: "Manrope_700Bold", fontSize: 13, color: Colors.white },

  /* Included */
  includedCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: "rgba(34,200,138,0.12)",
  },
  includedBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  includedBadgeText: { fontFamily: "DMSans_600SemiBold", fontSize: 11, color: Colors.success },

  /* Total */
  totalCard: {
    backgroundColor: Colors.white, borderRadius: 18, padding: 16,
    marginTop: 8, marginBottom: 16,
    borderWidth: 1.5, borderColor: Colors.forest + "20", ...Shadows.sm,
  },
  totalLabel: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  totalValue: { fontFamily: "DMMono_500Medium", fontSize: 20, color: Colors.forest, marginBottom: 10 },
  totalSep: { height: 1, backgroundColor: Colors.surface, marginBottom: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalRowLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  totalRowValue: { fontFamily: "DMMono_500Medium", fontSize: 13, color: Colors.navy },
  totalRowFinal: { borderTopWidth: 1, borderTopColor: Colors.surface, paddingTop: 10, marginTop: 6 },
  totalRowFinalLabel: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy },
  totalRowFinalValue: { fontFamily: "DMMono_500Medium", fontSize: 18, color: Colors.forest },

  /* Upsell */
  upsellCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "rgba(245,166,35,0.06)", borderRadius: 14, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: "rgba(245,166,35,0.12)",
  },
  upsellTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: "#92610A", marginBottom: 2 },
  upsellDesc: { fontFamily: "DMSans_400Regular", fontSize: 11.5, color: "#4A5568", lineHeight: 17 },
});
