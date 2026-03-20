import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

const cards = [
  {
    id: 0,
    type: "Visa" as const,
    last4: "6411",
    expiry: "09/28",
    holder: "Sophie Lef\èvre",
  },
  {
    id: 1,
    type: "Mastercard" as const,
    last4: "8923",
    expiry: "03/27",
    holder: "Sophie Lef\èvre",
  },
];

const otherMethods = [
  {
    label: "Apple Pay",
    sub: "Configur\é",
    icon: "\",
    active: true,
  },
  {
    label: "Virement bancaire",
    sub: "RIB non renseign\é",
    icon: "\�\�",
    active: false,
  },
];

function CardIcon({ type }: { type: "Visa" | "Mastercard" }) {
  const isVisa = type === "Visa";
  return (
    <View
      style={[
        styles.cardIcon,
        { backgroundColor: isVisa ? "#1A1F71" : "#EB001B" },
      ]}
    >
      <Text style={styles.cardIconText}>{isVisa ? "VISA" : "MC"}</Text>
    </View>
  );
}

export function PaymentMethodsScreen({
  navigation,
}: RootStackScreenProps<"PaymentMethods">) {
  const [defaultCard, setDefaultCard] = useState(0);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"\‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moyens de paiement</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saved cards */}
        <Text style={styles.sectionTitle}>Cartes enregistr\ées</Text>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.cardRow,
              defaultCard === card.id && styles.cardRowSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => setDefaultCard(card.id)}
          >
            <CardIcon type={card.type} />
            <View style={{ flex: 1 }}>
              <View style={styles.cardNameRow}>
                <Text style={styles.cardName}>
                  {card.type} {"\•\•\•\•"} {card.last4}
                </Text>
                {defaultCard === card.id && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Par d\éfaut</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardSub}>
                {card.holder} {"\•"} Exp. {card.expiry}
              </Text>
            </View>
            <View
              style={[
                styles.radio,
                defaultCard === card.id && styles.radioSelected,
              ]}
            />
          </TouchableOpacity>
        ))}

        {/* Add card */}
        <TouchableOpacity style={styles.addCardBtn} activeOpacity={0.85}>
          <Text style={styles.addCardPlus}>+</Text>
          <Text style={styles.addCardText}>Ajouter une carte</Text>
        </TouchableOpacity>

        {/* Other methods */}
        <Text style={styles.sectionTitle}>Autres moyens</Text>
        <View style={styles.otherCard}>
          {otherMethods.map((m, i) => (
            <TouchableOpacity
              key={m.label}
              style={[
                styles.otherRow,
                i < otherMethods.length - 1 && styles.otherRowBorder,
              ]}
              activeOpacity={0.85}
            >
              <View style={styles.otherIcon}>
                <Text style={{ fontSize: 18 }}>{m.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.otherLabel}>{m.label}</Text>
                <Text
                  style={[
                    styles.otherSub,
                    m.active && { color: Colors.success },
                  ]}
                >
                  {m.sub}
                </Text>
              </View>
              <Text style={styles.chevron}>{"\›"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security info */}
        <View style={styles.securityInfo}>
          <Text style={{ fontSize: 14 }}>{"\�\�"}</Text>
          <Text style={styles.securityText}>
            Vos donn\ées bancaires sont chiffr\ées et s\écuris\ées.
            Nova ne stocke pas vos num\éros de carte complets.
          </Text>
        </View>
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 12 },

  sectionTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
    marginBottom: 12,
  },

  /* Card rows */
  cardRow: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  cardRowSelected: {
    borderWidth: 2,
    borderColor: Colors.forest,
  },
  cardIcon: {
    width: 48,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: Colors.white,
    letterSpacing: 0.5,
  },
  cardNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  cardName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  defaultBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(34,200,138,0.08)",
  },
  defaultBadgeText: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.success,
  },
  cardSub: { fontSize: 12, color: Colors.textHint },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#B0B0BB",
  },
  radioSelected: {
    borderWidth: 6,
    borderColor: Colors.forest,
  },

  /* Add card */
  addCardBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  addCardPlus: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: Colors.forest,
  },
  addCardText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.forest,
  },

  /* Other methods */
  otherCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    marginBottom: 20,
  },
  otherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  otherRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  otherIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  otherLabel: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: Colors.navy,
  },
  otherSub: {
    fontSize: 12,
    color: Colors.textHint,
    marginTop: 1,
  },
  chevron: { fontSize: 14, color: "#B0B0BB" },

  /* Security */
  securityInfo: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  securityText: {
    fontSize: 12,
    color: "#4A5568",
    lineHeight: 19,
    flex: 1,
  },
});
