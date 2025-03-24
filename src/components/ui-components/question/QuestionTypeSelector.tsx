
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Question as QuestionType } from '@/context/QuizContext';
import { handleQuestionTypeChange } from './questionUtils';

type QuestionTypeSelectorProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
};

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ 
  question, 
  onChange 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Type de question
      </label>
      <ToggleGroup 
        type="single" 
        value={question.type} 
        onValueChange={(value) => {
          if (value) handleQuestionTypeChange(question, value, onChange);
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
  );
};

export default QuestionTypeSelector;
