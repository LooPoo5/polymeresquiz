
import React, { useState } from 'react';
import { Question as QuestionType, Answer } from '@/context/QuizContext';
import { Trash2, GripVertical, Plus, CheckSquare, MessageSquare } from 'lucide-react';

interface QuestionProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onDelete: () => void;
  isEditable?: boolean;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
  showCorrectAnswers?: boolean;
}

const Question: React.FC<QuestionProps> = ({
  question,
  onChange,
  onDelete,
  isEditable = true,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange,
  showCorrectAnswers = false
}) => {
  const [isEditing, setIsEditing] = useState(isEditable);
  const [newAnswerText, setNewAnswerText] = useState('');

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...question, text: e.target.value });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value) || 0;
    onChange({ ...question, points });
  };

  const handleTypeChange = (type: 'multiple-choice' | 'open-ended') => {
    onChange({
      ...question,
      type,
      answers: type === 'open-ended' ? [] : question.answers,
    });
  };

  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return;
    
    const newAnswer: Answer = {
      id: `answer-${Date.now()}`,
      text: newAnswerText,
      isCorrect: question.answers.length === 0, // Make first answer correct by default
    };
    
    onChange({
      ...question,
      answers: [...question.answers, newAnswer],
    });
    
    setNewAnswerText('');
  };

  const handleDeleteAnswer = (answerId: string) => {
    // If deleting the only correct answer, make another one correct
    const deletedAnswer = question.answers.find(a => a.id === answerId);
    let updatedAnswers = question.answers.filter(a => a.id !== answerId);
    
    if (deletedAnswer?.isCorrect && updatedAnswers.length > 0) {
      updatedAnswers = updatedAnswers.map((a, idx) => 
        idx === 0 ? { ...a, isCorrect: true } : a
      );
    }
    
    onChange({
      ...question,
      answers: updatedAnswers,
    });
  };

  const handleToggleCorrect = (answerId: string) => {
    const updatedAnswers = question.answers.map(answer => ({
      ...answer,
      isCorrect: answer.id === answerId,
    }));
    
    onChange({
      ...question,
      answers: updatedAnswers,
    });
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...question,
      correctAnswer: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-5 animate-scale-in">
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Question header with drag handle, number, points */}
        <div className="flex items-center gap-3 flex-1">
          {isEditable && (
            <div className="cursor-move text-gray-400 hover:text-gray-600 transition-colors">
              <GripVertical size={20} />
            </div>
          )}
          
          <div className="flex-1">
            {isEditable ? (
              <input
                type="text"
                value={question.text}
                onChange={handleQuestionTextChange}
                placeholder="Entrez votre question"
                className="w-full text-lg font-medium border-b border-gray-200 focus:border-brand-red focus:outline-none py-1 px-0"
              />
            ) : (
              <h3 className="text-lg font-medium">{question.text}</h3>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {isEditable && (
            <>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Points:</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={question.points}
                  onChange={handlePointsChange}
                  className="w-12 text-center border rounded-md p-1 text-sm"
                />
              </div>
              
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-brand-red transition-colors"
                aria-label="Delete question"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Question type selection */}
      {isEditable && (
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => handleTypeChange('multiple-choice')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              question.type === 'multiple-choice'
                ? 'bg-brand-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckSquare size={16} />
            <span>Choix multiples</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTypeChange('open-ended')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              question.type === 'open-ended'
                ? 'bg-brand-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MessageSquare size={16} />
            <span>Question ouverte</span>
          </button>
        </div>
      )}
      
      {/* Multiple choice answers */}
      {question.type === 'multiple-choice' && (
        <div className="mt-4 space-y-2">
          {question.answers.map((answer) => (
            <div
              key={answer.id}
              className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                showCorrectAnswers && answer.isCorrect
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-100'
              } ${
                selectedAnswers?.includes(answer.id)
                  ? 'ring-2 ring-brand-red ring-opacity-50'
                  : ''
              }`}
            >
              {isEditable ? (
                <>
                  <button
                    onClick={() => handleToggleCorrect(answer.id)}
                    className={`w-5 h-5 rounded-full flex-shrink-0 ${
                      answer.isCorrect
                        ? 'bg-brand-red'
                        : 'border-2 border-gray-300'
                    }`}
                  >
                    {answer.isCorrect && (
                      <span className="flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </button>
                  
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => {
                      const updatedAnswers = question.answers.map((a) =>
                        a.id === answer.id ? { ...a, text: e.target.value } : a
                      );
                      onChange({ ...question, answers: updatedAnswers });
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0"
                    placeholder="Réponse"
                  />
                  
                  <button
                    onClick={() => handleDeleteAnswer(answer.id)}
                    className="text-gray-400 hover:text-brand-red transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    id={answer.id}
                    checked={selectedAnswers?.includes(answer.id)}
                    onChange={(e) => onAnswerSelect && onAnswerSelect(answer.id, e.target.checked)}
                    className="w-5 h-5 rounded-full border-2 border-gray-300 text-brand-red focus:ring-brand-red"
                    disabled={showCorrectAnswers}
                  />
                  
                  <label
                    htmlFor={answer.id}
                    className={`flex-1 ${showCorrectAnswers && answer.isCorrect ? 'font-medium' : ''}`}
                  >
                    {answer.text}
                  </label>
                  
                  {showCorrectAnswers && answer.isCorrect && (
                    <span className="text-green-500 text-sm font-medium">Correct</span>
                  )}
                </>
              )}
            </div>
          ))}
          
          {isEditable && (
            <div className="flex mt-2">
              <input
                type="text"
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="Ajouter une réponse"
                className="flex-1 border border-gray-200 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-red"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddAnswer();
                  }
                }}
              />
              
              <button
                onClick={handleAddAnswer}
                className="bg-brand-red text-white px-3 py-2 rounded-r-md hover:bg-opacity-90 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Open-ended question */}
      {question.type === 'open-ended' && (
        <div className="mt-4">
          {isEditable ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Réponse correcte (pour référence)
              </label>
              <textarea
                value={question.correctAnswer || ''}
                onChange={handleCorrectAnswerChange}
                className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-brand-red"
                rows={3}
                placeholder="Entrez la réponse de référence (ne sera pas montrée aux participants)"
              />
            </div>
          ) : (
            <div>
              <textarea
                value={openEndedAnswer}
                onChange={(e) => onOpenEndedAnswerChange && onOpenEndedAnswerChange(e.target.value)}
                className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-brand-red"
                rows={3}
                placeholder="Entrez votre réponse ici"
                disabled={showCorrectAnswers}
              />
              
              {showCorrectAnswers && question.correctAnswer && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="text-sm font-medium text-green-800 mb-1">Réponse de référence:</div>
                  <p className="text-green-700">{question.correctAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {showCorrectAnswers && (
        <div className="mt-3 text-right">
          <span className="text-sm font-medium">{question.points} points</span>
        </div>
      )}
    </div>
  );
};

export default Question;
