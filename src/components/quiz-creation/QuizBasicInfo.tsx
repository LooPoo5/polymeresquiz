
import React from 'react';
import { Trash2, Upload } from 'lucide-react';

interface QuizBasicInfoProps {
  title: string;
  setTitle: (title: string) => void;
  imageUrl: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

const QuizBasicInfo: React.FC<QuizBasicInfoProps> = ({
  title,
  setTitle,
  imageUrl,
  handleImageUpload,
  handleRemoveImage
}) => {
  return (
    <>
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Titre du quiz *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre du quiz"
          className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          required
        />
      </div>
      
      <div className="mb-8">
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
    </>
  );
};

export default QuizBasicInfo;
