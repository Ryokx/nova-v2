"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Moon, Bell, Lock, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    missions: true,
    payments: true,
    marketing: false,
    sms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Paramètres</h1>

      {/* Notifications */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-forest" />
          <h2 className="font-heading text-sm font-bold text-navy">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: "missions" as const, label: "Missions et interventions" },
            { key: "payments" as const, label: "Paiements et séquestre" },
            { key: "marketing" as const, label: "Offres et promotions" },
            { key: "sms" as const, label: "Notifications SMS" },
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between">
              <span className="text-sm text-navy">{pref.label}</span>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications[pref.key] ? "bg-forest" : "bg-border"
                }`}
                role="switch"
                aria-checked={notifications[pref.key]}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    notifications[pref.key] ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-forest" />
          <h2 className="font-heading text-sm font-bold text-navy">Sécurité</h2>
        </div>
        {!showPassword ? (
          <Button variant="outline" size="sm" onClick={() => setShowPassword(true)}>
            Changer le mot de passe
          </Button>
        ) : (
          <div className="space-y-2.5">
            <Input type="password" placeholder="Mot de passe actuel" />
            <Input type="password" placeholder="Nouveau mot de passe" />
            <Input type="password" placeholder="Confirmer le nouveau mot de passe" />
            <div className="flex gap-2 pt-1">
              <Button size="sm">Enregistrer</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowPassword(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Appearance */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-4 h-4 text-forest" />
          <h2 className="font-heading text-sm font-bold text-navy">Apparence</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-navy">Mode sombre</span>
          <div className="px-3 py-1 rounded bg-surface text-xs text-grayText font-medium">
            Bientôt disponible
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Button
        variant="danger"
        className="w-full gap-2"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4" /> Déconnexion
      </Button>
    </div>
  );
}
