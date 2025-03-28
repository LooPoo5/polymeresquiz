
import React, { useRef } from 'react';
import { Award, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/timeUtils';

interface CertificateProps {
  participantName: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  completionDate: Date;
  showCertificate: boolean;
}

const Certificate = ({ 
  participantName, 
  quizTitle, 
  score, 
  maxScore,
  completionDate,
  showCertificate
}: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadCertificate = () => {
    if (!certificateRef.current) return;
    
    const element = certificateRef.current;
    const options = {
      margin: 0.5,
      filename: `certificat-${quizTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(options).from(element).save();
  };
  
  if (!showCertificate) return null;
  
  // Calculate success percentage
  const successPercentage = Math.round((score / maxScore) * 100);
  
  return (
    <div className="mb-12 animate-scale-in print:page-break-before">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Award className="text-yellow-500" size={20} />
          Certificat de réussite
        </h3>
        <Button 
          onClick={handleDownloadCertificate} 
          variant="outline" 
          className="flex items-center gap-2 print:hidden generating-pdf:hidden"
        >
          <Download size={16} />
          Télécharger le certificat
        </Button>
      </div>
      
      <div 
        ref={certificateRef} 
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 border-4 border-double border-brand-red rounded-lg shadow-lg certificate-container"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-2 mb-4">
            <Award className="h-16 w-16 text-brand-red mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Certificat de Réussite</h2>
          <p className="text-gray-500 dark:text-gray-400">Ce certificat est décerné à</p>
        </div>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-brand-red mb-1">{participantName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">pour avoir complété avec succès</p>
          <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2">
            {quizTitle}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            avec un score de <span className="font-bold">{score}/{maxScore}</span> points ({successPercentage}%)
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-10">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">Date de réussite:</p>
            <p className="text-gray-600 dark:text-gray-300">{formatDate(completionDate)}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-12 mb-2 mx-auto text-brand-red text-xl font-bold flex items-center justify-center border-b-2 border-brand-red">
              A+
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Note finale</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
