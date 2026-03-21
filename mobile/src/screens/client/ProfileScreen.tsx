import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { useTheme } from "../../hooks/useTheme";
import { ConfirmModal } from "../../components/ui";
import type { ClientTabScreenProps } from "../../navigation/types";

/* ── Profile data ── */
const defaultProfile = {
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

interface ActiveContract {
  id: string;
  name: string;
  icon: string;
  price: string;
  artisan: string;
  since: string;
  freq: string;
}

const initialContracts: ActiveContract[] = [
  { id: "1", name: "Entretien chaudière", icon: "fire", price: "120€", artisan: "Jean-Michel P.", since: "20 mars 2026", freq: "1 visite / an" },
];

export function ClientProfileScreen({
  navigation,
}: ClientTabScreenProps<"ClientProfile">) {
  const { c } = useTheme();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profile, setProfile] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(defaultProfile);
  const [contracts, setContracts] = useState(initialContracts);
  const [modal, setModal] = useState({ visible: false, type: "info" as const, title: "", message: "", actions: [] as any[] });

  const pickProfilePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const startEditing = () => {
    setEditForm({ ...profile });
    setEditing(true);
  };

  const saveProfile = () => {
    setProfile({ ...editForm });
    setEditing(false);
    setModal({ visible: true, type: "success", title: "Profil mis à jour", message: "Vos coordonnées ont été enregistrées.", actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }] });
  };

  const cancelContract = (id: string) => {
    const contract = contracts.find((c) => c.id === id);
    setModal({
      visible: true,
      type: "danger",
      title: "Annuler le contrat",
      message: `Êtes-vous sûr de vouloir annuler le contrat « ${contract?.name} » ?\n\nSans engagement — aucun frais d'annulation.`,
      actions: [
        { label: "Non, garder", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
        {
          label: "Oui, annuler",
          variant: "danger",
          onPress: () => {
            setContracts((prev) => prev.filter((c) => c.id !== id));
            setModal({
              visible: true,
              type: "success",
              title: "Contrat annulé",
              message: "Le contrat a été annulé avec succès. Aucun prélèvement futur ne sera effectué.",
              actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }],
            });
          },
        },
      ],
    });
  };

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
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: c.text }]}>Mon profil</Text>
        </View>

        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          {/* Subtle curved gradient background */}
          <View style={styles.avatarBgGradient} />
          <TouchableOpacity style={styles.avatarWrap} onPress={pickProfilePhoto} activeOpacity={0.85}>
            <View style={styles.avatarGoldRing}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarInitials}>{profile.initials}</Text>
                </View>
              )}
            </View>
            <View style={styles.avatarCameraBadge}>
              <MaterialCommunityIcons name="camera" size={12} color={Colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileName, { color: c.text }]}>{profile.name}</Text>
          <Text style={styles.profileType}>Compte particulier</Text>
        </View>

        {/* Personal info card */}
        <View style={[styles.infoCard, { backgroundColor: c.card }]}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderTitle}>Informations personnelles</Text>
            <TouchableOpacity onPress={editing ? saveProfile : startEditing}>
              <Text style={styles.editBtn}>{editing ? "Enregistrer" : "Modifier"}</Text>
            </TouchableOpacity>
          </View>

          {editing ? (
            <View style={styles.editForm}>
              {[
                { label: "Nom complet", key: "name" as const },
                { label: "Email", key: "email" as const, keyboard: "email-address" as const },
                { label: "Téléphone", key: "phone" as const, keyboard: "phone-pad" as const },
                { label: "Adresse", key: "address" as const },
              ].map((field) => (
                <View key={field.key} style={styles.editField}>
                  <Text style={styles.editFieldLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.editFieldInput}
                    value={editForm[field.key]}
                    onChangeText={(text) => setEditForm((prev) => ({ ...prev, [field.key]: text }))}
                    keyboardType={field.keyboard || "default"}
                    autoCapitalize={field.key === "email" ? "none" : "sentences"}
                  />
                </View>
              ))}
              <TouchableOpacity style={styles.cancelEditBtn} onPress={() => setEditing(false)}>
                <Text style={styles.cancelEditText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {[
                ["Nom complet", profile.name],
                ["Email", profile.email],
                ["Téléphone", profile.phone],
                ["Adresse", profile.address],
              ].map(([label, value], i, arr) => (
                <View
                  key={label}
                  style={[styles.infoRow, i < arr.length - 1 && styles.infoRowBorder]}
                >
                  <Text style={styles.infoLabel}>{label}</Text>
                  <Text style={[styles.infoValue, { color: c.text }]}>{value}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Active contracts */}
        {contracts.length > 0 && (
          <View style={[styles.contractsCard, { backgroundColor: c.card }]}>
            <View style={styles.contractsHeader}>
              <MaterialCommunityIcons name="file-document-check" size={16} color={Colors.forest} />
              <Text style={styles.contractsTitle}>Contrats actifs</Text>
            </View>
            {contracts.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.contractRow, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.surface }]}
                activeOpacity={0.85}
                onPress={() => (navigation as any).navigate("ContractDetail", {
                  contractId: c.id, name: c.name, icon: c.icon,
                  price: c.price, artisan: c.artisan, since: c.since, freq: c.freq,
                })}
              >
                <View style={styles.contractIconWrap}>
                  <MaterialCommunityIcons name={c.icon as any} size={16} color={Colors.forest} />
                </View>
                <View style={styles.contractInfo}>
                  <Text style={styles.contractName}>{c.name}</Text>
                  <Text style={styles.contractMeta}>{c.artisan} • {c.price}/an</Text>
                  <Text style={styles.contractSince}>Depuis le {c.since}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
            <View style={styles.contractFooter}>
              <MaterialCommunityIcons name="shield-check" size={12} color={Colors.forest} />
              <Text style={styles.contractFooterText}>Sans engagement — annulable à tout moment</Text>
            </View>
          </View>
        )}

        {/* Menu card */}
        <View style={[styles.menuCard, { backgroundColor: c.card }]}>
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
                <Text style={[styles.menuLabel, { color: c.text }]}>{item.label}</Text>
                {item.value && (
                  <Text style={styles.menuValue}>{item.value}</Text>
                )}
              </View>
              <Text style={styles.chevron}>{"›"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger card */}
        <View style={[styles.menuCard, { backgroundColor: c.card }]}>
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

      <ConfirmModal
        visible={modal.visible}
        onClose={() => setModal(m => ({ ...m, visible: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
      />
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
    position: "relative",
  },
  avatarBgGradient: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: Colors.deepForest,
    opacity: 0.03,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 12,
  },
  avatarGoldRing: {
    borderWidth: 3,
    borderColor: Colors.gold,
    borderRadius: 27,
    padding: 0,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.forest,
    ...Shadows.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 24,
    ...Shadows.md,
  },
  avatarCameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarInitials: {
    fontFamily: "Manrope_700Bold",
    fontSize: 24,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoHeaderTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  editBtn: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.forest,
  },
  editForm: { paddingTop: 8 },
  editField: { marginBottom: 12 },
  editFieldLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textHint,
    marginBottom: 4,
  },
  editFieldInput: {
    height: 44,
    backgroundColor: Colors.bgPage,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.navy,
  },
  cancelEditBtn: { alignItems: "center", paddingVertical: 8 },
  cancelEditText: { fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.textMuted },
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

  /* Contracts */
  contractsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.12)",
  },
  contractsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  contractsTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  contractRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  contractIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  contractInfo: { flex: 1 },
  contractName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },
  contractMeta: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  contractSince: {
    fontFamily: "DMMono_500Medium",
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  contractCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(232,48,42,0.06)",
  },
  contractCancelText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: Colors.red,
  },
  contractFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  contractFooterText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.forest,
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
