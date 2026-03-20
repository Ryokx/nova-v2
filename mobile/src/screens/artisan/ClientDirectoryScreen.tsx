import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const clients = [
  { id: 1, name: "Pierre Martin", initials: "PM", phone: "06 12 34 56 78", missions: 4, lastDate: "15 mars 2026", total: "1 280€" },
  { id: 2, name: "Sophie Lefèvre", initials: "SL", phone: "06 98 76 54 32", missions: 2, lastDate: "10 mars 2026", total: "475€" },
  { id: 3, name: "Caroline Durand", initials: "CD", phone: "06 45 67 89 01", missions: 1, lastDate: "2 mars 2026", total: "280€" },
  { id: 4, name: "Antoine Moreau", initials: "AM", phone: "06 23 45 67 89", missions: 3, lastDate: "22 fév 2026", total: "950€" },
];

const stats = [
  { v: "4", l: "Clients" },
  { v: "10", l: "Missions" },
  { v: "2 985€", l: "CA" },
];

export function ClientDirectoryScreen({
  navigation,
}: RootStackScreenProps<"ClientDirectory">) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      search
        ? clients.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
          )
        : clients,
    [search]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes clients</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}><MaterialCommunityIcons name="magnify" size={18} color={Colors.textHint} /></Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un client..."
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* Stats strip */}
        <View style={styles.statsRow}>
          {stats.map((k, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{k.v}</Text>
              <Text style={styles.statLabel}>{k.l}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.countText}>
          {filtered.length} client{filtered.length > 1 ? "s" : ""}
        </Text>

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}><MaterialCommunityIcons name="account-group" size={32} color={Colors.textHint} /></Text>
            <Text style={styles.emptyTitle}>Aucun résultat</Text>
            <Text style={styles.emptyDesc}>
              Aucun client ne correspond à votre recherche.
            </Text>
          </View>
        )}

        {filtered.map((c) => (
          <View key={c.id} style={styles.clientCard}>
            <Avatar name={c.name} size={48} radius={16} />
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{c.name}</Text>
              <Text style={styles.clientSub}>
                {c.missions} mission{c.missions > 1 ? "s" : ""} • Dernier : {c.lastDate}
              </Text>
              <Text style={styles.clientPhone}>{c.phone}</Text>
            </View>
            <View style={styles.clientRight}>
              <Text style={styles.clientTotal}>{c.total}</Text>
              <View style={styles.clientActions}>
                <TouchableOpacity
                  style={styles.smallBtn}
                  onPress={() => Linking.openURL(`tel:${c.phone}`)}
                >
                  <Text style={styles.smallBtnIcon}><MaterialCommunityIcons name="phone" size={16} color={Colors.forest} /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallBtn}>
                  <Text style={styles.smallBtnIcon}><MaterialCommunityIcons name="chat" size={16} color={Colors.forest} /></Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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

  /* Search */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.navy,
  },

  /* Stats */
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  statValue: {
    fontFamily: "DMMono_500Medium",
    fontSize: 16,
    color: Colors.forest,
  },
  statLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    color: Colors.textSecondary,
  },

  countText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },

  /* Client card */
  clientCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  clientInfo: { flex: 1 },
  clientName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.navy,
    marginBottom: 2,
  },
  clientSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  clientPhone: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  clientRight: { alignItems: "flex-end" },
  clientTotal: {
    fontFamily: "DMMono_500Medium",
    fontSize: 14,
    color: Colors.forest,
  },
  clientActions: { flexDirection: "row", gap: 4, marginTop: 6 },
  smallBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  smallBtnIcon: { fontSize: 14 },

  /* Empty */
  emptyState: { alignItems: "center", paddingVertical: 48 },
  emptyIcon: { fontSize: 32, marginBottom: 12 },
  emptyTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: Colors.navy,
    marginBottom: 6,
  },
  emptyDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    maxWidth: 240,
  },
});
