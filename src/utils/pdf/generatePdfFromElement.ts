
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";
import { getDefaultPdfOptions, waitForImagesLoaded, setupPdfGeneration, cleanupPdfGeneration } from './pdfConfig';

// Function to generate PDF from HTML element
export const generatePDF = async (
  element: HTMLElement | null, 
  filename: string,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (error: any) => void
): Promise<void> => {
  if (!element) {
    console.error("No element to convert to PDF");
    if (onError) onError(new Error("No element to convert to PDF"));
    return;
  }
  
  try {
    if (onStart) onStart();
    setupPdfGeneration();
    
    // Add a version marker for debugging
    const versionMarker = document.createElement('div');
    versionMarker.className = 'text-xs text-gray-300';
    versionMarker.textContent = `v${Date.now()}`;
    element.appendChild(versionMarker);
    
    const pdfOptions = getDefaultPdfOptions(filename);
    console.log('Starting PDF generation with element:', element);

    // Give time for styles to be applied
    setTimeout(async () => {
      try {
        // Ensure all images are loaded
        await waitForImagesLoaded(element);

        // Convert to PDF
        await html2pdf().from(element).set(pdfOptions).save();
        
        // Cleanup
        if (element.contains(versionMarker)) {
          element.removeChild(versionMarker);
        }
        
        console.log('PDF generation completed');
        if (onComplete) onComplete();
        cleanupPdfGeneration();
        toast.success("PDF téléchargé avec succès");
      } catch (error) {
        console.error("PDF generation error:", error);
        if (onComplete) onComplete();
        cleanupPdfGeneration();
        if (onError) onError(error);
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 1000); // Longer delay to ensure everything is ready
  } catch (error) {
    console.error("PDF setup error:", error);
    if (onComplete) onComplete();
    cleanupPdfGeneration();
    if (onError) onError(error);
    toast.error("Erreur lors de la préparation du PDF");
  }
};
