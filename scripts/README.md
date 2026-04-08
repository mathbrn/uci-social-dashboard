# Instagram Followers Tracker

Script Python qui scrape automatiquement le nombre de followers Instagram des équipes et courses UCI WorldTour, et met à jour le dashboard.

**Coût : 0 €** — Utilise Playwright en local (pas d'API payante).

## Ce que fait le script

1. Parcourt 71 comptes Instagram (équipes hommes/femmes + courses hommes/femmes)
2. Récupère le nombre de followers de chaque compte via Playwright
3. **Sauvegarde** les chiffres dans `historique_followers.xlsx` (historique cumulatif)
4. **Pousse** (optionnel) les données dans le Gist public du dashboard → tous vos collègues voient la mise à jour automatiquement

Durée : ~90 secondes pour les 71 comptes.

---

## Installation (à faire une seule fois)

### 1. Installer Python

1. Allez sur [python.org/downloads](https://www.python.org/downloads/) (PAS le Microsoft Store)
2. Cliquez sur le bouton jaune **"Download Python 3.x.x"**
3. Lancez le fichier téléchargé
4. **IMPORTANT** : cochez la case **"Add python.exe to PATH"** en bas de la première fenêtre
5. Cliquez sur **"Install Now"**
6. À la fin, cliquez sur **"Disable path length limit"** si proposé, puis fermez

### 2. Installer les outils nécessaires

Ouvrez une **Invite de commandes** (tapez "cmd" dans la barre de recherche Windows) et lancez ces 3 commandes, une par une :

```
pip install playwright
pip install openpyxl
python -m playwright install chromium
```

### 3. Télécharger le script

1. Créez un dossier sur votre Bureau, par exemple : **Trackers**
2. Placez le fichier `instagram_tracker.py` dans ce dossier

---

## Utilisation basique (sans sync dashboard)

Ouvrez une Invite de commandes et lancez :

```
cd C:\Users\VOTRE_NOM\Desktop\Trackers
python instagram_tracker.py
```

Remplacez `VOTRE_NOM` par votre nom d'utilisateur Windows.

Le script tourne ~90 secondes et crée/met à jour `historique_followers.xlsx` dans le même dossier.

---

## Utilisation avec synchronisation du dashboard

Pour que les données soient automatiquement poussées vers le dashboard (visible par tous vos collègues), définissez deux variables d'environnement avant de lancer le script.

### Méthode 1 — Variables temporaires (session actuelle uniquement)

```
set UCI_GIST_ID=abcdef1234567890
set UCI_GIST_TOKEN=github_pat_xxxxxxxxxx
python instagram_tracker.py
```

### Méthode 2 — Script `.bat` (recommandé)

Créez un fichier `run_tracker.bat` à côté du script avec ce contenu :

```bat
@echo off
set UCI_GIST_ID=abcdef1234567890
set UCI_GIST_TOKEN=github_pat_xxxxxxxxxx
cd /d "%~dp0"
python instagram_tracker.py
pause
```

Puis double-cliquez sur `run_tracker.bat` pour lancer la collecte (pas besoin d'ouvrir l'invite de commandes).

### Où trouver `UCI_GIST_ID` et `UCI_GIST_TOKEN` ?

- **`UCI_GIST_TOKEN`** : votre PAT GitHub avec scope `gist` — le même que celui déjà configuré dans le dashboard.
- **`UCI_GIST_ID`** : ouvrez [gist.github.com](https://gist.github.com) connecté avec votre compte, ouvrez le Gist intitulé "UCI Social Dashboard data sync", l'ID est dans l'URL (la partie après votre nom d'utilisateur).

---

## Automatiser le lancement hebdomadaire

Pour que le script s'exécute automatiquement chaque semaine sans intervention :

1. Tapez **"Planificateur de tâches"** dans la barre de recherche Windows
2. Cliquez sur **"Créer une tâche de base"**
3. Nom : `UCI Instagram Tracker`
4. Déclencheur : **Hebdomadaire**, choisissez le jour et l'heure
5. Action : **"Démarrer un programme"**
   - Si vous utilisez `run_tracker.bat` :
     - **Programme/script** : `C:\Users\VOTRE_NOM\Desktop\Trackers\run_tracker.bat`
   - Sinon :
     - **Programme/script** : `python`
     - **Arguments** : `instagram_tracker.py`
     - **Commencer dans** : `C:\Users\VOTRE_NOM\Desktop\Trackers`

---

## Ajouter ou modifier des comptes

Ouvrez `instagram_tracker.py` avec le Bloc-notes (clic droit → Ouvrir avec → Bloc-notes) et trouvez la section `ENTITIES`. Ajoutez une entrée comme celle-ci :

```python
{"nom": "Mon Équipe", "cl": "France", "ig": "nom_du_compte_ig"},
```

Respectez bien les guillemets, les virgules et les accolades. Placez la ligne dans la bonne section (Équipes hommes / Équipes femmes / Courses hommes / Courses femmes).

⚠️ **Important** : si vous voulez que le nouveau compte apparaisse aussi dans le dashboard, ajoutez-le aussi dans le fichier `index.html` (sections `TM`, `TW`, `RM`, `RW`).

---

## Dépannage

### "python n'est pas reconnu"
Python n'est pas dans le PATH. Désinstallez-le depuis **Paramètres → Applications**, puis réinstallez-le en cochant bien **"Add python.exe to PATH"** à la première étape.

### "playwright n'est pas reconnu"
Utilisez `python -m playwright install chromium` (avec `python -m` devant) au lieu de `playwright install chromium`.

### Beaucoup de followers affichent N/A
Instagram bloque peut-être l'accès en mode automatisé. Ouvrez `instagram_tracker.py`, cherchez la ligne `HEADLESS = True` et remplacez-la par `HEADLESS = False`. Vous verrez le navigateur s'ouvrir pendant la collecte et pourrez voir ce qui bloque.

### Erreur de quota GitHub
Si vous avez "API rate limit exceeded", attendez 1 heure. Les PAT authentifiés ont une limite de 5000 requêtes/heure, ce qui est largement suffisant pour ce script (1 seule requête PATCH par run).

### "Le chemin d'accès spécifié est introuvable"
Vérifiez le chemin exact de votre dossier. Tapez `dir C:\Users\VOTRE_NOM\Desktop` dans l'invite de commandes pour voir les dossiers disponibles.
