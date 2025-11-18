
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AlertCircle, Plus, Clipboard } from 'lucide-react';
import { Question as QuestionType } from '@/context/QuizContext';
import QuestionWithImage from '@/components/ui-components/QuestionWithImage';
import { getQuestionFromClipboard } from '@/components/ui-components/question/questionUtils';
import { toast } from 'sonner';

type QuestionsSectionProps = {
  questions: QuestionType[];
  onAddQuestion: () => void;
  onUpdateQuestion: (index: number, updatedQuestion: QuestionType) => void;
  onDeleteQuestion: (index: number) => void;
  setQuestions: (questions: QuestionType[]) => void;
};

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  setQuestions,
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the questions array directly instead of updating each question individually
    setQuestions(items);
  };
  
  const handlePasteQuestion = () => {
    const copiedQuestion = getQuestionFromClipboard();
    if (copiedQuestion) {
      setQuestions([...questions, copiedQuestion]);
      toast.success("Question collée avec succès");
    } else {
      toast.error("Aucune question à coller");
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <AlertCircle size={14} />
          <span>Attribuez des points à chaque réponse correcte</span>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {questions.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <QuestionWithImage
                        question={question}
                        onChange={(updatedQuestion) =>
                          onUpdateQuestion(index, updatedQuestion)
                        }
                        onDelete={() => onDeleteQuestion(index)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div className="mt-4 flex gap-2">
        <button
          onClick={onAddQuestion}
          className="flex-1 border-2 border-dashed border-gray-200 py-3 flex items-center justify-center rounded-lg text-gray-500 hover:text-brand-red hover:border-brand-red transition-colors"
        >
          <Plus size={20} className="mr-2" />
          <span>Ajouter une question</span>
        </button>
        
        <button
          onClick={handlePasteQuestion}
          className="border-2 border-dashed border-gray-200 py-3 px-4 flex items-center justify-center rounded-lg text-gray-500 hover:text-brand-red hover:border-brand-red transition-colors"
          title="Coller une question copiée"
        >
          <Clipboard size={20} className="mr-2" />
          <span>Coller une question</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionsSection;
