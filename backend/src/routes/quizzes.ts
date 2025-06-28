
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { validateQuiz, validateRequest } from '../middleware/validation';
import { AuthRequest } from '../types';

const router = express.Router();

// Obtenir tous les quiz de l'utilisateur
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    const result = await pool.query(`
      SELECT q.*, 
             json_agg(
               json_build_object(
                 'id', quest.id,
                 'text', quest.text,
                 'type', quest.type,
                 'points', quest.points,
                 'image_url', quest.image_url,
                 'correct_answer', quest.correct_answer,
                 'order_index', quest.order_index,
                 'answers', quest.answers
               ) ORDER BY quest.order_index
             ) as questions
      FROM quizzes q
      LEFT JOIN (
        SELECT quest.*, 
               json_agg(
                 json_build_object(
                   'id', a.id,
                   'text', a.text,
                   'is_correct', a.is_correct,
                   'points', a.points
                 )
               ) as answers
        FROM questions quest
        LEFT JOIN answers a ON quest.id = a.question_id
        GROUP BY quest.id, quest.text, quest.type, quest.points, quest.image_url, quest.correct_answer, quest.quiz_id, quest.order_index
      ) quest ON q.id = quest.quiz_id
      WHERE q.user_id = $1
      GROUP BY q.id, q.title, q.image_url, q.user_id, q.created_at, q.updated_at
      ORDER BY q.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des quiz:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Créer un nouveau quiz
router.post('/', authenticateToken, validateQuiz, validateRequest, async (req: AuthRequest, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { title, image_url, questions } = req.body;
    const userId = req.user!.id;
    const quizId = uuidv4();

    // Créer le quiz
    const quizResult = await client.query(
      'INSERT INTO quizzes (id, title, image_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [quizId, title, image_url, userId]
    );

    // Créer les questions et réponses
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionId = uuidv4();

      await client.query(
        'INSERT INTO questions (id, text, type, points, image_url, correct_answer, quiz_id, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [questionId, question.text, question.type, question.points, question.image_url, question.correct_answer, quizId, i]
      );

      // Créer les réponses pour les questions à choix
      if (question.answers && question.answers.length > 0) {
        for (const answer of question.answers) {
          const answerId = uuidv4();
          await client.query(
            'INSERT INTO answers (id, text, is_correct, points, question_id) VALUES ($1, $2, $3, $4, $5)',
            [answerId, answer.text, answer.is_correct, answer.points, questionId]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.status(201).json(quizResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la création du quiz:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  } finally {
    client.release();
  }
});

export default router;
