
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";

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
