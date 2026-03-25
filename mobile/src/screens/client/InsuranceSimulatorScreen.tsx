import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Button } from "../../components/ui";

const INCIDENT_TYPES = [
  { id: "fuite", label: "Fuite d'eau", icon: "water" },
  { id: "electrique", label: "Panne électrique", icon: "lightning-bolt" },
  { id: "serrure", label: "Serrure cassée", icon: "key" },
  { id: "chauffage", label: "Panne chauffage", icon: "fire" },
  { id: "vitre", label: "Vitre brisée", icon: "window-closed-variant" },
  { id: "autre", label: "Autre", icon: "help-circle" },
];

const BANKS = ["BNP Paribas", "Société Générale", "Crédit Agricole", "LCL", "Crédit Mutuel", "Banque Populaire", "CIC", "Caisse d'Épargne", "La Banque Postale", "Autre"];

const CARD_TYPES = [
  { id: "classic", label: "Classique" },
  { id: "premier", label: "Premier / Gold" },
  { id: "platinum", label: "Platinum / Infinite" },
];

const INSURERS = ["MAIF", "MACIF", "Groupama", "AXA", "Allianz", "MMA", "Matmut", "GMF", "MAAF", "Generali", "Autre", "Je ne sais pas"];

// Simulated AI analysis based on all inputs
function analyzeInsurance(params: {
  incident: string;
  incidentDesc: string;
  bank: string;
  cardType: string;
  hasInsurance: boolean;
  insurer: string;
}) {
  const { incident, incidentDesc, bank, cardType, hasInsurance, insurer } = params;
  const premium = cardType === "platinum" || cardType === "premier";
  const desc = incidentDesc.toLowerCase();

  // Serrurerie + carte premium
  if (incident === "serrure" && premium) {
    return {
      status: "likely" as const,
      title: "Prise en charge probable",
      details: [
        `Votre carte ${cardType === "platinum" ? "Platinum" : "Premier"} ${bank} inclut une assistance serrurerie en cas de perte ou vol de clés.`,
        "Les frais de serrurier sont généralement couverts jusqu'à 300€ à 500€ selon les banques.",
        "Contactez le service assistance de votre carte avant l'intervention pour obtenir un numéro de dossier.",
        premium && hasInsurance ? `Votre assurance habitation ${insurer !== "Je ne sais pas" ? `(${insurer})` : ""} peut compléter la prise en charge si les plafonds carte sont dépassés.` : "",
      ].filter(Boolean),
      color: Colors.success,
    };
  }

  // Dégâts des eaux + assurance habitation
  if ((incident === "fuite" || desc.includes("fuite") || desc.includes("eau") || desc.includes("inondation")) && hasInsurance) {
    return {
      status: "likely" as const,
      title: "Prise en charge probable",
      details: [
        `Les dégâts des eaux sont l'un des sinistres les plus couverts par les assurances habitation.`,
        insurer !== "Je ne sais pas" ? `${insurer} couvre généralement la recherche de fuite et les réparations d'urgence.` : "Votre assureur couvre généralement la recherche de fuite et les réparations.",
        "Déclarez le sinistre sous 5 jours ouvrés auprès de votre assureur.",
        "Conservez les factures et photos des dégâts pour le remboursement.",
        premium ? `Votre carte ${bank} peut également offrir une assistance complémentaire.` : "",
      ].filter(Boolean),
      color: Colors.success,
    };
  }

  // Panne électrique/chauffage + assurance
  if ((incident === "electrique" || incident === "chauffage") && hasInsurance) {
    return {
      status: "partial" as const,
      title: "Prise en charge partielle possible",
      details: [
        `Les pannes ${incident === "electrique" ? "électriques" : "de chauffage"} peuvent être couvertes si elles résultent d'un sinistre (surtension, tempête, etc.).`,
        "L'usure normale ou le défaut d'entretien ne sont généralement pas couverts.",
        insurer !== "Je ne sais pas" ? `Contactez ${insurer} pour vérifier les conditions de votre contrat.` : "Vérifiez les conditions de votre contrat d'assurance.",
        "Si la panne est liée à un événement climatique, la prise en charge est plus probable.",
      ],
      color: Colors.gold,
    };
  }

  // Vitre brisée + assurance
  if ((incident === "vitre" || desc.includes("vitre") || desc.includes("fenêtre") || desc.includes("carreau")) && hasInsurance) {
    return {
      status: "likely" as const,
      title: "Prise en charge probable",
      details: [
        "Le bris de glace est couvert par la plupart des assurances habitation.",
        insurer !== "Je ne sais pas" ? `${insurer} prend généralement en charge le remplacement de vitre, avec une franchise éventuelle.` : "Le remplacement est pris en charge avec une franchise éventuelle.",
        "Déclarez le sinistre et demandez un devis avant le remplacement.",
      ],
      color: Colors.success,
    };
  }

  // "Autre" avec description — analyse du texte
  if (incident === "autre" && incidentDesc.length > 0) {
    if (desc.includes("cambriol") || desc.includes("vol") || desc.includes("effraction")) {
      return {
        status: hasInsurance ? "likely" as const : "partial" as const,
        title: hasInsurance ? "Prise en charge probable" : "À vérifier",
        details: [
          "Les cambriolages et tentatives d'effraction sont couverts par l'assurance habitation (garantie vol).",
          hasInsurance ? `Déposez plainte et déclarez le sinistre à ${insurer !== "Je ne sais pas" ? insurer : "votre assureur"} sous 2 jours ouvrés.` : "Une assurance habitation est nécessaire pour ce type de sinistre.",
          premium ? "Votre carte premium peut couvrir les frais de serrurerie d'urgence suite à effraction." : "",
        ].filter(Boolean),
        color: hasInsurance ? Colors.success : Colors.gold,
      };
    }
    if (desc.includes("tempête") || desc.includes("orage") || desc.includes("grêle") || desc.includes("intempérie")) {
      return {
        status: hasInsurance ? "likely" as const : "unlikely" as const,
        title: hasInsurance ? "Prise en charge probable" : "Peu probable sans assurance",
        details: [
          "Les dommages causés par les événements climatiques sont couverts par la garantie tempête de l'assurance habitation.",
          hasInsurance ? "Faites constater les dégâts et déclarez le sinistre rapidement." : "Sans assurance habitation, les réparations sont à votre charge.",
        ],
        color: hasInsurance ? Colors.success : Colors.red,
      };
    }
  }

  // Pas d'assurance, pas de carte premium
  if (!hasInsurance && !premium) {
    return {
      status: "unlikely" as const,
      title: "Peu probable",
      details: [
        "Sans assurance habitation ni carte bancaire premium, les frais d'intervention seront à votre charge.",
        "Nous vous recommandons de souscrire une assurance habitation pour vous protéger.",
        "Certaines mutuelles proposent des garanties complémentaires pour ce type de sinistre.",
      ],
      color: Colors.red,
    };
  }

  // Cas par défaut
  return {
    status: "partial" as const,
    title: "À vérifier auprès de votre assureur",
    details: [
      `La prise en charge dépend des garanties spécifiques de votre contrat.`,
      insurer && insurer !== "Je ne sais pas" ? `Contactez ${insurer} avec une description précise de votre sinistre.` : "Contactez votre assureur avec les détails du sinistre.",
      "Demandez un numéro de dossier avant de faire intervenir un artisan.",
      premium ? `Les services d'assistance de votre carte ${bank} peuvent également vous aider.` : "",
    ].filter(Boolean),
    color: Colors.gold,
  };
}

export function InsuranceSimulatorScreen({ navigation }: { navigation: any }) {
  const [step, setStep] = useState(0);
  const [incident, setIncident] = useState<string | null>(null);
  const [incidentDesc, setIncidentDesc] = useState("");
  const [bank, setBank] = useState<string | null>(null);
  const [cardType, setCardType] = useState<string | null>(null);
  const [insurer, setInsurer] = useState<string | null>(null);
  const [hasHomeInsurance, setHasHomeInsurance] = useState<boolean | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof analyzeInsurance> | null>(null);

  const canProceedStep0 = incident !== null && (incident !== "autre" || incidentDesc.trim().length >= 10);

  const runAnalysis = () => {
    setAnalyzing(true);
    // Simulate analysis time
    setTimeout(() => {
      const res = analyzeInsurance({
        incident: incident!,
        incidentDesc,
        bank: bank!,
        cardType: cardType!,
        hasInsurance: hasHomeInsurance!,
        insurer: insurer || "",
      });
      setResult(res);
      setAnalyzing(false);
      setStep(3);
    }, 2500);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step > 0 && !analyzing ? setStep(step - 1) : navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.forest} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vérification assurance</Text>
      </View>

      <View style={styles.progressRow}>
        {["Incident", "Banque", "Assurance", "Analyse"].map((s, i) => (
          <View key={i} style={styles.progressItem}>
            <View style={[styles.progressBar, { backgroundColor: i <= step ? Colors.forest : Colors.border }]} />
            <Text style={[styles.progressLabel, { color: i <= step ? Colors.forest : Colors.textHint }]}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Step 0: Incident */}
        {step === 0 && (
          <View>
            <Text style={styles.stepTitle}>Quel est votre incident ?</Text>
            <View style={styles.incidentGrid}>
              {INCIDENT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.incidentCard, incident === t.id && styles.incidentCardSel]}
                  onPress={() => setIncident(t.id)}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons name={t.icon as any} size={22} color={incident === t.id ? Colors.white : Colors.forest} />
                  <Text style={[styles.incidentLabel, incident === t.id && { color: Colors.white }]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.descInput, incident === "autre" && incidentDesc.length > 0 && incidentDesc.trim().length < 10 && { borderColor: Colors.red }]}
              placeholder={incident === "autre" ? "Décrivez votre problème (obligatoire)" : "Décrivez brièvement (optionnel)"}
              placeholderTextColor={Colors.textHint}
              value={incidentDesc}
              onChangeText={setIncidentDesc}
              multiline
            />
            {incident === "autre" && (
              <Text style={[styles.charHint, incidentDesc.trim().length >= 10 && { color: Colors.success }]}>
                {incidentDesc.trim().length}/10 caractères min.{incidentDesc.trim().length >= 10 ? " ✓" : ""}
              </Text>
            )}
            <Button title="Suivant" onPress={() => setStep(1)} fullWidth size="lg" disabled={!canProceedStep0} />
          </View>
        )}

        {/* Step 1: Bank + card */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Votre banque</Text>
            <View style={styles.bankGrid}>
              {BANKS.map((b) => (
                <TouchableOpacity key={b} style={[styles.bankChip, bank === b && styles.bankChipSel]} onPress={() => setBank(b)}>
                  <Text style={[styles.bankChipText, bank === b && { color: Colors.white }]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.stepTitle, { marginTop: 20 }]}>Type de carte bancaire</Text>
            {CARD_TYPES.map((ct) => (
              <TouchableOpacity key={ct.id} style={[styles.cardTypeRow, cardType === ct.id && styles.cardTypeRowSel]} onPress={() => setCardType(ct.id)}>
                <Text style={[styles.cardTypeLabel, cardType === ct.id && { color: Colors.forest }]}>{ct.label}</Text>
                <View style={[styles.cardTypeRadio, cardType === ct.id && styles.cardTypeRadioSel]} />
              </TouchableOpacity>
            ))}

            <View style={{ marginTop: 16 }}>
              <Button title="Suivant" onPress={() => setStep(2)} fullWidth size="lg" disabled={!bank || !cardType} />
            </View>
          </View>
        )}

        {/* Step 2: Insurance */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Avez-vous une assurance habitation ?</Text>
            <View style={styles.yesNoRow}>
              <TouchableOpacity style={[styles.yesNoBtn, hasHomeInsurance === true && styles.yesNoBtnYes]} onPress={() => setHasHomeInsurance(true)}>
                <MaterialCommunityIcons name="check" size={18} color={hasHomeInsurance === true ? Colors.white : Colors.forest} />
                <Text style={[styles.yesNoBtnText, hasHomeInsurance === true && { color: Colors.white }]}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.yesNoBtn, hasHomeInsurance === false && styles.yesNoBtnNo]} onPress={() => setHasHomeInsurance(false)}>
                <MaterialCommunityIcons name="close" size={18} color={hasHomeInsurance === false ? Colors.white : Colors.red} />
                <Text style={[styles.yesNoBtnText, hasHomeInsurance === false && { color: Colors.white }]}>Non</Text>
              </TouchableOpacity>
            </View>

            {hasHomeInsurance && (
              <>
                <Text style={[styles.stepTitle, { marginTop: 20 }]}>Votre assureur</Text>
                <View style={styles.bankGrid}>
                  {INSURERS.map((ins) => (
                    <TouchableOpacity key={ins} style={[styles.bankChip, insurer === ins && styles.bankChipSel]} onPress={() => setInsurer(ins)}>
                      <Text style={[styles.bankChipText, insurer === ins && { color: Colors.white }]}>{ins}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={{ marginTop: 16 }}>
              <Button
                title="Lancer l'analyse"
                onPress={runAnalysis}
                fullWidth
                size="lg"
                disabled={hasHomeInsurance === null || (hasHomeInsurance && !insurer)}
              />
            </View>
          </View>
        )}

        {/* Analyzing state */}
        {analyzing && (
          <View style={styles.analyzingWrap}>
            <ActivityIndicator size="large" color={Colors.forest} />
            <Text style={styles.analyzingTitle}>Analyse en cours</Text>
            <Text style={styles.analyzingDesc}>Vérification des garanties selon votre situation...</Text>
            <View style={styles.analyzingSteps}>
              {["Analyse de votre incident", "Vérification des garanties bancaires", "Étude de votre assurance habitation", "Génération du rapport"].map((s, i) => (
                <View key={i} style={styles.analyzingStep}>
                  <MaterialCommunityIcons name="check-circle" size={14} color={i < 3 ? Colors.success : Colors.textMuted} />
                  <Text style={[styles.analyzingStepText, i >= 3 && { color: Colors.textMuted }]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (
          <View style={styles.resultWrap}>
            <View style={[styles.resultCircle, { backgroundColor: result.color + "15" }]}>
              <MaterialCommunityIcons
                name={result.status === "likely" ? "check-circle" : result.status === "unlikely" ? "close-circle" : "help-circle"}
                size={40}
                color={result.color}
              />
            </View>
            <Text style={[styles.resultTitle, { color: result.color }]}>{result.title}</Text>

            {/* Detailed analysis */}
            <View style={styles.analysisCard}>
              {result.details.map((d, i) => (
                <View key={i} style={[styles.analysisRow, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.surface }]}>
                  <MaterialCommunityIcons name="chevron-right" size={14} color={result.color} style={{ marginTop: 2 }} />
                  <Text style={styles.analysisText}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Summary */}
            <View style={styles.resultSummary}>
              {[
                ["Incident", INCIDENT_TYPES.find(i => i.id === incident)?.label || incidentDesc.slice(0, 30)],
                ["Banque", bank || "—"],
                ["Carte", CARD_TYPES.find(c => c.id === cardType)?.label || "—"],
                ["Assurance", hasHomeInsurance ? (insurer || "Oui") : "Non"],
              ].map(([k, v], i) => (
                <View key={k} style={[styles.resultRow, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.surface }]}>
                  <Text style={styles.resultLabel}>{k}</Text>
                  <Text style={styles.resultValue}>{v}</Text>
                </View>
              ))}
            </View>

            {/* Nova accompaniment CTA */}
            <View style={styles.novaAccompCard}>
              <View style={styles.novaAccompHeader}>
                <View style={styles.novaAccompIconWrap}>
                  <MaterialCommunityIcons name="shield-check" size={22} color={Colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.novaAccompTitle}>Nova vous accompagne</Text>
                  <Text style={styles.novaAccompSub}>Bénéficiez de vos droits sans prise de tête</Text>
                </View>
              </View>
              <View style={styles.novaAccompBody}>
                {[
                  { icon: "file-send", text: "Envoi automatique de la facture à votre assureur après l'intervention" },
                  { icon: "text-box-check", text: "Génération du constat amiable pré-rempli avec les détails du sinistre" },
                  { icon: "account-tie", text: "Un conseiller Nova dédié pour suivre votre dossier de remboursement" },
                  { icon: "clock-fast", text: "Suivi en temps réel de l'avancement de votre prise en charge" },
                ].map((item, i) => (
                  <View key={i} style={styles.novaAccompItem}>
                    <View style={styles.novaAccompDot}>
                      <MaterialCommunityIcons name={item.icon as any} size={16} color={Colors.forest} />
                    </View>
                    <Text style={styles.novaAccompText}>{item.text}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.novaAccompBtn} activeOpacity={0.85} onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="calendar-check" size={18} color={Colors.white} />
                <Text style={styles.novaAccompBtnText}>Réserver un artisan avec accompagnement</Text>
              </TouchableOpacity>
              <Text style={styles.novaAccompFooter}>
                Nova gère les démarches administratives pour vous
              </Text>
            </View>

            <View style={styles.resultNotice}>
              <MaterialCommunityIcons name="information-outline" size={14} color={Colors.forest} />
              <Text style={styles.resultNoticeText}>
                Contactez votre assureur ou votre banque pour une confirmation définitive avant l'intervention.
              </Text>
            </View>

            <Button title="Trouver un artisan" onPress={() => navigation.goBack()} fullWidth size="lg" />
            <TouchableOpacity style={{ marginTop: 12, alignItems: "center" }} onPress={() => { setStep(0); setIncident(null); setIncidentDesc(""); setBank(null); setCardType(null); setInsurer(null); setHasHomeInsurance(null); setResult(null); }}>
              <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.forest }}>Refaire une vérification</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 54, paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(27,107,78,0.08)", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 18, color: Colors.navy },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  progressRow: { flexDirection: "row", paddingHorizontal: 16, paddingBottom: 12, gap: 4 },
  progressItem: { flex: 1, alignItems: "center", gap: 4 },
  progressBar: { height: 3, width: "100%", borderRadius: 2 },
  progressLabel: { fontSize: 9, fontFamily: "DMSans_500Medium" },

  stepTitle: { fontFamily: "Manrope_700Bold", fontSize: 17, color: Colors.navy, marginBottom: 14 },

  incidentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  incidentCard: {
    width: "48%", paddingVertical: 18, paddingHorizontal: 12, borderRadius: 16,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    alignItems: "center", gap: 8, ...Shadows.sm,
  },
  incidentCardSel: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  incidentLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy, textAlign: "center" },
  descInput: {
    backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    padding: 14, fontSize: 14, fontFamily: "DMSans_400Regular", color: Colors.navy, height: 70,
    marginBottom: 8, textAlignVertical: "top",
  },
  charHint: { fontFamily: "DMMono_500Medium", fontSize: 10, color: Colors.textMuted, textAlign: "right", marginBottom: 12 },

  bankGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  bankChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  bankChipSel: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  bankChipText: { fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.navy },

  cardTypeRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  cardTypeRowSel: { borderWidth: 2, borderColor: Colors.forest },
  cardTypeLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  cardTypeRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#B0B0BB" },
  cardTypeRadioSel: { borderWidth: 6, borderColor: Colors.forest },

  yesNoRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  yesNoBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 16, borderRadius: 14, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
  },
  yesNoBtnYes: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  yesNoBtnNo: { backgroundColor: Colors.red, borderColor: Colors.red },
  yesNoBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 15, color: Colors.navy },

  /* Analyzing */
  analyzingWrap: { alignItems: "center", paddingTop: 40 },
  analyzingTitle: { fontFamily: "Manrope_700Bold", fontSize: 18, color: Colors.navy, marginTop: 16, marginBottom: 6 },
  analyzingDesc: { fontFamily: "DMSans_400Regular", fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  analyzingSteps: { gap: 10, width: "100%", paddingHorizontal: 20 },
  analyzingStep: { flexDirection: "row", alignItems: "center", gap: 10 },
  analyzingStepText: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.navy },

  /* Result */
  resultWrap: { alignItems: "center", paddingTop: 20 },
  resultCircle: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  resultTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 22, textAlign: "center", marginBottom: 16 },

  analysisCard: { width: "100%", backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, ...Shadows.sm },
  analysisRow: { flexDirection: "row", gap: 8, paddingVertical: 10 },
  analysisText: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#4A5568", lineHeight: 20, flex: 1 },

  resultSummary: { width: "100%", backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  resultRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  resultLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  resultValue: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },
  resultNotice: {
    flexDirection: "row", alignItems: "flex-start", gap: 8, width: "100%",
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 12, padding: 12, marginBottom: 20,
  },
  resultNoticeText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: "#14523B", flex: 1, lineHeight: 16 },

  /* Nova accompaniment */
  novaAccompCard: {
    width: "100%", backgroundColor: Colors.white, borderRadius: 20,
    borderWidth: 1.5, borderColor: "rgba(27,107,78,0.15)",
    overflow: "hidden", marginBottom: 16, ...Shadows.sm,
  },
  novaAccompHeader: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 16, paddingBottom: 12,
    backgroundColor: "rgba(27,107,78,0.04)",
  },
  novaAccompIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.forest, alignItems: "center", justifyContent: "center",
  },
  novaAccompTitle: { fontFamily: "Manrope_700Bold", fontSize: 16, color: Colors.navy },
  novaAccompSub: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  novaAccompBody: { padding: 16, gap: 12 },
  novaAccompItem: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  novaAccompDot: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  novaAccompText: { fontFamily: "DMSans_500Medium", fontSize: 13, color: "#4A5568", flex: 1, lineHeight: 19, paddingTop: 5 },
  novaAccompBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginHorizontal: 16, marginBottom: 12, paddingVertical: 15,
    backgroundColor: Colors.forest, borderRadius: 14, ...Shadows.md,
  },
  novaAccompBtnText: { fontFamily: "Manrope_700Bold", fontSize: 14, color: Colors.white },
  novaAccompFooter: {
    fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted,
    textAlign: "center", paddingBottom: 14,
  },
});
