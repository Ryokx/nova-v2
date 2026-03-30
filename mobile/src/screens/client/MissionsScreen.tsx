import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar } from "../../components/ui";
import { getAvatarUri } from "../../constants/avatars";
import { useTheme } from "../../hooks/useTheme";
import type { ClientTabScreenProps } from "../../navigation/types";

/* ── Types ── */
type MissionStatus = "all" | "scheduled" | "active" | "completed" | "validated" | "dispute";

interface Mission {
  id: string;
  artisan: string;
  initials: string;
  type: string;
  category: string;
  date: string;
  amount: string;
  status: MissionStatus;
  statusLabel: string;
  statusColor: string;
  statusIcon: string;
}

/* ── Filter config ── */
const FILTERS: { id: MissionStatus; label: string; icon: string; color: string }[] = [
  { id: "all", label: "Toutes", icon: "view-grid-outline", color: Colors.navy },
  { id: "scheduled", label: "Programmees", icon: "calendar-clock", color: "#6366F1" },
  { id: "active", label: "En cours", icon: "progress-wrench", color: Colors.gold },
  { id: "completed", label: "Terminees", icon: "check-circle-outline", color: Colors.success },
  { id: "validated", label: "Validees", icon: "shield-check", color: Colors.forest },
  { id: "dispute", label: "Litiges", icon: "alert-circle-outline", color: Colors.red },
];

/* ── Mock data ── */
const missions: Mission[] = [
  {
    id: "mission-scheduled",
    artisan: "Christophe D.",
    initials: "CD",
    type: "Entretien chaudiere",
    category: "Chauffage",
    date: "28 mars 2026 a 10h",
    amount: "180,00\u20AC",
    status: "scheduled",
    statusLabel: "Programmee",
    statusColor: "#6366F1",
    statusIcon: "calendar-clock",
  },
  {
    id: "mission-scheduled-2",
    artisan: "Sophie M.",
    initials: "SM",
    type: "Mise aux normes tableau",
    category: "Electricite",
    date: "2 avril 2026 a 14h",
    amount: "420,00\u20AC",
    status: "scheduled",
    statusLabel: "Programmee",
    statusColor: "#6366F1",
    statusIcon: "calendar-clock",
  },
  {
    id: "mission-active",
    artisan: "Jean-Michel P.",
    initials: "JM",
    type: "Reparation fuite",
    category: "Plomberie",
    date: "15 mars 2026",
    amount: "320,00\u20AC",
    status: "active",
    statusLabel: "En cours",
    statusColor: Colors.gold,
    statusIcon: "progress-wrench",
  },
  {
    id: "mission-completed",
    artisan: "Sophie M.",
    initials: "SM",
    type: "Installation prise",
    category: "Electricite",
    date: "10 mars 2026",
    amount: "195,00\u20AC",
    status: "completed",
    statusLabel: "Terminee",
    statusColor: Colors.success,
    statusIcon: "check-circle-outline",
  },
  {
    id: "mission-validated",
    artisan: "Karim B.",
    initials: "KB",
    type: "Remplacement serrure",
    category: "Serrurerie",
    date: "2 mars 2026",
    amount: "280,00\u20AC",
    status: "validated",
    statusLabel: "Validee",
    statusColor: Colors.forest,
    statusIcon: "shield-check",
  },
  {
    id: "mission-dispute",
    artisan: "Thomas R.",
    initials: "TR",
    type: "Fuite chauffe-eau",
    category: "Plomberie",
    date: "18 fev 2026",
    amount: "450,00\u20AC",
    status: "dispute",
    statusLabel: "Litige",
    statusColor: Colors.red,
    statusIcon: "alert-circle-outline",
  },
];

/* ── Count by status ── */
function countByStatus(status: MissionStatus) {
  if (status === "all") return missions.length;
  return missions.filter(m => m.status === status).length;
}

export function ClientMissionsScreen({
  navigation,
}: ClientTabScreenProps<"ClientMissions">) {
  const { c } = useTheme();
  const [activeTab, setActiveTab] = useState<MissionStatus>("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const normalize = useCallback((s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), []);

  const filtered = useMemo(() => {
    let list = activeTab === "all" ? missions : missions.filter(m => m.status === activeTab);
    if (search.length >= 2) {
      const q = normalize(search);
      list = list.filter(m =>
        normalize(m.artisan).includes(q) ||
        normalize(m.type).includes(q) ||
        normalize(m.category).includes(q)
      );
    }
    return list;
  }, [activeTab, search, normalize]);

  const activeFilter = FILTERS.find(f => f.id === activeTab)!;

  const renderKPIs = () => (
    <View style={styles.kpiRow}>
      {[
        { label: "En cours", count: countByStatus("active"), color: Colors.gold, icon: "progress-wrench" },
        { label: "Programmees", count: countByStatus("scheduled"), color: "#6366F1", icon: "calendar-clock" },
        { label: "Terminees", count: countByStatus("completed") + countByStatus("validated"), color: Colors.success, icon: "check-circle" },
        { label: "Litiges", count: countByStatus("dispute"), color: Colors.red, icon: "alert-circle" },
      ].map(kpi => (
        <TouchableOpacity
          key={kpi.label}
          style={[styles.kpiCard, { backgroundColor: c.card }]}
          activeOpacity={0.8}
          onPress={() => {
            if (kpi.label === "En cours") setActiveTab("active");
            else if (kpi.label === "Programmees") setActiveTab("scheduled");
            else if (kpi.label === "Terminees") setActiveTab("completed");
            else setActiveTab("dispute");
          }}
        >
          <View style={[styles.kpiIconWrap, { backgroundColor: kpi.color + "12" }]}>
            <MaterialCommunityIcons name={kpi.icon as any} size={16} color={kpi.color} />
          </View>
          <Text style={[styles.kpiCount, { color: c.text }]}>{kpi.count}</Text>
          <Text style={styles.kpiLabel}>{kpi.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
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
        <Avatar name={item.artisan} size={46} radius={16} uri={getAvatarUri(item.artisan)} />
        <View style={styles.missionInfo}>
          <View style={styles.missionTopRow}>
            <Text style={[styles.missionArtisan, { color: c.text }]}>{item.artisan}</Text>
            <Text style={[styles.missionAmount, { color: c.text }]}>{item.amount}</Text>
          </View>
          <View style={styles.missionCatRow}>
            <View style={[styles.catBadge, { backgroundColor: c.surface }]}>
              <Text style={styles.catBadgeText}>{item.category}</Text>
            </View>
            <Text style={styles.missionType}>{item.type}</Text>
          </View>
          <View style={styles.missionBottomRow}>
            <View style={styles.missionDateRow}>
              <MaterialCommunityIcons name="calendar" size={11} color={Colors.textMuted} />
              <Text style={styles.missionDate}>{item.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.statusColor + "12" }]}>
              <MaterialCommunityIcons name={item.statusIcon as any} size={11} color={item.statusColor} />
              <Text style={[styles.statusText, { color: item.statusColor }]}>{item.statusLabel}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* KPI cards */}
      {renderKPIs()}

      {/* Search + filter bar */}
      <View style={styles.searchFilterRow}>
        <View style={[styles.searchBar, { backgroundColor: c.card }]}>
          <MaterialCommunityIcons name="magnify" size={16} color={Colors.textHint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une intervention..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textHint} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            { backgroundColor: activeTab !== "all" ? activeFilter.color + "15" : c.card },
            activeTab !== "all" && { borderColor: activeFilter.color + "30" },
          ]}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={showFilters ? "close" : "tune-vertical" as any}
            size={18}
            color={activeTab !== "all" ? activeFilter.color : Colors.navy}
          />
        </TouchableOpacity>
      </View>

      {/* Filter dropdown */}
      {showFilters && (
        <View style={[styles.filterDropdown, { backgroundColor: c.card }]}>
          {FILTERS.map(f => {
            const active = activeTab === f.id;
            const count = countByStatus(f.id);
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterItem, active && { backgroundColor: f.color + "10" }]}
                onPress={() => { setActiveTab(f.id); setShowFilters(false); }}
                activeOpacity={0.8}
              >
                <View style={[styles.filterIconWrap, { backgroundColor: active ? f.color + "20" : c.surface }]}>
                  <MaterialCommunityIcons name={f.icon as any} size={16} color={f.color} />
                </View>
                <Text style={[styles.filterLabel, active && { color: f.color, fontFamily: "DMSans_700Bold" }]}>
                  {f.label}
                </Text>
                <View style={[styles.filterCount, { backgroundColor: active ? f.color + "15" : c.surface }]}>
                  <Text style={[styles.filterCountText, active && { color: f.color }]}>{count}</Text>
                </View>
                {active && (
                  <MaterialCommunityIcons name="check" size={16} color={f.color} style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Active filter indicator + count */}
      <View style={styles.resultRow}>
        {activeTab !== "all" && (
          <TouchableOpacity
            style={[styles.activeFilterChip, { backgroundColor: activeFilter.color + "12", borderColor: activeFilter.color + "25" }]}
            onPress={() => setActiveTab("all")}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name={activeFilter.icon as any} size={12} color={activeFilter.color} />
            <Text style={[styles.activeFilterText, { color: activeFilter.color }]}>{activeFilter.label}</Text>
            <MaterialCommunityIcons name="close" size={12} color={activeFilter.color} />
          </TouchableOpacity>
        )}
        <Text style={styles.countText}>
          {filtered.length} intervention{filtered.length > 1 ? "s" : ""}
        </Text>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: c.surface }]}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={28} color={Colors.textMuted} />
      </View>
      <Text style={[styles.emptyTitle, { color: c.text }]}>Aucune intervention</Text>
      <Text style={styles.emptyDesc}>
        {search.length >= 2
          ? `Aucun resultat pour "${search}"`
          : activeTab !== "all"
            ? `Aucune intervention ${activeFilter.label.toLowerCase()}`
            : "Vous n'avez pas encore d'intervention"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: c.text }]}>Interventions</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderMission}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* ━━━━━━━━━━ STYLES ━━━━━━━━━━ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
  },

  /* KPI cards */
  kpiRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  kpiCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  kpiCount: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 18,
    color: Colors.navy,
  },
  kpiLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
    textAlign: "center",
  },

  /* Search + filter */
  searchFilterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.06)",
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.navy,
    padding: 0,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.06)",
    ...Shadows.sm,
  },

  /* Filter dropdown */
  filterDropdown: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.06)",
    overflow: "hidden",
    ...Shadows.md,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(10,22,40,0.03)",
  },
  filterIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  filterLabel: {
    flex: 1,
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.navy,
  },
  filterCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  filterCountText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
    color: Colors.textSecondary,
  },

  /* Result row */
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  activeFilterText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },
  countText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
    flex: 1,
    textAlign: "right",
  },

  /* List */
  list: { paddingBottom: 100 },

  /* Mission card */
  missionCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
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
    marginBottom: 4,
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
  missionCatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  catBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    color: Colors.forest,
  },
  missionType: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  missionBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  missionDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  missionDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10.5,
  },

  /* Empty state */
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: Colors.navy,
    marginBottom: 6,
  },
  emptyDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
