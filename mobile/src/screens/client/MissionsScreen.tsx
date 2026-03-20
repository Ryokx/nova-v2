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
import { useTheme } from "../../hooks/useTheme";
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
  { id: "completed", label: "Terminées" },
  { id: "validated", label: "Validées" },
  { id: "dispute", label: "Litiges" },
];

/* ── Mock data ── */
const missions: Mission[] = [
  {
    id: "mission-active",
    artisan: "Jean-Michel P.",
    initials: "JM",
    type: "Plomberie — Réparation fuite",
    date: "15 mars 2026",
    amount: "320,00€",
    status: "active",
    statusLabel: "En cours",
    statusColor: Colors.gold,
  },
  {
    id: "mission-completed",
    artisan: "Sophie M.",
    initials: "SM",
    type: "Électricité — Installation prise",
    date: "10 mars 2026",
    amount: "195,00€",
    status: "completed",
    statusLabel: "Terminée",
    statusColor: Colors.success,
  },
  {
    id: "mission-validated",
    artisan: "Karim B.",
    initials: "KB",
    type: "Serrurerie — Remplacement serrure",
    date: "2 mars 2026",
    amount: "280,00€",
    status: "validated",
    statusLabel: "Validée",
    statusColor: Colors.forest,
  },
  {
    id: "mission-dispute",
    artisan: "Thomas R.",
    initials: "TR",
    type: "Plomberie — Fuite chauffe-eau",
    date: "18 fév 2026",
    amount: "450,00€",
    status: "dispute",
    statusLabel: "Litige",
    statusColor: Colors.red,
  },
];

export function ClientMissionsScreen({
  navigation,
}: ClientTabScreenProps<"ClientMissions">) {
  const { c } = useTheme();
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
        { backgroundColor: c.card },
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
            <Text style={[styles.missionArtisan, { color: c.text }]}>{item.artisan}</Text>
            <Text style={[styles.missionAmount, { color: c.text }]}>{item.amount}</Text>
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
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={["top"]}>
      {/* Header + filters */}
      <View style={styles.headerSection}>
        <Text style={[styles.headerTitle, { color: c.text }]}>Interventions</Text>
        <View style={styles.tabsRow}>
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.tab,
                  { backgroundColor: active ? Colors.deepForest : c.card, borderColor: active ? Colors.deepForest : c.border },
                ]}
                onPress={() => setActiveTab(t.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

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

  /* Header + filters */
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontFamily: "DMSans_500Medium",
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
    fontFamily: "DMMono_500Medium",
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
