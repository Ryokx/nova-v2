/**
 * Fake loading screen with Nova logo and animated progress bar.
 * Displayed for ~2.5s before navigating to the main app.
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Colors } from "../constants/theme";

const { width } = Dimensions.get("window");

interface SplashLoadingProps {
  onFinish: () => void;
}

export default function SplashLoading({ onFinish }: SplashLoadingProps) {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence: logo fade in + scale -> progress bar -> text -> fade out
    Animated.sequence([
      // 1. Logo appear
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // 2. Progress bar fill
      Animated.timing(barWidth, { toValue: 1, duration: 1500, useNativeDriver: false }),
      // 3. Tagline appear
      Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      // 4. Hold briefly
      Animated.delay(300),
      // 5. Fade everything out
      Animated.timing(fadeOut, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoN}>N</Text>
        </View>
        <Text style={styles.logoText}>Nova</Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.barContainer}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: barWidth.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width * 0.5],
              }),
            },
          ]}
        />
      </View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: textOpacity }]}>
        Artisans certifies, paiement securise
      </Animated.Text>

      {/* Version */}
      <Text style={styles.version}>v1.0.0</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.deepForest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 16,
  },
  logoN: {
    fontSize: 36,
    fontFamily: "Manrope_800ExtraBold",
    color: "#fff",
    letterSpacing: -1,
  },
  logoText: {
    fontSize: 32,
    fontFamily: "Manrope_800ExtraBold",
    color: Colors.navy,
    letterSpacing: -0.5,
  },
  barContainer: {
    width: width * 0.5,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: "hidden",
    marginBottom: 20,
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: Colors.forest,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: Colors.textSecondary,
    textAlign: "center",
  },
  version: {
    position: "absolute",
    bottom: 40,
    fontSize: 11,
    fontFamily: "DMMono_400Regular",
    color: Colors.textHint,
  },
});
