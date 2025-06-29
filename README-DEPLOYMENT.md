
# Guide de Déploiement - NAS Ugreen UGOS

## 📋 Prérequis

### Matériel NAS
- **NAS Ugreen** avec UGOS
- **RAM minimum** : 4GB (8GB recommandé)
- **Stockage** : 20GB disponibles minimum
- **Docker** installé via le gestionnaire d'applications UGOS

### Réseau
- **IP fixe** recommandée pour le NAS
- **Ports nécessaires** : 80, 443, 3001, 5432
- **Accès SSH** activé

## 🚀 Installation Étape par Étape

### 1. Préparation du NAS

```bash
# Connexion SSH au NAS
ssh admin@[IP_NAS]

# Vérification Docker
docker --version
docker-compose --version
```

### 2. Téléchargement de l'application

```bash
# Création du dossier
mkdir -p /mnt/user/appdata/quiz-app
cd /mnt/user/appdata/quiz-app

# Téléchargement des fichiers (méthode à adapter selon votre situation)
# - Via git clone si disponible
# - Via transfert SCP/SFTP
# - Via interface web UGOS
```

### 3. Configuration

```bash
# Copie et édition du fichier environnement
cp .env.production .env
nano .env

# IMPORTANT: Changez les valeurs suivantes
# - POSTGRES_PASSWORD (mot de passe fort)
# - JWT_SECRET (clé unique 64+ caractères)
# - FRONTEND_URL (IP de votre NAS)
```

### 4. Déploiement

```bash
# Exécution du script de déploiement
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 5. Vérification

```bash
# Status des conteneurs
docker-compose -f docker-compose.production.yml ps

# Test d'accès
curl http://localhost/health
```

## 🌐 Accès à l'Application

- **Local** : `http://[IP_NAS]`
- **API** : `http://[IP_NAS]/api`
- **Base de données** : Port 5432 (accès interne)

## 🔒 Configuration de l'Accès Distant

### Option 1: Port Forwarding (Simple)
1. Configuration routeur : Port 80 → IP_NAS:80
2. DDNS si IP publique dynamique
3. **⚠️ Non sécurisé sans HTTPS**

### Option 2: VPN (Recommandé)
1. Configuration VPN sur le routeur ou NAS
2. Accès sécurisé via tunnel VPN
3. Pas d'exposition directe sur internet

### Option 3: Reverse Proxy avec SSL
1. Domaine pointant vers votre IP publique
2. Certificat Let's Encrypt
3. Configuration HTTPS dans nginx.conf

## 📊 Maintenance

### Commandes Utiles
```bash
# Script de maintenance
./scripts/maintenance.sh [start|stop|restart|logs|status|update|backup|clean]

# Logs en temps réel
docker-compose -f docker-compose.production.yml logs -f

# Sauvegarde manuelle
./scripts/maintenance.sh backup
```

### Sauvegardes Automatiques
- **Base de données** : Quotidienne à 2h du matin
- **Fichiers uploadés** : Quotidienne
- **Rétention** : 30 jours
- **Localisation** : `/mnt/user/backups/quiz-app/`

## 🔧 Dépannage

### Problèmes Courants

**Services ne démarrent pas**
```bash
# Vérifier les logs
docker-compose logs

# Vérifier l'espace disque
df -h

# Vérifier les ports
netstat -tlnp | grep -E ':(80|443|3001|5432)'
```

**Base de données inaccessible**
```bash
# Restart PostgreSQL
docker-compose -f docker-compose.production.yml restart postgres

# Vérifier les permissions
ls -la data/postgres/
```

**Application lente**
```bash
# Monitoring des ressources
docker stats

# Nettoyage des logs
docker system prune
```

## 📱 Accès Mobile

L'application est responsive et accessible via navigateur mobile :
- **Android** : Chrome, Firefox
- **iOS** : Safari, Chrome
- **Interface optimisée** pour tablettes

## 🔄 Mise à Jour

### Mise à jour de l'application
```bash
# Arrêt des services
docker-compose -f docker-compose.production.yml down

# Mise à jour du code (selon votre méthode)
# Reconstruction des images
docker-compose -f docker-compose.production.yml build --no-cache

# Redémarrage
docker-compose -f docker-compose.production.yml up -d
```

### Migration des données
Les données sont persistantes dans PostgreSQL. Les mises à jour conservent automatiquement toutes les données existantes.

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `docker-compose logs`
2. Consultez la documentation UGOS
3. Community forums Ugreen
4. Vérifiez les issues GitHub du projet

---

**🎉 Votre application Quiz est maintenant déployée et accessible !**
