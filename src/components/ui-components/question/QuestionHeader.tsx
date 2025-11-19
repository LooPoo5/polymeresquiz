
import React from 'react';
import { Trash2, GripVertical, Copy } from 'lucide-react';
import { Question as QuestionType } from '@/context/QuizContext';
import { copyQuestionToClipboard } from './questionUtils';
import { toast } from 'sonner';

type QuestionHeaderProps = {
  isEditable: boolean;
  onDelete: () => void;
  questionNumber?: number;
  totalQuestions?: number;
  question?: QuestionType;
};

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  isEditable,
  onDelete,
  questionNumber,
  totalQuestions,
  question
}) => {
  const handleCopyQuestion = () => {
    if (!question) return;
    const success = copyQuestionToClipboard(question);
    if (success) {
      toast.success("Question copiée");
    } else {
      toast.error("Erreur lors de la copie de la question");
    }
  };

  return (
    <div className={`flex justify-between items-center p-4 border-b border-question-border ${isEditable ? 'bg-question-bg-edit' : 'bg-question-bg-view'}`}>
      {isEditable ? (
        <>
          <div className="flex items-center gap-2">
            <GripVertical className="text-question-text-muted" size={20} />
            <span className="text-sm font-medium text-question-number-text">
              {questionNumber ? `Question ${questionNumber}` : 'Question'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {question && (
              <button 
                onClick={handleCopyQuestion} 
                className="p-1.5 text-gray-500 hover:text-brand-red transition-colors rounded-md hover:bg-red-50" 
                title="Copier la question"
              >
                <Copy size={18} className="bg-inherit" />
              </button>
            )}
            <button 
              onClick={onDelete} 
              className="p-1.5 text-gray-500 hover:text-red-500 transition-colors rounded-md hover:bg-red-50" 
              title="Supprimer la question"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </>
      ) : (
        <>
          {questionNumber && totalQuestions && (
            <div className="flex items-center w-full justify-between">
              <span className="text-sm font-medium text-gray-500">
                Question {questionNumber} sur {totalQuestions}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionHeader;
