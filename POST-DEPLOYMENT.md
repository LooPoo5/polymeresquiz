
# Guide Post-Déploiement - Quiz App sur NAS Ugreen

## ✅ Vérifications Post-Déploiement

### 1. Tests de Base
```bash
# Vérification des conteneurs
docker-compose -f docker-compose.production.yml ps

# Test API
curl http://localhost:3001/api/health

# Test Frontend
curl http://localhost:80
```

### 2. Accès depuis le Réseau Local
- **Application** : `http://[IP_NAS]`
- **API** : `http://[IP_NAS]:3001/api`

### 3. Logs de Débogage
```bash
# Logs de tous les services
docker-compose -f docker-compose.production.yml logs -f

# Logs spécifiques
docker logs quiz-frontend
docker logs quiz-api
docker logs quiz-postgres
```

## 🔧 Configuration Avancée

### 1. Accès Distant (Optionnel)
#### Option A : Port Forwarding Simple
1. Routeur : Port 80 → IP_NAS:80
2. DDNS si IP dynamique
3. ⚠️ **Non sécurisé sans HTTPS**

#### Option B : VPN (Recommandé)
1. Configuration VPN sur routeur/NAS
2. Accès sécurisé via tunnel
3. Pas d'exposition internet

### 2. Configuration HTTPS (Optionnel)
```bash
# Génération certificat Let's Encrypt
sudo certbot certonly --standalone -d votre-domaine.com

# Copie des certificats
cp /etc/letsencrypt/live/votre-domaine.com/fullchain.pem /volume1/quiz-app/ssl/cert.pem
cp /etc/letsencrypt/live/votre-domaine.com/privkey.pem /volume1/quiz-app/ssl/key.pem

# Décommentez la section HTTPS dans nginx.conf
# Redémarrez : docker-compose restart frontend
```

## 📊 Maintenance

### Commandes Quotidiennes
```bash
# Vérification statut
./scripts/maintenance.sh status

# Sauvegarde manuelle
./scripts/maintenance.sh backup

# Redémarrage si nécessaire
./scripts/maintenance.sh restart
```

### Surveillance des Ressources
```bash
# Utilisation des conteneurs
docker stats

# Espace disque
df -h /volume1

# Logs système
journalctl -u docker
```

## 🚨 Dépannage

### Problème : Services ne démarrent pas
```bash
# Vérifier les logs
docker-compose -f docker-compose.production.yml logs

# Vérifier l'espace disque
df -h

# Redémarrage complet
docker-compose -f docker-compose.production.yml down
docker system prune -a -f
docker-compose -f docker-compose.production.yml up -d
```

### Problème : Base de données inaccessible
```bash
# Restart PostgreSQL seul
docker-compose -f docker-compose.production.yml restart postgres

# Vérifier les données
ls -la /volume1/quiz-app/data/postgres/

# Test de connexion
docker exec -it quiz-postgres psql -U quiz_user -d quiz_app
```

### Problème : Frontend inaccessible
```bash
# Vérifier Nginx
docker logs quiz-frontend

# Test de la configuration
docker exec quiz-frontend nginx -t

# Redémarrage frontend
docker-compose -f docker-compose.production.yml restart frontend
```

## 📈 Optimisations

### Performance
- **Monitoring** : Installer Portainer pour interface graphique
- **Backup automatique** : Vérifier les sauvegardes quotidiennes
- **Nettoyage** : Programmer nettoyage des logs anciens

### Sécurité
- **Firewall** : Configurer UFW si disponible
- **Updates** : Programmer mise à jour des images Docker
- **Monitoring** : Surveiller les tentatives d'accès

## 📞 Support

En cas de problème persistant :
1. Consultez les logs détaillés
2. Vérifiez la documentation UGOS
3. Community Ugreen sur Discord/Forum
4. Restart complet si nécessaire

---

**🎯 Votre Quiz App est maintenant opérationnelle sur votre NAS Ugreen !**
