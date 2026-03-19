import { useState, useEffect, useRef, useCallback } from "react";

/* ━━━ ICONS (inline SVGs) ━━━ */
const Icons = {
  shield: (c = "#F5A623", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill={c} opacity="0.15"/>
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={c} strokeWidth="1.5" fill="none"/>
      <path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (c = "#14523B", s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={c} strokeWidth="1.5"/>
      <path d="M8 11V7a4 4 0 118 0v4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill={c}/>
    </svg>
  ),
  star: (c = "#F5A623", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={c}/></svg>
  ),
  home: (c, s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  search: (c, s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.8"/><path d="M16 16l4 4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  briefcase: (c, s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke={c} strokeWidth="1.8"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M12 12v1" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  chat: (c, s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  user: (c, s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/><path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  bolt: (c = "#fff", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={c}/></svg>
  ),
  check: (c = "#22C88A", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  back: (c = "#1B6B4E", s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  camera: (c = "#1B6B4E", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="13" r="4" stroke={c} strokeWidth="1.5"/></svg>
  ),
  bell: (c = "#0A1628", s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  plus: (c = "#fff", s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>
  ),
  doc: (c = "#1B6B4E", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={c} strokeWidth="1.5"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  mapPin: (c = "#1B6B4E", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="1.5"/></svg>
  ),
  navigation: (c = "#1B6B4E", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 11l19-9-9 19-2-8-8-2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>
  ),
  clock: (c = "#8A95A3", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.5"/><path d="M12 6v6l4 2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  phone: (c = "#1B6B4E", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z" stroke={c} strokeWidth="1.5"/></svg>
  ),
  credit: (c = "#1B6B4E", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2.5" stroke={c} strokeWidth="1.5"/><path d="M2 10h20" stroke={c} strokeWidth="1.5"/><path d="M6 15h4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  settings: (c = "#8A95A3", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.5"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={c} strokeWidth="1.5"/></svg>
  ),
  edit: (c = "#1B6B4E", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  logout: (c = "#E8302A", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  building: (c = "#1B6B4E", s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" stroke={c} strokeWidth="1.5"/><path d="M9 22V12h6v10M9 6h.01M15 6h.01M9 10h.01M15 10h.01" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
};

/* ━━━ CATEGORY ICONS ━━━ */
const CatIcon = ({ type, size = 40 }) => {
  const iconMap = {
    plumber: { emoji: "🔧", bg: "linear-gradient(135deg, #E8F5EE 0%, #DDDDE5 100%)" },
    electrician: { emoji: "⚡", bg: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)" },
    locksmith: { emoji: "🔑", bg: "linear-gradient(135deg, #E8F5EE 0%, #E5E5EA 100%)" },
    mason: { emoji: "🧱", bg: "linear-gradient(135deg, #FFF0EF 0%, #FFE0DD 100%)" },
    heating: { emoji: "🔥", bg: "linear-gradient(135deg, #FFF3DC 0%, #FFE4B5 100%)" },
    painter: { emoji: "🎨", bg: "linear-gradient(135deg, #E8FAF3 0%, #C8F5E2 100%)" },
  };
  const i = iconMap[type] || iconMap.plumber;
  return (
    <div style={{
      width: size, height: size, borderRadius: 14,
      background: i.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.45,
    }}>
      {i.emoji}
    </div>
  );
};

/* ━━━ EMPTY STATE ━━━ */
const EmptyState = ({ icon, title, desc, cta, onCta }) => (
  <div style={{ textAlign: "center", padding: "48px 24px" }}>
    <div style={{ width: 72, height: 72, borderRadius: 22, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
      {icon}
    </div>
    <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1628", marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, maxWidth: 240, margin: "0 auto 20px" }}>{desc}</div>
    {cta && <button onClick={onCta} className="btn-press" style={{ padding: "10px 24px", borderRadius: 12, background: "#1B6B4E", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{cta}</button>}
  </div>
);

/* ━━━ SKELETON LOADER ━━━ */
const Skeleton = ({ width = "100%", height = 16, radius = 8, style: s = {} }) => (
  <div style={{ width, height, borderRadius: radius, background: "linear-gradient(90deg, #E8F5EE 25%, #D4EBE0 50%, #E8F5EE 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", ...s }} />
);

const SkeletonCard = () => (
  <div style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 10, border: "1px solid rgba(10,22,40,0.04)" }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
      <Skeleton width={44} height={44} radius={14} />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={10} />
      </div>
    </div>
    <Skeleton width="100%" height={10} style={{ marginBottom: 6 }} />
    <Skeleton width="75%" height={10} />
  </div>
);

/* ━━━ MOCK DATA ━━━ */
const categories = [
  { id: "plumber", label: "Plombier", count: 47 },
  { id: "electrician", label: "Électricien", count: 38 },
  { id: "locksmith", label: "Serrurier", count: 29 },
  { id: "mason", label: "Maçon", count: 22 },
  { id: "heating", label: "Chauffagiste", count: 31 },
  { id: "other", label: "Autre", count: null },
];

const allCategories = [
  { id: "plumber", label: "Plombier", count: 47 },
  { id: "electrician", label: "Électricien", count: 38 },
  { id: "locksmith", label: "Serrurier", count: 29 },
  { id: "mason", label: "Maçon", count: 22 },
  { id: "heating", label: "Chauffagiste", count: 31 },
  { id: "painter", label: "Peintre", count: 35 },
  { id: "carpenter", label: "Menuisier", count: 18 },
  { id: "roofer", label: "Couvreur", count: 12 },
  { id: "tiler", label: "Carreleur", count: 21 },
  { id: "gardener", label: "Jardinier", count: 26 },
  { id: "cleaner", label: "Nettoyage", count: 33 },
  { id: "mover", label: "Déménageur", count: 15 },
];

const topArtisans = [
  { id: 1, name: "Jean-Michel P.", job: "Plombier", rating: 4.9, reviews: 127, price: 65, photo: "JM", responseTime: "< 2h", missions: 127 },
  { id: 2, name: "Sophie M.", job: "Électricienne", rating: 4.8, reviews: 94, price: 70, photo: "SM", responseTime: "< 1h", missions: 94 },
  { id: 3, name: "Karim B.", job: "Serrurier", rating: 5.0, reviews: 83, price: 60, photo: "KB", responseTime: "< 30min", missions: 83 },
  { id: 4, name: "Marie D.", job: "Peintre", rating: 4.7, reviews: 61, price: 55, photo: "MD", responseTime: "< 3h", missions: 61 },
];

const artisansByCategory = {
  plumber: [
    { id: 1, name: "Jean-Michel P.", rating: 4.9, reviews: 127, price: 65, initials: "JM", responseTime: "< 2h", missions: 127, available: true },
    { id: 5, name: "Thomas R.", rating: 4.7, reviews: 68, price: 60, initials: "TR", responseTime: "< 3h", missions: 68, available: true },
    { id: 6, name: "Fatima H.", rating: 4.8, reviews: 91, price: 70, initials: "FH", responseTime: "< 1h", missions: 91, available: true },
    { id: 7, name: "Laurent G.", rating: 4.5, reviews: 42, price: 55, initials: "LG", responseTime: "< 4h", missions: 42, available: false },
    { id: 8, name: "Nicolas B.", rating: 4.6, reviews: 53, price: 62, initials: "NB", responseTime: "< 2h", missions: 53, available: true },
  ],
  electrician: [
    { id: 2, name: "Sophie M.", rating: 4.8, reviews: 94, price: 70, initials: "SM", responseTime: "< 1h", missions: 94, available: true },
    { id: 9, name: "David L.", rating: 4.6, reviews: 72, price: 65, initials: "DL", responseTime: "< 2h", missions: 72, available: true },
    { id: 10, name: "Amina K.", rating: 4.9, reviews: 58, price: 75, initials: "AK", responseTime: "< 3h", missions: 58, available: true },
  ],
  locksmith: [
    { id: 3, name: "Karim B.", rating: 5.0, reviews: 83, price: 60, initials: "KB", responseTime: "< 30min", missions: 83, available: true },
    { id: 11, name: "Éric F.", rating: 4.7, reviews: 45, price: 65, initials: "EF", responseTime: "< 1h", missions: 45, available: true },
  ],
  mason: [
    { id: 12, name: "Philippe C.", rating: 4.6, reviews: 34, price: 55, initials: "PC", responseTime: "< 4h", missions: 34, available: true },
    { id: 13, name: "Mehdi A.", rating: 4.8, reviews: 67, price: 60, initials: "MA", responseTime: "< 2h", missions: 67, available: true },
  ],
  heating: [
    { id: 14, name: "Christophe D.", rating: 4.9, reviews: 89, price: 75, initials: "CD", responseTime: "< 2h", missions: 89, available: true },
    { id: 15, name: "Julie V.", rating: 4.7, reviews: 51, price: 68, initials: "JV", responseTime: "< 3h", missions: 51, available: true },
  ],
  painter: [
    { id: 4, name: "Marie D.", rating: 4.7, reviews: 61, price: 55, initials: "MD", responseTime: "< 3h", missions: 61, available: true },
    { id: 16, name: "Youssef M.", rating: 4.5, reviews: 38, price: 50, initials: "YM", responseTime: "< 4h", missions: 38, available: true },
  ],
  carpenter: [
    { id: 17, name: "Rémi T.", rating: 4.8, reviews: 44, price: 65, initials: "RT", responseTime: "< 3h", missions: 44, available: true },
    { id: 18, name: "Claire B.", rating: 4.6, reviews: 29, price: 60, initials: "CB", responseTime: "< 4h", missions: 29, available: true },
  ],
  roofer: [
    { id: 19, name: "Antoine V.", rating: 4.7, reviews: 31, price: 70, initials: "AV", responseTime: "< 4h", missions: 31, available: true },
  ],
  tiler: [
    { id: 20, name: "Marco P.", rating: 4.9, reviews: 52, price: 55, initials: "MP", responseTime: "< 2h", missions: 52, available: true },
    { id: 21, name: "Sandrine L.", rating: 4.6, reviews: 37, price: 50, initials: "SL", responseTime: "< 3h", missions: 37, available: true },
  ],
  gardener: [
    { id: 22, name: "Olivier G.", rating: 4.8, reviews: 63, price: 45, initials: "OG", responseTime: "< 3h", missions: 63, available: true },
    { id: 23, name: "Nadia F.", rating: 4.5, reviews: 28, price: 40, initials: "NF", responseTime: "< 4h", missions: 28, available: true },
  ],
  cleaner: [
    { id: 24, name: "Patricia M.", rating: 4.9, reviews: 87, price: 35, initials: "PM", responseTime: "< 1h", missions: 87, available: true },
    { id: 25, name: "Hassan R.", rating: 4.7, reviews: 55, price: 38, initials: "HR", responseTime: "< 2h", missions: 55, available: true },
  ],
  mover: [
    { id: 26, name: "Équipe DémExpress", rating: 4.6, reviews: 41, price: 50, initials: "DE", responseTime: "< 4h", missions: 41, available: true },
  ],
};

const mockReviews = [
  { name: "Caroline L.", rating: 5, text: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !", date: "Il y a 3 jours" },
  { name: "Pierre M.", rating: 5, text: "Intervention rapide et soignée. Le séquestre Nova m'a rassuré.", date: "Il y a 1 semaine" },
  { name: "Amélie R.", rating: 4, text: "Bon travail dans l'ensemble. Quelques finitions à revoir mais honnête et fiable.", date: "Il y a 2 semaines" },
];

/* ━━━ SHARED COMPONENTS ━━━ */
const Badge = ({ type, small }) => {
  const styles = {
    certified: { bg: "rgba(245,166,35,0.1)", color: "#B07000", border: "rgba(245,166,35,0.3)", icon: Icons.shield("#F5A623", small ? 13 : 15), text: "Certifié Nova" },
    payment: { bg: "rgba(27,107,78,0.08)", color: "#14523B", border: "rgba(27,107,78,0.2)", icon: Icons.lock("#14523B", small ? 13 : 15), text: "Paiement Sécurisé" },
    validated: { bg: "rgba(34,200,138,0.08)", color: "#0D7A52", border: "rgba(34,200,138,0.2)", icon: Icons.check("#0D7A52", small ? 13 : 15), text: "Mission Validée" },
    insured: { bg: "rgba(107,33,168,0.06)", color: "#6B21A8", border: "rgba(107,33,168,0.15)", icon: null, text: "📋 Décennale" },
    rge: { bg: "rgba(245,166,35,0.08)", color: "#92400E", border: "rgba(245,166,35,0.2)", icon: null, text: "⚡ RGE" },
    pro: { bg: "rgba(245,166,35,0.08)", color: "#B07000", border: "rgba(245,166,35,0.2)", icon: null, text: "🏆 Pro" },
  };
  const s = styles[type];
  return (
    <span className="badge-shimmer" style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: small ? "3px 8px" : "5px 10px",
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 20, fontSize: small ? 10 : 11.5, fontWeight: 600,
      whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
    }}>
      {s.icon}{s.text}
    </span>
  );
};

const Stars = ({ rating, size = 14 }) => (
  <span style={{ display: "inline-flex", gap: 1 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={i <= rating ? "#F5A623" : "#D4EBE0"}/>
      </svg>
    ))}
  </span>
);

const EscrowStepper = ({ step = 0, compact }) => {
  const steps = [
    { icon: "🔒", label: "Paiement bloqué" },
    { icon: "🔧", label: "Mission en cours" },
    { icon: "✅", label: "Nous validons" },
    { icon: "💸", label: "Artisan payé" },
  ];
  return (
    <div style={{ padding: compact ? "10px 0" : "14px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <div style={{
          position: "absolute", top: compact ? 13 : 16, left: "10%", right: "10%", height: 2,
          background: "#D4EBE0", borderRadius: 2,
        }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: "linear-gradient(90deg, #1B6B4E, #22C88A)",
            width: `${(step / 3) * 100}%`,
            transition: "width 800ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}/>
        </div>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, flex: 1 }}>
            <div style={{
              width: compact ? 28 : 32, height: compact ? 28 : 32,
              borderRadius: "50%",
              background: i <= step ? (i === step ? "#1B6B4E" : "#22C88A") : "#fff",
              border: i <= step ? "none" : "2px solid #D4EBE0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: compact ? 12 : 13,
              boxShadow: i <= step ? "0 2px 10px rgba(27,107,78,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
              transition: "all 400ms ease",
            }}>
              {i < step ? "✓" : s.icon}
            </div>
            <span style={{
              fontSize: compact ? 8.5 : 9.5, color: i <= step ? "#0A1628" : "#8A95A3",
              marginTop: 5, fontWeight: i === step ? 700 : 500, textAlign: "center",
              maxWidth: compact ? 60 : 72, lineHeight: 1.2,
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BottomTabBar = ({ active, onNavigate, mode = "client" }) => {
  const clientTabs = [
    { id: "home", icon: Icons.home, label: "Accueil", screen: 1, badge: 0 },
    { id: "notifs", icon: Icons.bell, label: "Notifs", screen: 12, badge: 2 },
    { id: "missions", icon: Icons.briefcase, label: "Missions", screen: 5, badge: 0 },
    { id: "profile", icon: Icons.user, label: "Profil", screen: 15, badge: 0 },
  ];
  const artisanTabs = [
    { id: "dashboard", icon: Icons.home, label: "Accueil", screen: 6, badge: 0 },
    { id: "notifs", icon: Icons.bell, label: "Notifs", screen: 21, badge: 3 },
    { id: "payments", icon: Icons.lock, label: "Paiements", screen: 9, badge: 0 },
    { id: "profile", icon: Icons.user, label: "Profil", screen: 16, badge: 0 },
  ];
  const tabs = mode === "artisan" ? artisanTabs : clientTabs;
  return (
    <div className="glass-bar" style={{
      display: "flex", justifyContent: "space-around", alignItems: "center",
      paddingTop: 8, paddingBottom: 24,
      flexShrink: 0, zIndex: 100,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <button key={t.id} onClick={() => onNavigate(t.screen)} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 2, background: "none", border: "none", padding: "6px 0",
            cursor: "pointer", transition: "transform 200ms ease",
            transform: isActive ? "translateY(-2px)" : "none",
            position: "relative", flex: 1,
          }}>
            {t.icon(isActive ? "#1B6B4E" : "#A0AEBB", 22)}
            {t.badge > 0 && (
              <div style={{
                position: "absolute", top: 0, right: 2,
                width: 16, height: 16, borderRadius: "50%",
                background: "#E8302A", fontSize: 9, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, border: "2px solid #fff",
              }}>{t.badge}</div>
            )}
            <span style={{
              fontSize: 10, fontWeight: isActive ? 600 : 400,
              color: isActive ? "#1B6B4E" : "#A0AEBB",
              fontFamily: "'DM Sans', sans-serif",
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const BackHeader = ({ title, onBack }) => (
  <div className="glass-header" style={{
    display: "flex", alignItems: "center", gap: 10, padding: "54px 16px 12px",
  }}>
    <button onClick={onBack} style={{
      background: "rgba(27,107,78,0.08)", border: "none", cursor: "pointer",
      padding: "6px 8px", borderRadius: 10, display: "flex", alignItems: "center",
    }}>
      {Icons.back("#1B6B4E")}
    </button>
    <span style={{
      fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
      fontSize: 17, color: "#0A1628",
    }}>{title}</span>
  </div>
);

const ProgressSteps = ({ steps, current }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "8px 20px 12px", gap: 4 }}>
    {steps.map((s, i) => (
      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div style={{
          height: 3, width: "100%", borderRadius: 2,
          background: i <= current ? "#1B6B4E" : "#D4EBE0",
          transition: "background 300ms ease",
        }}/>
        <span style={{
          fontSize: 10, fontWeight: i === current ? 700 : 400,
          color: i <= current ? "#1B6B4E" : "#8A95A3",
        }}>{s}</span>
      </div>
    ))}
  </div>
);

/* ━━━ SCREEN 0 : MODE SELECTOR ━━━ */
const Screen0 = ({ onSelect, dm }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [onboardSlide, setOnboardSlide] = useState(0);
  const [onboardDone, setOnboardDone] = useState(false);

  const SSOBtn = ({ icon, label, bg, color, border, onClick }) => (
    <button onClick={onClick} className="btn-press" style={{
      width: "100%", height: 52, borderRadius: 14,
      background: bg, color, border: border || "none",
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      boxShadow: dm ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {icon} {label}
    </button>
  );

  // ── ONBOARDING SLIDES ──
  if (!onboardDone) {
    const slides = [
      { icon: Icons.lock("#1B6B4E", 48), title: "Paiement sécurisé", desc: "Le client paie avant l'intervention. L'argent est bloqué en séquestre jusqu'à validation.", accent: "#1B6B4E", bg: "#E8F5EE" },
      { icon: Icons.shield("#F5A623", 48), title: "Artisans certifiés", desc: "Chaque artisan est vérifié : SIRET, assurance décennale, qualifications. Zéro mauvaise surprise.", accent: "#F5A623", bg: "#FFF8ED" },
      { icon: Icons.check("#22C88A", 48), title: "0% d'impayés", desc: "Vous intervenez, Nova valide, vous êtes payé sous 48h. Garanti.", accent: "#22C88A", bg: "#EDFFF6" },
    ];
    const s = slides[onboardSlide];
    return (
      <div className="screen-enter" style={{
        minHeight: "100%", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        background: dm ? "linear-gradient(165deg, #2C2C34 0%, #32323C 100%)" : `linear-gradient(165deg, ${s.bg} 0%, #F5FAF7 100%)`,
        padding: "60px 32px 40px", position: "relative", overflow: "hidden",
      }}>
        {/* Skip */}
        <button onClick={() => setOnboardDone(true)} style={{
          position: "absolute", top: 54, right: 24, background: "none", border: "none",
          fontSize: 13, color: dm ? "#707080" : "#6B7280", cursor: "pointer", fontWeight: 500,
        }}>Passer</button>

        {/* Illustration */}
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          background: dm ? "rgba(27,107,78,0.1)" : "rgba(255,255,255,0.8)",
          boxShadow: `0 8px 32px ${s.accent}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 36,
        }}>
          {s.icon}
        </div>

        {/* Text */}
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: dm ? "#EEEEF0" : "#0A1628", margin: "0 0 12px", textAlign: "center" }}>
          {s.title}
        </h2>
        <p style={{ fontSize: 15, color: dm ? "#A0A0AC" : "#4A5568", textAlign: "center", lineHeight: 1.7, maxWidth: 280, margin: "0 0 48px" }}>
          {s.desc}
        </p>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: onboardSlide === i ? 24 : 8, height: 8, borderRadius: 4,
              background: onboardSlide === i ? s.accent : (dm ? "rgba(255,255,255,0.15)" : "#D4EBE0"),
              transition: "all 0.3s",
            }}/>
          ))}
        </div>

        {/* Button */}
        <button onClick={() => onboardSlide < 2 ? setOnboardSlide(onboardSlide + 1) : setOnboardDone(true)} className="btn-press" style={{
          width: "100%", height: 52, borderRadius: 14,
          background: s.accent, color: "#fff", border: "none",
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Manrope', sans-serif",
          boxShadow: `0 4px 16px ${s.accent}30`,
        }}>
          {onboardSlide < 2 ? "Suivant" : "Commencer"}
        </button>
      </div>
    );
  }

  if (showCreate) {
    return (
      <div className="screen-enter" style={{
        minHeight: "100%", background: dm ? "#2C2C34" : "#F5FAF7",
        padding: "70px 24px 40px",
      }}>
        <button onClick={() => setShowCreate(false)} style={{
          background: dm ? "rgba(27,107,78,0.15)" : "rgba(27,107,78,0.08)", border: "none", borderRadius: 10,
          padding: "6px 8px", cursor: "pointer", marginBottom: 20,
          display: "flex", alignItems: "center",
        }}>{Icons.back("#1B6B4E", 20)}</button>

        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 24, fontWeight: 800, color: dm ? "#EEEEF0" : "#0A1628", margin: "0 0 4px" }}>
          Créer un compte
        </h2>
        <p style={{ fontSize: 13, color: dm ? "#8890A0" : "#8A95A3", margin: "0 0 24px" }}>Rejoignez Nova en quelques secondes</p>

        {["Nom complet", "Email", "Mot de passe"].map((label, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: dm ? "#8890A0" : "#8A95A3", display: "block", marginBottom: 5 }}>{label}</label>
            <input type={i === 2 ? "password" : i === 1 ? "email" : "text"} placeholder={label} style={{
              width: "100%", height: 48, borderRadius: 14,
              border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid #D4EBE0",
              padding: "0 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              outline: "none", boxSizing: "border-box",
              background: dm ? "#363640" : "#fff",
              color: dm ? "#EEEEF0" : "#0A1628",
            }}/>
          </div>
        ))}

        <label style={{ fontSize: 12, color: dm ? "#8890A0" : "#8A95A3", display: "block", marginBottom: 6 }}>Je suis</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: "#1B6B4E", color: "#fff", border: "none",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Particulier</button>
          <button style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: dm ? "#363640" : "#fff", color: dm ? "#EEEEF0" : "#0A1628",
            border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid #D4EBE0",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Artisan</button>
        </div>

        <button className="btn-press btn-primary" style={{ width: "100%", marginBottom: 14 }}>
          Créer mon compte
        </button>
        <p style={{ fontSize: 11, color: dm ? "#606070" : "#7EA894", textAlign: "center", lineHeight: 1.5 }}>
          En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{
      minHeight: "100%", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      background: dm
        ? "linear-gradient(165deg, #2C2C34 0%, #32323C 40%, #2C2C34 100%)"
        : "linear-gradient(165deg, #E8F5EE 0%, #E5E5EA 40%, #E8F5EE 100%)",
      padding: "40px 24px", gap: 0, position: "relative", overflow: "hidden",
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: dm ? "rgba(27,107,78,0.12)" : "rgba(27,107,78,0.08)", filter: "blur(40px)" }}/>
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: dm ? "rgba(245,166,35,0.06)" : "rgba(245,166,35,0.08)", filter: "blur(40px)" }}/>

      {/* Logo */}
      <div style={{ textAlign: "center", zIndex: 1, marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: dm ? "rgba(54,54,64,0.8)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)",
          boxShadow: dm ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(27,107,78,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px",
        }}>
          {Icons.shield(dm ? "#8ECFB0" : "#1B6B4E", 32)}
        </div>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 34, fontWeight: 800, color: dm ? "#EEEEF0" : "#0A1628", margin: "0 0 4px" }}>
          Nova
        </h1>
        <p style={{ fontSize: 14, color: dm ? "#A0A0AC" : "#4A5568", margin: 0 }}>
          L'artisan qu'il vous faut. Certifié. Garanti.
        </p>
      </div>

      {/* SSO Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", zIndex: 1, marginBottom: 20 }}>
        <SSOBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
          label="Continuer avec Google"
          bg={dm ? "#363640" : "#fff"} color={dm ? "#EEEEF0" : "#0A1628"}
          border={dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid #D4EBE0"}/>
        <SSOBtn icon={<svg width="20" height="20" viewBox="0 0 814 1000" fill={dm ? "#0A1628" : "#fff"}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.6-105.6-210.8-105.6-334.1C0 397.1 78.6 283.9 190.5 283.9c64.2 0 117.8 42.8 155.5 42.8 39 0 99.7-45.2 172.8-45.2 27.8 0 127.7 2.5 193.3 59.4z"/><path d="M554.1 0c-7.8 66.3-67.8 134.3-134.2 134.3-12 0-24-1.3-24-13.3 0-5.8 5.8-28.3 29-57.7C449.8 32.7 515.5 0 554.1 0z"/></svg>}
          label="Continuer avec Apple"
          bg={dm ? "#EEEEF0" : "#000"} color={dm ? "#0A1628" : "#fff"}/>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", zIndex: 1, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: dm ? "rgba(255,255,255,0.1)" : "rgba(10,22,40,0.1)" }}/>
        <span style={{ fontSize: 12, color: dm ? "#707080" : "#8A95A3" }}>ou</span>
        <div style={{ flex: 1, height: 1, background: dm ? "rgba(255,255,255,0.1)" : "rgba(10,22,40,0.1)" }}/>
      </div>

      {/* Email login */}
      <div style={{ width: "100%", zIndex: 1, marginBottom: 16 }}>
        <input placeholder="Email" type="email" style={{
          width: "100%", height: 48, borderRadius: 14,
          border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid #D4EBE0",
          padding: "0 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          outline: "none", boxSizing: "border-box",
          background: dm ? "#363640" : "#fff", color: dm ? "#EEEEF0" : "#0A1628",
          marginBottom: 8,
        }}/>
        <input placeholder="Mot de passe" type="password" style={{
          width: "100%", height: 48, borderRadius: 14,
          border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid #D4EBE0",
          padding: "0 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          outline: "none", boxSizing: "border-box",
          background: dm ? "#363640" : "#fff", color: dm ? "#EEEEF0" : "#0A1628",
          marginBottom: 4,
        }}/>
        <div style={{ textAlign: "right", marginBottom: 14 }}>
          <button style={{ background: "none", border: "none", fontSize: 12, color: dm ? "#8ECFB0" : "#1B6B4E", cursor: "pointer", fontWeight: 500 }}>
            Mot de passe oublié ?
          </button>
        </div>
        <button className="btn-press btn-primary" style={{ width: "100%", marginBottom: 12 }}>
          Se connecter
        </button>
        <button onClick={() => setShowCreate(true)} style={{
          width: "100%", height: 48, borderRadius: 14,
          background: "none", color: dm ? "#8ECFB0" : "#1B6B4E",
          border: dm ? "1.5px solid rgba(27,107,78,0.3)" : "1.5px solid rgba(27,107,78,0.2)",
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          Créer un compte
        </button>
      </div>

      {/* Demo access */}
      <div style={{
        width: "100%", zIndex: 1,
        background: dm ? "rgba(54,54,64,0.6)" : "rgba(255,255,255,0.5)",
        backdropFilter: "blur(10px)", borderRadius: 16, padding: "14px",
        border: dm ? "1px dashed rgba(27,107,78,0.3)" : "1px dashed rgba(27,107,78,0.2)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: dm ? "#8ECFB0" : "#14523B", marginBottom: 8, textAlign: "center" }}>
          Mode démo
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onSelect("client")} className="btn-press" style={{
            flex: 1, height: 42, borderRadius: 12,
            background: dm ? "rgba(27,107,78,0.15)" : "rgba(27,107,78,0.08)",
            color: dm ? "#8ECFB0" : "#1B6B4E",
            border: dm ? "1px solid rgba(27,107,78,0.25)" : "1px solid rgba(27,107,78,0.15)",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Client</button>
          <button onClick={() => onSelect("artisan")} className="btn-press" style={{
            flex: 1, height: 42, borderRadius: 12,
            background: dm ? "rgba(27,107,78,0.15)" : "rgba(27,107,78,0.08)",
            color: dm ? "#8ECFB0" : "#1B6B4E",
            border: dm ? "1px solid rgba(27,107,78,0.25)" : "1px solid rgba(27,107,78,0.15)",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Artisan</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, zIndex: 1, marginTop: 16 }}>
        <Badge type="certified" small />
        <Badge type="payment" small />
      </div>
    </div>
  );
};

/* ━━━ SCREEN 1 : HOME (CLIENT) ━━━ */
const Screen1 = ({ goTo, onSelectCategory }) => (
  <div className="screen-enter" style={{ background: "#F5FAF7" }}>
    {/* Header — light glass */}
    <div className="glass-header" style={{ padding: "54px 20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            {Icons.shield("#1B6B4E", 22)}
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, color: "#0A1628" }}>Nova</span>
          </div>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11.5, color: "#8A95A3", margin: 0 }}>
            L'artisan qu'il vous faut. Certifié. Garanti.
          </p>
        </div>
        <button onClick={() => goTo(15)} style={{
          width: 40, height: 40, borderRadius: 14,
          background: "linear-gradient(135deg, #1B6B4E, #14523B)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: "#fff", fontWeight: 700,
          boxShadow: "0 2px 10px rgba(27,107,78,0.25)",
          border: "none", cursor: "pointer",
        }}>SL</button>
      </div>
    </div>

    {/* Trust banner — subtle */}
    <div style={{
      margin: "0 16px 12px", padding: "10px 14px", borderRadius: 14,
      background: "rgba(27,107,78,0.06)",
      border: "1px solid rgba(27,107,78,0.1)",
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 11.5, color: "#14523B", fontWeight: 500,
    }}>
      {Icons.shield("#1B6B4E", 16)}
      <span>Artisans vérifiés et assurés • Paiement sécurisé</span>
    </div>

    <div style={{ padding: "0 16px" }}>
      {/* Search bar */}
      <div className="btn-press" onClick={() => {}} style={{
        background: "#fff", borderRadius: 14, padding: "13px 16px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 1px 8px rgba(10,22,40,0.04)",
        border: "1px solid rgba(10,22,40,0.05)",
        cursor: "pointer", marginBottom: 20,
      }}>
        {Icons.search("#7EA894", 20)}
        <span style={{ color: "#7EA894", fontSize: 15 }}>Quel artisan cherchez-vous ?</span>
      </div>

      {/* Categories grid — text only */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {categories.map((cat) => (
          <div key={cat.id} className="btn-press"
            onClick={() => cat.id === "other" ? goTo(18) : onSelectCategory(cat.id)}
            style={{
              background: cat.id === "other" ? "rgba(27,107,78,0.04)" : "#fff",
              borderRadius: 16, padding: "16px",
              display: "flex", flexDirection: "column", gap: 4,
              boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
              border: cat.id === "other" ? "1px dashed rgba(27,107,78,0.2)" : "1px solid rgba(10,22,40,0.04)",
              cursor: "pointer",
            }}>
            <span style={{
              fontSize: 15, fontWeight: 700,
              color: cat.id === "other" ? "#1B6B4E" : "#0A1628",
            }}>{cat.label}</span>
            <span style={{ fontSize: 12, color: "#8A95A3" }}>
              {cat.id === "other" ? "Voir toutes les catégories" : `${cat.count} artisans près de vous`}
            </span>
          </div>
        ))}
      </div>

      {/* Emergency banner */}
      <div onClick={() => goTo(17)} style={{
        background: "#fff", borderRadius: 20, padding: "16px",
        border: "1px solid rgba(232,48,42,0.12)",
        boxShadow: "0 2px 12px rgba(232,48,42,0.06)",
        cursor: "pointer", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16, flexShrink: 0,
          background: "linear-gradient(135deg, #FFF0EF, #FFE0DD)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#E8302A" opacity="0.9"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1628", marginBottom: 2 }}>
            Urgence 24h/24
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4 }}>
            Intervention &lt; 2h • Devis gratuit
          </div>
        </div>
        <div style={{
          padding: "10px 16px", borderRadius: 12,
          background: "#E8302A", color: "#fff",
          fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
          boxShadow: "0 2px 10px rgba(232,48,42,0.2)",
        }}>
          Appeler
        </div>
      </div>

      {/* Top rated artisans */}
      <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, color: "#0A1628", margin: "0 0 14px" }}>
        Artisans les mieux notés
      </h3>
      <div style={{
        display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16,
        marginLeft: -16, paddingLeft: 16, marginRight: -16, paddingRight: 16,
      }}>
        {topArtisans.map((a) => (
          <div key={a.id} className="btn-press" onClick={() => goTo(2)}
            style={{
              background: "#fff", borderRadius: 20, padding: "16px",
              minWidth: 185, boxShadow: "0 1px 8px rgba(10,22,40,0.04)",
              border: "1px solid rgba(10,22,40,0.04)", cursor: "pointer",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 16,
                  background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: "#1B6B4E",
                }}>{a.photo}</div>
                <div style={{
                  position: "absolute", bottom: -3, right: -3,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "#fff", border: "1.5px solid rgba(245,166,35,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  {Icons.shield("#F5A623", 10)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0A1628" }}>{a.name}</div>
                <div style={{ fontSize: 11.5, color: "#8A95A3" }}>{a.job}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
              {Icons.star("#F5A623", 13)}
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{a.rating}</span>
              <span style={{ fontSize: 11, color: "#8A95A3" }}>• {a.reviews} avis</span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <Badge type="certified" small />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "#8A95A3" }}>Répond en {a.responseTime}</span>
              <span style={{
                fontSize: 14, fontWeight: 700, color: "#1B6B4E",
                fontFamily: "'DM Mono', monospace",
              }}>
                {a.price}€<span style={{ fontSize: 10, fontWeight: 400, color: "#8A95A3" }}>/h</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 8 }}/>
    </div>
  </div>
);

/* ━━━ SCREEN 2 : ARTISAN PROFILE ━━━ */
const Screen2 = ({ goTo, goBack }) => (
  <div className="screen-enter" style={{ background: "#F5FAF7" }}>
    {/* Light hero */}
    <div style={{
      background: "linear-gradient(170deg, #E8F5EE 0%, #F5FAF7 100%)",
      padding: "54px 20px 40px", textAlign: "center", position: "relative",
    }}>
      <button onClick={goBack} style={{
        position: "absolute", top: 54, left: 16,
        background: "rgba(255,255,255,0.7)", border: "none",
        borderRadius: 12, padding: "7px 9px", cursor: "pointer",
        backdropFilter: "blur(10px)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}>
        {Icons.back("#1B6B4E", 20)}
      </button>
      <div style={{
        width: 84, height: 84, borderRadius: 26,
        background: "linear-gradient(135deg, #E5E5EA, #E8F5EE)",
        border: "3px solid #fff", margin: "0 auto 12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, fontWeight: 700, color: "#1B6B4E",
        boxShadow: "0 4px 20px rgba(27,107,78,0.1)",
      }}>JM</div>
      <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 23, color: "#0A1628", margin: "0 0 3px" }}>
        Jean-Michel P.
      </h2>
      <p style={{ fontSize: 13, color: "#8A95A3", margin: "0 0 10px" }}>Plombier</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }}>
        <Stars rating={5} size={15}/>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#F5A623" }}>4.9</span>
        <span style={{ fontSize: 12, color: "#8A95A3" }}>• 127 missions</span>
      </div>
      <Badge type="certified" />
    </div>

    {/* Content */}
    <div style={{
      background: "#fff", borderRadius: "28px 28px 0 0",
      marginTop: -24, padding: "24px 16px 16px", minHeight: 400,
      position: "relative", zIndex: 1,
      boxShadow: "0 -2px 20px rgba(10,22,40,0.03)",
    }}>
      {/* Certifications */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
        <Badge type="certified" small/>
        <Badge type="insured" small/>
        <Badge type="rge" small/>
        <Badge type="pro" small/>
      </div>

      {/* Escrow explainer */}
      <div style={{
        background: "rgba(27,107,78,0.04)", borderRadius: 18, padding: "16px",
        border: "1px solid rgba(27,107,78,0.08)", marginBottom: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#14523B", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          {Icons.lock("#1B6B4E", 16)} Comment ça marche
        </div>
        <EscrowStepper step={0} compact/>
      </div>

      {/* Gallery — text based */}
      <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, margin: "0 0 10px", color: "#0A1628" }}>
        Réalisations
      </h4>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 2 }}>
        {[
          { title: "Remplacement chauffe-eau", date: "Mars 2026" },
          { title: "Réparation fuite salle de bain", date: "Fév 2026" },
          { title: "Installation robinet cuisine", date: "Jan 2026" },
          { title: "Débouchage canalisation", date: "Déc 2025" },
        ].map((r, i) => (
          <div key={i} style={{
            minWidth: 160, borderRadius: 14, flexShrink: 0,
            background: "#fff", padding: "14px",
            border: "1px solid rgba(10,22,40,0.05)",
            display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0A1628", lineHeight: 1.35 }}>{r.title}</span>
            <span style={{ fontSize: 11, color: "#7EA894" }}>{r.date}</span>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div style={{
        background: "#F5FAF7", borderRadius: 18, padding: "14px 10px",
        display: "flex", justifyContent: "space-around", marginBottom: 20,
        border: "1px solid rgba(10,22,40,0.03)",
      }}>
        {[
          { v: "65€", sub: "par heure", style: { fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700 } },
          { v: "Offert", sub: "Déplacement", style: { fontSize: 15, fontWeight: 600, color: "#22C88A" } },
          { v: "Gratuit", sub: "Devis", style: { fontSize: 15, fontWeight: 600, color: "#1B6B4E" } },
        ].map((p, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1, borderLeft: i ? "1px solid #D4EBE0" : "none" }}>
            <div style={p.style}>{p.v}</div>
            <div style={{ fontSize: 10, color: "#8A95A3", marginTop: 2 }}>{p.sub}</div>
          </div>
        ))}
      </div>

      {/* Entretien annuel */}
      <div onClick={() => goTo(33)} className="btn-press" style={{
        background: "linear-gradient(135deg, #E8F5EE, #F5FAF7)", borderRadius: 18, padding: "16px",
        marginBottom: 20, border: "1px solid #D4EBE0", cursor: "pointer",
        display: "flex", gap: 14, alignItems: "center",
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: "#1B6B4E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/><path d="M4.93 4.93l14.14 14.14" stroke="#fff" strokeWidth="0" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 2 }}>Contrat d'entretien annuel</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Chaudière, climatisation, VMC — entretien planifié</div>
        </div>
        <span style={{ fontSize: 16, color: "#1B6B4E" }}>›</span>
      </div>

      {/* Reviews */}
      <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, margin: "0 0 10px", color: "#0A1628" }}>
        Avis clients
      </h4>
      {mockReviews.map((r, i) => (
        <div key={i} style={{
          background: "#F5FAF7", borderRadius: 16, padding: "12px 14px",
          marginBottom: 8, border: "1px solid rgba(10,22,40,0.03)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 10,
                background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#1B6B4E",
              }}>{r.name[0]}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0A1628" }}>{r.name}</span>
            </div>
            <Stars rating={r.rating} size={11}/>
          </div>
          <p style={{ fontSize: 12.5, color: "#4A5568", margin: 0, lineHeight: 1.5 }}>{r.text}</p>
          <p style={{ fontSize: 10, color: "#7EA894", margin: "5px 0 0" }}>{r.date}</p>
        </div>
      ))}
    </div>

    {/* Footer actions */}
    <div style={{
      padding: "12px 16px 20px",
      display: "flex", gap: 8, background: "#fff",
      borderTop: "1px solid rgba(10,22,40,0.04)",
    }}>
      <button onClick={() => goTo(26)} className="btn-press" style={{
        height: 50, width: 50, borderRadius: 14,
        background: "#E8F5EE", color: "#1B6B4E", border: "1px solid #D4EBE0",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}>{Icons.chat("#1B6B4E", 22)}</button>
      <button className="btn-press" style={{
        height: 50, width: 50, borderRadius: 14,
        background: "#E8F5EE", color: "#1B6B4E", border: "1px solid #D4EBE0",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}>{Icons.phone("#1B6B4E", 20)}</button>
      <button onClick={() => goTo(3)} className="btn-press" style={{
        flex: 1, height: 50, borderRadius: 14,
        background: "#1B6B4E", color: "#fff", border: "none",
        fontSize: 15, fontWeight: 600, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(27,107,78,0.25)",
      }}>Prendre RDV</button>
      <button onClick={() => goTo(3)} className="btn-press pulse-red" style={{
        height: 50, width: 50, borderRadius: 14,
        background: "#E8302A", color: "#fff", border: "none",
        fontSize: 18, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(232,48,42,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>🚨</button>
    </div>
  </div>
);

/* ━━━ SCREEN 3 : BOOKING ━━━ */
const Screen3 = ({ goTo, goBack }) => {
  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const available = [3,5,8,10,12,15,17,19,22,24,26,29];
  const slots = ["9h00", "11h00", "14h00", "16h00", "18h00"];

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Prise de rendez-vous" onBack={goBack}/>
      <ProgressSteps steps={["Date", "Détails", "Confirmation"]} current={step}/>
      <div style={{ padding: "0 16px 100px" }}>
        {step === 0 && (
          <div>
            <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, margin: "4px 0 14px", color: "#0A1628" }}>
              Mars 2026
            </h4>
            <div style={{
              background: "#fff", borderRadius: 20, padding: "14px 10px",
              boxShadow: "0 1px 6px rgba(10,22,40,0.03)", marginBottom: 20,
              border: "1px solid rgba(10,22,40,0.04)",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {["L","M","M","J","V","S","D"].map((d,i) => (
                  <div key={i} style={{ textAlign: "center", fontSize: 11, color: "#7EA894", fontWeight: 600, padding: "4px 0" }}>{d}</div>
                ))}
                {Array(6).fill(null).map((_, i) => <div key={`e${i}`}/>)}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                  const isAvail = available.includes(d);
                  const isSel = d === selectedDay;
                  return (
                    <button key={d} onClick={() => isAvail && setSelectedDay(d)} style={{
                      width: 38, height: 38, borderRadius: 12, border: "none",
                      background: isSel ? "#1B6B4E" : isAvail ? "rgba(27,107,78,0.08)" : "transparent",
                      color: isSel ? "#fff" : isAvail ? "#1B6B4E" : "#B0B0BB",
                      fontSize: 14, fontWeight: isSel ? 700 : isAvail ? 600 : 400,
                      cursor: isAvail ? "pointer" : "default",
                      transition: "all 200ms ease",
                      margin: "0 auto",
                    }}>{d}</button>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setStep(1)} className="btn-press btn-primary" style={{ width: "100%" }}>
              Continuer
            </button>
          </div>
        )}
        {step === 1 && (
          <div>
            <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, margin: "4px 0 14px", color: "#0A1628" }}>
              Choisissez un créneau
            </h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {slots.map(s => (
                <button key={s} onClick={() => setSelectedSlot(s)} className="btn-press" style={{
                  padding: "10px 20px", borderRadius: 12,
                  background: selectedSlot === s ? "#1B6B4E" : "#fff",
                  color: selectedSlot === s ? "#fff" : "#0A1628",
                  border: selectedSlot === s ? "none" : "1px solid #D4EBE0",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  boxShadow: selectedSlot === s ? "0 2px 10px rgba(27,107,78,0.2)" : "0 1px 4px rgba(0,0,0,0.02)",
                  transition: "all 200ms ease",
                }}>{s}</button>
              ))}
            </div>
            <textarea placeholder="Décrivez votre problème..." style={{
              width: "100%", height: 100, borderRadius: 16, border: "1px solid #D4EBE0",
              padding: "14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 12,
              background: "#fff",
            }}/>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(27,107,78,0.04)", border: "1.5px dashed rgba(27,107,78,0.3)",
                borderRadius: 14, padding: "12px 16px",
                cursor: "pointer", fontSize: 13, color: "#1B6B4E", fontWeight: 600,
              }}>
                {Icons.camera("#1B6B4E", 18)} Photos
              </button>
              <button onClick={() => goTo(32)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "linear-gradient(135deg, rgba(27,107,78,0.08), rgba(27,107,78,0.04))", border: "1.5px solid rgba(27,107,78,0.2)",
                borderRadius: 14, padding: "12px 16px",
                cursor: "pointer", fontSize: 13, color: "#1B6B4E", fontWeight: 600,
              }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M23 7l-7 5 7 5V7z" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="#1B6B4E" strokeWidth="1.5"/></svg>
                Vidéo diagnostic
              </button>
            </div>
            <button onClick={() => setStep(2)} className="btn-press btn-primary" style={{ width: "100%" }}>
              Continuer
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, margin: "4px 0 14px", color: "#0A1628" }}>
              Récapitulatif
            </h4>
            <div style={{
              background: "#fff", borderRadius: 20, padding: "16px",
              boxShadow: "0 1px 6px rgba(10,22,40,0.03)", marginBottom: 16,
              border: "1px solid rgba(10,22,40,0.04)",
            }}>
              {[
                ["Artisan", "Jean-Michel P."],
                ["Date", `${selectedDay} mars 2026`],
                ["Créneau", selectedSlot || "14h00"],
                ["Adresse", "12 rue de Rivoli, Paris 4e"],
              ].map(([k, v], i) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", padding: "10px 0",
                  borderBottom: i < 3 ? "1px solid #E8F5EE" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "#8A95A3" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0A1628" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{
              background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
              border: "1px solid rgba(27,107,78,0.08)",
            }}>
              {Icons.lock("#1B6B4E", 18)}
              <span style={{ fontSize: 12.5, color: "#14523B", fontWeight: 500 }}>
                Aucun débit immédiat — Nova contrôle et valide
              </span>
            </div>
            <button onClick={() => goTo(4)} className="btn-press btn-primary" style={{ width: "100%" }}>
              Confirmer le rendez-vous
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 4 : PAYMENT ━━━ */
const Screen4 = ({ goTo, goBack }) => {
  const [method, setMethod] = useState("cb");
  const [installment, setInstallment] = useState("1x");
  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Paiement sécurisé" onBack={goBack}/>
      <div style={{ padding: "0 16px 100px" }}>
        <EscrowStepper step={0}/>

        <div style={{
          background: "#fff", borderRadius: 20, padding: "14px 16px",
          marginBottom: 14, boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ fontSize: 11, color: "#8A95A3", marginBottom: 6 }}>Récapitulatif</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1628" }}>Jean-Michel P. • Plomberie</div>
              <div style={{ fontSize: 12, color: "#8A95A3" }}>15 mars 2026 • 14h00</div>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: "#0A1628" }}>320€</div>
          </div>
        </div>

        <div style={{
          background: "rgba(27,107,78,0.04)", borderRadius: 18, padding: "16px",
          border: "1px solid rgba(27,107,78,0.08)", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {Icons.lock("#1B6B4E", 18)}
            <span style={{ fontSize: 14, fontWeight: 700, color: "#14523B" }}>Votre argent est sécurisé</span>
          </div>
          <p style={{ fontSize: 12.5, color: "#4A5568", margin: 0, lineHeight: 1.6 }}>
            Le montant est bloqué sur notre compte séquestre. L'artisan ne sera payé qu'après validation par nos équipes. En cas de litige, Nova arbitre et rembourse.
          </p>
        </div>

        <h4 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "#0A1628" }}>Mode de paiement</h4>
        {[
          { id: "cb", label: "Carte bancaire", icon: "💳" },
          { id: "virement", label: "Virement", icon: "🏦" },
          { id: "apple", label: "Apple Pay", icon: "" },
        ].map(m => (
          <div key={m.id} onClick={() => setMethod(m.id)} className="btn-press" style={{
            background: method === m.id ? "rgba(27,107,78,0.05)" : "#fff",
            border: method === m.id ? "2px solid #1B6B4E" : "1px solid #D4EBE0",
            borderRadius: 16, padding: "14px 16px", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            transition: "all 200ms ease",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: method === m.id ? "6px solid #1B6B4E" : "2px solid #B0B0BB",
              transition: "all 200ms ease",
            }}/>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#0A1628" }}>{m.icon} {m.label}</span>
          </div>
        ))}

        <h4 style={{ fontSize: 14, fontWeight: 600, margin: "16px 0 10px", color: "#0A1628" }}>Paiement en plusieurs fois</h4>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {[
            { id: "1x", label: "1×", amount: "320,00 €", sub: "Paiement unique" },
            { id: "3x", label: "3×", amount: "106,67 €", sub: "via Klarna" },
            { id: "4x", label: "4×", amount: "80,00 €", sub: "via Klarna" },
          ].map(i => (
            <button key={i.id} onClick={() => setInstallment(i.id)} style={{
              flex: 1, padding: "10px 6px", borderRadius: 14,
              background: installment === i.id ? "#1B6B4E" : "#fff",
              color: installment === i.id ? "#fff" : "#0A1628",
              border: installment === i.id ? "none" : "1px solid #D4EBE0",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              boxShadow: installment === i.id ? "0 2px 10px rgba(27,107,78,0.2)" : "none",
              transition: "all 200ms ease", textAlign: "center",
            }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{i.label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, marginTop: 2, opacity: 0.85 }}>{i.amount}/mois</div>
            </button>
          ))}
        </div>
        {installment !== "1x" && (
          <div style={{ background: "#E8F5EE", borderRadius: 12, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            {Icons.check("#1B6B4E", 14)}
            <span style={{ fontSize: 11, color: "#14523B" }}>
              {installment === "3x" ? "3 prélèvements de 106,67 € • Paiement géré par Klarna." : "4 prélèvements de 80,00 € • Paiement géré par Klarna."}
            </span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, justifyContent: "center" }}>
          {Icons.lock("#7EA894", 13)}
          <span style={{ fontSize: 11, color: "#7EA894" }}>Paiement chiffré 256-bit SSL</span>
        </div>

        <div style={{
          textAlign: "center", marginBottom: 16,
          fontFamily: "'DM Mono', monospace", fontSize: 30, fontWeight: 700, color: "#0A1628",
        }}>
          320,00 € <span style={{ fontSize: 13, fontWeight: 400, color: "#8A95A3" }}>TTC</span>
        </div>

        <button onClick={() => goTo(28)} className="btn-press btn-primary" style={{ width: "100%" }}>
          🔒 Bloquer le paiement • 320€
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 5 : VALIDATION ━━━ */
/* ━━━ SCREEN 5 : MES MISSIONS (CLIENT) ━━━ */
const Screen5 = ({ goTo }) => {
  const [tab, setTab] = useState("all");
  const missions = [
    { id: 0, artisan: "Marc D.", initials: "MD", type: "Fuite sous évier", date: "Aujourd'hui", amount: "En attente", status: "active", statusLabel: "En cours", statusColor: "#F5A623", tracking: true },
    { id: 1, artisan: "Jean-Michel P.", initials: "JM", type: "Réparation fuite", date: "15 mars 2026", amount: "320,00€", status: "completed", statusLabel: "Terminée", statusColor: "#22C88A" },
    { id: 2, artisan: "Sophie M.", initials: "SM", type: "Installation prise électrique", date: "10 mars 2026", amount: "195,00€", status: "completed", statusLabel: "Terminée", statusColor: "#22C88A" },
    { id: 3, artisan: "Karim B.", initials: "KB", type: "Remplacement serrure", date: "2 mars 2026", amount: "280,00€", status: "validated", statusLabel: "Validée par Nova", statusColor: "#1B6B4E" },
    { id: 4, artisan: "Fatima H.", initials: "FH", type: "Débouchage canalisation", date: "22 fév 2026", amount: "150,00€", status: "validated", statusLabel: "Validée par Nova", statusColor: "#1B6B4E" },
    { id: 5, artisan: "Thomas R.", initials: "TR", type: "Fuite chauffe-eau", date: "18 fév 2026", amount: "450,00€", status: "dispute", statusLabel: "Litige en cours", statusColor: "#E8302A" },
  ];

  const filtered = tab === "all" ? missions : missions.filter(m => m.status === tab);

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <div className="glass-header" style={{ padding: "54px 20px 14px" }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1628" }}>
          Mes missions
        </h2>
      </div>
      <div style={{ padding: "12px 16px 100px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[
            { id: "all", label: "Toutes" },
            { id: "active", label: "En cours" },
            { id: "completed", label: "Terminées" },
            { id: "validated", label: "Validées" },
            { id: "dispute", label: "Litiges" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 14px", borderRadius: 10,
              background: tab === t.id ? "#1B6B4E" : "#fff",
              color: tab === t.id ? "#fff" : "#4A5568",
              border: tab === t.id ? "none" : "1px solid #D4EBE0",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              boxShadow: tab === t.id ? "0 2px 10px rgba(27,107,78,0.2)" : "none",
              transition: "all 200ms ease",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ fontSize: 13, color: "#8A95A3", marginBottom: 12 }}>
          {filtered.length} mission{filtered.length > 1 ? "s" : ""}
        </div>

        {filtered.map(m => (
          <div key={m.id} className="btn-press" onClick={() => goTo(m.tracking ? 28 : 19)} style={{
            background: "#fff", borderRadius: 18, padding: "16px",
            marginBottom: 10, cursor: "pointer",
            boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
            border: m.status === "dispute" ? "1px solid rgba(232,48,42,0.12)" : "1px solid rgba(10,22,40,0.04)",
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 46, height: 46, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "#1B6B4E",
              }}>{m.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0A1628" }}>{m.artisan}</span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: "#0A1628",
                  }}>{m.amount}</span>
                </div>
                <div style={{ fontSize: 13, color: "#4A5568", marginBottom: 6 }}>{m.type}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#7EA894" }}>{m.date}</span>
                  <span style={{
                    padding: "4px 10px", borderRadius: 8,
                    background: `${m.statusColor}10`, color: m.statusColor,
                    fontSize: 11, fontWeight: 600,
                  }}>{m.statusLabel}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 19 : DÉTAIL MISSION + VALIDATION (CLIENT) ━━━ */
const Screen19 = ({ goTo, goBack }) => {
  const [checks, setChecks] = useState([false, false, false]);
  const [rating, setRating] = useState(0);
  const [validated, setValidated] = useState(false);
  const toggleCheck = (i) => { const n = [...checks]; n[i] = !n[i]; setChecks(n); };

  if (validated) {
    return (
      <div className="screen-enter" style={{
        background: "#F5FAF7", minHeight: "100%",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "40px 24px", textAlign: "center",
      }}>
        <div className="confetti-container">
          {Array(12).fill(0).map((_, i) => <div key={i} className={`confetti confetti-${i}`}/>)}
        </div>
        <div className="check-anim" style={{
          width: 80, height: 80, borderRadius: 24,
          background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, boxShadow: "0 8px 30px rgba(34,200,138,0.25)",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path className="check-path" d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 23, fontWeight: 800, color: "#0A1628", margin: "0 0 6px" }}>
          Demande envoyée !
        </h2>
        <p style={{ fontSize: 14, color: "#4A5568", margin: "0 0 24px" }}>Nova valide et libère le paiement sous 48h</p>
        <button onClick={() => goTo(5)} className="btn-press btn-primary">
          Retour aux missions
        </button>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Détail de la mission" onBack={goBack}/>
      <div style={{ padding: "8px 16px 100px" }}>
        <EscrowStepper step={2}/>

        {/* Mission recap */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "16px",
          marginBottom: 14, boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 18,
              background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700, color: "#1B6B4E",
            }}>JM</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0A1628" }}>Jean-Michel P.</div>
              <div style={{ fontSize: 12.5, color: "#8A95A3" }}>Réparation fuite • Plomberie</div>
            </div>
          </div>
          {[["Date", "15 mars 2026"], ["Adresse", "12 rue de Rivoli, Paris 4e"], ["Montant", "320,00€"]].map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #E8F5EE" }}>
              <span style={{ fontSize: 12.5, color: "#8A95A3" }}>{k}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0A1628" }}>{v}</span>
            </div>
          ))}
        </div>

        <h4 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "#0A1628" }}>Checklist de validation</h4>
        {["Le travail est conforme au devis", "Je suis satisfait de la prestation", "Aucun dommage constaté"].map((t, i) => (
          <div key={i} onClick={() => toggleCheck(i)} className="btn-press" style={{
            background: "#fff", borderRadius: 16, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 8, cursor: "pointer",
            border: checks[i] ? "2px solid #22C88A" : "1px solid #D4EBE0",
            transition: "all 200ms ease",
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8,
              background: checks[i] ? "#22C88A" : "#fff",
              border: checks[i] ? "none" : "2px solid #B0B0BB",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 200ms ease",
            }}>
              {checks[i] && Icons.check("#fff", 16)}
            </div>
            <span style={{ fontSize: 13.5, color: "#0A1628", fontWeight: 500 }}>{t}</span>
          </div>
        ))}

        <h4 style={{ fontSize: 14, fontWeight: 600, margin: "20px 0 10px", color: "#0A1628" }}>Votre note</h4>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => setRating(i)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 2,
              transform: i <= rating ? "scale(1.15)" : "scale(1)",
              transition: "transform 200ms ease",
            }}>
              {Icons.star(i <= rating ? "#F5A623" : "#D4EBE0", 30)}
            </button>
          ))}
        </div>
        <textarea placeholder="Laissez un avis (optionnel)..." style={{
          width: "100%", height: 80, borderRadius: 16, border: "1px solid #D4EBE0",
          padding: "14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 16, background: "#fff",
        }}/>

        <div style={{
          background: "rgba(34,200,138,0.06)", borderRadius: 16, padding: "14px 16px",
          marginBottom: 20, border: "1px solid rgba(34,200,138,0.15)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          {Icons.check("#0D7A52", 20)}
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0D7A52" }}>
            Nova vérifiera la mission avant de libérer 320€ vers Jean-Michel P.
          </span>
        </div>

        <button onClick={() => setValidated(true)} className="btn-press" style={{
          width: "100%", height: 54, borderRadius: 16,
          background: "#22C88A", color: "#fff", border: "none",
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(34,200,138,0.25)", marginBottom: 10,
        }}>
          Confirmer et soumettre à validation
        </button>
        <button onClick={() => goTo(20)} style={{
          width: "100%", background: "none", border: "none",
          fontSize: 13, color: "#E8302A", cursor: "pointer", padding: "8px", fontWeight: 500,
        }}>
          ⚠️ Signaler un litige
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 20 : SIGNALER UN LITIGE (CLIENT) ━━━ */
const Screen20 = ({ goTo, goBack }) => {
  const [reason, setReason] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    "Travail non conforme au devis",
    "Dommages causés lors de l'intervention",
    "Artisan ne s'est pas présenté",
    "Surfacturation par rapport au devis",
    "Travail inachevé",
    "Autre problème",
  ];

  if (submitted) {
    return (
      <div className="screen-enter" style={{
        background: "#F5FAF7", minHeight: "100%",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "40px 24px", textAlign: "center",
      }}>
        <div className="check-anim" style={{
          width: 80, height: 80, borderRadius: 24,
          background: "#1B6B4E", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, boxShadow: "0 8px 30px rgba(27,107,78,0.2)",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path className="check-path" d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>Litige signalé</h2>
        <p style={{ fontSize: 14, color: "#4A5568", margin: "0 0 6px", lineHeight: 1.5 }}>
          Notre équipe va examiner votre demande sous 24h.
        </p>
        <p style={{ fontSize: 13, color: "#8A95A3", margin: "0 0 24px" }}>
          Le paiement reste bloqué en séquestre pendant l'examen.
        </p>
        <button onClick={() => goTo(5)} className="btn-press btn-primary">
          Retour aux missions
        </button>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Signaler un litige" onBack={goBack}/>
      <div style={{ padding: "8px 16px 100px" }}>
        {/* Mission concerned */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
          boxShadow: "0 1px 6px rgba(10,22,40,0.03)", border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#1B6B4E",
          }}>JM</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1628" }}>Jean-Michel P. • Plomberie</div>
            <div style={{ fontSize: 12, color: "#8A95A3" }}>15 mars 2026 • 320,00€</div>
          </div>
        </div>

        {/* Info banner */}
        <div style={{
          background: "rgba(232,48,42,0.04)", borderRadius: 16, padding: "14px",
          border: "1px solid rgba(232,48,42,0.1)", marginBottom: 20,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          {Icons.lock("#E8302A", 18)}
          <span style={{ fontSize: 12, color: "#E8302A", lineHeight: 1.5 }}>
            Le paiement de 320,00€ est bloqué en séquestre et ne sera pas versé à l'artisan tant que le litige n'est pas résolu.
          </span>
        </div>

        {/* Reason selection */}
        <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#0A1628" }}>Motif du litige</h4>
        {reasons.map((r, i) => (
          <div key={i} onClick={() => setReason(i)} className="btn-press" style={{
            background: "#fff", borderRadius: 14, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 8, cursor: "pointer",
            border: reason === i ? "2px solid #E8302A" : "1px solid #D4EBE0",
            transition: "all 200ms ease",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: reason === i ? "6px solid #E8302A" : "2px solid #B0B0BB",
              transition: "all 200ms ease",
            }}/>
            <span style={{ fontSize: 13.5, color: "#0A1628", fontWeight: 500 }}>{r}</span>
          </div>
        ))}

        {/* Description */}
        <h4 style={{ fontSize: 14, fontWeight: 700, margin: "20px 0 10px", color: "#0A1628" }}>Décrivez le problème</h4>
        <textarea placeholder="Expliquez en détail ce qui ne va pas..." style={{
          width: "100%", height: 120, borderRadius: 16, border: "1px solid #D4EBE0",
          padding: "14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 14, background: "#fff",
        }}/>

        {/* Photo upload */}
        <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#0A1628" }}>Photos (optionnel)</h4>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          background: "rgba(27,107,78,0.04)", border: "1.5px dashed rgba(27,107,78,0.3)",
          borderRadius: 14, padding: "14px 16px",
          cursor: "pointer", fontSize: 13, color: "#1B6B4E", fontWeight: 600,
          marginBottom: 20,
        }}>
          {Icons.camera("#1B6B4E", 18)} Ajouter des photos comme preuves
        </button>

        {/* Contact preference */}
        <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#0A1628" }}>Comment souhaitez-vous être contacté ?</h4>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["Email", "Téléphone", "Les deux"].map((opt, i) => (
            <button key={opt} style={{
              flex: 1, padding: "10px", borderRadius: 12,
              background: i === 2 ? "#1B6B4E" : "#fff",
              color: i === 2 ? "#fff" : "#0A1628",
              border: i === 2 ? "none" : "1px solid #D4EBE0",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>{opt}</button>
          ))}
        </div>

        {/* Submit */}
        <button onClick={() => setSubmitted(true)} className="btn-press" style={{
          width: "100%", height: 54, borderRadius: 16,
          background: "#E8302A", color: "#fff", border: "none",
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(232,48,42,0.2)",
        }}>
          Envoyer le signalement
        </button>
        <p style={{ fontSize: 11, color: "#8A95A3", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
          Nova s'engage à traiter votre demande sous 24h ouvrées. Vous recevrez une notification dès qu'une décision sera prise.
        </p>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 11 : ARTISAN LIST BY CATEGORY ━━━ */
const Screen11 = ({ goTo, goBack, category }) => {
  const catLabel = allCategories.find(c => c.id === category)?.label || "Artisans";
  const artisans = artisansByCategory[category] || artisansByCategory.plumber;
  const [sort, setSort] = useState("rating");

  const sorted = [...artisans].sort((a, b) =>
    sort === "rating" ? b.rating - a.rating : sort === "price" ? a.price - b.price : b.reviews - a.reviews
  );

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title={catLabel} onBack={goBack}/>
      <div style={{ padding: "0 16px 100px" }}>
        {/* Result count + sort */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14, paddingTop: 4,
        }}>
          <span style={{ fontSize: 13, color: "#8A95A3" }}>
            {artisans.length} artisans disponibles
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { id: "rating", label: "Note" },
              { id: "price", label: "Prix" },
              { id: "reviews", label: "Avis" },
            ].map(s => (
              <button key={s.id} onClick={() => setSort(s.id)} style={{
                padding: "5px 12px", borderRadius: 10,
                background: sort === s.id ? "#1B6B4E" : "#fff",
                color: sort === s.id ? "#fff" : "#4A5568",
                border: sort === s.id ? "none" : "1px solid #D4EBE0",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                transition: "all 200ms ease",
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Artisan cards */}
        {sorted.map((a) => (
          <div key={a.id} className="btn-press" onClick={() => goTo(2)}
            style={{
              background: "#fff", borderRadius: 18, padding: "16px",
              marginBottom: 10,
              boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
              border: "1px solid rgba(10,22,40,0.04)",
              cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start",
            }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 18,
                background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "#1B6B4E",
              }}>{a.initials}</div>
              {a.available && <div style={{
                position: "absolute", bottom: -2, right: -2,
                width: 14, height: 14, borderRadius: "50%",
                background: "#22C88A", border: "2px solid #fff",
              }}/>}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0A1628" }}>{a.name}</span>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: "#1B6B4E",
                }}>{a.price}€<span style={{ fontSize: 10, fontWeight: 400, color: "#8A95A3" }}>/h</span></span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  {Icons.star("#F5A623", 13)}
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{a.rating}</span>
                </div>
                <span style={{ fontSize: 11.5, color: "#8A95A3" }}>{a.reviews} avis</span>
                <span style={{ fontSize: 11.5, color: "#7EA894" }}>•</span>
                <span style={{ fontSize: 11.5, color: "#8A95A3" }}>{a.missions} missions</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Badge type="certified" small/>
                <span style={{ fontSize: 11, color: "#8A95A3" }}>Répond en {a.responseTime}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Trust footer */}
        <div style={{
          background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "14px",
          border: "1px solid rgba(27,107,78,0.08)", marginTop: 8,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          {Icons.shield("#1B6B4E", 18)}
          <span style={{ fontSize: 12, color: "#14523B", lineHeight: 1.4 }}>
            Tous les artisans Nova sont vérifiés, assurés et soumis au paiement sécurisé par séquestre.
          </span>
        </div>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 6 : ARTISAN DASHBOARD ━━━ */
const Screen6 = ({ goTo }) => {
  const [avail, setAvail] = useState("available");
  const [fabOpen, setFabOpen] = useState(false);
  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      {/* Light header */}
      <div style={{
        background: "linear-gradient(170deg, #E8F5EE 0%, #F5FAF7 100%)",
        padding: "54px 20px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, color: "#0A1628", margin: "0 0 3px" }}>
              Bonjour Jean-Michel 👋
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {Icons.shield("#F5A623", 14)}
              <span style={{ fontSize: 12, color: "#8A95A3" }}>Certifié Nova • #2847</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => goTo(21)} style={{
              position: "relative", background: "none", border: "none",
              cursor: "pointer", padding: 4,
            }}>
              {Icons.bell("#0A1628", 22)}
              <div style={{
                position: "absolute", top: -2, right: -2,
                width: 16, height: 16, borderRadius: "50%",
                background: "#E8302A", fontSize: 9, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                border: "2px solid #F5FAF7",
              }}>3</div>
            </button>
            <button onClick={() => goTo(16)} style={{
              width: 40, height: 40, borderRadius: 14,
              background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#1B6B4E",
              border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}>JM</button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 100px" }}>
        {/* Availability */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "14px 16px",
          marginBottom: 14, marginTop: -8,
          boxShadow: "0 1px 8px rgba(10,22,40,0.04)", border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ fontSize: 11, color: "#8A95A3", marginBottom: 8, fontWeight: 500 }}>Disponibilité</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { id: "available", label: "Disponible 🟢" },
              { id: "unavailable", label: "Indisponible ⛔" },
              { id: "urgency", label: "Urgences ⚡" },
            ].map(s => (
              <button key={s.id} onClick={() => setAvail(s.id)} style={{
                flex: 1, padding: "9px 4px", borderRadius: 12,
                background: avail === s.id ? "#1B6B4E" : "#F5FAF7",
                color: avail === s.id ? "#fff" : "#4A5568",
                border: avail === s.id ? "none" : "1px solid #D4EBE0",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: avail === s.id ? "0 2px 10px rgba(27,107,78,0.2)" : "none",
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Revenus du mois", value: "4 820€", icon: "💶", color: "#1B6B4E" },
            { label: "Missions en cours", value: "3", icon: "🔧", color: "#F5A623" },
            { label: "Devis en attente", value: "2", icon: "📄", color: "#E8302A" },
            { label: "Note moyenne", value: "★ 4.9", icon: "⭐", color: "#F5A623" },
          ].map((kpi, i) => (
            <div key={i} className="btn-press" style={{
              background: "#fff", borderRadius: 18, padding: "14px 16px",
              boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
              border: "1px solid rgba(10,22,40,0.04)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#8A95A3" }}>{kpi.label}</span>
                <span style={{ fontSize: 16 }}>{kpi.icon}</span>
              </div>
              <div style={{
                fontFamily: kpi.value.includes("€") ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
                fontSize: 22, fontWeight: 700, color: "#0A1628",
              }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Urgent requests */}
        <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, margin: "0 0 10px", color: "#0A1628" }}>
          Demandes urgentes
        </h4>
        <div style={{
          background: "rgba(232,48,42,0.04)", borderRadius: 18, padding: "14px 16px",
          border: "1px solid rgba(232,48,42,0.1)", marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 14,
                background: "rgba(232,48,42,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>⚡</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1628" }}>Fuite d'eau urgente</div>
                <div style={{ fontSize: 12, color: "#4A5568" }}>Secteur Paris 9e</div>
                <div style={{ fontSize: 11, color: "#8A95A3" }}>Intervention estimée : 1h</div>
              </div>
            </div>
            <span style={{ fontSize: 10.5, color: "#E8302A", fontWeight: 600 }}>Il y a 4 min</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => goTo(22)} className="btn-press" style={{
              flex: 1, height: 40, borderRadius: 12,
              background: "#22C88A", color: "#fff", border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(34,200,138,0.2)",
            }}>Accepter</button>
            <button onClick={() => goTo(22)} className="btn-press" style={{
              flex: 1, height: 40, borderRadius: 12,
              background: "#fff", color: "#4A5568", border: "1px solid #D4EBE0",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>Voir détails</button>
          </div>
        </div>

        {/* Upcoming */}
        <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, margin: "0 0 10px", color: "#0A1628" }}>
          Prochains RDV
        </h4>
        {[
          { client: "Pierre M.", type: "Installation robinet", date: "Auj. 14h", status: "Confirmé", sColor: "#1B6B4E" },
          { client: "Amélie R.", type: "Réparation chauffe-eau", date: "Dem. 9h", status: "En cours", sColor: "#22C88A" },
          { client: "Luc D.", type: "Diagnostic fuite", date: "18 mars 11h", status: "En attente", sColor: "#F5A623" },
        ].map((rdv, i) => (
          <div key={i} className="btn-press" onClick={() => goTo(14)} style={{
            background: "#fff", borderRadius: 16, padding: "12px 16px",
            marginBottom: 8, display: "flex", justifyContent: "space-between",
            alignItems: "center", boxShadow: "0 1px 4px rgba(10,22,40,0.02)",
            border: "1px solid rgba(10,22,40,0.04)", cursor: "pointer",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1628" }}>{rdv.client}</div>
              <div style={{ fontSize: 12, color: "#8A95A3" }}>{rdv.type}</div>
              <div style={{ fontSize: 11, color: "#7EA894" }}>{rdv.date}</div>
            </div>
            <span style={{
              padding: "5px 10px", borderRadius: 10,
              background: `${rdv.sColor}10`, color: rdv.sColor,
              fontSize: 11, fontWeight: 600,
            }}>{rdv.status}</span>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200 }}>
        {fabOpen && (
          <div className="fab-menu" style={{
            position: "absolute", bottom: 64, right: 0,
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {[
              { label: "Créer un devis", icon: Icons.doc("#1B6B4E", 16), go: 7 },
              { label: "Nouvelle facture", icon: Icons.doc("#1B6B4E", 16), go: 10 },
            ].map((item, i) => (
              <button key={i} onClick={() => { setFabOpen(false); goTo(item.go); }} className="btn-press glass-card" style={{
                padding: "10px 18px", borderRadius: 14,
                border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8,
                color: "#0A1628",
              }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}
        <button onClick={() => setFabOpen(!fabOpen)} className="btn-press" style={{
          width: 56, height: 56, borderRadius: 18,
          background: "#1B6B4E", border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(27,107,78,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 300ms cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        }}>
          {Icons.plus("#fff", 26)}
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 7 : QUOTE CREATION ━━━ */
const Screen7 = ({ goTo, goBack }) => {
  const [step, setStep] = useState(0);
  const [lines] = useState([
    { desc: "Remplacement robinet mitigeur", qty: 1, unit: "u", price: 85 },
    { desc: "Main d'œuvre", qty: 2, unit: "h", price: 65 },
  ]);
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tva = total * 0.1;

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Créer un devis" onBack={goBack}/>
      <ProgressSteps steps={["Client", "Lignes", "Envoi"]} current={step}/>
      <div style={{ padding: "0 16px 100px" }}>
        {step === 0 && (
          <div>
            {["Nom du client", "Email", "Téléphone", "Adresse"].map((label, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#8A95A3", display: "block", marginBottom: 5 }}>{label}</label>
                <input defaultValue={
                  i === 0 ? "Caroline Lefèvre" : i === 1 ? "caroline.l@email.com" : i === 2 ? "06 12 34 56 78" : "12 rue de Clichy, Paris 9e"
                } style={{
                  width: "100%", height: 48, borderRadius: 14,
                  border: "1px solid #D4EBE0", padding: "0 14px",
                  fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  outline: "none", boxSizing: "border-box", background: "#fff",
                }}/>
              </div>
            ))}
            <label style={{ fontSize: 12, color: "#8A95A3", display: "block", marginBottom: 6 }}>Type de mission</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {["Plomberie", "Chauffage", "Sanitaire", "Urgence"].map((t, i) => (
                <button key={t} style={{
                  padding: "8px 16px", borderRadius: 12,
                  background: i === 0 ? "#1B6B4E" : "#fff",
                  color: i === 0 ? "#fff" : "#4A5568",
                  border: i === 0 ? "none" : "1px solid #D4EBE0",
                  fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                }}>{t}</button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="btn-press btn-primary" style={{ width: "100%" }}>Suivant</button>
          </div>
        )}
        {step === 1 && (
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: "4px 0 12px", color: "#0A1628" }}>Lignes du devis</h4>
            {lines.map((l, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "12px 14px",
                marginBottom: 8, border: "1px solid rgba(10,22,40,0.04)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#0A1628" }}>{l.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8A95A3" }}>
                  <span>{l.qty} {l.unit} × {l.price}€</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#0A1628" }}>
                    {(l.qty * l.price).toFixed(2)}€
                  </span>
                </div>
              </div>
            ))}
            <button style={{
              width: "100%", padding: "10px", borderRadius: 14,
              background: "none", border: "1.5px dashed rgba(27,107,78,0.3)",
              fontSize: 13, color: "#1B6B4E", fontWeight: 600, cursor: "pointer", marginBottom: 16,
            }}>+ Ajouter une ligne</button>
            <div style={{ background: "#fff", borderRadius: 18, padding: "12px 16px", marginBottom: 16, border: "1px solid rgba(10,22,40,0.04)" }}>
              {[["Sous-total HT", `${total.toFixed(2)}€`], ["TVA (10%)", `${tva.toFixed(2)}€`], ["Total TTC", `${(total + tva).toFixed(2)}€`]].map(([k, v], i) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", padding: "8px 0",
                  borderTop: i ? "1px solid #E8F5EE" : "none",
                }}>
                  <span style={{ fontSize: i === 2 ? 15 : 13, fontWeight: i === 2 ? 700 : 400, color: i === 2 ? "#0A1628" : "#8A95A3" }}>{k}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: i === 2 ? 18 : 13, fontWeight: 700, color: "#0A1628" }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="btn-press btn-primary" style={{ width: "100%" }}>Suivant</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label style={{ fontSize: 12, color: "#8A95A3", display: "block", marginBottom: 6 }}>Validité du devis</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["7 jours", "14 jours", "30 jours"].map((d, i) => (
                <button key={d} style={{
                  flex: 1, padding: "10px", borderRadius: 12,
                  background: i === 1 ? "#1B6B4E" : "#fff",
                  color: i === 1 ? "#fff" : "#0A1628",
                  border: i === 1 ? "none" : "1px solid #D4EBE0",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>{d}</button>
              ))}
            </div>
            <textarea placeholder="Message personnalisé au client..." defaultValue="Bonjour Mme Lefèvre, voici le devis pour l'intervention." style={{
              width: "100%", height: 80, borderRadius: 16, border: "1px solid #D4EBE0",
              padding: "14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 12, background: "#fff",
            }}/>
            <div style={{
              background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
              border: "1px solid rgba(27,107,78,0.08)",
            }}>
              {Icons.lock("#1B6B4E", 15)}
              <span style={{ fontSize: 12, color: "#14523B", fontWeight: 500 }}>Le client recevra le devis sur son espace Nova et paiera via séquestre</span>
            </div>
            <button onClick={() => goTo(8)} className="btn-press btn-primary" style={{ width: "100%" }}>Envoyer le devis au client</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 8 : QUOTE SIGNATURE ━━━ */
const Screen8 = ({ goTo, goBack }) => {
  const [signed, setSigned] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const startDraw = useCallback((e) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath(); ctx.moveTo(x, y); setIsDrawing(true);
  }, []);
  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2; ctx.strokeStyle = "#0A1628"; ctx.lineCap = "round";
    ctx.lineTo(x, y); ctx.stroke();
  }, [isDrawing]);
  const stopDraw = useCallback(() => setIsDrawing(false), []);
  const clearCanvas = () => { const c = canvasRef.current; if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height); };

  if (signed) {
    return (
      <div className="screen-enter" style={{
        background: "#F5FAF7", minHeight: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center",
      }}>
        <div className="check-anim" style={{
          width: 80, height: 80, borderRadius: 24,
          background: "#1B6B4E", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, boxShadow: "0 8px 30px rgba(27,107,78,0.2)",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path className="check-path" d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, margin: "0 0 6px" }}>Devis signé !</h2>
        <p style={{ fontSize: 14, color: "#8A95A3", margin: "0 0 8px" }}>Paiement sécurisé par Nova</p>
        <Badge type="payment"/>
        <button onClick={() => goTo(9)} className="btn-press btn-primary" style={{ marginTop: 24 }}>
          Voir mes paiements
        </button>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Devis à signer" onBack={goBack}/>
      <div style={{ padding: "4px 16px 0", textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#1B6B4E", fontWeight: 600 }}>#DEV-2026-089</span>
      </div>
      <div style={{ padding: "12px 16px 100px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "20px 16px",
          boxShadow: "0 1px 8px rgba(10,22,40,0.04)", marginBottom: 16,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #E8F5EE" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {Icons.shield("#1B6B4E", 16)}
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15 }}>Nova</span>
            </div>
            <span style={{ fontSize: 10, color: "#8A95A3", fontWeight: 500 }}>DEVIS</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 11.5 }}>
            <div><div style={{ fontWeight: 600, marginBottom: 2 }}>Jean-Michel P.</div><div style={{ color: "#7EA894" }}>SIRET: 123 456 789</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontWeight: 600, marginBottom: 2 }}>Caroline Lefèvre</div><div style={{ color: "#7EA894" }}>12 rue de Clichy</div></div>
          </div>
          <div style={{ background: "#F5FAF7", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 0.5fr 1fr 1fr", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#7EA894" }}>
              <span>Désignation</span><span>Qté</span><span>P.U.</span><span style={{ textAlign: "right" }}>Total</span>
            </div>
            {[["Remplacement robinet", "1", "85,00€", "85,00€"],["Main d'œuvre", "2h", "65,00€", "130,00€"]].map(([d, q, p, t], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 0.5fr 1fr 1fr", padding: "8px 10px", fontSize: 11.5, borderTop: "1px solid #F0F0F4" }}>
                <span style={{ fontWeight: 500 }}>{d}</span><span style={{ color: "#8A95A3" }}>{q}</span><span style={{ color: "#8A95A3" }}>{p}</span>
                <span style={{ textAlign: "right", fontWeight: 600 }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#7EA894" }}>Total HT: 215,00€ • TVA: 21,50€</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, marginTop: 4 }}>236,50€ TTC</div>
          </div>
        </div>

        <h4 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "#0A1628" }}>Signature</h4>
        <div style={{
          background: "#fff", borderRadius: 18, padding: 2,
          border: "2px dashed rgba(27,107,78,0.3)", marginBottom: 8, overflow: "hidden",
        }}>
          <canvas ref={canvasRef} width={345} height={110}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
            style={{ width: "100%", height: 110, display: "block", cursor: "crosshair" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={clearCanvas} style={{ background: "none", border: "none", fontSize: 12, color: "#E8302A", cursor: "pointer", fontWeight: 500 }}>Effacer</button>
          <span style={{ fontSize: 11, color: "#7EA894" }}>17 mars 2026</span>
        </div>
        <div style={{
          background: "#F5FAF7", borderRadius: 16, padding: "12px 14px",
          fontSize: 12, color: "#4A5568", lineHeight: 1.6, marginBottom: 20,
          border: "1px solid rgba(10,22,40,0.03)",
        }}>
          En signant, vous acceptez ce devis et autorisez Nova à bloquer le montant en séquestre.
        </div>
        <button onClick={() => setSigned(true)} className="btn-press btn-primary" style={{ width: "100%" }}>
          Signer et valider le devis
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 9 : PAYMENT TRACKING ━━━ */
const Screen9 = ({ goTo, goBack }) => {
  const [tab, setTab] = useState("escrow");
  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Mes paiements" onBack={goBack}/>
      <div style={{ padding: "8px 16px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[{ id: "pending", label: "En attente" },{ id: "escrow", label: "En séquestre" },{ id: "received", label: "Reçus" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "9px 0", borderRadius: 12,
              background: tab === t.id ? "#1B6B4E" : "#fff",
              color: tab === t.id ? "#fff" : "#4A5568",
              border: tab === t.id ? "none" : "1px solid #D4EBE0",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              boxShadow: tab === t.id ? "0 2px 10px rgba(27,107,78,0.2)" : "none",
              transition: "all 200ms ease",
            }}>{t.label}</button>
          ))}
        </div>
        {tab === "escrow" && (
          <>
            <div style={{
              background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "12px 14px",
              display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14,
              border: "1px solid rgba(27,107,78,0.08)",
            }}>
              {Icons.lock("#1B6B4E", 16)}
              <span style={{ fontSize: 12, color: "#14523B", lineHeight: 1.5 }}>
                Fonds sécurisés chez Nova. Virement sous 48h après validation par nos équipes.
              </span>
            </div>
            {[{ client: "Caroline L.", mission: "Remplacement robinet", amount: "236,50€", days: 3 },
              { client: "Pierre M.", mission: "Installation cumulus", amount: "890,00€", days: 5 }].map((m, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 18, padding: "14px 16px",
                marginBottom: 10, border: "1px solid rgba(10,22,40,0.04)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1628" }}>{m.client}</div>
                    <div style={{ fontSize: 12, color: "#8A95A3" }}>{m.mission}</div>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700 }}>{m.amount}</div>
                </div>
                <div style={{ background: "#D4EBE0", borderRadius: 4, height: 4, marginBottom: 4 }}>
                  <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #1B6B4E, #22C88A)", width: `${((7 - m.days) / 7) * 100}%` }}/>
                </div>
                <span style={{ fontSize: 10.5, color: "#7EA894" }}>Validation dans {m.days} jours</span>
              </div>
            ))}
          </>
        )}
        {tab === "received" && (
          <>
            {[{ client: "Amélie R.", amount: "450,00€", date: "12 mars 2026" },
              { client: "Luc D.", amount: "320,00€", date: "5 mars 2026" },
              { client: "Marie T.", amount: "185,00€", date: "28 fév 2026" }].map((p, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "12px 16px",
                marginBottom: 8, display: "flex", justifyContent: "space-between",
                alignItems: "center", border: "1px solid rgba(10,22,40,0.04)",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1628" }}>{p.client}</div>
                  <div style={{ fontSize: 11, color: "#7EA894" }}>{p.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700, color: "#22C88A" }}>{p.amount}</div>
                  <div style={{ fontSize: 10, color: "#22C88A" }}>Virement effectué ✓</div>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "pending" && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#7EA894" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Aucun paiement en attente</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 10 : INVOICE ━━━ */
const Screen10 = ({ goTo, goBack }) => {
  const [sent, setSent] = useState(false);
  const [sendOption, setSendOption] = useState("both");

  if (sent) {
    return (
      <div className="screen-enter" style={{
        background: "#F5FAF7", minHeight: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center",
      }}>
        <div className="envelope-fly" style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, margin: "0 0 6px" }}>Facture envoyée !</h2>
        <p style={{ fontSize: 14, color: "#8A95A3", margin: "0 0 16px" }}>caroline.l@email.com ✓</p>
        <button onClick={() => goTo(6)} className="btn-press btn-primary">Retour au tableau de bord</button>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Facture générée" onBack={goBack}/>
      <div style={{ padding: "0 16px", textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "#8A95A3" }}>Suite à la validation de votre mission</span>
      </div>
      <div style={{ padding: "0 16px 100px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "20px 16px",
          boxShadow: "0 1px 8px rgba(10,22,40,0.04)", marginBottom: 16,
          position: "relative", overflow: "hidden", border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{
            position: "absolute", top: 28, right: -8, transform: "rotate(15deg)",
            border: "3px solid rgba(34,200,138,0.25)", borderRadius: 8,
            padding: "4px 16px", color: "rgba(34,200,138,0.35)",
            fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700,
          }}>PAYÉ ✓</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #E8F5EE" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {Icons.shield("#1B6B4E", 16)}
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15 }}>Nova</span>
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1B6B4E", fontWeight: 600 }}>#FAC-2026-127</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 11.5 }}>
            <div><div style={{ fontWeight: 600, marginBottom: 2 }}>Jean-Michel P.</div><div style={{ color: "#7EA894" }}>SIRET: 123 456 789</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontWeight: 600, marginBottom: 2 }}>Caroline Lefèvre</div><div style={{ color: "#7EA894" }}>12 rue de Clichy</div></div>
          </div>
          <div style={{ background: "#F5FAF7", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 0.5fr 1fr 1fr", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#7EA894" }}>
              <span>Désignation</span><span>Qté</span><span>P.U.</span><span style={{ textAlign: "right" }}>Total</span>
            </div>
            {[["Remplacement robinet", "1", "85,00€", "85,00€"],["Main d'œuvre", "2h", "65,00€", "130,00€"]].map(([d, q, p, t], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 0.5fr 1fr 1fr", padding: "8px 10px", fontSize: 11.5, borderTop: "1px solid #F0F0F4" }}>
                <span style={{ fontWeight: 500 }}>{d}</span><span style={{ color: "#8A95A3" }}>{q}</span><span style={{ color: "#8A95A3" }}>{p}</span>
                <span style={{ textAlign: "right", fontWeight: 600 }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#7EA894" }}>Sous-total: 215,00€ • TVA: 21,50€</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, marginTop: 4 }}>236,50€ TTC</div>
          </div>
          <div style={{ fontSize: 9, color: "#C4C9D4", lineHeight: 1.5, marginTop: 10 }}>
            TVA non applicable, art. 293 B du CGI. Paiement reçu par Nova SAS.
          </div>
        </div>

        <h4 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "#0A1628" }}>Mode d'envoi</h4>
        {[{ id: "email", label: "📧 Email au client" },{ id: "pdf", label: "📄 PDF à télécharger" },{ id: "both", label: "📨 Les deux" }].map(o => (
          <div key={o.id} onClick={() => setSendOption(o.id)} className="btn-press" style={{
            background: sendOption === o.id ? "rgba(27,107,78,0.05)" : "#fff",
            border: sendOption === o.id ? "2px solid #1B6B4E" : "1px solid #D4EBE0",
            borderRadius: 16, padding: "14px 16px", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            transition: "all 200ms ease",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: sendOption === o.id ? "6px solid #1B6B4E" : "2px solid #B0B0BB",
              transition: "all 200ms ease",
            }}/>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#0A1628" }}>{o.label}</span>
          </div>
        ))}
        <button onClick={() => setSent(true)} className="btn-press btn-primary" style={{ width: "100%", marginTop: 8 }}>
          Envoyer la facture
        </button>
      </div>
    </div>
  );
};

/* ━━━ MAIN APP ━━━ */
/* ━━━ SCREEN 12 : NOTIFICATIONS (CLIENT) ━━━ */
const Screen12 = ({ goTo, goBack }) => {
  const notifications = [
    {
      id: 1, type: "devis", read: false, time: "Il y a 12 min",
      title: "Nouveau devis reçu",
      desc: "Jean-Michel P. vous a envoyé un devis pour « Remplacement robinet » — 236,50€ TTC",
      action: 13,
    },
    {
      id: 2, type: "mission", read: false, time: "Il y a 2h",
      title: "Mission confirmée",
      desc: "Votre rendez-vous avec Sophie M. est confirmé pour demain à 14h00",
      action: null,
    },
    {
      id: 3, type: "payment", read: true, time: "Hier",
      title: "Paiement validé par Nova",
      desc: "Le paiement de 450,00€ pour la mission avec Amélie R. a été libéré",
      action: null,
    },
    {
      id: 4, type: "info", read: true, time: "Il y a 3 jours",
      title: "Bienvenue sur Nova",
      desc: "Votre compte est vérifié. Vous pouvez maintenant rechercher des artisans certifiés.",
      action: null,
    },
  ];

  const typeStyles = {
    devis: { bg: "rgba(27,107,78,0.06)", icon: Icons.doc("#1B6B4E", 18), accent: "#1B6B4E" },
    mission: { bg: "rgba(34,200,138,0.06)", icon: Icons.check("#22C88A", 18), accent: "#22C88A" },
    payment: { bg: "rgba(245,166,35,0.06)", icon: Icons.lock("#F5A623", 18), accent: "#F5A623" },
    info: { bg: "rgba(138,149,163,0.06)", icon: Icons.shield("#8A95A3", 18), accent: "#8A95A3" },
  };

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <div className="glass-header" style={{ padding: "54px 20px 14px" }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, color: "#0A1628" }}>
          Notifications
        </h2>
      </div>
      <div style={{ padding: "12px 16px 100px" }}>
        {notifications.map(n => {
          const st = typeStyles[n.type];
          return (
            <div key={n.id} className="btn-press"
              onClick={() => n.action && goTo(n.action)}
              style={{
                background: "#fff", borderRadius: 18, padding: "16px",
                marginBottom: 10, cursor: n.action ? "pointer" : "default",
                border: !n.read ? `1.5px solid ${st.accent}30` : "1px solid rgba(10,22,40,0.04)",
                boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
                position: "relative",
              }}>
              {!n.read && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  width: 8, height: 8, borderRadius: "50%",
                  background: st.accent,
                }}/>
              )}
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                  background: st.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{st.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0A1628" }}>{n.title}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#4A5568", margin: "0 0 6px", lineHeight: 1.5 }}>{n.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#7EA894" }}>{n.time}</span>
                    {n.action && (
                      <span style={{ fontSize: 12, color: "#1B6B4E", fontWeight: 600 }}>Voir le devis →</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 13 : DEVIS REÇU (CLIENT) ━━━ */
const Screen13 = ({ goTo, goBack }) => {
  const [accepted, setAccepted] = useState(false);

  if (accepted) {
    return (
      <div className="screen-enter" style={{
        background: "#F5FAF7", minHeight: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center",
      }}>
        <div className="check-anim" style={{
          width: 80, height: 80, borderRadius: 24,
          background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, boxShadow: "0 8px 30px rgba(34,200,138,0.2)",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path className="check-path" d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, margin: "0 0 6px" }}>Devis accepté !</h2>
        <p style={{ fontSize: 14, color: "#4A5568", margin: "0 0 6px" }}>Vous allez être redirigé vers le paiement sécurisé</p>
        <Badge type="payment"/>
        <button onClick={() => goTo(4)} className="btn-press btn-primary" style={{ marginTop: 24 }}>
          Procéder au paiement
        </button>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Devis reçu" onBack={goBack}/>
      <div style={{ padding: "4px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#1B6B4E", fontWeight: 600 }}>#DEV-2026-089</span>
        <span style={{ fontSize: 11, color: "#8A95A3" }}>Reçu il y a 12 min</span>
      </div>
      <div style={{ padding: "12px 16px 100px" }}>
        {/* Artisan info */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "16px",
          display: "flex", alignItems: "center", gap: 14, marginBottom: 14,
          boxShadow: "0 1px 6px rgba(10,22,40,0.03)", border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, color: "#1B6B4E",
          }}>JM</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0A1628" }}>Jean-Michel P.</div>
            <div style={{ fontSize: 12, color: "#8A95A3" }}>Plombier • Certifié Nova</div>
          </div>
          {Icons.shield("#F5A623", 20)}
        </div>

        {/* Quote document */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "20px 16px",
          boxShadow: "0 1px 8px rgba(10,22,40,0.04)", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0A1628", marginBottom: 4 }}>Mission</div>
          <div style={{ fontSize: 14, color: "#4A5568", marginBottom: 14 }}>Remplacement robinet mitigeur cuisine</div>

          <div style={{ background: "#F5FAF7", borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 0.5fr 1fr 1fr", padding: "8px 12px", fontSize: 10, fontWeight: 600, color: "#7EA894" }}>
              <span>Désignation</span><span>Qté</span><span>P.U.</span><span style={{ textAlign: "right" }}>Total</span>
            </div>
            {[["Robinet mitigeur", "1", "85,00€", "85,00€"],["Main d'œuvre", "2h", "65,00€", "130,00€"]].map(([d, q, p, t], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 0.5fr 1fr 1fr", padding: "8px 12px", fontSize: 12, borderTop: "1px solid #F0F0F4" }}>
                <span style={{ fontWeight: 500, color: "#0A1628" }}>{d}</span>
                <span style={{ color: "#8A95A3" }}>{q}</span>
                <span style={{ color: "#8A95A3" }}>{p}</span>
                <span style={{ textAlign: "right", fontWeight: 600, color: "#0A1628" }}>{t}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #E8F5EE", paddingTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#8A95A3" }}>Sous-total HT</span>
              <span style={{ fontSize: 12, color: "#4A5568" }}>215,00€</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#8A95A3" }}>TVA (10%)</span>
              <span style={{ fontSize: 12, color: "#4A5568" }}>21,50€</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#0A1628" }}>Total TTC</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: "#0A1628" }}>236,50€</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          {[
            ["Date d'intervention", "22 mars 2026"],
            ["Validité du devis", "14 jours (expire le 31 mars)"],
            ["Adresse", "12 rue de Rivoli, Paris 4e"],
          ].map(([k, v], i) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between", padding: "9px 0",
              borderBottom: i < 2 ? "1px solid #E8F5EE" : "none",
            }}>
              <span style={{ fontSize: 12.5, color: "#8A95A3" }}>{k}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0A1628", textAlign: "right", maxWidth: "55%" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Message artisan */}
        <div style={{
          background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "14px",
          border: "1px solid rgba(27,107,78,0.08)", marginBottom: 14,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#14523B", marginBottom: 4 }}>Message de l'artisan</div>
          <p style={{ fontSize: 12.5, color: "#4A5568", margin: 0, lineHeight: 1.5 }}>
            « Bonjour, voici le devis pour l'intervention. N'hésitez pas à me contacter pour toute question. »
          </p>
        </div>

        {/* Escrow info */}
        <div style={{
          background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "14px",
          border: "1px solid rgba(27,107,78,0.08)", marginBottom: 20,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          {Icons.lock("#1B6B4E", 18)}
          <span style={{ fontSize: 12, color: "#14523B", lineHeight: 1.5 }}>
            En acceptant ce devis, le montant sera bloqué en séquestre. L'artisan ne sera payé qu'après validation par Nova.
          </span>
        </div>

        {/* CTAs */}
        <button onClick={() => goTo(29)} className="btn-press btn-primary" style={{ width: "100%", marginBottom: 10 }}>
          Accepter et signer le devis
        </button>
        <button onClick={goBack} style={{
          width: "100%", height: 48, borderRadius: 16,
          background: "#fff", color: "#4A5568", border: "1px solid #D4EBE0",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Refuser le devis
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 14 : RDV DETAIL (ARTISAN) ━━━ */
const Screen14 = ({ goTo, goBack }) => {
  const rdv = {
    client: "Pierre M.", initials: "PM",
    type: "Installation robinet", category: "Plomberie",
    date: "17 mars 2026", time: "14h00 – 16h00",
    status: "Confirmé", statusColor: "#1B6B4E",
    address: "23 rue du Faubourg Saint-Antoine",
    city: "75011 Paris",
    floor: "3e étage, code 45B12",
    phone: "06 45 67 89 01",
    notes: "Robinet de cuisine à remplacer. Le client fournit le nouveau robinet (Grohe).",
    amount: "195,00€",
    lat: 48.8529,
    lng: 2.3706,
  };

  const wazeUrl = `https://waze.com/ul?ll=${rdv.lat},${rdv.lng}&navigate=yes`;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${rdv.lat},${rdv.lng}`;

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Détail du rendez-vous" onBack={goBack}/>
      <div style={{ padding: "8px 16px 100px" }}>
        {/* Status */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14,
        }}>
          <span style={{
            padding: "6px 14px", borderRadius: 12,
            background: `${rdv.statusColor}10`, color: rdv.statusColor,
            fontSize: 13, fontWeight: 700,
          }}>{rdv.status}</span>
          <span style={{ fontSize: 12, color: "#8A95A3" }}>{rdv.date}</span>
        </div>

        {/* Client card */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "16px",
          display: "flex", alignItems: "center", gap: 14, marginBottom: 12,
          boxShadow: "0 1px 6px rgba(10,22,40,0.03)", border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: 18,
            background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "#1B6B4E",
          }}>{rdv.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0A1628" }}>{rdv.client}</div>
            <div style={{ fontSize: 13, color: "#8A95A3" }}>{rdv.type}</div>
          </div>
          <a href={`tel:${rdv.phone}`} style={{
            width: 42, height: 42, borderRadius: 14,
            background: "rgba(34,200,138,0.08)", border: "1px solid rgba(34,200,138,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            {Icons.phone("#22C88A", 20)}
          </a>
        </div>

        {/* Details */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 12,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          {[
            [Icons.clock("#8A95A3", 16), "Horaire", rdv.time],
            [Icons.briefcase("#8A95A3", 16), "Catégorie", rdv.category],
            [Icons.doc("#8A95A3", 16), "Montant devis", rdv.amount],
          ].map(([icon, k, v], i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
              borderBottom: i < 2 ? "1px solid #E8F5EE" : "none",
            }}>
              {icon}
              <span style={{ fontSize: 13, color: "#8A95A3", minWidth: 90 }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0A1628" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div style={{
          background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 12,
          border: "1px solid rgba(10,22,40,0.04)",
          boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
        }}>
          <div style={{
            height: 160, background: "linear-gradient(135deg, #E5E5EA 0%, #E8F5EE 50%, #E5E5EA 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            {/* Map placeholder with streets */}
            <svg width="100%" height="100%" viewBox="0 0 360 160" style={{ position: "absolute", top: 0, left: 0 }}>
              <rect fill="#E8EDF5" width="360" height="160"/>
              {/* Streets grid */}
              <line x1="0" y1="60" x2="360" y2="60" stroke="#D0D8E8" strokeWidth="2"/>
              <line x1="0" y1="100" x2="360" y2="100" stroke="#D0D8E8" strokeWidth="1.5"/>
              <line x1="120" y1="0" x2="120" y2="160" stroke="#D0D8E8" strokeWidth="2"/>
              <line x1="240" y1="0" x2="240" y2="160" stroke="#D0D8E8" strokeWidth="1.5"/>
              <line x1="60" y1="0" x2="60" y2="160" stroke="#D0D8E8" strokeWidth="1"/>
              <line x1="180" y1="0" x2="180" y2="160" stroke="#D0D8E8" strokeWidth="1"/>
              <line x1="300" y1="0" x2="300" y2="160" stroke="#D0D8E8" strokeWidth="1"/>
              <line x1="0" y1="30" x2="360" y2="30" stroke="#D0D8E8" strokeWidth="1"/>
              <line x1="0" y1="130" x2="360" y2="130" stroke="#D0D8E8" strokeWidth="1"/>
              {/* Buildings */}
              <rect x="65" y="35" width="50" height="20" rx="3" fill="#C8D0E0" opacity="0.6"/>
              <rect x="125" y="65" width="45" height="30" rx="3" fill="#C8D0E0" opacity="0.5"/>
              <rect x="245" y="35" width="50" height="20" rx="3" fill="#C8D0E0" opacity="0.6"/>
              <rect x="185" y="105" width="50" height="20" rx="3" fill="#C8D0E0" opacity="0.5"/>
              <rect x="65" y="105" width="40" height="20" rx="3" fill="#C8D0E0" opacity="0.4"/>
              <rect x="245" y="105" width="50" height="20" rx="3" fill="#C8D0E0" opacity="0.5"/>
              {/* Street labels */}
              <text x="30" y="56" fill="#A0AAB8" fontSize="6" fontFamily="DM Sans">Rue du Fg Saint-Antoine</text>
              <text x="130" y="96" fill="#A0AAB8" fontSize="6" fontFamily="DM Sans">Rue de Charonne</text>
            </svg>
            {/* Pin */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -100%)",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#1B6B4E", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(27,107,78,0.3)",
              }}>{Icons.mapPin("#fff", 20)}</div>
              <div style={{
                width: 3, height: 8, background: "#1B6B4E",
                borderRadius: "0 0 2px 2px", marginTop: -2,
              }}/>
            </div>
          </div>

          {/* Address info */}
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 2 }}>{rdv.address}</div>
            <div style={{ fontSize: 13, color: "#8A95A3", marginBottom: 2 }}>{rdv.city}</div>
            <div style={{ fontSize: 12, color: "#7EA894" }}>{rdv.floor}</div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="btn-press" style={{
            flex: 1, height: 48, borderRadius: 14,
            background: "#fff", border: "1px solid #D4EBE0",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            textDecoration: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: "#0A1628",
          }}>
            {Icons.navigation("#1B6B4E", 18)}
            Ouvrir dans Waze
          </a>
          <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="btn-press" style={{
            flex: 1, height: 48, borderRadius: 14,
            background: "#fff", border: "1px solid #D4EBE0",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            textDecoration: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: "#0A1628",
          }}>
            {Icons.mapPin("#E8302A", 18)}
            Google Maps
          </a>
        </div>

        {/* Notes */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0A1628", marginBottom: 6 }}>Notes du client</div>
          <p style={{ fontSize: 13, color: "#4A5568", margin: 0, lineHeight: 1.5 }}>{rdv.notes}</p>
        </div>

        {/* Escrow info */}
        <div style={{
          background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "12px 14px",
          border: "1px solid rgba(27,107,78,0.08)", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          {Icons.lock("#1B6B4E", 16)}
          <span style={{ fontSize: 12, color: "#14523B", lineHeight: 1.4 }}>
            Paiement de {rdv.amount} bloqué en séquestre Nova
          </span>
        </div>

        {/* Actions */}
        <button className="btn-press btn-primary" style={{ width: "100%", marginBottom: 8 }}>
          Confirmer mon arrivée
        </button>
        <button style={{
          width: "100%", height: 48, borderRadius: 16,
          background: "#fff", color: "#E8302A", border: "1px solid rgba(232,48,42,0.15)",
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Annuler le rendez-vous
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 15 : CLIENT PROFILE ━━━ */
const Screen15 = ({ goTo, goBack }) => {
  const [editMode, setEditMode] = useState(false);
  const profile = {
    name: "Sophie Lefèvre", email: "sophie.lefevre@email.com",
    phone: "06 12 34 56 78", address: "12 rue de Rivoli, 75004 Paris",
    initials: "SL",
  };

  const MenuItem = ({ icon, label, value, action, danger }) => (
    <div onClick={action} className={action ? "btn-press" : ""} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "14px 0",
      borderBottom: "1px solid #E8F5EE", cursor: action ? "pointer" : "default",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12,
        background: danger ? "rgba(232,48,42,0.06)" : "rgba(27,107,78,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: danger ? "#E8302A" : "#0A1628" }}>{label}</div>
        {value && <div style={{ fontSize: 12, color: "#8A95A3", marginTop: 1 }}>{value}</div>}
      </div>
      {action && !danger && <span style={{ fontSize: 14, color: "#7EA894" }}>›</span>}
    </div>
  );

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <div className="glass-header" style={{ padding: "54px 20px 14px" }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, color: "#0A1628" }}>Mon profil</h2>
      </div>
      <div style={{ padding: "16px 16px 100px" }}>
        {/* Avatar + name */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 24,
            background: "linear-gradient(135deg, #1B6B4E, #14523B)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "#fff",
            boxShadow: "0 4px 16px rgba(27,107,78,0.2)", marginBottom: 12,
          }}>{profile.initials}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#0A1628" }}>{profile.name}</div>
          <div style={{ fontSize: 13, color: "#8A95A3", marginTop: 2 }}>Compte particulier</div>
        </div>

        {/* Personal info */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "4px 16px", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #E8F5EE" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0A1628" }}>Informations personnelles</span>
            <button onClick={() => setEditMode(!editMode)} style={{
              background: "rgba(27,107,78,0.06)", border: "none", borderRadius: 8,
              padding: "5px 10px", display: "flex", alignItems: "center", gap: 4,
              fontSize: 12, color: "#1B6B4E", fontWeight: 600, cursor: "pointer",
            }}>{Icons.edit("#1B6B4E", 12)} {editMode ? "Terminé" : "Modifier"}</button>
          </div>
          {[
            ["Nom complet", profile.name],
            ["Email", profile.email],
            ["Téléphone", profile.phone],
            ["Adresse", profile.address],
          ].map(([label, val], i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < 3 ? "1px solid #E8F5EE" : "none" }}>
              <div style={{ fontSize: 11, color: "#8A95A3", marginBottom: 3 }}>{label}</div>
              {editMode ? (
                <input defaultValue={val} style={{
                  width: "100%", border: "1px solid #D4EBE0", borderRadius: 10,
                  padding: "8px 12px", fontSize: 14, outline: "none",
                  fontFamily: "'DM Sans', sans-serif", background: "#F5FAF7",
                  boxSizing: "border-box",
                }}/>
              ) : (
                <div style={{ fontSize: 14, fontWeight: 500, color: "#0A1628" }}>{val}</div>
              )}
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "4px 16px", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <MenuItem icon={Icons.credit("#1B6B4E", 18)} label="Moyens de paiement" value="Visa •••• 6411" action={() => goTo(27)}/>
          <MenuItem icon={Icons.lock("#1B6B4E", 18)} label="Paiements et séquestre" value="1 carte enregistrée" action={() => goTo(9)}/>
          <MenuItem icon={Icons.briefcase("#1B6B4E", 18)} label="Mes missions" value="3 missions réalisées" action={() => goTo(5)}/>
          <MenuItem icon={Icons.bell("#1B6B4E", 18)} label="Préférences de notification" action={() => goTo(24)}/>
          <MenuItem icon={Icons.settings("#1B6B4E", 18)} label="Paramètres du compte" action={() => goTo(25)}/>
          <MenuItem icon={Icons.chat("#1B6B4E", 18)} label="Contacter le support" value="Par chat ou email" action={() => goTo(26)}/>
          <MenuItem icon={<span style={{ fontSize: 16 }}>🎁</span>} label="Inviter des proches" value="Gagnez 20€ par parrainage" action={() => goTo(30)}/>
        </div>

        {/* Danger zone */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "4px 16px",
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <MenuItem icon={Icons.logout("#E8302A", 18)} label="Se déconnecter" danger action={() => goTo(0)}/>
        </div>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 16 : ARTISAN PROFILE ━━━ */
const Screen16 = ({ goTo, goBack }) => {
  const [editSection, setEditSection] = useState(null);
  const profile = {
    name: "Jean-Michel Petit", initials: "JM", email: "jm.petit@plomberie-pro.fr",
    phone: "06 98 76 54 32", certifId: "#2847",
  };
  const company = {
    name: "JM Plomberie Pro", siret: "123 456 789 00012", tva: "FR 12 123456789",
    address: "8 rue des Artisans, 75011 Paris", ape: "4322A — Plomberie",
    assurance: "AXA Pro — Décennale n°PLB-2024-8901", rge: "QualiPAC — Exp. 12/2027",
  };

  const EditableField = ({ label, value, section }) => (
    <div style={{ padding: "11px 0", borderBottom: "1px solid #E8F5EE" }}>
      <div style={{ fontSize: 11, color: "#8A95A3", marginBottom: 3 }}>{label}</div>
      {editSection === section ? (
        <input defaultValue={value} style={{
          width: "100%", border: "1px solid #D4EBE0", borderRadius: 10,
          padding: "8px 12px", fontSize: 14, outline: "none",
          fontFamily: "'DM Sans', sans-serif", background: "#F5FAF7",
          boxSizing: "border-box",
        }}/>
      ) : (
        <div style={{ fontSize: 14, fontWeight: 500, color: "#0A1628" }}>{value}</div>
      )}
    </div>
  );

  const SectionHeader = ({ title, section }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 0", borderBottom: "1px solid #E8F5EE",
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0A1628" }}>{title}</span>
      <button onClick={() => setEditSection(editSection === section ? null : section)} style={{
        background: "rgba(27,107,78,0.06)", border: "none", borderRadius: 8,
        padding: "5px 10px", display: "flex", alignItems: "center", gap: 4,
        fontSize: 12, color: "#1B6B4E", fontWeight: 600, cursor: "pointer",
      }}>{Icons.edit("#1B6B4E", 12)} {editSection === section ? "Terminé" : "Modifier"}</button>
    </div>
  );

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <div className="glass-header" style={{ padding: "54px 20px 14px" }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, color: "#0A1628" }}>Mon profil</h2>
      </div>
      <div style={{ padding: "16px 16px 100px" }}>
        {/* Avatar + badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 24,
              background: "linear-gradient(135deg, #1B6B4E, #14523B)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: "#fff",
              boxShadow: "0 4px 16px rgba(27,107,78,0.2)",
            }}>{profile.initials}</div>
            <div style={{
              position: "absolute", bottom: -4, right: -4,
              width: 24, height: 24, borderRadius: "50%",
              background: "#FFF3DC", border: "2px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{Icons.shield("#F5A623", 14)}</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#0A1628" }}>{profile.name}</div>
          <div style={{ fontSize: 13, color: "#8A95A3", marginTop: 2 }}>Artisan Certifié Nova • {profile.certifId}</div>
          <div style={{ marginTop: 8 }}><Badge type="certified"/></div>
        </div>

        {/* Personal info */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "4px 16px", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <SectionHeader title="Informations personnelles" section="personal"/>
          <EditableField label="Nom complet" value={profile.name} section="personal"/>
          <EditableField label="Email" value={profile.email} section="personal"/>
          <EditableField label="Téléphone" value={profile.phone} section="personal"/>
        </div>

        {/* Company info */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "4px 16px", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <SectionHeader title="Informations entreprise" section="company"/>
          <EditableField label="Raison sociale" value={company.name} section="company"/>
          <EditableField label="SIRET" value={company.siret} section="company"/>
          <EditableField label="N° TVA intracommunautaire" value={company.tva} section="company"/>
          <EditableField label="Adresse du siège" value={company.address} section="company"/>
          <EditableField label="Code APE / Activité" value={company.ape} section="company"/>
        </div>

        {/* Certifications */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "4px 16px", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <SectionHeader title="Assurances et certifications" section="certifs"/>
          <EditableField label="Assurance décennale" value={company.assurance} section="certifs"/>
          <EditableField label="Certification RGE" value={company.rge} section="certifs"/>
          <div style={{ padding: "12px 0" }}>
            <button style={{
              width: "100%", padding: "10px", borderRadius: 12,
              background: "none", border: "1.5px dashed rgba(27,107,78,0.3)",
              fontSize: 13, color: "#1B6B4E", fontWeight: 600, cursor: "pointer",
            }}>+ Ajouter un document</button>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "4px 16px", marginBottom: 14,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          {[
            { icon: Icons.credit("#1B6B4E", 18), label: "Moyens de paiement", sub: "Carte et RIB", go: 27 },
            { icon: Icons.lock("#1B6B4E", 18), label: "Mes paiements", sub: "Historique et virements", go: 9 },
            { icon: Icons.doc("#1B6B4E", 18), label: "Mes documents", sub: "Devis et factures", go: 23 },
            { icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#1B6B4E" strokeWidth="1.5"/><path d="M4 22v-7" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round"/></svg>, label: "Comptabilité", sub: "Connexion Pennylane, Indy, export auto", go: 35 },
            { icon: Icons.bell("#1B6B4E", 18), label: "Notifications", sub: "Préférences", go: 24 },
            { icon: Icons.settings("#1B6B4E", 18), label: "Paramètres", sub: "Compte et sécurité", go: 25 },
            { icon: Icons.chat("#1B6B4E", 18), label: "Contacter le support", sub: "Par chat ou email", go: 26 },
            { icon: Icons.user("#1B6B4E", 18), label: "Mes clients", sub: "Carnet d'adresses et historique", go: 31 },
            { icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="#1B6B4E" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" stroke="#1B6B4E" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" stroke="#1B6B4E" strokeWidth="1.5"/><rect x="14" y="14" width="4" height="4" stroke="#1B6B4E" strokeWidth="1.5"/><path d="M21 14h-3v3h3v4h-4" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round"/></svg>, label: "Mon QR code", sub: "À partager sur véhicule, cartes, devis", go: 34 },
            { icon: <span style={{ fontSize: 16 }}>🎁</span>, label: "Inviter un artisan", sub: "Gagnez 20€ par parrainage", go: 30 },
          ].map((item, i) => (
            <div key={i} onClick={() => item.go && goTo(item.go)} className={item.go ? "btn-press" : ""} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "13px 0",
              borderBottom: i < 4 ? "1px solid #E8F5EE" : "none",
              cursor: item.go ? "pointer" : "default",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: "rgba(27,107,78,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#0A1628" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#8A95A3" }}>{item.sub}</div>
              </div>
              <span style={{ fontSize: 14, color: "#7EA894" }}>›</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "4px 16px",
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div onClick={() => goTo(0)} className="btn-press" style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 0", cursor: "pointer",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: "rgba(232,48,42,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{Icons.logout("#E8302A", 18)}</div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#E8302A" }}>Se déconnecter</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 17 : URGENCE — ARTISANS DISPONIBLES ━━━ */
const Screen17 = ({ goTo, goBack }) => {
  const [urgCat, setUrgCat] = useState(null);

  const urgCategories = [
    { id: "plumber", label: "Plomberie", icon: "🔧" },
    { id: "electrician", label: "Électricité", icon: "⚡" },
    { id: "locksmith", label: "Serrurerie", icon: "🔑" },
    { id: "heating", label: "Chauffage", icon: "🔥" },
    { id: "other", label: "Autre", icon: "+" },
  ];

  const urgentArtisans = [
    { id: 3, name: "Karim B.", job: "Serrurier", cat: "locksmith", initials: "KB", rating: 5.0, reviews: 83, price: 80, responseTime: "15 min", distance: "1,2 km", available: true, missions: 83 },
    { id: 1, name: "Jean-Michel P.", job: "Plombier", cat: "plumber", initials: "JM", rating: 4.9, reviews: 127, price: 85, responseTime: "25 min", distance: "2,4 km", available: true, missions: 127 },
    { id: 14, name: "Christophe D.", job: "Chauffagiste", cat: "heating", initials: "CD", rating: 4.9, reviews: 89, price: 90, responseTime: "30 min", distance: "3,1 km", available: true, missions: 89 },
    { id: 2, name: "Sophie M.", job: "Électricienne", cat: "electrician", initials: "SM", rating: 4.8, reviews: 94, price: 85, responseTime: "35 min", distance: "3,8 km", available: true, missions: 94 },
    { id: 6, name: "Fatima H.", job: "Plombier", cat: "plumber", initials: "FH", rating: 4.8, reviews: 91, price: 80, responseTime: "40 min", distance: "4,5 km", available: true, missions: 91 },
  ];

  const filtered = urgCat ? urgentArtisans.filter(a => a.cat === urgCat) : urgentArtisans;

  // Category selection view
  if (!urgCat) {
    return (
      <div className="screen-enter" style={{ background: "#F5FAF7" }}>
        <BackHeader title="Urgence 24h/24" onBack={goBack}/>

        <div style={{
          margin: "0 16px 20px", padding: "14px 16px", borderRadius: 16,
          background: "linear-gradient(135deg, #E8302A, #FF6B5B)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>⚡</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
            Besoin d'une intervention urgente ?
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
            Sélectionnez le domaine concerné
          </div>
        </div>

        <div style={{ padding: "0 16px 100px" }}>
          {urgCategories.map((cat) => (
            <div key={cat.id} className="btn-press" onClick={() => setUrgCat(cat.id === "other" ? null : cat.id) || (cat.id === "other" && setUrgCat("all"))}
              style={{
                background: "#fff", borderRadius: 18, padding: "18px 16px",
                marginBottom: 10, display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
                border: "1px solid rgba(10,22,40,0.04)",
                cursor: "pointer",
              }}>
              <div style={{
                width: 48, height: 48, borderRadius: 16,
                background: "rgba(232,48,42,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>{cat.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0A1628" }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: "#8A95A3", marginTop: 2 }}>
                  {cat.id === "other" ? "Tous les artisans d'urgence" : `Artisans ${cat.label.toLowerCase()} disponibles`}
                </div>
              </div>
              <span style={{ fontSize: 16, color: "#B0B0BB" }}>›</span>
            </div>
          ))}

          <div style={{
            background: "rgba(232,48,42,0.04)", borderRadius: 14, padding: "12px 14px",
            border: "1px solid rgba(232,48,42,0.08)", marginTop: 8,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            {Icons.clock("#E8302A", 16)}
            <span style={{ fontSize: 12, color: "#E8302A", lineHeight: 1.4 }}>
              Temps de réponse moyen : 20 minutes. Intervention sous 2h garantie.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // "all" shows everyone unfiltered
  const displayList = urgCat === "all" ? urgentArtisans : filtered;
  const catLabel = urgCat === "all" ? "Tous les domaines" : urgCategories.find(c => c.id === urgCat)?.label || "Urgence";

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title={`Urgence — ${catLabel}`} onBack={() => setUrgCat(null)}/>

      {/* Alert bar */}
      <div style={{
        margin: "0 16px 14px", padding: "12px 14px", borderRadius: 14,
        background: "linear-gradient(135deg, #E8302A, #FF6B5B)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Intervention express</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
            Ces artisans peuvent intervenir dans l'heure
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 100px" }}>
        <div style={{ fontSize: 13, color: "#8A95A3", marginBottom: 14 }}>
          {displayList.length} artisan{displayList.length > 1 ? "s" : ""} disponible{displayList.length > 1 ? "s" : ""} maintenant
        </div>

        {displayList.map((a) => (
          <div key={a.id} style={{
            background: "#fff", borderRadius: 20, padding: "16px",
            marginBottom: 10, boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
            border: "1px solid rgba(10,22,40,0.04)",
          }}>
            {/* Top row — artisan info */}
            <div className="btn-press" onClick={() => goTo(2)} style={{
              display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer",
              marginBottom: 12,
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 18,
                  background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#1B6B4E",
                }}>{a.initials}</div>
                <div style={{
                  position: "absolute", bottom: -2, right: -2,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "#22C88A", border: "2px solid #fff",
                }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0A1628" }}>{a.name}</span>
                  <Badge type="certified" small/>
                </div>
                <div style={{ fontSize: 13, color: "#8A95A3", marginBottom: 4 }}>{a.job}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {Icons.star("#F5A623", 13)}
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{a.rating}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#7EA894" }}>•</span>
                  <span style={{ fontSize: 11, color: "#8A95A3" }}>{a.reviews} avis</span>
                  <span style={{ fontSize: 11, color: "#7EA894" }}>•</span>
                  <span style={{ fontSize: 11, color: "#8A95A3" }}>{a.distance}</span>
                </div>
              </div>
            </div>

            {/* Response time + price bar */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", borderRadius: 12,
              background: "rgba(232,48,42,0.04)", marginBottom: 12,
              border: "1px solid rgba(232,48,42,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {Icons.clock("#E8302A", 15)}
                <span style={{ fontSize: 13, fontWeight: 700, color: "#E8302A" }}>
                  Dispo en {a.responseTime}
                </span>
              </div>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700, color: "#0A1628",
              }}>
                {a.price}€<span style={{ fontSize: 11, fontWeight: 400, color: "#8A95A3" }}>/h</span>
              </span>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => goTo(3)} className="btn-press" style={{
                flex: 1, height: 44, borderRadius: 12,
                background: "#E8302A", color: "#fff", border: "none",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 2px 10px rgba(232,48,42,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                ⚡ Intervention immédiate
              </button>
              <button onClick={() => goTo(2)} className="btn-press" style={{
                height: 44, paddingLeft: 16, paddingRight: 16, borderRadius: 12,
                background: "#fff", color: "#1B6B4E", border: "1px solid #D4EBE0",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                Voir profil
              </button>
            </div>
          </div>
        ))}

        {/* Trust footer */}
        <div style={{
          background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "14px",
          border: "1px solid rgba(27,107,78,0.08)", marginTop: 8,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          {Icons.shield("#1B6B4E", 18)}
          <span style={{ fontSize: 12, color: "#14523B", lineHeight: 1.4 }}>
            Tarif urgence majoré. Paiement sécurisé par séquestre Nova — l'artisan ne sera payé qu'après validation par nos équipes.
          </span>
        </div>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 18 : TOUTES LES CATÉGORIES ━━━ */
const Screen18 = ({ goTo, goBack, onSelectCategory }) => {
  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Toutes les catégories" onBack={goBack}/>
      <div style={{ padding: "8px 16px 100px" }}>
        <div style={{ fontSize: 13, color: "#8A95A3", marginBottom: 14 }}>
          {allCategories.length} catégories disponibles
        </div>

        {allCategories.map((cat) => (
          <div key={cat.id} className="btn-press"
            onClick={() => onSelectCategory(cat.id)}
            style={{
              background: "#fff", borderRadius: 16, padding: "16px",
              marginBottom: 8, display: "flex", justifyContent: "space-between",
              alignItems: "center", cursor: "pointer",
              boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
              border: "1px solid rgba(10,22,40,0.04)",
            }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0A1628" }}>{cat.label}</div>
              <div style={{ fontSize: 12, color: "#8A95A3", marginTop: 2 }}>{cat.count} artisans disponibles</div>
            </div>
            <span style={{ fontSize: 16, color: "#7EA894" }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 21 : NOTIFICATIONS (ARTISAN) ━━━ */
const Screen21 = ({ goTo }) => {
  const notifications = [
    { id: 1, type: "demande", read: false, time: "Il y a 4 min", title: "Nouvelle demande urgente", desc: "Fuite d'eau urgente — Secteur Paris 9e — Intervention estimée : 1h", action: 6 },
    { id: 2, type: "devis", read: false, time: "Il y a 1h", title: "Devis accepté par le client", desc: "Pierre M. a accepté votre devis #DEV-2026-089 — 236,50€. Paiement bloqué en séquestre.", action: 9 },
    { id: 3, type: "payment", read: false, time: "Il y a 3h", title: "Paiement libéré", desc: "Nova a validé la mission pour Amélie R. — 450,00€ virés sous 48h.", action: 9 },
    { id: 4, type: "rdv", read: true, time: "Hier", title: "Nouveau rendez-vous confirmé", desc: "Luc D. — Diagnostic fuite, 18 mars à 11h, 5 rue de Charonne, Paris 11e", action: 14 },
    { id: 5, type: "info", read: true, time: "Il y a 3 jours", title: "Certification renouvelée", desc: "Votre certification Nova a été renouvelée jusqu'au 15 mars 2027.", action: null },
  ];
  const typeStyles = {
    demande: { bg: "rgba(232,48,42,0.06)", icon: Icons.bolt("#E8302A", 18), accent: "#E8302A" },
    devis: { bg: "rgba(27,107,78,0.06)", icon: Icons.doc("#1B6B4E", 18), accent: "#1B6B4E" },
    payment: { bg: "rgba(34,200,138,0.06)", icon: Icons.lock("#22C88A", 18), accent: "#22C88A" },
    rdv: { bg: "rgba(245,166,35,0.06)", icon: Icons.clock("#F5A623", 16), accent: "#F5A623" },
    info: { bg: "rgba(138,149,163,0.06)", icon: Icons.shield("#8A95A3", 18), accent: "#8A95A3" },
  };
  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <div className="glass-header" style={{ padding: "54px 20px 14px" }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1628" }}>Notifications</h2>
      </div>
      <div style={{ padding: "12px 16px 100px" }}>
        {notifications.map(n => {
          const st = typeStyles[n.type];
          return (
            <div key={n.id} className="btn-press" onClick={() => n.action && goTo(n.action)} style={{
              background: "#fff", borderRadius: 18, padding: "16px", marginBottom: 10,
              cursor: n.action ? "pointer" : "default",
              border: !n.read ? `1.5px solid ${st.accent}30` : "1px solid rgba(10,22,40,0.04)",
              boxShadow: "0 1px 6px rgba(10,22,40,0.03)", position: "relative",
            }}>
              {!n.read && <div style={{ position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: "50%", background: st.accent }}/>}
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 14, flexShrink: 0, background: st.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{st.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 4 }}>{n.title}</div>
                  <p style={{ fontSize: 12.5, color: "#4A5568", margin: "0 0 6px", lineHeight: 1.5 }}>{n.desc}</p>
                  <span style={{ fontSize: 11, color: "#7EA894" }}>{n.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 22 : DÉTAIL INTERVENTION URGENTE (ARTISAN) ━━━ */
const Screen22 = ({ goTo, goBack }) => {
  const [accepted, setAccepted] = useState(false);

  if (accepted) {
    return (
      <div className="screen-enter" style={{
        background: "#F5FAF7", minHeight: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center",
      }}>
        <div className="check-anim" style={{
          width: 80, height: 80, borderRadius: 24,
          background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, boxShadow: "0 8px 30px rgba(34,200,138,0.2)",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path className="check-path" d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>
          Intervention acceptée !
        </h2>
        <p style={{ fontSize: 14, color: "#4A5568", margin: "0 0 6px", lineHeight: 1.5 }}>
          Les coordonnées du client vous ont été envoyées.
        </p>
        <p style={{ fontSize: 13, color: "#8A95A3", margin: "0 0 24px" }}>
          Rendez-vous sur place dès que possible.
        </p>
        <button onClick={() => goTo(14)} className="btn-press btn-primary">
          Voir l'itinéraire
        </button>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Demande d'intervention" onBack={goBack}/>
      <div style={{ padding: "8px 16px 100px" }}>

        {/* Urgence badge */}
        <div style={{
          background: "linear-gradient(135deg, #E8302A, #FF6B5B)",
          borderRadius: 16, padding: "14px 18px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Intervention urgente</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>Demande reçue il y a 4 minutes</div>
          </div>
        </div>

        {/* Type d'intervention */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "16px", marginBottom: 12,
          boxShadow: "0 1px 6px rgba(10,22,40,0.03)", border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ fontSize: 12, color: "#8A95A3", marginBottom: 4 }}>Type d'intervention</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#0A1628", marginBottom: 12 }}>Fuite d'eau urgente</div>

          {[
            [Icons.mapPin("#1B6B4E", 16), "Secteur", "Paris 9e — Quartier Clichy"],
            [Icons.clock("#8A95A3", 16), "Durée estimée", "1h environ"],
            [Icons.briefcase("#8A95A3", 16), "Catégorie", "Plomberie"],
          ].map(([icon, k, v], i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
              borderTop: "1px solid #E8F5EE",
            }}>
              {icon}
              <span style={{ fontSize: 13, color: "#8A95A3", minWidth: 90 }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0A1628" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Description du problème */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "16px", marginBottom: 12,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628", marginBottom: 8 }}>Description du problème</div>
          <p style={{ fontSize: 13, color: "#4A5568", margin: 0, lineHeight: 1.6 }}>
            Fuite importante sous l'évier de la cuisine. L'eau coule en continu, le robinet d'arrêt est difficile d'accès. Le client a coupé l'arrivée d'eau générale en attendant.
          </p>
        </div>

        {/* Photos jointes */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "16px", marginBottom: 12,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628", marginBottom: 10 }}>Photos jointes</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Photo 1", "Photo 2"].map((p, i) => (
              <div key={i} style={{
                width: 80, height: 80, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "#8A95A3", border: "1px solid rgba(10,22,40,0.04)",
              }}>{p}</div>
            ))}
          </div>
        </div>

        {/* Rémunération */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "16px", marginBottom: 12,
          border: "1px solid rgba(10,22,40,0.04)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628", marginBottom: 10 }}>Rémunération</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#8A95A3" }}>Tarif horaire urgence</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: "#0A1628" }}>85€/h</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#8A95A3" }}>Déplacement</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#22C88A" }}>Inclus</span>
          </div>
        </div>

        {/* Séquestre info */}
        <div style={{
          background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "14px",
          border: "1px solid rgba(27,107,78,0.08)", marginBottom: 20,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          {Icons.lock("#1B6B4E", 16)}
          <span style={{ fontSize: 12, color: "#14523B", lineHeight: 1.5 }}>
            Le paiement sera sécurisé par séquestre Nova. Vous serez payé après validation par nos équipes.
          </span>
        </div>

        {/* Anonymisation notice */}
        <div style={{
          background: "rgba(138,149,163,0.06)", borderRadius: 14, padding: "12px 14px",
          marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10,
          border: "1px solid rgba(138,149,163,0.1)",
        }}>
          {Icons.shield("#8A95A3", 16)}
          <span style={{ fontSize: 11.5, color: "#8A95A3", lineHeight: 1.5 }}>
            L'identité et l'adresse exacte du client vous seront communiquées uniquement après acceptation de l'intervention.
          </span>
        </div>

        {/* CTAs */}
        <button onClick={() => setAccepted(true)} className="btn-press" style={{
          width: "100%", height: 54, borderRadius: 16,
          background: "#22C88A", color: "#fff", border: "none",
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(34,200,138,0.2)", marginBottom: 10,
        }}>
          Accepter l'intervention
        </button>
        <button onClick={goBack} style={{
          width: "100%", height: 48, borderRadius: 16,
          background: "#fff", color: "#4A5568", border: "1px solid #D4EBE0",
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Refuser
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 23 : MES DOCUMENTS (ARTISAN) ━━━ */
const Screen23 = ({ goTo, goBack }) => {
  const [tab, setTab] = useState("devis");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const docs = {
    devis: [
      { id: "#DEV-2026-089", client: "Caroline Lefèvre", clientAddr: "12 rue de Clichy, 75009 Paris", date: "17 mars 2026", amount: "236,50€", ht: "215,00€", tva: "21,50€", status: "Accepté", sColor: "#22C88A", lines: [["Remplacement robinet mitigeur", "1", "85,00€", "85,00€"], ["Main d'œuvre", "2h", "65,00€", "130,00€"]], validity: "14 jours" },
      { id: "#DEV-2026-085", client: "Pierre Martin", clientAddr: "5 rue de Charonne, 75011 Paris", date: "10 mars 2026", amount: "890,00€", ht: "809,09€", tva: "80,91€", status: "En attente", sColor: "#F5A623", lines: [["Installation cumulus 200L", "1", "450,00€", "450,00€"], ["Raccordement plomberie", "1", "200,00€", "200,00€"], ["Main d'œuvre", "2h", "65,00€", "130,00€"]], validity: "30 jours" },
      { id: "#DEV-2026-078", client: "Amélie Renard", clientAddr: "23 bd Voltaire, 75011 Paris", date: "28 fév 2026", amount: "450,00€", ht: "409,09€", tva: "40,91€", status: "Refusé", sColor: "#E8302A", lines: [["Réparation chauffe-eau", "1", "250,00€", "250,00€"], ["Main d'œuvre", "2h", "65,00€", "130,00€"]], validity: "7 jours" },
    ],
    factures: [
      { id: "#FAC-2026-127", client: "Amélie Renard", clientAddr: "23 bd Voltaire, 75011 Paris", date: "12 mars 2026", amount: "450,00€", ht: "409,09€", tva: "40,91€", status: "Payée", sColor: "#22C88A", lines: [["Réparation chauffe-eau", "1", "250,00€", "250,00€"], ["Main d'œuvre", "2h", "65,00€", "130,00€"]], paid: true },
      { id: "#FAC-2026-119", client: "Luc Dupont", clientAddr: "8 rue de Lappe, 75011 Paris", date: "5 mars 2026", amount: "320,00€", ht: "290,91€", tva: "29,09€", status: "Payée", sColor: "#22C88A", lines: [["Réparation fuite", "1", "180,00€", "180,00€"], ["Main d'œuvre", "1.5h", "65,00€", "97,50€"]], paid: true },
      { id: "#FAC-2026-104", client: "Marie Torres", clientAddr: "14 rue Oberkampf, 75011 Paris", date: "28 fév 2026", amount: "185,00€", ht: "168,18€", tva: "16,82€", status: "Payée", sColor: "#22C88A", lines: [["Débouchage canalisation", "1", "120,00€", "120,00€"], ["Main d'œuvre", "1h", "65,00€", "65,00€"]], paid: true },
    ],
  };
  const items = docs[tab] || [];
  const isDevis = tab === "devis";

  // Detail view
  if (selectedDoc) {
    const d = selectedDoc;
    return (
      <div className="screen-enter" style={{ background: "#F5FAF7" }}>
        <BackHeader title={isDevis ? "Détail du devis" : "Détail de la facture"} onBack={() => setSelectedDoc(null)}/>
        <div style={{ padding: "4px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#1B6B4E", fontWeight: 600 }}>{d.id}</span>
          <span style={{ padding: "4px 10px", borderRadius: 8, background: `${d.sColor}10`, color: d.sColor, fontSize: 11, fontWeight: 600 }}>{d.status}</span>
        </div>
        <div style={{ padding: "12px 16px 100px" }}>
          {/* Document */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: "20px 16px",
            boxShadow: "0 1px 8px rgba(10,22,40,0.04)", marginBottom: 14,
            border: "1px solid rgba(10,22,40,0.04)", position: "relative", overflow: "hidden",
          }}>
            {d.paid && (
              <div style={{
                position: "absolute", top: 28, right: -8, transform: "rotate(15deg)",
                border: "3px solid rgba(34,200,138,0.25)", borderRadius: 8,
                padding: "4px 16px", color: "rgba(34,200,138,0.35)",
                fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700,
              }}>PAYÉ ✓</div>
            )}

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #E8F5EE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {Icons.shield("#1B6B4E", 16)}
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700 }}>Nova</span>
              </div>
              <span style={{ fontSize: 10, color: "#8A95A3", fontWeight: 500 }}>{isDevis ? "DEVIS" : "FACTURE"}</span>
            </div>

            {/* Parties */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 11.5 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2, color: "#0A1628" }}>Jean-Michel Petit</div>
                <div style={{ color: "#7EA894" }}>JM Plomberie Pro</div>
                <div style={{ color: "#7EA894" }}>SIRET: 123 456 789 00012</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600, marginBottom: 2, color: "#0A1628" }}>{d.client}</div>
                <div style={{ color: "#7EA894" }}>{d.clientAddr}</div>
              </div>
            </div>

            {/* Date + validity */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 12, color: "#8A95A3" }}>
              <span>Date : {d.date}</span>
              {d.validity && <span>Validité : {d.validity}</span>}
            </div>

            {/* Lines table */}
            <div style={{ background: "#F5FAF7", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 0.5fr 1fr 1fr", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#7EA894" }}>
                <span>Désignation</span><span>Qté</span><span>P.U.</span><span style={{ textAlign: "right" }}>Total</span>
              </div>
              {d.lines.map(([desc, qty, pu, total], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 0.5fr 1fr 1fr", padding: "8px 10px", fontSize: 11.5, borderTop: "1px solid #F0F0F4" }}>
                  <span style={{ fontWeight: 500, color: "#0A1628" }}>{desc}</span>
                  <span style={{ color: "#8A95A3" }}>{qty}</span>
                  <span style={{ color: "#8A95A3" }}>{pu}</span>
                  <span style={{ textAlign: "right", fontWeight: 600, color: "#0A1628" }}>{total}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#7EA894" }}>Total HT : {d.ht}</div>
              <div style={{ fontSize: 11, color: "#7EA894" }}>TVA (10%) : {d.tva}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, marginTop: 6, color: "#0A1628" }}>{d.amount} TTC</div>
            </div>

            {/* Legal */}
            <div style={{ fontSize: 9, color: "#C4C9D4", lineHeight: 1.5, marginTop: 12, borderTop: "1px solid #E8F5EE", paddingTop: 10 }}>
              TVA non applicable, art. 293 B du CGI. {!isDevis && "Paiement reçu par Nova SAS, société de séquestre."} {isDevis && `Devis valable ${d.validity}. En acceptant ce devis, le client autorise Nova à bloquer le montant en séquestre.`}
            </div>
          </div>

          {/* Download PDF button */}
          <button className="btn-press btn-primary" style={{ width: "100%", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Icons.doc("#fff", 18)} Télécharger en PDF
          </button>

          {/* Share options */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button className="btn-press" style={{
              flex: 1, height: 48, borderRadius: 14,
              background: "#fff", border: "1px solid #D4EBE0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontSize: 13, fontWeight: 600, color: "#0A1628", cursor: "pointer",
            }}>
              {Icons.chat("#1B6B4E", 16)} Envoyer au client
            </button>
            <button className="btn-press" style={{
              flex: 1, height: 48, borderRadius: 14,
              background: "#fff", border: "1px solid #D4EBE0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontSize: 13, fontWeight: 600, color: "#0A1628", cursor: "pointer",
            }}>
              {Icons.doc("#1B6B4E", 16)} Dupliquer
            </button>
          </div>

          {/* Escrow status */}
          <div style={{
            background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "12px 14px",
            border: "1px solid rgba(27,107,78,0.08)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            {Icons.lock("#1B6B4E", 16)}
            <span style={{ fontSize: 12, color: "#14523B", lineHeight: 1.4 }}>
              {d.paid ? "Paiement validé par Nova et viré sur votre compte." : d.status === "Accepté" ? "Montant bloqué en séquestre Nova." : isDevis ? "Le client n'a pas encore accepté ce devis." : "En attente de validation par Nova."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Mes documents" onBack={goBack}/>
      <div style={{ padding: "8px 16px 100px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[{ id: "devis", label: "Devis" }, { id: "factures", label: "Factures" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "9px 0", borderRadius: 12,
              background: tab === t.id ? "#1B6B4E" : "#fff",
              color: tab === t.id ? "#fff" : "#4A5568",
              border: tab === t.id ? "none" : "1px solid #D4EBE0",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: tab === t.id ? "0 2px 10px rgba(27,107,78,0.2)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ fontSize: 13, color: "#8A95A3", marginBottom: 12 }}>
          {items.length} {isDevis ? "devis" : "facture" + (items.length > 1 ? "s" : "")}
        </div>

        {items.map((d, i) => (
          <div key={i} className="btn-press" onClick={() => setSelectedDoc(d)} style={{
            background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 8,
            border: "1px solid rgba(10,22,40,0.04)", cursor: "pointer",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: "#1B6B4E" }}>{d.id}</span>
              <span style={{ padding: "4px 10px", borderRadius: 8, background: `${d.sColor}10`, color: d.sColor, fontSize: 11, fontWeight: 600 }}>{d.status}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1628", marginBottom: 2 }}>{d.client}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#8A95A3" }}>{d.date}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700 }}>{d.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 24 : PRÉFÉRENCES DE NOTIFICATION ━━━ */
const Screen24 = ({ goTo, goBack }) => {
  const [prefs, setPrefs] = useState({
    newMission: true, devisAccepted: true, paymentReleased: true,
    urgentDemands: true, reminders: true, marketing: false, sms: false, email: true, push: true,
  });
  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const Toggle = ({ active, onToggle }) => (
    <button onClick={onToggle} style={{
      width: 48, height: 28, borderRadius: 14, border: "none", cursor: "pointer",
      background: active ? "#1B6B4E" : "#B0B0BB", position: "relative",
      transition: "background 200ms ease", flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: active ? 23 : 3,
        transition: "left 200ms ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}/>
    </button>
  );

  const Row = ({ label, sub, prefKey }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 0", borderBottom: "1px solid #E8F5EE",
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#0A1628" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#8A95A3", marginTop: 1 }}>{sub}</div>}
      </div>
      <Toggle active={prefs[prefKey]} onToggle={() => toggle(prefKey)}/>
    </div>
  );

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Notifications" onBack={goBack}/>
      <div style={{ padding: "8px 16px 100px" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "4px 16px", marginBottom: 14, border: "1px solid rgba(10,22,40,0.04)" }}>
          <div style={{ padding: "12px 0", borderBottom: "1px solid #E8F5EE", fontSize: 14, fontWeight: 700, color: "#0A1628" }}>Alertes</div>
          <Row label="Nouvelles missions" sub="Demandes de clients" prefKey="newMission"/>
          <Row label="Devis acceptés" sub="Quand un client accepte votre devis" prefKey="devisAccepted"/>
          <Row label="Paiements libérés" sub="Quand Nova valide un paiement" prefKey="paymentReleased"/>
          <Row label="Demandes urgentes" sub="Interventions d'urgence à proximité" prefKey="urgentDemands"/>
          <Row label="Rappels de RDV" sub="1h avant chaque intervention" prefKey="reminders"/>
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: "4px 16px", marginBottom: 14, border: "1px solid rgba(10,22,40,0.04)" }}>
          <div style={{ padding: "12px 0", borderBottom: "1px solid #E8F5EE", fontSize: 14, fontWeight: 700, color: "#0A1628" }}>Canaux</div>
          <Row label="Notifications push" prefKey="push"/>
          <Row label="Email" prefKey="email"/>
          <Row label="SMS" prefKey="sms"/>
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: "4px 16px", border: "1px solid rgba(10,22,40,0.04)" }}>
          <Row label="Actualités Nova" sub="Nouveautés et offres" prefKey="marketing"/>
        </div>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 25 : PARAMÈTRES + DARK MODE ━━━ */
const Screen25 = ({ goTo, goBack, darkMode, setDarkMode }) => {
  const Toggle = ({ active, onToggle }) => (
    <button onClick={onToggle} style={{
      width: 48, height: 28, borderRadius: 14, border: "none", cursor: "pointer",
      background: active ? "#1B6B4E" : "#B0B0BB", position: "relative",
      transition: "background 200ms ease", flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: active ? 23 : 3,
        transition: "left 200ms ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}/>
    </button>
  );

  const dm = darkMode;
  const bg = dm ? "#363640" : "#fff";
  const text1 = dm ? "#EEEEF0" : "#0A1628";
  const text2 = dm ? "#707080" : "#8A95A3";
  const border = dm ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.04)";
  const cardBg = dm ? "#363640" : "#fff";
  const pageBg = dm ? "#2C2C34" : "#F5FAF7";

  const MenuItem = ({ icon, label, sub, action, danger }) => (
    <div onClick={action} className={action ? "btn-press" : ""} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "14px 0",
      borderBottom: `1px solid ${border}`, cursor: action ? "pointer" : "default",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12,
        background: danger ? "rgba(232,48,42,0.06)" : dm ? "rgba(27,107,78,0.12)" : "rgba(27,107,78,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: danger ? "#E8302A" : text1 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: text2, marginTop: 1 }}>{sub}</div>}
      </div>
      {action && !danger && <span style={{ fontSize: 14, color: text2 }}>›</span>}
    </div>
  );

  return (
    <div className="screen-enter" style={{ background: pageBg }}>
      <BackHeader title="Paramètres" onBack={goBack}/>
      <div style={{ padding: "8px 16px 100px" }}>
        {/* Appearance */}
        <div style={{ background: cardBg, borderRadius: 20, padding: "4px 16px", marginBottom: 14, border: `1px solid ${border}` }}>
          <div style={{ padding: "12px 0", borderBottom: `1px solid ${border}`, fontSize: 14, fontWeight: 700, color: text1 }}>Apparence</div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 0", borderBottom: `1px solid ${border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: dm ? "rgba(27,107,78,0.12)" : "rgba(27,107,78,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>{dm ? "🌙" : "☀️"}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: text1 }}>Mode sombre</div>
                <div style={{ fontSize: 12, color: text2, marginTop: 1 }}>{dm ? "Activé" : "Désactivé"}</div>
              </div>
            </div>
            <Toggle active={dm} onToggle={() => setDarkMode(!dm)}/>
          </div>
        </div>

        {/* Security */}
        <div style={{ background: cardBg, borderRadius: 20, padding: "4px 16px", marginBottom: 14, border: `1px solid ${border}` }}>
          <div style={{ padding: "12px 0", borderBottom: `1px solid ${border}`, fontSize: 14, fontWeight: 700, color: text1 }}>Sécurité</div>
          <MenuItem icon={Icons.lock("#1B6B4E", 18)} label="Changer le mot de passe" action={() => {}}/>
          <MenuItem icon={Icons.shield("#1B6B4E", 18)} label="Authentification à deux facteurs" sub="Non activée" action={() => {}}/>
        </div>

        {/* Preferences */}
        <div style={{ background: cardBg, borderRadius: 20, padding: "4px 16px", marginBottom: 14, border: `1px solid ${border}` }}>
          <div style={{ padding: "12px 0", borderBottom: `1px solid ${border}`, fontSize: 14, fontWeight: 700, color: text1 }}>Préférences</div>
          <MenuItem icon={Icons.mapPin("#1B6B4E", 18)} label="Langue" sub="Français" action={() => {}}/>
          <MenuItem icon={Icons.clock("#1B6B4E", 16)} label="Fuseau horaire" sub="Europe/Paris (UTC+1)" action={() => {}}/>
        </div>

        {/* Legal */}
        <div style={{ background: cardBg, borderRadius: 20, padding: "4px 16px", marginBottom: 14, border: `1px solid ${border}` }}>
          <div style={{ padding: "12px 0", borderBottom: `1px solid ${border}`, fontSize: 14, fontWeight: 700, color: text1 }}>Légal</div>
          <MenuItem icon={Icons.doc("#1B6B4E", 18)} label="Conditions d'utilisation" action={() => {}}/>
          <MenuItem icon={Icons.doc("#1B6B4E", 18)} label="Politique de confidentialité" action={() => {}}/>
          <MenuItem icon={Icons.doc("#1B6B4E", 18)} label="Mentions légales" action={() => {}}/>
        </div>

        {/* Danger zone */}
        <div style={{ background: cardBg, borderRadius: 20, padding: "4px 16px", border: `1px solid ${border}` }}>
          <MenuItem icon={Icons.logout("#E8302A", 18)} label="Supprimer mon compte" danger action={() => {}}/>
        </div>

        <p style={{ fontSize: 11, color: text2, textAlign: "center", marginTop: 20 }}>
          Nova v1.0.0 • © 2026 Nova SAS
        </p>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 26 : CONTACTER LE SUPPORT ━━━ */
const Screen26 = ({ goTo, goBack }) => {
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour ! Je suis l'assistant Nova. Comment puis-je vous aider ?", time: "14:01" },
  ]);
  const [input, setInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const addAttachment = () => {
    const names = ["photo_fuite.jpg", "capture_ecran.png", "devis_scan.pdf", "facture.pdf", "photo_dégât.jpg"];
    const name = names[attachments.length % names.length];
    const size = (Math.random() * 3 + 0.5).toFixed(1);
    setAttachments(a => [...a, { name, size: `${size} Mo` }]);
  };

  const removeAttachment = (idx) => {
    setAttachments(a => a.filter((_, i) => i !== idx));
  };

  const sendMsg = () => {
    if (!input.trim() && attachments.length === 0) return;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMessages(m => [...m, {
      from: "user",
      text: input || null,
      attachments: attachments.length > 0 ? [...attachments] : null,
      time: now,
    }]);
    setInput("");
    setAttachments([]);
    setTimeout(() => {
      setMessages(m => [...m, {
        from: "bot",
        text: attachments.length > 0
          ? "Bien reçu, pièce(s) jointe(s) incluse(s). Un conseiller Nova va examiner votre demande. Temps de réponse moyen : 15 minutes."
          : "Merci pour votre message. Un conseiller Nova va prendre en charge votre demande. Temps de réponse moyen : 15 minutes.",
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 1200);
  };

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7", display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <BackHeader title="Support Nova" onBack={goBack}/>

      {/* Mode toggle */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ id: "chat", label: "Chat en direct" }, { id: "email", label: "Email" }].map(t => (
            <button key={t.id} onClick={() => setMode(t.id)} style={{
              flex: 1, padding: "9px 0", borderRadius: 12,
              background: mode === t.id ? "#1B6B4E" : "#fff",
              color: mode === t.id ? "#fff" : "#4A5568",
              border: mode === t.id ? "none" : "1px solid #D4EBE0",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: mode === t.id ? "0 2px 10px rgba(27,107,78,0.2)" : "none",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {mode === "chat" ? (
        <>
          {/* Chat messages */}
          <div style={{ flex: 1, padding: "0 16px", overflowY: "auto" }}>
            {/* Status */}
            <div style={{
              textAlign: "center", marginBottom: 16,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C88A" }}/>
              <span style={{ fontSize: 12, color: "#22C88A", fontWeight: 600 }}>Support en ligne</span>
              <span style={{ fontSize: 12, color: "#7EA894" }}>• Répond en ~15 min</span>
            </div>

            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}>
                <div style={{
                  maxWidth: "80%", padding: "12px 14px", borderRadius: 18,
                  background: msg.from === "user" ? "#1B6B4E" : "#fff",
                  color: msg.from === "user" ? "#fff" : "#0A1628",
                  border: msg.from === "user" ? "none" : "1px solid rgba(10,22,40,0.04)",
                  borderBottomRightRadius: msg.from === "user" ? 4 : 18,
                  borderBottomLeftRadius: msg.from === "user" ? 18 : 4,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}>
                  {msg.text && <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{msg.text}</div>}
                  {msg.attachments && msg.attachments.map((att, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      marginTop: msg.text ? 8 : 0,
                      padding: "8px 10px", borderRadius: 10,
                      background: msg.from === "user" ? "rgba(255,255,255,0.15)" : "#F5FAF7",
                    }}>
                      {Icons.doc(msg.from === "user" ? "#fff" : "#1B6B4E", 16)}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 12, fontWeight: 600,
                          color: msg.from === "user" ? "#fff" : "#0A1628",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{att.name}</div>
                        <div style={{
                          fontSize: 10,
                          color: msg.from === "user" ? "rgba(255,255,255,0.6)" : "#7EA894",
                        }}>{att.size}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{
                    fontSize: 10, marginTop: 4,
                    color: msg.from === "user" ? "rgba(255,255,255,0.6)" : "#7EA894",
                    textAlign: "right",
                  }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Attachment preview bar */}
          {attachments.length > 0 && (
            <div style={{
              padding: "8px 16px", background: "#fff",
              borderTop: "1px solid rgba(10,22,40,0.04)",
              display: "flex", gap: 6, overflowX: "auto",
            }}>
              {attachments.map((att, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 10px", borderRadius: 10,
                  background: "#F5FAF7", border: "1px solid #D4EBE0",
                  flexShrink: 0,
                }}>
                  {Icons.doc("#1B6B4E", 14)}
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#0A1628", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.name}</span>
                  <button onClick={() => removeAttachment(i)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, color: "#7EA894", padding: 0, lineHeight: 1,
                  }}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Chat input */}
          <div style={{
            padding: "10px 16px 24px",
            background: "#fff", borderTop: attachments.length > 0 ? "none" : "1px solid rgba(10,22,40,0.04)",
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <button onClick={addAttachment} className="btn-press" style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: "#F5FAF7", border: "1px solid #D4EBE0",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Votre message..."
              style={{
                flex: 1, height: 44, borderRadius: 14, border: "1px solid #D4EBE0",
                padding: "0 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                outline: "none", background: "#F5FAF7",
              }}
            />
            <button onClick={sendMsg} className="btn-press" style={{
              width: 44, height: 44, borderRadius: 14,
              background: "#1B6B4E", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(27,107,78,0.2)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </>
      ) : (
        /* Email form */
        <div style={{ padding: "0 16px 100px" }}>
          {emailSent ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
            }}>
              <div className="check-anim" style={{
                width: 70, height: 70, borderRadius: 22,
                background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(34,200,138,0.2)",
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path className="check-path" d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 800, margin: "0 0 6px" }}>Email envoyé !</h3>
              <p style={{ fontSize: 13, color: "#8A95A3", lineHeight: 1.5 }}>
                Notre équipe vous répondra sous 24h à l'adresse associée à votre compte.
              </p>
            </div>
          ) : (
            <>
              <div style={{
                background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "14px",
                border: "1px solid rgba(27,107,78,0.08)", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                {Icons.clock("#1B6B4E", 16)}
                <span style={{ fontSize: 12, color: "#14523B" }}>Réponse sous 24h ouvrées par email</span>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#8A95A3", display: "block", marginBottom: 5 }}>Sujet</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Problème de paiement", "Litige en cours", "Question technique", "Mon compte", "Autre"].map((s, i) => (
                    <button key={s} style={{
                      padding: "8px 14px", borderRadius: 10,
                      background: i === 0 ? "#1B6B4E" : "#fff",
                      color: i === 0 ? "#fff" : "#4A5568",
                      border: i === 0 ? "none" : "1px solid #D4EBE0",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#8A95A3", display: "block", marginBottom: 5 }}>Message</label>
                <textarea placeholder="Décrivez votre problème en détail..." style={{
                  width: "100%", height: 140, borderRadius: 16, border: "1px solid #D4EBE0",
                  padding: "14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  resize: "none", outline: "none", boxSizing: "border-box", background: "#fff",
                }}/>
              </div>

              <div style={{ marginBottom: 20 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  background: "rgba(27,107,78,0.04)", border: "1.5px dashed rgba(27,107,78,0.3)",
                  borderRadius: 14, padding: "12px 16px",
                  cursor: "pointer", fontSize: 13, color: "#1B6B4E", fontWeight: 600,
                }}>
                  {Icons.camera("#1B6B4E", 18)} Joindre une capture d'écran
                </button>
              </div>

              <button onClick={() => setEmailSent(true)} className="btn-press btn-primary" style={{ width: "100%" }}>
                Envoyer le message
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ━━━ DARK MODE ENFORCER ━━━ */
const DarkModeEnforcer = ({ active, screen }) => {
  useEffect(() => {
    const root = document.querySelector('.phone-inner');
    if (!root) return;

    const apply = () => {
      if (!active) return;
      root.querySelectorAll('*').forEach(el => {
        const s = el.style;
        if (!s || !s.cssText) return;
        const raw = s.cssText;

        // ━━ TEXT COLORS ━━
        // Primary dark text → white
        if (raw.includes("rgb(10, 22, 40)") || raw.includes("#0A1628"))
          s.setProperty('color', '#EEEEF0', 'important');
        // Secondary
        if (raw.includes("rgb(74, 85, 104)") || raw.includes("#4A5568"))
          s.setProperty('color', '#A0A0AC', 'important');
        // Tertiary / hints
        if (raw.includes("rgb(138, 149, 163)") || raw.includes("#8A95A3"))
          s.setProperty('color', '#8890A0', 'important');
        if (raw.includes("rgb(168, 155, 191)") || raw.includes("#7EA894"))
          s.setProperty('color', '#8890A0', 'important');
        if (raw.includes("rgb(176, 184, 196)") || raw.includes("#B0B8C4"))
          s.setProperty('color', '#707080', 'important');
        if (raw.includes("rgb(196, 201, 212)") || raw.includes("#C4C9D4"))
          s.setProperty('color', '#606070', 'important');
        if (raw.includes("rgb(200, 192, 219)") || raw.includes("#B0B0BB"))
          s.setProperty('color', '#606070', 'important');
        // Accent violet text
        if ((raw.includes("color") && raw.includes("rgb(91, 33, 182)")) || (raw.includes("color") && raw.includes("#14523B")))
          s.setProperty('color', '#8ECFB0', 'important');
        // Gold text
        if (raw.includes("color") && (raw.includes("rgb(176, 112, 0)") || raw.includes("#B07000")))
          s.setProperty('color', '#E0A840', 'important');
        // Green text
        if (raw.includes("color") && (raw.includes("rgb(13, 122, 82)") || raw.includes("#0D7A52")))
          s.setProperty('color', '#34D89A', 'important');

        // ━━ BACKGROUNDS ━━
        const bg = s.background || s.backgroundColor || "";
        // Pure white
        if (bg === "rgb(255, 255, 255)" || bg === "#fff" || bg === "#ffffff" || bg === "white")
          s.setProperty('background', '#363640', 'important');
        // Page bg
        if (bg === "rgb(248, 247, 252)" || bg === "#F5FAF7")
          s.setProperty('background', '#2C2C34', 'important');
        // Surface bg
        if (bg === "rgb(245, 243, 252)" || bg === "#E8F5EE")
          s.setProperty('background', '#32323C', 'important');
        // White rgba variants
        if (bg.includes("rgba(255, 255, 255"))
          s.setProperty('background', bg.replace(/rgba\(255,\s*255,\s*255,\s*[\d.]+\)/, (m) => {
            const a = parseFloat(m.match(/[\d.]+\)$/)[0]);
            return `rgba(58,58,66,${a})`;
          }), 'important');
        // Glass bg
        if (bg.includes("rgba(247, 248, 251"))
          s.setProperty('background', 'rgba(50,50,58,0.9)', 'important');
        // Accent subtle bgs
        if (bg.includes("rgba(27, 107, 78, 0.0"))
          s.setProperty('background', bg.replace(/rgba\(124,\s*58,\s*237,\s*0\.0\d+\)/, 'rgba(27,107,78,0.15)'), 'important');
        if (bg.includes("rgba(232, 48, 42, 0.0"))
          s.setProperty('background', bg.replace(/0\.0\d+\)/, '0.12)'), 'important');
        if (bg.includes("rgba(34, 200, 138, 0.0"))
          s.setProperty('background', bg.replace(/0\.0\d+\)/, '0.12)'), 'important');
        if (bg.includes("rgba(245, 166, 35, 0.0") || bg.includes("rgba(245, 166, 35, 0.1)"))
          s.setProperty('background', bg.replace(/0\.\d+\)/, '0.15)'), 'important');
        if (bg.includes("rgba(138, 149, 163, 0.0"))
          s.setProperty('background', bg.replace(/0\.0\d+\)/, '0.1)'), 'important');
        if (bg.includes("rgba(107, 33, 168, 0.0"))
          s.setProperty('background', bg.replace(/0\.0\d+\)/, '0.12)'), 'important');
        // Gradients with light colors
        if (bg.includes("gradient") && (bg.includes("243, 232, 255") || bg.includes("232, 213, 255") || bg.includes("235, 245, 255") || bg.includes("221, 227, 245")))
          s.setProperty('background', 'linear-gradient(135deg, #2A4A3C, #1E3E30)', 'important');
        if (bg.includes("gradient") && bg.includes("170deg") && (bg.includes("243, 232") || bg.includes("248, 247")))
          s.setProperty('background', 'linear-gradient(170deg, #32323C 0%, #2C2C34 100%)', 'important');
        if (bg.includes("gradient") && bg.includes("165deg") && bg.includes("245, 243"))
          s.setProperty('background', 'linear-gradient(165deg, #32323C 0%, #1E3E30 40%, #32323C 100%)', 'important');

        // ━━ BORDERS ━━
        const allBorders = [s.border, s.borderBottom, s.borderTop, s.borderLeft, s.borderRight].join(' ');
        if (allBorders.includes("233, 226, 245") || allBorders.includes("#D4EBE0")) {
          if (s.border) s.setProperty('border', s.border.replace(/rgb\(233,\s*226,\s*245\)|#D4EBE0/gi, 'rgba(255,255,255,0.08)'), 'important');
          if (s.borderBottom) s.setProperty('border-bottom', s.borderBottom.replace(/rgb\(233,\s*226,\s*245\)|#D4EBE0/gi, 'rgba(255,255,255,0.08)'), 'important');
          if (s.borderTop) s.setProperty('border-top', s.borderTop.replace(/rgb\(233,\s*226,\s*245\)|#D4EBE0/gi, 'rgba(255,255,255,0.08)'), 'important');
        }
        if (allBorders.includes("245, 243, 252") || allBorders.includes("#E8F5EE")) {
          if (s.border) s.setProperty('border', s.border.replace(/rgb\(245,\s*243,\s*252\)|#E8F5EE/gi, 'rgba(255,255,255,0.06)'), 'important');
          if (s.borderBottom) s.setProperty('border-bottom', s.borderBottom.replace(/rgb\(245,\s*243,\s*252\)|#E8F5EE/gi, 'rgba(255,255,255,0.06)'), 'important');
          if (s.borderTop) s.setProperty('border-top', s.borderTop.replace(/rgb\(245,\s*243,\s*252\)|#E8F5EE/gi, 'rgba(255,255,255,0.06)'), 'important');
        }
        if (allBorders.includes("10, 22, 40")) {
          if (s.border) s.setProperty('border', s.border.replace(/rgba\(10,\s*22,\s*40[^)]*\)/g, 'rgba(255,255,255,0.06)'), 'important');
          if (s.borderBottom) s.setProperty('border-bottom', s.borderBottom.replace(/rgba\(10,\s*22,\s*40[^)]*\)/g, 'rgba(255,255,255,0.06)'), 'important');
          if (s.borderTop) s.setProperty('border-top', s.borderTop.replace(/rgba\(10,\s*22,\s*40[^)]*\)/g, 'rgba(255,255,255,0.06)'), 'important');
        }
        if (s.borderColor && (s.borderColor.includes("233, 226") || s.borderColor.includes("10, 22, 40") || s.borderColor.includes("27, 107, 78, 0.0")))
          s.setProperty('border-color', 'rgba(255,255,255,0.06)', 'important');

        // ━━ BOX SHADOW ━━
        if (s.boxShadow && s.boxShadow.includes("10, 22, 40"))
          s.setProperty('box-shadow', '0 1px 6px rgba(0,0,0,0.2)', 'important');
      });
    };

    const t1 = setTimeout(apply, 20);
    const t2 = setTimeout(apply, 100);
    const t3 = setTimeout(apply, 300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active, screen]);

  return null;
};

/* ━━━ SCREEN 27 : MOYENS DE PAIEMENT ━━━ */
const Screen27 = ({ goTo, goBack }) => {
  const [defaultCard, setDefaultCard] = useState(0);
  const cards = [
    { id: 0, type: "Visa", last4: "6411", expiry: "09/28", holder: "Sophie Lefèvre", isDefault: true },
    { id: 1, type: "Mastercard", last4: "8923", expiry: "03/27", holder: "Sophie Lefèvre", isDefault: false },
  ];

  const CardIcon = ({ type }) => (
    <div style={{
      width: 48, height: 32, borderRadius: 8,
      background: type === "Visa" ? "linear-gradient(135deg, #1A1F71, #2D4AA8)" : "linear-gradient(135deg, #EB001B, #F79E1B)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 0.5,
    }}>{type === "Visa" ? "VISA" : "MC"}</div>
  );

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Moyens de paiement" onBack={goBack}/>
      <div style={{ padding: "12px 16px 100px" }}>

        {/* Saved cards */}
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0A1628", margin: "0 0 12px" }}>Cartes enregistrées</h4>
        {cards.map((card, i) => (
          <div key={card.id} onClick={() => setDefaultCard(card.id)} className="btn-press" style={{
            background: "#fff", borderRadius: 18, padding: "16px",
            marginBottom: 10, cursor: "pointer",
            border: defaultCard === card.id ? "2px solid #1B6B4E" : "1px solid rgba(10,22,40,0.04)",
            boxShadow: "0 1px 6px rgba(10,22,40,0.03)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <CardIcon type={card.type}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0A1628" }}>
                    {card.type} •••• {card.last4}
                  </span>
                  {defaultCard === card.id && (
                    <span style={{
                      padding: "2px 8px", borderRadius: 6,
                      background: "rgba(34,200,138,0.08)", color: "#22C88A",
                      fontSize: 10, fontWeight: 600,
                    }}>Par défaut</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#8A95A3" }}>
                  {card.holder} • Exp. {card.expiry}
                </div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                border: defaultCard === card.id ? "6px solid #1B6B4E" : "2px solid #B0B0BB",
                transition: "all 200ms ease",
              }}/>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button className="btn-press" style={{
          width: "100%", padding: "16px", borderRadius: 18,
          background: "none", border: "1.5px dashed rgba(27,107,78,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#1B6B4E",
          marginBottom: 20,
        }}>
          {Icons.plus("#1B6B4E", 18)} Ajouter une carte
        </button>

        {/* Other methods */}
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0A1628", margin: "0 0 12px" }}>Autres moyens</h4>

        <div style={{
          background: "#fff", borderRadius: 18, padding: "4px 16px",
          border: "1px solid rgba(10,22,40,0.04)",
          marginBottom: 20,
        }}>
          {[
            { label: "Apple Pay", sub: "Configuré", icon: "", active: true },
            { label: "Virement bancaire", sub: "RIB non renseigné", icon: "🏦", active: false },
          ].map((m, i) => (
            <div key={i} className="btn-press" style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 0",
              borderBottom: i < 1 ? "1px solid #E8F5EE" : "none",
              cursor: "pointer",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "#E8F5EE",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#0A1628" }}>{m.label}</div>
                <div style={{ fontSize: 12, color: m.active ? "#22C88A" : "#8A95A3", marginTop: 1 }}>{m.sub}</div>
              </div>
              <span style={{ fontSize: 14, color: "#B0B0BB" }}>›</span>
            </div>
          ))}
        </div>

        {/* Security info */}
        <div style={{
          background: "rgba(27,107,78,0.04)", borderRadius: 16, padding: "14px",
          border: "1px solid rgba(27,107,78,0.08)",
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          {Icons.lock("#1B6B4E", 16)}
          <span style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>
            Vos données bancaires sont chiffrées et sécurisées. Nova ne stocke pas vos numéros de carte complets.
          </span>
        </div>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 28 : SUIVI TEMPS RÉEL (CLIENT) ━━━ */
const Screen28 = ({ goTo, goBack }) => {
  const [trackingStep, setTrackingStep] = useState(1);
  const steps = [
    { label: "Devis accepté", desc: "Le paiement est bloqué en séquestre", time: "14:02", done: true },
    { label: "Artisan en route", desc: "Marc D. arrive dans ~15 min", time: "14:35", done: trackingStep >= 1 },
    { label: "Sur place", desc: "L'intervention a commencé", time: trackingStep >= 2 ? "14:52" : "—", done: trackingStep >= 2 },
    { label: "Intervention terminée", desc: "En attente de votre validation", time: trackingStep >= 3 ? "15:40" : "—", done: trackingStep >= 3 },
  ];

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <div style={{ background: "linear-gradient(170deg, #E8F5EE 0%, #F5FAF7 100%)", padding: "54px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={goBack} style={{ background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 12, padding: "7px 9px", cursor: "pointer" }}>{Icons.back("#1B6B4E", 20)}</button>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1628" }}>Suivi intervention</h2>
        </div>

        {/* Artisan card with ETA */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "0 2px 12px rgba(10,22,40,0.04)", border: "1px solid rgba(10,22,40,0.04)" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 18, background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#1B6B4E" }}>MD</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0A1628" }}>Marc Dupont</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Plombier • Fuite sous évier</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn-press" style={{ width: 40, height: 40, borderRadius: 12, background: "#E8F5EE", border: "1px solid #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{Icons.chat("#1B6B4E", 18)}</button>
              <button className="btn-press" style={{ width: 40, height: 40, borderRadius: 12, background: "#E8F5EE", border: "1px solid #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{Icons.phone("#1B6B4E", 18)}</button>
            </div>
          </div>

          {/* Live status */}
          {trackingStep === 1 && (
            <div style={{ background: "linear-gradient(135deg, #FFF8ED, #FFF3DC)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(245,166,35,0.15)" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F5A623", animation: "pulseRed 2s ease-in-out infinite" }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#92610A" }}>En route vers vous</div>
                <div style={{ fontSize: 11, color: "#B8860B" }}>Arrivée estimée dans ~15 min</div>
              </div>
              {Icons.navigation("#F5A623", 20)}
            </div>
          )}
          {trackingStep === 2 && (
            <div style={{ background: "#E8F5EE", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #D4EBE0" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C88A", animation: "pulseRed 2s ease-in-out infinite" }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#14523B" }}>Intervention en cours</div>
                <div style={{ fontSize: 11, color: "#1B6B4E" }}>Marc est sur place depuis 14:52</div>
              </div>
              {Icons.check("#22C88A", 20)}
            </div>
          )}
          {trackingStep >= 3 && (
            <div style={{ background: "#E8F5EE", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #D4EBE0" }}>
              {Icons.check("#22C88A", 20)}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#14523B" }}>Intervention terminée</div>
                <div style={{ fontSize: 11, color: "#1B6B4E" }}>En attente de votre validation</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "20px 16px 100px" }}>
        {/* Timeline */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1628", marginBottom: 16 }}>Progression</div>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.done ? "#1B6B4E" : "#E8F5EE", border: s.done ? "none" : "2px solid #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                {s.done ? Icons.check("#fff", 14) : <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, color: "#6B7280" }}>{i + 1}</span>}
              </div>
              {i < 3 && <div style={{ width: 2, height: 36, background: s.done ? "#1B6B4E" : "#D4EBE0", transition: "all 0.3s" }}/>}
            </div>
            <div style={{ paddingBottom: i < 3 ? 20 : 0, paddingTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 700, color: s.done ? "#1B6B4E" : "#0A1628" }}>{s.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#6B7280" }}>{s.time}</span>
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4 }}>{s.desc}</div>
            </div>
          </div>
        ))}

        {/* Séquestre info */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginTop: 20, border: "1px solid #D4EBE0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {Icons.lock("#1B6B4E", 16)}
            <span style={{ fontSize: 13, fontWeight: 700, color: "#14523B" }}>Paiement en séquestre</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Montant bloqué</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: "#1B6B4E" }}>320,00 €</span>
          </div>
          <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>Sera libéré après votre validation de l'intervention</div>
        </div>

        {/* Demo buttons to advance tracking */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {[
            { label: "→ Sur place", step: 2 },
            { label: "→ Terminé", step: 3 },
          ].filter(b => b.step > trackingStep).map(b => (
            <button key={b.step} onClick={() => setTrackingStep(b.step)} className="btn-press" style={{
              flex: 1, padding: "10px", borderRadius: 12,
              background: "#fff", border: "1px dashed #D4EBE0",
              fontSize: 11, color: "#6B7280", cursor: "pointer",
            }}>Démo : {b.label}</button>
          ))}
        </div>

        {/* Validate button when done */}
        {trackingStep >= 3 && (
          <button onClick={() => goTo(19)} className="btn-press btn-primary" style={{ width: "100%", marginTop: 16 }}>
            Valider l'intervention
          </button>
        )}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 29 : SIGNATURE ÉLECTRONIQUE DEVIS (CLIENT) ━━━ */
const Screen29 = ({ goTo, goBack }) => {
  const [signed, setSigned] = useState(false);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const startDraw = (e) => {
    setDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0A1628";
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const endDraw = () => setDrawing(false);
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  if (signed) {
    return (
      <div className="screen-enter" style={{ background: "#F5FAF7", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 30px rgba(34,200,138,0.25)" }}>
          {Icons.check("#fff", 36)}
        </div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1628", margin: "0 0 8px" }}>Devis signé !</h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: "0 0 24px" }}>Il ne reste plus qu'à bloquer le paiement en séquestre pour confirmer l'intervention.</p>
        <button onClick={() => goTo(4)} className="btn-press btn-primary" style={{ width: "100%" }}>
          Procéder au paiement — 320,00 €
        </button>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <div style={{ padding: "54px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={goBack} style={{ background: "rgba(27,107,78,0.08)", border: "none", borderRadius: 12, padding: "7px 9px", cursor: "pointer" }}>{Icons.back("#1B6B4E", 20)}</button>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1628" }}>Signer le devis</h2>
      </div>

      <div style={{ padding: "12px 16px 100px" }}>
        {/* Devis summary */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 20, marginBottom: 16, border: "1px solid rgba(10,22,40,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Devis #D-2026-089</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0A1628" }}>Réparation fuite sous évier</div>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: "#1B6B4E" }}>320 €</div>
          </div>
          {[{ l: "Remplacement siphon PVC", p: "45 €" }, { l: "Joint flexible inox", p: "25 €" }, { l: "Main d'œuvre (2h)", p: "180 €" }, { l: "Déplacement", p: "40 €" }, { l: "TVA (10%)", p: "30 €" }].map((line, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #E8F5EE", fontSize: 12, color: "#4A5568" }}>
              <span>{line.l}</span><span style={{ fontFamily: "'DM Mono', monospace", color: "#0A1628", fontWeight: 500 }}>{line.p}</span>
            </div>
          ))}
        </div>

        {/* Artisan info */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px", background: "#fff", borderRadius: 14, marginBottom: 16, border: "1px solid rgba(10,22,40,0.04)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#1B6B4E" }}>MD</div>
          <div><div style={{ fontSize: 14, fontWeight: 600, color: "#0A1628" }}>Marc Dupont</div><div style={{ fontSize: 11, color: "#6B7280" }}>Plombier • Certifié Nova #4521</div></div>
        </div>

        {/* Signature zone */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628", marginBottom: 10 }}>Votre signature</div>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <canvas ref={canvasRef} width={340} height={140}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
            style={{ width: "100%", height: 140, borderRadius: 16, border: "2px dashed #D4EBE0", background: "#fff", cursor: "crosshair", touchAction: "none" }} />
          {!hasDrawn && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 13, color: "#6B7280", pointerEvents: "none" }}>Signez ici avec votre doigt</div>}
          {hasDrawn && <button onClick={clearCanvas} style={{ position: "absolute", top: 8, right: 8, background: "rgba(232,48,42,0.1)", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 10, color: "#E8302A", fontWeight: 600, cursor: "pointer" }}>Effacer</button>}
        </div>

        <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5, marginBottom: 20 }}>
          En signant ce devis, vous acceptez les conditions de l'intervention et autorisez le blocage de 320,00 € en séquestre. Ce montant sera libéré à la validation de l'intervention.
        </div>

        <button onClick={() => setSigned(true)} disabled={!hasDrawn} className="btn-press" style={{
          width: "100%", height: 52, borderRadius: 16,
          background: hasDrawn ? "#0A4030" : "#D4EBE0", color: hasDrawn ? "#fff" : "#6B7280",
          border: "none", fontSize: 15, fontWeight: 600, cursor: hasDrawn ? "pointer" : "default",
          boxShadow: hasDrawn ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {Icons.lock(hasDrawn ? "#fff" : "#6B7280", 16)} Signer et bloquer le paiement
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 30 : PROGRAMME DE PARRAINAGE ━━━ */
const Screen30 = ({ goTo, goBack }) => {
  const [copied, setCopied] = useState(false);
  const code = "NOVA-SL25";
  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Inviter des proches" onBack={goBack}/>
      <div style={{ padding: "0 16px 100px" }}>
        {/* Hero reward */}
        <div style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)", borderRadius: 22, padding: "28px 20px", marginBottom: 20, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }}/>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎁</div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Gagnez 20€ par parrainage</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>Invitez un ami. Quand il réalise sa première intervention via Nova, vous recevez chacun 20€ de crédit.</div>
        </div>

        {/* Code */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 10 }}>Votre code de parrainage</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #D4EBE0", fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: "#1B6B4E", letterSpacing: 1 }}>{code}</div>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="btn-press" style={{ padding: "14px 18px", borderRadius: 14, background: copied ? "#22C88A" : "#1B6B4E", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 200ms ease", whiteSpace: "nowrap" }}>
            {copied ? "Copié ✓" : "Copier"}
          </button>
        </div>

        {/* Share buttons */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 10 }}>Partager via</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            { label: "WhatsApp", emoji: "💬", bg: "#25D366" },
            { label: "SMS", emoji: "📱", bg: "#4A5568" },
            { label: "Email", emoji: "✉️", bg: "#1B6B4E" },
            { label: "Lien", emoji: "🔗", bg: "#6B7280" },
          ].map(s => (
            <button key={s.label} className="btn-press" style={{ flex: 1, padding: "14px 8px", borderRadius: 14, background: s.bg, border: "none", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>{s.label}</div>
            </button>
          ))}
        </div>

        {/* How it works */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 12 }}>Comment ça marche</div>
        {[
          { step: "1", title: "Partagez votre code", desc: "Envoyez votre code à un ami par WhatsApp, SMS ou email" },
          { step: "2", title: "Votre ami s'inscrit", desc: "Il crée son compte Nova avec votre code" },
          { step: "3", title: "Première intervention", desc: "Quand il réalise sa première mission, vous gagnez tous les deux 20€" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: "#1B6B4E", flexShrink: 0 }}>{s.step}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          </div>
        ))}

        {/* Stats */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid rgba(10,22,40,0.04)", marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Vos parrainages</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ v: "3", l: "Invitations envoyées" }, { v: "1", l: "Ami inscrit" }, { v: "20€", l: "Crédit gagné" }].map((k, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 12, background: "#F5FAF7" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: "#1B6B4E" }}>{k.v}</div>
                <div style={{ fontSize: 9, color: "#6B7280", marginTop: 2 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 31 : CARNET CLIENTS (ARTISAN) ━━━ */
const Screen31 = ({ goTo, goBack }) => {
  const [search, setSearch] = useState("");
  const clients = [
    { id: 1, name: "Pierre Martin", initials: "PM", phone: "06 12 34 56 78", missions: 4, lastDate: "15 mars 2026", total: "1 280€" },
    { id: 2, name: "Sophie Lefèvre", initials: "SL", phone: "06 98 76 54 32", missions: 2, lastDate: "10 mars 2026", total: "475€" },
    { id: 3, name: "Caroline Durand", initials: "CD", phone: "06 45 67 89 01", missions: 1, lastDate: "2 mars 2026", total: "280€" },
    { id: 4, name: "Antoine Moreau", initials: "AM", phone: "06 23 45 67 89", missions: 3, lastDate: "22 fév 2026", total: "950€" },
    { id: 5, name: "Fatima Hassan", initials: "FH", phone: "06 78 90 12 34", missions: 1, lastDate: "18 fév 2026", total: "150€" },
  ];
  const filtered = search ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : clients;

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Mes clients" onBack={goBack}/>
      <div style={{ padding: "0 16px 100px" }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 14, padding: "10px 14px", border: "1px solid #D4EBE0", marginBottom: 16 }}>
          {Icons.search("#6B7280", 18)}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client..." style={{ border: "none", outline: "none", fontSize: 14, color: "#0A1628", flex: 1, fontFamily: "'DM Sans', sans-serif", background: "transparent" }}/>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[{ v: "5", l: "Clients" }, { v: "11", l: "Missions" }, { v: "3 135€", l: "CA total" }].map((k, i) => (
            <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(10,22,40,0.04)" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: "#1B6B4E" }}>{k.v}</div>
              <div style={{ fontSize: 9, color: "#6B7280" }}>{k.l}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{filtered.length} client{filtered.length > 1 ? "s" : ""}</div>

        {filtered.length === 0 && (
          <EmptyState icon={Icons.search("#1B6B4E", 32)} title="Aucun résultat" desc="Aucun client ne correspond à votre recherche." />
        )}

        {filtered.map(c => (
          <div key={c.id} className="btn-press" style={{
            background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 8,
            border: "1px solid rgba(10,22,40,0.04)", cursor: "pointer",
            display: "flex", gap: 14, alignItems: "center",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1B6B4E", flexShrink: 0 }}>{c.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0A1628", marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{c.missions} mission{c.missions > 1 ? "s" : ""} • Dernier : {c.lastDate}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{c.phone}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: "#1B6B4E" }}>{c.total}</div>
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                <button className="btn-press" style={{ width: 32, height: 32, borderRadius: 10, background: "#E8F5EE", border: "1px solid #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{Icons.phone("#1B6B4E", 14)}</button>
                <button className="btn-press" style={{ width: 32, height: 32, borderRadius: 10, background: "#E8F5EE", border: "1px solid #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{Icons.chat("#1B6B4E", 14)}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ━━━ SCREEN 32 : VIDÉO DIAGNOSTIC ━━━ */
const Screen32 = ({ goTo, goBack }) => {
  const [stage, setStage] = useState(0); // 0=intro, 1=recording, 2=review, 3=sent
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const startRecording = () => {
    setRecording(true);
    setStage(1);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };
  const stopRecording = () => {
    setRecording(false);
    clearInterval(timerRef.current);
    setStage(2);
  };
  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  // Intro
  if (stage === 0) {
    return (
      <div className="screen-enter" style={{ background: "#F5FAF7" }}>
        <BackHeader title="Vidéo diagnostic" onBack={goBack}/>
        <div style={{ padding: "0 16px 100px" }}>
          {/* Hero explanation */}
          <div style={{ textAlign: "center", padding: "24px 0 28px" }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none"><path d="M23 7l-7 5 7 5V7z" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="#1B6B4E" strokeWidth="1.5"/></svg>
            </div>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1628", margin: "0 0 8px" }}>Filmez votre problème</h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>L'artisan pourra évaluer la situation avant de se déplacer et préparer le matériel nécessaire.</p>
          </div>

          {/* Tips */}
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 12 }}>Conseils pour une bonne vidéo</div>
          {[
            { icon: "💡", title: "Bon éclairage", desc: "Allumez les lumières, évitez le contre-jour" },
            { icon: "📐", title: "Montrez la zone complète", desc: "Filmez large puis zoomez sur le problème" },
            { icon: "🎙️", title: "Décrivez à voix haute", desc: "Expliquez ce que vous voyez et depuis quand" },
            { icon: "⏱️", title: "30 à 60 secondes", desc: "Court et précis, pas besoin de plus" },
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", border: "1px solid #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{tip.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{tip.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{tip.desc}</div>
              </div>
            </div>
          ))}

          <button onClick={startRecording} className="btn-press" style={{
            width: "100%", height: 52, borderRadius: 16, marginTop: 16,
            background: "#E8302A", color: "#fff", border: "none",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Manrope', sans-serif",
            boxShadow: "0 4px 16px rgba(232,48,42,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff" }}/>
            Commencer l'enregistrement
          </button>
        </div>
      </div>
    );
  }

  // Recording
  if (stage === 1) {
    return (
      <div className="screen-enter" style={{ background: "#0A1628", minHeight: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Fake camera viewfinder */}
        <div style={{ flex: 1, background: "linear-gradient(170deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {/* Grid overlay */}
          <div style={{ position: "absolute", inset: 20, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }}>
            <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.08)" }}/>
            <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.08)" }}/>
            <div style={{ position: "absolute", left: "33%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }}/>
            <div style={{ position: "absolute", left: "66%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }}/>
          </div>

          {/* Center icon */}
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2 }}><path d="M23 7l-7 5 7 5V7z" stroke="#fff" strokeWidth="1.5"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="#fff" strokeWidth="1.5"/></svg>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>Aperçu caméra</div>
        </div>

        {/* Recording controls */}
        <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", padding: "20px 24px 36px" }}>
          {/* Timer + REC indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#E8302A", animation: "pulseRed 1.5s ease-in-out infinite" }}/>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 700, color: "#fff" }}>{formatTime(timer)}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#E8302A", fontWeight: 700, background: "rgba(232,48,42,0.2)", padding: "3px 8px", borderRadius: 6 }}>REC</span>
          </div>

          {/* Stop button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={stopRecording} className="btn-press" style={{
              width: 72, height: 72, borderRadius: "50%", border: "4px solid #fff",
              background: "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#E8302A" }}/>
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>Appuyez pour arrêter</div>
        </div>
      </div>
    );
  }

  // Review
  if (stage === 2) {
    return (
      <div className="screen-enter" style={{ background: "#F5FAF7" }}>
        <BackHeader title="Aperçu de la vidéo" onBack={() => setStage(0)}/>
        <div style={{ padding: "0 16px 100px" }}>
          {/* Video preview placeholder */}
          <div style={{
            background: "linear-gradient(170deg, #1a1a2e 0%, #0f3460 100%)", borderRadius: 20,
            height: 220, marginBottom: 16, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
          }}>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21 5 3" fill="rgba(255,255,255,0.8)"/></svg>
            <div style={{ position: "absolute", bottom: 12, right: 14, fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "3px 8px", borderRadius: 6 }}>{formatTime(timer)}</div>
          </div>

          {/* Video info */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid rgba(10,22,40,0.04)", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#6B7280" }}>Durée</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: "#0A1628" }}>{formatTime(timer)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#6B7280" }}>Taille estimée</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: "#0A1628" }}>{Math.max(1, Math.round(timer * 0.8))} Mo</span>
            </div>
          </div>

          {/* Note for artisan */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628", marginBottom: 8 }}>Note pour l'artisan (optionnel)</div>
          <textarea placeholder="Ex: la fuite est sous l'évier, côté gauche..." style={{
            width: "100%", height: 80, borderRadius: 14, border: "1px solid #D4EBE0",
            padding: "12px", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            resize: "none", outline: "none", boxSizing: "border-box",
            background: "#fff", marginBottom: 20,
          }}/>

          {/* Actions */}
          <button onClick={() => setStage(3)} className="btn-press" style={{
            width: "100%", height: 52, borderRadius: 16,
            background: "#1B6B4E", color: "#fff", border: "none",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Manrope', sans-serif",
            boxShadow: "0 4px 16px rgba(27,107,78,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Envoyer à l'artisan
          </button>
          <button onClick={() => setStage(0)} style={{
            width: "100%", height: 48, borderRadius: 14, marginTop: 8,
            background: "#fff", color: "#6B7280", border: "1px solid #D4EBE0",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Refaire la vidéo
          </button>
        </div>
      </div>
    );
  }

  // Sent confirmation
  return (
    <div className="screen-enter" style={{ background: "#F5FAF7", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 30px rgba(34,200,138,0.25)" }}>
        {Icons.check("#fff", 36)}
      </div>
      <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1628", margin: "0 0 8px" }}>Vidéo envoyée !</h2>
      <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: "0 0 12px", maxWidth: 280 }}>L'artisan va analyser votre vidéo et pourra préparer son intervention plus efficacement.</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#E8F5EE", padding: "10px 16px", borderRadius: 12, marginBottom: 28 }}>
        {Icons.clock("#1B6B4E", 16)}
        <span style={{ fontSize: 12, fontWeight: 600, color: "#14523B" }}>Réponse estimée sous 2h</span>
      </div>
      <button onClick={goBack} className="btn-press btn-primary" style={{ width: "100%" }}>Retour à la réservation</button>
    </div>
  );
};

/* ━━━ SCREEN 33 : CONTRAT ENTRETIEN ANNUEL (CLIENT) ━━━ */
const Screen33 = ({ goTo, goBack }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <div className="screen-enter" style={{ background: "#F5FAF7", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: "#22C88A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 30px rgba(34,200,138,0.25)" }}>
          {Icons.check("#fff", 36)}
        </div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1628", margin: "0 0 8px" }}>Contrat souscrit !</h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: "0 0 24px", maxWidth: 280 }}>Jean-Michel P. vous contactera pour planifier la première intervention d'entretien.</p>
        <button onClick={() => goTo(5)} className="btn-press btn-primary" style={{ width: "100%" }}>Voir mes missions</button>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Contrat d'entretien" onBack={goBack}/>
      <div style={{ padding: "0 16px 100px" }}>

        {/* Artisan */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", borderRadius: 16, padding: 14, marginBottom: 16, border: "1px solid rgba(10,22,40,0.04)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #E8F5EE, #E5E5EA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1B6B4E" }}>JM</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0A1628" }}>Jean-Michel P.</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Plombier-Chauffagiste • Certifié Nova</div>
          </div>
        </div>

        {/* Explanation */}
        <div style={{ background: "#E8F5EE", borderRadius: 16, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
          {Icons.shield("#1B6B4E", 20)}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#14523B", marginBottom: 2 }}>Entretien planifié, esprit tranquille</div>
            <div style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>Souscrivez un contrat annuel. L'artisan revient chaque année pour entretenir vos équipements. Paiement sécurisé par Nova.</div>
          </div>
        </div>

        {/* Plans */}
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0A1628", marginBottom: 12, fontFamily: "'Manrope', sans-serif" }}>Choisissez un contrat</div>
        {[
          { id: "chaudiere", icon: "🔥", name: "Entretien chaudière", desc: "Vérification annuelle obligatoire, nettoyage, contrôle sécurité, attestation d'entretien", price: "120", freq: "1 visite / an" },
          { id: "clim", icon: "❄️", name: "Entretien climatisation", desc: "Nettoyage filtres, vérification fluide, contrôle performance", price: "150", freq: "1 visite / an" },
          { id: "plomberie", icon: "🔧", name: "Check-up plomberie", desc: "Inspection canalisations, joints, robinetterie, détection fuites préventive", price: "90", freq: "1 visite / an" },
          { id: "complet", icon: "⭐", name: "Pack Sérénité", desc: "Chaudière + climatisation + plomberie. Intervention prioritaire et tarif réduit", price: "299", freq: "3 visites / an", popular: true },
        ].map(plan => (
          <div key={plan.id} onClick={() => setSelectedPlan(plan.id)} className="btn-press" style={{
            background: "#fff", borderRadius: 18, padding: "16px", marginBottom: 10,
            border: selectedPlan === plan.id ? "2px solid #1B6B4E" : "1px solid rgba(10,22,40,0.06)",
            cursor: "pointer", transition: "all 200ms ease", position: "relative",
            boxShadow: selectedPlan === plan.id ? "0 4px 16px rgba(27,107,78,0.1)" : "none",
          }}>
            {plan.popular && <div style={{ position: "absolute", top: -1, right: 16, background: "#F5A623", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 8px 8px" }}>POPULAIRE</div>}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: selectedPlan === plan.id ? "#E8F5EE" : "#F5FAF7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{plan.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0A1628" }}>{plan.name}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: "#1B6B4E" }}>{plan.price}€</span>
                    <span style={{ fontSize: 10, color: "#6B7280" }}>/an</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, marginBottom: 4 }}>{plan.desc}</div>
                <div style={{ fontSize: 11, color: "#1B6B4E", fontWeight: 600 }}>{plan.freq}</div>
              </div>
            </div>
            {selectedPlan === plan.id && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, paddingTop: 10, borderTop: "1px solid #E8F5EE" }}>
                {Icons.check("#1B6B4E", 14)}
                <span style={{ fontSize: 11, color: "#14523B", fontWeight: 500 }}>Paiement sécurisé par séquestre Nova</span>
              </div>
            )}
          </div>
        ))}

        {/* How it works */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628", marginTop: 16, marginBottom: 10 }}>Comment ça fonctionne</div>
        {[
          { n: "1", t: "Souscription", d: "Vous choisissez un contrat et payez en ligne" },
          { n: "2", t: "Planification", d: "L'artisan vous propose une date d'intervention" },
          { n: "3", t: "Intervention", d: "L'entretien est réalisé. Vous validez sur l'app" },
          { n: "4", t: "Renouvellement", d: "Rappel automatique l'année suivante" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: "#1B6B4E", flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0A1628" }}>{s.t}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{s.d}</div>
            </div>
          </div>
        ))}

        <button onClick={() => selectedPlan && setSubscribed(true)} disabled={!selectedPlan} className="btn-press" style={{
          width: "100%", height: 52, borderRadius: 16, marginTop: 16,
          background: selectedPlan ? "#0A4030" : "#D4EBE0", color: selectedPlan ? "#fff" : "#6B7280",
          border: "none", fontSize: 15, fontWeight: 700, cursor: selectedPlan ? "pointer" : "default",
          fontFamily: "'Manrope', sans-serif",
          boxShadow: selectedPlan ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {Icons.lock(selectedPlan ? "#fff" : "#6B7280", 16)} Souscrire le contrat
        </button>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 34 : QR CODE PROFIL (ARTISAN) ━━━ */
const Screen34 = ({ goTo, goBack }) => {
  const [saved, setSaved] = useState(false);

  // Generate SVG QR code pattern (simplified visual representation)
  const QRBlock = () => {
    const size = 200;
    const grid = 25;
    const cell = size / grid;
    // Deterministic pseudo-random pattern for demo
    const pattern = [];
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        // Position markers (3 corners)
        const isTopLeft = x < 7 && y < 7;
        const isTopRight = x >= grid - 7 && y < 7;
        const isBottomLeft = x < 7 && y >= grid - 7;
        const isMarkerOuter = (isTopLeft || isTopRight || isBottomLeft) && (x % 6 === 0 || y % 6 === 0 || x === (isTopRight ? grid-1 : 6) || y === (isBottomLeft ? grid-1 : 6));
        const isMarkerInner = (isTopLeft && x >= 2 && x <= 4 && y >= 2 && y <= 4) || (isTopRight && x >= grid-5 && x <= grid-3 && y >= 2 && y <= 4) || (isBottomLeft && x >= 2 && x <= 4 && y >= grid-5 && y <= grid-3);
        const isMarker = isMarkerOuter || isMarkerInner;
        // Data area: deterministic pattern
        const hash = ((x * 17 + y * 31 + 7) * 13) % 100;
        const isData = !isTopLeft && !isTopRight && !isBottomLeft && hash < 45;
        if (isMarker || isData) {
          pattern.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} rx={cell * 0.15} fill="#0A1628"/>);
        }
      }
    }
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#fff" rx={0}/>
        {pattern}
        {/* Center logo */}
        <rect x={size/2-16} y={size/2-16} width={32} height={32} rx={8} fill="#fff"/>
        <rect x={size/2-13} y={size/2-13} width={26} height={26} rx={6} fill="#1B6B4E"/>
        <path d="M{size/2-4} {size/2-2}l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${size/2-8},${size/2-6})`}/>
      </svg>
    );
  };

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Mon QR code" onBack={goBack}/>
      <div style={{ padding: "0 16px 100px" }}>

        {/* QR Card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "32px 24px", textAlign: "center", marginBottom: 20, boxShadow: "0 4px 24px rgba(10,22,40,0.06)", border: "1px solid rgba(10,22,40,0.04)" }}>
          {/* QR Code */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, display: "inline-block", marginBottom: 16, border: "1px solid #E8F5EE" }}>
            <QRBlock/>
          </div>

          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 800, color: "#0A1628", marginBottom: 2 }}>Jean-Michel Petit</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>Plombier-Chauffagiste</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8F5EE", borderRadius: 10, padding: "5px 12px" }}>
            {Icons.shield("#1B6B4E", 14)}
            <span style={{ fontSize: 11, fontWeight: 600, color: "#14523B" }}>Certifié Nova #2847</span>
          </div>

          <div style={{ marginTop: 16, padding: "10px 0", borderTop: "1px solid #E8F5EE" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6B7280" }}>nova.fr/p/jean-michel-petit-2847</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="btn-press" style={{
            flex: 1, padding: "14px", borderRadius: 14,
            background: saved ? "#22C88A" : "#1B6B4E", color: "#fff", border: "none",
            fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 200ms",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {saved ? Icons.check("#fff", 16) : Icons.camera("#fff", 16)}
            {saved ? "Enregistré !" : "Enregistrer l'image"}
          </button>
          <button className="btn-press" style={{
            flex: 1, padding: "14px", borderRadius: 14,
            background: "#fff", color: "#1B6B4E", border: "1px solid #D4EBE0",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#1B6B4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Partager
          </button>
        </div>

        {/* Usage tips */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 12 }}>Où utiliser votre QR code</div>
        {[
          { icon: "🚐", title: "Sur votre véhicule", desc: "Autocollant sur la portière ou le pare-brise arrière" },
          { icon: "💼", title: "Cartes de visite", desc: "Imprimez le QR code au dos de vos cartes" },
          { icon: "📄", title: "Devis et factures", desc: "Ajoutez-le en bas de vos documents papier" },
          { icon: "📧", title: "Signature email", desc: "Insérez le lien dans votre signature" },
          { icon: "📱", title: "Réseaux sociaux", desc: "Partagez-le sur votre profil pro" },
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", border: "1px solid #D4EBE0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{tip.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0A1628" }}>{tip.title}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{tip.desc}</div>
            </div>
          </div>
        ))}

        {/* Stats */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid rgba(10,22,40,0.04)", marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Statistiques de scan</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ v: "47", l: "Scans ce mois" }, { v: "12", l: "Nouveaux clients" }, { v: "3", l: "Missions générées" }].map((k, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 12, background: "#F5FAF7" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: "#1B6B4E" }}>{k.v}</div>
                <div style={{ fontSize: 9, color: "#6B7280", marginTop: 2 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ━━━ SCREEN 35 : INTÉGRATION COMPTABLE (ARTISAN) ━━━ */
const Screen35 = ({ goTo, goBack }) => {
  const [connected, setConnected] = useState({ pennylane: false, indy: false, quickbooks: false, tiime: false });
  const [autoExport, setAutoExport] = useState(true);
  const [showSuccess, setShowSuccess] = useState(null);

  const connect = (id) => {
    setConnected(c => ({ ...c, [id]: !c[id] }));
    if (!connected[id]) { setShowSuccess(id); setTimeout(() => setShowSuccess(null), 2000); }
  };

  return (
    <div className="screen-enter" style={{ background: "#F5FAF7" }}>
      <BackHeader title="Comptabilité" onBack={goBack}/>
      <div style={{ padding: "0 16px 100px" }}>

        {/* Header explainer */}
        <div style={{ background: "#E8F5EE", borderRadius: 16, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
          {Icons.doc("#1B6B4E", 20)}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#14523B", marginBottom: 2 }}>Simplifiez votre comptabilité</div>
            <div style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>Connectez votre logiciel comptable. Vos factures, paiements et commissions sont envoyés automatiquement.</div>
          </div>
        </div>

        {/* Connected services */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1628", marginBottom: 12 }}>Logiciels compatibles</div>
        {[
          { id: "pennylane", name: "Pennylane", desc: "Comptabilité tout-en-un pour TPE/PME", color: "#6366F1", letter: "P" },
          { id: "indy", name: "Indy", desc: "Comptabilité automatisée pour indépendants", color: "#3B82F6", letter: "I" },
          { id: "quickbooks", name: "QuickBooks", desc: "Comptabilité et facturation internationale", color: "#2CA01C", letter: "Q" },
          { id: "tiime", name: "Tiime", desc: "Comptabilité gratuite pour auto-entrepreneurs", color: "#0A1628", letter: "T" },
        ].map(s => (
          <div key={s.id} style={{
            background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 10,
            border: connected[s.id] ? "2px solid #1B6B4E" : "1px solid rgba(10,22,40,0.06)",
            transition: "all 200ms ease",
          }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{s.letter}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0A1628" }}>{s.name}</span>
                  {connected[s.id] && <span style={{ fontSize: 9, fontWeight: 700, color: "#22C88A", background: "rgba(34,200,138,0.1)", padding: "2px 8px", borderRadius: 6 }}>CONNECTÉ</span>}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{s.desc}</div>
              </div>
              <button onClick={() => connect(s.id)} className="btn-press" style={{
                padding: "8px 16px", borderRadius: 10,
                background: connected[s.id] ? "#fff" : "#1B6B4E",
                color: connected[s.id] ? "#E8302A" : "#fff",
                border: connected[s.id] ? "1px solid #D4EBE0" : "none",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                {showSuccess === s.id ? "✓ Connecté" : connected[s.id] ? "Déconnecter" : "Connecter"}
              </button>
            </div>

            {connected[s.id] && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E8F5EE", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#14523B" }}>Dernière synchronisation</div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Aujourd'hui à 14:32</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {Icons.check("#22C88A", 12)}
                  <span style={{ fontSize: 10, color: "#22C88A", fontWeight: 600 }}>À jour</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Auto-export toggle */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "16px", marginTop: 8, marginBottom: 20, border: "1px solid rgba(10,22,40,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0A1628" }}>Export automatique</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Envoyer automatiquement chaque nouvelle facture</div>
            </div>
            <div onClick={() => setAutoExport(!autoExport)} style={{
              width: 48, height: 28, borderRadius: 14, cursor: "pointer",
              background: autoExport ? "#1B6B4E" : "#D4EBE0",
              padding: 2, transition: "background 200ms ease",
              display: "flex", alignItems: "center",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                transform: autoExport ? "translateX(20px)" : "translateX(0)",
                transition: "transform 200ms ease",
              }}/>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628", marginBottom: 8 }}>Données synchronisées</div>
          {[
            { label: "Factures émises", desc: "Envoyées automatiquement à votre logiciel", active: true },
            { label: "Paiements reçus", desc: "Montants, dates et commissions Nova", active: true },
            { label: "Commissions Nova", desc: "Ligne de charge séparée pour la comptabilité", active: true },
            { label: "TVA collectée", desc: "Calcul automatique par taux applicable", active: true },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i ? "1px solid #E8F5EE" : "none" }}>
              {Icons.check(d.active ? "#22C88A" : "#D4EBE0", 14)}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0A1628" }}>{d.label}</div>
                <div style={{ fontSize: 10, color: "#6B7280" }}>{d.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Manual export */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1628", marginBottom: 10 }}>Export manuel</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Export CSV", icon: "📊", desc: "Toutes les données" },
            { label: "Export PDF", icon: "📄", desc: "Récapitulatif mensuel" },
          ].map((e, i) => (
            <button key={i} className="btn-press" style={{
              flex: 1, background: "#fff", borderRadius: 16, padding: "14px 12px",
              border: "1px solid #D4EBE0", cursor: "pointer", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{e.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{e.label}</div>
              <div style={{ fontSize: 10, color: "#6B7280" }}>{e.desc}</div>
            </button>
          ))}
        </div>

        {/* Monthly recap */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid rgba(10,22,40,0.04)" }}>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Récapitulatif mars 2026</div>
          {[
            { label: "Revenus bruts", value: "4 820,00 €", color: "#0A1628" },
            { label: "Commission Nova", value: "- 482,00 €", color: "#E8302A" },
            { label: "Revenus nets", value: "4 338,00 €", color: "#1B6B4E", bold: true },
            { label: "TVA collectée", value: "803,33 €", color: "#6B7280" },
            { label: "Nombre de factures", value: "12", color: "#6B7280" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: i ? "1px solid #E8F5EE" : "none" }}>
              <span style={{ fontSize: 12, color: "#6B7280" }}>{r.label}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: r.bold ? 15 : 12, fontWeight: r.bold ? 700 : 500, color: r.color }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Nova() {
  const [screen, setScreen] = useState(0);
  const [mode, setMode] = useState(null);
  const [prevScreen, setPrevScreen] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("plumber");
  const [darkMode, setDarkMode] = useState(false);

  const dm = darkMode;

  const goTo = (s) => { setPrevScreen(screen); setScreen(s); };
  const goBack = () => { setScreen(prevScreen); };
  const selectMode = (m) => { setMode(m); goTo(m === "client" ? 1 : 6); };
  const selectCategory = (catId) => { setSelectedCategory(catId); goTo(11); };

  const isClient = [1,2,3,4,5,11,12,13,15,17,18,19,20,28,29,30,32,33].includes(screen);
  const isArtisan = [6,7,8,9,10,14,16,21,22,23,24,25,31,34,35].includes(screen);
  const showNav = isClient || isArtisan || screen === 26 || screen === 27;

  // Compute active tab
  const getActiveTab = () => {
    if ([1,11,2,3,17,18].includes(screen)) return "home";
    if ([6,7,8,10,14,22].includes(screen)) return "dashboard";
    if ([12,21].includes(screen)) return "notifs";
    if ([5,4,13,19,20].includes(screen)) return "missions";
    if ([9].includes(screen)) return "payments";
    if ([15,26,27].includes(screen)) return "profile";
    if ([16,23,24,25,26,27].includes(screen)) return "profile";
    return "home";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #D4EBE0; font-family: 'DM Sans', sans-serif; }

        .phone-frame {
          width: 393px; min-height: 852px; max-height: 852px;
          margin: 20px auto; background: var(--bg-page);
          border-radius: 44px; overflow: hidden;
          position: relative;
          box-shadow:
            0 0 0 3px #d1d5db,
            0 0 0 5px #e5e7eb,
            0 20px 60px rgba(0,0,0,0.12),
            0 0 80px rgba(27,107,78,0.04);
        }
        .phone-inner {
          overflow-y: auto; overflow-x: hidden;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
        }
        .phone-inner::-webkit-scrollbar { display: none; }

        .notch {
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          width: 126px; height: 34px; background: #000;
          border-radius: 0 0 20px 20px; z-index: 999;
        }

        /* Glass morphism */
        .glass-header {
          background: rgba(247,248,251,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(10,22,40,0.04);
        }
        .glass-bar {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(10,22,40,0.05);
        }
        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 2px 16px rgba(10,22,40,0.06);
          border: 1px solid rgba(255,255,255,0.5);
        }

        .screen-enter {
          animation: screenIn 280ms cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes screenIn {
          from { opacity: 0.7; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .btn-press { transition: transform 150ms ease-out, box-shadow 150ms ease-out; }
        .btn-press:active { transform: scale(0.97) !important; }

        .btn-primary {
          height: 52px; border-radius: 16px;
          background: #0A4030; color: #fff; border: none;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          padding: 0 24px;
        }

        .pulse-red { animation: pulseRed 2s ease-in-out infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 4px 20px rgba(232,48,42,0.2); }
          50% { box-shadow: 0 4px 24px rgba(232,48,42,0.35); }
        }
        .pulse-icon { display: inline-block; animation: pulseBounce 2s ease-in-out infinite; }
        @keyframes pulseBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }

        .badge-shimmer { position: relative; overflow: hidden; }
        .badge-shimmer::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer { 0% { left: -100%; } 50%, 100% { left: 200%; } }

        .check-anim { animation: scaleIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        .check-path {
          stroke-dasharray: 30; stroke-dashoffset: 30;
          animation: drawCheck 600ms ease 300ms forwards;
        }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }

        .confetti-container { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 999; }
        .confetti { position: absolute; width: 8px; height: 8px; border-radius: 2px; animation: confettiFall 1.5s ease forwards; }
        ${Array(12).fill(0).map((_, i) => `.confetti-${i}{left:${10+Math.random()*80}%;top:30%;background:${["#1B6B4E","#E8302A","#22C88A","#F5A623","#14523B","#FF6B5B"][i%6]};animation-delay:${i*80}ms;animation-duration:${1+Math.random()}s;}`).join("")}
        @keyframes confettiFall { 0% { transform: translateY(0) rotate(0) scale(1); opacity: 1; } 100% { transform: translateY(200px) rotate(720deg) scale(0); opacity: 0; } }

        .envelope-fly { animation: envelopeFly 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @keyframes envelopeFly { 0% { transform: translateY(40px) scale(0.5); opacity: 0; } 60% { transform: translateY(-10px) scale(1.1); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }

        .fab-menu { animation: fabMenuIn 200ms ease both; }
        @keyframes fabMenuIn { from { opacity: 0; transform: translateY(10px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }

        input:focus, textarea:focus {
          border-color: #1B6B4E !important;
          box-shadow: 0 0 0 4px rgba(27,107,78,0.08);
        }

        /* ━━━ THEME VARIABLES ━━━ */
        .phone-frame {
          --bg-page: #F5FAF7;
          --bg-card: #ffffff;
          --bg-surface: #E8F5EE;
          --bg-input: #ffffff;
          --bg-hover: rgba(27,107,78,0.04);
          --text-primary: #0A1628;
          --text-secondary: #4A5568;
          --text-tertiary: #8A95A3;
          --text-hint: #7EA894;
          --border-light: rgba(10,22,40,0.04);
          --border-med: #D4EBE0;
          --border-input: #D4EBE0;
          --shadow-card: 0 1px 6px rgba(10,22,40,0.03);
          --gradient-avatar: linear-gradient(135deg, #E8F5EE, #E5E5EA);
          --accent-bg: rgba(27,107,78,0.04);
          --accent-border: rgba(27,107,78,0.08);
          --accent-text: #14523B;
        }
        .phone-frame.dark {
          --bg-page: #2C2C34;
          --bg-card: #363640;
          --bg-surface: #32323C;
          --bg-input: #363640;
          --bg-hover: rgba(27,107,78,0.1);
          --text-primary: #EEEEF0;
          --text-secondary: #A0A0AC;
          --text-tertiary: #707080;
          --text-hint: #606070;
          --border-light: rgba(255,255,255,0.06);
          --border-med: rgba(255,255,255,0.08);
          --border-input: rgba(255,255,255,0.1);
          --shadow-card: 0 1px 6px rgba(0,0,0,0.15);
          --gradient-avatar: linear-gradient(135deg, #2A4A3C, #1E3E30);
          --accent-bg: rgba(27,107,78,0.12);
          --accent-border: rgba(27,107,78,0.2);
          --accent-text: #8ECFB0;
        }
        .dark { background: var(--bg-page) !important; color: var(--text-primary); }
        .dark .glass-header {
          background: rgba(50,50,58,0.9) !important;
          border-bottom-color: rgba(255,255,255,0.06) !important;
        }
        .dark .glass-bar {
          background: rgba(58,58,66,0.92) !important;
          border-top-color: rgba(255,255,255,0.06) !important;
        }
        .dark .glass-card {
          background: rgba(58,58,66,0.88) !important;
          border-color: rgba(255,255,255,0.06) !important;
        }
        .dark input, .dark textarea {
          background: #363640 !important;
          color: #EEEEF0 !important;
          border-color: rgba(255,255,255,0.12) !important;
        }
        .dark input::placeholder, .dark textarea::placeholder { color: #555560 !important; }
        .dark .screen-enter { background: var(--bg-page) !important; }
        .dark.phone-frame {
          box-shadow: 0 0 0 3px #4a4a54, 0 0 0 5px #3a3a44,
            0 20px 60px rgba(0,0,0,0.4), 0 0 80px rgba(27,107,78,0.06) !important;
        }
        .dark .badge-shimmer { border-color: rgba(255,255,255,0.1) !important; }
      `}</style>

      <div className={`phone-frame ${dm ? "dark" : ""}`}>
        <DarkModeEnforcer active={dm} screen={screen}/>
        <div className="notch"/>
        <div style={{ display: "flex", flexDirection: "column", height: 852 }}>
          <div className="phone-inner" style={{ flex: 1, overflow: "auto" }}>
            {screen === 0 && <Screen0 onSelect={selectMode} dm={dm}/>}
            {screen === 1 && <Screen1 goTo={goTo} onSelectCategory={selectCategory}/>}
            {screen === 11 && <Screen11 goTo={goTo} goBack={() => goTo(1)} category={selectedCategory}/>}
            {screen === 2 && <Screen2 goTo={goTo} goBack={() => goTo(1)}/>}
            {screen === 3 && <Screen3 goTo={goTo} goBack={() => goTo(2)}/>}
            {screen === 4 && <Screen4 goTo={goTo} goBack={() => goTo(3)}/>}
            {screen === 5 && <Screen5 goTo={goTo}/>}
          {screen === 19 && <Screen19 goTo={goTo} goBack={() => goTo(5)}/>}
          {screen === 20 && <Screen20 goTo={goTo} goBack={() => goTo(19)}/>}
            {screen === 6 && <Screen6 goTo={goTo}/>}
            {screen === 7 && <Screen7 goTo={goTo} goBack={() => goTo(6)}/>}
            {screen === 8 && <Screen8 goTo={goTo} goBack={() => goTo(7)}/>}
            {screen === 9 && <Screen9 goTo={goTo} goBack={() => goTo(6)}/>}
            {screen === 10 && <Screen10 goTo={goTo} goBack={() => goTo(6)}/>}
            {screen === 12 && <Screen12 goTo={goTo} goBack={() => goTo(1)}/>}
            {screen === 13 && <Screen13 goTo={goTo} goBack={() => goTo(12)}/>}
            {screen === 14 && <Screen14 goTo={goTo} goBack={() => goTo(6)}/>}
            {screen === 15 && <Screen15 goTo={goTo} goBack={() => goTo(1)}/>}
            {screen === 16 && <Screen16 goTo={goTo} goBack={() => goTo(6)}/>}
          {screen === 17 && <Screen17 goTo={goTo} goBack={() => goTo(1)}/>}
          {screen === 18 && <Screen18 goTo={goTo} goBack={() => goTo(1)} onSelectCategory={selectCategory}/>}
          {screen === 21 && <Screen21 goTo={goTo}/>}
          {screen === 22 && <Screen22 goTo={goTo} goBack={() => goTo(6)}/>}
          {screen === 23 && <Screen23 goTo={goTo} goBack={() => goTo(16)}/>}
          {screen === 24 && <Screen24 goTo={goTo} goBack={() => goTo(prevScreen)}/>}
          {screen === 25 && <Screen25 goTo={goTo} goBack={() => goTo(prevScreen)} darkMode={darkMode} setDarkMode={setDarkMode}/>}
          {screen === 26 && <Screen26 goTo={goTo} goBack={() => goTo(prevScreen)}/>}
          {screen === 27 && <Screen27 goTo={goTo} goBack={() => goTo(prevScreen)}/>}
          {screen === 28 && <Screen28 goTo={goTo} goBack={() => goTo(5)}/>}
          {screen === 29 && <Screen29 goTo={goTo} goBack={() => goTo(8)}/>}
          {screen === 30 && <Screen30 goTo={goTo} goBack={() => goTo(prevScreen)}/>}
          {screen === 31 && <Screen31 goTo={goTo} goBack={() => goTo(6)}/>}
          {screen === 32 && <Screen32 goTo={goTo} goBack={() => goTo(3)}/>}
          {screen === 33 && <Screen33 goTo={goTo} goBack={() => goTo(2)}/>}
          {screen === 34 && <Screen34 goTo={goTo} goBack={() => goTo(16)}/>}
          {screen === 35 && <Screen35 goTo={goTo} goBack={() => goTo(16)}/>}
          </div>
          {showNav && screen !== 0 && (
            <BottomTabBar active={getActiveTab()} onNavigate={goTo} mode={(isArtisan || ([26,27].includes(screen) && mode === "artisan")) ? "artisan" : "client"}/>
          )}
        </div>
      </div>
    </>
  );
}
