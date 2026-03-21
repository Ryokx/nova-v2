import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge } from "../../components/ui";
import { useTheme } from "../../hooks/useTheme";
import type { ClientTabScreenProps } from "../../navigation/types";

/* ── Mock data ── */
const categories = [
  { id: "plumber", label: "Plomberie", emoji: "wrench", count: 47 },
  { id: "electrician", label: "Électricité", emoji: "lightning-bolt", count: 38 },
  { id: "locksmith", label: "Serrurerie", emoji: "key", count: 29 },
  { id: "heating", label: "Chauffage", emoji: "fire", count: 31 },
  { id: "painter", label: "Peinture", emoji: "palette", count: 35 },
  { id: "all", label: "Autres", emoji: "dots-horizontal-circle", count: 120 },
];

const topArtisans = [
  { id: "1", name: "Jean-Michel P.", job: "Plombier", rating: 4.9, reviews: 127, price: 65, initials: "JM", responseTime: "< 2h" },
  { id: "2", name: "Sophie M.", job: "Électricienne", rating: 4.8, reviews: 94, price: 70, initials: "SM", responseTime: "< 1h" },
  { id: "3", name: "Karim B.", job: "Serrurier", rating: 5.0, reviews: 83, price: 60, initials: "KB", responseTime: "< 30min" },
  { id: "4", name: "Marie D.", job: "Peintre", rating: 4.7, reviews: 61, price: 55, initials: "MD", responseTime: "< 3h" },
  { id: "5", name: "Christophe D.", job: "Chauffagiste", rating: 4.9, reviews: 89, price: 75, initials: "CD", responseTime: "< 2h" },
];

/* ── All artisans for search ── */
const allArtisans = [
  { id: "1", name: "Jean-Michel Petit", job: "Plombier", rating: 4.9, price: 65, category: "plumber" },
  { id: "2", name: "Sophie Martin", job: "Électricienne", rating: 4.8, price: 70, category: "electrician" },
  { id: "3", name: "Karim Benali", job: "Serrurier", rating: 5.0, price: 60, category: "locksmith" },
  { id: "4", name: "Marie Dupont", job: "Peintre", rating: 4.7, price: 55, category: "painter" },
  { id: "5", name: "Christophe Durand", job: "Chauffagiste", rating: 4.9, price: 75, category: "heating" },
  { id: "6", name: "Fatima Hadj", job: "Plombier", rating: 4.8, price: 70, category: "plumber" },
  { id: "7", name: "Thomas Richard", job: "Plombier", rating: 4.7, price: 60, category: "plumber" },
  { id: "8", name: "Laurent Garcia", job: "Plombier", rating: 4.5, price: 55, category: "plumber" },
  { id: "9", name: "David Leroy", job: "Électricien", rating: 4.6, price: 65, category: "electrician" },
  { id: "10", name: "Amina Kaddouri", job: "Électricienne", rating: 4.9, price: 75, category: "electrician" },
  { id: "11", name: "Éric Fabre", job: "Serrurier", rating: 4.7, price: 65, category: "locksmith" },
  { id: "12", name: "Philippe Clément", job: "Maçon", rating: 4.6, price: 55, category: "mason" },
  { id: "13", name: "Mehdi Amrani", job: "Maçon", rating: 4.8, price: 60, category: "mason" },
];

/* ── Live interventions ── */
interface LiveIntervention {
  id: string;
  artisan: string;
  type: string;
  status: "en_route" | "on_site" | "finishing";
  eta?: string;
  startedAt?: string;
  missionId: string;
}

const liveInterventions: LiveIntervention[] = [
  {
    id: "live-1",
    artisan: "Jean-Michel P.",
    type: "Réparation fuite",
    status: "en_route",
    eta: "~15 min",
    missionId: "mission-active",
  },
];

const statusConfig = {
  en_route: { label: "En route", color: Colors.gold, icon: "truck-delivery" as const, bg: "rgba(245,166,35,0.08)" },
  on_site: { label: "Sur place", color: Colors.forest, icon: "wrench" as const, bg: "rgba(27,107,78,0.08)" },
  finishing: { label: "Finalisation", color: Colors.success, icon: "check-circle-outline" as const, bg: "rgba(34,200,138,0.08)" },
};

export function ClientHomeScreen({
  navigation,
}: ClientTabScreenProps<"ClientHome">) {
  const { c } = useTheme();

  // Pulse animation for live dot
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (liveInterventions.length === 0) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 300);
  }, []);

  const normalize = useCallback((s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), []);

  const searchResults = useMemo(() => {
    if (debouncedSearch.length < 2) return [];
    const q = normalize(debouncedSearch);
    return allArtisans.filter(
      (a) =>
        normalize(a.name).includes(q) ||
        normalize(a.job).includes(q)
    );
  }, [debouncedSearch, normalize]);

  const showResults = search.length >= 2;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: c.text }]}>Bonjour Sophie</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.urgencyBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Emergency")}
            >
              <MaterialCommunityIcons name="lightning-bolt" size={14} color={Colors.white} />
              <Text style={styles.urgencyBtnText}>Urgence</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bellBtn, { backgroundColor: c.card }]}
              onPress={() => navigation.navigate("ClientNotifications")}
            >
              <MaterialCommunityIcons name="bell" size={20} color={c.text} />
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Live interventions ── */}
        {liveInterventions.length > 0 && (
          <View style={styles.liveSection}>
            {liveInterventions.map((live) => {
              const sc = statusConfig[live.status];
              return (
                <TouchableOpacity
                  key={live.id}
                  style={[styles.liveCard, { backgroundColor: sc.bg, borderColor: sc.color + "30" }]}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("Tracking", { missionId: live.missionId })}
                >
                  <View style={styles.liveLeft}>
                    <View style={styles.liveDotWrap}>
                      <Animated.View style={[styles.liveDot, { backgroundColor: sc.color, opacity: pulseAnim }]} />
                    </View>
                    <View style={styles.liveInfo}>
                      <View style={styles.liveTopRow}>
                        <Text style={styles.liveLabel}>EN DIRECT</Text>
                        <View style={[styles.liveStatusBadge, { backgroundColor: sc.color + "20" }]}>
                          <MaterialCommunityIcons name={sc.icon} size={12} color={sc.color} />
                          <Text style={[styles.liveStatusText, { color: sc.color }]}>{sc.label}</Text>
                        </View>
                      </View>
                      <Text style={[styles.liveArtisan, { color: c.text }]}>{live.artisan}</Text>
                      <Text style={styles.liveType}>
                        {live.type}
                        {live.eta && <Text style={[styles.liveEta, { color: sc.color }]}> • {live.eta}</Text>}
                      </Text>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={sc.color} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Search bar ── */}
        <View style={[styles.searchBar, { backgroundColor: c.card }]}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.textHint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Artisan ou domaine (ex : chauffagiste)"
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(""); setDebouncedSearch(""); }}>
              <MaterialCommunityIcons name="close-circle" size={18} color={Colors.textHint} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Search results ── */}
        {showResults && (
          <View style={[styles.searchResults, { backgroundColor: c.card, borderColor: c.border }]}>
            {searchResults.length === 0 && debouncedSearch.length >= 2 ? (
              <View style={styles.searchEmpty}>
                <Text style={styles.searchEmptyText}>
                  Aucun artisan trouvé pour « {debouncedSearch} »
                </Text>
              </View>
            ) : debouncedSearch.length < 2 ? (
              <View style={styles.searchEmpty}>
                <Text style={styles.searchEmptyText}>Recherche en cours...</Text>
              </View>
            ) : (
              searchResults.map((a) => (
                <TouchableOpacity
                  key={a.id}
                  style={styles.searchResultItem}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSearch("");
                    setDebouncedSearch("");
                    navigation.navigate("ArtisanProfile", { id: a.id });
                  }}
                >
                  <Avatar name={a.name} size={36} radius={12} />
                  <View style={styles.searchResultInfo}>
                    <Text style={[styles.searchResultName, { color: c.text }]}>{a.name}</Text>
                    <Text style={styles.searchResultJob}>{a.job}</Text>
                  </View>
                  <View style={styles.searchResultRating}>
                    <MaterialCommunityIcons name="star" size={12} color={Colors.gold} />
                    <Text style={styles.searchResultRatingText}>{a.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* ── Categories 2x3 grid ── */}
        <View style={styles.catGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catCard, { backgroundColor: c.card }]}
              activeOpacity={0.8}
              onPress={() =>
                cat.id === "all"
                  ? navigation.navigate("AllCategories")
                  : navigation.navigate("ArtisanListByCategory", { category: cat.id })
              }
            >
              <View style={[styles.catIconWrap, { backgroundColor: c.surface }]}>
                <MaterialCommunityIcons name={cat.emoji as any} size={18} color={Colors.forest} />
              </View>
              <Text style={[styles.catLabel, { color: c.text }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Insurance simulator ── */}
        <TouchableOpacity
          style={[styles.insuranceCard, { backgroundColor: c.card }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("InsuranceSimulator")}
        >
          <View style={styles.insuranceIconWrap}>
            <MaterialCommunityIcons name="shield-search" size={22} color={Colors.forest} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.insuranceTitle, { color: c.text }]}>Mon assurance couvre-t-elle ?</Text>
            <Text style={styles.insuranceDesc}>Vérifiez si votre sinistre est pris en charge</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* ── Top rated section ── */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Artisans les mieux notés</Text>

        <FlatList
          data={topArtisans}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.artisanList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.artisanCard, { backgroundColor: c.card }]}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("ArtisanProfile", { id: item.id })
              }
            >
              {/* Avatar row */}
              <View style={styles.artisanRow}>
                <Avatar name={item.name} size={44} radius={14} />
                <View style={styles.artisanInfo}>
                  <Text style={[styles.artisanName, { color: c.text }]}>{item.name}</Text>
                  <Text style={styles.artisanJob}>{item.job}</Text>
                </View>
              </View>

              {/* Rating */}
              <View style={styles.ratingRow}>
                <Text style={styles.starIcon}><MaterialCommunityIcons name="star" size={13} color={Colors.gold} /></Text>
                <Text style={styles.ratingValue}>{item.rating}</Text>
                <Text style={styles.ratingCount}>
                  {"•"} {item.reviews} avis
                </Text>
              </View>

              {/* Badge */}
              <View style={{ marginBottom: 10 }}>
                <Badge label="Certifié Nova" variant="certified" size="sm" />
              </View>

              {/* Response time */}
              <Text style={styles.responseTime}>
                Répond en {item.responseTime}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ━━━━━━━━━━ STYLES ━━━━━━━━━━ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  urgencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.red,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    ...Shadows.sm,
  },
  urgencyBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...Shadows.sm,
  },
  bellBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  bellBadgeText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 8,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 12,
    includeFontPadding: false,
  },

  /* Insurance card */
  insuranceCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    marginHorizontal: 16, marginBottom: 20, padding: 16,
    borderRadius: 18, borderWidth: 1, borderColor: "rgba(27,107,78,0.12)", ...Shadows.sm,
  },
  insuranceIconWrap: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: Colors.surface, alignItems: "center", justifyContent: "center",
  },
  insuranceTitle: { fontFamily: "Manrope_700Bold", fontSize: 14 },
  insuranceDesc: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },

  /* Search */
  /* Live interventions */
  liveSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  liveCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  liveLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  liveDotWrap: {
    width: 10,
    height: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  liveInfo: { flex: 1 },
  liveTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  liveLabel: {
    fontFamily: "DMMono_500Medium",
    fontSize: 9,
    color: Colors.red,
    letterSpacing: 1,
  },
  liveStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveStatusText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
  },
  liveArtisan: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    marginBottom: 2,
  },
  liveType: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  liveEta: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    height: 44,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: Colors.navy,
    height: 44,
    paddingVertical: 0,
  },
  searchResults: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadows.md,
  },
  searchEmpty: {
    paddingVertical: 20,
    alignItems: "center",
  },
  searchEmptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  searchResultInfo: { flex: 1 },
  searchResultName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  searchResultJob: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  searchResultRight: { alignItems: "flex-end" },
  searchResultRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  searchResultRatingText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.navy,
  },
  searchResultPrice: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
    color: Colors.forest,
    marginTop: 2,
  },

  /* Categories grid */
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  catCard: {
    width: "48.5%" as any,
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  catEmoji: { fontSize: 22, marginBottom: 6 },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  catLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },

  /* Emergency */
  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.12)",
    gap: 14,
    ...Shadows.sm,
  },
  emergencyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFF0EF",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyEmoji: { fontSize: 24 },
  emergencyTextWrap: { flex: 1 },
  emergencyTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.navy,
    marginBottom: 2,
  },
  emergencyDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emergencyArrow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radii.md,
    backgroundColor: Colors.red,
  },
  emergencyArrowText: {
    color: Colors.white,
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
  },

  /* Section title */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: Colors.navy,
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  /* Artisan list */
  artisanList: { paddingHorizontal: 16, gap: 12 },
  artisanCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 16,
    width: 185,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  artisanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  artisanInfo: { flex: 1 },
  artisanName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  artisanJob: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.textHint,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  starIcon: { fontSize: 13 },
  ratingValue: {
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
    color: Colors.navy,
  },
  ratingCount: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textHint,
  },
  artisanBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  responseTime: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: Colors.textHint,
  },
  price: {
    fontFamily: "DMMono_500Medium",
    fontSize: 14,
    color: Colors.forest,
  },
  priceUnit: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    color: Colors.textHint,
  },
});
