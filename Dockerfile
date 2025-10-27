# Image de base
FROM node:18-alpine
# Dossier de travail
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .


# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Commande de démarrage
CMD ["npm", "start"]
