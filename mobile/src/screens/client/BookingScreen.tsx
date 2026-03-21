import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Button, Card, ConfirmModal } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
const AVAILABLE_DAYS = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29];
const TIME_SLOTS = ["9h00", "11h00", "14h00", "16h00", "18h00"];
const FIRST_DAY_OFFSET = 6; // March 2026 starts on Sunday -> 6 empty cells (Mon-based grid)
const TOTAL_DAYS = 31;
const TODAY = 21;
const UNAVAILABLE_DAYS = [1, 2, 7, 8, 9, 14, 16, 21, 23, 25, 27, 28, 30, 31];

/* ---- Progress bar ---- */
const ProgressSteps = ({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) => (
  <View style={styles.progressRow}>
    {steps.map((s, i) => (
      <View key={i} style={styles.progressItem}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: i <= current ? Colors.forest : Colors.border },
          ]}
        />
        <Text
          style={[
            styles.progressLabel,
            {
              color: i <= current ? Colors.forest : Colors.textHint,
              fontWeight: i === current ? "700" : "400",
            },
          ]}
        >
          {s}
        </Text>
      </View>
    ))}
  </View>
);

export function BookingScreen({
  navigation,
}: RootStackScreenProps<"Booking">) {
  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<{ uri: string; type: "image" | "video" }[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [savedCards] = useState([
    { id: 0, type: "Visa", last4: "6411", expiry: "09/28" },
    { id: 1, type: "Mastercard", last4: "8923", expiry: "03/27" },
  ]);
  const [selectedCard, setSelectedCard] = useState<number | null>(savedCards.length > 0 ? 0 : null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNum, setNewCardNum] = useState("");
  const [newCardExp, setNewCardExp] = useState("");
  const [newCardCvv, setNewCardCvv] = useState("");
  const [modal, setModal] = useState({ visible: false, type: "info" as const, title: "", message: "", actions: [] as any[] });

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setMedia((prev) => [
        ...prev,
        ...result.assets.map((a) => ({
          uri: a.uri,
          type: (a.type === "video" ? "video" : "image") as "image" | "video",
        })),
      ]);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setModal({ visible: true, type: "warning", title: "Permission requise", message: "Autorisez l'accès à la caméra pour prendre une photo.", actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }] });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) {
      setMedia((prev) => [...prev, { uri: result.assets[0].uri, type: "image" }]);
    }
  };

  const recordVideo = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setModal({ visible: true, type: "warning", title: "Permission requise", message: "Autorisez l'accès à la caméra pour enregistrer une vidéo.", actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }] });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      videoMaxDuration: 60,
      quality: 0.7,
    });
    if (!result.canceled) {
      setMedia((prev) => [...prev, { uri: result.assets[0].uri, type: "video" }]);
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())}
        >
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prise de rendez-vous</Text>
      </View>

      <ProgressSteps steps={["Date", "Détails", "Paiement", "Confirmation"]} current={step} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== STEP 0 : Calendar ====== */}
        {step === 0 && (
          <View>
            <Text style={styles.stepTitle}>Mars 2026</Text>
            <View style={styles.calendarCard}>
              {/* Day-of-week headers */}
              <View style={styles.calendarGrid}>
                {DAY_LABELS.map((d, i) => (
                  <View key={`h${i}`} style={styles.calendarHeaderCell}>
                    <Text style={styles.calendarHeaderText}>{d}</Text>
                  </View>
                ))}
                {/* Empty offset cells */}
                {Array.from({ length: FIRST_DAY_OFFSET }).map((_, i) => (
                  <View key={`e${i}`} style={styles.calendarDayCell} />
                ))}
                {/* Day cells */}
                {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(
                  (day) => {
                    const isPast = day < TODAY;
                    const isUnavail = UNAVAILABLE_DAYS.includes(day) && !isPast;
                    const isAvail = AVAILABLE_DAYS.includes(day) && !isPast;
                    const isSel = day === selectedDay;
                    const isDisabled = isPast || isUnavail || !isAvail;
                    return (
                      <TouchableOpacity
                        key={day}
                        disabled={isDisabled}
                        onPress={() => setSelectedDay(day)}
                        style={[
                          styles.calendarDayCell,
                          isSel && styles.calendarDaySel,
                          !isSel && isAvail && !isPast && styles.calendarDayAvail,
                          isPast && { opacity: 0.3 },
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.calendarDayText,
                            isSel && styles.calendarDayTextSel,
                            !isSel && isAvail && !isPast && styles.calendarDayTextAvail,
                            !isSel && isUnavail && styles.calendarDayUnavail,
                            !isSel && !isAvail && !isUnavail && !isPast && styles.calendarDayTextDisabled,
                            isPast && !isSel && styles.calendarDayTextDisabled,
                          ]}
                        >
                          {day}
                        </Text>
                        {isUnavail && !isSel && (
                          <View style={styles.calendarRedDot} />
                        )}
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            </View>
            <Button
              title="Suivant"
              onPress={() => setStep(1)}
              fullWidth
              size="lg"
            />
          </View>
        )}

        {/* ====== STEP 1 : Details ====== */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Choisissez un créneau</Text>
            <View style={styles.slotsRow}>
              {TIME_SLOTS.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSelectedSlot(s)}
                  style={[
                    styles.slotBtn,
                    selectedSlot === s && styles.slotBtnSel,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.slotText,
                      selectedSlot === s && styles.slotTextSel,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.textarea, description.length > 0 && description.trim().length < 20 && { borderColor: Colors.red }]}
              placeholder="Décrivez votre problème (20 caractères min.)..."
              placeholderTextColor={Colors.textHint}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
            <Text style={[styles.charCount, description.trim().length >= 20 && { color: Colors.success }]}>
              {description.trim().length}/20 caractères{description.trim().length < 20 ? " minimum" : " ✓"}
            </Text>

            {/* Media picker buttons */}
            <View style={styles.mediaActions}>
              <TouchableOpacity style={styles.mediaBtn} activeOpacity={0.7} onPress={pickFromGallery}>
                <MaterialCommunityIcons name="image-multiple" size={18} color={Colors.forest} />
                <Text style={styles.mediaBtnText}>Galerie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaBtn} activeOpacity={0.7} onPress={takePhoto}>
                <MaterialCommunityIcons name="camera" size={18} color={Colors.forest} />
                <Text style={styles.mediaBtnText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaBtn} activeOpacity={0.7} onPress={recordVideo}>
                <MaterialCommunityIcons name="video" size={18} color={Colors.forest} />
                <Text style={styles.mediaBtnText}>Vidéo</Text>
              </TouchableOpacity>
            </View>

            {/* Media preview */}
            {media.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaPreviewScroll}>
                {media.map((m, i) => (
                  <View key={i} style={styles.mediaThumb}>
                    <Image source={{ uri: m.uri }} style={styles.mediaImage} />
                    {m.type === "video" && (
                      <View style={styles.mediaVideoOverlay}>
                        <MaterialCommunityIcons name="play-circle" size={24} color={Colors.white} />
                      </View>
                    )}
                    <TouchableOpacity style={styles.mediaRemove} onPress={() => removeMedia(i)}>
                      <MaterialCommunityIcons name="close" size={14} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={{ marginTop: 16 }}>
              <Button
                title="Suivant"
                onPress={() => setStep(2)}
                fullWidth
                size="lg"
                disabled={!selectedSlot || description.trim().length < 20}
              />
            </View>
          </View>
        )}

        {/* ====== STEP 2 : Moyen de paiement ====== */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Moyen de paiement</Text>
            <Text style={styles.paymentDesc}>
              Un moyen de paiement est requis pour garantir la réservation. Vous ne serez débité qu'après acceptation du devis.
            </Text>

            {/* Saved cards */}
            {savedCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[styles.payCard, selectedCard === card.id && styles.payCardSelected]}
                onPress={() => { setSelectedCard(card.id); setShowAddCard(false); }}
                activeOpacity={0.85}
              >
                <View style={[styles.payCardIcon, { backgroundColor: card.type === "Visa" ? "#1A1F71" : "#EB001B" }]}>
                  <Text style={styles.payCardIconText}>{card.type === "Visa" ? "VISA" : "MC"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.payCardName}>{card.type} •••• {card.last4}</Text>
                  <Text style={styles.payCardExp}>Exp. {card.expiry}</Text>
                </View>
                <View style={[styles.payRadio, selectedCard === card.id && styles.payRadioSel]} />
              </TouchableOpacity>
            ))}

            {/* Apple/Google Pay */}
            <TouchableOpacity
              style={[styles.payCard, selectedCard === -1 && styles.payCardSelected]}
              onPress={() => { setSelectedCard(-1); setShowAddCard(false); }}
              activeOpacity={0.85}
            >
              <View style={[styles.payCardIcon, { backgroundColor: "#000" }]}>
                <MaterialCommunityIcons name="apple" size={16} color="#fff" />
              </View>
              <Text style={[styles.payCardName, { flex: 1 }]}>Apple Pay / Google Pay</Text>
              <View style={[styles.payRadio, selectedCard === -1 && styles.payRadioSel]} />
            </TouchableOpacity>

            {/* Add new card */}
            {showAddCard ? (
              <View style={styles.addNewCardForm}>
                <TextInput style={styles.addNewCardInput} placeholder="Numéro de carte" placeholderTextColor={Colors.textHint} value={newCardNum} onChangeText={(t) => setNewCardNum(t.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())} keyboardType="number-pad" maxLength={19} />
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TextInput style={[styles.addNewCardInput, { flex: 1 }]} placeholder="MM/AA" placeholderTextColor={Colors.textHint} value={newCardExp} onChangeText={(t) => { const d = t.replace(/\D/g, "").slice(0, 4); setNewCardExp(d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d); }} keyboardType="number-pad" maxLength={5} />
                  <TextInput style={[styles.addNewCardInput, { flex: 1 }]} placeholder="CVV" placeholderTextColor={Colors.textHint} value={newCardCvv} onChangeText={(t) => setNewCardCvv(t.replace(/\D/g, "").slice(0, 3))} keyboardType="number-pad" maxLength={3} secureTextEntry />
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.addNewCardBtn} onPress={() => setShowAddCard(true)}>
                <MaterialCommunityIcons name="plus-circle-outline" size={16} color={Colors.forest} />
                <Text style={styles.addNewCardBtnText}>Ajouter une carte</Text>
              </TouchableOpacity>
            )}

            <View style={styles.escrowBadge}>
              <MaterialCommunityIcons name="shield-lock" size={14} color={Colors.forest} />
              <Text style={styles.escrowBadgeText}>Aucun débit maintenant. Votre carte ne sera utilisée qu'après signature du devis sur place.</Text>
            </View>

            <Button title="Suivant" onPress={() => setStep(3)} fullWidth size="lg" disabled={selectedCard === null && !showAddCard} />
          </View>
        )}

        {/* ====== STEP 3 : Confirmation ====== */}
        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Récapitulatif</Text>
            <Card style={{ marginBottom: 16 }}>
              {[
                ["Artisan", "Jean-Michel P."],
                ["Date", `${selectedDay} mars 2026`],
                ["Créneau", selectedSlot || "14h00"],
                ["Adresse", "12 rue de Rivoli, Paris 4e"],
              ].map(([k, v], i) => (
                <View
                  key={k}
                  style={[
                    styles.summaryRow,
                    i < 3 && styles.summaryRowBorder,
                  ]}
                >
                  <Text style={styles.summaryLabel}>{k}</Text>
                  <Text style={styles.summaryValue}>{v}</Text>
                </View>
              ))}
            </Card>

            {/* Escrow info */}
            <View style={styles.escrowBadge}>
              <MaterialCommunityIcons name="information-outline" size={16} color={Colors.forest} />
              <Text style={styles.escrowBadgeText}>
                Aucun paiement maintenant — l'artisan établira le devis sur place après diagnostic
              </Text>
            </View>

            {!confirmed ? (
              <Button
                title="Confirmer le rendez-vous"
                onPress={() => {
                  setConfirmed(true);
                  setModal({
                    visible: true,
                    type: "success",
                    title: "Rendez-vous confirmé",
                    message: `Votre RDV avec Jean-Michel P. le ${selectedDay} mars à ${selectedSlot || "14h00"} est confirmé.\n\nL'artisan se déplacera, diagnostiquera et établira un devis sur place. Vous ne payez rien pour le moment.`,
                    actions: [
                      {
                        label: "Voir mes interventions",
                        onPress: () => {
                          setModal(m => ({ ...m, visible: false }));
                          navigation.navigate("ClientTabs" as any, { screen: "ClientMissions" });
                        },
                      },
                    ],
                  });
                }}
                fullWidth
                size="lg"
              />
            ) : (
              <View style={styles.confirmedBanner}>
                <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
                <Text style={styles.confirmedText}>Rendez-vous confirmé</Text>
              </View>
            )}
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
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "600" },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },

  /* Progress */
  progressRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 4,
  },
  progressItem: { flex: 1, alignItems: "center", gap: 5 },
  progressBar: { height: 3, width: "100%", borderRadius: 2 },
  progressLabel: { fontSize: 10 },

  /* Step title */
  stepTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: Colors.navy,
    marginBottom: 14,
    marginTop: 4,
  },

  /* Calendar */
  calendarCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarHeaderCell: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 4,
  },
  calendarHeaderText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  calendarDayCell: {
    width: "14.28%",
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarDaySel: {
    backgroundColor: Colors.deepForest,
    borderRadius: 12,
  },
  calendarDayAvail: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 12,
  },
  calendarDayText: { fontSize: 14, fontWeight: "400", color: "#B0B0BB" },
  calendarDayTextSel: { color: Colors.white, fontWeight: "700" },
  calendarDayTextAvail: { color: Colors.forest, fontWeight: "600" },
  calendarDayTextDisabled: { color: "#B0B0BB" },
  calendarDayUnavail: { color: Colors.red, fontWeight: "600" },
  calendarRedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.red,
    marginTop: 1,
    alignSelf: "center",
  },

  /* Time slots */
  slotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  slotBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotBtnSel: {
    backgroundColor: Colors.deepForest,
    borderWidth: 0,
    ...Shadows.md,
  },
  slotText: { fontSize: 14, fontWeight: "600", color: Colors.navy },
  slotTextSel: { color: Colors.white },

  /* Textarea */
  textarea: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    height: 100,
    color: Colors.text,
    marginBottom: 12,
  },

  /* Payment step */
  paymentDesc: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  payCard: {
    flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.white,
    borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  payCardSelected: { borderWidth: 2, borderColor: Colors.forest },
  payCardIcon: { width: 42, height: 28, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  payCardIconText: { fontFamily: "Manrope_700Bold", fontSize: 9, color: Colors.white, letterSpacing: 0.5 },
  payCardName: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  payCardExp: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textHint },
  payRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#B0B0BB" },
  payRadioSel: { borderWidth: 6, borderColor: Colors.forest },
  addNewCardBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.2)", marginBottom: 14,
  },
  addNewCardBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.forest },
  addNewCardForm: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  addNewCardInput: {
    height: 44, backgroundColor: Colors.bgPage, borderRadius: 10, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, fontFamily: "DMSans_400Regular", fontSize: 14, color: Colors.navy, marginBottom: 8,
  },

  charCount: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "right",
    marginTop: -6,
    marginBottom: 10,
  },

  /* Media picker */
  mediaActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  mediaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(27,107,78,0.04)",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.25)",
    borderRadius: 12,
    paddingVertical: 12,
  },
  mediaBtnText: { fontSize: 12, fontFamily: "DMSans_600SemiBold", color: Colors.forest },
  mediaPreviewScroll: { marginBottom: 12 },
  mediaThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 8,
    overflow: "hidden",
    position: "relative",
  },
  mediaImage: { width: "100%", height: "100%", borderRadius: 12 },
  mediaVideoOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(34,200,138,0.08)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(34,200,138,0.2)",
  },
  confirmedText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.success,
  },

  /* Summary */
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.surface },
  summaryLabel: { fontSize: 13, color: Colors.textHint },
  summaryValue: { fontSize: 13, fontWeight: "600", color: Colors.navy },

  /* Escrow badge */
  escrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
  },
  escrowBadgeText: {
    fontSize: 12.5,
    color: "#14523B",
    fontWeight: "500",
    flex: 1,
  },
});
