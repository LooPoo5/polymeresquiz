
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AnswerProps {
  text: string;
  isCorrect: boolean;
  points: number;
  onChange: (text: string, isCorrect: boolean, points: number) => void;
  onDelete: () => void;
}

const AnswerComponent: React.FC<AnswerProps> = ({ text, isCorrect, points, onChange, onDelete }) => {
  const [answerText, setAnswerText] = useState(text);
  const [answerIsCorrect, setAnswerIsCorrect] = useState(isCorrect);
  const [answerPoints, setAnswerPoints] = useState(points);
  
  useEffect(() => {
    setAnswerText(text);
    setAnswerIsCorrect(isCorrect);
    setAnswerPoints(points);
  }, [text, isCorrect, points]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerText(e.target.value);
    onChange(e.target.value, answerIsCorrect, answerPoints);
  };
  
  const handleIsCorrectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerIsCorrect(e.target.checked);
    onChange(answerText, e.target.checked, answerPoints);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pts = parseInt(e.target.value);
    setAnswerPoints(isNaN(pts) ? 0 : pts);
    onChange(answerText, answerIsCorrect, isNaN(pts) ? 0 : pts);
  };
  
  return (
    <div className="flex items-center gap-2 py-1">
      <Input
        type="text"
        value={answerText}
        onChange={handleTextChange}
        placeholder="Réponse"
        className="flex-grow border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
      />
      
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={answerIsCorrect}
          onChange={handleIsCorrectChange}
          id={`isCorrect-${text}`}
          className="h-4 w-4 text-brand-red focus:ring-brand-red rounded border-gray-300"
        />
        <Label htmlFor={`isCorrect-${text}`} className="text-sm text-gray-700">Correcte</Label>
      </div>

      <Input
        type="number"
        value={answerPoints}
        onChange={handlePointsChange}
        placeholder="Points"
        className="w-20 border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
      />
      
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
        aria-label="Supprimer la réponse"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default AnswerComponent;
