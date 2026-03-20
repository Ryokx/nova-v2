import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";

interface EscrowStepperProps {
  currentStep: number; // 0-3
}

const steps = [
  { icon: "🔒", label: "Paiement\nbloqué" },
  { icon: "🔧", label: "Mission\nen cours" },
  { icon: "✓", label: "Nova\nvalide" },
  { icon: "💰", label: "Artisan\npayé" },
];

export function EscrowStepper({ currentStep }: EscrowStepperProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, i) => {
        const done = i <= currentStep;
        const active = i === currentStep;
        return (
          <React.Fragment key={i}>
            <View style={styles.step}>
              <View
                style={[
                  styles.circle,
                  done && styles.circleDone,
                  active && styles.circleActive,
                ]}
              >
                <Text style={[styles.circleText, done && styles.circleTextDone]}>
                  {done ? "✓" : step.icon}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  done && styles.labelDone,
                  active && styles.labelActive,
                ]}
              >
                {step.label}
              </Text>
            </View>
            {i < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  i < currentStep && styles.lineDone,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  step: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  circleDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  circleActive: {
    borderColor: Colors.forest,
    borderWidth: 2.5,
  },
  circleText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  circleTextDone: {
    color: Colors.white,
    fontFamily: "Manrope_700Bold",
  },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: Colors.textHint,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 13,
  },
  labelDone: { color: Colors.success },
  labelActive: { color: Colors.forest },
  line: {
    height: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 17,
    marginHorizontal: -4,
  },
  lineDone: {
    backgroundColor: Colors.success,
  },
});
