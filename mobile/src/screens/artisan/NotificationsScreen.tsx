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
import { Colors, Radii, Shadows } from "../../constants/theme";
import { useTheme } from "../../hooks/useTheme";
import type { ArtisanTabScreenProps } from "../../navigation/types";

type NotifType = "demande" | "devis" | "payment" | "rdv" | "info";

interface Notification {
  id: number;
  type: NotifType;
  read: boolean;
  time: string;
  title: string;
  desc: string;
  screen?: string;
  params?: Record<string, string>;
  actionLabel?: string;
}

const typeStyles: Record<NotifType, { bg: string; icon: string; accent: string }> = {
  demande: { bg: "rgba(232,48,42,0.06)", icon: "lightning-bolt", accent: Colors.red },
  devis: { bg: "rgba(27,107,78,0.06)", icon: "file-document", accent: Colors.forest },
  payment: { bg: "rgba(34,200,138,0.06)", icon: "cash-check", accent: Colors.success },
  rdv: { bg: "rgba(245,166,35,0.06)", icon: "calendar", accent: Colors.gold },
  info: { bg: "rgba(138,149,163,0.06)", icon: "shield-check", accent: Colors.textHint },
};

const initialNotifications: Notification[] = [
  {
    id: 1, type: "demande", read: false, time: "14:32",
    title: "Nouvelle demande urgente",
    desc: "Fuite d'eau urgente — Secteur Paris 9e — Intervention estimée : 1h",
    screen: "UrgentDetail", params: { demandId: "1" }, actionLabel: "Voir",
  },
  {
    id: 2, type: "devis", read: false, time: "Il y a 1h",
    title: "Devis accepté par le client",
    desc: "Pierre M. a accepté votre devis #DEV-2026-089 — 236,50€. Paiement bloqué en séquestre.",
    screen: "ArtisanDocuments", actionLabel: "Voir le devis",
  },
  {
    id: 3, type: "payment", read: false, time: "Il y a 3h",
    title: "Paiement libéré 450€",
    desc: "Nova a validé la mission pour Amélie R. — 450,00€ virés sous 48h.",
    actionLabel: "Détails",
  },
  {
    id: 4, type: "rdv", read: true, time: "Hier",
    title: "Nouveau RDV Pierre M.",
    desc: "Luc D. — Diagnostic fuite, 18 mars à 11h, 5 rue de Charonne, Paris 11e",
    screen: "RDVDetail", params: { rdvId: "1" }, actionLabel: "Voir",
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
  const { c } = useTheme();
  const [notifs, setNotifs] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handlePress = (n: Notification) => {
    setNotifs((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    if (n.screen) {
      (navigation as any).navigate(n.screen, n.params || {});
    }
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: c.text }]}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllRead}>Tout marquer comme lu</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifs.map((n) => {
          const st = typeStyles[n.type];
          return (
            <TouchableOpacity
              key={n.id}
              style={[
                styles.notifCard,
                { backgroundColor: c.card },
                !n.read && { borderColor: st.accent + "30", borderWidth: 1.5 },
              ]}
              activeOpacity={0.85}
              onPress={() => handlePress(n)}
            >
              {!n.read && (
                <View style={[styles.unreadDot, { backgroundColor: st.accent }]} />
              )}
              <View style={styles.notifRow}>
                <View style={[styles.notifIconWrap, { backgroundColor: st.bg }]}>
                  <MaterialCommunityIcons name={st.icon as any} size={18} color={st.accent} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={[styles.notifTitle, { color: c.text }]}>{n.title}</Text>
                  <Text style={styles.notifDesc}>{n.desc}</Text>
                  <View style={styles.notifBottom}>
                    <Text style={styles.notifTime}>{n.time}</Text>
                    {n.actionLabel && (
                      <Text style={[styles.notifAction, { color: st.accent }]}>
                        {n.actionLabel} →
                      </Text>
                    )}
                  </View>
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
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  headerTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 22, color: Colors.navy },
  markAllRead: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.forest },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  notifCard: {
    backgroundColor: Colors.white, borderRadius: Radii["2xl"], padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: "rgba(10,22,40,0.04)",
    position: "relative", ...Shadows.sm,
  },
  unreadDot: { position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: 4 },
  notifRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  notifIconWrap: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  notifContent: { flex: 1 },
  notifTitle: { fontFamily: "Manrope_700Bold", fontSize: 14, color: Colors.navy, marginBottom: 4 },
  notifDesc: { fontFamily: "DMSans_400Regular", fontSize: 12.5, color: "#4A5568", lineHeight: 18, marginBottom: 6 },
  notifBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  notifTime: { fontFamily: "DMMono_500Medium", fontSize: 11, color: Colors.textMuted },
  notifAction: { fontFamily: "DMSans_600SemiBold", fontSize: 12 },
});
