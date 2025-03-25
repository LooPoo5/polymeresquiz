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
  return <div className="flex items-center p-4 border-b border-gray-200 bg-red-600">
      <div className="flex items-center space-x-2">
        <Menu size={18} className={`text-gray-400 ${isEditable ? 'cursor-grab' : ''}`} />
        <span className="font-medium text-slate-50">
          {questionNumber && totalQuestions ? `Question ${questionNumber}/${totalQuestions}` : "Question"}
        </span>
      </div>
      {isEditable && <button onClick={onDelete} aria-label="Delete question" className="ml-auto transition-colors text-slate-50">
          <Trash2 size={18} />
        </button>}
    </div>;
};
export default QuestionHeader;