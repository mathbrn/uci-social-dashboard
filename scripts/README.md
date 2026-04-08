# UCI Social Dashboard — Scraper local

Un seul script Python qui scrape les followers Instagram, Facebook et X pour les 95 équipes et courses UCI WorldTour 2026, puis écrit le résultat dans deux fichiers Excel.

**Workflow en deux étapes :**
1. Vous lancez `scrape_to_excel.py` (~5 minutes)
2. Vous cliquez sur "Importer Excel" dans le dashboard → vous voyez les chiffres

**Coût : 0 €.** Aucune API, aucune clé, aucun compte. Tout est local.

---

## Installation (une fois)

### 1. Installer Python

1. Allez sur [python.org/downloads](https://www.python.org/downloads/) (**pas** le Microsoft Store)
2. Cliquez sur **"Download Python 3.x.x"**
3. Lancez l'installateur
4. **Cochez la case "Add python.exe to PATH"** sur le premier écran
5. Cliquez sur **Install Now**

### 2. Installer les dépendances

Ouvrez une **Invite de commandes** (tapez "cmd" dans la barre de recherche) et lancez :

```
pip install playwright openpyxl
python -m playwright install chromium
```

La dernière commande télécharge un Chromium léger (~200 Mo). Si votre IT bloque ce téléchargement, parlez-en-leur — il n'y a pas d'alternative locale.

### 3. Récupérer le script

Téléchargez le fichier `scrape_to_excel.py` depuis le repo et placez-le dans un dossier de votre choix, par exemple `C:\Users\VOTRE_NOM\Desktop\UCI_Tracker\`.

---

## Utilisation

### Lancer la collecte

Dans une Invite de commandes :

```
cd C:\Users\VOTRE_NOM\Desktop\UCI_Tracker
python scrape_to_excel.py
```

Le script affiche en temps réel chaque compte scrappé. À la fin (environ 5 minutes), deux fichiers Excel sont créés/mis à jour dans le même dossier :

- **`uci_equipes.xlsx`** — 2 feuilles : `Hommes`, `Femmes`
- **`uci_courses.xlsx`** — 2 feuilles : `Hommes`, `Femmes`

Chaque feuille a cette structure :

| Nom | Pays/Classe | Réseau | Avril 2026 | Mai 2026 | Juin 2026 | … |
|---|---|---|---|---|---|---|
| Tour de France | 2.UWT | Instagram | 6 523 456 | | | |
| Tour de France | 2.UWT | Facebook | 3 412 789 | | | |
| Tour de France | 2.UWT | X (Twitter) | 1 234 567 | | | |
| … | | | | | | |

À chaque nouveau run, seule la colonne du **mois courant** est mise à jour. Les colonnes des mois précédents sont préservées → vous construisez un historique mois par mois.

### Importer dans le dashboard

1. Ouvrez [le dashboard](https://mathbrn.github.io/uci-social-dashboard/)
2. Cliquez sur **"Importer Excel"** (en haut à droite)
3. Cliquez sur **"Choisir les fichiers Excel…"**
4. Sélectionnez `uci_equipes.xlsx` et `uci_courses.xlsx` (Ctrl+clic pour sélectionner les deux)
5. Le log affiche combien de valeurs ont été importées
6. Fermez la fenêtre — les chiffres apparaissent dans le tableau

Les données sont stockées dans le `localStorage` de votre navigateur. Un collègue qui ouvre le dashboard verra les mêmes chiffres si vous lui envoyez les 2 fichiers Excel (par mail, partage réseau, etc.) et qu'il fait l'import de son côté.

### Partager avec les collègues via le réseau ASO

La méthode la plus simple :

1. Copiez `uci_equipes.xlsx` et `uci_courses.xlsx` sur un dossier du partage réseau ASO, par exemple `\\ASO92PRDDATA\Etudes\UCI_Dashboard\`
2. Envoyez à vos collègues le lien du dashboard + le chemin du dossier réseau
3. Ils ouvrent le dashboard, cliquent "Importer Excel", naviguent vers le partage réseau, sélectionnent les 2 fichiers → ils voient les mêmes chiffres que vous

---

## Automatiser la collecte chaque semaine

Pour que le script tourne tout seul une fois par semaine (par exemple le lundi matin) :

1. Tapez **"Planificateur de tâches"** dans la barre de recherche Windows
2. **Créer une tâche de base**
3. Nom : `UCI Scraper`
4. Déclencheur : **Hebdomadaire**, choisissez le jour et l'heure
5. Action : **Démarrer un programme**
   - Programme/script : `python`
   - Arguments : `scrape_to_excel.py`
   - Commencer dans : `C:\Users\VOTRE_NOM\Desktop\UCI_Tracker`

Le script tournera automatiquement et mettra à jour les 2 fichiers Excel. Il ne vous restera qu'à les importer dans le dashboard quand vous voudrez voir les derniers chiffres.

---

## Dépannage

### "python n'est pas reconnu"
Désinstallez Python depuis Paramètres → Applications, puis réinstallez-le en cochant bien **"Add python.exe to PATH"**.

### Beaucoup de comptes affichent N/A
Les sites bloquent parfois le scraping automatisé. Dans le script, cherchez la ligne `HEADLESS = True` et remplacez-la par `HEADLESS = False` → vous verrez le navigateur s'ouvrir et pourrez identifier ce qui bloque (captcha, login wall…).

### X (Twitter) renvoie N/A pour tous les comptes
X est le réseau le plus agressif contre le scraping. Le script tente d'abord les miroirs nitter.net, puis x.com en fallback. Si les nitter sont down et que x.com bloque, X sera indisponible. Dans ce cas, relancez plus tard ou ignorez X pour ce mois-ci — le dashboard gère les valeurs manquantes sans problème.

### Le bouton "Importer Excel" du dashboard ne réagit pas
Vérifiez que SheetJS est bien chargé (ouvrez la console DevTools avec F12 et tapez `XLSX`). Si c'est `undefined`, votre pare-feu bloque peut-être les CDN externes. Dans ce cas, téléchargez `xlsx.full.min.js` depuis [jsdelivr.net](https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js) et servez-le localement.

### Les chiffres sont arrondis
Le script est conçu pour refuser les arrondis — il parse directement les JSON inline des pages pour obtenir les nombres exacts. Si un arrondi apparaît, c'est un bug : ouvrez une issue sur le repo.

---

## Ajouter/modifier un compte à suivre

Ouvrez `scrape_to_excel.py` avec le Bloc-notes et trouvez les listes `TEAMS_MEN`, `TEAMS_WOMEN`, `RACES_MEN`, `RACES_WOMEN`. Ajoutez une ligne :

```python
("Mon Équipe", "France", "mon_compte_ig", "MaPageFB", "MonHandleX"),
```

Si vous voulez aussi qu'elle apparaisse dans le dashboard, ajoutez-la également dans `index.html` (arrays `TM`, `TW`, `RM`, `RW`).
