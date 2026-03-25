import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Button, ConfirmModal } from "../../components/ui";

/* ── Mock data ── */
const availablePayments = [
  { id: "1", client: "Caroline L.", mission: "Remplacement robinet", amount: 236.5, date: "15 mars 2026" },
  { id: "2", client: "Pierre M.", mission: "Installation cumulus", amount: 890.0, date: "12 mars 2026" },
];

const FEE_RATE = 0.04;

export function InstantPayScreen({ navigation }: { navigation: any }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState({ visible: false, type: "info" as const, title: "", message: "", actions: [] as any[] });
  const [paid, setPaid] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === unpaid.length) setSelected(new Set());
    else setSelected(new Set(unpaid.map((p) => p.id)));
  };

  const unpaid = availablePayments.filter((p) => !paid.has(p.id));
  const selectedPayments = unpaid.filter((p) => selected.has(p.id));
  const totalAmount = selectedPayments.reduce((s, p) => s + p.amount, 0);
  const totalFees = totalAmount * FEE_RATE;
  const totalReceived = totalAmount - totalFees;

  const handleInstantPay = () => {
    if (selectedPayments.length === 0) return;
    setModal({
      visible: true,
      type: "warning" as any,
      title: "Confirmer le virement instantané",
      message: `Vous allez recevoir ${totalReceived.toFixed(2)}€ instantanément sur votre compte bancaire.\n\nFrais Instant Pay (4%) : ${totalFees.toFixed(2)}€\nMontant brut : ${totalAmount.toFixed(2)}€\n\nLe virement sera crédité en quelques secondes.`,
      actions: [
        { label: "Annuler", variant: "outline", onPress: () => setModal((m) => ({ ...m, visible: false })) },
        {
          label: "Confirmer",
          onPress: () => {
            const newPaid = new Set(paid);
            selectedPayments.forEach((p) => newPaid.add(p.id));
            setPaid(newPaid);
            setSelected(new Set());
            setModal({
              visible: true,
              type: "success" as any,
              title: "Virement instantané envoyé !",
              message: `${totalReceived.toFixed(2)}€ ont été virés sur votre compte FR76 •••• •••• 4521.\n\nVous recevrez l'argent dans quelques secondes.`,
              actions: [{ label: "Parfait", onPress: () => setModal((m) => ({ ...m, visible: false })) }],
            });
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Instant Pay</Text>
          <Text style={styles.headerSub}>Recevez vos paiements en quelques secondes</Text>
        </View>
        <View style={styles.stripeBadge}>
          <MaterialCommunityIcons name="lightning-bolt" size={14} color={Colors.white} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Explainer */}
        <View style={styles.explainerCard}>
          <View style={styles.explainerHeader}>
            <View style={styles.explainerIconWrap}>
              <MaterialCommunityIcons name="bank-transfer" size={24} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.explainerTitle}>Comment ça marche ?</Text>
              <Text style={styles.explainerDesc}>Virement classique vs Instant Pay</Text>
            </View>
          </View>
          <View style={styles.compareRow}>
            <View style={styles.compareCol}>
              <Text style={styles.compareLabel}>Virement classique</Text>
              <View style={styles.compareValueWrap}>
                <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.compareValue}>2 à 4 jours</Text>
              </View>
              <Text style={styles.compareFee}>Gratuit</Text>
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareCol}>
              <Text style={[styles.compareLabel, { color: Colors.forest }]}>Instant Pay</Text>
              <View style={styles.compareValueWrap}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color={Colors.forest} />
                <Text style={[styles.compareValue, { color: Colors.forest, fontFamily: "Manrope_700Bold" }]}>Quelques secondes</Text>
              </View>
              <Text style={[styles.compareFee, { color: Colors.gold }]}>4% de frais</Text>
            </View>
          </View>
        </View>

        {/* Available payments */}
        {unpaid.length > 0 ? (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Paiements disponibles</Text>
              <TouchableOpacity onPress={selectAll}>
                <Text style={styles.selectAllText}>
                  {selected.size === unpaid.length ? "Tout désélectionner" : "Tout sélectionner"}
                </Text>
              </TouchableOpacity>
            </View>

            {unpaid.map((p) => {
              const isSelected = selected.has(p.id);
              const fee = p.amount * FEE_RATE;
              const net = p.amount - fee;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.payCard, isSelected && styles.payCardSelected]}
                  activeOpacity={0.85}
                  onPress={() => toggleSelect(p.id)}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkMark}>{"✓"}</Text>}
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.payClient}>{p.client}</Text>
                    <Text style={styles.payMission}>{p.mission}</Text>
                    <Text style={styles.payDate}>{p.date}</Text>
                  </View>
                  <View style={styles.payRight}>
                    <Text style={styles.payAmount}>{p.amount.toFixed(2)}€</Text>
                    <Text style={styles.payFee}>-{fee.toFixed(2)}€ frais</Text>
                    <Text style={styles.payNet}>{net.toFixed(2)}€</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="check-circle" size={40} color={Colors.success} />
            </View>
            <Text style={styles.emptyTitle}>Tous les paiements ont été virés !</Text>
            <Text style={styles.emptyDesc}>Vos fonds sont en cours de transfert vers votre compte.</Text>
          </View>
        )}

        {/* Summary */}
        {selected.size > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Récapitulatif</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Montant brut</Text>
              <Text style={styles.summaryValue}>{totalAmount.toFixed(2)}€</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais Instant Pay (4%)</Text>
              <Text style={[styles.summaryValue, { color: Colors.red }]}>-{totalFees.toFixed(2)}€</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowTotal]}>
              <Text style={styles.summaryTotalLabel}>Vous recevez</Text>
              <Text style={styles.summaryTotalValue}>{totalReceived.toFixed(2)}€</Text>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={14} color={Colors.forest} />
          <Text style={styles.infoText}>
            Les frais de 4% couvrent le traitement instantané Stripe. Sans Instant Pay, vos virements sont gratuits sous 2 à 4 jours ouvrés.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {selected.size > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomLabel}>{selected.size} paiement{selected.size > 1 ? "s" : ""}</Text>
            <Text style={styles.bottomAmount}>{totalReceived.toFixed(2)}€</Text>
          </View>
          <TouchableOpacity style={styles.instantBtn} activeOpacity={0.85} onPress={handleInstantPay}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={Colors.white} />
            <Text style={styles.instantBtnText}>Virer maintenant</Text>
          </TouchableOpacity>
        </View>
      )}

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
  stripeBadge: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.forest, alignItems: "center", justifyContent: "center",
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },

  /* Explainer */
  explainerCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: "rgba(27,107,78,0.1)", ...Shadows.sm,
  },
  explainerHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  explainerIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.forest, alignItems: "center", justifyContent: "center",
  },
  explainerTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy },
  explainerDesc: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  compareRow: { flexDirection: "row", backgroundColor: Colors.bgPage, borderRadius: 14, overflow: "hidden" },
  compareCol: { flex: 1, padding: 12, alignItems: "center", gap: 6 },
  compareDivider: { width: 1, backgroundColor: Colors.border },
  compareLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.navy, textAlign: "center" },
  compareValueWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  compareValue: { fontFamily: "DMSans_500Medium", fontSize: 11, color: Colors.textSecondary },
  compareFee: { fontFamily: "DMSans_400Regular", fontSize: 10, color: Colors.success },

  /* Section */
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy },
  selectAllText: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.forest },

  /* Payment card */
  payCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 14,
    marginBottom: 8, borderWidth: 1.5, borderColor: "rgba(10,22,40,0.05)",
  },
  payCardSelected: { borderColor: Colors.forest, backgroundColor: "rgba(27,107,78,0.02)" },
  checkbox: {
    width: 24, height: 24, borderRadius: 8,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: "center", justifyContent: "center",
  },
  checkboxSelected: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  checkMark: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  payClient: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  payMission: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  payDate: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  payRight: { alignItems: "flex-end" },
  payAmount: { fontFamily: "DMMono_500Medium", fontSize: 14, color: Colors.navy },
  payFee: { fontFamily: "DMSans_400Regular", fontSize: 10, color: Colors.red, marginTop: 2 },
  payNet: { fontFamily: "DMMono_500Medium", fontSize: 13, color: Colors.success, marginTop: 1 },

  /* Summary */
  summaryCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    marginTop: 8, marginBottom: 12, borderWidth: 1, borderColor: "rgba(10,22,40,0.04)", ...Shadows.sm,
  },
  summaryTitle: { fontFamily: "Manrope_700Bold", fontSize: 14, color: Colors.navy, marginBottom: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  summaryLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  summaryValue: { fontFamily: "DMMono_500Medium", fontSize: 13, color: Colors.navy },
  summaryRowTotal: { borderTopWidth: 1, borderTopColor: Colors.surface, paddingTop: 10, marginTop: 4 },
  summaryTotalLabel: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy },
  summaryTotalValue: { fontFamily: "DMMono_500Medium", fontSize: 18, color: Colors.success },

  /* Info */
  infoBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: "rgba(27,107,78,0.08)",
  },
  infoText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: "#14523B", flex: 1, lineHeight: 16 },

  /* Empty */
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { marginBottom: 12 },
  emptyTitle: { fontFamily: "Manrope_700Bold", fontSize: 17, color: Colors.navy, marginBottom: 4 },
  emptyDesc: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary, textAlign: "center" },

  /* Bottom bar */
  bottomBar: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 28,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: "rgba(10,22,40,0.04)",
  },
  bottomInfo: { flex: 1 },
  bottomLabel: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary },
  bottomAmount: { fontFamily: "DMMono_500Medium", fontSize: 20, color: Colors.navy },
  instantBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: Colors.forest, borderRadius: 14,
    paddingHorizontal: 22, paddingVertical: 14, ...Shadows.md,
  },
  instantBtnText: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.white },
});
