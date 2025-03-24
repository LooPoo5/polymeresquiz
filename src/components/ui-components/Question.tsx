
import React, { useState, useEffect, useRef } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import { Trash2, Menu } from 'lucide-react';
import { handleQuestionChange } from './question/questionUtils';
import QuestionTypeSelector from './question/QuestionTypeSelector';
import AnswersSection from './question/AnswersSection';
import OpenEndedAnswer from './question/OpenEndedAnswer';

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

const Question: React.FC<QuestionProps> = ({ 
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
            onChange={(e) => handleQuestionChange(question, e.target.name, e.target.value, onChange)}
            ref={titleInputRef}
            placeholder="Entrez le texte de la question"
            className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            required
            readOnly={!isEditable}
          />
        </div>
        
        {/* Type selector for editable questions */}
        {isEditable && (
          <QuestionTypeSelector 
            question={question} 
            onChange={onChange} 
          />
        )}
        
        {/* Multiple choice or checkbox questions */}
        {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
          <AnswersSection
            question={question}
            onChange={onChange}
            isEditable={isEditable}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={onAnswerSelect}
          />
        )}
        
        {/* Open ended answer for non-editable questions */}
        {question.type === 'open-ended' && !isEditable && onOpenEndedAnswerChange && (
          <OpenEndedAnswer
            question={question}
            openEndedAnswer={openEndedAnswer}
            onOpenEndedAnswerChange={onOpenEndedAnswerChange}
          />
        )}
      </div>
    </div>
  );
};

export default Question;
