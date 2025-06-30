
const express = require('express');
const path = require('path');
require('dotenv').config();

// Import des modules refactorisés
const { initializeDatabase } = require('./config/database');
const setupSecurity = require('./middleware/security');
const apiRoutes = require('./routes/api');
const quizRoutes = require('./routes/quiz');
const resultsRoutes = require('./routes/results');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialisation de la base de données
initializeDatabase();

// Configuration de la sécurité
setupSecurity(app);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes API
app.use('/api', apiRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultsRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Route 404
app.use('*', notFoundHandler);

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

// Gestion de l'arrêt gracieux
const gracefulShutdown = () => {
  console.log('📴 Arrêt du serveur...');
  server.close(() => {
    const { pool } = require('./config/database');
    pool.end();
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
