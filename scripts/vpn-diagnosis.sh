#!/bin/bash

echo "Diagnostic WireGuard..."

echo "Statut conteneur WireGuard :"
docker ps | grep wireguard || echo "Conteneur WireGuard non trouve"

echo ""
echo "Configuration serveur WireGuard :"
docker exec quiz-wireguard wg show 2>/dev/null || echo "Impossible d'acceder a WireGuard"

echo ""
echo "Configuration client 1 :"
if docker exec quiz-wireguard test -f /config/peer1/peer1.conf 2>/dev/null; then
    echo "Configuration client disponible"
    docker exec quiz-wireguard cat /config/peer1/peer1.conf
else
    echo "Configuration client non trouvee"
fi

echo ""
echo "Test connectivite :"
echo "IP locale : $(hostname -I | awk '{print $1}')"
echo "Port 51820 ouvert ?"
ss -ulpn | grep :51820 && echo "OUI" || echo "NON"

echo ""
echo "Derniers logs WireGuard :"
docker logs quiz-wireguard --tail=10

echo ""
echo "Test depuis WireGuard vers l'app :"
docker exec quiz-wireguard ping -c 2 172.20.0.1 2>/dev/null && echo "Ping vers network OK" || echo "Ping vers network failed"

echo ""
echo "Routes WireGuard :"
docker exec quiz-wireguard ip route 2>/dev/null || echo "Impossible de verifier les routes"

echo ""
echo "Actions suggerees :"
echo "1. Scannez le QR code avec votre app WireGuard"
echo "2. Activez la connexion VPN sur votre appareil"
echo "3. Depuis mobile, testez : ping 10.13.13.1"
echo "4. Depuis mobile, testez : curl http://10.13.13.1:8080"