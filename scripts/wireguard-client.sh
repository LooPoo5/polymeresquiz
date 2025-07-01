
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

case "$ACTION" in
    "show")
        echo "📱 QR Code pour le client $CLIENT_NUM :"
        docker exec quiz-wireguard /app/show-peer $CLIENT_NUM
        echo ""
        echo "📁 Fichiers disponibles :"
        echo "  • Configuration : ./wireguard-config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.conf"
        echo "  • QR Code PNG : ./wireguard-config/peer${CLIENT_NUM}/peer${CLIENT_NUM}.png"
        ;;
    "add")
        echo "➕ Ajout du client $CLIENT_NUM..."
        # Redémarrer avec plus de peers
        sed -i "s/PEERS=.*/PEERS=$CLIENT_NUM/" docker-compose.wireguard.yml
        docker-compose -f docker-compose.wireguard.yml up -d
        echo "✅ Client ajouté ! Utilisez: $0 show $CLIENT_NUM"
        ;;
    *)
        echo "❌ Action non reconnue : $ACTION"
        exit 1
        ;;
esac
