#!/bin/bash

echo "Configuration du routage WireGuard vers l'application..."

# Configurer les règles iptables dans le conteneur WireGuard
docker exec quiz-wireguard sh -c '
    # Activer le forwarding IP
    echo 1 > /proc/sys/net/ipv4/ip_forward
    
    # Rediriger le port 8080 de l interface WireGuard vers l application
    iptables -t nat -A PREROUTING -i wg0 -p tcp --dport 8080 -j DNAT --to-destination 172.20.0.1:8080
    iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    iptables -A FORWARD -i wg0 -o eth0 -j ACCEPT
    iptables -A FORWARD -i eth0 -o wg0 -m state --state RELATED,ESTABLISHED -j ACCEPT
    
    echo "Regles iptables configurees"
    iptables -t nat -L PREROUTING
'

echo "Configuration terminee !"
echo ""
echo "Testez maintenant depuis votre mobile :"
echo "1. Navigateur : http://10.13.13.1:8080"
echo "2. Si vous avez Termux : curl http://10.13.13.1:8080"