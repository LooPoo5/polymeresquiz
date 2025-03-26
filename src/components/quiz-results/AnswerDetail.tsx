
import React from 'react';
import { Question } from '@/context/QuizContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { QuizResultAnswer } from './types';

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
  const isCorrect = answer.isCorrect;
  const scoreText = `${answer.points}/${totalQuestionPoints}`;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 quiz-result-answer page-break-inside-avoid">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-medium">Question {index + 1}: {question.text}</h4>
          
          {question.imageUrl && (
            <div className="my-2">
              <img 
                src={question.imageUrl} 
                alt={`Image pour question ${index + 1}`} 
                className="max-h-40 object-contain"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className={`px-2 py-0.5 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {scoreText}
          </div>
          {isCorrect ? 
            <CheckCircle className="text-green-500 h-5 w-5" /> : 
            <XCircle className="text-red-500 h-5 w-5" />
          }
        </div>
      </div>
      
      <div className="text-sm text-gray-600 space-y-2 ml-4">
        {question.type === 'open-ended' ? (
          <div>
            <div className="font-medium mb-1">Réponse :</div>
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              {answer.givenAnswers[0] || "Sans réponse"}
            </div>
          </div>
        ) : (
          <>
            <div className="font-medium mb-1">Réponses :</div>
            {question.answers.map(option => {
              const isSelected = answer.givenAnswers.includes(option.id);
              const isCorrectAnswer = option.isCorrect;
              
              return (
                <div 
                  key={option.id} 
                  className={`flex items-center gap-2 ${
                    isSelected && isCorrectAnswer 
                      ? 'text-green-700' 
                      : isSelected && !isCorrectAnswer 
                        ? 'text-red-700' 
                        : !isSelected && isCorrectAnswer 
                          ? 'text-amber-700' 
                          : ''
                  }`}
                >
                  <div className={`h-4 w-4 flex-shrink-0 border rounded-full ${
                    question.type === 'checkbox' ? 'rounded-sm' : ''
                  } ${
                    isSelected ? 'bg-gray-800 border-gray-800' : 'border-gray-400'
                  }`}>
                  </div>
                  <span>{option.text}</span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default AnswerDetail;
