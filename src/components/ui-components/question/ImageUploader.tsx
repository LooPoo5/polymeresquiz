import React from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Question as QuestionType } from '@/context/QuizContext';
import { handleQuestionChange } from './questionUtils';
type ImageUploaderProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  isEditable: boolean;
};
const ImageUploader: React.FC<ImageUploaderProps> = ({
  question,
  onChange,
  isEditable
}) => {
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
  if (!isEditable && question.imageUrl) {
    return <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
        <img src={question.imageUrl} alt="Question illustration" className="w-full h-40 object-contain" />
      </div>;
  }
  if (!isEditable) {
    return null;
  }
  return <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Image (optionnelle)
      </label>
      
      {question.imageUrl ? <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
          <img src={question.imageUrl} alt="Question illustration" className="w-full h-40 object-contain" />
          <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white/90 text-brand-red p-1.5 rounded-full shadow-sm hover:bg-brand-red hover:text-white transition-colors" aria-label="Remove image">
            <Trash2 size={18} />
          </button>
        </div> : <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center mb-3 py-[10px]">
          <label htmlFor={`question-${question.id}-image`} className="flex flex-col items-center cursor-pointer">
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-gray-500 text-sm">
              Cliquez pour ajouter une image
            </span>
            <input id={`question-${question.id}-image`} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>}
    </div>;
};
export default ImageUploader;