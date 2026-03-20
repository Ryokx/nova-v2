import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "./Card";
import { Colors } from "../../constants/theme";

interface KPICardProps {
  label: string;
  value: string;
  icon?: string;
  sub?: string;
  trend?: { value: string; positive: boolean };
}

export function KPICard({ label, value, icon, sub, trend }: KPICardProps) {
  return (
    <Card style={styles.card} padding={14}>
      <View style={styles.header}>
        {icon && (
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}
        {trend && (
          <Text
            style={[
              styles.trend,
              { color: trend.positive ? Colors.success : Colors.red },
            ]}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </Text>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 16 },
  trend: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
  },
  value: {
    fontFamily: "DMMono_700Bold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 2,
  },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sub: {
    fontFamily: "DMMono_500Medium",
    fontSize: 10,
    color: Colors.textHint,
    marginTop: 2,
  },
});
