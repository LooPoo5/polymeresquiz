
-- Schema pour l'application Quiz
-- PostgreSQL Database Schema

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des quiz
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des résultats de quiz
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    participant_name VARCHAR(255) NOT NULL,
    participant_date DATE,
    instructor_name VARCHAR(255),
    signature TEXT,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total_score INTEGER NOT NULL DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_quizzes_created_at ON quizzes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_participant ON quiz_results(participant_name);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at sur les quiz
CREATE TRIGGER update_quizzes_updated_at 
    BEFORE UPDATE ON quizzes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Données de test (optionnel)
INSERT INTO quizzes (title, description, questions) VALUES 
(
    'Quiz de démonstration',
    'Un quiz de test pour vérifier le fonctionnement de l''application',
    '[
        {
            "id": "q1",
            "text": "Quelle est la capital de la France ?",
            "type": "multiple-choice",
            "points": 2,
            "answers": [
                {"id": "a1", "text": "Paris", "isCorrect": true},
                {"id": "a2", "text": "Lyon", "isCorrect": false},
                {"id": "a3", "text": "Marseille", "isCorrect": false},
                {"id": "a4", "text": "Toulouse", "isCorrect": false}
            ]
        },
        {
            "id": "q2",
            "text": "Expliquez brièvement l''importance de la documentation dans un projet.",
            "type": "open-ended",
            "points": 3,
            "answers": [],
            "correctAnswer": "La documentation est essentielle pour maintenir et faire évoluer un projet."
        }
    ]'
) ON CONFLICT DO NOTHING;

-- Vues utiles pour les statistiques
CREATE OR REPLACE VIEW quiz_stats AS
SELECT 
    q.id,
    q.title,
    COUNT(qr.id) as total_attempts,
    AVG(qr.score::float / qr.total_score::float * 100) as average_score,
    MIN(qr.created_at) as first_attempt,
    MAX(qr.created_at) as last_attempt
FROM quizzes q
LEFT JOIN quiz_results qr ON q.id = qr.quiz_id
GROUP BY q.id, q.title;

-- Vue pour les statistiques des participants
CREATE OR REPLACE VIEW participant_stats AS
SELECT 
    participant_name,
    COUNT(*) as total_quizzes,
    AVG(score::float / total_score::float * 100) as average_score,
    MAX(score::float / total_score::float * 100) as best_score,
    MIN(score::float / total_score::float * 100) as worst_score,
    COUNT(DISTINCT quiz_id) as unique_quizzes
FROM quiz_results
GROUP BY participant_name;

-- Permissions (ajustez selon vos besoins)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO quiz_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO quiz_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO quiz_user;
