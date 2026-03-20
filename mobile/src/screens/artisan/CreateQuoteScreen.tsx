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
import { Button, Card } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

interface LineItem {
  desc: string;
  qty: number;
  unit: string;
  price: number;
}

const stepLabels = ["Client", "Lignes", "Envoi"];

const missionTypes = ["Plomberie", "Chauffage", "Sanitaire", "Urgence"];

export function CreateQuoteScreen({
  navigation,
}: RootStackScreenProps<"CreateQuote">) {
  const [step, setStep] = useState(0);
  const [clientName, setClientName] = useState("Caroline Lef\u00E8vre");
  const [clientEmail, setClientEmail] = useState("caroline.l@email.com");
  const [clientPhone, setClientPhone] = useState("06 12 34 56 78");
  const [clientAddress, setClientAddress] = useState("12 rue de Clichy, Paris 9e");
  const [selectedType, setSelectedType] = useState(0);
  const [lines, setLines] = useState<LineItem[]>([
    { desc: "Remplacement robinet mitigeur", qty: 1, unit: "u", price: 85 },
    { desc: "Main d'\u0153uvre", qty: 2, unit: "h", price: 65 },
  ]);
  const [validityIdx, setValidityIdx] = useState(1);
  const [message, setMessage] = useState(
    "Bonjour Mme Lef\u00E8vre, voici le devis pour l'intervention."
  );

  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tva = total * 0.1;
  const ttc = total + tva;

  const addLine = () => {
    setLines([...lines, { desc: "", qty: 1, unit: "u", price: 0 }]);
  };

  const removeLine = (idx: number) => {
    setLines(lines.filter((_, i) => i !== idx));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Back header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())}
        >
          <Text style={styles.backIcon}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cr\u00E9er un devis</Text>
      </View>

      {/* Progress steps */}
      <View style={styles.progressRow}>
        {stepLabels.map((s, i) => (
          <View key={i} style={styles.progressItem}>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: i <= step ? Colors.forest : Colors.border },
              ]}
            />
            <Text
              style={[
                styles.progressLabel,
                {
                  color: i <= step ? Colors.forest : Colors.textHint,
                  fontFamily: i === step ? "Manrope_700Bold" : "DMSans_400Regular",
                },
              ]}
            >
              {s}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 0: Client */}
        {step === 0 && (
          <View>
            {[
              { label: "Nom du client", value: clientName, set: setClientName },
              { label: "Email", value: clientEmail, set: setClientEmail },
              { label: "T\u00E9l\u00E9phone", value: clientPhone, set: setClientPhone },
              { label: "Adresse", value: clientAddress, set: setClientAddress },
            ].map((f, i) => (
              <View key={i} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={f.value}
                  onChangeText={f.set}
                  placeholderTextColor={Colors.textHint}
                />
              </View>
            ))}

            <Text style={styles.fieldLabel}>Type de mission</Text>
            <View style={styles.typeRow}>
              {missionTypes.map((t, i) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedType(i)}
                  style={[
                    styles.typeBtn,
                    selectedType === i && styles.typeBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      selectedType === i && styles.typeBtnTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Suivant"
              onPress={() => setStep(1)}
              fullWidth
              size="lg"
            />
          </View>
        )}

        {/* Step 1: Lines */}
        {step === 1 && (
          <View>
            <Text style={styles.linesSectionTitle}>Lignes du devis</Text>
            {lines.map((l, i) => (
              <View key={i} style={styles.lineCard}>
                <View style={styles.lineTop}>
                  <Text style={styles.lineDesc}>{l.desc || "(nouvelle ligne)"}</Text>
                  <TouchableOpacity onPress={() => removeLine(i)}>
                    <Text style={styles.lineRemove}>{"\u2715"}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.lineBottom}>
                  <Text style={styles.lineQtyPrice}>
                    {l.qty} {l.unit} \u00D7 {l.price}\u20AC
                  </Text>
                  <Text style={styles.lineTotal}>
                    {(l.qty * l.price).toFixed(2)}\u20AC
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addLineBtn} onPress={addLine}>
              <Text style={styles.addLineText}>+ Ajouter une ligne</Text>
            </TouchableOpacity>

            {/* Totals */}
            <View style={styles.totalsCard}>
              {[
                { label: "Sous-total HT", value: `${total.toFixed(2)}\u20AC`, bold: false },
                { label: "TVA (10%)", value: `${tva.toFixed(2)}\u20AC`, bold: false },
                { label: "Total TTC", value: `${ttc.toFixed(2)}\u20AC`, bold: true },
              ].map((row, i) => (
                <View
                  key={i}
                  style={[styles.totalRow, i > 0 && styles.totalRowBorder]}
                >
                  <Text
                    style={[
                      styles.totalLabel,
                      row.bold && styles.totalLabelBold,
                    ]}
                  >
                    {row.label}
                  </Text>
                  <Text
                    style={[
                      styles.totalValue,
                      row.bold && styles.totalValueBold,
                    ]}
                  >
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>

            <Button
              title="Suivant"
              onPress={() => setStep(2)}
              fullWidth
              size="lg"
            />
          </View>
        )}

        {/* Step 2: Send */}
        {step === 2 && (
          <View>
            <Text style={styles.fieldLabel}>Validit\u00E9 du devis</Text>
            <View style={styles.validityRow}>
              {["7 jours", "14 jours", "30 jours"].map((d, i) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setValidityIdx(i)}
                  style={[
                    styles.validityBtn,
                    validityIdx === i && styles.validityBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.validityText,
                      validityIdx === i && styles.validityTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.messageInput}
              multiline
              value={message}
              onChangeText={setMessage}
              placeholder="Message personnalis\u00E9 au client..."
              placeholderTextColor={Colors.textHint}
            />

            <View style={styles.escrowInfo}>
              <Text style={styles.escrowIcon}>{"\uD83D\uDD12"}</Text>
              <Text style={styles.escrowText}>
                Le client recevra le devis sur son espace Nova et paiera via s\u00E9questre
              </Text>
            </View>

            <Button
              title="Envoyer le devis au client"
              onPress={() => navigation.navigate("QuoteSignature", { devisId: "DEV-2026-089" })}
              fullWidth
              size="lg"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    color: Colors.forest,
    marginTop: -2,
  },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },

  /* Progress */
  progressRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 4,
    marginBottom: 12,
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  progressBar: {
    height: 3,
    width: "100%",
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Fields */
  fieldWrap: { marginBottom: 12 },
  fieldLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
    marginBottom: 5,
  },
  fieldInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.lg,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.text,
    backgroundColor: Colors.white,
  },

  /* Type selector */
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  typeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBtnActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  typeBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12.5,
    color: "#4A5568",
  },
  typeBtnTextActive: { color: Colors.white },

  /* Lines */
  linesSectionTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 12,
  },
  lineCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  lineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  lineDesc: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
    flex: 1,
  },
  lineRemove: {
    fontSize: 14,
    color: Colors.red,
    paddingHorizontal: 4,
  },
  lineBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lineQtyPrice: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  lineTotal: {
    fontFamily: "DMMono_700Bold",
    fontSize: 13,
    color: Colors.navy,
  },
  addLineBtn: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.3)",
    alignItems: "center",
    marginBottom: 16,
  },
  addLineText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.forest,
  },

  /* Totals */
  totalsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  totalRowBorder: { borderTopWidth: 1, borderTopColor: Colors.surface },
  totalLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
  },
  totalLabelBold: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.navy,
  },
  totalValue: {
    fontFamily: "DMMono_700Bold",
    fontSize: 13,
    color: Colors.navy,
  },
  totalValueBold: {
    fontSize: 18,
  },

  /* Validity */
  validityRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  validityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  validityBtnActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  validityText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },
  validityTextActive: { color: Colors.white },

  /* Message */
  messageInput: {
    height: 80,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.xl,
    padding: 14,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.text,
    backgroundColor: Colors.white,
    textAlignVertical: "top",
    marginBottom: 12,
  },

  /* Escrow info */
  escrowInfo: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
  },
  escrowIcon: { fontSize: 15 },
  escrowText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "#14523B",
    flex: 1,
  },
});
