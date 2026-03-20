import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

const REFERRAL_CODE = "NOVA-SL25";

const shareButtons = [
  { label: "WhatsApp", emoji: "��", bg: "#25D366" },
  { label: "SMS", emoji: "��", bg: "#4A5568" },
  { label: "Email", emoji: "✉️", bg: "#1B6B4E" },
  { label: "Lien", emoji: "��", bg: "#6B7280" },
];

const howItWorks = [
  {
    step: "1",
    title: "Partagez votre code",
    desc: "Envoyez votre code à un ami par WhatsApp, SMS ou email",
  },
  {
    step: "2",
    title: "Votre ami s'inscrit",
    desc: "Il crée son compte Nova avec votre code",
  },
  {
    step: "3",
    title: "Première intervention",
    desc: "Quand il réalise sa première mission, vous gagnez tous les deux 20€",
  },
];

const stats = [
  { value: "3", label: "Invitations envoyées" },
  { value: "1", label: "Ami inscrit" },
  { value: "20€", label: "Crédit gagné" },
];

export function ReferralScreen({
  navigation,
}: RootStackScreenProps<"Referral">) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Rejoins Nova avec mon code ${REFERRAL_CODE} et gagne 20€ de crédit sur ta première intervention ! https://nova.fr/r/${REFERRAL_CODE}`,
      });
    } catch {}
  };

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
        <Text style={styles.headerTitle}>Inviter des proches</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero reward */}
        <View style={styles.hero}>
          <View style={styles.heroBlob} />
          <Text style={styles.heroEmoji}>{"��"}</Text>
          <Text style={styles.heroTitle}>
            Gagnez 20€ par parrainage
          </Text>
          <Text style={styles.heroDesc}>
            Invitez un ami. Quand il réalise sa première intervention via
            Nova, vous recevez chacun 20€ de crédit.
          </Text>
        </View>

        {/* Referral code */}
        <Text style={styles.sectionTitle}>Votre code de parrainage</Text>
        <View style={styles.codeRow}>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{REFERRAL_CODE}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.copyBtn,
              copied && styles.copyBtnCopied,
            ]}
            activeOpacity={0.85}
            onPress={handleCopy}
          >
            <Text style={styles.copyBtnText}>
              {copied ? "Copié ✓" : "Copier"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Share buttons */}
        <Text style={styles.sectionTitle}>Partager via</Text>
        <View style={styles.shareRow}>
          {shareButtons.map((s) => (
            <TouchableOpacity
              key={s.label}
              style={[styles.shareBtn, { backgroundColor: s.bg }]}
              activeOpacity={0.85}
              onPress={handleShare}
            >
              <Text style={styles.shareEmoji}>{s.emoji}</Text>
              <Text style={styles.shareLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* How it works */}
        <Text style={styles.sectionTitle}>Comment ça marche</Text>
        {howItWorks.map((s, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>{s.step}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Vos parrainages</Text>
          <View style={styles.statsRow}>
            {stats.map((k, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{k.value}</Text>
                <Text style={styles.statLabel}>{k.label}</Text>
              </View>
            ))}
          </View>
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Hero */
  hero: {
    borderRadius: 22,
    padding: 28,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: Colors.deepForest,
  },
  heroBlob: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  heroEmoji: { fontSize: 36, marginBottom: 12 },
  heroTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 20,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 21,
    textAlign: "center",
  },

  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 10,
  },

  /* Code */
  codeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  codeBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  codeText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 16,
    color: Colors.forest,
    letterSpacing: 1,
  },
  copyBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: Colors.forest,
  },
  copyBtnCopied: { backgroundColor: Colors.success },
  copyBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },

  /* Share */
  shareRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  shareBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: "center",
  },
  shareEmoji: { fontSize: 20, marginBottom: 4 },
  shareLabel: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.white,
  },

  /* Steps */
  stepRow: { flexDirection: "row", gap: 14, marginBottom: 14 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    fontFamily: "DMMono_500Medium",
    fontSize: 13,
    color: Colors.forest,
  },
  stepTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  /* Stats */
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    marginTop: 8,
  },
  statsLabel: {
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
    fontSize: 20,
    color: Colors.forest,
  },
  statLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
});
