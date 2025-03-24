import React from 'react';
import { Question } from '@/types/quiz';
import { SelectedAnswers, OpenEndedAnswers } from '@/hooks/useQuizSubmission';
import { AlertCircle, SendHorizonal } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';

interface SubmitQuizSectionProps {
  questions: Question[];
  selectedAnswers: SelectedAnswers;
  openEndedAnswers: OpenEndedAnswers;
  onSubmit: () => void;
}

const SubmitQuizSection: React.FC<SubmitQuizSectionProps> = ({ questions, selectedAnswers, openEndedAnswers, onSubmit }) => {
  const hasUnansweredQuestions = questions.some(question => {
    if (question.type === 'multiple-choice' || question.type === 'checkbox') {
      return !(question.id in selectedAnswers) || selectedAnswers[question.id].length === 0;
    } else if (question.type === 'open-ended') {
      return !(question.id in openEndedAnswers) || openEndedAnswers[question.id].trim() === '';
    }
    return false;
  });

  return (
    <div className="mb-6">
      {hasUnansweredQuestions && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Il y a des questions sans réponse. Veuillez vérifier vos réponses avant de soumettre.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={onSubmit}
        className="bg-brand-red hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors w-full flex items-center justify-center gap-2"
      >
        <SendHorizonal size={18} />
        <span>Soumettre le Quiz</span>
      </button>
    </div>
  );
};

export default SubmitQuizSection;
