
#!/bin/bash

# Configuration WireGuard pour Quiz App
set -e

echo "🔐 Configuration du serveur WireGuard..."

WG_DIR="./wireguard-config"

# Vérifier WireGuard
if ! command -v wg &> /dev/null; then
    echo "❌ WireGuard n'est pas installé"
    exit 1
fi

# Création du répertoire
mkdir -p $WG_DIR

# Obtenir l'IP publique
PUBLIC_IP=$(curl -s https://ipinfo.io/ip)
echo "📍 IP publique détectée: $PUBLIC_IP"

# Créer le réseau Docker si nécessaire
docker network create quiz-network 2>/dev/null || echo "Réseau quiz-network existe déjà"

# Démarrage du conteneur WireGuard
echo "🚀 Démarrage du serveur WireGuard..."
docker-compose -f docker-compose.wireguard.yml up -d

# Attendre le démarrage
echo "⏳ Initialisation en cours..."
sleep 20

# Afficher les QR codes
echo "📱 Affichage des QR codes pour les clients..."
for i in {1..5}; do
    if docker exec quiz-wireguard test -f /config/peer${i}/peer${i}.png; then
        echo "  📱 Client ${i} : QR code généré dans wireguard-config/peer${i}/"
    fi
done

echo ""
echo "✅ Serveur WireGuard configuré !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez votre routeur : Port 51820 UDP → 192.168.1.48:51820"
echo "2. QR codes disponibles dans : ./wireguard-config/peer[1-5]/"
echo "3. Scannez avec l'app WireGuard sur vos appareils"
echo ""
echo "🔍 Commandes utiles :"
echo "  • Voir QR codes : docker exec quiz-wireguard /app/show-peer [1-5]"
echo "  • Logs : docker logs quiz-wireguard"
echo "  • Statut : docker exec quiz-wireguard wg show"
