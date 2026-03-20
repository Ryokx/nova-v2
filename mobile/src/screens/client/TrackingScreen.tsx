import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar, Button, Card } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

interface TimelineStep {
  label: string;
  desc: string;
  time: string;
  done: boolean;
}

export function TrackingScreen({
  navigation,
}: RootStackScreenProps<"Tracking">) {
  const [trackingStep, setTrackingStep] = useState(1);

  const steps: TimelineStep[] = [
    {
      label: "Devis signé",
      desc: "Le paiement est bloqué en séquestre",
      time: "14:02",
      done: true,
    },
    {
      label: "Artisan en route",
      desc: "Jean-Michel P. arrive dans ~15 min",
      time: "14:35",
      done: trackingStep >= 1,
    },
    {
      label: "Sur place",
      desc: "L'intervention a commencé",
      time: trackingStep >= 2 ? "14:52" : "—",
      done: trackingStep >= 2,
    },
    {
      label: "Intervention terminée",
      desc: "En attente de votre validation",
      time: trackingStep >= 3 ? "15:40" : "—",
      done: trackingStep >= 3,
    },
  ];

  return (
    <View style={styles.root}>
      {/* Hero header */}
      <View style={styles.heroHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>{"‹"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Suivi intervention</Text>
        </View>

        {/* Artisan card */}
        <Card style={{ marginTop: 0 }}>
          <View style={styles.artisanRow}>
            <Avatar name="Jean-Michel Petit" size={52} radius={18} />
            <View style={{ flex: 1 }}>
              <Text style={styles.artisanName}>Jean-Michel Petit</Text>
              <Text style={styles.artisanMeta}>
                Plombier {"•"} Fuite sous évier
              </Text>
            </View>
            <View style={styles.artisanActions}>
              <TouchableOpacity style={styles.smallIconBtn} activeOpacity={0.7}>
                <Text style={{ fontSize: 16 }}><MaterialCommunityIcons name="chat-outline" size={18} color={Colors.forest} /></Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallIconBtn} activeOpacity={0.7}>
                <Text style={{ fontSize: 16 }}><MaterialCommunityIcons name="phone-outline" size={18} color={Colors.forest} /></Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Status banner */}
          {trackingStep === 1 && (
            <View style={styles.bannerGold}>
              <View style={styles.pulseDotGold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerGoldTitle}>En route vers vous</Text>
                <Text style={styles.bannerGoldSub}>
                  Arrivée estimée dans ~15 min
                </Text>
              </View>
            </View>
          )}
          {trackingStep === 2 && (
            <View style={styles.bannerGreen}>
              <View style={styles.pulseDotGreen} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerGreenTitle}>
                  Intervention en cours
                </Text>
                <Text style={styles.bannerGreenSub}>
                  Jean-Michel est sur place depuis 14:52
                </Text>
              </View>
            </View>
          )}
          {trackingStep >= 3 && (
            <View style={styles.bannerGreen}>
              <MaterialCommunityIcons name="check-circle" size={16} color={Colors.success} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerGreenTitle}>
                  Intervention terminée
                </Text>
                <Text style={styles.bannerGreenSub}>
                  En attente de votre validation
                </Text>
              </View>
            </View>
          )}
        </Card>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeline */}
        <Text style={styles.sectionTitle}>Progression</Text>
        {steps.map((s, i) => (
          <View key={i} style={styles.timelineRow}>
            {/* Left column: circle + line */}
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.timelineCircle,
                  s.done && styles.timelineCircleDone,
                ]}
              >
                {s.done ? (
                  <Text style={styles.timelineCheck}>{"✓"}</Text>
                ) : (
                  <Text style={styles.timelineNum}>{i + 1}</Text>
                )}
              </View>
              {i < 3 && (
                <View
                  style={[
                    styles.timelineLine,
                    s.done && styles.timelineLineDone,
                  ]}
                />
              )}
            </View>
            {/* Right column: text */}
            <View style={[styles.timelineContent, i < 3 && { paddingBottom: 20 }]}>
              <View style={styles.timelineLabelRow}>
                <Text
                  style={[
                    styles.timelineLabel,
                    s.done && { color: Colors.forest },
                  ]}
                >
                  {s.label}
                </Text>
                <Text style={styles.timelineTime}>{s.time}</Text>
              </View>
              <Text style={styles.timelineDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}

        {/* Escrow info card */}
        <Card style={{ marginTop: 20 }}>
          <View style={styles.escrowHeader}>
            <Text style={{ fontSize: 14 }}><MaterialCommunityIcons name="lock" size={16} color={Colors.lightSage} /></Text>
            <Text style={styles.escrowTitle}>Paiement en séquestre</Text>
          </View>
          <View style={styles.escrowAmountRow}>
            <Text style={styles.escrowLabel}>Montant bloqué</Text>
            <Text style={styles.escrowAmount}>320,00 €</Text>
          </View>
          <Text style={styles.escrowNote}>
            Sera libéré après votre validation de l'intervention
          </Text>
        </Card>

        {/* Demo advance buttons */}
        <View style={styles.demoRow}>
          {[
            { label: "→ Sur place", step: 2 },
            { label: "→ Terminé", step: 3 },
          ]
            .filter((b) => b.step > trackingStep)
            .map((b) => (
              <TouchableOpacity
                key={b.step}
                onPress={() => setTrackingStep(b.step)}
                style={styles.demoBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.demoBtnText}>Demo : {b.label}</Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Validate button */}
        {trackingStep >= 3 && (
          <Button
            title="Valider l'intervention"
            onPress={() =>
              navigation.navigate("MissionDetail", { id: "1" })
            }
            fullWidth
            size="lg"
            style={{ marginTop: 16 }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  /* Hero header */
  heroHeader: {
    backgroundColor: Colors.surface,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "600" },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 20,
    color: Colors.navy,
  },

  /* Artisan row */
  artisanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  artisanName: { fontSize: 16, fontWeight: "700", color: Colors.navy },
  artisanMeta: { fontSize: 12, color: Colors.textSecondary },
  artisanActions: { flexDirection: "row", gap: 6 },
  smallIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Status banners */
  bannerGold: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF8ED",
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(245,166,35,0.15)",
  },
  pulseDotGold: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
  bannerGoldTitle: { fontSize: 13, fontWeight: "700", color: "#92610A" },
  bannerGoldSub: { fontSize: 11, color: "#B8860B" },

  bannerGreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pulseDotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },
  bannerGreenTitle: { fontSize: 13, fontWeight: "700", color: "#14523B" },
  bannerGreenSub: { fontSize: 11, color: Colors.forest },

  /* Timeline */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 16,
  },
  timelineRow: { flexDirection: "row", gap: 14 },
  timelineLeft: { alignItems: "center", width: 28 },
  timelineCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineCircleDone: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  timelineCheck: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  timelineNum: {
    fontFamily: "DMMono_500Medium",
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  timelineLine: {
    width: 2,
    height: 36,
    backgroundColor: Colors.border,
  },
  timelineLineDone: { backgroundColor: Colors.forest },
  timelineContent: { flex: 1, paddingTop: 4 },
  timelineLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timelineLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    fontWeight: "700",
    color: Colors.navy,
  },
  timelineTime: {
    fontFamily: "DMMono_500Medium",
    fontSize: 10,
    color: Colors.textSecondary,
  },
  timelineDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  /* Escrow card */
  escrowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  escrowTitle: { fontSize: 13, fontWeight: "700", color: "#14523B" },
  escrowAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  escrowLabel: { fontSize: 12, color: Colors.textSecondary },
  escrowAmount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 18,
    fontWeight: "700",
    color: Colors.forest,
  },
  escrowNote: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  /* Demo buttons */
  demoRow: { flexDirection: "row", gap: 8, marginTop: 20 },
  demoBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.border,
    alignItems: "center",
  },
  demoBtnText: { fontSize: 11, color: Colors.textSecondary },
});
