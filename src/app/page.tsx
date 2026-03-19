import Link from "next/link";
import { Shield, Lock, Check, FileText } from "lucide-react";

/* ━━━ SVG Icons (matching prototype) ━━━ */
const ShieldIcon = ({ size = 28, color = "#1B6B4E" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill={color} opacity=".12" />
    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = ({ size = 18, color = "#1B6B4E" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M8 11V7a4 4 0 118 0v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill={color} />
  </svg>
);

export default function HomePage() {
  return (
    <div>
      {/* ━━━ HERO — Asymmetric layout with phone preview ━━━ */}
      <section className="relative overflow-hidden min-h-[calc(100vh-64px)] flex items-center px-5 md:px-10" style={{ background: "linear-gradient(150deg, #F5FAF7 0%, #E8F5EE 40%, #D4EBE0 100%)" }}>
        {/* Decorative blobs */}
        <div className="absolute -top-[120px] -right-[80px] w-[400px] h-[400px] rounded-full bg-forest/[0.07] blur-[80px]" />
        <div className="absolute -bottom-[100px] -left-[60px] w-[300px] h-[300px] rounded-full bg-gold/[0.06] blur-[60px]" />
        <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] rounded-full bg-success/[0.05] blur-[50px]" />

        <div className="max-w-[1200px] mx-auto w-full flex items-center gap-[60px] relative z-10">
          {/* Left — Text content */}
          <div className="flex-1 min-w-0 py-20">
            {/* Pain point badge */}
            <div className="inline-flex items-center gap-2 bg-red/[0.06] border border-red/[0.12] rounded-[20px] px-4 py-[7px] mb-6 text-[13px] font-semibold text-red animate-pageIn">
              ⚠ 67% des Français ont déjà eu un litige avec un artisan
            </div>

            <h1 className="font-heading text-[40px] md:text-[56px] font-extrabold text-navy leading-[1.1] tracking-[-2px] mb-2 animate-pageIn [animation-delay:100ms]">
              Fini les artisans<br />
              <span className="text-red line-through decoration-[3px] opacity-50">douteux</span>
            </h1>
            <h1 className="font-heading text-[40px] md:text-[56px] font-extrabold text-forest leading-[1.1] tracking-[-2px] mb-6 animate-pageIn [animation-delay:200ms]">
              Place aux certifiés.
            </h1>

            <p className="text-lg text-[#4A5568] leading-[1.8] max-w-[480px] mb-4 animate-pageIn [animation-delay:300ms]">
              Nova vérifie chaque artisan <span className="font-bold text-navy">(SIRET, décennale, RGE)</span> et bloque votre paiement en <span className="font-bold text-navy">séquestre</span> jusqu&apos;à validation de l&apos;intervention.
            </p>

            {/* Trust micro-badges */}
            <div className="flex gap-4 mb-8 flex-wrap animate-pageIn [animation-delay:400ms]">
              {[
                { icon: <Shield className="w-3.5 h-3.5" />, text: "Artisans vérifiés" },
                { icon: <Lock className="w-3.5 h-3.5" />, text: "Paiement séquestre" },
                { icon: <Check className="w-3.5 h-3.5" />, text: "0% d'impayés" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 text-xs font-semibold text-[#14523B]">
                  {b.icon} {b.text}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 animate-pageIn [animation-delay:500ms]">
              <Link href="/signup" className="px-9 py-4 rounded-[14px] bg-gradient-to-br from-deepForest to-forest text-white text-base font-bold font-heading shadow-[0_8px_24px_rgba(10,64,48,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(10,64,48,0.4)] transition-all">
                Trouver mon artisan
              </Link>
              <Link href="/login" className="px-7 py-4 rounded-[14px] bg-white/70 backdrop-blur-[10px] text-navy border border-border text-[15px] font-semibold hover:-translate-y-0.5 transition-transform">
                Voir la démo →
              </Link>
            </div>

            {/* Micro social proof */}
            <div className="flex items-center gap-2.5 mt-7 animate-pageIn [animation-delay:600ms]">
              <div className="flex">
                {["SL", "PM", "CD", "AM"].map((ini, i) => (
                  <div key={ini} className="w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-[9px] font-bold text-forest" style={{ background: `hsl(${150 + i * 30}, 35%, 85%)`, marginLeft: i > 0 ? -8 : 0 }}>
                    {ini}
                  </div>
                ))}
              </div>
              <div className="text-xs text-grayText">
                <span className="font-bold text-navy">Rejoignez-les</span> — Inscription gratuite, sans engagement
              </div>
            </div>
          </div>

          {/* Right — Phone mockup preview */}
          <div className="hidden lg:block flex-none w-[300px] relative animate-pageIn [animation-delay:400ms]">
            <div className="w-[280px] h-[560px] rounded-[44px] bg-navy p-2.5 shadow-[0_30px_80px_rgba(10,22,40,0.2)]" style={{ transform: "rotate(2deg)" }}>
              {/* Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[90px] h-[26px] rounded-b-2xl bg-navy z-10">
                <div className="w-11 h-1 rounded-sm bg-white/[0.12] mx-auto mt-3.5" />
              </div>
              {/* Screen */}
              <div className="w-full h-full rounded-[36px] overflow-hidden" style={{ background: "linear-gradient(170deg, #E8F5EE, #F5FAF7)" }}>
                <div className="pt-[34px] px-3.5">
                  {/* Header */}
                  <div className="flex items-center mb-3 relative">
                    <span className="font-heading text-[13px] font-extrabold text-navy tracking-tight">Nova</span>
                    <div className="w-[3.5px] h-[3.5px] rounded-full bg-gold absolute top-0 right-[-3px]" />
                    <div className="ml-auto w-6 h-6 rounded-lg bg-surface flex items-center justify-center">
                      <LockIcon size={12} />
                    </div>
                  </div>
                  <div className="font-heading text-sm font-extrabold text-navy mb-3">Bonjour Sophie 👋</div>
                  {/* Mini stats */}
                  <div className="flex gap-[5px] mb-2.5">
                    {[{ v: "2", l: "En cours", c: "text-success" }, { v: "570€", l: "Séquestre", c: "text-forest" }].map((k) => (
                      <div key={k.l} className="flex-1 bg-white rounded-[10px] py-[7px] px-1.5 text-center border border-border">
                        <div className={`font-mono text-xs font-bold ${k.c}`}>{k.v}</div>
                        <div className="text-[7px] text-grayText">{k.l}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mission cards */}
                  {[
                    { ini: "JM", name: "Jean-Michel P.", desc: "Réparation fuite", badge: "En cours", bColor: "#22C88A" },
                    { ini: "SM", name: "Sophie M.", desc: "Prise électrique", badge: "Terminée", bColor: "#1B6B4E" },
                    { ini: "KB", name: "Karim B.", desc: "Serrure", badge: "Validée", bColor: "#F5A623" },
                  ].map((m) => (
                    <div key={m.ini} className="bg-white rounded-md p-2 mb-[5px] border border-surface flex gap-2 items-center">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-surface to-border flex items-center justify-center text-[8px] font-bold text-forest">{m.ini}</div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-navy">{m.name}</div>
                        <div className="text-[8px] text-grayText">{m.desc}</div>
                      </div>
                      <span className="text-[7px] font-bold px-[5px] py-[2px] rounded" style={{ color: m.bColor, background: m.bColor + "15" }}>{m.badge}</span>
                    </div>
                  ))}
                  {/* Séquestre visual */}
                  <div className="bg-gradient-to-br from-deepForest to-forest rounded-md p-2.5 mt-2">
                    <div className="flex items-center gap-[5px] mb-1">
                      <LockIcon size={10} color="#8ECFB0" />
                      <span className="text-[8px] font-bold text-lightSage">Paiement en séquestre</span>
                    </div>
                    <div className="font-mono text-base font-bold text-white">570,00 €</div>
                    <div className="text-[7px] text-white/50">Protégé jusqu&apos;à validation</div>
                  </div>
                  {/* Tab bar */}
                  <div className="flex justify-around pt-2.5 mt-2.5 border-t border-surface">
                    {["🏠", "🔍", "📋", "🔔", "👤"].map((e, i) => (
                      <span key={e} className="text-[13px]" style={{ opacity: i === 0 ? 1 : 0.35 }}>{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Floating notification */}
            <div className="absolute top-20 -left-[60px] bg-white rounded-[14px] px-3.5 py-2.5 shadow-lg border border-surface flex items-center gap-2 max-w-[200px] animate-pageIn [animation-delay:800ms]">
              <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center"><Check className="w-3.5 h-3.5 text-success" /></div>
              <div>
                <div className="text-[10px] font-bold text-navy">Intervention validée</div>
                <div className="text-[8px] text-grayText">Paiement libéré • 320€</div>
              </div>
            </div>
            {/* Floating shield */}
            <div className="absolute bottom-[100px] -right-[30px] bg-white rounded-[14px] px-3.5 py-2.5 shadow-lg border border-surface flex items-center gap-2 animate-pageIn [animation-delay:1000ms]">
              <ShieldIcon size={18} />
              <div>
                <div className="text-[10px] font-bold text-navy">Artisan certifié</div>
                <div className="text-[8px] text-grayText">SIRET • Décennale • RGE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TRUST PILLARS ━━━ */}
      <section className="py-16 px-5 md:px-10 bg-white">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldIcon size={28} />, title: "Artisans certifiés", desc: "Chaque artisan est audité, vérifié et assuré avant d'être référencé sur la plateforme." },
            { icon: <LockIcon size={28} />, title: "Paiement séquestre", desc: "Votre argent est bloqué sur un compte sécurisé. L'artisan n'est payé qu'après validation par Nova." },
            { icon: <Check className="w-7 h-7 text-forest" />, title: "Validation Nova", desc: "Notre équipe contrôle et valide chaque mission avant de libérer le paiement vers l'artisan." },
          ].map((p) => (
            <div key={p.title} className="p-7 rounded-xl bg-surface border border-border hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="w-[52px] h-[52px] rounded-lg bg-forest/[0.04] flex items-center justify-center mb-4">{p.icon}</div>
              <h3 className="font-heading text-lg font-bold text-navy mb-2">{p.title}</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-16 px-5 md:px-10 bg-bgPage">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-heading text-[32px] font-extrabold text-navy mb-10">Comment ça marche</h2>
          <div className="flex flex-col md:flex-row gap-0">
            {[
              { step: "1", title: "Trouvez", desc: "Recherchez un artisan certifié par catégorie ou urgence" },
              { step: "2", title: "Réservez", desc: "Prenez rendez-vous et acceptez le devis en ligne" },
              { step: "3", title: "Payez en séquestre", desc: "Votre argent est bloqué, pas débité" },
              { step: "4", title: "On valide", desc: "Nova vérifie la mission et libère le paiement" },
            ].map((s, i) => (
              <div key={s.step} className="flex-1 text-center relative">
                {i < 3 && <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-0.5 bg-border z-0" />}
                <div className="w-10 h-10 rounded-full bg-deepForest text-white flex items-center justify-center text-base font-bold mx-auto mb-3 relative z-10">{s.step}</div>
                <h4 className="text-[15px] font-bold text-navy mb-1">{s.title}</h4>
                <p className="text-[13px] text-grayText leading-snug px-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ APP DEMO PREVIEW ━━━ */}
      <section className="py-20 px-5 md:px-10 overflow-hidden" style={{ background: "linear-gradient(170deg, #0A4030 0%, #1B6B4E 100%)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-[20px] px-4 py-1.5 mb-4 text-xs font-semibold text-white/80">
              Découvrez la plateforme
            </div>
            <h2 className="font-heading text-4xl font-extrabold text-white mb-3">Testez Nova en mode démo</h2>
            <p className="text-base text-white/65 max-w-[500px] mx-auto">
              Explorez l&apos;interface complète sans créer de compte. Choisissez votre profil.
            </p>
          </div>

          {/* Two demo cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto mb-12">
            <Link href="/login" className="group bg-white/[0.08] backdrop-blur-xl rounded-3xl p-7 border border-white/[0.12] hover:-translate-y-1 hover:bg-white/[0.14] transition-all">
              <div className="w-14 h-14 rounded-[18px] bg-white/[0.12] flex items-center justify-center mb-5 text-[28px]">🏠</div>
              <h3 className="font-heading text-[22px] font-extrabold text-white mb-2">Je suis particulier</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-5">Trouvez un artisan certifié, réservez en ligne, payez en séquestre. Suivi temps réel de l&apos;intervention.</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["Recherche artisans", "Réservation", "Vidéo diagnostic", "Signature devis", "Paiement 3x/4x", "Suivi live"].map((f) => (
                  <span key={f} className="px-2.5 py-1 rounded-lg bg-lightSage/15 text-lightSage text-[11px] font-semibold">{f}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-lightSage font-bold text-[15px]">
                Explorer le mode client <span className="text-lg">→</span>
              </div>
            </Link>

            <Link href="/login" className="group bg-white/[0.08] backdrop-blur-xl rounded-3xl p-7 border border-white/[0.12] hover:-translate-y-1 hover:bg-white/[0.14] transition-all">
              <div className="w-14 h-14 rounded-[18px] bg-white/[0.12] flex items-center justify-center mb-5 text-[28px]">🔧</div>
              <h3 className="font-heading text-[22px] font-extrabold text-white mb-2">Je suis artisan</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-5">Gérez vos missions, créez vos devis et factures, suivez vos paiements. Tout depuis un seul tableau de bord.</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["Dashboard KPIs", "Devis en ligne", "Facturation auto", "Comptabilité", "QR code profil", "Carnet clients"].map((f) => (
                  <span key={f} className="px-2.5 py-1 rounded-lg bg-gold/15 text-[#F5D090] text-[11px] font-semibold">{f}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[#F5D090] font-bold text-[15px]">
                Explorer le mode artisan <span className="text-lg">→</span>
              </div>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[900px] mx-auto">
            {[
              { icon: <LockIcon size={22} color="#8ECFB0" />, title: "Séquestre", desc: "Paiement bloqué jusqu'à validation" },
              { icon: <ShieldIcon size={22} color="#8ECFB0" />, title: "Certifications", desc: "SIRET, décennale, RGE vérifiés" },
              { icon: <Check className="w-[22px] h-[22px] text-lightSage" />, title: "Suivi live", desc: "Artisan en route, sur place, terminé" },
              { icon: <FileText className="w-[22px] h-[22px] text-lightSage" />, title: "Tout en ligne", desc: "Devis, signature, facture, compta" },
            ].map((f) => (
              <div key={f.title} className="text-center py-5 px-3">
                <div className="w-11 h-11 rounded-[14px] bg-white/[0.08] flex items-center justify-center mx-auto mb-2.5">{f.icon}</div>
                <div className="text-sm font-bold text-white mb-1">{f.title}</div>
                <div className="text-xs text-white/50">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ MOBILE APP PREVIEW ━━━ */}
      <section className="py-20 px-5 md:px-10 bg-bgPage overflow-hidden">
        <div className="max-w-[1100px] mx-auto flex items-center gap-[60px] flex-wrap">
          {/* iPhone mockup */}
          <div className="hidden md:block flex-none relative">
            <div className="w-[280px] h-[570px] rounded-[44px] bg-navy p-3 shadow-[0_20px_60px_rgba(10,22,40,0.15)] relative">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-7 rounded-b-[18px] bg-navy z-10">
                <div className="w-[50px] h-1 rounded-sm bg-white/15 mx-auto mt-4" />
              </div>
              <div className="w-full h-full rounded-[34px] overflow-hidden relative" style={{ background: "linear-gradient(170deg, #E8F5EE 0%, #F5FAF7 100%)" }}>
                <div className="pt-3.5 px-5 flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-navy">9:41</span>
                  <div className="w-3.5 h-2.5 rounded-sm border border-navy"><div className="w-[70%] h-full bg-navy rounded-[1px]" /></div>
                </div>
                <div className="px-4 pt-4">
                  <div className="flex items-center gap-2 mb-3.5">
                    <ShieldIcon size={18} />
                    <span className="font-heading text-[15px] font-extrabold text-navy">Nova</span>
                  </div>
                  <div className="text-[11px] text-grayText mb-1">Bonjour Sophie</div>
                  <div className="font-heading text-base font-extrabold text-navy mb-3">Votre espace client</div>
                  <div className="flex gap-1.5 mb-3">
                    {[{ v: "2", l: "En cours" }, { v: "570€", l: "Séquestre" }, { v: "8", l: "Terminées" }].map((k) => (
                      <div key={k.l} className="flex-1 bg-white rounded-md py-2 px-1.5 text-center border border-border">
                        <div className="font-mono text-[13px] font-bold text-forest">{k.v}</div>
                        <div className="text-[8px] text-grayText">{k.l}</div>
                      </div>
                    ))}
                  </div>
                  {[
                    { ini: "JM", name: "Jean-Michel P.", desc: "Réparation fuite • 15 mars", status: "En cours", color: "text-success" },
                    { ini: "SM", name: "Sophie M.", desc: "Prise électrique • 10 mars", status: "Terminée", color: "text-forest" },
                  ].map((m) => (
                    <div key={m.ini} className="bg-white rounded-[14px] p-2.5 mb-2 border border-border flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-surface to-border flex items-center justify-center text-[10px] font-bold text-forest">{m.ini}</div>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold text-navy">{m.name}</div>
                        <div className="text-[9px] text-grayText">{m.desc}</div>
                      </div>
                      <span className={`text-[8px] font-bold ${m.color} bg-surface px-1.5 py-0.5 rounded`}>{m.status}</span>
                    </div>
                  ))}
                  <div className="flex justify-around pt-2.5 mt-2.5 border-t border-surface">
                    {["🏠", "🔍", "📋", "🔔", "👤"].map((e, i) => (
                      <span key={e} className="text-base" style={{ opacity: i === 0 ? 1 : 0.4 }}>{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-10 -right-5 bg-red text-white px-3.5 py-1.5 rounded-md text-[11px] font-bold shadow-[0_4px_16px_rgba(232,48,42,0.3)]">Nouveau</div>
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-flex items-center gap-2 bg-forest/[0.04] rounded-[20px] px-4 py-1.5 mb-5 text-xs font-semibold text-[#14523B]">
              Application mobile
            </div>
            <h2 className="font-heading text-[32px] font-extrabold text-navy mb-3">Nova dans votre poche</h2>
            <p className="text-[15px] text-[#4A5568] leading-relaxed mb-7">
              Retrouvez toutes les fonctionnalités sur votre smartphone. Notifications en temps réel, suivi artisan, signature de devis et paiement en séquestre — où que vous soyez.
            </p>
            <div className="flex flex-col gap-3.5 mb-8">
              {[
                { icon: "📲", title: "Notifications push", desc: "Soyez alerté en temps réel : nouveau devis, artisan en route, intervention terminée" },
                { icon: "✍️", title: "Signature tactile", desc: "Signez vos devis directement sur l'écran avec votre doigt" },
                { icon: "📹", title: "Vidéo diagnostic", desc: "Filmez votre problème et envoyez-le à l'artisan avant l'intervention" },
                { icon: "🌙", title: "Mode sombre", desc: "Interface adaptée pour une utilisation confortable de nuit" },
              ].map((f) => (
                <div key={f.title} className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-md bg-surface border border-border flex items-center justify-center text-lg shrink-0">{f.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-navy">{f.title}</div>
                    <div className="text-[13px] text-grayText leading-snug">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 bg-black rounded-md px-5 py-2.5 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 814 1000" fill="#fff"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.6-105.6-210.8-105.6-334.1C0 397.1 78.6 283.9 190.5 283.9c64.2 0 117.8 42.8 155.5 42.8 39 0 99.7-45.2 172.8-45.2 27.8 0 127.7 2.5 193.3 59.4z" /><path d="M554.1 0c-7.8 66.3-67.8 134.3-134.2 134.3-12 0-24-1.3-24-13.3 0-5.8 5.8-28.3 29-57.7C449.8 32.7 515.5 0 554.1 0z" /></svg>
                <div>
                  <div className="text-[9px] text-white/70">Télécharger sur</div>
                  <div className="text-base font-semibold text-white">App Store</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-black rounded-md px-5 py-2.5 cursor-pointer">
                <svg width="22" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l12.8 8.5a1 1 0 010 1.6l-12.8 8.5c-.66.5-1.6.03-1.6-.8z" fill="#fff" /></svg>
                <div>
                  <div className="text-[9px] text-white/70">Disponible sur</div>
                  <div className="text-base font-semibold text-white">Google Play</div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-grayText/60 mt-2.5">Disponible sur iOS 15+ et Android 12+. Gratuit.</p>
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="py-16 px-5 md:px-10 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-[28px] font-extrabold text-navy text-center mb-9">Ils nous font confiance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Caroline L.", city: "Paris 4e", text: "Le séquestre m'a rassurée. Je savais que mon argent était protégé. L'artisan était ponctuel et professionnel." },
              { name: "Pierre M.", city: "Lyon 6e", text: "Fuite d'eau un dimanche soir, intervention en 1h30. Le suivi en temps réel est top, je voyais l'artisan arriver." },
              { name: "Amélie R.", city: "Bordeaux", text: "J'ai signé le devis en ligne, payé en 3x via Klarna. Aucune surprise sur la facture. Je recommande à 100%." },
            ].map((t) => (
              <div key={t.name} className="bg-surface rounded-[18px] p-6 border border-border">
                <div className="text-gold text-sm mb-2.5">{"★".repeat(5)}</div>
                <p className="text-sm text-[#4A5568] leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-md bg-gradient-to-br from-surface to-border flex items-center justify-center text-xs font-bold text-forest">
                    {t.name[0]}{t.name.split(" ")[1]?.[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-navy">{t.name}</div>
                    <div className="text-[11px] text-grayText">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FINAL CTA ━━━ */}
      <section className="py-16 px-5 md:px-10 text-center bg-surface">
        <h2 className="font-heading text-[28px] font-extrabold text-navy mb-3">Prêt à trouver votre artisan ?</h2>
        <p className="text-[15px] text-[#4A5568] mb-7">Inscription gratuite. Aucun engagement.</p>
        <Link href="/signup" className="inline-block px-10 py-3.5 rounded-md bg-deepForest text-white text-[15px] font-semibold shadow-md hover:-translate-y-0.5 transition-transform">
          Créer un compte gratuitement
        </Link>
      </section>
    </div>
  );
}
