import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

/* ---- devis line items ---- */
const lineItems = [
  { label: "Remplacement siphon PVC", price: "45 \€" },
  { label: "Joint flexible inox", price: "25 \€" },
  { label: "Main d'\œuvre (2h)", price: "180 \€" },
  { label: "D\éplacement", price: "40 \€" },
  { label: "TVA (10%)", price: "30 \€" },
];

export function SignDevisScreen({
  navigation,
}: RootStackScreenProps<"SignDevis">) {
  const [signed, setSigned] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [pathData, setPathData] = useState("");
  const currentPath = useRef("");

  /* ---- Signature handlers ---- */
  const handleTouchStart = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    currentPath.current = `M${locationX},${locationY}`;
    setHasDrawn(true);
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    currentPath.current += ` L${locationX},${locationY}`;
    setPathData((prev) => {
      // Rebuild full path from previous completed strokes + current stroke
      const prevStrokes = prev.split("M").filter(Boolean);
      const currentStroke = currentPath.current;
      return prevStrokes.map((s) => "M" + s).join(" ") + " " + currentStroke;
    });
  };

  const handleTouchEnd = () => {
    // Finalize current stroke into pathData
    setPathData((prev) => prev);
    currentPath.current = "";
  };

  const clearSignature = () => {
    setPathData("");
    setHasDrawn(false);
    currentPath.current = "";
  };

  /* ---- Success state ---- */
  if (signed) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <Text style={styles.successCheck}>{"\✓"}</Text>
        </View>
        <Text style={styles.successTitle}>Devis sign\é !</Text>
        <Text style={styles.successDesc}>
          Il ne reste plus qu'\à bloquer le paiement en s\équestre pour
          confirmer l'intervention.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryBtnText}>
            Proc\éder au paiement \— 320,00 \€
          </Text>
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
          <Text style={styles.backArrow}>{"\‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Signer le devis</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Devis summary card */}
        <View style={styles.devisCard}>
          <View style={styles.devisHeader}>
            <View>
              <Text style={styles.devisRef}>Devis #D-2026-089</Text>
              <Text style={styles.devisTitle}>
                R\éparation fuite sous \évier
              </Text>
            </View>
            <Text style={styles.devisTotal}>320 \€</Text>
          </View>
          {lineItems.map((item, i) => (
            <View key={i} style={styles.lineItem}>
              <Text style={styles.lineLabel}>{item.label}</Text>
              <Text style={styles.linePrice}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Artisan info */}
        <View style={styles.artisanRow}>
          <Avatar name="Jean-Michel Petit" size={40} radius={14} />
          <View>
            <Text style={styles.artisanName}>Jean-Michel Petit</Text>
            <Text style={styles.artisanSub}>
              Plombier {"\•"} Certifi\é Nova #4521
            </Text>
          </View>
        </View>

        {/* Signature zone */}
        <Text style={styles.sectionLabel}>Votre signature</Text>
        <View style={styles.sigContainer}>
          <View
            style={styles.sigCanvas}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleTouchStart}
            onResponderMove={handleTouchMove}
            onResponderRelease={handleTouchEnd}
          >
            <Svg width="100%" height={140}>
              {pathData ? (
                <Path
                  d={pathData}
                  stroke={Colors.navy}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  fill="none"
                />
              ) : null}
            </Svg>
            {!hasDrawn && (
              <View style={styles.sigPlaceholder} pointerEvents="none">
                <Text style={styles.sigPlaceholderText}>
                  Signez ici avec votre doigt
                </Text>
              </View>
            )}
          </View>
          {hasDrawn && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={clearSignature}
              activeOpacity={0.85}
            >
              <Text style={styles.clearBtnText}>Effacer</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Legal notice */}
        <Text style={styles.legalText}>
          En signant ce devis, vous acceptez les conditions de l'intervention et
          autorisez le blocage de 320,00 \€ en s\équestre. Ce montant sera
          lib\ér\é \à la validation de l'intervention.
        </Text>

        {/* Submit button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            !hasDrawn && styles.submitBtnDisabled,
          ]}
          activeOpacity={hasDrawn ? 0.85 : 1}
          onPress={() => hasDrawn && setSigned(true)}
          disabled={!hasDrawn}
        >
          <Text style={styles.lockIcon}>{"\�\�"}</Text>
          <Text
            style={[
              styles.submitBtnText,
              !hasDrawn && styles.submitBtnTextDisabled,
            ]}
          >
            Signer et bloquer le paiement
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "700" },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 20,
    color: Colors.navy,
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Devis card */
  devisCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  devisHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  devisRef: { fontSize: 12, color: Colors.textSecondary },
  devisTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  devisTotal: {
    fontFamily: "DMMono_500Medium",
    fontSize: 20,
    color: Colors.forest,
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  lineLabel: { fontSize: 12, color: "#4A5568" },
  linePrice: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
    color: Colors.navy,
  },

  /* Artisan row */
  artisanRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    padding: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  artisanName: { fontSize: 14, fontFamily: "DMSans_600SemiBold", color: Colors.navy },
  artisanSub: { fontSize: 11, color: Colors.textSecondary },

  /* Signature */
  sectionLabel: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
    marginBottom: 10,
  },
  sigContainer: { position: "relative", marginBottom: 12 },
  sigCanvas: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  sigPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  sigPlaceholderText: { fontSize: 13, color: Colors.textSecondary },
  clearBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(232,48,42,0.1)",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  clearBtnText: { fontSize: 10, color: Colors.red, fontFamily: "DMSans_600SemiBold" },

  /* Legal */
  legalText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 20,
  },

  /* Submit */
  submitBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.deepForest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...Shadows.md,
  },
  submitBtnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  lockIcon: { fontSize: 14 },
  submitBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  submitBtnTextDisabled: { color: Colors.textSecondary },

  /* Success */
  successRoot: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successCheck: { fontSize: 36, color: Colors.white },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryBtn: {
    width: "100%",
    height: 52,
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
