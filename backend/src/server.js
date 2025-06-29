
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes de base
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/quiz', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quizzes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération quiz:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/quiz', async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    const result = await pool.query(
      'INSERT INTO quizzes (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur création quiz:', error);
    res.status(500).json({ error: 'Erreur création quiz' });
  }
});

// Gestion erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Démarrage serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion arrêt propre
process.on('SIGTERM', () => {
  console.log('Arrêt du serveur...');
  pool.end();
  process.exit(0);
});
