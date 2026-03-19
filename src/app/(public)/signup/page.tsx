"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CLIENT" | "ARTISAN">("CLIENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [ape, setApe] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Erreur de connexion au serveur");
      setLoading(false);
    }
  };

  const inputCls =
    "w-full h-12 px-4 rounded-[12px] border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-bgPage">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">
            Créer un compte
          </h1>
          <p className="text-sm text-grayText">Rejoignez Nova gratuitement</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[20px] p-7 shadow-sm border border-border">
          {/* Role selector */}
          <div className="flex gap-1 mb-5 bg-surface rounded-[10px] p-1">
            {([
              { id: "CLIENT" as const, label: "Particulier" },
              { id: "ARTISAN" as const, label: "Artisan" },
            ]).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex-1 py-2.5 rounded-[8px] text-sm font-semibold transition-all duration-200",
                  role === r.id
                    ? "bg-white text-navy shadow-sm"
                    : "text-grayText hover:text-navy",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              <input
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                aria-label="Prénom"
                className={inputCls}
              />
              <input
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                aria-label="Nom"
                className={inputCls}
              />
            </div>

            <div className="space-y-2.5">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
                className={inputCls}
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-label="Téléphone"
                className={inputCls}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                aria-label="Mot de passe"
                className={inputCls}
              />
            </div>

            {/* Artisan extra fields */}
            {role === "ARTISAN" && (
              <>
                <div className="h-px bg-border my-4" />
                <div className="text-xs font-mono uppercase tracking-wider text-grayText mb-3">
                  Informations entreprise
                </div>
                <div className="space-y-2.5">
                  <input
                    placeholder="Raison sociale"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    aria-label="Raison sociale"
                    className={inputCls}
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      placeholder="SIRET"
                      value={siret}
                      onChange={(e) => setSiret(e.target.value)}
                      aria-label="SIRET"
                      className={inputCls}
                    />
                    <input
                      placeholder="Code APE"
                      value={ape}
                      onChange={(e) => setApe(e.target.value)}
                      aria-label="Code APE"
                      className={inputCls}
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <p className="text-xs text-red text-center mt-3" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-[14px] bg-deepForest text-white font-heading font-bold text-sm hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </button>

            <p className="text-[11px] text-grayText/70 text-center mt-3 leading-relaxed">
              En créant un compte, vous acceptez nos{" "}
              <Link href="/cgu" className="text-forest hover:underline">
                conditions d&apos;utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/confidentialite" className="text-forest hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
          </form>
        </div>

        {/* Switch to login */}
        <p className="text-center mt-5 text-sm text-grayText">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-forest font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
