import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Button, Card, EscrowStepper, Input } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

type PaymentMethod = "cb" | "virement" | "apple";
type Installment = "1x" | "3x" | "4x";

const METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "cb", label: "Carte bancaire", icon: "��" },
  { id: "virement", label: "Virement", icon: "��" },
  { id: "apple", label: "Apple Pay", icon: "" },
];

const INSTALLMENTS: {
  id: Installment;
  label: string;
  amount: string;
  sub: string;
}[] = [
  { id: "1x", label: "1×", amount: "320,00 €", sub: "Paiement unique" },
  { id: "3x", label: "3×", amount: "106,67 €", sub: "via Klarna" },
  { id: "4x", label: "4×", amount: "80,00 €", sub: "via Klarna" },
];

export function PaymentScreen({
  navigation,
}: RootStackScreenProps<"Payment">) {
  const [method, setMethod] = useState<PaymentMethod>("cb");
  const [installment, setInstallment] = useState<Installment>("1x");

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
        <Text style={styles.headerTitle}>Paiement sécurisé</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EscrowStepper currentStep={0} />

        {/* Amount display */}
        <Text style={styles.amount}>320,00€</Text>

        {/* Payment methods */}
        <Text style={styles.sectionLabel}>Mode de paiement</Text>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setMethod(m.id)}
            activeOpacity={0.7}
            style={[
              styles.methodCard,
              method === m.id && styles.methodCardSel,
            ]}
          >
            <View
              style={[
                styles.radio,
                method === m.id && styles.radioSel,
              ]}
            />
            <Text style={styles.methodLabel}>
              {m.icon} {m.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Installment selector */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
          Paiement en plusieurs fois
        </Text>
        <View style={styles.installRow}>
          {INSTALLMENTS.map((inst) => (
            <TouchableOpacity
              key={inst.id}
              onPress={() => setInstallment(inst.id)}
              style={[
                styles.installBtn,
                installment === inst.id && styles.installBtnSel,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.installLabel,
                  installment === inst.id && styles.installLabelSel,
                ]}
              >
                {inst.label}
              </Text>
              <Text
                style={[
                  styles.installAmount,
                  installment === inst.id && styles.installAmountSel,
                ]}
              >
                {inst.amount}/mois
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {installment !== "1x" && (
          <View style={styles.klarnaInfo}>
            <Text style={{ fontSize: 14, color: Colors.forest }}>
              {"✓"}
            </Text>
            <Text style={styles.klarnaText}>
              {installment === "3x"
                ? "3 prélèvements de 106,67 € • Paiement géré par Klarna."
                : "4 prélèvements de 80,00 € • Paiement géré par Klarna."}
            </Text>
          </View>
        )}

        {/* Card fields (visible when CB selected) */}
        {method === "cb" && (
          <View style={{ marginTop: 16 }}>
            <Input
              label="Numéro de carte"
              placeholder="4242 4242 4242 4242"
              keyboardType="number-pad"
            />
            <View style={styles.cardFieldsRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Expiration"
                  placeholder="MM/AA"
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="CVV"
                  placeholder="123"
                  keyboardType="number-pad"
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}

        {/* Escrow info */}
        <View style={styles.escrowInfo}>
          <Text style={{ fontSize: 16 }}>{"��️"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.escrowInfoTitle}>
              Votre argent est sécurisé
            </Text>
            <Text style={styles.escrowInfoDesc}>
              Le montant est bloqué sur notre compte séquestre. L'artisan ne
              sera payé qu'après validation par nos équipes.
            </Text>
          </View>
        </View>

        {/* Pay button */}
        <Button
          title={"�� Payer 320,00€"}
          onPress={() =>
            navigation.navigate("Tracking", { missionId: "1" })
          }
          fullWidth
          size="lg"
        />

        {/* Security row */}
        <View style={styles.securityRow}>
          {[
            "Paiement sécurisé SSL",
            "Données chiffrées",
            "Séquestre garanti",
          ].map((t, i) => (
            <Text key={i} style={styles.securityText}>
              {"��"} {t}
            </Text>
          ))}
        </View>
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

  /* Amount */
  amount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 28,
    fontWeight: "700",
    color: Colors.navy,
    textAlign: "center",
    marginVertical: 8,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 10,
  },

  /* Method cards */
  methodCard: {
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
  methodCardSel: {
    backgroundColor: "rgba(27,107,78,0.05)",
    borderWidth: 2,
    borderColor: Colors.forest,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B0B0BB",
  },
  radioSel: {
    borderWidth: 6,
    borderColor: Colors.forest,
  },
  methodLabel: { fontSize: 14, fontWeight: "500", color: Colors.navy },

  /* Installments */
  installRow: { flexDirection: "row", gap: 6, marginBottom: 10 },
  installBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  installBtnSel: {
    backgroundColor: Colors.forest,
    borderWidth: 0,
    ...Shadows.md,
  },
  installLabel: { fontSize: 16, fontWeight: "800", color: Colors.navy },
  installLabelSel: { color: Colors.white },
  installAmount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
    color: Colors.navy,
    marginTop: 2,
    opacity: 0.85,
  },
  installAmountSel: { color: Colors.white },

  klarnaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  klarnaText: { fontSize: 11, color: "#14523B", flex: 1 },

  /* Card fields */
  cardFieldsRow: { flexDirection: "row", gap: 12 },

  /* Escrow info */
  escrowInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginVertical: 20,
  },
  escrowInfoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#14523B",
    marginBottom: 4,
  },
  escrowInfoDesc: {
    fontSize: 12.5,
    color: "#4A5568",
    lineHeight: 18,
  },

  /* Security row */
  securityRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
    flexWrap: "wrap",
  },
  securityText: { fontSize: 10, color: Colors.textMuted },
});
