#!/bin/bash

# Configuration VPN simple pour accès mobile
echo "📱 Configuration accès mobile via VPN"

# Vérification que l'app fonctionne localement
echo "🔍 Test de l'application..."
curl -I http://192.168.1.48:8080

# Configuration du port forwarding
echo "🌐 Instructions pour accès distant:"
echo ""
echo "1. Dans votre box/routeur (192.168.1.1):"
echo "   - Port forwarding: 8080 → 192.168.1.48:8080"
echo ""
echo "2. Trouvez votre IP publique:"
curl -s https://ipinfo.io/ip
echo ""
echo ""
echo "3. Accès mobile: http://[IP_PUBLIQUE]:8080"
echo ""
echo "⚠️  ATTENTION: Non sécurisé sans HTTPS !"
echo "   Utilisez uniquement pour des tests"