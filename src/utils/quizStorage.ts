
import { Quiz, QuizResult } from '@/types/quiz';

// Storage keys constants
export const QUIZZES_STORAGE_KEY = 'quizzes';
export const RESULTS_STORAGE_KEY = 'quiz-results';

// Load quizzes from localStorage
export const loadQuizzes = (): Quiz[] => {
  const storedQuizzes = localStorage.getItem(QUIZZES_STORAGE_KEY);
  
  if (storedQuizzes) {
    const parsedQuizzes = JSON.parse(storedQuizzes);
    // Convert string dates back to Date objects
    return parsedQuizzes.map((quiz: any) => ({
      ...quiz,
      createdAt: new Date(quiz.createdAt)
    }));
  }
  
  // Add sample quiz if no quizzes exist
  return [
    {
      id: "sample-quiz-1",
      title: "Introduction aux Polymères",
      imageUrl: "https://images.unsplash.com/photo-1603695980803-c98161d4647b?q=80&w=1000&auto=format&fit=crop",
      questions: [
        {
          id: "q1",
          text: "Qu'est-ce qu'un polymère?",
          type: "multiple-choice",
          points: 2,
          answers: [
            { id: "a1", text: "Un type de métal", isCorrect: false, points: 0 },
            { id: "a2", text: "Une molécule composée de motifs répétitifs", isCorrect: true, points: 2 },
            { id: "a3", text: "Un élément chimique", isCorrect: false, points: 0 },
            { id: "a4", text: "Un minéral naturel", isCorrect: false, points: 0 },
          ],
        },
        {
          id: "q2",
          text: "Expliquez le concept de polymérisation par condensation.",
          type: "text",
          points: 3,
          answers: [],
          correctAnswer: "La polymérisation par condensation est une réaction qui implique la libération d'une petite molécule (souvent de l'eau) lorsque deux monomères se lient pour former une chaîne polymère."
        },
      ],
      createdAt: new Date(),
    },
  ];
};

// Load results from localStorage
export const loadResults = (): QuizResult[] => {
  const storedResults = localStorage.getItem(RESULTS_STORAGE_KEY);
  
  if (storedResults) {
    const parsedResults = JSON.parse(storedResults);
    // Convert string dates back to Date objects
    return parsedResults.map((result: any) => ({
      ...result,
      startTime: new Date(result.startTime),
      endTime: new Date(result.endTime)
    }));
  }
  
  return [];
};

// Save quizzes to localStorage
export const saveQuizzes = (quizzes: Quiz[]): void => {
  localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
};

// Save results to localStorage
export const saveResults = (results: QuizResult[]): void => {
  localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
};
