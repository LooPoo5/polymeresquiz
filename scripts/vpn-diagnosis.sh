#!/bin/bash

echo "Diagnostic WireGuard..."

# 1. Vérifier le conteneur WireGuard
echo "📊 Statut conteneur WireGuard :"
docker ps | grep wireguard || echo "❌ Conteneur WireGuard non trouvé"

# 2. Vérifier la configuration du serveur
echo -e "\n🔧 Configuration serveur WireGuard :"
docker exec quiz-wireguard wg show 2>/dev/null || echo "❌ Impossible d'accéder à WireGuard"

# 3. Afficher la configuration client 1
echo -e "\n📱 Configuration client 1 :"
if docker exec quiz-wireguard test -f /config/peer1/peer1.conf 2>/dev/null; then
    echo "✅ Configuration client disponible"
    docker exec quiz-wireguard cat /config/peer1/peer1.conf
else
    echo "❌ Configuration client non trouvée"
fi

# 4. Test de connectivité réseau
echo -e "\n🌐 Test connectivité :"
echo "IP locale : $(hostname -I | awk '{print $1}')"
echo "Port 51820 ouvert ? $(ss -ulpn | grep :51820 && echo "✅ OUI" || echo "❌ NON")"

# 5. Vérifier les logs WireGuard
echo -e "\n📋 Derniers logs WireGuard :"
docker logs quiz-wireguard --tail=10

# 6. Test depuis le conteneur vers l'app
echo -e "\n🔌 Test depuis WireGuard vers l'app :"
docker exec quiz-wireguard ping -c 2 172.20.0.1 2>/dev/null && echo "✅ Ping vers network OK" || echo "❌ Ping vers network failed"

# 7. Vérifier les routes
echo -e "\n🛣️ Routes WireGuard :"
docker exec quiz-wireguard ip route 2>/dev/null || echo "❌ Impossible de vérifier les routes"

echo -e "\n💡 Actions suggérées :"
echo "1. Scannez le QR code avec votre app WireGuard"
echo "2. Activez la connexion VPN sur votre appareil"
echo "3. Depuis mobile, testez : ping 10.13.13.1"
echo "4. Depuis mobile, testez : curl http://10.13.13.1:8080"