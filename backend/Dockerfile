
FROM node:18-alpine

WORKDIR /app

# Installation des dépendances système
RUN apk add --no-cache curl

# Mettre à jour npm vers une version compatible avec Node.js 18
RUN npm install -g npm@10.9.0

# Copie des fichiers package
COPY package*.json ./

# Installation avec nettoyage du cache
RUN npm cache clean --force && \
    npm install --only=production --legacy-peer-deps

# Copie du code source
COPY src ./src

# Création des dossiers nécessaires
RUN mkdir -p uploads logs

# Utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["node", "src/server.js"]
