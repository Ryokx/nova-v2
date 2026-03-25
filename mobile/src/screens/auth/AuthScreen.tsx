import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import { Button, Input } from "../../components/ui";
import { API_BASE_URL } from "../../constants/api";
import type { RootStackScreenProps } from "../../navigation/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/* ── Onboarding slides data ── */
const onboardingSlides = [
  {
    icon: "lock",
    title: "Paiement garanti par séquestre",
    description:
      "Le client paie avant l’intervention. L’argent est bloqué en séquestre jusqu’à validation.",
    accent: Colors.forest,
    bg: Colors.surface,
  },
  {
    icon: "shield-check",
    title: "Artisans certifiés",
    description:
      "Chaque artisan est vérifié : SIRET, assurance décennale, qualifications RGE. Zéro mauvaise surprise.",
    accent: Colors.gold,
    bg: "#FFF8ED",
  },
  {
    icon: "check-circle",
    title: "Zéro impayé",
    description:
      "Vous intervenez, Nova valide et vous garantit votre paiement.",
    accent: Colors.success,
    bg: "#EDFFF6",
  },
];

export function AuthScreen({ navigation }: RootStackScreenProps<"Auth">) {
  const [onboardDone, setOnboardDone] = useState(false);
  const [onboardSlide, setOnboardSlide] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"client" | "artisan">("client");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState({ code: "FR", flag: "🇫🇷", dial: "+33", placeholder: "6 12 34 56 78" });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [signupPwd, setSignupPwd] = useState("");
  const [signupConfirmPwd, setSignupConfirmPwd] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupSiret, setSignupSiret] = useState("");
  const [signupDecennale, setSignupDecennale] = useState("");
  const [signupTrade, setSignupTrade] = useState("");
  const [showTradePicker, setShowTradePicker] = useState(false);
  const [artisanStep, setArtisanStep] = useState(1);

  const trades = [
    { id: "plombier", label: "Plombier" },
    { id: "electricien", label: "Électricien" },
    { id: "serrurier", label: "Serrurier" },
    { id: "chauffagiste", label: "Chauffagiste" },
    { id: "peintre", label: "Peintre" },
    { id: "menuisier", label: "Menuisier" },
    { id: "carreleur", label: "Carreleur" },
    { id: "macon", label: "Maçon" },
    { id: "couvreur", label: "Couvreur" },
    { id: "climaticien", label: "Climaticien" },
    { id: "autre", label: "Autre" },
  ];
  // Documents state (artisan step 2)
  const [docSiret, setDocSiret] = useState<string | null>(null);
  const [docDecennale, setDocDecennale] = useState<string | null>(null);
  const [docIdentite, setDocIdentite] = useState<string | null>(null);
  const [docRge, setDocRge] = useState<string | null>(null);
  const [docQualibat, setDocQualibat] = useState<string | null>(null);
  const [docKbis, setDocKbis] = useState<string | null>(null);
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // ── Onboarding ──
  if (!onboardDone) {
    const slide = onboardingSlides[onboardSlide];

    const goNext = () => {
      if (onboardSlide < 2) {
        const next = onboardSlide + 1;
        setOnboardSlide(next);
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
      } else {
        setOnboardDone(true);
      }
    };

    return (
      <SafeAreaView style={[styles.onboardContainer, { backgroundColor: slide.bg }]}>
        {/* Skip */}
        <TouchableOpacity style={styles.skipBtn} onPress={() => setOnboardDone(true)}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={onboardingSlides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={[styles.slideContainer, { width: SCREEN_WIDTH }]}>
              {/* Icon circle */}
              <View style={[styles.slideIconCircle, { backgroundColor: Colors.surface }]}>
                <MaterialCommunityIcons name={item.icon as any} size={40} color={item.accent} />
              </View>
              {/* Title */}
              <Text style={styles.slideTitle}>{item.title}</Text>
              {/* Description */}
              <Text style={styles.slideDesc}>{item.description}</Text>
            </View>
          )}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setOnboardSlide(idx);
          }}
        />

        {/* Dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: onboardSlide === i ? 24 : 8,
                  backgroundColor:
                    onboardSlide === i ? slide.accent : Colors.border,
                },
              ]}
            />
          ))}
        </View>

        {/* Next / Start button */}
        <View style={styles.onboardBtnWrap}>
          <TouchableOpacity
            onPress={goNext}
            activeOpacity={0.85}
            style={[styles.onboardBtn, { backgroundColor: slide.accent }]}
          >
            <Text style={styles.onboardBtnText}>
              {onboardSlide < 2 ? "Suivant" : "Commencer"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Countries ──
  const countries = [
    { code: "FR", flag: "🇫🇷", dial: "+33", name: "France", placeholder: "6 12 34 56 78", phoneLen: 9 },
    { code: "BE", flag: "🇧🇪", dial: "+32", name: "Belgique", placeholder: "470 12 34 56", phoneLen: 9 },
    { code: "CH", flag: "🇨🇭", dial: "+41", name: "Suisse", placeholder: "79 123 45 67", phoneLen: 9 },
    { code: "LU", flag: "🇱🇺", dial: "+352", name: "Luxembourg", placeholder: "621 123 456", phoneLen: 9 },
    { code: "DE", flag: "🇩🇪", dial: "+49", name: "Allemagne", placeholder: "170 1234567", phoneLen: 10 },
    { code: "ES", flag: "🇪🇸", dial: "+34", name: "Espagne", placeholder: "612 34 56 78", phoneLen: 9 },
    { code: "IT", flag: "🇮🇹", dial: "+39", name: "Italie", placeholder: "320 123 4567", phoneLen: 10 },
    { code: "PT", flag: "🇵🇹", dial: "+351", name: "Portugal", placeholder: "912 345 678", phoneLen: 9 },
    { code: "GB", flag: "🇬🇧", dial: "+44", name: "Royaume-Uni", placeholder: "7911 123456", phoneLen: 10 },
    { code: "NL", flag: "🇳🇱", dial: "+31", name: "Pays-Bas", placeholder: "6 12345678", phoneLen: 9 },
    { code: "MA", flag: "🇲🇦", dial: "+212", name: "Maroc", placeholder: "6 12 34 56 78", phoneLen: 9 },
    { code: "DZ", flag: "🇩🇿", dial: "+213", name: "Algérie", placeholder: "5 12 34 56 78", phoneLen: 9 },
    { code: "TN", flag: "🇹🇳", dial: "+216", name: "Tunisie", placeholder: "20 123 456", phoneLen: 8 },
  ];

  // ── Validation helpers ──
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  const currentCountry = countries.find(c => c.code === phoneCountry.code) || countries[0]!;
  const isValidPhone = (p: string) => {
    const digits = p.replace(/[\s.\-()]/g, "");
    return digits.length >= (currentCountry.phoneLen || 8);
  };
  const getPasswordStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0-5
  };
  const strengthLabels = ["", "Très faible", "Faible", "Moyen", "Fort", "Très fort"];
  const strengthColors = ["", Colors.red, "#E8302A", Colors.gold, Colors.forest, Colors.success];

  const pwdStrength = getPasswordStrength(signupPwd);
  const isValidSiret = (s: string) => s.replace(/\s/g, "").length === 14;
  const baseValid = signupName.trim().length > 0
    && isValidEmail(signupEmail)
    && isValidPhone(signupPhone)
    && pwdStrength >= 3
    && signupPwd === signupConfirmPwd
    && signupConfirmPwd.length > 0
    && acceptCgu;
  const artisanStep1Valid = selectedRole === "artisan"
    ? signupCompany.trim().length > 0 && isValidSiret(signupSiret) && signupDecennale.trim().length > 0 && signupTrade.trim().length > 0
    : true;
  const canSubmitStep1 = baseValid && artisanStep1Valid;
  const docsRequiredValid = docSiret !== null && docDecennale !== null && docIdentite !== null;

  // ── Signup form ──
  if (showCreate) {
    return (
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.createContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                if (selectedRole === "artisan" && artisanStep === 2) {
                  setArtisanStep(1);
                } else {
                  setShowCreate(false);
                }
              }}
            >
              <Text style={styles.backArrow}>{"‹"}</Text>
            </TouchableOpacity>

            {/* Step indicator for artisan */}
            {selectedRole === "artisan" && (
              <View style={styles.stepRow}>
                <View style={[styles.stepDot, styles.stepDotActive]}>
                  <Text style={styles.stepDotText}>1</Text>
                </View>
                <View style={[styles.stepLine, artisanStep >= 2 && styles.stepLineActive]} />
                <View style={[styles.stepDot, artisanStep >= 2 && styles.stepDotActive]}>
                  <Text style={[styles.stepDotText, artisanStep < 2 && { color: Colors.textMuted }]}>2</Text>
                </View>
              </View>
            )}

            <Text style={styles.createTitle}>
              {selectedRole === "artisan" && artisanStep === 2 ? "Documents" : "Créer un compte"}
            </Text>
            <Text style={styles.createSubtitle}>
              {selectedRole === "artisan" && artisanStep === 2
                ? "Téléversez vos justificatifs pour vérification"
                : "Rejoignez Nova en quelques secondes"}
            </Text>

            {selectedRole === "artisan" && artisanStep === 2 ? (
              <>
                {/* Documents obligatoires */}
                <View style={styles.docSectionHeader}>
                  <MaterialCommunityIcons name="shield-check" size={16} color={Colors.forest} />
                  <Text style={styles.docSectionTitle}>DOCUMENTS OBLIGATOIRES</Text>
                </View>

                <TouchableOpacity
                  style={[styles.docCard, docSiret && styles.docCardDone]}
                  onPress={() => setDocSiret(docSiret ? null : "justificatif_siret.pdf")}
                >
                  <View style={[styles.docIcon, docSiret && styles.docIconDone]}>
                    <MaterialCommunityIcons
                      name={docSiret ? "check-circle" : "file-document-outline"}
                      size={22}
                      color={docSiret ? Colors.forest : Colors.textMuted}
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <View style={styles.docLabelRow}>
                      <Text style={styles.docLabel}>Justificatif SIRET</Text>
                      <Text style={styles.docRequired}>*</Text>
                    </View>
                    <Text style={docSiret ? styles.docFileNameDone : styles.docHint}>
                      {docSiret || "PDF, JPG ou PNG"}
                    </Text>
                  </View>
                  <Text style={docSiret ? styles.docRemoveText : styles.docAddText}>
                    {docSiret ? "Retirer" : "Ajouter"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.docCard, docDecennale && styles.docCardDone]}
                  onPress={() => setDocDecennale(docDecennale ? null : "attestation_decennale.pdf")}
                >
                  <View style={[styles.docIcon, docDecennale && styles.docIconDone]}>
                    <MaterialCommunityIcons
                      name={docDecennale ? "check-circle" : "file-document-outline"}
                      size={22}
                      color={docDecennale ? Colors.forest : Colors.textMuted}
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <View style={styles.docLabelRow}>
                      <Text style={styles.docLabel}>Attestation décennale</Text>
                      <Text style={styles.docRequired}>*</Text>
                    </View>
                    <Text style={docDecennale ? styles.docFileNameDone : styles.docHint}>
                      {docDecennale || "PDF, JPG ou PNG"}
                    </Text>
                  </View>
                  <Text style={docDecennale ? styles.docRemoveText : styles.docAddText}>
                    {docDecennale ? "Retirer" : "Ajouter"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.docCard, docIdentite && styles.docCardDone]}
                  onPress={() => setDocIdentite(docIdentite ? null : "piece_identite.pdf")}
                >
                  <View style={[styles.docIcon, docIdentite && styles.docIconDone]}>
                    <MaterialCommunityIcons
                      name={docIdentite ? "check-circle" : "file-document-outline"}
                      size={22}
                      color={docIdentite ? Colors.forest : Colors.textMuted}
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <View style={styles.docLabelRow}>
                      <Text style={styles.docLabel}>Pièce d'identité</Text>
                      <Text style={styles.docRequired}>*</Text>
                    </View>
                    <Text style={docIdentite ? styles.docFileNameDone : styles.docHint}>
                      {docIdentite || "PDF, JPG ou PNG"}
                    </Text>
                  </View>
                  <Text style={docIdentite ? styles.docRemoveText : styles.docAddText}>
                    {docIdentite ? "Retirer" : "Ajouter"}
                  </Text>
                </TouchableOpacity>

                {/* Documents facultatifs */}
                <View style={[styles.docSectionHeader, { marginTop: 24 }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={16} color={Colors.textMuted} />
                  <Text style={[styles.docSectionTitle, { color: Colors.textMuted }]}>DOCUMENTS FACULTATIFS</Text>
                </View>

                <TouchableOpacity
                  style={[styles.docCard, docRge && styles.docCardDone]}
                  onPress={() => setDocRge(docRge ? null : "certificat_rge.pdf")}
                >
                  <View style={[styles.docIcon, docRge && styles.docIconDone]}>
                    <MaterialCommunityIcons
                      name={docRge ? "check-circle" : "file-document-outline"}
                      size={22}
                      color={docRge ? Colors.forest : Colors.textMuted}
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docLabel}>Certificat RGE</Text>
                    <Text style={docRge ? styles.docFileNameDone : styles.docHint}>
                      {docRge || "PDF, JPG ou PNG"}
                    </Text>
                  </View>
                  <Text style={docRge ? styles.docRemoveText : styles.docAddText}>
                    {docRge ? "Retirer" : "Ajouter"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.docCard, docQualibat && styles.docCardDone]}
                  onPress={() => setDocQualibat(docQualibat ? null : "qualibat.pdf")}
                >
                  <View style={[styles.docIcon, docQualibat && styles.docIconDone]}>
                    <MaterialCommunityIcons
                      name={docQualibat ? "check-circle" : "file-document-outline"}
                      size={22}
                      color={docQualibat ? Colors.forest : Colors.textMuted}
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docLabel}>Qualibat</Text>
                    <Text style={docQualibat ? styles.docFileNameDone : styles.docHint}>
                      {docQualibat || "PDF, JPG ou PNG"}
                    </Text>
                  </View>
                  <Text style={docQualibat ? styles.docRemoveText : styles.docAddText}>
                    {docQualibat ? "Retirer" : "Ajouter"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.docCard, docKbis && styles.docCardDone]}
                  onPress={() => setDocKbis(docKbis ? null : "extrait_kbis.pdf")}
                >
                  <View style={[styles.docIcon, docKbis && styles.docIconDone]}>
                    <MaterialCommunityIcons
                      name={docKbis ? "check-circle" : "file-document-outline"}
                      size={22}
                      color={docKbis ? Colors.forest : Colors.textMuted}
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docLabel}>Extrait Kbis</Text>
                    <Text style={docKbis ? styles.docFileNameDone : styles.docHint}>
                      {docKbis || "PDF, JPG ou PNG"}
                    </Text>
                  </View>
                  <Text style={docKbis ? styles.docRemoveText : styles.docAddText}>
                    {docKbis ? "Retirer" : "Ajouter"}
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Créer mon compte"
                  onPress={() => navigation.replace("ArtisanPendingValidation" as any)}
                  size="lg"
                  fullWidth
                  disabled={!docsRequiredValid}
                  style={{ marginTop: 16 }}
                />

              </>
            ) : (
            <>
            {/* Role selector */}
            <Text style={styles.fieldLabel}>Je suis</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[
                  styles.roleBtn,
                  selectedRole === "client" && styles.roleBtnActive,
                ]}
                onPress={() => setSelectedRole("client")}
              >
                <Text
                  style={[
                    styles.roleBtnText,
                    selectedRole === "client" && styles.roleBtnTextActive,
                  ]}
                >
                  Particulier
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleBtn,
                  selectedRole === "artisan" && styles.roleBtnActive,
                ]}
                onPress={() => setSelectedRole("artisan")}
              >
                <Text
                  style={[
                    styles.roleBtnText,
                    selectedRole === "artisan" && styles.roleBtnTextActive,
                  ]}
                >
                  Artisan
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nom * */}
            <Input
              label="Nom complet *"
              placeholder="Nom complet"
              value={signupName}
              onChangeText={setSignupName}
              error={signupName.length > 0 && signupName.trim().length < 2 ? "Nom requis" : undefined}
            />

            {selectedRole === "artisan" && (
              <>
                <Input
                  label="Nom de l'entreprise *"
                  placeholder="Raison sociale"
                  value={signupCompany}
                  onChangeText={setSignupCompany}
                  error={signupCompany.length > 0 && signupCompany.trim().length < 2 ? "Nom d'entreprise requis" : undefined}
                />
                <View style={styles.tradeFieldWrap}>
                  <Text style={styles.phoneFieldLabel}>Métier *</Text>
                  <TouchableOpacity
                    style={styles.tradePickerBtn}
                    onPress={() => setShowTradePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={signupTrade ? styles.tradePickerText : styles.tradePickerPlaceholder}>
                      {signupTrade ? trades.find(t => t.id === signupTrade)?.label : "Sélectionnez votre métier"}
                    </Text>
                    <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Email * */}
            <Input
              label="Email *"
              placeholder="exemple@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={signupEmail}
              onChangeText={setSignupEmail}
              error={signupEmail.length > 0 && !isValidEmail(signupEmail) ? "Format email invalide" : undefined}
            />

            {/* Téléphone * */}
            <View style={styles.phoneFieldWrap}>
              <Text style={styles.phoneFieldLabel}>Téléphone *</Text>
              <View style={styles.phoneRow}>
                <TouchableOpacity
                  style={styles.countryPickerBtn}
                  onPress={() => setShowCountryPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.countryFlag}>{phoneCountry.flag}</Text>
                  <Text style={styles.countryDial}>{phoneCountry.dial}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={14} color={Colors.textMuted} />
                </TouchableOpacity>
                <View style={styles.phoneInputWrap}>
                  <Input
                    placeholder={phoneCountry.placeholder}
                    keyboardType="phone-pad"
                    value={signupPhone}
                    onChangeText={setSignupPhone}
                    error={signupPhone.length > 3 && !isValidPhone(signupPhone) ? "Numéro invalide" : undefined}
                  />
                </View>
              </View>
            </View>

            {/* Mot de passe * */}
            <Input
              label="Mot de passe *"
              placeholder="Mot de passe sécurisé"
              secureTextEntry
              value={signupPwd}
              onChangeText={setSignupPwd}
            />
            {signupPwd.length > 0 && (
              <View style={styles.pwdStrengthWrap}>
                <View style={styles.pwdStrengthBar}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.pwdStrengthSegment,
                        { backgroundColor: i <= pwdStrength ? strengthColors[pwdStrength] || Colors.border : Colors.border },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.pwdStrengthLabel, { color: strengthColors[pwdStrength] || Colors.textMuted }]}>
                  {strengthLabels[pwdStrength]}
                </Text>
                <View style={styles.pwdRequirements}>
                  {[
                    { ok: signupPwd.length >= 8, text: "8 caractères minimum" },
                    { ok: /[A-Z]/.test(signupPwd), text: "1 majuscule" },
                    { ok: /[0-9]/.test(signupPwd), text: "1 chiffre" },
                    { ok: /[^A-Za-z0-9]/.test(signupPwd), text: "1 caractère spécial" },
                  ].map((r, i) => (
                    <View key={i} style={styles.pwdReqRow}>
                      <MaterialCommunityIcons
                        name={r.ok ? "check-circle" : "circle-outline"}
                        size={14}
                        color={r.ok ? Colors.success : Colors.textMuted}
                      />
                      <Text style={[styles.pwdReqText, r.ok && { color: Colors.success }]}>{r.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Confirmer mot de passe * */}
            <Input
              label="Confirmer le mot de passe *"
              placeholder="Retapez votre mot de passe"
              secureTextEntry
              value={signupConfirmPwd}
              onChangeText={setSignupConfirmPwd}
              error={signupConfirmPwd.length > 0 && signupPwd !== signupConfirmPwd ? "Les mots de passe ne correspondent pas" : undefined}
            />

            {selectedRole === "artisan" && (
              <>
                <Input
                  label="SIRET *"
                  placeholder="123 456 789 00012"
                  keyboardType="number-pad"
                  value={signupSiret}
                  onChangeText={setSignupSiret}
                  error={signupSiret.length > 0 && !isValidSiret(signupSiret) ? "SIRET invalide (14 chiffres)" : undefined}
                />
                <Input
                  label="N° assurance décennale *"
                  placeholder="N° de votre assurance décennale"
                  value={signupDecennale}
                  onChangeText={setSignupDecennale}
                  error={signupDecennale.length > 0 && signupDecennale.trim().length < 3 ? "Numéro requis" : undefined}
                />
              </>
            )}

            <Button
              title={selectedRole === "artisan" ? "Continuer" : "Créer mon compte"}
              onPress={() => {
                if (selectedRole === "artisan") {
                  setArtisanStep(2);
                } else {
                  navigation.replace("ClientTabs", {} as any);
                }
              }}
              size="lg"
              fullWidth
              disabled={!canSubmitStep1}
              style={{ marginTop: 8 }}
            />

            {/* CGU checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAcceptCgu(!acceptCgu)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptCgu && styles.checkboxChecked]}>
                {acceptCgu && <MaterialCommunityIcons name="check" size={14} color={Colors.white} />}
              </View>
              <Text style={styles.checkboxLabel}>
                J’accepte les <Text style={styles.checkboxLink}>conditions générales d’utilisation</Text> et la <Text style={styles.checkboxLink}>politique de confidentialité</Text> <Text style={{ color: Colors.red }}>*</Text>
              </Text>
            </TouchableOpacity>

            {/* Newsletter checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAcceptNewsletter(!acceptNewsletter)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptNewsletter && styles.checkboxChecked]}>
                {acceptNewsletter && <MaterialCommunityIcons name="check" size={14} color={Colors.white} />}
              </View>
              <Text style={styles.checkboxLabelMuted}>
                Je souhaite recevoir les actualités et offres de Nova par email
              </Text>
            </TouchableOpacity>
            </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        {/* Country picker modal */}
        <Modal visible={showCountryPicker} transparent animationType="fade">
          <TouchableOpacity
            style={styles.countryOverlay}
            activeOpacity={1}
            onPress={() => setShowCountryPicker(false)}
          >
            <View style={styles.countryModal}>
              <View style={styles.countryModalHeader}>
                <Text style={styles.countryModalTitle}>Indicatif téléphonique</Text>
                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                  <MaterialCommunityIcons name="close" size={20} color={Colors.navy} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {countries.map((c) => (
                  <TouchableOpacity
                    key={c.code}
                    style={[
                      styles.countryItem,
                      phoneCountry.code === c.code && styles.countryItemActive,
                    ]}
                    onPress={() => {
                      setPhoneCountry({ code: c.code, flag: c.flag, dial: c.dial, placeholder: c.placeholder });
                      setSignupPhone("");
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text style={styles.countryItemFlag}>{c.flag}</Text>
                    <Text style={styles.countryItemName}>{c.name}</Text>
                    <Text style={styles.countryItemDial}>{c.dial}</Text>
                    {phoneCountry.code === c.code && (
                      <MaterialCommunityIcons name="check" size={16} color={Colors.forest} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
        {/* Trade picker modal */}
        <Modal visible={showTradePicker} transparent animationType="fade">
          <TouchableOpacity
            style={styles.countryOverlay}
            activeOpacity={1}
            onPress={() => setShowTradePicker(false)}
          >
            <View style={styles.countryModal}>
              <View style={styles.countryModalHeader}>
                <Text style={styles.countryModalTitle}>Sélectionnez votre métier</Text>
                <TouchableOpacity onPress={() => setShowTradePicker(false)}>
                  <MaterialCommunityIcons name="close" size={20} color={Colors.navy} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {trades.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.countryItem,
                      signupTrade === t.id && styles.countryItemActive,
                    ]}
                    onPress={() => {
                      setSignupTrade(t.id);
                      setShowTradePicker(false);
                    }}
                  >
                    <Text style={styles.countryItemName}>{t.label}</Text>
                    {signupTrade === t.id && (
                      <MaterialCommunityIcons name="check" size={16} color={Colors.forest} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }

  // ── Forgot password ──
  if (showForgot) {
    const handleForgotSubmit = async () => {
      if (!forgotEmail) return;
      setForgotError("");
      setForgotLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        });
        if (!res.ok) throw new Error();
        setForgotSuccess(true);
      } catch {
        setForgotError("Erreur réseau. Veuillez réessayer.");
      } finally {
        setForgotLoading(false);
      }
    };

    return (
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.createContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                setShowForgot(false);
                setForgotSuccess(false);
                setForgotError("");
                setForgotEmail("");
              }}
            >
              <Text style={styles.backArrow}>{"‹"}</Text>
            </TouchableOpacity>

            {forgotSuccess ? (
              <View style={styles.forgotSuccessWrap}>
                <View style={styles.forgotSuccessIcon}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={48}
                    color={Colors.success}
                  />
                </View>
                <Text style={styles.createTitle}>Email envoyé !</Text>
                <Text style={[styles.createSubtitle, { marginBottom: 32 }]}>
                  Consultez votre boîte mail et cliquez sur le lien reçu pour
                  réinitialiser votre mot de passe.
                </Text>
                <Button
                  title="Retour à la connexion"
                  onPress={() => {
                    setShowForgot(false);
                    setForgotSuccess(false);
                    setForgotError("");
                    setForgotEmail("");
                  }}
                  size="lg"
                  fullWidth
                />
              </View>
            ) : (
              <>
                <Text style={styles.createTitle}>Mot de passe oublié</Text>
                <Text style={styles.createSubtitle}>
                  Entrez votre email, nous vous enverrons un lien de
                  réinitialisation.
                </Text>

                <Input
                  placeholder="Votre email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                />

                {forgotError ? (
                  <Text style={styles.forgotErrorText}>{forgotError}</Text>
                ) : null}

                <Button
                  title={forgotLoading ? "" : "Envoyer le lien"}
                  onPress={handleForgotSubmit}
                  size="lg"
                  fullWidth
                  disabled={forgotLoading || !forgotEmail}
                  style={{ marginTop: 8 }}
                />
                {forgotLoading && (
                  <ActivityIndicator
                    color={Colors.white}
                    style={{ position: "absolute", alignSelf: "center", bottom: 68 }}
                  />
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Login form ──
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.loginContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.novaLogoRow}>
              <Text style={styles.novaLogoText}>Nova</Text>
              <View style={styles.novaLogoDot} />
            </View>
            <Text style={styles.logoSubtitle}>
              L'artisan qu'il vous faut. Certifié. Garanti.
            </Text>
          </View>

          {/* SSO buttons */}
          <TouchableOpacity style={styles.ssoGoogle} activeOpacity={0.85}>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </Svg>
            <Text style={styles.ssoGoogleText}>Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ssoApple} activeOpacity={0.85}>
            <MaterialCommunityIcons name="apple" size={18} color="#fff" />
            <Text style={styles.ssoAppleText}>Continuer avec Apple</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email / Password */}
          <Input placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
          <Input placeholder="Mot de passe" secureTextEntry />

          {/* Forgot password */}
          <TouchableOpacity
            style={styles.forgotWrap}
            onPress={() => {
              setShowForgot(true);
              setForgotSuccess(false);
              setForgotError("");
            }}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Login CTA */}
          <Button
            title="Se connecter"
            onPress={() => navigation.replace("ClientTabs", {} as any)}
            size="lg"
            fullWidth
          />

          {/* Create account */}
          <TouchableOpacity
            style={styles.createAccountBtn}
            onPress={() => setShowCreate(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.createAccountText}>Créer un compte</Text>
          </TouchableOpacity>

          {/* Demo mode */}
          <View style={styles.demoCard}>
            <Text style={styles.demoLabel}>Mode démo</Text>
            <View style={styles.demoRow}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => navigation.replace("ClientTabs", {} as any)}
              >
                <Text style={styles.demoBtnText}>Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => navigation.replace("ArtisanTabs", {} as any)}
              >
                <Text style={styles.demoBtnText}>Artisan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ━━━━━━━━━━ STYLES ━━━━━━━━━━ */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: Colors.bgPage },

  /* ── Onboarding ── */
  onboardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  skipBtn: { position: "absolute", top: 56, right: 24, zIndex: 10 },
  skipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "DMSans_500Medium",
  },
  slideContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  slideIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
  },
  slideIconEmoji: { fontSize: 40 },
  slideTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 26,
    color: Colors.navy,
    textAlign: "center",
    marginBottom: 12,
  },
  slideDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
    alignItems: "center",
  },
  dot: { height: 8, borderRadius: 4 },
  onboardBtnWrap: { width: "100%", paddingHorizontal: 32, marginBottom: 24 },
  onboardBtn: {
    height: 52,
    borderRadius: Radii.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  onboardBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.white,
  },

  /* ── Login ── */
  loginContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoWrap: { alignItems: "center", marginBottom: 32 },
  novaLogoRow: {
    position: "relative",
    marginBottom: 8,
  },
  novaLogoText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 38,
    color: Colors.navy,
    letterSpacing: -0.5,
  },
  novaLogoDot: {
    position: "absolute",
    top: 2,
    right: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  logoSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },

  /* SSO */
  ssoGoogle: {
    width: "100%",
    height: 52,
    borderRadius: Radii.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
    ...Shadows.sm,
  },
  ssoGoogleText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  ssoApple: {
    width: "100%",
    height: 52,
    borderRadius: Radii.lg,
    backgroundColor: Colors.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  ssoAppleText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.white,
  },

  /* Divider */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    fontSize: 12,
    color: Colors.textHint,
    fontFamily: "DMSans_400Regular",
  },

  /* Forgot */
  forgotWrap: { alignSelf: "flex-end", marginBottom: 14, marginTop: -4 },
  forgotText: {
    fontSize: 12,
    color: Colors.forest,
    fontFamily: "DMSans_500Medium",
  },

  /* Create account */
  createAccountBtn: {
    width: "100%",
    height: 48,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: "rgba(27,107,78,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  createAccountText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.forest,
  },

  /* Demo */
  demoCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: Radii.xl,
    padding: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.2)",
  },
  demoLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.deepForest,
    textAlign: "center",
    marginBottom: 8,
  },
  demoRow: { flexDirection: "row", gap: 8 },
  demoBtn: {
    flex: 1,
    height: 42,
    borderRadius: Radii.md,
    backgroundColor: "rgba(27,107,78,0.08)",
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  demoBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.forest,
  },

  /* ── Create account form ── */
  createContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backArrow: { fontSize: 22, color: Colors.forest, fontWeight: "700" },
  createTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 24,
    color: Colors.navy,
    marginBottom: 4,
  },
  createSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 24,
  },
  /* Phone country picker */
  phoneFieldWrap: { marginBottom: 10, width: "100%" },
  phoneFieldLabel: { fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  phoneRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  countryPickerBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    height: 48, paddingHorizontal: 12, borderRadius: 14,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
  },
  countryFlag: { fontSize: 20 },
  countryDial: { fontFamily: "DMMono_500Medium", fontSize: 14, color: Colors.navy },
  phoneInputWrap: { flex: 1 },

  countryOverlay: {
    flex: 1, backgroundColor: "rgba(10,22,40,0.5)",
    justifyContent: "flex-end",
  },
  countryModal: {
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: "60%", paddingBottom: 30,
  },
  countryModalHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.surface,
  },
  countryModalTitle: { fontFamily: "Manrope_700Bold", fontSize: 17, color: Colors.navy },
  countryItem: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 14, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: Colors.surface,
  },
  countryItemActive: { backgroundColor: "rgba(27,107,78,0.04)" },
  countryItemFlag: { fontSize: 22 },
  countryItemName: { fontFamily: "DMSans_500Medium", fontSize: 15, color: Colors.navy, flex: 1 },
  countryItemDial: { fontFamily: "DMMono_500Medium", fontSize: 14, color: Colors.textSecondary },

  /* Password strength */
  pwdStrengthWrap: { marginTop: -4, marginBottom: 10 },
  pwdStrengthBar: { flexDirection: "row", gap: 4, marginBottom: 6 },
  pwdStrengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  pwdStrengthLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 11, marginBottom: 6 },
  pwdRequirements: { gap: 4 },
  pwdReqRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  pwdReqText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted },

  fieldLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: Colors.textHint,
    marginBottom: 6,
  },
  roleRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  roleBtnActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  roleBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },
  roleBtnTextActive: { color: Colors.white },
  legalText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 17,
    marginTop: 14,
  },

  /* ── Forgot password ── */
  forgotSuccessWrap: {
    alignItems: "center",
    paddingTop: 40,
  },
  forgotSuccessIcon: {
    marginBottom: 20,
  },
  forgotErrorText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#E8302A",
    textAlign: "center",
    marginTop: 8,
  },

  /* ── Checkboxes ── */
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 12,
    width: "100%",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.navy,
    lineHeight: 18,
  },
  checkboxLabelMuted: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  checkboxLink: {
    color: Colors.forest,
    fontFamily: "DMSans_600SemiBold",
  },

  /* ── Trade picker ── */
  tradeFieldWrap: { marginBottom: 10, width: "100%" },
  tradePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tradePickerText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.navy,
  },
  tradePickerPlaceholder: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.textHint,
  },

  /* ── Step indicator ── */
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 0,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: Colors.forest,
  },
  stepDotText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: Colors.white,
  },
  stepLine: {
    width: 48,
    height: 2,
    backgroundColor: Colors.border,
    borderRadius: 1,
  },
  stepLineActive: {
    backgroundColor: Colors.forest,
  },

  /* ── Document upload cards ── */
  docSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  docSectionTitle: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
    color: Colors.navy,
    letterSpacing: 1,
  },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  docCardDone: {
    borderColor: "rgba(27,107,78,0.3)",
    backgroundColor: "rgba(27,107,78,0.04)",
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  docIconDone: {
    backgroundColor: "rgba(27,107,78,0.1)",
  },
  docInfo: {
    flex: 1,
  },
  docLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  docLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  docRequired: {
    fontFamily: "DMSans_700Bold",
    fontSize: 10,
    color: Colors.red,
  },
  docHint: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  docFileNameDone: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.forest,
    marginTop: 2,
  },
  docAddText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.forest,
  },
  docRemoveText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.red,
  },
});
