import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge, Card, EscrowStepper } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

/* ---- mock data ---- */
const reviews = [
  {
    name: "Caroline L.",
    rating: 5,
    text: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !",
    date: "Il y a 3 jours",
  },
  {
    name: "Pierre M.",
    rating: 5,
    text: "Intervention rapide et soignée. Le séquestre Nova m'a rassuré.",
    date: "Il y a 1 semaine",
  },
];

/* ---- helpers ---- */
const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
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

export function ArtisanProfileScreen({
  navigation,
}: RootStackScreenProps<"ArtisanProfile">) {
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- Hero ---------- */}
        <View style={styles.hero}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>{"\u2039"}</Text>
          </TouchableOpacity>

          <View style={styles.avatarWrap}>
            <Avatar name="Jean-Michel" size={84} radius={26} />
          </View>
          <Text style={styles.heroName}>Jean-Michel Petit</Text>
          <Text style={styles.heroJob}>Plombier-Chauffagiste</Text>

          <View style={styles.ratingRow}>
            <Stars rating={5} size={15} />
            <Text style={styles.ratingValue}>4.9</Text>
            <Text style={styles.ratingMissions}>{"\u2022"} 127 missions</Text>
          </View>
        </View>

        {/* ---------- Content card ---------- */}
        <View style={styles.contentCard}>
          {/* Badges */}
          <View style={styles.badgesRow}>
            <Badge label="\u{1F6E1}\uFE0F Certifié Nova" variant="certified" size="sm" />
            <Badge label="\uD83D\uDCCB Décennale" variant="success" size="sm" />
            <Badge label="\u26A1 RGE" variant="warning" size="sm" />
          </View>

          {/* Escrow explainer */}
          <View style={styles.escrowBox}>
            <Text style={styles.escrowTitle}>
              {"\uD83D\uDD12"} Comment ça marche
            </Text>
            <EscrowStepper currentStep={0} />
          </View>

          {/* Pricing row */}
          <View style={styles.pricingRow}>
            <View style={styles.pricingCell}>
              <Text style={styles.priceMono}>65\u20AC/h</Text>
              <Text style={styles.priceSub}>Tarif</Text>
            </View>
            <View style={[styles.pricingCell, styles.pricingCellBorder]}>
              <Text style={styles.priceGreen}>Offert</Text>
              <Text style={styles.priceSub}>Déplacement</Text>
            </View>
            <View style={[styles.pricingCell, styles.pricingCellBorder]}>
              <Text style={styles.priceForest}>Gratuit</Text>
              <Text style={styles.priceSub}>Devis</Text>
            </View>
          </View>

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Avis clients</Text>
          {reviews.map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewLeft}>
                  <Avatar name={r.name} size={28} radius={10} />
                  <Text style={styles.reviewName}>{r.name}</Text>
                </View>
                <Stars rating={r.rating} size={11} />
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
              <Text style={styles.reviewDate}>{r.date}</Text>
            </View>
          ))}

          {/* Annual maintenance CTA */}
          <TouchableOpacity style={styles.maintenanceCta} activeOpacity={0.8}>
            <View style={styles.maintenanceIcon}>
              <Text style={{ fontSize: 18, color: Colors.white }}>
                {"\uD83D\uDD54"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.maintenanceTitle}>
                Contrat d'entretien annuel
              </Text>
              <Text style={styles.maintenanceDesc}>
                Chaudière, climatisation, VMC — entretien planifié
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: Colors.forest }}>{"\u203A"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------- Bottom action buttons ---------- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <Text style={styles.iconBtnText}>{"\uD83D\uDCAC"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <Text style={styles.iconBtnText}>{"\uD83D\uDCDE"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Booking", { artisanId: "1" })}
        >
          <Text style={styles.primaryBtnText}>Prendre RDV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dangerBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Emergency")}
        >
          <Text style={styles.dangerBtnText}>{"\uD83D\uDEA8"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  /* Hero */
  hero: {
    backgroundColor: Colors.surface,
    paddingTop: 54,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 54,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "600" },
  avatarWrap: { marginBottom: 12 },
  heroName: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 23,
    color: Colors.navy,
    marginBottom: 3,
  },
  heroJob: { fontSize: 13, color: Colors.textHint, marginBottom: 10 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingValue: { fontSize: 14, fontWeight: "700", color: Colors.gold },
  ratingMissions: { fontSize: 12, color: Colors.textHint },

  /* Content card */
  contentCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
    ...Shadows.sm,
  },

  /* Badges */
  badgesRow: { flexDirection: "row", gap: 6, marginBottom: 18, flexWrap: "wrap" },

  /* Escrow box */
  escrowBox: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginBottom: 20,
  },
  escrowTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#14523B",
    marginBottom: 6,
  },

  /* Pricing */
  pricingRow: {
    flexDirection: "row",
    backgroundColor: Colors.bgPage,
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.03)",
  },
  pricingCell: { flex: 1, alignItems: "center" },
  pricingCellBorder: { borderLeftWidth: 1, borderLeftColor: Colors.border },
  priceMono: {
    fontFamily: "DMMono_500Medium",
    fontSize: 22,
    fontWeight: "700",
    color: Colors.navy,
  },
  priceGreen: { fontSize: 15, fontWeight: "600", color: Colors.success },
  priceForest: { fontSize: 15, fontWeight: "600", color: Colors.forest },
  priceSub: { fontSize: 10, color: Colors.textHint, marginTop: 2 },

  /* Reviews */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: Colors.navy,
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: Colors.bgPage,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.03)",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  reviewLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  reviewName: { fontSize: 13, fontWeight: "600", color: Colors.navy },
  reviewText: {
    fontSize: 12.5,
    color: "#4A5568",
    lineHeight: 18,
  },
  reviewDate: { fontSize: 10, color: Colors.textMuted, marginTop: 5 },

  /* Maintenance CTA */
  maintenanceCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  maintenanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  maintenanceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 2,
  },
  maintenanceDesc: { fontSize: 12, color: Colors.textSecondary },

  /* Bottom bar */
  bottomBar: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "rgba(10,22,40,0.04)",
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: { fontSize: 22 },
  primaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  primaryBtnText: { color: Colors.white, fontSize: 15, fontWeight: "600" },
  dangerBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  dangerBtnText: { fontSize: 18, color: Colors.white },
});
