
import React, { useEffect, useRef } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import { Trash2, Menu, Upload } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type QuestionProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onDelete: () => void;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
  isEditable?: boolean;
};

const QuestionWithImage: React.FC<QuestionProps> = ({ 
  question, 
  onChange, 
  onDelete,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange,
  isEditable = true
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus on title input when a new question is created (empty text)
  useEffect(() => {
    if (!question.text && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [question.text]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...question,
      [name]: value,
    });
  };
  
  const handleTypeChange = (value: string) => {
    onChange({
      ...question,
      type: value as "multiple-choice" | "checkbox" | "open-ended",
    });
  };
  
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    onChange({
      ...question,
      points: value,
    });
  };
  
  const handleAnswerChange = (index: number, field: string, value: any) => {
    const newAnswers = [...(question.answers || [])];
    newAnswers[index] = {
      ...newAnswers[index],
      [field]: value,
    };
    
    onChange({
      ...question,
      answers: newAnswers,
    });
  };
  
  const handleAddAnswer = () => {
    const newAnswers = [...(question.answers || [])];
    newAnswers.push({
      id: `answer-${Date.now()}`,
      text: '',
      isCorrect: false,
      points: 0,
    });
    
    onChange({
      ...question,
      answers: newAnswers,
    });
  };
  
  const handleDeleteAnswer = (index: number) => {
    const newAnswers = [...(question.answers || [])];
    newAnswers.splice(index, 1);
    
    onChange({
      ...question,
      answers: newAnswers,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange({
          ...question,
          imageUrl: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange({
      ...question,
      imageUrl: undefined
    });
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Menu size={18} className={`text-gray-400 ${isEditable ? 'cursor-grab' : ''}`} />
          <span className="font-medium text-gray-700">Question</span>
        </div>
        {isEditable && (
          <button
            onClick={onDelete}
            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete question"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor={`question-${question.id}-text`} className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la question *
          </label>
          <input
            id={`question-${question.id}-text`}
            name="text"
            type="text"
            value={question.text}
            onChange={handleChange}
            ref={titleInputRef}
            placeholder="Entrez le texte de la question"
            className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            required
            readOnly={!isEditable}
          />
        </div>
        
        {isEditable && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (optionnelle)
            </label>
            
            {question.imageUrl ? (
              <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
                <img
                  src={question.imageUrl}
                  alt="Question illustration"
                  className="w-full h-40 object-contain"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white/90 text-brand-red p-1.5 rounded-full shadow-sm hover:bg-brand-red hover:text-white transition-colors"
                  aria-label="Remove image"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center mb-3">
                <label
                  htmlFor={`question-${question.id}-image`}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-gray-500 text-sm">
                    Cliquez pour ajouter une image
                  </span>
                  <input
                    id={`question-${question.id}-image`}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        )}
        
        {question.imageUrl && !isEditable && (
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
            <img
              src={question.imageUrl}
              alt="Question illustration"
              className="w-full h-40 object-contain"
            />
          </div>
        )}
        
        {isEditable && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de question
              </label>
              <ToggleGroup 
                type="single" 
                value={question.type} 
                onValueChange={(value) => {
                  if (value) handleTypeChange(value);
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="multiple-choice" className="flex gap-2">
                  <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                  <span>Choix unique</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="checkbox" className="flex gap-2">
                  <div className="w-4 h-4 border border-primary rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Cases à cocher</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="open-ended" className="flex gap-2">
                  <span className="text-xs border border-primary px-1">Aa</span>
                  <span>Réponse texte</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div>
              <label htmlFor={`question-${question.id}-points`} className="block text-sm font-medium text-gray-700 mb-1">
                Points (valeur par défaut)
              </label>
              <input
                id={`question-${question.id}-points`}
                name="points"
                type="number"
                min="1"
                value={question.points || 1}
                onChange={handlePointsChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
          </div>
        )}
        
        {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
          <div className="space-y-3">
            {isEditable && (
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Réponses
                </label>
                <span className="text-xs text-gray-500">
                  {question.type === 'multiple-choice' ? 'Sélectionnez une réponse correcte' : 'Sélectionnez une ou plusieurs réponses correctes'}
                </span>
              </div>
            )}
            
            {(question.answers || []).map((answer, index) => (
              <div key={answer.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <div className="pt-2">
                    <input
                      type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                      name={`question-${question.id}-answer-correct`}
                      checked={isEditable ? answer.isCorrect : selectedAnswers.includes(answer.id)}
                      onChange={(e) => {
                        if (isEditable) {
                          if (question.type === 'multiple-choice') {
                            // For radio buttons, uncheck all other answers
                            const newAnswers = (question.answers || []).map((a, i) => ({
                              ...a,
                              isCorrect: i === index,
                              points: i === index ? (question.points || 1) : 0
                            }));
                            
                            onChange({
                              ...question,
                              answers: newAnswers,
                            });
                          } else {
                            // For checkboxes, toggle the current answer
                            handleAnswerChange(index, 'isCorrect', e.target.checked);
                          }
                        } else if (onAnswerSelect) {
                          onAnswerSelect(answer.id, e.target.checked);
                        }
                      }}
                      className="h-4 w-4 accent-brand-red"
                      disabled={!isEditable && !onAnswerSelect}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    {isEditable ? (
                      <input
                        type="text"
                        placeholder={`Réponse ${index + 1}`}
                        value={answer.text}
                        onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      />
                    ) : (
                      <div className="py-2">{answer.text}</div>
                    )}
                  </div>
                  
                  {isEditable && (
                    <div className="pt-1">
                      <button
                        onClick={() => handleDeleteAnswer(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete answer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditable && answer.isCorrect && (
                  <div className="flex items-center pl-7 space-x-2">
                    <label className="text-sm text-gray-600">Points:</label>
                    <input
                      type="number"
                      min="1"
                      value={answer.points || 1}
                      onChange={(e) => handleAnswerChange(index, 'points', parseInt(e.target.value) || 1)}
                      className="w-16 border border-gray-200 rounded p-1 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            ))}
            
            {isEditable && (
              <button
                onClick={handleAddAnswer}
                className="text-sm text-brand-red hover:underline focus:outline-none flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Ajouter une réponse</span>
              </button>
            )}
          </div>
        )}
        
        {question.type === 'open-ended' && !isEditable && onOpenEndedAnswerChange && (
          <div>
            <label htmlFor={`question-${question.id}-answer`} className="block text-sm font-medium text-gray-700 mb-1">
              Votre réponse
            </label>
            <textarea
              id={`question-${question.id}-answer`}
              value={openEndedAnswer}
              onChange={(e) => onOpenEndedAnswerChange(e.target.value)}
              className="w-full h-24 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
              placeholder="Saisir votre réponse..."
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionWithImage;
