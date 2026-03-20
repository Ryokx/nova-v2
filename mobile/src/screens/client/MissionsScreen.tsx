import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar } from "../../components/ui";
import type { ClientTabScreenProps } from "../../navigation/types";

/* ── Types ── */
type MissionStatus = "all" | "active" | "completed" | "validated" | "dispute";

interface Mission {
  id: string;
  artisan: string;
  initials: string;
  type: string;
  date: string;
  amount: string;
  status: MissionStatus;
  statusLabel: string;
  statusColor: string;
}

/* ── Filter tabs ── */
const tabs: { id: MissionStatus; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "active", label: "En cours" },
  { id: "completed", label: "Termin\u00e9es" },
  { id: "validated", label: "Valid\u00e9es" },
  { id: "dispute", label: "Litiges" },
];

/* ── Mock data ── */
const missions: Mission[] = [
  {
    id: "1",
    artisan: "Jean-Michel P.",
    initials: "JM",
    type: "Plomberie \u2014 R\u00e9paration fuite",
    date: "15 mars 2026",
    amount: "320,00\u20AC",
    status: "active",
    statusLabel: "En cours",
    statusColor: Colors.gold,
  },
  {
    id: "2",
    artisan: "Sophie M.",
    initials: "SM",
    type: "\u00c9lectricit\u00e9 \u2014 Installation prise",
    date: "10 mars 2026",
    amount: "195,00\u20AC",
    status: "completed",
    statusLabel: "Termin\u00e9e",
    statusColor: Colors.success,
  },
  {
    id: "3",
    artisan: "Karim B.",
    initials: "KB",
    type: "Serrurerie \u2014 Remplacement serrure",
    date: "2 mars 2026",
    amount: "280,00\u20AC",
    status: "validated",
    statusLabel: "Valid\u00e9e",
    statusColor: Colors.forest,
  },
  {
    id: "4",
    artisan: "Thomas R.",
    initials: "TR",
    type: "Plomberie \u2014 Fuite chauffe-eau",
    date: "18 f\u00e9v 2026",
    amount: "450,00\u20AC",
    status: "dispute",
    statusLabel: "Litige",
    statusColor: Colors.red,
  },
];

export function ClientMissionsScreen({
  navigation,
}: ClientTabScreenProps<"ClientMissions">) {
  const [activeTab, setActiveTab] = useState<MissionStatus>("all");

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? missions
        : missions.filter((m) => m.status === activeTab),
    [activeTab],
  );

  const renderMission = ({ item }: { item: Mission }) => (
    <TouchableOpacity
      style={[
        styles.missionCard,
        item.status === "dispute" && styles.missionCardDispute,
      ]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("MissionDetail", { id: item.id })}
    >
      <View style={styles.missionRow}>
        {/* Avatar */}
        <Avatar name={item.artisan} size={46} radius={16} />

        <View style={styles.missionInfo}>
          {/* Name + amount */}
          <View style={styles.missionTopRow}>
            <Text style={styles.missionArtisan}>{item.artisan}</Text>
            <Text style={styles.missionAmount}>{item.amount}</Text>
          </View>

          {/* Type */}
          <Text style={styles.missionType}>{item.type}</Text>

          {/* Date + badge */}
          <View style={styles.missionBottomRow}>
            <Text style={styles.missionDate}>{item.date}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.statusColor + "15" },
              ]}
            >
              <Text
                style={[styles.statusText, { color: item.statusColor }]}
              >
                {item.statusLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes missions</Text>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.tab,
              activeTab === t.id && styles.tabActive,
            ]}
            onPress={() => setActiveTab(t.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === t.id && styles.tabTextActive,
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <Text style={styles.countText}>
        {filtered.length} mission{filtered.length > 1 ? "s" : ""}
      </Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderMission}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* ━━━━━━━━━━ STYLES ━━━━━━━━━━ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
  },

  /* Tabs */
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 6,
    paddingBottom: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radii.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.deepForest,
    borderColor: Colors.deepForest,
    ...Shadows.sm,
  },
  tabText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#4A5568",
  },
  tabTextActive: { color: Colors.white },

  /* Count */
  countText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },

  /* List */
  list: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Mission card */
  missionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  missionCardDispute: {
    borderColor: "rgba(232,48,42,0.12)",
  },
  missionRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  missionInfo: { flex: 1 },
  missionTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  missionArtisan: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: Colors.navy,
  },
  missionAmount: {
    fontFamily: "DMMono_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  missionType: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#4A5568",
    marginBottom: 6,
  },
  missionBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  missionDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.xs,
  },
  statusText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },
});
