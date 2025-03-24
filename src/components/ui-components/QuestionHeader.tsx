
import React from 'react';
import { Trash2, GripVertical, Check, X } from 'lucide-react';

interface QuestionHeaderProps {
  text: string;
  isExpanded: boolean;
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleExpand: () => void;
  onDelete: () => void;
  titleInputRef: React.RefObject<HTMLInputElement>;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  text,
  isExpanded,
  onTextChange,
  onToggleExpand,
  onDelete,
  titleInputRef
}) => {
  return (
    <div className="flex items-center bg-gray-50 p-3 border-b border-gray-200">
      <div className="text-gray-400 cursor-move mr-2">
        <GripVertical size={20} />
      </div>
      <input
        type="text"
        placeholder="Titre de la question"
        value={text}
        onChange={onTextChange}
        className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 font-medium"
        ref={titleInputRef}
      />
      <button
        onClick={onToggleExpand}
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
  );
};

export default QuestionHeader;
