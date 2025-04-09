
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { toast } from 'sonner';

interface PdfControlsProps {
  onPrint: () => void;
  onDownloadPDF?: () => void;
  isGenerating?: boolean;
}

const PdfControls = ({ onPrint, onDownloadPDF, isGenerating = false }: PdfControlsProps) => {
  const handleDownloadClick = () => {
    if (isGenerating) {
      toast.info("Génération en cours, veuillez patienter...");
      return;
    }
    
    if (onDownloadPDF) {
      onDownloadPDF();
    }
  };

  return (
    <div className="flex gap-3 print:hidden">
      <Button onClick={onPrint} variant="outline" className="flex items-center gap-2">
        <Printer size={18} />
        <span>Imprimer</span>
      </Button>
      
      {onDownloadPDF && (
        <Button 
          onClick={handleDownloadClick} 
          variant="outline" 
          className="flex items-center gap-2" 
          disabled={isGenerating}
        >
          <Download size={18} />
          <span>{isGenerating ? 'Génération...' : 'Télécharger PDF'}</span>
        </Button>
      )}
    </div>
  );
};

export default PdfControls;
