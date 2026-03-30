/**
 * Page de suivi en temps reel d'une intervention.
 * Carte Leaflet + itineraire reel via OSRM + animation optimisee.
 */

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, MessageCircle, Phone, Check, Shield,
  MapPin, Clock, Navigation, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

/* ------------------------------------------------------------------ */
/*  Adresses reelles                                                   */
/* ------------------------------------------------------------------ */

/** Depart artisan : 15 Place de la Bastille, Paris */
const ORIGIN: [number, number] = [48.8533, 2.3692];
/** Destination client : 12 Rue de Rivoli, Paris */
const DESTINATION: [number, number] = [48.8568, 2.3170];

const ORIGIN_LABEL = "15 Place de la Bastille, 75004 Paris";
const DESTINATION_LABEL = "12 Rue de Rivoli, 75004 Paris";

/* ------------------------------------------------------------------ */
/*  Fetch itineraire OSRM (une seule fois, cache en memoire)           */
/* ------------------------------------------------------------------ */

let cachedRoute: { points: [number, number][]; distanceKm: number; durationMin: number } | null = null;

async function fetchRoute(): Promise<typeof cachedRoute> {
  if (cachedRoute) return cachedRoute;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${ORIGIN[1]},${ORIGIN[0]};${DESTINATION[1]},${DESTINATION[0]}?overview=full&geometries=geojson&steps=false`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.routes?.[0]) {
      const route = data.routes[0];
      const coords: [number, number][] = route.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] // GeoJSON = [lng,lat], Leaflet = [lat,lng]
      );

      // Simplifier la route pour la perf : garder 1 point sur N
      const step = Math.max(1, Math.floor(coords.length / 80));
      const simplified = coords.filter((_: [number, number], i: number) => i % step === 0 || i === coords.length - 1);

      cachedRoute = {
        points: simplified,
        distanceKm: route.distance / 1000,
        durationMin: route.duration / 60,
      };
      return cachedRoute;
    }
  } catch {}

  // Fallback : ligne droite
  cachedRoute = {
    points: [ORIGIN, DESTINATION],
    distanceKm: 2.8,
    durationMin: 18,
  };
  return cachedRoute;
}

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

const timelineSteps = [
  { label: "Demande acceptee", time: "14:02", desc: "L'artisan a accepte votre demande" },
  { label: "En route", time: "14:05", desc: `Depart — ${ORIGIN_LABEL}` },
  { label: "Arrivee imminente", time: "—", desc: "L'artisan est presque arrive" },
  { label: "Sur place", time: "—", desc: "Intervention en cours" },
];

/* ------------------------------------------------------------------ */
/*  Composant carte                                                    */
/* ------------------------------------------------------------------ */

function LiveMap({ progress, route }: { progress: number; route: [number, number][] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const artisanMarker = useRef<L.Marker | null>(null);
  const lastPos = useRef<[number, number]>([0, 0]);

  // Position interpolee
  const pos = useMemo(() => {
    if (route.length < 2) return route[0] ?? ORIGIN;
    const idx = Math.min(Math.floor(progress * (route.length - 1)), route.length - 2);
    const frac = (progress * (route.length - 1)) - idx;
    return [
      route[idx][0] + (route[idx + 1][0] - route[idx][0]) * frac,
      route[idx][1] + (route[idx + 1][1] - route[idx][1]) * frac,
    ] as [number, number];
  }, [progress, route]);

  // Init carte une seule fois
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const L = require("leaflet");

    const map = L.map(mapRef.current, {
      center: [(ORIGIN[0] + DESTINATION[0]) / 2, (ORIGIN[1] + DESTINATION[1]) / 2],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
      subdomains: "abcd",
    }).addTo(map);

    // Trace du trajet
    L.polyline(route, {
      color: "#1B6B4E",
      weight: 4,
      opacity: 0.6,
      dashArray: "8, 8",
    }).addTo(map);

    // Marqueur client (destination)
    const clientIcon = L.divIcon({
      html: `<div style="width:32px;height:32px;background:#1B6B4E;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: "",
    });
    L.marker(DESTINATION, { icon: clientIcon }).addTo(map);

    // Marqueur depart
    const startIcon = L.divIcon({
      html: `<div style="width:12px;height:12px;background:#6B7280;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      className: "",
    });
    L.marker(ORIGIN, { icon: startIcon }).addTo(map);

    // Marqueur artisan (mobile)
    const artisanIcon = L.divIcon({
      html: `<div style="width:36px;height:36px;background:#0A4030;border:3px solid #F5A623;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.4);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      className: "",
    });
    artisanMarker.current = L.marker(ORIGIN, { icon: artisanIcon }).addTo(map);

    map.fitBounds(L.latLngBounds(route).pad(0.15));
    mapInstance.current = map;

    return () => { map.remove(); mapInstance.current = null; };
  }, [route]);

  // Deplacer le marqueur seulement si la position a change significativement
  useEffect(() => {
    if (!artisanMarker.current) return;
    const [prevLat, prevLng] = lastPos.current;
    const delta = Math.abs(pos[0] - prevLat) + Math.abs(pos[1] - prevLng);
    if (delta < 0.00005) return; // Seuil ~5m — evite les re-renders inutiles
    artisanMarker.current.setLatLng(pos);
    lastPos.current = pos;
  }, [pos]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-[6px]" style={{ minHeight: 300 }} />
  );
}

/* ------------------------------------------------------------------ */
/*  Page principale                                                    */
/* ------------------------------------------------------------------ */

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [route, setRoute] = useState<[number, number][]>([ORIGIN, DESTINATION]);
  const [routeInfo, setRouteInfo] = useState({ distanceKm: 2.8, durationMin: 18 });
  const [routeLoaded, setRouteLoaded] = useState(false);

  // Fetch route une seule fois
  useEffect(() => {
    fetchRoute().then(r => {
      if (r) {
        setRoute(r.points);
        setRouteInfo({ distanceKm: r.distanceKm, durationMin: r.durationMin });
        setRouteLoaded(true);
      }
    });
  }, []);

  /* Progression 0->1 via requestAnimationFrame (plus fluide, pause quand onglet inactif) */
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!routeLoaded) return;

    let rafId: number;
    let lastTime = 0;
    const DEMO_DURATION = 30_000; // 30s pour toute la demo

    const tick = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;

      // Limiter a 60fps max, ignorer les gros sauts (tab en arriere-plan)
      if (dt > 0 && dt < 200) {
        progressRef.current = Math.min(progressRef.current + dt / DEMO_DURATION, 1);
        setProgress(progressRef.current);

        if (progressRef.current >= 0.95) setCurrentStep(3);
        else if (progressRef.current >= 0.75) setCurrentStep(2);
        else setCurrentStep(1);
      }

      if (progressRef.current < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [routeLoaded]);

  const etaMinutes = Math.max(1, Math.round((1 - progress) * routeInfo.durationMin));
  const distanceKm = Math.max(0.1, (1 - progress) * routeInfo.distanceKm).toFixed(1);

  /* Donnees localStorage si dispo */
  const [missionData, setMissionData] = useState<{
    trade?: string; address?: string; isUrgent?: boolean;
    paymentMethod?: "card" | "cash"; amount?: number; paid?: boolean;
  } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nova_active_mission");
      if (raw) setMissionData(JSON.parse(raw));
    } catch {}
  }, []);

  const trade = missionData?.trade ?? "Plomberie";
  const address = missionData?.address ?? DESTINATION_LABEL;
  const isUrgent = missionData?.isUrgent ?? true;
  const hasPaid = missionData?.paid === true || missionData?.paymentMethod === "card";
  const amount = missionData?.amount ?? 320;

  return (
    <div className="min-h-screen bg-bgPage">
      {/* Header */}
      <div className="sticky top-0 z-[1100] bg-bgPage/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-[6px] bg-forest/8 flex items-center justify-center text-forest hover:bg-forest/15 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <span className="text-sm font-bold text-navy font-heading">Suivi en direct</span>
          </div>
          {isUrgent && (
            <span className="px-2 py-0.5 rounded-[4px] bg-red/10 text-red text-[10px] font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> URGENCE
            </span>
          )}
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] text-success font-semibold">En direct</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-5 space-y-4">

        {/* Carte live */}
        <div className="relative bg-white rounded-[6px] border border-border shadow-sm overflow-hidden" style={{ height: 380 }}>
          <LiveMap progress={progress} route={route} />

          {/* Overlay ETA */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-[6px] shadow-md border border-border px-4 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-[6px] bg-deepForest flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-navy font-mono">{etaMinutes} min</div>
              <div className="text-[11px] text-grayText">{distanceKm} km restants</div>
            </div>
          </div>

          {/* Badge artisan */}
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-[6px] shadow-md border border-border px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deepForest to-forest flex items-center justify-center text-white text-xs font-bold shrink-0">
              MD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-navy">Marc Dupont</div>
              <div className="text-xs text-grayText">{trade} — En route vers vous</div>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-[6px] bg-forest/10 flex items-center justify-center text-forest hover:bg-forest/20 transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-[6px] bg-forest/10 flex items-center justify-center text-forest hover:bg-forest/20 transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="bg-white rounded-[6px] border border-border shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-navy">Progression du trajet</span>
            <span className="text-sm font-bold text-forest font-mono">{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-deepForest to-sage rounded-full transition-[width] duration-500 ease-linear"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-grayText">{ORIGIN_LABEL.split(",")[0]}</span>
            <span className="text-[10px] text-grayText">{DESTINATION_LABEL.split(",")[0]}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Timeline */}
          <div className="bg-white rounded-[6px] border border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-navy mb-4">Suivi de l&apos;intervention</h3>
            <div className="flex flex-col">
              {timelineSteps.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                const future = i > currentStep;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        done && "bg-forest text-white",
                        active && "border-2 border-forest text-forest bg-white",
                        future && "bg-gray-100 text-grayText",
                      )}>
                        {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={cn("w-0.5 flex-1 min-h-[24px]", done ? "bg-forest" : "bg-gray-200")} />
                      )}
                    </div>
                    <div className="pb-4 pt-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-semibold", done ? "text-forest" : active ? "text-navy" : "text-grayText")}>
                          {step.label}
                        </span>
                        <span className="font-mono text-[10px] text-grayText">{step.time}</span>
                        {active && <span className="px-1.5 py-0.5 rounded-[4px] bg-forest/10 text-[9px] font-bold text-forest">EN COURS</span>}
                      </div>
                      <div className={cn("text-xs mt-0.5", future ? "text-grayText/50" : "text-grayText")}>{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Infos mission */}
          <div className="space-y-4">
            {/* Sequestre — affiche seulement si paiement effectue */}
            {hasPaid ? (
              <div className="bg-gradient-to-br from-deepForest to-forest rounded-[6px] p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-lightSage" />
                  <span className="text-xs font-bold text-lightSage">Paiement en sequestre</span>
                </div>
                <div className="font-mono text-2xl font-bold">{amount.toFixed(2).replace(".", ",")}&nbsp;&euro;</div>
                <div className="text-xs text-white/50 mt-0.5">Protege jusqu&apos;a validation de l&apos;intervention</div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-lightSage" />
                  <span className="text-[11px] text-lightSage font-medium">Paiement confirme</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[6px] border border-border shadow-sm p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="text-xs font-bold text-navy">Paiement en attente</span>
                </div>
                <p className="text-[11px] text-grayText leading-snug">
                  Le paiement sera effectue apres l&apos;intervention. L&apos;artisan vous remettra une facture sur place.
                </p>
              </div>
            )}

            {/* Details */}
            <div className="bg-white rounded-[6px] border border-border shadow-sm p-4">
              <div className="text-[11px] font-bold text-grayText uppercase tracking-wide mb-3">Details</div>
              {[
                { label: "Domaine", value: trade },
                { label: "Adresse", value: address },
                { label: "Artisan", value: "Marc Dupont" },
                { label: "Depart", value: ORIGIN_LABEL },
                { label: "Distance", value: `${routeInfo.distanceKm.toFixed(1)} km` },
                { label: "Duree estimee", value: `${Math.round(routeInfo.durationMin)} min` },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className={cn("flex justify-between py-2 text-sm", i < arr.length - 1 && "border-b border-border/50")}>
                  <span className="text-grayText">{label}</span>
                  <span className="font-medium text-navy text-right max-w-[200px] truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
