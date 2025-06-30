
#!/bin/bash

# Script de configuration initiale
set -e

echo "🚀 Configuration initiale de Quiz App"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher des messages colorés
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "docker-compose.production.yml" ]; then
    log_error "Fichier docker-compose.production.yml non trouvé"
    log_error "Assurez-vous d'être dans le répertoire racine du projet"
    exit 1
fi

# Créer l'arborescence nécessaire
log_info "Création de l'arborescence..."
mkdir -p {data/postgres,logs,uploads,ssl}

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    log_warn "Fichier .env non trouvé"
    if [ -f ".env.production" ]; then
        log_info "Copie de .env.production vers .env"
        cp .env.production .env
        log_warn "⚠️  IMPORTANT: Modifiez le fichier .env avec vos valeurs !"
    else
        log_error "Aucun fichier de configuration trouvé"
        log_error "Créez un fichier .env avec les variables nécessaires"
        exit 1
    fi
fi

# Rendre les scripts exécutables
log_info "Configuration des permissions..."
chmod +x scripts/*.sh

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose n'est pas installé"
    exit 1
fi

# Résumé
log_info "✅ Configuration terminée !"
echo ""
echo "Prochaines étapes :"
echo "1. Modifiez le fichier .env avec vos valeurs"
echo "2. Exécutez: ./scripts/deploy-final.sh"
echo ""
echo "Pour le développement local :"
echo "- Frontend: cd frontend && npm install && npm run dev"
echo "- Backend: cd backend && npm install && npm run dev"
echo "- Base de données: docker-compose -f docker-compose.dev.yml up postgres-dev"
