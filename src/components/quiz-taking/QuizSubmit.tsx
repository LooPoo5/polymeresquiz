
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Question as QuestionType } from '@/context/QuizContext';

interface QuizSubmitProps {
  questions: QuestionType[];
  selectedAnswers: Record<string, string[]>;
  openEndedAnswers: Record<string, string>;
  onSubmit: () => void;
}

const QuizSubmit: React.FC<QuizSubmitProps> = ({
  questions,
  selectedAnswers,
  openEndedAnswers,
  onSubmit,
}) => {
  const hasUnansweredQuestions = questions.some((q) => {
    if (q.type === 'multiple-choice' || q.type === 'checkbox' || q.type === 'satisfaction') {
      return !selectedAnswers[q.id] || selectedAnswers[q.id].length === 0;
    } else {
      return !openEndedAnswers[q.id] || openEndedAnswers[q.id].trim() === '';
    }
  });

  return (
    <div className="border-t border-gray-100 pt-6">
      <div className="flex justify-between items-center">
        <div>
          {hasUnansweredQuestions && (
            <div className="text-sm text-amber-600">
              Attention : Certaines questions n'ont pas de réponse.
            </div>
          )}
        </div>
        <Button 
          onClick={onSubmit} 
          className="bg-brand-red text-white px-6 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all hover:bg-opacity-90"
        >
          <CheckCircle size={20} />
          <span>Valider vos réponses</span>
        </Button>
      </div>
    </div>
  );
};

export default QuizSubmit;
