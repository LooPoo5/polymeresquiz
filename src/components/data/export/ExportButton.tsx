
import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ExportButtonProps {
  isExporting: boolean;
  exportProgress: number;
  onClick: () => void;
}

const ExportButton = ({ isExporting, exportProgress, onClick }: ExportButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isExporting} 
      variant="outline" 
      className="w-full flex flex-col items-center justify-center gap-4 py-12 font-normal text-xl bg-slate-50 hover:bg-slate-100 transition-all"
    >
      {isExporting ? (
        <>
          <Loader2 size={32} className="animate-spin text-brand-red" />
          <span>Exportation en cours...</span>
          {exportProgress > 0 && (
            <Progress value={exportProgress} className="w-full mt-2" />
          )}
        </>
      ) : (
        <>
          <Download size={32} className="text-brand-red" />
          <span className="font-normal">Exporter les données</span>
        </>
      )}
    </Button>
  );
};

export default ExportButton;
