
import { Question as QuestionType } from '@/context/QuizContext';

// Handles the change of question properties
export const handleQuestionChange = (
  question: QuestionType, 
  name: string, 
  value: any, 
  onChange: (updatedQuestion: QuestionType) => void
) => {
  onChange({
    ...question,
    [name]: value,
  });
};

// Handles change of question type
export const handleQuestionTypeChange = (
  question: QuestionType,
  value: string,
  onChange: (updatedQuestion: QuestionType) => void
) => {
  onChange({
    ...question,
    type: value as "multiple-choice" | "checkbox" | "open-ended",
  });
};

// Handles change of points value
export const handlePointsChange = (
  question: QuestionType,
  value: number,
  onChange: (updatedQuestion: QuestionType) => void
) => {
  onChange({
    ...question,
    points: value,
  });
};

// Handles change of an answer
export const handleAnswerChange = (
  question: QuestionType,
  index: number, 
  field: string, 
  value: any,
  onChange: (updatedQuestion: QuestionType) => void
) => {
  const newAnswers = [...(question.answers || [])];
  newAnswers[index] = {
    ...newAnswers[index],
    [field]: value,
  };
  
  onChange({
    ...question,
    answers: newAnswers,
  });
};

// Handles adding a new answer
export const handleAddAnswer = (
  question: QuestionType,
  onChange: (updatedQuestion: QuestionType) => void,
  focusNew: boolean = false
) => {
  const newAnswers = [...(question.answers || [])];
  newAnswers.push({
    id: `answer-${Date.now()}`,
    text: '',
    isCorrect: false,
    points: 0,
  });
  
  onChange({
    ...question,
    answers: newAnswers,
  });

  if (focusNew) {
    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      const newIndex = newAnswers.length - 1;
      const inputs = document.querySelectorAll(`input[data-answer-index="${newIndex}"]`);
      if (inputs.length > 0) {
        (inputs[0] as HTMLInputElement).focus();
      }
    }, 0);
  }
};

// Handles deleting an answer
export const handleDeleteAnswer = (
  question: QuestionType,
  index: number,
  onChange: (updatedQuestion: QuestionType) => void
) => {
  const newAnswers = [...(question.answers || [])];
  newAnswers.splice(index, 1);
  
  onChange({
    ...question,
    answers: newAnswers,
  });
};

// Handles toggling the correct status of an answer
export const handleAnswerCorrectToggle = (
  question: QuestionType,
  index: number,
  isChecked: boolean,
  onChange: (updatedQuestion: QuestionType) => void
) => {
  if (question.type === 'multiple-choice') {
    // For radio buttons, uncheck all other answers
    const newAnswers = (question.answers || []).map((a, i) => ({
      ...a,
      isCorrect: i === index,
      points: i === index ? (question.points || 1) : 0
    }));
    
    onChange({
      ...question,
      answers: newAnswers,
    });
  } else {
    // For checkboxes, toggle the current answer
    handleAnswerChange(question, index, 'isCorrect', isChecked, onChange);
  }
};
