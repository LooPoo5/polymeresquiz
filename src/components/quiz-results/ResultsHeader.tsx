
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DarkModeToggle from '@/components/ui-components/DarkModeToggle';
import PdfControls from './PdfControls';

interface ResultsHeaderProps {
  quizTitle: string;
  onPrint: () => void;
  onDownloadPDF: () => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  quizTitle, 
  onPrint, 
  onDownloadPDF 
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/results')} 
          className="flex items-center gap-2 text-gray-600 hover:text-brand-red transition-colors print:hidden"
        >
          <ArrowLeft size={18} />
          <span>Retour aux résultats</span>
        </button>
        
        <DarkModeToggle forcePage={true} />
      </div>
      
      <div className="flex justify-between items-start mb-6 print:mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1 dark:text-white">Résultats du quiz</h1>
          <h2 className="text-xl dark:text-gray-300">{quizTitle}</h2>
        </div>
        
        <PdfControls 
          onPrint={onPrint} 
          onDownloadPDF={onDownloadPDF} 
        />
      </div>
    </>
  );
};

export default ResultsHeader;
