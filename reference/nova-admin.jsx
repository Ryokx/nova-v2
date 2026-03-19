import { useState, useEffect, useRef, useCallback } from "react";

/* ━━━ GOOGLE FONTS ━━━ */
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

/* ━━━ DESIGN TOKENS ━━━ */
const T = {
  deepForest: "#0A4030",
  forest: "#1B6B4E",
  sage: "#2D9B6E",
  darkGreen: "#14523B",
  lightSage: "#8ECFB0",
  bgPage: "#F5FAF7",
  surfaceCard: "#E8F5EE",
  border: "#D4EBE0",
  white: "#ffffff",
  navy: "#0A1628",
  gray: "#4A5568",
  lightGray: "#8A95A3",
  sageGray: "#7EA894",
  red: "#E8302A",
  success: "#22C88A",
  gold: "#F5A623",
  orange: "#F5841F",
  sidebarBg: "#071E17",
  sidebarHover: "#0D2E22",
  sidebarActive: "#143D2D",
};

/* ━━━ INLINE ICONS ━━━ */
const I = {
  dashboard: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.7"/><rect x="14" y="3" width="7" height="4" rx="1.5" stroke={c} strokeWidth="1.7"/><rect x="14" y="11" width="7" height="10" rx="1.5" stroke={c} strokeWidth="1.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.7"/></svg>,
  chat: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={c} strokeWidth="1.7"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  doc: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={c} strokeWidth="1.7"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>,
  briefcase: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke={c} strokeWidth="1.7"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>,
  users: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3.5" stroke={c} strokeWidth="1.7"/><path d="M2 20c0-3.31 2.69-6 6-6h2c3.31 0 6 2.69 6 6" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><circle cx="18" cy="8" r="2.5" stroke={c} strokeWidth="1.7"/><path d="M19 14c2.21 0 4 1.79 4 4v2" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>,
  credit: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2.5" stroke={c} strokeWidth="1.7"/><path d="M2 10h20" stroke={c} strokeWidth="1.7"/></svg>,
  alert: (c="#E8302A",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={c} strokeWidth="1.7"/><path d="M12 9v4M12 17h.01" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  settings: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.7"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={c} strokeWidth="1.5"/></svg>,
  search: (c="#7EA894",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.8"/><path d="M16 16l5 5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  send: (c="#fff",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: (c="#22C88A",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x: (c="#E8302A",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  clock: (c="#F5A623",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.7"/><path d="M12 6v6l4 2" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>,
  chevDown: (c="#8A95A3",s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bell: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  eye: (c="#1B6B4E",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.5"/></svg>,
  download: (c="#1B6B4E",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  filter: (c="#7EA894",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  star: (c="#F5A623",s=16) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={c}/></svg>,
  logout: (c="#E8302A",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  attach: (c="#7EA894",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>,
  arrowUp: (c="#22C88A",s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowDown: (c="#E8302A",s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M19 12l-7 7-7-7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ━━━ MOCK DATA ━━━ */
const TICKETS = {
  clients: [
    { id: "TK-C-0041", name: "Sophie Martin", avatar: "SM", subject: "Artisan injoignable depuis 2 jours", category: "intervention", priority: "high", status: "open", date: "18/03/2026", time: "14:32", unread: 2, online: true, assignee: "Admin", mission: "MS-2026-0951", messages: [
      { from: "user", text: "Bonjour, j'ai un problème avec mon intervention de plomberie prévue demain.", time: "14:30", date: "18/03" },
      { from: "user", text: "L'artisan Paul Lefevre ne répond plus depuis 2 jours. J'ai essayé de l'appeler 4 fois. Est-ce normal ?", time: "14:32", date: "18/03" },
    ]},
    { id: "TK-C-0040", name: "Camille Bernard", avatar: "CB", subject: "Devis 3x plus élevé que l'estimation", category: "devis", priority: "medium", status: "open", date: "18/03/2026", time: "10:45", unread: 0, online: false, assignee: "Admin", mission: "MS-2026-0948", messages: [
      { from: "user", text: "Le devis me semble beaucoup trop élevé par rapport à ce qui était annoncé initialement.", time: "10:40", date: "18/03" },
      { from: "admin", text: "Je comprends votre préoccupation. Pouvez-vous me partager le numéro du devis pour que je puisse vérifier ?", time: "10:42", date: "18/03" },
      { from: "user", text: "DV-2024-1523. Le montant est passé de 400€ estimé à 1 200€. C'est 3 fois plus.", time: "10:45", date: "18/03" },
    ]},
    { id: "TK-C-0039", name: "Marie Lefèvre", avatar: "ML", subject: "Demande de remboursement partiel", category: "litige", priority: "low", status: "resolved", date: "17/03/2026", time: "12:15", unread: 0, online: true, assignee: "Admin", mission: "MS-2026-0949", messages: [
      { from: "user", text: "L'intervention de serrurerie a été faite mais la finition n'est pas propre. Je souhaite un remboursement partiel.", time: "11:45", date: "17/03" },
      { from: "admin", text: "J'ai examiné les photos. Je lance une demande de remboursement partiel de 150€.", time: "12:05", date: "17/03" },
      { from: "admin", text: "Le remboursement de 150€ a été effectué. Vous le recevrez sous 2-3 jours ouvrés.", time: "12:10", date: "17/03" },
      { from: "user", text: "Merci beaucoup pour votre réactivité !", time: "12:15", date: "17/03" },
    ]},
    { id: "TK-C-0038", name: "Thomas Girard", avatar: "TG", subject: "Problème d'accès à mon compte", category: "compte", priority: "low", status: "open", date: "17/03/2026", time: "09:20", unread: 1, online: false, assignee: null, mission: null, messages: [
      { from: "user", text: "Je n'arrive plus à me connecter depuis ce matin. Le mot de passe ne fonctionne plus.", time: "09:20", date: "17/03" },
    ]},
    { id: "TK-C-0037", name: "Emma Dubois", avatar: "ED", subject: "Annulation intervention maçonnerie", category: "intervention", priority: "medium", status: "in_progress", date: "16/03/2026", time: "16:30", unread: 0, online: true, assignee: "Admin", mission: "MS-2026-0946", messages: [
      { from: "user", text: "Je souhaite annuler mon intervention de maçonnerie. Comment ça se passe pour le remboursement du séquestre ?", time: "16:30", date: "16/03" },
      { from: "admin", text: "L'annulation est possible jusqu'à 48h avant sans frais. Le séquestre sera remboursé sous 3-5 jours ouvrés. Confirmez-vous ?", time: "16:45", date: "16/03" },
      { from: "user", text: "Oui je confirme. Merci.", time: "17:00", date: "16/03" },
      { from: "admin", text: "C'est noté. L'annulation est en cours. Vous recevrez un email de confirmation.", time: "17:05", date: "16/03" },
    ]},
  ],
  artisans: [
    { id: "TK-A-0028", name: "Jean-Michel Dupont", avatar: "JD", subject: "Paiement en attente depuis 5 jours", category: "paiement", priority: "high", status: "open", date: "18/03/2026", time: "13:48", unread: 1, online: false, assignee: "Admin", mission: "MS-2026-0950", metier: "Électricien", messages: [
      { from: "user", text: "Mon paiement pour la mission chez Thomas Girard est toujours en attente depuis 5 jours. La mission a été validée pourtant.", time: "13:45", date: "18/03" },
      { from: "user", text: "Pouvez-vous vérifier ? Mission #MS-2026-0950. J'ai besoin de cet argent pour mes fournisseurs.", time: "13:48", date: "18/03" },
    ]},
    { id: "TK-A-0027", name: "Pierre Moreau", avatar: "PM", subject: "Renouvellement attestation décennale", category: "documents", priority: "medium", status: "open", date: "18/03/2026", time: "11:30", unread: 1, online: true, assignee: null, mission: null, metier: "Maçon", messages: [
      { from: "user", text: "Mon attestation d'assurance décennale expire le mois prochain. Comment la mettre à jour ?", time: "11:30", date: "18/03" },
    ]},
    { id: "TK-A-0026", name: "Paul Lefevre", avatar: "PL", subject: "Client mécontent — besoin de médiation", category: "litige", priority: "high", status: "in_progress", date: "17/03/2026", time: "18:15", unread: 0, online: true, assignee: "Admin", mission: "MS-2026-0951", metier: "Plombier", messages: [
      { from: "user", text: "Mme Martin n'est pas satisfaite de mon intervention mais le travail a été réalisé conformément au devis signé.", time: "18:15", date: "17/03" },
      { from: "admin", text: "Merci de nous avoir contacté. Pouvez-vous envoyer des photos du travail et une copie du devis signé ?", time: "18:30", date: "17/03" },
      { from: "user", text: "Voici les photos et le devis. Tout est conforme à ce qui a été convenu.", time: "18:45", date: "17/03" },
      { from: "admin", text: "Bien reçu. Nous allons examiner et contacter la cliente. Retour sous 24h.", time: "19:00", date: "17/03" },
    ]},
    { id: "TK-A-0025", name: "Nicolas Martin", avatar: "NM", subject: "Question commission urgence", category: "facturation", priority: "low", status: "resolved", date: "16/03/2026", time: "10:00", unread: 0, online: false, assignee: "Admin", mission: null, metier: "Chauffagiste", messages: [
      { from: "user", text: "J'ai eu une intervention urgence hier soir. Quelle est la majoration exacte ?", time: "10:00", date: "16/03" },
      { from: "admin", text: "La majoration urgence (<2h) est de 15 à 25%. Soirée (18h-22h) : 20%. Nuit/week-end : 25%.", time: "10:15", date: "16/03" },
      { from: "user", text: "Merci pour la clarification.", time: "10:20", date: "16/03" },
    ]},
    { id: "TK-A-0024", name: "Ahmed Benali", avatar: "AB", subject: "Bug affichage planning", category: "technique", priority: "low", status: "open", date: "15/03/2026", time: "14:00", unread: 0, online: false, assignee: null, mission: null, metier: "Peintre", messages: [
      { from: "user", text: "Mon planning ne s'affiche plus correctement. Les créneaux de la semaine prochaine sont vides.", time: "14:00", date: "15/03" },
      { from: "admin", text: "Pouvez-vous envoyer une capture d'écran ? Quel téléphone utilisez-vous ?", time: "14:20", date: "15/03" },
      { from: "user", text: "iPhone 13, iOS 18. Je vous envoie la capture.", time: "14:30", date: "15/03" },
    ]},
  ],
};

const FRAUD_ALERTS = [
  { id: 1, type: "document", severity: "high", artisan: "Laurent Petit", siret: "842 567 123 00045", detail: "Attestation décennale — métadonnées PDF incohérentes (créé avec Photoshop, signature absente)", score: 18, date: "18/03/2026 09:15", status: "pending" },
  { id: 2, type: "payment", severity: "high", artisan: "François Garcia", siret: "912 345 678 00012", detail: "Tentative de double encaissement — Mission #MS-2024-0923 déjà payée le 14/03", score: null, date: "18/03/2026 08:42", status: "pending" },
  { id: 3, type: "document", severity: "medium", artisan: "Marc Dubois", siret: "756 890 234 00067", detail: "Certificat Qualibat — numéro de certificat introuvable dans l'annuaire officiel", score: 42, date: "17/03/2026 16:30", status: "investigating" },
  { id: 4, type: "payment", severity: "medium", artisan: "Romain Leroy", siret: "623 478 901 00034", detail: "IBAN modifié 3 fois en 7 jours — comportement suspect", score: null, date: "17/03/2026 14:20", status: "investigating" },
  { id: 5, type: "document", severity: "low", artisan: "Antoine Roux", siret: "534 012 789 00023", detail: "Attestation RGE — date expirée depuis 2 mois, artisan non notifié", score: 65, date: "17/03/2026 11:00", status: "resolved" },
  { id: 6, type: "identity", severity: "high", artisan: "Fake Account", siret: "000 000 000 00000", detail: "SIRET inexistant dans la base Sirene — tentative d'inscription frauduleuse", score: 5, date: "16/03/2026 22:10", status: "blocked" },
];

const INTERVENTIONS = [
  { id: "MS-2026-0951", client: "Sophie Martin", artisan: "Paul Lefevre", category: "Plomberie", status: "in_progress", date: "18/03/2026", amount: 380, escrow: "mission_ongoing", city: "Paris 15e" },
  { id: "MS-2026-0950", client: "Thomas Girard", artisan: "Jean-Michel Dupont", category: "Électricité", status: "pending_validation", date: "17/03/2026", amount: 650, escrow: "validating", city: "Lyon 3e" },
  { id: "MS-2026-0949", client: "Marie Lefèvre", artisan: "David Richard", category: "Serrurerie", status: "completed", date: "17/03/2026", amount: 210, escrow: "paid", city: "Marseille 6e" },
  { id: "MS-2026-0948", client: "Camille Bernard", artisan: "Nicolas Martin", category: "Chauffage", status: "disputed", date: "16/03/2026", amount: 1200, escrow: "blocked", city: "Paris 11e" },
  { id: "MS-2026-0947", client: "Lucas Petit", artisan: "Ahmed Benali", category: "Peinture", status: "completed", date: "16/03/2026", amount: 890, escrow: "paid", city: "Nantes" },
  { id: "MS-2026-0946", client: "Emma Dubois", artisan: "Pierre Moreau", category: "Maçonnerie", status: "pending", date: "15/03/2026", amount: 2400, escrow: "escrowed", city: "Bordeaux" },
  { id: "MS-2026-0945", client: "Julie Blanc", artisan: "Paul Lefevre", category: "Plomberie", status: "completed", date: "15/03/2026", amount: 175, escrow: "paid", city: "Paris 8e" },
  { id: "MS-2026-0944", client: "Hugo Moreau", artisan: "Nicolas Martin", category: "Chauffage", status: "cancelled", date: "14/03/2026", amount: 0, escrow: "refunded", city: "Toulouse" },
];

const ARTISANS_LIST = [
  { id: 1, name: "Paul Lefevre", metier: "Plombier", city: "Paris", rating: 4.8, missions: 47, verified: true, rge: true, decennale: "valid", status: "active", phone: "06 12 34 56 78", email: "paul.lefevre@pro.fr", siret: "842 123 456 00012", ape: "4322A", tva: "FR 82 842123456", assureur: "SMABTP", policeN: "POL-2024-88712", decennaleExpiry: "31/12/2026", qualibat: "QUA-2024-33109", rgeExpiry: "15/09/2026", inscriptionDate: "12/01/2025", ca30j: 4820, avgTicket: 384, tauxSatisfaction: 96, nbAvis: 42, recentMissions: ["MS-2026-0951", "MS-2026-0945"], avis: [
    { client: "Julie Blanc", note: 5, text: "Très professionnel, travail propre et rapide.", date: "15/03/2026" },
    { client: "Marc Dupuis", note: 5, text: "Intervention parfaite, je recommande.", date: "08/03/2026" },
    { client: "Claire Moreau", note: 4, text: "Bon travail, léger retard à l'arrivée.", date: "01/03/2026" },
  ]},
  { id: 2, name: "Jean-Michel Dupont", metier: "Électricien", city: "Lyon", rating: 4.6, missions: 32, verified: true, rge: false, decennale: "valid", status: "active", phone: "06 23 45 67 89", email: "jm.dupont@elec.fr", siret: "912 345 678 00012", ape: "4321A", tva: "FR 91 912345678", assureur: "AXA Pro", policeN: "POL-2023-45291", decennaleExpiry: "30/06/2026", qualibat: "QUA-2023-67812", rgeExpiry: null, inscriptionDate: "03/04/2025", ca30j: 3200, avgTicket: 431, tauxSatisfaction: 94, nbAvis: 28, recentMissions: ["MS-2026-0950"], avis: [
    { client: "Thomas Girard", note: 5, text: "Excellent travail sur le tableau électrique.", date: "17/03/2026" },
    { client: "Anne Petit", note: 4, text: "Compétent mais communication à améliorer.", date: "10/03/2026" },
  ]},
  { id: 3, name: "David Richard", metier: "Serrurier", city: "Marseille", rating: 4.9, missions: 61, verified: true, rge: false, decennale: "valid", status: "active", phone: "06 34 56 78 90", email: "d.richard@serru.fr", siret: "756 890 234 00023", ape: "4332A", tva: "FR 75 756890234", assureur: "MAAF Pro", policeN: "POL-2024-12098", decennaleExpiry: "31/03/2027", qualibat: null, rgeExpiry: null, inscriptionDate: "18/11/2024", ca30j: 6100, avgTicket: 289, tauxSatisfaction: 98, nbAvis: 55, recentMissions: ["MS-2026-0949"], avis: [
    { client: "Marie Lefèvre", note: 4, text: "Rapide mais finition à revoir.", date: "17/03/2026" },
    { client: "Luc Bernard", note: 5, text: "Intervention d'urgence en 30 min, parfait.", date: "12/03/2026" },
  ]},
  { id: 4, name: "Nicolas Martin", metier: "Chauffagiste", city: "Paris", rating: 4.3, missions: 28, verified: true, rge: true, decennale: "expiring", status: "active", phone: "06 45 67 89 01", email: "n.martin@chauff.fr", siret: "623 478 901 00034", ape: "4322B", tva: "FR 62 623478901", assureur: "Generali Pro", policeN: "POL-2023-78432", decennaleExpiry: "15/04/2026", qualibat: "QUA-2024-11290", rgeExpiry: "20/11/2026", inscriptionDate: "22/06/2025", ca30j: 2800, avgTicket: 605, tauxSatisfaction: 88, nbAvis: 22, recentMissions: ["MS-2026-0948"], avis: [
    { client: "Camille Bernard", note: 2, text: "Devis beaucoup trop élevé par rapport à l'estimation.", date: "16/03/2026" },
    { client: "Hugo Moreau", note: 5, text: "Chaudière remplacée efficacement.", date: "10/03/2026" },
  ]},
  { id: 5, name: "Ahmed Benali", metier: "Peintre", city: "Nantes", rating: 4.7, missions: 19, verified: true, rge: false, decennale: "valid", status: "active", phone: "06 56 78 90 12", email: "a.benali@paint.fr", siret: "534 012 789 00023", ape: "4334A", tva: "FR 53 534012789", assureur: "SMABTP", policeN: "POL-2025-02341", decennaleExpiry: "28/02/2027", qualibat: null, rgeExpiry: null, inscriptionDate: "10/09/2025", ca30j: 1780, avgTicket: 479, tauxSatisfaction: 95, nbAvis: 16, recentMissions: ["MS-2026-0947"], avis: [
    { client: "Lucas Petit", note: 5, text: "Travail soigné, couleurs parfaites.", date: "16/03/2026" },
  ]},
  { id: 6, name: "Pierre Moreau", metier: "Maçon", city: "Bordeaux", rating: 4.5, missions: 15, verified: false, rge: false, decennale: "pending", status: "pending_review", phone: "06 67 89 01 23", email: "p.moreau@macon.fr", siret: "623 478 901 00034", ape: "4399C", tva: "FR 62 623478901", assureur: "En attente", policeN: "—", decennaleExpiry: "—", qualibat: null, rgeExpiry: null, inscriptionDate: "05/03/2026", ca30j: 0, avgTicket: 0, tauxSatisfaction: 0, nbAvis: 0, recentMissions: ["MS-2026-0946"], avis: []},
  { id: 7, name: "Laurent Petit", metier: "Plombier", city: "Paris", rating: 0, missions: 0, verified: false, rge: false, decennale: "rejected", status: "suspended", phone: "06 78 90 12 34", email: "l.petit@plomb.fr", siret: "842 567 123 00045", ape: "4322A", tva: "—", assureur: "Document rejeté", policeN: "—", decennaleExpiry: "—", qualibat: null, rgeExpiry: null, inscriptionDate: "16/03/2026", ca30j: 0, avgTicket: 0, tauxSatisfaction: 0, nbAvis: 0, recentMissions: [], avis: []},
];

const STATS = {
  activeInterventions: 24,
  pendingValidation: 8,
  openTickets: 12,
  fraudAlerts: 4,
  revenue7d: 18420,
  revenueChange: 12.4,
  artisansActive: 156,
  clientsActive: 892,
  avgRating: 4.7,
  escrowBalance: 42680,
};

/* ━━━ UTILITY COMPONENTS ━━━ */
const Avatar = ({ initials, size = 40, bg }) => (
  <div style={{
    width: size, height: size, borderRadius: 10,
    background: bg || `linear-gradient(135deg, ${T.forest}, ${T.sage})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "DM Mono, monospace", fontWeight: 500, fontSize: size * 0.35,
    color: "#fff", flexShrink: 0,
  }}>{initials}</div>
);

const Badge = ({ children, color = T.forest, bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
    fontFamily: "DM Sans, sans-serif",
    color: color, background: bg || `${color}15`,
  }}>{children}</span>
);

const StatusBadge = ({ status }) => {
  const map = {
    in_progress: { label: "En cours", color: T.forest, bg: "#E8F5EE" },
    pending_validation: { label: "Validation", color: T.gold, bg: "#FFF8EC" },
    completed: { label: "Terminée", color: T.success, bg: "#E6F9F0" },
    disputed: { label: "Litige", color: T.red, bg: "#FDE8E8" },
    pending: { label: "En attente", color: T.lightGray, bg: "#F0F2F5" },
    cancelled: { label: "Annulée", color: T.lightGray, bg: "#F0F2F5" },
    active: { label: "Actif", color: T.success, bg: "#E6F9F0" },
    pending_review: { label: "En revue", color: T.gold, bg: "#FFF8EC" },
    suspended: { label: "Suspendu", color: T.red, bg: "#FDE8E8" },
  };
  const s = map[status] || map.pending;
  return <Badge color={s.color} bg={s.bg}>{s.label}</Badge>;
};

const EscrowBadge = ({ escrow }) => {
  const map = {
    escrowed: { label: "Bloqué", color: T.forest },
    mission_ongoing: { label: "Mission en cours", color: T.gold },
    validating: { label: "Nous validons", color: T.sage },
    paid: { label: "Artisan payé", color: T.success },
    blocked: { label: "Bloqué litige", color: T.red },
    refunded: { label: "Remboursé", color: T.lightGray },
  };
  const s = map[escrow] || map.escrowed;
  return <Badge color={s.color}>{s.label}</Badge>;
};

const SeverityDot = ({ severity }) => {
  const colors = { high: T.red, medium: T.orange, low: T.gold };
  return <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[severity] || T.lightGray, flexShrink: 0 }} />;
};

const KPICard = ({ label, value, sub, icon, trend, trendValue }) => (
  <div style={{
    background: T.white, borderRadius: 14, padding: "20px 22px",
    border: `1px solid ${T.border}`, flex: 1, minWidth: 180,
    transition: "box-shadow 0.2s",
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(10,64,48,0.08)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <span style={{ fontFamily: "DM Sans", fontSize: 13, color: T.gray, fontWeight: 500 }}>{label}</span>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: T.surfaceCard, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
    </div>
    <div style={{ fontFamily: "Manrope", fontSize: 28, fontWeight: 800, color: T.navy, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray, marginTop: 6 }}>{sub}</div>}
    {trend && (
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
        {trend === "up" ? I.arrowUp(T.success, 12) : I.arrowDown(T.red, 12)}
        <span style={{ fontFamily: "DM Mono", fontSize: 11, color: trend === "up" ? T.success : T.red, fontWeight: 500 }}>{trendValue}</span>
      </div>
    )}
  </div>
);

/* ━━━ PAGE: DASHBOARD ━━━ */
const DashboardPage = ({ setPage, role }) => {
  const isSupport = role === "support_clients" || role === "support_artisans";
  return (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <div>
      <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, color: T.navy, margin: 0 }}>Tableau de bord</h2>
      <p style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray, margin: "4px 0 0" }}>Vue d'ensemble en temps réel</p>
    </div>

    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <KPICard label="Interventions actives" value={STATS.activeInterventions} icon={I.briefcase(T.forest,18)} sub="dont 3 urgences" trend="up" trendValue="+8% cette semaine" />
      <KPICard label="En attente validation" value={STATS.pendingValidation} icon={I.clock(T.gold,18)} sub="délai moyen : 2.4h" />
      <KPICard label="Tickets ouverts" value={STATS.openTickets} icon={I.chat(T.forest,18)} sub="4 non lus" />
      {!isSupport && <KPICard label="Alertes fraude" value={STATS.fraudAlerts} icon={I.alert(T.red,18)} sub="2 critiques" />}
    </div>

    {!isSupport && (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPICard label="Revenus 7 jours" value={`${STATS.revenue7d.toLocaleString("fr-FR")} €`} icon={I.credit(T.forest,18)} trend="up" trendValue={`+${STATS.revenueChange}%`} />
        <KPICard label="Séquestre en cours" value={`${STATS.escrowBalance.toLocaleString("fr-FR")} €`} icon={I.shield(T.forest,18)} sub="18 missions" />
        <KPICard label="Artisans actifs" value={STATS.artisansActive} icon={I.users(T.forest,18)} trend="up" trendValue="+6 ce mois" />
        <KPICard label="Note moyenne" value={STATS.avgRating} icon={I.star(T.gold,16)} sub={`${STATS.clientsActive} clients actifs`} />
      </div>
    )}

    {isSupport && (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPICard label="Artisans actifs" value={STATS.artisansActive} icon={I.users(T.forest,18)} trend="up" trendValue="+6 ce mois" />
        <KPICard label="Clients actifs" value={STATS.clientsActive} icon={I.users(T.sage,18)} />
        <KPICard label="Note moyenne" value={STATS.avgRating} icon={I.star(T.gold,16)} sub="sur 5" />
      </div>
    )}

    {/* ━━━ AGENT PERFORMANCE STATS (support only) ━━━ */}
    {isSupport && (() => {
      const agentStats = {
        today: { resolved: 7, inProgress: 3, avgResponseMin: 12, satisfaction: 96 },
        week: { resolved: 34, inProgress: 5, avgResponseMin: 14, satisfaction: 94.2 },
        month: { resolved: 128, inProgress: 8, avgResponseMin: 16, satisfaction: 93.8 },
        byCategory: [
          { name: "Intervention", count: 42, pct: 33 },
          { name: "Litige", count: 31, pct: 24 },
          { name: "Paiement", count: 22, pct: 17 },
          { name: "Documents", count: 18, pct: 14 },
          { name: "Compte", count: 9, pct: 7 },
          { name: "Technique", count: 6, pct: 5 },
        ],
        recentActivity: [
          { ticket: "TK-C-0039", action: "Résolu", name: "Marie Lefèvre", time: "12:15", category: "Litige" },
          { ticket: "TK-A-0025", action: "Résolu", name: "Nicolas Martin", time: "10:20", category: "Facturation" },
          { ticket: "TK-C-0040", action: "Répondu", name: "Camille Bernard", time: "10:42", category: "Devis" },
          { ticket: "TK-A-0026", action: "Répondu", name: "Paul Lefevre", time: "19:00", category: "Litige" },
          { ticket: "TK-C-0037", action: "Répondu", name: "Emma Dubois", time: "17:05", category: "Intervention" },
        ],
        weeklyChart: [
          { day: "Lun", resolved: 8, received: 10 },
          { day: "Mar", resolved: 6, received: 7 },
          { day: "Mer", resolved: 9, received: 8 },
          { day: "Jeu", resolved: 4, received: 6 },
          { day: "Ven", resolved: 7, received: 5 },
        ],
      };
      const maxBar = Math.max(...agentStats.weeklyChart.map(d => Math.max(d.resolved, d.received)));
      const maxCat = Math.max(...agentStats.byCategory.map(c => c.count));

      return (<>
        {/* Agent KPIs */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <KPICard label="Tickets résolus aujourd'hui" value={agentStats.today.resolved} icon={I.check(T.success,18)} sub={`${agentStats.today.inProgress} en cours`} trend="up" trendValue="+2 vs hier" />
          <KPICard label="Résolus cette semaine" value={agentStats.week.resolved} icon={I.briefcase(T.forest,18)} sub={`${agentStats.week.inProgress} en cours`} trend="up" trendValue="+12% vs sem. dernière" />
          <KPICard label="Temps de réponse moy." value={`${agentStats.today.avgResponseMin} min`} icon={I.clock(T.gold,18)} sub="objectif : < 15 min" trend={agentStats.today.avgResponseMin <= 15 ? "up" : "down"} trendValue={agentStats.today.avgResponseMin <= 15 ? "Dans l'objectif" : "Au-dessus"} />
          <KPICard label="Satisfaction client" value={`${agentStats.today.satisfaction}%`} icon={I.star(T.gold,16)} sub="basé sur les retours" trend="up" trendValue="+1.8pts" />
        </div>

        {/* Two columns: Weekly chart + Category breakdown */}
        <div style={{ display: "flex", gap: 16 }}>
          {/* Weekly activity chart */}
          <div style={{ flex: 1, background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy }}>Activité de la semaine</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: T.forest }} /><span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray }}>Résolus</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: T.border }} /><span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray }}>Reçus</span></div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
              {agentStats.weeklyChart.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 110 }}>
                    <div style={{ width: 18, borderRadius: "4px 4px 2px 2px", height: `${(d.resolved / maxBar) * 100}px`, background: `linear-gradient(to top, ${T.deepForest}, ${T.sage})`, transition: "height 0.3s" }} />
                    <div style={{ width: 18, borderRadius: "4px 4px 2px 2px", height: `${(d.received / maxBar) * 100}px`, background: T.border, transition: "height 0.3s" }} />
                  </div>
                  <span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div style={{ flex: 1, background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: "20px 24px" }}>
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy, display: "block", marginBottom: 16 }}>Répartition par catégorie</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {agentStats.byCategory.map((c, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray }}>{c.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 600, color: T.navy }}>{c.count}</span>
                      <span style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray }}>{c.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: T.bgPage, overflow: "hidden" }}>
                    <div style={{ width: `${(c.count / maxCat) * 100}%`, height: "100%", borderRadius: 3, background: `linear-gradient(to right, ${T.forest}, ${T.sage})`, opacity: 1 - (i * 0.12), transition: "width 0.4s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly summary bar */}
        <div style={{ background: `linear-gradient(135deg, ${T.deepForest}, ${T.forest})`, borderRadius: 14, padding: "20px 26px", color: "#fff" }}>
          <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 14, display: "block", marginBottom: 14 }}>Bilan mensuel — Mars 2026</span>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Tickets traités", value: agentStats.month.resolved, sub: `${agentStats.month.inProgress} en cours` },
              { label: "Temps réponse moy.", value: `${agentStats.month.avgResponseMin} min`, sub: "objectif < 15 min" },
              { label: "Satisfaction", value: `${agentStats.month.satisfaction}%`, sub: "retours clients" },
              { label: "Taux de résolution", value: "94.1%", sub: "1er contact" },
              { label: "Escalades", value: "4", sub: "3.1% des tickets" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, opacity: 0.9, marginTop: 2 }}>{s.label}</div>
                <div style={{ fontFamily: "DM Mono", fontSize: 10, opacity: 0.45, marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity log */}
        <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy }}>Votre activité récente</span>
          </div>
          {agentStats.recentActivity.map((a, i) => (
            <div key={i} style={{ padding: "12px 22px", borderBottom: i < agentStats.recentActivity.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: a.action === "Résolu" ? `${T.success}12` : `${T.forest}12`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {a.action === "Résolu" ? I.check(T.success, 14) : I.send(T.forest, 14)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "DM Mono", fontSize: 11, color: T.forest, fontWeight: 500 }}>{a.ticket}</span>
                  <Badge color={a.action === "Résolu" ? T.success : T.forest} bg={a.action === "Résolu" ? "#E6F9F0" : "#E8F5EE"}>{a.action}</Badge>
                  <span style={{ fontFamily: "DM Sans", fontSize: 10, color: T.white, background: `${T.sage}CC`, borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>{a.category}</span>
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, marginTop: 2 }}>{a.name}</div>
              </div>
              <span style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray }}>{a.time}</span>
            </div>
          ))}
        </div>
      </>);
    })()}

    {/* Recent alerts - hidden for support */}
    {!isSupport && (
    <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy }}>Alertes récentes</span>
        <button onClick={() => setPage("fraud")} style={{ fontFamily: "DM Sans", fontSize: 13, color: T.forest, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Voir tout</button>
      </div>
      {FRAUD_ALERTS.filter(a => a.status !== "resolved" && a.status !== "blocked").slice(0, 3).map(a => (
        <div key={a.id} style={{ padding: "14px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 14 }}>
          <SeverityDot severity={a.severity} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{a.artisan}</div>
            <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.detail}</div>
          </div>
          <Badge color={a.type === "document" ? T.forest : a.type === "payment" ? T.gold : T.red}>
            {a.type === "document" ? "Document" : a.type === "payment" ? "Paiement" : "Identité"}
          </Badge>
          <span style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray, flexShrink: 0 }}>{a.date.split(" ")[1]}</span>
        </div>
      ))}
    </div>
    )}

    {/* Recent interventions - show amounts only for non-support, status only for support */}
    <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy }}>Dernières interventions</span>
        <button onClick={() => setPage("interventions")} style={{ fontFamily: "DM Sans", fontSize: 13, color: T.forest, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Voir tout</button>
      </div>
      {INTERVENTIONS.slice(0, 4).map(m => (
        <div key={m.id} style={{ padding: "14px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.forest, fontWeight: 500 }}>{m.id}</span>
              <StatusBadge status={m.status} />
            </div>
            <div style={{ fontFamily: "DM Sans", fontSize: 13, color: T.gray, marginTop: 4 }}>{m.client} → {m.artisan} · {m.category}</div>
          </div>
          <EscrowBadge escrow={m.escrow} />
          <span style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 600, color: T.navy, minWidth: 70, textAlign: "right" }}>{m.amount > 0 ? `${m.amount} €` : "—"}</span>
        </div>
      ))}
    </div>
  </div>
  );
};

/* ━━━ PAGE: TICKETING ━━━ */
const priorityConfig = { high: { label: "Urgent", color: T.red, bg: "#FDE8E8" }, medium: { label: "Moyen", color: T.orange, bg: "#FFF3E6" }, low: { label: "Faible", color: T.lightGray, bg: "#F0F2F5" } };
const ticketStatusConfig = { open: { label: "Ouvert", color: T.forest, bg: "#E8F5EE" }, in_progress: { label: "En cours", color: T.gold, bg: "#FFF8EC" }, resolved: { label: "Résolu", color: T.success, bg: "#E6F9F0" }, closed: { label: "Fermé", color: T.lightGray, bg: "#F0F2F5" } };
const categoryLabels = { intervention: "Intervention", devis: "Devis", litige: "Litige", compte: "Compte", paiement: "Paiement", documents: "Documents", facturation: "Facturation", technique: "Technique" };

const ChatPage = () => {
  const [section, setSection] = useState("clients");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [tickets, setTickets] = useState(TICKETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const msgEndRef = useRef(null);

  const currentList = tickets[section];
  const filtered = currentList.filter(t => {
    const matchSearch = !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selectedTicket = currentList.find(t => t.id === selectedTicketId);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedTicketId, tickets]);
  useEffect(() => { setSelectedTicketId(null); setSearchTerm(""); setStatusFilter("all"); }, [section]);

  const sendMsg = () => {
    if (!msgInput.trim() || !selectedTicket) return;
    const updated = { ...tickets };
    updated[section] = updated[section].map(t => t.id === selectedTicketId ? {
      ...t, messages: [...t.messages, { from: "admin", text: msgInput.trim(), time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) }],
      unread: 0, status: t.status === "open" ? "in_progress" : t.status,
    } : t);
    setTickets(updated);
    setMsgInput("");
  };

  const updateTicketStatus = (newStatus) => {
    const updated = { ...tickets };
    updated[section] = updated[section].map(t => t.id === selectedTicketId ? { ...t, status: newStatus } : t);
    setTickets(updated);
  };

  const clientCount = tickets.clients.filter(t => t.status !== "resolved" && t.status !== "closed").length;
  const artisanCount = tickets.artisans.filter(t => t.status !== "resolved" && t.status !== "closed").length;
  const clientUnread = tickets.clients.reduce((a, t) => a + t.unread, 0);
  const artisanUnread = tickets.artisans.reduce((a, t) => a + t.unread, 0);

  const isArtisan = section === "artisans";
  const accentGrad = isArtisan ? `linear-gradient(135deg, ${T.deepForest}, ${T.forest})` : `linear-gradient(135deg, ${T.sage}, ${T.lightSage})`;
  const accentLight = isArtisan ? T.deepForest : T.sage;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "calc(100vh - 110px)" }}>
      {/* Top section tabs + KPIs */}
      <div style={{ padding: "0 0 16px", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
        {/* Section toggle */}
        <div style={{ display: "flex", gap: 0, background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", width: "fit-content" }}>
          {[
            { key: "clients", label: "Clients", count: clientCount, unread: clientUnread, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
            { key: "artisans", label: "Artisans", count: artisanCount, unread: artisanUnread, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
          ].map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} style={{
              padding: "12px 28px", border: "none", cursor: "pointer",
              background: section === s.key ? (s.key === "clients" ? T.surfaceCard : `${T.deepForest}10`) : "transparent",
              display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
              borderBottom: section === s.key ? `2px solid ${s.key === "clients" ? T.sage : T.deepForest}` : "2px solid transparent",
              color: section === s.key ? (s.key === "clients" ? T.sage : T.deepForest) : T.gray,
            }}>
              {s.icon}
              <span style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: section === s.key ? 700 : 500 }}>{s.label}</span>
              <span style={{ fontFamily: "DM Mono", fontSize: 11, fontWeight: 600, background: section === s.key ? T.white : T.bgPage, color: section === s.key ? (s.key === "clients" ? T.sage : T.deepForest) : T.lightGray, borderRadius: 6, padding: "2px 8px" }}>{s.count}</span>
              {s.unread > 0 && <span style={{ background: T.red, color: "#fff", fontFamily: "DM Mono", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "2px 6px", minWidth: 16, textAlign: "center" }}>{s.unread}</span>}
            </button>
          ))}
        </div>

        {/* Quick stats row */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Ouverts", count: currentList.filter(t => t.status === "open").length, color: T.forest },
            { label: "En cours", count: currentList.filter(t => t.status === "in_progress").length, color: T.gold },
            { label: "Résolus", count: currentList.filter(t => t.status === "resolved").length, color: T.success },
            { label: "Non assignés", count: currentList.filter(t => !t.assignee).length, color: T.red },
          ].map((s, i) => (
            <div key={i} style={{ background: T.white, borderRadius: 10, padding: "10px 18px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
              <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray }}>{s.label}</span>
              <span style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: 800, color: T.navy }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main layout: ticket list + ticket detail/chat */}
      <div style={{ display: "flex", flex: 1, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, background: T.white, minHeight: 0 }}>

        {/* LEFT — Ticket list */}
        <div style={{ width: 380, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", background: T.white, flexShrink: 0 }}>
          {/* Search + filter */}
          <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.bgPage, borderRadius: 10, padding: "8px 12px" }}>
              {I.search()}
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher ticket, nom, sujet..." style={{ flex: 1, border: "none", background: "none", fontFamily: "DM Sans", fontSize: 13, color: T.navy, outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "open", "in_progress", "resolved"].map(f => (
                <button key={f} onClick={() => setStatusFilter(f)} style={{
                  padding: "4px 10px", borderRadius: 6, border: `1px solid ${statusFilter === f ? accentLight : T.border}`,
                  background: statusFilter === f ? `${accentLight}10` : "transparent",
                  fontFamily: "DM Sans", fontSize: 11, fontWeight: 500,
                  color: statusFilter === f ? accentLight : T.lightGray, cursor: "pointer",
                }}>{f === "all" ? "Tous" : (ticketStatusConfig[f]?.label || f)}</button>
              ))}
            </div>
          </div>

          {/* Ticket entries */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: "center", fontFamily: "DM Sans", fontSize: 13, color: T.lightGray }}>Aucun ticket trouvé</div>
            )}
            {filtered.map(t => {
              const active = selectedTicketId === t.id;
              const pc = priorityConfig[t.priority];
              const sc = ticketStatusConfig[t.status];
              return (
                <div key={t.id} onClick={() => setSelectedTicketId(t.id)}
                  style={{
                    padding: "14px 16px", cursor: "pointer",
                    background: active ? (isArtisan ? `${T.deepForest}08` : T.surfaceCard) : "transparent",
                    borderLeft: active ? `3px solid ${accentLight}` : "3px solid transparent",
                    borderBottom: `1px solid ${T.border}`, transition: "all 0.12s",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.bgPage; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  {/* Row 1: ID + Priority + Time */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: 11, color: accentLight, fontWeight: 600 }}>{t.id}</span>
                    <Badge color={pc.color} bg={pc.bg}>{pc.label}</Badge>
                    <Badge color={sc.color} bg={sc.bg}>{sc.label}</Badge>
                    <span style={{ marginLeft: "auto", fontFamily: "DM Mono", fontSize: 10, color: T.lightGray }}>{t.time}</span>
                    {t.unread > 0 && <span style={{ background: T.red, color: "#fff", fontFamily: "DM Mono", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "2px 6px" }}>{t.unread}</span>}
                  </div>
                  {/* Row 2: Avatar + Name + Subject */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ position: "relative" }}>
                      <Avatar initials={t.avatar} size={36} bg={accentGrad} />
                      {t.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: T.success, border: `2px solid ${T.white}` }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{t.name}{t.metier ? <span style={{ fontWeight: 400, color: T.lightGray }}> · {t.metier}</span> : null}</div>
                      <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.subject}</div>
                    </div>
                  </div>
                  {/* Row 3: Category + Mission + Assignee */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <span style={{ fontFamily: "DM Sans", fontSize: 10, color: T.white, background: `${accentLight}CC`, borderRadius: 4, padding: "2px 7px", fontWeight: 600 }}>{categoryLabels[t.category] || t.category}</span>
                    {t.mission && <span style={{ fontFamily: "DM Mono", fontSize: 10, color: T.forest, background: `${T.forest}10`, borderRadius: 4, padding: "2px 7px" }}>{t.mission}</span>}
                    {!t.assignee && <span style={{ fontFamily: "DM Sans", fontSize: 10, color: T.red, fontWeight: 600, marginLeft: "auto" }}>Non assigné</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Ticket detail + chat */}
        {!selectedTicket ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: T.surfaceCard, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {I.chat(T.border, 32)}
            </div>
            <span style={{ fontFamily: "DM Sans", fontSize: 15, color: T.lightGray, fontWeight: 500 }}>Sélectionnez un ticket</span>
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.border }}>{filtered.length} ticket{filtered.length > 1 ? "s" : ""} dans cette section</span>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {/* Ticket header */}
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, background: T.white, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <Avatar initials={selectedTicket.avatar} size={36} bg={accentGrad} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "DM Sans", fontWeight: 700, fontSize: 14, color: T.navy }}>{selectedTicket.name}</span>
                    {selectedTicket.metier && <Badge color={T.deepForest}>{selectedTicket.metier}</Badge>}
                    <span style={{ fontFamily: "DM Sans", fontSize: 12, color: selectedTicket.online ? T.success : T.lightGray }}>{selectedTicket.online ? "En ligne" : "Hors ligne"}</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray, marginTop: 2 }}>{selectedTicket.id} · Ouvert le {selectedTicket.date}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, color: T.forest, cursor: "pointer" }}>Voir profil</button>
                  {selectedTicket.mission && <button style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Mono", fontSize: 11, fontWeight: 500, color: T.forest, cursor: "pointer" }}>{selectedTicket.mission}</button>}
                </div>
              </div>
              {/* Ticket meta bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: T.bgPage, borderRadius: 10 }}>
                <span style={{ fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.navy, flex: 1 }}>{selectedTicket.subject}</span>
                <Badge color={priorityConfig[selectedTicket.priority].color} bg={priorityConfig[selectedTicket.priority].bg}>{priorityConfig[selectedTicket.priority].label}</Badge>
                <Badge color={ticketStatusConfig[selectedTicket.status].color} bg={ticketStatusConfig[selectedTicket.status].bg}>{ticketStatusConfig[selectedTicket.status].label}</Badge>
                <span style={{ fontFamily: "DM Sans", fontSize: 10, color: T.white, background: `${accentLight}CC`, borderRadius: 4, padding: "2px 7px", fontWeight: 600 }}>{categoryLabels[selectedTicket.category]}</span>
              </div>
              {/* Quick actions */}
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {selectedTicket.status !== "resolved" && (
                  <button onClick={() => updateTicketStatus("resolved")} style={{ padding: "5px 12px", borderRadius: 7, border: "none", background: T.success, color: "#fff", fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    {I.check("#fff", 12)} Résoudre
                  </button>
                )}
                {selectedTicket.status === "resolved" && (
                  <button onClick={() => updateTicketStatus("open")} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${T.border}`, background: T.white, color: T.forest, fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Réouvrir</button>
                )}
                {selectedTicket.status === "open" && (
                  <button onClick={() => updateTicketStatus("in_progress")} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${T.gold}40`, background: `${T.gold}10`, color: T.gold, fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Prendre en charge</button>
                )}
                {!selectedTicket.assignee && (
                  <button style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${T.border}`, background: T.white, color: T.navy, fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>M'assigner</button>
                )}
                <button style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${T.border}`, background: T.white, color: T.gray, fontFamily: "DM Sans", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>Transférer</button>
                {selectedTicket.priority !== "high" && (
                  <button style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${T.red}30`, background: `${T.red}08`, color: T.red, fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Escalader</button>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10, background: T.bgPage, minHeight: 0 }}>
              {selectedTicket.messages.map((m, i) => {
                const showDateSep = i === 0 || m.date !== selectedTicket.messages[i - 1].date;
                return (
                  <div key={i}>
                    {showDateSep && (
                      <div style={{ textAlign: "center", margin: "8px 0 12px" }}>
                        <span style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray, background: T.white, padding: "3px 12px", borderRadius: 10, border: `1px solid ${T.border}` }}>{m.date}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: m.from === "admin" ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "65%", padding: "10px 16px", borderRadius: 14,
                        background: m.from === "admin" ? T.deepForest : T.white,
                        color: m.from === "admin" ? "#fff" : T.navy,
                        border: m.from === "admin" ? "none" : `1px solid ${T.border}`,
                        fontFamily: "DM Sans", fontSize: 13, lineHeight: 1.55,
                        borderBottomRightRadius: m.from === "admin" ? 4 : 14,
                        borderBottomLeftRadius: m.from === "admin" ? 14 : 4,
                      }}>
                        {m.from === "admin" && <div style={{ fontFamily: "DM Sans", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Vous</div>}
                        {m.text}
                        <div style={{ fontFamily: "DM Mono", fontSize: 10, marginTop: 6, color: m.from === "admin" ? "rgba(255,255,255,0.4)" : T.lightGray, textAlign: m.from === "admin" ? "right" : "left" }}>{m.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={msgEndRef} />
            </div>

            {/* Input bar */}
            {selectedTicket.status !== "resolved" && selectedTicket.status !== "closed" ? (
              <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, background: T.white, display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                <button style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${T.border}`, background: T.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{I.attach()}</button>
                <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Répondre au ticket..." style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: `1px solid ${T.border}`, fontFamily: "DM Sans", fontSize: 13, color: T.navy, outline: "none", background: T.bgPage }} />
                <button onClick={sendMsg} style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: msgInput.trim() ? T.deepForest : T.border, cursor: msgInput.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", flexShrink: 0 }}>
                  {I.send(msgInput.trim() ? "#fff" : T.lightGray)}
                </button>
              </div>
            ) : (
              <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, background: T.bgPage, textAlign: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.success, fontWeight: 600 }}>{I.check(T.success, 14)} Ticket résolu</span>
                <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, marginLeft: 8 }}>— Réouvrir pour reprendre la conversation</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ━━━ PAGE: FRAUD ALERTS ━━━ */
const FraudPage = () => {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [alerts, setAlerts] = useState(FRAUD_ALERTS);
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const executeAction = () => {
    if (!confirmAction) return;
    const { id, action } = confirmAction;
    const alert = alerts.find(a => a.id === id);
    const newStatus = action === "block" ? "blocked" : action === "investigate" ? "investigating" : "resolved";
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: newStatus } : a));
    const messages = {
      block: `${alert.artisan} a été bloqué. Son compte est suspendu et ses missions en cours sont gelées.`,
      investigate: `Investigation ouverte pour ${alert.artisan}. L'alerte est en cours d'analyse approfondie.`,
      resolve: `Alerte pour ${alert.artisan} marquée comme résolue.`,
    };
    const types = { block: "error", investigate: "warning", resolve: "success" };
    showToast(messages[action], types[action]);
    setConfirmAction(null);
  };

  const filtered = alerts.filter(a => filter === "all" || a.type === filter);
  const critiques = alerts.filter(a => a.severity === "high" && a.status === "pending").length;
  const investigating = alerts.filter(a => a.status === "investigating").length;
  const resolved = alerts.filter(a => a.status === "resolved" || a.status === "blocked").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 32, zIndex: 9999,
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 22px", borderRadius: 12,
          background: toast.type === "success" ? T.deepForest : toast.type === "error" ? T.red : T.gold,
          color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)", maxWidth: 480,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {toast.type === "success" ? I.check("#fff", 16) : toast.type === "error" ? I.x("#fff", 16) : I.clock("#fff", 16)}
          </div>
          <span style={{ flex: 1 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>x</button>
        </div>
      )}

      {/* Confirm modal */}
      {confirmAction && (() => {
        const alert = alerts.find(a => a.id === confirmAction.id);
        const cfg = {
          block: { title: "Bloquer cet artisan ?", desc: `Le compte de ${alert?.artisan} sera immédiatement suspendu. Ses missions en cours seront gelées et les fonds séquestrés maintenus.`, color: T.red, btn: "Confirmer le blocage", icon: I.x("#fff", 18) },
          investigate: { title: "Ouvrir une investigation ?", desc: `L'alerte pour ${alert?.artisan} sera placée en investigation. Vous pourrez continuer l'analyse avant de prendre une décision.`, color: T.gold, btn: "Ouvrir l'investigation", icon: I.search("#fff", 18) },
          resolve: { title: "Marquer comme résolu ?", desc: `L'alerte pour ${alert?.artisan} sera classée. Aucune action supplémentaire ne sera prise.`, color: T.success, btn: "Confirmer la résolution", icon: I.check("#fff", 18) },
        }[confirmAction.action];
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.45)", backdropFilter: "blur(4px)" }} onClick={() => setConfirmAction(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 16, padding: "28px 32px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cfg.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cfg.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 16, color: T.navy }}>{cfg.title}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, marginTop: 2 }}>{alert?.artisan} · SIRET {alert?.siret}</div>
                </div>
              </div>
              <div style={{ background: T.bgPage, borderRadius: 10, padding: "12px 16px", marginBottom: 8, fontFamily: "DM Sans", fontSize: 12, color: T.gray, lineHeight: 1.5 }}>
                {cfg.desc}
              </div>
              <div style={{ background: `${cfg.color}08`, borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontFamily: "DM Sans", fontSize: 12, color: cfg.color, lineHeight: 1.5 }}>
                Alerte : {alert?.detail}
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmAction(null)} style={{ padding: "9px 20px", borderRadius: 9, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.gray, cursor: "pointer" }}>Annuler</button>
                <button onClick={executeAction} style={{ padding: "9px 24px", borderRadius: 9, border: "none", background: cfg.color, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{cfg.btn}</button>
              </div>
            </div>
          </div>
        );
      })()}

      <div>
        <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, color: T.navy, margin: 0 }}>Alertes de fraude</h2>
        <p style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray, margin: "4px 0 0" }}>Détection IA + vérifications manuelles</p>
      </div>

      {/* Summary cards - live counts */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          { label: "Critiques", count: critiques, color: T.red },
          { label: "En investigation", count: investigating, color: T.orange },
          { label: "Résolues / Bloquées", count: resolved, color: T.success },
        ].map((s, i) => (
          <div key={i} style={{ background: T.white, borderRadius: 12, padding: "14px 20px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12, minWidth: 160 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 18, color: s.color }}>{s.count}</span>
            </div>
            <span style={{ fontFamily: "DM Sans", fontSize: 13, color: T.gray, fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { key: "all", label: "Toutes" },
          { key: "document", label: "Documents" },
          { key: "payment", label: "Paiements" },
          { key: "identity", label: "Identité" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: "7px 16px", borderRadius: 8, border: `1px solid ${filter === f.key ? T.forest : T.border}`,
            background: filter === f.key ? T.surfaceCard : T.white,
            fontFamily: "DM Sans", fontSize: 13, fontWeight: 500,
            color: filter === f.key ? T.forest : T.gray, cursor: "pointer",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Alert list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(a => (
          <div key={a.id} style={{
            background: T.white, borderRadius: 14,
            border: `1px solid ${a.severity === "high" && a.status === "pending" ? `${T.red}30` : T.border}`,
            overflow: "hidden", transition: "all 0.2s",
          }}>
            <div onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
              style={{ padding: "16px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <SeverityDot severity={a.severity} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "DM Sans", fontWeight: 600, fontSize: 14, color: T.navy }}>{a.artisan}</span>
                  <Badge color={a.type === "document" ? T.forest : a.type === "payment" ? T.gold : T.red}>
                    {a.type === "document" ? "Document" : a.type === "payment" ? "Paiement" : "Identité"}
                  </Badge>
                  {a.score !== null && (
                    <span style={{ fontFamily: "DM Mono", fontSize: 11, color: a.score < 30 ? T.red : a.score < 60 ? T.orange : T.gold, fontWeight: 500 }}>
                      Score : {a.score}/100
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, lineHeight: 1.4 }}>{a.detail}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <span style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray }}>{a.date}</span>
                <Badge color={a.status === "pending" ? T.red : a.status === "investigating" ? T.orange : a.status === "blocked" ? T.red : T.success}>
                  {a.status === "pending" ? "En attente" : a.status === "investigating" ? "Investigation" : a.status === "blocked" ? "Bloqué" : "Résolu"}
                </Badge>
              </div>
              <div style={{ transform: expandedId === a.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>{I.chevDown()}</div>
            </div>

            {expandedId === a.id && (
              <div style={{ padding: "0 22px 18px", borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                  <div>
                    <span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, display: "block", marginBottom: 4 }}>SIRET</span>
                    <span style={{ fontFamily: "DM Mono", fontSize: 13, color: T.navy }}>{a.siret}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, display: "block", marginBottom: 4 }}>Type</span>
                    <span style={{ fontFamily: "DM Sans", fontSize: 13, color: T.navy }}>{a.type === "document" ? "Vérification document IA" : a.type === "payment" ? "Anomalie paiement" : "Usurpation identité"}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, display: "block", marginBottom: 4 }}>Sévérité</span>
                    <span style={{ fontFamily: "DM Sans", fontSize: 13, color: T.navy }}>{a.severity === "high" ? "Critique" : a.severity === "medium" ? "Moyenne" : "Faible"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {(a.status === "pending" || a.status === "investigating") && (
                    <button onClick={() => setConfirmAction({ id: a.id, action: "block" })} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: T.red, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                      Bloquer l'artisan
                    </button>
                  )}
                  {a.status === "pending" && (
                    <button onClick={() => setConfirmAction({ id: a.id, action: "investigate" })} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${T.forest}`, background: T.white, color: T.forest, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Investiguer
                    </button>
                  )}
                  {(a.status === "pending" || a.status === "investigating") && (
                    <button onClick={() => setConfirmAction({ id: a.id, action: "resolve" })} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, color: T.lightGray, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Marquer résolu
                    </button>
                  )}
                  {(a.status === "blocked" || a.status === "resolved") && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: a.status === "blocked" ? `${T.red}08` : `${T.success}08` }}>
                      {a.status === "blocked" ? I.x(T.red, 14) : I.check(T.success, 14)}
                      <span style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: a.status === "blocked" ? T.red : T.success }}>
                        {a.status === "blocked" ? "Artisan bloqué" : "Alerte résolue"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ━━━ PAGE: DOCUMENT VERIFICATION ━━━ */
const DocumentsPage = () => {
  const [tab, setTab] = useState("all");
  const [docs, setDocs] = useState([
    { id: 1, artisan: "Pierre Moreau", type: "Assurance décennale", uploaded: "17/03/2026", status: "pending", aiScore: 72, aiNotes: "Métadonnées cohérentes. Numéro de police détecté. Cross-check SIRET en cours.", siret: "623 478 901 00034" },
    { id: 2, artisan: "Laurent Petit", type: "Assurance décennale", uploaded: "16/03/2026", status: "rejected", aiScore: 18, aiNotes: "ALERTE — Document créé avec Adobe Photoshop. Signature numérique absente. Police de caractères incohérente avec les attestations SMABTP.", siret: "842 567 123 00045" },
    { id: 3, artisan: "Ahmed Benali", type: "Certificat RGE", uploaded: "15/03/2026", status: "verified", aiScore: 95, aiNotes: "Vérifié via API ADEME. Qualification valide jusqu'au 12/2026. SIRET correspond.", siret: "534 012 789 00023" },
    { id: 4, artisan: "Nicolas Martin", type: "Assurance décennale", uploaded: "14/03/2026", status: "expiring", aiScore: 88, aiNotes: "Document authentique. Attention : expiration dans 28 jours. Notification de renouvellement envoyée.", siret: "912 345 678 00012" },
    { id: 5, artisan: "Marc Dubois", type: "Qualibat", uploaded: "13/03/2026", status: "investigating", aiScore: 42, aiNotes: "Numéro de certificat non trouvé dans l'annuaire Qualibat. Format du document conforme mais contenu non vérifié.", siret: "756 890 234 00067" },
  ]);
  const [toast, setToast] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleValidate = (id) => {
    setConfirmAction({ id, action: "validate" });
  };
  const handleReject = (id) => {
    setConfirmAction({ id, action: "reject" });
  };
  const executeAction = () => {
    if (!confirmAction) return;
    const { id, action } = confirmAction;
    const doc = docs.find(d => d.id === id);
    setDocs(docs.map(d => d.id === id ? { ...d, status: action === "validate" ? "verified" : "rejected" } : d));
    showToast(
      action === "validate"
        ? `Document de ${doc.artisan} validé avec succès. L'artisan a été notifié.`
        : `Document de ${doc.artisan} rejeté. L'artisan a été notifié pour soumettre un nouveau document.`,
      action === "validate" ? "success" : "error"
    );
    setConfirmAction(null);
  };

  const handleInvestigate = (id) => {
    const doc = docs.find(d => d.id === id);
    setDocs(docs.map(d => d.id === id ? { ...d, status: "investigating" } : d));
    showToast(`Investigation ouverte pour le document de ${doc.artisan}.`, "warning");
  };

  const filtered = tab === "all" ? docs : docs.filter(d => d.status === tab);
  const statusColor = (s) => ({ pending: T.gold, verified: T.success, rejected: T.red, expiring: T.orange, investigating: T.gold }[s] || T.lightGray);
  const statusLabel = (s) => ({ pending: "En attente", verified: "Vérifié", rejected: "Rejeté", expiring: "Expire bientôt", investigating: "Investigation" }[s] || s);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 32, zIndex: 9999,
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 22px", borderRadius: 12,
          background: toast.type === "success" ? T.deepForest : toast.type === "error" ? T.red : T.gold,
          color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          animation: "slideIn 0.3s ease",
          maxWidth: 440,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {toast.type === "success" ? I.check("#fff", 16) : toast.type === "error" ? I.x("#fff", 16) : I.clock("#fff", 16)}
          </div>
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", marginLeft: 8, flexShrink: 0, fontSize: 16, fontWeight: 700 }}>x</button>
        </div>
      )}

      {/* ── CONFIRM MODAL ── */}
      {confirmAction && (() => {
        const doc = docs.find(d => d.id === confirmAction.id);
        const isValidate = confirmAction.action === "validate";
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.45)", backdropFilter: "blur(4px)" }} onClick={() => setConfirmAction(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 16, padding: "28px 32px", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: isValidate ? `${T.success}15` : `${T.red}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isValidate ? I.check(T.success, 22) : I.x(T.red, 22)}
                </div>
                <div>
                  <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 16, color: T.navy }}>{isValidate ? "Valider le document ?" : "Rejeter le document ?"}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, marginTop: 2 }}>{doc?.artisan} — {doc?.type}</div>
                </div>
              </div>
              <div style={{ background: T.bgPage, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontFamily: "DM Sans", fontSize: 12, color: T.gray, lineHeight: 1.5 }}>
                {isValidate
                  ? "Le document sera marqué comme vérifié. L'artisan sera notifié et son profil mis à jour automatiquement."
                  : "Le document sera marqué comme rejeté. L'artisan recevra une notification avec la demande de soumettre un nouveau document conforme."
                }
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmAction(null)} style={{ padding: "9px 20px", borderRadius: 9, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.gray, cursor: "pointer" }}>Annuler</button>
                <button onClick={executeAction} style={{ padding: "9px 24px", borderRadius: 9, border: "none", background: isValidate ? T.success : T.red, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {isValidate ? "Confirmer la validation" : "Confirmer le rejet"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── VIEW DOCUMENT MODAL ── */}
      {viewingDoc && (() => {
        const doc = docs.find(d => d.id === viewingDoc);
        if (!doc) return null;
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 9997, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setViewingDoc(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 16, maxWidth: 560, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 16, color: T.navy }}>{doc.type}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, marginTop: 2 }}>{doc.artisan} · SIRET {doc.siret}</div>
                </div>
                <button onClick={() => setViewingDoc(null)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.x(T.gray, 14)}</button>
              </div>
              {/* Simulated document preview */}
              <div style={{ padding: "32px 24px", background: T.bgPage, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{ width: "100%", maxWidth: 460, background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "28px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 14, color: T.navy, textTransform: "uppercase", letterSpacing: "0.5px" }}>Attestation</div>
                      <div style={{ fontFamily: "DM Sans", fontSize: 18, fontWeight: 700, color: T.navy, marginTop: 4 }}>{doc.type}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray }}>Uploadé le</div>
                      <div style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 600, color: T.navy }}>{doc.uploaded}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", padding: "16px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
                    {[
                      { label: "Artisan", value: doc.artisan },
                      { label: "SIRET", value: doc.siret, mono: true },
                      { label: "Type", value: doc.type },
                      { label: "Statut", value: statusLabel(doc.status) },
                    ].map((f, i) => (
                      <div key={i}>
                        <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, textTransform: "uppercase", marginBottom: 3 }}>{f.label}</div>
                        <div style={{ fontFamily: f.mono ? "DM Mono" : "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, textTransform: "uppercase", marginBottom: 6 }}>Analyse IA — Score {doc.aiScore}/100</div>
                    <div style={{ height: 6, borderRadius: 3, background: T.border, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ width: `${doc.aiScore}%`, height: "100%", borderRadius: 3, background: statusColor(doc.status), transition: "width 0.5s" }} />
                    </div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{doc.aiNotes}</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "16px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setViewingDoc(null)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.gray, cursor: "pointer" }}>Fermer</button>
                {doc.status === "pending" && (
                  <>
                    <button onClick={() => { setViewingDoc(null); handleValidate(doc.id); }} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: T.success, color: "#fff", fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Valider</button>
                    <button onClick={() => { setViewingDoc(null); handleReject(doc.id); }} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: T.red, color: "#fff", fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Rejeter</button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <div>
        <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, color: T.navy, margin: 0 }}>Vérification documents</h2>
        <p style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray, margin: "4px 0 0" }}>Analyse IA automatique + validation manuelle</p>
      </div>

      {/* AI Pipeline status */}
      <div style={{ background: `linear-gradient(135deg, ${T.deepForest}, ${T.forest})`, borderRadius: 14, padding: "20px 24px", color: "#fff" }}>
        <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Pipeline IA — Statut</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Documents analysés (7j)", value: String(docs.length + 29) },
            { label: "Taux validation auto", value: `${Math.round((docs.filter(d=>d.status==="verified").length / docs.length) * 100)}%` },
            { label: "Fraudes détectées", value: String(docs.filter(d=>d.status==="rejected").length) },
            { label: "En attente revue", value: String(docs.filter(d=>d.status==="pending" || d.status==="investigating").length) },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22 }}>{s.value}</div>
              <div style={{ fontFamily: "DM Sans", fontSize: 12, opacity: 0.7 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { key: "all", label: "Tous", count: docs.length },
          { key: "pending", label: "En attente", count: docs.filter(d=>d.status==="pending").length },
          { key: "verified", label: "Vérifiés", count: docs.filter(d=>d.status==="verified").length },
          { key: "rejected", label: "Rejetés", count: docs.filter(d=>d.status==="rejected").length },
          { key: "expiring", label: "Expirent bientôt", count: docs.filter(d=>d.status==="expiring").length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "7px 16px", borderRadius: 8,
            border: `1px solid ${tab === t.key ? T.forest : T.border}`,
            background: tab === t.key ? T.surfaceCard : T.white,
            fontFamily: "DM Sans", fontSize: 13, fontWeight: 500,
            color: tab === t.key ? T.forest : T.gray, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {t.label}
            <span style={{ fontFamily: "DM Mono", fontSize: 10, color: tab === t.key ? T.forest : T.lightGray, fontWeight: 600 }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Document cards */}
      {filtered.map(d => (
        <div key={d.id} style={{ background: T.white, borderRadius: 14, border: `1px solid ${d.status === "pending" ? `${T.gold}30` : T.border}`, padding: "20px 24px", transition: "border-color 0.2s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: "DM Sans", fontWeight: 600, fontSize: 15, color: T.navy }}>{d.artisan}</span>
                <Badge color={statusColor(d.status)}>{statusLabel(d.status)}</Badge>
              </div>
              <div style={{ fontFamily: "DM Sans", fontSize: 13, color: T.gray }}>{d.type} · SIRET {d.siret}</div>
              <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray, marginTop: 2 }}>Uploadé le {d.uploaded}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: `conic-gradient(${statusColor(d.status)} ${d.aiScore * 3.6}deg, ${T.border} 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: T.white,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "DM Mono", fontWeight: 600, fontSize: 14, color: statusColor(d.status),
                }}>{d.aiScore}</div>
              </div>
              <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, marginTop: 4 }}>Score IA</div>
            </div>
          </div>

          <div style={{ background: T.bgPage, borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
            <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.forest, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              {I.shield(T.forest, 14)} Analyse IA
            </div>
            <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{d.aiNotes}</div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setViewingDoc(d.id)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.forest, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.bgPage}
              onMouseLeave={e => e.currentTarget.style.background = T.white}>
              {I.eye(T.forest, 14)} Voir document
            </button>
            {(d.status === "pending" || d.status === "investigating") && (
              <>
                <button onClick={() => handleValidate(d.id)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: T.success, color: "#fff", fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  {I.check("#fff", 14)} Valider
                </button>
                <button onClick={() => handleReject(d.id)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: T.red, color: "#fff", fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  {I.x("#fff", 14)} Rejeter
                </button>
              </>
            )}
            {d.status === "pending" && (
              <button onClick={() => handleInvestigate(d.id)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.gold}40`, background: `${T.gold}08`, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.gold, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                {I.search(T.gold, 14)} Investiguer
              </button>
            )}
            <button style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.gray, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              onMouseEnter={e => e.currentTarget.style.background = T.bgPage}
              onMouseLeave={e => e.currentTarget.style.background = T.white}>
              {I.download(T.gray, 14)} Télécharger
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ━━━ PAGE: INTERVENTIONS ━━━ */
const InterventionsPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = INTERVENTIONS.filter(m => {
    if (filter !== "all" && m.status !== filter) return false;
    if (searchTerm && !m.id.toLowerCase().includes(searchTerm.toLowerCase()) && !m.client.toLowerCase().includes(searchTerm.toLowerCase()) && !m.artisan.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, color: T.navy, margin: 0 }}>Interventions</h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray, margin: "4px 0 0" }}>{INTERVENTIONS.length} interventions au total</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.white, borderRadius: 10, padding: "8px 14px", border: `1px solid ${T.border}`, width: 260 }}>
          {I.search()}
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher ID, client, artisan..." style={{ flex: 1, border: "none", background: "none", fontFamily: "DM Sans", fontSize: 13, color: T.navy, outline: "none" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "Toutes" },
          { key: "in_progress", label: "En cours" },
          { key: "pending_validation", label: "Validation" },
          { key: "completed", label: "Terminées" },
          { key: "disputed", label: "Litiges" },
          { key: "pending", label: "En attente" },
          { key: "cancelled", label: "Annulées" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: "7px 16px", borderRadius: 8,
            border: `1px solid ${filter === f.key ? T.forest : T.border}`,
            background: filter === f.key ? T.surfaceCard : T.white,
            fontFamily: "DM Sans", fontSize: 13, fontWeight: 500,
            color: filter === f.key ? T.forest : T.gray, cursor: "pointer",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "DM Sans" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.bgPage }}>
                {["ID Mission", "Client", "Artisan", "Catégorie", "Ville", "Statut", "Séquestre", "Montant"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgPage}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.forest, fontWeight: 500 }}>{m.id}</span></td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: T.navy }}>{m.client}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: T.navy }}>{m.artisan}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: T.gray }}>{m.category}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: T.gray }}>{m.city}</td>
                  <td style={{ padding: "14px 16px" }}><StatusBadge status={m.status} /></td>
                  <td style={{ padding: "14px 16px" }}><EscrowBadge escrow={m.escrow} /></td>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 600, color: T.navy }}>{m.amount > 0 ? `${m.amount} €` : "—"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ━━━ PAGE: ARTISANS ━━━ */
const ArtisansPage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [searchA, setSearchA] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailTab, setDetailTab] = useState("info");
  const [artisans, setArtisans] = useState(ARTISANS_LIST);
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [contactModal, setContactModal] = useState(null);
  const [contactMsg, setContactMsg] = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const filtered = artisans.filter(a => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (searchA && !a.name.toLowerCase().includes(searchA.toLowerCase()) && !a.metier.toLowerCase().includes(searchA.toLowerCase()) && !a.city.toLowerCase().includes(searchA.toLowerCase())) return false;
    return true;
  });
  const selected = artisans.find(a => a.id === selectedId);

  const executeAction = () => {
    if (!confirmAction) return;
    const { id, action } = confirmAction;
    const art = artisans.find(a => a.id === id);
    const newStatus = action === "suspend" ? "suspended" : action === "reactivate" ? "active" : "active";
    setArtisans(artisans.map(a => a.id === id ? { ...a, status: newStatus } : a));
    const msgs = {
      suspend: `${art.name} a été suspendu. Son profil n'est plus visible et ses missions en cours sont gelées.`,
      reactivate: `${art.name} a été réactivé. Son profil est de nouveau visible sur la plateforme.`,
      validate_profile: `Le profil de ${art.name} a été validé et certifié Nova.`,
    };
    if (action === "validate_profile") {
      setArtisans(artisans.map(a => a.id === id ? { ...a, status: "active", verified: true } : a));
    }
    showToast(msgs[action], action === "suspend" ? "error" : "success");
    setConfirmAction(null);
  };

  const sendContact = () => {
    if (!contactMsg.trim()) return;
    showToast(`Message envoyé à ${contactModal.name} (${contactModal.email}).`, "success");
    setContactModal(null);
    setContactMsg("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "calc(100vh - 110px)", position: "relative" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 32, zIndex: 9999, display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", borderRadius: 12, background: toast.type === "success" ? T.deepForest : toast.type === "error" ? T.red : T.gold, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", maxWidth: 480 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {toast.type === "success" ? I.check("#fff", 16) : toast.type === "error" ? I.x("#fff", 16) : I.clock("#fff", 16)}
          </div>
          <span style={{ flex: 1 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>x</button>
        </div>
      )}

      {/* Confirm modal */}
      {confirmAction && (() => {
        const art = artisans.find(a => a.id === confirmAction.id);
        const cfg = {
          suspend: { title: "Suspendre cet artisan ?", desc: `Le profil de ${art?.name} sera masqué. Missions gelées, clients notifiés.`, color: T.red, btn: "Confirmer la suspension", icon: I.x("#fff", 18) },
          reactivate: { title: "Réactiver cet artisan ?", desc: `Le profil de ${art?.name} sera de nouveau visible.`, color: T.success, btn: "Confirmer la réactivation", icon: I.check("#fff", 18) },
          validate_profile: { title: "Valider ce profil ?", desc: `${art?.name} recevra le badge Certifié Nova.`, color: T.forest, btn: "Valider et certifier", icon: I.shield("#fff", 18) },
        }[confirmAction.action];
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.45)", backdropFilter: "blur(4px)" }} onClick={() => setConfirmAction(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 16, padding: "28px 32px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cfg.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>{cfg.icon}</div>
                <div>
                  <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 16, color: T.navy }}>{cfg.title}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, marginTop: 2 }}>{art?.name} · {art?.metier} · {art?.city}</div>
                </div>
              </div>
              <div style={{ background: T.bgPage, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontFamily: "DM Sans", fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{cfg.desc}</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmAction(null)} style={{ padding: "9px 20px", borderRadius: 9, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.gray, cursor: "pointer" }}>Annuler</button>
                <button onClick={executeAction} style={{ padding: "9px 24px", borderRadius: 9, border: "none", background: cfg.color, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{cfg.btn}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Contact modal */}
      {contactModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.45)", backdropFilter: "blur(4px)" }} onClick={() => { setContactModal(null); setContactMsg(""); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 16, padding: "28px 32px", maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <Avatar initials={contactModal.name.split(" ").map(n => n[0]).join("")} size={44} />
              <div>
                <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 16, color: T.navy }}>Contacter {contactModal.name}</div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, marginTop: 2 }}>{contactModal.metier} · {contactModal.city}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: T.bgPage, border: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, marginBottom: 3 }}>Téléphone</div>
                <div style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 600, color: T.navy }}>{contactModal.phone}</div>
              </div>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: T.bgPage, border: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, marginBottom: 3 }}>Email</div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{contactModal.email}</div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, fontWeight: 600, marginBottom: 6 }}>Envoyer un message</div>
              <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)} placeholder="Écrivez votre message..." rows={4} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${T.border}`, fontFamily: "DM Sans", fontSize: 12, color: T.navy, outline: "none", background: T.bgPage, resize: "vertical", lineHeight: 1.5, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setContactModal(null); setContactMsg(""); }} style={{ padding: "9px 20px", borderRadius: 9, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.gray, cursor: "pointer" }}>Annuler</button>
              <button onClick={sendContact} style={{ padding: "9px 24px", borderRadius: 9, border: "none", background: T.deepForest, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: contactMsg.trim() ? 1 : 0.5, display: "flex", alignItems: "center", gap: 6 }}>{I.send("#fff", 14)} Envoyer</button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 20, color: T.navy, margin: 0 }}>Artisans</h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, margin: "2px 0 0" }}>{ARTISANS_LIST.length} artisans référencés</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["all","active","pending_review","suspended"].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${filterStatus === f ? T.forest : T.border}`, background: filterStatus === f ? T.surfaceCard : T.white, fontFamily: "DM Sans", fontSize: 11, fontWeight: 500, color: filterStatus === f ? T.forest : T.lightGray, cursor: "pointer" }}>
                {f === "all" ? "Tous" : f === "active" ? "Actifs" : f === "pending_review" ? "En revue" : "Suspendus"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.white, borderRadius: 10, padding: "6px 12px", border: `1px solid ${T.border}`, width: 200 }}>
            {I.search()}
            <input value={searchA} onChange={e => setSearchA(e.target.value)} placeholder="Rechercher..." style={{ flex: 1, border: "none", background: "none", fontFamily: "DM Sans", fontSize: 12, color: T.navy, outline: "none" }} />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, gap: 0, minHeight: 0, borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}`, background: T.white }}>
        {/* Left: Artisan list */}
        <div style={{ width: 380, borderRight: `1px solid ${T.border}`, overflowY: "auto", flexShrink: 0 }}>
          {filtered.map(a => {
            const active = selectedId === a.id;
            return (
              <div key={a.id} onClick={() => { setSelectedId(a.id); setDetailTab("info"); }}
                style={{ padding: "14px 16px", cursor: "pointer", background: active ? T.surfaceCard : "transparent", borderLeft: active ? `3px solid ${T.forest}` : "3px solid transparent", borderBottom: `1px solid ${T.border}08`, transition: "all 0.1s" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = `${T.bgPage}80`; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? T.surfaceCard : "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar initials={a.name.split(" ").map(n => n[0]).join("")} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: 600, color: T.navy }}>{a.name}</span>
                      {a.verified && <span style={{ fontSize: 9, color: T.gold, fontWeight: 700 }}>CERTIFIÉ</span>}
                    </div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, marginTop: 2 }}>{a.metier} · {a.city}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>{I.star(T.gold, 12)}<span style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 600, color: T.navy }}>{a.rating || "—"}</span></div>
                    <div style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray, marginTop: 2 }}>{a.missions} missions</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, marginTop: 8, marginLeft: 52 }}>
                  <StatusBadge status={a.status} />
                  <Badge color={a.decennale === "valid" ? T.success : a.decennale === "expiring" ? T.orange : a.decennale === "pending" ? T.gold : T.red}>
                    {a.decennale === "valid" ? "Décennale OK" : a.decennale === "expiring" ? "Expire bientôt" : a.decennale === "pending" ? "En attente" : "Rejeté"}
                  </Badge>
                  {a.rge && <Badge color={T.success}>RGE</Badge>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detail panel */}
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, background: T.bgPage }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: T.surfaceCard, display: "flex", alignItems: "center", justifyContent: "center" }}>{I.users(T.border, 32)}</div>
            <span style={{ fontFamily: "Manrope", fontSize: 15, color: T.lightGray, fontWeight: 600 }}>Sélectionnez un artisan</span>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: T.bgPage }}>
            {/* Profile header */}
            <div style={{ padding: "20px 28px", background: T.white, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <Avatar initials={selected.name.split(" ").map(n => n[0]).join("")} size={56} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 18, color: T.navy }}>{selected.name}</span>
                  {selected.verified && <Badge color={T.gold}>Certifié Nova</Badge>}
                  <StatusBadge status={selected.status} />
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, color: T.gray, marginTop: 4 }}>{selected.metier} · {selected.city} · Inscrit le {selected.inscriptionDate}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setContactModal(selected)} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.forest, cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = T.bgPage} onMouseLeave={e => e.currentTarget.style.background = T.white}>Contacter</button>
                {selected.status === "active" && <button onClick={() => setConfirmAction({ id: selected.id, action: "suspend" })} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${T.red}30`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.red, cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = `${T.red}05`} onMouseLeave={e => e.currentTarget.style.background = T.white}>Suspendre</button>}
                {selected.status === "suspended" && <button onClick={() => setConfirmAction({ id: selected.id, action: "reactivate" })} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: T.success, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", transition: "opacity 0.15s" }} onMouseEnter={e => e.currentTarget.style.opacity = "0.9"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>Réactiver</button>}
                {selected.status === "pending_review" && <button onClick={() => setConfirmAction({ id: selected.id, action: "validate_profile" })} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: T.forest, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Valider le profil</button>}
              </div>
            </div>

            {/* Detail tabs */}
            <div style={{ display: "flex", gap: 0, background: T.white, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
              {[
                { key: "info", label: "Informations" },
                { key: "docs", label: "Documents & Certifications" },
                { key: "missions", label: "Missions & Avis" },
                { key: "finance", label: "Chiffres" },
              ].map(tab => (
                <button key={tab.key} onClick={() => setDetailTab(tab.key)} style={{
                  padding: "10px 20px", border: "none", cursor: "pointer",
                  background: "transparent",
                  borderBottom: detailTab === tab.key ? `2px solid ${T.forest}` : "2px solid transparent",
                  fontFamily: "DM Sans", fontSize: 12, fontWeight: detailTab === tab.key ? 700 : 500,
                  color: detailTab === tab.key ? T.forest : T.lightGray,
                }}>{tab.label}</button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
              {detailTab === "info" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Contact */}
                  <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "18px 22px" }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Contact</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
                      {[
                        { label: "Téléphone", value: selected.phone },
                        { label: "Email", value: selected.email },
                        { label: "Ville", value: selected.city },
                        { label: "Métier", value: selected.metier },
                      ].map((f, i) => (
                        <div key={i}>
                          <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, marginBottom: 3 }}>{f.label}</div>
                          <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Entreprise */}
                  <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "18px 22px" }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Entreprise</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
                      {[
                        { label: "SIRET", value: selected.siret, mono: true },
                        { label: "Code APE", value: selected.ape, mono: true },
                        { label: "N° TVA", value: selected.tva, mono: true },
                        { label: "Inscription", value: selected.inscriptionDate },
                      ].map((f, i) => (
                        <div key={i}>
                          <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, marginBottom: 3 }}>{f.label}</div>
                          <div style={{ fontFamily: f.mono ? "DM Mono" : "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {detailTab === "docs" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Assurance décennale */}
                  <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${selected.decennale === "expiring" ? `${T.orange}40` : T.border}`, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px" }}>Assurance décennale</div>
                      <Badge color={selected.decennale === "valid" ? T.success : selected.decennale === "expiring" ? T.orange : selected.decennale === "pending" ? T.gold : T.red}>
                        {selected.decennale === "valid" ? "Valide" : selected.decennale === "expiring" ? "Expire bientôt" : selected.decennale === "pending" ? "En attente" : "Rejeté"}
                      </Badge>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
                      {[
                        { label: "Assureur", value: selected.assureur },
                        { label: "N° Police", value: selected.policeN, mono: true },
                        { label: "Expiration", value: selected.decennaleExpiry, color: selected.decennale === "expiring" ? T.orange : T.navy },
                      ].map((f, i) => (
                        <div key={i}>
                          <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, marginBottom: 3 }}>{f.label}</div>
                          <div style={{ fontFamily: f.mono ? "DM Mono" : "DM Sans", fontSize: 13, fontWeight: 600, color: f.color || T.navy }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                    {selected.decennale !== "rejected" && selected.decennale !== "pending" && (
                      <button style={{ marginTop: 12, padding: "6px 14px", borderRadius: 7, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, color: T.forest, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>{I.download(T.forest, 13)} Voir attestation</button>
                    )}
                  </div>
                  {/* Qualibat */}
                  <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "18px 22px" }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Qualibat</div>
                    {selected.qualibat ? (
                      <div><div style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 600, color: T.navy }}>{selected.qualibat}</div></div>
                    ) : (
                      <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray }}>Aucune qualification Qualibat</div>
                    )}
                  </div>
                  {/* RGE */}
                  <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px" }}>Certification RGE</div>
                      {selected.rge ? <Badge color={T.success}>Certifié</Badge> : <Badge color={T.lightGray}>Non certifié</Badge>}
                    </div>
                    {selected.rgeExpiry && <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray }}>Valide jusqu'au <span style={{ fontFamily: "DM Mono", fontWeight: 600, color: T.navy }}>{selected.rgeExpiry}</span></div>}
                  </div>
                </div>
              )}

              {detailTab === "missions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Recent missions */}
                  <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "18px 22px" }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Missions récentes</div>
                    {selected.recentMissions.length === 0 ? (
                      <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray }}>Aucune mission</div>
                    ) : (
                      selected.recentMissions.map((mId, i) => {
                        const mission = INTERVENTIONS.find(m => m.id === mId);
                        return mission ? (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < selected.recentMissions.length - 1 ? `1px solid ${T.border}` : "none" }}>
                            <span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.forest, fontWeight: 600 }}>{mission.id}</span>
                            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.navy }}>{mission.client}</span>
                            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray }}>{mission.category}</span>
                            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                              <StatusBadge status={mission.status} />
                              <span style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 600, color: T.navy }}>{mission.amount} €</span>
                            </div>
                          </div>
                        ) : <div key={i} style={{ fontFamily: "DM Mono", fontSize: 12, color: T.lightGray, padding: "6px 0" }}>{mId}</div>;
                      })
                    )}
                  </div>
                  {/* Avis clients */}
                  <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px" }}>Avis clients ({selected.nbAvis})</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>{I.star(T.gold, 14)}<span style={{ fontFamily: "DM Mono", fontSize: 14, fontWeight: 700, color: T.navy }}>{selected.rating}</span><span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray }}>/5</span></div>
                    </div>
                    {selected.avis.length === 0 ? (
                      <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray }}>Aucun avis</div>
                    ) : (
                      selected.avis.map((av, i) => (
                        <div key={i} style={{ padding: "12px 0", borderBottom: i < selected.avis.length - 1 ? `1px solid ${T.border}` : "none" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{av.client}</span>
                              <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(n => <span key={n}>{I.star(n <= av.note ? T.gold : T.border, 12)}</span>)}</div>
                            </div>
                            <span style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray }}>{av.date}</span>
                          </div>
                          <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{av.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {detailTab === "finance" && (
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <KPICard label="CA 30 jours" value={`${selected.ca30j.toLocaleString("fr-FR")} €`} icon={I.credit(T.forest,18)} />
                  <KPICard label="Panier moyen" value={selected.avgTicket ? `${selected.avgTicket} €` : "—"} icon={I.briefcase(T.forest,18)} />
                  <KPICard label="Satisfaction" value={selected.tauxSatisfaction ? `${selected.tauxSatisfaction}%` : "—"} icon={I.star(T.gold,16)} />
                  <KPICard label="Total missions" value={selected.missions} icon={I.check(T.success,18)} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ━━━ PAGE: PAYMENTS ━━━ */
const PaymentsPage = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div>
      <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, color: T.navy, margin: 0 }}>Paiements & Séquestre</h2>
      <p style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray, margin: "4px 0 0" }}>Suivi des fonds en séquestre et paiements</p>
    </div>

    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <KPICard label="En séquestre" value="42 680 €" icon={I.shield(T.forest,18)} sub="18 missions" />
      <KPICard label="Libéré (7j)" value="18 420 €" icon={I.check(T.success,18)} sub="12 paiements" trend="up" trendValue="+12.4%" />
      <KPICard label="Remboursé (7j)" value="1 230 €" icon={I.x(T.red,18)} sub="2 litiges" />
      <KPICard label="En attente validation" value="8 640 €" icon={I.clock(T.gold,18)} sub="6 missions" />
    </div>

    {/* Escrow pipeline */}
    <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: "20px 24px" }}>
      <h3 style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 16, marginTop: 0 }}>Pipeline séquestre</h3>
      <div style={{ display: "flex", gap: 0 }}>
        {[
          { label: "Paiement bloqué", count: 6, amount: "12 400 €", color: T.forest },
          { label: "Mission en cours", count: 8, amount: "18 640 €", color: T.gold },
          { label: "Nous validons", count: 4, amount: "8 640 €", color: T.sage },
          { label: "Artisan payé", count: 12, amount: "18 420 €", color: T.success },
        ].map((step, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: `${step.color}15`,
              border: `2px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 10px", fontFamily: "DM Mono", fontWeight: 600, fontSize: 14, color: step.color,
            }}>{step.count}</div>
            {i < 3 && <div style={{ position: "absolute", top: 20, left: "60%", width: "80%", height: 2, background: T.border }} />}
            <div style={{ fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.navy }}>{step.label}</div>
            <div style={{ fontFamily: "DM Mono", fontSize: 12, color: T.gray, marginTop: 2 }}>{step.amount}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent transactions */}
    <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy }}>Transactions récentes</span>
      </div>
      {INTERVENTIONS.filter(m => m.amount > 0).map(m => (
        <div key={m.id} style={{ padding: "14px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: m.escrow === "paid" ? `${T.success}12` : m.escrow === "blocked" ? `${T.red}12` : `${T.gold}12`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {m.escrow === "paid" ? I.check(T.success, 16) : m.escrow === "blocked" ? I.alert(T.red, 16) : I.clock(T.gold, 16)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{m.client} → {m.artisan}</div>
            <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray }}>{m.id} · {m.date}</div>
          </div>
          <EscrowBadge escrow={m.escrow} />
          <span style={{ fontFamily: "DM Mono", fontSize: 14, fontWeight: 600, color: T.navy, minWidth: 80, textAlign: "right" }}>{m.amount} €</span>
        </div>
      ))}
    </div>
  </div>
);

/* ━━━ PAGE: RECHERCHE DEVIS/FACTURES + RÉCLAMATIONS (Support) ━━━ */
const MOCK_INVOICES = [
  { id: "DV-2026-1523", type: "devis", client: "Camille Bernard", artisan: "Nicolas Martin", category: "Chauffage", date: "16/03/2026", amount: 1200, tva: 240, ttc: 1440, status: "signed", mission: "MS-2026-0948", lines: [
    { desc: "Remplacement chaudière gaz condensation", qty: 1, unit: 2800, total: 2800 },
    { desc: "Raccordement fumisterie inox", qty: 1, unit: 450, total: 450 },
    { desc: "Mise en service + réglages", qty: 1, unit: 180, total: 180 },
  ]},
  { id: "DV-2026-1498", type: "devis", client: "Sophie Martin", artisan: "Paul Lefevre", category: "Plomberie", date: "14/03/2026", amount: 380, tva: 76, ttc: 456, status: "signed", mission: "MS-2026-0951", lines: [
    { desc: "Remplacement robinet mitigeur cuisine", qty: 1, unit: 85, total: 85 },
    { desc: "Fourniture mitigeur Grohe", qty: 1, unit: 195, total: 195 },
    { desc: "Déplacement + diagnostic", qty: 1, unit: 100, total: 100 },
  ]},
  { id: "DV-2026-1476", type: "devis", client: "Emma Dubois", artisan: "Pierre Moreau", category: "Maçonnerie", date: "12/03/2026", amount: 2400, tva: 480, ttc: 2880, status: "pending", mission: "MS-2026-0946", lines: [
    { desc: "Reprise fissure mur porteur", qty: 1, unit: 1600, total: 1600 },
    { desc: "Enduit de finition", qty: 8, unit: 45, total: 360 },
    { desc: "Échafaudage + protection", qty: 1, unit: 440, total: 440 },
  ]},
  { id: "FA-2026-0312", type: "facture", client: "Marie Lefèvre", artisan: "David Richard", category: "Serrurerie", date: "17/03/2026", amount: 210, tva: 42, ttc: 252, status: "paid", mission: "MS-2026-0949", lines: [
    { desc: "Ouverture porte claquée", qty: 1, unit: 120, total: 120 },
    { desc: "Remplacement cylindre haute sécurité", qty: 1, unit: 90, total: 90 },
  ]},
  { id: "FA-2026-0298", type: "facture", client: "Lucas Petit", artisan: "Ahmed Benali", category: "Peinture", date: "16/03/2026", amount: 890, tva: 178, ttc: 1068, status: "paid", mission: "MS-2026-0947", lines: [
    { desc: "Peinture salon 25m²", qty: 25, unit: 28, total: 700 },
    { desc: "Sous-couche + préparation murs", qty: 1, unit: 120, total: 120 },
    { desc: "Fourniture peinture Tollens", qty: 3, unit: 23.33, total: 70 },
  ]},
  { id: "FA-2026-0285", type: "facture", client: "Julie Blanc", artisan: "Paul Lefevre", category: "Plomberie", date: "15/03/2026", amount: 175, tva: 35, ttc: 210, status: "paid", mission: "MS-2026-0945", lines: [
    { desc: "Débouchage canalisation cuisine", qty: 1, unit: 135, total: 135 },
    { desc: "Déplacement", qty: 1, unit: 40, total: 40 },
  ]},
];

const MOCK_CLAIMS = [
  { id: "RC-2026-0018", client: "Camille Bernard", artisan: "Nicolas Martin", mission: "MS-2026-0948", devis: "DV-2026-1523", date: "18/03/2026", motif: "devis_excessif", status: "open", description: "Devis initial estimé à 400€, devis final à 1 200€ HT sans justification. Le client conteste la différence.", priority: "high" },
  { id: "RC-2026-0017", client: "Marie Lefèvre", artisan: "David Richard", mission: "MS-2026-0949", devis: "FA-2026-0312", date: "17/03/2026", motif: "malfacon", status: "resolved", description: "Finition non propre sur le remplacement de cylindre. Remboursement partiel de 150€ effectué.", priority: "medium" },
  { id: "RC-2026-0016", client: "Sophie Martin", artisan: "Paul Lefevre", mission: "MS-2026-0951", devis: "DV-2026-1498", date: "17/03/2026", motif: "retard", status: "in_progress", description: "Artisan injoignable depuis 2 jours. Intervention prévue non réalisée.", priority: "high" },
];

const claimMotifs = {
  devis_excessif: "Devis excessif",
  malfacon: "Malfaçon / qualité",
  retard: "Retard / absence",
  non_conforme: "Travaux non conformes",
  comportement: "Comportement artisan",
  facturation: "Erreur facturation",
  autre: "Autre",
};

const SearchDocsPage = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const [showNewClaim, setShowNewClaim] = useState(false);
  const [newClaim, setNewClaim] = useState({ client: "", artisan: "", mission: "", devis: "", motif: "devis_excessif", description: "", priority: "medium" });
  const [claimFilter, setClaimFilter] = useState("all");
  const [openClaim, setOpenClaim] = useState(null);
  const [claimNote, setClaimNote] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmClaimAction, setConfirmClaimAction] = useState(null);
  const [refundModal, setRefundModal] = useState(null);
  const [refundData, setRefundData] = useState({ amount: "", type: "partial", justification: "", notifyArtisan: true, notifyClient: true });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const updateClaimStatus = (id, newStatus) => {
    const claim = claims.find(c => c.id === id);
    setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
    const msgs = {
      in_progress: `Réclamation ${id} prise en charge. ${claim.client} et ${claim.artisan} ont été notifiés.`,
      resolved: `Réclamation ${id} résolue. Les deux parties ont été notifiées.`,
      open: `Réclamation ${id} réouverte.`,
    };
    showToast(msgs[newStatus] || `Statut mis à jour : ${newStatus}`, newStatus === "resolved" ? "success" : "warning");
    setConfirmClaimAction(null);
    if (openClaim?.id === id) setOpenClaim({ ...openClaim, status: newStatus });
  };

  const addClaimNote = () => {
    if (!claimNote.trim() || !openClaim) return;
    const updatedClaims = claims.map(c => c.id === openClaim.id ? { ...c, notes: [...(c.notes || []), { text: claimNote.trim(), date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }), time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), author: "Admin" }] } : c);
    setClaims(updatedClaims);
    const updatedClaim = updatedClaims.find(c => c.id === openClaim.id);
    setOpenClaim(updatedClaim);
    setClaimNote("");
    showToast("Note ajoutée à la réclamation.");
  };

  const doSearch = () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toUpperCase();
    const results = MOCK_INVOICES.filter(d => d.id.toUpperCase().includes(q) || d.client.toUpperCase().includes(q) || d.artisan.toUpperCase().includes(q) || (d.mission && d.mission.toUpperCase().includes(q)));
    setSearchResults(results);
    setSelectedDoc(null);
  };

  const submitClaim = () => {
    if (!newClaim.description.trim()) return;
    const claim = {
      id: `RC-2026-${String(claims.length + 19).padStart(4, "0")}`,
      ...newClaim,
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      status: "open",
    };
    setClaims([claim, ...claims]);
    setNewClaim({ client: "", artisan: "", mission: "", devis: "", motif: "devis_excessif", description: "", priority: "medium" });
    setShowNewClaim(false);
  };

  const prefillClaimFromDoc = (doc) => {
    setNewClaim({ client: doc.client, artisan: doc.artisan, mission: doc.mission || "", devis: doc.id, motif: "devis_excessif", description: "", priority: "medium" });
    setShowNewClaim(true);
    setActiveTab("claims");
  };

  const filteredClaims = claimFilter === "all" ? claims : claims.filter(c => c.status === claimFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header + Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, color: T.navy, margin: 0 }}>Documents & Réclamations</h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray, margin: "4px 0 0" }}>Recherche de devis/factures et gestion des réclamations</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", width: "fit-content" }}>
        {[
          { key: "search", label: "Recherche devis / factures", icon: I.search(T.forest, 15) },
          { key: "claims", label: "Réclamations", icon: I.alert(T.gold, 15), count: claims.filter(c => c.status === "open").length },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: "11px 24px", border: "none", cursor: "pointer",
            background: activeTab === tab.key ? T.surfaceCard : "transparent",
            borderBottom: activeTab === tab.key ? `2px solid ${T.forest}` : "2px solid transparent",
            display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
          }}>
            {tab.icon}
            <span style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500, color: activeTab === tab.key ? T.forest : T.gray }}>{tab.label}</span>
            {tab.count > 0 && <span style={{ background: T.red, color: "#fff", fontFamily: "DM Mono", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "2px 6px" }}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* ═══ TAB: SEARCH ═══ */}
      {activeTab === "search" && (
        <div style={{ display: "flex", gap: 20 }}>
          {/* Left: Search + Results */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Search bar */}
            <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: "20px 24px" }}>
              <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 12 }}>Rechercher un devis ou une facture</div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: T.bgPage, borderRadius: 10, padding: "10px 14px", border: `1px solid ${T.border}` }}>
                  {I.search(T.sageGray, 18)}
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} placeholder="N° devis (DV-...), N° facture (FA-...), nom client, artisan, mission..." style={{ flex: 1, border: "none", background: "none", fontFamily: "DM Sans", fontSize: 13, color: T.navy, outline: "none" }} />
                </div>
                <button onClick={doSearch} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: T.deepForest, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Rechercher</button>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {["DV-2026-1523", "FA-2026-0312", "Sophie Martin"].map(s => (
                  <button key={s} onClick={() => { setSearchQuery(s); }} style={{ padding: "3px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Mono", fontSize: 10, color: T.lightGray, cursor: "pointer" }}>{s}</button>
                ))}
                <span style={{ fontFamily: "DM Sans", fontSize: 10, color: T.border, alignSelf: "center", marginLeft: 4 }}>Suggestions</span>
              </div>
            </div>

            {/* Results */}
            {searchResults !== null && (
              <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, background: T.bgPage }}>
                  <span style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{searchResults.length} résultat{searchResults.length > 1 ? "s" : ""}</span>
                  <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, marginLeft: 8 }}>pour "{searchQuery}"</span>
                </div>
                {searchResults.length === 0 && (
                  <div style={{ padding: "40px 20px", textAlign: "center" }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray }}>Aucun document trouvé</div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.border, marginTop: 4 }}>Vérifiez le numéro ou essayez un nom</div>
                  </div>
                )}
                {searchResults.map(d => (
                  <div key={d.id} onClick={() => setSelectedDoc(d)} style={{
                    padding: "14px 20px", borderBottom: `1px solid ${T.border}`, cursor: "pointer",
                    background: selectedDoc?.id === d.id ? T.surfaceCard : "transparent",
                    borderLeft: selectedDoc?.id === d.id ? `3px solid ${T.forest}` : "3px solid transparent",
                    transition: "all 0.12s",
                  }}
                    onMouseEnter={e => { if (selectedDoc?.id !== d.id) e.currentTarget.style.background = T.bgPage; }}
                    onMouseLeave={e => { if (selectedDoc?.id !== d.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: d.type === "devis" ? `${T.forest}12` : `${T.gold}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {I.doc(d.type === "devis" ? T.forest : T.gold, 18)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 600, color: T.forest }}>{d.id}</span>
                          <Badge color={d.type === "devis" ? T.forest : T.gold}>{d.type === "devis" ? "Devis" : "Facture"}</Badge>
                          <Badge color={d.status === "paid" ? T.success : d.status === "signed" ? T.forest : T.gold}>
                            {d.status === "paid" ? "Payée" : d.status === "signed" ? "Signé" : "En attente"}
                          </Badge>
                        </div>
                        <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, marginTop: 3 }}>{d.client} → {d.artisan} · {d.category}</div>
                      </div>
                      <span style={{ fontFamily: "DM Mono", fontSize: 14, fontWeight: 600, color: T.navy }}>{d.ttc.toLocaleString("fr-FR")} € <span style={{ fontSize: 10, color: T.lightGray, fontWeight: 400 }}>TTC</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Document detail */}
          {selectedDoc ? (
            <div style={{ width: 400, background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden", alignSelf: "flex-start", position: "sticky", top: 90 }}>
              {/* Doc header */}
              <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}`, background: selectedDoc.type === "devis" ? `${T.forest}08` : `${T.gold}08` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: 14, fontWeight: 600, color: T.forest }}>{selectedDoc.id}</span>
                    <Badge color={selectedDoc.type === "devis" ? T.forest : T.gold}>{selectedDoc.type === "devis" ? "Devis" : "Facture"}</Badge>
                  </div>
                  <Badge color={selectedDoc.status === "paid" ? T.success : selectedDoc.status === "signed" ? T.forest : T.gold}>
                    {selectedDoc.status === "paid" ? "Payée" : selectedDoc.status === "signed" ? "Signé" : "En attente"}
                  </Badge>
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray }}>Émis le {selectedDoc.date}</div>
              </div>

              {/* Parties */}
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Client</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{selectedDoc.client}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Artisan</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{selectedDoc.artisan}</div>
                </div>
              </div>
              {selectedDoc.mission && (
                <div style={{ padding: "10px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray }}>Mission liée</span>
                  <span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.forest, fontWeight: 600, background: `${T.forest}10`, borderRadius: 5, padding: "2px 8px" }}>{selectedDoc.mission}</span>
                </div>
              )}

              {/* Lines */}
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Détail des lignes</div>
                {selectedDoc.lines.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: i < selectedDoc.lines.length - 1 ? `1px solid ${T.border}50` : "none" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.navy }}>{l.desc}</div>
                      <div style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray, marginTop: 2 }}>{l.qty} x {l.unit.toFixed(2)} €</div>
                    </div>
                    <span style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 600, color: T.navy, flexShrink: 0 }}>{l.total.toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
                {[
                  { label: "Total HT", value: `${selectedDoc.amount.toLocaleString("fr-FR")} €` },
                  { label: "TVA (20%)", value: `${selectedDoc.tva.toLocaleString("fr-FR")} €` },
                  { label: "Total TTC", value: `${selectedDoc.ttc.toLocaleString("fr-FR")} €`, bold: true },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: t.bold ? `2px solid ${T.navy}` : "none", marginTop: t.bold ? 6 : 0, paddingTop: t.bold ? 8 : 4 }}>
                    <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray, fontWeight: t.bold ? 700 : 400 }}>{t.label}</span>
                    <span style={{ fontFamily: "DM Mono", fontSize: t.bold ? 14 : 12, fontWeight: t.bold ? 700 : 500, color: T.navy }}>{t.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ padding: "14px 20px", display: "flex", gap: 8 }}>
                <button style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.forest, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {I.download(T.forest, 14)} Télécharger PDF
                </button>
                <button onClick={() => prefillClaimFromDoc(selectedDoc)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: T.red, color: "#fff", fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {I.alert("#fff", 14)} Créer réclamation
                </button>
              </div>
            </div>
          ) : searchResults !== null && (
            <div style={{ width: 400, background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, padding: 40, alignSelf: "flex-start" }}>
              {I.doc(T.border, 36)}
              <span style={{ fontFamily: "DM Sans", fontSize: 13, color: T.lightGray }}>Sélectionnez un document</span>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: CLAIMS ═══ */}
      {activeTab === "claims" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "open", "in_progress", "resolved"].map(f => (
                <button key={f} onClick={() => setClaimFilter(f)} style={{
                  padding: "6px 14px", borderRadius: 8,
                  border: `1px solid ${claimFilter === f ? T.forest : T.border}`,
                  background: claimFilter === f ? T.surfaceCard : T.white,
                  fontFamily: "DM Sans", fontSize: 12, fontWeight: 500,
                  color: claimFilter === f ? T.forest : T.gray, cursor: "pointer",
                }}>{f === "all" ? "Toutes" : f === "open" ? "Ouvertes" : f === "in_progress" ? "En cours" : "Résolues"}</button>
              ))}
            </div>
            <button onClick={() => setShowNewClaim(!showNewClaim)} style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: showNewClaim ? T.gray : T.deepForest,
              color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {showNewClaim ? "Annuler" : <>{I.alert("#fff", 14)} Nouvelle réclamation</>}
            </button>
          </div>

          {/* New claim form */}
          {showNewClaim && (
            <div style={{ background: T.white, borderRadius: 14, border: `2px solid ${T.forest}30`, padding: "24px 28px" }}>
              <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 18 }}>Nouvelle réclamation</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                {[
                  { label: "Nom du client", key: "client", placeholder: "Ex: Sophie Martin" },
                  { label: "Nom de l'artisan", key: "artisan", placeholder: "Ex: Paul Lefevre" },
                  { label: "N° Mission", key: "mission", placeholder: "Ex: MS-2026-0951", mono: true },
                  { label: "N° Devis / Facture", key: "devis", placeholder: "Ex: DV-2026-1523", mono: true },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, fontWeight: 600, marginBottom: 5 }}>{f.label}</div>
                    <input value={newClaim[f.key]} onChange={e => setNewClaim({ ...newClaim, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontFamily: f.mono ? "DM Mono" : "DM Sans", fontSize: 12, color: T.navy, outline: "none", background: T.bgPage, boxSizing: "border-box" }} />
                  </div>
                ))}
                <div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, fontWeight: 600, marginBottom: 5 }}>Motif</div>
                  <select value={newClaim.motif} onChange={e => setNewClaim({ ...newClaim, motif: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontFamily: "DM Sans", fontSize: 12, color: T.navy, outline: "none", background: T.bgPage, boxSizing: "border-box" }}>
                    {Object.entries(claimMotifs).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, fontWeight: 600, marginBottom: 5 }}>Priorité</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { key: "low", label: "Faible" },
                      { key: "medium", label: "Moyen" },
                      { key: "high", label: "Urgent" },
                    ].map(p => (
                      <button key={p.key} onClick={() => setNewClaim({ ...newClaim, priority: p.key })} style={{
                        flex: 1, padding: "7px 0", borderRadius: 7, border: `1px solid ${newClaim.priority === p.key ? priorityConfig[p.key].color : T.border}`,
                        background: newClaim.priority === p.key ? priorityConfig[p.key].bg : T.white,
                        fontFamily: "DM Sans", fontSize: 11, fontWeight: 600,
                        color: newClaim.priority === p.key ? priorityConfig[p.key].color : T.lightGray, cursor: "pointer",
                      }}>{p.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, fontWeight: 600, marginBottom: 5 }}>Description de la réclamation</div>
                <textarea value={newClaim.description} onChange={e => setNewClaim({ ...newClaim, description: e.target.value })} placeholder="Décrivez le problème rencontré en détail..." rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, fontFamily: "DM Sans", fontSize: 12, color: T.navy, outline: "none", background: T.bgPage, resize: "vertical", lineHeight: 1.5, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button onClick={() => setShowNewClaim(false)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.gray, cursor: "pointer" }}>Annuler</button>
                <button onClick={submitClaim} style={{ padding: "8px 24px", borderRadius: 8, border: "none", background: T.deepForest, color: "#fff", fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: newClaim.description.trim() ? 1 : 0.5 }}>Créer la réclamation</button>
              </div>
            </div>
          )}

          {/* Claims list */}
          {filteredClaims.map(c => (
            <div key={c.id} onClick={() => setOpenClaim(c)} style={{ background: T.white, borderRadius: 14, border: `1px solid ${c.priority === "high" && c.status === "open" ? `${T.red}30` : T.border}`, padding: "18px 22px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(10,64,48,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 600, color: T.forest }}>{c.id}</span>
                  <Badge color={priorityConfig[c.priority].color} bg={priorityConfig[c.priority].bg}>{priorityConfig[c.priority].label}</Badge>
                  <Badge color={ticketStatusConfig[c.status].color} bg={ticketStatusConfig[c.status].bg}>{ticketStatusConfig[c.status].label}</Badge>
                  <Badge color={T.navy} bg={`${T.navy}10`}>{claimMotifs[c.motif]}</Badge>
                </div>
                <span style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray }}>{c.date}</span>
              </div>
              <div style={{ fontFamily: "DM Sans", fontSize: 13, color: T.gray, lineHeight: 1.5, marginBottom: 14 }}>{c.description}</div>
              <div style={{ display: "flex", gap: 16, padding: "12px 16px", background: T.bgPage, borderRadius: 10 }}>
                {[
                  { label: "Client", value: c.client },
                  { label: "Artisan", value: c.artisan },
                  { label: "Mission", value: c.mission, mono: true },
                  { label: "Devis/Facture", value: c.devis, mono: true },
                ].map((f, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontFamily: f.mono ? "DM Mono" : "DM Sans", fontSize: 12, fontWeight: 600, color: f.mono ? T.forest : T.navy }}>{f.value || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 32, zIndex: 9999, display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", borderRadius: 12, background: toast.type === "success" ? T.deepForest : toast.type === "error" ? T.red : T.gold, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", maxWidth: 480 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {toast.type === "success" ? I.check("#fff", 16) : toast.type === "error" ? I.x("#fff", 16) : I.clock("#fff", 16)}
          </div>
          <span style={{ flex: 1 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>x</button>
        </div>
      )}

      {/* ═══ CONFIRM ACTION MODAL ═══ */}
      {confirmClaimAction && (() => {
        const c = claims.find(cl => cl.id === confirmClaimAction.id);
        const cfgs = {
          resolve: { title: "Résoudre cette réclamation ?", desc: `La réclamation de ${c?.client} concernant ${c?.artisan} sera marquée comme résolue. Les deux parties seront notifiées.`, color: T.success, btn: "Confirmer la résolution" },
          in_progress: { title: "Prendre en charge ?", desc: `Vous serez assigné à cette réclamation. ${c?.client} et ${c?.artisan} seront informés du suivi.`, color: T.gold, btn: "Prendre en charge" },
          refund: { title: "Initier un remboursement ?", desc: `Un remboursement sera déclenché pour ${c?.client} via le séquestre de la mission ${c?.mission}. L'artisan sera notifié.`, color: T.forest, btn: "Confirmer le remboursement" },
          suspend_artisan: { title: "Suspendre l'artisan ?", desc: `Le compte de ${c?.artisan} sera suspendu suite à la réclamation. Ses missions en cours seront gelées.`, color: T.red, btn: "Suspendre l'artisan" },
        };
        const cfg = cfgs[confirmClaimAction.action];
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setConfirmClaimAction(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 16, padding: "28px 32px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 16, color: T.navy, marginBottom: 8 }}>{cfg.title}</div>
              <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.forest, marginBottom: 12 }}>{confirmClaimAction.id}</div>
              <div style={{ background: T.bgPage, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontFamily: "DM Sans", fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{cfg.desc}</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmClaimAction(null)} style={{ padding: "9px 20px", borderRadius: 9, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.gray, cursor: "pointer" }}>Annuler</button>
                <button onClick={() => {
                  if (confirmClaimAction.action === "resolve") updateClaimStatus(confirmClaimAction.id, "resolved");
                  else if (confirmClaimAction.action === "in_progress") updateClaimStatus(confirmClaimAction.id, "in_progress");
                  else if (confirmClaimAction.action === "refund") { updateClaimStatus(confirmClaimAction.id, "resolved"); showToast(`Remboursement initié pour ${c?.client} sur la mission ${c?.mission}.`); }
                  else if (confirmClaimAction.action === "suspend_artisan") { showToast(`${c?.artisan} a été suspendu suite à la réclamation ${confirmClaimAction.id}.`, "error"); setConfirmClaimAction(null); }
                }} style={{ padding: "9px 24px", borderRadius: 9, border: "none", background: cfg.color, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{cfg.btn}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ REFUND MODAL ═══ */}
      {refundModal && (() => {
        const c = refundModal.claim;
        const m = refundModal.mission;
        const maxAmount = m ? m.amount : 0;
        const isValid = refundData.amount && parseFloat(refundData.amount) > 0 && parseFloat(refundData.amount) <= maxAmount && refundData.justification.trim().length >= 20;

        const executeRefund = () => {
          if (!isValid) return;
          const amt = parseFloat(refundData.amount);
          updateClaimStatus(c.id, "resolved");
          const updatedNotes = [...(c.notes || []), {
            text: `Remboursement ${refundData.type === "total" ? "total" : "partiel"} de ${amt.toLocaleString("fr-FR")} € initié.\nJustification : ${refundData.justification}`,
            date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
            time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            author: "Admin"
          }];
          setClaims(prev => prev.map(cl => cl.id === c.id ? { ...cl, status: "resolved", notes: updatedNotes } : cl));
          showToast(`Remboursement de ${amt.toLocaleString("fr-FR")} € initié pour ${c.client}. Justificatif enregistré.`);
          setRefundModal(null);
          setRefundData({ amount: "", type: "partial", justification: "", notifyArtisan: true, notifyClient: true });
          setOpenClaim(null);
        };

        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.55)", backdropFilter: "blur(6px)" }} onClick={() => setRefundModal(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 18, maxWidth: 560, width: "100%", maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "22px 28px", borderBottom: `1px solid ${T.border}`, background: `${T.forest}06`, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${T.forest}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {I.credit(T.forest, 20)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 16, color: T.navy }}>Initier un remboursement</div>
                    <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray, marginTop: 2 }}>{c.id} · Mission {c.mission}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "22px 28px", flex: 1, overflowY: "auto", minHeight: 0 }}>
                {/* Recap */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div style={{ background: T.bgPage, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, textTransform: "uppercase", marginBottom: 4 }}>Client</div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{c.client}</div>
                  </div>
                  <div style={{ background: T.bgPage, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, textTransform: "uppercase", marginBottom: 4 }}>Artisan</div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{c.artisan}</div>
                  </div>
                  <div style={{ background: T.bgPage, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, textTransform: "uppercase", marginBottom: 4 }}>Montant mission</div>
                    <div style={{ fontFamily: "DM Mono", fontSize: 15, fontWeight: 700, color: T.navy }}>{maxAmount.toLocaleString("fr-FR")} €</div>
                  </div>
                </div>

                {/* Refund type */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Type de remboursement</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { key: "partial", label: "Partiel", desc: "Montant au choix" },
                      { key: "total", label: "Total", desc: `${maxAmount.toLocaleString("fr-FR")} €` },
                    ].map(t => (
                      <div key={t.key} onClick={() => { setRefundData({ ...refundData, type: t.key, amount: t.key === "total" ? String(maxAmount) : refundData.amount }); }}
                        style={{
                          flex: 1, padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                          border: `2px solid ${refundData.type === t.key ? T.forest : T.border}`,
                          background: refundData.type === t.key ? `${T.forest}06` : T.white,
                          transition: "all 0.15s",
                        }}>
                        <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: refundData.type === t.key ? T.forest : T.navy }}>{t.label}</div>
                        <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, marginTop: 2 }}>{t.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Montant du remboursement</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", background: T.bgPage, borderRadius: 10, border: `1px solid ${T.border}`, padding: "0 14px", overflow: "hidden" }}>
                      <input
                        type="number" value={refundData.amount}
                        onChange={e => setRefundData({ ...refundData, amount: e.target.value, type: parseFloat(e.target.value) === maxAmount ? "total" : "partial" })}
                        placeholder="0" min="0" max={maxAmount}
                        disabled={refundData.type === "total"}
                        style={{ flex: 1, padding: "10px 0", border: "none", background: "none", fontFamily: "DM Mono", fontSize: 18, fontWeight: 700, color: T.navy, outline: "none", width: "100%" }}
                      />
                      <span style={{ fontFamily: "DM Mono", fontSize: 16, color: T.lightGray, fontWeight: 600 }}>€</span>
                    </div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, whiteSpace: "nowrap" }}>/ {maxAmount.toLocaleString("fr-FR")} € max</div>
                  </div>
                  {refundData.amount && parseFloat(refundData.amount) > maxAmount && (
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.red, marginTop: 6 }}>Le montant ne peut pas dépasser le montant de la mission ({maxAmount} €)</div>
                  )}
                  {refundData.amount && parseFloat(refundData.amount) > 0 && parseFloat(refundData.amount) <= maxAmount && (
                    <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.sage, marginTop: 6 }}>{Math.round((parseFloat(refundData.amount) / maxAmount) * 100)}% du montant total</div>
                  )}
                </div>

                {/* Justification */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px" }}>Justificatif <span style={{ color: T.red }}>*</span></div>
                    <div style={{ fontFamily: "DM Mono", fontSize: 10, color: refundData.justification.trim().length >= 20 ? T.success : T.red }}>{refundData.justification.trim().length}/20 min</div>
                  </div>
                  <textarea
                    value={refundData.justification}
                    onChange={e => setRefundData({ ...refundData, justification: e.target.value })}
                    placeholder="Décrivez le motif du remboursement en détail. Ce justificatif sera archivé et pourra servir de preuve en cas de litige ou de poursuite..."
                    rows={4}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${refundData.justification.trim().length >= 20 ? T.border : `${T.red}40`}`, fontFamily: "DM Sans", fontSize: 12, color: T.navy, outline: "none", background: T.bgPage, resize: "vertical", lineHeight: 1.5, boxSizing: "border-box" }}
                  />
                  <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, marginTop: 6, lineHeight: 1.4 }}>
                    Ce justificatif sera joint au dossier de la réclamation et envoyé à l'artisan comme preuve du remboursement. Il sera archivé et pourra être présenté en cas de contestation ou de procédure juridique.
                  </div>
                </div>

                {/* Notifications */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Notifications</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { key: "notifyClient", label: `Notifier ${c.client} (client)`, desc: "Confirmation du remboursement avec le montant et le délai" },
                      { key: "notifyArtisan", label: `Notifier ${c.artisan} (artisan)`, desc: "Notification du remboursement avec le justificatif joint" },
                    ].map(n => (
                      <div key={n.key} onClick={() => setRefundData({ ...refundData, [n.key]: !refundData[n.key] })} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 9, border: `1px solid ${T.border}`, cursor: "pointer", background: refundData[n.key] ? `${T.forest}04` : T.white }}>
                        <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${refundData[n.key] ? T.forest : T.border}`, background: refundData[n.key] ? T.forest : T.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                          {refundData[n.key] && I.check("#fff", 12)}
                        </div>
                        <div>
                          <div style={{ fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.navy }}>{n.label}</div>
                          <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, marginTop: 1 }}>{n.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${T.border}`, background: T.bgPage, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div>
                  {isValid && (
                    <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.navy }}>
                      Remboursement de <span style={{ fontFamily: "DM Mono", fontWeight: 700, color: T.forest }}>{parseFloat(refundData.amount).toLocaleString("fr-FR")} €</span> pour {c.client}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setRefundModal(null)} style={{ padding: "9px 20px", borderRadius: 9, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.gray, cursor: "pointer" }}>Annuler</button>
                  <button onClick={executeRefund} disabled={!isValid} style={{ padding: "9px 24px", borderRadius: 9, border: "none", background: isValid ? T.deepForest : T.border, color: "#fff", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: isValid ? "pointer" : "default", opacity: isValid ? 1 : 0.5, transition: "all 0.15s" }}>
                    Confirmer le remboursement
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ CLAIM DETAIL MODAL ═══ */}
      {openClaim && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.5)", backdropFilter: "blur(4px)" }} onClick={() => { setOpenClaim(null); setClaimNote(""); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 18, maxWidth: 640, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "22px 28px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: 15, fontWeight: 700, color: T.forest }}>{openClaim.id}</span>
                    <Badge color={priorityConfig[openClaim.priority].color} bg={priorityConfig[openClaim.priority].bg}>{priorityConfig[openClaim.priority].label}</Badge>
                    <Badge color={ticketStatusConfig[openClaim.status].color} bg={ticketStatusConfig[openClaim.status].bg}>{ticketStatusConfig[openClaim.status].label}</Badge>
                  </div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 13, color: T.navy, fontWeight: 600 }}>{claimMotifs[openClaim.motif]}</div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.lightGray, marginTop: 2 }}>Créée le {openClaim.date}</div>
                </div>
                <button onClick={() => { setOpenClaim(null); setClaimNote(""); }} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.x(T.gray, 14)}</button>
              </div>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
              {/* Description */}
              <div style={{ background: T.bgPage, borderRadius: 12, padding: "16px 20px", marginBottom: 18 }}>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Description</div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, color: T.navy, lineHeight: 1.6 }}>{openClaim.description}</div>
              </div>

              {/* Parties */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "16px 18px" }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 10, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Client</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: 600, color: T.navy }}>{openClaim.client}</div>
                </div>
                <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, padding: "16px 18px" }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 10, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Artisan</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: 600, color: T.navy }}>{openClaim.artisan}</div>
                </div>
              </div>

              {/* References */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                {openClaim.mission && (
                  <div style={{ background: `${T.forest}06`, borderRadius: 10, padding: "12px 16px", border: `1px solid ${T.forest}15` }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, marginBottom: 4 }}>Mission liée</div>
                    <div style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 600, color: T.forest }}>{openClaim.mission}</div>
                  </div>
                )}
                {openClaim.devis && (
                  <div style={{ background: `${T.gold}06`, borderRadius: 10, padding: "12px 16px", border: `1px solid ${T.gold}15` }}>
                    <div style={{ fontFamily: "DM Sans", fontSize: 10, color: T.lightGray, marginBottom: 4 }}>Devis / Facture</div>
                    <div style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 600, color: T.gold }}>{openClaim.devis}</div>
                  </div>
                )}
              </div>

              {/* Notes / Timeline */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Notes internes</div>
                {(!openClaim.notes || openClaim.notes.length === 0) && (
                  <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.border, padding: "12px 0" }}>Aucune note pour le moment</div>
                )}
                {(openClaim.notes || []).map((n, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < (openClaim.notes.length - 1) ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: T.surfaceCard, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "DM Sans", fontSize: 9, fontWeight: 700, color: T.forest }}>{n.author?.slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.navy, lineHeight: 1.5 }}>{n.text}</div>
                      <div style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray, marginTop: 4 }}>{n.author} · {n.date} à {n.time}</div>
                    </div>
                  </div>
                ))}
                {/* Add note */}
                <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "flex-end" }}>
                  <textarea value={claimNote} onChange={e => setClaimNote(e.target.value)} placeholder="Ajouter une note interne..." rows={2} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontFamily: "DM Sans", fontSize: 12, color: T.navy, outline: "none", background: T.bgPage, resize: "none", lineHeight: 1.4, boxSizing: "border-box" }} />
                  <button onClick={addClaimNote} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: claimNote.trim() ? T.deepForest : T.border, color: "#fff", fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, cursor: claimNote.trim() ? "pointer" : "default", whiteSpace: "nowrap", height: 36, transition: "background 0.15s" }}>Ajouter</button>
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div style={{ padding: "16px 28px", borderTop: `1px solid ${T.border}`, background: T.bgPage, display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
              {openClaim.status === "open" && (
                <button onClick={() => setConfirmClaimAction({ id: openClaim.id, action: "in_progress" })} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.gold}50`, background: `${T.gold}08`, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.gold, cursor: "pointer" }}>Prendre en charge</button>
              )}
              {(openClaim.status === "open" || openClaim.status === "in_progress") && (
                <>
                  <button onClick={() => setConfirmClaimAction({ id: openClaim.id, action: "resolve" })} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: T.success, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Résoudre</button>
                  <button onClick={() => { const c = openClaim; const mission = INTERVENTIONS.find(m => m.id === c.mission); setRefundModal({ claim: c, mission }); setRefundData({ amount: mission ? String(mission.amount) : "", type: "partial", justification: "", notifyArtisan: true, notifyClient: true }); }} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.forest}`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.forest, cursor: "pointer" }}>Remboursement</button>
                  <button onClick={() => setConfirmClaimAction({ id: openClaim.id, action: "suspend_artisan" })} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.red}30`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.red, cursor: "pointer" }}>Suspendre artisan</button>
                </>
              )}
              {openClaim.status === "resolved" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: `${T.success}08` }}>
                  {I.check(T.success, 14)}
                  <span style={{ fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: T.success }}>Réclamation résolue</span>
                </div>
              )}
              <button onClick={() => { setOpenClaim(null); setClaimNote(""); }} style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 12, fontWeight: 500, color: T.gray, cursor: "pointer" }}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ━━━ PAGE: SETTINGS ━━━ */
const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 700 }}>
      <div>
        <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, color: T.navy, margin: 0 }}>Paramètres</h2>
        <p style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray, margin: "4px 0 0" }}>Configuration de la plateforme admin</p>
      </div>

      {[
        { title: "Seuils de validation IA", items: [
          { label: "Score minimum validation auto", value: "80/100", desc: "Les documents avec un score supérieur sont validés automatiquement" },
          { label: "Score minimum revue manuelle", value: "50/100", desc: "En dessous, rejet automatique" },
        ]},
        { title: "Notifications", items: [
          { label: "Alertes fraude critique", value: "Email + SMS + Push", desc: "Notification immédiate à toute l'équipe" },
          { label: "Nouveaux tickets support", value: "Email + Push", desc: "Notification au prochain agent disponible" },
          { label: "Documents en attente", value: "Email quotidien", desc: "Récapitulatif chaque matin à 9h" },
        ]},
        { title: "Séquestre", items: [
          { label: "Commission standard", value: "10%", desc: "Appliquée sur chaque mission validée" },
          { label: "Commission lancement", value: "5%", desc: "2 premiers mois de chaque artisan" },
          { label: "Majoration urgence", value: "15-25%", desc: "Interventions urgentes (<2h)" },
        ]},
      ].map((section, i) => (
        <div key={i} style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}`, background: T.bgPage }}>
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 14, color: T.navy }}>{section.title}</span>
          </div>
          {section.items.map((item, j) => (
            <div key={j} style={{ padding: "14px 22px", borderBottom: j < section.items.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{item.label}</div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray }}>{item.desc}</div>
              </div>
              <span style={{ fontFamily: "DM Mono", fontSize: 13, color: T.forest, fontWeight: 500, background: T.surfaceCard, padding: "4px 12px", borderRadius: 6 }}>{item.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/* ━━━ PAGE: ANALYTICS (Performance Team) ━━━ */
const AnalyticsPage = () => {
  const [period, setPeriod] = useState("30j");

  const revenueData = [
    { month: "Oct", value: 4200 }, { month: "Nov", value: 6800 }, { month: "Dec", value: 8100 },
    { month: "Jan", value: 11400 }, { month: "Fév", value: 14200 }, { month: "Mar", value: 18420 },
  ];
  const maxRev = Math.max(...revenueData.map(d => d.value));

  const categoryPerf = [
    { name: "Plomberie", missions: 89, revenue: 34200, growth: 18.2, avgTicket: 384 },
    { name: "Électricité", missions: 67, revenue: 28900, growth: 14.5, avgTicket: 431 },
    { name: "Serrurerie", missions: 54, revenue: 15600, growth: 22.1, avgTicket: 289 },
    { name: "Chauffage", missions: 41, revenue: 24800, growth: 8.7, avgTicket: 605 },
    { name: "Peinture", missions: 38, revenue: 18200, growth: 31.4, avgTicket: 479 },
    { name: "Maçonnerie", missions: 23, revenue: 32100, growth: 5.2, avgTicket: 1396 },
  ];
  const maxMissions = Math.max(...categoryPerf.map(c => c.missions));

  const sectorPerf = [
    { city: "Paris", missions: 142, revenue: 62400, artisans: 48, avgRating: 4.7, growth: 15.3 },
    { city: "Lyon", missions: 56, revenue: 24800, artisans: 18, avgRating: 4.6, growth: 22.1 },
    { city: "Marseille", missions: 43, revenue: 18200, artisans: 14, avgRating: 4.5, growth: 11.8 },
    { city: "Bordeaux", missions: 31, revenue: 14600, artisans: 11, avgRating: 4.8, growth: 28.4 },
    { city: "Nantes", missions: 24, revenue: 10800, artisans: 9, avgRating: 4.7, growth: 34.2 },
    { city: "Toulouse", missions: 16, revenue: 7400, artisans: 6, avgRating: 4.4, growth: 41.6 },
  ];

  const conversionFunnel = [
    { step: "Visiteurs uniques", value: 12400, pct: 100 },
    { step: "Inscriptions", value: 1860, pct: 15 },
    { step: "1ère réservation", value: 892, pct: 48 },
    { step: "Mission complétée", value: 714, pct: 80 },
    { step: "Client récurrent", value: 312, pct: 44 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 22, color: T.navy, margin: 0 }}>Performance & Analytics</h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray, margin: "4px 0 0" }}>Suivi de croissance et rentabilité</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["7j", "30j", "90j", "12m"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "6px 14px", borderRadius: 8, border: `1px solid ${period === p ? T.forest : T.border}`,
              background: period === p ? T.surfaceCard : T.white, fontFamily: "DM Mono", fontSize: 12,
              fontWeight: 600, color: period === p ? T.forest : T.lightGray, cursor: "pointer",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <KPICard label="Chiffre d'affaires" value="18 420 €" icon={I.credit(T.forest,18)} sub="Commission nette" trend="up" trendValue="+12.4% vs mois dernier" />
        <KPICard label="Missions complétées" value="312" icon={I.briefcase(T.forest,18)} sub="714 au total" trend="up" trendValue="+8.2%" />
        <KPICard label="Panier moyen" value="487 €" icon={I.credit(T.forest,18)} trend="up" trendValue="+3.1%" />
        <KPICard label="Taux de satisfaction" value="94.2%" icon={I.star(T.gold,16)} sub="Note moy. 4.7/5" trend="up" trendValue="+1.8pts" />
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <KPICard label="Nouveaux clients" value="124" icon={I.users(T.forest,18)} sub="ce mois" trend="up" trendValue="+22%" />
        <KPICard label="Nouveaux artisans" value="18" icon={I.briefcase(T.forest,18)} sub="ce mois" trend="up" trendValue="+6" />
        <KPICard label="Taux de rétention" value="68.4%" icon={I.check(T.success,18)} sub="clients récurrents" trend="up" trendValue="+4.2pts" />
        <KPICard label="LTV / CAC" value="10.2x" icon={I.shield(T.forest,18)} sub="LTV 487€ · CAC 48€" />
      </div>

      {/* Revenue chart */}
      <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: "22px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy }}>Évolution du chiffre d'affaires</span>
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, marginLeft: 12 }}>Commissions nettes (6 derniers mois)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {I.arrowUp(T.success, 14)}
            <span style={{ fontFamily: "DM Mono", fontSize: 13, color: T.success, fontWeight: 600 }}>+338% depuis oct.</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 180 }}>
          {revenueData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "DM Mono", fontSize: 11, color: T.navy, fontWeight: 600 }}>{(d.value / 1000).toFixed(1)}k</span>
              <div style={{
                width: "100%", maxWidth: 56, borderRadius: "8px 8px 4px 4px",
                height: `${(d.value / maxRev) * 140}px`,
                background: i === revenueData.length - 1 ? `linear-gradient(to top, ${T.deepForest}, ${T.sage})` : T.surfaceCard,
                transition: "height 0.4s ease",
              }} />
              <span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray, fontWeight: 500 }}>{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category performance */}
      <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy }}>Performance par catégorie</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "DM Sans" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.bgPage }}>
              {["Catégorie", "Missions", "Volume", "CA Commissions", "Panier moyen", "Croissance"].map(h => (
                <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categoryPerf.map((c, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}
                onMouseEnter={e => e.currentTarget.style.background = T.bgPage}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{c.name}</span>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 80, height: 6, borderRadius: 3, background: T.border, overflow: "hidden" }}>
                      <div style={{ width: `${(c.missions / maxMissions) * 100}%`, height: "100%", borderRadius: 3, background: `linear-gradient(to right, ${T.forest}, ${T.sage})` }} />
                    </div>
                    <span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.navy }}>{c.missions}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 18px" }}><span style={{ fontFamily: "DM Mono", fontSize: 13, color: T.navy }}>{c.revenue.toLocaleString("fr-FR")} €</span></td>
                <td style={{ padding: "14px 18px" }}><span style={{ fontFamily: "DM Mono", fontSize: 13, color: T.forest, fontWeight: 600 }}>{Math.round(c.revenue * 0.1).toLocaleString("fr-FR")} €</span></td>
                <td style={{ padding: "14px 18px" }}><span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.gray }}>{c.avgTicket} €</span></td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {I.arrowUp(T.success, 12)}
                    <span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.success, fontWeight: 500 }}>+{c.growth}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sector performance */}
      <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy }}>Performance par secteur géographique</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "DM Sans" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.bgPage }}>
              {["Ville", "Missions", "CA", "Artisans actifs", "Note moy.", "Croissance"].map(h => (
                <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sectorPerf.map((s, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}
                onMouseEnter={e => e.currentTarget.style.background = T.bgPage}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: `${T.forest}12`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Mono", fontSize: 10, fontWeight: 700, color: T.forest }}>{i + 1}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{s.city}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 18px" }}><span style={{ fontFamily: "DM Mono", fontSize: 13, color: T.navy }}>{s.missions}</span></td>
                <td style={{ padding: "14px 18px" }}><span style={{ fontFamily: "DM Mono", fontSize: 13, color: T.navy }}>{s.revenue.toLocaleString("fr-FR")} €</span></td>
                <td style={{ padding: "14px 18px" }}><span style={{ fontFamily: "DM Mono", fontSize: 13, color: T.gray }}>{s.artisans}</span></td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {I.star(T.gold, 13)}
                    <span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.navy }}>{s.avgRating}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {I.arrowUp(T.success, 12)}
                    <span style={{ fontFamily: "DM Mono", fontSize: 12, color: T.success, fontWeight: 500 }}>+{s.growth}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Two columns: Funnel + Profitability */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* Conversion funnel */}
        <div style={{ flex: 1, background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: "22px 26px" }}>
          <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy, display: "block", marginBottom: 18 }}>Tunnel de conversion</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {conversionFunnel.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.gray }}>{s.step}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 600, color: T.navy }}>{s.value.toLocaleString("fr-FR")}</span>
                    {i > 0 && <span style={{ fontFamily: "DM Mono", fontSize: 10, color: T.sage }}>({s.pct}%)</span>}
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: T.bgPage, overflow: "hidden" }}>
                  <div style={{
                    width: `${(s.value / conversionFunnel[0].value) * 100}%`, height: "100%", borderRadius: 4,
                    background: `linear-gradient(to right, ${T.deepForest}, ${T.sage})`, opacity: 1 - (i * 0.15),
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profitability */}
        <div style={{ flex: 1, background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: "22px 26px" }}>
          <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy, display: "block", marginBottom: 18 }}>Rentabilité</span>
          {[
            { label: "Volume transactions brut", value: "153 800 €", color: T.navy },
            { label: "Commissions (10% moy.)", value: "18 420 €", color: T.forest },
            { label: "Majorations urgence", value: "2 840 €", color: T.gold },
            { label: "CA total Nova", value: "21 260 €", color: T.sage, bold: true },
            { label: "Coûts Mangopay (1.8%)", value: "- 2 768 €", color: T.red },
            { label: "Coûts infrastructure", value: "- 890 €", color: T.red },
            { label: "Marketing / acquisition", value: "- 3 200 €", color: T.red },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", padding: "10px 0",
              borderBottom: i < 6 ? `1px solid ${T.border}` : "none",
              borderTop: i === 3 ? `2px solid ${T.forest}` : "none",
              marginTop: i === 3 ? 4 : 0,
            }}>
              <span style={{ fontFamily: "DM Sans", fontSize: 13, color: T.gray, fontWeight: r.bold ? 700 : 400 }}>{r.label}</span>
              <span style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: r.bold ? 700 : 600, color: r.color }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", borderTop: `2px solid ${T.navy}`, marginTop: 8 }}>
            <span style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 800, color: T.navy }}>Marge nette</span>
            <span style={{ fontFamily: "DM Mono", fontSize: 16, fontWeight: 700, color: T.success }}>14 402 €</span>
          </div>
          <div style={{ fontFamily: "DM Mono", fontSize: 11, color: T.success, textAlign: "right", marginTop: 2 }}>Marge : 67.7%</div>
        </div>
      </div>

      {/* Growth projections */}
      <div style={{ background: `linear-gradient(135deg, ${T.deepForest}, ${T.forest})`, borderRadius: 14, padding: "24px 28px", color: "#fff" }}>
        <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, display: "block", marginBottom: 16 }}>Projections de croissance</span>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Fin Q2 2026", ca: "42 000 €", missions: "580", artisans: "220" },
            { label: "Fin 2026", ca: "156 000 €", missions: "2 400", artisans: "450" },
            { label: "Fin 2027 (4 villes)", ca: "890 000 €", missions: "12 000", artisans: "1 200" },
            { label: "Fin 2028 (national)", ca: "8 400 000 €", missions: "85 000", artisans: "5 000" },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontFamily: "DM Sans", fontSize: 12, opacity: 0.6, marginBottom: 10 }}>{p.label}</div>
              <div style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{p.ca}</div>
              <div style={{ fontFamily: "DM Mono", fontSize: 11, opacity: 0.5 }}>{p.missions} missions · {p.artisans} artisans</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ━━━ ROLE DEFINITIONS ━━━ */
const ROLES = {
  support_clients: {
    key: "support_clients",
    label: "Chargé d'assistance Clients",
    short: "Support Clients",
    desc: "Gestion des tickets clients, suivi des interventions et montants, litiges",
    icon: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/><path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    color: T.sage,
    user: { name: "Laura Petit", email: "laura@nova.fr", initials: "LP" },
    pages: ["dashboard", "chat_clients", "interventions", "search_docs", "settings"],
    defaultPage: "chat_clients",
  },
  support_artisans: {
    key: "support_artisans",
    label: "Chargé d'assistance Artisans",
    short: "Support Artisans",
    desc: "Gestion des tickets artisans, vérification documents, fraude",
    icon: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke={c} strokeWidth="1.8"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    color: T.deepForest,
    user: { name: "Marc Durand", email: "marc@nova.fr", initials: "MD" },
    pages: ["dashboard", "chat_artisans", "fraud", "documents", "artisans", "search_docs", "settings"],
    defaultPage: "chat_artisans",
  },
  analytics: {
    key: "analytics",
    label: "Responsable Performance",
    short: "Performance",
    desc: "Analyse financière, croissance, KPIs, projections",
    icon: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    color: T.gold,
    user: { name: "Sarah Chen", email: "sarah@nova.fr", initials: "SC" },
    pages: ["analytics", "interventions", "artisans", "payments", "settings"],
    defaultPage: "analytics",
  },
  admin: {
    key: "admin",
    label: "Administrateur",
    short: "Admin",
    desc: "Accès complet à toutes les fonctionnalités",
    icon: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={c} strokeWidth="1.8"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    color: T.forest,
    user: { name: "Ryoken", email: "admin@nova.fr", initials: "RY" },
    pages: ["dashboard", "chat", "fraud", "documents", "interventions", "artisans", "payments", "search_docs", "analytics", "settings"],
    defaultPage: "dashboard",
  },
};

const NAV_ITEMS_ALL = {
  dashboard: { key: "dashboard", label: "Tableau de bord", icon: I.dashboard },
  chat: { key: "chat", label: "Tickets", icon: I.chat, badge: 5 },
  chat_clients: { key: "chat_clients", label: "Tickets Clients", icon: I.chat, badge: 3 },
  chat_artisans: { key: "chat_artisans", label: "Tickets Artisans", icon: I.chat, badge: 2 },
  fraud: { key: "fraud", label: "Alertes fraude", icon: I.alert, badge: 2 },
  documents: { key: "documents", label: "Documents", icon: I.doc },
  interventions: { key: "interventions", label: "Interventions", icon: I.briefcase },
  search_docs: { key: "search_docs", label: "Devis & Réclamations", icon: I.doc },
  artisans: { key: "artisans", label: "Artisans", icon: I.users },
  payments: { key: "payments", label: "Paiements", icon: I.credit },
  analytics: { key: "analytics", label: "Performance", icon: (c="#8ECFB0",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  settings: { key: "settings", label: "Paramètres", icon: I.settings },
};

/* ━━━ CHAT WRAPPERS for role-specific ticket views ━━━ */
const ChatClientsPage = () => {
  /* Force clients section */
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [tickets, setTickets] = useState(TICKETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const msgEndRef = useRef(null);
  const section = "clients";
  const currentList = tickets[section];
  const filtered = currentList.filter(t => {
    const matchSearch = !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const selectedTicket = currentList.find(t => t.id === selectedTicketId);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedTicketId, tickets]);
  const sendMsg = () => {
    if (!msgInput.trim() || !selectedTicket) return;
    const updated = { ...tickets };
    updated[section] = updated[section].map(t => t.id === selectedTicketId ? { ...t, messages: [...t.messages, { from: "admin", text: msgInput.trim(), time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) }], unread: 0, status: t.status === "open" ? "in_progress" : t.status } : t);
    setTickets(updated);
    setMsgInput("");
  };
  const updateTicketStatus = (s) => { const u = { ...tickets }; u[section] = u[section].map(t => t.id === selectedTicketId ? { ...t, status: s } : t); setTickets(u); };
  return <TicketListView {...{ filtered, selectedTicketId, setSelectedTicketId, selectedTicket, msgInput, setMsgInput, sendMsg, searchTerm, setSearchTerm, statusFilter, setStatusFilter, msgEndRef, updateTicketStatus, isArtisan: false, currentList, sectionLabel: "Clients" }} />;
};

const ChatArtisansPage = () => {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [tickets, setTickets] = useState(TICKETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const msgEndRef = useRef(null);
  const section = "artisans";
  const currentList = tickets[section];
  const filtered = currentList.filter(t => {
    const matchSearch = !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const selectedTicket = currentList.find(t => t.id === selectedTicketId);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedTicketId, tickets]);
  const sendMsg = () => {
    if (!msgInput.trim() || !selectedTicket) return;
    const updated = { ...tickets };
    updated[section] = updated[section].map(t => t.id === selectedTicketId ? { ...t, messages: [...t.messages, { from: "admin", text: msgInput.trim(), time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) }], unread: 0, status: t.status === "open" ? "in_progress" : t.status } : t);
    setTickets(updated);
    setMsgInput("");
  };
  const updateTicketStatus = (s) => { const u = { ...tickets }; u[section] = u[section].map(t => t.id === selectedTicketId ? { ...t, status: s } : t); setTickets(u); };
  return <TicketListView {...{ filtered, selectedTicketId, setSelectedTicketId, selectedTicket, msgInput, setMsgInput, sendMsg, searchTerm, setSearchTerm, statusFilter, setStatusFilter, msgEndRef, updateTicketStatus, isArtisan: true, currentList, sectionLabel: "Artisans" }} />;
};

/* ━━━ SHARED TICKET LIST VIEW (Redesigned 3-panel) ━━━ */
const TicketListView = ({ filtered, selectedTicketId, setSelectedTicketId, selectedTicket, msgInput, setMsgInput, sendMsg, searchTerm, setSearchTerm, statusFilter, setStatusFilter, msgEndRef, updateTicketStatus, isArtisan, currentList, sectionLabel }) => {
  const accentGrad = isArtisan ? `linear-gradient(135deg, ${T.deepForest}, ${T.forest})` : `linear-gradient(135deg, ${T.sage}, ${T.lightSage})`;
  const accentLight = isArtisan ? T.deepForest : T.sage;
  const totalOpen = currentList.filter(t => t.status === "open").length;
  const totalInProg = currentList.filter(t => t.status === "in_progress").length;
  const totalResolved = currentList.filter(t => t.status === "resolved").length;
  const totalUnassigned = currentList.filter(t => !t.assignee).length;
  const totalUnread = currentList.reduce((a, t) => a + t.unread, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "calc(100vh - 110px)" }}>
      {/* ── TOP BAR: Title + Stats + Search ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div>
            <h2 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 20, color: T.navy, margin: 0 }}>Tickets {sectionLabel}</h2>
            <p style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray, margin: "2px 0 0" }}>{currentList.length} tickets · {totalUnread} non lu{totalUnread > 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Ouverts", count: totalOpen, color: T.forest },
              { label: "En cours", count: totalInProg, color: T.gold },
              { label: "Résolus", count: totalResolved, color: T.success },
              { label: "Non assignés", count: totalUnassigned, color: T.red },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: T.white, borderRadius: 8, padding: "5px 12px", border: `1px solid ${T.border}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                <span style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 700, color: T.navy }}>{s.count}</span>
                <span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.white, borderRadius: 10, padding: "7px 12px", border: `1px solid ${T.border}`, width: 240 }}>
          {I.search()}
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher..." style={{ flex: 1, border: "none", background: "none", fontFamily: "DM Sans", fontSize: 12, color: T.navy, outline: "none" }} />
        </div>
      </div>

      {/* ── MAIN 3-PANEL LAYOUT ── */}
      <div style={{ display: "flex", flex: 1, gap: 0, minHeight: 0, borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}`, background: T.white }}>

        {/* ═══ PANEL 1: TICKET LIST (narrow) ═══ */}
        <div style={{ width: 310, display: "flex", flexDirection: "column", borderRight: `1px solid ${T.border}`, background: T.white, flexShrink: 0 }}>
          {/* Status filter tabs */}
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 4 }}>
            {["all", "open", "in_progress", "resolved"].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)} style={{
                flex: 1, padding: "5px 0", borderRadius: 7, border: "none",
                background: statusFilter === f ? accentLight : "transparent",
                fontFamily: "DM Sans", fontSize: 11, fontWeight: 600,
                color: statusFilter === f ? "#fff" : T.lightGray, cursor: "pointer",
                transition: "all 0.15s",
              }}>{f === "all" ? "Tous" : f === "open" ? "Ouverts" : f === "in_progress" ? "En cours" : "Résolus"}</button>
            ))}
          </div>

          {/* Ticket entries */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", fontFamily: "DM Sans", fontSize: 13, color: T.lightGray }}>Aucun ticket</div>}
            {filtered.map(t => {
              const active = selectedTicketId === t.id;
              const pc = priorityConfig[t.priority];
              return (
                <div key={t.id} onClick={() => setSelectedTicketId(t.id)}
                  style={{
                    padding: "12px 14px", cursor: "pointer",
                    background: active ? T.bgPage : "transparent",
                    borderLeft: active ? `3px solid ${accentLight}` : "3px solid transparent",
                    borderBottom: `1px solid ${T.border}08`,
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = `${T.bgPage}80`; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <Avatar initials={t.avatar} size={34} bg={accentGrad} />
                      {t.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: T.success, border: `2px solid ${T.white}` }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: T.navy }}>{t.name}</span>
                        <span style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray, flexShrink: 0 }}>{t.time}</span>
                      </div>
                      <div style={{ fontFamily: "DM Sans", fontSize: 11.5, color: T.gray, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{t.subject}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, marginLeft: 44 }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: 9, color: accentLight, fontWeight: 600, opacity: 0.7 }}>{t.id}</span>
                    <div style={{ width: 3, height: 3, borderRadius: "50%", background: T.border }} />
                    <span style={{ fontFamily: "DM Sans", fontSize: 10, color: T.white, background: `${accentLight}BB`, borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>{categoryLabels[t.category] || t.category}</span>
                    {t.priority === "high" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.red, flexShrink: 0 }} />}
                    {t.unread > 0 && <span style={{ marginLeft: "auto", background: T.red, color: "#fff", fontFamily: "DM Mono", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "1px 5px", minWidth: 14, textAlign: "center" }}>{t.unread}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ PANEL 2: CHAT (center, wide) ═══ */}
        {!selectedTicket ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, background: T.bgPage }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: T.surfaceCard, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {I.chat(T.border, 34)}
            </div>
            <span style={{ fontFamily: "Manrope", fontSize: 16, color: T.lightGray, fontWeight: 600 }}>Sélectionnez un ticket</span>
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.border }}>{filtered.length} ticket{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</span>
          </div>
        ) : (
          <>
            {/* Chat panel */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, borderRight: `1px solid ${T.border}` }}>
              {/* Compact chat header */}
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, background: T.white, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <Avatar initials={selectedTicket.avatar} size={32} bg={accentGrad} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "DM Sans", fontWeight: 700, fontSize: 14, color: T.navy }}>{selectedTicket.name}
                    {selectedTicket.metier && <span style={{ fontWeight: 400, color: T.lightGray, fontSize: 12 }}> · {selectedTicket.metier}</span>}
                  </div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 11, color: T.gray, marginTop: 1 }}>{selectedTicket.subject}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Badge color={priorityConfig[selectedTicket.priority].color} bg={priorityConfig[selectedTicket.priority].bg}>{priorityConfig[selectedTicket.priority].label}</Badge>
                  <Badge color={ticketStatusConfig[selectedTicket.status].color} bg={ticketStatusConfig[selectedTicket.status].bg}>{ticketStatusConfig[selectedTicket.status].label}</Badge>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8, background: T.bgPage, minHeight: 0 }}>
                {selectedTicket.messages.map((m, i) => {
                  const showDateSep = i === 0 || m.date !== selectedTicket.messages[i - 1].date;
                  const isAdmin = m.from === "admin";
                  return (
                    <div key={i}>
                      {showDateSep && (
                        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0 14px" }}>
                          <div style={{ flex: 1, height: 1, background: T.border }} />
                          <span style={{ fontFamily: "DM Mono", fontSize: 10, color: T.lightGray, flexShrink: 0 }}>{m.date}</span>
                          <div style={{ flex: 1, height: 1, background: T.border }} />
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: isAdmin ? "flex-end" : "flex-start", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "70%", flexDirection: isAdmin ? "row-reverse" : "row" }}>
                          {!isAdmin && <Avatar initials={selectedTicket.avatar} size={26} bg={accentGrad} />}
                          <div>
                            <div style={{
                              padding: "10px 14px", borderRadius: 16,
                              borderTopLeftRadius: isAdmin ? 16 : 4,
                              borderTopRightRadius: isAdmin ? 4 : 16,
                              background: isAdmin ? T.deepForest : T.white,
                              color: isAdmin ? "#fff" : T.navy,
                              border: isAdmin ? "none" : `1px solid ${T.border}`,
                              fontFamily: "DM Sans", fontSize: 13, lineHeight: 1.55,
                              boxShadow: isAdmin ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
                            }}>
                              {m.text}
                            </div>
                            <div style={{ fontFamily: "DM Mono", fontSize: 9, color: T.lightGray, marginTop: 4, textAlign: isAdmin ? "right" : "left", paddingLeft: isAdmin ? 0 : 4, paddingRight: isAdmin ? 4 : 0 }}>{m.time}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={msgEndRef} />
              </div>

              {/* Input bar */}
              {selectedTicket.status !== "resolved" && selectedTicket.status !== "closed" ? (
                <div style={{ padding: "12px 18px", borderTop: `1px solid ${T.border}`, background: T.white, flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", background: T.bgPage, borderRadius: 12, padding: "6px 8px 6px 14px" }}>
                    <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Répondre au ticket..." style={{ flex: 1, border: "none", background: "none", fontFamily: "DM Sans", fontSize: 13, color: T.navy, outline: "none", padding: "6px 0" }} />
                    <button style={{ width: 34, height: 34, borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{I.attach(T.sageGray, 16)}</button>
                    <button onClick={sendMsg} style={{
                      width: 36, height: 36, borderRadius: 10, border: "none",
                      background: msgInput.trim() ? T.deepForest : T.border,
                      cursor: msgInput.trim() ? "pointer" : "default",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      transition: "background 0.2s",
                    }}>
                      {I.send(msgInput.trim() ? "#fff" : T.lightGray, 15)}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "14px 18px", borderTop: `1px solid ${T.border}`, background: `${T.success}08`, textAlign: "center", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {I.check(T.success, 14)}
                  <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.success, fontWeight: 600 }}>Ticket résolu</span>
                  <span style={{ fontFamily: "DM Sans", fontSize: 11, color: T.lightGray }}>·</span>
                  <button onClick={() => updateTicketStatus("open")} style={{ fontFamily: "DM Sans", fontSize: 12, color: T.forest, fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Réouvrir</button>
                </div>
              )}
            </div>

            {/* ═══ PANEL 3: TICKET INFO SIDEBAR (right) ═══ */}
            <div style={{ width: 260, display: "flex", flexDirection: "column", background: T.white, flexShrink: 0, overflowY: "auto" }}>
              {/* Profile card */}
              <div style={{ padding: "20px 18px", borderBottom: `1px solid ${T.border}`, textAlign: "center" }}>
                <Avatar initials={selectedTicket.avatar} size={52} bg={accentGrad} />
                <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: T.navy, marginTop: 10 }}>{selectedTicket.name}</div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, color: selectedTicket.online ? T.success : T.lightGray, marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: selectedTicket.online ? T.success : T.lightGray }} />
                  {selectedTicket.online ? "En ligne" : "Hors ligne"}
                </div>
                {selectedTicket.metier && <Badge color={T.deepForest}>{selectedTicket.metier}</Badge>}
                <button style={{ marginTop: 12, width: "100%", padding: "7px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, color: T.forest, cursor: "pointer" }}>Voir le profil complet</button>
              </div>

              {/* Ticket details */}
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Détails du ticket</div>
                {[
                  { label: "ID", value: selectedTicket.id, mono: true },
                  { label: "Ouvert le", value: selectedTicket.date },
                  { label: "Catégorie", value: categoryLabels[selectedTicket.category] || selectedTicket.category },
                  { label: "Priorité", value: priorityConfig[selectedTicket.priority].label, color: priorityConfig[selectedTicket.priority].color },
                  { label: "Assigné à", value: selectedTicket.assignee || "Non assigné", color: selectedTicket.assignee ? T.navy : T.red },
                ].map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                    <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray }}>{d.label}</span>
                    <span style={{ fontFamily: d.mono ? "DM Mono" : "DM Sans", fontSize: 12, fontWeight: 600, color: d.color || T.navy }}>{d.value}</span>
                  </div>
                ))}
                {selectedTicket.mission && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                    <span style={{ fontFamily: "DM Sans", fontSize: 12, color: T.lightGray }}>Mission</span>
                    <span style={{ fontFamily: "DM Mono", fontSize: 11, color: T.forest, fontWeight: 600, background: `${T.forest}10`, borderRadius: 5, padding: "2px 8px" }}>{selectedTicket.mission}</span>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: T.lightGray, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Actions</div>
                {selectedTicket.status !== "resolved" && (
                  <button onClick={() => updateTicketStatus("resolved")} style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: "none", background: T.success, color: "#fff", fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {I.check("#fff", 14)} Marquer comme résolu
                  </button>
                )}
                {selectedTicket.status === "resolved" && (
                  <button onClick={() => updateTicketStatus("open")} style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: `1px solid ${T.forest}`, background: T.white, color: T.forest, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Réouvrir le ticket</button>
                )}
                {selectedTicket.status === "open" && (
                  <button onClick={() => updateTicketStatus("in_progress")} style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: `1px solid ${T.gold}50`, background: `${T.gold}08`, color: T.gold, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Prendre en charge</button>
                )}
                {!selectedTicket.assignee && (
                  <button style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, color: T.navy, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>M'assigner ce ticket</button>
                )}
                <button style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, color: T.gray, fontFamily: "DM Sans", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Transférer</button>
                {selectedTicket.priority !== "high" && (
                  <button style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: `1px solid ${T.red}25`, background: `${T.red}05`, color: T.red, fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Escalader</button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ━━━ MAIN APP ━━━ */
export default function NovaAdmin() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(null);

  const currentRole = ROLES[role];

  const allPages = {
    dashboard: <DashboardPage setPage={setPage} role={role} />,
    chat: <ChatPage />,
    chat_clients: <ChatClientsPage />,
    chat_artisans: <ChatArtisansPage />,
    fraud: <FraudPage />,
    documents: <DocumentsPage />,
    interventions: <InterventionsPage />,
    search_docs: <SearchDocsPage />,
    artisans: <ArtisansPage />,
    payments: <PaymentsPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  };

  /* ━━━ ROLE SELECTION SCREEN ━━━ */
  if (!role) {
    return (
      <div style={{ minHeight: "100vh", background: T.sidebarBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans" }}>
        <div style={{ width: "100%", maxWidth: 800, padding: 40 }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: "-1px" }}>
              Arti<span style={{ color: T.lightSage }}>Safe</span>
            </div>
            <div style={{ fontFamily: "DM Mono", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 8, letterSpacing: "2px", textTransform: "uppercase" }}>Plateforme d'administration</div>
          </div>

          {/* Role cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {Object.values(ROLES).map(r => (
              <div key={r.key}
                onClick={() => { setRole(r.key); setPage(r.defaultPage); }}
                style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "28px 24px",
                  border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = `${r.color}60`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${r.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {r.icon(r.color, 24)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: "#fff" }}>{r.label}</div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{r.user.name}</div>
                  </div>
                </div>
                <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: "0 0 16px" }}>{r.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {r.pages.slice(0, 4).map(p => (
                    <span key={p} style={{ fontFamily: "DM Mono", fontSize: 10, color: `${r.color}AA`, background: `${r.color}15`, borderRadius: 5, padding: "3px 8px" }}>
                      {NAV_ITEMS_ALL[p]?.label || p}
                    </span>
                  ))}
                  {r.pages.length > 4 && <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "rgba(255,255,255,0.3)", padding: "3px 8px" }}>+{r.pages.length - 4}</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32, fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            Sélectionnez votre profil pour accéder à l'espace d'administration
          </div>
        </div>
      </div>
    );
  }

  /* ━━━ MAIN LAYOUT ━━━ */
  const navItems = currentRole.pages.map(p => NAV_ITEMS_ALL[p]).filter(Boolean);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bgPage, fontFamily: "DM Sans, sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: 240, background: T.sidebarBg, display: "flex", flexDirection: "column",
        padding: "0", flexShrink: 0, position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.5px" }}>
            Arti<span style={{ color: T.lightSage }}>Safe</span>
          </div>
          <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "1.5px", textTransform: "uppercase" }}>{currentRole.short}</div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => {
            const active = page === item.key;
            const hovered = sidebarHover === item.key;
            return (
              <button key={item.key}
                onClick={() => setPage(item.key)}
                onMouseEnter={() => setSidebarHover(item.key)}
                onMouseLeave={() => setSidebarHover(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10, border: "none",
                  background: active ? T.sidebarActive : hovered ? T.sidebarHover : "transparent",
                  cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "left",
                }}>
                {item.icon(active ? T.lightSage : "rgba(255,255,255,0.4)", 18)}
                <span style={{
                  fontFamily: "DM Sans", fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,0.55)",
                }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    marginLeft: "auto", background: item.key === "fraud" ? T.red : T.forest,
                    color: "#fff", fontFamily: "DM Mono", fontSize: 10, fontWeight: 600,
                    borderRadius: 8, padding: "2px 7px", minWidth: 18, textAlign: "center",
                  }}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* User */}
        <div style={{ padding: "16px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={currentRole.user.initials} size={34} bg={`linear-gradient(135deg, ${currentRole.color}, ${T.sage})`} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, color: "#fff" }}>{currentRole.user.name}</div>
            <div style={{ fontFamily: "DM Sans", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{currentRole.user.email}</div>
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => { setRole(null); setPage(null); }}>{I.logout(T.red, 16)}</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 240 }}>
        {/* Top bar */}
        <div style={{
          padding: "16px 32px", background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: T.bgPage, borderRadius: 10, padding: "8px 14px", width: 320 }}>
            {I.search()}
            <input placeholder="Recherche globale..." style={{ flex: 1, border: "none", background: "none", fontFamily: "DM Sans", fontSize: 13, color: T.navy, outline: "none" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge color={currentRole.color}>{currentRole.short}</Badge>
            <div style={{ position: "relative", cursor: "pointer" }}>
              {I.bell(T.gray, 20)}
              <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: T.red, border: `2px solid ${T.white}` }} />
            </div>
            <div style={{ fontFamily: "DM Mono", fontSize: 12, color: T.lightGray }}>18 mars 2026</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "28px 32px" }}>
          {allPages[page] || <div style={{ fontFamily: "DM Sans", fontSize: 14, color: T.lightGray }}>Page non disponible pour ce rôle</div>}
        </div>
      </div>
    </div>
  );
}
