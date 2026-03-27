/**
 * Page de connexion — /login
 *
 * Permet à l'utilisateur de se connecter via :
 * - Google ou Apple (SSO)
 * - Email + mot de passe (credentials)
 * - Mode démo (comptes pré-créés pour tester la plateforme)
 *
 * Inclut aussi un formulaire inline "mot de passe oublié"
 * qui envoie un email de réinitialisation.
 */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, CheckCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  /* ── État du formulaire de connexion ── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── État du formulaire "mot de passe oublié" ── */
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  /* ── URL de redirection après connexion (si présente dans l'URL) ── */
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  /**
   * Envoie un email de réinitialisation de mot de passe
   * via l'API /api/auth/forgot-password
   */
  const handleForgotPassword = async () => {
    if (!forgotEmail) return;
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (!res.ok) throw new Error();
      setForgotSuccess(true);
    } catch {
      setForgotError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setForgotLoading(false);
    }
  };

  /**
   * Soumission du formulaire de connexion email/mot de passe.
   * En cas de succès, redirige vers le dashboard approprié (client ou artisan).
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      return;
    }

    // Redirection selon le rôle de l'utilisateur
    if (callbackUrl) {
      window.location.href = callbackUrl;
    } else {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;
      window.location.href = role === "ARTISAN" ? "/artisan-dashboard" : "/artisans";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-bgPage">
      <div className="w-full max-w-[420px]">

        {/* ── En-tête avec icône et titre ── */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-[5px] bg-forest/5 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-forest" />
          </div>
          <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">
            Connexion
          </h1>
          <p className="text-sm text-grayText">Accédez à votre espace Nova</p>
        </div>

        {/* ── Carte principale de connexion ── */}
        <div className="bg-white rounded-[5px] p-7 shadow-sm border border-border">

          {/* Boutons de connexion SSO (Google / Apple) */}
          <button
            onClick={() => signIn("google", { callbackUrl: callbackUrl || "/artisans" })}
            className="w-full h-12 rounded-[5px] border border-border bg-white text-navy text-sm font-semibold flex items-center justify-center gap-2.5 mb-2.5 hover:bg-surface transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>
          <button
            onClick={() => signIn("apple", { callbackUrl: callbackUrl || "/artisans" })}
            className="w-full h-12 rounded-[5px] bg-black text-white text-sm font-semibold flex items-center justify-center gap-2.5 mb-4 hover:bg-navy transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 814 1000" fill="#fff">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.6-105.6-210.8-105.6-334.1C0 397.1 78.6 283.9 190.5 283.9c64.2 0 117.8 42.8 155.5 42.8 39 0 99.7-45.2 172.8-45.2 27.8 0 127.7 2.5 193.3 59.4z"/>
              <path d="M554.1 0c-7.8 66.3-67.8 134.3-134.2 134.3-12 0-24-1.3-24-13.3 0-5.8 5.8-28.3 29-57.7C449.8 32.7 515.5 0 554.1 0z"/>
            </svg>
            Continuer avec Apple
          </button>

          {/* Séparateur "ou" */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-grayText font-mono">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Formulaire email / mot de passe */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
              className="w-full h-12 px-4 rounded-[5px] border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              aria-label="Mot de passe"
              className="w-full h-12 px-4 rounded-[5px] border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
            />

            {/* Message d'erreur de connexion */}
            {error && (
              <p className="text-xs text-red text-center" role="alert">
                {error}
              </p>
            )}

            {/* Lien "mot de passe oublié" */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setForgotEmail(email);
                  setForgotSuccess(false);
                  setForgotError("");
                }}
                className="text-xs text-forest font-medium hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* ── Formulaire inline : réinitialisation du mot de passe ── */}
            {showForgot && (
              <div className="p-4 rounded-[5px] bg-surface border border-border space-y-3">
                {forgotSuccess ? (
                  /* Confirmation d'envoi */
                  <div className="text-center py-2">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-sm font-semibold text-navy mb-1">
                      Email envoyé !
                    </p>
                    <p className="text-xs text-grayText">
                      Un email de réinitialisation a été envoyé. Consultez votre
                      boîte mail.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgot(false);
                        setForgotSuccess(false);
                      }}
                      className="text-xs text-forest font-medium hover:underline mt-3"
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  /* Champ email + bouton d'envoi */
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowForgot(false)}
                        className="text-grayText hover:text-navy transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <p className="text-sm font-semibold text-navy">
                        Mot de passe oublié
                      </p>
                    </div>
                    <p className="text-xs text-grayText">
                      Entrez votre email, nous vous enverrons un lien de
                      réinitialisation.
                    </p>
                    <input
                      type="email"
                      placeholder="Votre email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-[5px] border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                    {forgotError && (
                      <p className="text-xs text-red">{forgotError}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={forgotLoading || !forgotEmail}
                      className="w-full h-10 rounded-[5px] bg-deepForest text-white font-heading font-bold text-xs hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                    >
                      {forgotLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi...
                        </span>
                      ) : (
                        "Envoyer le lien"
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Bouton de connexion principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-[5px] bg-deepForest text-white font-heading font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        {/* Lien vers la page d'inscription */}
        <p className="text-center mt-5 text-sm text-grayText">
          Pas encore de compte ?{" "}
          <Link href={callbackUrl ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/signup"} className="text-forest font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>

        {/* Boutons de connexion démo (pour tester la plateforme) */}
        <DemoButtons onError={setError} />
      </div>
    </div>
  );
}

/**
 * Composant DemoButtons
 *
 * Permet de se connecter rapidement avec des comptes de démonstration
 * (client ou artisan) pré-créés via le seed de la base de données.
 */
function DemoButtons({ onError }: { onError: (msg: string) => void }) {
  const [demoLoading, setDemoLoading] = useState<"client" | "artisan" | null>(null);

  /** Connexion automatique avec un compte démo (client ou artisan) */
  const handleDemo = async (type: "client" | "artisan") => {
    onError("");
    setDemoLoading(type);
    try {
      const email = type === "client" ? "sophie.client@demo.nova.fr" : "jm.plombier@demo.nova.fr";
      const result = await signIn("credentials", {
        email,
        password: "Demo1234!",
        redirect: false,
      });
      if (result?.error) {
        onError(`Compte démo ${type} introuvable. Lancez: npx prisma db seed`);
        setDemoLoading(null);
      } else {
        window.location.href = type === "client" ? "/artisans" : "/artisan-dashboard";
      }
    } catch {
      onError("Erreur de connexion. Réessayez.");
      setDemoLoading(null);
    }
  };

  return (
    <div className="mt-6 p-5 rounded-[5px] bg-surface border border-dashed border-forest/15 text-center">
      <div className="text-xs font-mono font-semibold text-forest mb-3 uppercase tracking-wider">Mode démo</div>
      <div className="flex gap-2.5 justify-center">
        <button
          disabled={demoLoading !== null}
          onClick={() => handleDemo("client")}
          className="flex-1 h-10 rounded-[5px] border border-border bg-white text-navy text-[13px] font-semibold hover:bg-bgPage transition-colors disabled:opacity-50"
        >
          {demoLoading === "client" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
              Connexion...
            </span>
          ) : "Client"}
        </button>
        <button
          disabled={demoLoading !== null}
          onClick={() => handleDemo("artisan")}
          className="flex-1 h-10 rounded-[5px] border border-border bg-white text-navy text-[13px] font-semibold hover:bg-bgPage transition-colors disabled:opacity-50"
        >
          {demoLoading === "artisan" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
              Connexion...
            </span>
          ) : "Artisan"}
        </button>
      </div>
    </div>
  );
}
