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
import type { ClientTabScreenProps } from "../../navigation/types";

/* ── Profile data ── */
const profile = {
  name: "Sophie Lefèvre",
  initials: "SL",
  email: "sophie.lefevre@email.com",
  phone: "06 12 34 56 78",
  address: "12 rue de Rivoli, 75004 Paris",
};

/* ── Menu items ── */
interface MenuItem {
  icon: string;
  label: string;
  value?: string;
  danger?: boolean;
  screen?: string;
}

const menuItems: MenuItem[] = [
  { icon: "credit-card", label: "Moyens de paiement", value: "Visa •••• 6411", screen: "PaymentMethods" },
  { icon: "lock", label: "Séquestre", value: "1 carte enregistrée", screen: "PaymentMethods" },
  { icon: "briefcase", label: "Missions", value: "3 missions réalisées", screen: "ClientMissions" },
  { icon: "bell", label: "Notifications", screen: "NotificationPreferences" },
  { icon: "cog", label: "Paramètres", screen: "Settings" },
  { icon: "help-circle", label: "Support", value: "Par chat ou email", screen: "Support" },
  { icon: "gift", label: "Inviter des proches", value: "Gagnez 20€ par parrainage", screen: "Referral" },
];

const dangerItem: MenuItem = {
  icon: "logout",
  label: "Déconnexion",
  danger: true,
};

export function ClientProfileScreen({
  navigation,
}: ClientTabScreenProps<"ClientProfile">) {
  const handleMenuPress = (item: MenuItem) => {
    if (item.danger) {
      navigation.reset({ index: 0, routes: [{ name: "Auth" as any }] });
      return;
    }
    if (item.screen) {
      navigation.navigate(item.screen as any);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon profil</Text>
        </View>

        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{profile.initials}</Text>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileType}>Compte particulier</Text>
        </View>

        {/* Personal info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderTitle}>
              Informations personnelles
            </Text>
          </View>
          {[
            ["Nom complet", profile.name],
            ["Email", profile.email],
            ["Téléphone", profile.phone],
            ["Adresse", profile.address],
          ].map(([label, value], i, arr) => (
            <View
              key={label}
              style={[
                styles.infoRow,
                i < arr.length - 1 && styles.infoRowBorder,
              ]}
            >
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Menu card */}
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuRow,
                i < menuItems.length - 1 && styles.menuRowBorder,
              ]}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuIconWrap}>
                <MaterialCommunityIcons name={item.icon as any} size={16} color={Colors.forest} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.value && (
                  <Text style={styles.menuValue}>{item.value}</Text>
                )}
              </View>
              <Text style={styles.chevron}>{"›"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger card */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => handleMenuPress(dangerItem)}
          >
            <View style={[styles.menuIconWrap, styles.menuIconDanger]}>
              <MaterialCommunityIcons name={dangerItem.icon as any} size={16} color={Colors.red} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, styles.menuLabelDanger]}>
                {dangerItem.label}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ━━━━━━━━━━ STYLES ━━━━━━━━━━ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
  },

  /* Avatar section */
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: Colors.forest,
    ...Shadows.md,
  },
  avatarInitials: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    color: Colors.white,
  },
  profileName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: Colors.navy,
  },
  profileType: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    marginTop: 2,
  },

  /* Info card */
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  infoHeader: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  infoHeaderTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  infoRow: { paddingVertical: 12 },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  infoLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textHint,
    marginBottom: 3,
  },
  infoValue: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.navy,
  },

  /* Menu card */
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    backgroundColor: "rgba(27,107,78,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: {
    backgroundColor: "rgba(232,48,42,0.06)",
  },
  menuIcon: { fontSize: 16 },
  menuContent: { flex: 1 },
  menuLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.navy,
  },
  menuLabelDanger: { color: Colors.red },
  menuValue: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
    marginTop: 1,
  },
  chevron: {
    fontSize: 18,
    color: Colors.textMuted,
  },
});
