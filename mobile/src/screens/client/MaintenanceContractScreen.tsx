import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const plans = [
  { id: "chaudiere", icon: "fire", name: "Entretien chaudière", desc: "Vérification annuelle obligatoire, nettoyage, contrôle sécurité, attestation", price: "120", freq: "1 visite / an", popular: false },
  { id: "clim", icon: "snowflake", name: "Entretien climatisation", desc: "Nettoyage filtres, vérification fluide, contrôle performance", price: "150", freq: "1 visite / an", popular: false },
  { id: "plomberie", icon: "wrench", name: "Check-up plomberie", desc: "Inspection canalisations, joints, robinetterie, détection fuites", price: "90", freq: "1 visite / an", popular: false },
  { id: "complet", icon: "star", name: "Pack Sérénité", desc: "Chaudière + climatisation + plomberie. Intervention prioritaire et tarif réduit", price: "299", freq: "3 visites / an", popular: true },
];

type PayMethod = "card" | "apple" | null;
type Step = "plan" | "payment" | "success";

export function MaintenanceContractScreen({
  navigation,
}: RootStackScreenProps<"MaintenanceContract">) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("plan");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const plan = plans.find((p) => p.id === selectedPlan);

  const handlePay = () => {
    if (payMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv)) {
      Alert.alert("Informations manquantes", "Veuillez remplir tous les champs de la carte.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("success");
    }, 1500);
  };

  /* ---- Success state ---- */
  if (step === "success") {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <MaterialCommunityIcons name="check" size={36} color={Colors.white} />
        </View>
        <Text style={styles.successTitle}>Contrat souscrit !</Text>
        <Text style={styles.successDesc}>
          {plan?.name} — {plan?.price}€/an{"\n"}
          Jean-Michel P. vous contactera pour planifier la première intervention.
        </Text>

        <View style={styles.successContractCard}>
          <View style={styles.successContractHeader}>
            <MaterialCommunityIcons name={plan?.icon as any || "file-document"} size={20} color={Colors.forest} />
            <Text style={styles.successContractName}>{plan?.name}</Text>
          </View>
          <View style={styles.successContractRow}>
            <Text style={styles.successContractLabel}>Montant</Text>
            <Text style={styles.successContractValue}>{plan?.price}€/an</Text>
          </View>
          <View style={styles.successContractRow}>
            <Text style={styles.successContractLabel}>Fréquence</Text>
            <Text style={styles.successContractValue}>{plan?.freq}</Text>
          </View>
          <View style={styles.successContractRow}>
            <Text style={styles.successContractLabel}>Engagement</Text>
            <Text style={[styles.successContractValue, { color: Colors.success }]}>Sans engagement</Text>
          </View>
          <View style={styles.successContractRow}>
            <Text style={styles.successContractLabel}>Paiement</Text>
            <Text style={[styles.successContractValue, { color: Colors.success }]}>Confirmé ✓</Text>
          </View>
        </View>

        <View style={styles.noEngagementBadge}>
          <MaterialCommunityIcons name="shield-check" size={14} color={Colors.forest} />
          <Text style={styles.noEngagementText}>Sans engagement — annulable à tout moment depuis votre profil</Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryBtnText}>Retour au profil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---- Payment step ---- */
  if (step === "payment" && plan) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep("plan")}>
            <Text style={styles.backArrow}>{"‹"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paiement</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Plan summary */}
          <View style={styles.paymentSummary}>
            <MaterialCommunityIcons name={plan.icon as any} size={24} color={Colors.forest} />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentPlanName}>{plan.name}</Text>
              <Text style={styles.paymentPlanFreq}>{plan.freq} • Sans engagement</Text>
            </View>
            <Text style={styles.paymentAmount}>{plan.price}€<Text style={styles.paymentAmountUnit}>/an</Text></Text>
          </View>

          {/* Payment method selector */}
          <Text style={styles.sectionTitle}>Moyen de paiement</Text>

          <TouchableOpacity
            style={[styles.payMethodCard, payMethod === "card" && styles.payMethodCardActive]}
            onPress={() => setPayMethod("card")}
          >
            <View style={[styles.radio, payMethod === "card" && styles.radioActive]}>
              {payMethod === "card" && <View style={styles.radioInner} />}
            </View>
            <MaterialCommunityIcons name="credit-card" size={20} color={Colors.navy} />
            <Text style={styles.payMethodLabel}>Carte bancaire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payMethodCard, payMethod === "apple" && styles.payMethodCardActive]}
            onPress={() => setPayMethod("apple")}
          >
            <View style={[styles.radio, payMethod === "apple" && styles.radioActive]}>
              {payMethod === "apple" && <View style={styles.radioInner} />}
            </View>
            <MaterialCommunityIcons name="apple" size={20} color={Colors.navy} />
            <Text style={styles.payMethodLabel}>Apple Pay</Text>
          </TouchableOpacity>

          {/* Card fields */}
          {payMethod === "card" && (
            <View style={styles.cardFields}>
              <TextInput
                style={styles.cardInput}
                placeholder="Numéro de carte"
                placeholderTextColor={Colors.textHint}
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
                maxLength={19}
              />
              <View style={styles.cardInputRow}>
                <TextInput
                  style={[styles.cardInput, { flex: 1 }]}
                  placeholder="MM/AA"
                  placeholderTextColor={Colors.textHint}
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  keyboardType="number-pad"
                  maxLength={5}
                />
                <TextInput
                  style={[styles.cardInput, { flex: 1 }]}
                  placeholder="CVV"
                  placeholderTextColor={Colors.textHint}
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          )}

          {/* Escrow info */}
          <View style={styles.escrowInfo}>
            <MaterialCommunityIcons name="shield-lock" size={16} color={Colors.forest} />
            <Text style={styles.escrowInfoText}>
              Paiement sécurisé par Nova. Annulable à tout moment, sans frais.
            </Text>
          </View>

          {/* Pay button */}
          <TouchableOpacity
            style={[styles.payBtn, processing && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handlePay}
            disabled={processing}
          >
            <Text style={styles.payBtnText}>
              {processing ? "Traitement en cours..." : `Payer ${plan.price}€`}
            </Text>
          </TouchableOpacity>

          <View style={styles.securityRow}>
            <MaterialCommunityIcons name="lock" size={12} color={Colors.textMuted} />
            <Text style={styles.securityText}>Données chiffrées • Paiement sécurisé SSL</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  /* ---- Plan selection ---- */
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contrat d'entretien</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Artisan */}
        <View style={styles.artisanRow}>
          <Avatar name="Jean-Michel P." size={44} radius={14} />
          <View>
            <Text style={styles.artisanName}>Jean-Michel P.</Text>
            <Text style={styles.artisanSub}>Plombier-Chauffagiste • Certifié Nova</Text>
          </View>
        </View>

        {/* Explainer */}
        <View style={styles.explainerCard}>
          <MaterialCommunityIcons name="shield-check" size={20} color={Colors.forest} />
          <View style={{ flex: 1 }}>
            <Text style={styles.explainerTitle}>Entretien planifié, esprit tranquille</Text>
            <Text style={styles.explainerDesc}>
              Souscrivez un contrat annuel. Sans engagement — annulable à tout moment.
            </Text>
          </View>
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>Choisissez un contrat</Text>
        {plans.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.planCard, selectedPlan === p.id && styles.planCardSelected]}
            activeOpacity={0.85}
            onPress={() => setSelectedPlan(p.id)}
          >
            {p.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>POPULAIRE</Text>
              </View>
            )}
            <View style={styles.planContent}>
              <View style={[styles.planIconWrap, selectedPlan === p.id && styles.planIconWrapSelected]}>
                <MaterialCommunityIcons name={p.icon as any} size={20} color={Colors.forest} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.planNameRow}>
                  <Text style={styles.planName}>{p.name}</Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.planPrice}>{p.price}€</Text>
                    <Text style={styles.planPriceUnit}>/an</Text>
                  </View>
                </View>
                <Text style={styles.planDesc}>{p.desc}</Text>
                <Text style={styles.planFreq}>{p.freq}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Subscribe button → goes to payment */}
        <TouchableOpacity
          style={[styles.subscribeBtn, !selectedPlan && styles.subscribeBtnDisabled]}
          activeOpacity={selectedPlan ? 0.85 : 1}
          onPress={() => selectedPlan && setStep("payment")}
          disabled={!selectedPlan}
        >
          <Text style={[styles.subscribeBtnText, !selectedPlan && styles.subscribeBtnTextDisabled]}>
            Continuer vers le paiement
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 54, paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { backgroundColor: "rgba(27,107,78,0.08)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "700" },
  headerTitle: { fontFamily: "DMSans_700Bold", fontSize: 17, color: Colors.navy },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  artisanRow: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: "rgba(10,22,40,0.04)" },
  artisanName: { fontSize: 14, fontFamily: "Manrope_700Bold", color: Colors.navy },
  artisanSub: { fontSize: 12, color: Colors.textSecondary },

  explainerCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 20 },
  explainerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: "#14523B", marginBottom: 2 },
  explainerDesc: { fontSize: 12, color: "#4A5568", lineHeight: 19 },

  sectionTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy, marginBottom: 12 },

  planCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "rgba(10,22,40,0.06)", position: "relative" },
  planCardSelected: { borderWidth: 2, borderColor: Colors.forest, ...Shadows.sm },
  popularBadge: { position: "absolute", top: -1, right: 16, backgroundColor: Colors.gold, paddingVertical: 3, paddingHorizontal: 10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  popularText: { fontSize: 9, fontFamily: "Manrope_700Bold", color: Colors.white },
  planContent: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  planIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.bgPage, alignItems: "center", justifyContent: "center" },
  planIconWrapSelected: { backgroundColor: Colors.surface },
  planNameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  planName: { fontSize: 14, fontFamily: "Manrope_700Bold", color: Colors.navy, flex: 1 },
  planPrice: { fontFamily: "DMMono_500Medium", fontSize: 18, color: Colors.forest },
  planPriceUnit: { fontSize: 10, color: Colors.textSecondary },
  planDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 19, marginBottom: 4 },
  planFreq: { fontSize: 11, fontFamily: "DMSans_600SemiBold", color: Colors.forest },

  subscribeBtn: { width: "100%", height: 52, borderRadius: 16, backgroundColor: Colors.deepForest, alignItems: "center", justifyContent: "center", marginTop: 16, ...Shadows.md },
  subscribeBtnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0, elevation: 0 },
  subscribeBtnText: { color: Colors.white, fontSize: 15, fontFamily: "Manrope_700Bold" },
  subscribeBtnTextDisabled: { color: Colors.textSecondary },

  /* Payment step */
  paymentSummary: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  paymentPlanName: { fontFamily: "Manrope_700Bold", fontSize: 14, color: Colors.navy },
  paymentPlanFreq: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary },
  paymentAmount: { fontFamily: "DMMono_500Medium", fontSize: 22, color: Colors.forest },
  paymentAmountUnit: { fontFamily: "DMMono_500Medium", fontSize: 12, color: Colors.textSecondary },

  payMethodCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  payMethodCardActive: { borderWidth: 2, borderColor: Colors.forest },
  payMethodLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy, flex: 1 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: Colors.forest },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.forest },

  cardFields: { marginTop: 8, marginBottom: 16 },
  cardInput: { height: 48, backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, fontFamily: "DMSans_400Regular", fontSize: 14, color: Colors.navy, marginBottom: 8 },
  cardInputRow: { flexDirection: "row", gap: 8 },

  escrowInfo: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "rgba(27,107,78,0.08)" },
  escrowInfoText: { fontFamily: "DMSans_500Medium", fontSize: 12, color: "#14523B", flex: 1 },

  payBtn: { width: "100%", height: 54, borderRadius: 16, backgroundColor: Colors.deepForest, alignItems: "center", justifyContent: "center", ...Shadows.md },
  payBtnText: { color: Colors.white, fontSize: 15, fontFamily: "Manrope_700Bold" },

  securityRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 },
  securityText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted },

  /* Success */
  successRoot: { flex: 1, backgroundColor: Colors.bgPage, alignItems: "center", justifyContent: "center", padding: 24 },
  successCircle: { width: 72, height: 72, borderRadius: 22, backgroundColor: Colors.success, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  successTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 22, color: Colors.navy, marginBottom: 8 },
  successDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, textAlign: "center", maxWidth: 300, marginBottom: 20 },

  successContractCard: { width: "100%", backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  successContractHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  successContractName: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy },
  successContractRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  successContractLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  successContractValue: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },

  noEngagementBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 12, padding: 12, marginBottom: 20, width: "100%" },
  noEngagementText: { fontFamily: "DMSans_500Medium", fontSize: 12, color: "#14523B", flex: 1 },

  primaryBtn: { width: "100%", height: 52, borderRadius: 16, backgroundColor: Colors.deepForest, alignItems: "center", justifyContent: "center", ...Shadows.md },
  primaryBtnText: { color: Colors.white, fontSize: 15, fontFamily: "Manrope_700Bold" },
});
