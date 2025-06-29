
#!/bin/bash

# Script de déploiement pour NAS Ugreen
set -e

echo "🚀 Déploiement de l'application Quiz sur NAS Ugreen"

# Variables
APP_DIR="/mnt/user/appdata/quiz-app"
BACKUP_DIR="/mnt/user/backups/quiz-app"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifications préalables
log_info "Vérification de l'environnement..."

if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose n'est pas installé"
    exit 1
fi

# Création des dossiers
log_info "Création de l'arborescence..."
mkdir -p $APP_DIR/{data/postgres,logs,config,ssl,uploads}
mkdir -p $BACKUP_DIR

# Vérification du fichier .env
if [ ! -f "$APP_DIR/.env.production" ]; then
    log_error "Fichier .env.production manquant !"
    log_info "Copiez le fichier .env.production dans $APP_DIR"
    exit 1
fi

# Copie de la configuration
log_info "Copie des fichiers de configuration..."
cd $APP_DIR

# Arrêt des services existants
log_info "Arrêt des services existants..."
docker-compose -f docker-compose.production.yml down --remove-orphans

# Sauvegarde des données existantes
if [ -d "$APP_DIR/data/postgres" ] && [ "$(ls -A $APP_DIR/data/postgres)" ]; then
    log_info "Sauvegarde de la base de données existante..."
    docker run --rm \
        -v $APP_DIR/data/postgres:/var/lib/postgresql/data \
        -v $BACKUP_DIR:/backup \
        postgres:15-alpine \
        pg_dumpall -U quiz_user > $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql
fi

# Construction et démarrage des services
log_info "Construction des images Docker..."
docker-compose -f docker-compose.production.yml build --no-cache

log_info "Démarrage des services..."
docker-compose -f docker-compose.production.yml up -d

# Attente du démarrage
log_info "Attente du démarrage des services..."
sleep 30

# Vérification des services
log_info "Vérification des services..."
docker-compose -f docker-compose.production.yml ps

# Test de santé
log_info "Test de santé de l'application..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    log_info "✅ Application déployée avec succès !"
    log_info "Accès: http://$(hostname -I | awk '{print $1}')"
else
    log_error "❌ Erreur lors du déploiement"
    log_info "Vérifiez les logs: docker-compose -f docker-compose.production.yml logs"
fi

# Configuration des sauvegardes automatiques
log_info "Configuration des sauvegardes automatiques..."
cat > /etc/cron.d/quiz-app-backup << EOF
# Sauvegarde quotidienne à 2h du matin
0 2 * * * root /usr/local/bin/quiz-app-backup.sh
EOF

# Script de sauvegarde
cat > /usr/local/bin/quiz-app-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/mnt/user/backups/quiz-app"
DATE=$(date +%Y%m%d-%H%M%S)

# Sauvegarde base de données
docker exec quiz-postgres pg_dump -U quiz_user quiz_app > $BACKUP_DIR/db-backup-$DATE.sql

# Sauvegarde uploads
tar -czf $BACKUP_DIR/uploads-backup-$DATE.tar.gz -C /mnt/user/appdata/quiz-app uploads/

# Nettoyage des anciennes sauvegardes (plus de 30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/quiz-app-backup.sh

log_info "🎉 Déploiement terminé avec succès !"
