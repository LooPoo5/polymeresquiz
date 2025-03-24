import React, { useState } from 'react';
import { Question as QuestionType } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, Check } from 'lucide-react';

interface QuestionProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onDelete: () => void;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
}

const Question = ({
  question,
  onChange,
  onDelete,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange
}: QuestionProps) => {
  const { updateQuiz } = useQuiz();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...question, text: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'multiple-choice' | 'open-ended' | 'checkbox';
    const updatedQuestion: QuestionType = {
      ...question,
      type: newType,
      answers: newType === 'open-ended' ? [] : question.answers,
      correctAnswer: newType === 'open-ended' ? question.correctAnswer : undefined,
    };
    onChange(updatedQuestion);
  };

  const handleAddAnswer = () => {
    const newAnswer = {
      id: `answer-${Date.now()}`,
      text: '',
      isCorrect: false,
      points: 0,
    };
    onChange({ ...question, answers: [...question.answers, newAnswer] });
  };

  const handleUpdateAnswer = (index: number, updatedAnswer: any) => {
    const newAnswers = [...question.answers];
    newAnswers[index] = updatedAnswer;
    onChange({ ...question, answers: newAnswers });
  };

  const handleDeleteAnswer = (index: number) => {
    const newAnswers = [...question.answers];
    newAnswers.splice(index, 1);
    onChange({ ...question, answers: newAnswers });
  };

  const handleCorrectAnswerChange = (index: number, isCorrect: boolean) => {
    const newAnswers = [...question.answers];
    
    if (question.type === 'multiple-choice') {
      // For multiple-choice, only one answer can be correct
      newAnswers.forEach((answer, i) => {
        answer.isCorrect = i === index;
        answer.points = i === index ? question.points : 0;
      });
    } else if (question.type === 'checkbox') {
      // For checkbox, multiple answers can be correct
      newAnswers[index] = { ...newAnswers[index], isCorrect: isCorrect, points: isCorrect ? question.points : 0 };
    }
  
    onChange({ ...question, answers: newAnswers });
  };

  const handleOpenEndedAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...question, correctAnswer: e.target.value });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value);
    onChange({ ...question, points: points });
  };

  const handleAnswerTextChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...question.answers];
    newAnswers[index] = { ...newAnswers[index], text: e.target.value };
    onChange({ ...question, answers: newAnswers });
  };

  const handleAnswerPointsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...question.answers];
    const points = parseInt(e.target.value);
    newAnswers[index] = { ...newAnswers[index], points: points };
    onChange({ ...question, answers: newAnswers });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Question</h3>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <label htmlFor="question-text" className="block text-sm font-medium text-gray-700">
          Texte de la question
        </label>
        <input
          type="text"
          id="question-text"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          value={question.text}
          onChange={handleTextChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="question-type" className="block text-sm font-medium text-gray-700">
          Type de question
        </label>
        <select
          id="question-type"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          value={question.type}
          onChange={handleTypeChange}
        >
          <option value="multiple-choice">Choix multiple</option>
          <option value="open-ended">Question ouverte</option>
          <option value="checkbox">Cases à cocher</option>
        </select>
      </div>

      {question.type !== 'open-ended' ? (
        <div>
          <div className="mb-4">
            <label htmlFor="question-points" className="block text-sm font-medium text-gray-700">
              Points par question
            </label>
            <input
              type="number"
              id="question-points"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={question.points}
              onChange={handlePointsChange}
            />
          </div>
          <h4 className="text-md font-semibold mb-2">Réponses</h4>
          {question.answers.map((answer, index) => (
            <div key={answer.id} className="mb-2 flex items-center">
              <input
                type="text"
                className="p-2 w-full border border-gray-300 rounded-md mr-2"
                value={answer.text}
                onChange={(e) => handleAnswerTextChange(index, e)}
              />
              {question.type === 'checkbox' && (
                <input
                  type="number"
                  className="p-2 w-20 border border-gray-300 rounded-md mr-2"
                  value={answer.points || 0}
                  onChange={(e) => handleAnswerPointsChange(index, e)}
                />
              )}
              <input
                type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                name={`correct-answer-${question.id}`}
                id={`correct-answer-${answer.id}`}
                checked={answer.isCorrect}
                onChange={(e) => handleCorrectAnswerChange(index, e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`correct-answer-${answer.id}`} className="text-sm font-medium text-gray-700">
                Correct
              </label>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteAnswer(index)}>
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddAnswer} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une réponse
          </Button>
        </div>
      ) : (
        <div className="mb-4">
          <label htmlFor="correct-answer" className="block text-sm font-medium text-gray-700">
            Réponse Correcte
          </label>
          <textarea
            id="correct-answer"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={question.correctAnswer || ''}
            onChange={handleOpenEndedAnswerChange}
          />
        </div>
      )}
    </div>
  );
};

export default Question;
