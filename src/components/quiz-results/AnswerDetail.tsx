import React from 'react';
import { Question } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { Check, X } from 'lucide-react';

interface AnswerDetailProps {
  answer: any;
  question: Question;
  index: number;
  totalQuestionPoints: number;
}

const AnswerDetail: React.FC<AnswerDetailProps> = ({ answer, question, index, totalQuestionPoints }) => {
  const isCorrect = answer.isCorrect;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-semibold mb-2">Question {index + 1}: {question.text}</h4>
      
      {question.type === 'open-ended' ? (
        <>
          <p className="text-gray-700 mb-2">
            <strong>Votre réponse:</strong> {answer.answerText || 'Pas de réponse'}
          </p>
          <p className="text-gray-700">
            <strong>Réponse correcte:</strong> {question.correctAnswer || 'N/A'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {isCorrect ? (
              <>
                <Check className="text-green-500" size={16} />
                <span className="text-green-500">Correct</span>
              </>
            ) : (
              <>
                <X className="text-red-500" size={16} />
                <span className="text-red-500">Incorrect</span>
              </>
            )}
            <span className="text-gray-500">({answer.points}/{question.points} points)</span>
          </div>
        </>
      ) : (
        <>
          {answer.answerIds ? (
            // Checkbox question
            <>
              <p className="text-gray-700 mb-2">
                <strong>Vos réponses:</strong>
                <ul>
                  {question.answers
                    .filter(qAnswer => answer.answerIds?.includes(qAnswer.id))
                    .map(qAnswer => (
                      <li key={qAnswer.id}>
                        {qAnswer.text} ({qAnswer.isCorrect ? 'Correct' : 'Incorrect'})
                      </li>
                    ))}
                </ul>
              </p>
              <div className="flex items-center gap-2 mt-2">
                {isCorrect ? (
                  <>
                    <Check className="text-green-500" size={16} />
                    <span className="text-green-500">Correct</span>
                  </>
                ) : (
                  <>
                    <X className="text-red-500" size={16} />
                    <span className="text-red-500">Incorrect</span>
                  </>
                )}
                <span className="text-gray-500">({answer.points}/{totalQuestionPoints} points)</span>
              </div>
            </>
          ) : (
            // Multiple-choice question
            <>
              <p className="text-gray-700 mb-2">
                <strong>Votre réponse:</strong> {question.answers.find(qAnswer => qAnswer.id === answer.answerId)?.text || 'Pas de réponse'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {isCorrect ? (
                  <>
                    <Check className="text-green-500" size={16} />
                    <span className="text-green-500">Correct</span>
                  </>
                ) : (
                  <>
                    <X className="text-red-500" size={16} />
                    <span className="text-red-500">Incorrect</span>
                  </>
                )}
                <span className="text-gray-500">({answer.points}/{totalQuestionPoints} points)</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AnswerDetail;
