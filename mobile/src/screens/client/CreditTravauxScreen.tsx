import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Shadows } from "../../constants/theme";
import { ConfirmModal } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

/* ── Partenaires de crédit ── */
interface CreditPartner {
  id: string;
  name: string;
  logo: string;
  color: string;
  taeg: string;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  features: string[];
  popular?: boolean;
}

const PARTNERS: CreditPartner[] = [
  {
    id: "cofidis",
    name: "Cofidis",
    logo: "C",
    color: "#E30613",
    taeg: "à partir de 0,90%",
    minAmount: 500,
    maxAmount: 75000,
    minDuration: 6,
    maxDuration: 84,
    features: [
      "Réponse immédiate",
      "Report de la 1ère échéance possible",
      "Remboursement anticipé sans frais",
      "100% en ligne",
    ],
    popular: true,
  },
  {
    id: "alma",
    name: "Alma",
    logo: "A",
    color: "#FA5022",
    taeg: "à partir de 0%",
    minAmount: 500,
    maxAmount: 50000,
    minDuration: 2,
    maxDuration: 60,
    features: [
      "Paiement en 2x à 60x",
      "0% pour les paiements courts",
      "Parcours simplifié",
      "Validation instantanée",
    ],
  },
];

/* ── Durées proposées ── */
const DURATIONS = [
  { id: 6, label: "6 mois" },
  { id: 12, label: "12 mois" },
  { id: 24, label: "24 mois" },
  { id: 36, label: "36 mois" },
  { id: 48, label: "48 mois" },
  { id: 60, label: "60 mois" },
];

/* ── Types de travaux ── */
const WORK_TYPES = [
  { id: "plumbing", label: "Plomberie", icon: "pipe-wrench" },
  { id: "heating", label: "Chauffage / Climatisation", icon: "thermometer" },
  { id: "electrical", label: "Électricité", icon: "lightning-bolt" },
  { id: "renovation", label: "Rénovation générale", icon: "home-edit" },
  { id: "roofing", label: "Toiture / Isolation", icon: "home-roof" },
  { id: "bathroom", label: "Salle de bain", icon: "shower" },
  { id: "kitchen", label: "Cuisine", icon: "stove" },
  { id: "other", label: "Autre", icon: "dots-horizontal" },
];

export function CreditTravauxScreen({
  navigation,
}: RootStackScreenProps<"CreditTravaux">) {
  const [step, setStep] = useState<"form" | "offers" | "submitted">("form");
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [amount, setAmount] = useState("5000");
  const [duration, setDuration] = useState(24);
  const [workType, setWorkType] = useState<string | null>(null);
  const [modal, setModal] = useState({ visible: false, type: "info", title: "", message: "", actions: [] as any[] });

  const amountNum = parseInt(amount.replace(/\s/g, ""), 10) || 0;

  const getMonthly = (partner: CreditPartner, dur: number) => {
    // Simplified simulation — real rate depends on profile
    const rate = partner.id === "alma" && dur <= 4 ? 0 : partner.id === "alma" ? 0.049 : 0.039;
    const monthlyRate = rate / 12;
    if (monthlyRate === 0) return (amountNum / dur).toFixed(2);
    const monthly = (amountNum * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -dur));
    return monthly.toFixed(2);
  };

  const formatAmount = (val: string) => {
    const num = val.replace(/[^\d]/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  /* ── Step: Submitted ── */
  if (step === "submitted") {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.successRoot}>
          <View style={styles.successCircle}>
            <MaterialCommunityIcons name="check" size={36} color={Colors.white} />
          </View>
          <Text style={styles.successTitle}>Demande envoyée !</Text>
          <Text style={styles.successDesc}>
            Votre demande de crédit travaux de {formatAmount(amount)} € sur {duration} mois a été transmise à{" "}
            {PARTNERS.find(p => p.id === selectedPartner)?.name}.
          </Text>
          <Text style={styles.successDesc}>
            Vous recevrez une réponse par email sous 24 à 48h. Un conseiller pourra vous contacter pour finaliser votre dossier.
          </Text>

          <View style={styles.successTimeline}>
            {[
              { icon: "check-circle", label: "Demande envoyée", done: true },
              { icon: "clock-outline", label: "Étude du dossier (24-48h)", done: false },
              { icon: "file-sign", label: "Signature électronique", done: false },
              { icon: "cash-check", label: "Déblocage des fonds", done: false },
            ].map((s, i) => (
              <View key={i} style={styles.successTimelineRow}>
                <MaterialCommunityIcons
                  name={s.icon as any}
                  size={18}
                  color={s.done ? Colors.success : Colors.textSecondary}
                />
                <Text style={[styles.successTimelineText, s.done && { color: Colors.navy, fontFamily: "DMSans_600SemiBold" }]}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryBtnText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ── Step: Offers ── */
  if (step === "offers") {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep("form")}>
            <Text style={styles.backArrow}>{"‹"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Offres de financement</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Recap */}
          <View style={styles.recapCard}>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Montant</Text>
              <Text style={styles.recapValue}>{formatAmount(amount)} €</Text>
            </View>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Durée</Text>
              <Text style={styles.recapValue}>{duration} mois</Text>
            </View>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Type de travaux</Text>
              <Text style={styles.recapValue}>
                {WORK_TYPES.find(w => w.id === workType)?.label || "—"}
              </Text>
            </View>
          </View>

          {/* Partner offers */}
          {PARTNERS.map((partner) => {
            const monthly = getMonthly(partner, duration);
            const totalCost = (parseFloat(monthly) * duration).toFixed(2);
            const costDiff = (parseFloat(totalCost) - amountNum).toFixed(2);
            const isSelected = selectedPartner === partner.id;

            return (
              <TouchableOpacity
                key={partner.id}
                style={[styles.partnerCard, isSelected && styles.partnerCardSel]}
                activeOpacity={0.85}
                onPress={() => setSelectedPartner(partner.id)}
              >
                {partner.popular && (
                  <View style={styles.popularBadge}>
                    <MaterialCommunityIcons name="star" size={10} color={Colors.gold} />
                    <Text style={styles.popularBadgeText}>Recommandé</Text>
                  </View>
                )}

                <View style={styles.partnerHeader}>
                  <View style={[styles.partnerLogo, { backgroundColor: partner.color }]}>
                    <Text style={styles.partnerLogoText}>{partner.logo}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <Text style={styles.partnerTaeg}>TAEG {partner.taeg}</Text>
                  </View>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSel]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>

                {/* Monthly */}
                <View style={styles.partnerAmountRow}>
                  <Text style={styles.partnerMonthlyLabel}>Mensualité estimée</Text>
                  <Text style={styles.partnerMonthly}>{monthly.replace(".", ",")} €/mois</Text>
                </View>

                <View style={styles.partnerCostRow}>
                  <Text style={styles.partnerCostLabel}>Coût total du crédit</Text>
                  <Text style={styles.partnerCost}>
                    {totalCost.replace(".", ",")} € (dont {costDiff.replace(".", ",")} € d'intérêts)
                  </Text>
                </View>

                {/* Features */}
                <View style={styles.partnerFeatures}>
                  {partner.features.map((f, i) => (
                    <View key={i} style={styles.partnerFeatureRow}>
                      <MaterialCommunityIcons name="check" size={14} color={Colors.forest} />
                      <Text style={styles.partnerFeatureText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Legal */}
          <Text style={styles.legalText}>
            Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
            Simulation non contractuelle. Les taux et conditions définitifs dépendent de votre profil et seront communiqués par l'organisme de crédit.
          </Text>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedPartner && styles.primaryBtnDisabled]}
            activeOpacity={selectedPartner ? 0.85 : 1}
            onPress={() => {
              if (!selectedPartner) return;
              setModal({
                visible: true,
                type: "info",
                title: "Confirmer votre demande",
                message: `Vous allez soumettre une demande de crédit travaux de ${formatAmount(amount)} € sur ${duration} mois auprès de ${PARTNERS.find(p => p.id === selectedPartner)?.name}.\n\nVos informations seront transmises de manière sécurisée. Aucun engagement à ce stade.`,
                actions: [
                  { label: "Annuler", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
                  {
                    label: "Confirmer",
                    variant: "primary",
                    onPress: () => {
                      setModal(m => ({ ...m, visible: false }));
                      setStep("submitted");
                    },
                  },
                ],
              });
            }}
          >
            <MaterialCommunityIcons name="send" size={18} color={Colors.white} />
            <Text style={styles.primaryBtnText}>Envoyer ma demande</Text>
          </TouchableOpacity>
        </ScrollView>

        <ConfirmModal
          visible={modal.visible}
          type={modal.type as any}
          title={modal.title}
          message={modal.message}
          actions={modal.actions}
          onClose={() => setModal(m => ({ ...m, visible: false }))}
        />
      </SafeAreaView>
    );
  }

  /* ── Step: Form ── */
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crédit travaux</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconRow}>
            <View style={[styles.heroPartnerIcon, { backgroundColor: "#E30613" }]}>
              <Text style={styles.heroPartnerLetter}>C</Text>
            </View>
            <View style={[styles.heroPartnerIcon, { backgroundColor: "#FA5022" }]}>
              <Text style={styles.heroPartnerLetter}>A</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Financez vos travaux simplement</Text>
          <Text style={styles.heroSub}>
            De 500€ à 75 000€, obtenez une réponse immédiate grâce à nos partenaires Cofidis et Alma.
          </Text>
          <View style={styles.heroFeatures}>
            {[
              { icon: "clock-fast", text: "Réponse en 2 min" },
              { icon: "shield-check", text: "100% sécurisé" },
              { icon: "file-sign", text: "Signature électronique" },
            ].map((f, i) => (
              <View key={i} style={styles.heroFeatureChip}>
                <MaterialCommunityIcons name={f.icon as any} size={14} color={Colors.forest} />
                <Text style={styles.heroFeatureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Amount input */}
        <Text style={styles.fieldLabel}>Montant souhaité</Text>
        <View style={styles.amountInputWrap}>
          <TextInput
            style={styles.amountInput}
            value={formatAmount(amount)}
            onChangeText={(v) => setAmount(v.replace(/\s/g, ""))}
            keyboardType="number-pad"
            placeholder="5 000"
            placeholderTextColor={Colors.textSecondary}
          />
          <Text style={styles.amountCurrency}>€</Text>
        </View>
        <View style={styles.amountRange}>
          <Text style={styles.amountRangeText}>Min. 500 €</Text>
          <Text style={styles.amountRangeText}>Max. 75 000 €</Text>
        </View>

        {/* Quick amounts */}
        <View style={styles.quickAmountRow}>
          {[1000, 3000, 5000, 10000, 20000].map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.quickAmountChip, amount === String(a) && styles.quickAmountChipSel]}
              onPress={() => setAmount(String(a))}
              activeOpacity={0.7}
            >
              <Text style={[styles.quickAmountText, amount === String(a) && styles.quickAmountTextSel]}>
                {a >= 1000 ? `${a / 1000}k` : a} €
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.fieldLabel}>Durée de remboursement</Text>
        <View style={styles.durationRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[styles.durationChip, duration === d.id && styles.durationChipSel]}
              onPress={() => setDuration(d.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.durationText, duration === d.id && styles.durationTextSel]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Work type */}
        <Text style={styles.fieldLabel}>Type de travaux</Text>
        <View style={styles.workTypeGrid}>
          {WORK_TYPES.map((w) => (
            <TouchableOpacity
              key={w.id}
              style={[styles.workTypeChip, workType === w.id && styles.workTypeChipSel]}
              onPress={() => setWorkType(w.id)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={w.icon as any}
                size={18}
                color={workType === w.id ? Colors.white : Colors.forest}
              />
              <Text style={[styles.workTypeText, workType === w.id && styles.workTypeTextSel]}>
                {w.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview */}
        {amountNum >= 500 && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Estimation rapide</Text>
            <View style={styles.previewRow}>
              <View style={styles.previewPartner}>
                <View style={[styles.previewDot, { backgroundColor: "#E30613" }]} />
                <Text style={styles.previewPartnerName}>Cofidis</Text>
              </View>
              <Text style={styles.previewMonthly}>
                ~{getMonthly(PARTNERS[0], duration).replace(".", ",")} €/mois
              </Text>
            </View>
            <View style={styles.previewRow}>
              <View style={styles.previewPartner}>
                <View style={[styles.previewDot, { backgroundColor: "#FA5022" }]} />
                <Text style={styles.previewPartnerName}>Alma</Text>
              </View>
              <Text style={styles.previewMonthly}>
                ~{getMonthly(PARTNERS[1], duration).replace(".", ",")} €/mois
              </Text>
            </View>
            <Text style={styles.previewDisclaimer}>
              Estimations indicatives. Taux définitif selon votre profil.
            </Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            (amountNum < 500 || !workType) && styles.primaryBtnDisabled,
          ]}
          activeOpacity={amountNum >= 500 && workType ? 0.85 : 1}
          onPress={() => {
            if (amountNum >= 500 && workType) setStep("offers");
          }}
        >
          <Text style={styles.primaryBtnText}>Voir les offres</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legalText}>
          Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
          Cofidis : Prêt personnel non affecté. Alma : Paiement fractionné. Offre soumise à conditions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "600" },
  headerTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 20, color: Colors.navy },
  scrollContent: { padding: 16, paddingBottom: 100 },

  /* Hero */
  heroCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.border,
    alignItems: "center", ...Shadows.sm,
  },
  heroIconRow: {
    flexDirection: "row", gap: 8, marginBottom: 14,
  },
  heroPartnerIcon: {
    width: 40, height: 40, borderRadius: 13,
    alignItems: "center", justifyContent: "center",
  },
  heroPartnerLetter: {
    fontFamily: "Manrope_800ExtraBold", fontSize: 20, color: Colors.white,
  },
  heroTitle: {
    fontFamily: "Manrope_800ExtraBold", fontSize: 18, color: Colors.navy,
    textAlign: "center", marginBottom: 6,
  },
  heroSub: {
    fontSize: 13, color: Colors.textSecondary, textAlign: "center",
    lineHeight: 19, marginBottom: 14,
  },
  heroFeatures: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center",
  },
  heroFeatureChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: Colors.surface, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  heroFeatureText: { fontSize: 11, color: Colors.navy, fontFamily: "DMSans_500Medium" },

  /* Fields */
  fieldLabel: {
    fontFamily: "DMSans_700Bold", fontSize: 14, color: Colors.navy,
    marginBottom: 10, marginTop: 4,
  },
  amountInputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1.5,
    borderColor: Colors.border, paddingHorizontal: 16, marginBottom: 6,
  },
  amountInput: {
    flex: 1, fontFamily: "DMMono_700Bold", fontSize: 28,
    color: Colors.navy, paddingVertical: 14,
  },
  amountCurrency: {
    fontFamily: "DMMono_700Bold", fontSize: 24, color: Colors.textSecondary,
  },
  amountRange: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 10,
  },
  amountRangeText: { fontSize: 11, color: Colors.textSecondary },

  quickAmountRow: {
    flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 20,
  },
  quickAmountChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
  },
  quickAmountChipSel: {
    backgroundColor: Colors.forest, borderColor: Colors.forest,
  },
  quickAmountText: { fontFamily: "DMMono_500Medium", fontSize: 12, color: Colors.navy },
  quickAmountTextSel: { color: Colors.white },

  durationRow: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20,
  },
  durationChip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
  },
  durationChipSel: {
    backgroundColor: Colors.forest, borderColor: Colors.forest, ...Shadows.sm,
  },
  durationText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },
  durationTextSel: { color: Colors.white },

  workTypeGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20,
  },
  workTypeChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
  },
  workTypeChipSel: {
    backgroundColor: Colors.forest, borderColor: Colors.forest,
  },
  workTypeText: { fontFamily: "DMSans_500Medium", fontSize: 12, color: Colors.navy },
  workTypeTextSel: { color: Colors.white },

  /* Preview */
  previewCard: {
    backgroundColor: Colors.white, borderRadius: 18, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.border,
  },
  previewTitle: { fontFamily: "DMSans_700Bold", fontSize: 14, color: Colors.navy, marginBottom: 12 },
  previewRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.surface,
  },
  previewPartner: { flexDirection: "row", alignItems: "center", gap: 8 },
  previewDot: { width: 10, height: 10, borderRadius: 5 },
  previewPartnerName: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  previewMonthly: { fontFamily: "DMMono_700Bold", fontSize: 14, color: Colors.forest },
  previewDisclaimer: { fontSize: 10, color: Colors.textSecondary, marginTop: 8 },

  /* Offers step */
  recapCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: Colors.border,
  },
  recapRow: {
    flexDirection: "row", justifyContent: "space-between", paddingVertical: 6,
  },
  recapLabel: { fontSize: 13, color: Colors.textSecondary },
  recapValue: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },

  partnerCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 18,
    marginBottom: 14, borderWidth: 1.5, borderColor: Colors.border,
    position: "relative", overflow: "hidden",
  },
  partnerCardSel: {
    borderColor: Colors.forest, borderWidth: 2,
    backgroundColor: "rgba(27,107,78,0.02)",
  },
  popularBadge: {
    position: "absolute", top: 0, right: 0,
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(245,166,35,0.1)", borderBottomLeftRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  popularBadgeText: { fontFamily: "DMSans_600SemiBold", fontSize: 10, color: Colors.gold },
  partnerHeader: {
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14,
  },
  partnerLogo: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  partnerLogoText: { fontFamily: "Manrope_800ExtraBold", fontSize: 22, color: Colors.white },
  partnerName: { fontFamily: "Manrope_700Bold", fontSize: 16, color: Colors.navy },
  partnerTaeg: { fontSize: 12, color: Colors.textSecondary },
  radioOuter: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: "#B0B0BB",
    alignItems: "center", justifyContent: "center",
  },
  radioOuterSel: { borderWidth: 2, borderColor: Colors.forest },
  radioInner: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.forest,
  },
  partnerAmountRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: 12, padding: 12, marginBottom: 10,
  },
  partnerMonthlyLabel: { fontSize: 12, color: Colors.textSecondary },
  partnerMonthly: {
    fontFamily: "DMMono_700Bold", fontSize: 18, color: Colors.forest,
  },
  partnerCostRow: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 12,
    paddingHorizontal: 4,
  },
  partnerCostLabel: { fontSize: 11, color: Colors.textSecondary },
  partnerCost: { fontSize: 11, color: Colors.navy, fontFamily: "DMSans_500Medium" },
  partnerFeatures: { gap: 6 },
  partnerFeatureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  partnerFeatureText: { fontSize: 12, color: "#4A5568", fontFamily: "DMSans_500Medium" },

  /* Success */
  successRoot: {
    flex: 1, alignItems: "center", justifyContent: "center", padding: 24,
  },
  successCircle: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: Colors.success, alignItems: "center",
    justifyContent: "center", marginBottom: 20,
  },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold", fontSize: 22, color: Colors.navy,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14, color: Colors.textSecondary, lineHeight: 22,
    textAlign: "center", marginBottom: 8,
  },
  successTimeline: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    width: "100%", marginVertical: 20, gap: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  successTimelineRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  successTimelineText: { fontSize: 13, color: Colors.textSecondary },

  /* Shared */
  primaryBtn: {
    width: "100%", height: 54, borderRadius: 16,
    backgroundColor: Colors.deepForest, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8,
    ...Shadows.md, marginBottom: 12,
  },
  primaryBtnDisabled: {
    backgroundColor: Colors.border, shadowOpacity: 0, elevation: 0,
  },
  primaryBtnText: {
    color: Colors.white, fontSize: 15, fontFamily: "DMSans_700Bold",
  },
  legalText: {
    fontSize: 10, color: Colors.textSecondary, lineHeight: 16,
    textAlign: "center", marginTop: 8,
  },
});
