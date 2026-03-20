import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows, Spacing } from "../constants/theme";

/**
 * Factory to create placeholder screens for routes not yet implemented.
 * Each placeholder shows a back button, screen name, and "coming soon" label.
 */
export function createPlaceholderScreen(name: string, label: string) {
  return function PlaceholderScreen({ navigation }: any) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>{"\u2039"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{label}</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.body}>
          <Text style={styles.icon}>{"\uD83D\uDEA7"}</Text>
          <Text style={styles.title}>{label}</Text>
          <Text style={styles.subtitle}>Cet ecran est en cours de developpement.</Text>
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.text,
    marginTop: -2,
  },
  headerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
