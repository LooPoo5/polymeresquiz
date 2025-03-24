
# Application de Quiz

## Fonctionnalités

- Création et édition de quiz avec différents types de questions
- Passage de quiz avec suivi des résultats
- Signature électronique des participants
- Export des résultats en PDF
- Sauvegarde locale des données (sans base de données externe)
- Export et import des données pour sauvegarde

## Technologies utilisées

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Installation locale

```sh
# Cloner le dépôt
git clone <URL_DU_DÉPÔT>

# Naviguer dans le dossier du projet
cd <NOM_DU_PROJET>

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Stockage des données

Cette application utilise le stockage local (localStorage) du navigateur pour sauvegarder les données. Cela signifie que :

- Les données persistent même après avoir fermé le navigateur
- Les données sont stockées uniquement sur l'appareil de l'utilisateur
- Pas besoin de base de données externe

### Comment sauvegarder vos données

Utilisez la fonction "Exporter les données" sur la page d'accueil pour télécharger toutes vos données sous forme de fichier JSON. Vous pourrez les importer ultérieurement si nécessaire.

### Limites du stockage local

- Les données sont liées au navigateur et à l'appareil
- Si vous videz le cache ou les données du navigateur, vous perdrez les données
- Stockage limité (généralement 5-10 MB selon le navigateur)

## Déploiement avec GitHub Pages

Pour déployer l'application sur GitHub Pages :

1. Assurez-vous que votre code est dans un dépôt GitHub

2. Installez gh-pages comme dépendance de développement :
   ```
   npm install --save-dev gh-pages
   ```

3. Ajoutez ces scripts dans votre fichier package.json :
   ```json
   "scripts": {
     // ... autres scripts
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. Ajoutez aussi une propriété "homepage" dans votre package.json :
   ```json
   "homepage": "https://<VOTRE_NOM_UTILISATEUR>.github.io/<NOM_DU_REPO>"
   ```

5. Ajustez la configuration de vite.config.ts pour le déploiement sur GitHub Pages :
   ```typescript
   export default defineConfig({
     // ... autres configurations
     base: process.env.NODE_ENV === 'production' ? '/<NOM_DU_REPO>/' : '/',
     // ... autres configurations
   })
   ```

6. Exécutez la commande de déploiement :
   ```
   npm run deploy
   ```

7. Configurez GitHub Pages dans les paramètres du dépôt pour utiliser la branche gh-pages

Votre application sera déployée et accessible à l'URL : 
`https://<VOTRE_NOM_UTILISATEUR>.github.io/<NOM_DU_REPO>`

## Développement futur

Pour une solution plus robuste avec une base de données externe, considérez :
- Firebase Firestore
- Supabase
- MongoDB Atlas
