import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Button, Card, EscrowStepper, Input } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";
import { API_BASE_URL, API_ROUTES } from "../../constants/api";

type PaymentMode = "online" | "cash";
type PaymentMethod = "cb" | "virement" | "apple";
type Installment = "1x" | "2x" | "3x" | "4x";

const METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "cb", label: "Carte bancaire", icon: "credit-card" },
  { id: "virement", label: "Virement", icon: "bank" },
  { id: "apple", label: "Apple Pay", icon: "" },
];

const INSTALLMENT_OPTIONS: { id: Installment; label: string; badge?: string }[] = [
  { id: "1x", label: "1x" },
  { id: "2x", label: "2x", badge: "Sans frais" },
  { id: "3x", label: "3x", badge: "Sans frais" },
  { id: "4x", label: "4x", badge: "Populaire" },
];

const KLARNA_COLOR = "#FFB3C7";
const KLARNA_TEXT = "#17120F";

export function PaymentScreen({
  navigation,
  route,
}: RootStackScreenProps<"Payment">) {
  const { missionId, amount: routeAmount } = route.params;
  const AMOUNT = routeAmount ?? 320;
  const AMOUNT_FMT = AMOUNT.toFixed(2).replace(".", ",");

  const [paymentMode, setPaymentMode] = useState<PaymentMode>("online");
  const [method, setMethod] = useState<PaymentMethod>("cb");
  const [installment, setInstallment] = useState<Installment>("1x");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = navigation as any;

  const isKlarna = installment !== "1x";

  const handlePay = async () => {
    if (paymentMode === "cash") {
      navigation.navigate("Tracking", { missionId: missionId ?? "1" });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.payments}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId: missionId ?? "1",
          amount: AMOUNT * 100,
          paymentMethod: method === "cb" ? "card" : method === "virement" ? "bank_transfer" : "apple_pay",
          installments: parseInt(installment.replace("x", ""), 10),
        }),
      });
      const data = await res.json();
      if (data?.url) {
        await Linking.openURL(data.url);
      } else {
        navigation.navigate("Tracking", { missionId: missionId ?? "1" });
      }
    } catch {
      Alert.alert("Erreur", "Impossible de lancer le paiement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Paiement sécurisé</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EscrowStepper currentStep={0} />

        {/* Amount display */}
        <Text style={styles.amount}>{AMOUNT_FMT}€</Text>

        {/* Mode selector: En ligne / Espèces */}
        <Text style={styles.sectionLabel}>Mode de règlement</Text>
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, paymentMode === "online" && styles.modeBtnSel]}
            onPress={() => setPaymentMode("online")}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="credit-card" size={16} color={paymentMode === "online" ? Colors.white : Colors.forest} />
            <Text style={[styles.modeBtnText, paymentMode === "online" && styles.modeBtnTextSel]}>En ligne</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, paymentMode === "cash" && styles.modeBtnSel]}
            onPress={() => setPaymentMode("cash")}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="cash" size={16} color={paymentMode === "cash" ? Colors.white : Colors.forest} />
            <Text style={[styles.modeBtnText, paymentMode === "cash" && styles.modeBtnTextSel]}>Espèces</Text>
          </TouchableOpacity>
        </View>

        {/* Espèces warning */}
        {paymentMode === "cash" && (
          <View style={styles.cashWarning}>
            <MaterialCommunityIcons name="alert" size={16} color="#D97706" />
            <Text style={styles.cashWarningText}>
              Le service de séquestre ne sera pas disponible avec ce mode de paiement. Vous payez directement l'artisan après l'intervention.
            </Text>
          </View>
        )}

        {/* Payment methods (online only) */}
        {paymentMode === "online" && (
          <>
        <Text style={styles.sectionLabel}>Mode de paiement</Text>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setMethod(m.id)}
            activeOpacity={0.7}
            style={[
              styles.methodCard,
              method === m.id && styles.methodCardSel,
            ]}
          >
            <View
              style={[
                styles.radio,
                method === m.id && styles.radioSel,
              ]}
            />
            <MaterialCommunityIcons
              name={m.icon as any}
              size={18}
              color={method === m.id ? Colors.forest : Colors.navy}
            />
            <Text style={styles.methodLabel}>{m.label}</Text>
            {m.id === "apple" && (
              <View style={styles.appleIcon}>
                <MaterialCommunityIcons name="apple" size={16} color={Colors.navy} />
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* ── Paiement en plusieurs fois — Klarna ── */}
        <View style={styles.klarnaSectionHeader}>
          <Text style={styles.sectionLabel}>Paiement en plusieurs fois</Text>
          <View style={styles.klarnaBadge}>
            <Text style={styles.klarnaBadgeText}>Klarna</Text>
          </View>
        </View>

        <View style={styles.installGrid}>
          {INSTALLMENT_OPTIONS.map((inst) => {
            const selected = installment === inst.id;
            const n = parseInt(inst.id.replace("x", ""), 10);
            const monthlyAmt = (AMOUNT / n).toFixed(2).replace(".", ",");
            return (
              <TouchableOpacity
                key={inst.id}
                onPress={() => setInstallment(inst.id)}
                style={[
                  styles.installCard,
                  selected && styles.installCardSel,
                ]}
                activeOpacity={0.7}
              >
                {inst.badge && (
                  <View style={[styles.installBadge, selected && styles.installBadgeSel]}>
                    <Text style={[styles.installBadgeText, selected && { color: Colors.white }]}>
                      {inst.badge}
                    </Text>
                  </View>
                )}
                <Text style={[styles.installLabel, selected && styles.installLabelSel]}>
                  {inst.label}
                </Text>
                <Text style={[styles.installAmount, selected && styles.installAmountSel]}>
                  {n === 1 ? `${AMOUNT_FMT} €` : `${monthlyAmt} €/mois`}
                </Text>
                {inst.id !== "1x" && (
                  <Text style={[styles.installSub, selected && { color: "rgba(255,255,255,0.7)" }]}>
                    soit {AMOUNT_FMT} € au total
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Klarna detail banner */}
        {isKlarna && (
          <View style={styles.klarnaDetailCard}>
            <View style={styles.klarnaDetailHeader}>
              <View style={styles.klarnaLogoBadge}>
                <Text style={styles.klarnaLogoText}>K</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.klarnaDetailTitle}>
                  Payez en {installment} avec Klarna
                </Text>
                <Text style={styles.klarnaDetailSub}>Sans frais, 0% d'intérêt</Text>
              </View>
            </View>

            {/* Échéancier */}
            <View style={styles.klarnaTimeline}>
              {Array.from({ length: Number(installment.replace("x", "")) }).map((_, i) => {
                const total = Number(installment.replace("x", ""));
                const monthlyAmount = (AMOUNT / total).toFixed(2).replace(".", ",");
                const months = ["Aujourd'hui", "Mois 2", "Mois 3", "Mois 4"];
                return (
                  <View key={i} style={styles.klarnaTimelineStep}>
                    <View style={[styles.klarnaTimelineDot, i === 0 && styles.klarnaTimelineDotActive]} />
                    {i < total - 1 && <View style={styles.klarnaTimelineLine} />}
                    <Text style={styles.klarnaTimelineLabel}>{months[i]}</Text>
                    <Text style={styles.klarnaTimelineAmount}>{monthlyAmount} €</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.klarnaFeatures}>
              {[
                "Aucun frais supplémentaire",
                "Prélèvement automatique",
                "Remboursement anticipé possible",
              ].map((f, i) => (
                <View key={i} style={styles.klarnaFeatureRow}>
                  <MaterialCommunityIcons name="check-circle" size={14} color={Colors.forest} />
                  <Text style={styles.klarnaFeatureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Card fields (visible when CB selected) */}
        {method === "cb" && !isKlarna && (
          <View style={{ marginTop: 16 }}>
            <Input
              label="Numéro de carte"
              placeholder="4242 4242 4242 4242"
              keyboardType="number-pad"
            />
            <View style={styles.cardFieldsRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Expiration"
                  placeholder="MM/AA"
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="CVV"
                  placeholder="123"
                  keyboardType="number-pad"
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}
          </>
        )}

        {/* ── Crédit travaux CTA (pour gros montants) ── */}
        {paymentMode === "online" && AMOUNT >= 300 && (
          <TouchableOpacity
            style={styles.creditTravauxCta}
            activeOpacity={0.85}
            onPress={() => nav.navigate("CreditTravaux")}
          >
            <View style={styles.creditTravauxIcon}>
              <MaterialCommunityIcons name="bank-outline" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.creditTravauxTitle}>Besoin de financer vos travaux ?</Text>
              <Text style={styles.creditTravauxSub}>
                Crédit travaux de 500€ à 75 000€ via Cofidis ou Alma
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.forest} />
          </TouchableOpacity>
        )}

        {/* Escrow info */}
        {paymentMode === "online" && (
          <View style={styles.escrowInfo}>
            <Text style={{ fontSize: 16 }}><MaterialCommunityIcons name="shield-check" size={20} color={Colors.forest} /></Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.escrowInfoTitle}>Votre argent est sécurisé</Text>
              <Text style={styles.escrowInfoDesc}>
                {isKlarna
                  ? `Klarna avance le paiement total. Le montant est bloqué en séquestre. L'artisan ne sera payé qu'après validation.`
                  : `Le montant est bloqué sur notre compte séquestre. L'artisan ne sera payé qu'après validation par nos équipes.`}
              </Text>
            </View>
          </View>
        )}

        {/* Pay button */}
        <Button
          title={
            paymentMode === "cash"
              ? "Confirmer (paiement en espèces)"
              : isKlarna
              ? `Payer en ${installment} avec Klarna`
              : `Payer ${AMOUNT_FMT}€`
          }
          onPress={handlePay}
          loading={loading}
          fullWidth
          size="lg"
        />

        {/* Security row */}
        <View style={styles.securityRow}>
          {[
            "Paiement sécurisé SSL",
            "Données chiffrées",
            "Séquestre garanti",
            ...(isKlarna ? ["Klarna certifié"] : []),
          ].map((t, i) => (
            <Text key={i} style={styles.securityText}>
              <MaterialCommunityIcons name="check-circle" size={14} color={Colors.success} /> {t}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "600" },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },

  /* Amount */
  amount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 28,
    fontWeight: "700",
    color: Colors.navy,
    textAlign: "center",
    marginVertical: 8,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 10,
  },

  /* Mode selector */
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  modeBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  modeBtnSel: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  modeBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.forest },
  modeBtnTextSel: { color: Colors.white },
  cashWarning: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "#FFFBEB", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#FDE68A", marginBottom: 16,
  },
  cashWarningText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 19, fontFamily: "DMSans_400Regular" },

  /* Method cards */
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  methodCardSel: {
    backgroundColor: "rgba(27,107,78,0.05)",
    borderWidth: 2,
    borderColor: Colors.forest,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B0B0BB",
  },
  radioSel: {
    borderWidth: 6,
    borderColor: Colors.forest,
  },
  methodLabel: { fontSize: 14, fontWeight: "500", color: Colors.navy },
  appleIcon: { marginLeft: -4 },

  /* ── Klarna section ── */
  klarnaSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 0,
  },
  klarnaBadge: {
    backgroundColor: KLARNA_COLOR,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  klarnaBadgeText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 11,
    color: KLARNA_TEXT,
    letterSpacing: 0.5,
  },

  /* Installment grid */
  installGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  installCard: {
    width: "48%",
    flexGrow: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  installCardSel: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
    ...Shadows.md,
  },
  installBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(27,107,78,0.08)",
    borderBottomLeftRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  installBadgeSel: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  installBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    color: Colors.forest,
  },
  installLabel: {
    fontSize: 20,
    fontFamily: "Manrope_800ExtraBold",
    color: Colors.navy,
    marginBottom: 2,
  },
  installLabelSel: { color: Colors.white },
  installAmount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
    color: Colors.navy,
    opacity: 0.85,
  },
  installAmountSel: { color: Colors.white, opacity: 1 },
  installSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  /* Klarna detail card */
  klarnaDetailCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: "rgba(255,179,199,0.3)",
  },
  klarnaDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  klarnaLogoBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: KLARNA_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  klarnaLogoText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 18,
    color: KLARNA_TEXT,
  },
  klarnaDetailTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  klarnaDetailSub: {
    fontSize: 12,
    color: Colors.forest,
    fontFamily: "DMSans_500Medium",
  },

  /* Klarna timeline */
  klarnaTimeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  klarnaTimelineStep: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  klarnaTimelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    marginBottom: 6,
  },
  klarnaTimelineDotActive: {
    backgroundColor: Colors.forest,
  },
  klarnaTimelineLine: {
    position: "absolute",
    top: 5,
    left: "55%",
    right: "-45%",
    height: 2,
    backgroundColor: Colors.border,
  },
  klarnaTimelineLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: "DMSans_500Medium",
    marginBottom: 2,
  },
  klarnaTimelineAmount: {
    fontFamily: "DMMono_700Bold",
    fontSize: 12,
    color: Colors.navy,
  },
  klarnaFeatures: { gap: 6 },
  klarnaFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  klarnaFeatureText: {
    fontSize: 12,
    color: "#4A5568",
    fontFamily: "DMSans_500Medium",
  },

  /* Card fields */
  cardFieldsRow: { flexDirection: "row", gap: 12 },

  /* ── Crédit travaux CTA ── */
  creditTravauxCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: "rgba(27,107,78,0.12)",
    borderStyle: "dashed",
  },
  creditTravauxIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  creditTravauxTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
    color: Colors.navy,
  },
  creditTravauxSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  /* Escrow info */
  escrowInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginVertical: 20,
  },
  escrowInfoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#14523B",
    marginBottom: 4,
  },
  escrowInfoDesc: {
    fontSize: 12.5,
    color: "#4A5568",
    lineHeight: 18,
  },

  /* Security row */
  securityRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
    flexWrap: "wrap",
  },
  securityText: { fontSize: 10, color: Colors.textMuted },
});
