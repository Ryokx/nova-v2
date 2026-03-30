import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Shadows } from "../../constants/theme";
import { Avatar, Button, ConfirmModal } from "../../components/ui";
import { getAvatarUri } from "../../constants/avatars";
import type { RootStackScreenProps } from "../../navigation/types";

/* ── Artisan contact (en prod: fetch API) ── */
const ARTISAN_PHONE = "+33612345678";
const ARTISAN_NAME = "Jean-Michel Petit";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/* ── Adresses reelles ── */
const ORIGIN: [number, number] = [48.8533, 2.3692]; // 15 Place de la Bastille
const DESTINATION: [number, number] = [48.8568, 2.3170]; // 12 Rue de Rivoli
const ORIGIN_LABEL = "15 Place de la Bastille";
const DESTINATION_LABEL = "12 Rue de Rivoli";

/* ── Fallback route (ligne droite simplifiee) ── */
const FALLBACK_ROUTE: [number, number][] = [ORIGIN, DESTINATION];

function buildMapHtml(route: [number, number][], artisanProgress: number, step: number) {
  const points = route.length >= 2 ? route : FALLBACK_ROUTE;
  const idx = Math.min(Math.floor(artisanProgress * (points.length - 1)), points.length - 2);
  const frac = (artisanProgress * (points.length - 1)) - idx;
  const artLat = points[idx][0] + (points[idx + 1][0] - points[idx][0]) * frac;
  const artLng = points[idx][1] + (points[idx + 1][1] - points[idx][1]) * frac;

  const artIdx = Math.round(artisanProgress * (points.length - 1));
  const traveled = points.slice(0, artIdx + 1).map(p => `[${p[0]},${p[1]}]`).join(",");
  const remaining = points.slice(artIdx).map(p => `[${p[0]},${p[1]}]`).join(",");
  const showTruck = step <= 1;
  const dest = points[points.length - 1];

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
  .artisan-marker{background:#0A4030;border:3px solid #F5A623;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.4)}
  .artisan-marker svg{fill:#fff;width:16px;height:16px}
  .onsite-marker{background:#22C88A;border:3px solid #fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)}
  .onsite-marker svg{fill:#fff;width:14px;height:14px}
  .start-dot{width:10px;height:10px;background:#6B7280;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.2)}
  .leaflet-control-zoom{display:none!important}
</style>
</head><body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false,attributionControl:false});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:20,subdomains:'abcd'}).addTo(map);

// Traveled route (solid green)
L.polyline([${traveled}],{color:'#1B6B4E',weight:4,opacity:0.9}).addTo(map);
// Remaining route (dashed)
L.polyline([${remaining}],{color:'#D4EBE0',weight:3,dashArray:'8,8'}).addTo(map);

// Start dot
L.marker([${points[0][0]},${points[0][1]}],{icon:L.divIcon({className:'',html:'<div class="start-dot"></div>',iconSize:[10,10],iconAnchor:[5,5]})}).addTo(map);

// Client marker (destination)
var clientIcon=L.divIcon({className:'',html:'<div class="client-marker"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/></svg></div>',iconSize:[28,28],iconAnchor:[14,14]});
L.marker([${dest[0]},${dest[1]}],{icon:clientIcon}).addTo(map);

${showTruck ? `
// Artisan marker (truck, animated position)
var artisanIcon=L.divIcon({className:'',html:'<div class="artisan-marker"><svg viewBox="0 0 24 24"><path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z"/></svg></div>',iconSize:[32,32],iconAnchor:[16,16]});
L.marker([${artLat},${artLng}],{icon:artisanIcon}).addTo(map);
` : `
// On-site marker (wrench)
var onsiteIcon=L.divIcon({className:'',html:'<div class="onsite-marker"><svg viewBox="0 0 24 24"><path d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z"/></svg></div>',iconSize:[28,28],iconAnchor:[14,14]});
L.marker([${dest[0]},${dest[1]}],{icon:onsiteIcon}).addTo(map);
`}

var allPts=[${points.map(p => `[${p[0]},${p[1]}]`).join(",")}];
map.fitBounds(L.latLngBounds(allPts).pad(0.15));
</script></body></html>`;
}

interface TimelineStep {
  label: string;
  desc: string;
  time: string;
  done: boolean;
}

// Steps: 0=En route, 1=Sur place, 2=Devis signé, 3=Paiement bloqué, 4=Intervention en cours, 5=Intervention terminée, 6=Validation Nova, 7=Artisan payé
export function TrackingScreen({ navigation }: RootStackScreenProps<"Tracking">) {
  const [trackingStep, setTrackingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [route, setRoute] = useState<[number, number][]>(FALLBACK_ROUTE);
  const [routeInfo, setRouteInfo] = useState({ distanceKm: 2.8, durationMin: 18 });
  const [routeLoaded, setRouteLoaded] = useState(false);
  const [mapHtml, setMapHtml] = useState(() => buildMapHtml(FALLBACK_ROUTE, 0, 0));
  const [cancelled, setCancelled] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: "info" as const, title: "", message: "", actions: [] as any[] });
  const startTimeRef = useRef(Date.now());
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Fetch real route from OSRM (once)
  useEffect(() => {
    (async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${ORIGIN[1]},${ORIGIN[0]};${DESTINATION[1]},${DESTINATION[0]}?overview=full&geometries=geojson&steps=false`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.[0]) {
          const r = data.routes[0];
          const coords: [number, number][] = r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          const step = Math.max(1, Math.floor(coords.length / 60));
          const simplified = coords.filter((_: [number, number], i: number) => i % step === 0 || i === coords.length - 1);
          setRoute(simplified);
          setRouteInfo({ distanceKm: r.distance / 1000, durationMin: r.duration / 60 });
        }
      } catch {}
      setRouteLoaded(true);
    })();
  }, []);

  // Artisan profile config (in production, fetched from API)
  const artisanConfig = {
    deploymentFree: false, // false = artisan charges displacement
    deploymentFee: 45, // € — set by artisan in their profile
  };

  const canCancel = trackingStep <= 1; // Only before devis signed
  const minutesSinceStart = Math.floor((Date.now() - startTimeRef.current) / 60000);
  const isEarlyCancel = minutesSinceStart < 5;

  const handleCancel = () => {
    if (isEarlyCancel && trackingStep === 0) {
      setModal({
        visible: true,
        type: "warning",
        title: "Annuler l'intervention",
        message: "Vous annulez moins de 5 minutes après la demande.\n\nAucun frais ne sera facturé.",
        actions: [
          { label: "Non, garder", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
          { label: "Oui, annuler", variant: "danger", onPress: () => { setModal(m => ({ ...m, visible: false })); setCancelled(true); } },
        ],
      });
    } else if (trackingStep === 0) {
      const feeText = artisanConfig.deploymentFree
        ? "Le déplacement est offert par cet artisan. Aucun frais."
        : `Les frais de déplacement de ${artisanConfig.deploymentFee},00€ (tarif fixé par l'artisan) restent à votre charge.`;
      setModal({
        visible: true,
        type: "warning",
        title: "Annuler l'intervention",
        message: `Êtes-vous sûr de vouloir annuler ?\n\n${feeText}`,
        actions: [
          { label: "Non, garder", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
          { label: artisanConfig.deploymentFree ? "Oui, annuler" : `Oui, annuler (${artisanConfig.deploymentFee}€)`, variant: "danger", onPress: () => { setModal(m => ({ ...m, visible: false })); setCancelled(true); } },
        ],
      });
    } else {
      setModal({
        visible: true,
        type: "danger",
        title: "Annuler l'intervention",
        message: `L'artisan est déjà sur place.\n\nLes frais de déplacement de ${artisanConfig.deploymentFee},00€ restent à votre charge.`,
        actions: [
          { label: "Non, garder", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
          { label: `Oui, annuler (${artisanConfig.deploymentFee}€)`, variant: "danger", onPress: () => { setModal(m => ({ ...m, visible: false })); setCancelled(true); } },
        ],
      });
    }
  };

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

  // Animate artisan progress (30s demo, only while en route)
  useEffect(() => {
    if (!routeLoaded || trackingStep !== 0) return;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 0.015, 1);
        return next;
      });
    }, 450);
    return () => clearInterval(interval);
  }, [routeLoaded, trackingStep]);

  // Update map when progress or step changes (throttled)
  const lastMapUpdate = useRef(0);
  useEffect(() => {
    const now = Date.now();
    if (now - lastMapUpdate.current < 400 && trackingStep === 0) return;
    lastMapUpdate.current = now;
    const p = trackingStep >= 1 ? 1 : progress;
    setMapHtml(buildMapHtml(route, p, trackingStep));
  }, [progress, trackingStep, route]);

  const etaMinutes = Math.max(1, Math.round((1 - progress) * routeInfo.durationMin));
  const distanceKm = Math.max(0.1, (1 - progress) * routeInfo.distanceKm).toFixed(1);

  const steps: TimelineStep[] = [
    { label: "Artisan en route", desc: `Jean-Michel P. arrive dans ~${etaMinutes} min (${distanceKm} km)`, time: "14:20", done: trackingStep >= 0 },
    { label: "Artisan sur place", desc: "L'artisan est arrivé chez vous", time: trackingStep >= 1 ? "14:35" : "—", done: trackingStep >= 1 },
    { label: "Devis signé", desc: "Le devis a été établi et signé sur place", time: trackingStep >= 2 ? "14:45" : "—", done: trackingStep >= 2 },
    { label: "Paiement bloqué", desc: "Montant bloqué en séquestre chez Nova", time: trackingStep >= 3 ? "14:46" : "—", done: trackingStep >= 3 },
    { label: "Intervention en cours", desc: "L'artisan réalise les travaux", time: trackingStep >= 4 ? "14:50" : "—", done: trackingStep >= 4 },
    { label: "Intervention terminée", desc: "Les travaux sont terminés", time: trackingStep >= 5 ? "15:40" : "—", done: trackingStep >= 5 },
    { label: "Validation Nova", desc: "Nova vérifie la conformité", time: trackingStep >= 6 ? "15:45" : "—", done: trackingStep >= 6 },
    { label: "Artisan payé", desc: "Le paiement est libéré à l'artisan", time: trackingStep >= 7 ? "15:50" : "—", done: trackingStep >= 7 },
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

        {trackingStep === 0 && (
          <View style={styles.etaOverlay}>
            <Animated.View style={[styles.etaDot, { opacity: pulseAnim }]} />
            <View>
              <Text style={styles.etaText}>
                {etaMinutes > 0 ? `Arrivee dans ~${etaMinutes} min` : "Arrivee imminente"}
              </Text>
              <Text style={styles.etaSubtext}>{distanceKm} km restants</Text>
            </View>
          </View>
        )}
        {trackingStep === 1 && (
          <View style={[styles.etaOverlay, { backgroundColor: "rgba(27,107,78,0.92)" }]}>
            <MaterialCommunityIcons name="account-check" size={14} color={Colors.white} />
            <Text style={[styles.etaText, { color: Colors.white }]}>Artisan sur place</Text>
          </View>
        )}
        {(trackingStep === 2 || trackingStep === 3) && (
          <View style={[styles.etaOverlay, { backgroundColor: "rgba(245,166,35,0.92)" }]}>
            <MaterialCommunityIcons name="file-sign" size={14} color={Colors.white} />
            <Text style={[styles.etaText, { color: Colors.white }]}>
              {trackingStep === 2 ? "Devis signé" : "Paiement bloqué en séquestre"}
            </Text>
          </View>
        )}
        {trackingStep === 4 && (
          <View style={[styles.etaOverlay, { backgroundColor: "rgba(27,107,78,0.92)" }]}>
            <MaterialCommunityIcons name="wrench" size={14} color={Colors.white} />
            <Text style={[styles.etaText, { color: Colors.white }]}>Intervention en cours</Text>
          </View>
        )}
        {trackingStep === 5 && (
          <View style={[styles.etaOverlay, { backgroundColor: "rgba(34,200,138,0.92)" }]}>
            <MaterialCommunityIcons name="check-circle" size={14} color={Colors.white} />
            <Text style={[styles.etaText, { color: Colors.white }]}>Terminée — En attente de validation</Text>
          </View>
        )}
        {trackingStep >= 6 && (
          <View style={[styles.etaOverlay, { backgroundColor: "rgba(34,200,138,0.92)" }]}>
            <MaterialCommunityIcons name="shield-check" size={14} color={Colors.white} />
            <Text style={[styles.etaText, { color: Colors.white }]}>
              {trackingStep === 6 ? "Nova vérifie..." : "Artisan payé ✓"}
            </Text>
          </View>
        )}
      </View>

      {/* ── Bottom sheet ── */}
      <ScrollView style={styles.bottomSheet} contentContainerStyle={styles.bsContent} showsVerticalScrollIndicator={false}>
        <View style={styles.bsHandle} />

        <View style={styles.artisanCard}>
          <Avatar name="Jean-Michel Petit" size={46} radius={15} uri={getAvatarUri("Jean-Michel Petit")} />
          <View style={{ flex: 1 }}>
            <Text style={styles.artisanName}>Jean-Michel Petit</Text>
            <Text style={styles.artisanMeta}>Plombier • Fuite sous évier</Text>
          </View>
          <View style={styles.artisanActions}>
            <TouchableOpacity
              style={styles.smBtn}
              activeOpacity={0.7}
              onPress={() => {
                const smsUrl = `sms:${ARTISAN_PHONE}`;
                Linking.canOpenURL(smsUrl).then(supported => {
                  if (supported) Linking.openURL(smsUrl);
                  else Alert.alert("SMS", `Envoyez un SMS au ${ARTISAN_PHONE}`);
                });
              }}
            >
              <MaterialCommunityIcons name="chat-outline" size={16} color={Colors.forest} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smBtn}
              activeOpacity={0.7}
              onPress={() => {
                const telUrl = `tel:${ARTISAN_PHONE}`;
                Linking.canOpenURL(telUrl).then(supported => {
                  if (supported) {
                    Alert.alert(
                      "Appeler l'artisan",
                      `Appeler ${ARTISAN_NAME} ?`,
                      [
                        { text: "Annuler", style: "cancel" },
                        { text: "Appeler", onPress: () => Linking.openURL(telUrl) },
                      ]
                    );
                  } else {
                    Alert.alert("Appel", `Appelez le ${ARTISAN_PHONE}`);
                  }
                });
              }}
            >
              <MaterialCommunityIcons name="phone-outline" size={16} color={Colors.forest} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.secTitle}>Progression</Text>
        {steps.map((s, i) => (
          <View key={i} style={styles.tlRow}>
            <View style={styles.tlLeft}>
              <View style={[styles.tlCircle, s.done && styles.tlCircleDone]}>
                {s.done ? <Text style={styles.tlCheck}>✓</Text> : <Text style={styles.tlNum}>{i + 1}</Text>}
              </View>
              {i < steps.length - 1 && <View style={[styles.tlLine, s.done && styles.tlLineDone]} />}
            </View>
            <View style={[styles.tlContent, i < steps.length - 1 && { paddingBottom: 12 }]}>
              <View style={styles.tlLabelRow}>
                <Text style={[styles.tlLabel, s.done && { color: Colors.forest }]}>{s.label}</Text>
                <Text style={styles.tlTime}>{s.time}</Text>
              </View>
              <Text style={styles.tlDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.escrow}>
          <MaterialCommunityIcons name={trackingStep >= 7 ? "lock-open" : "lock"} size={14} color={trackingStep >= 7 ? Colors.success : Colors.forest} />
          <View style={{ flex: 1 }}>
            <Text style={styles.escrowTitle}>
              {trackingStep < 3 ? "En attente du devis" : trackingStep >= 7 ? "320,00€ libérés" : "320,00€ en séquestre"}
            </Text>
            <Text style={styles.escrowNote}>
              {trackingStep < 3
                ? "Le montant sera bloqué après signature du devis"
                : trackingStep >= 7
                ? "Le paiement a été versé à Jean-Michel P."
                : "Libéré après validation de l'intervention"}
            </Text>
          </View>
        </View>

        <View style={styles.demoRow}>
          {[
            { label: "Sur place", step: 1 },
            { label: "Devis signé", step: 2 },
            { label: "Paiement", step: 3 },
            { label: "Intervention", step: 4 },
            { label: "Terminée", step: 5 },
            { label: "Validation", step: 6 },
            { label: "Payé", step: 7 },
          ]
            .filter(b => b.step > trackingStep)
            .slice(0, 3)
            .map(b => (
              <TouchableOpacity key={b.step} onPress={() => setTrackingStep(b.step)} style={styles.demoBtn}>
                <Text style={styles.demoBtnText}>→ {b.label}</Text>
              </TouchableOpacity>
            ))}
        </View>

        {trackingStep === 5 && (
          <Button title="Valider l'intervention" onPress={() => navigation.navigate("MissionDetail", { id: "mission-completed" })} fullWidth size="lg" style={{ marginTop: 12 }} />
        )}
        {trackingStep >= 7 && (
          <View style={styles.completedBanner}>
            <MaterialCommunityIcons name="check-circle" size={18} color={Colors.success} />
            <Text style={styles.completedText}>Processus terminé — Artisan payé</Text>
          </View>
        )}

        {/* Cancel button — only before devis signed */}
        {canCancel && !cancelled && (
          <>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.7}>
              <MaterialCommunityIcons name="close-circle-outline" size={16} color={Colors.red} />
              <Text style={styles.cancelBtnText}>Annuler l'intervention</Text>
            </TouchableOpacity>
            <View style={styles.cancelInfo}>
              <MaterialCommunityIcons name="information-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.cancelInfoText}>
                {trackingStep === 0 && artisanConfig.deploymentFree
                  ? "Déplacement offert par cet artisan. Annulation sans frais."
                  : trackingStep === 0
                  ? `Annulation gratuite dans les 5 premières minutes. Au-delà, frais de déplacement de ${artisanConfig.deploymentFee}€.`
                  : `L'artisan est sur place. Frais de déplacement de ${artisanConfig.deploymentFee}€ à votre charge.`}
              </Text>
            </View>
          </>
        )}

        {/* Cancelled state */}
        {cancelled && (
          <View style={styles.cancelledCard}>
            <MaterialCommunityIcons name="close-circle" size={22} color={Colors.red} />
            <Text style={styles.cancelledTitle}>Intervention annulée</Text>
            {artisanConfig.deploymentFree || (isEarlyCancel && trackingStep === 0) ? (
              <Text style={styles.cancelledDesc}>
                L'artisan a été prévenu.{"\n"}Aucun frais facturé.
              </Text>
            ) : (
              <>
                <Text style={styles.cancelledDesc}>
                  Frais de déplacement de {artisanConfig.deploymentFee},00€ prélevés (tarif artisan).
                </Text>
                <View style={styles.cancelledBreakdown}>
                  <View style={styles.cancelledRow}>
                    <Text style={styles.cancelledLabel}>Déplacement artisan</Text>
                    <Text style={[styles.cancelledValue, { color: Colors.red }]}>{artisanConfig.deploymentFee},00€</Text>
                  </View>
                </View>
              </>
            )}
            <Button title="Retour à l'accueil" onPress={() => navigation.navigate("ClientTabs" as any)} fullWidth size="lg" style={{ marginTop: 12 }} />
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
  etaSubtext: { fontFamily: "DMMono_400Regular", fontSize: 10, color: Colors.textSecondary, marginTop: 1 },

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

  /* Cancel */
  cancelBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, marginTop: 16, paddingVertical: 12,
  },
  cancelBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.red },
  cancelInfo: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(138,149,163,0.06)", borderRadius: 10,
    padding: 10, marginTop: 4,
  },
  cancelInfoText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted, flex: 1 },
  cancelledCard: {
    alignItems: "center", backgroundColor: "rgba(232,48,42,0.04)",
    borderRadius: 16, padding: 20, marginTop: 16,
    borderWidth: 1, borderColor: "rgba(232,48,42,0.1)",
  },
  cancelledTitle: { fontFamily: "Manrope_700Bold", fontSize: 16, color: Colors.red, marginTop: 8, marginBottom: 4 },
  cancelledDesc: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#4A5568", textAlign: "center", lineHeight: 20 },
  cancelledBreakdown: {
    width: "100%", backgroundColor: Colors.white, borderRadius: 12,
    padding: 12, marginTop: 10, borderWidth: 1, borderColor: Colors.border,
  },
  cancelledRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  cancelledLabel: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary },
  cancelledValue: { fontFamily: "DMMono_500Medium", fontSize: 13 },

  completedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(34,200,138,0.08)",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(34,200,138,0.2)",
  },
  completedText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.success,
  },
});
