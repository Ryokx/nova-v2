# Nova — Mémoire projet

## Identité
- **Nom** : Nova
- **Ancien nom** : ArtiSafe (renommé en mars 2026)
- **Type** : Plateforme de mise en relation particuliers / artisans certifiés
- **Différenciant** : Paiement par séquestre (l'argent est bloqué jusqu'à validation de l'intervention)

## Stack technique
- **Framework** : Next.js 14+ (App Router) + TypeScript strict
- **Style** : Tailwind CSS (design tokens custom)
- **Base de données** : PostgreSQL + Prisma ORM
- **Auth** : NextAuth.js (Google, Apple, Credentials)
- **Paiement** : Stripe Connect (séquestre via capture différée)
- **Upload** : Cloudflare R2
- **Email** : Resend + React Email
- **Temps réel** : Pusher
- **Deploy** : Vercel + Neon (PostgreSQL)

## Design system
### Couleurs
- `deepForest` : #0A4030 (CTA principaux, fond boutons)
- `forest` : #1B6B4E (accent principal, liens, icônes)
- `sage` : #2D9B6E (accent secondaire, hovers)
- `lightSage` : #8ECFB0 (texte sur fond sombre)
- `gold` : #F5A623 (warnings, badges, étoiles, accent doré)
- `navy` : #0A1628 (texte principal)
- `red` : #E8302A (erreurs, urgences, destructif)
- `success` : #22C88A (validations, check)
- `bgPage` : #F5FAF7 (fond de page)
- `surface` : #E8F5EE (fond cartes secondaires)
- `border` : #D4EBE0 (bordures)
- `grayText` : #6B7280 (texte secondaire)

### Typographie
- **Titres** : Manrope (700, 800)
- **Corps** : DM Sans (400, 500, 600)
- **Données chiffrées** : DM Mono (500, 700)

### Composants
- Coins arrondis : 8/12/16/20/28px
- Avatars : initiales sur fond gradient vert
- Cards : fond blanc, border subtle, shadow sm, radius 20px
- Boutons : radius 14px, font-weight 700, hover translateY(-2px)

## Architecture fichiers
```
/src
  /app
    /(public)         — landing, login, signup, support
    /(client)         — dashboard, artisans, booking, missions, tracking...
    /(artisan)        — dashboard, devis, factures, clients, compta...
    /(admin)          — gestion, litiges, KPIs
    /api              — routes API
  /components
    /ui               — Button, Card, Badge, Input, Modal, Toast, Skeleton...
    /layout           — Navbar, Footer, Sidebar
    /features         — EscrowStepper, StarRating, ArtisanCard, MissionCard...
  /lib
    /db.ts            — Prisma client
    /auth.ts          — NextAuth config
    /stripe.ts        — Stripe Connect helpers
    /upload.ts        — R2 upload helpers
    /email.ts         — Resend helpers
  /prisma
    /schema.prisma
    /seed.ts
  /types              — TypeScript types globaux
  /hooks              — useToast, useDebounce, useMobile...
```

## Modèle économique
- Commission 5% sur chaque transaction (prélevée sur le séquestre)
- Forfait Expert artisan (fonctionnalités premium)
- Paiement fractionné 3x/4x via Klarna (Klarna gère, Nova reçoit 100%)
- Contrats entretien annuels (chaudière, clim, plomberie, pack sérénité)

## Règles métier importantes
- Le client paie 100% à la signature du devis → argent en séquestre
- L'artisan est payé uniquement APRÈS validation par le client
- Les documents artisan obligatoires : SIRET, décennale, pièce d'identité
- Les documents facultatifs : RGE, Qualibat, Kbis
- Pas d'estimation de prix sur les profils (peut tromper le client)
- Pas de fausses statistiques (pas de chiffres inventés sur les landings)
- Le nom est "Nova", jamais "ArtiSafe" (ancien nom abandonné)

## Fichiers de référence
Les prototypes JSX dans `/reference/` sont la source de vérité pour :
- Le design exact de chaque page/écran
- Les parcours utilisateur
- Les données mockées (noms d'artisans, missions, montants)
- Les micro-interactions et animations

## Git workflow
- Branch `main` : production
- Branch `dev` : développement
- Branches features : `feat/nom-feature`
- Commits conventionnels : feat:, fix:, chore:, docs:, test:
- Mettre à jour CHANGELOG.md après chaque phase

## Scores actuels (audit mars 2026)
- UX/UI : 78/100
- Marketing : 72/100
- SEO : 28/100 (priorité critique — résolu par Next.js SSR)
- Technique : 82/100
- Global : 65/100
- Cible Phase 2 : 82/100
