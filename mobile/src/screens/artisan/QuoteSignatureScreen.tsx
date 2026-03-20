import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Button, Badge } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const lineItems = [
  { desc: "Remplacement robinet", qty: "1", pu: "85,00\u20AC", total: "85,00\u20AC" },
  { desc: "Main d'\u0153uvre", qty: "2h", pu: "65,00\u20AC", total: "130,00\u20AC" },
];

export function QuoteSignatureScreen({
  navigation,
}: RootStackScreenProps<"QuoteSignature">) {
  const [signed, setSigned] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Signature pad tracking (simplified — real implementation would use a
  // library like react-native-signature-canvas)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setHasDrawn(true),
      onPanResponderMove: () => {},
      onPanResponderRelease: () => {},
    })
  ).current;

  if (signed) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successCheck}>{"\u2713"}</Text>
          </View>
          <Text style={styles.successTitle}>Devis sign\u00E9 !</Text>
          <Text style={styles.successSub}>Paiement s\u00E9curis\u00E9 par Nova</Text>
          <Badge label="\uD83D\uDD12 Paiement S\u00E9curis\u00E9" variant="default" size="md" />
          <Button
            title="Voir mes paiements"
            onPress={() => navigation.navigate("ArtisanTabs", { screen: "ArtisanPayments" })}
            style={styles.successBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Back header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Devis \u00E0 signer</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Devis ID */}
        <Text style={styles.devisId}>#DEV-2026-089</Text>

        {/* Document preview */}
        <View style={styles.docCard}>
          {/* Doc header */}
          <View style={styles.docHeader}>
            <View style={styles.docHeaderLeft}>
              <Text style={styles.docLogo}>{"\uD83D\uDEE1\uFE0F"}</Text>
              <Text style={styles.docLogoText}>Nova</Text>
            </View>
            <Text style={styles.docType}>DEVIS</Text>
          </View>

          {/* Parties */}
          <View style={styles.partiesRow}>
            <View>
              <Text style={styles.partyName}>Jean-Michel P.</Text>
              <Text style={styles.partyDetail}>SIRET: 123 456 789</Text>
            </View>
            <View style={styles.partyRight}>
              <Text style={styles.partyName}>Caroline Lef\u00E8vre</Text>
              <Text style={styles.partyDetail}>12 rue de Clichy</Text>
            </View>
          </View>

          {/* Line items table */}
          <View style={styles.tableWrap}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>D\u00E9signation</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Qt\u00E9</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>P.U.</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Total</Text>
            </View>
            {lineItems.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2, fontFamily: "DMSans_500Medium" }]}>{item.desc}</Text>
                <Text style={[styles.tableCellGray, { flex: 0.5 }]}>{item.qty}</Text>
                <Text style={[styles.tableCellGray, { flex: 1 }]}>{item.pu}</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: "right", fontFamily: "DMSans_600SemiBold" }]}>{item.total}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.docTotals}>
            <Text style={styles.docTotalSub}>Total HT: 215,00\u20AC \u2022 TVA: 21,50\u20AC</Text>
            <Text style={styles.docTotalTTC}>236,50\u20AC TTC</Text>
          </View>
        </View>

        {/* Signature section */}
        <Text style={styles.signatureTitle}>Signature</Text>
        <View style={styles.signaturePad} {...panResponder.panHandlers}>
          {!hasDrawn && (
            <Text style={styles.signaturePlaceholder}>Signez ici avec le doigt</Text>
          )}
        </View>

        <View style={styles.signatureActions}>
          <TouchableOpacity onPress={() => setHasDrawn(false)}>
            <Text style={styles.clearText}>Effacer</Text>
          </TouchableOpacity>
          <Text style={styles.signatureDate}>17 mars 2026</Text>
        </View>

        {/* Legal */}
        <View style={styles.legalBox}>
          <Text style={styles.legalText}>
            En signant, vous acceptez ce devis et autorisez Nova \u00E0 bloquer le montant en s\u00E9questre.
          </Text>
        </View>

        <Button
          title="Signer et valider le devis"
          onPress={() => setSigned(true)}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { fontSize: 24, color: Colors.forest, marginTop: -2 },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  devisId: {
    fontFamily: "DMMono_600SemiBold",
    fontSize: 13,
    color: Colors.forest,
    textAlign: "center",
    marginBottom: 12,
  },

  /* Document card */
  docCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  docHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  docHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  docLogo: { fontSize: 16 },
  docLogoText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.navy,
  },
  docType: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: Colors.textHint,
  },

  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  partyRight: { alignItems: "flex-end" },
  partyName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11.5,
    color: Colors.navy,
    marginBottom: 2,
  },
  partyDetail: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.textMuted,
  },

  /* Table */
  tableWrap: {
    backgroundColor: Colors.bgPage,
    borderRadius: Radii.md,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tableHeaderCell: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    color: Colors.textMuted,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F4",
  },
  tableCell: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.navy,
  },
  tableCellGray: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.textHint,
  },

  docTotals: { alignItems: "flex-end" },
  docTotalSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  docTotalTTC: {
    fontFamily: "DMMono_700Bold",
    fontSize: 18,
    color: Colors.navy,
    marginTop: 4,
  },

  /* Signature */
  signatureTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 10,
  },
  signaturePad: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    height: 110,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.3)",
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  signaturePlaceholder: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
  },
  signatureActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  clearText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: Colors.red,
  },
  signatureDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },

  /* Legal */
  legalBox: {
    backgroundColor: Colors.bgPage,
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.03)",
  },
  legalText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#4A5568",
    lineHeight: 19,
  },

  /* Success */
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    ...Shadows.lg,
  },
  successCheck: {
    fontSize: 36,
    color: Colors.white,
    fontFamily: "Manrope_700Bold",
  },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 6,
  },
  successSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.textHint,
    marginBottom: 8,
  },
  successBtn: { marginTop: 24 },
});
