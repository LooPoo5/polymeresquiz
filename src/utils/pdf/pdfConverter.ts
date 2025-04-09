
import html2pdf from 'html2pdf.js';
import { getDefaultPdfOptions, waitForImagesLoaded, setupPdfGeneration, cleanupPdfGeneration } from './pdfConfig';
import { toast } from "sonner";

/**
 * Converts an HTML element to a PDF and returns it as a Blob
 */
export const convertElementToPdfBlob = async (
  element: HTMLElement,
  filename: string
): Promise<Blob> => {
  setupPdfGeneration();
  
  // Ensure images are loaded
  await waitForImagesLoaded(element);
  
  // Optimized PDF options
  const pdfOptions = {
    ...getDefaultPdfOptions(filename),
    filename: filename,
    margin: [10, 10, 10, 10], // A4 page margins
    html2canvas: {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      logging: true
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    }
  };
  
  console.log(`Starting HTML2PDF conversion for ${filename}`);
  
  // Generate PDF as blob
  const pdf = html2pdf().from(element).set(pdfOptions);
  return await pdf.outputPdf('blob');
};

/**
 * Triggers the download of a PDF blob with the browser's save dialog
 */
export const downloadPdfBlob = (blob: Blob, filename: string): void => {
  // Create a blob URL
  const blobUrl = URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = filename;
  
  // Append to document, click and remove
  document.body.appendChild(downloadLink);
  downloadLink.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);
    cleanupPdfGeneration();
    toast.success("PDF téléchargé avec succès");
  }, 100);
};

/**
 * Directly saves a PDF from an HTML element without showing the save dialog
 */
export const savePdfDirectly = async (
  element: HTMLElement,
  filename: string,
  onComplete?: () => void,
  onError?: (error: any) => void
): Promise<void> => {
  try {
    setupPdfGeneration();
    await waitForImagesLoaded(element);
    
    const pdfOptions = {
      ...getDefaultPdfOptions(filename),
      filename: filename,
      margin: [10, 10, 10, 10],
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      }
    };
    
    // Original behavior - automatic download without save dialog
    const worker = html2pdf()
      .from(element)
      .set(pdfOptions)
      .save();
    
    // Handle PDF generation completion
    worker.then(() => {
      console.log(`PDF generation complete`);
      
      // Cleanup
      setTimeout(() => {
        cleanupPdfGeneration();
        
        if (onComplete) onComplete();
        toast.success("PDF téléchargé avec succès");
      }, 1000);
    }).catch((error) => {
      console.error(`PDF generation worker error:`, error);
      cleanupPdfGeneration();
      
      if (onError) onError(error);
      toast.error("Erreur lors de la génération du PDF");
    });
  } catch (error) {
    console.error("PDF conversion error:", error);
    cleanupPdfGeneration();
    
    if (onError) onError(error);
    toast.error("Erreur lors de la génération du PDF");
  }
};
