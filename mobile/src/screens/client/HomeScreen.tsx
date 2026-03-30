import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Animated,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge } from "../../components/ui";
import { getAvatarUri } from "../../constants/avatars";
import { useTheme } from "../../hooks/useTheme";
import type { ClientTabScreenProps } from "../../navigation/types";

/* ── Services (memes que le site web) ── */
const services = [
  { id: "plombier", label: "Plomberie", desc: "Fuites, robinets, chauffe-eau", img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=180&fit=crop" },
  { id: "electricien", label: "Electricite", desc: "Prises, tableau, eclairage", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=180&fit=crop" },
  { id: "serrurier", label: "Serrurerie", desc: "Portes, serrures, blindage", img: "https://images.unsplash.com/photo-1677951570313-b0750351c461?w=300&h=180&fit=crop" },
  { id: "chauffagiste", label: "Chauffage / Clim", desc: "Chaudiere, radiateurs, clim", img: "https://images.unsplash.com/photo-1599028274511-e02a767949a3?w=300&h=180&fit=crop" },
  { id: "peintre", label: "Peinture", desc: "Interieur, exterieur, finitions", img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=180&fit=crop" },
  { id: "menuisier", label: "Menuiserie", desc: "Portes, fenetres, parquet", img: "https://images.unsplash.com/photo-1626081062126-d3b192c1fcb0?w=300&h=180&fit=crop" },
  { id: "carreleur", label: "Carrelage", desc: "Sols, murs, salles de bain", img: "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=300&h=180&fit=crop" },
  { id: "mecanicien", label: "Mecaniciens", desc: "Entretien, reparation, diagnostic", img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=180&fit=crop" },
];
const VISIBLE_COUNT = 5;

const topArtisans = [
  { id: "1", name: "Jean-Michel P.", job: "Plombier", rating: 4.9, reviews: 127, price: 65, initials: "JM", responseTime: "< 2h" },
  { id: "2", name: "Sophie M.", job: "Électricienne", rating: 4.8, reviews: 94, price: 70, initials: "SM", responseTime: "< 1h" },
  { id: "3", name: "Karim B.", job: "Serrurier", rating: 5.0, reviews: 83, price: 60, initials: "KB", responseTime: "< 30min" },
  { id: "4", name: "Marie D.", job: "Peintre", rating: 4.7, reviews: 61, price: 55, initials: "MD", responseTime: "< 3h" },
  { id: "5", name: "Christophe D.", job: "Chauffagiste", rating: 4.9, reviews: 89, price: 75, initials: "CD", responseTime: "< 2h" },
];

/* ── All artisans for search ── */
const allArtisans = [
  { id: "1", name: "Jean-Michel Petit", job: "Plombier", rating: 4.9, price: 65, category: "plumber" },
  { id: "2", name: "Sophie Martin", job: "Électricienne", rating: 4.8, price: 70, category: "electrician" },
  { id: "3", name: "Karim Benali", job: "Serrurier", rating: 5.0, price: 60, category: "locksmith" },
  { id: "4", name: "Marie Dupont", job: "Peintre", rating: 4.7, price: 55, category: "painter" },
  { id: "5", name: "Christophe Durand", job: "Chauffagiste", rating: 4.9, price: 75, category: "heating" },
  { id: "6", name: "Fatima Hadj", job: "Plombier", rating: 4.8, price: 70, category: "plumber" },
  { id: "7", name: "Thomas Richard", job: "Plombier", rating: 4.7, price: 60, category: "plumber" },
  { id: "8", name: "Garcia & Fils", job: "Plombier", rating: 4.5, price: 55, category: "plumber" },
  { id: "9", name: "Leroy Élec", job: "Électricien", rating: 4.6, price: 65, category: "electrician" },
  { id: "10", name: "Amina Kaddouri", job: "Électricienne", rating: 4.9, price: 75, category: "electrician" },
  { id: "11", name: "Fabre Rénovation", job: "Serrurier", rating: 4.7, price: 65, category: "locksmith" },
  { id: "12", name: "Clément Couverture", job: "Maçon", rating: 4.6, price: 55, category: "mason" },
  { id: "13", name: "Amrani Maçonnerie", job: "Maçon", rating: 4.8, price: 60, category: "mason" },
];

/* ── Live interventions ── */
interface LiveIntervention {
  id: string;
  artisan: string;
  type: string;
  status: "en_route" | "on_site" | "finishing";
  eta?: string;
  startedAt?: string;
  missionId: string;
}

const liveInterventions: LiveIntervention[] = [
  {
    id: "live-1",
    artisan: "Jean-Michel P.",
    type: "Réparation fuite",
    status: "en_route",
    eta: "~15 min",
    missionId: "mission-active",
  },
];

const statusConfig = {
  en_route: { label: "En route", color: Colors.red, icon: "truck-delivery" as const, bg: "rgba(232,48,42,0.06)" },
  on_site: { label: "Sur place", color: Colors.forest, icon: "wrench" as const, bg: "rgba(27,107,78,0.08)" },
  finishing: { label: "Finalisation", color: Colors.success, icon: "check-circle-outline" as const, bg: "rgba(34,200,138,0.08)" },
};

export function ClientHomeScreen({
  navigation,
}: ClientTabScreenProps<"ClientHome">) {
  const { c } = useTheme();

  // Pulse animation for live dot
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (liveInterventions.length === 0) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 300);
  }, []);

  const normalize = useCallback((s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), []);

  const searchResults = useMemo(() => {
    if (debouncedSearch.length < 2) return [];
    const q = normalize(debouncedSearch);
    return allArtisans.filter(
      (a) =>
        normalize(a.name).includes(q) ||
        normalize(a.job).includes(q)
    );
  }, [debouncedSearch, normalize]);

  const showResults = search.length >= 2;

  /* ── Interactive map state ── */
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [mapAddress, setMapAddress] = useState("");
  const [mapExpanded, setMapExpanded] = useState(false);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      setLocationStatus("requesting");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationStatus("granted");
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } else {
        setLocationStatus("denied");
        setUserLocation({ lat: 48.8566, lng: 2.3522 }); // Paris fallback
      }
    })();
  }, []);

  const mapHtml = useMemo(() => {
    const lat = userLocation?.lat ?? 48.8566;
    const lng = userLocation?.lng ?? 2.3522;
    const artisans = [
      { name: "Durand Plomberie", services: "Plomberie", available: true, dlat: 0.004, dlng: 0.006 },
      { name: "Martin Elec", services: "Electricite", available: true, dlat: -0.003, dlng: 0.005 },
      { name: "Leroy Serrurerie", services: "Serrurerie", available: false, dlat: 0.005, dlng: -0.004 },
      { name: "Moreau Peinture", services: "Peinture", available: true, dlat: 0.002, dlng: -0.007 },
      { name: "Lopez Chauffage", services: "Chauffage", available: true, dlat: 0.007, dlng: 0.001 },
      { name: "Roux Mecanique", services: "Mecanique", available: true, dlat: -0.002, dlng: -0.006 },
    ];
    return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>*{margin:0;padding:0;box-sizing:border-box}html,body,#map{width:100%;height:100%}
.search-bar{position:absolute;bottom:8px;left:8px;right:8px;z-index:1000;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:8px;box-shadow:0 2px 12px rgba(0,0,0,0.1);border:1px solid #D4EBE0}
.search-bar input{flex:1;border:none;outline:none;font-size:13px;font-family:-apple-system,sans-serif;color:#0A1628;background:transparent}
.search-bar input::placeholder{color:#8A95A3}
.search-bar svg{flex-shrink:0}
.status-badge{position:absolute;top:8px;left:8px;z-index:1000;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);border-radius:20px;padding:5px 10px;font-size:10px;font-weight:600;color:#1B6B4E;box-shadow:0 2px 6px rgba(0,0,0,0.1);display:flex;align-items:center;gap:4px}
.recenter{position:absolute;top:8px;right:8px;z-index:1000;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.95);box-shadow:0 2px 6px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none}
.suggestions{position:absolute;bottom:52px;left:8px;right:8px;z-index:1001;background:#fff;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.12);border:1px solid #D4EBE0;max-height:160px;overflow-y:auto;display:none}
.suggestions.show{display:block}
.sug-item{padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#0A1628;cursor:pointer;display:flex;align-items:flex-start;gap:6px}
.sug-item:last-child{border:none}
.sug-item:active{background:#F5FAF7}
.leaflet-control-zoom{display:none!important}
</style></head><body>
<div id="map"></div>
<div class="status-badge" id="status">
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1B6B4E" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
  ${locationStatus === "granted" ? "Position detectee" : "Position manuelle"}
</div>
<button class="recenter" onclick="recenter()">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B6B4E" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
</button>
<div class="search-bar">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A95A3" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  <input type="text" id="searchInput" placeholder="Entrez votre adresse..." oninput="onSearch(this.value)"/>
</div>
<div class="suggestions" id="suggestions"></div>
<script>
var map=L.map('map',{center:[${lat},${lng}],zoom:15,zoomControl:false,attributionControl:false});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:20,subdomains:'abcd'}).addTo(map);
var userIcon=L.divIcon({html:'<div style="width:18px;height:18px;background:#1B6B4E;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',iconSize:[18,18],iconAnchor:[9,9],className:''});
var userMarker=L.marker([${lat},${lng}],{icon:userIcon}).addTo(map);
var artisans=${JSON.stringify(artisans)};
artisans.forEach(function(a){
  var ic=L.divIcon({html:'<div style="width:28px;height:28px;background:'+(a.available?'#0A4030':'#6B7280')+';border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.25);border:2px solid white"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>',iconSize:[28,28],iconAnchor:[14,14],className:''});
  L.marker([${lat}+a.dlat,${lng}+a.dlng],{icon:ic}).bindPopup('<b style="font-size:12px">'+a.name+'</b><br><span style="font-size:11px;color:#6B7280">'+a.services+'</span>').addTo(map);
});
var searchTimer;
function onSearch(v){
  clearTimeout(searchTimer);
  if(v.length<3){document.getElementById('suggestions').className='suggestions';return}
  searchTimer=setTimeout(function(){
    fetch('https://nominatim.openstreetmap.org/search?format=json&q='+encodeURIComponent(v)+'&countrycodes=fr&limit=4',{headers:{'Accept-Language':'fr'}})
    .then(function(r){return r.json()}).then(function(d){
      var el=document.getElementById('suggestions');
      if(!d.length){el.className='suggestions';return}
      el.innerHTML=d.map(function(s){return '<div class="sug-item" onclick="selectAddr('+s.lat+','+s.lon+')"><svg width="12" height="12" style="margin-top:2px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="#1B6B4E" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>'+s.display_name+'</span></div>'}).join('');
      el.className='suggestions show';
    });
  },400);
}
function selectAddr(lat,lng){
  map.flyTo([lat,lng],15);userMarker.setLatLng([lat,lng]);
  document.getElementById('suggestions').className='suggestions';
  document.getElementById('searchInput').value='';
  window.ReactNativeWebView.postMessage(JSON.stringify({type:'location',lat:lat,lng:lng}));
}
function recenter(){map.flyTo([${lat},${lng}],15);userMarker.setLatLng([${lat},${lng}])}
</script></body></html>`;
  }, [userLocation, locationStatus]);

  const onMapMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "location") {
        setUserLocation({ lat: msg.lat, lng: msg.lng });
      }
    } catch {}
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: c.text }]}>Bonjour Sophie</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.urgencyBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Emergency")}
            >
              <MaterialCommunityIcons name="lightning-bolt" size={14} color={Colors.white} />
              <Text style={styles.urgencyBtnText}>Urgence</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bellBtn, { backgroundColor: c.card }]}
              onPress={() => navigation.navigate("ClientNotifications")}
            >
              <MaterialCommunityIcons name="bell" size={20} color={c.text} />
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Live interventions ── */}
        {liveInterventions.length > 0 && (
          <View style={styles.liveSection}>
            {liveInterventions.map((live) => {
              const sc = statusConfig[live.status];
              return (
                <TouchableOpacity
                  key={live.id}
                  style={[styles.liveCard, { backgroundColor: sc.bg, borderColor: sc.color + "30" }]}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("Tracking", { missionId: live.missionId })}
                >
                  <View style={styles.liveLeft}>
                    <View style={styles.liveDotWrap}>
                      <Animated.View style={[styles.liveDot, { backgroundColor: sc.color, opacity: pulseAnim }]} />
                    </View>
                    <View style={styles.liveInfo}>
                      <View style={styles.liveTopRow}>
                        <Text style={styles.liveLabel}>EN DIRECT</Text>
                        <View style={[styles.liveStatusBadge, { backgroundColor: sc.color + "20" }]}>
                          <MaterialCommunityIcons name={sc.icon} size={12} color={sc.color} />
                          <Text style={[styles.liveStatusText, { color: sc.color }]}>{sc.label}</Text>
                        </View>
                      </View>
                      <Text style={[styles.liveArtisan, { color: c.text }]}>{live.artisan}</Text>
                      <Text style={styles.liveType}>
                        {live.type}
                        {live.eta && <Text style={[styles.liveEta, { color: sc.color }]}> • {live.eta}</Text>}
                      </Text>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={sc.color} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Interactive Map ── */}
        {userLocation && (
          <View style={[styles.mapContainer, mapExpanded && styles.mapExpanded]}>
            <WebView
              ref={webviewRef}
              source={{ html: mapHtml }}
              style={styles.mapWebview}
              scrollEnabled={mapExpanded}
              nestedScrollEnabled={mapExpanded}
              javaScriptEnabled
              onMessage={onMapMessage}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
            {!mapExpanded && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setMapExpanded(true)}
                style={styles.mapOverlayTap}
              >
                <View style={styles.mapExpandHint}>
                  <MaterialCommunityIcons name="arrow-expand" size={12} color={Colors.forest} />
                  <Text style={styles.mapExpandText}>Appuyez pour agrandir</Text>
                </View>
              </TouchableOpacity>
            )}
            {mapExpanded && (
              <TouchableOpacity
                style={styles.mapCollapseBtn}
                onPress={() => setMapExpanded(false)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="chevron-up" size={16} color={Colors.forest} />
                <Text style={styles.mapCollapseText}>Reduire</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Search bar ── */}
        <View style={[styles.searchBar, { backgroundColor: c.card }]}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.textHint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Artisan ou domaine (ex : chauffagiste)"
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(""); setDebouncedSearch(""); }}>
              <MaterialCommunityIcons name="close-circle" size={18} color={Colors.textHint} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Search results ── */}
        {showResults && (
          <View style={[styles.searchResults, { backgroundColor: c.card, borderColor: c.border }]}>
            {searchResults.length === 0 && debouncedSearch.length >= 2 ? (
              <View style={styles.searchEmpty}>
                <Text style={styles.searchEmptyText}>
                  Aucun artisan trouvé pour « {debouncedSearch} »
                </Text>
              </View>
            ) : debouncedSearch.length < 2 ? (
              <View style={styles.searchEmpty}>
                <Text style={styles.searchEmptyText}>Recherche en cours...</Text>
              </View>
            ) : (
              searchResults.map((a) => (
                <TouchableOpacity
                  key={a.id}
                  style={styles.searchResultItem}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSearch("");
                    setDebouncedSearch("");
                    navigation.navigate("ArtisanProfile", { id: a.id });
                  }}
                >
                  <Avatar name={a.name} size={36} radius={12} uri={getAvatarUri(a.name)} />
                  <View style={styles.searchResultInfo}>
                    <Text style={[styles.searchResultName, { color: c.text }]}>{a.name}</Text>
                    <Text style={styles.searchResultJob}>{a.job}</Text>
                  </View>
                  <View style={styles.searchResultRating}>
                    <MaterialCommunityIcons name="star" size={12} color={Colors.gold} />
                    <Text style={styles.searchResultRatingText}>{a.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* ── Services (5 visibles + bouton "Voir les 3 autres") ── */}
        <Text style={[styles.sectionTitle, { color: c.text, marginTop: 4 }]}>Nos services</Text>
        <View style={styles.catGrid}>
          {services.slice(0, VISIBLE_COUNT).map((svc) => (
            <TouchableOpacity
              key={svc.id}
              style={[styles.svcCard, { backgroundColor: c.card }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Booking", { serviceId: svc.id, serviceLabel: svc.label })}
            >
              <Image source={{ uri: svc.img }} style={styles.svcImg} />
              <View style={styles.svcInfo}>
                <Text style={[styles.svcLabel, { color: c.text }]}>{svc.label}</Text>
                <Text style={styles.svcDesc} numberOfLines={1}>{svc.desc}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}

          {/* Bouton "Voir les autres" */}
          <TouchableOpacity
            style={[styles.svcOthersBtn, { backgroundColor: c.card }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("AllCategories")}
          >
            <View style={styles.svcOthersLeft}>
              <View style={styles.svcOthersImgRow}>
                {services.slice(VISIBLE_COUNT).map((svc) => (
                  <Image key={svc.id} source={{ uri: svc.img }} style={styles.svcOthersThumb} />
                ))}
              </View>
              <View>
                <Text style={[styles.svcLabel, { color: c.text }]}>Voir les {services.length - VISIBLE_COUNT} autres</Text>
                <Text style={styles.svcDesc}>Menuiserie, Carrelage, Mecaniciens...</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.forest} />
          </TouchableOpacity>
        </View>

        {/* ── Insurance simulator ── */}
        <TouchableOpacity
          style={[styles.insuranceCard, { backgroundColor: c.card }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("InsuranceSimulator")}
        >
          <View style={styles.insuranceIconWrap}>
            <MaterialCommunityIcons name="shield-search" size={22} color={Colors.forest} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.insuranceTitle, { color: c.text }]}>Mon assurance couvre-t-elle ?</Text>
            <Text style={styles.insuranceDesc}>Vérifiez si votre sinistre est pris en charge</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ━━━━━━━━━━ STYLES ━━━━━━━━━━ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: Colors.navy,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  urgencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.red,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    ...Shadows.sm,
  },
  urgencyBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...Shadows.sm,
  },
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
    borderColor: Colors.white,
  },
  bellBadgeText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 8,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 12,
    includeFontPadding: false,
  },

  /* Interactive Map */
  mapContainer: {
    marginBottom: 12,
    overflow: "hidden",
    height: 220,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mapExpanded: {
    height: 400,
  },
  mapWebview: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  mapOverlayTap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 44,
  },
  mapExpandHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    ...Shadows.sm,
  },
  mapExpandText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: Colors.forest,
  },
  mapCollapseBtn: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    ...Shadows.sm,
  },
  mapCollapseText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: Colors.forest,
  },

  /* Insurance card */
  insuranceCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    marginHorizontal: 16, marginBottom: 20, padding: 16,
    borderRadius: 18, borderWidth: 1, borderColor: "rgba(27,107,78,0.12)", ...Shadows.sm,
  },
  insuranceIconWrap: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: Colors.surface, alignItems: "center", justifyContent: "center",
  },
  insuranceTitle: { fontFamily: "Manrope_700Bold", fontSize: 14 },
  insuranceDesc: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },

  /* Search */
  /* Live interventions */
  liveSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  liveCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  liveLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  liveDotWrap: {
    width: 10,
    height: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  liveInfo: { flex: 1 },
  liveTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  liveLabel: {
    fontFamily: "DMMono_500Medium",
    fontSize: 9,
    color: Colors.red,
    letterSpacing: 1,
  },
  liveStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveStatusText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
  },
  liveArtisan: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    marginBottom: 2,
  },
  liveType: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  liveEta: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    height: 44,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: Colors.navy,
    height: 44,
    paddingVertical: 0,
  },
  searchResults: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadows.md,
  },
  searchEmpty: {
    paddingVertical: 20,
    alignItems: "center",
  },
  searchEmptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  searchResultInfo: { flex: 1 },
  searchResultName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  searchResultJob: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  searchResultRight: { alignItems: "flex-end" },
  searchResultRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  searchResultRatingText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: Colors.navy,
  },
  searchResultPrice: {
    fontFamily: "DMMono_500Medium",
    fontSize: 12,
    color: Colors.forest,
    marginTop: 2,
  },

  /* Services grid */
  catGrid: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  svcCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  svcImg: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  svcInfo: {
    flex: 1,
  },
  svcLabel: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  svcDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  svcOthersBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.forest + "20",
    borderStyle: "dashed" as any,
  },
  svcOthersLeft: {
    flex: 1,
    gap: 8,
  },
  svcOthersImgRow: {
    flexDirection: "row",
    gap: 4,
  },
  svcOthersThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },

  /* Emergency */
  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.12)",
    gap: 14,
    ...Shadows.sm,
  },
  emergencyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFF0EF",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyEmoji: { fontSize: 24 },
  emergencyTextWrap: { flex: 1 },
  emergencyTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.navy,
    marginBottom: 2,
  },
  emergencyDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emergencyArrow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radii.md,
    backgroundColor: Colors.red,
  },
  emergencyArrowText: {
    color: Colors.white,
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
  },

  /* Section title */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: Colors.navy,
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  /* Artisan list */
  artisanList: { paddingHorizontal: 16, gap: 12 },
  artisanCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["3xl"],
    padding: 16,
    width: 185,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  artisanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  artisanInfo: { flex: 1 },
  artisanName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.navy,
  },
  artisanJob: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11.5,
    color: Colors.textHint,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  starIcon: { fontSize: 13 },
  ratingValue: {
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
    color: Colors.navy,
  },
  ratingCount: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textHint,
  },
  artisanBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  responseTime: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: Colors.textHint,
  },
  price: {
    fontFamily: "DMMono_500Medium",
    fontSize: 14,
    color: Colors.forest,
  },
  priceUnit: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    color: Colors.textHint,
  },
});
