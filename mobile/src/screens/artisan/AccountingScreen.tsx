import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

interface Service {
  id: string;
  name: string;
  desc: string;
  color: string;
  letter: string;
}

const services: Service[] = [
  { id: "pennylane", name: "Pennylane", desc: "Comptabilité tout-en-un pour TPE/PME", color: "#6366F1", letter: "P" },
  { id: "indy", name: "Indy", desc: "Comptabilité automatisée pour indépendants", color: "#3B82F6", letter: "I" },
  { id: "quickbooks", name: "QuickBooks", desc: "Comptabilité et facturation internationale", color: "#2CA01C", letter: "Q" },
  { id: "tiime", name: "Tiime", desc: "Comptabilité gratuite pour auto-entrepreneurs", color: "#0A1628", letter: "T" },
];

const syncData = [
  { label: "Factures émises", desc: "Envoyées automatiquement à votre logiciel" },
  { label: "Paiements reçus", desc: "Montants, dates et commissions Nova" },
  { label: "Commissions Nova", desc: "Ligne de charge séparée pour la comptabilité" },
  { label: "TVA collectée", desc: "Calcul automatique par taux applicable" },
];

const monthlyRecap = [
  { label: "Revenus bruts", value: "4 820,00 €", color: Colors.navy, bold: false },
  { label: "Commission Nova", value: "- 482,00 €", color: Colors.red, bold: false },
  { label: "Revenus nets", value: "4 338,00 €", color: Colors.forest, bold: true },
  { label: "TVA collectée", value: "803,33 €", color: Colors.textSecondary, bold: false },
  { label: "Nombre de factures", value: "12", color: Colors.textSecondary, bold: false },
];

export function AccountingScreen({
  navigation,
}: RootStackScreenProps<"Accounting">) {
  const [connected, setConnected] = useState<Record<string, boolean>>({
    pennylane: false,
    indy: false,
    quickbooks: false,
    tiime: false,
  });
  const [autoExport, setAutoExport] = useState(true);
  const [accountantEmail, setAccountantEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const toggleConnect = (id: string) => {
    const wasConnected = connected[id];
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!wasConnected) {
      setShowSuccess(id);
      setTimeout(() => setShowSuccess(null), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comptabilité</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Explainer banner */}
        <View style={styles.explainer}>
          <Text style={styles.explainerIcon}><MaterialCommunityIcons name="calculator" size={20} color={Colors.forest} /></Text>
          <View style={styles.explainerContent}>
            <Text style={styles.explainerTitle}>Simplifiez votre comptabilité</Text>
            <Text style={styles.explainerDesc}>
              Connectez votre logiciel comptable. Vos factures, paiements et commissions sont envoyés automatiquement.
            </Text>
          </View>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Logiciels compatibles</Text>
        {services.map((s) => {
          const isConn = connected[s.id];
          return (
            <View
              key={s.id}
              style={[
                styles.serviceCard,
                isConn && styles.serviceCardConnected,
              ]}
            >
              <View style={styles.serviceRow}>
                <View style={[styles.serviceLogo, { backgroundColor: s.color }]}>
                  <Text style={styles.serviceLogoText}>{s.letter}</Text>
                </View>
                <View style={styles.serviceInfo}>
                  <View style={styles.serviceNameRow}>
                    <Text style={styles.serviceName}>{s.name}</Text>
                    {isConn && (
                      <View style={styles.connectedBadge}>
                        <Text style={styles.connectedText}>CONNECTÉ</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.serviceDesc}>{s.desc}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.connectBtn,
                    isConn && styles.disconnectBtn,
                  ]}
                  onPress={() => toggleConnect(s.id)}
                >
                  <Text
                    style={[
                      styles.connectBtnText,
                      isConn && styles.disconnectBtnText,
                    ]}
                  >
                    {showSuccess === s.id
                      ? "✓ Connecté"
                      : isConn
                      ? "Déconnecter"
                      : "Connecter"}
                  </Text>
                </TouchableOpacity>
              </View>

              {isConn && (
                <View style={styles.syncInfo}>
                  <View>
                    <Text style={styles.syncLabel}>Dernière synchronisation</Text>
                    <Text style={styles.syncDate}>Aujourd'hui à 14:32</Text>
                  </View>
                  <View style={styles.syncStatus}>
                    <Text style={styles.syncStatusIcon}>{"✓"}</Text>
                    <Text style={styles.syncStatusText}>À jour</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* Auto-export */}
        <View style={styles.autoExportCard}>
          <View style={styles.autoExportHeader}>
            <View style={styles.autoExportInfo}>
              <Text style={styles.autoExportTitle}>Export automatique</Text>
              <Text style={styles.autoExportDesc}>
                Envoyer automatiquement chaque nouvelle facture
              </Text>
            </View>
            <Switch
              value={autoExport}
              onValueChange={setAutoExport}
              trackColor={{ false: Colors.border, true: Colors.forest }}
              thumbColor={Colors.white}
            />
          </View>

          {/* Accountant email input */}
          {autoExport && (
            <View style={styles.accountantSection}>
              <Text style={styles.accountantTitle}>Email du comptable</Text>
              <Text style={styles.accountantDesc}>
                Les nouvelles factures seront envoyées chaque jour à 10h à cette adresse.
              </Text>
              <View style={styles.accountantInputRow}>
                <TextInput
                  style={styles.accountantInput}
                  placeholder="comptable@cabinet.fr"
                  placeholderTextColor={Colors.textHint}
                  value={accountantEmail}
                  onChangeText={(text) => {
                    setAccountantEmail(text);
                    setEmailSaved(false);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={[styles.accountantSaveBtn, (!accountantEmail || emailSaved) && { opacity: 0.5 }]}
                  disabled={!accountantEmail || emailSaved}
                  onPress={() => {
                    setEmailSaved(true);
                    Alert.alert(
                      "Enregistré",
                      `Les factures seront envoyées à ${accountantEmail} tous les jours à 10h si de nouvelles factures sont disponibles.`
                    );
                  }}
                >
                  <Text style={styles.accountantSaveBtnText}>
                    {emailSaved ? "✓ Enregistré" : "Enregistrer"}
                  </Text>
                </TouchableOpacity>
              </View>
              {emailSaved && (
                <View style={styles.accountantConfirm}>
                  <MaterialCommunityIcons name="check-circle" size={14} color={Colors.success} />
                  <Text style={styles.accountantConfirmText}>
                    Envoi quotidien à 10h activé — uniquement si nouvelles factures
                  </Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.syncDataTitle}>Données synchronisées</Text>
          {syncData.map((d, i) => (
            <View
              key={i}
              style={[styles.syncDataRow, i > 0 && styles.syncDataRowBorder]}
            >
              <Text style={styles.syncCheckIcon}>{"✓"}</Text>
              <View style={styles.syncDataInfo}>
                <Text style={styles.syncDataLabel}>{d.label}</Text>
                <Text style={styles.syncDataDesc}>{d.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Manual export */}
        <Text style={styles.sectionTitleSmall}>Export manuel</Text>
        <View style={styles.exportRow}>
          {[
            { label: "Export CSV", icon: "file-document", desc: "Toutes les données" },
            { label: "Export PDF", icon: "file-document", desc: "Récapitulatif mensuel" },
          ].map((e, i) => (
            <TouchableOpacity key={i} style={styles.exportBtn}>
              <MaterialCommunityIcons name={e.icon as any} size={22} color={Colors.forest} />
              <Text style={styles.exportLabel}>{e.label}</Text>
              <Text style={styles.exportDesc}>{e.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Monthly recap */}
        <View style={styles.recapCard}>
          <Text style={styles.recapTitle}>Récapitulatif mars 2026</Text>
          {monthlyRecap.map((r, i) => (
            <View
              key={i}
              style={[styles.recapRow, i > 0 && styles.recapRowBorder]}
            >
              <Text style={styles.recapLabel}>{r.label}</Text>
              <Text
                style={[
                  styles.recapValue,
                  { color: r.color },
                  r.bold && styles.recapValueBold,
                ]}
              >
                {r.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { fontSize: 24, color: Colors.forest, marginTop: -2 },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Explainer */
  explainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 20,
  },
  explainerIcon: { fontSize: 20 },
  explainerContent: { flex: 1 },
  explainerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#14523B",
    marginBottom: 2,
  },
  explainerDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#4A5568",
    lineHeight: 18,
  },

  /* Section title */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.navy,
    marginBottom: 12,
  },
  sectionTitleSmall: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 10,
  },

  /* Service cards */
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.06)",
  },
  serviceCardConnected: {
    borderWidth: 2,
    borderColor: Colors.forest,
  },
  serviceRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  serviceLogo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceLogoText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 18,
    color: Colors.white,
  },
  serviceInfo: { flex: 1 },
  serviceNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  serviceName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  connectedBadge: {
    backgroundColor: "rgba(34,200,138,0.1)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  connectedText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9,
    color: Colors.success,
  },
  serviceDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  connectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.forest,
  },
  disconnectBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  connectBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.white,
  },
  disconnectBtnText: { color: Colors.red },

  syncInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  syncLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#14523B",
  },
  syncDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: Colors.textSecondary,
  },
  syncStatus: { flexDirection: "row", alignItems: "center", gap: 6 },
  syncStatusIcon: { fontSize: 12, color: Colors.success },
  syncStatusText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    color: Colors.success,
  },

  /* Auto-export */
  autoExportCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.06)",
  },
  autoExportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  autoExportInfo: { flex: 1, marginRight: 12 },
  autoExportTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  autoExportDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  /* Accountant email */
  accountantSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 14,
    marginBottom: 14,
  },
  accountantTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: Colors.navy,
    marginBottom: 2,
  },
  accountantDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  accountantInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  accountantInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.navy,
  },
  accountantSaveBtn: {
    backgroundColor: Colors.forest,
    borderRadius: Radii.md,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  accountantSaveBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.white,
  },
  accountantConfirm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  accountantConfirmText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.success,
    flex: 1,
  },

  syncDataTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: Colors.navy,
    marginBottom: 8,
  },
  syncDataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  syncDataRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  syncCheckIcon: { fontSize: 14, color: Colors.success },
  syncDataInfo: { flex: 1 },
  syncDataLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.navy,
  },
  syncDataDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: Colors.textSecondary,
  },

  /* Manual export */
  exportRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  exportBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exportIcon: { fontSize: 22, marginBottom: 6 },
  exportLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: Colors.navy,
  },
  exportDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: Colors.textSecondary,
  },

  /* Monthly recap */
  recapCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  recapTitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  recapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  recapRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  recapLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recapValue: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
  },
  recapValueBold: {
    fontFamily: "DMMono_500Medium",
    fontSize: 15,
  },
});
