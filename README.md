# Delizio — PWA Réappro Cuisine

PWA simple et mobile-first pour le réapprovisionnement quotidien d'une pizzeria.
L'employé tape sur des grandes cartes produits, ajuste la quantité, et envoie la
liste sur WhatsApp en un clic. Plusieurs tablettes / téléphones voient la même
liste **en temps réel** (sync Supabase).

## Fonctionnalités V1

- Catalogue par catégories (Fromages, Viandes, Légumes, Sauces, Condiments,
  Desserts, Emballages) avec grandes cartes photo cliquables.
- Quantités rapides : `+1` `+2` `+5` `Autre` + remarque facultative.
- Liste du jour partagée entre tous les appareils (sync temps réel).
- Envoi WhatsApp avec message prérempli (FR ou AR).
- Historique des listes envoyées, réutilisables en un clic.
- Ajout / suppression de produits depuis l'app, avec photo (caméra ou galerie).
- Plusieurs numéros WhatsApp configurables, un par défaut.
- Logo configurable (Réglages → Logo).
- Bilingue Français / العربية avec passage automatique en RTL.
- PWA installable, fonctionne hors ligne en lecture.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS (couleurs Delizio noir / blanc / rouge)
- Zustand (state)
- React Router 6
- react-i18next (FR + AR avec RTL)
- vite-plugin-pwa (manifest + service worker)
- **Supabase** (Postgres + Storage + Realtime) — pas de backend à coder

---

## 1. Configurer Supabase (5 minutes, une seule fois)

1. Crée un compte gratuit sur <https://supabase.com> et un nouveau projet
   (région la plus proche : `eu-west-3` Paris).
2. Dans **SQL Editor**, ouvre le fichier `supabase/migrations/001_init.sql` du
   repo, copie-colle tout, puis clique **Run**. Ça crée les tables, les
   politiques d'accès et insère les ~80 produits de départ + le numéro
   WhatsApp `+33 6 46 24 20 99` comme contact par défaut.
3. Dans **Storage**, crée un bucket :
   - Nom : `delizio`
   - **Public bucket : ON** (coche la case)
   - Clique **Create**.
4. Dans **Project Settings → API**, copie :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

> ⚠️ V1 : l'accès est ouvert (`anon` peut tout faire). C'est OK pour un outil
> interne avec une URL privée. Avant de publier l'URL largement, ajoute une
> auth simple (Supabase Auth ou un PIN code).

---

## 2. Lancer en local

```bash
cp .env.example .env.local
# puis édite .env.local avec tes clés Supabase

npm install
npm run dev
```

Ouvre <http://localhost:5173>. Sur ton tel sur le même WiFi :
<http://IP-DE-TON-PC:5173>.

---

## 3. Déployer sur Vercel (gratuit)

1. Push ce repo sur GitHub.
2. Sur <https://vercel.com>, **New Project → Import** ton repo.
3. Dans **Environment Variables**, ajoute :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Tu auras une URL `https://delizio.vercel.app`.
5. Sur la tablette de cuisine : ouvre l'URL dans Chrome / Safari → menu →
   **Ajouter à l'écran d'accueil**. C'est installé comme une vraie app.

---

## 4. Structure des fichiers

```
src/
├── main.tsx, App.tsx
├── lib/
│   ├── supabase.ts       client + bucket
│   ├── whatsapp.ts       construction du message + lien wa.me
│   ├── image.ts          compression photo côté client
│   └── i18n.ts           FR/AR + bascule RTL
├── locales/{fr,ar}.json
├── store/                Zustand : products, today (realtime), history, contacts, settings
├── components/           Header, BottomNav, ProductCard, QuantitySheet, PhotoPicker
├── routes/               Catalog, TodayList, History, HistoryDetail, AddProduct, Settings
└── types.ts

supabase/migrations/001_init.sql   tout le schéma + seed à coller dans Supabase
```

---

## 5. Premiers usages

- **Ajouter une photo à un produit existant** : ouvre la page **Produits**,
  appuie sur la carte → la liste s'incrémente. Pour modifier la photo, supprime
  le produit (appui long sur la carte) et re-crée-le avec photo.
  *(une page d'édition produit pourra venir en V1.1)*
- **Numéros WhatsApp** : Réglages → Contacts. Tu peux en ajouter autant que tu
  veux et changer le défaut.
- **Logo** : Réglages → Logo → Changer le logo (caméra ou fichier). Il
  s'affiche dans le header sur tous les appareils.
- **Langue** : Réglages → bouton Français / العربية. La direction passe en RTL
  automatiquement pour l'arabe.

---

## 6. Roadmap (pas dans la V1)

- Édition d'un produit existant (renommer, changer photo)
- Auth simple (PIN code) avant de mettre en ligne publique
- Dictée vocale (`webkitSpeechRecognition`) pour ajouter à la liste mains sales
- Export historique CSV
