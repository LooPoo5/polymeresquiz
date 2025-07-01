
#!/bin/bash

# Gestion des clients WireGuard
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 [show|add] [numéro-client]"
    echo "Exemples:"
    echo "  $0 show 1     # Afficher QR code client 1"
    echo "  $0 add 6      # Ajouter un nouveau client"
    exit 1
fi

ACTION="$1"
CLIENT_NUM="$2"

# Vérifier que le conteneur existe
if ! docker ps -a | grep -q quiz-wireguard; then
    echo "❌ Conteneur WireGuard non trouvé"
    echo "Exécutez d'abord: ./scripts/setup-wireguard.sh"
    exit 1
fi

# Vérifier que le conteneur fonctionne
if ! docker ps | grep -q quiz-wireguard; then
    echo "⚠️  Démarrage du conteneur WireGuard..."
    docker start quiz-wireguard
    sleep 5
fi

case "$ACTION" in
    "show")
        echo "📱 Configuration client $CLIENT_NUM :"
        echo ""
        
        # Vérifier si la configuration existe
        if docker exec quiz-wireguard test -f /config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.conf 2>/dev/null; then
            echo "🔑 Fichier de configuration :"
            docker exec quiz-wireguard cat /config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.conf
            echo ""
            
            # Afficher le QR code si possible
            if docker exec quiz-wireguard test -f /config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.png 2>/dev/null; then
                echo "📱 QR Code (copiez le lien ci-dessous dans un navigateur) :"
                echo "data:image/png;base64,$(docker exec quiz-wireguard base64 -w 0 /config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.png)"
            fi
            
            echo ""
            echo "📁 Fichiers disponibles sur le NAS :"
            echo "  • Configuration : ./wireguard-config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.conf"
            echo "  • QR Code PNG : ./wireguard-config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.png"
        else
            echo "❌ Configuration client $CLIENT_NUM non trouvée"
            echo "Clients disponibles :"
            docker exec quiz-wireguard ls /config/ | grep peer || echo "Aucun client trouvé"
        fi
        ;;
    "add")
        echo "➕ Ajout du client $CLIENT_NUM..."
        
        # Vérifier le nombre actuel de peers
        CURRENT_PEERS=$(grep "PEERS=" docker-compose.wireguard.yml | cut -d'=' -f2)
        
        if [ "$CLIENT_NUM" -le "$CURRENT_PEERS" ]; then
            echo "⚠️  Le client $CLIENT_NUM existe déjà"
            echo "Utilisez: $0 show $CLIENT_NUM"
            exit 0
        fi
        
        # Augmenter le nombre de peers et redémarrer
        sed -i "s/PEERS=.*/PEERS=$CLIENT_NUM/" docker-compose.wireguard.yml
        
        echo "🔄 Redémarrage du conteneur avec $CLIENT_NUM clients..."
        docker-compose -f docker-compose.wireguard.yml up -d
        
        # Attendre la génération
        echo "⏳ Génération du nouveau client..."
        sleep 15
        
        # Vérifier la création
        if docker exec quiz-wireguard test -f /config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.conf 2>/dev/null; then
            echo "✅ Client $CLIENT_NUM ajouté avec succès !"
            echo "Utilisez: $0 show $CLIENT_NUM"
        else
            echo "❌ Erreur lors de la création du client"
            echo "Vérifiez les logs: docker logs quiz-wireguard"
        fi
        ;;
    *)
        echo "❌ Action non reconnue : $ACTION"
        echo "Actions disponibles : show, add"
        exit 1
        ;;
esac
