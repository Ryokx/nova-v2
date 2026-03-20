import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors, Radii } from "../../constants/theme";

interface AvatarProps {
  name: string;
  size?: number;
  uri?: string;
  radius?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ name, size = 40, uri, radius }: AvatarProps) {
  const r = radius ?? Math.round(size * 0.35);
  const fontSize = Math.round(size * 0.38);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: r }]}
      />
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: r }]}>
      <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: Colors.white,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.5,
  },
  image: {
    backgroundColor: Colors.surface,
  },
});
