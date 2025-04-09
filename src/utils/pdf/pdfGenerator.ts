
import { toast } from "sonner";
import pdfMake from 'pdfmake/build/pdfmake';

/**
 * Handles the generation and download of a PDF document
 */
export const generateAndDownloadPdf = (
  docDefinition: any,
  filename: string,
  onSuccess: () => void,
  onTimeout: () => void
): void => {
  // Create PDF document
  const pdfDoc = pdfMake.createPdf(docDefinition);
  
  // Set up timeout for stuck process
  const timeoutId = setTimeout(() => {
    toast.info("Le téléchargement prend plus de temps que prévu...");
    // If it's taking too long, we'll reset the state after 15 seconds
    setTimeout(() => {
      onTimeout();
      toast.error("Le téléchargement a été interrompu. Veuillez réessayer.");
    }, 15000);
  }, 10000);
  
  // Trigger the download
  pdfDoc.download(filename, () => {
    toast.success("PDF téléchargé avec succès");
    onSuccess();
    
    // Clear any pending timeouts if download successful
    if (timeoutId) clearTimeout(timeoutId);
  });
  
  // Get the base64 representation of the PDF to check if it's ready
  pdfDoc.getBase64((data) => {
    if (data) {
      console.log("PDF data generated successfully");
      if (timeoutId) clearTimeout(timeoutId);
    }
  });
};
