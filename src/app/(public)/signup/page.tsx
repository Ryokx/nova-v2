"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <div className="bg-white rounded-xl p-7 shadow-sm border border-border">
          {/* Role selector */}
          <div className="flex gap-2 mb-5 bg-surface rounded-md p-1">
            {([
              { id: "CLIENT" as const, label: "Particulier" },
              { id: "ARTISAN" as const, label: "Artisan" },
            ]).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex-1 py-2.5 rounded-sm text-sm font-semibold transition-all duration-200",
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
              <Input
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                aria-label="Prénom"
              />
              <Input
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                aria-label="Nom"
              />
            </div>

            <div className="space-y-2.5">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
              <Input
                type="tel"
                placeholder="Téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-label="Téléphone"
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                aria-label="Mot de passe"
              />
            </div>

            {/* Artisan extra fields */}
            {role === "ARTISAN" && (
              <>
                <div className="h-px bg-border my-3" />
                <div className="text-sm font-semibold text-navy/70 mb-2.5">
                  Informations entreprise
                </div>
                <div className="space-y-2.5">
                  <Input
                    placeholder="Raison sociale"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    aria-label="Raison sociale"
                  />
                  <Input
                    placeholder="SIRET"
                    value={siret}
                    onChange={(e) => setSiret(e.target.value)}
                    aria-label="SIRET"
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-xs text-red text-center mt-3" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-12 rounded-md mt-4" loading={loading}>
              Créer mon compte
            </Button>

            <p className="text-[11px] text-grayText/70 text-center mt-3 leading-relaxed">
              En créant un compte, vous acceptez nos conditions d&apos;utilisation et notre
              politique de confidentialité.
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
