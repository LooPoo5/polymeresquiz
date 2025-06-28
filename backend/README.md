
# Quiz App Backend API

Backend API pour l'application Quiz avec authentification multi-utilisateurs et base de données PostgreSQL.

## 🚀 Fonctionnalités

- **Authentification JWT** - Inscription/connexion sécurisées
- **Multi-utilisateurs** - Chaque utilisateur a ses propres quiz et résultats
- **API RESTful** - CRUD complet pour quiz et résultats
- **Base de données PostgreSQL** - Stockage persistant et relationnel
- **Sécurité** - Rate limiting, validation, CORS, Helmet
- **Docker** - Déploiement containerisé pour NAS

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (pour déploiement NAS)

## 🛠️ Installation Locale

1. **Cloner et installer**
```bash
cd backend
npm install
```

2. **Configuration**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

3. **Base de données**
```bash
# Créer la base
createdb quiz_app
# Appliquer le schema
psql quiz_app < database/schema.sql
```

4. **Démarrage**
```bash
npm run dev  # Mode développement
npm run build && npm start  # Mode production
```

## 🐳 Déploiement Docker (NAS)

1. **Configuration**
```bash
# Modifier docker-compose.yml avec vos paramètres
# Changez les mots de passe par défaut !
```

2. **Démarrage**
```bash
docker-compose up -d
```

3. **Vérification**
```bash
# Santé des services
docker-compose ps
curl http://localhost/api/health
```

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Quiz (authentification requise)
- `GET /api/quizzes` - Liste des quiz
- `POST /api/quizzes` - Créer un quiz
- `PUT /api/quizzes/:id` - Modifier un quiz
- `DELETE /api/quizzes/:id` - Supprimer un quiz

### Résultats
- `GET /api/results` - Liste des résultats
- `POST /api/results` - Enregistrer un résultat

### Utilitaires
- `GET /api/health` - État du serveur

## 🔒 Sécurité

- **JWT** avec expiration 7 jours
- **Rate limiting** 100 req/15min par IP
- **Validation** des données entrantes
- **CORS** configuré pour le frontend
- **Helmet** pour headers de sécurité
- **Mots de passe** hashés avec bcrypt

## 🔧 Configuration NAS

### Variables d'environnement importantes
```env
# Base de données (à changer!)
DATABASE_URL=postgresql://quiz_user:VOTRE_MOT_DE_PASSE@postgres:5432/quiz_app

# JWT Secret (à changer!)
JWT_SECRET=votre-cle-super-secrete-unique

# Frontend
FRONTEND_URL=http://votre-nas-ip
```

### Ports utilisés
- `80` - Nginx (frontend + proxy API)
- `443` - HTTPS (si configuré)
- `3001` - API Backend (interne)
- `5432` - PostgreSQL (interne)

## 📊 Monitoring

### Logs
```bash
# Logs en temps réel
docker-compose logs -f

# Logs spécifiques
docker-compose logs api
docker-compose logs postgres
docker-compose logs nginx
```

### Santé des services
```bash
# Status global
curl http://votre-nas/api/health

# Base de données
docker-compose exec postgres pg_isready
```

## 🔄 Migration des données

Le backend accepte les mêmes formats de données que la version localStorage pour faciliter la migration.

## ⚡ Performance

- **Connection pooling** PostgreSQL
- **Gzip compression** Nginx
- **Cache** des assets statiques
- **Indexes** base de données optimisés

## 🛡️ Sauvegarde

```bash
# Sauvegarde automatique
docker-compose exec postgres pg_dump -U quiz_user quiz_app > backup.sql

# Restauration
docker-compose exec -T postgres psql -U quiz_user quiz_app < backup.sql
```
