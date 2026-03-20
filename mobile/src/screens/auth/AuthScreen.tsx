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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
      "Vous intervenez, Nova valide, vous êtes payé sous 48h. Garanti.",
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
              onPress={() => setShowCreate(false)}
            >
              <Text style={styles.backArrow}>{"‹"}</Text>
            </TouchableOpacity>

            <Text style={styles.createTitle}>Créer un compte</Text>
            <Text style={styles.createSubtitle}>
              Rejoignez Nova en quelques secondes
            </Text>

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

            <Input label="Nom complet" placeholder="Nom complet" />
            {selectedRole === "artisan" && (
              <Input label="Nom de l'entreprise" placeholder="Raison sociale" />
            )}
            <Input label="Email" placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Téléphone" placeholder="06 12 34 56 78" keyboardType="phone-pad" />
            <Input label="Mot de passe" placeholder="Mot de passe" secureTextEntry />

            {selectedRole === "artisan" && (
              <>
                <Input label="SIRET" placeholder="123 456 789 00012" keyboardType="number-pad" />
                <Input label="N° décennale" placeholder="N° assurance décennale" />
              </>
            )}

            <Button
              title="Créer mon compte"
              onPress={() => {
                navigation.replace(
                  selectedRole === "client" ? "ClientTabs" : "ArtisanTabs",
                  {} as any,
                );
              }}
              size="lg"
              fullWidth
              style={{ marginTop: 8 }}
            />

            <Text style={styles.legalText}>
              En créant un compte, vous acceptez nos conditions
              d’utilisation et notre politique de confidentialité.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
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
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}><MaterialCommunityIcons name="shield-check" size={20} color={Colors.forest} /></Text>
            </View>
            <Text style={styles.logoTitle}>Nova</Text>
            <Text style={styles.logoSubtitle}>
              L&apos;artisan qu&apos;il vous faut. Certifié. Garanti.
            </Text>
          </View>

          {/* SSO buttons */}
          <TouchableOpacity style={styles.ssoGoogle} activeOpacity={0.85}>
            <Text style={styles.ssoGoogleText}>Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ssoApple} activeOpacity={0.85}>
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
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    ...Shadows.md,
  },
  logoEmoji: { fontSize: 28 },
  logoTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 34,
    color: Colors.navy,
    marginBottom: 4,
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
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
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
});
