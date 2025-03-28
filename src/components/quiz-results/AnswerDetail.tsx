
import React from 'react';
import { Check, X } from 'lucide-react';
import { QuizResultAnswer } from './types';

interface AnswerDetailProps {
  answer: QuizResultAnswer;
  question: any;
  index: number;
  totalQuestionPoints: number;
  className?: string;
}

const AnswerDetail: React.FC<AnswerDetailProps> = ({
  answer,
  question,
  index,
  totalQuestionPoints,
  className = ''
}) => {
  // Determine the status icon
  const StatusIcon = answer.isCorrect ? Check : X;
  const statusClass = answer.isCorrect ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200";

  const renderAnswerContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="pl-2 border-l-2 border-gray-300 ml-2">
            {question.answers.map((a: any) => {
              const isCorrectAnswer = a.isCorrect;
              const wasSelected = answer.givenAnswers.includes(a.id);
              
              // Determine answer styling
              let answerClass = "flex items-center py-1";
              if (isCorrectAnswer && wasSelected) {
                // Correct answer that was selected
                answerClass += " text-green-600";
              } else if (!isCorrectAnswer && wasSelected) {
                // Incorrect answer that was selected
                answerClass += " text-red-600";
              } else if (isCorrectAnswer) {
                // Correct answer that was not selected
                answerClass += " text-gray-500";
              } else {
                // Incorrect answer that was not selected
                answerClass += " text-gray-500";
              }

              return (
                <div key={a.id} className={answerClass}>
                  <span className="mr-2">
                    {wasSelected ? (
                      <span className="inline-flex items-center justify-center w-4 h-4 border border-current rounded-full text-xs">
                        {isCorrectAnswer ? '✓' : '✗'}
                      </span>
                    ) : (
                      <span className="inline-block w-4 h-4 border border-gray-300 rounded-full"></span>
                    )}
                  </span>
                  <span>{a.text}</span>
                </div>
              );
            })}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="pl-2 border-l-2 border-gray-300 ml-2">
            {question.answers.map((a: any) => {
              const isCorrectAnswer = a.isCorrect;
              const wasSelected = answer.givenAnswers.includes(a.id);
              
              // Determine checkbox styling
              let checkboxClass = "flex items-center py-1";
              if (isCorrectAnswer && wasSelected) {
                checkboxClass += " text-green-600";
              } else if (!isCorrectAnswer && wasSelected) {
                checkboxClass += " text-red-600";
              } else if (isCorrectAnswer) {
                checkboxClass += " text-gray-500";
              } else {
                checkboxClass += " text-gray-500";
              }

              return (
                <div key={a.id} className={checkboxClass}>
                  <span className="mr-2">
                    {wasSelected ? (
                      <span className="inline-flex items-center justify-center w-4 h-4 border border-current rounded text-xs">
                        {isCorrectAnswer ? '✓' : '✗'}
                      </span>
                    ) : (
                      <span className="inline-block w-4 h-4 border border-gray-300 rounded"></span>
                    )}
                  </span>
                  <span>{a.text}</span>
                </div>
              );
            })}
          </div>
        );
        
      case 'open-ended':
        return (
          <div className="pl-2 border-l-2 border-gray-300 ml-2 mt-2">
            <div className="text-sm text-gray-600 mb-1">Votre réponse :</div>
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
              {answer.givenAnswers[0] || "-"}
            </div>
            
            {question.correctAnswer && (
              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-1">Réponse attendue :</div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-900">
                  {question.correctAnswer}
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return <div className="text-gray-500">Type de question non pris en charge</div>;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 ${className} print:break-inside-avoid`}>
      <div className="flex flex-wrap gap-2 justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium dark:text-white">
            Question {index + 1}: {question.text}
          </h4>
          {question.imageUrl && (
            <div className="mt-2 mb-3">
              <img 
                src={question.imageUrl} 
                alt={`Image pour question ${index + 1}`}
                className="max-h-32 object-contain rounded-md border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-start gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClass} flex items-center gap-1`}>
            <StatusIcon size={14} />
            <span>{answer.isCorrect ? "Correcte" : "Incorrecte"}</span>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {answer.points} / {totalQuestionPoints} pts
          </div>
        </div>
      </div>
      
      {renderAnswerContent()}
    </div>
  );
};

export default AnswerDetail;
