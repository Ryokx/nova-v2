import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import type { ArtisanTabScreenProps } from "../../navigation/types";

type PayTab = "escrow" | "received" | "pending";

const tabs: { id: PayTab; label: string }[] = [
  { id: "escrow", label: "En séquestre" },
  { id: "received", label: "Reçus" },
  { id: "pending", label: "En attente" },
];

const escrowPayments = [
  { client: "Caroline L.", mission: "Remplacement robinet", amount: "236,50€", days: 3 },
  { client: "Pierre M.", mission: "Installation cumulus", amount: "890,00€", days: 5 },
];

const receivedPayments = [
  { client: "Amélie R.", amount: "450,00€", date: "12 mars 2026" },
  { client: "Luc D.", amount: "320,00€", date: "5 mars 2026" },
  { client: "Marie T.", amount: "185,00€", date: "28 fév 2026" },
];

export function ArtisanPaymentsScreen({
  navigation,
}: ArtisanTabScreenProps<"ArtisanPayments">) {
  const [tab, setTab] = useState<PayTab>("escrow");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes paiements</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabRow}>
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(t.id)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Escrow */}
        {tab === "escrow" && (
          <>
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerIcon}><MaterialCommunityIcons name="shield-lock" size={18} color={Colors.forest} /></Text>
              <Text style={styles.infoBannerText}>
                Fonds sécurisés chez Nova. Virement sous 48h après validation par nos équipes.
              </Text>
            </View>
            {escrowPayments.map((m, i) => (
              <View key={i} style={styles.payCard}>
                <View style={styles.payCardTop}>
                  <View>
                    <Text style={styles.payClient}>{m.client}</Text>
                    <Text style={styles.payMission}>{m.mission}</Text>
                  </View>
                  <Text style={styles.payAmount}>{m.amount}</Text>
                </View>
                {/* Progress bar */}
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${((7 - m.days) / 7) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.payDays}>
                  Validation dans {m.days} jours
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Received */}
        {tab === "received" && (
          <>
            {receivedPayments.map((p, i) => (
              <View key={i} style={styles.receivedCard}>
                <View>
                  <Text style={styles.payClient}>{p.client}</Text>
                  <Text style={styles.receivedDate}>{p.date}</Text>
                </View>
                <View style={styles.receivedRight}>
                  <Text style={styles.receivedAmount}>{p.amount}</Text>
                  <Text style={styles.receivedStatus}>Virement effectué ✓</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Pending — empty state */}
        {tab === "pending" && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}><MaterialCommunityIcons name="clock-outline" size={32} color={Colors.textHint} /></Text>
            <Text style={styles.emptyText}>Aucun paiement en attente</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
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
    fontSize: 12,
    color: "#4A5568",
  },
  tabTextActive: { color: Colors.white },

  /* Info banner */
  infoBanner: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: Radii.xl,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
  },
  infoBannerIcon: { fontSize: 16 },
  infoBannerText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#14523B",
    lineHeight: 18,
    flex: 1,
  },

  /* Payment card (escrow) */
  payCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  payCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  payClient: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  payMission: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  payAmount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 16,
    color: Colors.navy,
  },
  progressBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: Colors.forest,
  },
  payDays: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10.5,
    color: Colors.textMuted,
  },

  /* Received */
  receivedCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  receivedDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  receivedRight: { alignItems: "flex-end" },
  receivedAmount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 15,
    color: Colors.success,
  },
  receivedStatus: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: Colors.success,
  },

  /* Empty */
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.textMuted,
  },
});
