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
import { useTheme } from "../../hooks/useTheme";
import type { RootStackScreenProps } from "../../navigation/types";

/* ── Language options ── */
const LANGUAGES = [
  { code: "FR", label: "Français" },
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
];

/* ── Legal texts (mock) ── */
const LEGAL_TEXTS: Record<string, { title: string; body: string }> = {
  cgu: {
    title: "Conditions Générales d'Utilisation",
    body: "Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Nova. En accédant à la plateforme, vous acceptez sans réserve l'ensemble de ces conditions.\n\n1. Objet\nNova est une plateforme de mise en relation entre particuliers et artisans certifiés. Elle propose un service de paiement par séquestre garantissant la sécurité des transactions.\n\n2. Inscription\nL'inscription est gratuite et ouverte à toute personne majeure. Les artisans doivent fournir les documents obligatoires : SIRET, assurance décennale et pièce d'identité.\n\n3. Séquestre\nLe client paie 100% du montant du devis à la signature. Les fonds sont bloqués en séquestre jusqu'à validation de l'intervention par le client. Une commission de 5% est prélevée sur chaque transaction.\n\n4. Responsabilités\nNova agit en tant qu'intermédiaire et ne se substitue pas aux obligations respectives des parties. Les artisans restent seuls responsables de la qualité de leurs prestations.\n\n5. Données personnelles\nLes données sont traitées conformément à notre politique de confidentialité et au RGPD.",
  },
  confidentialite: {
    title: "Politique de Confidentialité",
    body: "Nova s'engage à protéger la vie privée de ses utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD).\n\n1. Données collectées\nNous collectons les données nécessaires au fonctionnement du service : identité, coordonnées, documents professionnels (artisans), historique de transactions.\n\n2. Finalités\nLes données sont utilisées pour la mise en relation, la gestion des paiements par séquestre, les communications de service et l'amélioration de la plateforme.\n\n3. Conservation\nLes données sont conservées pendant la durée de votre compte et jusqu'à 5 ans après sa suppression pour les obligations légales.\n\n4. Droits\nVous disposez des droits d'accès, de rectification, de suppression, de portabilité et d'opposition. Contactez support@nova.fr pour exercer vos droits.\n\n5. Sécurité\nNova utilise le chiffrement SSL/TLS, le séquestre bancaire sécurisé et l'authentification à deux facteurs pour protéger vos données.",
  },
  mentions: {
    title: "Mentions Légales",
    body: "Éditeur\nNova SAS\nCapital social : 50 000 EUR\nSiret : 123 456 789 00012\nSiège social : 42 rue de la Tech, 75008 Paris\n\nDirecteur de publication\nEmmanuel A. — Fondateur & CEO\n\nHébergement\nVercel Inc.\n340 S Lemon Ave #4133\nWalnut, CA 91789, USA\n\nContact\nsupport@nova.fr\n01 23 45 67 89",
  },
};

/* ── Setting row component ── */
function SettingRow({
  label,
  right,
  onPress,
  danger,
}: {
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}) {
  const { c } = useTheme();
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress && !right}
    >
      <View style={styles.settingRowLeft}>
        <Text
          style={[styles.settingLabel, { color: c.text }, danger && styles.settingLabelDanger]}
        >
          {label}
        </Text>
      </View>
      {right || (
        <Text style={[styles.chevron, { color: c.textHint }]}>{"›"}</Text>
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
  const { c } = useTheme();
  return (
    <View style={[styles.sectionCard, { backgroundColor: c.card, borderColor: c.border }]}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
      {children}
    </View>
  );
}

export function SettingsScreen({
  navigation,
}: RootStackScreenProps<"Settings">) {
  /* theme */
  const { dark: darkMode, toggleDark, c } = useTheme();
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
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    Alert.alert("Succès", "Votre mot de passe a été mis à jour.");
    setPasswordModal(false);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: () => navigation.reset({ index: 0, routes: [{ name: "Auth" }] }),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer mon compte",
      "Cette action est irréversible. Toutes vos données seront supprimées définitivement.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirmation finale",
              "Êtes-vous absolument certain(e) ? Tapez 'SUPPRIMER' pour confirmer.",
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
    <SafeAreaView style={[styles.root, { backgroundColor: c.bg }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: darkMode ? c.surface : "rgba(27,107,78,0.08)" }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backArrow, { color: darkMode ? c.text : Colors.forest }]}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.text }]}>Paramètres</Text>
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
            label="Mode sombre"
            right={
              <Switch
                value={darkMode}
                onValueChange={toggleDark}
                trackColor={{ false: Colors.border, true: Colors.forest }}
                thumbColor={Colors.white}
              />
            }
          />
        </SectionCard>

        {/* Sécurité */}
        <SectionCard title="Sécurité">
          <SettingRow
            label="Mot de passe"
            onPress={() => setPasswordModal(true)}
          />
          <View style={styles.rowDivider} />
          <SettingRow
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

        {/* Préférences */}
        <SectionCard title="Préférences">
          <SettingRow
            label="Langue"
            right={
              <TouchableOpacity
                style={styles.langSelector}
                onPress={() => setLangModal(true)}
              >
                <Text style={styles.langText}>{language}</Text>
                <Text style={styles.chevronSmall}>{"›"}</Text>
              </TouchableOpacity>
            }
            onPress={() => setLangModal(true)}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            label="Fuseau horaire"
            right={
              <Text style={styles.valueText}>Europe/Paris (UTC+1)</Text>
            }
          />
        </SectionCard>

        {/* Légal */}
        <SectionCard title="Légal">
          <SettingRow
            label="Conditions Générales d'Utilisation"
            onPress={() => setLegalModal("cgu")}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            label="Politique de Confidentialité"
            onPress={() => setLegalModal("confidentialite")}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            label="Mentions Légales"
            onPress={() => setLegalModal("mentions")}
          />
        </SectionCard>

        {/* Danger zone */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Zone de danger</Text>
          <SettingRow
            label="Déconnexion"
            onPress={handleLogout}
          />
          <View style={styles.rowDivider} />
          <SettingRow
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
                <Text style={styles.modalClose}>{"✕"}</Text>
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
              placeholder="Minimum 8 caractères"
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
                <Text style={styles.modalClose}>{"✕"}</Text>
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
                  <Text style={styles.langCheck}>{"✓"}</Text>
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
