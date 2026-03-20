// Nova Design System — Mobile
export const Colors = {
  // Primary
  deepForest: "#0A4030",
  forest: "#1B6B4E",
  sage: "#2D9B6E",
  lightSage: "#8ECFB0",

  // Accent
  gold: "#F5A623",
  navy: "#0A1628",
  red: "#E8302A",
  success: "#22C88A",

  // Surfaces
  bgPage: "#F5FAF7",
  surface: "#E8F5EE",
  border: "#D4EBE0",
  white: "#FFFFFF",
  black: "#000000",

  // Text
  text: "#0A1628",
  textSecondary: "#6B7280",
  textHint: "#8A95A3",
  textMuted: "#7EA894",

  // Dark mode
  dark: {
    bg: "#0A1628",
    card: "#111D2E",
    surface: "#1A2A3C",
    border: "#243447",
    text: "#F0F4F2",
    textSecondary: "#8A95A3",
  },
} as const;

export const Fonts = {
  heading: "Manrope",
  body: "DMSans",
  mono: "DMMono",
} as const;

export const FontWeights = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

export const Radii = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  "2xl": 18,
  "3xl": 20,
  full: 9999,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;

export const Shadows = {
  sm: {
    shadowColor: "#0A1628",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  md: {
    shadowColor: "#0A1628",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: "#0A1628",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
} as const;
