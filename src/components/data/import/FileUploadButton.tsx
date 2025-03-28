
import React from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadButtonProps {
  isImporting: boolean;
  importProgress: number;
  onClick: () => void;
}

const FileUploadButton = ({ isImporting, importProgress, onClick }: FileUploadButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isImporting} 
      variant="outline" 
      className="w-full flex flex-col items-center justify-center gap-4 py-12 text-xl bg-slate-50 hover:bg-slate-100 transition-all"
    >
      {isImporting ? (
        <>
          <Loader2 size={32} className="animate-spin text-brand-red" />
          <span>Importation en cours...</span>
          {importProgress > 0 && (
            <Progress value={importProgress} className="w-full mt-2" />
          )}
        </>
      ) : (
        <>
          <Upload size={32} className="text-brand-red" />
          <span className="font-normal">Importer des données</span>
        </>
      )}
    </Button>
  );
};

export default FileUploadButton;
