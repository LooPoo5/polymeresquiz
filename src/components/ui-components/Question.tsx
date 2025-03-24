
import React, { useState, useRef, useEffect } from 'react';
import { Question as QuestionType } from '@/types/quiz';
import QuestionHeader from './QuestionHeader';
import QuestionEditor from './QuestionEditor';
import QuestionDisplay from './QuestionDisplay';

interface QuestionProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onDelete: () => void;
  isEditable?: boolean;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ 
  question, 
  onChange, 
  onDelete,
  isEditable = true,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (question.text === '' && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [question]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType['type'];
    
    let updatedAnswers = [...question.answers];
    if (newType === 'satisfaction') {
      updatedAnswers = [
        { id: `answer-${Date.now()}-1`, text: 'Très insatisfait', isCorrect: false, points: 1 },
        { id: `answer-${Date.now()}-2`, text: 'Insatisfait', isCorrect: false, points: 2 },
        { id: `answer-${Date.now()}-3`, text: 'Neutre', isCorrect: false, points: 3 },
        { id: `answer-${Date.now()}-4`, text: 'Satisfait', isCorrect: false, points: 4 },
        { id: `answer-${Date.now()}-5`, text: 'Très satisfait', isCorrect: true, points: 5 }
      ];
    } else if (question.type === 'satisfaction' && newType !== 'satisfaction') {
      updatedAnswers = [];
    }
    
    onChange({
      ...question,
      type: newType,
      answers: updatedAnswers
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value);
    onChange({
      ...question,
      points: isNaN(points) ? 1 : points
    });
  };

  const handleAddAnswer = () => {
    const newAnswer = {
      id: `answer-${Date.now()}`,
      text: '',
      isCorrect: false,
      points: 0
    };
    
    onChange({
      ...question,
      answers: [...question.answers, newAnswer]
    });
  };

  const handleAnswerChange = (index: number, text: string, isCorrect: boolean, points: number) => {
    const updatedAnswers = [...question.answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      text,
      isCorrect,
      points
    };
    
    onChange({
      ...question,
      answers: updatedAnswers
    });
  };

  const handleAnswerDelete = (index: number) => {
    const updatedAnswers = [...question.answers];
    updatedAnswers.splice(index, 1);
    
    onChange({
      ...question,
      answers: updatedAnswers
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange({
          ...question,
          imageUrl: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange({
      ...question,
      imageUrl: undefined
    });
  };
  
  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...question,
      correctAnswer: e.target.value
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...question, text: e.target.value });
  };

  if (!isEditable) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <QuestionDisplay
          question={question}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={onAnswerSelect}
          openEndedAnswer={openEndedAnswer}
          onOpenEndedAnswerChange={onOpenEndedAnswerChange}
        />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <QuestionHeader
        text={question.text}
        isExpanded={isExpanded}
        onTextChange={handleTextChange}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onDelete={onDelete}
        titleInputRef={titleInputRef}
      />
      
      {isExpanded && (
        <QuestionEditor
          question={question}
          onChange={onChange}
          onTypeChange={handleTypeChange}
          onPointsChange={handlePointsChange}
          handleAddAnswer={handleAddAnswer}
          handleAnswerChange={handleAnswerChange}
          handleAnswerDelete={handleAnswerDelete}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
        />
      )}
    </div>
  );
};

export default Question;
