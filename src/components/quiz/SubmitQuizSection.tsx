
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Question as QuestionType } from '@/context/QuizContext';
import { SelectedAnswers, OpenEndedAnswers } from '@/hooks/useQuizSubmission';

interface SubmitQuizSectionProps {
  questions: QuestionType[];
  selectedAnswers: SelectedAnswers;
  openEndedAnswers: OpenEndedAnswers;
  onSubmit: () => void;
}

const SubmitQuizSection = ({
  questions,
  selectedAnswers,
  openEndedAnswers,
  onSubmit
}: SubmitQuizSectionProps) => {
  const hasUnansweredQuestions = questions.some((q: QuestionType) => {
    if (q.type === 'multiple-choice' || q.type === 'checkbox') {
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

export default SubmitQuizSection;
