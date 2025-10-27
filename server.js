const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Bienvenue sur Node-App!'));
app.get('/api/health', (req, res) => res.json({status: 'UP'}));
app.get('/api/info', (req, res) => res.json({env: process.env.NODE_ENV || 'development'}));
app.get('/api/time', (req, res) => res.send(new Date().toString()));

app.listen(port, () => console.log(`Serveur lancé sur http://localhost:${port}`));