#!/bin/bash

# Configuration HTTPS avec Let's Encrypt
set -e

DOMAIN=${1:-"quiz.votre-domaine.com"}
EMAIL=${2:-"votre-email@gmail.com"}

echo "🔒 Configuration HTTPS pour $DOMAIN"

# Installation de Certbot
if ! command -v certbot &> /dev/null; then
    echo "📥 Installation de Certbot..."
    apt update && apt install -y certbot python3-certbot-nginx
fi

# Génération du certificat SSL
echo "🛡️ Génération du certificat SSL..."
certbot certonly --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Copie des certificats
echo "📋 Copie des certificats..."
mkdir -p ./ssl
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./ssl/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./ssl/key.pem

# Mise à jour de la configuration Nginx
echo "⚙️ Configuration Nginx HTTPS..."
cat > ./config/nginx-https.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Redirection HTTP vers HTTPS
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }
    
    # Configuration HTTPS
    server {
        listen 443 ssl http2;
        server_name _;
        
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;
        
        root /usr/share/nginx/html;
        index index.html;
        
        # Configuration SPA React
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # API Backend
        location /api/ {
            proxy_pass http://api:3001/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

echo "✅ Configuration HTTPS terminée !"
echo ""
echo "🔧 Prochaines étapes :"
echo "1. Configurez votre DNS : $DOMAIN -> IP_PUBLIQUE_NAS"
echo "2. Configurez le port forwarding : 443 -> IP_NAS:443"
echo "3. Redémarrez avec HTTPS : docker-compose -f docker-compose.https.yml up -d"