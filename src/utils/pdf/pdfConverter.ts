
import html2pdf from 'html2pdf.js';
import { getDefaultPdfOptions, waitForImagesLoaded, setupPdfGeneration, cleanupPdfGeneration } from './pdfConfig';
import { toast } from "sonner";

/**
 * Convertit un élément HTML en PDF et le renvoie sous forme de Blob
 */
export const convertElementToPdfBlob = async (
  element: HTMLElement,
  filename: string
): Promise<Blob> => {
  setupPdfGeneration();
  
  console.log("Démarrage de la conversion HTML -> PDF");
  
  // Assurer le chargement des images
  await waitForImagesLoaded(element);
  
  // Options PDF optimisées
  const pdfOptions = getDefaultPdfOptions(filename);
  
  console.log(`Démarrage de la conversion HTML2PDF pour ${filename}`);
  
  // Générer le PDF sous forme de blob avec gestion améliorée des erreurs
  try {
    const worker = html2pdf().from(element).set(pdfOptions);
    const blob = await worker.outputPdf('blob');
    console.log("Conversion PDF terminée, taille du blob:", blob.size);
    
    // Vérifier si le blob est valide
    if (blob.size < 1000) {
      throw new Error("Le PDF généré est trop petit, il s'agit probablement d'une page blanche");
    }
    
    cleanupPdfGeneration();
    return blob;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    cleanupPdfGeneration();
    throw new Error('La génération du PDF a échoué: ' + (error instanceof Error ? error.message : String(error)));
  }
};

/**
 * Déclenche le téléchargement d'un blob PDF en forçant la boîte de dialogue d'enregistrement
 */
export const downloadPdfBlob = (blob: Blob, filename: string): void => {
  // Vérification du blob
  if (!(blob instanceof Blob)) {
    console.error('Erreur: L\'objet fourni n\'est pas un Blob', blob);
    toast.error("Erreur lors du téléchargement du PDF");
    return;
  }
  
  try {
    console.log("Déclenchement du téléchargement PDF", filename);
    
    // Créer une URL blob
    const blobUrl = URL.createObjectURL(blob);
    
    // Créer un élément d'ancrage invisible
    const downloadLink = document.createElement('a');
    downloadLink.style.display = 'none';
    downloadLink.href = blobUrl;
    downloadLink.setAttribute('download', filename);
    downloadLink.setAttribute('target', '_blank');
    document.body.appendChild(downloadLink);
    
    // Déclencher immédiatement un clic sur le lien
    downloadLink.click();
    
    // Nettoyer après un court délai
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
      toast.success("PDF téléchargé avec succès");
    }, 100);
  } catch (error) {
    console.error("Erreur lors du téléchargement du PDF:", error);
    toast.error("Erreur lors du téléchargement du PDF");
  }
};

/**
 * Enregistre directement un PDF à partir d'un élément HTML
 */
export const savePdfDirectly = async (
  element: HTMLElement,
  filename: string,
  onComplete?: () => void,
  onError?: (error: any) => void
): Promise<void> => {
  try {
    toast.info("Génération du PDF en cours...");
    
    // Converti en blob et télécharge avec dialogue d'enregistrement
    const blob = await convertElementToPdfBlob(element, filename);
    downloadPdfBlob(blob, filename);
    
    if (onComplete) onComplete();
  } catch (error) {
    console.error("Erreur de conversion PDF:", error);
    cleanupPdfGeneration();
    
    if (onError) onError(error);
    toast.error("Erreur lors de la génération du PDF");
  }
};
