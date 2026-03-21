import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar, Button, Card, EscrowStepper, ConfirmModal } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

type MissionStatus = "active" | "completed" | "validated" | "dispute";

const CHECKS = [
  "Le travail est conforme au devis",
  "Je suis satisfait de la prestation",
  "Aucun dommage constaté",
];

const Stars = ({
  rating,
  size = 30,
  onRate,
}: {
  rating: number;
  size?: number;
  onRate: (v: number) => void;
}) => (
  <View style={{ flexDirection: "row", gap: 8 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <TouchableOpacity key={i} onPress={() => onRate(i)} activeOpacity={0.7}>
        <Text style={{ fontSize: size, color: i <= rating ? Colors.gold : Colors.border }}>
          {"★"}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// Mock: in a real app, status would come from the API via route params
const MOCK_STATUS: MissionStatus = "completed";

export function MissionDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"MissionDetail">) {
  // Determine status — in production this comes from API
  const missionId = route.params?.id;
  // Simulate different statuses based on mission ID
  const status: MissionStatus =
    missionId === "mission-dispute" ? "dispute" :
    missionId === "mission-active" ? "active" :
    missionId === "mission-validated" ? "validated" :
    MOCK_STATUS;

  const [checks, setChecks] = useState([false, false, false]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [validated, setValidated] = useState(false);
  const [instantRelease, setInstantRelease] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: "info" as const, title: "", message: "", actions: [] as any[] });

  const handleInstantRelease = () => {
    setModal({
      visible: true,
      type: "warning",
      title: "Déblocage instantané",
      message: "Vous confirmez que l'intervention et le prix sont conformes.\n\nLe paiement de 320,00€ sera immédiatement versé à l'artisan.\n\nEn débloquant le paiement vous-même, Nova ne pourra plus intervenir en cas de litige. Cette action est irréversible.",
      actions: [
        { label: "Annuler", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
        {
          label: "Je confirme, débloquer",
          onPress: () => {
            setModal(m => ({ ...m, visible: false }));
            setInstantRelease(true);
            setValidated(true);
          },
        },
      ],
    });
  };

  const handleCancel = () => {
    setModal({
      visible: true,
      type: "danger",
      title: "Annuler l'intervention",
      message: "Êtes-vous sûr de vouloir annuler cette intervention ?\n\nConformément aux conditions Nova, les frais de déplacement de 40,00€ restent à votre charge.",
      actions: [
        { label: "Non, garder", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
        {
          label: "Oui, annuler (40€ de frais)",
          variant: "danger",
          onPress: () => {
            setModal({
              visible: true,
              type: "info",
              title: "Intervention annulée",
              message: "L'intervention a été annulée. Les frais de déplacement de 40,00€ ont été prélevés. Le reste (280,00€) vous sera remboursé sous 3 à 5 jours.",
              actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }],
            });
            setCancelled(true);
          },
        },
      ],
    });
  };

  const toggleCheck = (idx: number) => {
    const next = [...checks];
    next[idx] = !next[idx];
    setChecks(next);
  };

  const escrowStep =
    status === "active" ? 2 :
    status === "completed" ? 3 :
    status === "validated" ? 4 :
    status === "dispute" ? 2 : 3;

  /* ---------- Cancelled state ---------- */
  if (cancelled) {
    return (
      <View style={styles.successRoot}>
        <View style={[styles.successCircle, { backgroundColor: Colors.red }]}>
          <MaterialCommunityIcons name="close" size={36} color={Colors.white} />
        </View>
        <Text style={styles.successTitle}>Intervention annulée</Text>
        <Text style={styles.successDesc}>
          Les frais de déplacement de 40,00€ ont été prélevés.{"\n"}Le reste de 280,00€ sera remboursé sous 3 à 5 jours.
        </Text>
        <View style={styles.cancelledBreakdown}>
          <View style={styles.cancelledRow}>
            <Text style={styles.cancelledLabel}>Montant total</Text>
            <Text style={styles.cancelledValue}>320,00€</Text>
          </View>
          <View style={styles.cancelledRow}>
            <Text style={styles.cancelledLabel}>Frais de déplacement</Text>
            <Text style={[styles.cancelledValue, { color: Colors.red }]}>- 40,00€</Text>
          </View>
          <View style={[styles.cancelledRow, { borderTopWidth: 1, borderTopColor: Colors.surface, paddingTop: 8 }]}>
            <Text style={[styles.cancelledLabel, { fontFamily: "DMSans_600SemiBold" }]}>Remboursement</Text>
            <Text style={[styles.cancelledValue, { color: Colors.success }]}>280,00€</Text>
          </View>
        </View>
        <Button
          title="Retour aux missions"
          onPress={() => navigation.navigate("ClientTabs", { screen: "ClientMissions" })}
          size="lg"
          fullWidth
        />
      </View>
    );
  }

  /* ---------- Success state ---------- */
  if (validated) {
    return (
      <View style={styles.successRoot}>
        <View style={[styles.successCircle, instantRelease && { backgroundColor: Colors.gold }]}>
          <Text style={styles.successCheck}>{"✓"}</Text>
        </View>
        <Text style={styles.successTitle}>
          {instantRelease ? "Paiement débloqué !" : "Demande envoyée !"}
        </Text>
        <Text style={styles.successDesc}>
          {instantRelease
            ? "320,00€ versés immédiatement à Jean-Michel P."
            : "Nova valide et libère le paiement sous 48h"}
        </Text>
        {instantRelease && (
          <View style={styles.instantWarning}>
            <MaterialCommunityIcons name="alert-outline" size={16} color={Colors.gold} />
            <Text style={styles.instantWarningText}>
              Vous avez débloqué le paiement vous-même. Nova ne peut plus intervenir en cas de litige sur cette intervention.
            </Text>
          </View>
        )}
        <Button
          title="Retour aux interventions"
          onPress={() => navigation.navigate("ClientTabs", { screen: "ClientMissions" })}
          size="lg"
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail de la mission</Text>
        {status === "dispute" && (
          <View style={styles.statusBadgeDispute}>
            <Text style={styles.statusBadgeDisputeText}>Litige</Text>
          </View>
        )}
        {status === "active" && (
          <View style={styles.statusBadgeActive}>
            <Text style={styles.statusBadgeActiveText}>En cours</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EscrowStepper currentStep={escrowStep} />

        {/* Mission info card */}
        <Card style={{ marginBottom: 14 }}>
          <View style={styles.artisanRow}>
            <Avatar name="Jean-Michel" size={52} radius={18} />
            <View>
              <Text style={styles.artisanName}>Jean-Michel P.</Text>
              <Text style={styles.artisanMeta}>Réparation fuite • Plomberie</Text>
            </View>
          </View>
          {[
            ["Date", "15 mars 2026"],
            ["Adresse", "12 rue de Rivoli, Paris 4e"],
          ].map(([k, v]) => (
            <View key={k} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{k}</Text>
              <Text style={styles.infoValue}>{v}</Text>
            </View>
          ))}
          <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: Colors.surface }]}>
            <Text style={styles.infoLabel}>HT</Text>
            <Text style={styles.infoValueMono}>266,67€</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>TVA (20%)</Text>
            <Text style={styles.infoValueMono}>53,33€</Text>
          </View>
          <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: Colors.surface }]}>
            <Text style={[styles.infoLabel, { fontWeight: "700" }]}>Total TTC</Text>
            <Text style={[styles.infoValueMono, { fontSize: 16, fontWeight: "700" }]}>320,00€</Text>
          </View>
        </Card>

        {/* ====== STATUS: ACTIVE (en cours) ====== */}
        {status === "active" && (
          <View style={styles.statusCard}>
            <View style={styles.statusCardHeader}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.gold} />
              <Text style={styles.statusCardTitle}>Mission en cours</Text>
            </View>
            <Text style={styles.statusCardDesc}>
              L'artisan est en train de réaliser l'intervention. Vous pourrez évaluer la prestation une fois celle-ci terminée.
            </Text>
            <View style={styles.statusCardInfo}>
              <MaterialCommunityIcons name="shield-lock" size={14} color={Colors.forest} />
              <Text style={styles.statusCardInfoText}>
                Votre paiement de 320,00€ est en séquestre chez Nova
              </Text>
            </View>
            <Button
              title="Suivre en temps réel"
              onPress={() => navigation.navigate("Tracking", { missionId: "1" })}
              fullWidth
              size="lg"
            />

            {/* Cancel button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.7}>
              <MaterialCommunityIcons name="close-circle-outline" size={16} color={Colors.red} />
              <Text style={styles.cancelBtnText}>Annuler l'intervention</Text>
            </TouchableOpacity>

            <View style={styles.cancelInfo}>
              <MaterialCommunityIcons name="information-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.cancelInfoText}>
                En cas d'annulation, les frais de déplacement de 40,00€ restent à votre charge.
              </Text>
            </View>
          </View>
        )}

        {/* ====== STATUS: COMPLETED (terminée — avis possible) ====== */}
        {status === "completed" && (
          <>
            {/* Validation checklist */}
            <Text style={styles.sectionLabel}>Checklist de validation</Text>
            {CHECKS.map((text, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => toggleCheck(i)}
                activeOpacity={0.7}
                style={[styles.checkItem, checks[i] && styles.checkItemSel]}
              >
                <View style={[styles.checkbox, checks[i] && styles.checkboxSel]}>
                  {checks[i] && <Text style={styles.checkMark}>{"✓"}</Text>}
                </View>
                <Text style={styles.checkText}>{text}</Text>
              </TouchableOpacity>
            ))}

            {/* Star rating */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Votre note</Text>
            <View style={{ marginBottom: 12 }}>
              <Stars rating={rating} onRate={setRating} />
            </View>

            {/* Review textarea */}
            <TextInput
              style={styles.textarea}
              placeholder="Laissez un avis (optionnel)..."
              placeholderTextColor={Colors.textHint}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={reviewText}
              onChangeText={setReviewText}
            />

            {/* Validation info */}
            <View style={styles.validationInfo}>
              <MaterialCommunityIcons name="check-circle" size={16} color="#0D7A52" />
              <Text style={styles.validationInfoText}>
                Nova vérifiera la mission avant de libérer 320€ vers Jean-Michel P.
              </Text>
            </View>

            {/* Validate button */}
            <TouchableOpacity
              style={styles.validateBtn}
              activeOpacity={0.85}
              onPress={() => setValidated(true)}
            >
              <Text style={styles.validateBtnText}>Valider et libérer le paiement</Text>
            </TouchableOpacity>

            {/* OR separator */}
            <View style={styles.orSeparator}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>ou</Text>
              <View style={styles.orLine} />
            </View>

            {/* Instant release */}
            <TouchableOpacity
              style={styles.instantBtn}
              activeOpacity={0.85}
              onPress={handleInstantRelease}
            >
              <MaterialCommunityIcons name="lock-open-variant" size={18} color={Colors.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.instantBtnTitle}>Débloquer le paiement immédiatement</Text>
                <Text style={styles.instantBtnDesc}>Sans attendre la vérification Nova</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.instantDisclaimer}>
              <MaterialCommunityIcons name="alert-outline" size={14} color={Colors.gold} />
              <Text style={styles.instantDisclaimerText}>
                En débloquant le paiement vous-même, vous confirmez que l'intervention et le prix sont conformes. Nova ne pourra plus intervenir en cas de litige. Cette action est définitive et irréversible.
              </Text>
            </View>

            {/* Dispute button */}
            <TouchableOpacity
              style={styles.disputeBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("ReportDispute", { missionId: "1" })}
            >
              <Text style={styles.disputeBtnText}>Signaler un litige</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ====== STATUS: VALIDATED ====== */}
        {status === "validated" && (
          <View style={styles.statusCard}>
            <View style={styles.statusCardHeader}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={[styles.statusCardTitle, { color: Colors.success }]}>Mission validée</Text>
            </View>
            <Text style={styles.statusCardDesc}>
              Vous avez validé cette mission. Le paiement de 320,00€ sera versé à Jean-Michel P. sous 48h.
            </Text>
            <View style={styles.validatedReview}>
              <View style={{ flexDirection: "row", gap: 2, marginBottom: 4 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Text key={i} style={{ fontSize: 14, color: Colors.gold }}>★</Text>
                ))}
              </View>
              <Text style={styles.validatedReviewText}>
                "Excellent travail, très professionnel et ponctuel."
              </Text>
            </View>
          </View>
        )}

        {/* ====== STATUS: DISPUTE (litige) ====== */}
        {status === "dispute" && (
          <View style={styles.disputeCard}>
            <View style={styles.disputeCardHeader}>
              <MaterialCommunityIcons name="alert-circle" size={22} color={Colors.red} />
              <Text style={styles.disputeCardTitle}>Dossier en litige</Text>
            </View>
            <Text style={styles.disputeCardDesc}>
              Votre signalement a été reçu et est en cours d'examen par nos équipes. Le paiement reste bloqué en séquestre pendant toute la durée du litige.
            </Text>

            {/* Dispute timeline */}
            <View style={styles.disputeTimeline}>
              <View style={styles.disputeTimelineItem}>
                <View style={[styles.disputeDot, { backgroundColor: Colors.success }]} />
                <View style={styles.disputeTimelineContent}>
                  <Text style={styles.disputeTimelineTitle}>Signalement reçu</Text>
                  <Text style={styles.disputeTimelineDate}>18 mars 2026 à 14:32</Text>
                </View>
                <MaterialCommunityIcons name="check" size={16} color={Colors.success} />
              </View>
              <View style={styles.disputeTimelineLine} />
              <View style={styles.disputeTimelineItem}>
                <View style={[styles.disputeDot, { backgroundColor: Colors.gold }]} />
                <View style={styles.disputeTimelineContent}>
                  <Text style={styles.disputeTimelineTitle}>Examen en cours</Text>
                  <Text style={styles.disputeTimelineDate}>Analyse des preuves par Nova</Text>
                </View>
                <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.gold} />
              </View>
              <View style={styles.disputeTimelineLine} />
              <View style={styles.disputeTimelineItem}>
                <View style={[styles.disputeDot, { backgroundColor: Colors.border }]} />
                <View style={styles.disputeTimelineContent}>
                  <Text style={[styles.disputeTimelineTitle, { color: Colors.textHint }]}>Décision Nova</Text>
                  <Text style={styles.disputeTimelineDate}>En attente</Text>
                </View>
              </View>
            </View>

            {/* Dispute info */}
            <View style={styles.disputeInfoBox}>
              <MaterialCommunityIcons name="lock" size={14} color={Colors.red} />
              <Text style={styles.disputeInfoText}>
                320,00€ bloqués en séquestre jusqu'à résolution
              </Text>
            </View>

            <View style={styles.disputeInfoBox}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.forest} />
              <Text style={styles.disputeInfoText}>
                Délai de traitement estimé : 48 à 72h
              </Text>
            </View>

            <Button
              title="Contacter le support"
              onPress={() => navigation.navigate("Support")}
              variant="secondary"
              fullWidth
              size="lg"
            />
          </View>
        )}
      </ScrollView>

      <ConfirmModal
        visible={modal.visible}
        onClose={() => setModal(m => ({ ...m, visible: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "600" },
  headerTitle: { fontFamily: "DMSans_700Bold", fontSize: 17, color: Colors.navy, flex: 1 },
  statusBadgeDispute: {
    backgroundColor: "rgba(232,48,42,0.1)", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  statusBadgeDisputeText: { fontFamily: "DMSans_600SemiBold", fontSize: 11, color: Colors.red },
  statusBadgeActive: {
    backgroundColor: "rgba(245,166,35,0.1)", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  statusBadgeActiveText: { fontFamily: "DMSans_600SemiBold", fontSize: 11, color: Colors.gold },

  /* Artisan row */
  artisanRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 12 },
  artisanName: { fontSize: 15, fontWeight: "700", color: Colors.navy },
  artisanMeta: { fontSize: 12.5, color: Colors.textHint },

  /* Info rows */
  infoRow: {
    flexDirection: "row", justifyContent: "space-between", paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: Colors.surface,
  },
  infoLabel: { fontSize: 12.5, color: Colors.textHint },
  infoValue: { fontSize: 12.5, fontWeight: "600", color: Colors.navy },
  infoValueMono: { fontFamily: "DMMono_500Medium", fontSize: 13, color: Colors.navy },

  /* Generic status card */
  statusCard: {
    backgroundColor: Colors.white, borderRadius: Radii["2xl"],
    padding: 18, borderWidth: 1, borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  statusCardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  statusCardTitle: { fontFamily: "Manrope_700Bold", fontSize: 16, color: Colors.navy },
  statusCardDesc: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#4A5568", lineHeight: 20, marginBottom: 14 },
  statusCardInfo: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 12,
    padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "rgba(27,107,78,0.08)",
  },
  statusCardInfoText: { fontFamily: "DMSans_500Medium", fontSize: 12, color: "#14523B", flex: 1 },

  /* Validated review */
  validatedReview: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginTop: 4, marginBottom: 8,
  },
  validatedReviewText: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#4A5568", fontStyle: "italic" },

  /* Dispute card */
  disputeCard: {
    backgroundColor: Colors.white, borderRadius: Radii["2xl"],
    padding: 18, borderWidth: 1.5, borderColor: "rgba(232,48,42,0.15)",
    ...Shadows.sm,
  },
  disputeCardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  disputeCardTitle: { fontFamily: "Manrope_700Bold", fontSize: 17, color: Colors.red },
  disputeCardDesc: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#4A5568", lineHeight: 20, marginBottom: 16 },

  /* Dispute timeline */
  disputeTimeline: { marginBottom: 16 },
  disputeTimelineItem: {
    flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10,
  },
  disputeDot: { width: 10, height: 10, borderRadius: 5 },
  disputeTimelineContent: { flex: 1 },
  disputeTimelineTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },
  disputeTimelineDate: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textHint },
  disputeTimelineLine: { width: 2, height: 16, backgroundColor: Colors.border, marginLeft: 4 },

  /* Dispute info boxes */
  disputeInfoBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(232,48,42,0.04)", borderRadius: 12,
    padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "rgba(232,48,42,0.1)",
  },
  disputeInfoText: { fontFamily: "DMSans_500Medium", fontSize: 12, color: "#4A5568", flex: 1 },

  /* Cancel */
  cancelBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, marginTop: 14, paddingVertical: 12,
  },
  cancelBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.red },
  cancelInfo: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(138,149,163,0.06)", borderRadius: 10,
    padding: 10, marginTop: 4,
  },
  cancelInfoText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted, flex: 1 },

  /* Cancelled state */
  cancelledBreakdown: {
    width: "100%", backgroundColor: Colors.white, borderRadius: 16,
    padding: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.border,
  },
  cancelledRow: {
    flexDirection: "row", justifyContent: "space-between", paddingVertical: 6,
  },
  cancelledLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  cancelledValue: { fontFamily: "DMMono_500Medium", fontSize: 13, color: Colors.navy },

  /* Section label */
  sectionLabel: { fontSize: 14, fontWeight: "600", color: Colors.navy, marginBottom: 10 },

  /* Checklist */
  checkItem: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 14, paddingHorizontal: 16,
    marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  checkItemSel: { borderWidth: 2, borderColor: Colors.success },
  checkbox: {
    width: 24, height: 24, borderRadius: 8,
    borderWidth: 2, borderColor: "#B0B0BB",
    alignItems: "center", justifyContent: "center",
  },
  checkboxSel: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkMark: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  checkText: { fontSize: 13.5, color: Colors.navy, fontWeight: "500", flex: 1 },

  /* Textarea */
  textarea: {
    backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    padding: 14, fontSize: 14, fontFamily: "DMSans_400Regular", height: 80,
    color: Colors.text, marginBottom: 16,
  },

  /* Validation info */
  validationInfo: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "rgba(34,200,138,0.06)", borderRadius: 16,
    padding: 14, paddingHorizontal: 16, marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(34,200,138,0.15)",
  },
  validationInfoText: { fontSize: 13.5, fontWeight: "600", color: "#0D7A52", flex: 1 },

  /* Or separator */
  orSeparator: {
    flexDirection: "row", alignItems: "center", gap: 12,
    marginVertical: 14,
  },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { fontFamily: "DMSans_500Medium", fontSize: 12, color: Colors.textMuted },

  /* Instant release */
  instantBtn: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "rgba(245,166,35,0.06)", borderRadius: 16,
    padding: 16, borderWidth: 1.5, borderColor: "rgba(245,166,35,0.15)",
    marginBottom: 8,
  },
  instantBtnTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  instantBtnDesc: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  instantDisclaimer: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "rgba(245,166,35,0.04)", borderRadius: 12,
    padding: 10, marginBottom: 14,
  },
  instantDisclaimerText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: "#92610A", flex: 1, lineHeight: 16 },

  /* Instant warning (success state) */
  instantWarning: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "rgba(245,166,35,0.06)", borderRadius: 14,
    padding: 14, marginBottom: 20, maxWidth: 320,
    borderWidth: 1, borderColor: "rgba(245,166,35,0.12)",
  },
  instantWarningText: { fontFamily: "DMSans_400Regular", fontSize: 12, color: "#92610A", flex: 1, lineHeight: 18 },

  /* Validate button */
  validateBtn: {
    height: 54, borderRadius: 16, backgroundColor: Colors.success,
    alignItems: "center", justifyContent: "center", marginBottom: 10, ...Shadows.md,
  },
  validateBtnText: { color: Colors.white, fontSize: 15, fontWeight: "600" },

  /* Dispute button */
  disputeBtn: { alignItems: "center", padding: 8, marginBottom: 16 },
  disputeBtnText: { fontSize: 13, color: Colors.red, fontWeight: "500" },

  /* Success state */
  successRoot: {
    flex: 1, backgroundColor: Colors.bgPage,
    alignItems: "center", justifyContent: "center", padding: 24,
  },
  successCircle: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.success, alignItems: "center", justifyContent: "center",
    marginBottom: 20, ...Shadows.lg,
  },
  successCheck: { color: Colors.white, fontSize: 40, fontWeight: "700" },
  successTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 23, color: Colors.navy, marginBottom: 6 },
  successDesc: { fontSize: 14, color: "#4A5568", marginBottom: 24, textAlign: "center" },
});
