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
  route: navRoute,
}: RootStackScreenProps<"Booking">) {
  const serviceId = navRoute.params?.serviceId ?? "plombier";
  const serviceLabel = navRoute.params?.serviceLabel ?? "Plomberie";

  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<{ uri: string; type: "image" | "video" }[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [matchFound, setMatchFound] = useState(false);
  const [paymentType, setPaymentType] = useState<"card" | "cash" | null>("card");
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
        <Text style={styles.headerTitle}>{serviceLabel}</Text>
      </View>

      <ProgressSteps steps={["Besoin", "Creneau", "Paiement", "Recherche"]} current={step} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== STEP 0 : Description + Photos/Video ====== */}
        {step === 0 && (
          <View>
            <View style={styles.serviceBadge}>
              <MaterialCommunityIcons name="wrench" size={16} color={Colors.forest} />
              <Text style={styles.serviceBadgeText}>{serviceLabel}</Text>
            </View>

            <Text style={styles.stepTitle}>Decrivez votre besoin</Text>

            <TextInput
              style={[styles.textarea, description.length > 0 && description.trim().length < 20 && { borderColor: Colors.red }]}
              placeholder="Decrivez votre probleme en detail (20 caracteres min.)..."
              placeholderTextColor={Colors.textHint}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
            <Text style={[styles.charCount, description.trim().length >= 20 && { color: Colors.success }]}>
              {description.trim().length}/20{description.trim().length < 20 ? " min" : " \u2713"}
            </Text>

            <Text style={styles.mediaTitle}>Photos ou videos (optionnel)</Text>
            <Text style={styles.mediaSubtitle}>Ajoutez des visuels pour aider l'artisan a diagnostiquer</Text>

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
                <Text style={styles.mediaBtnText}>Video</Text>
              </TouchableOpacity>
            </View>

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
                onPress={() => setStep(1)}
                fullWidth
                size="lg"
                disabled={description.trim().length < 20}
              />
            </View>
          </View>
        )}

        {/* ====== STEP 1 : Date + Creneau ====== */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Choisissez une date</Text>
            <View style={styles.calendarCard}>
              <View style={styles.calendarGrid}>
                {DAY_LABELS.map((d, i) => (
                  <View key={`h${i}`} style={styles.calendarHeaderCell}>
                    <Text style={styles.calendarHeaderText}>{d}</Text>
                  </View>
                ))}
                {Array.from({ length: FIRST_DAY_OFFSET }).map((_, i) => (
                  <View key={`e${i}`} style={styles.calendarDayCell} />
                ))}
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
                        {isUnavail && !isSel && <View style={styles.calendarRedDot} />}
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            </View>

            <Text style={[styles.stepTitle, { marginTop: 4 }]}>Choisissez un creneau</Text>
            <View style={styles.slotsRow}>
              {TIME_SLOTS.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSelectedSlot(s)}
                  style={[styles.slotBtn, selectedSlot === s && styles.slotBtnSel]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.slotText, selectedSlot === s && styles.slotTextSel]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Suivant"
              onPress={() => setStep(2)}
              fullWidth
              size="lg"
              disabled={!selectedSlot}
            />
          </View>
        )}

        {/* ====== STEP 2 : Moyen de paiement ====== */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Moyen de paiement</Text>
            <Text style={styles.paymentDesc}>
              Un moyen de paiement est requis pour garantir la réservation. Vous ne serez débité qu'après acceptation du devis.
            </Text>

            {/* Type selector: Carte / Espèces */}
            <View style={styles.payTypeRow}>
              <TouchableOpacity
                style={[styles.payTypeBtn, paymentType === "card" && styles.payTypeBtnSel]}
                onPress={() => setPaymentType("card")}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="credit-card" size={16} color={paymentType === "card" ? Colors.white : Colors.forest} />
                <Text style={[styles.payTypeBtnText, paymentType === "card" && styles.payTypeBtnTextSel]}>Carte / En ligne</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.payTypeBtn, paymentType === "cash" && styles.payTypeBtnSel]}
                onPress={() => setPaymentType("cash")}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="cash" size={16} color={paymentType === "cash" ? Colors.white : Colors.forest} />
                <Text style={[styles.payTypeBtnText, paymentType === "cash" && styles.payTypeBtnTextSel]}>Espèces</Text>
              </TouchableOpacity>
            </View>

            {/* Espèces — avertissement séquestre */}
            {paymentType === "cash" && (
              <View style={styles.cashWarning}>
                <MaterialCommunityIcons name="alert" size={16} color="#D97706" />
                <Text style={styles.cashWarningText}>
                  Le service de séquestre ne sera pas disponible avec ce mode de paiement. Vous payez directement l'artisan après l'intervention.
                </Text>
              </View>
            )}

            {/* Carte — saved cards + add card */}
            {paymentType === "card" && (
              <>
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
              </>
            )}

            <Button
              title="Suivant"
              onPress={() => setStep(3)}
              fullWidth
              size="lg"
              disabled={paymentType === "card" && selectedCard === null && !showAddCard}
            />
          </View>
        )}

        {/* ====== STEP 3 : Recherche artisan ====== */}
        {step === 3 && (
          <View>
            {!searching && !matchFound && (
              <View>
                <Text style={styles.stepTitle}>Recapitulatif</Text>
                <Card style={{ marginBottom: 16 }}>
                  {[
                    ["Service", serviceLabel],
                    ["Date", `${selectedDay} mars 2026`],
                    ["Creneau", selectedSlot || "14h00"],
                    ["Paiement", paymentType === "card" ? "Carte bancaire" : "Especes"],
                    ["Medias", `${media.length} fichier${media.length > 1 ? "s" : ""}`],
                  ].map(([k, v], i, arr) => (
                    <View key={k} style={[styles.summaryRow, i < arr.length - 1 && styles.summaryRowBorder]}>
                      <Text style={styles.summaryLabel}>{k}</Text>
                      <Text style={styles.summaryValue}>{v}</Text>
                    </View>
                  ))}
                </Card>

                <View style={styles.escrowBadge}>
                  <MaterialCommunityIcons name="shield-lock" size={14} color={Colors.forest} />
                  <Text style={styles.escrowBadgeText}>
                    Aucun debit maintenant. Vous ne payez qu'apres signature du devis sur place.
                  </Text>
                </View>

                <Button
                  title="Lancer la recherche"
                  onPress={() => {
                    setSearching(true);
                    setSearchProgress(0);
                    // Simulate search progress
                    let p = 0;
                    const interval = setInterval(() => {
                      p += 0.08;
                      if (p >= 1) {
                        clearInterval(interval);
                        setSearchProgress(1);
                        setTimeout(() => {
                          setSearching(false);
                          setMatchFound(true);
                        }, 500);
                      } else {
                        setSearchProgress(p);
                      }
                    }, 300);
                  }}
                  fullWidth
                  size="lg"
                />
              </View>
            )}

            {searching && (
              <View style={styles.searchingContainer}>
                <View style={styles.searchingIconWrap}>
                  <MaterialCommunityIcons name="radar" size={36} color={Colors.forest} />
                </View>
                <Text style={styles.searchingTitle}>Recherche en cours...</Text>
                <Text style={styles.searchingDesc}>
                  Nous recherchons un artisan en {serviceLabel.toLowerCase()} disponible le {selectedDay} mars a {selectedSlot}
                </Text>

                <View style={styles.searchProgressBar}>
                  <View style={[styles.searchProgressFill, { width: `${Math.round(searchProgress * 100)}%` as any }]} />
                </View>

                <View style={styles.searchSteps}>
                  {[
                    { label: "Analyse de la demande", done: searchProgress > 0.2 },
                    { label: "Verification des disponibilites", done: searchProgress > 0.5 },
                    { label: "Selection du meilleur profil", done: searchProgress > 0.8 },
                  ].map((s, i) => (
                    <View key={i} style={styles.searchStepRow}>
                      <View style={[styles.searchStepDot, s.done && styles.searchStepDotDone]}>
                        {s.done && <MaterialCommunityIcons name="check" size={10} color={Colors.white} />}
                      </View>
                      <Text style={[styles.searchStepLabel, s.done && { color: Colors.forest }]}>{s.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {matchFound && (
              <View style={styles.matchContainer}>
                <View style={styles.matchIconWrap}>
                  <MaterialCommunityIcons name="check-circle" size={40} color={Colors.success} />
                </View>
                <Text style={styles.matchTitle}>Artisan trouve !</Text>
                <Text style={styles.matchDesc}>
                  Un artisan certifie en {serviceLabel.toLowerCase()} est disponible le {selectedDay} mars a {selectedSlot}.
                </Text>

                <View style={styles.matchArtisanCard}>
                  <View style={styles.matchAvatar}>
                    <Text style={styles.matchAvatarText}>JM</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.matchArtisanName}>Jean-Michel P.</Text>
                    <Text style={styles.matchArtisanMeta}>{serviceLabel} • 4.9 ★ • 127 avis</Text>
                  </View>
                </View>

                <Button
                  title="Confirmer le rendez-vous"
                  onPress={() => {
                    setModal({
                      visible: true,
                      type: "success",
                      title: "Rendez-vous confirme",
                      message: `Votre RDV avec Jean-Michel P. le ${selectedDay} mars a ${selectedSlot} est confirme.\n\nL'artisan se deplacera et etablira un devis sur place.`,
                      actions: [{
                        label: "Voir mes interventions",
                        onPress: () => {
                          setModal(m => ({ ...m, visible: false }));
                          navigation.navigate("ClientTabs" as any, { screen: "ClientMissions" });
                        },
                      }],
                    });
                  }}
                  fullWidth
                  size="lg"
                />
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
  payTypeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  payTypeBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  payTypeBtnSel: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  payTypeBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.forest },
  payTypeBtnTextSel: { color: Colors.white },
  cashWarning: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "#FFFBEB", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#FDE68A", marginBottom: 16,
  },
  cashWarningText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 19, fontFamily: "DMSans_400Regular" },
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

  /* Service badge */
  serviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(27,107,78,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
  },
  serviceBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.forest,
  },

  /* Media titles */
  mediaTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 2,
  },
  mediaSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },

  /* Searching */
  searchingContainer: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  searchingIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(27,107,78,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  searchingTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 18,
    color: Colors.navy,
    marginBottom: 6,
  },
  searchingDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  searchProgressBar: {
    width: "80%",
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: "hidden",
    marginBottom: 20,
  },
  searchProgressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: Colors.forest,
  },
  searchSteps: {
    alignSelf: "stretch",
    gap: 10,
  },
  searchStepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  searchStepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  searchStepDotDone: {
    backgroundColor: Colors.forest,
  },
  searchStepLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.textMuted,
  },

  /* Match found */
  matchContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  matchIconWrap: {
    marginBottom: 12,
  },
  matchTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 20,
    color: Colors.navy,
    marginBottom: 6,
  },
  matchDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  matchArtisanCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.15)",
    ...Shadows.sm,
  },
  matchAvatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
  },
  matchAvatarText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 14,
    color: Colors.white,
  },
  matchArtisanName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: Colors.navy,
  },
  matchArtisanMeta: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
