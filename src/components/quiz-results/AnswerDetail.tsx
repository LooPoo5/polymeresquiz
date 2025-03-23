
import React from 'react';
import { Question } from '@/context/QuizContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerDetailProps {
  answer: {
    questionId: string;
    answerId?: string;
    answerIds?: string[];
    answerText?: string;
    isCorrect: boolean;
    points: number;
  };
  question: Question;
  index: number;
  totalQuestionPoints: number;
}

const AnswerDetail = ({ answer, question, index, totalQuestionPoints }: AnswerDetailProps) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="text-bolt-sm text-gray-500 mb-1">Question {index + 1}</div>
          <div className="font-medium">{question.text}</div>
        </div>
        
        <div className="flex items-center">
          {answer.isCorrect ? 
            <CheckCircle size={20} className="text-green-500 mr-1" /> : 
            <XCircle size={20} className="text-red-500 mr-1" />
          }
          <span className="text-gray-700">
            {answer.points} / {totalQuestionPoints} point(s)
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-sm font-medium mb-2">Votre réponse:</div>
        
        {question.type === 'multiple-choice' && (
          <div>
            {question.answers.map(option => {
              const isSelected = option.id === answer.answerId;
              if (!isSelected) return null;
              return (
                <div key={option.id} className="flex justify-between items-center py-1">
                  <div>{option.text}</div>
                  <div className={cn(
                    option.isCorrect ? "text-green-500" : "text-red-500"
                  )}>
                    {option.isCorrect ? "Vrai" : "Faux"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {question.type === 'checkbox' && (
          <div>
            {question.answers.map(option => {
              const isSelected = answer.answerIds?.includes(option.id);
              if (!isSelected) return null;
              return (
                <div key={option.id} className="flex justify-between items-center py-1">
                  <div>{option.text}</div>
                  <div className={cn(
                    option.isCorrect ? "text-green-500" : "text-red-500"
                  )}>
                    {option.isCorrect ? "Vrai" : "Faux"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {question.type === 'open-ended' && (
          <div className="py-1">
            <div>{answer.answerText || 'Pas de réponse'}</div>
          </div>
        )}
      </div>
      
      {!answer.isCorrect && (
        <div className="mt-3">
          <div className="text-sm font-medium mb-2">Bonne(s) réponse(s) attendue(s):</div>
          
          {question.type === 'multiple-choice' && (
            <div>
              {question.answers.filter(a => {
                // Only show correct answers that weren't selected
                const wasSelected = a.id === answer.answerId;
                return a.isCorrect && !wasSelected;
              }).map(option => (
                <div key={option.id} className="py-1">
                  {option.text}
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'checkbox' && (
            <div>
              {question.answers.filter(a => {
                // Only show correct answers that weren't selected
                const wasSelected = answer.answerIds?.includes(a.id);
                return a.isCorrect && !wasSelected;
              }).map(option => (
                <div key={option.id} className="py-1">
                  {option.text}
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'open-ended' && (
            <div className="py-1">
              {question.correctAnswer || 'Pas de réponse correcte définie'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerDetail;
