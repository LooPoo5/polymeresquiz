
FROM nginx:alpine

# Copie des fichiers buildés (à faire après npm run build)
COPY dist /usr/share/nginx/html

# Configuration Nginx sera montée via volume
# Permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
