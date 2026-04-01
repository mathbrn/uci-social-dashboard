# 🚴 UCI Social Media Dashboard — 2026

Dashboard centralisé de suivi des followers sur les réseaux sociaux des courses et équipes UCI WorldTour / Women's WorldTour.

## 🌐 Accès en ligne

➡️ **[Ouvrir le Dashboard](https://<VOTRE-USERNAME>.github.io/uci-social-dashboard/)**

## 📊 Fonctionnalités

- **2 onglets** : Courses / Équipes
- **2 sous-dashboards** : Hommes / Femmes (switchable)
- **5 sous-onglets** : Overall, Facebook, Instagram, X, TikTok (avec logos)
- **Tableau mensuel** : suivi Avril → Décembre avec nombres exacts non-arrondis
- **Vue Évolution** : graphique en barres horizontales (Top 10)
- **Filtres courses** : Toutes / Grands Tours / Étapes / 1 jour
- **Badges** : Grand Tour (orange), 2.UWT (violet), 1.UWT (vert)
- **Drapeaux SVG** pour chaque pays
- **Couleurs maillot** pour chaque équipe
- **Dark/Light mode**
- **Données persistantes** (localStorage)

## 🔄 Collecte des données (chaque 1er du mois)

### Étape 1 — Collecter les followers Instagram

1. Ouvrir **https://www.instagram.com** dans Chrome
2. `Ctrl+Shift+J` pour ouvrir la console
3. Copier-coller le contenu de **`collecteur_instagram.js`** dans la console
4. Appuyer sur Entrée et attendre ~2-3 minutes
5. Un fichier `uci_instagram_AAAA-MM.json` se télécharge automatiquement

### Étape 2 — Importer dans le dashboard

1. Ouvrir le dashboard (lien GitHub Pages ci-dessus)
2. Cliquer **📁 Importer JSON**
3. Sélectionner le fichier `.json` téléchargé
4. Les données apparaissent dans le tableau

## 📁 Structure

```
├── index.html                  # Dashboard principal
├── collecteur_instagram.js     # Script de collecte Instagram
└── README.md                   # Ce fichier
```

## 🚀 Mise en place

1. Créez un nouveau repo GitHub : `uci-social-dashboard`
2. Poussez ces fichiers
3. Allez dans **Settings → Pages → Source: Deploy from a branch → main → / (root)**
4. Le dashboard sera accessible à : `https://<username>.github.io/uci-social-dashboard/`

## 📝 Modifications

Modifiez directement `index.html` sur GitHub ou en local. Les changements seront reflétés automatiquement sur GitHub Pages après quelques minutes.
