
#!/bin/bash

# Script de déploiement final pour NAS Ugreen
set -e

APP_DIR="/volume1/quiz-app"
BACKUP_DIR="$APP_DIR/backups"

echo "🚀 Déploiement FINAL de l'application Quiz sur NAS Ugreen"

# Vérifications préalables
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Création de l'arborescence complète
echo "📁 Création de l'arborescence complète..."
mkdir -p $APP_DIR/{backend,config,data/postgres,logs,ssl,uploads,database}
mkdir -p $BACKUP_DIR

cd $APP_DIR

# Vérification du fichier .env
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant !"
    echo "Copiez le fichier .env.example vers .env et configurez vos valeurs"
    exit 1
fi

# Arrêt des services existants
echo "⏹️ Arrêt des services existants..."
docker-compose -f docker-compose.production.yml down --remove-orphans 2>/dev/null || true

# Nettoyage des images obsolètes
echo "🧹 Nettoyage des images obsolètes..."
docker system prune -f 2>/dev/null || true

# Construction des images
echo "🔨 Construction des images (cela peut prendre du temps)..."

# Construction backend
echo "  → Construction du backend..."
docker build -f Dockerfile.backend -t quiz-app-backend .

# Construction frontend
echo "  → Construction du frontend..."
docker build -f Dockerfile.frontend -t quiz-app-frontend .

# Démarrage des services
echo "🚀 Démarrage des services..."
docker-compose -f docker-compose.production.yml up -d

# Attente du démarrage complet
echo "⏳ Attente du démarrage complet..."
sleep 60

# Tests de connectivité
echo "🔍 Vérification des services..."

# Test base de données
echo "  → Test PostgreSQL..."
if docker exec quiz-postgres pg_isready -U quiz_user > /dev/null 2>&1; then
    echo "  ✅ PostgreSQL : OK"
else
    echo "  ❌ PostgreSQL : Erreur"
fi

# Test API
echo "  → Test API..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "  ✅ API Backend : OK"
else
    echo "  ❌ API Backend : Erreur"
fi

# Test Frontend
echo "  → Test Frontend..."
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "  ✅ Frontend : OK"
else
    echo "  ❌ Frontend : Erreur"
fi

# Affichage du statut final
echo ""
echo "📊 Statut des conteneurs :"
docker-compose -f docker-compose.production.yml ps

# Configuration des sauvegardes automatiques
echo ""
echo "💾 Configuration des sauvegardes..."
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/scripts/maintenance.sh backup") | crontab -

# Informations finales
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo ""
echo "🎉 Déploiement terminé avec succès !"
echo ""
echo "📍 Accès à l'application :"
echo "  • Local : http://$LOCAL_IP"
echo "  • API : http://$LOCAL_IP:3001/api"
echo ""
echo "🛠️ Commandes utiles :"
echo "  • Logs : docker-compose -f docker-compose.production.yml logs -f"
echo "  • Statut : docker-compose -f docker-compose.production.yml ps"
echo "  • Redémarrage : docker-compose -f docker-compose.production.yml restart"
echo ""
echo "📋 Prochaines étapes :"
echo "  1. Testez l'application via votre navigateur"
echo "  2. Configurez votre routeur pour l'accès distant (optionnel)"
echo "  3. Configurez SSL/HTTPS (optionnel)"
echo ""
