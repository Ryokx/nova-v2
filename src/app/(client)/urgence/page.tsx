"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Clock, Shield } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "plomberie", label: "Plomberie", icon: "🔧" },
  { id: "electricite", label: "Électricité", icon: "⚡" },
  { id: "serrurerie", label: "Serrurerie", icon: "🔑" },
  { id: "chauffage", label: "Chauffage", icon: "🔥" },
  { id: "autre", label: "Autre", icon: "🏠" },
];

const urgentArtisans = [
  { name: "Jean-Michel P.", trade: "Plombier", available: "15 min", rate: 80, rating: 4.9 },
  { name: "Karim B.", trade: "Serrurier", available: "20 min", rate: 75, rating: 5.0 },
  { name: "Sophie M.", trade: "Électricienne", available: "30 min", rate: 85, rating: 4.8 },
];

export default function UrgencePage() {
  const [cat, setCat] = useState<string | null>(null);

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      {cat && (
        <button onClick={() => setCat(null)} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
      )}

      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-5 h-5 text-red" />
        <h1 className="font-heading text-[26px] font-extrabold text-navy">Urgence 24/7</h1>
      </div>
      <p className="text-sm text-grayText mb-5">
        {cat ? "Artisans disponibles immédiatement" : "Sélectionnez le domaine d'intervention"}
      </p>

      {/* Alert banner */}
      <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-red to-red/80 text-white mb-6 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-semibold">Intervention en moins de 2h</span>
      </div>

      {!cat ? (
        // Category selection
        <div className="grid grid-cols-2 gap-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border bg-white hover:bg-surface hover:-translate-y-0.5 transition-all"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-sm font-semibold text-navy">{c.label}</span>
            </button>
          ))}
        </div>
      ) : (
        // Artisan list
        <div className="space-y-3">
          {urgentArtisans.map((a) => (
            <Card key={a.name} className="flex items-center gap-3.5">
              <Avatar name={a.name} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-navy">{a.name}</span>
                  <Shield className="w-3.5 h-3.5 text-forest" />
                </div>
                <div className="text-xs text-grayText">{a.trade}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[11px] text-success font-medium">
                    <Clock className="w-3 h-3" /> Dispo. en {a.available}
                  </span>
                  <span className="font-mono text-xs font-semibold text-navy">{a.rate}€/h</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button size="sm" className="bg-red hover:bg-red/90 text-xs px-3">
                  Intervenir
                </Button>
                <Link
                  href="/artisans"
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[11px] font-semibold text-center",
                    "bg-surface text-navy hover:bg-border transition-colors",
                  )}
                >
                  Profil
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
