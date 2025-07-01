
#!/bin/bash

# Script pour démarrer l'application Quiz
set -e

APP_DIR="/volume1/quiz-app"
COMPOSE_FILE="./docker-compose.production.yml"

echo "🚀 Démarrage de l'application Quiz..."

# Aller dans le répertoire de l'application
cd $APP_DIR

# Vérifier que le fichier de configuration existe
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Fichier $COMPOSE_FILE non trouvé"
    echo "📍 Répertoire courant: $(pwd)"
    ls -la | grep docker-compose
    exit 1
fi

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant !"
    echo "Créez le fichier .env avec vos configurations"
    exit 1
fi

# Arrêter les services existants proprement
echo "⏹️ Arrêt des services existants..."
docker-compose -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true

# Nettoyer les images obsolètes
echo "🧹 Nettoyage..."
docker system prune -f 2>/dev/null || true

# Vérifier l'espace disque
echo "💾 Vérification de l'espace disque..."
df -h /volume1 | head -2

# Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose -f "$COMPOSE_FILE" up -d

# Attendre le démarrage
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier le statut
echo "📊 Statut des services :"
docker-compose -f "$COMPOSE_FILE" ps

# Tests de connectivité
echo ""
echo "🔍 Tests de connectivité..."

# Test PostgreSQL
if docker exec quiz-postgres pg_isready -U quiz_user > /dev/null 2>&1; then
    echo "  ✅ PostgreSQL : OK"
else
    echo "  ❌ PostgreSQL : Erreur"
fi

# Test API
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "  ✅ API Backend : OK"
else
    echo "  ❌ API Backend : Erreur"
fi

# Test Frontend
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "  ✅ Frontend : OK"
else
    echo "  ❌ Frontend : Erreur"
fi

# Informations finales
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo ""
echo "🎉 Application Quiz démarrée !"
echo ""
echo "📍 Accès local :"
echo "  • Application : http://$LOCAL_IP:8080"
echo "  • API : http://$LOCAL_IP:3001"
echo ""
echo "📱 Accès via WireGuard :"
echo "  • Application : http://10.13.13.1:8080"
echo "  • API : http://10.13.13.1:3001"
echo ""
echo "🔧 Commandes utiles :"
echo "  • Logs : docker-compose -f $COMPOSE_FILE logs -f"
echo "  • Statut : docker-compose -f $COMPOSE_FILE ps"
echo "  • Redémarrer : docker-compose -f $COMPOSE_FILE restart"
