import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

const allCategories = [
  { id: "plumber", label: "Plomberie", emoji: "\uD83D\uDD27", count: 47 },
  { id: "electrician", label: "\u00C9lectricit\u00E9", emoji: "\u26A1", count: 38 },
  { id: "locksmith", label: "Serrurerie", emoji: "\uD83D\uDD11", count: 29 },
  { id: "heating", label: "Chauffage", emoji: "\uD83D\uDD25", count: 31 },
  { id: "painter", label: "Peinture", emoji: "\uD83C\uDFA8", count: 35 },
  { id: "mason", label: "Ma\u00E7onnerie", emoji: "\uD83E\uDDF1", count: 22 },
  { id: "tiler", label: "Carrelage", emoji: "\uD83D\uDD33", count: 21 },
  { id: "carpenter", label: "Menuiserie", emoji: "\uD83E\uDE9A", count: 18 },
  { id: "ac", label: "Climatisation", emoji: "\u2744\uFE0F", count: 24 },
  { id: "glazier", label: "Vitrerie", emoji: "\uD83E\uDE9F", count: 14 },
  { id: "roofer", label: "Couverture", emoji: "\uD83C\uDFE0", count: 12 },
  { id: "gardener", label: "Jardinage", emoji: "\uD83C\uDF3F", count: 26 },
];

export function AllCategoriesScreen({
  navigation,
}: RootStackScreenProps<"AllCategories">) {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Toutes les cat\u00E9gories</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countText}>
          {allCategories.length} cat\u00E9gories disponibles
        </Text>

        <View style={styles.grid}>
          {allCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("ArtisanListByCategory", {
                  category: cat.id,
                })
              }
            >
              <View style={styles.iconWrap}>
                <Text style={styles.emoji}>{cat.emoji}</Text>
              </View>
              <Text style={styles.catName}>{cat.label}</Text>
              <Text style={styles.catCount}>{cat.count} artisans</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  countText: {
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emoji: { fontSize: 20 },
  catName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
    marginBottom: 2,
  },
  catCount: {
    fontSize: 12,
    color: Colors.textHint,
  },
});
