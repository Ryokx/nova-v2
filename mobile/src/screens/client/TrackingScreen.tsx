import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar, Button, Card } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/* ── Simulated route points (Paris 4e) ── */
const CLIENT_LOCATION = { latitude: 48.8546, longitude: 2.3477 }; // 12 rue de Rivoli
const ROUTE_POINTS = [
  { latitude: 48.8610, longitude: 2.3700 }, // Start: artisan departs
  { latitude: 48.8595, longitude: 2.3650 },
  { latitude: 48.8580, longitude: 2.3600 },
  { latitude: 48.8570, longitude: 2.3560 },
  { latitude: 48.8560, longitude: 2.3520 },
  { latitude: 48.8550, longitude: 2.3490 },
  CLIENT_LOCATION, // Arrival
];

interface TimelineStep {
  label: string;
  desc: string;
  time: string;
  done: boolean;
}

export function TrackingScreen({
  navigation,
}: RootStackScreenProps<"Tracking">) {
  const [trackingStep, setTrackingStep] = useState(1);
  const [artisanPos, setArtisanPos] = useState(ROUTE_POINTS[0]);
  const [routeIndex, setRouteIndex] = useState(0);
  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Simulate artisan movement when "en route"
  useEffect(() => {
    if (trackingStep !== 1) return;
    const interval = setInterval(() => {
      setRouteIndex((prev) => {
        const next = prev + 1;
        if (next >= ROUTE_POINTS.length) {
          clearInterval(interval);
          return prev;
        }
        setArtisanPos(ROUTE_POINTS[next]!);
        // Animate map to follow
        mapRef.current?.animateToRegion({
          ...ROUTE_POINTS[next]!,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }, 1000);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [trackingStep]);

  const steps: TimelineStep[] = [
    { label: "Devis signé", desc: "Le paiement est bloqué en séquestre", time: "14:02", done: true },
    { label: "Artisan en route", desc: "Jean-Michel P. arrive dans ~15 min", time: "14:35", done: trackingStep >= 1 },
    { label: "Sur place", desc: "L'intervention a commencé", time: trackingStep >= 2 ? "14:52" : "—", done: trackingStep >= 2 },
    { label: "Intervention terminée", desc: "En attente de votre validation", time: trackingStep >= 3 ? "15:40" : "—", done: trackingStep >= 3 },
  ];

  const etaMinutes = Math.max(0, (ROUTE_POINTS.length - 1 - routeIndex) * 2);

  return (
    <View style={styles.root}>
      {/* ── Map ── */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 48.8575,
            longitude: 2.3580,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={false}
        >
          {/* Route polyline */}
          <Polyline
            coordinates={ROUTE_POINTS.slice(0, routeIndex + 1)}
            strokeColor={Colors.forest}
            strokeWidth={4}
          />
          {/* Remaining route */}
          <Polyline
            coordinates={ROUTE_POINTS.slice(routeIndex)}
            strokeColor={Colors.border}
            strokeWidth={3}
            lineDashPattern={[8, 6]}
          />

          {/* Client marker */}
          <Marker coordinate={CLIENT_LOCATION} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.clientMarker}>
              <View style={styles.clientMarkerInner}>
                <MaterialCommunityIcons name="home" size={14} color={Colors.white} />
              </View>
            </View>
          </Marker>

          {/* Artisan marker */}
          {trackingStep <= 1 && (
            <Marker coordinate={artisanPos} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.artisanMarker}>
                <View style={styles.artisanMarkerInner}>
                  <MaterialCommunityIcons name="truck-delivery" size={16} color={Colors.white} />
                </View>
              </View>
            </Marker>
          )}

          {/* On-site marker (replaces truck when arrived) */}
          {trackingStep >= 2 && (
            <Marker coordinate={CLIENT_LOCATION} anchor={{ x: 0.5, y: 1 }}>
              <View style={styles.onSiteMarker}>
                <MaterialCommunityIcons name="wrench" size={16} color={Colors.white} />
              </View>
            </Marker>
          )}
        </MapView>

        {/* Back button overlay */}
        <TouchableOpacity style={styles.mapBackBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.navy} />
        </TouchableOpacity>

        {/* ETA overlay */}
        {trackingStep === 1 && (
          <View style={styles.etaOverlay}>
            <Animated.View style={[styles.etaDot, { opacity: pulseAnim }]} />
            <Text style={styles.etaText}>
              {etaMinutes > 0 ? `Arrivée dans ~${etaMinutes} min` : "Arrivée imminente"}
            </Text>
          </View>
        )}
        {trackingStep === 2 && (
          <View style={[styles.etaOverlay, { backgroundColor: "rgba(27,107,78,0.92)" }]}>
            <MaterialCommunityIcons name="wrench" size={14} color={Colors.white} />
            <Text style={[styles.etaText, { color: Colors.white }]}>Intervention en cours</Text>
          </View>
        )}
        {trackingStep >= 3 && (
          <View style={[styles.etaOverlay, { backgroundColor: "rgba(34,200,138,0.92)" }]}>
            <MaterialCommunityIcons name="check-circle" size={14} color={Colors.white} />
            <Text style={[styles.etaText, { color: Colors.white }]}>Terminée — En attente de validation</Text>
          </View>
        )}
      </View>

      {/* ── Bottom sheet ── */}
      <ScrollView
        style={styles.bottomSheet}
        contentContainerStyle={styles.bottomSheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Artisan card */}
        <View style={styles.artisanCard}>
          <Avatar name="Jean-Michel Petit" size={48} radius={16} />
          <View style={{ flex: 1 }}>
            <Text style={styles.artisanName}>Jean-Michel Petit</Text>
            <Text style={styles.artisanMeta}>Plombier • Fuite sous évier</Text>
          </View>
          <View style={styles.artisanActions}>
            <TouchableOpacity style={styles.smallIconBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="chat-outline" size={16} color={Colors.forest} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallIconBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="phone-outline" size={16} color={Colors.forest} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeline */}
        <Text style={styles.sectionTitle}>Progression</Text>
        {steps.map((s, i) => (
          <View key={i} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineCircle, s.done && styles.timelineCircleDone]}>
                {s.done ? (
                  <Text style={styles.timelineCheck}>{"✓"}</Text>
                ) : (
                  <Text style={styles.timelineNum}>{i + 1}</Text>
                )}
              </View>
              {i < 3 && (
                <View style={[styles.timelineLine, s.done && styles.timelineLineDone]} />
              )}
            </View>
            <View style={[styles.timelineContent, i < 3 && { paddingBottom: 16 }]}>
              <View style={styles.timelineLabelRow}>
                <Text style={[styles.timelineLabel, s.done && { color: Colors.forest }]}>{s.label}</Text>
                <Text style={styles.timelineTime}>{s.time}</Text>
              </View>
              <Text style={styles.timelineDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}

        {/* Escrow info */}
        <View style={styles.escrowCard}>
          <MaterialCommunityIcons name="lock" size={14} color={Colors.forest} />
          <View style={{ flex: 1 }}>
            <Text style={styles.escrowTitle}>320,00€ en séquestre</Text>
            <Text style={styles.escrowNote}>Libéré après votre validation</Text>
          </View>
        </View>

        {/* Demo advance buttons */}
        <View style={styles.demoRow}>
          {[
            { label: "→ Sur place", step: 2 },
            { label: "→ Terminé", step: 3 },
          ]
            .filter((b) => b.step > trackingStep)
            .map((b) => (
              <TouchableOpacity
                key={b.step}
                onPress={() => setTrackingStep(b.step)}
                style={styles.demoBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.demoBtnText}>Demo : {b.label}</Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Validate button */}
        {trackingStep >= 3 && (
          <Button
            title="Valider l'intervention"
            onPress={() => navigation.navigate("MissionDetail", { id: "mission-completed" })}
            fullWidth
            size="lg"
            style={{ marginTop: 12 }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },

  /* Map */
  mapContainer: {
    height: SCREEN_WIDTH * 0.65,
    position: "relative",
  },
  map: { flex: 1 },
  mapBackBtn: {
    position: "absolute",
    top: 54,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  etaOverlay: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    ...Shadows.md,
  },
  etaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  etaText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },

  /* Markers */
  clientMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  clientMarkerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.md,
  },
  artisanMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  artisanMarkerInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.navy,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.lg,
  },
  onSiteMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.md,
  },

  /* Bottom sheet */
  bottomSheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    ...Shadows.lg,
  },
  bottomSheetContent: {
    padding: 20,
    paddingBottom: 100,
  },

  /* Artisan card */
  artisanCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  artisanName: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy },
  artisanMeta: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary },
  artisanActions: { flexDirection: "row", gap: 6 },
  smallIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Timeline */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 14,
  },
  timelineRow: { flexDirection: "row", gap: 12 },
  timelineLeft: { alignItems: "center", width: 26 },
  timelineCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border,
    alignItems: "center", justifyContent: "center",
  },
  timelineCircleDone: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  timelineCheck: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  timelineNum: { fontFamily: "DMMono_500Medium", fontSize: 10, color: Colors.textSecondary },
  timelineLine: { width: 2, height: 28, backgroundColor: Colors.border },
  timelineLineDone: { backgroundColor: Colors.forest },
  timelineContent: { flex: 1, paddingTop: 2 },
  timelineLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  timelineLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },
  timelineTime: { fontFamily: "DMMono_500Medium", fontSize: 10, color: Colors.textSecondary },
  timelineDesc: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary, lineHeight: 16 },

  /* Escrow */
  escrowCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "rgba(27,107,78,0.05)", borderRadius: 14,
    padding: 12, marginTop: 16, borderWidth: 1, borderColor: "rgba(27,107,78,0.1)",
  },
  escrowTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: "#14523B" },
  escrowNote: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary },

  /* Demo */
  demoRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  demoBtn: {
    flex: 1, padding: 10, borderRadius: 12,
    backgroundColor: Colors.bgPage, borderWidth: 1, borderStyle: "dashed",
    borderColor: Colors.border, alignItems: "center",
  },
  demoBtnText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary },
});
