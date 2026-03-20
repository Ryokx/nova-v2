import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

/* ── Language options ── */
const LANGUAGES = [
  { code: "FR", label: "Francais" },
  { code: "EN", label: "English" },
  { code: "ES", label: "Espanol" },
];

/* ── Legal texts (mock) ── */
const LEGAL_TEXTS: Record<string, { title: string; body: string }> = {
  cgu: {
    title: "Conditions Generales d'Utilisation",
    body: "Les presentes conditions generales d'utilisation (CGU) regissent l'acces et l'utilisation de la plateforme Nova. En accedant a la plateforme, vous acceptez sans reserve l'ensemble de ces conditions.\n\n1. Objet\nNova est une plateforme de mise en relation entre particuliers et artisans certifies. Elle propose un service de paiement par sequestre garantissant la securite des transactions.\n\n2. Inscription\nL'inscription est gratuite et ouverte a toute personne majeure. Les artisans doivent fournir les documents obligatoires : SIRET, assurance decennale et piece d'identite.\n\n3. Sequestre\nLe client paie 100% du montant du devis a la signature. Les fonds sont bloques en sequestre jusqu'a validation de l'intervention par le client. Une commission de 5% est prelevee sur chaque transaction.\n\n4. Responsabilites\nNova agit en tant qu'intermediaire et ne se substitue pas aux obligations respectives des parties. Les artisans restent seuls responsables de la qualite de leurs prestations.\n\n5. Donnees personnelles\nLes donnees sont traitees conformement a notre politique de confidentialite et au RGPD.",
  },
  confidentialite: {
    title: "Politique de Confidentialite",
    body: "Nova s'engage a proteger la vie privee de ses utilisateurs conformement au Reglement General sur la Protection des Donnees (RGPD).\n\n1. Donnees collectees\nNous collectons les donnees necessaires au fonctionnement du service : identite, coordonnees, documents professionnels (artisans), historique de transactions.\n\n2. Finalites\nLes donnees sont utilisees pour la mise en relation, la gestion des paiements par sequestre, les communications de service et l'amelioration de la plateforme.\n\n3. Conservation\nLes donnees sont conservees pendant la duree de votre compte et jusqu'a 5 ans apres sa suppression pour les obligations legales.\n\n4. Droits\nVous disposez des droits d'acces, de rectification, de suppression, de portabilite et d'opposition. Contactez support@nova.fr pour exercer vos droits.\n\n5. Securite\nNova utilise le chiffrement SSL/TLS, le sequestre bancaire securise et l'authentification a deux facteurs pour proteger vos donnees.",
  },
  mentions: {
    title: "Mentions Legales",
    body: "Editeur\nNova SAS\nCapital social : 50 000 EUR\nSiret : 123 456 789 00012\nSiege social : 42 rue de la Tech, 75008 Paris\n\nDirecteur de publication\nEmmanuel A. — Fondateur & CEO\n\nHebergement\nVercel Inc.\n340 S Lemon Ave #4133\nWalnut, CA 91789, USA\n\nContact\nsupport@nova.fr\n01 23 45 67 89",
  },
};

/* ── Setting row component ── */
function SettingRow({
  icon,
  label,
  right,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress && !right}
    >
      <View style={styles.settingRowLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text
          style={[styles.settingLabel, danger && styles.settingLabelDanger]}
        >
          {label}
        </Text>
      </View>
      {right || (
        <Text style={styles.chevron}>{"\u203A"}</Text>
      )}
    </TouchableOpacity>
  );
}

/* ── Section card ── */
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function SettingsScreen({
  navigation,
}: RootStackScreenProps<"Settings">) {
  /* state */
  const [darkMode, setDarkMode] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [language, setLanguage] = useState("FR");

  /* modals */
  const [passwordModal, setPasswordModal] = useState(false);
  const [legalModal, setLegalModal] = useState<string | null>(null);
  const [langModal, setLangModal] = useState(false);

  /* password fields */
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handlePasswordSave = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPwd.length < 8) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }
    Alert.alert("Succes", "Votre mot de passe a ete mis a jour.");
    setPasswordModal(false);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  const handleLogout = () => {
    Alert.alert("Deconnexion", "Voulez-vous vraiment vous deconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Deconnexion",
        style: "destructive",
        onPress: () => navigation.reset({ index: 0, routes: [{ name: "Auth" }] }),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer mon compte",
      "Cette action est irreversible. Toutes vos donnees seront supprimees definitivement.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirmation finale",
              "Etes-vous absolument certain(e) ? Tapez 'SUPPRIMER' pour confirmer.",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Confirmer",
                  style: "destructive",
                  onPress: () =>
                    navigation.reset({ index: 0, routes: [{ name: "Auth" }] }),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const currentLegal = legalModal ? LEGAL_TEXTS[legalModal] : null;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parametres</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Apparence */}
        <SectionCard title="Apparence">
          <SettingRow
            icon={"\uD83C\uDF19"}
            label="Mode sombre"
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.border, true: Colors.forest }}
                thumbColor={Colors.white}
              />
            }
          />
        </SectionCard>

        {/* Securite */}
        <SectionCard title="Securite">
          <SettingRow
            icon={"\uD83D\uDD12"}
            label="Mot de passe"
            onPress={() => setPasswordModal(true)}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon={"\uD83D\uDEE1\uFE0F"}
            label="Authentification 2FA"
            right={
              <Switch
                value={twoFA}
                onValueChange={setTwoFA}
                trackColor={{ false: Colors.border, true: Colors.forest }}
                thumbColor={Colors.white}
              />
            }
          />
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences">
          <SettingRow
            icon={"\uD83C\uDF10"}
            label="Langue"
            right={
              <TouchableOpacity
                style={styles.langSelector}
                onPress={() => setLangModal(true)}
              >
                <Text style={styles.langText}>{language}</Text>
                <Text style={styles.chevronSmall}>{"\u203A"}</Text>
              </TouchableOpacity>
            }
            onPress={() => setLangModal(true)}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon={"\uD83D\uDD52"}
            label="Fuseau horaire"
            right={
              <Text style={styles.valueText}>Europe/Paris (UTC+1)</Text>
            }
          />
        </SectionCard>

        {/* Legal */}
        <SectionCard title="Legal">
          <SettingRow
            icon={"\uD83D\uDCC4"}
            label="Conditions Generales d'Utilisation"
            onPress={() => setLegalModal("cgu")}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon={"\uD83D\uDD10"}
            label="Politique de Confidentialite"
            onPress={() => setLegalModal("confidentialite")}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon={"\u2696\uFE0F"}
            label="Mentions Legales"
            onPress={() => setLegalModal("mentions")}
          />
        </SectionCard>

        {/* Danger zone */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Zone de danger</Text>
          <SettingRow
            icon={"\uD83D\uDEAA"}
            label="Deconnexion"
            onPress={handleLogout}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon={"\u26A0\uFE0F"}
            label="Supprimer mon compte"
            onPress={handleDeleteAccount}
            danger
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Password Modal ── */}
      <Modal
        visible={passwordModal}
        animationType="slide"
        transparent
        onRequestClose={() => setPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le mot de passe</Text>
              <TouchableOpacity onPress={() => setPasswordModal(false)}>
                <Text style={styles.modalClose}>{"\u2715"}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Mot de passe actuel</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPwd}
              onChangeText={setCurrentPwd}
              placeholder="Entrez votre mot de passe actuel"
              placeholderTextColor={Colors.textHint}
            />

            <Text style={styles.fieldLabel}>Nouveau mot de passe</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPwd}
              onChangeText={setNewPwd}
              placeholder="Minimum 8 caracteres"
              placeholderTextColor={Colors.textHint}
            />

            <Text style={styles.fieldLabel}>Confirmer le mot de passe</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPwd}
              onChangeText={setConfirmPwd}
              placeholder="Confirmez le nouveau mot de passe"
              placeholderTextColor={Colors.textHint}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handlePasswordSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Legal Modal ── */}
      <Modal
        visible={!!legalModal}
        animationType="slide"
        transparent
        onRequestClose={() => setLegalModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.legalModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {currentLegal?.title}
              </Text>
              <TouchableOpacity onPress={() => setLegalModal(null)}>
                <Text style={styles.modalClose}>{"\u2715"}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.legalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.legalBody}>{currentLegal?.body}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Language Modal ── */}
      <Modal
        visible={langModal}
        animationType="fade"
        transparent
        onRequestClose={() => setLangModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLangModal(false)}
        >
          <View style={styles.langModalContent}>
            <Text style={styles.langModalTitle}>Choisir la langue</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  language === lang.code && styles.langOptionActive,
                ]}
                onPress={() => {
                  setLanguage(lang.code);
                  setLangModal(false);
                }}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    language === lang.code && styles.langOptionTextActive,
                  ]}
                >
                  {lang.label}
                </Text>
                {language === lang.code && (
                  <Text style={styles.langCheck}>{"\u2713"}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.text,
    marginTop: -2,
  },
  headerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },

  /* Section card */
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  /* Setting row */
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  settingRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  settingLabelDanger: {
    color: Colors.red,
    fontFamily: "DMSans_600SemiBold",
  },
  chevron: {
    fontSize: 22,
    color: Colors.textHint,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
    marginLeft: 34,
  },

  /* Language selector */
  langSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.sm,
  },
  langText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.forest,
    marginRight: 4,
  },
  chevronSmall: {
    fontSize: 16,
    color: Colors.forest,
  },
  valueText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },

  /* Danger zone */
  dangerCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: "#FDDCDB",
    ...Shadows.sm,
  },
  dangerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.red,
    marginBottom: Spacing.md,
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10,22,40,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radii["3xl"],
    borderTopRightRadius: Radii["3xl"],
    padding: Spacing["2xl"],
    paddingBottom: Platform.OS === "ios" ? 40 : Spacing["2xl"],
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.md,
  },
  modalClose: {
    fontSize: 18,
    color: Colors.textSecondary,
    padding: 4,
  },
  fieldLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.bgPage,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.deepForest,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    marginTop: Spacing["2xl"],
  },
  saveBtnText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: Colors.white,
  },

  /* Legal modal */
  legalModalContent: {
    maxHeight: "80%",
  },
  legalScroll: {
    flex: 1,
  },
  legalBody: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },

  /* Language modal */
  langModalContent: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: Spacing["2xl"],
    marginHorizontal: Spacing["3xl"],
    marginBottom: "auto",
    marginTop: "auto",
  },
  langModalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    marginBottom: Spacing.xs,
  },
  langOptionActive: {
    backgroundColor: Colors.surface,
  },
  langOptionText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: Colors.text,
  },
  langOptionTextActive: {
    color: Colors.forest,
    fontFamily: "DMSans_600SemiBold",
  },
  langCheck: {
    fontSize: 16,
    color: Colors.forest,
    fontWeight: "700",
  },
});
