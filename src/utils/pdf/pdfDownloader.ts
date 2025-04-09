
import { toast } from "sonner";
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

/**
 * Downloads a PDF document using pdfmake with proper error handling
 */
export const downloadPdfDocument = (
  docDefinition: TDocumentDefinitions,
  filename: string,
  onSuccess: () => void,
  onTimeout: () => void
): void => {
  try {
    // Generate PDF with timeout handling
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    // Set up timeout for stuck process
    const timeoutId = setTimeout(() => {
      toast.error("Le téléchargement prend trop de temps. Veuillez réessayer.");
      onTimeout();
    }, 10000);
    
    // Download with simplified error handling
    pdfDoc.download(filename, () => {
      toast.success("PDF téléchargé avec succès");
      onSuccess();
      clearTimeout(timeoutId);
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    toast.error("Erreur lors du téléchargement du PDF");
    onTimeout();
  }
};
