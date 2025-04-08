
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";
import React from 'react';
import ReactDOM from 'react-dom';

export const generatePDF = async (
  element: HTMLElement | null, 
  filename: string,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (error: any) => void
) => {
  if (!element) return;
  
  try {
    if (onStart) onStart();
    document.body.classList.add('generating-pdf');
    
    const pdfOptions = {
      margin: 10,
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    // Use setTimeout to allow CSS to be applied before generating PDF
    setTimeout(async () => {
      try {
        await html2pdf().from(element).set(pdfOptions).save();
        if (onComplete) onComplete();
        document.body.classList.remove('generating-pdf');
        toast.success("PDF téléchargé avec succès");
      } catch (error) {
        console.error("PDF generation error:", error);
        if (onComplete) onComplete();
        document.body.classList.remove('generating-pdf');
        if (onError) onError(error);
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 500);
  } catch (error) {
    console.error("PDF setup error:", error);
    if (onComplete) onComplete();
    document.body.classList.remove('generating-pdf');
    if (onError) onError(error);
    toast.error("Erreur lors de la préparation du PDF");
  }
};

// Function to render a React component to a temporary div and generate PDF from it
export const generatePDFFromComponent = async (
  component: React.ReactElement,
  filename: string,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (error: any) => void
) => {
  try {
    if (onStart) onStart();
    
    // Create temporary container for the PDF content
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-container';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '210mm'; // A4 width
    pdfContainer.style.backgroundColor = 'white';
    document.body.appendChild(pdfContainer);
    
    // Add print-specific styles to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @media print {
        .page-break-inside-avoid {
          page-break-inside: avoid !important;
        }
        .pdf-container {
          font-size: 12px !important;
          color: black !important;
          background-color: white !important;
        }
        img {
          max-width: 100% !important;
          max-height: 100px !important;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    // Render the component to the temporary container
    ReactDOM.render(component, pdfContainer);
    
    // Wait for rendering and images to load
    const loadingDelay = 4000; // Increased to 4 seconds for better image loading
    
    setTimeout(async () => {
      try {
        document.body.classList.add('generating-pdf');
        
        // Make sure images are loaded
        const images = pdfContainer.querySelectorAll('img');
        let imagesLoaded = true;
        
        if (images.length > 0) {
          try {
            await Promise.all(
              Array.from(images).map(img => 
                img.complete ? Promise.resolve() : new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = resolve; // Continue even if image fails to load
                  // Add a timeout to avoid hanging indefinitely
                  setTimeout(resolve, 2000);
                })
              )
            );
          } catch (err) {
            console.error("Image loading error:", err);
            imagesLoaded = false;
          }
        }
        
        console.log("Images loaded:", imagesLoaded, "Total images:", images.length);
        
        // Clone the node to avoid React issues
        const contentToExport = pdfContainer.cloneNode(true) as HTMLElement;
        
        // PDF generation options
        const pdfOptions = {
          margin: [10, 10, 10, 10], // [top, right, bottom, left] in mm
          filename: filename,
          image: {
            type: 'jpeg',
            quality: 0.98
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: true,
            letterRendering: true,
            allowTaint: true,
            foreignObjectRendering: false
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate PDF
        await html2pdf().from(contentToExport).set(pdfOptions).save();
        
        // Clean up
        if (document.body.contains(pdfContainer)) {
          document.body.removeChild(pdfContainer);
        }
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
        document.body.classList.remove('generating-pdf');
        
        if (onComplete) onComplete();
        toast.success("PDF téléchargé avec succès");
      } catch (error) {
        console.error("PDF generation error:", error);
        document.body.classList.remove('generating-pdf');
        
        // Clean up on error
        if (document.body.contains(pdfContainer)) {
          document.body.removeChild(pdfContainer);
        }
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
        
        if (onError) onError(error);
        if (onComplete) onComplete();
        toast.error("Erreur lors de la génération du PDF");
      }
    }, loadingDelay);
  } catch (error) {
    console.error("PDF setup error:", error);
    document.body.classList.remove('generating-pdf');
    if (onError) onError(error);
    if (onComplete) onComplete();
    toast.error("Erreur lors de la préparation du PDF");
  }
};
