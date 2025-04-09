
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

/**
 * Converts an HTML element to PDF and triggers download
 */
export const savePdfDirectly = async (
  element: HTMLElement,
  filename: string,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  try {
    console.log('Démarrage de la conversion HTML -> PDF');
    
    // Configure PDF options
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        logging: true,
        allowTaint: true,
        letterRendering: true,
        removeContainer: true
      },
      jsPDF:        { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        pagesplit: true,
        hotfixes: ['px_scaling']
      }
    };
    
    // Generate PDF with html2pdf.js
    console.log(`Démarrage de la conversion HTML2PDF pour ${filename}`);
    
    const pdf = await html2pdf()
      .from(element)
      .set(opt)
      .outputPdf('blob');
    
    console.log(`Conversion PDF terminée, taille du blob: ${pdf.size}`);
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(pdf);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Trigger download
    console.log(`Déclenchement du téléchargement PDF ${filename}`);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onSuccess();
    }, 100);
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error("Erreur lors de la conversion du PDF");
    onError(error);
  }
};

/**
 * Converts an HTML element to a PDF blob
 */
export const convertElementToPdfBlob = async (
  element: HTMLElement,
  filename: string
): Promise<Blob> => {
  console.log('Conversion d\'élément HTML en blob PDF');
  
  // Configure PDF options
  const opt = {
    margin:       [10, 10, 10, 10],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
      scale: 2, 
      useCORS: true,
      logging: true,
      allowTaint: true,
      letterRendering: true
    },
    jsPDF:        { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true,
      pagesplit: true,
      hotfixes: ['px_scaling']
    }
  };
  
  // Generate PDF with html2pdf.js
  const pdf = await html2pdf()
    .from(element)
    .set(opt)
    .outputPdf('blob');
  
  console.log(`Conversion terminée, taille du blob: ${pdf.size}`);
  
  return pdf;
};

/**
 * Triggers download of a PDF blob
 */
export const downloadPdfBlob = (blob: Blob, filename: string): void => {
  console.log(`Préparation du téléchargement du PDF: ${filename}`);
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  
  // Trigger download
  console.log(`Déclenchement du téléchargement: ${filename}`);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`Téléchargement nettoyé: ${filename}`);
  }, 100);
};
