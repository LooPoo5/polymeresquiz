
import React, { useState, useEffect, useRef } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import { Trash2, Menu } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type QuestionProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onDelete: () => void;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
};

const Question: React.FC<QuestionProps> = ({ 
  question, 
  onChange, 
  onDelete, 
  selectedAnswers = [], 
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isEditable, setIsEditable] = useState(true);

  // Determine if the component is in edit mode or view/answer mode
  useEffect(() => {
    setIsEditable(onAnswerSelect === undefined);
  }, [onAnswerSelect]);

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

  const handleAnswerPointsChange = (index: number, value: number) => {
    const newAnswers = [...(question.answers || [])];
    newAnswers[index] = {
      ...newAnswers[index],
      points: value,
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
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {isEditable && (
        <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Menu size={18} className="text-gray-400 cursor-grab" />
            <span className="font-medium text-gray-700">Question</span>
          </div>
          <button
            onClick={onDelete}
            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete question"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
      
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor={`question-${question.id}-text`} className="block text-sm font-medium text-gray-700 mb-1">
            {isEditable ? "Titre de la question *" : question.text}
          </label>
          {isEditable ? (
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
            />
          ) : null}
        </div>
        
        {isEditable && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`question-${question.id}-type`} className="block text-sm font-medium text-gray-700 mb-1">
                Type de question
              </label>
              <Tabs defaultValue={question.type} onValueChange={(val) => onChange({...question, type: val as any})}>
                <TabsList className="w-full">
                  <TabsTrigger value="multiple-choice" className="flex-1">Choix unique</TabsTrigger>
                  <TabsTrigger value="checkbox" className="flex-1">Cases à cocher</TabsTrigger>
                  <TabsTrigger value="open-ended" className="flex-1">Texte</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <label htmlFor={`question-${question.id}-points`} className="block text-sm font-medium text-gray-700 mb-1">
                Points (par défaut)
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
        
        {/* Display for multiple-choice and checkbox questions */}
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
              <div key={answer.id} className="flex items-start space-x-3">
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
                            isCorrect: i === index
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
                    <span className="text-gray-700">{answer.text}</span>
                  )}
                </div>
                
                {isEditable && (
                  <>
                    <div className="pt-1 min-w-20">
                      <label className="text-xs text-gray-500 mb-1 block">Points</label>
                      <input
                        type="number"
                        min="0"
                        value={answer.points || 0}
                        onChange={(e) => handleAnswerPointsChange(index, parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      />
                    </div>
                    <div className="pt-1">
                      <button
                        onClick={() => handleDeleteAnswer(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete answer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
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
        
        {/* Display for open-ended questions */}
        {question.type === 'open-ended' && !isEditable && (
          <div className="mt-2">
            <textarea
              placeholder="Votre réponse..."
              value={openEndedAnswer}
              onChange={(e) => onOpenEndedAnswerChange && onOpenEndedAnswerChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
