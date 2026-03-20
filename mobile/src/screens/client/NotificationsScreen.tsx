import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  action?: string; // navigation target param
}

/* ── Type styles ── */
const typeConfig: Record<
  NotifType,
  { bg: string; iconEmoji: string; accent: string }
> = {
  devis: { bg: "rgba(27,107,78,0.06)", iconEmoji: "��", accent: Colors.forest },
  mission: { bg: "rgba(34,200,138,0.06)", iconEmoji: "✅", accent: Colors.success },
  paiement: { bg: "rgba(245,166,35,0.06)", iconEmoji: "��", accent: Colors.gold },
  info: { bg: "rgba(138,149,163,0.06)", iconEmoji: "��️", accent: Colors.textHint },
};

/* ── Mock data ── */
const notifications: Notification[] = [
  {
    id: "1",
    type: "devis",
    read: false,
    title: "Nouveau devis reçu",
    message:
      "Jean-Michel P. vous a envoyé un devis pour « Remplacement robinet » — 236,50€ TTC",
    time: "Il y a 12 min",
    action: "devis-1",
  },
  {
    id: "2",
    type: "mission",
    read: false,
    title: "Mission confirmée",
    message:
      "Votre rendez-vous avec Sophie M. est confirmé pour demain à 14h00",
    time: "Il y a 2h",
  },
  {
    id: "3",
    type: "paiement",
    read: true,
    title: "Paiement validé par Nova",
    message:
      "Le paiement de 450,00€ pour la mission avec Amélie R. a été libéré",
    time: "Hier",
  },
  {
    id: "4",
    type: "info",
    read: true,
    title: "Bienvenue sur Nova",
    message:
      "Votre compte est vérifié. Vous pouvez maintenant rechercher des artisans certifiés.",
    time: "Il y a 3 jours",
  },
];

export function ClientNotificationsScreen({
  navigation,
}: ClientTabScreenProps<"ClientNotifications">) {
  const renderNotification = ({ item }: { item: Notification }) => {
    const config = typeConfig[item.type];

    return (
      <TouchableOpacity
        style={[
          styles.notifCard,
          !item.read && {
            borderWidth: 1.5,
            borderColor: config.accent + "30",
          },
        ]}
        activeOpacity={item.action ? 0.85 : 1}
        onPress={() => {
          if (item.action) {
            navigation.navigate("DevisReceived", { devisId: item.action });
          }
        }}
      >
        {/* Unread dot */}
        {!item.read && (
          <View
            style={[styles.unreadDot, { backgroundColor: config.accent }]}
          />
        )}

        <View style={styles.notifRow}>
          {/* Icon circle */}
          <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
            <Text style={styles.iconEmoji}>{config.iconEmoji}</Text>
          </View>

          <View style={styles.notifContent}>
            {/* Title */}
            <Text style={styles.notifTitle}>{item.title}</Text>

            {/* Message */}
            <Text style={styles.notifMessage}>{item.message}</Text>

            {/* Time + action */}
            <View style={styles.notifBottom}>
              <Text style={styles.notifTime}>{item.time}</Text>
              {item.action && (
                <Text style={styles.notifAction}>Voir le devis →</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Tout marquer comme lu</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* ━━━━━━━━━━ STYLES ━━━━━━━━━━ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
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

  /* List */
  list: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Card */
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
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: { fontSize: 18 },
  notifContent: { flex: 1 },
  notifTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 4,
  },
  notifMessage: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12.5,
    color: "#4A5568",
    lineHeight: 19,
    marginBottom: 6,
  },
  notifBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notifTime: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
    color: Colors.textMuted,
  },
  notifAction: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.forest,
  },
});
