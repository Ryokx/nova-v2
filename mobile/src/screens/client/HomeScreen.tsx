import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge } from "../../components/ui";
import type { ClientTabScreenProps } from "../../navigation/types";

/* ── Mock data ── */
const categories = [
  { id: "plumber", label: "Plomberie", emoji: "\uD83D\uDD27", count: 47 },
  { id: "electrician", label: "\u00c9lectricit\u00e9", emoji: "\u26A1", count: 38 },
  { id: "locksmith", label: "Serrurerie", emoji: "\uD83D\uDD11", count: 29 },
  { id: "heating", label: "Chauffage", emoji: "\uD83D\uDD25", count: 31 },
  { id: "painter", label: "Peinture", emoji: "\uD83C\uDFA8", count: 35 },
  { id: "mason", label: "Ma\u00e7onnerie", emoji: "\uD83E\uDDF1", count: 22 },
];

const topArtisans = [
  { id: "1", name: "Jean-Michel P.", job: "Plombier", rating: 4.9, reviews: 127, price: 65, initials: "JM", responseTime: "< 2h" },
  { id: "2", name: "Sophie M.", job: "\u00c9lectricienne", rating: 4.8, reviews: 94, price: 70, initials: "SM", responseTime: "< 1h" },
  { id: "3", name: "Karim B.", job: "Serrurier", rating: 5.0, reviews: 83, price: 60, initials: "KB", responseTime: "< 30min" },
  { id: "4", name: "Marie D.", job: "Peintre", rating: 4.7, reviews: 61, price: 55, initials: "MD", responseTime: "< 3h" },
  { id: "5", name: "Christophe D.", job: "Chauffagiste", rating: 4.9, reviews: 89, price: 75, initials: "CD", responseTime: "< 2h" },
];

export function ClientHomeScreen({
  navigation,
}: ClientTabScreenProps<"ClientHome">) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour Sophie \uD83D\uDC4B</Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate("ClientNotifications")}
          >
            <Text style={styles.bellIcon}>{"\uD83D\uDD14"}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Search bar ── */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
          <Text style={styles.searchIcon}>{"\uD83D\uDD0D"}</Text>
          <Text style={styles.searchPlaceholder}>
            Rechercher un artisan...
          </Text>
        </TouchableOpacity>

        {/* ── Categories 2x3 grid ── */}
        <View style={styles.catGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("ArtisanListByCategory", {
                  category: cat.id,
                })
              }
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Emergency banner ── */}
        <TouchableOpacity
          style={styles.emergencyCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Emergency")}
        >
          <View style={styles.emergencyIconWrap}>
            <Text style={styles.emergencyEmoji}>{"\u26A1"}</Text>
          </View>
          <View style={styles.emergencyTextWrap}>
            <Text style={styles.emergencyTitle}>Urgence 24h/24</Text>
            <Text style={styles.emergencyDesc}>
              Artisan en moins de 2h
            </Text>
          </View>
          <View style={styles.emergencyArrow}>
            <Text style={styles.emergencyArrowText}>{"\u203A"}</Text>
          </View>
        </TouchableOpacity>

        {/* ── Top rated section ── */}
        <Text style={styles.sectionTitle}>Artisans les mieux not\u00e9s</Text>

        <FlatList
          data={topArtisans}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.artisanList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.artisanCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("ArtisanProfile", { id: item.id })
              }
            >
              {/* Avatar row */}
              <View style={styles.artisanRow}>
                <Avatar name={item.name} size={44} radius={14} />
                <View style={styles.artisanInfo}>
                  <Text style={styles.artisanName}>{item.name}</Text>
                  <Text style={styles.artisanJob}>{item.job}</Text>
                </View>
              </View>

              {/* Rating */}
              <View style={styles.ratingRow}>
                <Text style={styles.starIcon}>{"\u2B50"}</Text>
                <Text style={styles.ratingValue}>{item.rating}</Text>
                <Text style={styles.ratingCount}>
                  {"\u2022"} {item.reviews} avis
                </Text>
              </View>

              {/* Badge */}
              <View style={{ marginBottom: 10 }}>
                <Badge label="Certifi\u00e9 Nova" variant="certified" size="sm" />
              </View>

              {/* Price + response */}
              <View style={styles.artisanBottom}>
                <Text style={styles.responseTime}>
                  R\u00e9pond en {item.responseTime}
                </Text>
                <Text style={styles.price}>
                  {item.price}\u20AC
                  <Text style={styles.priceUnit}>/h</Text>
                </Text>
              </View>
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
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.lg,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  bellIcon: { fontSize: 18 },

  /* Search */
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
  searchIcon: { fontSize: 16 },
  searchPlaceholder: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: Colors.textMuted,
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
