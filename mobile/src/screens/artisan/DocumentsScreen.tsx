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
import type { RootStackScreenProps } from "../../navigation/types";

type DocTab = "devis" | "factures";

interface DocItem {
  id: string;
  client: string;
  clientAddr: string;
  date: string;
  amount: string;
  ht: string;
  tva: string;
  status: string;
  sColor: string;
  lines: string[][];
  validity?: string;
  paid?: boolean;
}

const docs: Record<DocTab, DocItem[]> = {
  devis: [
    {
      id: "#DEV-2026-089", client: "Caroline Lef\u00E8vre", clientAddr: "12 rue de Clichy, 75009 Paris",
      date: "17 mars 2026", amount: "236,50\u20AC", ht: "215,00\u20AC", tva: "21,50\u20AC",
      status: "Accept\u00E9", sColor: Colors.success,
      lines: [["Remplacement robinet mitigeur", "1", "85,00\u20AC", "85,00\u20AC"], ["Main d'\u0153uvre", "2h", "65,00\u20AC", "130,00\u20AC"]],
      validity: "14 jours",
    },
    {
      id: "#DEV-2026-085", client: "Pierre Martin", clientAddr: "5 rue de Charonne, 75011 Paris",
      date: "10 mars 2026", amount: "890,00\u20AC", ht: "809,09\u20AC", tva: "80,91\u20AC",
      status: "En attente", sColor: Colors.gold,
      lines: [["Installation cumulus 200L", "1", "450,00\u20AC", "450,00\u20AC"], ["Raccordement plomberie", "1", "200,00\u20AC", "200,00\u20AC"], ["Main d'\u0153uvre", "2h", "65,00\u20AC", "130,00\u20AC"]],
      validity: "30 jours",
    },
    {
      id: "#DEV-2026-078", client: "Am\u00E9lie Renard", clientAddr: "23 bd Voltaire, 75011 Paris",
      date: "28 f\u00E9v 2026", amount: "450,00\u20AC", ht: "409,09\u20AC", tva: "40,91\u20AC",
      status: "Refus\u00E9", sColor: Colors.red,
      lines: [["R\u00E9paration chauffe-eau", "1", "250,00\u20AC", "250,00\u20AC"], ["Main d'\u0153uvre", "2h", "65,00\u20AC", "130,00\u20AC"]],
      validity: "7 jours",
    },
  ],
  factures: [
    {
      id: "#FAC-2026-127", client: "Am\u00E9lie Renard", clientAddr: "23 bd Voltaire, 75011 Paris",
      date: "12 mars 2026", amount: "450,00\u20AC", ht: "409,09\u20AC", tva: "40,91\u20AC",
      status: "Pay\u00E9e", sColor: Colors.success, paid: true,
      lines: [["R\u00E9paration chauffe-eau", "1", "250,00\u20AC", "250,00\u20AC"], ["Main d'\u0153uvre", "2h", "65,00\u20AC", "130,00\u20AC"]],
    },
    {
      id: "#FAC-2026-119", client: "Luc Dupont", clientAddr: "8 rue de Lappe, 75011 Paris",
      date: "5 mars 2026", amount: "320,00\u20AC", ht: "290,91\u20AC", tva: "29,09\u20AC",
      status: "Pay\u00E9e", sColor: Colors.success, paid: true,
      lines: [["R\u00E9paration fuite", "1", "180,00\u20AC", "180,00\u20AC"], ["Main d'\u0153uvre", "1.5h", "65,00\u20AC", "97,50\u20AC"]],
    },
    {
      id: "#FAC-2026-104", client: "Marie Torres", clientAddr: "14 rue Oberkampf, 75011 Paris",
      date: "28 f\u00E9v 2026", amount: "185,00\u20AC", ht: "168,18\u20AC", tva: "16,82\u20AC",
      status: "Pay\u00E9e", sColor: Colors.success, paid: true,
      lines: [["D\u00E9bouchage canalisation", "1", "120,00\u20AC", "120,00\u20AC"], ["Main d'\u0153uvre", "1h", "65,00\u20AC", "65,00\u20AC"]],
    },
  ],
};

export function ArtisanDocumentsScreen({
  navigation,
}: RootStackScreenProps<"ArtisanDocuments">) {
  const [tab, setTab] = useState<DocTab>("devis");
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const items = docs[tab];
  const isDevis = tab === "devis";

  // Detail view
  if (selectedDoc) {
    const d = selectedDoc;
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedDoc(null)}>
            <Text style={styles.backIcon}>{"\u2039"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isDevis ? "D\u00E9tail du devis" : "D\u00E9tail de la facture"}
          </Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ID + status */}
          <View style={styles.idStatusRow}>
            <Text style={styles.docId}>{d.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: d.sColor + "18" }]}>
              <Text style={[styles.statusBadgeText, { color: d.sColor }]}>{d.status}</Text>
            </View>
          </View>

          {/* Document */}
          <View style={styles.docCard}>
            {d.paid && (
              <View style={styles.stamp}>
                <Text style={styles.stampText}>PAY\u00C9 \u2713</Text>
              </View>
            )}

            <View style={styles.docHeader}>
              <View style={styles.docHeaderLeft}>
                <Text style={styles.docLogo}>{"\uD83D\uDEE1\uFE0F"}</Text>
                <Text style={styles.docLogoText}>Nova</Text>
              </View>
              <Text style={styles.docType}>{isDevis ? "DEVIS" : "FACTURE"}</Text>
            </View>

            {/* Parties */}
            <View style={styles.partiesRow}>
              <View>
                <Text style={styles.partyName}>Jean-Michel Petit</Text>
                <Text style={styles.partyDetail}>JM Plomberie Pro</Text>
                <Text style={styles.partyDetail}>SIRET: 123 456 789 00012</Text>
              </View>
              <View style={styles.partyRight}>
                <Text style={styles.partyName}>{d.client}</Text>
                <Text style={styles.partyDetail}>{d.clientAddr}</Text>
              </View>
            </View>

            {/* Date + validity */}
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>Date : {d.date}</Text>
              {d.validity && <Text style={styles.dateText}>Validit\u00E9 : {d.validity}</Text>}
            </View>

            {/* Lines */}
            <View style={styles.tableWrap}>
              <View style={styles.tableHeader}>
                <Text style={[styles.thCell, { flex: 2 }]}>D\u00E9signation</Text>
                <Text style={[styles.thCell, { flex: 0.5 }]}>Qt\u00E9</Text>
                <Text style={[styles.thCell, { flex: 1 }]}>P.U.</Text>
                <Text style={[styles.thCell, { flex: 1, textAlign: "right" }]}>Total</Text>
              </View>
              {d.lines.map(([desc, qty, pu, total], i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tdCell, { flex: 2 }]}>{desc}</Text>
                  <Text style={[styles.tdGray, { flex: 0.5 }]}>{qty}</Text>
                  <Text style={[styles.tdGray, { flex: 1 }]}>{pu}</Text>
                  <Text style={[styles.tdBold, { flex: 1, textAlign: "right" }]}>{total}</Text>
                </View>
              ))}
            </View>

            {/* Totals */}
            <View style={styles.totals}>
              <Text style={styles.totalSub}>Total HT : {d.ht}</Text>
              <Text style={styles.totalSub}>TVA (10%) : {d.tva}</Text>
              <Text style={styles.totalTTC}>{d.amount} TTC</Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.pdfBtn}>
            <Text style={styles.pdfBtnIcon}>{"\uD83D\uDCC4"}</Text>
            <Text style={styles.pdfBtnText}>T\u00E9l\u00E9charger en PDF</Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnIcon}>{"\uD83D\uDCAC"}</Text>
              <Text style={styles.actionBtnText}>Envoyer au client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnIcon}>{"\uD83D\uDCC4"}</Text>
              <Text style={styles.actionBtnText}>Dupliquer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // List view
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes documents</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabRow}>
          {(["devis", "factures"] as DocTab[]).map((t) => {
            const active = tab === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {t === "devis" ? "Devis" : "Factures"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.countText}>
          {items.length} {isDevis ? "devis" : `facture${items.length > 1 ? "s" : ""}`}
        </Text>

        {items.map((d, i) => (
          <TouchableOpacity
            key={i}
            style={styles.listCard}
            onPress={() => setSelectedDoc(d)}
            activeOpacity={0.85}
          >
            <View style={styles.listCardTop}>
              <Text style={styles.listDocId}>{d.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: d.sColor + "18" }]}>
                <Text style={[styles.statusBadgeText, { color: d.sColor }]}>{d.status}</Text>
              </View>
            </View>
            <Text style={styles.listClient}>{d.client}</Text>
            <View style={styles.listCardBottom}>
              <Text style={styles.listDate}>{d.date}</Text>
              <Text style={styles.listAmount}>{d.amount}</Text>
            </View>
          </TouchableOpacity>
        ))}
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

  /* Tabs */
  tabRow: { flexDirection: "row", gap: 6, marginBottom: 16 },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
    ...Shadows.sm,
  },
  tabText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#4A5568",
  },
  tabTextActive: { color: Colors.white },

  countText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 12,
  },

  /* List card */
  listCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  listCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  listDocId: {
    fontFamily: "DMMono_500Medium",
    fontSize: 13,
    color: Colors.forest,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },
  listClient: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 2,
  },
  listCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  listAmount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 14,
    color: Colors.navy,
  },

  /* Detail view */
  idStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  docId: {
    fontFamily: "DMMono_500Medium",
    fontSize: 13,
    color: Colors.forest,
  },

  docCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 20,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    position: "relative",
    overflow: "hidden",
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

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  dateText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },

  tableWrap: {
    backgroundColor: Colors.bgPage,
    borderRadius: Radii.md,
    overflow: "hidden",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  thCell: {
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
  tdCell: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11.5,
    color: Colors.navy,
  },
  tdGray: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.textHint,
  },
  tdBold: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11.5,
    color: Colors.navy,
  },

  totals: { alignItems: "flex-end" },
  totalSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  totalTTC: {
    fontFamily: "DMMono_500Medium",
    fontSize: 20,
    color: Colors.navy,
    marginTop: 6,
  },

  /* Detail actions */
  pdfBtn: {
    backgroundColor: Colors.deepForest,
    borderRadius: Radii.xl,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  pdfBtnIcon: { fontSize: 16 },
  pdfBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.white,
  },
  actionRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radii.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionBtnIcon: { fontSize: 14 },
  actionBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },
});
