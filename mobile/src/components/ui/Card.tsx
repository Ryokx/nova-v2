import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors, Radii, Shadows } from "../../constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = 16 }: CardProps) {
  return (
    <View style={[styles.card, Shadows.sm, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
