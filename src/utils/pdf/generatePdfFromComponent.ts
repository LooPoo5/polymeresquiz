
import React from 'react';
import { createRoot } from 'react-dom/client';
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";
import { getDefaultPdfOptions, waitForImagesLoaded, setupPdfGeneration, cleanupPdfGeneration } from './pdfConfig';

// Function to generate PDF from React component
export const generatePDFFromComponent = async (
  component: React.ReactElement,
  filename: string,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (error: any) => void
): Promise<void> => {
  let rootInstance: any = null;
  let pdfContainer: HTMLElement | null = null;
  let styleElement: HTMLStyleElement | null = null;
  
  try {
    if (onStart) onStart();
    console.log('Starting PDF generation from component');
    
    // Create temporary container for PDF content
    pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-container';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '210mm'; // A4 width
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.color = 'black';
    document.body.appendChild(pdfContainer);
    
    // Add specific styles for PDF printing (similar to the print styles)
    styleElement = document.createElement('style');
    styleElement.textContent = `
      @page {
        size: A4;
        margin: 0.5cm;
      }
      #pdf-container {
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: black !important;
        background-color: white !important;
        padding: 10mm;
        box-sizing: border-box;
        width: 210mm;
      }
      #pdf-container img {
        max-width: 100%;
        height: auto;
      }
      #pdf-container h1, #pdf-container h2, #pdf-container h3, #pdf-container h4 {
        color: black !important;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }
      #pdf-container * {
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Add version ID to trace generations
    const versionId = Date.now();
    console.log(`PDF generation version: ${versionId}`);
    
    // Use modern React 18 createRoot API
    rootInstance = createRoot(pdfContainer);
    rootInstance.render(React.cloneElement(component, { version: versionId }));
    
    // Wait for complete rendering and image loading
    setTimeout(async () => {
      try {
        setupPdfGeneration();
        console.log(`Starting PDF conversion after render delay (v${versionId})`);
        
        // Ensure images are loaded
        await waitForImagesLoaded(pdfContainer);
        
        // Optimized PDF options
        const pdfOptions = {
          ...getDefaultPdfOptions(filename),
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
        
        console.log(`Starting HTML2PDF conversion (v${versionId})`);
        
        // Generate PDF with html2pdf
        const worker = html2pdf()
          .from(pdfContainer)
          .set(pdfOptions)
          .save();
        
        // Handle PDF generation completion
        worker.then(() => {
          console.log(`PDF generation complete (v${versionId})`);
          
          // Cleanup
          setTimeout(() => {
            cleanupAfterPdfGeneration();
            
            if (onComplete) onComplete();
            toast.success("PDF téléchargé avec succès");
          }, 1000);
        }).catch((error) => {
          console.error(`PDF generation worker error (v${versionId}):`, error);
          cleanupAfterPdfGeneration();
          
          if (onError) onError(error);
          if (onComplete) onComplete();
          toast.error("Erreur lors de la génération du PDF");
        });
      } catch (error) {
        console.error(`PDF generation error (v${versionId}):`, error);
        cleanupAfterPdfGeneration();
        
        if (onError) onError(error);
        if (onComplete) onComplete();
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 2000); // Shorter delay to ensure complete rendering
  } catch (error) {
    console.error("PDF setup error:", error);
    cleanupAfterPdfGeneration();
    if (onError) onError(error);
    if (onComplete) onComplete();
    toast.error("Erreur lors de la préparation du PDF");
  }
  
  // Helper function for cleanup
  function cleanupAfterPdfGeneration() {
    try {
      cleanupPdfGeneration();
      
      // Unmount React component properly with new API
      if (rootInstance) {
        rootInstance.unmount();
        rootInstance = null;
      }
      
      // Remove container
      if (pdfContainer && document.body.contains(pdfContainer)) {
        document.body.removeChild(pdfContainer);
        pdfContainer = null;
      }
      
      // Remove style element
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
        styleElement = null;
      }
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  }
};
