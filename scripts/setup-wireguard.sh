
#!/bin/bash

# Configuration WireGuard pour Quiz App
set -e

echo "🔐 Configuration du serveur WireGuard..."

WG_DIR="./wireguard-config"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Création du répertoire
mkdir -p $WG_DIR

# Obtenir l'IP publique (avec alternatives pour NAS)
PUBLIC_IP=""
if command -v curl &> /dev/null; then
    PUBLIC_IP=$(curl -s --connect-timeout 10 https://ipinfo.io/ip 2>/dev/null || echo "")
fi

if [ -z "$PUBLIC_IP" ]; then
    if command -v wget &> /dev/null; then
        PUBLIC_IP=$(wget -qO- --timeout=10 https://ipinfo.io/ip 2>/dev/null || echo "")
    fi
fi

if [ -z "$PUBLIC_IP" ]; then
    echo "⚠️  Impossible de détecter l'IP publique automatiquement"
    echo "Veuillez saisir votre IP publique :"
    read -p "IP publique : " PUBLIC_IP
fi

echo "📍 IP publique utilisée: $PUBLIC_IP"

# Créer le réseau Docker si nécessaire
docker network create quiz-network 2>/dev/null || echo "Réseau quiz-network existe déjà"

# Mettre à jour l'IP dans le docker-compose
sed -i "s/SERVERURL=.*/SERVERURL=$PUBLIC_IP/" docker-compose.wireguard.yml

# Démarrage du conteneur WireGuard
echo "🚀 Démarrage du serveur WireGuard..."
docker-compose -f docker-compose.wireguard.yml up -d

# Attendre le démarrage
echo "⏳ Initialisation en cours..."
sleep 20

# Vérifier que le conteneur fonctionne
if ! docker ps | grep -q quiz-wireguard; then
    echo "❌ Erreur: Le conteneur WireGuard n'a pas démarré correctement"
    echo "Vérifiez les logs avec: docker logs quiz-wireguard"
    exit 1
fi

# Afficher les informations des clients
echo "📱 Clients WireGuard générés..."
for i in 1 2 3 4 5; do
    if docker exec quiz-wireguard test -f /config/peer${i}/peer${i}.conf 2>/dev/null; then
        echo "  📱 Client ${i} : Configuration disponible"
    fi
done

echo ""
echo "✅ Serveur WireGuard configuré !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez votre routeur : Port 51820 UDP → IP_NAS:51820"
echo "2. Affichez les QR codes : ./scripts/wireguard-client.sh show [1-5]"
echo "3. Ajoutez des clients : ./scripts/wireguard-client.sh add [numéro]"
echo ""
echo "🔍 Commandes utiles :"
echo "  • Logs : docker logs quiz-wireguard"
echo "  • Statut : docker exec quiz-wireguard wg show"
echo "  • Redémarrer : docker-compose -f docker-compose.wireguard.yml restart"
