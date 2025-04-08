
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz, QuizResult, Question } from '@/context/QuizContext';
import { toast } from "sonner";

export const useQuizResult = (id: string | undefined) => {
  const { getResult, getQuiz } = useQuiz();
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Record<string, Question>>({});
  
  useEffect(() => {
    if (id) {
      const resultData = getResult(id);
      if (resultData) {
        setResult(resultData);

        // Get quiz questions for reference
        const quiz = getQuiz(resultData.quizId);
        if (quiz) {
          const questionsMap: Record<string, Question> = {};
          quiz.questions.forEach(q => {
            questionsMap[q.id] = q;
          });
          setQuizQuestions(questionsMap);
        }
      } else {
        toast.error("Résultat introuvable");
        navigate('/results');
      }
    }
  }, [id, getResult, getQuiz, navigate]);

  // Calculate metrics if we have a result
  const metrics = result ? {
    // Calculate score on 20 (with one decimal place)
    scoreOn20: (result.totalPoints / result.maxPoints) * 20,
    
    // Calculate success rate (rounded to integer)
    successRate: Math.floor(result.totalPoints / result.maxPoints * 100),
    
    // Calculate duration
    durationInSeconds: Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000)
  } : null;

  return {
    result,
    quizQuestions,
    metrics
  };
};
