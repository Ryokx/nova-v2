"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;

  if (score <= 1) return { score, label: "Faible", color: "bg-red" };
  if (score <= 2) return { score, label: "Moyen", color: "bg-gold" };
  if (score <= 3) return { score, label: "Bon", color: "bg-sage" };
  return { score, label: "Excellent", color: "bg-success" };
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const isValid = PASSWORD_REGEX.test(password) && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Missing token/email
  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-bgPage">
        <div className="w-full max-w-[420px] text-center">
          <div className="w-14 h-14 rounded-[18px] bg-red/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red" />
          </div>
          <h1 className="font-heading text-[24px] font-extrabold text-navy mb-2">
            Lien invalide
          </h1>
          <p className="text-sm text-grayText mb-6">
            Ce lien de réinitialisation est invalide ou incomplet.
          </p>
          <Link
            href="/login"
            className="inline-block h-12 px-8 rounded-[14px] bg-deepForest text-white font-heading font-bold text-sm leading-[48px] hover:-translate-y-0.5 transition-all"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-bgPage">
        <div className="w-full max-w-[420px] text-center">
          <div className="w-14 h-14 rounded-[18px] bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-success" />
          </div>
          <h1 className="font-heading text-[24px] font-extrabold text-navy mb-2">
            Mot de passe modifié !
          </h1>
          <p className="text-sm text-grayText mb-6">
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez
            maintenant vous connecter.
          </p>
          <Link
            href="/login"
            className="inline-block h-12 px-8 rounded-[14px] bg-deepForest text-white font-heading font-bold text-sm leading-[48px] hover:-translate-y-0.5 transition-all"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-bgPage">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-[18px] bg-forest/5 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-forest" />
          </div>
          <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">
            Nouveau mot de passe
          </h1>
          <p className="text-sm text-grayText">
            Choisissez un mot de passe sécurisé pour votre compte
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[20px] p-7 shadow-sm border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password field */}
            <div>
              <label className="block text-xs font-medium text-grayText mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Minimum 8 caractères"
                  className="w-full h-12 px-4 pr-11 rounded-[12px] border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-grayText hover:text-navy transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength.score ? strength.color : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-[11px] font-medium ${
                      strength.score <= 1
                        ? "text-red"
                        : strength.score <= 2
                          ? "text-gold"
                          : "text-success"
                    }`}
                  >
                    {strength.label}
                  </p>
                </div>
              )}

              {/* Requirements checklist */}
              <div className="mt-2 space-y-0.5">
                <p
                  className={`text-[11px] ${password.length >= 8 ? "text-success" : "text-grayText"}`}
                >
                  {password.length >= 8 ? "\u2713" : "\u2022"} 8 caractères
                  minimum
                </p>
                <p
                  className={`text-[11px] ${/[A-Z]/.test(password) ? "text-success" : "text-grayText"}`}
                >
                  {/[A-Z]/.test(password) ? "\u2713" : "\u2022"} Une lettre
                  majuscule
                </p>
                <p
                  className={`text-[11px] ${/\d/.test(password) ? "text-success" : "text-grayText"}`}
                >
                  {/\d/.test(password) ? "\u2713" : "\u2022"} Un chiffre
                </p>
              </div>
            </div>

            {/* Confirm password field */}
            <div>
              <label className="block text-xs font-medium text-grayText mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Retapez votre mot de passe"
                  className={`w-full h-12 px-4 pr-11 rounded-[12px] border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:ring-2 transition-all ${
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? "border-red focus:border-red focus:ring-red/10"
                      : "border-border focus:border-forest focus:ring-forest/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-grayText hover:text-navy transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-[11px] text-red mt-1">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-[10px] bg-red/5 border border-red/10">
                <AlertCircle className="w-4 h-4 text-red shrink-0" />
                <p className="text-xs text-red">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full h-12 rounded-[14px] bg-deepForest text-white font-heading font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Réinitialisation...
                </span>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </button>
          </form>
        </div>

        {/* Back to login */}
        <p className="text-center mt-5 text-sm text-grayText">
          <Link
            href="/login"
            className="text-forest font-semibold hover:underline"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
