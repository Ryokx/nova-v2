import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

export function ContractDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"ContractDetail">) {
  const { name, icon, price, artisan, since, freq } = route.params;
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleDownload = () => {
    Alert.alert("Téléchargement", "Le contrat a été téléchargé au format PDF dans vos fichiers.");
  };

  const handleSendEmail = () => {
    Alert.alert(
      "Envoyer par email",
      "Le contrat sera envoyé à votre adresse email enregistrée.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Envoyer", onPress: () => Alert.alert("Envoyé ✓", "Le contrat a été envoyé à sophie.lefevre@email.com") },
      ]
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon contrat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Contract card */}
        <View style={styles.contractCard}>
          <View style={styles.contractHeader}>
            <View style={styles.contractIconWrap}>
              <MaterialCommunityIcons name={icon as any} size={24} color={Colors.forest} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contractName}>{name}</Text>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Actif</Text>
              </View>
            </View>
          </View>

          <View style={styles.contractDetails}>
            {[
              ["Artisan", artisan],
              ["Montant", `${price}/an`],
              ["Fréquence", freq],
              ["Date de souscription", since],
              ["Engagement", "Sans engagement"],
              ["Prochaine échéance", "20 mars 2027"],
              ["Référence", `CONT-2026-${Math.floor(Math.random() * 900 + 100)}`],
            ].map(([label, value], i) => (
              <View key={label} style={[styles.detailRow, i > 0 && styles.detailRowBorder]}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={[
                  styles.detailValue,
                  label === "Engagement" && { color: Colors.success },
                ]}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity style={styles.actionCard} onPress={() => setPreviewVisible(true)}>
          <View style={[styles.actionIconWrap, { backgroundColor: "rgba(27,107,78,0.06)" }]}>
            <MaterialCommunityIcons name="eye" size={20} color={Colors.forest} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Voir le contrat</Text>
            <Text style={styles.actionDesc}>Consulter le contrat directement sur l'app</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleDownload}>
          <View style={[styles.actionIconWrap, { backgroundColor: "rgba(27,107,78,0.06)" }]}>
            <MaterialCommunityIcons name="download" size={20} color={Colors.forest} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Télécharger en PDF</Text>
            <Text style={styles.actionDesc}>Enregistrer le contrat sur votre appareil</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleSendEmail}>
          <View style={[styles.actionIconWrap, { backgroundColor: "rgba(27,107,78,0.06)" }]}>
            <MaterialCommunityIcons name="email-fast" size={20} color={Colors.forest} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Envoyer par email</Text>
            <Text style={styles.actionDesc}>Recevoir le contrat à sophie.lefevre@email.com</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="shield-check" size={14} color={Colors.forest} />
          <Text style={styles.infoText}>
            Sans engagement — vous pouvez annuler ce contrat à tout moment depuis votre profil, sans frais.
          </Text>
        </View>
      </ScrollView>

      {/* Contract Preview Modal */}
      <Modal visible={previewVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.previewModal}>
          {/* Preview header */}
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={() => setPreviewVisible(false)}>
              <MaterialCommunityIcons name="close" size={22} color={Colors.navy} />
            </TouchableOpacity>
            <Text style={styles.previewHeaderTitle}>Contrat d'entretien</Text>
            <TouchableOpacity onPress={handleDownload}>
              <MaterialCommunityIcons name="download" size={22} color={Colors.forest} />
            </TouchableOpacity>
          </View>

          {/* Contract document preview */}
          <ScrollView style={styles.previewScroll} contentContainerStyle={styles.previewContent}>
            {/* Nova header */}
            <View style={styles.docHeader}>
              <View style={styles.docLogoRow}>
                <View style={styles.docLogo}>
                  <MaterialCommunityIcons name="shield-check" size={16} color={Colors.white} />
                </View>
                <Text style={styles.docLogoText}>Nova</Text>
              </View>
              <Text style={styles.docRef}>CONTRAT D'ENTRETIEN ANNUEL</Text>
              <Text style={styles.docDate}>Souscrit le {since}</Text>
            </View>

            {/* Parties */}
            <View style={styles.docSection}>
              <Text style={styles.docSectionTitle}>Parties</Text>
              <View style={styles.docPartiesRow}>
                <View style={styles.docParty}>
                  <Text style={styles.docPartyLabel}>Client</Text>
                  <Text style={styles.docPartyName}>Sophie Lefèvre</Text>
                  <Text style={styles.docPartyDetail}>12 rue de Rivoli, 75004 Paris</Text>
                  <Text style={styles.docPartyDetail}>sophie.lefevre@email.com</Text>
                </View>
                <View style={styles.docParty}>
                  <Text style={styles.docPartyLabel}>Prestataire</Text>
                  <Text style={styles.docPartyName}>{artisan}</Text>
                  <Text style={styles.docPartyDetail}>Plombier-Chauffagiste</Text>
                  <Text style={styles.docPartyDetail}>Certifié Nova • SIRET 123 456 789</Text>
                </View>
              </View>
            </View>

            {/* Objet */}
            <View style={styles.docSection}>
              <Text style={styles.docSectionTitle}>Objet du contrat</Text>
              <Text style={styles.docText}>{name}</Text>
              <Text style={styles.docText}>
                Le prestataire s'engage à réaliser l'entretien selon la fréquence définie ci-dessous, conformément aux normes en vigueur.
              </Text>
            </View>

            {/* Conditions */}
            <View style={styles.docSection}>
              <Text style={styles.docSectionTitle}>Conditions</Text>
              <View style={styles.docCondRow}>
                <Text style={styles.docCondLabel}>Fréquence</Text>
                <Text style={styles.docCondValue}>{freq}</Text>
              </View>
              <View style={styles.docCondRow}>
                <Text style={styles.docCondLabel}>Tarif annuel</Text>
                <Text style={styles.docCondValue}>{price} TTC</Text>
              </View>
              <View style={styles.docCondRow}>
                <Text style={styles.docCondLabel}>Durée</Text>
                <Text style={styles.docCondValue}>Renouvelé automatiquement</Text>
              </View>
              <View style={styles.docCondRow}>
                <Text style={styles.docCondLabel}>Engagement</Text>
                <Text style={[styles.docCondValue, { color: Colors.success }]}>Aucun — résiliable à tout moment</Text>
              </View>
              <View style={styles.docCondRow}>
                <Text style={styles.docCondLabel}>Paiement</Text>
                <Text style={styles.docCondValue}>Annuel, sécurisé par Nova</Text>
              </View>
            </View>

            {/* Clauses */}
            <View style={styles.docSection}>
              <Text style={styles.docSectionTitle}>Modalités</Text>
              <Text style={styles.docText}>
                Article 1 — Le prestataire contacte le client pour convenir d'une date d'intervention dans un délai de 30 jours suivant la date anniversaire du contrat.
              </Text>
              <Text style={styles.docText}>
                Article 2 — En cas d'absence du client au rendez-vous, une nouvelle date est proposée sans frais supplémentaires.
              </Text>
              <Text style={styles.docText}>
                Article 3 — Le client peut résilier le contrat à tout moment via l'application Nova, sans pénalité. Le remboursement au prorata des visites non effectuées est garanti.
              </Text>
              <Text style={styles.docText}>
                Article 4 — Le paiement est sécurisé par le système de séquestre Nova. Le prestataire est payé après validation de chaque intervention.
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.docFooter}>
              <Text style={styles.docFooterText}>Nova SAS — Plateforme de mise en relation</Text>
              <Text style={styles.docFooterText}>Paiement sécurisé par séquestre • Commission 5%</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 54, paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { backgroundColor: "rgba(27,107,78,0.08)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "700" },
  headerTitle: { fontFamily: "DMSans_700Bold", fontSize: 17, color: Colors.navy },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Contract card */
  contractCard: { backgroundColor: Colors.white, borderRadius: Radii["2xl"], padding: 18, borderWidth: 1, borderColor: "rgba(27,107,78,0.12)", marginBottom: 20, ...Shadows.sm },
  contractHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  contractIconWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.surface, alignItems: "center", justifyContent: "center" },
  contractName: { fontFamily: "Manrope_700Bold", fontSize: 17, color: Colors.navy, marginBottom: 4 },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  activeText: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.success },
  contractDetails: {},
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  detailRowBorder: { borderTopWidth: 1, borderTopColor: Colors.surface },
  detailLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  detailValue: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },

  sectionTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy, marginBottom: 12 },

  /* Action cards */
  actionCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: "rgba(10,22,40,0.04)", ...Shadows.sm },
  actionIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  actionTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  actionDesc: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },

  infoBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 12, padding: 12, marginTop: 12, borderWidth: 1, borderColor: "rgba(27,107,78,0.08)" },
  infoText: { fontFamily: "DMSans_500Medium", fontSize: 12, color: "#14523B", flex: 1 },

  /* Preview modal */
  previewModal: { flex: 1, backgroundColor: Colors.white },
  previewHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 54, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  previewHeaderTitle: { fontFamily: "DMSans_700Bold", fontSize: 16, color: Colors.navy },
  previewScroll: { flex: 1 },
  previewContent: { padding: 24, paddingBottom: 60 },

  /* Document styles */
  docHeader: { alignItems: "center", marginBottom: 28, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: Colors.forest },
  docLogoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  docLogo: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.forest, alignItems: "center", justifyContent: "center" },
  docLogoText: { fontFamily: "Manrope_800ExtraBold", fontSize: 20, color: Colors.navy },
  docRef: { fontFamily: "DMMono_500Medium", fontSize: 12, color: Colors.forest, letterSpacing: 1, marginBottom: 4 },
  docDate: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary },

  docSection: { marginBottom: 24 },
  docSectionTitle: { fontFamily: "Manrope_700Bold", fontSize: 14, color: Colors.navy, marginBottom: 10, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  docText: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#4A5568", lineHeight: 20, marginBottom: 8 },

  docPartiesRow: { flexDirection: "row", gap: 16 },
  docParty: { flex: 1, backgroundColor: Colors.bgPage, borderRadius: 12, padding: 12 },
  docPartyLabel: { fontFamily: "DMMono_500Medium", fontSize: 10, color: Colors.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  docPartyName: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy, marginBottom: 2 },
  docPartyDetail: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary, lineHeight: 16 },

  docCondRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  docCondLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  docCondValue: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy, maxWidth: "55%" as any, textAlign: "right" },

  docFooter: { marginTop: 20, paddingTop: 16, borderTopWidth: 2, borderTopColor: Colors.forest, alignItems: "center" },
  docFooterText: { fontFamily: "DMSans_400Regular", fontSize: 10, color: Colors.textMuted, marginBottom: 2 },
});
