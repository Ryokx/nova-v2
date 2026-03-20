import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Radii } from "../../constants/theme";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "certified" | "gold";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: Colors.surface, text: Colors.forest },
  success: { bg: "#DCFCE7", text: "#16A34A" },
  warning: { bg: "#FEF3C7", text: "#D97706" },
  danger: { bg: "#FEE2E2", text: Colors.red },
  info: { bg: Colors.surface, text: Colors.forest },
  certified: { bg: "#FEF3C7", text: "#92400E" },
  gold: { bg: "#FEF3C7", text: "#D97706" },
};

export function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  const v = variantStyles[variant];
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: v.bg,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 3 : 5,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: v.text, fontSize: isSmall ? 10.5 : 12 },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radii.full,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.2,
  },
});
