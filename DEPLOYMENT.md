
# Guide de Déploiement - Quiz App

## 🎯 Déploiement Rapide

### 1. Prérequis
- **NAS Ugreen** avec Docker installé
- **Accès SSH** au NAS
- **1GB d'espace libre** minimum
- **Connexion Internet** pour télécharger les images Docker

### 2. Installation
```bash
# Cloner le projet
git clone https://github.com/votre-username/quiz-app.git
cd quiz-app

# Copier vers le NAS
scp -r . admin@IP_NAS:/volume1/quiz-app/

# Se connecter au NAS
ssh admin@IP_NAS
cd /volume1/quiz-app
```

### 3. Configuration
```bash
# Configuration initiale
./scripts/setup.sh

# Modifier le fichier .env
nano .env
# Changez au minimum:
# - POSTGRES_PASSWORD
# - JWT_SECRET
# - FRONTEND_URL (IP de votre NAS)
```

### 4. Déploiement
```bash
# Déploiement complet
./scripts/deploy-final.sh
```

## 🔧 Configuration Détaillée

### Variables d'environnement essentielles
- `POSTGRES_PASSWORD`: Mot de passe de la base de données
- `JWT_SECRET`: Clé secrète pour l'authentification
- `FRONTEND_URL`: URL d'accès à l'application

### Ports utilisés
- **80**: Frontend (HTTP)
- **443**: Frontend (HTTPS)
- **3001**: API Backend
- **5432**: PostgreSQL

## 🚀 Accès à l'Application

Une fois déployé, l'application sera accessible via :
- **Interface utilisateur**: http://IP_NAS
- **API**: http://IP_NAS:3001/api

## 🛠️ Maintenance

### Commandes utiles
```bash
# Statut des services
./scripts/maintenance.sh status

# Voir les logs
./scripts/maintenance.sh logs

# Redémarrer
./scripts/maintenance.sh restart

# Sauvegarde
./scripts/maintenance.sh backup
```

### Mise à jour
```bash
# Arrêter les services
./scripts/maintenance.sh stop

# Mettre à jour le code
git pull

# Reconstruire les images
docker-compose -f docker-compose.production.yml build --no-cache

# Redémarrer
./scripts/maintenance.sh start
```

## 🔍 Dépannage

### Problèmes courants

**Port déjà utilisé**
```bash
# Vérifier les ports
netstat -tulpn | grep :80
# Arrêter le service conflictuel ou changer le port
```

**Erreur de connexion base de données**
```bash
# Vérifier les logs PostgreSQL
docker logs quiz-postgres
```

**Frontend inaccessible**
```bash
# Vérifier Nginx
docker logs quiz-frontend
```

### Logs détaillés
```bash
# Tous les logs
docker-compose -f docker-compose.production.yml logs -f

# Logs spécifiques
docker logs quiz-postgres
docker logs quiz-api
docker logs quiz-frontend
```

## 📊 Monitoring

### Vérifications de santé
- **/api/health**: Statut de l'API
- **/health**: Statut du frontend

### Métriques importantes
- Utilisation CPU/RAM des conteneurs
- Espace disque base de données
- Logs d'erreur

## 🔒 Sécurité

### Recommandations
1. **Changez tous les mots de passe par défaut**
2. **Utilisez des clés JWT longues et complexes**
3. **Activez HTTPS en production**
4. **Limitez l'accès réseau si nécessaire**
5. **Sauvegardez régulièrement**

### Configuration SSL (optionnel)
```bash
# Placer les certificats dans ./ssl/
# Décommenter la section HTTPS dans nginx.conf
# Redémarrer le frontend
```

## 📦 Sauvegarde et Restauration

### Sauvegarde
```bash
# Sauvegarde automatique
./scripts/maintenance.sh backup

# Sauvegarde manuelle
docker exec quiz-postgres pg_dump -U quiz_user quiz_app > backup.sql
```

### Restauration
```bash
# Restaurer depuis une sauvegarde
docker exec -i quiz-postgres psql -U quiz_user quiz_app < backup.sql
```

---

🆘 **Support**: En cas de problème, consultez les logs et vérifiez la configuration réseau.
