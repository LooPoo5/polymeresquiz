
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface PdfControlsProps {
  onPrint: () => void;
  onDownloadPDF?: () => void;
  isGenerating?: boolean;
}

const PdfControls = ({ onPrint, onDownloadPDF, isGenerating = false }: PdfControlsProps) => {
  return (
    <div className="flex gap-3 print:hidden">
      <Button onClick={onPrint} variant="outline" className="flex items-center gap-2">
        <Printer size={18} />
        <span>Imprimer</span>
      </Button>
      
      {onDownloadPDF && (
        <Button 
          onClick={onDownloadPDF} 
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
