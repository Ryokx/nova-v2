import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Shadows } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type ConfirmModalType = "success" | "warning" | "danger" | "info";

export interface ConfirmModalAction {
  label: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "outline" | "ghost";
}

export interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  type?: ConfirmModalType;
  icon?: string;
  title: string;
  message: string;
  actions?: ConfirmModalAction[];
}

const typeConfig: Record<ConfirmModalType, { color: string; icon: string; bg: string }> = {
  success: { color: Colors.success, icon: "check-circle", bg: "rgba(34,200,138,0.08)" },
  warning: { color: "#D97706", icon: "alert-circle", bg: "rgba(245,166,35,0.08)" },
  danger: { color: Colors.red, icon: "alert-octagon", bg: "rgba(232,48,42,0.08)" },
  info: { color: Colors.forest, icon: "information", bg: "rgba(27,107,78,0.08)" },
};

export function ConfirmModal({
  visible,
  onClose,
  type = "info",
  icon,
  title,
  message,
  actions,
}: ConfirmModalProps) {
  const config = typeConfig[type];
  const iconName = icon || config.icon;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Top accent line colored by type */}
          <View style={[styles.topAccentLine, { backgroundColor: config.color }]} />

          {/* Icon */}
          <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
            <MaterialCommunityIcons name={iconName as any} size={28} color={config.color} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Actions */}
          <View style={styles.actionsRow}>
            {actions && actions.length > 0 ? (
              actions.map((action, i) => {
                const isOutline = action.variant === "outline" || action.variant === "ghost";
                const isDanger = action.variant === "danger";
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.actionBtn,
                      actions.length === 1 && { flex: 1 },
                      isOutline && styles.actionBtnOutline,
                      isDanger && styles.actionBtnDanger,
                      !isOutline && !isDanger && styles.actionBtnPrimary,
                    ]}
                    activeOpacity={0.85}
                    onPress={action.onPress}
                  >
                    <Text
                      style={[
                        styles.actionBtnText,
                        isOutline && styles.actionBtnTextOutline,
                        isDanger && styles.actionBtnTextDanger,
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary, { flex: 1 }]} onPress={onClose}>
                <Text style={styles.actionBtnText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Nova wordmark */}
          <View style={styles.novaWatermarkRow}>
            <Text style={styles.novaWatermarkText}>Nova</Text>
            <View style={styles.novaWatermarkDot} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,22,40,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: SCREEN_WIDTH - 56,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    paddingTop: 35,
    alignItems: "center",
    overflow: "hidden" as const,
    ...Shadows.lg,
  },
  topAccentLine: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  novaWatermarkRow: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    marginTop: 16,
    opacity: 0.3,
  },
  novaWatermarkText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 8,
    color: Colors.textHint,
    letterSpacing: -0.2,
  },
  novaWatermarkDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: Colors.gold,
    marginLeft: 0.5,
    marginTop: 0.5,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: Colors.navy,
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnPrimary: {
    backgroundColor: Colors.deepForest,
  },
  actionBtnOutline: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  actionBtnDanger: {
    backgroundColor: Colors.red,
  },
  actionBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.white,
  },
  actionBtnTextOutline: {
    color: Colors.navy,
  },
  actionBtnTextDanger: {
    color: Colors.white,
  },
});
