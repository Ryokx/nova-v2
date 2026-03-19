import { useState, useEffect, useRef, useCallback } from "react";

/* ━━━ THEME ━━━ */
const useTheme = (dm) => ({
  bg: dm ? "#2C2C34" : "#F5FAF7",
  card: dm ? "#363640" : "#fff",
  surface: dm ? "#32323C" : "#E8F5EE",
  t1: dm ? "#EEEEF0" : "#0A1628",
  t2: dm ? "#A0A0AC" : "#4A5568",
  t3: dm ? "#707080" : "#8A95A3",
  hint: dm ? "#555560" : "#7EA894",
  border: dm ? "rgba(255,255,255,0.07)" : "rgba(10,22,40,0.06)",
  borderMed: dm ? "rgba(255,255,255,0.1)" : "#D4EBE0",
  shadow: dm ? "0 2px 16px rgba(0,0,0,0.2)" : "0 2px 16px rgba(10,22,40,0.04)",
  accent: "#1B6B4E",
  accentHover: dm ? "#5A5A6A" : "#3A3A4A",
  accentBg: dm ? "rgba(27,107,78,0.15)" : "rgba(27,107,78,0.04)",
  accentBorder: dm ? "rgba(27,107,78,0.25)" : "rgba(27,107,78,0.08)",
  accentText: dm ? "#8ECFB0" : "#14523B",
  inputBg: dm ? "#363640" : "#fff",
  avatarGrad: dm ? "linear-gradient(135deg, #2A4A3C, #1E3E30)" : "linear-gradient(135deg, #E8F5EE, #D4EBE0)",
});

/* ━━━ ICONS ━━━ */
const I = {
  nova: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="nG1" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#0A4030"/><stop offset="1" stopColor="#1B6B4E"/></linearGradient><linearGradient id="nG2" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#F5D090"/><stop offset="1" stopColor="#F5A623"/></linearGradient></defs><path d="M12 1 C13.5 8, 16 10.5, 23 12 C16 13.5, 13.5 16, 12 23 C10.5 16, 8 13.5, 1 12 C8 10.5, 10.5 8, 12 1Z" fill="url(#nG1)"/><path d="M12 5 C13 9, 15 11, 19 12 C15 13, 13 15, 12 19 C11 15, 9 13, 5 12 C9 11, 11 9, 12 5Z" fill="url(#nG2)"/><rect x="9.5" y="11.5" width="5" height="4" rx="1" fill="#fff"/><path d="M10.5 11.5 V10 A1.5 1.5 0 0 1 13.5 10 V11.5" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/><circle cx="12" cy="13.2" r="0.7" fill="#0A4030"/></svg>,
  shield: (c="#1B6B4E",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill={c} opacity=".12"/><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={c} strokeWidth="1.5" fill="none"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lock: (c="#1B6B4E",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke={c} strokeWidth="1.5"/><path d="M8 11V7a4 4 0 118 0v4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill={c}/></svg>,
  back: (c="#1B6B4E") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: (c="#22C88A",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chat: (c="#1B6B4E",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  settings: (c="#1B6B4E",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.5"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={c} strokeWidth="1.5"/></svg>,
  camera: (c="#1B6B4E",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="13" r="4" stroke={c} strokeWidth="1.5"/></svg>,
  doc: (c="#1B6B4E",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={c} strokeWidth="1.5"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  send: (c="#fff") => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clip: (c="#1B6B4E") => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  logout: (c="#E8302A",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock: (c="#8A95A3",s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.5"/><path d="M12 6v6l4 2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  mapPin: (c="#1B6B4E",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="1.5"/></svg>,
  user: (c="#1B6B4E",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/><path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
};

/* ━━━ NAVBAR ━━━ */
const Navbar = ({ page, setPage, T, dm, mode, setMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const clientLinks = [
    { id: "client-dash", label: "Dashboard" },
    { id: "search", label: "Artisans" },
    { id: "missions", label: "Missions" },
    { id: "notifs-client", label: "Notifications" },
    { id: "profile-client", label: "Profil" },
  ];
  const artisanLinks = [
    { id: "artisan-dash", label: "Dashboard" },
    { id: "docs", label: "Documents" },
    { id: "payments", label: "Paiements" },
    { id: "notifs-artisan", label: "Notifications" },
    { id: "profile-artisan", label: "Profil" },
  ];
  const links = mode === "client" ? clientLinks : mode === "artisan" ? artisanLinks : [];

  return (
    <>
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: dm ? "rgba(44,44,52,0.92)" : "rgba(255,255,255,0.88)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: `1px solid ${T.border}`,
      padding: "0 24px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div onClick={() => { setPage(mode === "client" ? "client-dash" : mode === "artisan" ? "artisan-dash" : "home"); setMobileOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 0, cursor: "pointer", position: "relative" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: T.t1, letterSpacing: -1 }}>Nova</span>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5A623", position: "absolute", top: 2, right: -4 }}/>
      </div>
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {links.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: page === n.id ? 600 : 400,
            color: page === n.id ? T.t1 : T.t3,
            fontFamily: "'DM Sans', sans-serif",
            borderBottom: page === n.id ? `2px solid ${T.accent}` : "2px solid transparent",
            paddingBottom: 4, transition: "all 200ms ease",
          }}>{n.label}</button>
        ))}
        {!mode ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setPage("login")} style={{ padding: "8px 20px", borderRadius: 10, background: T.accent, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Connexion</button>
            <button onClick={() => setPage("signup")} style={{ padding: "8px 20px", borderRadius: 10, background: "none", color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Inscription</button>
          </div>
        ) : (
          <button onClick={() => { setMode(null); setPage("home"); }} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(232,48,42,0.06)", color: "#E8302A", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Déconnexion</button>
        )}
      </div>
      {/* Mobile hamburger */}
      <button className="nav-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none", flexDirection: "column", gap: 5 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, background: T.t1, borderRadius: 2 }}/>)}
      </button>
    </nav>
    {/* Mobile dropdown */}
    {mobileOpen && (
      <div style={{ position: "fixed", top: 64, left: 0, right: 0, bottom: 0, zIndex: 99 }}>
        <div onClick={() => setMobileOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }}/>
        <div style={{ position: "relative", background: dm ? "rgba(44,44,52,0.98)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMobileOpen(false); }} style={{ background: page === n.id ? T.accentBg : "none", border: "none", padding: "12px 16px", borderRadius: 10, textAlign: "left", fontSize: 14, fontWeight: page === n.id ? 700 : 500, color: page === n.id ? T.accent : T.t1, cursor: "pointer" }}>{n.label}</button>
          ))}
          {!mode ? (
            <>
              <button onClick={() => { setPage("login"); setMobileOpen(false); }} style={{ padding: "12px 16px", borderRadius: 10, background: T.accent, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Connexion</button>
              <button onClick={() => { setPage("signup"); setMobileOpen(false); }} style={{ padding: "12px 16px", borderRadius: 10, background: "none", color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Inscription</button>
            </>
          ) : (
            <button onClick={() => { setMode(null); setPage("home"); setMobileOpen(false); }} style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(232,48,42,0.06)", color: "#E8302A", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Déconnexion</button>
          )}
        </div>
      </div>
    )}
    </>
  );
};

/* ━━━ FOOTER ━━━ */
const Footer = ({ T, setPage }) => (
  <footer style={{
    background: T.card, borderTop: `1px solid ${T.border}`,
    padding: "48px 40px 32px",
  }}>
    <div className="footer-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12, position: "relative" }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 800, color: T.t1, letterSpacing: -1 }}>Nova</span>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F5A623", position: "absolute", top: 0, right: -6 }}/>
        </div>
        <p style={{ fontSize: 13, color: T.t3, lineHeight: 1.7, maxWidth: 300 }}>
          La plateforme de mise en relation entre particuliers et artisans certifiés. Paiement sécurisé par séquestre.
        </p>
      </div>
      {[
        { title: "Plateforme", links: [["Accueil", "home"], ["Support", "support"], ["Paramètres", "settings"]] },
        { title: "Compte", links: [["Connexion", "login"], ["Inscription", "signup"]] },
        { title: "Légal", links: [["CGU", null], ["Confidentialité", null], ["Mentions légales", null]] },
      ].map((col) => (
        <div key={col.title}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.t1, marginBottom: 12 }}>{col.title}</div>
          {col.links.map(([label, pg]) => (
            <button key={label} onClick={() => pg && setPage(pg)} style={{
              display: "block", background: "none", border: "none", cursor: pg ? "pointer" : "default",
              fontSize: 13, color: T.t3, marginBottom: 8, fontFamily: "'DM Sans', sans-serif",
              transition: "color 200ms ease",
            }}>{label}</button>
          ))}
        </div>
      ))}
    </div>
    <div style={{ maxWidth: 1100, margin: "24px auto 0", paddingTop: 20, borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
      <span style={{ fontSize: 12, color: T.hint }}>© 2026 Nova SAS — Tous droits réservés</span>
    </div>
  </footer>
);

/* ━━━ PAGE: HOME (LANDING) ━━━ */
const PageHome = ({ setPage, T, dm, loginAs }) => (
  <div>
    {/* Hero — asymmetric layout with phone preview */}
    <section style={{
      padding: "0 40px", minHeight: "calc(100vh - 64px)",
      background: dm
        ? "linear-gradient(150deg, #2C2C34 0%, #1a2a22 50%, #2C2C34 100%)"
        : "linear-gradient(150deg, #F5FAF7 0%, #E8F5EE 40%, #D4EBE0 100%)",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center",
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: dm ? "rgba(27,107,78,0.06)" : "rgba(27,107,78,0.07)", filter: "blur(80px)" }}/>
      <div style={{ position: "absolute", bottom: -100, left: -60, width: 300, height: 300, borderRadius: "50%", background: dm ? "rgba(245,166,35,0.04)" : "rgba(245,166,35,0.06)", filter: "blur(60px)" }}/>
      <div style={{ position: "absolute", top: "40%", left: "30%", width: 200, height: 200, borderRadius: "50%", background: dm ? "rgba(34,200,138,0.03)" : "rgba(34,200,138,0.05)", filter: "blur(50px)" }}/>

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 60, position: "relative", zIndex: 1 }}>

        {/* Left — Text content */}
        <div style={{ flex: 1, minWidth: 0, padding: "80px 0" }}>
          {/* Pain point badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: dm ? "rgba(232,48,42,0.1)" : "rgba(232,48,42,0.06)",
            border: `1px solid ${dm ? "rgba(232,48,42,0.2)" : "rgba(232,48,42,0.12)"}`,
            borderRadius: 20, padding: "7px 16px", marginBottom: 24,
            fontSize: 13, fontWeight: 600, color: "#E8302A",
            animation: "pageIn 600ms ease-out both",
          }}>
            ⚠ 67% des Français ont déjà eu un litige avec un artisan
          </div>

          <h1 className="hero-title" style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 56, fontWeight: 800,
            color: T.t1, lineHeight: 1.1, margin: "0 0 8px", letterSpacing: "-2px",
            animation: "pageIn 600ms ease-out 100ms both",
          }}>
            Fini les artisans<br/>
            <span style={{ color: "#E8302A", textDecoration: "line-through", textDecorationThickness: 3, opacity: 0.5 }}>douteux</span>
          </h1>
          <h1 className="hero-title" style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 56, fontWeight: 800,
            color: T.accent, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-2px",
            animation: "pageIn 600ms ease-out 200ms both",
          }}>
            Place aux certifiés.
          </h1>

          <p className="hero-desc" style={{
            fontSize: 18, color: T.t2, lineHeight: 1.8, margin: "0 0 16px", maxWidth: 480,
            animation: "pageIn 600ms ease-out 300ms both",
          }}>
            Nova vérifie chaque artisan <span style={{ fontWeight: 700, color: T.t1 }}>(SIRET, décennale, RGE)</span> et bloque votre paiement en <span style={{ fontWeight: 700, color: T.t1 }}>séquestre</span> jusqu'à validation de l'intervention.
          </p>

          {/* Trust micro-badges */}
          <div style={{
            display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap",
            animation: "pageIn 600ms ease-out 400ms both",
          }}>
            {[
              { icon: I.shield(T.accent, 14), text: "Artisans vérifiés" },
              { icon: I.lock(T.accent, 14), text: "Paiement séquestre" },
              { icon: I.check(T.accent, 14), text: "0% d'impayés" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: T.accentText }}>
                {b.icon} {b.text}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-cta" style={{
            display: "flex", gap: 12,
            animation: "pageIn 600ms ease-out 500ms both",
          }}>
            <button onClick={() => setPage("signup")} style={{
              padding: "16px 36px", borderRadius: 14,
              background: "linear-gradient(135deg, #0A4030, #1B6B4E)", color: "#fff", border: "none",
              fontSize: 16, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 8px 24px rgba(10,64,48,0.3)",
              fontFamily: "'Manrope', sans-serif",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(10,64,48,0.4)"; }}
               onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(10,64,48,0.3)"; }}>
              Trouver mon artisan
            </button>
            <button onClick={() => loginAs("client")} style={{
              padding: "16px 28px", borderRadius: 14,
              background: dm ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              color: T.t1, border: `1px solid ${T.borderMed}`,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "transform 200ms ease",
            }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
               onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Voir la démo →
            </button>
          </div>

          {/* Micro social proof */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginTop: 28,
            animation: "pageIn 600ms ease-out 600ms both",
          }}>
            <div style={{ display: "flex" }}>
              {["SL", "PM", "CD", "AM"].map((ini, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `hsl(${150 + i * 30}, 35%, ${dm ? 30 : 85}%)`,
                  border: `2px solid ${dm ? "#2C2C34" : "#E8F5EE"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: T.accent,
                  marginLeft: i > 0 ? -8 : 0,
                }}>{ini}</div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: T.t3 }}>
              <span style={{ fontWeight: 700, color: T.t1 }}>Rejoignez-les</span> — Inscription gratuite, sans engagement
            </div>
          </div>
        </div>

        {/* Right — Phone mockup preview */}
        <div className="hide-mobile" style={{
          flex: "0 0 300px", position: "relative",
          animation: "pageIn 800ms ease-out 400ms both",
        }}>
          <div style={{
            width: 280, height: 560, borderRadius: 44,
            background: dm ? "#1a1a22" : "#0A1628",
            padding: 10,
            boxShadow: dm ? "0 30px 80px rgba(0,0,0,0.5)" : "0 30px 80px rgba(10,22,40,0.2)",
            transform: "rotate(2deg)",
          }}>
            <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 90, height: 26, borderRadius: "0 0 16px 16px", background: dm ? "#1a1a22" : "#0A1628", zIndex: 2 }}>
              <div style={{ width: 44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.12)", margin: "14px auto 0" }}/>
            </div>
            <div style={{ width: "100%", height: "100%", borderRadius: 36, background: "linear-gradient(170deg, #E8F5EE, #F5FAF7)", overflow: "hidden" }}>
              <div style={{ padding: "34px 14px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12, position: "relative" }}>
                  <span style={{ fontFamily: "'Manrope'", fontSize: 13, fontWeight: 800, color: "#0A1628", letterSpacing: -0.5 }}>Nova</span>
                  <div style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: "#F5A623", position: "absolute", top: 0, right: -3 }}/>
                  <div style={{ marginLeft: "auto", width: 24, height: 24, borderRadius: 8, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.lock("#1B6B4E", 12)}</div>
                </div>
                <div style={{ fontFamily: "'Manrope'", fontSize: 14, fontWeight: 800, color: "#0A1628", marginBottom: 12 }}>Bonjour Sophie 👋</div>
                {/* Mini stats */}
                <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
                  {[{ v: "2", l: "En cours", c: "#22C88A" }, { v: "570€", l: "Séquestre", c: "#1B6B4E" }].map((k, i) => (
                    <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "7px 6px", textAlign: "center", border: "1px solid #D4EBE0" }}>
                      <div style={{ fontFamily: "'DM Mono'", fontSize: 12, fontWeight: 700, color: k.c }}>{k.v}</div>
                      <div style={{ fontSize: 7, color: "#6B7280" }}>{k.l}</div>
                    </div>
                  ))}
                </div>
                {/* Mission cards */}
                {[
                  { ini: "JM", name: "Jean-Michel P.", desc: "Réparation fuite", badge: "En cours", bColor: "#22C88A" },
                  { ini: "SM", name: "Sophie M.", desc: "Prise électrique", badge: "Terminée", bColor: "#1B6B4E" },
                  { ini: "KB", name: "Karim B.", desc: "Serrure", badge: "Validée", bColor: "#F5A623" },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "8px 10px", marginBottom: 5, border: "1px solid #E8F5EE", display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #E8F5EE, #D4EBE0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#1B6B4E" }}>{m.ini}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#0A1628" }}>{m.name}</div>
                      <div style={{ fontSize: 8, color: "#6B7280" }}>{m.desc}</div>
                    </div>
                    <span style={{ fontSize: 7, fontWeight: 700, color: m.bColor, background: m.bColor + "15", padding: "2px 5px", borderRadius: 4 }}>{m.badge}</span>
                  </div>
                ))}
                {/* Séquestre visual */}
                <div style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)", borderRadius: 12, padding: "10px", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                    {I.lock("#8ECFB0", 10)}
                    <span style={{ fontSize: 8, fontWeight: 700, color: "#8ECFB0" }}>Paiement en séquestre</span>
                  </div>
                  <div style={{ fontFamily: "'DM Mono'", fontSize: 16, fontWeight: 700, color: "#fff" }}>570,00 €</div>
                  <div style={{ fontSize: 7, color: "rgba(255,255,255,0.5)" }}>Protégé jusqu'à validation</div>
                </div>
                {/* Tab bar */}
                <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 4px", marginTop: 10, borderTop: "1px solid #E8F5EE" }}>
                  {["🏠", "🔍", "📋", "🔔", "👤"].map((e, i) => (
                    <div key={i} style={{ fontSize: 13, opacity: i === 0 ? 1 : 0.35 }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Floating notification */}
          <div style={{
            position: "absolute", top: 80, left: -60,
            background: "#fff", borderRadius: 14, padding: "10px 14px",
            boxShadow: "0 8px 32px rgba(10,22,40,0.12)", border: "1px solid #E8F5EE",
            display: "flex", alignItems: "center", gap: 8, maxWidth: 200,
            animation: "pageIn 600ms ease-out 800ms both",
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.check("#22C88A", 14)}</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0A1628" }}>Intervention validée</div>
              <div style={{ fontSize: 8, color: "#6B7280" }}>Paiement libéré • 320€</div>
            </div>
          </div>
          {/* Floating shield */}
          <div style={{
            position: "absolute", bottom: 100, right: -30,
            background: "#fff", borderRadius: 14, padding: "10px 14px",
            boxShadow: "0 8px 32px rgba(10,22,40,0.12)", border: "1px solid #E8F5EE",
            display: "flex", alignItems: "center", gap: 8,
            animation: "pageIn 600ms ease-out 1000ms both",
          }}>
            {I.shield("#1B6B4E", 18)}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0A1628" }}>Artisan certifié</div>
              <div style={{ fontSize: 8, color: "#6B7280" }}>SIRET • Décennale • RGE</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Trust pillars */}
    <section style={{ padding: "64px 40px", background: T.card }}>
      <div className="grid-3" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
        {[
          { icon: I.shield(T.accent, 28), title: "Artisans certifiés", desc: "Chaque artisan est audité, vérifié et assuré avant d'être référencé sur la plateforme." },
          { icon: I.lock(T.accent, 28), title: "Paiement séquestre", desc: "Votre argent est bloqué sur un compte sécurisé. L'artisan n'est payé qu'après validation par Nova." },
          { icon: I.check(T.accent, 28), title: "Validation Nova", desc: "Notre équipe contrôle et valide chaque mission avant de libérer le paiement vers l'artisan." },
        ].map((p, i) => (
          <div key={i} style={{
            padding: "32px 28px", borderRadius: 20,
            background: T.surface, border: `1px solid ${T.border}`,
            transition: "transform 200ms ease, box-shadow 200ms ease",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, background: T.accentBg,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
            }}>{p.icon}</div>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: T.t1, margin: "0 0 8px" }}>{p.title}</h3>
            <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section style={{ padding: "64px 40px", background: T.bg }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 32, fontWeight: 800, color: T.t1, margin: "0 0 40px" }}>
          Comment ça marche
        </h2>
        <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
          {[
            { step: "1", title: "Trouvez", desc: "Recherchez un artisan certifié par catégorie ou urgence" },
            { step: "2", title: "Réservez", desc: "Prenez rendez-vous et acceptez le devis en ligne" },
            { step: "3", title: "Payez en séquestre", desc: "Votre argent est bloqué, pas débité" },
            { step: "4", title: "On valide", desc: "Nova vérifie la mission et libère le paiement" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
              {i < 3 && <div style={{
                position: "absolute", top: 20, left: "60%", width: "80%", height: 2,
                background: T.borderMed, zIndex: 0,
              }}/>}
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#0A4030", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, margin: "0 auto 12px",
                position: "relative", zIndex: 1,
              }}>{s.step}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: T.t1, margin: "0 0 4px" }}>{s.title}</h4>
              <p style={{ fontSize: 13, color: T.t3, lineHeight: 1.5, margin: 0, padding: "0 8px" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* App Demo Preview */}
    <section style={{ padding: "80px 40px", background: dm ? "#32323C" : "linear-gradient(170deg, #0A4030 0%, #1B6B4E 100%)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 16px", marginBottom: 16, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
            Découvrez la plateforme
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
            Testez Nova en mode démo
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 500, margin: "0 auto" }}>
            Explorez l'interface complète sans créer de compte. Choisissez votre profil.
          </p>
        </div>

        {/* Two demo cards */}
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, margin: "0 auto 48px" }}>
          {/* Client card */}
          <div onClick={() => loginAs("client")} style={{
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)",
            borderRadius: 24, padding: "32px 28px", cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.12)",
            transition: "transform 200ms ease, background 200ms ease",
          }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 28 }}>🏠</div>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Je suis particulier</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 20px" }}>Trouvez un artisan certifié, réservez en ligne, payez en séquestre. Suivi temps réel de l'intervention.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {["Recherche artisans", "Réservation", "Vidéo diagnostic", "Signature devis", "Paiement 3x/4x", "Suivi live"].map(f => (
                <span key={f} style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(142,207,176,0.15)", color: "#8ECFB0", fontSize: 11, fontWeight: 600 }}>{f}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8ECFB0", fontWeight: 700, fontSize: 15 }}>
              Explorer le mode client <span style={{ fontSize: 18 }}>→</span>
            </div>
          </div>

          {/* Artisan card */}
          <div onClick={() => loginAs("artisan")} style={{
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)",
            borderRadius: 24, padding: "32px 28px", cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.12)",
            transition: "transform 200ms ease, background 200ms ease",
          }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 28 }}>🔧</div>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Je suis artisan</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 20px" }}>Gérez vos missions, créez vos devis et factures, suivez vos paiements. Tout depuis un seul tableau de bord.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {["Dashboard KPIs", "Devis en ligne", "Facturation auto", "Comptabilité", "QR code profil", "Carnet clients"].map(f => (
                <span key={f} style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(245,166,35,0.15)", color: "#F5D090", fontSize: 11, fontWeight: 600 }}>{f}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#F5D090", fontWeight: 700, fontSize: 15 }}>
              Explorer le mode artisan <span style={{ fontSize: 18 }}>→</span>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, maxWidth: 900, margin: "0 auto" }}>
          {[
            { icon: I.lock("#8ECFB0", 22), title: "Séquestre", desc: "Paiement bloqué jusqu'à validation" },
            { icon: I.shield("#8ECFB0", 22), title: "Certifications", desc: "SIRET, décennale, RGE vérifiés" },
            { icon: I.check("#8ECFB0", 22), title: "Suivi live", desc: "Artisan en route, sur place, terminé" },
            { icon: I.doc("#8ECFB0", 22), title: "Tout en ligne", desc: "Devis, signature, facture, compta" },
          ].map((f, i) => (
            <div key={i} style={{ textAlign: "center", padding: "20px 12px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Mobile App Preview */}
    <section style={{ padding: "80px 40px", background: T.bg, overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>

        {/* iPhone mockup */}
        <div style={{ flex: "0 0 auto", position: "relative" }}>
          {/* Phone frame */}
          <div style={{
            width: 280, height: 570, borderRadius: 44,
            background: dm ? "#1a1a22" : "#0A1628",
            padding: 12, boxShadow: dm ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(10,22,40,0.15)",
            position: "relative",
          }}>
            {/* Notch */}
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 100, height: 28, borderRadius: "0 0 18px 18px", background: dm ? "#1a1a22" : "#0A1628", zIndex: 2 }}>
              <div style={{ width: 50, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "16px auto 0" }}/>
            </div>
            {/* Screen */}
            <div style={{
              width: "100%", height: "100%", borderRadius: 34,
              background: "linear-gradient(170deg, #E8F5EE 0%, #F5FAF7 100%)",
              overflow: "hidden", position: "relative",
            }}>
              {/* Status bar */}
              <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#0A1628" }}>9:41</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <div style={{ width: 14, height: 10, borderRadius: 2, border: "1px solid #0A1628" }}><div style={{ width: "70%", height: "100%", background: "#0A1628", borderRadius: 1 }}/></div>
                </div>
              </div>
              {/* App content — Dashboard preview */}
              <div style={{ padding: "16px 16px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  {I.shield("#1B6B4E", 18)}
                  <span style={{ fontFamily: "'Manrope'", fontSize: 15, fontWeight: 800, color: "#0A1628" }}>Nova</span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Bonjour Sophie</div>
                <div style={{ fontFamily: "'Manrope'", fontSize: 16, fontWeight: 800, color: "#0A1628", marginBottom: 12 }}>Votre espace client</div>

                {/* Mini KPIs */}
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {[{ v: "2", l: "En cours" }, { v: "570€", l: "Séquestre" }, { v: "8", l: "Terminées" }].map((k, i) => (
                    <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 12, padding: "8px 6px", textAlign: "center", border: "1px solid #D4EBE0" }}>
                      <div style={{ fontFamily: "'DM Mono'", fontSize: 13, fontWeight: 700, color: "#1B6B4E" }}>{k.v}</div>
                      <div style={{ fontSize: 8, color: "#6B7280" }}>{k.l}</div>
                    </div>
                  ))}
                </div>

                {/* Mini mission card */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "10px 12px", marginBottom: 8, border: "1px solid #D4EBE0" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #E8F5EE, #D4EBE0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#1B6B4E" }}>JM</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#0A1628" }}>Jean-Michel P.</div>
                      <div style={{ fontSize: 9, color: "#6B7280" }}>Réparation fuite • 15 mars</div>
                    </div>
                    <span style={{ fontSize: 8, fontWeight: 700, color: "#22C88A", background: "#E8F5EE", padding: "2px 6px", borderRadius: 4 }}>En cours</span>
                  </div>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, padding: "10px 12px", marginBottom: 8, border: "1px solid #D4EBE0" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #E8F5EE, #D4EBE0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#1B6B4E" }}>SM</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#0A1628" }}>Sophie M.</div>
                      <div style={{ fontSize: 9, color: "#6B7280" }}>Prise électrique • 10 mars</div>
                    </div>
                    <span style={{ fontSize: 8, fontWeight: 700, color: "#1B6B4E", background: "#E8F5EE", padding: "2px 6px", borderRadius: 4 }}>Terminée</span>
                  </div>
                </div>

                {/* Mini tab bar */}
                <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 6px", marginTop: 10, borderTop: "1px solid #E8F5EE" }}>
                  {["🏠", "🔍", "📋", "🔔", "👤"].map((e, i) => (
                    <div key={i} style={{ fontSize: 16, opacity: i === 0 ? 1 : 0.4 }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Floating badge */}
          <div style={{ position: "absolute", top: 40, right: -20, background: "#E8302A", color: "#fff", padding: "6px 14px", borderRadius: 12, fontSize: 11, fontWeight: 700, boxShadow: "0 4px 16px rgba(232,48,42,0.3)" }}>Nouveau</div>
        </div>

        {/* Text content */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.accentBg, borderRadius: 20, padding: "6px 16px", marginBottom: 20, fontSize: 12, fontWeight: 600, color: T.accentText }}>
            Application mobile
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 32, fontWeight: 800, color: T.t1, margin: "0 0 12px" }}>
            Nova dans votre poche
          </h2>
          <p style={{ fontSize: 15, color: T.t2, lineHeight: 1.7, margin: "0 0 28px" }}>
            Retrouvez toutes les fonctionnalités de la plateforme sur votre smartphone. Recevez des notifications en temps réel, suivez l'artisan en route, signez vos devis et payez en séquestre — où que vous soyez.
          </p>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
            {[
              { icon: "📲", title: "Notifications push", desc: "Soyez alerté en temps réel : nouveau devis, artisan en route, intervention terminée" },
              { icon: "✍️", title: "Signature tactile", desc: "Signez vos devis directement sur l'écran avec votre doigt" },
              { icon: "📹", title: "Vidéo diagnostic", desc: "Filmez votre problème et envoyez-le à l'artisan avant l'intervention" },
              { icon: "🌙", title: "Mode sombre", desc: "Interface adaptée pour une utilisation confortable de nuit" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: T.t3, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Store badges */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* App Store */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#000", borderRadius: 12, padding: "10px 20px", cursor: "pointer" }}>
              <svg width="24" height="24" viewBox="0 0 814 1000" fill="#fff"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.6-105.6-210.8-105.6-334.1C0 397.1 78.6 283.9 190.5 283.9c64.2 0 117.8 42.8 155.5 42.8 39 0 99.7-45.2 172.8-45.2 27.8 0 127.7 2.5 193.3 59.4z"/><path d="M554.1 0c-7.8 66.3-67.8 134.3-134.2 134.3-12 0-24-1.3-24-13.3 0-5.8 5.8-28.3 29-57.7C449.8 32.7 515.5 0 554.1 0z"/></svg>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>Télécharger sur</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans'" }}>App Store</div>
              </div>
            </div>
            {/* Google Play */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#000", borderRadius: 12, padding: "10px 20px", cursor: "pointer" }}>
              <svg width="22" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l12.8 8.5a1 1 0 010 1.6l-12.8 8.5c-.66.5-1.6.03-1.6-.8z" fill="#fff"/><path d="M3.5 3.5l10 8.5-10 8.5" stroke="#34A853" strokeWidth="0"/><path d="M14.5 7L3.5 3.5" stroke="#EA4335" strokeWidth="0"/><path d="M14.5 17L3.5 20.5" stroke="#4285F4" strokeWidth="0"/></svg>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>Disponible sur</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans'" }}>Google Play</div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 11, color: T.hint, marginTop: 10 }}>Disponible sur iOS 15+ et Android 12+. Gratuit.</p>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section style={{ padding: "64px 40px", background: T.card }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: T.t1, textAlign: "center", margin: "0 0 36px" }}>
          Ils nous font confiance
        </h2>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {[
            { name: "Caroline L.", city: "Paris 4e", text: "Le séquestre m'a rassurée. Je savais que mon argent était protégé. L'artisan était ponctuel et professionnel.", rating: 5 },
            { name: "Pierre M.", city: "Lyon 6e", text: "Fuite d'eau un dimanche soir, intervention en 1h30. Le suivi en temps réel est top, je voyais l'artisan arriver.", rating: 5 },
            { name: "Amélie R.", city: "Bordeaux", text: "J'ai signé le devis en ligne, payé en 3x via Klarna. Aucune surprise sur la facture. Je recommande à 100%.", rating: 5 },
          ].map((t, i) => (
            <div key={i} style={{ background: T.surface, borderRadius: 18, padding: "24px", border: `1px solid ${T.border}` }}>
              <div style={{ color: "#F5A623", fontSize: 14, marginBottom: 10 }}>{"★".repeat(t.rating)}</div>
              <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.7, margin: "0 0 16px" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: T.avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.accent }}>{t.name[0]}{t.name.split(" ")[1]?.[0]}</div>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{t.name}</div><div style={{ fontSize: 11, color: T.t3 }}>{t.city}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{
      padding: "64px 40px", textAlign: "center",
      background: dm ? "#32323C" : "#E8F5EE",
    }}>
      <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: T.t1, margin: "0 0 12px" }}>
        Prêt à trouver votre artisan ?
      </h2>
      <p style={{ fontSize: 15, color: T.t2, margin: "0 0 28px" }}>
        Inscription gratuite. Aucun engagement.
      </p>
      <button onClick={() => setPage("signup")} style={{
        padding: "14px 40px", borderRadius: 12,
        background: "#0A4030", color: "#fff", border: "none",
        fontSize: 15, fontWeight: 600, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        fontFamily: "'DM Sans', sans-serif",
      }}>Créer un compte gratuitement</button>
    </section>
  </div>
);

/* ━━━ PAGE: LOGIN ━━━ */
const PageLogin = ({ setPage, T, dm, loginAs }) => (
  <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: T.bg }}>
    <div style={{ width: "100%", maxWidth: 420 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 18, margin: "0 auto 16px",
          background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center",
        }}>{I.shield(T.accent, 28)}</div>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: T.t1, margin: "0 0 4px" }}>Connexion</h1>
        <p style={{ fontSize: 14, color: T.t3 }}>Accédez à votre espace Nova</p>
      </div>

      <div style={{ background: T.card, borderRadius: 20, padding: "32px 28px", boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
        {/* SSO */}
        {[
          { label: "Continuer avec Google", bg: dm ? T.surface : "#fff", color: T.t1, border: T.borderMed, icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
          { label: "Continuer avec Apple", bg: dm ? "#EEEEF0" : "#000", color: dm ? "#0A1628" : "#fff", border: "none", icon: <svg width="18" height="18" viewBox="0 0 814 1000" fill={dm?"#0A1628":"#fff"}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.6-105.6-210.8-105.6-334.1C0 397.1 78.6 283.9 190.5 283.9c64.2 0 117.8 42.8 155.5 42.8 39 0 99.7-45.2 172.8-45.2 27.8 0 127.7 2.5 193.3 59.4z"/><path d="M554.1 0c-7.8 66.3-67.8 134.3-134.2 134.3-12 0-24-1.3-24-13.3 0-5.8 5.8-28.3 29-57.7C449.8 32.7 515.5 0 554.1 0z"/></svg> },
        ].map((btn, i) => (
          <button key={i} style={{
            width: "100%", height: 48, borderRadius: 12, marginBottom: 10,
            background: btn.bg, color: btn.color, border: btn.border ? `1px solid ${btn.border}` : "none",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: "'DM Sans', sans-serif",
          }}>{btn.icon} {btn.label}</button>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: T.borderMed }}/><span style={{ fontSize: 12, color: T.hint }}>ou</span><div style={{ flex: 1, height: 1, background: T.borderMed }}/>
        </div>

        {["Email", "Mot de passe"].map((label, i) => (
          <input key={i} placeholder={label} type={i === 1 ? "password" : "email"} required minLength={i === 1 ? 8 : undefined} style={{
            width: "100%", height: 48, borderRadius: 12, marginBottom: 10,
            border: `1px solid ${T.borderMed}`, padding: "0 14px",
            fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
            boxSizing: "border-box", background: T.inputBg, color: T.t1,
          }}/>
        ))}
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <button style={{ background: "none", border: "none", fontSize: 12, color: T.accent, cursor: "pointer", fontWeight: 500 }}>Mot de passe oublié ?</button>
        </div>
        <button style={{
          width: "100%", height: 48, borderRadius: 12,
          background: "#0A4030", color: "#fff", border: "none",
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}>Se connecter</button>
      </div>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: T.t3 }}>
        Pas encore de compte ?{" "}
        <button onClick={() => setPage("signup")} style={{
          background: "none", border: "none", color: T.accent, cursor: "pointer",
          fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
        }}>Créer un compte</button>
      </p>

      {/* Demo mode */}
      <div style={{
        marginTop: 24, padding: "16px 20px", borderRadius: 16,
        background: T.accentBg, border: `1px dashed ${T.accentBorder}`, textAlign: "center",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.accentText, marginBottom: 10 }}>Mode démo</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={() => loginAs("client")} style={{
            padding: "10px 28px", borderRadius: 10,
            background: T.card, color: T.t1, border: `1px solid ${T.borderMed}`,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Client</button>
          <button onClick={() => loginAs("artisan")} style={{
            padding: "10px 28px", borderRadius: 10,
            background: T.card, color: T.t1, border: `1px solid ${T.borderMed}`,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Artisan</button>
        </div>
      </div>
    </div>
  </div>
);

/* ━━━ PAGE: SIGNUP ━━━ */
const PageSignup = ({ setPage, T, dm }) => {
  const [role, setRole] = useState("client");
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: T.bg }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: T.t1, margin: "0 0 4px" }}>Créer un compte</h1>
          <p style={{ fontSize: 14, color: T.t3 }}>Rejoignez Nova gratuitement</p>
        </div>

        <div style={{ background: T.card, borderRadius: 20, padding: "32px 28px", boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
          {/* Role selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, background: T.surface, borderRadius: 12, padding: 4 }}>
            {[{ id: "client", label: "Particulier" }, { id: "artisan", label: "Artisan" }].map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                flex: 1, padding: "10px", borderRadius: 10,
                background: role === r.id ? T.card : "none",
                color: role === r.id ? T.t1 : T.t3,
                border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: role === r.id ? T.shadow : "none",
                transition: "all 200ms ease",
              }}>{r.label}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {["Prénom", "Nom"].map(label => (
              <input key={label} placeholder={label} style={{
                width: "100%", height: 48, borderRadius: 12,
                border: `1px solid ${T.borderMed}`, padding: "0 14px",
                fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
                boxSizing: "border-box", background: T.inputBg, color: T.t1,
              }}/>
            ))}
          </div>
          {["Email", "Téléphone", "Mot de passe"].map((label, i) => (
            <input key={label} placeholder={label} type={i === 0 ? "email" : i === 2 ? "password" : "tel"} required minLength={i === 2 ? 8 : undefined} style={{
              width: "100%", height: 48, borderRadius: 12, marginBottom: 10,
              border: `1px solid ${T.borderMed}`, padding: "0 14px",
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
              boxSizing: "border-box", background: T.inputBg, color: T.t1,
            }}/>
          ))}

          {role === "artisan" && (
            <>
              <div style={{ height: 1, background: T.borderMed, margin: "12px 0" }}/>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 10 }}>Informations entreprise</div>
              {["Raison sociale", "SIRET", "Code APE"].map(label => (
                <input key={label} placeholder={label} style={{
                  width: "100%", height: 48, borderRadius: 12, marginBottom: 10,
                  border: `1px solid ${T.borderMed}`, padding: "0 14px",
                  fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
                  boxSizing: "border-box", background: T.inputBg, color: T.t1,
                }}/>
              ))}
            </>
          )}

          <button style={{
            width: "100%", height: 48, borderRadius: 12, marginTop: 8,
            background: "#0A4030", color: "#fff", border: "none",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>Créer mon compte</button>

          <p style={{ fontSize: 11, color: T.hint, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
            En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: T.t3 }}>
          Déjà un compte ?{" "}
          <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Se connecter</button>
        </p>
      </div>
    </div>
  );
};

/* ━━━ PAGE: SUPPORT ━━━ */
const PageSupport = ({ T, dm }) => {
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour ! Je suis l'assistant Nova. Comment puis-je vous aider ?", time: "14:01" },
  ]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [emailSent, setEmailSent] = useState(false);

  const addAttachment = () => {
    const names = ["capture_ecran.png", "photo_probleme.jpg", "devis_scan.pdf"];
    setAttachments(a => [...a, { name: names[a.length % names.length], size: `${(Math.random()*3+0.5).toFixed(1)} Mo` }]);
  };

  const sendMsg = () => {
    if (!input.trim() && !attachments.length) return;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMessages(m => [...m, { from: "user", text: input || null, attachments: attachments.length ? [...attachments] : null, time: now }]);
    setInput(""); setAttachments([]);
    setTimeout(() => {
      setMessages(m => [...m, { from: "bot", text: "Merci pour votre message. Un conseiller Nova va prendre en charge votre demande. Temps de réponse moyen : 15 minutes.", time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: T.t1, margin: "0 0 4px" }}>Support</h1>
      <p style={{ fontSize: 14, color: T.t3, margin: "0 0 24px" }}>Contactez notre équipe par chat ou par email</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{ id: "chat", label: "Chat en direct" }, { id: "email", label: "Email" }].map(t => (
          <button key={t.id} onClick={() => setMode(t.id)} style={{
            flex: 1, padding: "10px", borderRadius: 12,
            background: mode === t.id ? "#0A4030" : T.card,
            color: mode === t.id ? "#fff" : T.t2,
            border: mode === t.id ? "none" : `1px solid ${T.borderMed}`,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>{t.label}</button>
        ))}
      </div>

      {mode === "chat" ? (
        <div style={{ background: T.card, borderRadius: 20, boxShadow: T.shadow, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C88A" }}/>
            <span style={{ fontSize: 13, color: "#22C88A", fontWeight: 600 }}>Support en ligne</span>
            <span style={{ fontSize: 12, color: T.hint }}>• Répond en ~15 min</span>
          </div>

          <div style={{ padding: "20px", minHeight: 360, maxHeight: 400, overflowY: "auto" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div style={{
                  maxWidth: "70%", padding: "12px 16px", borderRadius: 16,
                  background: msg.from === "user" ? "#0A4030" : T.surface,
                  color: msg.from === "user" ? "#fff" : T.t1,
                  borderBottomRightRadius: msg.from === "user" ? 4 : 16,
                  borderBottomLeftRadius: msg.from === "user" ? 16 : 4,
                }}>
                  {msg.text && <div style={{ fontSize: 14, lineHeight: 1.6 }}>{msg.text}</div>}
                  {msg.attachments && msg.attachments.map((att, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "center", gap: 8, marginTop: 8,
                      padding: "6px 10px", borderRadius: 8,
                      background: msg.from === "user" ? "rgba(255,255,255,0.1)" : T.bg,
                    }}>
                      {I.doc(msg.from === "user" ? "#fff" : T.accent, 14)}
                      <span style={{ fontSize: 12, fontWeight: 500, color: msg.from === "user" ? "#fff" : T.t1 }}>{att.name}</span>
                      <span style={{ fontSize: 10, color: msg.from === "user" ? "rgba(255,255,255,0.5)" : T.hint }}>{att.size}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, marginTop: 4, color: msg.from === "user" ? "rgba(255,255,255,0.5)" : T.hint, textAlign: "right" }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {attachments.length > 0 && (
            <div style={{ padding: "8px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {attachments.map((att, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "4px 10px",
                  borderRadius: 8, background: T.surface, border: `1px solid ${T.borderMed}`, fontSize: 12,
                }}>
                  {I.doc(T.accent, 12)} <span style={{ color: T.t1 }}>{att.name}</span>
                  <button onClick={() => setAttachments(a => a.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: T.hint, fontSize: 14, padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={addAttachment} style={{
              width: 40, height: 40, borderRadius: 10, background: T.surface, border: `1px solid ${T.borderMed}`,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>{I.clip(T.accent)}</button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Votre message..." style={{
                flex: 1, height: 40, borderRadius: 10, border: `1px solid ${T.borderMed}`,
                padding: "0 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                outline: "none", background: T.inputBg, color: T.t1,
              }}/>
            <button onClick={sendMsg} style={{
              width: 40, height: 40, borderRadius: 10, background: "#0A4030", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>{I.send()}</button>
          </div>
        </div>
      ) : (
        <div style={{ background: T.card, borderRadius: 20, padding: "32px 28px", boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
          {emailSent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20, background: "rgba(34,200,138,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              }}>{I.check("#22C88A", 32)}</div>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: T.t1, margin: "0 0 6px" }}>Email envoyé !</h3>
              <p style={{ fontSize: 14, color: T.t3 }}>Notre équipe vous répondra sous 24h.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 14px", borderRadius: 12, background: T.accentBg, border: `1px solid ${T.accentBorder}` }}>
                {I.clock(T.accent, 16)}<span style={{ fontSize: 13, color: T.accentText }}>Réponse sous 24h ouvrées</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: T.t3, display: "block", marginBottom: 6 }}>Sujet</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Problème de paiement", "Litige", "Question technique", "Mon compte", "Autre"].map((s, i) => (
                    <button key={s} style={{
                      padding: "8px 14px", borderRadius: 10,
                      background: i === 0 ? "#0A4030" : T.surface, color: i === 0 ? "#fff" : T.t2,
                      border: i === 0 ? "none" : `1px solid ${T.borderMed}`,
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              <textarea placeholder="Décrivez votre problème en détail..." style={{
                width: "100%", height: 140, borderRadius: 14, border: `1px solid ${T.borderMed}`,
                padding: "14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                resize: "none", outline: "none", boxSizing: "border-box", background: T.inputBg, color: T.t1,
                marginBottom: 14,
              }}/>
              <button style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%", marginBottom: 20,
                background: T.accentBg, border: `1.5px dashed ${T.accentBorder}`,
                borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                fontSize: 13, color: T.accent, fontWeight: 600,
              }}>{I.camera(T.accent)} Joindre une capture d'écran</button>
              <button onClick={() => setEmailSent(true)} style={{
                width: "100%", height: 48, borderRadius: 12,
                background: "#0A4030", color: "#fff", border: "none",
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>Envoyer le message</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ━━━ PAGE: SETTINGS ━━━ */
const PageSettings = ({ T, dm, setDarkMode, setPage }) => {
  const [modal, setModal] = useState(null);
  const [twoFA, setTwoFA] = useState(false);
  const [lang, setLang] = useState("fr");
  const [tz, setTz] = useState("Europe/Paris");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const Toggle = ({ active, onToggle }) => (
    <button onClick={onToggle} style={{
      width: 48, height: 28, borderRadius: 14, border: "none", cursor: "pointer",
      background: active ? "#0A4030" : T.borderMed, position: "relative", transition: "background 200ms ease",
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: active ? 23 : 3,
        transition: "left 200ms ease", boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}/>
    </button>
  );

  const Section = ({ title, children }) => (
    <div style={{ background: T.card, borderRadius: 20, padding: "4px 24px", marginBottom: 16, border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
      <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.border}`, fontSize: 15, fontWeight: 700, color: T.t1 }}>{title}</div>
      {children}
    </div>
  );

  const Row = ({ icon, label, sub, right, action }) => (
    <div onClick={action} style={{
      display: "flex", alignItems: "center", gap: 14, padding: "16px 0",
      borderBottom: `1px solid ${T.border}`, cursor: action ? "pointer" : "default",
      transition: "background 150ms ease",
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.t1 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: T.t3, marginTop: 1 }}>{sub}</div>}
      </div>
      {right || <span style={{ fontSize: 14, color: T.hint }}>›</span>}
    </div>
  );

  const Overlay = ({ children, onClose }) => (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.card, borderRadius: 20, padding: "28px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: `1px solid ${T.border}` }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: T.t1, margin: "0 0 24px" }}>Paramètres</h1>

      <Section title="Apparence">
        <Row icon={<span style={{ fontSize: 18 }}>{dm ? "🌙" : "☀️"}</span>} label="Mode sombre" sub={dm ? "Activé" : "Désactivé"} right={<Toggle active={dm} onToggle={() => setDarkMode(!dm)}/>}/>
      </Section>

      <Section title="Sécurité">
        <Row icon={I.lock(T.accent)} label="Changer le mot de passe" sub="Dernière modification il y a 3 mois" action={() => { setModal("password"); setPwSaved(false); }}/>
        <Row icon={I.shield(T.accent)} label="Authentification à deux facteurs" sub={twoFA ? "Activée" : "Non activée"} right={<Toggle active={twoFA} onToggle={() => setTwoFA(!twoFA)}/>}/>
      </Section>

      <Section title="Notifications">
        <Row icon={I.chat(T.accent)} label="Préférences de notification" sub="Push, email, SMS" action={() => setPage("notif-prefs")}/>
      </Section>

      <Section title="Préférences">
        <Row icon={I.mapPin(T.accent)} label="Langue" sub={lang === "fr" ? "Français" : lang === "en" ? "English" : "Español"} action={() => setModal("lang")}/>
        <Row icon={I.clock(T.accent)} label="Fuseau horaire" sub={tz} action={() => setModal("tz")}/>
      </Section>

      <Section title="Légal">
        <Row icon={I.doc(T.accent)} label="Conditions d'utilisation" action={() => setModal("cgu")}/>
        <Row icon={I.doc(T.accent)} label="Politique de confidentialité" action={() => setModal("privacy")}/>
        <Row icon={I.doc(T.accent)} label="Mentions légales" action={() => setModal("mentions")}/>
      </Section>

      <div style={{ background: T.card, borderRadius: 20, padding: "4px 24px", border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
        <Row icon={I.logout("#E8302A")} label="Se déconnecter" action={() => setPage("home")}/>
        <div onClick={() => setDeleteConfirm(true)} style={{ padding: "14px 0", cursor: "pointer" }}>
          <span style={{ fontSize: 13, color: "#E8302A", fontWeight: 500 }}>Supprimer mon compte</span>
        </div>
      </div>

      <p style={{ fontSize: 11, color: T.hint, textAlign: "center", marginTop: 24 }}>Nova v1.0.0 — © 2026 Nova SAS</p>

      {/* Modal: Password */}
      {modal === "password" && (
        <Overlay onClose={() => setModal(null)}>
          {pwSaved ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              {I.check("#22C88A", 32)}
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: T.t1, margin: "12px 0 4px" }}>Mot de passe modifié</h3>
              <p style={{ fontSize: 13, color: T.t3, margin: "0 0 16px" }}>Votre nouveau mot de passe est actif.</p>
              <button onClick={() => setModal(null)} style={{ padding: "10px 28px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Fermer</button>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: T.t1, margin: "0 0 16px" }}>Changer le mot de passe</h3>
              {["Mot de passe actuel", "Nouveau mot de passe", "Confirmer le mot de passe"].map(l => (
                <input key={l} type="password" placeholder={l} style={{ width: "100%", height: 44, borderRadius: 12, border: `1px solid ${T.borderMed}`, padding: "0 14px", fontSize: 14, fontFamily: "'DM Sans'", outline: "none", boxSizing: "border-box", background: T.inputBg, color: T.t1, marginBottom: 10 }}/>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: T.surface, color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
                <button onClick={() => setPwSaved(true)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Enregistrer</button>
              </div>
            </>
          )}
        </Overlay>
      )}

      {/* Modal: Language */}
      {modal === "lang" && (
        <Overlay onClose={() => setModal(null)}>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: T.t1, margin: "0 0 16px" }}>Langue</h3>
          {[{ id: "fr", l: "Français" },{ id: "en", l: "English" },{ id: "es", l: "Español" }].map(o => (
            <div key={o.id} onClick={() => { setLang(o.id); setModal(null); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: o.id !== "fr" ? `1px solid ${T.border}` : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 14, fontWeight: lang === o.id ? 600 : 400, color: T.t1 }}>{o.l}</span>
              {lang === o.id && I.check("#22C88A", 18)}
            </div>
          ))}
        </Overlay>
      )}

      {/* Modal: Timezone */}
      {modal === "tz" && (
        <Overlay onClose={() => setModal(null)}>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: T.t1, margin: "0 0 16px" }}>Fuseau horaire</h3>
          {["Europe/Paris","Europe/London","America/New_York","Asia/Tokyo"].map(z => (
            <div key={z} onClick={() => { setTz(z); setModal(null); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: z !== "Europe/Paris" ? `1px solid ${T.border}` : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 14, fontWeight: tz === z ? 600 : 400, color: T.t1 }}>{z}</span>
              {tz === z && I.check("#22C88A", 18)}
            </div>
          ))}
        </Overlay>
      )}

      {/* Modal: Legal docs */}
      {(modal === "cgu" || modal === "privacy" || modal === "mentions") && (
        <Overlay onClose={() => setModal(null)}>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: T.t1, margin: "0 0 16px" }}>
            {modal === "cgu" ? "Conditions d'utilisation" : modal === "privacy" ? "Politique de confidentialité" : "Mentions légales"}
          </h3>
          <div style={{ maxHeight: 300, overflowY: "auto", fontSize: 13, color: T.t2, lineHeight: 1.8 }}>
            <p><strong style={{ color: T.t1 }}>Article 1 — Objet</strong><br/>Nova est une plateforme de mise en relation entre particuliers et artisans certifiés. Le service inclut un système de paiement sécurisé par séquestre.</p>
            <p style={{ marginTop: 12 }}><strong style={{ color: T.t1 }}>Article 2 — Inscription</strong><br/>L'inscription est gratuite et ouverte à toute personne physique majeure ou personne morale. L'utilisateur s'engage à fournir des informations exactes.</p>
            <p style={{ marginTop: 12 }}><strong style={{ color: T.t1 }}>Article 3 — Paiement séquestre</strong><br/>Les fonds versés par le client sont bloqués sur un compte séquestre géré par Nova. Le paiement est libéré à l'artisan uniquement après validation de la mission par l'équipe Nova.</p>
            <p style={{ marginTop: 12 }}><strong style={{ color: T.t1 }}>Article 4 — Protection des données</strong><br/>Nova s'engage à protéger les données personnelles conformément au RGPD. Les données bancaires sont chiffrées et ne sont jamais stockées intégralement.</p>
          </div>
          <button onClick={() => setModal(null)} style={{ width: "100%", padding: "10px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 16 }}>Fermer</button>
        </Overlay>
      )}

      {/* Modal: Delete account */}
      {deleteConfirm && (
        <Overlay onClose={() => setDeleteConfirm(false)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(232,48,42,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              {I.logout("#E8302A", 24)}
            </div>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: T.t1, margin: "0 0 6px" }}>Supprimer votre compte ?</h3>
            <p style={{ fontSize: 13, color: T.t3, margin: "0 0 20px", lineHeight: 1.6 }}>Cette action est irréversible. Toutes vos données, missions et paiements seront supprimés définitivement.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeleteConfirm(false)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: T.surface, color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
              <button onClick={() => { setDeleteConfirm(false); setPage("home"); }} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#E8302A", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};

/* ━━━ SHARED: Card ━━━ */
const Card = ({ T, children, style, onClick }) => (
  <div onClick={onClick} style={{ background: T.card, borderRadius: 20, padding: "24px", boxShadow: T.shadow, border: `1px solid ${T.border}`, ...style }}>{children}</div>
);
const Btn = ({ T, children, onClick, full, small, outline, disabled, style: s = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "8px 14px" : "14px 24px", borderRadius: small ? 10 : 14,
    background: disabled ? T.borderMed : outline ? T.card : "#0A4030",
    color: disabled ? T.t3 : outline ? T.accent : "#fff",
    border: outline ? `1px solid ${T.borderMed}` : "none",
    fontSize: small ? 12 : 15, fontWeight: 700, cursor: disabled ? "default" : "pointer",
    fontFamily: "'Manrope', sans-serif", width: full ? "100%" : "auto",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...s,
  }}>{children}</button>
);
const Badge = ({ label, color, T }) => (
  <span style={{ padding: "4px 10px", borderRadius: 8, background: `${color}12`, color, fontSize: 11, fontWeight: 600 }}>{label}</span>
);
const Stat = ({ T, label, value, icon }) => (
  <div style={{ background: T.card, borderRadius: 16, padding: "20px", border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: T.t3 }}>{label}</span><span style={{ fontSize: 20 }}>{icon}</span>
    </div>
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 700, color: T.t1 }}>{value}</div>
  </div>
);

/* ━━━ TOAST NOTIFICATION ━━━ */
const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  const ToastUI = () => toast ? (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
      padding: "14px 28px", borderRadius: 16,
      background: toast.type === "success" ? "#0A4030" : toast.type === "error" ? "#E8302A" : "#F5A623",
      color: "#fff", fontSize: 14, fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      animation: "toastIn 300ms ease-out",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {toast.type === "success" ? I.check("#fff", 18) : toast.type === "error" ? "✗" : "⚠"}
      {toast.msg}
    </div>
  ) : null;
  return { show, ToastUI };
};

/* ━━━ SKELETON COMPONENTS ━━━ */
const Skel = ({ w = "100%", h = 16, r = 8, style: s = {} }) => (
  <div className="skeleton" style={{ width: w, height: h, borderRadius: r, ...s }}/>
);
const SkelCard = ({ T }) => (
  <Card T={T} style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
      <Skel w={48} h={48} r={16}/><div style={{ flex: 1 }}><Skel w="60%" h={14} style={{ marginBottom: 8 }}/><Skel w="40%" h={10}/></div>
    </div>
    <Skel w="100%" h={10} style={{ marginBottom: 8 }}/><Skel w="75%" h={10}/>
  </Card>
);

/* ━━━ PAGE WRAPPER (transition + responsive container) ━━━ */
const Page = ({ children, wide, narrow }) => (
  <div className="page-enter page-container" style={{ maxWidth: wide ? 900 : narrow ? 500 : 700, margin: "0 auto", padding: "100px 24px 60px" }}>
    {children}
  </div>
);
const PageClientDash = ({ setPage, T }) => (
  <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 4px" }}>Bonjour Sophie</h1>
        <p style={{ fontSize: 14, color: T.t3, margin: 0 }}>Bienvenue sur votre espace client</p>
      </div>
      <button onClick={() => setPage("search")} style={{ padding: "10px 24px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
        Trouver un artisan
      </button>
    </div>
    <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
      <div onClick={() => setPage("missions")} style={{ cursor: "pointer" }}><Stat T={T} label="Missions actives" value="2" icon="🔧"/></div>
      <div onClick={() => setPage("missions")} style={{ cursor: "pointer" }}><Stat T={T} label="En séquestre" value="570€" icon="🔒"/></div>
      <div onClick={() => setPage("missions")} style={{ cursor: "pointer" }}><Stat T={T} label="Terminées" value="8" icon="✓"/></div>
    </div>
    {/* Recent missions */}
    <Card T={T} style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.t1, margin: 0 }}>Missions récentes</h3>
        <button onClick={() => setPage("missions")} style={{ background: "none", border: "none", fontSize: 13, color: T.accent, cursor: "pointer", fontWeight: 600 }}>Tout voir →</button>
      </div>
      {[
        { artisan: "Jean-Michel P.", type: "Réparation fuite", date: "15 mars 2026", amount: "320€", status: "En cours", sColor: "#22C88A" },
        { artisan: "Sophie M.", type: "Installation prise", date: "10 mars 2026", amount: "195€", status: "Terminée", sColor: "#1B6B4E" },
        { artisan: "Karim B.", type: "Remplacement serrure", date: "2 mars 2026", amount: "280€", status: "Validée", sColor: "#F5A623" },
      ].map((m, i) => (
        <div key={i} onClick={() => setPage("missions")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: i ? `1px solid ${T.border}` : "none", cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{m.artisan} — {m.type}</div>
            <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>{m.date} • {m.amount}</div>
          </div>
          <Badge label={m.status} color={m.sColor} T={T}/>
        </div>
      ))}
    </Card>
    {/* Quick actions */}
    <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
      {[
        { label: "Urgence 24/7", desc: "Intervention < 2h", icon: "⚡", page: "urgence", accent: "#E8302A" },
        { label: "Notifications", desc: "2 nouvelles", icon: "🔔", page: "notifs-client" },
        { label: "Paiements", desc: "Visa •••• 6411", icon: "💳", page: "payment-methods" },
        { label: "Support", desc: "Chat en direct", icon: "💬", page: "support" },
      ].map((a, i) => (
        <div key={i} onClick={() => setPage(a.page)} style={{
          background: T.card, borderRadius: 16, padding: "20px", cursor: "pointer",
          border: a.accent ? `1px solid ${a.accent}20` : `1px solid ${T.border}`, boxShadow: T.shadow,
        }}>
          <span style={{ fontSize: 24 }}>{a.icon}</span>
          <div style={{ fontSize: 15, fontWeight: 700, color: a.accent || T.t1, marginTop: 8 }}>{a.label}</div>
          <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>{a.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ━━━ PAGE: ARTISAN DASHBOARD ━━━ */
const PageArtisanDash = ({ setPage, T }) => (
  <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 4px" }}>Bonjour Jean-Michel</h1>
        <p style={{ fontSize: 14, color: T.t3, margin: 0 }}>Artisan Certifié Nova • #2847</p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setPage("create-quote")} style={{ padding: "10px 20px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Créer un devis</button>
        <button onClick={() => setPage("create-invoice")} style={{ padding: "10px 20px", borderRadius: 12, background: T.card, color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Facture</button>
      </div>
    </div>
    <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
      <div onClick={() => setPage("payments")} style={{ cursor: "pointer" }}><Stat T={T} label="Revenus du mois" value="4 820€" icon="💶"/></div>
      <div onClick={() => setPage("docs")} style={{ cursor: "pointer" }}><Stat T={T} label="Missions en cours" value="3" icon="🔧"/></div>
      <div onClick={() => setPage("docs")} style={{ cursor: "pointer" }}><Stat T={T} label="Devis en attente" value="2" icon="📄"/></div>
      <div onClick={() => setPage("profile-artisan")} style={{ cursor: "pointer" }}><Stat T={T} label="Note moyenne" value="★ 4.9" icon="⭐"/></div>
    </div>
    {/* Urgent demand */}
    <Card T={T} style={{ marginBottom: 20, border: "1px solid rgba(232,48,42,0.12)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#E8302A" }}>Fuite d'eau urgente</div>
            <div style={{ fontSize: 12, color: T.t3 }}>Secteur Paris 9e • Il y a 4 min</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "8px 16px", borderRadius: 10, background: "#22C88A", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Accepter</button>
          <button style={{ padding: "8px 16px", borderRadius: 10, background: T.surface, color: T.t2, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Voir</button>
        </div>
      </div>
    </Card>
    {/* Upcoming RDV */}
    <Card T={T}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: T.t1, margin: "0 0 16px" }}>Prochains rendez-vous</h3>
      {[
        { client: "Pierre M.", type: "Installation robinet", date: "Auj. 14h", status: "Confirmé", sColor: "#22C88A" },
        { client: "Amélie R.", type: "Réparation chauffe-eau", date: "Dem. 9h", status: "En cours", sColor: "#1B6B4E" },
        { client: "Luc D.", type: "Diagnostic fuite", date: "18 mars 11h", status: "En attente", sColor: "#F5A623" },
      ].map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{r.client}</div>
            <div style={{ fontSize: 12, color: T.t3 }}>{r.type} • {r.date}</div>
          </div>
          <Badge label={r.status} color={r.sColor} T={T}/>
        </div>
      ))}
    </Card>
  </div>
);

/* ━━━ PAGE: SEARCH ARTISANS ━━━ */
const PageSearch = ({ setPage, T }) => {
  const [cat, setCat] = useState("all");
  const artisans = [
    { name: "Jean-Michel P.", job: "Plombier", cat: "plumber", rating: 4.9, reviews: 127, price: 65, initials: "JM" },
    { name: "Sophie M.", job: "Électricienne", cat: "electrician", rating: 4.8, reviews: 94, price: 70, initials: "SM" },
    { name: "Karim B.", job: "Serrurier", cat: "locksmith", rating: 5.0, reviews: 83, price: 60, initials: "KB" },
    { name: "Marie D.", job: "Peintre", cat: "painter", rating: 4.7, reviews: 61, price: 55, initials: "MD" },
    { name: "Christophe D.", job: "Chauffagiste", cat: "heating", rating: 4.9, reviews: 89, price: 75, initials: "CD" },
    { name: "Fatima H.", job: "Plombier", cat: "plumber", rating: 4.8, reviews: 91, price: 70, initials: "FH" },
  ];
  const filtered = cat === "all" ? artisans : artisans.filter(a => a.cat === cat);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Trouver un artisan</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[{ id: "all", l: "Tous" },{ id: "plumber", l: "Plombier" },{ id: "electrician", l: "Électricien" },{ id: "locksmith", l: "Serrurier" },{ id: "heating", l: "Chauffagiste" },{ id: "painter", l: "Peintre" }].map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            padding: "8px 18px", borderRadius: 10,
            background: cat === c.id ? "#0A4030" : T.card, color: cat === c.id ? "#fff" : T.t2,
            border: cat === c.id ? "none" : `1px solid ${T.borderMed}`,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{c.l}</button>
        ))}
      </div>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {filtered.map((a, i) => (
          <div key={i} onClick={() => setPage("artisan-detail")} style={{
            background: T.card, borderRadius: 18, padding: "20px", cursor: "pointer",
            border: `1px solid ${T.border}`, boxShadow: T.shadow,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: T.avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: T.accent }}>{a.initials}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.t1 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: T.t3 }}>{a.job}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#F5A623", fontSize: 14 }}>★</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{a.rating}</span>
                <span style={{ fontSize: 12, color: T.t3 }}>({a.reviews} avis)</span>
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700, color: T.t1 }}>{a.price}€/h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ━━━ PAGE: ARTISAN DETAIL ━━━ */
const PageArtisanDetail = ({ setPage, T }) => (
  <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
    <button onClick={() => setPage("search")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
    <Card T={T} style={{ textAlign: "center", marginBottom: 20 }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: T.avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: T.accent, margin: "0 auto 12px" }}>JM</div>
      <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 4px" }}>Jean-Michel P.</h2>
      <p style={{ fontSize: 14, color: T.t3, margin: "0 0 8px" }}>Plombier</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ color: "#F5A623" }}>★★★★★</span><span style={{ fontWeight: 700, color: T.t1 }}>4.9</span><span style={{ color: T.t3 }}>• 127 missions</span>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
        <Badge label="Certifié Nova" color="#B07000" T={T}/>
        <Badge label="Décennale" color="#6B21A8" T={T}/>
        <Badge label="RGE" color="#92400E" T={T}/>
      </div>
    </Card>
    <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
      {[["65€/h","Tarif"],["Offert","Déplacement"],["Gratuit","Devis"]].map(([v,l],i) => (
        <div key={i} style={{ background: T.card, borderRadius: 14, padding: "16px", textAlign: "center", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? T.t1 : "#22C88A" }}>{v}</div>
          <div style={{ fontSize: 11, color: T.t3, marginTop: 2 }}>{l}</div>
        </div>
      ))}
    </div>
    <Card T={T} style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t1, margin: "0 0 12px" }}>Avis clients</h3>
      {[
        { name: "Caroline L.", text: "Excellent travail, très professionnel et ponctuel.", rating: 5, date: "Il y a 3 jours" },
        { name: "Pierre M.", text: "Intervention rapide et soignée. Le séquestre m'a rassuré.", rating: 5, date: "Il y a 1 semaine" },
      ].map((r, i) => (
        <div key={i} style={{ padding: "12px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{r.name}</span><span style={{ fontSize: 12, color: "#F5A623" }}>{"★".repeat(r.rating)}</span>
          </div>
          <p style={{ fontSize: 13, color: T.t2, margin: "0 0 2px", lineHeight: 1.5 }}>{r.text}</p>
          <span style={{ fontSize: 11, color: T.hint }}>{r.date}</span>
        </div>
      ))}
    </Card>
    <button onClick={() => setPage("booking")} style={{ width: "100%", padding: "14px", borderRadius: 14, background: "#0A4030", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>Prendre rendez-vous</button>
    <button onClick={() => setPage("urgence")} style={{ width: "100%", padding: "14px", borderRadius: 14, background: "#E8302A", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Urgence</button>
  </div>
);

/* ━━━ PAGE: BOOKING ━━━ */
const PageBooking = ({ setPage, T }) => {
  const [step, setStep] = useState(0);
  const [day, setDay] = useState(15);
  const [slot, setSlot] = useState(null);
  const avail = [3,5,8,10,12,15,17,19,22,24,26,29];
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={() => setPage("artisan-detail")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Prendre rendez-vous</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Date", "Détails", "Confirmation"].map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ height: 3, borderRadius: 2, background: i <= step ? "#0A4030" : T.borderMed, marginBottom: 6 }}/>
            <span style={{ fontSize: 11, fontWeight: i === step ? 700 : 400, color: i <= step ? T.t1 : T.t3 }}>{s}</span>
          </div>
        ))}
      </div>
      <Card T={T}>
        {step === 0 && <>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t1, margin: "0 0 14px" }}>Mars 2026</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 20 }}>
            {["L","M","M","J","V","S","D"].map((d,i) => <div key={i} style={{ textAlign: "center", fontSize: 11, color: T.hint, fontWeight: 600, padding: "4px 0" }}>{d}</div>)}
            {Array(6).fill(null).map((_, i) => <div key={`e${i}`}/>)}
            {Array.from({length:31},(_,i)=>i+1).map(d => {
              const ok = avail.includes(d); const sel = d === day;
              return <button key={d} onClick={() => ok && setDay(d)} style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: sel ? "#0A4030" : ok ? T.accentBg : "none", color: sel ? "#fff" : ok ? T.t1 : T.hint, fontSize: 14, fontWeight: sel ? 700 : 500, cursor: ok ? "pointer" : "default", margin: "0 auto" }}>{d}</button>;
            })}
          </div>
          <button onClick={() => setStep(1)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Continuer</button>
        </>}
        {step === 1 && <>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t1, margin: "0 0 12px" }}>Créneau</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {["9h00","11h00","14h00","16h00","18h00"].map(s => (
              <button key={s} onClick={() => setSlot(s)} style={{ padding: "10px 20px", borderRadius: 10, background: slot === s ? "#0A4030" : T.surface, color: slot === s ? "#fff" : T.t1, border: slot === s ? "none" : `1px solid ${T.borderMed}`, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
          <textarea placeholder="Décrivez votre problème..." style={{ width: "100%", height: 100, borderRadius: 14, border: `1px solid ${T.borderMed}`, padding: 14, fontSize: 14, fontFamily: "'DM Sans'", resize: "none", outline: "none", boxSizing: "border-box", background: T.inputBg, color: T.t1, marginBottom: 14 }}/>
          <button onClick={() => setStep(2)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Continuer</button>
        </>}
        {step === 2 && <>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t1, margin: "0 0 14px" }}>Récapitulatif</h3>
          {[["Artisan","Jean-Michel P."],["Date",`${day} mars 2026`],["Créneau",slot||"14h00"],["Adresse","12 rue de Rivoli, Paris 4e"]].map(([k,v],i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 13, color: T.t3 }}>{k}</span><span style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{v}</span>
            </div>
          ))}
          <div style={{ background: T.accentBg, borderRadius: 12, padding: "12px", margin: "16px 0", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.accentBorder}` }}>
            {I.lock(T.accent, 16)}<span style={{ fontSize: 12, color: T.accentText }}>Aucun débit immédiat — Nova contrôle et valide</span>
          </div>
          <button onClick={() => setPage("client-dash")} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Confirmer le rendez-vous</button>
        </>}
      </Card>
    </div>
  );
};

/* ━━━ PAGE: MISSIONS (CLIENT) ━━━ */
const PageMissions = ({ setPage, T }) => {
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(null);
  const [rated, setRated] = useState({});
  const [stars, setStars] = useState({});

  const missions = [
    { id: 0, artisan: "Jean-Michel P.", initials: "JM", type: "Réparation fuite", cat: "Plomberie", date: "15 mars 2026", time: "14h00", address: "12 rue de Rivoli, 75004 Paris", amount: "320,00€", amountHT: "266,67€", tva: "53,33€", status: "Terminée", sColor: "#22C88A", step: 2, devisId: "#DEV-2026-078", factureId: "#FAC-2026-125", desc: "Réparation d'une fuite sous évier cuisine, remplacement du siphon et des joints." },
    { id: 1, artisan: "Sophie M.", initials: "SM", type: "Installation prise", cat: "Électricité", date: "10 mars 2026", time: "11h00", address: "12 rue de Rivoli, 75004 Paris", amount: "195,00€", amountHT: "162,50€", tva: "32,50€", status: "Terminée", sColor: "#22C88A", step: 2, devisId: "#DEV-2026-071", factureId: "#FAC-2026-120", desc: "Installation d'une prise RJ45 et d'une prise électrique double dans le bureau." },
    { id: 2, artisan: "Karim B.", initials: "KB", type: "Remplacement serrure", cat: "Serrurerie", date: "2 mars 2026", time: "16h00", address: "12 rue de Rivoli, 75004 Paris", amount: "280,00€", amountHT: "233,33€", tva: "46,67€", status: "Validée", sColor: "#1B6B4E", step: 3, devisId: "#DEV-2026-062", factureId: "#FAC-2026-112", desc: "Remplacement serrure 3 points porte d'entrée. Cylindre A2P haute sécurité." },
    { id: 3, artisan: "Thomas R.", initials: "TR", type: "Fuite chauffe-eau", cat: "Plomberie", date: "18 fév 2026", time: "9h00", address: "12 rue de Rivoli, 75004 Paris", amount: "450,00€", amountHT: "375,00€", tva: "75,00€", status: "Litige", sColor: "#E8302A", step: 2, devisId: "#DEV-2026-048", factureId: null, desc: "Diagnostic et réparation fuite chauffe-eau. Remplacement groupe de sécurité." },
  ];

  const filtered = tab === "all" ? missions : missions.filter(m => m.status.toLowerCase().includes(tab));
  const steps = ["Paiement bloqué", "Mission en cours", "Nous validons", "Artisan payé"];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Mes missions</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "all", l: "Toutes" },{ id: "terminée", l: "Terminées" },{ id: "validée", l: "Validées" },{ id: "litige", l: "Litiges" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 16px", borderRadius: 10, background: tab === t.id ? "#0A4030" : T.card, color: tab === t.id ? "#fff" : T.t2, border: tab === t.id ? "none" : `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.l}</button>
        ))}
      </div>
      {filtered.map((m) => {
        const isOpen = open === m.id;
        const isRated = rated[m.id];
        return (
          <Card key={m.id} T={T} style={{ marginBottom: 14, cursor: "pointer", transition: "box-shadow 200ms ease", boxShadow: isOpen ? (T.shadow.replace("16px", "24px")) : T.shadow }}>
            {/* Summary row — always visible */}
            <div onClick={() => setOpen(isOpen ? null : m.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: T.avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: T.accent, flexShrink: 0 }}>{m.initials}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.t1 }}>{m.artisan} — {m.type}</div>
                  <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>{m.date} • <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{m.amount}</span></div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Badge label={m.status} color={m.sColor} T={T}/>
                <span style={{ fontSize: 16, color: T.hint, transition: "transform 200ms", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
              </div>
            </div>

            {/* Expanded detail */}
            {isOpen && (
              <div style={{ marginTop: 20, borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
                {/* Escrow stepper */}
                <div style={{ display: "flex", gap: 0, alignItems: "flex-start", marginBottom: 24 }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                      {i < 3 && <div style={{ position: "absolute", top: 12, left: "60%", width: "80%", height: 2, background: i < m.step ? "#22C88A" : T.borderMed, zIndex: 0 }}/>}
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", margin: "0 auto 6px",
                        background: i < m.step ? "#22C88A" : i === m.step ? "#F5A623" : T.borderMed,
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, position: "relative", zIndex: 1,
                      }}>{i < m.step ? "✓" : i + 1}</div>
                      <span style={{ fontSize: 10, color: i <= m.step ? T.t1 : T.hint, fontWeight: i === m.step ? 700 : 400 }}>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Mission info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {[
                    ["Catégorie", m.cat], ["Adresse", m.address],
                    ["Date et heure", `${m.date} — ${m.time}`], ["Artisan", m.artisan],
                  ].map(([k, v]) => (
                    <div key={k} style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 11, color: T.t3 }}>{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: T.t1, marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, color: T.t3, marginBottom: 4 }}>Description</div>
                  <div style={{ fontSize: 13, color: T.t2, lineHeight: 1.6 }}>{m.desc}</div>
                </div>

                {/* Financials */}
                <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, color: T.t3, marginBottom: 8 }}>Détail du paiement</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: T.t2 }}>Montant HT</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: T.t1 }}>{m.amountHT}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: T.t2 }}>TVA (20%)</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: T.t1 }}>{m.tva}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>Total TTC</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: T.t1 }}>{m.amount}</span>
                  </div>
                </div>

                {/* Documents — download devis & facture */}
                <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, color: T.t3, marginBottom: 10 }}>Documents</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "12px", borderRadius: 12, background: T.accentBg,
                      border: `1px solid ${T.accentBorder}`, cursor: "pointer",
                      fontSize: 13, fontWeight: 600, color: T.accent,
                    }}>
                      {I.doc(T.accent, 16)}
                      <div style={{ textAlign: "left" }}>
                        <div>Devis</div>
                        <div style={{ fontSize: 10, fontWeight: 400, color: T.t3, fontFamily: "'DM Mono', monospace" }}>{m.devisId}</div>
                      </div>
                    </button>
                    {m.factureId ? (
                      <button style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px", borderRadius: 12, background: T.accentBg,
                        border: `1px solid ${T.accentBorder}`, cursor: "pointer",
                        fontSize: 13, fontWeight: 600, color: T.accent,
                      }}>
                        {I.doc(T.accent, 16)}
                        <div style={{ textAlign: "left" }}>
                          <div>Facture</div>
                          <div style={{ fontSize: 10, fontWeight: 400, color: T.t3, fontFamily: "'DM Mono', monospace" }}>{m.factureId}</div>
                        </div>
                      </button>
                    ) : (
                      <div style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px", borderRadius: 12, background: T.surface,
                        border: `1px dashed ${T.borderMed}`,
                        fontSize: 13, color: T.hint,
                      }}>
                        {I.doc(T.hint, 16)} Facture indisponible
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ paddingTop: 14, display: "flex", gap: 8 }}>
                  {m.status === "Terminée" && !isRated && (
                    <>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: T.t3, marginBottom: 6 }}>Noter l'intervention</div>
                        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                          {[1,2,3,4,5].map(s => (
                            <button key={s} onClick={(e) => { e.stopPropagation(); setStars(p => ({...p, [m.id]: s})); }} style={{
                              fontSize: 22, background: "none", border: "none", cursor: "pointer",
                              color: s <= (stars[m.id] || 0) ? "#F5A623" : T.borderMed,
                            }}>{s <= (stars[m.id] || 0) ? "★" : "☆"}</button>
                          ))}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setRated(p => ({...p, [m.id]: true})); }} style={{
                          width: "100%", padding: "10px", borderRadius: 10, background: "#22C88A", color: "#fff",
                          border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                        }}>Valider — Libérer le paiement</button>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setPage("report-issue"); }} style={{
                        padding: "10px 16px", borderRadius: 10, background: "rgba(232,48,42,0.06)",
                        color: "#E8302A", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        alignSelf: "flex-end",
                      }}>Signaler un litige</button>
                    </>
                  )}
                  {m.status === "Terminée" && isRated && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0" }}>
                      {I.check("#22C88A", 18)}
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#22C88A" }}>Mission validée — paiement en cours de libération</span>
                    </div>
                  )}
                  {m.status === "Validée" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0" }}>
                      {I.check("#22C88A", 18)}
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1B6B4E" }}>Paiement versé à l'artisan</span>
                    </div>
                  )}
                  {m.status === "Litige" && (
                    <div style={{ background: "rgba(232,48,42,0.04)", borderRadius: 12, padding: "12px", display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(232,48,42,0.08)", flex: 1 }}>
                      {I.lock("#E8302A", 14)}
                      <span style={{ fontSize: 12, color: "#E8302A" }}>Litige en cours d'examen. Le paiement reste bloqué en séquestre.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

/* ━━━ PAGE: NOTIFICATIONS (CLIENT) ━━━ */
const PageNotifsClient = ({ setPage, T }) => {
  const [read, setRead] = useState({});
  const notifs = [
    { id: 0, title: "Nouveau devis reçu", desc: "Jean-Michel P. vous a envoyé un devis — 236,50€", time: "Il y a 12 min", color: T.accent, page: "missions", action: "Voir le devis" },
    { id: 1, title: "Mission confirmée", desc: "Votre RDV avec Sophie M. est confirmé pour demain 14h", time: "Il y a 2h", color: "#22C88A", page: "missions", action: "Voir la mission" },
    { id: 2, title: "Paiement validé par Nova", desc: "450,00€ libérés pour Amélie R.", time: "Hier", color: "#F5A623", page: "missions", action: "Voir le reçu" },
    { id: 3, title: "Bienvenue sur Nova", desc: "Votre compte est vérifié. Trouvez votre premier artisan !", time: "Il y a 3 jours", color: T.hint, page: "search", action: "Trouver un artisan" },
  ];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: 0 }}>Notifications</h1>
        <button onClick={() => setRead(Object.fromEntries(notifs.map(n => [n.id, true])))} style={{ background: "none", border: "none", fontSize: 12, color: T.accent, cursor: "pointer", fontWeight: 600 }}>Tout marquer comme lu</button>
      </div>
      {notifs.map((n) => (
        <Card key={n.id} T={T} style={{ marginBottom: 10, border: !read[n.id] ? `1.5px solid ${n.color}25` : `1px solid ${T.border}`, cursor: "pointer" }}>
          <div onClick={() => { setRead(r => ({...r, [n.id]: true})); }} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: !read[n.id] ? n.color : "transparent", marginTop: 5, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 2 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: T.t2, marginBottom: 6 }}>{n.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: T.hint }}>{n.time}</span>
                <button onClick={(e) => { e.stopPropagation(); setRead(r => ({...r, [n.id]: true})); setPage(n.page); }} style={{ background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: T.accent, cursor: "pointer" }}>{n.action}</button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

/* ━━━ PAGE: URGENCE ━━━ */
const PageUrgence = ({ setPage, T }) => {
  const [cat, setCat] = useState(null);
  if (!cat) return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 8px" }}>Urgence 24h/24</h1>
      <p style={{ fontSize: 14, color: T.t3, margin: "0 0 24px" }}>Sélectionnez le domaine de l'intervention</p>
      <div style={{ background: "linear-gradient(135deg, #E8302A, #FF6B5B)", borderRadius: 16, padding: "16px 20px", marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>⚡ Intervention en moins de 2h</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>Devis gratuit et immédiat</div>
      </div>
      {[{ id: "plumber", l: "Plomberie" },{ id: "electrician", l: "Électricité" },{ id: "locksmith", l: "Serrurerie" },{ id: "heating", l: "Chauffage" },{ id: "all", l: "Autre domaine" }].map(c => (
        <Card key={c.id} T={T} style={{ marginBottom: 10, cursor: "pointer" }}>
          <div onClick={() => setCat(c.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.t1 }}>{c.l}</span>
            <span style={{ color: T.hint }}>›</span>
          </div>
        </Card>
      ))}
    </div>
  );
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={() => setCat(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Artisans disponibles</h1>
      {[
        { name: "Karim B.", time: "15 min", price: "80€/h", initials: "KB" },
        { name: "Jean-Michel P.", time: "25 min", price: "85€/h", initials: "JM" },
        { name: "Fatima H.", time: "40 min", price: "80€/h", initials: "FH" },
      ].map((a, i) => (
        <Card key={i} T={T} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: T.avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: T.accent }}>{a.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.t1 }}>{a.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#E8302A" }}>Dispo en {a.time}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: T.t1 }}>{a.price}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPage("booking")} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#E8302A", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Intervention immédiate</button>
            <button onClick={() => setPage("artisan-detail")} style={{ padding: "10px 16px", borderRadius: 10, background: T.surface, color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Profil</button>
          </div>
        </Card>
      ))}
    </div>
  );
};

/* ━━━ PAGE: DOCUMENTS (ARTISAN) ━━━ */
const PageDocs = ({ T }) => {
  const [tab, setTab] = useState("devis");
  const [open, setOpen] = useState(null);
  const docs = {
    devis: [
      { id: "#DEV-2026-089", client: "Caroline L.", date: "17 mars 2026", amount: "236,50€", ht: "197,08€", tva: "39,42€", status: "Accepté", sColor: "#22C88A", lines: [{ d: "Remplacement robinet mitigeur", q: 1, p: "85,00€" }, { d: "Main d'œuvre (2h)", q: 1, p: "130,00€" }, { d: "Déplacement", q: 1, p: "0,00€" }] },
      { id: "#DEV-2026-085", client: "Pierre M.", date: "10 mars 2026", amount: "890,00€", ht: "741,67€", tva: "148,33€", status: "En attente", sColor: "#F5A623", lines: [{ d: "Chauffe-eau thermodynamique 200L", q: 1, p: "620,00€" }, { d: "Installation et raccordement", q: 1, p: "210,00€" }, { d: "Mise en service", q: 1, p: "60,00€" }] },
    ],
    factures: [
      { id: "#FAC-2026-127", client: "Amélie R.", date: "12 mars 2026", amount: "450,00€", ht: "375,00€", tva: "75,00€", status: "Payée", sColor: "#22C88A", lines: [{ d: "Réparation chauffe-eau", q: 1, p: "280,00€" }, { d: "Groupe de sécurité", q: 1, p: "85,00€" }, { d: "Main d'œuvre supplémentaire", q: 1, p: "85,00€" }] },
      { id: "#FAC-2026-119", client: "Luc D.", date: "5 mars 2026", amount: "320,00€", ht: "266,67€", tva: "53,33€", status: "Payée", sColor: "#22C88A", lines: [{ d: "Diagnostic fuite", q: 1, p: "65,00€" }, { d: "Remplacement siphon", q: 1, p: "125,00€" }, { d: "Main d'œuvre (2h)", q: 1, p: "130,00€" }] },
    ],
  };
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Mes documents</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["devis", "factures"].map(t => (
          <button key={t} onClick={() => { setTab(t); setOpen(null); }} style={{ padding: "8px 20px", borderRadius: 10, background: tab === t ? "#0A4030" : T.card, color: tab === t ? "#fff" : T.t2, border: tab === t ? "none" : `1px solid ${T.borderMed}`, fontSize: 14, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>
      {(docs[tab] || []).map((d, i) => (
        <Card key={d.id} T={T} style={{ marginBottom: 12, cursor: "pointer" }}>
          <div onClick={() => setOpen(open === d.id ? null : d.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: T.accent }}>{d.id}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Badge label={d.status} color={d.sColor} T={T}/>
                <span style={{ fontSize: 14, color: T.hint, transition: "transform 200ms", transform: open === d.id ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{d.client}</div><div style={{ fontSize: 12, color: T.t3 }}>{d.date}</div></div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: T.t1 }}>{d.amount}</div>
            </div>
          </div>
          {open === d.id && (
            <div style={{ marginTop: 16, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
              {d.lines.map((l, j) => (
                <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: j < d.lines.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 13, color: T.t2 }}>{l.d}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: T.t1 }}>{l.p}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: T.t3 }}>HT</span><span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: T.t1 }}>{d.ht}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: T.t3 }}>TVA (20%)</span><span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: T.t1 }}>{d.tva}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>Total TTC</span><span style={{ fontFamily: "'DM Mono'", fontSize: 16, fontWeight: 700, color: T.t1 }}>{d.amount}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button style={{ flex: 1, padding: "10px 16px", borderRadius: 10, background: "#0A4030", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{I.doc("#fff", 14)} Télécharger PDF</button>
                <button style={{ padding: "10px 16px", borderRadius: 10, background: T.surface, color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Dupliquer</button>
                <button style={{ padding: "10px 16px", borderRadius: 10, background: T.surface, color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Envoyer</button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

/* ━━━ PAGE: PAYMENTS (ARTISAN) ━━━ */
const PagePayments = ({ T }) => {
  const [tab, setTab] = useState("escrow");
  const [openPay, setOpenPay] = useState(null);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Mes paiements</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "escrow", l: "En séquestre" },{ id: "received", l: "Reçus" },{ id: "pending", l: "En attente" }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setOpenPay(null); }} style={{ padding: "8px 16px", borderRadius: 10, background: tab === t.id ? "#0A4030" : T.card, color: tab === t.id ? "#fff" : T.t2, border: tab === t.id ? "none" : `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.l}</button>
        ))}
      </div>
      {tab === "escrow" && <>
        <div style={{ background: T.accentBg, borderRadius: 14, padding: "14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${T.accentBorder}` }}>
          {I.lock(T.accent, 16)}<span style={{ fontSize: 13, color: T.accentText }}>Fonds sécurisés — virés sous 48h après validation</span>
        </div>
        {[
          { id: "e0", client: "Caroline L.", mission: "Remplacement robinet", amount: "236,50€", ht: "197,08€", tva: "39,42€", days: 3, ref: "#ESQ-2026-044", factureId: "#FAC-2026-128", date: "14 mars 2026" },
          { id: "e1", client: "Pierre M.", mission: "Installation cumulus", amount: "890,00€", ht: "741,67€", tva: "148,33€", days: 5, ref: "#ESQ-2026-043", factureId: "#FAC-2026-127", date: "12 mars 2026" },
        ].map((m) => (
          <Card key={m.id} T={T} style={{ marginBottom: 10, cursor: "pointer" }}>
            <div onClick={() => setOpenPay(openPay === m.id ? null : m.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{m.client}</div><div style={{ fontSize: 12, color: T.t3 }}>{m.mission}</div></div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: T.t1 }}>{m.amount}</div>
                  <span style={{ fontSize: 14, color: T.hint, transition: "transform 200ms", transform: openPay === m.id ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                </div>
              </div>
              <div style={{ background: T.borderMed, borderRadius: 4, height: 4 }}><div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#1B6B4E,#22C88A)", width: `${((7-m.days)/7)*100}%` }}/></div>
              <span style={{ fontSize: 11, color: T.hint, marginTop: 4, display: "block" }}>Validation dans {m.days} jours</span>
            </div>
            {openPay === m.id && (
              <div style={{ marginTop: 16, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                {[["Référence séquestre", m.ref],["Date de blocage", m.date],["Montant HT", m.ht],["TVA (20%)", m.tva],["Total TTC", m.amount]].map(([k, v], i) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                    <span style={{ color: T.t3 }}>{k}</span>
                    <span style={{ fontWeight: i === 4 ? 700 : 500, color: T.t1, fontFamily: i >= 2 ? "'DM Mono', monospace" : "inherit" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, background: T.accentBg, border: `1px solid ${T.accentBorder}`, fontSize: 12, fontWeight: 600, color: T.accent, cursor: "pointer" }}>
                    {I.doc(T.accent, 14)} Télécharger le reçu séquestre
                  </button>
                  <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, background: T.accentBg, border: `1px solid ${T.accentBorder}`, fontSize: 12, fontWeight: 600, color: T.accent, cursor: "pointer" }}>
                    {I.doc(T.accent, 14)} Facture {m.factureId}
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </>}
      {tab === "received" && [
        { id: "r0", client: "Amélie R.", mission: "Réparation chauffe-eau", amount: "450,00€", ht: "375,00€", tva: "75,00€", date: "12 mars 2026", ref: "#VIR-2026-089", factureId: "#FAC-2026-125", iban: "FR76 •••• •••• •••• 4521" },
        { id: "r1", client: "Luc D.", mission: "Diagnostic fuite", amount: "320,00€", ht: "266,67€", tva: "53,33€", date: "5 mars 2026", ref: "#VIR-2026-082", factureId: "#FAC-2026-119", iban: "FR76 •••• •••• •••• 4521" },
      ].map((p) => (
        <Card key={p.id} T={T} style={{ marginBottom: 10, cursor: "pointer" }}>
          <div onClick={() => setOpenPay(openPay === p.id ? null : p.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{p.client}</div><div style={{ fontSize: 12, color: T.hint }}>{p.date}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700, color: "#22C88A" }}>{p.amount}</div><div style={{ fontSize: 10, color: "#22C88A" }}>Virement effectué ✓</div></div>
                <span style={{ fontSize: 14, color: T.hint, transition: "transform 200ms", transform: openPay === p.id ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
              </div>
            </div>
          </div>
          {openPay === p.id && (
            <div style={{ marginTop: 16, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
              {[["Référence virement", p.ref],["Mission", p.mission],["Date du virement", p.date],["IBAN créditeur", p.iban],["Montant HT", p.ht],["TVA (20%)", p.tva],["Net versé", p.amount]].map(([k, v], i) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                  <span style={{ color: T.t3 }}>{k}</span>
                  <span style={{ fontWeight: i === 6 ? 700 : 500, color: i === 6 ? "#22C88A" : T.t1, fontFamily: i >= 4 ? "'DM Mono', monospace" : "inherit" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, background: T.accentBg, border: `1px solid ${T.accentBorder}`, fontSize: 12, fontWeight: 600, color: T.accent, cursor: "pointer" }}>
                  {I.doc(T.accent, 14)} Reçu de virement PDF
                </button>
                <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, background: T.accentBg, border: `1px solid ${T.accentBorder}`, fontSize: 12, fontWeight: 600, color: T.accent, cursor: "pointer" }}>
                  {I.doc(T.accent, 14)} Facture {p.factureId}
                </button>
              </div>
            </div>
          )}
        </Card>
      ))}
      {tab === "pending" && <div style={{ textAlign: "center", padding: "48px 0", color: T.hint }}><div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>Aucun paiement en attente</div>}
    </div>
  );
};

/* ━━━ PAGE: PROFILE CLIENT ━━━ */
const PageProfileClient = ({ setPage, T }) => (
  <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
    <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 24px" }}>Mon profil</h1>
    <Card T={T} style={{ textAlign: "center", marginBottom: 20 }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: "linear-gradient(135deg, #1B6B4E, #0A4030)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 auto 12px" }}>SL</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: T.t1 }}>Sophie Lefèvre</div>
      <div style={{ fontSize: 13, color: T.t3, marginTop: 2 }}>Compte particulier</div>
    </Card>
    <Card T={T} style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 12 }}>Informations personnelles</div>
      {[["Nom complet","Sophie Lefèvre"],["Email","sophie.lefevre@email.com"],["Téléphone","06 12 34 56 78"],["Adresse","12 rue de Rivoli, 75004 Paris"]].map(([k,v],i) => (
        <div key={k} style={{ padding: "10px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
          <div style={{ fontSize: 11, color: T.t3 }}>{k}</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.t1, marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </Card>
    {[
      { label: "Moyens de paiement", sub: "Visa •••• 6411", page: "payment-methods" },
      { label: "Mes missions", sub: "3 missions réalisées", page: "missions" },
      { label: "Inviter des proches", sub: "Gagnez 20€ par parrainage 🎁", page: "referral" },
      { label: "Paramètres", page: "settings" },
      { label: "Support", page: "support" },
    ].map((item, i) => (
      <div key={i} onClick={() => item.page && setPage(item.page)} style={{
        background: T.card, borderRadius: 14, padding: "14px 20px", marginBottom: 8,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        border: `1px solid ${T.border}`, cursor: item.page ? "pointer" : "default",
      }}>
        <div><div style={{ fontSize: 14, fontWeight: 500, color: T.t1 }}>{item.label}</div>{item.sub && <div style={{ fontSize: 12, color: T.t3 }}>{item.sub}</div>}</div>
        {item.page && <span style={{ color: T.hint }}>›</span>}
      </div>
    ))}
  </div>
);

/* ━━━ PAGE: PROFILE ARTISAN ━━━ */
const PageProfileArtisan = ({ setPage, T }) => (
  <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
    <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: "0 0 24px" }}>Mon profil</h1>
    <Card T={T} style={{ textAlign: "center", marginBottom: 20 }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: "linear-gradient(135deg, #1B6B4E, #0A4030)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 auto 12px" }}>JM</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: T.t1 }}>Jean-Michel Petit</div>
      <div style={{ fontSize: 13, color: T.t3, marginTop: 2 }}>Artisan Certifié Nova • #2847</div>
      <div style={{ marginTop: 8 }}><Badge label="Certifié Nova" color="#B07000" T={T}/></div>
    </Card>
    <Card T={T} style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 12 }}>Informations personnelles</div>
      {[["Nom","Jean-Michel Petit"],["Email","jm.petit@plomberie-pro.fr"],["Téléphone","06 98 76 54 32"]].map(([k,v],i) => (
        <div key={k} style={{ padding: "10px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
          <div style={{ fontSize: 11, color: T.t3 }}>{k}</div><div style={{ fontSize: 14, fontWeight: 500, color: T.t1, marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </Card>
    <Card T={T} style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 12 }}>Informations entreprise</div>
      {[["Raison sociale","JM Plomberie Pro"],["SIRET","123 456 789 00012"],["TVA","FR 12 123456789"],["Adresse","8 rue des Artisans, 75011"],["Code APE","4322A — Plomberie"]].map(([k,v],i) => (
        <div key={k} style={{ padding: "10px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
          <div style={{ fontSize: 11, color: T.t3 }}>{k}</div><div style={{ fontSize: 14, fontWeight: 500, color: T.t1, marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </Card>
    {[
      { label: "Mes paiements", page: "payments" },
      { label: "Mes documents", page: "docs" },
      { label: "Comptabilité", sub: "Pennylane, Indy, export auto", page: "compta" },
      { label: "Mes clients", sub: "Carnet d'adresses et historique", page: "client-book" },
      { label: "Mon QR code", sub: "Véhicule, cartes, devis", page: "qr-code" },
      { label: "Inviter un artisan", sub: "Gagnez 20€ par parrainage 🎁", page: "referral" },
      { label: "Paramètres", page: "settings" },
      { label: "Support", page: "support" },
    ].map((item, i) => (
      <div key={i} onClick={() => setPage(item.page)} style={{
        background: T.card, borderRadius: 14, padding: "14px 20px", marginBottom: 8,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        border: `1px solid ${T.border}`, cursor: "pointer",
      }}>
        <div><span style={{ fontSize: 14, fontWeight: 500, color: T.t1 }}>{item.label}</span>{item.sub && <div style={{ fontSize: 12, color: T.t3 }}>{item.sub}</div>}</div>
        <span style={{ color: T.hint }}>›</span>
      </div>
    ))}
  </div>
);

/* ━━━ PAGE: CREATE QUOTE ━━━ */
const PageCreateQuote = ({ setPage, T }) => {
  const [step, setStep] = useState(0);
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={() => setPage("artisan-dash")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Créer un devis</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Client", "Lignes", "Envoi"].map((s, i) => (
          <div key={i} style={{ flex: 1 }}><div style={{ height: 3, borderRadius: 2, background: i <= step ? "#0A4030" : T.borderMed, marginBottom: 6 }}/><span style={{ fontSize: 11, fontWeight: i === step ? 700 : 400, color: i <= step ? T.t1 : T.t3 }}>{s}</span></div>
        ))}
      </div>
      <Card T={T}>
        {step === 0 && <>
          {["Nom du client","Email","Téléphone","Adresse"].map((l,i) => (
            <div key={l} style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: T.t3, display: "block", marginBottom: 4 }}>{l}</label>
              <input defaultValue={i===0?"Caroline Lefèvre":i===1?"caroline.l@email.com":i===2?"06 12 34 56 78":"12 rue de Clichy, 75009"} style={{ width: "100%", height: 44, borderRadius: 12, border: `1px solid ${T.borderMed}`, padding: "0 14px", fontSize: 14, fontFamily: "'DM Sans'", outline: "none", boxSizing: "border-box", background: T.inputBg, color: T.t1 }}/></div>
          ))}
          <button onClick={() => setStep(1)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Suivant</button>
        </>}
        {step === 1 && <>
          {[{ d: "Remplacement robinet", q: 1, p: 85 },{ d: "Main d'œuvre", q: 2, p: 65 }].map((l, i) => (
            <div key={i} style={{ padding: "12px 0", borderTop: i ? `1px solid ${T.border}` : "none", display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{l.d}</div><div style={{ fontSize: 12, color: T.t3 }}>{l.q} × {l.p}€</div></div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: T.t1 }}>{(l.q*l.p).toFixed(2)}€</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, marginTop: 8, textAlign: "right" }}>
            <div style={{ fontSize: 12, color: T.t3 }}>HT: 215,00€ • TVA: 21,50€</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: T.t1, marginTop: 4 }}>236,50€ TTC</div>
          </div>
          <button onClick={() => setStep(2)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 16 }}>Suivant</button>
        </>}
        {step === 2 && <>
          <textarea defaultValue="Bonjour, voici le devis pour l'intervention." placeholder="Message au client..." style={{ width: "100%", height: 80, borderRadius: 14, border: `1px solid ${T.borderMed}`, padding: 14, fontSize: 14, fontFamily: "'DM Sans'", resize: "none", outline: "none", boxSizing: "border-box", background: T.inputBg, color: T.t1, marginBottom: 14 }}/>
          <div style={{ background: T.accentBg, borderRadius: 12, padding: "12px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.accentBorder}` }}>
            {I.lock(T.accent, 14)}<span style={{ fontSize: 12, color: T.accentText }}>Le client recevra le devis sur son espace Nova</span>
          </div>
          <button onClick={() => setPage("docs")} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Envoyer le devis</button>
        </>}
      </Card>
    </div>
  );
};

/* ━━━ PAGE: CREATE INVOICE ━━━ */
const PageCreateInvoice = ({ setPage, T }) => (
  <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
    <button onClick={() => setPage("artisan-dash")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
    <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Nouvelle facture</h1>
    <Card T={T}>
      <div style={{ fontSize: 13, color: T.t3, marginBottom: 16 }}>Facture générée automatiquement suite à la validation de la mission</div>
      <div style={{ background: T.surface, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: T.accent, fontWeight: 600 }}>#FAC-2026-128</span>
          <Badge label="Payée" color="#22C88A" T={T}/>
        </div>
        {[["Robinet mitigeur","85,00€"],["Main d'œuvre 2h","130,00€"]].map(([d,t],i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
            <span style={{ color: T.t2 }}>{d}</span><span style={{ fontWeight: 600, color: T.t1 }}>{t}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 8, marginTop: 8, textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: T.t1 }}>236,50€ TTC</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Envoyer au client</button>
        <button style={{ padding: "12px 20px", borderRadius: 12, background: T.surface, color: T.t1, border: `1px solid ${T.borderMed}`, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>{I.doc(T.accent, 14)} PDF</button>
      </div>
    </Card>
  </div>
);
/* ━━━ PAGE: NOTIFICATIONS ARTISAN ━━━ */
const PageNotifsArtisan = ({ setPage, T }) => {
  const [read, setRead] = useState({});
  const notifs = [
    { id: 0, title: "Demande urgente", desc: "Fuite d'eau — Secteur Paris 9e — Il y a 4 min", time: "14:32", color: "#E8302A", page: "artisan-dash", action: "Voir la demande" },
    { id: 1, title: "Devis accepté", desc: "Caroline L. a accepté votre devis #DEV-2026-089", time: "Il y a 1h", color: "#22C88A", page: "docs", action: "Voir le devis" },
    { id: 2, title: "Paiement libéré", desc: "450,00€ virés sur votre compte pour la mission #M-2847", time: "Il y a 3h", color: "#F5A623", page: "payments", action: "Voir le reçu" },
    { id: 3, title: "Nouveau RDV", desc: "Pierre M. — Installation robinet — Demain 14h", time: "Hier", color: T.accent, page: "artisan-dash", action: "Voir le RDV" },
    { id: 4, title: "Rappel certification", desc: "Votre assurance décennale expire dans 30 jours", time: "Il y a 3 jours", color: T.hint, page: "profile-artisan", action: "Mettre à jour" },
  ];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: T.t1, margin: 0 }}>Notifications</h1>
        <button onClick={() => setRead(Object.fromEntries(notifs.map(n => [n.id, true])))} style={{ background: "none", border: "none", fontSize: 12, color: T.accent, cursor: "pointer", fontWeight: 600 }}>Tout marquer comme lu</button>
      </div>
      {notifs.map((n) => (
        <Card key={n.id} T={T} style={{ marginBottom: 10, border: !read[n.id] ? `1.5px solid ${n.color}25` : `1px solid ${T.border}`, cursor: "pointer" }}>
          <div onClick={() => setRead(r => ({...r, [n.id]: true}))} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: !read[n.id] ? n.color : "transparent", marginTop: 5, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 2 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: T.t2, marginBottom: 6 }}>{n.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: T.hint }}>{n.time}</span>
                <button onClick={(e) => { e.stopPropagation(); setRead(r => ({...r, [n.id]: true})); setPage(n.page); }} style={{ background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: T.accent, cursor: "pointer" }}>{n.action}</button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

/* ━━━ PAGE: MISSION DETAIL + VALIDATION ━━━ */
const PageMissionDetail = ({ setPage, T }) => {
  const [validated, setValidated] = useState(false);
  const [rating, setRating] = useState(0);
  const steps = ["Paiement bloqué", "Mission en cours", "Nous validons", "Artisan payé"];
  const currentStep = validated ? 3 : 2;
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={() => setPage("missions")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Détail de la mission</h1>

      {/* Escrow stepper */}
      <Card T={T} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
              {i < 3 && <div style={{ position: "absolute", top: 14, left: "60%", width: "80%", height: 2, background: i < currentStep ? "#22C88A" : T.borderMed, zIndex: 0 }}/>}
              <div style={{
                width: 28, height: 28, borderRadius: "50%", margin: "0 auto 6px",
                background: i < currentStep ? "#22C88A" : i === currentStep ? "#F5A623" : T.borderMed,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, position: "relative", zIndex: 1,
              }}>{i < currentStep ? "✓" : i + 1}</div>
              <span style={{ fontSize: 10, color: i <= currentStep ? T.t1 : T.t3, fontWeight: i === currentStep ? 700 : 400 }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Mission info */}
      <Card T={T} style={{ marginBottom: 20 }}>
        {[["Artisan","Jean-Michel P."],["Type","Réparation fuite"],["Date","15 mars 2026 — 14h"],["Adresse","12 rue de Rivoli, 75004"],["Montant","320,00€"]].map(([k,v],i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <span style={{ fontSize: 13, color: T.t3 }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{v}</span>
          </div>
        ))}
      </Card>

      {/* Validation */}
      {!validated ? (
        <Card T={T}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.t1, margin: "0 0 14px" }}>Valider la mission</h3>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: T.t3, marginBottom: 8 }}>Êtes-vous satisfait de l'intervention ?</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)} style={{
                  fontSize: 24, background: "none", border: "none", cursor: "pointer",
                  color: s <= rating ? "#F5A623" : T.borderMed,
                }}>{s <= rating ? "★" : "☆"}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setValidated(true)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#22C88A", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Valider — Libérer le paiement</button>
            <button onClick={() => setPage("report-issue")} style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(232,48,42,0.06)", color: "#E8302A", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Litige</button>
          </div>
        </Card>
      ) : (
        <Card T={T} style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(34,200,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{I.check("#22C88A", 28)}</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: T.t1, margin: "0 0 4px" }}>Mission validée !</h3>
          <p style={{ fontSize: 13, color: T.t3 }}>Le paiement de 320,00€ sera versé à l'artisan sous 48h.</p>
        </Card>
      )}
    </div>
  );
};

/* ━━━ PAGE: REPORT ISSUE (LITIGE) ━━━ */
const PageReportIssue = ({ setPage, T }) => {
  const [sent, setSent] = useState(false);
  if (sent) return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(232,48,42,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>📩</div>
      <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: T.t1, margin: "0 0 8px" }}>Signalement envoyé</h2>
      <p style={{ fontSize: 14, color: T.t3, marginBottom: 24 }}>Notre équipe examinera votre dossier sous 48h. Le paiement reste bloqué en séquestre.</p>
      <button onClick={() => setPage("missions")} style={{ padding: "12px 28px", borderRadius: 12, background: "#0A4030", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Retour aux missions</button>
    </div>
  );
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={() => setPage("mission-detail")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Signaler un litige</h1>
      <Card T={T}>
        <div style={{ fontSize: 13, color: T.t3, marginBottom: 14 }}>Motif du litige</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {["Travail non conforme", "Dégâts causés", "Non terminé", "Surfacturation", "Non venu", "Autre"].map((m, i) => (
            <button key={m} style={{ padding: "8px 14px", borderRadius: 10, background: i === 0 ? "#0A4030" : T.surface, color: i === 0 ? "#fff" : T.t2, border: i === 0 ? "none" : `1px solid ${T.borderMed}`, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{m}</button>
          ))}
        </div>
        <textarea placeholder="Décrivez le problème en détail..." style={{ width: "100%", height: 120, borderRadius: 14, border: `1px solid ${T.borderMed}`, padding: 14, fontSize: 14, fontFamily: "'DM Sans'", resize: "none", outline: "none", boxSizing: "border-box", background: T.inputBg, color: T.t1, marginBottom: 14 }}/>
        <button style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", marginBottom: 16, background: T.accentBg, border: `1.5px dashed ${T.accentBorder}`, borderRadius: 12, padding: "12px 16px", cursor: "pointer", fontSize: 13, color: T.accent, fontWeight: 600 }}>{I.camera(T.accent)} Joindre des photos</button>
        <div style={{ background: "rgba(232,48,42,0.04)", borderRadius: 12, padding: "12px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(232,48,42,0.08)" }}>
          {I.lock("#E8302A", 14)}<span style={{ fontSize: 12, color: "#E8302A" }}>Le paiement reste bloqué en séquestre pendant l'examen du litige</span>
        </div>
        <button onClick={() => setSent(true)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#E8302A", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Envoyer le signalement</button>
      </Card>
    </div>
  );
};

/* ━━━ PAGE: PAYMENT METHODS ━━━ */
const PagePaymentMethods = ({ setPage, T }) => {
  const [defaultCard, setDefaultCard] = useState(0);
  const cards = [
    { id: 0, type: "Visa", last4: "6411", expiry: "09/28", holder: "Sophie Lefèvre" },
    { id: 1, type: "Mastercard", last4: "8923", expiry: "03/27", holder: "Sophie Lefèvre" },
  ];
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={() => setPage("profile-client")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Moyens de paiement</h1>
      {cards.map(card => (
        <Card key={card.id} T={T} style={{ marginBottom: 10, border: defaultCard === card.id ? `2px solid ${T.accent}` : `1px solid ${T.border}`, cursor: "pointer" }}>
          <div onClick={() => setDefaultCard(card.id)} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 32, borderRadius: 8, background: card.type === "Visa" ? "linear-gradient(135deg,#1A1F71,#2D4AA8)" : "linear-gradient(135deg,#EB001B,#F79E1B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{card.type === "Visa" ? "VISA" : "MC"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.t1 }}>{card.type} •••• {card.last4}</span>
                {defaultCard === card.id && <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(34,200,138,0.08)", color: "#22C88A", fontSize: 10, fontWeight: 600 }}>Par défaut</span>}
              </div>
              <div style={{ fontSize: 12, color: T.t3 }}>{card.holder} • Exp. {card.expiry}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: defaultCard === card.id ? `6px solid ${T.accent}` : `2px solid ${T.borderMed}` }}/>
          </div>
        </Card>
      ))}
      <button style={{ width: "100%", padding: "14px", borderRadius: 14, background: "none", border: `1.5px dashed ${T.accentBorder}`, color: T.accent, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>+ Ajouter une carte</button>
      <Card T={T}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 12 }}>Autres moyens</div>
        {[{ l: "Apple Pay", s: "Configuré", active: true },{ l: "Virement bancaire", s: "RIB non renseigné", active: false }].map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <div><div style={{ fontSize: 14, fontWeight: 500, color: T.t1 }}>{m.l}</div><div style={{ fontSize: 12, color: m.active ? "#22C88A" : T.hint }}>{m.s}</div></div>
            <span style={{ color: T.hint }}>›</span>
          </div>
        ))}
      </Card>
      <div style={{ background: T.accentBg, borderRadius: 14, padding: "14px", marginTop: 16, display: "flex", alignItems: "flex-start", gap: 10, border: `1px solid ${T.accentBorder}` }}>
        {I.lock(T.accent, 16)}<span style={{ fontSize: 12, color: T.accentText, lineHeight: 1.5 }}>Vos données bancaires sont chiffrées. Nova ne stocke pas vos numéros complets.</span>
      </div>
    </div>
  );
};

/* ━━━ PAGE: NOTIFICATION PREFERENCES ━━━ */
const PageNotifPrefs = ({ setPage, T }) => {
  const [prefs, setPrefs] = useState({ missions: true, devis: true, paiements: true, urgences: true, rappels: false, push: true, email: true, sms: false });
  const Toggle = ({ active, onToggle }) => (
    <button onClick={onToggle} style={{ width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: active ? "#0A4030" : T.borderMed, position: "relative" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 21 : 3, transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}/>
    </button>
  );
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={() => setPage("settings")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.t3, marginBottom: 20 }}>{I.back(T.t3)} Retour</button>
      <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: T.t1, margin: "0 0 20px" }}>Préférences de notification</h1>
      <Card T={T} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 12 }}>Alertes</div>
        {Object.entries({ missions: "Missions", devis: "Devis", paiements: "Paiements", urgences: "Urgences", rappels: "Rappels" }).map(([k, l], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <span style={{ fontSize: 14, color: T.t1 }}>{l}</span>
            <Toggle active={prefs[k]} onToggle={() => setPrefs(p => ({...p, [k]: !p[k]}))}/>
          </div>
        ))}
      </Card>
      <Card T={T}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 12 }}>Canaux</div>
        {Object.entries({ push: "Notifications push", email: "Email", sms: "SMS" }).map(([k, l], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <span style={{ fontSize: 14, color: T.t1 }}>{l}</span>
            <Toggle active={prefs[k]} onToggle={() => setPrefs(p => ({...p, [k]: !p[k]}))}/>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ━━━ PAGE: SUIVI TEMPS RÉEL (CLIENT) ━━━ */
const PageTracking = ({ setPage, T }) => {
  const [step, setStep] = useState(1);
  const steps = [
    { label: "Devis signé", desc: "Paiement bloqué en séquestre", time: "14:02", done: true },
    { label: "Artisan en route", desc: "Marc D. arrive dans ~15 min", time: "14:35", done: step >= 1 },
    { label: "Sur place", desc: "L'intervention a commencé", time: step >= 2 ? "14:52" : "—", done: step >= 2 },
    { label: "Terminé", desc: "En attente de votre validation", time: step >= 3 ? "15:40" : "—", done: step >= 3 },
  ];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 24 }}>Suivi de l'intervention</h1>
      <Card T={T} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: T.avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: T.accent }}>MD</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: T.t1 }}>Marc Dupont</div><div style={{ fontSize: 13, color: T.t3 }}>Plombier • Fuite sous évier</div></div>
          <div style={{ display: "flex", gap: 8 }}><Btn T={T} small outline>{I.chat(T.accent,16)}</Btn><Btn T={T} small outline>📞</Btn></div>
        </div>
        {step === 1 && <div style={{ background: "#FFF8ED", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(245,166,35,0.15)" }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F5A623" }}/><div><div style={{ fontSize: 13, fontWeight: 700, color: "#92610A" }}>En route vers vous</div><div style={{ fontSize: 11, color: "#B8860B" }}>Arrivée estimée ~15 min</div></div></div>}
        {step === 2 && <div style={{ background: T.surface, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>{I.check(T.accent,16)}<div style={{ fontSize: 13, fontWeight: 600, color: T.accentText }}>Intervention en cours</div></div>}
        {step >= 3 && <div style={{ background: T.surface, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>{I.check("#22C88A",16)}<div style={{ fontSize: 13, fontWeight: 600, color: T.accentText }}>Intervention terminée — en attente de validation</div></div>}
      </Card>
      <Card T={T} style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.t1, marginBottom: 16 }}>Progression</div>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.done ? T.accent : T.surface, border: s.done ? "none" : `2px solid ${T.borderMed}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.done ? I.check("#fff",14) : <span style={{ fontFamily: "'DM Mono'", fontSize: 10, fontWeight: 700, color: T.t3 }}>{i+1}</span>}</div>
              {i < 3 && <div style={{ width: 2, height: 36, background: s.done ? T.accent : T.borderMed }}/>}
            </div>
            <div style={{ paddingBottom: i < 3 ? 20 : 0, paddingTop: 4 }}>
              <div style={{ display: "flex", gap: 8 }}><span style={{ fontSize: 13, fontWeight: 700, color: s.done ? T.accent : T.t1 }}>{s.label}</span><span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: T.t3 }}>{s.time}</span></div>
              <div style={{ fontSize: 12, color: T.t3 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </Card>
      <div style={{ display: "flex", gap: 8 }}>
        {[{ l: "→ Sur place", s: 2 }, { l: "→ Terminé", s: 3 }].filter(b => b.s > step).map(b => <button key={b.s} onClick={() => setStep(b.s)} style={{ flex: 1, padding: 10, borderRadius: 12, background: T.card, border: `1px dashed ${T.borderMed}`, fontSize: 11, color: T.t3, cursor: "pointer" }}>Démo : {b.l}</button>)}
      </div>
      {step >= 3 && <Btn T={T} full style={{ marginTop: 16 }} onClick={() => setPage("mission-detail")}>Valider l'intervention</Btn>}
    </div>
  );
};

/* ━━━ PAGE: SIGNATURE DEVIS (CLIENT) ━━━ */
const PageSignDevis = ({ setPage, T }) => {
  const [signed, setSigned] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const startDraw = (e) => { setDrawing(true); setHasDrawn(true); const c = canvasRef.current.getContext("2d"); const r = canvasRef.current.getBoundingClientRect(); c.beginPath(); c.moveTo((e.touches?e.touches[0].clientX:e.clientX)-r.left, (e.touches?e.touches[0].clientY:e.clientY)-r.top); };
  const draw = (e) => { if(!drawing)return; const c=canvasRef.current.getContext("2d"); const r=canvasRef.current.getBoundingClientRect(); c.lineWidth=2.5; c.lineCap="round"; c.strokeStyle="#0A1628"; c.lineTo((e.touches?e.touches[0].clientX:e.clientX)-r.left,(e.touches?e.touches[0].clientY:e.clientY)-r.top); c.stroke(); };
  const endDraw = () => setDrawing(false);
  if (signed) return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "140px 24px 60px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>{I.check("#fff",36)}</div>
      <h2 style={{ fontFamily: "'Manrope'", fontSize: 24, fontWeight: 800, color: T.t1, marginBottom: 8 }}>Devis signé !</h2>
      <p style={{ fontSize: 14, color: T.t3, marginBottom: 24 }}>Il ne reste plus qu'à bloquer le paiement en séquestre.</p>
      <Btn T={T} full onClick={() => setPage("booking")}>Procéder au paiement — 320,00 €</Btn>
    </div>
  );
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 20 }}>Signer le devis</h1>
      <Card T={T} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><div><div style={{ fontSize: 12, color: T.t3 }}>Devis #D-2026-089</div><div style={{ fontSize: 16, fontWeight: 700, color: T.t1 }}>Réparation fuite sous évier</div></div><div style={{ fontFamily: "'DM Mono'", fontSize: 22, fontWeight: 700, color: T.accent }}>320 €</div></div>
        {[["Remplacement siphon","45 €"],["Joint flexible inox","25 €"],["Main d'œuvre (2h)","180 €"],["Déplacement","40 €"],["TVA (10%)","30 €"]].map(([l,p],i)=><div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.t2 }}><span>{l}</span><span style={{ fontFamily: "'DM Mono'", color: T.t1 }}>{p}</span></div>)}
      </Card>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 10 }}>Votre signature</div>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <canvas ref={canvasRef} width={560} height={140} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} style={{ width: "100%", height: 140, borderRadius: 16, border: `2px dashed ${T.borderMed}`, background: T.card, cursor: "crosshair", touchAction: "none" }}/>
        {!hasDrawn && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 13, color: T.t3, pointerEvents: "none" }}>Signez ici</div>}
      </div>
      <Btn T={T} full disabled={!hasDrawn} onClick={() => setSigned(true)}>{I.lock(hasDrawn?"#fff":"#6B7280",16)} Signer et bloquer le paiement</Btn>
    </div>
  );
};

/* ━━━ PAGE: PARRAINAGE ━━━ */
const PageReferral = ({ T }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 24 }}>Inviter des proches</h1>
      <div style={{ background: `linear-gradient(135deg, #0A4030, #1B6B4E)`, borderRadius: 20, padding: "32px 24px", textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🎁</div>
        <div style={{ fontFamily: "'Manrope'", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Gagnez 20€ par parrainage</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>Invitez un ami. Quand il réalise sa première intervention, vous recevez chacun 20€.</div>
      </div>
      <Card T={T} style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 10 }}>Votre code</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, background: T.surface, borderRadius: 12, padding: "14px 16px", fontFamily: "'DM Mono'", fontSize: 18, fontWeight: 700, color: T.accent, letterSpacing: 1 }}>NOVA-SL25</div>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: "14px 20px", borderRadius: 12, background: copied ? "#22C88A" : T.accent, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{copied ? "Copié ✓" : "Copier"}</button>
        </div>
      </Card>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {[{ l: "WhatsApp", e: "💬", bg: "#25D366" }, { l: "SMS", e: "📱", bg: "#4A5568" }, { l: "Email", e: "✉️", bg: "#1B6B4E" }, { l: "Lien", e: "🔗", bg: "#6B7280" }].map(s => (
          <button key={s.l} style={{ flex: 1, padding: "16px 8px", borderRadius: 14, background: s.bg, border: "none", cursor: "pointer", textAlign: "center" }}><div style={{ fontSize: 22, marginBottom: 4 }}>{s.e}</div><div style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{s.l}</div></button>
        ))}
      </div>
      <Card T={T}>
        <div style={{ fontSize: 12, color: T.t3, marginBottom: 10 }}>Vos parrainages</div>
        <div style={{ display: "flex", gap: 12 }}>
          {[{ v: "3", l: "Invitations" }, { v: "1", l: "Inscrit" }, { v: "20€", l: "Crédit gagné" }].map((k, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: 12, background: T.surface }}><div style={{ fontFamily: "'DM Mono'", fontSize: 22, fontWeight: 700, color: T.accent }}>{k.v}</div><div style={{ fontSize: 10, color: T.t3, marginTop: 2 }}>{k.l}</div></div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ━━━ PAGE: CARNET CLIENTS (ARTISAN) ━━━ */
const PageClientBook = ({ T }) => {
  const [search, setSearch] = useState("");
  const clients = [
    { name: "Pierre Martin", ini: "PM", missions: 4, last: "15 mars", total: "1 280€", phone: "06 12 34 56 78" },
    { name: "Sophie Lefèvre", ini: "SL", missions: 2, last: "10 mars", total: "475€", phone: "06 98 76 54 32" },
    { name: "Caroline Durand", ini: "CD", missions: 1, last: "2 mars", total: "280€", phone: "06 45 67 89 01" },
    { name: "Antoine Moreau", ini: "AM", missions: 3, last: "22 fév", total: "950€", phone: "06 23 45 67 89" },
  ];
  const filtered = search ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : clients;
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 20 }}>Mes clients</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[{ v: "4", l: "Clients" }, { v: "10", l: "Missions" }, { v: "2 985€", l: "CA total" }].map((k, i) => (
          <Card key={i} T={T} style={{ flex: 1, textAlign: "center", padding: "14px 8px" }}><div style={{ fontFamily: "'DM Mono'", fontSize: 20, fontWeight: 700, color: T.accent }}>{k.v}</div><div style={{ fontSize: 10, color: T.t3 }}>{k.l}</div></Card>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, borderRadius: 14, padding: "10px 16px", border: `1px solid ${T.borderMed}`, marginBottom: 20 }}>
        {I.lock(T.t3, 16)}<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client..." style={{ border: "none", outline: "none", fontSize: 14, color: T.t1, flex: 1, background: "transparent" }}/>
      </div>
      {filtered.map((c, i) => (
        <Card key={i} T={T} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: T.avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: T.accent }}>{c.ini}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: T.t1 }}>{c.name}</div><div style={{ fontSize: 12, color: T.t3 }}>{c.missions} missions • Dernier : {c.last}</div><div style={{ fontSize: 11, color: T.t3 }}>{c.phone}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'DM Mono'", fontSize: 15, fontWeight: 700, color: T.accent }}>{c.total}</div></div>
        </Card>
      ))}
    </div>
  );
};

/* ━━━ PAGE: VIDÉO DIAGNOSTIC (CLIENT) ━━━ */
const PageVideoDiag = ({ setPage, T }) => {
  const [stage, setStage] = useState(0);
  if (stage === 2) return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "140px 24px 60px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>{I.check("#fff",36)}</div>
      <h2 style={{ fontFamily: "'Manrope'", fontSize: 24, fontWeight: 800, color: T.t1, marginBottom: 8 }}>Vidéo envoyée !</h2>
      <p style={{ fontSize: 14, color: T.t3, marginBottom: 8 }}>L'artisan va analyser votre vidéo et préparer son intervention.</p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.surface, padding: "8px 14px", borderRadius: 10, marginBottom: 24 }}>{I.clock(T.accent,14)}<span style={{ fontSize: 12, fontWeight: 600, color: T.accentText }}>Réponse estimée sous 2h</span></div>
      <Btn T={T} full onClick={() => setPage("booking")}>Retour à la réservation</Btn>
    </div>
  );
  if (stage === 1) return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 20 }}>Aperçu de la vidéo</h1>
      <div style={{ background: "linear-gradient(170deg, #1a1a2e, #0f3460)", borderRadius: 20, height: 240, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21" fill="rgba(255,255,255,0.8)"/></svg>
        <div style={{ position: "absolute", bottom: 12, right: 14, fontFamily: "'DM Mono'", fontSize: 12, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "3px 8px", borderRadius: 6 }}>00:34</div>
      </div>
      <textarea placeholder="Note pour l'artisan (optionnel)..." style={{ width: "100%", height: 80, borderRadius: 14, border: `1px solid ${T.borderMed}`, padding: 12, fontSize: 13, resize: "none", outline: "none", boxSizing: "border-box", background: T.card, color: T.t1, marginBottom: 16 }}/>
      <Btn T={T} full onClick={() => setStage(2)}>{I.send("#fff")} Envoyer à l'artisan</Btn>
      <button onClick={() => setStage(0)} style={{ width: "100%", padding: 12, marginTop: 8, borderRadius: 12, background: T.card, border: `1px solid ${T.borderMed}`, fontSize: 13, color: T.t3, cursor: "pointer" }}>Refaire la vidéo</button>
    </div>
  );
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 8 }}>Vidéo diagnostic</h1>
      <p style={{ fontSize: 14, color: T.t3, marginBottom: 24 }}>Filmez votre problème. L'artisan pourra évaluer la situation avant de se déplacer.</p>
      <Card T={T} style={{ marginBottom: 24 }}>
        {[{ i: "💡", t: "Bon éclairage", d: "Allumez les lumières" }, { i: "📐", t: "Zone complète", d: "Filmez large puis zoomez" }, { i: "🎙️", t: "Décrivez à voix haute", d: "Expliquez ce que vous voyez" }, { i: "⏱️", t: "30 à 60 secondes", d: "Court et précis" }].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 12 : 0, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{tip.i}</div>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{tip.t}</div><div style={{ fontSize: 11, color: T.t3 }}>{tip.d}</div></div>
          </div>
        ))}
      </Card>
      <Btn T={T} full style={{ background: "#E8302A" }} onClick={() => setStage(1)}>Commencer l'enregistrement</Btn>
    </div>
  );
};

/* ━━━ PAGE: CONTRAT ENTRETIEN (CLIENT) ━━━ */
const PageEntretien = ({ setPage, T }) => {
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(false);
  if (done) return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "140px 24px 60px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>{I.check("#fff",36)}</div>
      <h2 style={{ fontFamily: "'Manrope'", fontSize: 24, fontWeight: 800, color: T.t1, marginBottom: 8 }}>Contrat souscrit !</h2>
      <p style={{ fontSize: 14, color: T.t3, marginBottom: 24 }}>L'artisan vous contactera pour planifier la première intervention.</p>
      <Btn T={T} full onClick={() => setPage("missions")}>Voir mes missions</Btn>
    </div>
  );
  const plans = [
    { id: "chaudiere", icon: "🔥", name: "Entretien chaudière", price: "120", freq: "1 visite/an", desc: "Vérification obligatoire, nettoyage, attestation" },
    { id: "clim", icon: "❄️", name: "Entretien climatisation", price: "150", freq: "1 visite/an", desc: "Filtres, fluide, contrôle performance" },
    { id: "plomberie", icon: "🔧", name: "Check-up plomberie", price: "90", freq: "1 visite/an", desc: "Inspection canalisations, détection fuites" },
    { id: "complet", icon: "⭐", name: "Pack Sérénité", price: "299", freq: "3 visites/an", desc: "Tout inclus + intervention prioritaire", popular: true },
  ];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 24 }}>Contrat d'entretien annuel</h1>
      {plans.map(p => (
        <Card key={p.id} T={T} onClick={() => setSel(p.id)} style={{ cursor: "pointer", marginBottom: 10, border: sel === p.id ? `2px solid ${T.accent}` : `1px solid ${T.border}`, position: "relative" }}>
          {p.popular && <div style={{ position: "absolute", top: -1, right: 16, background: "#F5A623", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 8px 8px" }}>POPULAIRE</div>}
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{p.name}</span><div><span style={{ fontFamily: "'DM Mono'", fontSize: 18, fontWeight: 700, color: T.accent }}>{p.price}€</span><span style={{ fontSize: 10, color: T.t3 }}>/an</span></div></div>
              <div style={{ fontSize: 12, color: T.t3, marginBottom: 4 }}>{p.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.accent }}>{p.freq}</div>
            </div>
          </div>
        </Card>
      ))}
      <Btn T={T} full disabled={!sel} onClick={() => setDone(true)} style={{ marginTop: 16 }}>{I.lock(sel?"#fff":"#6B7280",16)} Souscrire le contrat</Btn>
    </div>
  );
};

/* ━━━ PAGE: QR CODE (ARTISAN) ━━━ */
const PageQRCode = ({ T }) => {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 24 }}>Mon QR code</h1>
      <Card T={T} style={{ textAlign: "center", padding: "36px 24px", marginBottom: 20 }}>
        <div style={{ width: 200, height: 200, borderRadius: 16, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: `1px solid ${T.borderMed}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: 2, width: 140, height: 140 }}>
            {Array(100).fill(0).map((_, i) => <div key={i} style={{ borderRadius: 2, background: ((i*17+7)*13)%100 < 40 || (i < 30 && i % 10 < 3) || (i >= 70 && i % 10 < 3) || (i < 30 && i % 10 >= 7) ? T.t1 : "transparent" }}/>)}
          </div>
        </div>
        <div style={{ fontFamily: "'Manrope'", fontSize: 18, fontWeight: 800, color: T.t1, marginBottom: 4 }}>Jean-Michel Petit</div>
        <div style={{ fontSize: 13, color: T.t3, marginBottom: 8 }}>Plombier-Chauffagiste</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.surface, borderRadius: 10, padding: "5px 12px" }}>{I.shield(T.accent,14)}<span style={{ fontSize: 11, fontWeight: 600, color: T.accentText }}>Certifié Nova #2847</span></div>
        <div style={{ fontFamily: "'DM Mono'", fontSize: 11, color: T.t3, marginTop: 12 }}>nova.fr/p/jean-michel-petit-2847</div>
      </Card>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ flex: 1, padding: 14, borderRadius: 14, background: saved ? "#22C88A" : T.accent, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{saved ? "Enregistré ✓" : "Enregistrer"}</button>
        <button style={{ flex: 1, padding: 14, borderRadius: 14, background: T.card, color: T.accent, border: `1px solid ${T.borderMed}`, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Partager</button>
      </div>
      <Card T={T}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, marginBottom: 12 }}>Où l'utiliser</div>
        {[["🚐","Véhicule"],["💼","Cartes de visite"],["📄","Devis et factures"],["📧","Signature email"],["📱","Réseaux sociaux"]].map(([e,t],i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <span style={{ fontSize: 18 }}>{e}</span><span style={{ fontSize: 13, color: T.t1 }}>{t}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ━━━ PAGE: COMPTABILITÉ (ARTISAN) ━━━ */
const PageCompta = ({ T }) => {
  const [connected, setConnected] = useState({ pennylane: false, indy: false });
  const [autoExp, setAutoExp] = useState(true);
  const services = [
    { id: "pennylane", name: "Pennylane", desc: "Comptabilité tout-en-un TPE/PME", color: "#6366F1", letter: "P" },
    { id: "indy", name: "Indy", desc: "Automatisée pour indépendants", color: "#3B82F6", letter: "I" },
    { id: "quickbooks", name: "QuickBooks", desc: "Facturation internationale", color: "#2CA01C", letter: "Q" },
    { id: "tiime", name: "Tiime", desc: "Gratuit pour auto-entrepreneurs", color: "#0A1628", letter: "T" },
  ];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Manrope'", fontSize: 26, fontWeight: 800, color: T.t1, marginBottom: 24 }}>Comptabilité</h1>
      <div style={{ background: T.surface, borderRadius: 16, padding: "14px 16px", marginBottom: 24, display: "flex", gap: 10 }}>
        {I.doc(T.accent,20)}<div><div style={{ fontSize: 13, fontWeight: 700, color: T.accentText }}>Simplifiez votre comptabilité</div><div style={{ fontSize: 12, color: T.t2 }}>Connectez votre logiciel. Factures et paiements envoyés automatiquement.</div></div>
      </div>
      {services.map(s => (
        <Card key={s.id} T={T} style={{ marginBottom: 10, border: connected[s.id] ? `2px solid ${T.accent}` : `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope'", fontSize: 18, fontWeight: 800, color: "#fff" }}>{s.letter}</div>
            <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{s.name}</span>{connected[s.id] && <span style={{ fontSize: 9, fontWeight: 700, color: "#22C88A", background: "rgba(34,200,138,0.1)", padding: "2px 8px", borderRadius: 6 }}>CONNECTÉ</span>}</div><div style={{ fontSize: 12, color: T.t3 }}>{s.desc}</div></div>
            <button onClick={() => setConnected(c => ({ ...c, [s.id]: !c[s.id] }))} style={{ padding: "8px 16px", borderRadius: 10, background: connected[s.id] ? T.card : T.accent, color: connected[s.id] ? "#E8302A" : "#fff", border: connected[s.id] ? `1px solid ${T.borderMed}` : "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{connected[s.id] ? "Déconnecter" : "Connecter"}</button>
          </div>
        </Card>
      ))}
      <Card T={T} style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div><div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>Export automatique</div><div style={{ fontSize: 12, color: T.t3 }}>Envoyer chaque nouvelle facture</div></div>
          <div onClick={() => setAutoExp(!autoExp)} style={{ width: 48, height: 28, borderRadius: 14, background: autoExp ? T.accent : T.borderMed, padding: 2, cursor: "pointer", display: "flex", alignItems: "center" }}><div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", transform: autoExp ? "translateX(20px)" : "translateX(0)", transition: "transform 200ms" }}/></div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["📊","Export CSV"],["📄","Export PDF"]].map(([e,l],i) => <button key={i} style={{ flex: 1, padding: "14px", borderRadius: 14, background: T.surface, border: "none", cursor: "pointer", textAlign: "center" }}><div style={{ fontSize: 22, marginBottom: 4 }}>{e}</div><div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{l}</div></button>)}
        </div>
      </Card>
      <Card T={T}>
        <div style={{ fontSize: 12, color: T.t3, marginBottom: 10 }}>Récapitulatif mars 2026</div>
        {[["Revenus bruts","4 820,00 €",T.t1],["Commission Nova","- 482,00 €","#E8302A"],["Revenus nets","4 338,00 €",T.accent,true],["TVA collectée","803,33 €",T.t3],["Factures","12",T.t3]].map(([l,v,c,b],i)=>(
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}><span style={{ fontSize: 12, color: T.t3 }}>{l}</span><span style={{ fontFamily: "'DM Mono'", fontSize: b ? 16 : 12, fontWeight: b ? 700 : 500, color: c }}>{v}</span></div>
        ))}
      </Card>
    </div>
  );
};

/* ━━━ MAIN APP ━━━ */
export default function NovaWeb() {
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState(null); // null | "client" | "artisan"
  const T = useTheme(darkMode);
  const dm = darkMode;

  const loginAs = (m) => { setMode(m); setPage(m === "client" ? "client-dash" : "artisan-dash"); };
  const { show: showToast, ToastUI } = useToast();
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.t1, transition: "background 300ms ease, color 300ms ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        input:focus, textarea:focus { border-color: #1B6B4E !important; box-shadow: 0 0 0 3px rgba(27,107,78,0.08); }
        button { transition: transform 100ms ease, opacity 100ms ease; }
        button:active { transform: scale(0.98); }
        ::placeholder { color: ${T.hint}; }

        /* ── PAGE TRANSITION ── */
        .page-enter { animation: pageIn 250ms ease-out both; }
        @keyframes pageIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        /* ── SKELETON SHIMMER ── */
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .skeleton { background: linear-gradient(90deg, ${T.surface} 25%, ${T.borderMed} 50%, ${T.surface} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }

        /* ── TOAST ── */
        @keyframes toastIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toastOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .hero-title { font-size: 32px !important; }
          .hero-desc { font-size: 15px !important; }
          .hero-cta { flex-direction: column !important; }
          .hide-mobile { display: none !important; }
          .nav-links { display: none !important; }
          .nav-mobile-menu { display: flex !important; }
          .stats-row { flex-wrap: wrap; }
          .page-container { padding: 80px 16px 40px !important; }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 26px !important; }
        }
        .nav-mobile-menu { display: none; }

        /* ── FORM VALIDATION ── */
        input:invalid:not(:placeholder-shown) { border-color: #E8302A !important; box-shadow: 0 0 0 3px rgba(232,48,42,0.08); }
      `}</style>

      <Navbar page={page} setPage={setPage} T={T} dm={dm} mode={mode} setMode={setMode}/>

      {/* Public pages */}
      {page === "home" && <PageHome setPage={setPage} T={T} dm={dm} loginAs={loginAs}/>}
      {page === "login" && <PageLogin setPage={setPage} T={T} dm={dm} loginAs={loginAs}/>}
      {page === "signup" && <PageSignup setPage={setPage} T={T} dm={dm}/>}
      {page === "support" && <PageSupport T={T} dm={dm}/>}
      {page === "settings" && <PageSettings T={T} dm={dm} setDarkMode={setDarkMode} setPage={setPage}/>}

      {/* Client pages */}
      {page === "client-dash" && <PageClientDash setPage={setPage} T={T}/>}
      {page === "search" && <PageSearch setPage={setPage} T={T}/>}
      {page === "artisan-detail" && <PageArtisanDetail setPage={setPage} T={T}/>}
      {page === "booking" && <PageBooking setPage={setPage} T={T}/>}
      {page === "missions" && <PageMissions setPage={setPage} T={T}/>}
      {page === "mission-detail" && <PageMissionDetail setPage={setPage} T={T}/>}
      {page === "report-issue" && <PageReportIssue setPage={setPage} T={T}/>}
      {page === "notifs-client" && <PageNotifsClient setPage={setPage} T={T}/>}
      {page === "profile-client" && <PageProfileClient setPage={setPage} T={T}/>}
      {page === "payment-methods" && <PagePaymentMethods setPage={setPage} T={T}/>}
      {page === "urgence" && <PageUrgence setPage={setPage} T={T}/>}

      {/* Artisan pages */}
      {page === "artisan-dash" && <PageArtisanDash setPage={setPage} T={T}/>}
      {page === "create-quote" && <PageCreateQuote setPage={setPage} T={T}/>}
      {page === "create-invoice" && <PageCreateInvoice setPage={setPage} T={T}/>}
      {page === "docs" && <PageDocs T={T}/>}
      {page === "payments" && <PagePayments T={T}/>}
      {page === "notifs-artisan" && <PageNotifsArtisan setPage={setPage} T={T}/>}
      {page === "profile-artisan" && <PageProfileArtisan setPage={setPage} T={T}/>}

      {/* New feature pages */}
      {page === "tracking" && <PageTracking setPage={setPage} T={T}/>}
      {page === "sign-devis" && <PageSignDevis setPage={setPage} T={T}/>}
      {page === "referral" && <PageReferral T={T}/>}
      {page === "client-book" && <PageClientBook T={T}/>}
      {page === "video-diag" && <PageVideoDiag setPage={setPage} T={T}/>}
      {page === "entretien" && <PageEntretien setPage={setPage} T={T}/>}
      {page === "qr-code" && <PageQRCode T={T}/>}
      {page === "compta" && <PageCompta T={T}/>}

      {/* Shared */}
      {page === "notif-prefs" && <PageNotifPrefs setPage={setPage} T={T}/>}

      <Footer T={T} setPage={setPage}/>
      <ToastUI/>
    </div>
  );
}
