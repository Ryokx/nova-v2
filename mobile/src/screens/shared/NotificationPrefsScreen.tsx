import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

/* ── Types ── */
type AlertType = "missions" | "devis" | "paiements" | "urgences" | "rappels";
type ChannelType = "push" | "email" | "sms";

type AlertPrefs = Record<AlertType, boolean>;
type ChannelPrefs = Record<ChannelType, boolean>;

/* ── Pref row component ── */
function PrefRow({
  icon,
  label,
  description,
  value,
  onValueChange,
}: {
  icon: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.prefRow}>
      <View style={styles.prefRowLeft}>
        <Text style={styles.prefIcon}>{icon}</Text>
        <View style={styles.prefTextCol}>
          <Text style={styles.prefLabel}>{label}</Text>
          {description && (
            <Text style={styles.prefDesc}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.forest }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

/* ── Section card ── */
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function NotificationPrefsScreen({
  navigation,
}: RootStackScreenProps<"NotificationPreferences">) {
  /* Alert toggles */
  const [alerts, setAlerts] = useState<AlertPrefs>({
    missions: true,
    devis: true,
    paiements: true,
    urgences: true,
    rappels: false,
  });

  /* Channel toggles */
  const [channels, setChannels] = useState<ChannelPrefs>({
    push: true,
    email: true,
    sms: false,
  });

  const toggleAlert = (key: AlertType) =>
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleChannel = (key: ChannelType) =>
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Préférences de notifications</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Alert types */}
        <SectionCard title="Types d'alertes">
          <PrefRow
            icon={"��"}
            label="Missions"
            description="Nouvelles missions, mises à jour de statut"
            value={alerts.missions}
            onValueChange={() => toggleAlert("missions")}
          />
          <View style={styles.rowDivider} />
          <PrefRow
            icon={"��"}
            label="Devis"
            description="Devis reçus, signés, expirés"
            value={alerts.devis}
            onValueChange={() => toggleAlert("devis")}
          />
          <View style={styles.rowDivider} />
          <PrefRow
            icon={"��"}
            label="Paiements"
            description="Séquestre, versements, factures"
            value={alerts.paiements}
            onValueChange={() => toggleAlert("paiements")}
          />
          <View style={styles.rowDivider} />
          <PrefRow
            icon={"��"}
            label="Urgences"
            description="Demandes urgentes, interventions critiques"
            value={alerts.urgences}
            onValueChange={() => toggleAlert("urgences")}
          />
          <View style={styles.rowDivider} />
          <PrefRow
            icon={"⏰"}
            label="Rappels"
            description="Rendez-vous à venir, échéances"
            value={alerts.rappels}
            onValueChange={() => toggleAlert("rappels")}
          />
        </SectionCard>

        {/* Channels */}
        <SectionCard title="Canaux de notification">
          <PrefRow
            icon={"��"}
            label="Push"
            description="Notifications sur votre téléphone"
            value={channels.push}
            onValueChange={() => toggleChannel("push")}
          />
          <View style={styles.rowDivider} />
          <PrefRow
            icon={"✉️"}
            label="Email"
            description="Récapitulatifs et confirmations par email"
            value={channels.email}
            onValueChange={() => toggleChannel("email")}
          />
          <View style={styles.rowDivider} />
          <PrefRow
            icon={"��"}
            label="SMS"
            description="Alertes critiques par SMS"
            value={channels.sms}
            onValueChange={() => toggleChannel("sms")}
          />
        </SectionCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Styles ── */
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
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    textAlign: "center",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },

  /* Section card */
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },

  /* Pref row */
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  prefRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing.md,
  },
  prefIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  prefTextCol: {
    flex: 1,
  },
  prefLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  prefDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
    marginLeft: 38,
  },
});
