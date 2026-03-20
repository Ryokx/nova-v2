import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import type { ClientTabScreenProps } from "../../navigation/types";

/* ── Types ── */
type NotifType = "devis" | "mission" | "paiement" | "info";

interface Notification {
  id: string;
  type: NotifType;
  read: boolean;
  title: string;
  message: string;
  time: string;
  screen?: string;
  params?: Record<string, string>;
  actionLabel?: string;
}

const typeConfig: Record<NotifType, { bg: string; icon: string; accent: string }> = {
  devis: { bg: "rgba(27,107,78,0.06)", icon: "file-document", accent: Colors.forest },
  mission: { bg: "rgba(34,200,138,0.06)", icon: "check-circle", accent: Colors.success },
  paiement: { bg: "rgba(245,166,35,0.06)", icon: "cash", accent: Colors.gold },
  info: { bg: "rgba(138,149,163,0.06)", icon: "information", accent: Colors.textHint },
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "devis",
    read: false,
    title: "Nouveau devis reçu",
    message: "Jean-Michel P. vous a envoyé un devis pour « Remplacement robinet » — 236,50€ TTC",
    time: "Il y a 12 min",
    screen: "DevisReceived",
    params: { devisId: "devis-1" },
    actionLabel: "Voir le devis",
  },
  {
    id: "2",
    type: "mission",
    read: false,
    title: "Mission confirmée",
    message: "Votre rendez-vous avec Sophie M. est confirmé pour demain à 14h00",
    time: "Il y a 2h",
    screen: "MissionDetail",
    params: { id: "mission-1" },
    actionLabel: "Voir la mission",
  },
  {
    id: "3",
    type: "paiement",
    read: true,
    title: "Paiement validé par Nova",
    message: "Le paiement de 450,00€ pour la mission avec Amélie R. a été libéré",
    time: "Hier",
    screen: "MissionDetail",
    params: { id: "mission-2" },
    actionLabel: "Détails",
  },
  {
    id: "4",
    type: "info",
    read: true,
    title: "Bienvenue sur Nova",
    message: "Votre compte est vérifié. Vous pouvez maintenant rechercher des artisans certifiés.",
    time: "Il y a 3 jours",
  },
];

export function ClientNotificationsScreen({
  navigation,
}: ClientTabScreenProps<"ClientNotifications">) {
  const [notifs, setNotifs] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handlePress = (item: Notification) => {
    markRead(item.id);
    if (item.screen && item.params) {
      (navigation as any).navigate(item.screen, item.params);
    }
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  const renderNotification = ({ item }: { item: Notification }) => {
    const config = typeConfig[item.type];

    return (
      <TouchableOpacity
        style={[
          styles.notifCard,
          !item.read && { borderWidth: 1.5, borderColor: config.accent + "30" },
        ]}
        activeOpacity={0.85}
        onPress={() => handlePress(item)}
      >
        {!item.read && (
          <View style={[styles.unreadDot, { backgroundColor: config.accent }]} />
        )}

        <View style={styles.notifRow}>
          <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
            <MaterialCommunityIcons name={config.icon as any} size={18} color={config.accent} />
          </View>

          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifMessage}>{item.message}</Text>

            <View style={styles.notifBottom}>
              <Text style={styles.notifTime}>{item.time}</Text>
              {item.actionLabel && (
                <Text style={[styles.notifAction, { color: config.accent }]}>
                  {item.actionLabel} →
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllRead}>Tout marquer comme lu</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifs}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 22, color: Colors.navy },
  markAllRead: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.forest },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
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
  unreadDot: { position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: 4 },
  notifRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconCircle: { width: 40, height: 40, borderRadius: Radii.lg, alignItems: "center", justifyContent: "center" },
  notifContent: { flex: 1 },
  notifTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy, marginBottom: 4 },
  notifMessage: { fontFamily: "DMSans_400Regular", fontSize: 12.5, color: "#4A5568", lineHeight: 19, marginBottom: 6 },
  notifBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  notifTime: { fontFamily: "DMMono_500Medium", fontSize: 11, color: Colors.textMuted },
  notifAction: { fontFamily: "DMSans_600SemiBold", fontSize: 12 },
});
