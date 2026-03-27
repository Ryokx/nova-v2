/**
 * Page de complétion de profil — /complete-profile
 *
 * Affichée après une inscription via Google/Apple si le téléphone n'est pas renseigné.
 * L'utilisateur doit ajouter son numéro de téléphone pour finaliser son compte,
 * car il est nécessaire pour que les artisans puissent le contacter.
 */
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompleteProfilePage() {
  /* ── Session utilisateur (pour afficher le prénom) ── */
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  /* ── État du formulaire ── */
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Envoie le numéro de téléphone à l'API pour mettre à jour le profil.
   * En cas de succès, rafraîchit la session et redirige vers /artisans.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation basique : au moins 10 chiffres
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length < 10) {
      setError("Numéro de téléphone invalide (minimum 10 chiffres)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la mise à jour");
        setLoading(false);
        return;
      }

      // Rafraîchir la session pour que hasPhone soit à jour
      await updateSession();
      router.push("/artisans");
    } catch {
      setError("Erreur de connexion au serveur");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-bgPage">
      <div className="w-full max-w-[420px]">

        {/* En-tête avec icône et message de bienvenue */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-[5px] bg-forest/5 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-7 h-7 text-forest" />
          </div>
          <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">
            Dernière étape
          </h1>
          <p className="text-sm text-grayText">
            Bienvenue {session?.user?.name ?? ""} ! Ajoutez votre numéro de téléphone pour finaliser votre inscription.
          </p>
        </div>

        {/* Carte formulaire */}
        <div className="bg-white rounded-xl p-7 shadow-sm border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="tel"
              label="Numéro de téléphone"
              placeholder="06 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              error={error}
            />

            <p className="text-[11px] text-grayText leading-relaxed">
              Votre numéro est nécessaire pour que les artisans puissent vous contacter concernant vos interventions.
            </p>

            <Button type="submit" className="w-full h-12 rounded-md" loading={loading}>
              Continuer
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
