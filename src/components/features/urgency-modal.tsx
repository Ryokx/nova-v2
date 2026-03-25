"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import {
  Zap,
  MapPin,
  Search,
  CheckCircle,
  Bell,
  Navigation,
  Phone,
  Clock,
  Star,
  Shield,
} from "lucide-react";

interface UrgencyModalProps {
  open: boolean;
  onClose: () => void;
}

type Step =
  | "locating"
  | "searching"
  | "found"
  | "notified"
  | "accepted"
  | "onway";

const STEP_TIMINGS: Record<Step, number> = {
  locating: 2000,
  searching: 3500,
  found: 2000,
  notified: 2000,
  accepted: 2000,
  onway: 0,
};

const ARTISAN = {
  name: "Jean-Michel Petit",
  initials: "JM",
  trade: "Plombier",
  rating: 4.9,
  reviews: 127,
  eta: "23 min",
  distance: "2.4 km",
};

export function UrgencyModal({ open, onClose }: UrgencyModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("locating");
  const [dots, setDots] = useState("");

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep("locating");
      setDots("");
    }
  }, [open]);

  // Animate dots
  useEffect(() => {
    if (!open) return;
    if (step === "onway") return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [open, step]);

  // Progress through steps
  const advanceStep = useCallback(() => {
    setStep((prev) => {
      const order: Step[] = [
        "locating",
        "searching",
        "found",
        "notified",
        "accepted",
        "onway",
      ];
      const idx = order.indexOf(prev);
      if (idx < order.length - 1) return order[idx + 1];
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const timing = STEP_TIMINGS[step];
    if (timing === 0) return;
    const timer = setTimeout(advanceStep, timing);
    return () => clearTimeout(timer);
  }, [open, step, advanceStep]);

  const isSearching = step === "locating" || step === "searching";
  const isFound = step === "found" || step === "notified" || step === "accepted" || step === "onway";

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex flex-col items-center text-center">
        {/* Fake map area */}
        <div
          className="relative w-full rounded-xl overflow-hidden mb-6"
          style={{
            height: 240,
            background: "linear-gradient(135deg, #E8F5EE 0%, #D4EBE0 40%, #c5e0d2 100%)",
          }}
        >
          {/* Grid lines to simulate map */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div key={`h-${i}`}>
                <div
                  className="absolute w-full"
                  style={{
                    top: `${(i + 1) * 12}%`,
                    height: 1,
                    backgroundColor: "#1B6B4E",
                    opacity: 0.3,
                  }}
                />
                <div
                  className="absolute h-full"
                  style={{
                    left: `${(i + 1) * 12}%`,
                    width: 1,
                    backgroundColor: "#1B6B4E",
                    opacity: 0.3,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Fake streets */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-[30%] left-0 right-0 h-[3px] bg-navy" />
            <div className="absolute top-[60%] left-[10%] right-[20%] h-[2px] bg-navy" />
            <div className="absolute left-[45%] top-0 bottom-0 w-[3px] bg-navy" />
            <div className="absolute left-[70%] top-[20%] bottom-[10%] w-[2px] bg-navy" />
            <div className="absolute left-[20%] top-[15%] bottom-[30%] w-[2px] bg-navy" />
          </div>

          {/* User position — center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Pulse rings */}
            <span
              className="absolute inset-0 w-16 h-16 -ml-5 -mt-5 rounded-full"
              style={{
                backgroundColor: "rgba(232, 48, 42, 0.15)",
                animation: "urgency-pulse 2s ease-out infinite",
              }}
            />
            <span
              className="absolute inset-0 w-16 h-16 -ml-5 -mt-5 rounded-full"
              style={{
                backgroundColor: "rgba(232, 48, 42, 0.1)",
                animation: "urgency-pulse 2s ease-out infinite 0.7s",
              }}
            />
            <span
              className="absolute inset-0 w-20 h-20 -ml-7 -mt-7 rounded-full"
              style={{
                backgroundColor: "rgba(232, 48, 42, 0.06)",
                animation: "urgency-pulse 2s ease-out infinite 1.4s",
              }}
            />
            {/* Center dot */}
            <div
              className="relative w-6 h-6 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: "#E8302A", boxShadow: "0 0 0 3px white, 0 2px 12px rgba(232,48,42,0.4)" }}
            >
              <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Artisan marker — appears when found */}
          {isFound && (
            <div
              className="absolute"
              style={{
                top: "32%",
                left: "65%",
                animation: "urgency-drop 0.4s ease-out both",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-heading font-bold text-[10px]"
                style={{
                  background: "linear-gradient(135deg, #0A4030, #1B6B4E)",
                  boxShadow: "0 0 0 2px white, 0 2px 8px rgba(10,64,48,0.3)",
                }}
              >
                JM
              </div>
              {/* Line connecting artisan to user */}
              {(step === "onway" || step === "accepted") && (
                <div
                  className="absolute top-4 left-4 w-[60px] h-[1px] origin-left"
                  style={{
                    borderTop: "2px dashed #1B6B4E",
                    transform: "rotate(25deg)",
                    opacity: 0.5,
                    animation: "urgency-fadeIn 0.5s ease-out",
                  }}
                />
              )}
            </div>
          )}

          {/* Scanning overlay when searching */}
          {isSearching && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 180,
                height: 180,
                border: "2px solid rgba(232, 48, 42, 0.15)",
                animation: "urgency-scan 2.5s ease-in-out infinite",
              }}
            />
          )}

          {/* Status badge overlay */}
          <div
            className="absolute bottom-3 left-3 right-3 rounded-lg px-3 py-2 flex items-center gap-2"
            style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}
          >
            {step === "locating" && (
              <>
                <MapPin className="w-4 h-4 text-red shrink-0" />
                <span className="text-xs font-semibold text-navy">Localisation en cours{dots}</span>
              </>
            )}
            {step === "searching" && (
              <>
                <Search className="w-4 h-4 text-red shrink-0" style={{ animation: "urgency-spin 1.5s linear infinite" }} />
                <span className="text-xs font-semibold text-navy">Recherche d&apos;un artisan à proximité{dots}</span>
              </>
            )}
            {step === "found" && (
              <>
                <CheckCircle className="w-4 h-4 text-success shrink-0" />
                <span className="text-xs font-bold text-success">Artisan trouvé !</span>
              </>
            )}
            {step === "notified" && (
              <>
                <Bell className="w-4 h-4 text-gold shrink-0" />
                <span className="text-xs font-semibold text-navy">Artisan notifié{dots}</span>
              </>
            )}
            {step === "accepted" && (
              <>
                <CheckCircle className="w-4 h-4 text-forest shrink-0" />
                <span className="text-xs font-bold text-forest">Intervention acceptée !</span>
              </>
            )}
            {step === "onway" && (
              <>
                <Navigation className="w-4 h-4 text-forest shrink-0" />
                <span className="text-xs font-bold text-forest">En chemin vers vous</span>
                <span className="ml-auto text-xs font-mono font-bold text-navy">{ARTISAN.eta}</span>
              </>
            )}
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1.5 mb-5">
          {(["locating", "searching", "found", "notified", "accepted", "onway"] as Step[]).map((s, i) => {
            const order: Step[] = ["locating", "searching", "found", "notified", "accepted", "onway"];
            const currentIdx = order.indexOf(step);
            const stepIdx = i;
            return (
              <div
                key={s}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: stepIdx <= currentIdx ? 28 : 12,
                  backgroundColor: stepIdx <= currentIdx ? "#E8302A" : "#D4EBE0",
                }}
              />
            );
          })}
        </div>

        {/* Artisan card — appears when found */}
        {isFound && (
          <div
            className="w-full rounded-xl border border-border p-4 mb-4 text-left"
            style={{ animation: "urgency-slideUp 0.4s ease-out both" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)" }}
              >
                <span className="text-white font-heading font-bold text-sm">{ARTISAN.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-[15px] text-navy">{ARTISAN.name}</span>
                  <Shield className="w-3.5 h-3.5 text-forest" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-grayText">{ARTISAN.trade}</span>
                  <span className="text-grayText/30">·</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="text-xs font-bold text-navy">{ARTISAN.rating}</span>
                    <span className="text-xs text-grayText">({ARTISAN.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-xs text-grayText">
                  <MapPin className="w-3 h-3" />
                  {ARTISAN.distance}
                </div>
                {(step === "onway" || step === "accepted") && (
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-forest" />
                    <span className="text-xs font-bold text-forest">ETA {ARTISAN.eta}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress steps */}
            <div className="mt-4 pt-3 border-t border-border space-y-2">
              {[
                { key: "found", label: "Artisan trouvé", icon: CheckCircle },
                { key: "notified", label: "Artisan notifié", icon: Bell },
                { key: "accepted", label: "Intervention acceptée", icon: CheckCircle },
                { key: "onway", label: "En chemin vers vous", icon: Navigation },
              ].map((s) => {
                const order: Step[] = ["locating", "searching", "found", "notified", "accepted", "onway"];
                const currentIdx = order.indexOf(step);
                const stepIdx = order.indexOf(s.key as Step);
                const done = stepIdx <= currentIdx;
                const active = stepIdx === currentIdx;
                return (
                  <div key={s.key} className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: done ? "#D1FAE5" : "#F3F4F6",
                      }}
                    >
                      <s.icon
                        className="w-3 h-3"
                        style={{ color: done ? "#065F46" : "#9CA3AF" }}
                      />
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: done ? "#0A1628" : "#9CA3AF" }}
                    >
                      {s.label}
                      {active && !done ? dots : ""}
                    </span>
                    {active && (
                      <span className="ml-auto text-[10px] font-mono text-grayText">maintenant</span>
                    )}
                    {done && !active && (
                      <CheckCircle className="ml-auto w-3 h-3 text-success" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {step === "onway" && (
          <div
            className="w-full flex gap-2.5"
            style={{ animation: "urgency-fadeIn 0.4s ease-out both" }}
          >
            <button
              onClick={() => router.push("/tracking/urgence-demo")}
              className="flex-1 h-12 rounded-xl text-white text-sm font-bold cursor-pointer hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #0A4030, #1B6B4E)",
                border: "none",
              }}
            >
              <Navigation className="w-4 h-4" />
              Suivre en temps réel
            </button>
            <button
              onClick={onClose}
              className="h-12 px-5 rounded-xl text-navy text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              style={{ border: "1px solid #D4EBE0", background: "white" }}
            >
              <Phone className="w-4 h-4" />
              Appeler
            </button>
          </div>
        )}

        {isSearching && (
          <p className="text-xs text-grayText mt-1">
            Ne quittez pas, nous recherchons le meilleur artisan disponible...
          </p>
        )}
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes urgency-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes urgency-scan {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          100% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
        }
        @keyframes urgency-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes urgency-drop {
          0% { transform: translateY(-20px); opacity: 0; }
          60% { transform: translateY(3px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes urgency-slideUp {
          0% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes urgency-fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </Modal>
  );
}
