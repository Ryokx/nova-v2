"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Navigation, Search, X, Loader2, LocateFixed } from "lucide-react";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

/* ── Artisans factices (positionnés dynamiquement autour de l'utilisateur) ── */
const FAKE_ARTISANS = [
  { id: 1, name: "Durand Plomberie", services: "Plomberie, Chauffage", available: true, offset: [0.004, 0.006] },
  { id: 2, name: "Martin Électricité", services: "Électricité, Domotique", available: true, offset: [-0.003, 0.005] },
  { id: 3, name: "Leroy Serrurerie", services: "Serrurerie, Blindage", available: false, offset: [0.005, -0.004] },
  { id: 4, name: "Petit Menuiserie", services: "Menuiserie, Parquet", available: true, offset: [-0.006, -0.003] },
  { id: 5, name: "Moreau Peinture", services: "Peinture, Revêtements", available: true, offset: [0.002, -0.007] },
  { id: 6, name: "Bernard Carrelage", services: "Carrelage, Faïence", available: false, offset: [-0.005, 0.002] },
  { id: 7, name: "Lopez Chauffage", services: "Chauffage, Climatisation", available: true, offset: [0.007, 0.001] },
  { id: 8, name: "Roux Maçonnerie", services: "Maçonnerie, Gros œuvre", available: true, offset: [-0.002, -0.006] },
];

interface LocationMapProps {
  onLocationChange?: (address: string, lat: number, lng: number) => void;
}

export default function LocationMap({ onLocationChange }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const artisanMarkersRef = useRef<L.Marker[]>([]);
  const userLatLng = useRef<[number, number]>([48.8566, 2.3522]);

  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "manual">("idle");
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  /* ── Ajouter les marqueurs artisans autour d'une position ── */
  const addArtisanMarkers = useCallback((lat: number, lng: number, L: typeof import("leaflet")) => {
    // Supprimer les anciens marqueurs
    artisanMarkersRef.current.forEach(m => m.remove());
    artisanMarkersRef.current = [];

    if (!mapInstance.current) return;

    FAKE_ARTISANS.forEach(artisan => {
      const aLat = lat + artisan.offset[0];
      const aLng = lng + artisan.offset[1];

      const icon = L.divIcon({
        html: `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
          <div style="width:32px;height:32px;background:${artisan.available ? "#0A4030" : "#6B7280"};border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid white;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
        </div>`,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const popupContent = `
        <div style="font-family:'DM Sans',sans-serif;min-width:180px;padding:2px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#1B6B4E,#2D9B6E);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:13px;">
              ${artisan.name.charAt(0)}
            </div>
            <div>
              <div style="font-weight:700;font-size:13px;color:#0A1628;line-height:1.2;">${artisan.name}</div>
              <div style="font-size:11px;color:#6B7280;margin-top:1px;">${artisan.services}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:5px;padding:5px 8px;border-radius:6px;background:${artisan.available ? "#E8F5EE" : "#FEF2F2"};width:fit-content;">
            <div style="width:7px;height:7px;border-radius:50%;background:${artisan.available ? "#22C88A" : "#E8302A"};"></div>
            <span style="font-size:11px;font-weight:600;color:${artisan.available ? "#1B6B4E" : "#E8302A"};">
              ${artisan.available ? "Disponible" : "Indisponible"}
            </span>
          </div>
        </div>
      `;

      const marker = L.marker([aLat, aLng], { icon })
        .bindPopup(popupContent, {
          className: "artisan-popup",
          closeButton: false,
          offset: [0, -8],
          maxWidth: 240,
        })
        .addTo(mapInstance.current!);

      artisanMarkersRef.current.push(marker);
    });
  }, []);

  /* ── Initialise la carte ── */
  const initMap = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || mapInstance.current) return;

    const L = require("leaflet");

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
      subdomains: "abcd",
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Marqueur utilisateur
    const icon = L.divIcon({
      html: `<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        <div style="width:18px;height:18px;background:#1B6B4E;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
        <div style="position:absolute;width:40px;height:40px;border:2px solid #1B6B4E;border-radius:50%;opacity:0.3;animation:pulse-ring 2s ease-out infinite;"></div>
      </div>`,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    markerRef.current = marker;
    mapInstance.current = map;
    userLatLng.current = [lat, lng];

    // Ajouter les artisans
    addArtisanMarkers(lat, lng, L);

    reverseGeocode(lat, lng);
  }, [addArtisanMarkers]);

  /* ── Mise à jour position sur la carte ── */
  const updatePosition = useCallback((lat: number, lng: number) => {
    const L = require("leaflet");
    if (mapInstance.current) {
      mapInstance.current.flyTo([lat, lng], 15, { duration: 1.2 });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
      userLatLng.current = [lat, lng];
      addArtisanMarkers(lat, lng, L);
    }
    reverseGeocode(lat, lng);
  }, [addArtisanMarkers]);

  /* ── Reverse geocoding (coordonnées → adresse) ── */
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { "Accept-Language": "fr" } }
      );
      const data = await res.json();
      if (data.display_name) {
        const short = formatAddress(data);
        setAddress(short);
        onLocationChange?.(short, lat, lng);
      }
    } catch {}
  };

  /* ── Formater l'adresse ── */
  const formatAddress = (data: { address?: Record<string, string>; display_name: string }) => {
    if (data.address) {
      const a = data.address;
      const parts = [
        a.house_number,
        a.road,
        a.postcode,
        a.city || a.town || a.village || a.municipality,
      ].filter(Boolean);
      if (parts.length >= 2) return parts.join(" ");
    }
    return data.display_name.split(",").slice(0, 3).join(",").trim();
  };

  /* ── Recherche d'adresse (forward geocoding) ── */
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr&limit=5&addressdetails=1`,
        { headers: { "Accept-Language": "fr" } }
      );
      const data = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  /* ── Debounce de la recherche ── */
  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchAddress(value), 400);
  };

  /* ── Sélection d'un résultat de recherche ── */
  const selectResult = (result: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (!mapInstance.current) {
      initMap(lat, lng);
    } else {
      updatePosition(lat, lng);
    }

    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
    setStatus("manual");
  };

  /* ── Demande de géolocalisation au montage ── */
  useEffect(() => {
    initMap(48.8566, 2.3522);

    setStatus("requesting");
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("granted");
        updatePosition(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setStatus("denied");
        setShowSearch(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [initMap, updatePosition]);

  /* ── Recentrer sur ma position ── */
  const recenter = () => {
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("granted");
        updatePosition(pos.coords.latitude, pos.coords.longitude);
        setShowSearch(false);
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative rounded-[12px] overflow-hidden mb-5 border border-border shadow-sm">
      {/* Animations + styles popup artisan */}
      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.4; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .leaflet-container { font-family: inherit; }
        .artisan-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 4px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          border: 1px solid #D4EBE0;
        }
        .artisan-popup .leaflet-popup-content {
          margin: 8px 10px;
          line-height: 1.4;
        }
        .artisan-popup .leaflet-popup-tip {
          box-shadow: none;
          border: 1px solid #D4EBE0;
        }
      `}</style>

      {/* Carte */}
      <div ref={mapRef} className="w-full h-[220px] md:h-[280px] bg-surface" />

      {/* Badge statut en haut à gauche */}
      <div className="absolute top-3 left-3 z-[1000]">
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-md backdrop-blur-md",
          status === "granted" ? "bg-white/95 text-forest" :
          status === "requesting" ? "bg-white/95 text-navy" :
          "bg-white/95 text-grayText"
        )}>
          {status === "requesting" && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === "granted" && <LocateFixed className="w-3 h-3" />}
          {status === "denied" && <MapPin className="w-3 h-3" />}
          {status === "manual" && <MapPin className="w-3 h-3 text-forest" />}
          {status === "requesting" ? "Localisation..." :
           status === "granted" ? "Position détectée" :
           status === "manual" ? "Position définie" :
           "Position manuelle"}
        </div>
      </div>

      {/* Bouton recentrer */}
      <button
        onClick={recenter}
        className="absolute top-3 right-3 z-[1000] w-8 h-8 rounded-full bg-white/95 shadow-md flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
        title="Me localiser"
      >
        <Navigation className="w-3.5 h-3.5 text-forest" />
      </button>

      {/* Adresse détectée */}
      {address && (
        <div className="absolute bottom-14 left-3 right-3 z-[1000]">
          <div className="bg-white/95 backdrop-blur-md rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-forest shrink-0" />
            <span className="text-[11px] text-navy font-medium truncate">{address}</span>
          </div>
        </div>
      )}

      {/* Barre de recherche en bas */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000]">
        <div className="bg-white/95 backdrop-blur-md border-t border-border/50 px-3 py-2">
          <div className="relative">
            <div className="flex items-center gap-2 bg-bgPage rounded-lg px-3 py-2 border border-border/60">
              <Search className="w-3.5 h-3.5 text-grayText shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => setShowSearch(true)}
                placeholder="Entrez votre adresse manuellement..."
                className="flex-1 bg-transparent text-[12px] text-navy placeholder:text-grayText/60 outline-none font-medium"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="cursor-pointer">
                  <X className="w-3.5 h-3.5 text-grayText hover:text-navy" />
                </button>
              )}
              {searching && <Loader2 className="w-3.5 h-3.5 text-forest animate-spin" />}
            </div>

            {/* Résultats de recherche */}
            {searchResults.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg border border-border overflow-hidden max-h-[200px] overflow-y-auto">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-3 py-2.5 hover:bg-bgPage transition-colors flex items-start gap-2 cursor-pointer border-b border-border/30 last:border-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                    <span className="text-[11px] text-navy leading-snug">{r.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
