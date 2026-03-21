import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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

export function InsuranceSimulatorScreen({ navigation }: { navigation: any }) {
  const [step, setStep] = useState(0);
  const [incident, setIncident] = useState<string | null>(null);
  const [incidentDesc, setIncidentDesc] = useState("");
  const [bank, setBank] = useState<string | null>(null);
  const [cardType, setCardType] = useState<string | null>(null);
  const [insurer, setInsurer] = useState<string | null>(null);
  const [hasHomeInsurance, setHasHomeInsurance] = useState<boolean | null>(null);

  const getResult = () => {
    const premium = cardType === "platinum" || cardType === "premier";
    const covered = hasHomeInsurance === true;
    const incidentData = INCIDENT_TYPES.find(i => i.id === incident);

    if (incident === "serrure" && premium) {
      return { status: "likely", title: "Probablement pris en charge", message: `Votre carte ${cardType === "platinum" ? "Platinum" : "Premier"} inclut généralement une assistance serrurerie en cas d'urgence. Vérifiez les conditions auprès de ${bank}.`, color: Colors.success };
    }
    if ((incident === "fuite" || incident === "electrique" || incident === "chauffage") && covered) {
      return { status: "likely", title: "Probablement pris en charge", message: `Les sinistres de type "${incidentData?.label}" sont généralement couverts par votre assurance habitation ${insurer !== "Je ne sais pas" ? `(${insurer})` : ""}. Contactez votre assureur pour ouvrir un dossier avant l'intervention.`, color: Colors.success };
    }
    if (incident === "vitre" && covered) {
      return { status: "likely", title: "Prise en charge possible", message: `Le bris de glace est souvent couvert par l'assurance habitation. Vérifiez votre contrat ${insurer !== "Je ne sais pas" ? `auprès de ${insurer}` : ""} et demandez un numéro de dossier.`, color: Colors.gold };
    }
    if (!covered && !premium) {
      return { status: "unlikely", title: "Peu probable", message: "Sans assurance habitation ni carte premium, les frais seront probablement à votre charge. Nous vous recommandons de souscrire une assurance habitation.", color: Colors.red };
    }
    return { status: "partial", title: "À vérifier", message: `La prise en charge dépend de votre contrat. Nous vous conseillons de contacter ${insurer || "votre assureur"} avant l'intervention pour vérifier vos garanties.`, color: Colors.gold };
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.forest} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simulateur assurance</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        {["Incident", "Banque", "Assurance", "Résultat"].map((s, i) => (
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
              style={styles.descInput}
              placeholder="Décrivez brièvement (optionnel)"
              placeholderTextColor={Colors.textHint}
              value={incidentDesc}
              onChangeText={setIncidentDesc}
              multiline
            />
            <Button title="Suivant" onPress={() => setStep(1)} fullWidth size="lg" disabled={!incident} />
          </View>
        )}

        {/* Step 1: Bank + card */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Votre banque</Text>
            <View style={styles.bankGrid}>
              {BANKS.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.bankChip, bank === b && styles.bankChipSel]}
                  onPress={() => setBank(b)}
                >
                  <Text style={[styles.bankChipText, bank === b && { color: Colors.white }]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.stepTitle, { marginTop: 20 }]}>Type de carte bancaire</Text>
            {CARD_TYPES.map((ct) => (
              <TouchableOpacity
                key={ct.id}
                style={[styles.cardTypeRow, cardType === ct.id && styles.cardTypeRowSel]}
                onPress={() => setCardType(ct.id)}
              >
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
              <TouchableOpacity
                style={[styles.yesNoBtn, hasHomeInsurance === true && styles.yesNoBtnYes]}
                onPress={() => setHasHomeInsurance(true)}
              >
                <MaterialCommunityIcons name="check" size={18} color={hasHomeInsurance === true ? Colors.white : Colors.forest} />
                <Text style={[styles.yesNoBtnText, hasHomeInsurance === true && { color: Colors.white }]}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.yesNoBtn, hasHomeInsurance === false && styles.yesNoBtnNo]}
                onPress={() => setHasHomeInsurance(false)}
              >
                <MaterialCommunityIcons name="close" size={18} color={hasHomeInsurance === false ? Colors.white : Colors.red} />
                <Text style={[styles.yesNoBtnText, hasHomeInsurance === false && { color: Colors.white }]}>Non</Text>
              </TouchableOpacity>
            </View>

            {hasHomeInsurance && (
              <>
                <Text style={[styles.stepTitle, { marginTop: 20 }]}>Votre assureur</Text>
                <View style={styles.bankGrid}>
                  {INSURERS.map((ins) => (
                    <TouchableOpacity
                      key={ins}
                      style={[styles.bankChip, insurer === ins && styles.bankChipSel]}
                      onPress={() => setInsurer(ins)}
                    >
                      <Text style={[styles.bankChipText, insurer === ins && { color: Colors.white }]}>{ins}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={{ marginTop: 16 }}>
              <Button title="Voir le résultat" onPress={() => setStep(3)} fullWidth size="lg" disabled={hasHomeInsurance === null || (hasHomeInsurance && !insurer)} />
            </View>
          </View>
        )}

        {/* Step 3: Result */}
        {step === 3 && (() => {
          const result = getResult();
          return (
            <View style={styles.resultWrap}>
              <View style={[styles.resultCircle, { backgroundColor: result.color + "15" }]}>
                <MaterialCommunityIcons
                  name={result.status === "likely" ? "check-circle" : result.status === "unlikely" ? "close-circle" : "help-circle"}
                  size={40}
                  color={result.color}
                />
              </View>
              <Text style={[styles.resultTitle, { color: result.color }]}>{result.title}</Text>
              <Text style={styles.resultMessage}>{result.message}</Text>

              {/* Summary */}
              <View style={styles.resultSummary}>
                {[
                  ["Incident", INCIDENT_TYPES.find(i => i.id === incident)?.label || "—"],
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

              <View style={styles.resultNotice}>
                <MaterialCommunityIcons name="information-outline" size={14} color={Colors.forest} />
                <Text style={styles.resultNoticeText}>
                  Ce résultat est une estimation. Contactez votre assureur ou votre banque pour une réponse définitive avant l'intervention.
                </Text>
              </View>

              <Button title="Trouver un artisan" onPress={() => navigation.goBack()} fullWidth size="lg" />
              <TouchableOpacity style={{ marginTop: 12, alignItems: "center" }} onPress={() => { setStep(0); setIncident(null); setBank(null); setCardType(null); setInsurer(null); setHasHomeInsurance(null); }}>
                <Text style={{ fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.forest }}>Refaire une simulation</Text>
              </TouchableOpacity>
            </View>
          );
        })()}
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

  /* Incident */
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
    marginBottom: 16, textAlignVertical: "top",
  },

  /* Banks */
  bankGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  bankChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
  },
  bankChipSel: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  bankChipText: { fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.navy },

  /* Card type */
  cardTypeRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardTypeRowSel: { borderWidth: 2, borderColor: Colors.forest },
  cardTypeLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  cardTypeRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#B0B0BB" },
  cardTypeRadioSel: { borderWidth: 6, borderColor: Colors.forest },

  /* Yes/No */
  yesNoRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  yesNoBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 16, borderRadius: 14, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border,
  },
  yesNoBtnYes: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  yesNoBtnNo: { backgroundColor: Colors.red, borderColor: Colors.red },
  yesNoBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 15, color: Colors.navy },

  /* Result */
  resultWrap: { alignItems: "center", paddingTop: 20 },
  resultCircle: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  resultTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 22, textAlign: "center", marginBottom: 8 },
  resultMessage: { fontFamily: "DMSans_400Regular", fontSize: 14, color: "#4A5568", textAlign: "center", lineHeight: 22, marginBottom: 20, maxWidth: 320 },
  resultSummary: { width: "100%", backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  resultRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  resultLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  resultValue: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },
  resultNotice: {
    flexDirection: "row", alignItems: "flex-start", gap: 8, width: "100%",
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 12, padding: 12, marginBottom: 20,
  },
  resultNoticeText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: "#14523B", flex: 1, lineHeight: 16 },
});
