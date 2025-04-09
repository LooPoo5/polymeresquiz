
import React from 'react';
import { Question } from '@/context/QuizContext';
import { QuizResultAnswer } from './types';
import { CheckCircle, XCircle } from 'lucide-react';

interface AnswerDetailProps {
  answer: QuizResultAnswer;
  question: Question;
  index: number;
  totalQuestionPoints: number;
}

const AnswerDetail: React.FC<AnswerDetailProps> = ({ 
  answer, 
  question,
  index,
  totalQuestionPoints 
}) => {
  // Get the answer display component based on question type
  const getAnswerDisplay = () => {
    if (question.type === 'open-ended') {
      return (
        <div className="mt-2 ml-3">
          <div className="font-medium mb-1 text-sm">Réponse:</div>
          <div className="p-2 bg-gray-50 border rounded text-sm">
            {answer.givenAnswers?.[0] || 'Sans réponse'}
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-2 ml-3">
        <div className="font-medium mb-1 text-sm">Réponses:</div>
        <div className="space-y-1">
          {question.answers.map(option => {
            const isSelected = answer.givenAnswers?.includes(option.id);
            const answerTextColor = isSelected 
              ? (option.isCorrect ? 'text-green-600' : 'text-red-600')
              : 'text-gray-800';
            
            return (
              <div key={option.id} className={`flex items-center text-sm ${answerTextColor}`}>
                <span className="mr-2">
                  {isSelected ? (
                    option.isCorrect ? 
                      <CheckCircle size={16} className="text-green-600" /> : 
                      <XCircle size={16} className="text-red-600" />
                  ) : (
                    <span className="inline-block w-4 h-4 rounded-full border border-gray-300"></span>
                  )}
                </span>
                {option.text}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 shadow-sm question-answer-item">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900 flex-1">
          Q{index + 1}: {question.text}
        </h4>
        <span className="text-sm ml-3 whitespace-nowrap">
          {answer.points}/{totalQuestionPoints}
        </span>
      </div>
      
      {question.imageUrl && (
        <div className="my-2">
          <img 
            src={question.imageUrl} 
            alt={`Question ${index + 1}`} 
            className="max-h-32 max-w-full object-contain" 
          />
        </div>
      )}
      
      {getAnswerDisplay()}
    </div>
  );
};

export default AnswerDetail;
