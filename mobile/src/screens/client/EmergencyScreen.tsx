import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge, Card } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

/* ---- mock data ---- */
const urgCategories = [
  { id: "plumber", label: "Plomberie", icon: "\uD83D\uDD27" },
  { id: "electrician", label: "\u00C9lectricit\u00E9", icon: "\u26A1" },
  { id: "locksmith", label: "Serrurerie", icon: "\uD83D\uDD11" },
  { id: "heating", label: "Chauffage", icon: "\uD83D\uDD25" },
  { id: "other", label: "Autre", icon: "+" },
];

const urgentArtisans = [
  {
    id: "3",
    name: "Karim B.",
    job: "Serrurier",
    cat: "locksmith",
    initials: "KB",
    rating: 5.0,
    reviews: 83,
    price: 80,
    responseTime: "15 min",
    distance: "1,2 km",
    missions: 83,
  },
  {
    id: "1",
    name: "Jean-Michel P.",
    job: "Plombier",
    cat: "plumber",
    initials: "JM",
    rating: 4.9,
    reviews: 127,
    price: 85,
    responseTime: "25 min",
    distance: "2,4 km",
    missions: 127,
  },
  {
    id: "14",
    name: "Christophe D.",
    job: "Chauffagiste",
    cat: "heating",
    initials: "CD",
    rating: 4.9,
    reviews: 89,
    price: 90,
    responseTime: "30 min",
    distance: "3,1 km",
    missions: 89,
  },
];

/* ---- helpers ---- */
const Stars = ({ rating, size = 13 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: "row", gap: 1 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Text
        key={i}
        style={{ fontSize: size, color: i <= rating ? Colors.gold : Colors.border }}
      >
        {"\u2605"}
      </Text>
    ))}
  </View>
);

export function EmergencyScreen({
  navigation,
}: RootStackScreenProps<"Emergency">) {
  const [urgCat, setUrgCat] = useState<string | null>(null);

  const filtered =
    urgCat && urgCat !== "all"
      ? urgentArtisans.filter((a) => a.cat === urgCat)
      : urgentArtisans;

  /* -------- Step 1: Category selection -------- */
  if (!urgCat) {
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
          <Text style={styles.headerTitle}>Urgence 24h/24</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Red gradient banner */}
          <View style={styles.redBanner}>
            <Text style={styles.redBannerEmoji}>{"\u26A1"}</Text>
            <Text style={styles.redBannerTitle}>
              Besoin d'une intervention urgente ?
            </Text>
            <Text style={styles.redBannerSub}>
              S\u00E9lectionnez le domaine concern\u00E9
            </Text>
          </View>

          {/* Category cards */}
          <View style={styles.content}>
            {urgCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                activeOpacity={0.85}
                onPress={() =>
                  setUrgCat(cat.id === "other" ? "all" : cat.id)
                }
              >
                <View style={styles.catIconWrap}>
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  <Text style={styles.catSub}>
                    {cat.id === "other"
                      ? "Tous les artisans d'urgence"
                      : `Artisans ${cat.label.toLowerCase()} disponibles`}
                  </Text>
                </View>
                <Text style={styles.chevron}>{"\u203A"}</Text>
              </TouchableOpacity>
            ))}

            {/* Info notice */}
            <View style={styles.infoNotice}>
              <Text style={styles.infoIcon}>{"\u23F0"}</Text>
              <Text style={styles.infoText}>
                Temps de r\u00E9ponse moyen : 20 minutes. Intervention sous 2h
                garantie.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  /* -------- Step 2: Available artisans -------- */
  const catLabel =
    urgCat === "all"
      ? "Tous les domaines"
      : urgCategories.find((c) => c.id === urgCat)?.label || "Urgence";

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setUrgCat(null)}
        >
          <Text style={styles.backArrow}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Urgence \u2014 {catLabel}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Express banner */}
        <View style={styles.expressBanner}>
          <Text style={{ fontSize: 18 }}>{"\u26A1"}</Text>
          <View>
            <Text style={styles.expressBannerTitle}>Intervention express</Text>
            <Text style={styles.expressBannerSub}>
              Ces artisans peuvent intervenir dans l'heure
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.countLabel}>
            {filtered.length} artisan{filtered.length > 1 ? "s" : ""}{" "}
            disponible{filtered.length > 1 ? "s" : ""} maintenant
          </Text>

          {filtered.map((a) => (
            <View key={a.id} style={styles.artisanCard}>
              {/* Artisan info row */}
              <TouchableOpacity
                style={styles.artisanTop}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("ArtisanProfile", { id: a.id })
                }
              >
                <View style={styles.avatarWrap}>
                  <Avatar name={a.name} size={50} radius={18} />
                  <View style={styles.onlineDot} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.artisanNameRow}>
                    <Text style={styles.artisanName}>{a.name}</Text>
                    <Badge
                      label={"\uD83D\uDEE1\uFE0F Certifi\u00E9 Nova"}
                      variant="certified"
                      size="sm"
                    />
                  </View>
                  <Text style={styles.artisanJob}>{a.job}</Text>
                  <View style={styles.metaRow}>
                    <Stars rating={Math.round(a.rating)} size={13} />
                    <Text style={styles.ratingValue}>{a.rating}</Text>
                    <Text style={styles.dot}>{"\u2022"}</Text>
                    <Text style={styles.metaText}>{a.reviews} avis</Text>
                    <Text style={styles.dot}>{"\u2022"}</Text>
                    <Text style={styles.metaText}>{a.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Response time + price bar */}
              <View style={styles.urgencyBar}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 13, color: Colors.red }}>{"\u23F0"}</Text>
                  <Text style={styles.urgencyTime}>
                    Dispo en ~{a.responseTime}
                  </Text>
                </View>
                <Text style={styles.priceText}>
                  {a.price}\u20AC
                  <Text style={styles.priceUnit}>/h</Text>
                </Text>
              </View>

              {/* Action buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.redBtn}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("Booking", { artisanId: a.id })
                  }
                >
                  <Text style={styles.redBtnText}>
                    {"\u26A1"} Intervention imm\u00E9diate
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.outlineBtn}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("ArtisanProfile", { id: a.id })
                  }
                >
                  <Text style={styles.outlineBtnText}>Voir profil</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Trust footer */}
          <View style={styles.trustFooter}>
            <Text style={styles.trustIcon}>{"\uD83D\uDEE1\uFE0F"}</Text>
            <Text style={styles.trustText}>
              Tarif urgence major\u00E9. Paiement s\u00E9curis\u00E9 par
              s\u00E9questre Nova \u2014 l'artisan ne sera pay\u00E9 qu'apr\u00E8s
              validation par nos \u00E9quipes.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.bgPage,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.forest,
    fontWeight: "700",
  },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },
  content: {
    paddingHorizontal: 16,
  },

  /* Red banner */
  redBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.red,
    alignItems: "center",
  },
  redBannerEmoji: { fontSize: 20, marginBottom: 6 },
  redBannerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: Colors.white,
    marginBottom: 4,
    textAlign: "center",
  },
  redBannerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },

  /* Category cards */
  catCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  catIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(232,48,42,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  catIcon: { fontSize: 22 },
  catLabel: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  catSub: {
    fontSize: 12,
    color: Colors.textHint,
    marginTop: 2,
  },
  chevron: { fontSize: 20, color: "#B0B0BB" },

  /* Info notice */
  infoNotice: {
    backgroundColor: "rgba(232,48,42,0.04)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.08)",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoIcon: { fontSize: 16, color: Colors.red },
  infoText: { fontSize: 12, color: Colors.red, lineHeight: 18, flex: 1 },

  /* Express banner */
  expressBanner: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.red,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  expressBannerTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: Colors.white,
  },
  expressBannerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
  },
  countLabel: {
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 14,
  },

  /* Artisan card */
  artisanCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  artisanTop: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  avatarWrap: { position: "relative" },
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
  artisanNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  artisanName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  artisanJob: {
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingValue: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  dot: { fontSize: 11, color: Colors.textMuted },
  metaText: { fontSize: 11, color: Colors.textHint },

  /* Urgency bar */
  urgencyBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(232,48,42,0.04)",
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.08)",
    marginBottom: 12,
  },
  urgencyTime: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: Colors.red,
  },
  priceText: {
    fontFamily: "DMMono_700Bold",
    fontSize: 15,
    color: Colors.navy,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "400",
    color: Colors.textHint,
    fontFamily: "DMMono_500Medium",
  },

  /* Action buttons */
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  redBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  redBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  outlineBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    color: Colors.forest,
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },

  /* Trust footer */
  trustFooter: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  trustIcon: { fontSize: 18 },
  trustText: {
    fontSize: 12,
    color: "#14523B",
    lineHeight: 18,
    flex: 1,
  },
});
