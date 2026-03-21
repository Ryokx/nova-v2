import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
// Navigation props typed as any for nested stack compatibility

interface KmTier {
  maxKm: string;
  fee: string;
}

interface PricingProfile {
  deploymentFree: boolean;
  deploymentFee: string;
  deploymentByKm: boolean;
  kmTiers: KmTier[];
  quoteFree: boolean;
  quoteFee: string;
}

export function ArtisanPricingScreen({
  navigation,
}: { navigation: any }) {
  const [classic, setClassic] = useState<PricingProfile>({
    deploymentFree: false,
    deploymentFee: "40",
    deploymentByKm: false,
    kmTiers: [
      { maxKm: "10", fee: "30" },
      { maxKm: "20", fee: "50" },
      { maxKm: "30", fee: "70" },
    ],
    quoteFree: true,
    quoteFee: "0",
  });

  const [urgent, setUrgent] = useState<PricingProfile>({
    deploymentFree: false,
    deploymentFee: "60",
    deploymentByKm: false,
    kmTiers: [
      { maxKm: "10", fee: "50" },
      { maxKm: "20", fee: "80" },
      { maxKm: "30", fee: "110" },
    ],
    quoteFree: true,
    quoteFee: "0",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    Alert.alert("Paramètres enregistrés", "Vos tarifs ont été mis à jour pour les interventions classiques et urgentes.");
    setTimeout(() => setSaved(false), 2000);
  };

  const PricingCard = ({
    title,
    subtitle,
    icon,
    accentColor,
    profile,
    setProfile,
  }: {
    title: string;
    subtitle: string;
    icon: string;
    accentColor: string;
    profile: PricingProfile;
    setProfile: React.Dispatch<React.SetStateAction<PricingProfile>>;
  }) => (
    <View style={[styles.pricingCard, { borderColor: accentColor + "25" }]}>
      {/* Header */}
      <View style={styles.pricingHeader}>
        <View style={[styles.pricingIconWrap, { backgroundColor: accentColor + "12" }]}>
          <MaterialCommunityIcons name={icon as any} size={20} color={accentColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pricingTitle}>{title}</Text>
          <Text style={styles.pricingSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* Déplacement */}
      <View style={styles.settingSection}>
        <Text style={styles.settingLabel}>Frais de déplacement</Text>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingName}>Déplacement offert</Text>
            <Text style={styles.settingDesc}>
              {profile.deploymentFree
                ? "Le client ne paie pas le déplacement"
                : "Le client paie les frais de déplacement"}
            </Text>
          </View>
          <Switch
            value={profile.deploymentFree}
            onValueChange={(v) => setProfile((p) => ({ ...p, deploymentFree: v }))}
            trackColor={{ false: Colors.border, true: Colors.forest }}
            thumbColor={Colors.white}
          />
        </View>

        {!profile.deploymentFree && (
          <>
            {/* Mode: fixe ou par km */}
            <View style={styles.deployModeRow}>
              <TouchableOpacity
                style={[styles.deployModeBtn, !profile.deploymentByKm && styles.deployModeBtnActive]}
                onPress={() => setProfile((p) => ({ ...p, deploymentByKm: false }))}
              >
                <MaterialCommunityIcons name="cash" size={14} color={!profile.deploymentByKm ? Colors.white : Colors.textSecondary} />
                <Text style={[styles.deployModeBtnText, !profile.deploymentByKm && styles.deployModeBtnTextActive]}>Tarif fixe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deployModeBtn, profile.deploymentByKm && styles.deployModeBtnActive]}
                onPress={() => setProfile((p) => ({ ...p, deploymentByKm: true }))}
              >
                <MaterialCommunityIcons name="map-marker-distance" size={14} color={profile.deploymentByKm ? Colors.white : Colors.textSecondary} />
                <Text style={[styles.deployModeBtnText, profile.deploymentByKm && styles.deployModeBtnTextActive]}>Par kilomètre</Text>
              </TouchableOpacity>
            </View>

            {/* Tarif fixe */}
            {!profile.deploymentByKm && (
              <View style={styles.feeInputRow}>
                <Text style={styles.feeInputLabel}>Montant fixe</Text>
                <View style={styles.feeInputWrap}>
                  <TextInput
                    style={styles.feeInput}
                    value={profile.deploymentFee}
                    onChangeText={(t) => setProfile((p) => ({ ...p, deploymentFee: t.replace(/[^0-9]/g, "") }))}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                  <Text style={styles.feeUnit}>€</Text>
                </View>
              </View>
            )}

            {/* Tarif par km */}
            {profile.deploymentByKm && (
              <View style={styles.kmSection}>
                <Text style={styles.kmSectionTitle}>Barème par distance</Text>
                {profile.kmTiers.map((tier, i) => (
                  <View key={i} style={styles.kmTierRow}>
                    <View style={styles.kmTierLeft}>
                      <Text style={styles.kmTierLabel}>Jusqu'à</Text>
                      <View style={styles.kmTierInputWrap}>
                        <TextInput
                          style={styles.kmTierInput}
                          value={tier.maxKm}
                          onChangeText={(t) => {
                            const tiers = [...profile.kmTiers];
                            tiers[i] = { ...tiers[i]!, maxKm: t.replace(/[^0-9]/g, "") };
                            setProfile((p) => ({ ...p, kmTiers: tiers }));
                          }}
                          keyboardType="number-pad"
                          maxLength={3}
                        />
                        <Text style={styles.kmTierUnit}>km</Text>
                      </View>
                    </View>
                    <View style={styles.kmTierRight}>
                      <View style={styles.kmTierInputWrap}>
                        <TextInput
                          style={styles.kmTierInput}
                          value={tier.fee}
                          onChangeText={(t) => {
                            const tiers = [...profile.kmTiers];
                            tiers[i] = { ...tiers[i]!, fee: t.replace(/[^0-9]/g, "") };
                            setProfile((p) => ({ ...p, kmTiers: tiers }));
                          }}
                          keyboardType="number-pad"
                          maxLength={4}
                        />
                        <Text style={styles.kmTierUnit}>€</Text>
                      </View>
                      {profile.kmTiers.length > 1 && (
                        <TouchableOpacity
                          onPress={() => {
                            const tiers = profile.kmTiers.filter((_, j) => j !== i);
                            setProfile((p) => ({ ...p, kmTiers: tiers }));
                          }}
                        >
                          <MaterialCommunityIcons name="close-circle" size={18} color={Colors.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addTierBtn}
                  onPress={() => {
                    const last = profile.kmTiers[profile.kmTiers.length - 1];
                    const nextKm = String(Number(last?.maxKm || "0") + 10);
                    const nextFee = String(Number(last?.fee || "0") + 20);
                    setProfile((p) => ({ ...p, kmTiers: [...p.kmTiers, { maxKm: nextKm, fee: nextFee }] }));
                  }}
                >
                  <MaterialCommunityIcons name="plus-circle-outline" size={16} color={Colors.forest} />
                  <Text style={styles.addTierBtnText}>Ajouter un palier</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.infoNotice}>
              <MaterialCommunityIcons name="information-outline" size={13} color={Colors.forest} />
              <Text style={styles.infoNoticeText}>
                {profile.deploymentByKm
                  ? "Le montant sera calculé automatiquement selon la distance entre vous et le client. En cas d'annulation, le palier correspondant s'applique."
                  : "En cas d'annulation client après 5 min, ces frais sont facturés automatiquement. Si le client annule avant 5 min, vous serez notifié pour décider."}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Devis */}
      <View style={[styles.settingSection, { borderTopWidth: 1, borderTopColor: Colors.surface }]}>
        <Text style={styles.settingLabel}>Établissement du devis</Text>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingName}>Devis gratuit</Text>
            <Text style={styles.settingDesc}>
              {profile.quoteFree
                ? "Le devis est offert au client"
                : "Le client paie l'établissement du devis"}
            </Text>
          </View>
          <Switch
            value={profile.quoteFree}
            onValueChange={(v) => setProfile((p) => ({ ...p, quoteFree: v }))}
            trackColor={{ false: Colors.border, true: Colors.forest }}
            thumbColor={Colors.white}
          />
        </View>

        {!profile.quoteFree && (
          <View style={styles.feeInputRow}>
            <Text style={styles.feeInputLabel}>Montant du devis</Text>
            <View style={styles.feeInputWrap}>
              <TextInput
                style={styles.feeInput}
                value={profile.quoteFee}
                onChangeText={(t) => setProfile((p) => ({ ...p, quoteFee: t.replace(/[^0-9]/g, "") }))}
                keyboardType="number-pad"
                maxLength={4}
              />
              <Text style={styles.feeUnit}>€</Text>
            </View>
          </View>
        )}
      </View>

      {/* Recap */}
      <View style={styles.recapSection}>
        <Text style={styles.recapTitle}>Ce que voit le client</Text>
        <View style={styles.recapRow}>
          <Text style={styles.recapLabel}>Déplacement</Text>
          <Text style={[styles.recapValue, { color: profile.deploymentFree ? Colors.success : Colors.navy }]}>
            {profile.deploymentFree
              ? "Offert"
              : profile.deploymentByKm
              ? `${profile.kmTiers[0]?.fee || "0"}€ — ${profile.kmTiers[profile.kmTiers.length - 1]?.fee || "0"}€`
              : `${profile.deploymentFee}€`}
          </Text>
        </View>
        {!profile.deploymentFree && profile.deploymentByKm && (
          <View style={styles.recapKmDetail}>
            {profile.kmTiers.map((t, i) => (
              <Text key={i} style={styles.recapKmLine}>
                {"≤ "}{t.maxKm} km → {t.fee}€
              </Text>
            ))}
          </View>
        )}
        <View style={styles.recapRow}>
          <Text style={styles.recapLabel}>Devis</Text>
          <Text style={[styles.recapValue, { color: profile.quoteFree ? Colors.success : Colors.navy }]}>
            {profile.quoteFree ? "Gratuit" : `${profile.quoteFee}€`}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.forest} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes tarifs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Explainer */}
        <View style={styles.explainer}>
          <MaterialCommunityIcons name="cash-register" size={18} color={Colors.forest} />
          <Text style={styles.explainerText}>
            Configurez vos frais de déplacement et de devis. Ces paramètres s'affichent sur votre profil et sont appliqués automatiquement lors des réservations.
          </Text>
        </View>

        {/* Classic pricing */}
        <PricingCard
          title="Interventions classiques"
          subtitle="Réservations standard via la plateforme"
          icon="wrench"
          accentColor={Colors.forest}
          profile={classic}
          setProfile={setClassic}
        />

        {/* Urgent pricing */}
        <PricingCard
          title="Interventions urgentes"
          subtitle="Demandes urgentes — tarifs majorés"
          icon="lightning-bolt"
          accentColor={Colors.red}
          profile={urgent}
          setProfile={setUrgent}
        />

        {/* Anti-abuse notice */}
        <View style={styles.abuseNotice}>
          <MaterialCommunityIcons name="shield-alert" size={16} color={Colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.abuseTitle}>Protection anti-abus</Text>
            <Text style={styles.abuseDesc}>
              Nova contrôle les frais de déplacement. Si un client annule rapidement et que vous n'avez parcouru que peu de distance, les frais pourront être annulés. Tout abus constaté entraînera une pénalité sur votre compte.
            </Text>
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, saved && { backgroundColor: Colors.success }]}
          activeOpacity={0.85}
          onPress={handleSave}
        >
          {saved ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <MaterialCommunityIcons name="check" size={18} color={Colors.white} />
              <Text style={styles.saveBtnText}>Enregistré</Text>
            </View>
          ) : (
            <Text style={styles.saveBtnText}>Enregistrer les tarifs</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingBottom: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 20, color: Colors.navy },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Explainer */
  explainer: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: Colors.surface, borderRadius: 14,
    padding: 14, marginBottom: 20,
  },
  explainerText: { fontFamily: "DMSans_400Regular", fontSize: 12.5, color: "#14523B", lineHeight: 19, flex: 1 },

  /* Pricing card */
  pricingCard: {
    backgroundColor: Colors.white, borderRadius: Radii["2xl"],
    padding: 0, marginBottom: 16, borderWidth: 1.5, overflow: "hidden",
    ...Shadows.sm,
  },
  pricingHeader: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 16, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.surface,
  },
  pricingIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  pricingTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy },
  pricingSubtitle: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary },

  /* Setting section */
  settingSection: { padding: 16, paddingBottom: 14 },
  settingLabel: {
    fontFamily: "DMMono_500Medium", fontSize: 10, color: Colors.textMuted,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8,
  },
  settingName: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  settingDesc: { fontFamily: "DMSans_400Regular", fontSize: 11.5, color: Colors.textSecondary, marginTop: 1 },

  /* Fee input */
  feeInputRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginTop: 8, marginBottom: 4,
  },
  feeInputLabel: { fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.navy },
  feeInputWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  feeInput: {
    width: 70, height: 40, backgroundColor: Colors.bgPage,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border,
    textAlign: "center", fontFamily: "DMMono_500Medium", fontSize: 16, color: Colors.navy,
  },
  feeUnit: { fontFamily: "DMMono_500Medium", fontSize: 16, color: Colors.textSecondary },

  /* Deploy mode selector */
  deployModeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  deployModeBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 10,
    backgroundColor: Colors.bgPage, borderWidth: 1, borderColor: Colors.border,
  },
  deployModeBtnActive: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  deployModeBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.textSecondary },
  deployModeBtnTextActive: { color: Colors.white },

  /* Km tiers */
  kmSection: { marginTop: 4, marginBottom: 8 },
  kmSectionTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy, marginBottom: 10 },
  kmTierRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 8, gap: 12,
  },
  kmTierLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  kmTierRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  kmTierLabel: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary },
  kmTierInputWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  kmTierInput: {
    width: 56, height: 36, backgroundColor: Colors.bgPage,
    borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    textAlign: "center", fontFamily: "DMMono_500Medium", fontSize: 14, color: Colors.navy,
  },
  kmTierUnit: { fontFamily: "DMMono_500Medium", fontSize: 13, color: Colors.textSecondary },
  addTierBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderStyle: "dashed", borderColor: "rgba(27,107,78,0.25)",
    marginTop: 4,
  },
  addTierBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.forest },

  /* Recap km detail */
  recapKmDetail: {
    backgroundColor: Colors.white, borderRadius: 8,
    padding: 8, paddingHorizontal: 10, marginBottom: 4,
  },
  recapKmLine: { fontFamily: "DMMono_500Medium", fontSize: 11, color: Colors.textSecondary, lineHeight: 18 },

  /* Info notice */
  infoNotice: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 10,
    padding: 10, marginTop: 8,
  },
  infoNoticeText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: "#14523B", flex: 1, lineHeight: 16 },

  /* Recap */
  recapSection: {
    padding: 16, paddingTop: 12,
    backgroundColor: Colors.bgPage, borderBottomLeftRadius: Radii["2xl"], borderBottomRightRadius: Radii["2xl"],
  },
  recapTitle: { fontFamily: "DMMono_500Medium", fontSize: 10, color: Colors.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 },
  recapRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  recapLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  recapValue: { fontFamily: "DMSans_600SemiBold", fontSize: 13 },

  /* Abuse notice */
  abuseNotice: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "rgba(245,166,35,0.06)", borderRadius: 14,
    padding: 14, marginBottom: 20, borderWidth: 1, borderColor: "rgba(245,166,35,0.12)",
  },
  abuseTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: "#92610A", marginBottom: 2 },
  abuseDesc: { fontFamily: "DMSans_400Regular", fontSize: 11.5, color: "#4A5568", lineHeight: 17 },

  /* Save button */
  saveBtn: {
    height: 52, borderRadius: 16, backgroundColor: Colors.deepForest,
    alignItems: "center", justifyContent: "center", ...Shadows.md,
  },
  saveBtnText: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.white },
});
