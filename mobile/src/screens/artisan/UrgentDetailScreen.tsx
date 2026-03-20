import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Button } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const interventionDetails = [
  { icon: "\uD83D\uDCCD", label: "Secteur", value: "Paris 9e \u2014 Quartier Clichy" },
  { icon: "\uD83D\uDD52", label: "Dur\u00E9e estim\u00E9e", value: "1h environ" },
  { icon: "\uD83D\uDCBC", label: "Cat\u00E9gorie", value: "Plomberie" },
];

const photos = ["Photo 1", "Photo 2"];

export function UrgentDetailScreen({
  navigation,
}: RootStackScreenProps<"UrgentDetail">) {
  const [accepted, setAccepted] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  if (accepted) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successCheck}>{"\u2713"}</Text>
          </View>
          <Text style={styles.successTitle}>Intervention accept\u00E9e !</Text>
          <Text style={styles.successDesc}>
            Les coordonn\u00E9es du client vous ont \u00E9t\u00E9 envoy\u00E9es.
          </Text>
          <Text style={styles.successSub}>
            Rendez-vous sur place d\u00E8s que possible.
          </Text>
          <Button
            title="Voir l'itin\u00E9raire"
            onPress={() => navigation.navigate("RDVDetail", { rdvId: "urgent-1" })}
            style={styles.successBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demande d'intervention</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgency banner — pulsing */}
        <Animated.View
          style={[styles.urgencyBanner, { transform: [{ scale: pulseAnim }] }]}
        >
          <Text style={styles.urgencyEmoji}>{"\u26A1"}</Text>
          <View>
            <Text style={styles.urgencyTitle}>Intervention urgente</Text>
            <Text style={styles.urgencySub}>Demande re\u00E7ue il y a 4 minutes</Text>
          </View>
        </Animated.View>

        {/* Intervention type */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Type d'intervention</Text>
          <Text style={styles.cardMainTitle}>Fuite d'eau urgente</Text>
          {interventionDetails.map((d, i) => (
            <View key={i} style={styles.detailRow}>
              <Text style={styles.detailIcon}>{d.icon}</Text>
              <Text style={styles.detailLabel}>{d.label}</Text>
              <Text style={styles.detailValue}>{d.value}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardSubTitle}>Description du probl\u00E8me</Text>
          <Text style={styles.descText}>
            Fuite importante sous l'\u00E9vier de la cuisine. L'eau coule en continu, le
            robinet d'arr\u00EAt est difficile d'acc\u00E8s. Le client a coup\u00E9 l'arriv\u00E9e d'eau
            g\u00E9n\u00E9rale en attendant.
          </Text>
        </View>

        {/* Photos */}
        <View style={styles.card}>
          <Text style={styles.cardSubTitle}>Photos jointes</Text>
          <View style={styles.photosRow}>
            {photos.map((p, i) => (
              <View key={i} style={styles.photoPlaceholder}>
                <Text style={styles.photoText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Remuneration */}
        <View style={styles.card}>
          <Text style={styles.cardSubTitle}>R\u00E9mun\u00E9ration</Text>
          <View style={styles.remuRow}>
            <Text style={styles.remuLabel}>Tarif horaire urgence</Text>
            <Text style={styles.remuValue}>85\u20AC/h</Text>
          </View>
          <View style={styles.remuRow}>
            <Text style={styles.remuLabel}>D\u00E9placement</Text>
            <Text style={styles.remuIncluded}>Inclus</Text>
          </View>
        </View>

        {/* Escrow info */}
        <View style={styles.escrowInfo}>
          <Text style={styles.escrowIcon}>{"\uD83D\uDD12"}</Text>
          <Text style={styles.escrowText}>
            Le paiement sera s\u00E9curis\u00E9 par s\u00E9questre Nova. Vous serez pay\u00E9 apr\u00E8s
            validation par nos \u00E9quipes.
          </Text>
        </View>

        {/* Anonymisation notice */}
        <View style={styles.anonNotice}>
          <Text style={styles.anonIcon}>{"\uD83D\uDEE1\uFE0F"}</Text>
          <Text style={styles.anonText}>
            L'identit\u00E9 et l'adresse exacte du client vous seront communiqu\u00E9es
            uniquement apr\u00E8s acceptation de l'intervention.
          </Text>
        </View>

        {/* CTAs */}
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => setAccepted(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.acceptText}>Accepter l'intervention</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refuseBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.refuseText}>Refuser</Text>
        </TouchableOpacity>
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
  backIcon: { fontSize: 24, color: Colors.forest, marginTop: -2 },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Urgency banner */
  urgencyBanner: {
    borderRadius: Radii.xl,
    padding: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.red,
  },
  urgencyEmoji: { fontSize: 22 },
  urgencyTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: Colors.white,
  },
  urgencySub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
  },

  /* Cards */
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  cardLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
    marginBottom: 4,
  },
  cardMainTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: Colors.navy,
    marginBottom: 12,
  },
  cardSubTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: Colors.navy,
    marginBottom: 8,
  },

  /* Detail rows */
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  detailIcon: { fontSize: 16 },
  detailLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    minWidth: 90,
  },
  detailValue: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },

  /* Description */
  descText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 20,
  },

  /* Photos */
  photosRow: { flexDirection: "row", gap: 8 },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  photoText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textHint,
  },

  /* Remuneration */
  remuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  remuLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
  },
  remuValue: {
    fontFamily: "DMMono_500Medium",
    fontSize: 16,
    color: Colors.navy,
  },
  remuIncluded: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.success,
  },

  /* Escrow */
  escrowInfo: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: Radii.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  escrowIcon: { fontSize: 16 },
  escrowText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#14523B",
    lineHeight: 18,
    flex: 1,
  },

  /* Anon notice */
  anonNotice: {
    backgroundColor: "rgba(138,149,163,0.06)",
    borderRadius: Radii.lg,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(138,149,163,0.1)",
  },
  anonIcon: { fontSize: 16 },
  anonText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.textHint,
    lineHeight: 17,
    flex: 1,
  },

  /* Accept button */
  acceptBtn: {
    height: 54,
    borderRadius: Radii.xl,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...Shadows.md,
  },
  acceptText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: Colors.white,
  },

  /* Refuse */
  refuseBtn: {
    height: 48,
    borderRadius: Radii.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  refuseText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: "#4A5568",
  },

  /* Success */
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    ...Shadows.lg,
  },
  successCheck: {
    fontSize: 36,
    color: Colors.white,
    fontFamily: "Manrope_700Bold",
  },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 6,
  },
  successDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 6,
  },
  successSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 24,
  },
  successBtn: {},
});
