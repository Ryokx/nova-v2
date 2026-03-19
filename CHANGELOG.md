# Nova — Changelog

Toutes les modifications notables du projet sont documentées dans ce fichier.
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

---

## [Prototype] — Mars 2026

### Phase prototype (pré-Claude Code)
Prototypes JSX interactifs créés dans Claude.ai. Fichiers dans `/reference/`.

#### Interfaces créées
- `nova.jsx` — App mobile 36 écrans, 5 626 lignes
- `nova-web.jsx` — Site web 33 pages, 2 776 lignes
- `nova-landing.jsx` — Landing artisans, 1 443 lignes
- `nova-landing-client.jsx` — Landing particuliers, 950 lignes
- `nova-admin.jsx` — Dashboard admin, 3 353 lignes
- `nova-email-artisan.html` — Email HTML, 551 lignes
- `nova-logo.svg` — Logo wordmark + variantes

#### Documents stratégiques
- Briefing complet du projet
- Étude de marché France 2026
- Étude rentabilité premium artisans
- 8 audits (UX/UI, Marketing, SEO, Psychologie, Benchmark)
- Audit complet projet final (65/100)

#### Fonctionnalités prototypées
- Parcours client : onboarding, recherche, profil artisan, vidéo diagnostic, réservation, signature devis, paiement séquestre (1x/3x/4x Klarna), suivi temps réel, validation, contrats entretien, parrainage
- Parcours artisan : dashboard KPIs, devis, factures, planning, paiements, comptabilité (Pennylane/Indy/QuickBooks/Tiime), QR code profil, carnet clients, chat, mode sombre
- Admin : gestion utilisateurs, missions, litiges, paiements, KPIs
- SEO : meta tags, Schema.org, sitemap (landing artisans uniquement)
- Responsive : media queries, hamburger menu, grids adaptatives (site web)
- Design system : tokens unifiés, dark mode, 58 composants

#### Renommage
- ArtiSafe → Nova (192 occurrences remplacées sur 6 fichiers)

---

## [Unreleased] — Phase production (Claude Code)

### Phase 0 : Initialisation — 2026-03-19
- [x] Next.js 14.2 + TypeScript strict + Tailwind CSS 3 + Prisma 5
- [x] Design system Tailwind avec tokens Nova (couleurs, fonts, border-radius, shadows, animations)
- [x] Composants UI de base : Button (5 variants, 3 sizes), Card, Badge (5 variants), Avatar (initiales + image), Input/Textarea/Select (avec validation), Toast (notification system), Skeleton (loading), EmptyState, Modal (accessible)
- [x] ESLint 8 + Prettier + .env.example (toutes variables)
- [x] Schema Prisma (10 models : User, Account, Session, VerificationToken, ArtisanProfile, Document, Mission, Payment, Review)
- [x] Structure /src avec App Router, components/ui, lib, types, hooks, styles
- [x] Git init + premier commit

### Phase 1 : Base de données + Auth — 2026-03-19
- [x] Schema Prisma complet (12 models : User, ArtisanProfile, Mission, Devis, Payment, Invoice, Review, Notification, Message, MaintenanceContract, Referral, Document + Account/Session/VerificationToken pour NextAuth)
- [x] NextAuth.js (Google, Apple, Credentials avec bcrypt) + session JWT + PrismaAdapter
- [x] API routes : POST /api/auth/register (validation Zod), GET /api/auth/me, NextAuth [...nextauth]
- [x] Middleware de protection des routes (/dashboard, /artisan, /admin, /api sauf auth)
- [x] Helpers API : requireAuth, requireArtisan, requireClient, requireAdmin
- [x] Pages Login et Signup fidèles au prototype (SSO Google/Apple, formulaire credentials, mode démo, sélecteur de rôle, champs artisan conditionnels)
- [x] Validation Zod : registerSchema (nom, email, password 8+ chars + majuscule + chiffre), loginSchema
- [x] Seed data : 3 clients + 1 admin + 6 artisans, 5 missions, 3 devis, 5 paiements, 3 factures, 4 avis, 9 notifications, 4 messages, 1 contrat entretien, 2 parrainages, 18 documents

### Phase 2 : Layout + Navbar/Footer — 2026-03-19
- [x] Navbar responsive (desktop links + mobile hamburger, auth-aware, active route highlight)
- [x] Footer (4 colonnes, liens plateforme/compte/légal)
- [x] SessionProvider + ToastProvider wrapping root layout

### Phase 3 : Parcours client complet — 2026-03-19

#### API Routes (6 routes)
- [x] GET /api/artisans (filtres catégorie + recherche)
- [x] GET /api/artisans/[id] (profil détaillé + avis)
- [x] GET/POST /api/missions (liste + création)
- [x] GET/PATCH /api/missions/[id] (détail + update statut)
- [x] POST /api/payments (création paiement séquestre)
- [x] POST /api/reviews (notation + libération paiement)
- [x] GET/PATCH /api/notifications (liste + marquer lu)
- [x] GET/PATCH /api/devis/[id] (détail + signature)

#### Feature Components
- [x] EscrowStepper (timeline 4 étapes avec statut coloré)
- [x] StarRating (interactive + readonly, 3 tailles)
- [x] ArtisanCard (avatar, nom, métier, rating, tarif, badges)
- [x] MissionCard (artisan, type, montant, statut, date)
- [x] useFetch hook (data, loading, error, refetch)

#### Pages Client (17 pages)
- [x] /dashboard — 3 stats KPI, missions récentes, 4 quick actions
- [x] /artisans — Filtres catégorie, recherche, grille 2col/1col mobile
- [x] /artisan/[slug] — Profil complet, avis, CTA (chat, appeler, RDV, urgence)
- [x] /booking/[slug] — 3 étapes (calendrier, créneau+description, récapitulatif)
- [x] /missions — Onglets filtres (Toutes, En cours, Terminées, Validées, Litiges)
- [x] /tracking/[id] — Carte artisan, EscrowStepper temps réel, info séquestre
- [x] /mission/[id] — Détails, paiement, documents, validation + rating + confetti
- [x] /sign-devis/[id] — Récapitulatif lignes, canvas signature tactile
- [x] /payment/[id] — Choix méthode (CB/virement/Apple Pay), fractionnement 1x/3x/4x Klarna
- [x] /video-diagnostic — 3 étapes (tips, preview vidéo, confirmation envoi)
- [x] /entretien/[slug] — 4 plans (Chaudière/Clim/Plomberie/Pack Sérénité), souscription
- [x] /referral — Code copiable, 4 boutons partage, stats parrainages
- [x] /profile — Avatar, infos personnelles, quick links
- [x] /settings — Notifications toggle, sécurité (changement mdp), dark mode (soon)
- [x] /urgence — Sélection catégorie, artisans dispo immédiat
- [x] /notifications — Liste avec indicateur non-lu, marquer tout lu
- [x] /payment-methods — Cartes bancaires, Apple Pay, virement, sécurité

### Phase 4 : Parcours artisan complet — 2026-03-19

#### API Routes (4 routes)
- [x] GET /api/artisan/stats (revenus mois, missions actives, devis en attente, note, prochains RDV)
- [x] GET /api/artisan/clients (carnet clients groupé par client, stats CA)
- [x] GET/POST /api/devis (liste + création avec numérotation auto DEV-YYYY-NNN)
- [x] GET /api/invoices (liste factures artisan)

#### Pages Artisan (10 pages)
- [x] /artisan-dashboard — 4 KPI stats, alerte urgente, prochains RDV
- [x] /artisan-devis/new — Création devis 3 étapes (client, lignes dynamiques, envoi)
- [x] /artisan-invoices — Liste factures, lignes détaillées, export PDF
- [x] /artisan-documents — Onglets devis/factures, statuts (Brouillon, Envoyé, Accepté, Refusé, Payé)
- [x] /artisan-payments — 3 onglets (En séquestre collapsible + progress bar, Reçus, En attente)
- [x] /artisan-clients — 3 KPIs, recherche, liste clients avec contact + CA
- [x] /artisan-qr-code — QR code généré, boutons enregistrer/partager, 5 cas d'usage
- [x] /artisan-compta — 4 services (Pennylane/Indy/QuickBooks/Tiime), toggle auto-export, export CSV/PDF, récap mensuel
- [x] /artisan-profile — Infos perso + entreprise, certifications, 8 liens menu
- [x] /artisan-notifications — Types (urgence, devis, paiement, RDV, certification), indicateurs non-lu

### Phase 5 : Landings + Admin + Email
- [ ] Landing artisans (/devenir-partenaire)
- [ ] Landing particuliers (/comment-ca-marche)
- [ ] Dashboard admin complet
- [ ] Templates email (Resend)
- [ ] Pages légales (CGU, confidentialité, mentions)
- [ ] Sitemap + robots.txt

### Phase 6 : Intégrations
- [ ] Stripe Connect (séquestre réel)
- [ ] Cloudflare R2 (upload fichiers)
- [ ] Resend (emails transactionnels)
- [ ] Pusher (chat + temps réel)
- [ ] Stubs Klarna, Pennylane, Yousign

### Phase 7 : Tests + Deploy
- [ ] Tests unitaires (Jest + Testing Library)
- [ ] Tests E2E (Playwright)
- [ ] Audit Lighthouse (90+ cibles)
- [ ] Audit accessibilité (axe-core)
- [ ] CI/CD GitHub Actions
- [ ] Deploy Vercel + Neon
- [ ] Monitoring Sentry + Analytics
