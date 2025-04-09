
import React from 'react';
import { toast } from "sonner";
import { 
  createPdfContainer, 
  addPdfStyles, 
  renderComponentToContainer,
  cleanupRenderedComponent 
} from './renderComponentToPdf';
import { 
  convertElementToPdfBlob, 
  downloadPdfBlob,
  savePdfDirectly 
} from './pdfConverter';
import { cleanupPdfGeneration } from './pdfConfig';

/**
 * Main function to generate a PDF from a React component
 * @param component React component to render as PDF
 * @param filename Name of the PDF file
 * @param onStart Callback when PDF generation starts
 * @param onComplete Callback when PDF generation completes
 * @param onError Callback if an error occurs
 * @param saveAs Whether to show the browser's save dialog
 */
export const generatePDFFromComponent = async (
  component: React.ReactElement,
  filename: string,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (error: any) => void,
  saveAs: boolean = true
): Promise<void> => {
  let rootInstance: any = null;
  let pdfContainer: HTMLElement | null = null;
  let styleElement: HTMLStyleElement | null = null;
  
  try {
    if (onStart) onStart();
    console.log('Starting PDF generation from component');
    
    // Set up PDF rendering environment
    pdfContainer = createPdfContainer();
    styleElement = addPdfStyles();
    
    // Render component to container
    const renderResult = renderComponentToContainer(component, pdfContainer);
    rootInstance = renderResult.rootInstance;
    
    // Wait for complete rendering and image loading
    setTimeout(async () => {
      try {
        if (saveAs) {
          // Generate PDF as blob and download with save dialog
          const blob = await convertElementToPdfBlob(pdfContainer, filename);
          console.log(`PDF blob generated`, blob);
          
          // Download the blob with browser's save dialog
          downloadPdfBlob(blob, filename);
          
          // Cleanup and notify completion
          setTimeout(() => {
            cleanupAfterPdfGeneration();
            if (onComplete) onComplete();
          }, 100);
        } else {
          // Use direct save without dialog
          await savePdfDirectly(
            pdfContainer,
            filename,
            () => {
              cleanupAfterPdfGeneration();
              if (onComplete) onComplete();
            },
            (error) => {
              cleanupAfterPdfGeneration();
              if (onError) onError(error);
              if (onComplete) onComplete();
            }
          );
        }
      } catch (error) {
        console.error(`PDF generation error:`, error);
        cleanupAfterPdfGeneration();
        
        if (onError) onError(error);
        if (onComplete) onComplete();
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 2000); // Delay to ensure complete rendering
  } catch (error) {
    console.error("PDF setup error:", error);
    cleanupAfterPdfGeneration();
    if (onError) onError(error);
    if (onComplete) onComplete();
    toast.error("Erreur lors de la préparation du PDF");
  }
  
  // Helper function for cleanup
  function cleanupAfterPdfGeneration() {
    cleanupPdfGeneration();
    cleanupRenderedComponent(rootInstance, pdfContainer, styleElement);
    rootInstance = null;
    pdfContainer = null;
    styleElement = null;
  }
};
