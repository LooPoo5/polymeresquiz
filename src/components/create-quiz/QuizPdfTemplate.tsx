
import React, { forwardRef } from 'react';
import SignatureSection from '@/components/quiz/SignatureSection';
import { Question } from '@/context/QuizContext';

type QuizPdfTemplateProps = {
  title: string;
  imageUrl?: string;
  questions: Question[];
};

const QuizPdfTemplate = forwardRef<HTMLDivElement, QuizPdfTemplateProps>(
  ({ title, imageUrl, questions }, ref) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <div ref={ref} className="p-10 bg-white max-w-[210mm]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          
          {imageUrl && (
            <div className="mt-4 flex justify-center">
              <img 
                src={imageUrl} 
                alt={title} 
                className="max-h-32 object-contain" 
              />
            </div>
          )}
        </div>

        {/* Information du participant */}
        <div className="mb-8 border-t border-b py-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du participant
                </label>
                <div className="border border-gray-300 rounded-md h-10 w-full"></div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="border border-gray-300 rounded-md h-10 w-full">
                  <span className="text-sm text-gray-500 p-2">{formattedDate}</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formateur
                </label>
                <div className="border border-gray-300 rounded-md h-10 w-full"></div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signature
                </label>
                <div className="border border-gray-300 rounded-md h-24 w-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Questions</h2>
          
          {questions.map((question, questionIndex) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="mb-3">
                <p className="font-medium">Question {questionIndex + 1}: {question.text}</p>
                {question.imageUrl && (
                  <div className="my-2">
                    <img 
                      src={question.imageUrl} 
                      alt={`Image pour question ${questionIndex + 1}`} 
                      className="max-h-40 object-contain"
                    />
                  </div>
                )}
              </div>
              
              {question.type === 'multiple-choice' && (
                <div className="space-y-2 pl-4">
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answer.id} className="flex items-center">
                      <div className="h-4 w-4 border border-gray-400 rounded-full mr-2"></div>
                      <span>{answer.text}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'checkbox' && (
                <div className="space-y-2 pl-4">
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answer.id} className="flex items-center">
                      <div className="h-4 w-4 border border-gray-400 mr-2"></div>
                      <span>{answer.text}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'open-ended' && (
                <div className="mt-2 border border-gray-300 rounded-md h-24 w-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

QuizPdfTemplate.displayName = 'QuizPdfTemplate';

export default QuizPdfTemplate;
