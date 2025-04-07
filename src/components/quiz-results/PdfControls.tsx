
import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Printer, Loader2 } from 'lucide-react';

interface PdfControlsProps {
  onPrint: () => void;
  onDownloadPDF: () => void;
  isGenerating?: boolean;
}

const PdfControls = ({ onPrint, onDownloadPDF, isGenerating = false }: PdfControlsProps) => {
  return (
    <div className="flex gap-3 print:hidden generating-pdf:hidden">
      <Button onClick={onPrint} variant="outline" className="flex items-center gap-2" disabled={isGenerating}>
        <Printer size={18} />
        <span>Imprimer</span>
      </Button>
      
      <Button 
        onClick={onDownloadPDF} 
        className="flex items-center gap-2 bg-brand-red hover:bg-opacity-90"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <DownloadCloud size={18} />
        )}
        <span>{isGenerating ? "Génération..." : "Télécharger PDF"}</span>
      </Button>
    </div>
  );
};

export default PdfControls;
