import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Button } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

type SendOption = "email" | "pdf" | "both";

const lineItems = [
  { desc: "Remplacement robinet", qty: "1", pu: "85,00\€", total: "85,00\€" },
  { desc: "Main d'\œuvre", qty: "2h", pu: "65,00\€", total: "130,00\€" },
];

const sendOptions: { id: SendOption; label: string }[] = [
  { id: "email", label: "\�\� Email au client" },
  { id: "pdf", label: "\�\� PDF \à t\él\écharger" },
  { id: "both", label: "\�\� Les deux" },
];

export function CreateInvoiceScreen({
  navigation,
}: RootStackScreenProps<"CreateInvoice">) {
  const [sent, setSent] = useState(false);
  const [sendOption, setSendOption] = useState<SendOption>("both");

  if (sent) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>{"\✉\️"}</Text>
          <Text style={styles.successTitle}>Facture envoy\ée !</Text>
          <Text style={styles.successSub}>caroline.l@email.com \✓</Text>
          <Button
            title="Retour au tableau de bord"
            onPress={() => navigation.navigate("ArtisanTabs", { screen: "ArtisanHome" })}
            style={styles.successBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{"\‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Facture g\én\ér\ée</Text>
      </View>

      <Text style={styles.subtitle}>Suite \à la validation de votre mission</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice card */}
        <View style={styles.invoiceCard}>
          {/* PAYE stamp */}
          <View style={styles.stamp}>
            <Text style={styles.stampText}>PAY\É \✓</Text>
          </View>

          {/* Header */}
          <View style={styles.docHeader}>
            <View style={styles.docHeaderLeft}>
              <Text style={styles.docLogo}>{"\�\�\️"}</Text>
              <Text style={styles.docLogoText}>Nova</Text>
            </View>
            <Text style={styles.invoiceId}>#FAC-2026-127</Text>
          </View>

          {/* Parties */}
          <View style={styles.partiesRow}>
            <View>
              <Text style={styles.partyName}>Jean-Michel P.</Text>
              <Text style={styles.partyDetail}>SIRET: 123 456 789</Text>
            </View>
            <View style={styles.partyRight}>
              <Text style={styles.partyName}>Caroline Lef\èvre</Text>
              <Text style={styles.partyDetail}>12 rue de Clichy</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.tableWrap}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>D\ésignation</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Qt\é</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>P.U.</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Total</Text>
            </View>
            {lineItems.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.desc}</Text>
                <Text style={[styles.tableCellGray, { flex: 0.5 }]}>{item.qty}</Text>
                <Text style={[styles.tableCellGray, { flex: 1 }]}>{item.pu}</Text>
                <Text style={[styles.tableCellBold, { flex: 1, textAlign: "right" }]}>{item.total}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.docTotals}>
            <Text style={styles.docTotalSub}>Sous-total: 215,00\€ \• TVA: 21,50\€</Text>
            <Text style={styles.docTotalTTC}>236,50\€ TTC</Text>
          </View>

          <Text style={styles.legalSmall}>
            TVA non applicable, art. 293 B du CGI. Paiement re\çu par Nova SAS.
          </Text>
        </View>

        {/* Send options */}
        <Text style={styles.sendTitle}>Mode d'envoi</Text>
        {sendOptions.map((o) => (
          <TouchableOpacity
            key={o.id}
            style={[
              styles.sendOption,
              sendOption === o.id && styles.sendOptionActive,
            ]}
            onPress={() => setSendOption(o.id)}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.radioCircle,
                sendOption === o.id && styles.radioCircleActive,
              ]}
            />
            <Text style={styles.sendOptionLabel}>{o.label}</Text>
          </TouchableOpacity>
        ))}

        <Button
          title="Envoyer la facture"
          onPress={() => setSent(true)}
          fullWidth
          size="lg"
          style={styles.sendBtn}
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
    paddingBottom: 8,
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
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
    textAlign: "center",
    marginBottom: 8,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Invoice card */
  invoiceCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    overflow: "hidden",
    position: "relative",
    ...Shadows.sm,
  },
  stamp: {
    position: "absolute",
    top: 28,
    right: -8,
    transform: [{ rotate: "15deg" }],
    borderWidth: 3,
    borderColor: "rgba(34,200,138,0.25)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  stampText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 20,
    color: "rgba(34,200,138,0.35)",
  },

  docHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  invoiceId: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
    color: Colors.forest,
  },

  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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
    fontFamily: "DMSans_500Medium",
    fontSize: 11.5,
    color: Colors.navy,
  },
  tableCellGray: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.textHint,
  },
  tableCellBold: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11.5,
    color: Colors.navy,
  },

  docTotals: { alignItems: "flex-end" },
  docTotalSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  docTotalTTC: {
    fontFamily: "DMMono_500Medium",
    fontSize: 18,
    color: Colors.navy,
    marginTop: 4,
  },
  legalSmall: {
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    color: "#C4C9D4",
    lineHeight: 14,
    marginTop: 10,
  },

  /* Send options */
  sendTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 10,
  },
  sendOption: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.xl,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sendOptionActive: {
    backgroundColor: "rgba(27,107,78,0.05)",
    borderWidth: 2,
    borderColor: Colors.forest,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B0B0BB",
  },
  radioCircleActive: {
    borderWidth: 6,
    borderColor: Colors.forest,
  },
  sendOptionLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.navy,
  },
  sendBtn: { marginTop: 8 },

  /* Success */
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successEmoji: { fontSize: 48, marginBottom: 20 },
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
    marginBottom: 16,
  },
  successBtn: { marginTop: 24 },
});
