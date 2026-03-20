import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge, Card, KPICard } from "../../components/ui";
import type { ArtisanTabScreenProps } from "../../navigation/types";

/* ── Types ── */
type AvailabilityStatus = "available" | "unavailable" | "urgency";

const availOptions: { id: AvailabilityStatus; label: string }[] = [
  { id: "available", label: "Disponible \�\�" },
  { id: "unavailable", label: "Indisponible \⛔" },
  { id: "urgency", label: "Urgences \⚡" },
];

const kpis = [
  { label: "Revenus du mois", value: "4 820\€", icon: "\�\�" },
  { label: "Missions en cours", value: "3", icon: "\�\�" },
  { label: "Devis en attente", value: "2", icon: "\�\�" },
  { label: "Note moyenne", value: "\⭐ 4.9", icon: "\⭐" },
];

const upcomingRdvs = [
  { client: "Pierre M.", type: "Installation robinet", date: "Auj. 14h", status: "Confirm\é", sColor: Colors.forest },
  { client: "Am\élie R.", type: "R\éparation chauffe-eau", date: "Dem. 9h", status: "En cours", sColor: Colors.success },
  { client: "Luc D.", type: "Diagnostic fuite", date: "18 mars 11h", status: "En attente", sColor: Colors.gold },
];

const fabItems = [
  { label: "Cr\éer un devis", icon: "\�\�", screen: "CreateQuote" as const },
  { label: "Nouvelle facture", icon: "\�\�", screen: "CreateInvoice" as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ArtisanHomeScreen({ navigation }: { navigation: any }) {
  const [avail, setAvail] = useState<AvailabilityStatus>("available");
  const [fabOpen, setFabOpen] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];

  const toggleFab = () => {
    Animated.spring(rotateAnim, {
      toValue: fabOpen ? 0 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
    setFabOpen(!fabOpen);
  };

  const fabRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.headerBg}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Bonjour Jean-Michel \�\�</Text>
              <View style={styles.certifRow}>
                <Text style={styles.certifIcon}>\�\�\️</Text>
                <Text style={styles.certifText}>Certifi\é Nova \• #2847</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.bellBtn}
                onPress={() => navigation.navigate("ArtisanNotifications")}
              >
                <Text style={styles.bellEmoji}>{"\�\�"}</Text>
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatarBtn}
                onPress={() => navigation.navigate("ArtisanProfile")}
              >
                <Avatar name="Jean-Michel" size={40} radius={14} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Availability Toggle ── */}
        <Card style={styles.availCard}>
          <Text style={styles.availLabel}>Disponibilit\é</Text>
          <View style={styles.availRow}>
            {availOptions.map((opt) => {
              const active = avail === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => setAvail(opt.id)}
                  style={[
                    styles.availBtn,
                    active && styles.availBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.availBtnText,
                      active && styles.availBtnTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* ── KPIs 2x2 ── */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiRow}>
            {kpis.slice(0, 2).map((k, i) => (
              <KPICard key={i} label={k.label} value={k.value} icon={k.icon} />
            ))}
          </View>
          <View style={styles.kpiRow}>
            {kpis.slice(2).map((k, i) => (
              <KPICard key={i} label={k.label} value={k.value} icon={k.icon} />
            ))}
          </View>
        </View>

        {/* ── Urgent Request ── */}
        <Text style={styles.sectionTitle}>Demandes urgentes</Text>
        <View style={styles.urgentCard}>
          <View style={styles.urgentTop}>
            <View style={styles.urgentLeft}>
              <View style={styles.urgentIconWrap}>
                <Text style={styles.urgentIconText}>{"\⚡"}</Text>
              </View>
              <View>
                <Text style={styles.urgentTitle}>Fuite d'eau urgente</Text>
                <Text style={styles.urgentLocation}>Secteur Paris 9e</Text>
                <Text style={styles.urgentDuration}>Intervention estim\ée : 1h</Text>
              </View>
            </View>
            <Text style={styles.urgentTime}>Il y a 4 min</Text>
          </View>
          <View style={styles.urgentActions}>
            <TouchableOpacity
              style={styles.urgentAcceptBtn}
              onPress={() => navigation.navigate("UrgentDetail", { demandId: "1" })}
            >
              <Text style={styles.urgentAcceptText}>Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.urgentDetailBtn}
              onPress={() => navigation.navigate("UrgentDetail", { demandId: "1" })}
            >
              <Text style={styles.urgentDetailText}>Voir d\étails</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Upcoming RDV ── */}
        <Text style={styles.sectionTitle}>Prochains RDV</Text>
        {upcomingRdvs.map((rdv, i) => (
          <TouchableOpacity
            key={i}
            style={styles.rdvCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("RDVDetail", { rdvId: String(i) })}
          >
            <View>
              <Text style={styles.rdvClient}>{rdv.client}</Text>
              <Text style={styles.rdvType}>{rdv.type}</Text>
              <Text style={styles.rdvDate}>{rdv.date}</Text>
            </View>
            <View style={[styles.rdvBadge, { backgroundColor: rdv.sColor + "18" }]}>
              <Text style={[styles.rdvBadgeText, { color: rdv.sColor }]}>{rdv.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── FAB ── */}
      {fabOpen && (
        <View style={styles.fabMenu}>
          {fabItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.fabMenuItem}
              onPress={() => {
                setFabOpen(false);
                if (item.screen === "CreateQuote") {
                  navigation.navigate("CreateQuote");
                } else {
                  navigation.navigate("CreateInvoice", { missionId: "1" });
                }
              }}
            >
              <Text style={styles.fabMenuIcon}>{item.icon}</Text>
              <Text style={styles.fabMenuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Animated.View style={[styles.fab, { transform: [{ rotate: fabRotation }] }]}>
        <TouchableOpacity style={styles.fabInner} onPress={toggleFab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  /* Header */
  headerBg: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 3,
  },
  certifRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  certifIcon: { fontSize: 14 },
  certifText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  bellBtn: { position: "relative", padding: 4 },
  bellEmoji: { fontSize: 22 },
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
    borderColor: Colors.bgPage,
  },
  bellBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
  },
  avatarBtn: {},

  /* Availability */
  availCard: { marginHorizontal: 16, marginTop: -8 },
  availLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: Colors.textHint,
    marginBottom: 8,
  },
  availRow: { flexDirection: "row", gap: 6 },
  availBtn: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: Radii.md,
    backgroundColor: Colors.bgPage,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  availBtnActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
    ...Shadows.sm,
  },
  availBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#4A5568",
  },
  availBtnTextActive: { color: Colors.white },

  /* KPIs */
  kpiGrid: { paddingHorizontal: 16, marginTop: 14, gap: 10 },
  kpiRow: { flexDirection: "row", gap: 10 },

  /* Section title */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: Colors.navy,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  /* Urgent card */
  urgentCard: {
    marginHorizontal: 16,
    backgroundColor: "rgba(232,48,42,0.04)",
    borderRadius: Radii["2xl"],
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.1)",
  },
  urgentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  urgentLeft: { flexDirection: "row", gap: 10, flex: 1 },
  urgentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(232,48,42,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  urgentIconText: { fontSize: 18 },
  urgentTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  urgentLocation: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#4A5568",
  },
  urgentDuration: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textHint,
  },
  urgentTime: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10.5,
    color: Colors.red,
  },
  urgentActions: { flexDirection: "row", gap: 8 },
  urgentAcceptBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  urgentAcceptText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.white,
  },
  urgentDetailBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  urgentDetailText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#4A5568",
  },

  /* RDV cards */
  rdvCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  rdvClient: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  rdvType: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  rdvDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  rdvBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  rdvBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },

  /* FAB */
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 200,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  fabText: {
    fontSize: 28,
    color: Colors.white,
    fontFamily: "Manrope_700Bold",
    marginTop: -2,
  },
  fabMenu: {
    position: "absolute",
    bottom: 88,
    right: 24,
    zIndex: 200,
    gap: 8,
  },
  fabMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fabMenuIcon: { fontSize: 16 },
  fabMenuLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },
});
