
import React, { useRef } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import { Trash2, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AnswerComponent from './AnswerComponent';
import QuestionOpenEnded from './QuestionOpenEnded';

interface QuestionEditorProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddAnswer: () => void;
  handleAnswerChange: (index: number, text: string, isCorrect: boolean, points: number) => void;
  handleAnswerDelete: (index: number) => void;
  handleCorrectAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onChange,
  onTypeChange,
  onPointsChange,
  handleAddAnswer,
  handleAnswerChange,
  handleAnswerDelete,
  handleCorrectAnswerChange,
  handleImageUpload,
  handleRemoveImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de question
          </label>
          <select
            value={question.type}
            onChange={onTypeChange}
            className="w-full border border-gray-200 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          >
            <option value="multiple-choice">Choix unique</option>
            <option value="checkbox">Choix multiple</option>
            <option value="text">Réponse texte</option>
            <option value="satisfaction">Satisfaction</option>
          </select>
        </div>
        
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points
          </label>
          <Input
            type="number"
            min="1"
            value={question.points}
            onChange={onPointsChange}
            className="w-full border border-gray-200 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image (optionnel)
        </label>
        
        {question.imageUrl ? (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 mb-4 flex justify-center">
            <img 
              src={question.imageUrl} 
              alt="Question" 
              className="max-h-60 object-contain"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors"
              aria-label="Supprimer l'image"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center mb-4 cursor-pointer hover:border-brand-red transition-colors"
          >
            <div className="flex flex-col items-center">
              <ImageIcon size={24} className="text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">
                Cliquez pour ajouter une image
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
        )}
      </div>
      
      {question.type === 'text' && (
        <QuestionOpenEnded 
          question={question} 
          isEditable={true} 
          onCorrectAnswerChange={handleCorrectAnswerChange}
        />
      )}
      
      {(question.type === 'multiple-choice' || question.type === 'checkbox' || question.type === 'satisfaction') && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Réponses
          </label>
          
          <div className="space-y-2">
            {question.answers.map((answer, index) => (
              <AnswerComponent
                key={answer.id}
                text={answer.text}
                isCorrect={answer.isCorrect}
                points={answer.points}
                onChange={(text, isCorrect, points) => 
                  handleAnswerChange(index, text, isCorrect, points)
                }
                onDelete={() => handleAnswerDelete(index)}
              />
            ))}
          </div>
          
          {question.type !== 'satisfaction' && (
            <button
              onClick={handleAddAnswer}
              className="mt-2 w-full border border-dashed border-gray-200 py-2 text-gray-500 rounded-lg hover:text-brand-red hover:border-brand-red transition-colors"
            >
              + Ajouter une réponse
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;
