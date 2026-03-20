import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

const tips = [
  { icon: "\uD83D\uDCA1", title: "Bon \u00E9clairage", desc: "Allumez les lumi\u00E8res, \u00E9vitez le contre-jour" },
  { icon: "\uD83D\uDCD0", title: "Montrez la zone compl\u00E8te", desc: "Filmez large puis zoomez sur le probl\u00E8me" },
  { icon: "\uD83C\uDF99\uFE0F", title: "D\u00E9crivez \u00E0 voix haute", desc: "Expliquez ce que vous voyez et depuis quand" },
  { icon: "\u23F1\uFE0F", title: "30 \u00E0 60 secondes", desc: "Court et pr\u00E9cis, pas besoin de plus" },
];

const formatTime = (s: number) =>
  `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

export function VideoDiagnosticScreen({
  navigation,
}: RootStackScreenProps<"VideoDialognostic">) {
  const [stage, setStage] = useState(0); // 0=tips, 1=recording, 2=review, 3=sent
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [note, setNote] = useState("");

  const startRecording = () => {
    setStage(1);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage(2);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* ---- Stage 0: Tips ---- */
  if (stage === 0) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>{"\u2039"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vid\u00E9o diagnostic</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <Text style={{ fontSize: 36 }}>{"\uD83C\uDFA5"}</Text>
            </View>
            <Text style={styles.heroTitle}>Filmez votre probl\u00E8me</Text>
            <Text style={styles.heroDesc}>
              L'artisan pourra \u00E9valuer la situation avant de se d\u00E9placer et
              pr\u00E9parer le mat\u00E9riel n\u00E9cessaire.
            </Text>
          </View>

          {/* Tips */}
          <Text style={styles.sectionTitle}>
            Conseils pour une bonne vid\u00E9o
          </Text>
          {tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipIconWrap}>
                <Text style={{ fontSize: 18 }}>{tip.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDesc}>{tip.desc}</Text>
              </View>
            </View>
          ))}

          {/* Start button */}
          <TouchableOpacity
            style={styles.redButton}
            activeOpacity={0.85}
            onPress={startRecording}
          >
            <View style={styles.recDot} />
            <Text style={styles.redButtonText}>
              Commencer l'enregistrement
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  /* ---- Stage 1: Recording ---- */
  if (stage === 1) {
    return (
      <View style={styles.recordingRoot}>
        {/* Fake camera viewfinder */}
        <View style={styles.viewfinder}>
          {/* Grid overlay */}
          <View style={styles.gridOverlay}>
            <View style={[styles.gridLine, { top: "33%", left: 0, right: 0, height: 1 }]} />
            <View style={[styles.gridLine, { top: "66%", left: 0, right: 0, height: 1 }]} />
            <View style={[styles.gridLine, { left: "33%", top: 0, bottom: 0, width: 1 }]} />
            <View style={[styles.gridLine, { left: "66%", top: 0, bottom: 0, width: 1 }]} />
          </View>
          <Text style={{ fontSize: 48, opacity: 0.2 }}>{"\uD83C\uDFA5"}</Text>
          <Text style={styles.cameraLabel}>Aper\u00E7u cam\u00E9ra</Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsBar}>
          {/* Timer + REC */}
          <View style={styles.timerRow}>
            <View style={styles.recIndicator} />
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
            <View style={styles.recBadge}>
              <Text style={styles.recBadgeText}>REC</Text>
            </View>
          </View>

          {/* Stop button */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.stopBtn}
              activeOpacity={0.85}
              onPress={stopRecording}
            >
              <View style={styles.stopSquare} />
            </TouchableOpacity>
            <Text style={styles.stopHint}>Appuyez pour arr\u00EAter</Text>
          </View>
        </View>
      </View>
    );
  }

  /* ---- Stage 2: Review ---- */
  if (stage === 2) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setStage(0)}
          >
            <Text style={styles.backArrow}>{"\u2039"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Aper\u00E7u de la vid\u00E9o</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Video preview */}
          <View style={styles.videoPreview}>
            <Text style={{ fontSize: 40, color: "rgba(255,255,255,0.8)" }}>
              {"\u25B6"}
            </Text>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{formatTime(timer)}</Text>
            </View>
          </View>

          {/* Video info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dur\u00E9e</Text>
              <Text style={styles.infoValue}>{formatTime(timer)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Taille estim\u00E9e</Text>
              <Text style={styles.infoValue}>
                {Math.max(1, Math.round(timer * 0.8))} Mo
              </Text>
            </View>
          </View>

          {/* Note */}
          <Text style={styles.sectionTitle}>
            Note pour l'artisan (optionnel)
          </Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Ex: la fuite est sous l'\u00E9vier, c\u00F4t\u00E9 gauche..."
            placeholderTextColor={Colors.textHint}
            multiline
            value={note}
            onChangeText={setNote}
          />

          {/* Send button */}
          <TouchableOpacity
            style={styles.sendBtn}
            activeOpacity={0.85}
            onPress={() => setStage(3)}
          >
            <Text style={{ fontSize: 16 }}>{"\u2709\uFE0F"}</Text>
            <Text style={styles.sendBtnText}>Envoyer \u00E0 l'artisan</Text>
          </TouchableOpacity>

          {/* Redo */}
          <TouchableOpacity
            style={styles.redoBtn}
            activeOpacity={0.85}
            onPress={() => setStage(0)}
          >
            <Text style={styles.redoBtnText}>Refaire la vid\u00E9o</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  /* ---- Stage 3: Success ---- */
  return (
    <View style={styles.successRoot}>
      <View style={styles.successCircle}>
        <Text style={styles.successCheck}>{"\u2713"}</Text>
      </View>
      <Text style={styles.successTitle}>Vid\u00E9o envoy\u00E9e !</Text>
      <Text style={styles.successDesc}>
        L'artisan va analyser votre vid\u00E9o et pourra pr\u00E9parer son
        intervention plus efficacement.
      </Text>
      <View style={styles.responseTimeBadge}>
        <Text style={{ fontSize: 14 }}>{"\u23F0"}</Text>
        <Text style={styles.responseTimeText}>
          R\u00E9ponse estim\u00E9e sous 2h
        </Text>
      </View>
      <TouchableOpacity
        style={styles.primaryBtn}
        activeOpacity={0.85}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.primaryBtnText}>
          Retour \u00E0 la r\u00E9servation
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "700" },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Hero */
  heroSection: { alignItems: "center", paddingVertical: 24 },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
  },

  /* Tips */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  tipDesc: { fontSize: 12, color: Colors.textSecondary },

  /* Red button */
  redButton: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.red,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    ...Shadows.md,
  },
  recDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.white,
  },
  redButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
  },

  /* Recording */
  recordingRoot: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  viewfinder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  gridOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  cameraLabel: { fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 8 },

  controlsBar: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 20,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  recIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.red,
  },
  timerText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 24,
    color: Colors.white,
  },
  recBadge: {
    backgroundColor: "rgba(232,48,42,0.2)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  recBadgeText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 11,
    color: Colors.red,
  },
  stopBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  stopSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.red,
  },
  stopHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 10,
  },

  /* Review */
  videoPreview: {
    height: 220,
    borderRadius: 20,
    backgroundColor: "#1a1a2e",
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  durationBadge: {
    position: "absolute",
    bottom: 12,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  durationText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
    color: Colors.white,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: { fontSize: 12, color: Colors.textSecondary },
  infoValue: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
    color: Colors.navy,
  },
  noteInput: {
    width: "100%",
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    backgroundColor: Colors.white,
    marginBottom: 20,
    textAlignVertical: "top",
    color: Colors.navy,
  },
  sendBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.forest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    ...Shadows.md,
  },
  sendBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
  },
  redoBtn: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  redoBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },

  /* Success */
  successRoot: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successCheck: { fontSize: 36, color: Colors.white },
  successTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 12,
  },
  responseTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 28,
  },
  responseTimeText: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: "#14523B",
  },
  primaryBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
  },
});
