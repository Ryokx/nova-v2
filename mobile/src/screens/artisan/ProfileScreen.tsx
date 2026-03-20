import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar, Badge } from "../../components/ui";
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
  ape: "4322A \— Plomberie",
};

const certifications = [
  { label: "Assurance d\écennale", value: "AXA Pro \— D\écennale n\°PLB-2024-8901", valid: true },
  { label: "Certification RGE", value: "QualiPAC \— Exp. 12/2027", valid: true },
];

interface MenuRow {
  icon: string;
  label: string;
  sub: string;
  screen?: string;
  danger?: boolean;
}

const menuRows: MenuRow[] = [
  { icon: "\�\�", label: "Paiements", sub: "Historique et virements", screen: "ArtisanPayments" },
  { icon: "\�\�", label: "Documents", sub: "Devis et factures", screen: "ArtisanDocuments" },
  { icon: "\�\�", label: "Comptabilit\é", sub: "Connexion Pennylane, Indy, export auto", screen: "Accounting" },
  { icon: "\�\�", label: "Clients", sub: "Carnet d'adresses et historique", screen: "ClientDirectory" },
  { icon: "\�\�", label: "QR code", sub: "\À partager sur v\éhicule, cartes, devis", screen: "QRCodeProfile" },
  { icon: "\�\�", label: "Inviter un artisan (20\€)", sub: "Gagnez 20\€ par parrainage", screen: "Referral" },
  { icon: "\⚙\️", label: "Param\ètres", sub: "Compte et s\écurit\é", screen: "Settings" },
  { icon: "\�\�", label: "Support", sub: "Par chat ou email", screen: "Support" },
];

type EditSection = "personal" | "company" | "certifs" | null;

export function ArtisanProfileScreen({
  navigation,
}: ArtisanTabScreenProps<"ArtisanProfile">) {
  const [editSection, setEditSection] = useState<EditSection>(null);

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
        <Text style={styles.fieldValue}>{value}</Text>
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
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <TouchableOpacity
        onPress={() => setEditSection(editSection === section ? null : section)}
        style={styles.editBtn}
      >
        <Text style={styles.editBtnText}>
          {editSection === section ? "Termin\é" : "\✏\️ Modifier"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon profil</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Avatar name={profile.name} size={72} radius={24} />
            <View style={styles.shieldBadge}>
              <Text style={styles.shieldEmoji}>{"\�\�\️"}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileSub}>
            Artisan Certifi\é Nova \• {profile.certifId}
          </Text>
          <Badge label="Certifi\é Nova" variant="certified" size="md" />
        </View>

        {/* Personal info */}
        <View style={styles.card}>
          <SectionHeader title="Informations personnelles" section="personal" />
          <EditableField label="Nom complet" value={profile.name} section="personal" />
          <EditableField label="Email" value={profile.email} section="personal" />
          <EditableField label="T\él\éphone" value={profile.phone} section="personal" />
        </View>

        {/* Company info */}
        <View style={styles.card}>
          <SectionHeader title="Informations entreprise" section="company" />
          <EditableField label="Raison sociale" value={company.name} section="company" />
          <EditableField label="SIRET" value={company.siret} section="company" />
          <EditableField label="N\° TVA intracommunautaire" value={company.tva} section="company" />
          <EditableField label="Code APE / Activit\é" value={company.ape} section="company" />
          <EditableField label="Adresse du si\ège" value={company.address} section="company" />
        </View>

        {/* Certifications */}
        <View style={styles.card}>
          <SectionHeader title="Assurances et certifications" section="certifs" />
          {certifications.map((c, i) => (
            <EditableField key={i} label={c.label} value={c.value} section="certifs" />
          ))}
          <TouchableOpacity style={styles.addDocBtn}>
            <Text style={styles.addDocText}>+ Ajouter un document</Text>
          </TouchableOpacity>
        </View>

        {/* Menu rows */}
        <View style={styles.card}>
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
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Text style={styles.menuChevron}>{"\›"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.logoutRow} onPress={() => (navigation as any).reset({ index: 0, routes: [{ name: "Auth" }] })}>
            <View style={styles.logoutIconWrap}>
              <Text style={styles.logoutIcon}>{"\�\�"}</Text>
            </View>
            <Text style={styles.logoutText}>Se d\éconnecter</Text>
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
  avatarWrap: { position: "relative", marginBottom: 12 },
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
});
