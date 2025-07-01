
#!/bin/bash

# Configuration VPN pour Quiz App
set -e

echo "🔐 Configuration du serveur VPN..."

VPN_DIR="./vpn-data"
SERVER_NAME="quiz-vpn-server"

# Création du répertoire VPN
mkdir -p $VPN_DIR

# Obtenir l'IP publique
PUBLIC_IP=$(curl -s https://ipinfo.io/ip)
echo "📍 IP publique détectée: $PUBLIC_IP"

# Initialisation du serveur OpenVPN
echo "🔧 Initialisation du serveur OpenVPN..."
docker run -v $PWD/vpn-data:/etc/openvpn --rm kylemanna/openvpn ovpn_genconfig -u udp://$PUBLIC_IP:1194

echo "🔑 Génération des certificats..."
docker run -v $PWD/vpn-data:/etc/openvpn --rm -it kylemanna/openvpn ovpn_initpki

echo "🚀 Démarrage du serveur VPN..."
docker-compose -f docker-compose.vpn.yml up -d

echo "✅ Serveur VPN configuré !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez votre routeur pour rediriger le port 1194 vers $LOCAL_IP"
echo "2. Créez des certificats clients avec: ./scripts/create-vpn-client.sh [nom-client]"
echo "3. Distribuez les fichiers .ovpn aux utilisateurs"
