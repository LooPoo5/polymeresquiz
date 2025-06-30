
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Pool } = require('pg');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration Multer 2.x pour upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limite
  },
  fileFilter: function (req, file, cb) {
    // Accepter seulement les images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées!'), false);
    }
  }
});

// Debug de la DATABASE_URL
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

// Configuration base de données - Désactivation SSL pour les connexions locales
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Désactivé pour les connexions locales Docker
});

// Test de connexion à la base de données
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err);
  } else {
    console.log('✅ Connexion à PostgreSQL réussie');
    release();
  }
});

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan('combined'));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route pour upload d'image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }
    
    res.json({
      message: 'Image uploadée avec succès',
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
});

// Route pour récupérer tous les quiz
app.get('/api/quiz', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, description, questions, created_at, updated_at 
      FROM quizzes 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération quiz:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération des quiz',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route pour récupérer un quiz par ID
app.get('/api/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM quizzes WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur récupération quiz:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer un nouveau quiz
app.post('/api/quiz', async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ 
        error: 'Titre et questions sont requis' 
      });
    }
    
    const result = await pool.query(
      `INSERT INTO quizzes (title, description, questions, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`,
      [title, description || '', JSON.stringify(questions)]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur création quiz:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du quiz',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route pour mettre à jour un quiz
app.put('/api/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;
    
    const result = await pool.query(
      `UPDATE quizzes 
       SET title = $1, description = $2, questions = $3, updated_at = NOW()
       WHERE id = $4 
       RETURNING *`,
      [title, description || '', JSON.stringify(questions), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur mise à jour quiz:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Route pour supprimer un quiz
app.delete('/api/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM quizzes WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz non trouvé' });
    }
    
    res.json({ message: 'Quiz supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression quiz:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Routes pour les résultats
app.get('/api/results', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM quiz_results 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération résultats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/results', async (req, res) => {
  try {
    const { quiz_id, participant_name, answers, score, total_score } = req.body;
    
    const result = await pool.query(
      `INSERT INTO quiz_results (quiz_id, participant_name, answers, score, total_score, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [quiz_id, participant_name, JSON.stringify(answers), score, total_score]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur sauvegarde résultat:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
  }
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ 
    error: 'Erreur serveur interne',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('📴 Arrêt du serveur...');
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 Arrêt du serveur...');
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});
