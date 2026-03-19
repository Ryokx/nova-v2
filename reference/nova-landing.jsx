import { useState, useEffect, useRef } from "react";

export default function NovaLandingArtisan() {
  const [email, setEmail] = useState("");
  const [metier, setMetier] = useState("");
  const [ville, setVille] = useState("");
  const [step, setStep] = useState(0); // 0=form, 1=details, 2=done
  const [count, setCount] = useState(312);
  const [visible, setVisible] = useState({});
  const [m, setM] = useState(false);
  const [simCA, setSimCA] = useState(4820);
  const [simPlan, setSimPlan] = useState("pro");
  const [simMetier, setSimMetier] = useState("");
  const [simVille, setSimVille] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportStep, setReportStep] = useState(0); // 0=form, 1=loading, 2=result
  const [reportData, setReportData] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [phoneScreen, setPhoneScreen] = useState(0);
  const [showSignup, setShowSignup] = useState(false);
  const [signupStep, setSignupStep] = useState(0);
  const [signupPass, setSignupPass] = useState("");
  const [signupNom, setSignupNom] = useState("");
  const [signupPrenom, setSignupPrenom] = useState("");
  const [signupTel, setSignupTel] = useState("");
  const [signupSiret, setSignupSiret] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [docs, setDocs] = useState({ siret: false, decennale: false, rge: false, qualibat: false, kbis: false, identite: false });
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || document.documentElement.scrollTop || 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = () => setM(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.id]: true })); });
    }, { threshold: 0.1 });
    document.querySelectorAll("[data-anim]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPhoneScreen(s => (s + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);

  // Point 7: Escape to close modals + body scroll lock
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") { setShowReport(false); setShowSignup(false); }};
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (showReport || showSignup) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showReport, showSignup]);

  // ── SEO: Meta tags + JSON-LD Schema.org ──
  useEffect(() => {
    document.title = "Nova Artisan — 0% d'impayés, paiement garanti par séquestre | Plateforme artisans";

    const metas = [
      { name: "description", content: "Plateforme de mise en relation artisans-particuliers avec paiement sécurisé par séquestre. 0% d'impayés. Inscription gratuite. Vos clients paient avant l'intervention, vous êtes payé sous 48h. 1er mois du forfait Expert offert." },
      { name: "keywords", content: "artisan, impayé artisan solution, plateforme artisan, paiement séquestre, mise en relation artisan particulier, plombier, électricien, serrurier, garantie décennale, devis artisan" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Nova" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Nova — 0% d'impayés pour les artisans. Paiement garanti par séquestre." },
      { property: "og:description", content: "Vos clients paient avant l'intervention. Vous intervenez sereinement. Paiement garanti sous 48h. Inscription gratuite, 1er mois Expert offert." },
      { property: "og:url", content: "https://nova.fr/artisan" },
      { property: "og:site_name", content: "Nova" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nova — 0% d'impayés pour les artisans" },
      { name: "twitter:description", content: "Paiement garanti par séquestre. Inscription gratuite. 1er mois Expert offert." },
    ];

    const addedMetas = [];
    metas.forEach(m => {
      const tag = document.createElement("meta");
      if (m.name) tag.setAttribute("name", m.name);
      if (m.property) tag.setAttribute("property", m.property);
      tag.setAttribute("content", m.content);
      document.head.appendChild(tag);
      addedMetas.push(tag);
    });

    // Canonical
    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", "https://nova.fr/artisan");
    document.head.appendChild(canonical);

    // JSON-LD: Organization
    const orgSchema = document.createElement("script");
    orgSchema.type = "application/ld+json";
    orgSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Nova",
      "url": "https://nova.fr",
      "description": "Plateforme de mise en relation artisans-particuliers avec paiement sécurisé par séquestre",
      "foundingDate": "2026",
      "areaServed": { "@type": "Country", "name": "France" },
      "serviceType": ["Mise en relation artisan", "Paiement séquestre", "Vérification artisan"]
    });
    document.head.appendChild(orgSchema);

    // JSON-LD: FAQPage
    const faqSchema = document.createElement("script");
    faqSchema.type = "application/ld+json";
    faqSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Combien coûte Nova pour un artisan ?", "acceptedAnswer": { "@type": "Answer", "text": "L'inscription est gratuite. Votre 1er mois, vous bénéficiez du forfait Expert offert : seulement 5% de commission au lieu de 10-15%. Ensuite, elle passe à 10-15%. Pas d'abonnement obligatoire." }},
        { "@type": "Question", "name": "Comment fonctionne le paiement par séquestre pour les artisans ?", "acceptedAnswer": { "@type": "Answer", "text": "Quand un client vous réserve, il paie immédiatement sur un compte sécurisé géré par un prestataire agréé. Vous intervenez. Nova vérifie que tout est OK. Les fonds sont virés sur votre compte sous 48h." }},
        { "@type": "Question", "name": "Comment Nova protège les artisans en cas de litige client ?", "acceptedAnswer": { "@type": "Answer", "text": "Nova arbitre avec les preuves : photos avant/après, devis signé numériquement, horodatage de l'intervention. 97% des artisans sont payés intégralement après examen." }},
        { "@type": "Question", "name": "Quels documents fournir pour s'inscrire sur Nova ?", "acceptedAnswer": { "@type": "Answer", "text": "SIRET actif, attestation d'assurance décennale en cours de validité, et pièce d'identité. Documents facultatifs : RGE, Qualibat, Kbis. Vérification en 48-72h." }},
        { "@type": "Question", "name": "Un artisan peut-il recevoir des interventions d'urgence sur Nova ?", "acceptedAnswer": { "@type": "Answer", "text": "Oui. Activez le mode Urgences dans votre profil. Les urgences sont majorées de 15 à 25%, et les clients ont déjà payé avant de vous appeler." }},
      ]
    });
    document.head.appendChild(faqSchema);

    // JSON-LD: WebPage
    const wpSchema = document.createElement("script");
    wpSchema.type = "application/ld+json";
    wpSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Nova — Espace Artisan",
      "description": "Plateforme artisan avec paiement garanti par séquestre. 0% d'impayés, inscription gratuite.",
      "url": "https://nova.fr/artisan",
      "inLanguage": "fr",
      "isPartOf": { "@type": "WebSite", "name": "Nova", "url": "https://nova.fr" },
      "about": { "@type": "Service", "name": "Nova pour artisans", "description": "Mise en relation artisans certifiés et particuliers avec paiement sécurisé par séquestre", "provider": { "@type": "Organization", "name": "Nova" }}
    });
    document.head.appendChild(wpSchema);

    return () => {
      addedMetas.forEach(t => t.remove());
      canonical.remove();
      orgSchema.remove();
      faqSchema.remove();
      wpSchema.remove();
    };
  }, []);

  const anim = (id) => ({
    id, "data-anim": "1",
    style: { opacity: visible[id] ? 1 : 0, transform: visible[id] ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.6s ease, transform 0.6s ease" },
  });

  const px = m ? "20px" : "5%";

  const Shield = ({ s = 28 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#1B6B4E" opacity=".15"/><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="#1B6B4E" strokeWidth="1.5" fill="none"/><path d="M9 12l2 2 4-4" stroke="#1B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const Ck = ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1B6B4E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const X = ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#E8302A" strokeWidth="3" strokeLinecap="round"/></svg>;

  return (
    <div lang="fr" role="main" style={{ fontFamily: "'DM Sans', sans-serif", color: "#0A1628", background: "#F5FAF7", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        button { cursor: pointer; transition: transform 180ms ease, box-shadow 180ms ease; }
        button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(10,64,48,0.1); }
        button:active { transform: scale(0.97) translateY(0); box-shadow: none; }
        input:focus, select:focus { outline: none; border-color: #1B6B4E !important; box-shadow: 0 0 0 3px rgba(27,107,78,0.1); }
        input[type=range] { -webkit-appearance: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #1B6B4E; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
        input[type=range]::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #1B6B4E; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .float { animation: float 4s ease-in-out infinite; }
        details summary::-webkit-details-marker { display: none; }
        details summary { list-style: none; }
      `}</style>

      {/* ━━━ NAVBAR ━━━ */}
      <nav aria-label="Navigation principale" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(245,250,247,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(27,107,78,0.06)",
        padding: `0 ${px}`, height: m ? 56 : 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
            <Shield s={m ? 24 : 28}/><span style={{ fontFamily: "'Manrope'", fontSize: m ? 18 : 20, fontWeight: 800, color: "#0A1628" }}>Nova</span>
          </button>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#1B6B4E", background: "#E8F5EE", padding: "2px 8px", borderRadius: 6, marginLeft: 4 }}>Espace Artisan</span>
        </div>
        {!m && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[
              { label: "Démo", target: "section-demo" },
              { label: "Simulateur", target: "section-simulator" },
              { label: "Avantages", target: "section-advantages" },
              { label: "FAQ", target: "section-faq" },
            ].map((link, i) => (
              <button key={i} onClick={() => { const el = document.getElementById(link.target); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }} style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "#4A5568", background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans'", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#E8F5EE"; e.currentTarget.style.color = "#1B6B4E"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4A5568"; }}
              >{link.label}</button>
            ))}
          </div>
        )}
        <button onClick={() => { setShowSignup(true); setSignupStep(0); setSignupPass(""); setSignupNom(""); setSignupPrenom(""); setSignupTel(""); setSignupSiret(""); setAcceptCGU(false); }} style={{
          padding: m ? "7px 16px" : "8px 20px", borderRadius: 10,
          background: "#0A4030", color: "#fff", border: "none",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Devenir partenaire</button>
      </nav>

      {/* ━━━ HERO ━━━ */}
      <section id="hero-top" style={{
        paddingTop: m ? 80 : 140, paddingBottom: m ? 36 : 80,
        background: "#F5FAF7", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative background */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "50%", height: "80%", background: "radial-gradient(ellipse, rgba(27,107,78,0.07), transparent 70%)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: "40%", height: "60%", background: "radial-gradient(ellipse, rgba(45,155,110,0.05), transparent 70%)", pointerEvents: "none" }}/>
        {!m && <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #1B6B4E 1px, transparent 0)", backgroundSize: "36px 36px", pointerEvents: "none" }}/>}

        <div style={{ maxWidth: 720, margin: "0 auto", padding: `0 ${px}`, textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Badges — single line on mobile */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: m ? 10 : 14 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8F5EE", borderRadius: 20, padding: "5px 14px 5px 8px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#1B6B4E" strokeWidth="2"/><path d="M8 11V7a4 4 0 118 0v4" stroke="#1B6B4E" strokeWidth="2" strokeLinecap="round"/></svg>
              <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 600, color: "#1B6B4E" }}>Paiement garanti</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 20, padding: "5px 14px 5px 8px", border: "1px solid #D4EBE0" }}>
              <span style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 800, color: "#1B6B4E" }}>0%</span>
              <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 600, color: "#4A5568" }}>d'impayés</span>
            </div>
          </div>

          {/* Offer banner */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #0A4030, #1B6B4E)", borderRadius: 10, padding: "7px 16px", marginBottom: m ? 16 : 22 }}>
            <span style={{ fontSize: 14 }}>🎁</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#fff" }}>1 mois du forfait Expert offert</span>
          </div>

          <h1 style={{
            fontFamily: "'Manrope'", fontSize: m ? 26 : 50,
            fontWeight: 800, lineHeight: 1.1, color: "#0A1628",
            margin: `0 0 ${m ? 12 : 16}px`, letterSpacing: "-1px",
          }}>
            Zéro impayé.{m ? " " : <br/>}Vos clients{" "}<span style={{ color: "#1B6B4E" }}>paient avant.</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans'", fontSize: m ? 14 : 18, color: "#4A5568", lineHeight: 1.7, margin: `0 auto ${m ? 20 : 28}px`, maxWidth: 520 }}>
            Nova est la plateforme artisan qui bloque le paiement du client en séquestre <strong style={{ color: "#0A1628" }}>avant votre intervention</strong>. Vous intervenez sereinement. On valide. Vous êtes payé sous 48h.
          </p>

          {/* Friction killers — only on desktop */}
          {!m && (
            <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
              {[
                { icon: <Ck s={12}/>, text: "Inscription gratuite" },
                { icon: <Ck s={12}/>, text: "Sans engagement" },
                { icon: <Ck s={12}/>, text: "Paiement sous 48h" },
                { icon: <Ck s={12}/>, text: "30 secondes" },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {p.icon}
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", fontWeight: 500 }}>{p.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: m ? 10 : 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setShowSignup(true); setSignupStep(0); }} style={{ padding: m ? "14px 28px" : "16px 36px", borderRadius: 14, background: "#0A4030", color: "#fff", border: "none", fontSize: m ? 14 : 16, fontWeight: 800, fontFamily: "'Manrope'", display: "flex", alignItems: "center", gap: 8 }}>
              S'inscrire gratuitement <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => document.getElementById("section-simulator")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: m ? "14px 20px" : "16px 28px", borderRadius: 14, background: "#fff", color: "#0A1628", border: "1px solid #D4EBE0", fontSize: m ? 13 : 15, fontWeight: 600, fontFamily: "'DM Sans'" }}>
              Simuler mes économies
            </button>
          </div>
          {/* Compact friction line — mobile replaces the 4 pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: m ? 10 : 14 }}>
            {(m ? ["Gratuit", "30 sec", "Sans engagement"] : ["30 secondes", "Sans carte bancaire", "Sans engagement"]).map((t, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono'", fontSize: m ? 10 : 11, color: "#6B7280" }}>{t}{i < 2 ? " ·" : ""}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ BEFORE / AFTER ━━━ */}
      <section style={{ padding: `${m ? 48 : 72}px ${px}`, background: "#fff" }}>
        <div {...anim("ba")} style={{ ...anim("ba").style, maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 28 : 40 }}>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#1B6B4E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Comparatif</div>
            <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 24 : 34, fontWeight: 800, lineHeight: 1.2 }}>Votre quotidien, transformé.</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 0, borderRadius: 24, overflow: "hidden", boxShadow: "0 12px 48px rgba(10,64,48,0.06)", border: "1px solid #D4EBE0" }}>
            {/* AVANT */}
            <div style={{ background: "#FFFBFB", padding: m ? 24 : 32, position: "relative", borderRight: m ? "none" : "1px solid #D4EBE0", borderBottom: m ? "1px solid #D4EBE0" : "none" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: m ? "100%" : 4, height: m ? 4 : "100%", background: "linear-gradient(to bottom, #E8302A, #F5841F)" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#E8302A", boxShadow: "0 0 8px rgba(232,48,42,0.3)" }} />
                <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 700, color: "#E8302A", letterSpacing: 1.5, textTransform: "uppercase" }}>Sans Nova</span>
              </div>

              {[
                { metric: "12%", label: "de factures impayées", desc: "Vous travaillez mais l'argent ne vient pas" },
                { metric: "6h", label: "de paperasse / semaine", desc: "Devis Word, relances, comptabilité manuelle" },
                { metric: "0", label: "garantie de paiement", desc: "Vous faites confiance. Parfois ça passe, parfois non" },
                { metric: "3 mois", label: "de trésorerie instable", desc: "Certains mois c'est plein, d'autres c'est vide" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 3 ? 16 : 0, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "'DM Mono'", fontSize: 20, fontWeight: 800, color: "#E8302A", minWidth: 52, textAlign: "right", lineHeight: 1 }}>{item.metric}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{item.label}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F0E0E0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FDE8E8", borderRadius: 10, padding: "10px 14px" }}>
                  <X s={14}/>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#E8302A" }}>Résultat : stress, impayés, perte de temps</span>
                </div>
              </div>
            </div>

            {/* APRÈS */}
            <div style={{ background: "#F5FAF7", padding: m ? 24 : 32, position: "relative" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: m ? "100%" : 4, height: m ? 4 : "100%", background: "linear-gradient(to bottom, #1B6B4E, #22C88A)" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C88A", boxShadow: "0 0 8px rgba(34,200,138,0.3)" }} />
                <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 700, color: "#1B6B4E", letterSpacing: 1.5, textTransform: "uppercase" }}>Avec Nova</span>
              </div>

              {[
                { metric: "0%", label: "d'impayés", desc: "Le client paie avant. Argent bloqué en séquestre" },
                { metric: "1h", label: "de gestion / semaine", desc: "Devis auto, factures générées, export comptable en 1 clic" },
                { metric: "48h", label: "pour être payé", desc: "Nova valide, vous recevez le virement" },
                { metric: "+40%", label: "de clients en plus", desc: "Visibilité boostée, urgences rémunérées, partenariats syndics" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 3 ? 16 : 0, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "'DM Mono'", fontSize: 20, fontWeight: 800, color: "#1B6B4E", minWidth: 52, textAlign: "right", lineHeight: 1 }}>{item.metric}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{item.label}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#4A5568", lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #D4EBE0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#E8F5EE", borderRadius: 10, padding: "10px 14px" }}>
                  <Ck s={14}/>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#1B6B4E" }}>Résultat : sérénité, revenus garantis, temps libéré</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ DEMO APP ━━━ */}
      <section id="section-demo" style={{ padding: `${m ? 48 : 72}px ${px}`, background: "#F5FAF7", scrollMarginTop: m ? 56 : 64 }}>
        <div {...anim("demo")} style={{ ...anim("demo").style, maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 28 : 56, alignItems: "center" }}>
            {/* Phone mockup */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                width: m ? 240 : 280, height: m ? 480 : 560,
                borderRadius: 36, background: "#0A1628", padding: 8, position: "relative",
                boxShadow: "0 20px 56px rgba(10,22,40,0.22), 0 0 0 1px rgba(255,255,255,0.06)",
                animation: "float 6s ease-in-out infinite",
              }}>
                {/* Notch */}
                <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 90, height: 24, borderRadius: "0 0 14px 14px", background: "#0A1628", zIndex: 10 }} />
                {/* Screen */}
                <div style={{ width: "100%", height: "100%", borderRadius: 28, background: "#F5FAF7", overflow: "hidden", position: "relative" }}>
                  {/* Status bar */}
                  <div style={{ padding: "12px 18px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'DM Mono'", fontSize: 10, fontWeight: 600, color: "#0A1628" }}>9:41</span>
                    <div style={{ width: 12, height: 8, borderRadius: 2, border: "1.5px solid #0A1628" }}><div style={{ width: 6, height: 4, borderRadius: 1, background: "#0A1628", margin: "1px auto" }}/></div>
                  </div>
                  {/* App header */}
                  <div style={{ padding: "6px 16px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                    <Shield s={16}/><span style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 800, color: "#0A1628" }}>Nova Pro</span>
                  </div>

                  {/* ── Screen 0: Dashboard ── */}
                  {phoneScreen === 0 && <div style={{ padding: "0 14px", animation: "fadeUp 0.4s ease" }}>
                    <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 2 }}>Bonjour Jean-Michel</div>
                    <div style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 800, color: "#0A1628", marginBottom: 10 }}>Tableau de bord</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                      {[{ l: "Revenus", v: "4 820€" },{ l: "Missions", v: "12" }].map((k, i) => (
                        <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "8px 10px", border: "1px solid #D4EBE0" }}>
                          <div style={{ fontSize: 8, color: "#6B7280" }}>{k.l}</div>
                          <div style={{ fontFamily: "'DM Mono'", fontSize: 15, fontWeight: 700, color: "#1B6B4E" }}>{k.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "linear-gradient(135deg, #E8302A, #FF6B5B)", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>Demande urgente</div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.8)" }}>Fuite d'eau — Paris 9e</div>
                      <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                        <div style={{ padding: "3px 10px", borderRadius: 6, background: "#fff", fontSize: 8, fontWeight: 700, color: "#E8302A" }}>Accepter</div>
                      </div>
                    </div>
                    {[{ c: "Pierre M.", t: "Installation · Auj. 14h" },{ c: "Amélie R.", t: "Réparation · Dem. 9h" }].map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderTop: "1px solid #E8F5EE" }}>
                        <div><div style={{ fontSize: 10, fontWeight: 600, color: "#0A1628" }}>{r.c}</div><div style={{ fontSize: 8, color: "#6B7280" }}>{r.t}</div></div>
                        <div style={{ padding: "2px 8px", borderRadius: 4, background: "#E8F5EE", fontSize: 7, fontWeight: 600, color: "#1B6B4E" }}>Confirmé</div>
                      </div>
                    ))}
                  </div>}

                  {/* ── Screen 1: Devis sur place ── */}
                  {phoneScreen === 1 && <div style={{ padding: "0 14px", animation: "fadeUp 0.4s ease" }}>
                    <div style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 800, color: "#0A1628", marginBottom: 10 }}>Nouveau devis</div>
                    <div style={{ background: "#fff", borderRadius: 10, padding: 12, border: "1px solid #D4EBE0", marginBottom: 8 }}>
                      <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 2 }}>Client</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#0A1628" }}>Pierre Martin</div>
                    </div>
                    {[{ l: "Remplacement robinet", p: "120 €" },{ l: "Joint flexible", p: "15 €" },{ l: "Main d'œuvre (1h)", p: "65 €" }].map((li, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E8F5EE" }}>
                        <span style={{ fontSize: 10, color: "#4A5568" }}>{li.l}</span>
                        <span style={{ fontFamily: "'DM Mono'", fontSize: 10, fontWeight: 600, color: "#0A1628" }}>{li.p}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", marginTop: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#0A1628" }}>Total TTC</span>
                      <span style={{ fontFamily: "'DM Mono'", fontSize: 14, fontWeight: 800, color: "#1B6B4E" }}>200,00 €</span>
                    </div>
                    <div style={{ marginTop: 10, padding: "10px", borderRadius: 10, background: "#0A4030", textAlign: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Envoyer au client</span>
                    </div>
                  </div>}

                  {/* ── Screen 2: Paiement séquestre ── */}
                  {phoneScreen === 2 && <div style={{ padding: "0 14px", animation: "fadeUp 0.4s ease" }}>
                    <div style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 800, color: "#0A1628", marginBottom: 10 }}>Suivi paiement</div>
                    <div style={{ background: "#fff", borderRadius: 10, padding: 12, border: "1px solid #D4EBE0", marginBottom: 10 }}>
                      <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 4 }}>Mission #1247 · Pierre Martin</div>
                      <div style={{ fontFamily: "'Manrope'", fontSize: 24, fontWeight: 800, color: "#0A1628" }}>200,00 €</div>
                    </div>
                    <div style={{ background: "#E8F5EE", borderRadius: 8, padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                      <Ck s={10}/><span style={{ fontSize: 10, fontWeight: 600, color: "#1B6B4E" }}>Client a payé · Argent en séquestre</span>
                    </div>
                    {["Paiement reçu", "Intervention réalisée", "Nova valide", "Virement sous 48h"].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: i <= 2 ? "#1B6B4E" : "#D4EBE0", display: "flex", alignItems: "center", justifyContent: "center" }}>{i <= 2 && <Ck s={8}/>}</div>
                        <span style={{ fontSize: 10, color: i <= 2 ? "#0A1628" : "#6B7280", fontWeight: i <= 2 ? 600 : 400 }}>{s}</span>
                      </div>
                    ))}
                  </div>}

                  {/* ── Screen 3: Urgence acceptée ── */}
                  {phoneScreen === 3 && <div style={{ padding: "0 14px", animation: "fadeUp 0.4s ease" }}>
                    <div style={{ textAlign: "center", marginTop: 12 }}>
                      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#E8F5EE", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width={22} height={22} viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#1B6B4E"/></svg>
                      </div>
                      <div style={{ fontFamily: "'Manrope'", fontSize: 15, fontWeight: 800, color: "#0A1628", marginBottom: 4 }}>Urgence acceptée !</div>
                      <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 12 }}>Fuite d'eau — Paris 9e</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 10, padding: 12, border: "1px solid #D4EBE0", marginBottom: 8 }}>
                      {[{ l: "Client", v: "Sophie Durand" },{ l: "Adresse", v: "12 rue de Clichy, 75009" },{ l: "Montant estimé", v: "280 € (maj. +20%)" }].map((r, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? "1px solid #E8F5EE" : "none" }}>
                          <span style={{ fontSize: 10, color: "#6B7280" }}>{r.l}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: i === 2 ? "#1B6B4E" : "#0A1628" }}>{r.v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#E8F5EE", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                      <Ck s={10}/><span style={{ fontSize: 10, fontWeight: 600, color: "#1B6B4E" }}>Paiement déjà bloqué en séquestre</span>
                    </div>
                  </div>}

                  {/* Screen indicators */}
                  <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
                    {[0,1,2,3].map(i => <div key={i} style={{ width: phoneScreen === i ? 16 : 6, height: 5, borderRadius: 3, background: phoneScreen === i ? "#1B6B4E" : "#D4EBE0", transition: "all 0.3s" }}/>)}
                  </div>

                  {/* Bottom nav */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "rgba(255,255,255,0.95)", borderTop: "1px solid #E8F5EE", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 14px" }}>
                    {[{ l: "Accueil", a: phoneScreen === 0 },{ l: "Devis", a: phoneScreen === 1 },{ l: "Paie", a: phoneScreen === 2 },{ l: "Profil", a: false }].map((tab, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ width: 14, height: 14, borderRadius: 4, background: tab.a ? "#1B6B4E" : "#D4EBE0", margin: "0 auto 2px" }}/>
                        <div style={{ fontSize: 7, color: tab.a ? "#1B6B4E" : "#6B7280", fontWeight: tab.a ? 700 : 400 }}>{tab.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Demo text + synced features */}
            <div style={{ textAlign: m ? "center" : "left" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8F5EE", borderRadius: 8, padding: "4px 12px", marginBottom: 14, fontSize: 12, fontWeight: 600, color: "#14523B" }}>Démo interactive</div>
              <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 24 : 28, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.2, color: "#0A1628" }}>Votre futur espace artisan</h2>
              <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, margin: "0 0 20px" }}>Tableau de bord, devis, paiements, urgences — tout centralisé dans une seule application.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { title: "Dashboard temps réel", desc: "Revenus, missions, planning — tout en un coup d'œil.", num: "01" },
                  { title: "Devis et factures sur place", desc: "Créez un devis devant le client, envoyez-le en 1 clic.", num: "02" },
                  { title: "Suivi paiement séquestre", desc: "Voyez exactement où en est chaque paiement.", num: "03" },
                  { title: "Urgences rémunérées", desc: "Acceptez des urgences majorées, paiement déjà bloqué.", num: "04" },
                ].map((f, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "14px 16px", borderRadius: 14,
                    background: phoneScreen === i ? "#E8F5EE" : "#fff",
                    border: `1px solid ${phoneScreen === i ? "#1B6B4E40" : "#D4EBE0"}`,
                    transition: "all 0.3s",
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: phoneScreen === i ? "#1B6B4E" : "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono'", fontSize: 10, fontWeight: 700, color: phoneScreen === i ? "#fff" : "#1B6B4E", flexShrink: 0, transition: "all 0.3s" }}>{f.num}</div>
                    <div>
                      <div style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 700, color: "#0A1628", marginBottom: 2 }}>{f.title}</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#4A5568", lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: m ? "center" : "flex-start", flexWrap: "wrap" }}>
                <button onClick={() => { setShowSignup(true); setSignupStep(0); setSignupPass(""); setSignupNom(""); setSignupPrenom(""); setSignupTel(""); setSignupSiret(""); setAcceptCGU(false); }} style={{ padding: "13px 28px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, fontFamily: "'Manrope'" }}>S'inscrire gratuitement</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ━━━ SIMULATEUR D'ÉCONOMIE ━━━ */}
      <section id="section-simulator" style={{ padding: `${m ? 48 : 80}px ${px}`, background: "#fff", scrollMarginTop: m ? 56 : 64 }}>
        <div {...anim("simulator")} style={{ ...anim("simulator").style, maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 28 : 40 }}>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 12, fontWeight: 500, color: "#1B6B4E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Simulateur</div>
            <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 24 : 32, fontWeight: 800, margin: "0 0 10px", color: "#0A1628" }}>Combien allez-vous économiser ?</h2>
            <p style={{ fontSize: m ? 14 : 16, color: "#4A5568", maxWidth: 540, margin: "0 auto" }}>Entrez votre chiffre d'affaires mensuel pour voir l'économie réelle avec nos plans premium.</p>
          </div>

          <div style={{ background: "#F5FAF7", borderRadius: 20, padding: m ? 24 : 36, border: "1px solid #D4EBE0" }}>
            {/* CA Input */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: "#4A5568", marginBottom: 10 }}>Votre chiffre d'affaires mensuel sur Nova</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input type="range" min="500" max="15000" step="100" value={simCA} onChange={e => setSimCA(Number(e.target.value))}
                    style={{ width: "100%", height: 6, appearance: "none", background: `linear-gradient(to right, #1B6B4E ${((simCA - 500) / 14500) * 100}%, #D4EBE0 0%)`, borderRadius: 3, outline: "none", cursor: "pointer" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 10, border: "1px solid #D4EBE0", padding: "8px 14px", minWidth: 130 }}>
                  <input type="number" value={simCA} onChange={e => { const v = Math.max(0, Math.min(50000, Number(e.target.value) || 0)); setSimCA(v); }} style={{ border: "none", background: "none", fontFamily: "'DM Mono'", fontSize: 22, fontWeight: 700, color: "#0A1628", width: 80, outline: "none", textAlign: "right" }} />
                  <span style={{ fontFamily: "'DM Mono'", fontSize: 18, color: "#6B7280", marginLeft: 4 }}>€</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#6B7280" }}>500 €</span>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#6B7280" }}>15 000 €</span>
              </div>
            </div>

            {/* Plan selector */}
            <div style={{ display: "flex", gap: m ? 8 : 12, marginBottom: 28 }}>
              {[
                { key: "essentiel", label: "Essentiel", price: "Gratuit", commission: "10%", desc: "Plan standard" },
                { key: "pro", label: "Pro", price: "49€/mois", commission: "7%", desc: "Le plus populaire" },
                { key: "expert", label: "Expert", price: "99€/mois", commission: "5%", desc: "Maximum d'économies" },
              ].map(plan => {
                const active = simPlan === plan.key;
                return (
                  <div key={plan.key} onClick={() => setSimPlan(plan.key)}
                    style={{
                      flex: 1, padding: m ? "14px 12px" : "18px 20px", borderRadius: 14, cursor: "pointer",
                      border: `2px solid ${active ? "#1B6B4E" : "#D4EBE0"}`,
                      background: active ? "#E8F5EE" : "#fff",
                      transition: "all 0.2s ease",
                    }}>
                    <div style={{ fontFamily: "'Manrope'", fontSize: m ? 14 : 16, fontWeight: 700, color: active ? "#0A4030" : "#0A1628" }}>{plan.label}</div>
                    <div style={{ fontFamily: "'DM Mono'", fontSize: m ? 12 : 14, fontWeight: 600, color: "#1B6B4E", marginTop: 4 }}>{plan.price}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", marginTop: 4 }}>Commission {plan.commission}</div>
                    {plan.key === "pro" && <div style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 700, color: "#1B6B4E", marginTop: 6, background: "#D4EBE0", borderRadius: 4, padding: "2px 8px", display: "inline-block" }}>Recommandé</div>}
                  </div>
                );
              })}
            </div>

            {/* Results */}
            {(() => {
              const plans = { essentiel: { abo: 0, rate: 0.10 }, pro: { abo: 49, rate: 0.07 }, expert: { abo: 99, rate: 0.05 } };
              const current = plans.essentiel;
              const selected = plans[simPlan];
              const costEssentiel = simCA * current.rate;
              const costSelected = simCA * selected.rate + selected.abo;
              const saving = costEssentiel - costSelected;
              const savingAnnual = saving * 12;
              const seuilPro = Math.ceil(49 / 0.03);
              const seuilExpert = Math.ceil(99 / 0.05);
              const isProfitable = saving > 0;
              const seuil = simPlan === "pro" ? seuilPro : simPlan === "expert" ? seuilExpert : 0;

              return (
                <div>
                  {/* Comparison bars */}
                  <div style={{ display: "flex", gap: m ? 10 : 16, marginBottom: 24 }}>
                    <div style={{ flex: 1, background: "#fff", borderRadius: 14, padding: m ? "16px 14px" : "20px 22px", border: "1px solid #D4EBE0" }}>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Avec le plan Essentiel</div>
                      <div style={{ fontFamily: "'DM Mono'", fontSize: m ? 22 : 28, fontWeight: 700, color: "#0A1628" }}>{costEssentiel.toLocaleString("fr-FR")} €</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", marginTop: 4 }}>Commission 10% / mois</div>
                    </div>
                    <div style={{ flex: 1, background: isProfitable ? "#E8F5EE" : "#FDE8E8", borderRadius: 14, padding: m ? "16px 14px" : "20px 22px", border: `1px solid ${isProfitable ? "#2D9B6E" : "#E8302A"}30` }}>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Avec le plan {simPlan === "pro" ? "Pro" : simPlan === "expert" ? "Expert" : "Essentiel"}</div>
                      <div style={{ fontFamily: "'DM Mono'", fontSize: m ? 22 : 28, fontWeight: 700, color: "#0A1628" }}>{costSelected.toLocaleString("fr-FR")} €</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                        {simPlan !== "essentiel" ? `Commission ${selected.rate * 100}% + abo ${selected.abo}€` : "Commission 10% / mois"}
                      </div>
                    </div>
                  </div>

                  {/* Savings highlight */}
                  {simPlan !== "essentiel" && (
                    <div style={{
                      background: isProfitable ? "linear-gradient(135deg, #0A4030, #1B6B4E)" : "#FDE8E8",
                      borderRadius: 16, padding: m ? "20px 18px" : "24px 28px",
                      display: "flex", alignItems: m ? "flex-start" : "center", gap: m ? 16 : 24,
                      flexDirection: m ? "column" : "row",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: isProfitable ? "rgba(255,255,255,0.7)" : "#E8302A", marginBottom: 6 }}>
                          {isProfitable ? "Votre économie avec le plan " + (simPlan === "pro" ? "Pro" : "Expert") : "Le plan n'est pas encore rentable"}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                          <span style={{ fontFamily: "'Manrope'", fontSize: m ? 32 : 42, fontWeight: 800, color: isProfitable ? "#fff" : "#E8302A" }}>
                            {isProfitable ? "+" : ""}{saving.toLocaleString("fr-FR")} €
                          </span>
                          <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: isProfitable ? "rgba(255,255,255,0.6)" : "#E8302A" }}>/ mois</span>
                        </div>
                        {isProfitable && (
                          <div style={{ fontFamily: "'DM Mono'", fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
                            Soit {savingAnnual.toLocaleString("fr-FR")} € d'économie par an
                          </div>
                        )}
                        {!isProfitable && seuil > 0 && (
                          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#E8302A", marginTop: 8 }}>
                            Rentable à partir de {seuil.toLocaleString("fr-FR")} €/mois de CA
                          </div>
                        )}
                      </div>
                      {isProfitable && (
                        <div style={{ display: "flex", gap: 12 }}>
                          {[
                            { label: "0% impayés", sub: "Paiement garanti" },
                            { label: `${(selected.rate * 100).toFixed(0)}%`, sub: "Commission" },
                            { label: "1 clic", sub: "Export compta" },
                          ].map((k, i) => (
                            <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", minWidth: 80 }}>
                              <div style={{ fontFamily: "'Manrope'", fontSize: 16, fontWeight: 800, color: "#fff" }}>{k.label}</div>
                              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{k.sub}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick comparison table */}
                  {simPlan !== "essentiel" && isProfitable && (
                    <div style={{ marginTop: 20, background: "#fff", borderRadius: 12, border: "1px solid #D4EBE0", overflow: "hidden" }}>
                      {[
                        { label: "Commission mensuelle", ess: `${costEssentiel.toLocaleString("fr-FR")} €`, plan: `${(simCA * selected.rate).toLocaleString("fr-FR")} €` },
                        { label: "Abonnement", ess: "0 €", plan: `${selected.abo} €` },
                        { label: "Coût total / mois", ess: `${costEssentiel.toLocaleString("fr-FR")} €`, plan: `${costSelected.toLocaleString("fr-FR")} €`, bold: true },
                        { label: "Économie mensuelle", ess: "—", plan: `+${saving.toLocaleString("fr-FR")} €`, green: true },
                        { label: "Économie annuelle", ess: "—", plan: `+${savingAnnual.toLocaleString("fr-FR")} €`, green: true, bold: true },
                      ].map((r, i) => (
                        <div key={i} style={{ display: "flex", padding: "10px 20px", borderBottom: i < 4 ? "1px solid #D4EBE0" : "none", background: r.bold ? "#F5FAF7" : "transparent" }}>
                          <div style={{ flex: 1, fontFamily: "'DM Sans'", fontSize: 12, color: "#4A5568", fontWeight: r.bold ? 600 : 400 }}>{r.label}</div>
                          <div style={{ width: 120, textAlign: "right", fontFamily: "'DM Mono'", fontSize: 12, color: "#6B7280" }}>{r.ess}</div>
                          <div style={{ width: 120, textAlign: "right", fontFamily: "'DM Mono'", fontSize: 12, fontWeight: 600, color: r.green ? "#22C88A" : "#0A1628" }}>{r.plan}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── AI Report CTA ── */}
            <div style={{ marginTop: 28, background: "#fff", borderRadius: 16, border: "1px solid #D4EBE0", padding: m ? 20 : 28 }}>
              <div style={{ display: "flex", flexDirection: m ? "column" : "row", gap: m ? 16 : 24, alignItems: m ? "stretch" : "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Manrope'", fontSize: m ? 16 : 18, fontWeight: 800, color: "#0A1628" }}>Rapport personnalisé gratuit</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>Analyse de votre activité et rapport complet : économies détaillées, estimation de nouveaux clients dans votre zone, potentiel de CA avec Nova, et recommandation de plan sur mesure.</p>
                </div>
                <button onClick={() => { setShowReport(true); setReportStep(0); setReportData(null); if (!simMetier) setSimMetier("Plombier"); if (!simVille) setSimVille(""); }} style={{ padding: "14px 24px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, fontFamily: "'Manrope'", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", flexShrink: 0 }}>
                  Générer mon rapport <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                {["Gratuit", "Sans inscription", "Résultat en 15 sec"].map((t, i) => (
                  <span key={i} style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280" }}>{i > 0 ? "• " : ""}{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ━━━ 3 KEY ADVANTAGES ━━━ */}
      <section id="section-advantages" style={{ padding: `${m ? 48 : 72}px ${px}`, background: "#F5FAF7", scrollMarginTop: m ? 56 : 64 }}>
        <div {...anim("adv")} style={{ ...anim("adv").style, maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 22 : 30, fontWeight: 800, margin: "0 0 8px", textAlign: "center", color: "#0A1628" }}>
            Ce que vous ne trouverez nulle part ailleurs
          </h2>
          <p style={{ fontSize: m ? 13 : 15, color: "#4A5568", textAlign: "center", margin: "0 0 36px" }}>
            Trois avantages concrets qui changent votre quotidien d'artisan.
          </p>

          {/* Advantage 1 — Gestion interventions */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: m ? "24px 20px" : "32px 28px",
            border: "1px solid rgba(27,107,78,0.06)", marginBottom: 16,
            display: "flex", flexDirection: m ? "column" : "row", gap: m ? 16 : 28, alignItems: m ? "flex-start" : "center",
          }}>
            <div style={{
              width: m ? 56 : 64, height: m ? 56 : 64, borderRadius: 18, background: "#E8F5EE",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontFamily: "'DM Mono'", fontSize: m ? 12 : 14, fontWeight: 700, color: "#1B6B4E" }}>PDF</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "'Manrope'", fontSize: m ? 17 : 19, fontWeight: 700, color: "#0A1628", margin: "0 0 6px" }}>
                Gestion des interventions et comptabilité
              </h3>
              <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, margin: "0 0 14px" }}>
                Toutes vos interventions sont enregistrées et accessibles à tout moment. Exportez votre historique, vos factures et vos devis en PDF ou CSV en un clic. Générez un récapitulatif mensuel avec le détail des revenus et commissions — prêt à envoyer à votre comptable.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Export PDF / CSV", "Récapitulatif mensuel", "Factures conformes", "Historique complet"].map((tag, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#E8F5EE", borderRadius: 8, padding: "5px 12px",
                  }}>
                    <Ck s={10}/>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#14523B" }}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Advantage 2 — Protection */}
          <div style={{
            background: "#0A4030", borderRadius: 20, padding: m ? "24px 20px" : "32px 28px",
            marginBottom: 16,
            display: "flex", flexDirection: m ? "column" : "row", gap: m ? 16 : 28, alignItems: m ? "flex-start" : "center",
          }}>
            <div style={{
              width: m ? 56 : 64, height: m ? 56 : 64, borderRadius: 18, background: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Shield s={m ? 26 : 30}/>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "'Manrope'", fontSize: m ? 17 : 19, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                Protégé en cas de litige
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                Un client mécontent qui conteste ? Vous n'êtes plus seul. Nova arbitre chaque litige avec des preuves : devis signé, photos avant/après, horodatage de l'intervention. Si votre travail est conforme, vous êtes payé intégralement. En cas de désaccord, notre équipe tranche sous 48h. Vous vous concentrez sur votre métier, on gère le reste.
              </p>
              <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "inline-block" }}>
                <span style={{ fontFamily: "'DM Mono'", fontSize: m ? 14 : 16, fontWeight: 700, color: "#8ECFB0" }}>97% des artisans payés</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 8 }}>après examen de litige</span>
              </div>
            </div>
          </div>

          {/* Advantage 3 — Syndics */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: m ? "24px 20px" : "32px 28px",
            border: "1px solid rgba(27,107,78,0.06)",
            display: "flex", flexDirection: m ? "column" : "row", gap: m ? 16 : 28, alignItems: m ? "flex-start" : "center",
          }}>
            <div style={{
              width: m ? 56 : 64, height: m ? 56 : 64, borderRadius: 18, background: "#E8F5EE",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontFamily: "'DM Mono'", fontSize: m ? 18 : 22, fontWeight: 700, color: "#1B6B4E" }}>B2B</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "'Manrope'", fontSize: m ? 17 : 19, fontWeight: 700, color: "#0A1628", margin: "0 0 6px" }}>
                Accès aux marchés syndics et copropriétés
              </h3>
              <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, margin: 0 }}>
                Les syndics et gestionnaires immobiliers ont besoin d'artisans fiables en continu, mais ne savent pas où les trouver. Nova noue des partenariats B2B et vous donne accès à un carnet de commandes récurrent. Un seul partenariat syndic peut vous apporter 5 à 10 interventions régulières par mois, sans aucune prospection de votre part.
              </p>
              <div style={{ display: "flex", gap: m ? 12 : 20, marginTop: 14 }}>
                {[["Interventions/syndic", "5-10/mois"], ["Prospection", "Zéro"]].map(([label, val], i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'DM Mono'", fontSize: m ? 16 : 18, fontWeight: 700, color: "#1B6B4E" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ━━━ FAQ ━━━ */}
      <section id="section-faq" aria-label="Questions fréquentes sur Nova pour les artisans" style={{ padding: `${m ? 48 : 72}px ${px}`, background: "#fff", scrollMarginTop: m ? 56 : 64 }}>
        <div {...anim("faq")} style={{ ...anim("faq").style, maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 22 : 28, fontWeight: 800, margin: "0 0 32px", textAlign: "center" }}>Questions fréquentes</h2>
          {[
            { q: "Combien ça coûte ?", a: "L'inscription est gratuite. Votre 1er mois, vous bénéficiez du forfait Expert offert : seulement 5% de commission au lieu de 10-15%. Ensuite, elle passe à 10-15%. Pas d'abonnement obligatoire." },
            { q: "Comment fonctionne le séquestre ?", a: "Quand un client vous réserve, il paie immédiatement sur un compte sécurisé géré par un prestataire agréé. Vous intervenez. Nova vérifie que tout est OK. Les fonds sont virés sur votre compte sous 48h." },
            { q: "Comment fonctionne la gestion des interventions ?", a: "Chaque intervention est enregistrée avec tous les détails : date, client, montant, statut. Vous pouvez exporter l'historique complet en CSV ou PDF, télécharger vos factures individuellement ou par lot, et générer un récapitulatif mensuel pour votre comptable." },
            { q: "Et si le client conteste ?", a: "Nova arbitre avec les preuves : photos avant/après, devis signé numériquement, horodatage de l'intervention. Vous n'êtes plus seul face au litige. 97% des artisans sont payés intégralement après examen." },
            { q: "C'est quoi les partenariats syndics ?", a: "Nova signe des partenariats avec des syndics de copropriété et gestionnaires immobiliers. En tant qu'artisan certifié, vous êtes automatiquement proposé pour les interventions dans leurs immeubles. C'est un carnet de commandes récurrent sans prospection." },
            { q: "Le badge Certifié, je peux l'utiliser ailleurs ?", a: "Oui. Le badge Certifié Nova est utilisable sur vos devis, cartes de visite, véhicule et signature email. Il renforce votre crédibilité auprès de tous vos clients, même ceux trouvés hors plateforme." },
            { q: "Quels documents dois-je fournir ?", a: "SIRET actif, attestation d'assurance décennale en cours de validité, et pièce d'identité. Documents facultatifs : RGE, Qualibat, Kbis. Le processus de vérification prend 48-72h." },
            { q: "Je peux recevoir des urgences ?", a: "Oui. Activez le mode 'Urgences' dans votre profil et définissez vos créneaux de disponibilité. Les urgences sont majorées de 15 à 25%, et les clients ont déjà payé avant de vous appeler." },
            { q: "Comment sont calculés les avis ?", a: "Seuls les clients ayant finalisé et validé une mission via Nova peuvent laisser un avis. Impossible de tricher — chaque avis est lié à une mission réelle et un paiement séquestre." },
          ].map((item, i) => (
            <div key={i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
              borderBottom: "1px solid #D4EBE0", cursor: "pointer",
            }}>
              <div style={{
                padding: m ? "16px 0" : "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: m ? 14 : 15, fontWeight: 600, color: "#0A1628" }}>{item.q}</span>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 18, color: "#1B6B4E", flexShrink: 0, marginLeft: 16, transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.25s ease" }}>+</span>
              </div>
              {faqOpen === i && (
                <div style={{ paddingBottom: 18, fontSize: 13, color: "#4A5568", lineHeight: 1.7, animation: "fadeUp 0.3s ease" }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ━━━ FINAL CTA ━━━ */}
      <section style={{
        padding: `${m ? 56 : 80}px ${px}`, textAlign: "center",
        background: "linear-gradient(170deg, #0A4030 0%, #1B6B4E 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: "10%", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}/>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto" }}>
          {/* Pain reminder */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "6px 16px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
            <X s={12}/><span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>12% d'impayés, 6h de paperasse, clients qui négocient...</span>
          </div>

          <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 26 : 38, fontWeight: 800, color: "#fff", margin: "0 0 14px", lineHeight: 1.15 }}>
            Arrêtez de travailler<br/>sans garantie de paiement.
          </h2>
          <p style={{ fontSize: m ? 14 : 16, color: "rgba(255,255,255,0.7)", margin: "0 0 32px", lineHeight: 1.7, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            Vos clients paient avant l'intervention. Vous intervenez sereinement. Nova valide. Vous êtes payé sous 48h. Et c'est gratuit.
          </p>

          <a href="#" onClick={(e) => { e.preventDefault(); setShowSignup(true); setSignupStep(0); }} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: m ? "15px 32px" : "16px 40px", borderRadius: 14,
            background: "#fff", color: "#0A4030",
            fontSize: m ? 15 : 17, fontWeight: 800, textDecoration: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)", fontFamily: "'Manrope'",
          }}>S'inscrire gratuitement <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#0A4030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></a>

          {/* Friction killers */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
            {["30 secondes", "Sans carte bancaire", "1er mois Expert offert"].map((t, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{t}{i < 2 ? " •" : ""}</span>
            ))}
          </div>

          {/* 3 guarantees */}
          <div style={{ display: "flex", gap: m ? 10 : 20, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            {[
              { icon: <Shield s={16}/>, text: "Paiement garanti" },
              { text: "0% impayé" },
              { text: "Sous 48h" },
            ].map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 14px" }}>
                {g.icon || <Ck s={12}/>}
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{g.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI REPORT MODAL ═══ */}
      {showReport && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.5)", backdropFilter: "blur(6px)", padding: 20 }} onClick={() => setShowReport(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, maxWidth: 560, width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", animation: "fadeUp 0.3s ease" }}>

            {/* ── Step 0: Info form ── */}
            {reportStep === 0 && (
              <div style={{ padding: m ? 24 : 36 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ fontFamily: "'Manrope'", fontSize: m ? 20 : 24, fontWeight: 800, color: "#0A1628" }}>Rapport personnalisé</div>
                    </div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#6B7280" }}>Gratuit et sans inscription</div>
                  </div>
                  <button onClick={() => setShowReport(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #D4EBE0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X s={12}/></button>
                </div>

                {/* Pre-filled from simulator */}
                <div style={{ background: "#E8F5EE", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                  <Ck s={16}/>
                  <div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#1B6B4E" }}>Données du simulateur importées</div>
                    <div style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "#4A5568" }}>CA : {simCA.toLocaleString("fr-FR")} €/mois · Plan : {simPlan === "pro" ? "Pro" : simPlan === "expert" ? "Expert" : "Essentiel"}</div>
                  </div>
                </div>

                {/* Métier */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 8 }}>Votre métier</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {["Plombier", "Électricien", "Serrurier", "Chauffagiste", "Peintre", "Maçon"].map((met, i) => (
                      <div key={i} onClick={() => setSimMetier(met)} style={{ padding: "12px 10px", borderRadius: 12, cursor: "pointer", textAlign: "center", background: simMetier === met ? "#E8F5EE" : "#F5FAF7", border: `2px solid ${simMetier === met ? "#1B6B4E" : "transparent"}`, transition: "all 0.15s" }}>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: simMetier === met ? "#1B6B4E" : "#0A1628" }}>{met}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ville */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 8 }}>Votre ville ou code postal</div>
                  <input value={simVille} onChange={e => setSimVille(e.target.value)} placeholder="Ex : Paris, Lyon 3e, 69003..."
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", outline: "none", background: "#F5FAF7", boxSizing: "border-box" }} />
                </div>

                {/* Situation */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 8 }}>Nombre de missions par mois actuellement</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["1-5", "5-10", "10-20", "20+"].map((n, i) => (
                      <div key={i} style={{ flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", textAlign: "center", background: "#F5FAF7", border: "1px solid #D4EBE0", fontFamily: "'DM Mono'", fontSize: 13, fontWeight: 600, color: "#0A1628" }}
                        onClick={e => { document.querySelectorAll("[data-missions]").forEach(el => { el.style.borderColor = "#D4EBE0"; el.style.background = "#F5FAF7"; el.style.color = "#0A1628"; }); e.currentTarget.style.borderColor = "#1B6B4E"; e.currentTarget.style.background = "#E8F5EE"; e.currentTarget.style.color = "#1B6B4E"; }}
                        data-missions={n}>{n}</div>
                    ))}
                  </div>
                </div>

                <button disabled={!simMetier || !simVille.trim()} onClick={() => {
                  setReportStep(1);
                  // Simulate AI generation with progressive steps
                  const plans = { essentiel: { abo: 0, rate: 0.10 }, pro: { abo: 49, rate: 0.07 }, expert: { abo: 99, rate: 0.05 } };
                  const sel = plans[simPlan];
                  const ess = plans.essentiel;
                  const saving = (simCA * ess.rate) - (simCA * sel.rate + sel.abo);
                  const potentialClients = Math.round(8 + Math.random() * 12);
                  const potentialCA = Math.round(simCA * (1.3 + Math.random() * 0.4));
                  const urgencyBonus = Math.round(simCA * 0.12);
                  const syndicBonus = Math.round(simCA * 0.25);
                  const bestPlan = simCA > 3000 ? (simCA > 6000 ? "Expert" : "Pro") : "Essentiel";
                  setTimeout(() => {
                    setReportData({
                      metier: simMetier, ville: simVille, ca: simCA, plan: simPlan,
                      saving: Math.max(0, saving), savingAnnual: Math.max(0, saving * 12),
                      potentialClients, potentialCA, urgencyBonus, syndicBonus, bestPlan,
                      commissionEss: simCA * ess.rate, commissionSel: simCA * sel.rate + sel.abo,
                    });
                    setReportStep(2);
                  }, 4000);
                }} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: simMetier && simVille.trim() ? "#0A4030" : "#D4EBE0", color: simMetier && simVille.trim() ? "#fff" : "#6B7280", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", cursor: simMetier && simVille.trim() ? "pointer" : "default", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Lancer l'analyse <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke={simMetier && simVille.trim() ? "#fff" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            )}

            {/* ── Step 1: AI Loading ── */}
            {reportStep === 1 && (
              <div style={{ padding: "48px 36px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid #D4EBE0", borderTopColor: "#1B6B4E", margin: "0 auto 24px", animation: "spin 0.8s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }
                  @keyframes stageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div style={{ fontFamily: "'Manrope'", fontSize: 20, fontWeight: 800, color: "#0A1628", marginBottom: 24 }}>Analyse en cours...</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 300, margin: "0 auto" }}>
                  {[
                    { label: "Analyse de votre activité", delay: "0s" },
                    { label: "Estimation du marché local", delay: "1s" },
                    { label: "Calcul des économies détaillées", delay: "2s" },
                    { label: "Génération des recommandations", delay: "3s" },
                  ].map((stage, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, animation: `stageIn 0.4s ease ${stage.delay} both` }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ck s={10}/></div>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#4A5568" }}>{stage.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: AI Results ── */}
            {reportStep === 2 && reportData && (
              <div style={{ padding: m ? 24 : 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>📊</span>
                      <div style={{ fontFamily: "'Manrope'", fontSize: m ? 18 : 22, fontWeight: 800, color: "#0A1628" }}>Votre rapport Nova</div>
                    </div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#6B7280" }}>{reportData.metier} · {reportData.ville} · {reportData.ca.toLocaleString("fr-FR")} €/mois</div>
                  </div>
                  <button onClick={() => setShowReport(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #D4EBE0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X s={12}/></button>
                </div>

                {/* KPI Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Économie mensuelle", value: `+${reportData.saving.toLocaleString("fr-FR")} €`, sub: `avec le plan ${reportData.plan === "pro" ? "Pro" : reportData.plan === "expert" ? "Expert" : "Essentiel"}`, color: "#1B6B4E", bg: "#E8F5EE" },
                    { label: "Économie annuelle", value: `+${reportData.savingAnnual.toLocaleString("fr-FR")} €`, sub: "sur 12 mois", color: "#1B6B4E", bg: "#E8F5EE" },
                    { label: "Nouveaux clients estimés", value: `+${reportData.potentialClients}`, sub: "clients/mois via Nova", color: "#0A1628", bg: "#F5FAF7" },
                    { label: "Potentiel CA mensuel", value: `${reportData.potentialCA.toLocaleString("fr-FR")} €`, sub: `vs ${reportData.ca.toLocaleString("fr-FR")} € actuel`, color: "#0A1628", bg: "#F5FAF7" },
                  ].map((kpi, i) => (
                    <div key={i} style={{ padding: "16px", borderRadius: 14, background: kpi.bg, border: "1px solid #D4EBE0" }}>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{kpi.label}</div>
                      <div style={{ fontFamily: "'Manrope'", fontSize: m ? 22 : 26, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", marginTop: 2 }}>{kpi.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Opportunities */}
                <div style={{ fontFamily: "'Manrope'", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 10 }}>Opportunités identifiées pour vous</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {[
                    { icon: "⚡", title: "Urgences rémunérées", desc: `En activant les urgences, vous pourriez gagner ~${reportData.urgencyBonus.toLocaleString("fr-FR")} € supplémentaires/mois (majoration 15-25%).`, color: "#E8302A" },
                    { icon: "🏢", title: "Partenariats syndics", desc: `Les syndics de ${reportData.ville} recherchent des ${reportData.metier.toLowerCase()}s fiables. Potentiel : ~${reportData.syndicBonus.toLocaleString("fr-FR")} €/mois de CA récurrent.`, color: "#1B6B4E" },
                    { icon: "📈", title: "Visibilité boostée", desc: `En tant que ${reportData.metier.toLowerCase()} certifié Nova à ${reportData.ville}, vous apparaîtrez en priorité dans les recherches locales.`, color: "#F5A623" },
                  ].map((opp, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 12, background: "#F5FAF7", border: "1px solid #D4EBE0" }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{opp.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 700, color: "#0A1628", marginBottom: 2 }}>{opp.title}</div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>{opp.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Recommendation */}
                <div style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)", borderRadius: 16, padding: m ? 20 : 24, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 600, color: "#8ECFB0" }}>Notre recommandation</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.7 }}>
                    Pour un {reportData.metier.toLowerCase()} à {reportData.ville} avec un CA de {reportData.ca.toLocaleString("fr-FR")} €/mois, le plan <strong style={{ color: "#fff" }}>{reportData.bestPlan}</strong> est le plus adapté.
                    {reportData.bestPlan !== "Essentiel" ? ` Vous économiseriez ${reportData.saving.toLocaleString("fr-FR")} €/mois par rapport au plan Essentiel, soit ${reportData.savingAnnual.toLocaleString("fr-FR")} € par an.` : " Commencez gratuitement et passez au plan Pro quand votre CA dépasse 1 633 €/mois."}
                    {" "}En combinant les urgences et les partenariats syndics, votre CA pourrait atteindre {reportData.potentialCA.toLocaleString("fr-FR")} €/mois.
                  </div>
                </div>

                {/* CTA — Login gate */}
                <div style={{ background: "#F5FAF7", borderRadius: 14, padding: "18px 20px", border: "1px solid #D4EBE0", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Manrope'", fontSize: 16, fontWeight: 800, color: "#0A1628", marginBottom: 6 }}>Obtenir ces résultats</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#6B7280", marginBottom: 16 }}>Inscrivez-vous pour recevoir ce rapport par email et commencer à recevoir des clients.</div>
                  <button onClick={() => { setShowReport(false); setShowSignup(true); setSignupStep(0); }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    S'inscrire gratuitement — 1er mois Expert offert <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", marginTop: 10 }}>30 secondes • Sans carte bancaire • Sans engagement</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ SIGNUP MODAL ═══ */}
      {showSignup && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.5)", backdropFilter: "blur(6px)", padding: 20 }} onClick={() => setShowSignup(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, maxWidth: 480, width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", animation: "fadeUp 0.3s ease" }}>

            {/* ── Step 0: Email + Password ── */}
            {signupStep === 0 && (
              <div style={{ padding: m ? 24 : 36 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "'Manrope'", fontSize: m ? 22 : 26, fontWeight: 800, color: "#0A1628", marginBottom: 4 }}>Créer votre compte artisan</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#6B7280" }}>Gratuit — 1er mois du forfait Expert offert</div>
                  </div>
                  <button onClick={() => setShowSignup(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #D4EBE0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X s={12}/></button>
                </div>

                {/* Offer */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#E8F5EE", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
                  <span style={{ fontSize: 16 }}>🎁</span>
                  <div><div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#1B6B4E" }}>1 mois du forfait Expert offert</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#4A5568" }}>Commission à 5% au lieu de 10-15% — offert à l'inscription</div></div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>Email professionnel</div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", background: "#F5FAF7", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#1B6B4E"} onBlur={e => e.currentTarget.style.borderColor = "#D4EBE0"} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>Mot de passe</div>
                  <div style={{ position: "relative" }}>
                    <input type={showPass ? "text" : "password"} value={signupPass} onChange={e => setSignupPass(e.target.value)} placeholder="Minimum 8 caractères"
                      style={{ width: "100%", padding: "12px 16px", paddingRight: 44, borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", background: "#F5FAF7", outline: "none", boxSizing: "border-box" }}
                      onFocus={e => e.currentTarget.style.borderColor = "#1B6B4E"} onBlur={e => e.currentTarget.style.borderColor = "#D4EBE0"} />
                    <div onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d={showPass ? "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" : "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94m6.72-1.07a3 3 0 11-4.24-4.24"} stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>{showPass && <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="1.5"/>}{!showPass && <path d="M1 1l22 22" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>}</svg>
                    </div>
                  </div>
                  {signupPass && (
                    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: signupPass.length >= i * 3 ? (signupPass.length >= 10 ? "#22C88A" : "#F5A623") : "#D4EBE0", transition: "all 0.2s" }}/>)}
                    </div>
                  )}
                </div>

                <button disabled={!email.includes("@") || signupPass.length < 8} onClick={() => setSignupStep(1)}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: email.includes("@") && signupPass.length >= 8 ? "#0A4030" : "#D4EBE0", color: email.includes("@") && signupPass.length >= 8 ? "#fff" : "#6B7280", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", cursor: email.includes("@") && signupPass.length >= 8 ? "pointer" : "default", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Continuer <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke={email.includes("@") && signupPass.length >= 8 ? "#fff" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: i === 0 ? 20 : 8, height: 4, borderRadius: 2, background: i === 0 ? "#1B6B4E" : "#D4EBE0" }}/>)}
                </div>
              </div>
            )}

            {/* ── Step 1: Informations ── */}
            {signupStep === 1 && (
              <div style={{ padding: m ? 24 : 36, animation: "fadeUp 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <button onClick={() => setSignupStep(0)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #D4EBE0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div style={{ fontFamily: "'Manrope'", fontSize: m ? 20 : 24, fontWeight: 800, color: "#0A1628" }}>Vos informations</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 0 }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>Prénom</div>
                    <input value={signupPrenom} onChange={e => setSignupPrenom(e.target.value)} placeholder="Jean"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", background: "#F5FAF7", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>Nom</div>
                    <input value={signupNom} onChange={e => setSignupNom(e.target.value)} placeholder="Dupont"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", background: "#F5FAF7", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>Téléphone</div>
                  <input type="tel" value={signupTel} onChange={e => setSignupTel(e.target.value)} placeholder="06 12 34 56 78"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", background: "#F5FAF7", outline: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>Métier</div>
                  <select value={metier} onChange={e => setMetier(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: metier ? "#0A1628" : "#6B7280", background: "#F5FAF7", outline: "none", boxSizing: "border-box", appearance: "none" }}>
                    <option value="">Sélectionner votre métier</option>
                    {["Plombier", "Électricien", "Serrurier", "Chauffagiste", "Peintre", "Maçon", "Autre"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 0 }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>Ville</div>
                    <input value={ville} onChange={e => setVille(e.target.value)} placeholder="Paris, Lyon..."
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", background: "#F5FAF7", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>N° SIRET</div>
                    <input value={signupSiret} onChange={e => setSignupSiret(e.target.value)} placeholder="123 456 789 00012"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", background: "#F5FAF7", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>

                {/* CGU */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, marginTop: 4 }}>
                  <div onClick={() => setAcceptCGU(!acceptCGU)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${acceptCGU ? "#1B6B4E" : "#D4EBE0"}`, background: acceptCGU ? "#1B6B4E" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}>
                    {acceptCGU && <Ck s={12}/>}
                  </div>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>
                    J'accepte les <span style={{ color: "#1B6B4E", fontWeight: 600 }}>Conditions Générales</span> et la <span style={{ color: "#1B6B4E", fontWeight: 600 }}>Politique de Confidentialité</span>
                  </span>
                </div>

                <button disabled={!signupPrenom || !signupNom || !signupTel || !metier || !ville || !signupSiret || !acceptCGU} onClick={() => setSignupStep(2)}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: signupPrenom && signupNom && signupTel && metier && ville && signupSiret && acceptCGU ? "#0A4030" : "#D4EBE0", color: signupPrenom && signupNom && signupTel && metier && ville && signupSiret && acceptCGU ? "#fff" : "#6B7280", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", cursor: signupPrenom && signupNom && signupTel && metier && ville && signupSiret && acceptCGU ? "pointer" : "default", transition: "all 0.2s" }}>
                  Continuer
                </button>

                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: i <= 1 ? 20 : 8, height: 4, borderRadius: 2, background: i <= 1 ? "#1B6B4E" : "#D4EBE0" }}/>)}
                </div>
              </div>
            )}

            {/* ── Step 2: Documents ── */}
            {signupStep === 2 && (
              <div style={{ padding: m ? 24 : 36, animation: "fadeUp 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <button onClick={() => setSignupStep(1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #D4EBE0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div>
                    <div style={{ fontFamily: "'Manrope'", fontSize: m ? 20 : 24, fontWeight: 800, color: "#0A1628" }}>Vos documents</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#6B7280" }}>Nécessaires pour la vérification de votre profil</div>
                  </div>
                </div>

                {/* Obligatoires */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8302A" }}/>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 700, color: "#0A1628" }}>Documents obligatoires</span>
                  </div>
                  {[
                    { key: "siret", label: "Extrait SIRET / Avis de situation INSEE", desc: "Justificatif d'immatriculation de votre entreprise", format: "PDF, JPG — max 5 Mo" },
                    { key: "decennale", label: "Attestation d'assurance décennale", desc: "En cours de validité — document émis par votre assureur", format: "PDF, JPG — max 5 Mo" },
                    { key: "identite", label: "Pièce d'identité", desc: "CNI, passeport ou titre de séjour en cours de validité", format: "PDF, JPG — max 5 Mo" },
                  ].map((doc, i) => (
                    <div key={doc.key} onClick={() => setDocs(d => ({ ...d, [doc.key]: !d[doc.key] }))}
                      style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 14, background: docs[doc.key] ? "#E8F5EE" : "#F5FAF7", border: `1.5px solid ${docs[doc.key] ? "#1B6B4E" : "#D4EBE0"}`, marginBottom: 8, cursor: "pointer", transition: "all 0.15s", alignItems: "center" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: docs[doc.key] ? "#1B6B4E" : "#fff", border: docs[doc.key] ? "none" : "1.5px dashed #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                        {docs[doc.key]
                          ? <Ck s={16}/>
                          : <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/></svg>
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: "#0A1628" }}>{doc.label}</div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>{doc.desc}</div>
                        <div style={{ fontFamily: "'DM Mono'", fontSize: 9, color: "#6B7280", marginTop: 3 }}>{doc.format}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Facultatifs */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6B7280" }}/>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 700, color: "#0A1628" }}>Documents facultatifs</span>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#6B7280" }}>— accélèrent la vérification</span>
                  </div>
                  {[
                    { key: "rge", label: "Certification RGE", desc: "Si vous intervenez en rénovation énergétique", format: "PDF, JPG — max 5 Mo" },
                    { key: "qualibat", label: "Certification Qualibat", desc: "Certification de qualification professionnelle", format: "PDF, JPG — max 5 Mo" },
                    { key: "kbis", label: "Extrait Kbis", desc: "Moins de 3 mois — pour les sociétés (SARL, SAS...)", format: "PDF, JPG — max 5 Mo" },
                  ].map((doc, i) => (
                    <div key={doc.key} onClick={() => setDocs(d => ({ ...d, [doc.key]: !d[doc.key] }))}
                      style={{ display: "flex", gap: 14, padding: "12px 16px", borderRadius: 14, background: docs[doc.key] ? "#E8F5EE" : "#fff", border: `1.5px solid ${docs[doc.key] ? "#1B6B4E" : "#D4EBE0"}`, marginBottom: 8, cursor: "pointer", transition: "all 0.15s", alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: docs[doc.key] ? "#1B6B4E" : "#fff", border: docs[doc.key] ? "none" : "1.5px dashed #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                        {docs[doc.key]
                          ? <Ck s={14}/>
                          : <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#D4EBE0" strokeWidth="2" strokeLinecap="round"/></svg>
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#0A1628" }}>{doc.label}</div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#6B7280" }}>{doc.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress indicator */}
                <div style={{ background: "#F5FAF7", borderRadius: 10, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontFamily: "'DM Mono'", fontSize: 13, fontWeight: 700, color: docs.siret && docs.decennale && docs.identite ? "#22C88A" : "#F5A623" }}>
                    {[docs.siret, docs.decennale, docs.identite].filter(Boolean).length}/3
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, color: "#0A1628" }}>
                      {docs.siret && docs.decennale && docs.identite ? "Tous les documents obligatoires sont prêts" : "Documents obligatoires requis"}
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: "#D4EBE0", marginTop: 4 }}>
                      <div style={{ height: 3, borderRadius: 2, background: docs.siret && docs.decennale && docs.identite ? "#22C88A" : "#F5A623", width: `${([docs.siret, docs.decennale, docs.identite].filter(Boolean).length / 3) * 100}%`, transition: "width 0.3s" }}/>
                    </div>
                  </div>
                </div>

                <button disabled={!docs.siret || !docs.decennale || !docs.identite} onClick={() => { setSignupStep(3); setCount(c => c + 1); }}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: docs.siret && docs.decennale && docs.identite ? "#0A4030" : "#D4EBE0", color: docs.siret && docs.decennale && docs.identite ? "#fff" : "#6B7280", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", cursor: docs.siret && docs.decennale && docs.identite ? "pointer" : "default", transition: "all 0.2s" }}>
                  Créer mon compte artisan
                </button>

                <button onClick={() => { setSignupStep(3); setCount(c => c + 1); }}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "transparent", color: "#6B7280", fontSize: 12, fontFamily: "'DM Sans'", cursor: "pointer", marginTop: 8 }}>
                  Envoyer les documents plus tard
                </button>

                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: i <= 2 ? 20 : 8, height: 4, borderRadius: 2, background: i <= 2 ? "#1B6B4E" : "#D4EBE0" }}/>)}
                </div>
              </div>
            )}

            {/* ── Step 3: Confirmation + Timeline ── */}
            {signupStep === 3 && (
              <div style={{ padding: m ? 24 : 36, textAlign: "center", animation: "fadeUp 0.5s ease" }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Ck s={28}/>
                </div>
                <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 22 : 26, fontWeight: 800, color: "#0A1628", marginBottom: 6 }}>
                  Bienvenue{signupPrenom ? `, ${signupPrenom}` : ""} !
                </h2>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 24 }}>
                  {docs.siret && docs.decennale && docs.identite
                    ? "Votre compte et vos documents ont été envoyés. Voici la suite :"
                    : "Votre inscription est enregistrée. Envoyez vos documents pour accélérer la vérification."
                  }
                </p>

                {/* Post-inscription timeline */}
                <div style={{ textAlign: "left", maxWidth: 320, margin: "0 auto 24px" }}>
                  {[
                    { label: "Inscription", desc: "C'est fait !", done: true },
                    { label: "Documents envoyés", desc: docs.siret && docs.decennale && docs.identite ? `${[docs.siret, docs.decennale, docs.identite, docs.rge, docs.qualibat, docs.kbis].filter(Boolean).length} documents transmis` : "À compléter par email", done: docs.siret && docs.decennale && docs.identite },
                    { label: "Vérification Nova", desc: "Notre équipe vérifie — 48 à 72h", done: false },
                    { label: "Premier client", desc: "Demandes dans votre zone", done: false },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.done ? "#1B6B4E" : "#E8F5EE", border: s.done ? "none" : "2px solid #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {s.done ? <Ck s={10}/> : <span style={{ fontFamily: "'DM Mono'", fontSize: 9, fontWeight: 700, color: "#6B7280" }}>{i + 1}</span>}
                        </div>
                        {i < 3 && <div style={{ width: 2, height: 28, background: s.done ? "#1B6B4E" : "#D4EBE0" }}/>}
                      </div>
                      <div style={{ paddingBottom: i < 3 ? 12 : 0, paddingTop: 1 }}>
                        <div style={{ fontFamily: "'Manrope'", fontSize: 12, fontWeight: 700, color: s.done ? "#1B6B4E" : "#0A1628" }}>{s.label}</div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280" }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
                  {["1er mois Expert offert", "Paiement garanti", "0% d'impayés"].map(t => (
                    <span key={t} style={{ padding: "5px 12px", borderRadius: 8, background: "#E8F5EE", fontSize: 11, fontWeight: 600, color: "#14523B" }}>{t}</span>
                  ))}
                </div>

                <button onClick={() => setShowSignup(false)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", cursor: "pointer" }}>
                  {docs.siret && docs.decennale && docs.identite ? "C'est compris" : "Fermer — j'enverrai mes documents par email"}
                </button>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#6B7280", marginTop: 12 }}>Un email avec les instructions a été envoyé à {email}</p>

                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: 20, height: 4, borderRadius: 2, background: "#1B6B4E" }}/>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ━━━ FOOTER ━━━ */}
      <footer role="contentinfo" style={{ padding: `${m ? "28px 20px 90px" : "48px"} ${m ? "" : px}`, background: "#F5FAF7", borderTop: "1px solid rgba(27,107,78,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "flex", flexDirection: m ? "column" : "row",
            justifyContent: "space-between", alignItems: "center",
            gap: m ? 12 : 16, textAlign: "center", marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Shield s={18}/><span style={{ fontFamily: "'Manrope'", fontSize: 15, fontWeight: 800 }}>Nova</span>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Conditions", "Confidentialité", "Contact"].map(l => (
                <span key={l} style={{ fontSize: 12, color: "#6B7280", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#7EA894" }}>© 2026 Nova SAS</span>
          </div>
          {/* SEO footer text — keywords for crawlers */}
          <p style={{ fontSize: 10, color: "#B0C4B8", textAlign: "center", lineHeight: 1.6, maxWidth: 600, margin: "0 auto" }}>
            Nova est une plateforme de mise en relation entre artisans certifiés et particuliers en France. Paiement sécurisé par séquestre, vérification SIRET et assurance décennale, gestion des interventions et devis en ligne. Solution contre les impayés pour plombiers, électriciens, serruriers, chauffagistes, peintres et maçons.
          </p>
        </div>
      </footer>

      {/* Noscript fallback for SEO */}
      <noscript>
        <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
          <h1>Nova — Plateforme artisan avec paiement garanti par séquestre</h1>
          <p>0% d'impayés. Vos clients paient avant l'intervention. Inscription gratuite pour les artisans : plombiers, électriciens, serruriers, chauffagistes. Paiement garanti sous 48h. Vérification SIRET et assurance décennale obligatoire.</p>
          <p>1er mois du forfait Expert offert. Simulateur d'économies en ligne. Rapport personnalisé gratuit.</p>
          <h2>Questions fréquentes</h2>
          <p><strong>Combien coûte Nova ?</strong> Inscription gratuite. 5% de commission le 1er mois puis 10-15%.</p>
          <p><strong>Comment fonctionne le séquestre ?</strong> Le client paie sur un compte sécurisé. Vous intervenez. Nova valide. Paiement sous 48h.</p>
          <p><strong>Quels documents fournir ?</strong> SIRET, attestation décennale, pièce d'identité.</p>
        </div>
      </noscript>

      {/* STICKY CTA MOBILE */}
      {m && scrollY > 500 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)",
          borderTop: "1px solid #D4EBE0",
          padding: "10px 16px", paddingBottom: "max(10px, env(safe-area-inset-bottom))",
          display: "flex", alignItems: "center", gap: 10,
          animation: "fadeUp 0.3s ease",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 700, color: "#0A1628" }}>0 impayé, paiement garanti</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#6B7280" }}>Gratuit · 1er mois Expert offert</div>
          </div>
          <button onClick={() => { setShowSignup(true); setSignupStep(0); setSignupPass(""); setSignupNom(""); setSignupPrenom(""); setSignupTel(""); setSignupSiret(""); setAcceptCGU(false); }} style={{ padding: "10px 20px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, fontFamily: "'Manrope'", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            S'inscrire <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
