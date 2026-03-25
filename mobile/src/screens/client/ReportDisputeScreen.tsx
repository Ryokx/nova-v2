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
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar } from "../../components/ui";
import { getAvatarUri } from "../../constants/avatars";
import type { RootStackScreenProps } from "../../navigation/types";

const reasons = [
  "Travail non conforme au devis",
  "Dommages causés lors de l'intervention",
  "Artisan ne s'est pas présenté",
  "Surfacturation par rapport au devis",
  "Travail inachevé",
  "Autre problème",
];

const contactOptions = ["Email", "Téléphone", "Les deux"];

export function ReportDisputeScreen({
  navigation,
}: RootStackScreenProps<"ReportDispute">) {
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [contactPref, setContactPref] = useState(2); // default "Les deux"
  const [submitted, setSubmitted] = useState(false);

  /* ---- Success state ---- */
  if (submitted) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <Text style={styles.successCheck}>{"✓"}</Text>
        </View>
        <Text style={styles.successTitle}>Litige signalé</Text>
        <Text style={styles.successDesc}>
          Notre équipe va examiner votre demande sous 24h.
        </Text>
        <Text style={styles.successSub}>
          Le paiement reste bloqué en séquestre pendant l'examen.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryBtnText}>Retour aux missions</Text>
        </TouchableOpacity>
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
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Signaler un litige</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mission concerned */}
        <View style={styles.missionCard}>
          <Avatar name="Jean-Michel P." size={42} radius={14} uri={getAvatarUri("Jean-Michel P.")} />
          <View style={{ flex: 1 }}>
            <Text style={styles.missionName}>
              Jean-Michel P. {"•"} Plomberie
            </Text>
            <Text style={styles.missionSub}>
              15 mars 2026 {"•"} 320,00€
            </Text>
          </View>
        </View>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={{ fontSize: 16 }}><MaterialCommunityIcons name="camera-plus" size={20} color={Colors.forest} /></Text>
          <Text style={styles.infoText}>
            Le paiement de 320,00€ est bloqué en séquestre et ne sera
            pas versé à l'artisan tant que le litige n'est pas résolu.
          </Text>
        </View>

        {/* Reason selection */}
        <Text style={styles.sectionTitle}>Motif du litige</Text>
        {reasons.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.reasonChip,
              selectedReason === i && styles.reasonChipSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedReason(i)}
          >
            <View
              style={[
                styles.radio,
                selectedReason === i && styles.radioSelected,
              ]}
            />
            <Text style={styles.reasonText}>{r}</Text>
          </TouchableOpacity>
        ))}

        {/* Description */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Décrivez le problème
        </Text>
        <TextInput
          style={styles.textarea}
          placeholder="Expliquez en détail ce qui ne va pas..."
          placeholderTextColor={Colors.textHint}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Photo upload */}
        <Text style={styles.sectionTitle}>Photos (optionnel)</Text>
        <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.85}>
          <Text style={{ fontSize: 16 }}><MaterialCommunityIcons name="alert-circle" size={18} color={Colors.red} /></Text>
          <Text style={styles.uploadBtnText}>
            Ajouter des photos comme preuves
          </Text>
        </TouchableOpacity>

        {/* Contact preference */}
        <Text style={styles.sectionTitle}>
          Comment souhaitez-vous être contacté ?
        </Text>
        <View style={styles.contactRow}>
          {contactOptions.map((opt, i) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.contactBtn,
                contactPref === i
                  ? styles.contactBtnActive
                  : styles.contactBtnInactive,
              ]}
              activeOpacity={0.85}
              onPress={() => setContactPref(i)}
            >
              <Text
                style={[
                  styles.contactBtnText,
                  contactPref === i
                    ? styles.contactBtnTextActive
                    : styles.contactBtnTextInactive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.85}
          onPress={() => setSubmitted(true)}
        >
          <Text style={styles.submitBtnText}>Envoyer le signalement</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          Nova s'engage à traiter votre demande sous 24h ouvrées. Vous
          recevrez une notification dès qu'une décision sera prise.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "700" },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8 },

  /* Mission */
  missionCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  missionName: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.navy,
  },
  missionSub: { fontSize: 12, color: Colors.textHint },

  /* Info banner */
  infoBanner: {
    backgroundColor: "rgba(232,48,42,0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.1)",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoText: { fontSize: 12, color: Colors.red, lineHeight: 19, flex: 1 },

  sectionTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
    marginBottom: 10,
  },

  /* Reason chips */
  reasonChip: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reasonChipSelected: {
    borderWidth: 2,
    borderColor: Colors.red,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B0B0BB",
  },
  radioSelected: {
    borderWidth: 6,
    borderColor: Colors.red,
  },
  reasonText: {
    fontSize: 13.5,
    fontFamily: "DMSans_500Medium",
    color: Colors.navy,
  },

  /* Textarea */
  textarea: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    backgroundColor: Colors.white,
    marginBottom: 14,
    textAlignVertical: "top",
    color: Colors.navy,
  },

  /* Upload */
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    backgroundColor: "rgba(27,107,78,0.04)",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.3)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  uploadBtnText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.forest,
  },

  /* Contact */
  contactRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  contactBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  contactBtnActive: { backgroundColor: Colors.forest },
  contactBtnInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactBtnText: { fontSize: 13, fontFamily: "DMSans_600SemiBold" },
  contactBtnTextActive: { color: Colors.white },
  contactBtnTextInactive: { color: Colors.navy },

  /* Submit */
  submitBtn: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  footerNote: {
    fontSize: 11,
    color: Colors.textHint,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 17,
  },

  /* Success */
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
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successCheck: { fontSize: 40, color: Colors.white },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 6,
  },
  successSub: {
    fontSize: 13,
    color: Colors.textHint,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryBtn: {
    height: 52,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
  },
});
