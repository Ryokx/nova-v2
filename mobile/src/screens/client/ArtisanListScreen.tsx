import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

/* ---- mock data ---- */
const artisansByCategory: Record<
  string,
  {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    price: number;
    initials: string;
    responseTime: string;
    missions: number;
    available: boolean;
  }[]
> = {
  plumber: [
    { id: "1", name: "Jean-Michel P.", rating: 4.9, reviews: 127, price: 65, initials: "JM", responseTime: "< 2h", missions: 127, available: true },
    { id: "5", name: "Thomas R.", rating: 4.7, reviews: 68, price: 60, initials: "TR", responseTime: "< 3h", missions: 68, available: true },
    { id: "6", name: "Fatima H.", rating: 4.8, reviews: 91, price: 70, initials: "FH", responseTime: "< 1h", missions: 91, available: true },
    { id: "7", name: "Laurent G.", rating: 4.5, reviews: 42, price: 55, initials: "LG", responseTime: "< 4h", missions: 42, available: false },
    { id: "8", name: "Nicolas B.", rating: 4.6, reviews: 53, price: 62, initials: "NB", responseTime: "< 2h", missions: 53, available: true },
  ],
  electrician: [
    { id: "2", name: "Sophie M.", rating: 4.8, reviews: 94, price: 70, initials: "SM", responseTime: "< 1h", missions: 94, available: true },
    { id: "9", name: "David L.", rating: 4.6, reviews: 72, price: 65, initials: "DL", responseTime: "< 2h", missions: 72, available: true },
    { id: "10", name: "Amina K.", rating: 4.9, reviews: 58, price: 75, initials: "AK", responseTime: "< 3h", missions: 58, available: true },
  ],
  locksmith: [
    { id: "3", name: "Karim B.", rating: 5.0, reviews: 83, price: 60, initials: "KB", responseTime: "< 30min", missions: 83, available: true },
    { id: "11", name: "Éric F.", rating: 4.7, reviews: 45, price: 65, initials: "EF", responseTime: "< 1h", missions: 45, available: true },
  ],
  mason: [
    { id: "12", name: "Philippe C.", rating: 4.6, reviews: 34, price: 55, initials: "PC", responseTime: "< 4h", missions: 34, available: true },
    { id: "13", name: "Mehdi A.", rating: 4.8, reviews: 67, price: 60, initials: "MA", responseTime: "< 2h", missions: 67, available: true },
  ],
  heating: [
    { id: "14", name: "Christophe D.", rating: 4.9, reviews: 89, price: 75, initials: "CD", responseTime: "< 2h", missions: 89, available: true },
    { id: "15", name: "Julie V.", rating: 4.7, reviews: 51, price: 68, initials: "JV", responseTime: "< 3h", missions: 51, available: true },
  ],
  painter: [
    { id: "4", name: "Marie D.", rating: 4.7, reviews: 61, price: 55, initials: "MD", responseTime: "< 3h", missions: 61, available: true },
    { id: "16", name: "Youssef M.", rating: 4.5, reviews: 38, price: 50, initials: "YM", responseTime: "< 4h", missions: 38, available: true },
  ],
};

const categoryLabels: Record<string, string> = {
  plumber: "Plombier",
  electrician: "Électricien",
  locksmith: "Serrurier",
  mason: "Maçon",
  heating: "Chauffagiste",
  painter: "Peintre",
};

const sortOptions = [
  { id: "rating", label: "Note" },
  { id: "price", label: "Prix" },
] as const;

type SortId = (typeof sortOptions)[number]["id"];

/* ---- helpers ---- */
const Stars = ({ rating, size = 13 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: "row", gap: 1 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Text
        key={i}
        style={{ fontSize: size, color: i <= rating ? Colors.gold : Colors.border }}
      >
        {"★"}
      </Text>
    ))}
  </View>
);

export function ArtisanListScreen({
  navigation,
  route,
}: RootStackScreenProps<"ArtisanListByCategory">) {
  const category = route.params.category;
  const catLabel = categoryLabels[category] || "Artisans";
  const artisans = artisansByCategory[category] || artisansByCategory.plumber;
  const [sort, setSort] = useState<SortId>("rating");

  const sorted = useMemo(() => {
    const copy = [...artisans];
    if (sort === "rating") copy.sort((a, b) => b.rating - a.rating);
    else if (sort === "price") copy.sort((a, b) => a.price - b.price);
    return copy;
  }, [artisans, sort]);

  const renderArtisan = ({ item: a }: { item: (typeof artisans)[0] }) => (
    <TouchableOpacity
      style={styles.artisanCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("ArtisanProfile", { id: a.id })}
    >
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <Avatar name={a.name} size={52} radius={18} />
        {a.available && <View style={styles.onlineDot} />}
      </View>

      {/* Info */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.nameRow}>
          <Text style={styles.artisanName}>{a.name}</Text>
          <Text style={styles.priceText}>
            {a.price}€
            <Text style={styles.priceUnit}>/h</Text>
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <Stars rating={Math.round(a.rating)} size={13} />
          <Text style={styles.ratingValue}>{a.rating}</Text>
          <Text style={styles.metaSep}>{a.reviews} avis</Text>
          <Text style={styles.dot}>{"•"}</Text>
          <Text style={styles.metaSep}>{a.missions} missions</Text>
        </View>

        <View style={styles.badgeRow}>
          <Badge
            label="Certifie Nova"
            variant="certified"
            size="sm"
          />
          <Text style={styles.responseText}>Répond en {a.responseTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{catLabel}</Text>
      </View>

      {/* Sort row */}
      <View style={styles.sortRow}>
        <Text style={styles.countText}>
          {artisans.length} artisans disponibles
        </Text>
        <View style={styles.pillRow}>
          {sortOptions.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.pill,
                sort === s.id ? styles.pillActive : styles.pillInactive,
              ]}
              onPress={() => setSort(s.id)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.pillText,
                  sort === s.id ? styles.pillTextActive : styles.pillTextInactive,
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderArtisan}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.trustFooter}>
            <Text style={styles.trustIcon}><MaterialCommunityIcons name="shield-check" size={20} color={Colors.forest} /></Text>
            <Text style={styles.trustText}>
              Tous les artisans Nova sont vérifiés, assurés et soumis au
              paiement sécurisé par séquestre.
            </Text>
          </View>
        }
      />
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

  /* Sort */
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
    paddingTop: 4,
  },
  countText: { fontSize: 13, color: Colors.textHint },
  pillRow: { flexDirection: "row", gap: 4 },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  pillActive: { backgroundColor: Colors.forest },
  pillInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: { fontSize: 11, fontFamily: "DMSans_600SemiBold" },
  pillTextActive: { color: Colors.white },
  pillTextInactive: { color: "#4A5568" },

  /* List */
  list: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Card */
  artisanCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  avatarWrap: { position: "relative", flexShrink: 0 },
  onlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  artisanName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  priceText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 14,
    color: Colors.forest,
  },
  priceUnit: {
    fontSize: 10,
    fontWeight: "400",
    color: Colors.textHint,
    fontFamily: "DMMono_500Medium",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  metaSep: { fontSize: 11.5, color: Colors.textHint },
  dot: { fontSize: 11.5, color: Colors.textMuted },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  responseText: { fontSize: 11, color: Colors.textHint },

  /* Trust */
  trustFooter: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trustIcon: { fontSize: 18 },
  trustText: { fontSize: 12, color: "#14523B", lineHeight: 18, flex: 1 },
});
