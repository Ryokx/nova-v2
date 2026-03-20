import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar, Button, Card, EscrowStepper } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const CHECKS = [
  "Le travail est conforme au devis",
  "Je suis satisfait de la prestation",
  "Aucun dommage constaté",
];

const Stars = ({
  rating,
  size = 30,
  onRate,
}: {
  rating: number;
  size?: number;
  onRate: (v: number) => void;
}) => (
  <View style={{ flexDirection: "row", gap: 8 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <TouchableOpacity key={i} onPress={() => onRate(i)} activeOpacity={0.7}>
        <Text
          style={{
            fontSize: size,
            color: i <= rating ? Colors.gold : Colors.border,
          }}
        >
          {"\u2605"}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export function MissionDetailScreen({
  navigation,
}: RootStackScreenProps<"MissionDetail">) {
  const [checks, setChecks] = useState([false, false, false]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [validated, setValidated] = useState(false);

  const toggleCheck = (idx: number) => {
    const next = [...checks];
    next[idx] = !next[idx];
    setChecks(next);
  };

  /* ---------- Success state ---------- */
  if (validated) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <Text style={styles.successCheck}>{"\u2713"}</Text>
        </View>
        <Text style={styles.successTitle}>Demande envoyée !</Text>
        <Text style={styles.successDesc}>
          Nova valide et libère le paiement sous 48h
        </Text>
        <Button
          title="Retour aux missions"
          onPress={() => navigation.navigate("ClientTabs", { screen: "ClientMissions" })}
          size="lg"
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail de la mission</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EscrowStepper currentStep={2} />

        {/* Mission info card */}
        <Card style={{ marginBottom: 14 }}>
          <View style={styles.artisanRow}>
            <Avatar name="Jean-Michel" size={52} radius={18} />
            <View>
              <Text style={styles.artisanName}>Jean-Michel P.</Text>
              <Text style={styles.artisanMeta}>
                Réparation fuite {"\u2022"} Plomberie
              </Text>
            </View>
          </View>
          {[
            ["Date", "15 mars 2026"],
            ["Adresse", "12 rue de Rivoli, Paris 4e"],
          ].map(([k, v]) => (
            <View key={k} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{k}</Text>
              <Text style={styles.infoValue}>{v}</Text>
            </View>
          ))}
          {/* Financial breakdown */}
          <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: Colors.surface }]}>
            <Text style={styles.infoLabel}>HT</Text>
            <Text style={styles.infoValueMono}>266,67\u20AC</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>TVA (20%)</Text>
            <Text style={styles.infoValueMono}>53,33\u20AC</Text>
          </View>
          <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: Colors.surface }]}>
            <Text style={[styles.infoLabel, { fontWeight: "700" }]}>Total TTC</Text>
            <Text style={[styles.infoValueMono, { fontSize: 16, fontWeight: "700" }]}>
              320,00\u20AC
            </Text>
          </View>
        </Card>

        {/* Validation checklist */}
        <Text style={styles.sectionLabel}>Checklist de validation</Text>
        {CHECKS.map((text, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => toggleCheck(i)}
            activeOpacity={0.7}
            style={[
              styles.checkItem,
              checks[i] && styles.checkItemSel,
            ]}
          >
            <View style={[styles.checkbox, checks[i] && styles.checkboxSel]}>
              {checks[i] && (
                <Text style={styles.checkMark}>{"\u2713"}</Text>
              )}
            </View>
            <Text style={styles.checkText}>{text}</Text>
          </TouchableOpacity>
        ))}

        {/* Star rating */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
          Votre note
        </Text>
        <View style={{ marginBottom: 12 }}>
          <Stars rating={rating} onRate={setRating} />
        </View>

        {/* Review textarea */}
        <TextInput
          style={styles.textarea}
          placeholder="Laissez un avis (optionnel)..."
          placeholderTextColor={Colors.textHint}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={reviewText}
          onChangeText={setReviewText}
        />

        {/* Validation info */}
        <View style={styles.validationInfo}>
          <Text style={{ fontSize: 16, color: "#0D7A52" }}>{"\u2713"}</Text>
          <Text style={styles.validationInfoText}>
            Nova vérifiera la mission avant de libérer 320\u20AC vers
            Jean-Michel P.
          </Text>
        </View>

        {/* Validate button */}
        <TouchableOpacity
          style={styles.validateBtn}
          activeOpacity={0.85}
          onPress={() => setValidated(true)}
        >
          <Text style={styles.validateBtnText}>
            Valider et libérer le paiement
          </Text>
        </TouchableOpacity>

        {/* Dispute button */}
        <TouchableOpacity
          style={styles.disputeBtn}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("ReportDispute", { missionId: "1" })
          }
        >
          <Text style={styles.disputeBtnText}>
            {"\u26A0\uFE0F"} Signaler un litige
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "600" },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },

  /* Artisan row */
  artisanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  artisanName: { fontSize: 15, fontWeight: "700", color: Colors.navy },
  artisanMeta: { fontSize: 12.5, color: Colors.textHint },

  /* Info rows */
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  infoLabel: { fontSize: 12.5, color: Colors.textHint },
  infoValue: { fontSize: 12.5, fontWeight: "600", color: Colors.navy },
  infoValueMono: {
    fontFamily: "DMMono_500Medium",
    fontSize: 13,
    color: Colors.navy,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 10,
  },

  /* Checklist */
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkItemSel: { borderWidth: 2, borderColor: Colors.success },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#B0B0BB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSel: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkMark: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  checkText: { fontSize: 13.5, color: Colors.navy, fontWeight: "500", flex: 1 },

  /* Textarea */
  textarea: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    height: 80,
    color: Colors.text,
    marginBottom: 16,
  },

  /* Validation info */
  validationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(34,200,138,0.06)",
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(34,200,138,0.15)",
  },
  validationInfoText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0D7A52",
    flex: 1,
  },

  /* Validate button */
  validateBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...Shadows.md,
  },
  validateBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  /* Dispute button */
  disputeBtn: {
    alignItems: "center",
    padding: 8,
    marginBottom: 16,
  },
  disputeBtnText: { fontSize: 13, color: Colors.red, fontWeight: "500" },

  /* Success state */
  successRoot: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    ...Shadows.lg,
  },
  successCheck: { color: Colors.white, fontSize: 40, fontWeight: "700" },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 23,
    color: Colors.navy,
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 14,
    color: "#4A5568",
    marginBottom: 24,
    textAlign: "center",
  },
});
