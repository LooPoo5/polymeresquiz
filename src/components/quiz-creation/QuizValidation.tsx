
import React from 'react';
import { QuestionType } from '@/context/QuizContext';

interface QuizValidationProps {
  title: string;
  questions: QuestionType[];
}

const QuizValidation: React.FC<QuizValidationProps> = ({ title, questions }) => {
  const validateQuiz = () => {
    const errors = [];
    
    if (!title.trim()) {
      errors.push("Veuillez saisir un titre pour le quiz");
    }
    
    if (questions.length === 0) {
      errors.push("Ajoutez au moins une question");
      return errors;
    }
    
    const hasEmptyQuestion = questions.some((q) => !q.text.trim());
    if (hasEmptyQuestion) {
      errors.push("Toutes les questions doivent avoir un texte");
    }
    
    const hasInvalidMultipleChoice = questions.some(
      (q) => (q.type === 'multiple-choice' || q.type === 'checkbox' || q.type === 'satisfaction') && 
             q.answers.length < 2
    );
    if (hasInvalidMultipleChoice) {
      errors.push("Les questions à choix doivent avoir au moins 2 réponses");
    }
    
    const hasNoCorrectAnswer = questions.some(
      (q) => (q.type === 'multiple-choice' || q.type === 'checkbox' || q.type === 'satisfaction') && 
             !q.answers.some(a => a.isCorrect)
    );
    if (hasNoCorrectAnswer) {
      errors.push("Chaque question à choix doit avoir au moins une réponse correcte");
    }
    
    return errors;
  };
  
  return { validateQuiz };
};

export default QuizValidation;
