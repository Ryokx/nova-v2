import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TextInputProps } from "react-native";
import { Colors, Radii } from "../../constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={Colors.textHint}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10, width: "100%" },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.lg,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputFocused: {
    borderColor: Colors.forest,
    shadowColor: Colors.forest,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  inputError: {
    borderColor: Colors.red,
  },
  error: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.red,
    marginTop: 4,
  },
});
