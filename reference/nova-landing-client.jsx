import { useState, useEffect, useRef } from "react";

export default function NovaLandingClient() {
  const [visible, setVisible] = useState({});
  const [m, setM] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [heroStep, setHeroStep] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [phoneScreen, setPhoneScreen] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchStep, setSearchStep] = useState(0); // 0=form, 1=describe, 2=loading, 3=results
  const [searchCat, setSearchCat] = useState("");
  const [searchVille, setSearchVille] = useState("");
  const [searchDesc, setSearchDesc] = useState("");
  const [searchPhotos, setSearchPhotos] = useState(0);
  const [geoLoading, setGeoLoading] = useState(false);

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
    const t = setInterval(() => setHeroStep(s => (s + 1) % 3), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveStory(s => (s + 1) % 3), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPhoneScreen(s => (s + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);

  const anim = (id) => ({ id, "data-anim": "1", style: { opacity: visible[id] ? 1 : 0, transform: visible[id] ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease, transform 0.7s ease" } });
  const px = m ? "20px" : "5%";
  const heroWords = ["un plombier", "un électricien", "un serrurier"];

  const Shield = ({ s = 28 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#1B6B4E" opacity=".15"/><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="#1B6B4E" strokeWidth="1.5" fill="none"/><path d="M9 12l2 2 4-4" stroke="#1B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const Ck = ({ c = "#1B6B4E" }) => <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const Xx = ({ c = "#E8302A" }) => <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>;
  const Star = ({ c = "#F5A623" }) => <svg width={16} height={16} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={c}/></svg>;
  const Arr = ({ c = "#fff" }) => <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const Qt = ({ c = "#D4EBE0" }) => <svg width={28} height={28} viewBox="0 0 24 24" fill={c}><path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/></svg>;

  const AnimNum = ({ target, suffix = "" }) => {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { let sT = Date.now(); const tick = () => { const p = Math.min((Date.now() - sT) / 1500, 1); setVal(Math.floor(p * target)); if (p < 1) requestAnimationFrame(tick); }; tick(); obs.disconnect(); }
      }, { threshold: 0.3 });
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, [target]);
    return <span ref={ref}>{val.toLocaleString("fr-FR")}{suffix}</span>;
  };

  const categories = [
    { name: "Plomberie", icon: "01", desc: "Fuites, robinetterie, chauffe-eau" },
    { name: "Électricité", icon: "02", desc: "Tableaux, prises, dépannage" },
    { name: "Serrurerie", icon: "03", desc: "Ouverture, blindage, cylindres" },
    { name: "Chauffage", icon: "04", desc: "Chaudières, radiateurs, PAC" },
    { name: "Peinture", icon: "05", desc: "Intérieur, extérieur, enduits" },
    { name: "Maçonnerie", icon: "06", desc: "Murs, terrasses, rénovation" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#0A1628", background: "#F5FAF7", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; transition: transform 120ms ease; }
        button:active { transform: scale(0.97); }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes floatSlow { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(27,107,78,0.3); } 50% { box-shadow: 0 0 0 14px rgba(27,107,78,0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        details summary::-webkit-details-marker { display: none; }
        details summary { list-style: none; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(245,250,247,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(27,107,78,0.06)", padding: `0 ${px}`, height: m ? 56 : 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none" }}>
          <Shield s={m ? 24 : 28}/><span style={{ fontFamily: "'Manrope'", fontSize: m ? 18 : 20, fontWeight: 800, color: "#0A1628" }}>Nova</span>
        </button>
        {!m && <div style={{ display: "flex", gap: 6 }}>
          {[{ l: "Démo", t: "s-demo" },{ l: "Comment ça marche", t: "s-how" },{ l: "Garanties", t: "s-trust" },{ l: "FAQ", t: "s-faq" }].map((lk, i) => (
            <button key={i} onClick={() => document.getElementById(lk.t)?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#4A5568", background: "transparent", border: "none", fontFamily: "'DM Sans'" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#E8F5EE"; e.currentTarget.style.color = "#1B6B4E"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4A5568"; }}
            >{lk.l}</button>
          ))}
        </div>}
        <button onClick={() => { setShowSearch(true); setSearchStep(0); setSearchCat(""); setSearchVille(""); setSearchDesc(""); setSearchPhotos(0); }} style={{ padding: m ? "7px 16px" : "8px 20px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 600 }}>Trouver un artisan</button>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: m ? 80 : 0, background: "#F5FAF7", position: "relative", overflow: "hidden" }}>
        {/* ── Decorative background ── */}
        {/* Large gradient blob top-right */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "50%", height: "80%", background: "radial-gradient(ellipse, rgba(27,107,78,0.07), transparent 70%)", pointerEvents: "none" }} />
        {/* Warm blob bottom-left */}
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: "40%", height: "60%", background: "radial-gradient(ellipse, rgba(45,155,110,0.05), transparent 70%)", pointerEvents: "none" }} />
        {/* Grid pattern */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #1B6B4E 1px, transparent 0)", backgroundSize: "36px 36px", pointerEvents: "none" }} />

        {/* ── Parallax contextual icons ── */}
        {!m && <>
          <svg width={90} height={90} viewBox="0 0 24 24" fill="none" style={{ position: "absolute", top: `calc(5% + ${scrollY * 0.1}px)`, right: "8%", opacity: 0.07, zIndex: 0 }}>
            <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#1B6B4E"/>
            <path d="M9 12l2 2 4-4" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
          </svg>
          <svg width={65} height={65} viewBox="0 0 24 24" fill="none" style={{ position: "absolute", top: `calc(60% + ${scrollY * 0.15}px)`, right: "12%", opacity: 0.06, zIndex: 0, transform: `rotate(${-25 + scrollY * 0.02}deg)` }}>
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" fill="#1B6B4E"/>
          </svg>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="#F5A623" style={{ position: "absolute", top: `calc(15% + ${scrollY * 0.22}px)`, left: "6%", opacity: 0.12, zIndex: 0, transform: `rotate(${scrollY * 0.04}deg)` }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <svg width={50} height={50} viewBox="0 0 24 24" fill="none" style={{ position: "absolute", top: `calc(75% + ${scrollY * 0.08}px)`, left: "5%", opacity: 0.06, zIndex: 0 }}>
            <rect x="5" y="11" width="14" height="10" rx="2" fill="#1B6B4E"/>
            <path d="M8 11V7a4 4 0 118 0v4" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          </svg>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="#F5A623" style={{ position: "absolute", top: `calc(40% + ${scrollY * 0.18}px)`, left: "10%", opacity: 0.1, zIndex: 0, transform: `rotate(${-scrollY * 0.03}deg)` }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" style={{ position: "absolute", top: `calc(30% + ${scrollY * 0.12}px)`, right: "4%", opacity: 0.06, zIndex: 0 }}>
            <circle cx="12" cy="12" r="10" fill="#1B6B4E"/>
            <path d="M8 12l2.5 2.5L16 9" stroke="#F5FAF7" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <svg width={70} height={70} viewBox="0 0 24 24" fill="#1B6B4E" style={{ position: "absolute", top: `calc(85% + ${scrollY * 0.06}px)`, right: "35%", opacity: 0.04, zIndex: 0 }}>
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2"/>
          </svg>
        </>}

        {/* ── Top section: badges + title + subtitle + CTAs ── */}
        <div style={{ maxWidth: 700, margin: "0 auto", padding: `${m ? 36 : 100}px ${px} ${m ? 24 : 40}px`, textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Double badge */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 14, animation: "fadeSlide 0.6s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8F5EE", borderRadius: 20, padding: "5px 14px 5px 8px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#1B6B4E" strokeWidth="2"/><path d="M8 11V7a4 4 0 118 0v4" stroke="#1B6B4E" strokeWidth="2" strokeLinecap="round"/></svg>
              <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 600, color: "#1B6B4E" }}>Paiement 100% sécurisé</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 20, padding: "5px 14px 5px 8px", border: "1px solid #D4EBE0" }}>
              <span style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 800, color: "#1B6B4E" }}>0€</span>
              <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 600, color: "#4A5568" }}>Gratuit pour les particuliers</span>
            </div>
          </div>
          {/* Offer banner */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #0A4030, #1B6B4E)", borderRadius: 10, padding: "7px 16px", marginBottom: 22, animation: "fadeSlide 0.6s ease 0.15s both" }}>
            <span style={{ fontSize: 14 }}>🎁</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#fff" }}>1er déplacement offert à l'inscription</span>
          </div>
          <h1 style={{ fontFamily: "'Manrope'", fontSize: m ? 32 : 50, fontWeight: 800, color: "#0A1628", lineHeight: 1.12, marginBottom: 16 }}>
            Vous cherchez<br/><span key={heroStep} style={{ color: "#1B6B4E", display: "inline-block", animation: "fadeIn 0.5s ease" }}>{heroWords[heroStep]}</span> de confiance ?
          </h1>
          <p style={{ fontFamily: "'DM Sans'", fontSize: m ? 15 : 18, color: "#4A5568", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 28px" }}>Artisans vérifiés SIRET + décennale. Paiement bloqué en séquestre. L'artisan n'est payé qu'après validation par Nova.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <button onClick={() => { setShowSearch(true); setSearchStep(0); setSearchCat(""); setSearchVille(""); setSearchDesc(""); setSearchPhotos(0); }} style={{ padding: "14px 32px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", display: "flex", alignItems: "center", gap: 8 }}>Trouver un artisan <Arr /></button>
            <button onClick={() => document.getElementById("s-how")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "14px 28px", borderRadius: 12, background: "#fff", color: "#0A1628", border: "1px solid #D4EBE0", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans'" }}>Comment ça marche</button>
          </div>
          {/* Trust micro-pills + activity */}
          <div style={{ display: "flex", gap: m ? 10 : 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: <Shield s={14} />, text: "Artisans vérifiés" },
              { icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#1B6B4E" strokeWidth="2"/><path d="M8 11V7a4 4 0 118 0v4" stroke="#1B6B4E" strokeWidth="2" strokeLinecap="round"/></svg>, text: "Séquestre sécurisé" },
              { icon: <Ck c="#1B6B4E" />, text: "Sans carte bancaire" },
              { icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#1B6B4E" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#1B6B4E" strokeWidth="2" strokeLinecap="round"/></svg>, text: "Inscription 30 sec" },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, animation: `fadeSlide 0.5s ease ${0.3+i*0.1}s both` }}>
                {p.icon}
                <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3", fontWeight: 500 }}>{p.text}</span>
              </div>
            ))}
          </div>
          {/* Soft urgency — activity indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, animation: "fadeSlide 0.5s ease 0.8s both" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C88A", animation: "dotPulse 2s infinite" }} />
            <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>14 interventions réalisées aujourd'hui</span>
          </div>
        </div>

        {/* ── Storytelling before/after — the main visual ── */}
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: `0 ${px} ${m ? 48 : 80}px`, position: "relative", zIndex: 1 }}>
          {/* Section divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ height: 1, flex: 1, background: "#D4EBE0" }} />
            <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "#8A95A3", letterSpacing: 1.5, textTransform: "uppercase" }}>Avant vs Avec Nova</span>
            <div style={{ height: 1, flex: 1, background: "#D4EBE0" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 0, borderRadius: 24, overflow: "hidden", boxShadow: "0 12px 48px rgba(10,64,48,0.08)", border: "1px solid #D4EBE0" }}>
            {/* AVANT — warm white with subtle red tint */}
            <div style={{ background: "#FFFBFB", padding: m ? 24 : 32, position: "relative", borderRight: m ? "none" : "1px solid #D4EBE0", borderBottom: m ? "1px solid #D4EBE0" : "none" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: m ? "100%" : 4, height: m ? 4 : "100%", background: "linear-gradient(to bottom, #E8302A, #F5841F)" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#E8302A", boxShadow: "0 0 8px rgba(232,48,42,0.3)", animation: "dotPulse 2s infinite" }} />
                <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 700, color: "#E8302A", letterSpacing: 1.5, textTransform: "uppercase" }}>Sans Nova</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <button key={i} onClick={() => setActiveStory(i)} style={{ width: activeStory === i ? 20 : 7, height: 7, borderRadius: 4, border: "none", background: activeStory === i ? "#E8302A" : "#D4EBE0", transition: "all 0.3s" }} />)}
                </div>
              </div>

              {[
                { name: "Laurent P.", city: "Bordeaux", cat: "Plomberie", init: "LP", amount: "200€ perdus", text: "Plombier trouvé sur un site d'annonces. 200\u20AC d'avance en liquide. Le lendemain, la fuite avait repris. Numéro coupé. Plus personne." },
                { name: "Marine K.", city: "Paris 9e", cat: "Serrurerie", init: "MK", amount: "650€ pour 3 min", text: "Serrurier Google : 89\u20AC au téléphone. Sur place : 650\u20AC. Enfermée dehors, pas le choix. Il ouvre en 3 minutes avec un outil basique." },
                { name: "Fabien R.", city: "Lyon", cat: "Électricité", init: "FR", amount: "4 800€ à refaire", text: "\"Électricien\" sans décennale. Tableau refait. 3 mois plus tard : court-circuit. Installation non conforme aux normes. Tout à refaire." },
              ].map((story, i) => (
                <div key={i} style={{ display: activeStory === i ? "block" : "none", animation: "fadeIn 0.4s ease" }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: m ? 15 : 17, color: "#0A1628", lineHeight: 1.75, marginBottom: 20, minHeight: m ? "auto" : 100 }}>"{story.text}"</div>
                  <div style={{ background: "#FDE8E8", borderRadius: 10, padding: "10px 16px", marginBottom: 18, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Xx />
                    <span style={{ fontFamily: "'Manrope'", fontSize: 15, fontWeight: 800, color: "#E8302A" }}>{story.amount}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FDE8E8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 600, color: "#E8302A" }}>{story.init}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: "#0A1628" }}>{story.name}</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>{story.city} — {story.cat}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F0E0E0" }}>
                {["Aucune vérification", "Paiement sans garantie", "Zéro recours possible"].map((t, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: j < 2 ? 7 : 0 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: "#FDE8E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Xx /></div>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8A95A3" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* APRÈS — green tinted white */}
            <div style={{ background: "#F5FAF7", padding: m ? 24 : 32, position: "relative" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: m ? "100%" : 4, height: m ? 4 : "100%", background: "linear-gradient(to bottom, #1B6B4E, #22C88A)" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C88A", boxShadow: "0 0 8px rgba(34,200,138,0.3)" }} />
                <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 700, color: "#1B6B4E", letterSpacing: 1.5, textTransform: "uppercase" }}>Avec Nova</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Star key={i} />)}</div>
              </div>

              {[
                { name: "Sophie M.", city: "Paris 15e", cat: "Plomberie urgente", init: "SM", amount: "380€ — prix juste, validé", text: "Fuite d'eau un dimanche soir. Plombier trouvé en 10 min. Arrivé en 45 min. Tout réparé proprement. J'ai payé uniquement quand Nova a confirmé que le travail était conforme." },
                { name: "Claire D.", city: "Paris 11e", cat: "Serrurerie", init: "CD", amount: "195€ — tarif transparent", text: "Porte claquée à 22h. Serrurier trouvé en 15 min sur Nova. Il était là en 30 min. Et surtout, le prix correspondait au devis fait sur place. Pas un euro de plus." },
                { name: "Thomas G.", city: "Lyon 3e", cat: "Électricité", init: "TG", amount: "1 450€ — devis respecté", text: "Tableau électrique à refaire. L'artisan est venu, a fait le devis devant moi, et a tout refait en une journée. Nova a vérifié avant de le payer. La tranquillité totale." },
              ].map((story, i) => (
                <div key={i} style={{ display: activeStory === i ? "block" : "none", animation: "fadeIn 0.4s ease" }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: m ? 15 : 17, color: "#0A1628", lineHeight: 1.75, marginBottom: 20, minHeight: m ? "auto" : 100 }}>"{story.text}"</div>

                  <div style={{ background: "#E8F5EE", borderRadius: 10, padding: "10px 16px", marginBottom: 18, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Ck c="#1B6B4E" />
                    <span style={{ fontFamily: "'Manrope'", fontSize: 15, fontWeight: 800, color: "#1B6B4E" }}>{story.amount}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1B6B4E, #2D9B6E)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 600, color: "#fff" }}>{story.init}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: "#0A1628" }}>{story.name}</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>{story.city} — {story.cat}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #D4EBE0" }}>
                {["Artisan certifié SIRET + décennale", "Devis fait sur place, pas au téléphone", "Paiement séquestre — vous ne risquez rien"].map((t, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: j < 2 ? 7 : 0 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ck c="#1B6B4E" /></div>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#4A5568" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", gap: m ? 12 : 24, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            {[
              { v: "1 200+", l: "artisans vérifiés" },
              { v: "4.7/5", l: "satisfaction" },
              { v: "0", l: "arnaque" },
              { v: "45 min", l: "délai urgence" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, animation: `fadeSlide 0.5s ease ${0.3 + i * 0.1}s both` }}>
                <span style={{ fontFamily: "'Manrope'", fontSize: 16, fontWeight: 800, color: "#0A4030" }}>{s.v}</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8A95A3" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANT / APRÈS */}
      <section style={{ padding: `${m ? 48 : 80}px ${px}`, background: "#F5FAF7", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(27,107,78,0.03), transparent 70%)" }} />
        <div {...anim("ba")} style={{ ...anim("ba").style, maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 28 : 40 }}>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#1B6B4E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Comparatif</div>
            <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 24 : 34, fontWeight: 800, lineHeight: 1.2 }}>La différence est claire</h2>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr", gap: 0, marginBottom: 4 }}>
            {!m && <div />}
            <div style={{ padding: "14px 20px", background: "#FDE8E8", borderRadius: "12px 0 0 0", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 700, color: "#E8302A", letterSpacing: 1, textTransform: "uppercase" }}>Sans Nova</div>
            </div>
            <div style={{ padding: "14px 20px", background: "#0A4030", borderRadius: "0 12px 0 0", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>Avec Nova</div>
            </div>
          </div>

          {/* Rows */}
          {[
            { label: "Trouver un artisan", sans: "Au hasard sur Google ou bouche-à-oreille", avec: "Artisans certifiés : SIRET, décennale, qualifications" },
            { label: "Vérification", sans: "Aucune — vous faites confiance aveuglément", avec: "Documents analysés par IA + équipe Nova" },
            { label: "Le devis", sans: "Annoncé au téléphone, gonflé sur place", avec: "Fait sur place, devant vous, sans surprise" },
            { label: "Le paiement", sans: "En liquide ou virement direct — aucune garantie", avec: "Séquestre sécurisé — l'artisan n'est payé qu'après validation" },
            { label: "Si ça se passe mal", sans: "Aucun recours, artisan injoignable", avec: "Nova arbitre avec preuves (photos, devis signé)" },
            { label: "Les avis", sans: "Invérifiables, achetés, parfois faux", avec: "100% liés à une mission réelle et un paiement" },
            { label: "En urgence", sans: "Vous prenez le premier venu, dans la panique", avec: "Artisan vérifié en 45 min, paiement toujours sécurisé" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr", gap: 0,
              background: i % 2 === 0 ? "#fff" : "#F5FAF7",
              borderBottom: i < 6 ? "1px solid #D4EBE0" : "none",
              borderRadius: i === 6 ? "0 0 12px 12px" : 0,
              overflow: "hidden",
              opacity: visible["ba"] ? 1 : 0,
              transform: visible["ba"] ? "translateY(0)" : "translateY(10px)",
              transition: `all 0.4s ease ${i * 0.06}s`,
            }}>
              {/* Label */}
              {!m && <div style={{ padding: "16px 20px", display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{row.label}</span>
              </div>}
              {/* Sans */}
              <div style={{ padding: m ? "14px 16px" : "16px 20px", display: "flex", alignItems: "flex-start", gap: 10, borderLeft: m ? "none" : "1px solid #D4EBE0", borderRight: "1px solid #D4EBE0" }}>
                {m && <div style={{ fontFamily: "'Manrope'", fontSize: 10, fontWeight: 700, color: "#8A95A3", textTransform: "uppercase", marginBottom: 4, width: "100%" }}>{row.label}</div>}
                <div style={{ width: 16, height: 16, borderRadius: 4, background: "#FDE8E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}><Xx /></div>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>{row.sans}</span>
              </div>
              {/* Avec */}
              <div style={{ padding: m ? "14px 16px" : "16px 20px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}><Ck /></div>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#0A1628", lineHeight: 1.5, fontWeight: 500 }}>{row.avec}</span>
              </div>
            </div>
          ))}

          {/* Synthesis + CTA after table */}
          <div style={{ marginTop: 28, background: "#fff", borderRadius: 16, border: "1px solid #D4EBE0", padding: m ? 24 : 32, display: "flex", flexDirection: m ? "column" : "row", alignItems: "center", gap: m ? 20 : 32, boxShadow: "0 4px 16px rgba(10,64,48,0.04)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Manrope'", fontSize: m ? 18 : 22, fontWeight: 800, color: "#0A1628", marginBottom: 8 }}>En résumé : 0 risque pour vous.</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#4A5568", lineHeight: 1.6 }}>Artisan vérifié, devis sur place, paiement bloqué jusqu'à notre validation. Vous ne payez que quand tout est conforme. Et c'est gratuit.</div>
            </div>
            <button onClick={() => { setShowSearch(true); setSearchStep(0); setSearchCat(""); setSearchVille(""); setSearchDesc(""); setSearchPhotos(0); }} style={{ padding: "14px 28px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, fontFamily: "'Manrope'", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, whiteSpace: "nowrap" }}>Trouver un artisan <Arr /></button>
          </div>
        </div>
      </section>

      {/* DÉMO APPLICATION */}
      <section id="s-demo" style={{ padding: `${m ? 48 : 80}px ${px}`, background: "#fff", scrollMarginTop: m ? 56 : 64 }}>
        <div {...anim("demo")} style={{ ...anim("demo").style, maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 32 : 60, alignItems: "center" }}>
            {/* Left — iPhone mockup */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                width: m ? 260 : 290, height: m ? 540 : 600, borderRadius: 40,
                background: "#0A1628", padding: 10, position: "relative",
                boxShadow: "0 24px 60px rgba(10,22,40,0.25), 0 0 0 1px rgba(255,255,255,0.06)",
                animation: "float 6s ease-in-out infinite",
              }}>
                {/* Notch */}
                <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 100, height: 26, borderRadius: "0 0 16px 16px", background: "#0A1628", zIndex: 10 }} />
                {/* Screen */}
                <div style={{ width: "100%", height: "100%", borderRadius: 30, background: "#F5FAF7", overflow: "hidden", position: "relative" }}>
                  {/* Status bar — always visible */}
                  <div style={{ padding: "14px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 600, color: "#0A1628" }}>9:41</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <div style={{ width: 14, height: 10, borderRadius: 2, border: "1.5px solid #0A1628" }}><div style={{ width: 8, height: 6, borderRadius: 1, background: "#0A1628", margin: "1px auto" }} /></div>
                    </div>
                  </div>
                  {/* App header — always visible */}
                  <div style={{ padding: "8px 20px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    <Shield s={18} /><span style={{ fontFamily: "'Manrope'", fontSize: 15, fontWeight: 800, color: "#0A1628" }}>Nova</span>
                  </div>

                  {/* ── Screen 0: Accueil ── */}
                  {phoneScreen === 0 && <div style={{ padding: "0 16px", animation: "fadeIn 0.4s ease" }}>
                    <div style={{ background: "#fff", borderRadius: 10, padding: "9px 12px", border: "1px solid #D4EBE0", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#8A95A3" strokeWidth="1.8"/><path d="M16 16l5 5" stroke="#8A95A3" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8A95A3" }}>Rechercher un artisan...</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                      {[{ n: "Plomberie", c: "#1B6B4E" },{ n: "Électricité", c: "#F5A623" },{ n: "Serrurerie", c: "#2D9B6E" },{ n: "Chauffage", c: "#E8302A" }].map((cat, i) => (
                        <div key={i} style={{ padding: "12px 10px", borderRadius: 10, background: "#fff", border: "1px solid #D4EBE0", textAlign: "center" }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${cat.c}12`, margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.c, opacity: 0.6 }} />
                          </div>
                          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600, color: "#0A1628" }}>{cat.n}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "10px 12px", borderRadius: 10, background: "linear-gradient(135deg, #E8302A, #F5841F)", display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width={16} height={16} viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
                      <div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 700, color: "#fff" }}>Urgence ?</div><div style={{ fontFamily: "'DM Sans'", fontSize: 8, color: "rgba(255,255,255,0.7)" }}>Artisan en 45 min</div></div>
                    </div>
                  </div>}

                  {/* ── Screen 1: Profil artisan ── */}
                  {phoneScreen === 1 && <div style={{ padding: "0 16px", animation: "fadeIn 0.4s ease" }}>
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #1B6B4E, #2D9B6E)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono'", fontSize: 18, fontWeight: 700, color: "#fff" }}>PL</div>
                      <div style={{ fontFamily: "'Manrope'", fontSize: 16, fontWeight: 800, color: "#0A1628" }}>Paul Lefevre</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>Plombier · Paris 15e</div>
                      <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 4 }}>{[1,2,3,4,5].map(i => <Star key={i} c={i <= 4 ? "#F5A623" : "#D4EBE0"} />)}<span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#0A1628", marginLeft: 4 }}>4.8</span></div>
                    </div>
                    {[{ l: "SIRET", v: "Vérifié", c: "#1B6B4E" },{ l: "Décennale", v: "Valide", c: "#1B6B4E" },{ l: "RGE", v: "Certifié", c: "#1B6B4E" }].map((d, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "#fff", border: "1px solid #D4EBE0", marginBottom: 6 }}>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#4A5568" }}>{d.l}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Ck c={d.c} /><span style={{ fontFamily: "'DM Mono'", fontSize: 10, fontWeight: 600, color: d.c }}>{d.v}</span></div>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "#0A4030", textAlign: "center" }}>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 700, color: "#fff" }}>Réserver cet artisan</span>
                    </div>
                  </div>}

                  {/* ── Screen 2: Paiement séquestre ── */}
                  {phoneScreen === 2 && <div style={{ padding: "0 16px", animation: "fadeIn 0.4s ease" }}>
                    <div style={{ fontFamily: "'Manrope'", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 12 }}>Paiement sécurisé</div>
                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #D4EBE0", padding: 14, marginBottom: 12 }}>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3", marginBottom: 6 }}>Montant de l'intervention</div>
                      <div style={{ fontFamily: "'Manrope'", fontSize: 28, fontWeight: 800, color: "#0A1628" }}>380,00 €</div>
                    </div>
                    <div style={{ background: "#E8F5EE", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#1B6B4E" strokeWidth="1.5"/><path d="M8 11V7a4 4 0 118 0v4" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 700, color: "#1B6B4E" }}>Paiement en séquestre</div><div style={{ fontFamily: "'DM Sans'", fontSize: 8, color: "#4A5568" }}>L'artisan ne reçoit rien tant qu'on n'a pas validé</div></div>
                    </div>
                    {["Montant bloqué", "Intervention réalisée", "Nova valide", "Artisan payé"].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: i <= 1 ? "#1B6B4E" : "#D4EBE0", display: "flex", alignItems: "center", justifyContent: "center" }}>{i <= 1 && <Ck c="#fff" />}</div>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: i <= 1 ? "#0A1628" : "#8A95A3", fontWeight: i <= 1 ? 600 : 400 }}>{s}</span>
                      </div>
                    ))}
                  </div>}

                  {/* ── Screen 3: Validation ── */}
                  {phoneScreen === 3 && <div style={{ padding: "0 16px", animation: "fadeIn 0.4s ease" }}>
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#E8F5EE", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Ck c="#1B6B4E" />
                      </div>
                      <div style={{ fontFamily: "'Manrope'", fontSize: 18, fontWeight: 800, color: "#0A1628", marginBottom: 4 }}>Intervention validée</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8A95A3", marginBottom: 16 }}>Nova a vérifié la conformité</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #D4EBE0", padding: 14, marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>Artisan</span>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, color: "#0A1628" }}>Paul Lefevre</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>Montant</span>
                        <span style={{ fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 700, color: "#1B6B4E" }}>380,00 €</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>Statut</span>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700, color: "#22C88A" }}>Payé ✓</span>
                      </div>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: "#F5FAF7", border: "1px solid #D4EBE0", textAlign: "center" }}>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#1B6B4E", fontWeight: 600 }}>Laisser un avis</span>
                    </div>
                  </div>}

                  {/* Screen indicators */}
                  <div style={{ position: "absolute", bottom: 56, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
                    {[0,1,2,3].map(i => <div key={i} style={{ width: phoneScreen === i ? 16 : 6, height: 6, borderRadius: 3, background: phoneScreen === i ? "#1B6B4E" : "#D4EBE0", transition: "all 0.3s" }} />)}
                  </div>

                  {/* Bottom nav */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 0 18px", background: "#fff", borderTop: "1px solid #D4EBE0", display: "flex", justifyContent: "space-around" }}>
                    {[{ l: "Accueil", a: phoneScreen === 0 },{ l: "Notifs", a: false },{ l: "Missions", a: phoneScreen >= 2 },{ l: "Profil", a: false }].map((tab, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: tab.a ? "#1B6B4E" : "#D4EBE0", margin: "0 auto 3px", opacity: tab.a ? 1 : 0.4 }} />
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 8, fontWeight: tab.a ? 700 : 500, color: tab.a ? "#1B6B4E" : "#8A95A3" }}>{tab.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Description */}
            <div>
              <div style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#1B6B4E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Application mobile</div>
              <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 24 : 34, fontWeight: 800, color: "#0A1628", lineHeight: 1.2, marginBottom: 16 }}>Tout se fait<br/>depuis votre poche</h2>
              <p style={{ fontFamily: "'DM Sans'", fontSize: m ? 14 : 16, color: "#4A5568", lineHeight: 1.7, marginBottom: 28 }}>Recherchez un artisan, réservez en 2 minutes, suivez votre intervention en temps réel. Tout est centralisé dans une seule application.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { title: "Recherche intelligente", desc: "Trouvez un artisan par catégorie, disponibilité et avis vérifiés.", num: "01" },
                  { title: "Réservation en 3 étapes", desc: "Choisissez un créneau, décrivez votre besoin, payez en séquestre.", num: "02" },
                  { title: "Suivi en temps réel", desc: "Suivez chaque étape : paiement bloqué, intervention, validation.", num: "03" },
                  { title: "Urgences immédiates", desc: "Besoin maintenant ? Artisans disponibles en moins de 45 minutes.", num: "04" },
                ].map((f, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "16px 18px", borderRadius: 14,
                    background: phoneScreen === i ? "#E8F5EE" : "#F5FAF7",
                    border: `1px solid ${phoneScreen === i ? "#1B6B4E40" : "#D4EBE0"}`,
                    opacity: visible["demo"] ? 1 : 0,
                    transform: visible["demo"] ? "translateX(0)" : "translateX(20px)",
                    transition: `all 0.5s ease ${i * 0.1}s`,
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: phoneScreen === i ? "#1B6B4E" : "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono'", fontSize: 11, fontWeight: 700, color: phoneScreen === i ? "#fff" : "#1B6B4E", flexShrink: 0, transition: "all 0.3s" }}>{f.num}</div>
                    <div>
                      <div style={{ fontFamily: "'Manrope'", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 3 }}>{f.title}</div>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setShowSearch(true); setSearchStep(0); setSearchCat(""); setSearchVille(""); setSearchDesc(""); setSearchPhotos(0); }} style={{ marginTop: 24, padding: "12px 24px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, fontFamily: "'Manrope'", display: "flex", alignItems: "center", gap: 8 }}>
                Trouver un artisan <Arr />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="s-how" style={{ padding: `${m ? 48 : 80}px ${px}`, background: "#fff", scrollMarginTop: m ? 56 : 64 }}>
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(27,107,78,0.06)" }} />
        <div {...anim("how")} style={{ ...anim("how").style, maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 32 : 48 }}>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#1B6B4E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Simple et sécurisé</div>
            <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 24 : 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>3 étapes. Zéro risque.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 16 : 20 }}>
            {[
              { s: "01", t: "Réservez un artisan certifié", d: "Choisissez parmi des artisans vérifiés. Vous payez et l'argent est bloqué.", h: "Votre argent est protégé", dl: 0 },
              { s: "02", t: "L'artisan chiffre sur place", d: "Il se déplace, diagnostique et fait le devis devant vous. Pas de surprise.", h: "Le devis est fait devant vous", dl: 0.15 },
              { s: "03", t: "Nous validons, il est payé", d: "Nova vérifie. Ce n'est pas vous qui validez — c'est nous.", h: "Nous sommes votre garantie", dl: 0.3 },
            ].map((s, i) => (
              <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 20, background: "#F5FAF7", border: "1px solid #D4EBE0", display: "flex", flexDirection: "column", opacity: visible["how"] ? 1 : 0, transform: visible["how"] ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${s.dl}s` }}>
                <div style={{ fontFamily: "'DM Mono'", fontSize: 40, fontWeight: 800, color: "#D4EBE0", marginBottom: 8 }}>{s.s}</div>
                <div style={{ fontFamily: "'Manrope'", fontSize: m ? 17 : 19, fontWeight: 800, marginBottom: 10 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.6, flex: 1 }}>{s.d}</div>
                <div style={{ marginTop: 16, padding: "8px 14px", borderRadius: 8, background: "#E8F5EE", display: "flex", alignItems: "center", gap: 6 }}><Ck /><span style={{ fontSize: 12, fontWeight: 600, color: "#14523B" }}>{s.h}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÉQUESTRE VISUEL */}
      <section style={{ padding: `${m ? 40 : 64}px ${px}`, background: "linear-gradient(135deg, #0A4030, #1B6B4E)" }}>
        <div {...anim("escrow")} style={{ ...anim("escrow").style, maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Manrope'", fontSize: m ? 18 : 22, fontWeight: 700, color: "#fff", marginBottom: m ? 24 : 32 }}>Le parcours de votre paiement</h3>
          <div style={{ display: "flex", flexDirection: m ? "column" : "row" }}>
            {[{ l: "Paiement bloqué", d: "Vous payez en ligne", n: "01" },{ l: "Mission en cours", d: "L'artisan intervient", n: "02" },{ l: "Nous validons", d: "Nova vérifie", n: "03" },{ l: "Artisan payé", d: "Tout est conforme", n: "04" }].map((step, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: m ? "14px 0" : "16px 10px", position: "relative" }}>
                {!m && i < 3 && <div style={{ position: "absolute", top: 20, left: "60%", width: "80%", height: 2, background: "rgba(255,255,255,0.12)" }} />}
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontFamily: "'DM Mono'", fontWeight: 700, fontSize: 14, color: "#8ECFB0", position: "relative", zIndex: 1, opacity: visible["escrow"] ? 1 : 0, transform: visible["escrow"] ? "scale(1)" : "scale(0.5)", transition: `all 0.5s ease ${i*0.15}s` }}>{step.n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{step.l}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILIERS DE CONFIANCE */}
      <section id="s-trust" style={{ padding: `${m ? 48 : 80}px ${px}`, background: "#F5FAF7", scrollMarginTop: m ? 56 : 64 }}>
        <div {...anim("trust")} style={{ ...anim("trust").style, maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 32 : 48 }}>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#1B6B4E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Nos garanties</div>
            <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 24 : 34, fontWeight: 800 }}>Pourquoi nous faire confiance ?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 14 : 18 }}>
            {[
              { t: "Artisans audités", d: "SIRET, décennale, qualifications. Documents analysés par IA.", n: "01" },
              { t: "Séquestre sécurisé", d: "Votre argent est bloqué. L'artisan n'est payé qu'après notre validation.", n: "02" },
              { t: "Nous validons", d: "Vous ne validez pas vous-même. Nova est le tiers de confiance.", n: "03" },
              { t: "Avis authentiques", d: "Chaque note est liée à une mission réelle et un paiement vérifié.", n: "04" },
              { t: "Urgences 45 min", d: "Artisans disponibles, déjà vérifiés. Paiement sécurisé même en urgence.", n: "05" },
              { t: "Protection litiges", d: "Nova arbitre avec preuves. 97% résolus en faveur du client.", n: "06" },
            ].map((p, i) => (
              <div key={i} style={{ padding: m ? 22 : 26, borderRadius: 18, background: "#fff", border: "1px solid #D4EBE0", transition: "all 0.3s", opacity: visible["trust"] ? 1 : 0, transform: visible["trust"] ? "translateY(0)" : "translateY(16px)", transitionDelay: `${i*0.08}s` }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(10,64,48,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono'", fontSize: 12, fontWeight: 700, color: "#1B6B4E", marginBottom: 14 }}>{p.n}</div>
                <div style={{ fontFamily: "'Manrope'", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.t}</div>
                <div style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.6 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="s-faq" style={{ padding: `${m ? 48 : 80}px ${px}`, background: "#F5FAF7", scrollMarginTop: m ? 56 : 64 }}>
        <div {...anim("faq")} style={{ ...anim("faq").style, maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#1B6B4E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>FAQ</div>
            <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 22 : 28, fontWeight: 800, margin: 0 }}>Questions fréquentes</h2>
          </div>
          {[
            { q: "C'est vraiment gratuit pour les particuliers ?", a: "Oui, totalement. Aucun frais d'inscription, aucun abonnement, aucun frais caché. Vous payez uniquement le montant de l'intervention de l'artisan. La commission Nova est incluse dans le prix affiché — ce que vous voyez est ce que vous payez." },
            { q: "Comment fonctionne le paiement sécurisé ?", a: "Quand vous réservez un artisan, vous payez en ligne par carte bancaire. L'argent est immédiatement bloqué sur un compte séquestre sécurisé. L'artisan intervient chez vous. Ensuite, Nova vérifie que l'intervention est conforme au devis signé. Ce n'est qu'après cette validation que le paiement est libéré à l'artisan. Si l'intervention n'est pas conforme, vous êtes remboursé." },
            { q: "Comment les artisans sont-ils vérifiés ?", a: "Chaque artisan passe un processus de vérification en 3 étapes : vérification du SIRET actif via l'INSEE, contrôle de l'assurance décennale en cours de validité, et validation des qualifications professionnelles (RGE, Qualibat, etc.). Les documents sont analysés par notre IA puis vérifiés par notre équipe. Les artisans dont les documents expirent sont automatiquement suspendus." },
            { q: "Combien coûte une intervention ?", a: "Le prix dépend de l'intervention. L'artisan se déplace chez vous et fait le devis sur place, devant vous — jamais au téléphone. Vous voyez exactement ce qui sera fait et à quel prix avant de confirmer. Nova ne majore pas les prix : la commission est déjà incluse dans le tarif de l'artisan." },
            { q: "Que se passe-t-il en cas de litige ?", a: "Nova est votre tiers de confiance. En cas de problème, notre équipe intervient et arbitre avec les preuves disponibles : photos avant/après, devis signé numériquement, horodatage de l'intervention. Si le travail n'est pas conforme au devis, vous êtes remboursé via le séquestre. Vous n'êtes jamais seul face à un litige." },
            { q: "En combien de temps suis-je remboursé ?", a: "En cas de non-conformité validée par Nova, le remboursement est déclenché sous 48h ouvrées. Le montant est recrédité sur votre carte bancaire dans un délai de 3 à 5 jours selon votre banque. Vous êtes informé par notification à chaque étape du processus." },
            { q: "Je peux avoir un artisan en urgence ?", a: "Oui. Notre service urgence met en relation avec des artisans disponibles immédiatement dans votre secteur. L'artisan arrive en 45 minutes en moyenne. Le paiement reste sécurisé par séquestre, même en urgence — vous ne prenez aucun risque, même dans la précipitation." },
            { q: "Quelles zones géographiques sont couvertes ?", a: "Nova est disponible à Paris et en Île-de-France au lancement. L'expansion vers Lyon, Marseille et Bordeaux est prévue dans les prochains mois. Inscrivez-vous pour être notifié dès que votre ville est couverte." },
            { q: "Comment s'inscrire ?", a: "L'inscription prend 30 secondes. Vous créez votre compte avec votre email, sans carte bancaire requise à l'inscription. Vous pouvez immédiatement chercher des artisans, consulter leurs profils et leurs avis. La carte bancaire n'est demandée qu'au moment de réserver une intervention." },
            { q: "Les avis sont-ils fiables ?", a: "100% fiables. Seuls les clients ayant payé et finalisé une mission réelle via Nova peuvent laisser un avis. Chaque note est liée à une transaction vérifiée. Il est impossible de poster un faux avis — pas d'achat d'avis, pas de manipulation." },
          ].map((item, i) => (
            <details key={i} open={faqOpen === i} onClick={e => { e.preventDefault(); setFaqOpen(faqOpen === i ? null : i); }} style={{ borderBottom: "1px solid #D4EBE0" }}>
              <summary style={{ padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <span style={{ fontSize: m ? 14 : 15, fontWeight: 600 }}>{item.q}</span>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 18, color: "#1B6B4E", flexShrink: 0, marginLeft: 16, transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>+</span>
              </summary>
              {faqOpen === i && <div style={{ paddingBottom: 18, fontSize: 13, color: "#4A5568", lineHeight: 1.7, animation: "fadeIn 0.3s ease" }}>{item.a}</div>}
            </details>
          ))}

          {/* Mini CTA after FAQ */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#4A5568", marginBottom: 16 }}>Vous avez encore des questions ? Trouvez un artisan et voyez par vous-même.</p>
            <button onClick={() => { setShowSearch(true); setSearchStep(0); setSearchCat(""); setSearchVille(""); setSearchDesc(""); setSearchPhotos(0); }} style={{ padding: "12px 28px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, fontFamily: "'Manrope'", display: "inline-flex", alignItems: "center", gap: 8 }}>Trouver un artisan <Arr /></button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="s-cta" style={{ padding: `${m ? 48 : 80}px ${px}`, background: "linear-gradient(165deg, #0A4030, #1B6B4E)", position: "relative", overflow: "hidden", scrollMarginTop: m ? 56 : 64 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(142,207,176,0.08), transparent 70%)" }} />
        {/* Subtle shield watermark */}
        <div style={{ position: "absolute", top: "10%", right: "8%", opacity: 0.04 }}>
          <svg width={120} height={120} viewBox="0 0 24 24" fill="#fff"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/></svg>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Pain reminder */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "6px 16px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
            <Xx c="rgba(255,255,255,0.5)" />
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>200€ perdus, 650€ pour 3 min, 4 800€ à refaire...</span>
          </div>

          <h2 style={{ fontFamily: "'Manrope'", fontSize: m ? 26 : 40, fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.15 }}>Ne prenez plus<br/>ce risque.</h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: m ? 15 : 17, color: "rgba(255,255,255,0.65)", marginBottom: 36, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px" }}>Artisan vérifié SIRET + décennale. Paiement bloqué jusqu'à validation. C'est gratuit pour vous.</p>

          {/* Main CTA */}
          <button onClick={() => { setShowSearch(true); setSearchStep(0); setSearchCat(""); setSearchVille(""); setSearchDesc(""); setSearchPhotos(0); }} style={{ padding: "18px 40px", borderRadius: 14, background: "#fff", color: "#0A4030", border: "none", fontSize: 17, fontWeight: 800, fontFamily: "'Manrope'", display: "inline-flex", alignItems: "center", gap: 10, animation: "pulse 2s infinite", marginBottom: 16 }}>Trouver un artisan <Arr c="#0A4030" /></button>

          {/* Friction killers */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
            {["30 secondes", "Sans carte bancaire", "Gratuit"].map((t, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{t}{i < 2 ? " •" : ""}</span>
            ))}
          </div>

          {/* 3 guarantees */}
          <div style={{ display: "flex", gap: m ? 12 : 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: <Shield s={16} />, text: "Artisans vérifiés" },
              { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#8ECFB0" strokeWidth="2"/><path d="M8 11V7a4 4 0 118 0v4" stroke="#8ECFB0" strokeWidth="2" strokeLinecap="round"/></svg>, text: "Paiement séquestre" },
              { icon: <Ck c="#8ECFB0" />, text: "Validation Nova" },
            ].map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 14px" }}>
                <div style={{ filter: "brightness(1.5)" }}>{g.icon}</div>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{g.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEARCH MODAL ═══ */}
      {showSearch && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.5)", backdropFilter: "blur(6px)", padding: 20 }} onClick={() => setShowSearch(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, maxWidth: 520, width: "100%", maxHeight: "88vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", animation: "scaleIn 0.25s ease" }}>

            {/* ── Step 0: Category + City ── */}
            {searchStep === 0 && (
              <div style={{ padding: m ? 24 : 36 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Manrope'", fontSize: m ? 20 : 24, fontWeight: 800, color: "#0A1628", marginBottom: 4 }}>Trouvez votre artisan</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8A95A3" }}>Gratuit et sans engagement</div>
                  </div>
                  <button onClick={() => setShowSearch(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #D4EBE0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Xx c="#8A95A3" /></button>
                </div>

                {/* Offer reminder */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #0A4030, #1B6B4E)", borderRadius: 10, padding: "9px 14px", marginBottom: 20 }}>
                  <span style={{ fontSize: 16 }}>🎁</span>
                  <div><div style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700, color: "#fff" }}>1er déplacement offert</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Pour votre première intervention à l'inscription</div></div>
                </div>

                {/* Category */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 10 }}>De quel artisan avez-vous besoin ?</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[{ n: "Plomberie", e: "🔧" },{ n: "Électricité", e: "⚡" },{ n: "Serrurerie", e: "🔑" },{ n: "Chauffage", e: "🔥" },{ n: "Peinture", e: "🎨" },{ n: "Maçonnerie", e: "🧱" }].map((cat, i) => (
                      <div key={i} onClick={() => setSearchCat(cat.n)} style={{ padding: "14px 10px", borderRadius: 12, cursor: "pointer", textAlign: "center", background: searchCat === cat.n ? "#E8F5EE" : "#F5FAF7", border: `2px solid ${searchCat === cat.n ? "#1B6B4E" : "transparent"}`, transition: "all 0.15s" }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.e}</div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, color: searchCat === cat.n ? "#1B6B4E" : "#0A1628" }}>{cat.n}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* City + geolocation */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 8 }}>Dans quelle ville ?</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={searchVille} onChange={e => setSearchVille(e.target.value)} placeholder="Ex : Paris 15e, Lyon..."
                      style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", outline: "none", background: "#F5FAF7", boxSizing: "border-box" }} />
                    <button onClick={() => { setGeoLoading(true); if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => { setSearchVille("Ma position actuelle"); setGeoLoading(false); }, () => { setSearchVille("Paris"); setGeoLoading(false); }); } else { setSearchVille("Paris"); setGeoLoading(false); }}}
                      style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #D4EBE0", background: "#F5FAF7", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {geoLoading ? <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #D4EBE0", borderTopColor: "#1B6B4E", animation: "spin 0.8s linear infinite" }} /> :
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#1B6B4E" strokeWidth="2"/><path d="M12 2v4m0 12v4m10-10h-4M6 12H2" stroke="#1B6B4E" strokeWidth="2" strokeLinecap="round"/></svg>}
                    </button>
                  </div>
                </div>

                <button disabled={!searchCat || !searchVille.trim()} onClick={() => setSearchStep(1)}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: searchCat && searchVille.trim() ? "#0A4030" : "#D4EBE0", color: searchCat && searchVille.trim() ? "#fff" : "#8A95A3", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", cursor: searchCat && searchVille.trim() ? "pointer" : "default", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Continuer <Arr c={searchCat && searchVille.trim() ? "#fff" : "#8A95A3"} />
                </button>

                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: i === 0 ? 20 : 8, height: 4, borderRadius: 2, background: i === 0 ? "#1B6B4E" : "#D4EBE0", transition: "all 0.3s" }} />)}
                </div>
              </div>
            )}

            {/* ── Step 1: Describe problem + photos ── */}
            {searchStep === 1 && (
              <div style={{ padding: m ? 24 : 36, animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Manrope'", fontSize: m ? 18 : 22, fontWeight: 800, color: "#0A1628", marginBottom: 4 }}>Décrivez votre besoin</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8A95A3" }}>{searchCat} à {searchVille}</div>
                  </div>
                  <button onClick={() => setSearchStep(0)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #D4EBE0", background: "#fff", fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3", cursor: "pointer" }}>Retour</button>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 8 }}>Quel est le problème ?</div>
                  <textarea value={searchDesc} onChange={e => setSearchDesc(e.target.value)} placeholder="Ex : Fuite sous l'évier de la cuisine, le joint semble usé. L'eau coule doucement en continu..." rows={4}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #D4EBE0", fontFamily: "'DM Sans'", fontSize: 14, color: "#0A1628", outline: "none", background: "#F5FAF7", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
                </div>

                {/* Photos */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 8 }}>Photos <span style={{ fontWeight: 400, color: "#8A95A3" }}>(optionnel — aide l'artisan à préparer son intervention)</span></div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[0,1,2].map(i => (
                      <div key={i} onClick={() => setSearchPhotos(Math.max(searchPhotos, i + 1))}
                        style={{ width: 80, height: 80, borderRadius: 12, border: `2px dashed ${i < searchPhotos ? "#1B6B4E" : "#D4EBE0"}`, background: i < searchPhotos ? "#E8F5EE" : "#F5FAF7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
                        {i < searchPhotos ? (
                          <><Ck c="#1B6B4E" /><span style={{ fontFamily: "'DM Sans'", fontSize: 9, color: "#1B6B4E", marginTop: 4 }}>Photo {i + 1}</span></>
                        ) : (
                          <><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#8A95A3" strokeWidth="1.5"/><circle cx="8.5" cy="11.5" r="2" stroke="#8A95A3" strokeWidth="1.5"/><path d="M21 17l-5-5-8 8" stroke="#8A95A3" strokeWidth="1.5" strokeLinecap="round"/></svg><span style={{ fontFamily: "'DM Sans'", fontSize: 9, color: "#8A95A3", marginTop: 4 }}>Ajouter</span></>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => { setSearchStep(2); setTimeout(() => setSearchStep(3), 2200); }}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#0A4030", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'Manrope'", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Rechercher des artisans <Arr />
                </button>
                <button onClick={() => { setSearchStep(2); setTimeout(() => setSearchStep(3), 2200); }}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "transparent", color: "#8A95A3", fontSize: 12, fontFamily: "'DM Sans'", cursor: "pointer", marginTop: 8 }}>
                  Passer cette étape
                </button>

                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: i === 1 ? 20 : 8, height: 4, borderRadius: 2, background: i <= 1 ? "#1B6B4E" : "#D4EBE0", transition: "all 0.3s" }} />)}
                </div>
              </div>
            )}

            {/* ── Step 2: Loading ── */}
            {searchStep === 2 && (
              <div style={{ padding: "60px 36px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #D4EBE0", borderTopColor: "#1B6B4E", margin: "0 auto 20px", animation: "spin 0.8s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ fontFamily: "'Manrope'", fontSize: 18, fontWeight: 700, color: "#0A1628", marginBottom: 6 }}>Recherche en cours...</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8A95A3", marginBottom: 20 }}>Nous cherchons les meilleurs artisans en {searchCat} à {searchVille}</div>
                {searchDesc && <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3", background: "#F5FAF7", borderRadius: 8, padding: "8px 12px", maxWidth: 300, margin: "0 auto" }}>Votre description sera transmise aux artisans</div>}
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: i === 2 ? 20 : 8, height: 4, borderRadius: 2, background: i <= 2 ? "#1B6B4E" : "#D4EBE0" }} />)}
                </div>
              </div>
            )}

            {/* ── Step 3: Results ── */}
            {searchStep === 3 && (
              <div style={{ padding: m ? 24 : 32, animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Manrope'", fontSize: m ? 18 : 22, fontWeight: 800, color: "#0A1628", marginBottom: 4 }}>3 artisans disponibles</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8A95A3" }}>{searchCat} à {searchVille}</div>
                  </div>
                  <button onClick={() => setShowSearch(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #D4EBE0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Xx c="#8A95A3" /></button>
                </div>

                {/* Offer reminder */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#E8F5EE", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
                  <span style={{ fontSize: 14 }}>🎁</span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, color: "#1B6B4E" }}>Rappel : 1er déplacement offert à l'inscription</span>
                </div>

                {/* Urgency counter */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 8, padding: "8px 12px", marginBottom: 16, background: "#FFFBEB", border: "1px solid #F5A62320" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5A623", animation: "dotPulse 2s infinite", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#4A5568" }}><span style={{ fontWeight: 600, color: "#0A1628" }}>{7 + Math.floor(Math.random() * 8)} personnes</span> recherchent un artisan en {searchCat} dans votre secteur en ce moment</span>
                </div>

                {/* Artisan results */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {[
                    { name: "Paul Lefevre", note: 4.8, missions: 127, delai: "Disponible demain", init: "PL", verified: ["SIRET", "Décennale", "RGE"], activity: "Dernière intervention il y a 2h" },
                    { name: "Nicolas Martin", note: 4.9, missions: 89, delai: "Disponible aujourd'hui", init: "NM", verified: ["SIRET", "Décennale"], activity: "3 demandes cette semaine" },
                    { name: "David Richard", note: 4.6, missions: 54, delai: "Disponible lundi", init: "DR", verified: ["SIRET", "Décennale", "Qualibat"], activity: "Dernière intervention hier" },
                  ].map((artisan, i) => (
                    <div key={i} style={{ padding: "18px 20px", borderRadius: 16, background: "#F5FAF7", border: "1px solid #D4EBE0", transition: "all 0.2s", animation: `fadeIn 0.4s ease ${i * 0.1}s both` }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#1B6B4E40"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(10,64,48,0.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#D4EBE0"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1B6B4E, #2D9B6E)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono'", fontSize: 14, fontWeight: 700, color: "#fff" }}>{artisan.init}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Manrope'", fontSize: 15, fontWeight: 700, color: "#0A1628" }}>{artisan.name}</div>
                          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>{artisan.missions} missions réalisées</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Star /><span style={{ fontFamily: "'DM Mono'", fontSize: 14, fontWeight: 700, color: "#0A1628" }}>{artisan.note}</span></div>
                      </div>
                      {/* Badges */}
                      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                        {artisan.verified.map((v, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center", gap: 4, background: "#E8F5EE", borderRadius: 6, padding: "3px 8px" }}>
                            <Ck c="#1B6B4E" /><span style={{ fontFamily: "'DM Mono'", fontSize: 9, fontWeight: 600, color: "#1B6B4E" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      {/* Activity + availability + CTA */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: i === 1 ? "#22C88A" : "#8A95A3", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: i === 1 ? "#22C88A" : "#8A95A3", fontWeight: i === 1 ? 600 : 400 }}>{artisan.delai}</span>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#D4EBE0" }}>·</span>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#8A95A3" }}>{artisan.activity}</span>
                      </div>
                      <button onClick={() => window.location.href = "/login"} style={{ width: "100%", padding: "10px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans'", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        Contacter cet artisan <Arr />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Login gate */}
                <div style={{ background: "#F5FAF7", borderRadius: 12, padding: "14px 18px", border: "1px solid #D4EBE0", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#1B6B4E" strokeWidth="2"/><path d="M8 11V7a4 4 0 118 0v4" stroke="#1B6B4E" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#0A1628" }}>Inscrivez-vous pour contacter un artisan</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8A95A3" }}>30 sec • Sans carte bancaire • 1er déplacement offert</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: i === 3 ? 20 : 8, height: 4, borderRadius: 2, background: "#1B6B4E" }} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ padding: `${m ? "28px 20px 90px" : "36px"} ${m ? "" : px}`, background: "#071E17", display: "flex", flexDirection: m ? "column" : "row", justifyContent: "space-between", alignItems: m ? "flex-start" : "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Shield s={20} /><span style={{ fontFamily: "'Manrope'", fontSize: 16, fontWeight: 800, color: "#fff" }}>Nova</span><span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>2026</span></div>
        <div style={{ display: "flex", gap: 20 }}>
          {["CGU", "Confidentialité", "Mentions légales", "Contact"].map((l, i) => (
            <span key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>{l}</span>
          ))}
        </div>
      </footer>

      {/* STICKY CTA MOBILE */}
      {m && scrollY > 500 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)",
          borderTop: "1px solid #D4EBE0",
          padding: "10px 16px", paddingBottom: "max(10px, env(safe-area-inset-bottom))",
          display: "flex", alignItems: "center", gap: 10,
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 700, color: "#0A1628" }}>Artisan vérifié en 30 sec</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#8A95A3" }}>Gratuit • Sans carte bancaire</div>
          </div>
          <button onClick={() => { setShowSearch(true); setSearchStep(0); setSearchCat(""); setSearchVille(""); setSearchDesc(""); setSearchPhotos(0); }} style={{ padding: "10px 20px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, fontFamily: "'Manrope'", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            C'est parti <Arr />
          </button>
        </div>
      )}
    </div>
  );
}
