import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Switch,
  Modal,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge, Card, KPICard } from "../../components/ui";
import { useTheme } from "../../hooks/useTheme";
import type { ArtisanTabScreenProps } from "../../navigation/types";

/* ── Types ── */
const SCREEN_WIDTH = Dimensions.get("window").width;

const RADIUS_OPTIONS = [
  { id: 5, label: "5 km" },
  { id: 10, label: "10 km" },
  { id: 20, label: "20 km" },
  { id: 30, label: "30 km" },
  { id: 50, label: "50 km" },
];

function buildRadiusMapHtml(radiusKm: number) {
  const metersRadius = radiusKm * 1000;
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>*{margin:0;padding:0}#map{width:100%;height:100vh}</style>
</head><body><div id="map"></div><script>
var map=L.map('map',{zoomControl:false,attributionControl:false}).setView([48.8566,2.3522],${radiusKm<=10?13:radiusKm<=20?12:11});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
L.circle([48.8566,2.3522],{radius:${metersRadius},color:'#E8302A',fillColor:'#E8302A',fillOpacity:0.08,weight:2}).addTo(map);
var icon=L.divIcon({className:'',html:'<div style="width:16px;height:16px;border-radius:50%;background:#E8302A;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',iconSize:[16,16],iconAnchor:[8,8]});
L.marker([48.8566,2.3522],{icon:icon}).addTo(map);
</script></body></html>`;
}

const kpis = [
  { label: "Revenus du mois", value: "4 820€", icon: "cash" },
  { label: "Missions en cours", value: "3", icon: "briefcase" },
  { label: "Devis en attente", value: "2", icon: "clipboard-text" },
  { label: "Note moyenne", value: "4.9", icon: "star" },
];

const upcomingRdvs = [
  { client: "Pierre M.", type: "Installation robinet", date: "Auj. 14h", status: "Confirmé", sColor: Colors.forest },
  { client: "Amélie R.", type: "Réparation chauffe-eau", date: "Dem. 9h", status: "En cours", sColor: Colors.success },
  { client: "Luc D.", type: "Diagnostic fuite", date: "18 mars 11h", status: "En attente", sColor: Colors.gold },
];

const fabItems = [
  { label: "Créer un devis", icon: "file-edit", screen: "CreateQuote" as const },
  { label: "Nouvelle facture", icon: "receipt", screen: "CreateInvoice" as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ArtisanHomeScreen({ navigation }: { navigation: any }) {
  const { c } = useTheme();
  const [available, setAvailable] = useState(true);
  const [urgencyOn, setUrgencyOn] = useState(false);
  const [urgencyRadius, setUrgencyRadius] = useState(10);
  const [urgencyModalVisible, setUrgencyModalVisible] = useState(false);
  const [tempRadius, setTempRadius] = useState(10);
  const [fabOpen, setFabOpen] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];

  const toggleFab = () => {
    Animated.spring(rotateAnim, {
      toValue: fabOpen ? 0 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
    setFabOpen(!fabOpen);
  };

  const fabRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={[styles.headerBg, { backgroundColor: c.surface }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.greeting, { color: c.text }]}>Bonjour Jean-Michel</Text>
              <View style={styles.certifRow}>
                <Text style={styles.certifIcon}><MaterialCommunityIcons name="shield-check" size={14} color={Colors.gold} /></Text>
                <Text style={styles.certifText}>Certifié Nova • #2847</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.bellBtn}
                onPress={() => navigation.navigate("ArtisanNotifications")}
              >
                <Text style={styles.bellEmoji}><MaterialCommunityIcons name="bell" size={22} color={Colors.navy} /></Text>
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatarBtn}
                onPress={() => navigation.navigate("ArtisanProfile")}
              >
                <Avatar name="Jean-Michel" size={40} radius={14} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Availability ── */}
        <View style={[styles.availCard, { backgroundColor: c.card }]}>
          {/* Standard availability */}
          <View style={styles.availRow}>
            <View style={[styles.availIconWrap, { backgroundColor: available ? "rgba(34,200,138,0.1)" : "rgba(138,149,163,0.1)" }]}>
              <MaterialCommunityIcons name={available ? "check-circle" : "close-circle"} size={18} color={available ? Colors.success : Colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.availTitle, { color: c.text }]}>Disponible</Text>
              <Text style={styles.availDesc}>
                {available ? "Vous recevez des demandes clients" : "Vous ne recevez aucune demande"}
              </Text>
            </View>
            <Switch
              value={available}
              onValueChange={setAvailable}
              trackColor={{ false: Colors.border, true: Colors.success }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.availDivider} />

          {/* Urgency mode */}
          <View style={styles.availRow}>
            <View style={[styles.availIconWrap, { backgroundColor: urgencyOn ? "rgba(232,48,42,0.1)" : "rgba(138,149,163,0.1)" }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color={urgencyOn ? Colors.red : Colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.availTitle, { color: c.text }]}>Mode urgences</Text>
              <Text style={styles.availDesc}>
                {urgencyOn ? `Actif — rayon de ${urgencyRadius} km` : "Recevez des demandes urgentes"}
              </Text>
            </View>
            <Switch
              value={urgencyOn}
              onValueChange={(v) => {
                if (v) {
                  setTempRadius(urgencyRadius);
                  setUrgencyModalVisible(true);
                } else {
                  setUrgencyOn(false);
                }
              }}
              trackColor={{ false: Colors.border, true: Colors.red }}
              thumbColor={Colors.white}
            />
          </View>

          {/* Urgency active info */}
          {urgencyOn && (
            <TouchableOpacity
              style={styles.urgencyInfo}
              activeOpacity={0.7}
              onPress={() => { setTempRadius(urgencyRadius); setUrgencyModalVisible(true); }}
            >
              <MaterialCommunityIcons name="map-marker-radius" size={14} color={Colors.red} />
              <Text style={styles.urgencyInfoText}>Périmètre : {urgencyRadius} km</Text>
              <Text style={styles.urgencyInfoEdit}>Modifier</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── KPIs 2x2 ── */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiRow}>
            {kpis.slice(0, 2).map((k, i) => (
              <KPICard key={i} label={k.label} value={k.value} icon={k.icon} />
            ))}
          </View>
          <View style={styles.kpiRow}>
            {kpis.slice(2).map((k, i) => (
              <KPICard key={i} label={k.label} value={k.value} icon={k.icon} />
            ))}
          </View>
        </View>

        {/* ── Urgent Request ── */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Demandes urgentes</Text>
        <View style={[styles.urgentCard, { backgroundColor: c.card }]}>
          <View style={styles.urgentTop}>
            <View style={styles.urgentLeft}>
              <View style={styles.urgentIconWrap}>
                <Text style={styles.urgentIconText}><MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.red} /></Text>
              </View>
              <View>
                <Text style={styles.urgentTitle}>Fuite d'eau urgente</Text>
                <Text style={styles.urgentLocation}>Secteur Paris 9e</Text>
                <Text style={styles.urgentDuration}>Intervention estimée : 1h</Text>
              </View>
            </View>
            <Text style={styles.urgentTime}>Il y a 4 min</Text>
          </View>
          <View style={styles.urgentActions}>
            <TouchableOpacity
              style={styles.urgentAcceptBtn}
              onPress={() => navigation.navigate("UrgentDetail", { demandId: "1" })}
            >
              <Text style={styles.urgentAcceptText}>Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.urgentDetailBtn}
              onPress={() => navigation.navigate("UrgentDetail", { demandId: "1" })}
            >
              <Text style={styles.urgentDetailText}>Voir détails</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Upcoming RDV ── */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Prochains RDV</Text>
        {upcomingRdvs.map((rdv, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.rdvCard, { backgroundColor: c.card }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("RDVDetail", { rdvId: String(i) })}
          >
            <View>
              <Text style={[styles.rdvClient, { color: c.text }]}>{rdv.client}</Text>
              <Text style={styles.rdvType}>{rdv.type}</Text>
              <Text style={styles.rdvDate}>{rdv.date}</Text>
            </View>
            <View style={[styles.rdvBadge, { backgroundColor: rdv.sColor + "18" }]}>
              <Text style={[styles.rdvBadgeText, { color: rdv.sColor }]}>{rdv.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── FAB ── */}
      {fabOpen && (
        <View style={styles.fabMenu}>
          {fabItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.fabMenuItem, { backgroundColor: c.card, borderColor: c.border }]}
              onPress={() => {
                setFabOpen(false);
                if (item.screen === "CreateQuote") {
                  navigation.navigate("CreateQuote");
                } else {
                  navigation.navigate("CreateInvoice", { missionId: "1" });
                }
              }}
            >
              <MaterialCommunityIcons name={item.icon as any} size={16} color={Colors.forest} />
              <Text style={[styles.fabMenuLabel, { color: c.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Animated.View style={[styles.fab, { transform: [{ rotate: fabRotation }] }]}>
        <TouchableOpacity style={styles.fabInner} onPress={toggleFab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
      {/* ── Urgency Radius Modal ── */}
      <Modal visible={urgencyModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setUrgencyModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={22} color={Colors.navy} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Périmètre d'intervention</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* Map */}
          <View style={styles.modalMap}>
            <WebView
              source={{ html: buildRadiusMapHtml(tempRadius) }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              javaScriptEnabled
            />
          </View>

          {/* Radius selector */}
          <View style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Rayon d'intervention urgences</Text>
            <Text style={styles.modalSectionDesc}>
              Vous recevrez les demandes urgentes dans ce périmètre autour de votre position.
            </Text>

            <View style={styles.radiusRow}>
              {RADIUS_OPTIONS.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.radiusBtn,
                    tempRadius === r.id && styles.radiusBtnActive,
                  ]}
                  onPress={() => setTempRadius(r.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.radiusBtnText,
                    tempRadius === r.id && styles.radiusBtnTextActive,
                  ]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalInfo}>
              <MaterialCommunityIcons name="information-outline" size={14} color={Colors.forest} />
              <Text style={styles.modalInfoText}>
                Les interventions urgentes sont majorées (tarif défini dans vos paramètres). Vous pouvez être disponible pour les interventions classiques ET les urgences en même temps.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              activeOpacity={0.85}
              onPress={() => {
                setUrgencyRadius(tempRadius);
                setUrgencyOn(true);
                setUrgencyModalVisible(false);
              }}
            >
              <Text style={styles.modalSaveBtnText}>Activer le mode urgences — {tempRadius} km</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  /* Header */
  headerBg: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
    marginBottom: 3,
  },
  certifRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  certifIcon: { fontSize: 14 },
  certifText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  bellBtn: { position: "relative", padding: 4 },
  bellEmoji: { fontSize: 22 },
  bellBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.bgPage,
  },
  bellBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
  },
  avatarBtn: {},

  /* Availability */
  /* Availability */
  availCard: {
    marginHorizontal: 16, marginTop: -8, borderRadius: Radii["2xl"],
    padding: 16, borderWidth: 1, borderColor: "rgba(10,22,40,0.04)", ...Shadows.sm,
  },
  availRow: {
    flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6,
  },
  availIconWrap: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  availTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 14 },
  availDesc: { fontFamily: "DMSans_400Regular", fontSize: 11.5, color: Colors.textSecondary, marginTop: 1 },
  availDivider: { height: 1, backgroundColor: Colors.surface, marginVertical: 8 },
  urgencyInfo: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(232,48,42,0.05)", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginTop: 8,
  },
  urgencyInfoText: { fontFamily: "DMSans_500Medium", fontSize: 12, color: Colors.red, flex: 1 },
  urgencyInfoEdit: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.red },

  /* Urgency modal */
  modalRoot: { flex: 1, backgroundColor: Colors.bgPage },
  modalHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 54, paddingHorizontal: 16, paddingBottom: 14,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalTitle: { fontFamily: "Manrope_700Bold", fontSize: 17, color: Colors.navy },
  modalMap: { height: SCREEN_WIDTH * 0.55, backgroundColor: "#E8F5EE" },
  modalContent: { flex: 1, padding: 20 },
  modalSectionTitle: { fontFamily: "Manrope_700Bold", fontSize: 16, color: Colors.navy, marginBottom: 4 },
  modalSectionDesc: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  radiusRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  radiusBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    alignItems: "center",
  },
  radiusBtnActive: { backgroundColor: Colors.red, borderColor: Colors.red },
  radiusBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: "#4A5568" },
  radiusBtnTextActive: { color: Colors.white },
  modalInfo: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 12,
    padding: 12, marginBottom: 20,
  },
  modalInfoText: { fontFamily: "DMSans_400Regular", fontSize: 12, color: "#14523B", flex: 1, lineHeight: 18 },
  modalSaveBtn: {
    height: 52, borderRadius: 16, backgroundColor: Colors.red,
    alignItems: "center", justifyContent: "center", ...Shadows.md,
  },
  modalSaveBtnText: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.white },

  /* KPIs */
  kpiGrid: { paddingHorizontal: 16, marginTop: 14, gap: 10 },
  kpiRow: { flexDirection: "row", gap: 10 },

  /* Section title */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: Colors.navy,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  /* Urgent card */
  urgentCard: {
    marginHorizontal: 16,
    backgroundColor: "rgba(232,48,42,0.04)",
    borderRadius: Radii["2xl"],
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.1)",
  },
  urgentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  urgentLeft: { flexDirection: "row", gap: 10, flex: 1 },
  urgentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(232,48,42,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  urgentIconText: { fontSize: 18 },
  urgentTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  urgentLocation: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#4A5568",
  },
  urgentDuration: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textHint,
  },
  urgentTime: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10.5,
    color: Colors.red,
  },
  urgentActions: { flexDirection: "row", gap: 8 },
  urgentAcceptBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  urgentAcceptText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.white,
  },
  urgentDetailBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  urgentDetailText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#4A5568",
  },

  /* RDV cards */
  rdvCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  rdvClient: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  rdvType: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  rdvDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  rdvBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  rdvBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },

  /* FAB */
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 200,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  fabText: {
    fontSize: 28,
    color: Colors.white,
    fontFamily: "Manrope_700Bold",
    marginTop: -2,
  },
  fabMenu: {
    position: "absolute",
    bottom: 88,
    right: 24,
    zIndex: 200,
    gap: 8,
  },
  fabMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fabMenuIcon: { fontSize: 16 },
  fabMenuLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },
});
