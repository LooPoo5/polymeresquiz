
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PdfControlsProps {
  onPrint: () => void;
}

const PdfControls = ({ onPrint }: PdfControlsProps) => {
  return (
    <div className="flex gap-3">
      <Button onClick={onPrint} variant="outline" className="flex items-center gap-2">
        <Printer size={18} />
        <span>Imprimer</span>
      </Button>
      {/* Removed the Download PDF button */}
    </div>
  );
};

export default PdfControls;
