# La Pétanquerie — Mobile-First WebApp

WebApp React mobile-first pour **La Pétanquerie**, concept de pétanque indoor premium.

## Stack
- **Vite 5** + React 18
- **Tailwind CSS** (palette custom Pastis & Azur)
- **Framer Motion** (animations)
- **React Router v6**
- **Zustand** (state global)
- **React Leaflet** (carte de France)
- **qrcode.react** (QR codes d'accès)
- **Lucide React** (icônes)

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir http://localhost:5173 — l'app s'affiche en plein écran sur mobile, en "phone preview" centrée sur desktop.

## Pour le rendu mobile sur ton PC
1. Ouvre Chrome/Edge
2. F12 → mode responsive (Ctrl+Shift+M)
3. Choisis iPhone 14 Pro ou Pixel 7

## Build production
```bash
npm run build && npm run preview
```

## Structure
```
src/
  App.jsx            → routing (24 routes)
  components/        → Button, Card, Avatar, BottomSheet, ScoreCounter, Confetti, QRCodeCard, …
  pages/             → 22 pages (Splash, Onboarding, Home, Map, Salle, Partie, Profil, …)
  stores/useStore.js → store Zustand (user, salles, parties, ligues)
  data/              → mock data (10 salles, 28 joueurs, 3 ligues)
  assets/            → SVG custom (boule de pétanque, cochonnet)
  styles/            → CSS global + variables Pastis & Azur
```

## Parcours utilisateur testables
1. **Splash → Onboarding → Login** (auto-redirect après 2.5s)
2. **Home** : dashboard avec parties en cours, classement top 3, feed
3. **Carte** : Leaflet avec 10 salles cliquables → bottom sheet
4. **Salle** : terrains avec parties en cours, créer une partie
5. **Terrain** : écran d'attente avec slots joueurs animés
6. **Partie** : compteur de score animé (atteindre 13 = confettis)
7. **Résultat** : trophée doré + points de ligue
8. **Réservation** : récap → paiement → QR code
9. **Ligues** : classement avec médailles
10. **Profil** : QR pass abonné, stats détaillées (winrate, donut, barres), historique

## Identité visuelle "Pastis & Azur"
- Jaune Pastis `#F2C744`, Bleu Marseille `#1B4D8E`, Ocre Terre `#C4763C`
- Fond Sable `#FDF6E3` avec léger grain SVG noise
- Glassmorphism sur header + bottom tab bar
- Polices : Playfair Display (titres), DM Sans (UI), Space Mono (scores)

## User mocké
- **Lucas Durand** ("LuckyLuc") — abonné Gold — 42 parties, 28 victoires
- Login = n'importe quel email/password (mocké)
