
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Obtenir tous les résultats de l'utilisateur
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    const result = await pool.query(`
      SELECT r.*, q.title as quiz_title
      FROM quiz_results r
      LEFT JOIN quizzes q ON r.quiz_id = q.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Créer un nouveau résultat
router.post('/', async (req, res) => {
  try {
    const {
      quiz_id,
      quiz_title,
      participant_name,
      participant_date,
      participant_instructor,
      participant_signature,
      answers,
      total_points,
      max_points,
      start_time,
      end_time,
      user_id
    } = req.body;

    const resultId = uuidv4();

    const result = await pool.query(`
      INSERT INTO quiz_results (
        id, quiz_id, quiz_title, participant_name, participant_date,
        participant_instructor, participant_signature, answers,
        total_points, max_points, start_time, end_time, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      resultId, quiz_id, quiz_title, participant_name, participant_date,
      participant_instructor, participant_signature, JSON.stringify(answers),
      total_points, max_points, start_time, end_time, user_id
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création du résultat:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
