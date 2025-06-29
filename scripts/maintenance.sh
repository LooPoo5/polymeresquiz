
#!/bin/bash

# Script de maintenance
APP_DIR="/volume1/quiz-app"
cd $APP_DIR

case "$1" in
    "start")
        echo "▶️ Démarrage des services..."
        docker-compose up -d
        ;;
    "stop")
        echo "⏹️ Arrêt des services..."
        docker-compose down
        ;;
    "restart")
        echo "🔄 Redémarrage des services..."
        docker-compose restart
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        ;;
    "backup")
        echo "💾 Sauvegarde..."
        docker exec quiz-postgres pg_dump -U quiz_user quiz_app > /volume1/quiz-app/backup-$(date +%Y%m%d-%H%M%S).sql
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|backup}"
        exit 1
        ;;
esac
