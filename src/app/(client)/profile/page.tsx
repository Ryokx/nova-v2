/**
 * Page profil client.
 * Affiche les informations personnelles (nom, email, téléphone) avec
 * possibilité de les modifier en mode édition.
 * Propose aussi des liens de navigation rapide (paiements, missions, parrainage, etc.).
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  CreditCard, FileText, Gift, Settings, HelpCircle, ChevronRight,
  Pencil, X, Check, Loader2, AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
}

/* ------------------------------------------------------------------ */
/*  Liens de navigation du profil                                      */
/* ------------------------------------------------------------------ */

const navLinks = [
  { label: "Moyens de paiement", icon: CreditCard, href: "/payment-methods", accent: false },
  { label: "Mes missions", icon: FileText, href: "/missions", accent: false },
  { label: "Inviter des proches (20€)", icon: Gift, href: "/referral", accent: true },
  { label: "Paramètres", icon: Settings, href: "/settings", accent: false },
  { label: "Support", icon: HelpCircle, href: "/support", accent: false },
];

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { data: user, loading, refetch } = useFetch<UserProfile>("/api/auth/me");

  /* --- États du mode édition --- */
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* --- Champs du formulaire --- */
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  /** Synchronise les champs du formulaire avec les données API */
  useEffect(() => {
    if (user) {
      setFormName(user.name ?? "");
      setFormEmail(user.email ?? "");
      setFormPhone(user.phone ?? "");
    }
  }, [user]);

  /** Masque le message de succès après 3 secondes */
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  /* Nom et initiales (avec fallback) */
  const name = user?.name ?? session?.user?.name ?? "Sophie Lefevre";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /** Active le mode édition et pré-remplit les champs */
  function startEditing() {
    setFormName(user?.name ?? name);
    setFormEmail(user?.email ?? "");
    setFormPhone(user?.phone ?? "");
    setError(null);
    setSuccess(false);
    setIsEditing(true);
  }

  /** Annule le mode édition */
  function cancelEditing() {
    setIsEditing(false);
    setError(null);
  }

  /** Sauvegarde les modifications via l'API */
  async function handleSave() {
    setError(null);
    setSaving(true);

    try {
      /* Construit le payload avec uniquement les champs modifiés */
      const payload: Record<string, string> = {};
      if (formName.trim() && formName.trim() !== (user?.name ?? "")) {
        payload.name = formName.trim();
      }
      if (formEmail.trim() && formEmail.trim() !== (user?.email ?? "")) {
        payload.email = formEmail.trim();
      }
      if (formPhone.trim() !== (user?.phone ?? "")) {
        payload.phone = formPhone.trim();
      }

      /* Rien à sauvegarder */
      if (Object.keys(payload).length === 0) {
        setIsEditing(false);
        setSaving(false);
        return;
      }

      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue");
        setSaving(false);
        return;
      }

      /* Rafraîchit la session et les données affichées */
      await updateSession();
      refetch();
      setIsEditing(false);
      setSuccess(true);
    } catch {
      setError("Erreur de connexion, réessayez");
    } finally {
      setSaving(false);
    }
  }

  /* Squelette de chargement */
  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 space-y-4">
        <Skeleton height={28} width={120} />
        <Skeleton variant="rectangular" height={180} />
        <Skeleton variant="rectangular" height={300} />
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">

      {/* Avatar + Nom */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-forest to-sage flex items-center justify-center mb-3">
          <span className="font-heading font-bold text-2xl text-white">{initials}</span>
        </div>
        <h1 className="font-heading text-xl font-extrabold text-navy">{name}</h1>
        <p className="text-sm text-grayText">Compte particulier</p>
      </div>

      {/* Message de succès */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-success/[0.08] border border-success/20">
          <Check className="w-4 h-4 text-success shrink-0" />
          <p className="text-sm font-medium text-success">Informations mises à jour avec succès</p>
        </div>
      )}

      {/* Carte informations personnelles */}
      <div className="bg-white rounded-2xl p-5 border border-border mb-5">
        {/* En-tête avec bouton Modifier/Annuler */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-bold text-navy uppercase tracking-wider">Informations personnelles</h2>
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-forest hover:bg-forest/[0.06] active:scale-[0.97] transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Modifier
            </button>
          ) : (
            <button
              onClick={cancelEditing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-grayText hover:bg-surface active:scale-[0.97] transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Annuler
            </button>
          )}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 mb-4 rounded-xl bg-red/[0.06] border border-red/15">
            <AlertCircle className="w-4 h-4 text-red shrink-0" />
            <p className="text-xs font-medium text-red">{error}</p>
          </div>
        )}

        {isEditing ? (
          /* Mode édition : formulaire */
          <div className="space-y-4">
            <Input
              label="Nom complet"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Votre nom complet"
            />
            <Input
              label="Email"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="votre@email.com"
            />
            <Input
              label="Téléphone"
              type="tel"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="06 12 34 56 78"
            />

            {/* Bouton enregistrer */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "w-full flex items-center justify-center gap-2 h-12 rounded-xl text-white text-sm font-bold transition-all duration-200",
                saving
                  ? "bg-forest/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-deepForest to-forest hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(10,64,48,0.25)] active:scale-[0.98]",
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        ) : (
          /* Mode affichage : données en lecture seule */
          <div className="space-y-4">
            {[
              { label: "NOM", value: user?.name ?? name },
              { label: "EMAIL", value: user?.email ?? "sophie.lefevre@email.com" },
              { label: "TÉLÉPHONE", value: user?.phone || "Non renseigné" },
            ].map((field) => (
              <div key={field.label}>
                <div className="text-[11px] text-grayText uppercase font-mono tracking-wider">{field.label}</div>
                <div className={cn(
                  "text-sm mt-0.5",
                  field.value === "Non renseigné" ? "text-grayText italic" : "text-navy",
                )}>
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liens de navigation rapide */}
      <div className="bg-white rounded-2xl border border-border divide-y divide-border overflow-hidden">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${link.accent ? "text-gold" : "text-forest"}`} />
                <span className="text-sm font-semibold text-navy">
                  {link.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-grayText" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
