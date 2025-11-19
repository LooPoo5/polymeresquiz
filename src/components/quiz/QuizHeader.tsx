import React, { useRef } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePrintDocument } from '@/hooks/usePrintDocument';
import { Question } from '@/context/QuizContext';
import BlankQuizPrintTemplate from './BlankQuizPrintTemplate';

type QuizHeaderProps = {
  title: string;
  questionCount: number;
  quiz?: {
    title: string;
    imageUrl?: string;
    questions: Question[];
  };
};

const QuizHeader: React.FC<QuizHeaderProps> = ({ title, questionCount, quiz }) => {
  const navigate = useNavigate();
  const printTemplateRef = useRef<HTMLDivElement>(null);

  const handlePrint = usePrintDocument({
    documentTitle: title || 'Quiz'
  });

  const handlePrintBlankQuiz = () => {
    handlePrint();
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-600 hover:text-brand-red transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Retour à l'accueil</span>
        </button>

        {quiz && (
          <Button
            variant="outline"
            onClick={handlePrintBlankQuiz}
            className="flex items-center gap-2"
          >
            <Printer size={18} />
            <span>Impression formulaire vierge</span>
          </Button>
        )}
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mx-0">
          <div>{questionCount} question{questionCount > 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Hidden print template */}
      {quiz && (
        <div id="blank-quiz-print-template" className="fixed -left-[9999px] -top-[9999px] w-[210mm]">
          <BlankQuizPrintTemplate
            ref={printTemplateRef}
            title={quiz.title}
            imageUrl={quiz.imageUrl}
            questions={quiz.questions}
          />
        </div>
      )}
    </div>
  );
};

export default QuizHeader;
