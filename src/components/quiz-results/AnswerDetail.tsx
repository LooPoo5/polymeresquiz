
import React from 'react';
import { QuizResultAnswer } from './types';

interface AnswerDetailProps {
  answer: QuizResultAnswer;
  question: any;
  index: number;
  totalQuestionPoints: number;
  className?: string;
}

const AnswerDetail = ({ 
  answer, 
  question, 
  index, 
  totalQuestionPoints,
  className = '' 
}: AnswerDetailProps) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-5 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">Question {index + 1}</h4>
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            answer.isCorrect 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          }`}>
            {answer.isCorrect ? 'Correct' : 'Incorrect'}
          </span>
          
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {answer.points}/{totalQuestionPoints} points
          </span>
        </div>
      </div>
      
      <p className="text-gray-800 dark:text-gray-200 mb-4">{question.text}</p>
      
      {question.imageUrl && (
        <img 
          src={question.imageUrl} 
          alt="Question" 
          className="w-full h-auto max-h-32 object-contain mb-4"
        />
      )}
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {question.type === 'open-ended' ? 'Votre réponse:' : 'Réponses:'}
        </p>
        
        {question.type === 'open-ended' ? (
          <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
            <p className="text-sm">{answer.answerText || "Pas de réponse"}</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {question.answers.map((a: any) => {
              const isSelected = answer.givenAnswers.includes(a.id);
              const isCorrect = a.isCorrect;
              
              let itemClassName = "flex items-center p-2 rounded-md ";
              
              if (isSelected && isCorrect) {
                itemClassName += "bg-green-50 dark:bg-green-900/20";
              } else if (isSelected && !isCorrect) {
                itemClassName += "bg-red-50 dark:bg-red-900/20";
              } else if (!isSelected && isCorrect) {
                itemClassName += "bg-blue-50 dark:bg-blue-900/20";
              } else {
                itemClassName += "bg-white dark:bg-gray-700";
              }
              
              return (
                <li key={a.id} className={itemClassName}>
                  <span className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full ${
                    isSelected 
                      ? (isCorrect 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white')
                      : (isCorrect 
                          ? 'bg-blue-100 text-blue-600 border border-blue-500' 
                          : 'border border-gray-400')
                  }`}>
                    {isSelected && (isCorrect ? '✓' : '✗')}
                    {!isSelected && isCorrect && '✓'}
                  </span>
                  <span className={`text-sm ${
                    (isSelected && isCorrect) ? 'font-medium' : 
                    (isSelected && !isCorrect) ? 'line-through' : ''
                  }`}>{a.text}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnswerDetail;
