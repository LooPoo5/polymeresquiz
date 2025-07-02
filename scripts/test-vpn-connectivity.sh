#!/bin/bash

echo "🔍 Test de connectivité VPN détaillé..."

# 1. Vérifier que le serveur WireGuard fonctionne
echo "📡 Statut WireGuard :"
docker exec quiz-wireguard wg show

# 2. Vérifier les interfaces réseau
echo -e "\n🌐 Interfaces réseau :"
ip addr show | grep -A3 "wg0\|docker\|br-"

# 3. Tester la connectivité depuis le conteneur WireGuard
echo -e "\n🔌 Test depuis le conteneur WireGuard vers l'application :"
docker exec quiz-wireguard ping -c 2 localhost || echo "❌ Ping localhost failed"
docker exec quiz-wireguard wget -qO- --timeout=5 http://localhost:8080 > /dev/null && echo "✅ App accessible via localhost" || echo "❌ App NOT accessible via localhost"

# 4. Vérifier les ports ouverts
echo -e "\n🚪 Ports ouverts :"
ss -tlnp | grep -E ":8080|:3001|:51820"

# 5. Vérifier les règles iptables pour WireGuard
echo -e "\n🛡️ Règles iptables WireGuard :"
iptables -t nat -L | grep -E "wg0|10.13.13" || echo "Aucune règle NAT trouvée"

echo -e "\n💡 Instructions pour tester depuis mobile :"
echo "1. Connectez-vous au VPN sur mobile"
echo "2. Vérifiez votre IP : curl ifconfig.me"
echo "3. Testez ping : ping 10.13.13.1"
echo "4. Testez l'app : curl http://10.13.13.1:8080"