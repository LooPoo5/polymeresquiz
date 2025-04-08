
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
    document.body.appendChild(pdfContainer);
    
    // Render the component to the temporary container
    ReactDOM.render(component, pdfContainer);
    
    // Wait for rendering to complete
    setTimeout(async () => {
      try {
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
        
        await html2pdf().from(pdfContainer).set(pdfOptions).save();
        
        // Clean up
        document.body.removeChild(pdfContainer);
        document.body.classList.remove('generating-pdf');
        
        if (onComplete) onComplete();
        toast.success("PDF téléchargé avec succès");
      } catch (error) {
        console.error("PDF generation error:", error);
        document.body.classList.remove('generating-pdf');
        
        // Clean up on error
        if (document.getElementById('pdf-container')) {
          document.body.removeChild(pdfContainer);
        }
        
        if (onError) onError(error);
        if (onComplete) onComplete();
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 500);
  } catch (error) {
    console.error("PDF setup error:", error);
    document.body.classList.remove('generating-pdf');
    if (onError) onError(error);
    if (onComplete) onComplete();
    toast.error("Erreur lors de la préparation du PDF");
  }
};
