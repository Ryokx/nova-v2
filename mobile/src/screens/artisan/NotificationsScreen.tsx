import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import type { ArtisanTabScreenProps } from "../../navigation/types";

type NotifType = "demande" | "devis" | "payment" | "rdv" | "info";

interface Notification {
  id: number;
  type: NotifType;
  read: boolean;
  time: string;
  title: string;
  desc: string;
}

const typeStyles: Record<NotifType, { bg: string; icon: string; accent: string }> = {
  demande: { bg: "rgba(232,48,42,0.06)", icon: "lightning-bolt", accent: Colors.red },
  devis: { bg: "rgba(27,107,78,0.06)", icon: "file-document", accent: Colors.forest },
  payment: { bg: "rgba(34,200,138,0.06)", icon: "cash-check", accent: Colors.success },
  rdv: { bg: "rgba(245,166,35,0.06)", icon: "calendar", accent: Colors.gold },
  info: { bg: "rgba(138,149,163,0.06)", icon: "shield-check", accent: Colors.textHint },
};

const notifications: Notification[] = [
  {
    id: 1, type: "demande", read: false, time: "14:32",
    title: "Nouvelle demande urgente",
    desc: "Fuite d'eau urgente — Secteur Paris 9e — Intervention estimée : 1h",
  },
  {
    id: 2, type: "devis", read: false, time: "Il y a 1h",
    title: "Devis accepté par le client",
    desc: "Pierre M. a accepté votre devis #DEV-2026-089 — 236,50€. Paiement bloqué en séquestre.",
  },
  {
    id: 3, type: "payment", read: false, time: "Il y a 3h",
    title: "Paiement libéré 450€",
    desc: "Nova a validé la mission pour Amélie R. — 450,00€ virés sous 48h.",
  },
  {
    id: 4, type: "rdv", read: true, time: "Hier",
    title: "Nouveau RDV Pierre M.",
    desc: "Luc D. — Diagnostic fuite, 18 mars à 11h, 5 rue de Charonne, Paris 11e",
  },
  {
    id: 5, type: "info", read: true, time: "Il y a 3 jours",
    title: "Rappel certification",
    desc: "Votre certification Nova a été renouvelée jusqu'au 15 mars 2027.",
  },
];

export function ArtisanNotificationsScreen({
  navigation,
}: ArtisanTabScreenProps<"ArtisanNotifications">) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Tout marquer comme lu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((n) => {
          const st = typeStyles[n.type];
          return (
            <TouchableOpacity
              key={n.id}
              style={[
                styles.notifCard,
                !n.read && { borderColor: st.accent + "30", borderWidth: 1.5 },
              ]}
              activeOpacity={0.85}
            >
              {!n.read && (
                <View style={[styles.unreadDot, { backgroundColor: st.accent }]} />
              )}
              <View style={styles.notifRow}>
                <View style={[styles.notifIconWrap, { backgroundColor: st.bg }]}>
                  <MaterialCommunityIcons name={st.icon as any} size={18} color={st.accent} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={styles.notifTitle}>{n.title}</Text>
                  <Text style={styles.notifDesc}>{n.desc}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
  },
  markAllRead: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.forest,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  notifCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    position: "relative",
    ...Shadows.sm,
  },
  unreadDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  notifIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  notifIconText: { fontSize: 18 },
  notifContent: { flex: 1 },
  notifTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 4,
  },
  notifDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12.5,
    color: "#4A5568",
    lineHeight: 18,
    marginBottom: 6,
  },
  notifTime: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
});
