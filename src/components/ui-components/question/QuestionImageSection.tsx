
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import ImageUploader from './ImageUploader';

type QuestionImageSectionProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  isEditable: boolean;
};

const QuestionImageSection: React.FC<QuestionImageSectionProps> = ({
  question,
  onChange,
  isEditable
}) => {
  return (
    <ImageUploader 
      question={question} 
      onChange={onChange} 
      isEditable={isEditable} 
    />
  );
};

export default QuestionImageSection;
