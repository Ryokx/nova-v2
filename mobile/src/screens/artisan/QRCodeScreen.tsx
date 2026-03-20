import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Rect } from "react-native-svg";
import { Colors, Radii, Shadows } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

const usageTips = [
  { icon: "car", title: "Véhicule", desc: "Autocollant sur la portière ou le pare-brise arrière" },
  { icon: "credit-card", title: "Cartes de visite", desc: "Imprimez le QR code au dos de vos cartes" },
  { icon: "file-document", title: "Devis", desc: "Ajoutez-le en bas de vos documents papier" },
  { icon: "email", title: "Signature email", desc: "Insérez le lien dans votre signature" },
  { icon: "share", title: "Réseaux sociaux", desc: "Partagez-le sur votre profil pro" },
];

const scanStats = [
  { v: "47", l: "Scans ce mois" },
  { v: "12", l: "Nouveaux clients" },
  { v: "3", l: "Missions générées" },
];

// Generate a simplified QR-like grid pattern using react-native-svg
function QRBlock() {
  const size = 200;
  const grid = 25;
  const cell = size / grid;
  const rects: React.ReactElement[] = [];

  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const isTopLeft = x < 7 && y < 7;
      const isTopRight = x >= grid - 7 && y < 7;
      const isBottomLeft = x < 7 && y >= grid - 7;

      const isMarkerOuter =
        (isTopLeft || isTopRight || isBottomLeft) &&
        (x % 6 === 0 ||
          y % 6 === 0 ||
          x === (isTopRight ? grid - 1 : 6) ||
          y === (isBottomLeft ? grid - 1 : 6));
      const isMarkerInner =
        (isTopLeft && x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
        (isTopRight && x >= grid - 5 && x <= grid - 3 && y >= 2 && y <= 4) ||
        (isBottomLeft && x >= 2 && x <= 4 && y >= grid - 5 && y <= grid - 3);
      const isMarker = isMarkerOuter || isMarkerInner;

      const hash = ((x * 17 + y * 31 + 7) * 13) % 100;
      const isData = !isTopLeft && !isTopRight && !isBottomLeft && hash < 45;

      if (isMarker || isData) {
        rects.push(
          <Rect
            key={`${x}-${y}`}
            x={x * cell}
            y={y * cell}
            width={cell}
            height={cell}
            rx={cell * 0.15}
            fill="#0A1628"
          />
        );
      }
    }
  }

  // Center logo
  rects.push(
    <Rect key="logo-bg" x={size / 2 - 16} y={size / 2 - 16} width={32} height={32} rx={8} fill="#fff" />,
    <Rect key="logo-fg" x={size / 2 - 13} y={size / 2 - 13} width={26} height={26} rx={6} fill={Colors.forest} />
  );

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect width={size} height={size} fill="#fff" />
      {rects}
    </Svg>
  );
}

export function QRCodeScreen({
  navigation,
}: RootStackScreenProps<"QRCodeProfile">) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon QR code</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrBorder}>
            <QRBlock />
          </View>

          <Text style={styles.qrName}>Jean-Michel Petit</Text>
          <Text style={styles.qrTrade}>Plombier-Chauffagiste</Text>

          <View style={styles.certifBadge}>
            <Text style={styles.certifEmoji}><MaterialCommunityIcons name="shield-check" size={20} color={Colors.forest} /></Text>
            <Text style={styles.certifText}>Certifié Nova #2847</Text>
          </View>

          <View style={styles.urlWrap}>
            <Text style={styles.urlText}>nova.fr/p/jean-michel-petit-2847</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>
              {saved ? "Enregistre !" : "Enregistrer l'image"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}><MaterialCommunityIcons name="bell" size={22} color={Colors.navy} /> Partager</Text>
          </TouchableOpacity>
        </View>

        {/* Usage tips */}
        <Text style={styles.tipsTitle}>Où utiliser votre QR code</Text>
        {usageTips.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={styles.tipIconWrap}>
              <MaterialCommunityIcons name={tip.icon as any} size={18} color={Colors.forest} />
            </View>
            <View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDesc}>{tip.desc}</Text>
            </View>
          </View>
        ))}

        {/* Scan stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Statistiques de scan</Text>
          <View style={styles.statsRow}>
            {scanStats.map((k, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{k.v}</Text>
                <Text style={styles.statSub}>{k.l}</Text>
              </View>
            ))}
          </View>
        </View>
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

  /* QR Card */
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.md,
  },
  qrBorder: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surface,
    marginBottom: 16,
  },
  qrName: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 18,
    color: Colors.navy,
    marginBottom: 2,
  },
  qrTrade: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  certifBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  certifEmoji: { fontSize: 14 },
  certifText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#14523B",
  },
  urlWrap: {
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  urlText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
    color: Colors.textSecondary,
  },

  /* Actions */
  actionRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnSuccess: { backgroundColor: Colors.success },
  saveBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: Colors.white,
  },
  shareBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: Colors.forest,
  },

  /* Tips */
  tipsTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  tipIcon: { fontSize: 18 },
  tipTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },
  tipDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
  },

  /* Stats */
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    marginTop: 12,
  },
  statsLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  statsRow: { flexDirection: "row", gap: 12 },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: Colors.bgPage,
  },
  statValue: {
    fontFamily: "DMMono_500Medium",
    fontSize: 18,
    color: Colors.forest,
  },
  statSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
