
# Quiz App - Application de Quiz Complète

Application de quiz complète avec interface React et backend Node.js, déployable sur NAS Ugreen.

## 🚀 Déploiement Rapide

### Prérequis
- NAS Ugreen avec Docker installé
- Accès SSH au NAS
- 1GB d'espace libre minimum

### Installation
```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/quiz-app.git
cd quiz-app

# 2. Copier vers le NAS
scp -r . admin@IP_NAS:/volume1/quiz-app/

# 3. Se connecter au NAS et déployer
ssh admin@IP_NAS
cd /volume1/quiz-app
chmod +x scripts/*.sh
./scripts/deploy-final.sh
```

## 📁 Structure du Projet

```
quiz-app/
├── frontend/           # Application React
├── backend/           # API Node.js
├── config/            # Configuration Nginx
├── scripts/           # Scripts de déploiement
├── database/          # Schéma PostgreSQL
├── docker-compose.production.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── .env.production
```

## 🔧 Configuration

1. Copiez `.env.production` vers `.env`
2. Modifiez les valeurs selon votre environnement
3. Exécutez le script de déploiement

## 📊 Accès à l'Application

- **Frontend** : http://IP_NAS
- **API** : http://IP_NAS:3001/api
- **Base de données** : Port 5432

## 🛠️ Maintenance

```bash
# Démarrer les services
./scripts/maintenance.sh start

# Arrêter les services
./scripts/maintenance.sh stop

# Voir les logs
./scripts/maintenance.sh logs

# Sauvegarde
./scripts/maintenance.sh backup
```

## ⚙️ Développement Local

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

---

📖 **Documentation complète** : Voir README-DEPLOYMENT.md
