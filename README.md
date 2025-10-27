##  **Exercice 3 – Création d’une application web Node.js**

**Durée estimée :** 50 minutes
**Objectif :** Containeriser une application Node.js simple avec plusieurs routes et ajouter un health check.

---

### 🔹 **1. Créer le dossier du projet**

Dans CMD, va dans ton dossier de travail et crée le projet :

```bash
mkdir node-app
cd node-app
```

📸 **Capture :** CMD affichant le dossier créé.

<img width="631" height="132" alt="image" src="https://github.com/user-attachments/assets/99f614aa-e555-47b5-9f2f-c3bc1ea867ba" />

### 🔹 **2. Créer les fichiers du projet**

#### a) `package.json`

```bash
npm init -y
npm install express
```

 Contenu minimal de `package.json` (si tu veux l’écrire manuellement) :

```json
{
  "name": "node-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

#### b) `server.js`

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Bienvenue sur Node-App!'));
app.get('/api/health', (req, res) => res.json({status: 'UP'}));
app.get('/api/info', (req, res) => res.json({env: process.env.NODE_ENV || 'development'}));
app.get('/api/time', (req, res) => res.send(new Date().toString()));

app.listen(port, () => console.log(`Serveur lancé sur http://localhost:${port}`));
```

📸 **Capture :** éditeur avec `server.js` ou terminal test `node server.js`.

---

#### c) `.dockerignore`

```
node_modules
npm-debug.log
```

---

#### d) `Dockerfile`

```Dockerfile
# Image de base
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste des fichiers
COPY . .

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Commande de démarrage
CMD ["npm", "start"]
```

---

### 🔹 **3. Construire l’image Docker**

```bash
docker build -t node-app:1.0 .
```

📸 **Capture :** terminal affichant le build réussi.
<img width="1197" height="313" alt="image" src="https://github.com/user-attachments/assets/b8a17e33-2ffc-4003-82f1-0df30e3b557d" />

### 🔹 **4. Lancer le conteneur sur le port 3000**

```bash
docker run -d -p 3000:3000 --name node-app node-app:1.0
```

📸 **Capture :** ID du conteneur affiché.

<img width="1087" height="82" alt="image" src="https://github.com/user-attachments/assets/7ed6fd52-8b3e-4a0c-8e98-08371dfb9ed6" />

### 🔹 **5. Tester les routes**

Ouvre le navigateur ou utilise `curl` :

```bash
curl http://localhost:3000/
curl http://localhost:3000/api/health
curl http://localhost:3000/api/info
curl http://localhost:3000/api/time
```

📸 **Capture :** affichage des réponses pour chaque route.

<img width="851" height="177" alt="image" src="https://github.com/user-attachments/assets/355fe6ee-b017-4390-8093-12b1f4d0cf94" />

### 🔹 **6. Optimiser le Dockerfile**

* Utiliser `node:18-alpine` pour une image plus légère (déjà fait)
* Copier uniquement les fichiers nécessaires
* Installer uniquement les dépendances de production (`--production`)

---

### 🔹 **7. Reconstruire avec un nouveau tag**

```bash
docker build -t node-app:1.1 .
```

---
<img width="1296" height="522" alt="image" src="https://github.com/user-attachments/assets/5af4b91e-5ac8-4f09-a429-9cec5e33e7e7" />
### 🔹 **8. Comparer la taille des images**

```bash
docker images
```

📸 **Capture :** montre la taille des images `node-app:1.0` et `node-app:1.1`.

<img width="1190" height="452" alt="image" src="https://github.com/user-attachments/assets/99d58324-0133-46c1-8aee-42201f5c130c" />

### 🔹 **9. Tester le health check**

```bash
docker inspect --format='{{json .State.Health}}' node-app
```

> Vérifie si le conteneur est **healthy**.

📸 **Capture :** état `healthy`.

---

### 🔹 **10. Notes et conseils**

* Pour arrêter le conteneur :

```bash
docker stop node-app
docker rm node-app
```
<img width="737" height="187" alt="image" src="https://github.com/user-attachments/assets/2d824326-812b-49e1-94ab-cc66b91529f1" />


* on peut toujours reconstruire ou mettre à jour l’application facilement grâce au Dockerfile.

