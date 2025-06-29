
#!/bin/bash

# Script de déploiement simple pour NAS Ugreen
set -e

APP_DIR="/volume1/quiz-app"
BACKUP_DIR="/volume1/backups/quiz-app"

echo "🚀 Déploiement de l'application Quiz sur NAS Ugreen"

# Vérifications
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Création des dossiers
echo "📁 Création de l'arborescence..."
mkdir -p $APP_DIR/{backend,frontend,config,data/postgres,logs,ssl,uploads,database}
mkdir -p $BACKUP_DIR

cd $APP_DIR

# Vérification du fichier .env
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant !"
    echo "Créez le fichier .env avec vos configurations"
    exit 1
fi

# Arrêt des services existants
echo "⏹️ Arrêt des services existants..."
docker-compose down --remove-orphans 2>/dev/null || true

# Construction et démarrage
echo "🔨 Construction des images..."
docker-compose build --no-cache

echo "🚀 Démarrage des services..."
docker-compose up -d

# Attente
echo "⏳ Attente du démarrage..."
sleep 30

# Vérification
echo "✅ Vérification des services..."
docker-compose ps

echo "🎉 Déploiement terminé !"
echo "Accès: http://$(hostname -I | awk '{print $1}')"
