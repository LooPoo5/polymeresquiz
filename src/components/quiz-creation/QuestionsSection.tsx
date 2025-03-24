
import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Question as QuestionType } from '@/types/quiz';
import QuestionComponent from '@/components/ui-components/Question';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface QuestionsSectionProps {
  questions: QuestionType[];
  handleAddQuestion: () => void;
  handleUpdateQuestion: (index: number, updatedQuestion: QuestionType) => void;
  handleDeleteQuestion: (index: number) => void;
  handleDragEnd: (result: any) => void;
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  questions,
  handleAddQuestion,
  handleUpdateQuestion,
  handleDeleteQuestion,
  handleDragEnd
}) => {
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
                      <QuestionComponent
                        question={question}
                        onChange={(updatedQuestion) =>
                          handleUpdateQuestion(index, updatedQuestion)
                        }
                        onDelete={() => handleDeleteQuestion(index)}
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
      
      <button
        onClick={handleAddQuestion}
        className="mt-4 w-full border-2 border-dashed border-gray-200 py-3 flex items-center justify-center rounded-lg text-gray-500 hover:text-brand-red hover:border-brand-red transition-colors"
      >
        <Plus size={20} className="mr-2" />
        <span>Ajouter une question</span>
      </button>
    </div>
  );
};

export default QuestionsSection;
