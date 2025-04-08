
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
    pdfContainer.style.width = '210mm'; // A4 width
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.color = 'black';
    pdfContainer.style.zIndex = '-1000'; // Ensure it's below other content
    document.body.appendChild(pdfContainer);
    
    // Add specific styles for printing
    styleElement = document.createElement('style');
    styleElement.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #pdf-container, #pdf-container * {
          visibility: visible !important;
        }
        #pdf-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .page-break-inside-avoid {
          page-break-inside: avoid !important;
        }
      }
      #pdf-container {
        font-size: 12px !important;
        color: black !important;
        background-color: white !important;
        padding: 20px;
        box-sizing: border-box;
      }
      #pdf-container img {
        max-width: 100% !important;
        max-height: 100px !important;
      }
      #pdf-container h1, #pdf-container h2, #pdf-container h3, #pdf-container h4 {
        color: black !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Add version ID to trace generations
    const versionId = Date.now();
    console.log(`PDF generation version: ${versionId}`);
    
    // Use modern React 18 createRoot API instead of ReactDOM.render
    rootInstance = createRoot(pdfContainer);
    rootInstance.render(React.cloneElement(component, { version: versionId }));
    
    // Wait for complete rendering and image loading
    // Substantial delay to ensure everything is loaded properly
    setTimeout(async () => {
      try {
        setupPdfGeneration();
        console.log(`Starting PDF conversion after render delay (v${versionId})`);
        
        // Ensure images are loaded
        await waitForImagesLoaded(pdfContainer);
        
        // Optimized PDF options
        const pdfOptions = getDefaultPdfOptions(filename);
        
        console.log(`Starting HTML2PDF conversion (v${versionId})`);
        
        // Generate PDF with html2pdf
        await html2pdf().from(pdfContainer).set(pdfOptions).save();
        
        console.log(`PDF generation complete (v${versionId})`);
        
        // Cleanup
        setTimeout(() => {
          cleanupAfterPdfGeneration();
          
          if (onComplete) onComplete();
          toast.success("PDF téléchargé avec succès");
        }, 1000);
      } catch (error) {
        console.error(`PDF generation error (v${versionId}):`, error);
        cleanupAfterPdfGeneration();
        
        if (onError) onError(error);
        if (onComplete) onComplete();
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 3000); // Increased delay to ensure complete rendering
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
