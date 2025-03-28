
import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Printer } from 'lucide-react';

interface PdfControlsProps {
  onPrint: () => void;
  onDownloadPDF: () => void;
}

const PdfControls = ({ onPrint, onDownloadPDF }: PdfControlsProps) => {
  return (
    <div className="flex gap-3 print:hidden generating-pdf:hidden">
      <Button onClick={onPrint} variant="outline" className="flex items-center gap-2">
        <Printer size={18} />
        <span>Imprimer</span>
      </Button>
      
      <Button onClick={onDownloadPDF} className="flex items-center gap-2 bg-brand-red hover:bg-opacity-90">
        <DownloadCloud size={18} />
        <span>Télécharger PDF</span>
      </Button>
    </div>
  );
};

export default PdfControls;
