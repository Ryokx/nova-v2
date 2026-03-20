import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

/* ---- mock line items ---- */
const lineItems = [
  { desc: "Robinet mitigeur", qty: "1", unit: "85,00\u20AC", total: "85,00\u20AC" },
  { desc: "Main d'\u0153uvre", qty: "2h", unit: "65,00\u20AC", total: "130,00\u20AC" },
];

const details = [
  { key: "Date d'intervention", value: "22 mars 2026" },
  { key: "Validit\u00E9 du devis", value: "14 jours (expire le 31 mars)" },
  { key: "Adresse", value: "12 rue de Rivoli, Paris 4e" },
];

export function DevisReceivedScreen({
  navigation,
}: RootStackScreenProps<"DevisReceived">) {
  const [accepted, setAccepted] = useState(false);

  /* ---- Success state ---- */
  if (accepted) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <Text style={styles.successCheck}>{"\u2713"}</Text>
        </View>
        <Text style={styles.successTitle}>Devis accept\u00E9 !</Text>
        <Text style={styles.successDesc}>
          Vous allez \u00EAtre redirig\u00E9 vers le paiement s\u00E9curis\u00E9
        </Text>
        <Badge label={"\uD83D\uDD12 Paiement S\u00E9curis\u00E9"} variant="default" />
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryBtnText}>Proc\u00E9der au paiement</Text>
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
        <Text style={styles.headerTitle}>Devis re\u00E7u</Text>
      </View>

      {/* Sub-header with ref */}
      <View style={styles.subHeader}>
        <Text style={styles.devisRef}>#DEV-2026-089</Text>
        <Text style={styles.devisTime}>Re\u00E7u il y a 12 min</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Artisan info */}
        <View style={styles.artisanCard}>
          <Avatar name="Jean-Michel P." size={48} radius={16} />
          <View style={{ flex: 1 }}>
            <Text style={styles.artisanName}>Jean-Michel P.</Text>
            <Text style={styles.artisanSub}>
              Plombier {"\u2022"} Certifi\u00E9 Nova
            </Text>
          </View>
          <Text style={{ fontSize: 20 }}>{"\uD83D\uDEE1\uFE0F"}</Text>
        </View>

        {/* Quote document */}
        <View style={styles.quoteCard}>
          <Text style={styles.missionLabel}>Mission</Text>
          <Text style={styles.missionTitle}>
            Remplacement robinet mitigeur cuisine
          </Text>

          {/* Table */}
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                D\u00E9signation
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Qt\u00E9</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>P.U.</Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { flex: 1, textAlign: "right" },
                ]}
              >
                Total
              </Text>
            </View>
            {/* Table rows */}
            {lineItems.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellBold, { flex: 2 }]}>
                  {item.desc}
                </Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.qty}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.unit}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellBold,
                    { flex: 1, textAlign: "right" },
                  ]}
                >
                  {item.total}
                </Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT</Text>
              <Text style={styles.totalValue}>215,00\u20AC</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA (10%)</Text>
              <Text style={styles.totalValue}>21,50\u20AC</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 6 }]}>
              <Text style={styles.grandTotalLabel}>Total TTC</Text>
              <Text style={styles.grandTotalValue}>236,50\u20AC</Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          {details.map((d, i) => (
            <View
              key={d.key}
              style={[
                styles.detailRow,
                i < details.length - 1 && styles.detailRowBorder,
              ]}
            >
              <Text style={styles.detailKey}>{d.key}</Text>
              <Text style={styles.detailValue}>{d.value}</Text>
            </View>
          ))}
        </View>

        {/* Artisan message */}
        <View style={styles.messageCard}>
          <Text style={styles.messageLabel}>Message de l'artisan</Text>
          <Text style={styles.messageText}>
            {"\u00AB"} Bonjour, voici le devis pour l'intervention. N'h\u00E9sitez
            pas \u00E0 me contacter pour toute question. {"\u00BB"}
          </Text>
        </View>

        {/* Escrow info */}
        <View style={styles.escrowInfo}>
          <Text style={{ fontSize: 16 }}>{"\uD83D\uDD12"}</Text>
          <Text style={styles.escrowText}>
            En acceptant ce devis, le montant sera bloqu\u00E9 en s\u00E9questre.
            L'artisan ne sera pay\u00E9 qu'apr\u00E8s validation par Nova.
          </Text>
        </View>

        {/* CTAs */}
        <TouchableOpacity
          style={styles.acceptBtn}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("SignDevis", { devisId: "DEV-2026-089" })
          }
        >
          <Text style={styles.acceptBtnText}>
            Accepter et signer le devis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.refuseBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.refuseBtnText}>Refuser le devis</Text>
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
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  devisRef: {
    fontFamily: "DMMono_600SemiBold",
    fontSize: 13,
    color: Colors.forest,
  },
  devisTime: { fontSize: 11, color: Colors.textHint },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Artisan */
  artisanCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  artisanName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  artisanSub: { fontSize: 12, color: Colors.textHint },

  /* Quote card */
  quoteCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  missionLabel: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.navy,
    marginBottom: 4,
  },
  missionTitle: { fontSize: 14, color: "#4A5568", marginBottom: 14 },

  /* Table */
  table: {
    backgroundColor: Colors.bgPage,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.textMuted,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F4",
  },
  tableCell: { fontSize: 12, color: Colors.textHint },
  tableCellBold: { fontFamily: "DMSans_500Medium", color: Colors.navy },

  /* Totals */
  totalsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: { fontSize: 12, color: Colors.textHint },
  totalValue: { fontSize: 12, color: "#4A5568" },
  grandTotalLabel: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  grandTotalValue: {
    fontFamily: "DMMono_700Bold",
    fontSize: 20,
    color: Colors.navy,
  },

  /* Details */
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  detailKey: { fontSize: 12.5, color: Colors.textHint },
  detailValue: {
    fontSize: 12.5,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.navy,
    textAlign: "right",
    maxWidth: "55%",
  },

  /* Message */
  messageCard: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginBottom: 14,
  },
  messageLabel: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: "#14523B",
    marginBottom: 4,
  },
  messageText: { fontSize: 12.5, color: "#4A5568", lineHeight: 19 },

  /* Escrow */
  escrowInfo: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  escrowText: { fontSize: 12, color: "#14523B", lineHeight: 19, flex: 1 },

  /* Buttons */
  acceptBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...Shadows.md,
  },
  acceptBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
  },
  refuseBtn: {
    width: "100%",
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  refuseBtnText: {
    color: "#4A5568",
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },

  /* Success */
  successRoot: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successCheck: { fontSize: 40, color: Colors.white },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 14,
    color: "#4A5568",
    marginBottom: 6,
    textAlign: "center",
  },
  primaryBtn: {
    height: 52,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    ...Shadows.md,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
  },
});
