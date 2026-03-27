/**
 * Page Paramètres.
 * Permet de gérer les préférences de notifications (push, email, SMS),
 * de changer le mot de passe, et de se déconnecter.
 * Le mode sombre est prévu mais pas encore disponible.
 */

"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Moon, Bell, Lock, LogOut, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

/* ------------------------------------------------------------------ */
/*  Composant Toggle (interrupteur on/off)                             */
/* ------------------------------------------------------------------ */

const Toggle = ({
  enabled,
  onToggle,
  disabled = false,
}: {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`relative w-11 h-6 rounded-full transition-colors ${
      enabled ? "bg-forest" : "bg-gray-200"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    role="switch"
    aria-checked={enabled}
  >
    <div
      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
        enabled ? "translate-x-[22px]" : "translate-x-0.5"
      }`}
    />
  </button>
);

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  /** Préférences de notifications */
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
  });

  /** Affiche le formulaire de changement de mot de passe */
  const [showPassword, setShowPassword] = useState(false);

  /** Mode sombre (pas encore implémenté) */
  const [darkMode] = useState(false);

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Paramètres</h1>

      {/* Section Notifications */}
      <div className="bg-white rounded-[5px] border border-border mb-4">
        <div className="p-5">
          <h2 className="font-heading font-semibold text-navy flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-forest" />
            Notifications
          </h2>
          <div className="space-y-4">
            {[
              { key: "push" as const, label: "Notifications push" },
              { key: "email" as const, label: "Notifications email" },
              { key: "sms" as const, label: "Notifications SMS" },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between">
                <span className="text-sm text-navy">{pref.label}</span>
                <Toggle
                  enabled={notifications[pref.key]}
                  onToggle={() =>
                    setNotifications((prev) => ({ ...prev, [pref.key]: !prev[pref.key] }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Sécurité (mot de passe) */}
      <div className="bg-white rounded-[5px] border border-border mb-4">
        <div className="p-5">
          <h2 className="font-heading font-semibold text-navy flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-forest" />
            Sécurité
          </h2>
          {!showPassword ? (
            /* Bouton pour afficher le formulaire */
            <button
              onClick={() => setShowPassword(true)}
              className="flex items-center justify-between w-full"
            >
              <span className="text-sm text-navy">Changer le mot de passe</span>
              <ChevronRight className="w-4 h-4 text-grayText" />
            </button>
          ) : (
            /* Formulaire de changement de mot de passe */
            <div className="space-y-3">
              <Input type="password" placeholder="Mot de passe actuel" />
              <Input type="password" placeholder="Nouveau mot de passe" />
              <Input type="password" placeholder="Confirmer le nouveau mot de passe" />
              <div className="flex gap-2 pt-1">
                <button className="px-4 py-2 bg-forest text-white text-sm font-bold rounded-[5px] hover:-translate-y-0.5 transition-transform">
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowPassword(false)}
                  className="px-4 py-2 text-sm font-semibold text-grayText hover:text-navy transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Apparence (mode sombre - bientôt disponible) */}
      <div className="bg-white rounded-[5px] border border-border mb-6">
        <div className="p-5">
          <h2 className="font-heading font-semibold text-navy flex items-center gap-2 mb-4">
            <Moon className="w-4 h-4 text-forest" />
            Apparence
          </h2>
          <div className="flex items-center justify-between opacity-50">
            <span className="text-sm text-navy">Mode sombre</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-grayText">Bientôt disponible</span>
              <Toggle enabled={darkMode} onToggle={() => {}} disabled />
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de déconnexion */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red text-white text-sm font-bold rounded-[5px] hover:-translate-y-0.5 transition-transform"
      >
        <LogOut className="w-4 h-4" /> Déconnexion
      </button>
    </div>
  );
}
