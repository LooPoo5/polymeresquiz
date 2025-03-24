
import React from 'react';
import { Trash2, Menu } from 'lucide-react';

type QuestionHeaderProps = {
  isEditable: boolean;
  onDelete: () => void;
  questionNumber?: number;
  totalQuestions?: number;
};

const QuestionHeader: React.FC<QuestionHeaderProps> = ({ 
  isEditable, 
  onDelete, 
  questionNumber,
  totalQuestions
}) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-2">
        <Menu size={18} className={`text-gray-400 ${isEditable ? 'cursor-grab' : ''}`} />
        <span className="font-medium text-gray-700">
          {questionNumber && totalQuestions 
            ? `Question ${questionNumber}/${totalQuestions}` 
            : "Question"}
        </span>
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
  );
};

export default QuestionHeader;
