import React, { useState } from 'react';
import { Question as QuestionType, Answer } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Upload, Image as ImageIcon } from 'lucide-react';

interface QuestionProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onDelete: () => void;
}

const QuestionWithImage: React.FC<QuestionProps> = ({ question, onChange, onDelete }) => {
  const [text, setText] = useState(question.text);
  const [type, setType] = useState(question.type);
  const [points, setPoints] = useState(question.points);
  const [answers, setAnswers] = useState<Answer[]>(question.answers || []);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || '');
  const [imageUrl, setImageUrl] = useState(question.imageUrl || '');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange({ ...question, text: newText });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'multiple-choice' | 'open-ended' | 'checkbox';
    setType(newType);
    onChange({ ...question, type: newType, answers: [], correctAnswer: '' });
    setAnswers([]);
    setCorrectAnswer('');
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPoints = parseInt(e.target.value);
    setPoints(newPoints);
    onChange({ ...question, points: newPoints });
  };

  const handleAddAnswer = () => {
    const newAnswer: Answer = {
      id: `answer-${Date.now()}`,
      text: '',
      isCorrect: false,
      points: 0,
    };
    setAnswers([...answers, newAnswer]);
    onChange({ ...question, answers: [...answers, newAnswer] });
  };

  const handleUpdateAnswer = (index: number, updatedAnswer: Answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = updatedAnswer;
    setAnswers(newAnswers);
    onChange({ ...question, answers: newAnswers });
  };

  const handleDeleteAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
    onChange({ ...question, answers: newAnswers });
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCorrectAnswer = e.target.value;
    setCorrectAnswer(newCorrectAnswer);
    onChange({ ...question, correctAnswer: newCorrectAnswer });
  };

  const handleAnswerTextChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], text: e.target.value };
    setAnswers(newAnswers);
    onChange({ ...question, answers: newAnswers });
  };

  const handleIsCorrectChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], isCorrect: e.target.checked };
    setAnswers(newAnswers);
    onChange({ ...question, answers: newAnswers });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        onChange({ ...question, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onChange({ ...question, imageUrl: undefined });
  };

  const handleAnswerPointsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    const points = parseInt(e.target.value);
    newAnswers[index] = { ...newAnswers[index], points: isNaN(points) ? 0 : points };
    setAnswers(newAnswers);
    onChange({ ...question, answers: newAnswers });
  };

  const isCheckboxOrMultipleChoice = type === 'multiple-choice' || type === 'checkbox';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-4">
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
          className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
          value={text}
          onChange={handleTextChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="question-type" className="block text-sm font-medium text-gray-700">
          Type de question
        </label>
        <select
          id="question-type"
          className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
          value={type}
          onChange={handleTypeChange}
        >
          <option value="multiple-choice">Choix multiple</option>
          <option value="open-ended">Question ouverte</option>
          <option value="checkbox">Cases à cocher</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="question-points" className="block text-sm font-medium text-gray-700">
          Points
        </label>
        <input
          type="number"
          id="question-points"
          className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
          value={points}
          onChange={handlePointsChange}
        />
      </div>

      {isCheckboxOrMultipleChoice && (
        <div>
          <h4 className="text-md font-semibold mb-2">Réponses</h4>
          <div className="space-y-2">
            {answers.map((answer, index) => (
              <div key={answer.id} className="flex items-center space-x-2">
                <input
                  type={type === 'multiple-choice' ? 'radio' : 'checkbox'}
                  id={`answer-${answer.id}`}
                  name={`question-${question.id}`}
                  value={answer.id}
                  checked={answer.isCorrect}
                  onChange={(e) => handleIsCorrectChange(index, e)}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                />
                <input
                  type="text"
                  className="shadow-sm focus:ring-brand-red focus:border-brand-red block w-full sm:text-sm border-gray-200 rounded-md"
                  value={answer.text}
                  onChange={(e) => handleAnswerTextChange(index, e)}
                />
                <input
                  type="number"
                  className="shadow-sm focus:ring-brand-red focus:border-brand-red block w-20 sm:text-sm border-gray-200 rounded-md"
                  placeholder="Points"
                  value={answer.points || 0}
                  onChange={(e) => handleAnswerPointsChange(index, e)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAnswer(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2" onClick={handleAddAnswer}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une réponse
            </Button>
          </div>
        </div>
      )}

      {type === 'open-ended' && (
        <div>
          <label htmlFor="correct-answer" className="block text-sm font-medium text-gray-700">
            Réponse Correcte (pour référence)
          </label>
          <input
            type="text"
            id="correct-answer"
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
            value={correctAnswer}
            onChange={handleCorrectAnswerChange}
          />
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image (optionnel)
        </label>

        {imageUrl ? (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[200px] w-full">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-brand-red p-1.5 rounded-full shadow-sm hover:bg-brand-red hover:text-white transition-colors"
              aria-label="Remove image"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-gray-500 mb-2">
                Glissez-déposez une image ou cliquez pour parcourir
              </p>
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <span>Parcourir</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionWithImage;
