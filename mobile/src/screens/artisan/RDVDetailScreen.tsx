import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar, Button } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const rdv = {
  client: "Pierre M.",
  initials: "PM",
  type: "Installation robinet",
  category: "Plomberie",
  date: "17 mars 2026",
  time: "14h00 \u2013 16h00",
  status: "Confirm\u00E9",
  statusColor: Colors.forest,
  address: "23 rue du Faubourg Saint-Antoine",
  city: "75011 Paris",
  floor: "3e \u00E9tage, code 45B12",
  phone: "06 45 67 89 01",
  notes:
    "Robinet de cuisine \u00E0 remplacer. Le client fournit le nouveau robinet (Grohe).",
  amount: "195,00\u20AC",
  lat: 48.8529,
  lng: 2.3706,
};

const details = [
  { icon: "\uD83D\uDD52", label: "Horaire", value: rdv.time },
  { icon: "\uD83D\uDCBC", label: "Cat\u00E9gorie", value: rdv.category },
  { icon: "\uD83D\uDCC4", label: "Montant devis", value: rdv.amount },
];

export function RDVDetailScreen({
  navigation,
}: RootStackScreenProps<"RDVDetail">) {
  const wazeUrl = `https://waze.com/ul?ll=${rdv.lat},${rdv.lng}&navigate=yes`;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${rdv.lat},${rdv.lng}`;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>D\u00E9tail du rendez-vous</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status bar */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: rdv.statusColor + "18" }]}>
            <Text style={[styles.statusText, { color: rdv.statusColor }]}>
              {rdv.status}
            </Text>
          </View>
          <Text style={styles.statusDate}>{rdv.date}</Text>
        </View>

        {/* Client card */}
        <View style={styles.clientCard}>
          <Avatar name={rdv.client} size={50} radius={18} />
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{rdv.client}</Text>
            <Text style={styles.clientType}>{rdv.type}</Text>
          </View>
          <TouchableOpacity
            style={styles.phoneBtn}
            onPress={() => Linking.openURL(`tel:${rdv.phone}`)}
          >
            <Text style={styles.phoneEmoji}>{"\uD83D\uDCDE"}</Text>
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={styles.detailCard}>
          {details.map((d, i) => (
            <View
              key={i}
              style={[
                styles.detailRow,
                i < details.length - 1 && styles.detailRowBorder,
              ]}
            >
              <Text style={styles.detailIcon}>{d.icon}</Text>
              <Text style={styles.detailLabel}>{d.label}</Text>
              <Text style={styles.detailValue}>{d.value}</Text>
            </View>
          ))}
        </View>

        {/* Map placeholder */}
        <View style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>{"\uD83D\uDDFA\uFE0F"}</Text>
            <Text style={styles.mapStreet}>Rue du Fg Saint-Antoine</Text>
          </View>
          <View style={styles.mapInfo}>
            <Text style={styles.mapAddress}>{rdv.address}</Text>
            <Text style={styles.mapCity}>{rdv.city}</Text>
            <Text style={styles.mapFloor}>{rdv.floor}</Text>
          </View>
        </View>

        {/* Navigation buttons */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => Linking.openURL(wazeUrl)}
          >
            <Text style={styles.navIcon}>{"\uD83E\uDDED"}</Text>
            <Text style={styles.navLabel}>Ouvrir dans Waze</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => Linking.openURL(gmapsUrl)}
          >
            <Text style={styles.navIcon}>{"\uD83D\uDCCD"}</Text>
            <Text style={styles.navLabel}>Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>Notes du client</Text>
          <Text style={styles.notesText}>{rdv.notes}</Text>
        </View>

        {/* Escrow info */}
        <View style={styles.escrowInfo}>
          <Text style={styles.escrowIcon}>{"\uD83D\uDD12"}</Text>
          <Text style={styles.escrowText}>
            Paiement de {rdv.amount} bloqu\u00E9 en s\u00E9questre Nova
          </Text>
        </View>

        {/* Actions */}
        <Button
          title="Confirmer mon arriv\u00E9e"
          onPress={() => Alert.alert("Confirm\u00e9", "Votre arriv\u00e9e a \u00e9t\u00e9 confirm\u00e9e au client.")}
          fullWidth
          size="lg"
        />
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Annuler le rendez-vous</Text>
        </TouchableOpacity>
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

  /* Status */
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radii.md,
  },
  statusText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
  },
  statusDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },

  /* Client card */
  clientCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  clientInfo: { flex: 1 },
  clientName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: Colors.navy,
  },
  clientType: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
  },
  phoneBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(34,200,138,0.08)",
    borderWidth: 1,
    borderColor: "rgba(34,200,138,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneEmoji: { fontSize: 18 },

  /* Detail card */
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  detailIcon: { fontSize: 16 },
  detailLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    minWidth: 90,
  },
  detailValue: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },

  /* Map */
  mapCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: "#E8EDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: { fontSize: 40 },
  mapStreet: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#A0AAB8",
    marginTop: 4,
  },
  mapInfo: { padding: 14, paddingHorizontal: 16 },
  mapAddress: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 2,
  },
  mapCity: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 2,
  },
  mapFloor: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },

  /* Nav buttons */
  navRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  navBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radii.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navIcon: { fontSize: 16 },
  navLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },

  /* Notes */
  notesCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  notesTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
    marginBottom: 6,
  },
  notesText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 20,
  },

  /* Escrow */
  escrowInfo: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  escrowIcon: { fontSize: 16 },
  escrowText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#14523B",
    lineHeight: 17,
    flex: 1,
  },

  /* Cancel */
  cancelBtn: {
    height: 48,
    borderRadius: Radii.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  cancelText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.red,
  },
});
