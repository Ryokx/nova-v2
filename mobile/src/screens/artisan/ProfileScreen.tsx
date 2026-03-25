import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar, Badge } from "../../components/ui";
import { getAvatarUri } from "../../constants/avatars";
import { useTheme } from "../../hooks/useTheme";
import type { ArtisanTabScreenProps } from "../../navigation/types";

const profile = {
  name: "Jean-Michel Petit",
  initials: "JM",
  email: "jm.petit@plomberie-pro.fr",
  phone: "06 98 76 54 32",
  certifId: "#2847",
};

const company = {
  name: "JM Plomberie Pro",
  siret: "123 456 789 00012",
  tva: "FR 12 123456789",
  address: "8 rue des Artisans, 75011 Paris",
  ape: "4322A — Plomberie",
};

const certifications = [
  { label: "Assurance décennale", value: "AXA Pro — Décennale n°PLB-2024-8901", valid: true },
  { label: "Certification RGE", value: "QualiPAC — Exp. 12/2027", valid: true },
];

interface MenuRow {
  icon: string;
  label: string;
  sub: string;
  screen?: string;
  danger?: boolean;
}

const menuRows: MenuRow[] = [
  { icon: "star-circle", label: "Mon abonnement", sub: "Forfait Pro • gérer ou changer", screen: "Subscription" },
  { icon: "currency-eur", label: "Mes tarifs", sub: "Déplacement, devis, urgences", screen: "ArtisanPricing" },
  { icon: "cash", label: "Paiements", sub: "Historique et virements", screen: "ArtisanPayments" },
  { icon: "file-document", label: "Documents", sub: "Devis et factures", screen: "ArtisanDocuments" },
  { icon: "chart-bar", label: "Comptabilité", sub: "Connexion Pennylane, Indy, export auto", screen: "Accounting" },
  { icon: "account-group", label: "Clients", sub: "Carnet d'adresses et historique", screen: "ClientDirectory" },
  { icon: "qrcode", label: "QR code", sub: "À partager sur véhicule, cartes, devis", screen: "QRCodeProfile" },
  { icon: "gift", label: "Inviter un artisan (20€)", sub: "Gagnez 20€ par parrainage", screen: "Referral" },
  { icon: "cog", label: "Paramètres", sub: "Compte et sécurité", screen: "Settings" },
  { icon: "help-circle", label: "Support", sub: "Par chat ou email", screen: "Support" },
];

type EditSection = "personal" | "company" | "certifs" | null;

export function ArtisanProfileScreen({
  navigation,
}: ArtisanTabScreenProps<"ArtisanProfile">) {
  const { c } = useTheme();
  const [editSection, setEditSection] = useState<EditSection>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [instantPayAuto, setInstantPayAuto] = useState(false);

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

  const EditableField = ({
    label,
    value,
    section,
  }: {
    label: string;
    value: string;
    section: EditSection;
  }) => (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editSection === section ? (
        <TextInput
          defaultValue={value}
          style={styles.fieldInput}
          placeholderTextColor={Colors.textHint}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: c.text }]}>{value}</Text>
      )}
    </View>
  );

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: EditSection;
  }) => (
    <View style={styles.sectionHeaderRow}>
      <Text style={[styles.sectionHeaderTitle, { color: c.text }]}>{title}</Text>
      <TouchableOpacity
        onPress={() => setEditSection(editSection === section ? null : section)}
        style={styles.editBtn}
      >
        <Text style={styles.editBtnText}>
          {editSection === section ? "Terminé" : "Modifier"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: c.text }]}>Mon profil</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrap} onPress={pickProfilePhoto} activeOpacity={0.8}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <Avatar name={profile.name} size={72} radius={24} uri={getAvatarUri(profile.name)} />
            )}
            <View style={styles.shieldBadge}>
              <Text style={styles.shieldEmoji}><MaterialCommunityIcons name="shield-check" size={20} color={Colors.forest} /></Text>
            </View>
            <View style={styles.cameraBadge}>
              <MaterialCommunityIcons name="camera" size={12} color={Colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileName, { color: c.text }]}>{profile.name}</Text>
          <Text style={styles.profileSub}>
            Artisan Certifié Nova • {profile.certifId}
          </Text>
          <Badge label="Certifié Nova" variant="certified" size="md" />
        </View>

        {/* Personal info */}
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <SectionHeader title="Informations personnelles" section="personal" />
          <EditableField label="Nom complet" value={profile.name} section="personal" />
          <EditableField label="Email" value={profile.email} section="personal" />
          <EditableField label="Téléphone" value={profile.phone} section="personal" />
        </View>

        {/* Company info */}
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <SectionHeader title="Informations entreprise" section="company" />
          <EditableField label="Raison sociale" value={company.name} section="company" />
          <EditableField label="SIRET" value={company.siret} section="company" />
          <EditableField label="N° TVA intracommunautaire" value={company.tva} section="company" />
          <EditableField label="Code APE / Activité" value={company.ape} section="company" />
          <EditableField label="Adresse du siège" value={company.address} section="company" />
        </View>

        {/* Certifications */}
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <SectionHeader title="Assurances et certifications" section="certifs" />
          {certifications.map((c, i) => (
            <EditableField key={i} label={c.label} value={c.value} section="certifs" />
          ))}
          <TouchableOpacity style={styles.addDocBtn}>
            <Text style={styles.addDocText}>+ Ajouter un document</Text>
          </TouchableOpacity>
        </View>

        {/* Instant Pay */}
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeaderTitle, { color: c.text }]}>Instant Pay</Text>
          </View>
          <View style={styles.instantPayRow}>
            <View style={styles.instantPayIconWrap}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.instantPayLabel, { color: c.text }]}>Virement instantané automatique</Text>
              <Text style={styles.instantPayDesc}>
                {instantPayAuto
                  ? "Chaque paiement débloqué est viré instantanément (4% de frais)"
                  : "Activez pour recevoir tous vos paiements en quelques secondes"}
              </Text>
            </View>
            <Switch
              value={instantPayAuto}
              onValueChange={setInstantPayAuto}
              trackColor={{ false: Colors.border, true: Colors.forest }}
              thumbColor={Colors.white}
            />
          </View>
          {instantPayAuto && (
            <View style={styles.instantPayInfo}>
              <MaterialCommunityIcons name="information-outline" size={13} color={Colors.forest} />
              <Text style={styles.instantPayInfoText}>
                4% de frais seront appliqués automatiquement sur chaque paiement. Vous pouvez désactiver cette option à tout moment.
              </Text>
            </View>
          )}
        </View>

        {/* Menu rows */}
        <View style={[styles.card, { backgroundColor: c.card }]}>
          {menuRows.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuRow,
                i < menuRows.length - 1 && styles.menuRowBorder,
              ]}
              onPress={() => {
                if (item.screen) {
                  (navigation as any).navigate(item.screen);
                }
              }}
            >
              <View style={styles.menuIconWrap}>
                <MaterialCommunityIcons name={item.icon as any} size={16} color={Colors.forest} />
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuLabel, { color: c.text }]}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Text style={styles.menuChevron}>{"›"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <TouchableOpacity style={styles.logoutRow} onPress={() => (navigation as any).reset({ index: 0, routes: [{ name: "Auth" }] })}>
            <View style={styles.logoutIconWrap}>
              <Text style={styles.logoutIcon}><MaterialCommunityIcons name="logout" size={20} color={Colors.red} /></Text>
            </View>
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Avatar section */
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatarWrap: { position: "relative", marginBottom: 12, width: 72, height: 72 },
  avatarImage: { width: 72, height: 72, borderRadius: 24 },
  cameraBadge: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.deepForest,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF3DC",
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldEmoji: { fontSize: 14 },
  profileName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: Colors.navy,
    marginBottom: 2,
  },
  profileSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 8,
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },

  /* Section header */
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  sectionHeaderTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  editBtn: {
    backgroundColor: "rgba(27,107,78,0.06)",
    borderRadius: Radii.xs,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.forest,
  },

  /* Field */
  fieldRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  fieldLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textHint,
    marginBottom: 3,
  },
  fieldValue: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.navy,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.text,
    backgroundColor: Colors.bgPage,
  },

  /* Add doc */
  addDocBtn: {
    paddingVertical: 12,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.3)",
    alignItems: "center",
    marginVertical: 12,
  },
  addDocText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.forest,
  },

  /* Menu rows */
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(27,107,78,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: { fontSize: 16 },
  menuContent: { flex: 1 },
  menuLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.navy,
  },
  menuSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  menuChevron: {
    fontSize: 14,
    color: Colors.textMuted,
  },

  /* Logout */
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  logoutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(232,48,42,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: { fontSize: 16 },
  logoutText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.red,
  },

  /* Instant Pay */
  instantPayRow: {
    flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6,
  },
  instantPayIconWrap: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: Colors.forest, alignItems: "center", justifyContent: "center",
  },
  instantPayLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  instantPayDesc: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  instantPayInfo: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 10,
    padding: 10, marginTop: 10,
  },
  instantPayInfoText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: "#14523B", flex: 1, lineHeight: 16 },
});
