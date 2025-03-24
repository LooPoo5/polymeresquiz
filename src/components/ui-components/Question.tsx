import React, { useState, useRef, useEffect } from 'react';
import { Trash2, GripVertical, Check, X, Image as ImageIcon } from 'lucide-react';
import { Question as QuestionType } from '@/context/QuizContext';

interface AnswerProps {
  text: string;
  isCorrect: boolean;
  points: number;
  onChange: (text: string, isCorrect: boolean, points: number) => void;
  onDelete: () => void;
}

const Answer: React.FC<AnswerProps> = ({ text, isCorrect, points, onChange, onDelete }) => {
  const [answerText, setAnswerText] = useState(text);
  const [answerIsCorrect, setAnswerIsCorrect] = useState(isCorrect);
  const [answerPoints, setAnswerPoints] = useState(points);
  
  useEffect(() => {
    setAnswerText(text);
    setAnswerIsCorrect(isCorrect);
    setAnswerPoints(points);
  }, [text, isCorrect, points]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerText(e.target.value);
    onChange(e.target.value, answerIsCorrect, answerPoints);
  };
  
  const handleIsCorrectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerIsCorrect(e.target.checked);
    onChange(answerText, e.target.checked, answerPoints);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value);
    setAnswerPoints(isNaN(points) ? 0 : points);
    onChange(answerText, answerIsCorrect, isNaN(points) ? 0 : points);
  };
  
  return (
    <div className="flex items-center gap-2 py-1">
      <input
        type="text"
        value={answerText}
        onChange={handleTextChange}
        placeholder="Réponse"
        className="flex-grow border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
      />
      
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={answerIsCorrect}
          onChange={handleIsCorrectChange}
          id={`isCorrect-${text}`}
          className="h-4 w-4 text-brand-red focus:ring-brand-red rounded border-gray-300"
        />
        <label htmlFor={`isCorrect-${text}`} className="text-sm text-gray-700">Correcte</label>
      </div>

      <input
        type="number"
        value={answerPoints}
        onChange={handlePointsChange}
        placeholder="Points"
        className="w-20 border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
      />
      
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
        aria-label="Supprimer la réponse"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

interface QuestionProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onDelete: () => void;
  isEditable?: boolean;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ 
  question, 
  onChange, 
  onDelete,
  isEditable = true,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (question.text === '' && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [question]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType['type'];
    
    let updatedAnswers = [...question.answers];
    if (newType === 'satisfaction') {
      updatedAnswers = [
        { id: `answer-${Date.now()}-1`, text: 'Très insatisfait', isCorrect: false, points: 1 },
        { id: `answer-${Date.now()}-2`, text: 'Insatisfait', isCorrect: false, points: 2 },
        { id: `answer-${Date.now()}-3`, text: 'Neutre', isCorrect: false, points: 3 },
        { id: `answer-${Date.now()}-4`, text: 'Satisfait', isCorrect: false, points: 4 },
        { id: `answer-${Date.now()}-5`, text: 'Très satisfait', isCorrect: true, points: 5 }
      ];
    } else if (newType !== 'satisfaction' && question.type === 'satisfaction') {
      updatedAnswers = [];
    }
    
    onChange({
      ...question,
      type: newType,
      answers: updatedAnswers
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value);
    onChange({
      ...question,
      points: isNaN(points) ? 1 : points
    });
  };

  const handleAddAnswer = () => {
    const newAnswer = {
      id: `answer-${Date.now()}`,
      text: '',
      isCorrect: false,
      points: 0
    };
    
    onChange({
      ...question,
      answers: [...question.answers, newAnswer]
    });
  };

  const handleAnswerChange = (index: number, text: string, isCorrect: boolean, points: number) => {
    const updatedAnswers = [...question.answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      text,
      isCorrect,
      points
    };
    
    onChange({
      ...question,
      answers: updatedAnswers
    });
  };

  const handleAnswerDelete = (index: number) => {
    const updatedAnswers = [...question.answers];
    updatedAnswers.splice(index, 1);
    
    onChange({
      ...question,
      answers: updatedAnswers
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
  
  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...question,
      correctAnswer: e.target.value
    });
  };
  
  const handleOpenEndedAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onOpenEndedAnswerChange) {
      onOpenEndedAnswerChange(e.target.value);
    }
  };
  
  const handleMultipleChoiceSelect = (answerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAnswerSelect) {
      onAnswerSelect(answerId, e.target.checked);
    }
  };

  if (!isEditable) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="p-4">
          <div className="font-medium text-lg mb-2">{question.text}</div>
          
          {question.imageUrl && (
            <div className="mb-4 flex justify-center">
              <img 
                src={question.imageUrl} 
                alt="Question" 
                className="max-h-60 object-contain rounded-lg"
              />
            </div>
          )}
          
          {(question.type === 'multiple-choice' || question.type === 'satisfaction') && (
            <div className="space-y-2 mt-4">
              {question.answers.map(answer => (
                <div key={answer.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`answer-${answer.id}`}
                    name={`question-${question.id}`}
                    checked={selectedAnswers.includes(answer.id)}
                    onChange={(e) => handleMultipleChoiceSelect(answer.id, e)}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                  />
                  <label htmlFor={`answer-${answer.id}`} className="ml-2 block text-sm">
                    {answer.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'checkbox' && (
            <div className="space-y-2 mt-4">
              {question.answers.map(answer => (
                <div key={answer.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`answer-${answer.id}`}
                    checked={selectedAnswers.includes(answer.id)}
                    onChange={(e) => handleMultipleChoiceSelect(answer.id, e)}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red rounded border-gray-300"
                  />
                  <label htmlFor={`answer-${answer.id}`} className="ml-2 block text-sm">
                    {answer.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'text' && (
            <div className="mt-4">
              <textarea
                value={openEndedAnswer}
                onChange={handleOpenEndedAnswerChange}
                placeholder="Votre réponse..."
                className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                rows={4}
              />
            </div>
          )}
          
          {question.type === 'satisfaction' && (
            <div className="space-y-2 mt-4">
              {question.answers.map(answer => (
                <div key={answer.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`answer-${answer.id}`}
                    name={`question-${question.id}`}
                    checked={selectedAnswers.includes(answer.id)}
                    onChange={(e) => handleMultipleChoiceSelect(answer.id, e)}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                  />
                  <label htmlFor={`answer-${answer.id}`} className="ml-2 block text-sm">
                    {answer.text}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="flex items-center bg-gray-50 p-3 border-b border-gray-200">
        <div className="text-gray-400 cursor-move mr-2">
          <GripVertical size={20} />
        </div>
        <input
          type="text"
          placeholder="Titre de la question"
          value={question.text}
          onChange={(e) => onChange({ ...question, text: e.target.value })}
          className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 font-medium"
          ref={titleInputRef}
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 text-gray-500 p-1 hover:bg-gray-100 rounded"
        >
          {isExpanded ? <X size={18} /> : <Check size={18} />}
        </button>
        <button
          onClick={onDelete}
          className="ml-2 text-red-500 p-1 hover:bg-red-50 rounded"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de question
              </label>
              <select
                value={question.type}
                onChange={handleTypeChange}
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
              <input
                type="number"
                min="1"
                value={question.points}
                onChange={handlePointsChange}
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réponse correcte (référence pour la correction)
              </label>
              <textarea
                value={question.correctAnswer || ''}
                onChange={handleCorrectAnswerChange}
                placeholder="Réponse correcte attendue"
                className="w-full border border-gray-200 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                rows={3}
              />
            </div>
          )}
          
          {(question.type === 'multiple-choice' || question.type === 'checkbox' || question.type === 'satisfaction') && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réponses
              </label>
              
              <div className="space-y-2">
                {question.answers.map((answer, index) => (
                  <Answer
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
      )}
    </div>
  );
};

export default Question;
