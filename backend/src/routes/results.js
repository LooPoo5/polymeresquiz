
const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Route pour récupérer tous les résultats
router.get('/', async (req, res) => {
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

// Route pour créer un nouveau résultat
router.post('/', async (req, res) => {
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

module.exports = router;
