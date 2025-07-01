
#!/bin/bash

# Script de création de client VPN
if [ -z "$1" ]; then
    echo "Usage: $0 <nom-du-client>"
    exit 1
fi

CLIENT_NAME="$1"
VPN_DIR="./vpn-data"

echo "👤 Création du client VPN: $CLIENT_NAME"

# Génération du certificat client
docker run -v $PWD/vpn-data:/etc/openvpn --rm -it kylemanna/openvpn easyrsa build-client-full $CLIENT_NAME nopass

# Génération du fichier de configuration client
docker run -v $PWD/vpn-data:/etc/openvpn --rm kylemanna/openvpn ovpn_getclient $CLIENT_NAME > $CLIENT_NAME.ovpn

echo "✅ Fichier client créé: $CLIENT_NAME.ovpn"
echo "📱 Transférez ce fichier à l'utilisateur pour qu'il l'importe dans son app VPN"
