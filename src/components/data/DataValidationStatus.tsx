
import React from 'react';
import { AlertCircle, FileCheck, Loader2 } from 'lucide-react';

interface DataValidationStatusProps {
  status: {
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
  }
}

const DataValidationStatus = ({ status }: DataValidationStatusProps) => {
  if (!status.message) return null;
  
  return (
    <div className={`mt-4 p-3 rounded-md w-full text-sm ${
      status.isValid === true 
        ? 'bg-green-50 text-green-700 border border-green-200' 
        : status.isValid === false
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-blue-50 text-blue-700 border border-blue-200'
    }`}>
      {status.isValidating ? (
        <div className="flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          {status.message}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {status.isValid === true ? (
            <FileCheck size={14} />
          ) : (
            <AlertCircle size={14} />
          )}
          {status.message}
        </div>
      )}
    </div>
  );
};

export default DataValidationStatus;
