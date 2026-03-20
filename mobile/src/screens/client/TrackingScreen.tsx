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
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Shadows } from "../../constants/theme";
import { Avatar, Button } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/* ── Route points Paris 4e ── */
const ROUTE = [
  [48.8610, 2.3700],
  [48.8595, 2.3650],
  [48.8580, 2.3600],
  [48.8570, 2.3560],
  [48.8560, 2.3520],
  [48.8550, 2.3490],
  [48.8546, 2.3477], // client
] as const;

const CLIENT = ROUTE[ROUTE.length - 1]!;

function buildMapHtml(artisanIndex: number, step: number) {
  const artisan = ROUTE[Math.min(artisanIndex, ROUTE.length - 1)]!;
  const traveled = ROUTE.slice(0, artisanIndex + 1).map(p => `[${p[0]},${p[1]}]`).join(",");
  const remaining = ROUTE.slice(artisanIndex).map(p => `[${p[0]},${p[1]}]`).join(",");
  const showTruck = step <= 1;

  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  *{margin:0;padding:0}
  #map{width:100%;height:100vh}
  .client-marker{background:#1B6B4E;border:3px solid #fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)}
  .client-marker svg{fill:#fff;width:14px;height:14px}
  .artisan-marker{background:#0A1628;border:3px solid #fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.4);transition:all 1s ease}
  .artisan-marker svg{fill:#fff;width:16px;height:16px}
  .onsite-marker{background:#22C88A;border:3px solid #fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)}
  .onsite-marker svg{fill:#fff;width:14px;height:14px}
</style>
</head><body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false,attributionControl:false}).setView([48.8575,2.358],14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

// Traveled route
L.polyline([${traveled}],{color:'#1B6B4E',weight:4,opacity:0.9}).addTo(map);
// Remaining route
L.polyline([${remaining}],{color:'#D4EBE0',weight:3,dashArray:'8,8'}).addTo(map);

// Client marker
var clientIcon=L.divIcon({className:'',html:'<div class="client-marker"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/></svg></div>',iconSize:[28,28],iconAnchor:[14,14]});
L.marker([${CLIENT[0]},${CLIENT[1]}],{icon:clientIcon}).addTo(map);

${showTruck ? `
// Artisan marker (truck)
var artisanIcon=L.divIcon({className:'',html:'<div class="artisan-marker"><svg viewBox="0 0 24 24"><path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z"/></svg></div>',iconSize:[32,32],iconAnchor:[16,16]});
L.marker([${artisan[0]},${artisan[1]}],{icon:artisanIcon}).addTo(map);
` : `
// On-site marker (wrench)
var onsiteIcon=L.divIcon({className:'',html:'<div class="onsite-marker"><svg viewBox="0 0 24 24"><path d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z"/></svg></div>',iconSize:[28,28],iconAnchor:[14,14]});
L.marker([${CLIENT[0]},${CLIENT[1]}],{icon:onsiteIcon}).addTo(map);
`}

map.fitBounds([[${ROUTE[0]![0]},${ROUTE[0]![1]}],[${CLIENT[0]},${CLIENT[1]}]],{padding:[40,40]});
</script></body></html>`;
}

interface TimelineStep {
  label: string;
  desc: string;
  time: string;
  done: boolean;
}

export function TrackingScreen({ navigation }: RootStackScreenProps<"Tracking">) {
  const [trackingStep, setTrackingStep] = useState(1);
  const [routeIndex, setRouteIndex] = useState(0);
  const [mapHtml, setMapHtml] = useState(() => buildMapHtml(0, 1));
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  // Simulate artisan movement
  useEffect(() => {
    if (trackingStep !== 1) return;
    const interval = setInterval(() => {
      setRouteIndex((prev) => {
        const next = prev + 1;
        if (next >= ROUTE.length) { clearInterval(interval); return prev; }
        setMapHtml(buildMapHtml(next, 1));
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [trackingStep]);

  // Update map on step change
  useEffect(() => {
    if (trackingStep >= 2) {
      setMapHtml(buildMapHtml(ROUTE.length - 1, trackingStep));
    }
  }, [trackingStep]);

  const etaMinutes = Math.max(0, (ROUTE.length - 1 - routeIndex) * 2);

  const steps: TimelineStep[] = [
    { label: "Devis signé", desc: "Paiement bloqué en séquestre", time: "14:02", done: true },
    { label: "Artisan en route", desc: `Jean-Michel P. arrive dans ~${etaMinutes} min`, time: "14:35", done: trackingStep >= 1 },
    { label: "Sur place", desc: "L'intervention a commencé", time: trackingStep >= 2 ? "14:52" : "—", done: trackingStep >= 2 },
    { label: "Terminée", desc: "En attente de validation", time: trackingStep >= 3 ? "15:40" : "—", done: trackingStep >= 3 },
  ];

  return (
    <View style={styles.root}>
      {/* ── Map ── */}
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: mapHtml }}
          style={styles.map}
          scrollEnabled={false}
          javaScriptEnabled
        />

        <TouchableOpacity style={styles.mapBackBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.navy} />
        </TouchableOpacity>

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
            <Text style={[styles.etaText, { color: Colors.white }]}>Terminée — Validez ci-dessous</Text>
          </View>
        )}
      </View>

      {/* ── Bottom sheet ── */}
      <ScrollView style={styles.bottomSheet} contentContainerStyle={styles.bsContent} showsVerticalScrollIndicator={false}>
        <View style={styles.bsHandle} />

        <View style={styles.artisanCard}>
          <Avatar name="Jean-Michel Petit" size={46} radius={15} />
          <View style={{ flex: 1 }}>
            <Text style={styles.artisanName}>Jean-Michel Petit</Text>
            <Text style={styles.artisanMeta}>Plombier • Fuite sous évier</Text>
          </View>
          <View style={styles.artisanActions}>
            <TouchableOpacity style={styles.smBtn}><MaterialCommunityIcons name="chat-outline" size={16} color={Colors.forest} /></TouchableOpacity>
            <TouchableOpacity style={styles.smBtn}><MaterialCommunityIcons name="phone-outline" size={16} color={Colors.forest} /></TouchableOpacity>
          </View>
        </View>

        <Text style={styles.secTitle}>Progression</Text>
        {steps.map((s, i) => (
          <View key={i} style={styles.tlRow}>
            <View style={styles.tlLeft}>
              <View style={[styles.tlCircle, s.done && styles.tlCircleDone]}>
                {s.done ? <Text style={styles.tlCheck}>✓</Text> : <Text style={styles.tlNum}>{i + 1}</Text>}
              </View>
              {i < 3 && <View style={[styles.tlLine, s.done && styles.tlLineDone]} />}
            </View>
            <View style={[styles.tlContent, i < 3 && { paddingBottom: 14 }]}>
              <View style={styles.tlLabelRow}>
                <Text style={[styles.tlLabel, s.done && { color: Colors.forest }]}>{s.label}</Text>
                <Text style={styles.tlTime}>{s.time}</Text>
              </View>
              <Text style={styles.tlDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.escrow}>
          <MaterialCommunityIcons name="lock" size={14} color={Colors.forest} />
          <View style={{ flex: 1 }}>
            <Text style={styles.escrowTitle}>320,00€ en séquestre</Text>
            <Text style={styles.escrowNote}>Libéré après votre validation</Text>
          </View>
        </View>

        <View style={styles.demoRow}>
          {[{ label: "→ Sur place", step: 2 }, { label: "→ Terminé", step: 3 }]
            .filter(b => b.step > trackingStep)
            .map(b => (
              <TouchableOpacity key={b.step} onPress={() => setTrackingStep(b.step)} style={styles.demoBtn}>
                <Text style={styles.demoBtnText}>Demo : {b.label}</Text>
              </TouchableOpacity>
            ))}
        </View>

        {trackingStep >= 3 && (
          <Button title="Valider l'intervention" onPress={() => navigation.navigate("MissionDetail", { id: "mission-completed" })} fullWidth size="lg" style={{ marginTop: 12 }} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },

  mapContainer: { height: SCREEN_WIDTH * 0.7, position: "relative" },
  map: { flex: 1, backgroundColor: "#E8F5EE" },
  mapBackBtn: {
    position: "absolute", top: 54, left: 16,
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", ...Shadows.md,
  },
  etaOverlay: {
    position: "absolute", bottom: 28, alignSelf: "center",
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, ...Shadows.md,
  },
  etaDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold },
  etaText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.navy },

  bottomSheet: {
    flex: 1, backgroundColor: Colors.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -20, ...Shadows.lg,
  },
  bsContent: { padding: 20, paddingTop: 12, paddingBottom: 100 },
  bsHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: "center", marginBottom: 14,
  },

  artisanCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingBottom: 14, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.surface,
  },
  artisanName: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy },
  artisanMeta: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary },
  artisanActions: { flexDirection: "row", gap: 6 },
  smBtn: {
    width: 34, height: 34, borderRadius: 11,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: "center", justifyContent: "center",
  },

  secTitle: { fontFamily: "Manrope_700Bold", fontSize: 14, color: Colors.navy, marginBottom: 12 },
  tlRow: { flexDirection: "row", gap: 12 },
  tlLeft: { alignItems: "center", width: 24 },
  tlCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border,
    alignItems: "center", justifyContent: "center",
  },
  tlCircleDone: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  tlCheck: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  tlNum: { fontFamily: "DMMono_500Medium", fontSize: 9, color: Colors.textSecondary },
  tlLine: { width: 2, height: 24, backgroundColor: Colors.border },
  tlLineDone: { backgroundColor: Colors.forest },
  tlContent: { flex: 1, paddingTop: 1 },
  tlLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tlLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 12.5, color: Colors.navy },
  tlTime: { fontFamily: "DMMono_500Medium", fontSize: 10, color: Colors.textSecondary },
  tlDesc: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary },

  escrow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "rgba(27,107,78,0.05)", borderRadius: 14,
    padding: 12, marginTop: 14, borderWidth: 1, borderColor: "rgba(27,107,78,0.1)",
  },
  escrowTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: "#14523B" },
  escrowNote: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary },

  demoRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  demoBtn: {
    flex: 1, padding: 10, borderRadius: 12,
    backgroundColor: Colors.bgPage, borderWidth: 1, borderStyle: "dashed",
    borderColor: Colors.border, alignItems: "center",
  },
  demoBtnText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary },
});
