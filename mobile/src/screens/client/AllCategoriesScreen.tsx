import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

const allCategories = [
  { id: "tiler", label: "Carrelage", emoji: "checkbox-blank-outline", count: 21 },
  { id: "carpenter", label: "Menuiserie", emoji: "axe", count: 18 },
  { id: "ac", label: "Climatisation", emoji: "snowflake", count: 24 },
  { id: "glazier", label: "Vitrerie", emoji: "window-closed-variant", count: 14 },
  { id: "roofer", label: "Couverture", emoji: "home-roof", count: 12 },
  { id: "gardener", label: "Jardinage", emoji: "flower", count: 26 },
  { id: "mason", label: "Maçonnerie", emoji: "wall", count: 22 },
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
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Toutes les catégories</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countText}>
          {allCategories.length} catégories disponibles
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
                <MaterialCommunityIcons name={cat.emoji as any} size={20} color={Colors.forest} />
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
