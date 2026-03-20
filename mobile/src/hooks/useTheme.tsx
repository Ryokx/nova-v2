import React, { createContext, useContext, useState, useCallback } from "react";
import { Colors } from "../constants/theme";

interface ThemeColors {
  bg: string;
  card: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  textHint: string;
  // Keep brand colors unchanged
  deepForest: string;
  forest: string;
  sage: string;
  lightSage: string;
  gold: string;
  navy: string;
  red: string;
  success: string;
  white: string;
}

interface ThemeContextType {
  dark: boolean;
  toggleDark: () => void;
  c: ThemeColors;
}

const lightColors: ThemeColors = {
  bg: Colors.bgPage,
  card: Colors.white,
  surface: Colors.surface,
  border: Colors.border,
  text: Colors.navy,
  textSecondary: Colors.textSecondary,
  textHint: Colors.textHint,
  deepForest: Colors.deepForest,
  forest: Colors.forest,
  sage: Colors.sage,
  lightSage: Colors.lightSage,
  gold: Colors.gold,
  navy: Colors.navy,
  red: Colors.red,
  success: Colors.success,
  white: Colors.white,
};

const darkColors: ThemeColors = {
  bg: "#0A1628",
  card: "#111D2E",
  surface: "#1A2A3C",
  border: "#243447",
  text: "#F0F4F2",
  textSecondary: "#8A95A3",
  textHint: "#5A6878",
  deepForest: Colors.deepForest,
  forest: Colors.forest,
  sage: Colors.sage,
  lightSage: Colors.lightSage,
  gold: Colors.gold,
  navy: "#F0F4F2",
  red: Colors.red,
  success: Colors.success,
  white: Colors.white,
};

const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggleDark: () => {},
  c: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const toggleDark = useCallback(() => setDark((d) => !d), []);
  const c = dark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, c }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
