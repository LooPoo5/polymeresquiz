
// Middleware de gestion d'erreurs
const errorHandler = (err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ 
    error: 'Erreur serveur interne',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Route 404
const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
};

module.exports = { errorHandler, notFoundHandler };
