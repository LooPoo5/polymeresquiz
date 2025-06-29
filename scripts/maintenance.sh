
#!/bin/bash

# Script de maintenance pour l'application Quiz
set -e

APP_DIR="/mnt/user/appdata/quiz-app"
cd $APP_DIR

case "$1" in
    "start")
        echo "Démarrage des services..."
        docker-compose -f docker-compose.production.yml up -d
        ;;
    "stop")
        echo "Arrêt des services..."
        docker-compose -f docker-compose.production.yml down
        ;;
    "restart")
        echo "Redémarrage des services..."
        docker-compose -f docker-compose.production.yml restart
        ;;
    "logs")
        docker-compose -f docker-compose.production.yml logs -f
        ;;
    "status")
        docker-compose -f docker-compose.production.yml ps
        ;;
    "update")
        echo "Mise à jour de l'application..."
        docker-compose -f docker-compose.production.yml down
        docker-compose -f docker-compose.production.yml build --no-cache
        docker-compose -f docker-compose.production.yml up -d
        ;;
    "backup")
        echo "Sauvegarde manuelle..."
        /usr/local/bin/quiz-app-backup.sh
        ;;
    "clean")
        echo "Nettoyage des images inutilisées..."
        docker system prune -f
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|update|backup|clean}"
        exit 1
        ;;
esac
