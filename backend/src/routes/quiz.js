
const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Route pour récupérer tous les quiz
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
