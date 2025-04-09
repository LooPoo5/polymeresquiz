
import { toast } from "sonner";
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

/**
 * Downloads a PDF document using pdfmake with proper error handling and timeouts
 */
export const downloadPdfDocument = (
  docDefinition: TDocumentDefinitions,
  filename: string,
  onSuccess: () => void,
  onTimeout: () => void
): void => {
  try {
    // Initialize document generation status
    let isProcessing = true;
    
    // Create shorter 5 second timeout for initial processing
    const firstTimeoutId = setTimeout(() => {
      if (isProcessing) {
        toast.info("La génération du PDF est en cours, veuillez patienter...");
      }
    }, 2000);
    
    // Main timeout handling (10 seconds)
    const timeoutId = setTimeout(() => {
      if (isProcessing) {
        toast.error("Le téléchargement prend trop de temps. Veuillez réessayer.");
        onTimeout();
        isProcessing = false;
      }
    }, 10000);
    
    console.log('Starting PDF generation with optimized settings');
    
    // Generate PDF with optimized options
    const pdfDoc = pdfMake.createPdf({
      ...docDefinition,
      compress: true,
      // Set fonts explicitly to avoid font loading issues
      defaultStyle: {
        font: 'Roboto'
      }
    });
    
    // Download with improved error handling
    pdfDoc.download(filename, () => {
      console.log('PDF download completed successfully');
      toast.success("PDF téléchargé avec succès");
      clearTimeout(firstTimeoutId);
      clearTimeout(timeoutId);
      isProcessing = false;
      onSuccess();
    });
    
    // Also get base64 to validate document is processed correctly
    pdfDoc.getBase64((data) => {
      if (data && data.length > 0) {
        console.log(`PDF generated successfully (${Math.round(data.length / 1024)} KB)`);
        // If base64 is valid but download hasn't completed within 2s, we can force finish
        setTimeout(() => {
          if (isProcessing) {
            console.log('PDF generation completed but download may not have triggered correctly');
            clearTimeout(timeoutId);
            isProcessing = false;
            onSuccess();
          }
        }, 2000);
      }
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    toast.error("Erreur lors du téléchargement du PDF");
    onTimeout();
  }
};
