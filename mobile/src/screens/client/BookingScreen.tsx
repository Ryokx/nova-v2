import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Button, Card } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
const AVAILABLE_DAYS = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29];
const TIME_SLOTS = ["9h00", "11h00", "14h00", "16h00", "18h00"];
const FIRST_DAY_OFFSET = 6; // March 2026 starts on Sunday -> 6 empty cells (Mon-based grid)
const TOTAL_DAYS = 31;

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
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())}
        >
          <Text style={styles.backArrow}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prise de rendez-vous</Text>
      </View>

      <ProgressSteps steps={["Date", "Details", "Confirmation"]} current={step} />

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
                    const isAvail = AVAILABLE_DAYS.includes(day);
                    const isSel = day === selectedDay;
                    return (
                      <TouchableOpacity
                        key={day}
                        disabled={!isAvail}
                        onPress={() => setSelectedDay(day)}
                        style={[
                          styles.calendarDayCell,
                          isSel && styles.calendarDaySel,
                          !isSel && isAvail && styles.calendarDayAvail,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.calendarDayText,
                            isSel && styles.calendarDayTextSel,
                            !isSel &&
                              isAvail &&
                              styles.calendarDayTextAvail,
                            !isAvail &&
                              !isSel &&
                              styles.calendarDayTextDisabled,
                          ]}
                        >
                          {day}
                        </Text>
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
            <Text style={styles.stepTitle}>Choisissez un creneau</Text>
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
              style={styles.textarea}
              placeholder="Decrivez votre probleme..."
              placeholderTextColor={Colors.textHint}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.photoBtn} activeOpacity={0.7}>
              <Text style={styles.photoBtnText}>
                {"\uD83D\uDCF7"} Ajouter des photos
              </Text>
            </TouchableOpacity>

            <View style={{ marginTop: 16 }}>
              <Button
                title="Suivant"
                onPress={() => setStep(2)}
                fullWidth
                size="lg"
              />
            </View>
          </View>
        )}

        {/* ====== STEP 2 : Confirmation ====== */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Recapitulatif</Text>
            <Card style={{ marginBottom: 16 }}>
              {[
                ["Artisan", "Jean-Michel P."],
                ["Date", `${selectedDay} mars 2026`],
                ["Creneau", selectedSlot || "14h00"],
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
              <Text style={{ fontSize: 16 }}>{"\uD83D\uDD12"}</Text>
              <Text style={styles.escrowBadgeText}>
                Aucun debit immediat — Nova controle et valide
              </Text>
            </View>

            <Button
              title="Confirmer le rendez-vous"
              onPress={() =>
                navigation.navigate("Payment", {
                  missionId: "1",
                  amount: 320,
                })
              }
              fullWidth
              size="lg"
            />
          </View>
        )}
      </ScrollView>
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

  /* Photo button */
  photoBtn: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.3)",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  photoBtnText: { fontSize: 13, fontWeight: "600", color: Colors.forest },

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
