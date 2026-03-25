"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Upload, FileText, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const countries = [
  { code: "FR", flag: "\u{1F1EB}\u{1F1F7}", dial: "+33", name: "France", placeholder: "6 12 34 56 78" },
  { code: "BE", flag: "\u{1F1E7}\u{1F1EA}", dial: "+32", name: "Belgique", placeholder: "470 12 34 56" },
  { code: "CH", flag: "\u{1F1E8}\u{1F1ED}", dial: "+41", name: "Suisse", placeholder: "79 123 45 67" },
  { code: "LU", flag: "\u{1F1F1}\u{1F1FA}", dial: "+352", name: "Luxembourg", placeholder: "621 123 456" },
  { code: "DE", flag: "\u{1F1E9}\u{1F1EA}", dial: "+49", name: "Allemagne", placeholder: "170 1234567" },
  { code: "ES", flag: "\u{1F1EA}\u{1F1F8}", dial: "+34", name: "Espagne", placeholder: "612 34 56 78" },
  { code: "IT", flag: "\u{1F1EE}\u{1F1F9}", dial: "+39", name: "Italie", placeholder: "320 123 4567" },
  { code: "PT", flag: "\u{1F1F5}\u{1F1F9}", dial: "+351", name: "Portugal", placeholder: "912 345 678" },
  { code: "GB", flag: "\u{1F1EC}\u{1F1E7}", dial: "+44", name: "Royaume-Uni", placeholder: "7911 123456" },
  { code: "NL", flag: "\u{1F1F3}\u{1F1F1}", dial: "+31", name: "Pays-Bas", placeholder: "6 12345678" },
  { code: "MA", flag: "\u{1F1F2}\u{1F1E6}", dial: "+212", name: "Maroc", placeholder: "6 12 34 56 78" },
  { code: "DZ", flag: "\u{1F1E9}\u{1F1FF}", dial: "+213", name: "Algérie", placeholder: "5 12 34 56 78" },
  { code: "TN", flag: "\u{1F1F9}\u{1F1F3}", dial: "+216", name: "Tunisie", placeholder: "20 123 456" },
];

interface DocFile {
  file: File;
  name: string;
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // Step management (artisan has 2 steps)
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [role, setRole] = useState<"CLIENT" | "ARTISAN">("CLIENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [ape, setApe] = useState("");
  const [trade, setTrade] = useState("");

  const trades = [
    { id: "plombier", label: "Plombier" },
    { id: "electricien", label: "Électricien" },
    { id: "serrurier", label: "Serrurier" },
    { id: "chauffagiste", label: "Chauffagiste" },
    { id: "peintre", label: "Peintre" },
    { id: "menuisier", label: "Menuisier" },
    { id: "carreleur", label: "Carreleur" },
    { id: "maçon", label: "Maçon" },
    { id: "couvreur", label: "Couvreur" },
    { id: "climaticien", label: "Climaticien" },
    { id: "autre", label: "Autre" },
  ];

  // Phone country
  const [selectedCountry, setSelectedCountry] = useState(countries[0]!);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  // Step 2: Documents (artisan only)
  const [docSiret, setDocSiret] = useState<DocFile | null>(null);
  const [docDecennale, setDocDecennale] = useState<DocFile | null>(null);
  const [docIdentite, setDocIdentite] = useState<DocFile | null>(null);
  const [docRge, setDocRge] = useState<DocFile | null>(null);
  const [docQualibat, setDocQualibat] = useState<DocFile | null>(null);
  const [docKbis, setDocKbis] = useState<DocFile | null>(null);

  // Checkboxes
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isArtisan = role === "ARTISAN";

  // Validation step 1
  const step1Valid = acceptCgu && (isArtisan
    ? firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.includes("@") &&
      phone.trim().length >= 6 &&
      password.length >= 8 &&
      companyName.trim().length > 0 &&
      siret.replace(/\s/g, "").length === 14 &&
      ape.trim().length > 0 &&
      trade.trim().length > 0
    : firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.includes("@") &&
      password.length >= 8);

  // Validation step 2 (docs obligatoires)
  const step2Valid = docSiret !== null && docDecennale !== null && docIdentite !== null;

  const handleFileSelect = (
    setter: (v: DocFile | null) => void,
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setter({ file, name: file.name });
    };
    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isArtisan && step === 1) {
      if (step1Valid) setStep(2);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone: `${selectedCountry.dial}${phone.replace(/\s/g, "")}`,
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

      if (isArtisan) {
        router.push("/artisan-pending");
      } else {
        const loginUrl = callbackUrl
          ? `/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "/login?registered=true";
        router.push(loginUrl);
      }
    } catch {
      setError("Erreur de connexion au serveur");
      setLoading(false);
    }
  };

  const inputCls =
    "w-full h-12 px-4 rounded-[5px] border border-border bg-white text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all";

  const DocUploadCard = ({
    label,
    required,
    value,
    onSelect,
    onRemove,
  }: {
    label: string;
    required?: boolean;
    value: DocFile | null;
    onSelect: () => void;
    onRemove: () => void;
  }) => (
    <div
      className={cn(
        "flex items-center gap-3 p-3.5 rounded-[5px] border transition-all",
        value ? "border-forest/30 bg-forest/5" : "border-border bg-white",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          value ? "bg-forest/10" : "bg-surface",
        )}
      >
        {value ? (
          <CheckCircle className="w-5 h-5 text-forest" />
        ) : (
          <FileText className="w-5 h-5 text-grayText" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-navy">{label}</span>
          {required && <span className="text-[10px] font-bold text-red">*</span>}
        </div>
        {value ? (
          <p className="text-xs text-forest truncate">{value.name}</p>
        ) : (
          <p className="text-xs text-grayText">PDF, JPG ou PNG</p>
        )}
      </div>
      {value ? (
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red hover:underline shrink-0"
        >
          Retirer
        </button>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="flex items-center gap-1.5 px-3 py-2 rounded-[5px] bg-forest/10 text-forest text-xs font-semibold hover:bg-forest/15 transition-colors shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          Ajouter
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-bgPage">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-[28px] font-extrabold text-navy mb-1">
            {isArtisan && step === 2 ? "Documents" : "Créer un compte"}
          </h1>
          <p className="text-sm text-grayText">
            {isArtisan && step === 2
              ? "Téléversez vos justificatifs pour vérification"
              : "Rejoignez Nova gratuitement"}
          </p>
          {/* Step indicator for artisan */}
          {isArtisan && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      step >= s
                        ? "bg-forest text-white"
                        : "bg-surface text-grayText",
                    )}
                  >
                    {s}
                  </div>
                  {s < 2 && (
                    <div
                      className={cn(
                        "w-12 h-0.5 rounded-full",
                        step > 1 ? "bg-forest" : "bg-border",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-[5px] p-7 shadow-sm border border-border">
          {/* Step 2: Documents */}
          {isArtisan && step === 2 ? (
            <div>
              {/* Back to step 1 */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm text-forest font-semibold mb-5 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>

              {/* Obligatoires */}
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-forest" />
                <span className="text-xs font-mono uppercase tracking-wider text-navy font-bold">
                  Documents obligatoires
                </span>
              </div>
              <div className="space-y-2.5 mb-6">
                <DocUploadCard
                  label="Justificatif SIRET"
                  required
                  value={docSiret}
                  onSelect={() => handleFileSelect(setDocSiret)}
                  onRemove={() => setDocSiret(null)}
                />
                <DocUploadCard
                  label="Attestation d'assurance décennale"
                  required
                  value={docDecennale}
                  onSelect={() => handleFileSelect(setDocDecennale)}
                  onRemove={() => setDocDecennale(null)}
                />
                <DocUploadCard
                  label="Pièce d'identité"
                  required
                  value={docIdentite}
                  onSelect={() => handleFileSelect(setDocIdentite)}
                  onRemove={() => setDocIdentite(null)}
                />
              </div>

              {/* Facultatifs */}
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-grayText" />
                <span className="text-xs font-mono uppercase tracking-wider text-grayText">
                  Documents facultatifs
                </span>
              </div>
              <div className="space-y-2.5 mb-4">
                <DocUploadCard
                  label="Certificat RGE"
                  value={docRge}
                  onSelect={() => handleFileSelect(setDocRge)}
                  onRemove={() => setDocRge(null)}
                />
                <DocUploadCard
                  label="Qualibat"
                  value={docQualibat}
                  onSelect={() => handleFileSelect(setDocQualibat)}
                  onRemove={() => setDocQualibat(null)}
                />
                <DocUploadCard
                  label="Extrait Kbis"
                  value={docKbis}
                  onSelect={() => handleFileSelect(setDocKbis)}
                  onRemove={() => setDocKbis(null)}
                />
              </div>

              {error && (
                <p className="text-xs text-red text-center mt-3" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit as () => void}
                disabled={loading || !step2Valid}
                className="w-full h-12 rounded-[5px] bg-deepForest text-white font-heading font-bold text-sm hover:-translate-y-0.5 transition-all mt-2 disabled:opacity-50 disabled:translate-y-0"
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
            </div>
          ) : (
            <>
              {/* Role selector */}
              <div className="flex gap-1 mb-5 bg-surface rounded-[5px] p-1">
                {([
                  { id: "CLIENT" as const, label: "Particulier" },
                  { id: "ARTISAN" as const, label: "Artisan" },
                ] as const).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => { setRole(r.id); setStep(1); }}
                    className={cn(
                      "flex-1 py-2.5 rounded-[5px] text-sm font-semibold transition-all duration-200",
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
                  <div>
                    <label className="text-xs font-medium text-navy mb-1 block">
                      Prénom <span className="text-red">*</span>
                    </label>
                    <input
                      placeholder="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      aria-label="Prénom"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-navy mb-1 block">
                      Nom <span className="text-red">*</span>
                    </label>
                    <input
                      placeholder="Nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      aria-label="Nom"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-medium text-navy mb-1 block">
                      Email <span className="text-red">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Email"
                      className={inputCls}
                    />
                  </div>

                  {/* Phone with country picker */}
                  <div>
                    <label className="text-xs font-medium text-navy mb-1 block">
                      Téléphone {isArtisan && <span className="text-red">*</span>}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative" ref={countryRef}>
                        <button
                          type="button"
                          onClick={() => setShowCountryPicker(!showCountryPicker)}
                          className="h-12 px-3 rounded-[5px] border border-border bg-white flex items-center gap-2 hover:border-forest/40 transition-colors"
                        >
                          <span className="text-lg">{selectedCountry.flag}</span>
                          <span className="text-xs font-mono text-navy">{selectedCountry.dial}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-grayText" />
                        </button>
                        {showCountryPicker && (
                          <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white rounded-[5px] border border-border shadow-lg z-50">
                            {countries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setShowCountryPicker(false);
                                  setPhone("");
                                }}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface transition-colors text-left",
                                  selectedCountry.code === c.code && "bg-forest/5",
                                )}
                              >
                                <span className="text-lg">{c.flag}</span>
                                <span className="text-sm text-navy flex-1">{c.name}</span>
                                <span className="text-xs font-mono text-grayText">{c.dial}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        placeholder={selectedCountry.placeholder}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={isArtisan}
                        aria-label="Téléphone"
                        className={cn(inputCls, "flex-1")}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-medium text-navy mb-1 block">
                      Mot de passe <span className="text-red">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Mot de passe (8 caractères min.)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      aria-label="Mot de passe"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Artisan extra fields */}
                {isArtisan && (
                  <>
                    <div className="h-px bg-border my-4" />
                    <div className="text-xs font-mono uppercase tracking-wider text-grayText mb-3">
                      Informations entreprise
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-xs font-medium text-navy mb-1 block">
                          Métier <span className="text-red">*</span>
                        </label>
                        <select
                          value={trade}
                          onChange={(e) => setTrade(e.target.value)}
                          required
                          aria-label="Métier"
                          className={cn(inputCls, !trade && "text-grayText/50")}
                        >
                          <option value="" disabled>Sélectionnez votre métier</option>
                          {trades.map((t) => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-navy mb-1 block">
                          Raison sociale <span className="text-red">*</span>
                        </label>
                        <input
                          placeholder="Nom de l'entreprise"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                          aria-label="Raison sociale"
                          className={inputCls}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-xs font-medium text-navy mb-1 block">
                            SIRET <span className="text-red">*</span>
                          </label>
                          <input
                            placeholder="123 456 789 00012"
                            value={siret}
                            onChange={(e) => setSiret(e.target.value)}
                            required
                            aria-label="SIRET"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-navy mb-1 block">
                            Code APE <span className="text-red">*</span>
                          </label>
                          <input
                            placeholder="4322A"
                            value={ape}
                            onChange={(e) => setApe(e.target.value)}
                            required
                            aria-label="Code APE"
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Checkboxes */}
                <div className="space-y-3 mt-4">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptCgu}
                      onChange={(e) => setAcceptCgu(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-border text-forest focus:ring-forest/30 accent-forest shrink-0"
                    />
                    <span className="text-[12px] text-navy leading-relaxed">
                      J&apos;accepte les{" "}
                      <Link href="/cgu" className="text-forest font-semibold hover:underline">
                        conditions générales d&apos;utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="/confidentialite" className="text-forest font-semibold hover:underline">
                        politique de confidentialité
                      </Link>{" "}
                      <span className="text-red">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptNewsletter}
                      onChange={(e) => setAcceptNewsletter(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-border text-forest focus:ring-forest/30 accent-forest shrink-0"
                    />
                    <span className="text-[12px] text-grayText leading-relaxed">
                      Je souhaite recevoir les actualités et offres de Nova par email
                    </span>
                  </label>
                </div>

                {error && (
                  <p className="text-xs text-red text-center mt-3" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !step1Valid}
                  className="w-full h-12 rounded-[5px] bg-deepForest text-white font-heading font-bold text-sm hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Création...
                    </span>
                  ) : isArtisan ? (
                    "Continuer"
                  ) : (
                    "Créer mon compte"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Switch to login */}
        <p className="text-center mt-5 text-sm text-grayText">
          Déjà un compte ?{" "}
          <Link href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"} className="text-forest font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
