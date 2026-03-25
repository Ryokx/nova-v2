import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Button } from "../../components/ui";

const steps = [
  { icon: "file-check" as const, label: "Documents déposés", done: true },
  { icon: "shield-check" as const, label: "Vérification en cours", done: false, active: true },
  { icon: "eye" as const, label: "Profil visible", done: false },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PendingValidationScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="clock-outline" size={44} color={Colors.gold} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Inscription en cours de validation</Text>
        <Text style={styles.subtitle}>
          Notre équipe vérifie vos documents. Vous recevrez une notification de confirmation sous 24 à 48h. En attendant, vous pouvez naviguer sur votre compte.
        </Text>

        {/* Progress steps */}
        <View style={styles.stepsCard}>
          <View style={styles.stepsRow}>
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepDot,
                      s.done && styles.stepDotDone,
                      s.active && styles.stepDotActive,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={s.icon}
                      size={20}
                      color={s.done ? Colors.white : s.active ? Colors.gold : Colors.textMuted}
                    />
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      s.done && { color: Colors.forest },
                      s.active && { color: Colors.gold },
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
                {i < steps.length - 1 && (
                  <View style={[styles.stepLine, s.done && styles.stepLineDone]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="eye-off" size={20} color={Colors.gold} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Compte en attente de validation</Text>
            <Text style={styles.infoDesc}>
              Votre profil est invisible aux yeux des particuliers tant que vos documents n'ont pas été validés.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <Button
          title="Accéder à mon espace"
          onPress={() => navigation.replace("ArtisanTabs", {} as any)}
          size="lg"
          fullWidth
          style={{ marginTop: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 28,
    alignItems: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: "rgba(245,166,35,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 340,
  },
  stepsCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
    ...Shadows.sm,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  stepDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotDone: {
    backgroundColor: Colors.forest,
  },
  stepDotActive: {
    backgroundColor: "rgba(245,166,35,0.15)",
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  stepLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 14,
  },
  stepLine: {
    height: 2,
    width: 24,
    backgroundColor: Colors.border,
    borderRadius: 1,
    marginTop: 21,
  },
  stepLineDone: {
    backgroundColor: Colors.forest,
  },
  infoCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "rgba(245,166,35,0.05)",
    borderWidth: 1,
    borderColor: "rgba(245,166,35,0.2)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 2,
  },
  infoDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
