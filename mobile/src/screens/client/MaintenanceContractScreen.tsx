import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const plans = [
  {
    id: "chaudiere",
    icon: "fire",
    name: "Entretien chaudière",
    desc: "Vérification annuelle obligatoire, nettoyage, contrôle sécurité, attestation d'entretien",
    price: "120",
    freq: "1 visite / an",
    popular: false,
  },
  {
    id: "clim",
    icon: "snowflake",
    name: "Entretien climatisation",
    desc: "Nettoyage filtres, vérification fluide, contrôle performance",
    price: "150",
    freq: "1 visite / an",
    popular: false,
  },
  {
    id: "plomberie",
    icon: "wrench",
    name: "Check-up plomberie",
    desc: "Inspection canalisations, joints, robinetterie, détection fuites préventive",
    price: "90",
    freq: "1 visite / an",
    popular: false,
  },
  {
    id: "complet",
    icon: "star",
    name: "Pack Sérénité",
    desc: "Chaudière + climatisation + plomberie. Intervention prioritaire et tarif réduit",
    price: "299",
    freq: "3 visites / an",
    popular: true,
  },
];

const howItWorks = [
  { n: "1", t: "Souscription", d: "Vous choisissez un contrat et payez en ligne" },
  { n: "2", t: "Planification", d: "L'artisan vous propose une date d'intervention" },
  { n: "3", t: "Intervention", d: "L'entretien est réalisé. Vous validez sur l'app" },
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
          <Text style={styles.successCheck}>{"✓"}</Text>
        </View>
        <Text style={styles.successTitle}>Contrat souscrit !</Text>
        <Text style={styles.successDesc}>
          Jean-Michel P. vous contactera pour planifier la première
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
          <Text style={styles.backArrow}>{"‹"}</Text>
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
              Plombier-Chauffagiste {"•"} Certifié Nova
            </Text>
          </View>
        </View>

        {/* Explainer */}
        <View style={styles.explainerCard}>
          <Text style={{ fontSize: 18 }}><MaterialCommunityIcons name="shield-check" size={20} color={Colors.forest} /></Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.explainerTitle}>
              Entretien planifié, esprit tranquille
            </Text>
            <Text style={styles.explainerDesc}>
              Souscrivez un contrat annuel. L'artisan revient chaque année pour
              entretenir vos équipements. Paiement sécurisé par Nova.
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
                <MaterialCommunityIcons name={plan.icon as any} size={20} color={Colors.forest} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.planNameRow}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.planPrice}>{plan.price}€</Text>
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
                  {"✓"}
                </Text>
                <Text style={styles.planSelectedText}>
                  Paiement sécurisé par séquestre Nova
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* How it works */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Comment ça fonctionne
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
          <Text style={{ fontSize: 14 }}><MaterialCommunityIcons name="shield-check" size={16} color={Colors.forest} /></Text>
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
    fontFamily: "DMMono_500Medium",
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
    fontFamily: "DMMono_500Medium",
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
