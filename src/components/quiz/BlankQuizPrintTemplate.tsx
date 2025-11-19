import React, { forwardRef } from 'react';
import { Question } from '@/context/QuizContext';

interface BlankQuizPrintTemplateProps {
  title: string;
  imageUrl?: string;
  questions: Question[];
}

const BlankQuizPrintTemplate = forwardRef<HTMLDivElement, BlankQuizPrintTemplateProps>(
  ({ title, imageUrl, questions }, ref) => {
    return (
      <div ref={ref} className="bg-white p-3 text-black">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold mb-2 text-center">{title}</h1>
          {imageUrl && (
            <div className="flex justify-center mb-2">
              <img 
                src={imageUrl} 
                alt="Quiz" 
                className="max-w-full h-auto max-h-32 object-contain"
              />
            </div>
          )}
        </div>

        {/* Participant Information Section */}
        <div className="mb-3 p-2 border border-gray-300">
          <h2 className="text-base font-bold mb-2">Informations du participant</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1">Nom du participant :</label>
              <div className="border-b-2 border-gray-400 h-6"></div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Date :</label>
              <div className="border-b-2 border-gray-400 h-6"></div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">Formateur :</label>
              <div className="border-b-2 border-gray-400 h-6"></div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">Signature :</label>
              <div className="border-b-2 border-gray-400 h-12"></div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-3">
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune question disponible</p>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="break-inside-avoid mb-3 page-break-inside-avoid">
                <div className="mb-1">
                  <h3 className="text-base font-bold mb-1">
                    Question {index + 1}: {question.text}
                  </h3>
                  {question.imageUrl && (
                    <div className="my-1">
                      <img 
                        src={question.imageUrl} 
                        alt={`Question ${index + 1}`}
                        className="max-w-full h-auto max-h-32 object-contain"
                      />
                    </div>
                  )}
                </div>

                {question.type === 'multiple-choice' && (
                  <div className="space-y-1 ml-2">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 rounded flex-shrink-0"></div>
                        <span className="text-xs">{answer.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'checkbox' && (
                  <div className="space-y-1 ml-2">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 flex-shrink-0"></div>
                        <span className="text-xs">{answer.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'open-ended' && (
                  <div className="ml-2 mt-1">
                    <div className="border border-gray-300 p-2 min-h-[60px]">
                      <p className="text-xs text-gray-500 italic">Espace pour la réponse...</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
);

BlankQuizPrintTemplate.displayName = 'BlankQuizPrintTemplate';

export default BlankQuizPrintTemplate;
