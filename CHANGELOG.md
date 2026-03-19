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

### Phase 2 : Layout + Pages publiques
- [ ] Navbar responsive + Footer
- [ ] Page d'accueil (hero asymétrique + 7 sections)
- [ ] Login + Signup + Support
- [ ] SEO (metadata, sémantique, Schema.org)

### Phase 3 : Dashboard Client
- [ ] Dashboard + stats
- [ ] Recherche artisans + filtres
- [ ] Profil artisan + avis
- [ ] Booking 3 étapes
- [ ] Missions + tracking temps réel
- [ ] Signature devis + paiement
- [ ] Vidéo diagnostic
- [ ] Contrats entretien
- [ ] Parrainage
- [ ] Profil + paramètres

### Phase 4 : Dashboard Artisan
- [ ] Dashboard + KPIs
- [ ] Création devis + factures
- [ ] Documents + paiements
- [ ] Carnet clients
- [ ] QR code profil
- [ ] Comptabilité
- [ ] Notifications

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
