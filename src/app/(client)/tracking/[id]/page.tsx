/**
 * Page de suivi en temps réel d'une intervention.
 * Affiche une carte avec le trajet de l'artisan (OpenStreetMap + Leaflet),
 * une timeline verticale et le montant en séquestre.
 *
 * Démo : trajet Paris — Bastille → Rivoli avec animation temps réel.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, MessageCircle, Phone, Check, Shield,
  MapPin, Clock, Navigation, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

/* ------------------------------------------------------------------ */
/*  Trajet de démo : Bastille → Rue de Rivoli (Paris)                  */
/* ------------------------------------------------------------------ */

/** Coordonnées du trajet artisan → client (points intermédiaires réels sur Paris) */
const ROUTE_POINTS: [number, number][] = [
  [48.8531, 2.3692],  // Départ — Place de la Bastille
  [48.8535, 2.3660],
  [48.8540, 2.3625],
  [48.8543, 2.3590],  // Rue Saint-Antoine
  [48.8545, 2.3555],
  [48.8548, 2.3520],
  [48.8550, 2.3490],
  [48.8553, 2.3455],  // Rue de Rivoli (mi-chemin)
  [48.8555, 2.3420],
  [48.8558, 2.3385],
  [48.8560, 2.3350],  // Hôtel de Ville
  [48.8562, 2.3315],
  [48.8563, 2.3285],
  [48.8565, 2.3250],  // Châtelet approche
  [48.8566, 2.3220],
  [48.8567, 2.3195],
  [48.8568, 2.3170],  // Arrivée — 12 Rue de Rivoli
];

const ARTISAN_START = ROUTE_POINTS[0];
const CLIENT_POS = ROUTE_POINTS[ROUTE_POINTS.length - 1];

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

const timelineSteps = [
  { label: "Demande acceptée", time: "14:02", desc: "L'artisan a accepté votre demande" },
  { label: "En route", time: "14:05", desc: "Trajet en cours — Place de la Bastille" },
  { label: "Arrivée imminente", time: "—", desc: "L'artisan est presque arrivé" },
  { label: "Sur place", time: "—", desc: "Intervention en cours" },
];

/* ------------------------------------------------------------------ */
/*  Composant carte (Leaflet via CDN)                                  */
/* ------------------------------------------------------------------ */

function LiveMap({ progress }: { progress: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const artisanMarker = useRef<L.Marker | null>(null);

  // Position interpolée de l'artisan
  const idx = Math.min(Math.floor(progress * (ROUTE_POINTS.length - 1)), ROUTE_POINTS.length - 2);
  const frac = (progress * (ROUTE_POINTS.length - 1)) - idx;
  const artisanLat = ROUTE_POINTS[idx][0] + (ROUTE_POINTS[idx + 1][0] - ROUTE_POINTS[idx][0]) * frac;
  const artisanLng = ROUTE_POINTS[idx][1] + (ROUTE_POINTS[idx + 1][1] - ROUTE_POINTS[idx][1]) * frac;

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const L = require("leaflet");

    const map = L.map(mapRef.current, {
      center: [48.8555, 2.3420],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
      subdomains: "abcd",
    }).addTo(map);

    // Tracé du trajet
    L.polyline(ROUTE_POINTS, {
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
    L.marker(CLIENT_POS, { icon: clientIcon }).addTo(map);

    // Marqueur artisan (mobile)
    const artisanIcon = L.divIcon({
      html: `<div style="width:36px;height:36px;background:#0A4030;border:3px solid #F5A623;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.4);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      className: "",
    });
    artisanMarker.current = L.marker(ARTISAN_START, { icon: artisanIcon }).addTo(map);

    // Zoom pour contenir le trajet
    map.fitBounds(L.latLngBounds(ROUTE_POINTS).pad(0.15));

    mapInstance.current = map;
  }, []);

  // Mettre à jour la position de l'artisan
  useEffect(() => {
    if (!artisanMarker.current) return;
    artisanMarker.current.setLatLng([artisanLat, artisanLng]);
  }, [artisanLat, artisanLng]);

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

  /* Progression 0→1 animée automatiquement (~3 minutes compressées en 30s pour la démo) */
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 0.008, 1);
        // Mettre à jour l'étape selon la progression
        if (next >= 0.95) setCurrentStep(3);
        else if (next >= 0.75) setCurrentStep(2);
        else setCurrentStep(1);
        return next;
      });
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const etaMinutes = Math.max(1, Math.round((1 - progress) * 18));
  const distanceKm = Math.max(0.1, ((1 - progress) * 2.8)).toFixed(1);

  /* Données localStorage si dispo */
  const [missionData, setMissionData] = useState<{ trade?: string; address?: string; isUrgent?: boolean } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nova_active_mission");
      if (raw) setMissionData(JSON.parse(raw));
    } catch {}
  }, []);

  const trade = missionData?.trade ?? "Plomberie";
  const address = missionData?.address ?? "12 Rue de Rivoli, 75004 Paris";
  const isUrgent = missionData?.isUrgent ?? true;

  return (
    <div className="min-h-screen bg-bgPage">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bgPage/90 backdrop-blur-md border-b border-border">
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

        {/* ── Carte live ── */}
        <div className="relative bg-white rounded-[6px] border border-border shadow-sm overflow-hidden" style={{ height: 380 }}>
          <LiveMap progress={progress} />

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

        {/* ── Barre de progression ── */}
        <div className="bg-white rounded-[6px] border border-border shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-navy">Progression du trajet</span>
            <span className="text-sm font-bold text-forest font-mono">{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-deepForest to-sage rounded-full transition-all duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-grayText">Place de la Bastille</span>
            <span className="text-[10px] text-grayText">12 Rue de Rivoli</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ── Timeline ── */}
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

          {/* ── Infos mission ── */}
          <div className="space-y-4">
            {/* Séquestre */}
            <div className="bg-gradient-to-br from-deepForest to-forest rounded-[6px] p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-lightSage" />
                <span className="text-xs font-bold text-lightSage">Paiement en séquestre</span>
              </div>
              <div className="font-mono text-2xl font-bold">320,00&nbsp;&euro;</div>
              <div className="text-xs text-white/50 mt-0.5">Protégé jusqu&apos;à validation de l&apos;intervention</div>
            </div>

            {/* Détails */}
            <div className="bg-white rounded-[6px] border border-border shadow-sm p-4">
              <div className="text-[11px] font-bold text-grayText uppercase tracking-wide mb-3">Détails</div>
              {[
                { label: "Domaine", value: trade },
                { label: "Adresse", value: address },
                { label: "Artisan", value: "Marc Dupont" },
                { label: "Départ", value: "Place de la Bastille, 75004" },
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
