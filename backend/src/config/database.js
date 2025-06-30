
const { Pool } = require('pg');

// Configuration base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test de connexion à la base de données
const initializeDatabase = () => {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Erreur de connexion à la base de données:', err);
    } else {
      console.log('✅ Connexion à PostgreSQL réussie');
      release();
    }
  });
};

module.exports = { pool, initializeDatabase };
