# UCI Instagram Tracker — Scripts locaux

Ce dossier contient deux scripts Python qui travaillent ensemble pour collecter les followers Instagram et les pousser automatiquement vers le dashboard UCI.

| Fichier | Rôle |
|---|---|
| `instagram_tracker.py` | Script de scraping. Parcourt les 71 comptes Instagram via Playwright et récupère le **nombre exact** (non arrondi) de followers. Sauvegarde en Excel et pousse dans le Gist GitHub du dashboard. |
| `tracker_server.py` | Mini serveur HTTP local (sur `http://127.0.0.1:8765`). Permet au bouton "Instagram" du dashboard de déclencher `instagram_tracker.py` en un clic. |

**Coût : 0 €** — Tout est local et gratuit, pas d'API payante.

---

## 🎯 Comment ça marche

Le dashboard est hébergé sur GitHub Pages et ne peut pas lancer directement des programmes sur votre PC (sécurité du navigateur). On contourne ce problème avec un petit serveur HTTP local :

```
[Dashboard UCI sur mathbrn.github.io]
         │
         │  1. Clic sur "Instagram"
         │  2. fetch http://127.0.0.1:8765/scrape/instagram
         ▼
[tracker_server.py — en tâche de fond sur votre PC]
         │
         │  3. Lance instagram_tracker.py
         │  4. Scrape les 71 comptes via Playwright
         │  5. Pousse les données vers le Gist public
         ▼
[Gist GitHub public]
         │
         │  6. Le dashboard recharge le Gist
         ▼
[Vous + vos collègues voient les nouvelles données]
```

**Ce que vos collègues voient** : ils n'ont rien à installer. Ils ouvrent simplement le dashboard et voient les données à jour. Seul le PC de la personne qui collecte (vous) doit faire tourner le serveur local.

---

## 📥 Installation (une seule fois)

### 1. Installer Python

1. Allez sur [python.org/downloads](https://www.python.org/downloads/) (**PAS** le Microsoft Store)
2. Cliquez sur le bouton jaune **"Download Python 3.x.x"**
3. Lancez le fichier téléchargé
4. **IMPORTANT** : cochez la case **"Add python.exe to PATH"** en bas de la première fenêtre
5. Cliquez sur **"Install Now"**
6. À la fin, cliquez sur **"Disable path length limit"** si proposé

### 2. Installer les librairies

Ouvrez une **Invite de commandes** (tapez "cmd" dans la barre de recherche Windows) et lancez ces 3 commandes, une par une :

```
pip install playwright
pip install openpyxl
python -m playwright install chromium
```

### 3. Télécharger les scripts

1. Créez un dossier sur votre Bureau, par exemple : **Trackers**
2. Téléchargez ces deux fichiers depuis le repo GitHub et placez-les dans le dossier :
   - `instagram_tracker.py`
   - `tracker_server.py`

### 4. Configurer les variables pour le Gist

Pour que le script pousse les données vers le dashboard, il lui faut deux infos :
- `UCI_GIST_ID` — l'ID du Gist public créé par le dashboard
- `UCI_GIST_TOKEN` — votre PAT GitHub avec scope `gist`

Créez un fichier `start_server.bat` à côté des scripts, avec ce contenu (remplacez les valeurs) :

```bat
@echo off
set UCI_GIST_ID=votre-gist-id-ici
set UCI_GIST_TOKEN=github_pat_xxxxxxxxxxxxxxxxxx
cd /d "%~dp0"
python tracker_server.py
pause
```

> 💡 Pour retrouver votre `UCI_GIST_ID` : ouvrez [gist.github.com](https://gist.github.com) connecté avec votre compte, le Gist s'appelle "UCI Social Dashboard data sync". L'ID est la chaîne qui apparaît dans l'URL après votre nom d'utilisateur.

---

## ▶️ Utilisation au quotidien

### Lancer le serveur

Double-cliquez sur `start_server.bat`. Une fenêtre console s'ouvre et affiche :

```
============================================================
🚴  UCI Tracker Server v1.0.0
============================================================
📂 Répertoire            : C:\Users\...\Desktop\Trackers
🐍 Tracker Python        : instagram_tracker.py ✅
🌐 URL locale            : http://127.0.0.1:8765
☁️  Gist ID               : abcdef1234...
🔑 PAT GitHub            : défini ✅
============================================================
✨ Serveur prêt. Ouvrez le dashboard et cliquez sur Instagram.
   (Ctrl+C pour arrêter.)
```

**Laissez cette fenêtre ouverte** — tant qu'elle tourne, le dashboard peut déclencher des collectes.

### Déclencher une collecte depuis le dashboard

1. Ouvrez le dashboard : https://mathbrn.github.io/uci-social-dashboard/
2. Cliquez sur **"Actualiser"**
3. Sous le bouton Instagram, vous verrez **● Serveur local détecté** (point vert)
4. Cliquez sur **Instagram**
5. Le log du modal affiche les lignes en temps réel (chaque compte scrapé + son nombre de followers)
6. ~90 secondes plus tard : "🏁 Terminé" et le dashboard est automatiquement mis à jour

Un fichier `historique_followers.xlsx` est également créé/mis à jour dans le dossier Trackers pour garder un historique local.

### Utiliser le script sans dashboard (mode direct)

Vous pouvez aussi lancer le scraping sans passer par le dashboard. Double-cliquez sur un second batch (ou ajoutez ceci à `start_server.bat` à la place de la dernière ligne) :

```bat
python instagram_tracker.py
```

---

## 🚀 Démarrage automatique au login Windows

Pour ne plus avoir à lancer `start_server.bat` manuellement à chaque démarrage de votre PC :

### Méthode 1 — Dossier Démarrage (simple)

1. Appuyez sur **Win + R**
2. Tapez `shell:startup` et Entrée
3. Un dossier s'ouvre — copiez-y un **raccourci** vers `start_server.bat` (clic droit sur le .bat → Créer un raccourci, puis déplacez le raccourci dans le dossier Démarrage)

Le serveur démarrera automatiquement à chaque ouverture de session Windows.

### Méthode 2 — Planificateur de tâches (plus propre, sans fenêtre visible)

1. Tapez **"Planificateur de tâches"** dans la barre de recherche
2. Cliquez sur **"Créer une tâche de base"**
3. Nom : `UCI Tracker Server`
4. Déclencheur : **"Quand j'ouvre une session"**
5. Action : **"Démarrer un programme"**
   - **Programme/script** : `C:\Users\VOTRE_NOM\Desktop\Trackers\start_server.bat`
6. Dans les propriétés avancées : cochez **"Masqué"** si vous voulez que la fenêtre ne s'affiche pas

---

## 🔧 Dépannage

### Le dashboard affiche "● Serveur local absent"

Le serveur n'est pas lancé ou n'est pas atteignable.
- Vérifiez que `start_server.bat` tourne bien (une fenêtre console ouverte)
- Vérifiez que le port 8765 n'est pas bloqué par le pare-feu Windows (au premier lancement, Windows demande une autorisation — acceptez "Réseaux privés")
- Testez manuellement dans votre navigateur : ouvrez `http://127.0.0.1:8765/status`, vous devriez voir `{"status":"ok",...}`

### "python n'est pas reconnu"

Python n'est pas dans le PATH. Désinstallez-le depuis **Paramètres → Applications**, puis réinstallez-le en cochant bien **"Add python.exe to PATH"** à la première étape.

### Playwright ne s'installe pas

- Lancez toujours `python -m playwright install chromium` avec `python -m` devant
- Si vous êtes sur un PC d'entreprise avec un proxy, il se peut que le téléchargement soit bloqué — contactez votre IT ou essayez depuis chez vous d'abord

### Beaucoup de comptes affichent N/A

Instagram bloque peut-être le scraping en mode headless. Ouvrez `instagram_tracker.py` avec le Bloc-notes et changez :
```python
HEADLESS = True
```
en :
```python
HEADLESS = False
```
Vous verrez le navigateur s'ouvrir pendant la collecte et pourrez identifier le blocage (login wall, captcha, etc.).

### Les chiffres sont arrondis (ex: 1.5M au lieu de 1 523 456)

Le script est configuré pour refuser les arrondis : si aucune stratégie d'extraction exacte ne fonctionne, il renvoie N/A plutôt qu'un chiffre arrondi. Si cela arrive souvent :
- Instagram a peut-être changé son HTML — ouvrez une issue sur le repo
- Essayez en mode non-headless pour voir ce que retourne la page

### Erreur CORS dans la console du navigateur

Le serveur autorise `https://mathbrn.github.io`. Si vous utilisez une autre URL (par exemple, vous hébergez le dashboard ailleurs), modifiez la constante `ALLOWED_ORIGINS` dans `tracker_server.py`.

---

## 🔍 Vérifier qu'une donnée est correcte

Après une collecte, vous pouvez :
1. Ouvrir `historique_followers.xlsx` pour voir l'historique complet
2. Comparer avec Instagram directement (aller sur un profil, cliquer sur "Followers" → le nombre exact s'affiche dans la modale)
3. Le script essaie dans l'ordre : `edge_followed_by.count` (exact), `follower_count` (exact), `userInteractionCount` en JSON-LD (exact), puis l'attribut `title` d'un lien `/followers/` (exact). Il ne tombe **jamais** sur une valeur arrondie.

---

## 📝 Ajouter un nouveau compte à suivre

Ouvrez `instagram_tracker.py` et trouvez la section `ENTITIES`. Ajoutez une entrée :

```python
{"nom": "Mon Équipe", "cl": "France", "ig": "nom_du_compte_ig"},
```

Placez-la dans la bonne section (Équipes hommes / Équipes femmes / Courses hommes / Courses femmes). Si vous voulez aussi que ce compte apparaisse dans le dashboard, ajoutez-le également dans `index.html` (arrays `TM`, `TW`, `RM`, `RW`).
