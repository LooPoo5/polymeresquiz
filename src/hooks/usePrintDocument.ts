
import { useCallback } from 'react';

interface UsePrintDocumentOptions {
  documentTitle?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

export const usePrintDocument = ({
  documentTitle,
  onBeforePrint,
  onAfterPrint
}: UsePrintDocumentOptions = {}) => {
  
  const handlePrint = useCallback(() => {
    // Store original document title
    const originalTitle = document.title;
    
    // Execute before print callback if provided
    if (onBeforePrint) {
      onBeforePrint();
    }
    
    // Set new document title if provided
    if (documentTitle) {
      document.title = documentTitle;
    }
    
    // Trigger print dialog
    window.print();
    
    // Restore the original title and execute after print callback
    setTimeout(() => {
      document.title = originalTitle;
      if (onAfterPrint) {
        onAfterPrint();
      }
    }, 100);
  }, [documentTitle, onBeforePrint, onAfterPrint]);
  
  return handlePrint;
};

export default usePrintDocument;
