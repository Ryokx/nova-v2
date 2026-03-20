import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const plans = [
  {
    id: "chaudiere",
    icon: "\uD83D\uDD25",
    name: "Entretien chaudi\u00E8re",
    desc: "V\u00E9rification annuelle obligatoire, nettoyage, contr\u00F4le s\u00E9curit\u00E9, attestation d'entretien",
    price: "120",
    freq: "1 visite / an",
    popular: false,
  },
  {
    id: "clim",
    icon: "\u2744\uFE0F",
    name: "Entretien climatisation",
    desc: "Nettoyage filtres, v\u00E9rification fluide, contr\u00F4le performance",
    price: "150",
    freq: "1 visite / an",
    popular: false,
  },
  {
    id: "plomberie",
    icon: "\uD83D\uDD27",
    name: "Check-up plomberie",
    desc: "Inspection canalisations, joints, robinetterie, d\u00E9tection fuites pr\u00E9ventive",
    price: "90",
    freq: "1 visite / an",
    popular: false,
  },
  {
    id: "complet",
    icon: "\u2B50",
    name: "Pack S\u00E9r\u00E9nit\u00E9",
    desc: "Chaudi\u00E8re + climatisation + plomberie. Intervention prioritaire et tarif r\u00E9duit",
    price: "299",
    freq: "3 visites / an",
    popular: true,
  },
];

const howItWorks = [
  { n: "1", t: "Souscription", d: "Vous choisissez un contrat et payez en ligne" },
  { n: "2", t: "Planification", d: "L'artisan vous propose une date d'intervention" },
  { n: "3", t: "Intervention", d: "L'entretien est r\u00E9alis\u00E9. Vous validez sur l'app" },
];

export function MaintenanceContractScreen({
  navigation,
}: RootStackScreenProps<"MaintenanceContract">) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  /* ---- Success state ---- */
  if (subscribed) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <Text style={styles.successCheck}>{"\u2713"}</Text>
        </View>
        <Text style={styles.successTitle}>Contrat souscrit !</Text>
        <Text style={styles.successDesc}>
          Jean-Michel P. vous contactera pour planifier la premi\u00E8re
          intervention d'entretien.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryBtnText}>Voir mes missions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contrat d'entretien</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Artisan */}
        <View style={styles.artisanRow}>
          <Avatar name="Jean-Michel P." size={44} radius={14} />
          <View>
            <Text style={styles.artisanName}>Jean-Michel P.</Text>
            <Text style={styles.artisanSub}>
              Plombier-Chauffagiste {"\u2022"} Certifi\u00E9 Nova
            </Text>
          </View>
        </View>

        {/* Explainer */}
        <View style={styles.explainerCard}>
          <Text style={{ fontSize: 18 }}>{"\uD83D\uDEE1\uFE0F"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.explainerTitle}>
              Entretien planifi\u00E9, esprit tranquille
            </Text>
            <Text style={styles.explainerDesc}>
              Souscrivez un contrat annuel. L'artisan revient chaque ann\u00E9e pour
              entretenir vos \u00E9quipements. Paiement s\u00E9curis\u00E9 par Nova.
            </Text>
          </View>
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>Choisissez un contrat</Text>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>POPULAIRE</Text>
              </View>
            )}
            <View style={styles.planContent}>
              <View
                style={[
                  styles.planIconWrap,
                  selectedPlan === plan.id && styles.planIconWrapSelected,
                ]}
              >
                <Text style={{ fontSize: 20 }}>{plan.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.planNameRow}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.planPrice}>{plan.price}\u20AC</Text>
                    <Text style={styles.planPriceUnit}>/an</Text>
                  </View>
                </View>
                <Text style={styles.planDesc}>{plan.desc}</Text>
                <Text style={styles.planFreq}>{plan.freq}</Text>
              </View>
            </View>
            {selectedPlan === plan.id && (
              <View style={styles.planSelected}>
                <Text style={{ fontSize: 12, color: Colors.forest }}>
                  {"\u2713"}
                </Text>
                <Text style={styles.planSelectedText}>
                  Paiement s\u00E9curis\u00E9 par s\u00E9questre Nova
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* How it works */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Comment \u00E7a fonctionne
        </Text>
        {howItWorks.map((s, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>{s.n}</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>{s.t}</Text>
              <Text style={styles.stepDesc}>{s.d}</Text>
            </View>
          </View>
        ))}

        {/* Subscribe button */}
        <TouchableOpacity
          style={[
            styles.subscribeBtn,
            !selectedPlan && styles.subscribeBtnDisabled,
          ]}
          activeOpacity={selectedPlan ? 0.85 : 1}
          onPress={() => selectedPlan && setSubscribed(true)}
          disabled={!selectedPlan}
        >
          <Text style={{ fontSize: 14 }}>{"\uD83D\uDD12"}</Text>
          <Text
            style={[
              styles.subscribeBtnText,
              !selectedPlan && styles.subscribeBtnTextDisabled,
            ]}
          >
            Souscrire le contrat
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "700" },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Artisan */
  artisanRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  artisanName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  artisanSub: { fontSize: 12, color: Colors.textSecondary },

  /* Explainer */
  explainerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 20,
  },
  explainerTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#14523B",
    marginBottom: 2,
  },
  explainerDesc: {
    fontSize: 12,
    color: "#4A5568",
    lineHeight: 19,
  },

  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.navy,
    marginBottom: 12,
  },

  /* Plan cards */
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.06)",
    position: "relative",
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: Colors.forest,
    ...Shadows.sm,
  },
  popularBadge: {
    position: "absolute",
    top: -1,
    right: 16,
    backgroundColor: Colors.gold,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  popularText: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
    color: Colors.white,
  },
  planContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  planIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
  },
  planIconWrapSelected: {
    backgroundColor: Colors.surface,
  },
  planNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  planName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
    flex: 1,
  },
  planPrice: {
    fontFamily: "DMMono_700Bold",
    fontSize: 18,
    color: Colors.forest,
  },
  planPriceUnit: { fontSize: 10, color: Colors.textSecondary },
  planDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 4,
  },
  planFreq: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.forest,
  },
  planSelected: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  planSelectedText: {
    fontSize: 11,
    color: "#14523B",
    fontFamily: "DMSans_500Medium",
  },

  /* How it works */
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    fontFamily: "DMMono_700Bold",
    fontSize: 11,
    color: Colors.forest,
  },
  stepTitle: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  stepDesc: { fontSize: 11, color: Colors.textSecondary },

  /* Subscribe */
  subscribeBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.deepForest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    ...Shadows.md,
  },
  subscribeBtnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  subscribeBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
  },
  subscribeBtnTextDisabled: { color: Colors.textSecondary },

  /* Success */
  successRoot: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successCheck: { fontSize: 36, color: Colors.white },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 24,
  },
  primaryBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
  },
});
