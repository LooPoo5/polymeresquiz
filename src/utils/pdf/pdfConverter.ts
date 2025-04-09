
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
  
  // Assurer le chargement des images
  await waitForImagesLoaded(element);
  
  // Options PDF optimisées
  const pdfOptions = {
    ...getDefaultPdfOptions(filename),
    filename: filename,
    margin: [10, 10, 10, 10], // Marges de page A4
    html2canvas: {
      scale: 2, // Échelle plus élevée pour une meilleure qualité
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      logging: true,
      imageTimeout: 5000, // Augmenter le délai d'attente pour les images
      windowWidth: 1024, // Largeur fixe pour le rendu
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    }
  };
  
  console.log(`Démarrage de la conversion HTML2PDF pour ${filename}`);
  
  // Générer le PDF sous forme de blob avec gestion améliorée des erreurs
  try {
    const worker = html2pdf().from(element).set(pdfOptions);
    return await worker.outputPdf('blob');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error('La génération du PDF a échoué: ' + (error instanceof Error ? error.message : String(error)));
  }
};

/**
 * Déclenche le téléchargement d'un blob PDF avec la boîte de dialogue d'enregistrement du navigateur
 */
export const downloadPdfBlob = (blob: Blob, filename: string): void => {
  // Vérification du blob
  if (!(blob instanceof Blob)) {
    console.error('Erreur: L\'objet fourni n\'est pas un Blob', blob);
    toast.error("Erreur lors du téléchargement du PDF");
    return;
  }
  
  try {
    // MÉTHODE FORCE POUR DÉCLENCHER LA BOITE DE DIALOGUE
    // Créer une URL blob
    const blobUrl = URL.createObjectURL(blob);
    
    // Créer un élément d'ancrage temporaire
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    
    // Ces attributs sont essentiels pour forcer le téléchargement
    downloadLink.setAttribute('target', '_blank');
    downloadLink.setAttribute('rel', 'noopener noreferrer');
    downloadLink.setAttribute('download', filename); // Double attribution pour compatibilité
    
    // Ajouter au document, cliquer et supprimer
    document.body.appendChild(downloadLink);
    
    // Forcer un délai avant de cliquer pour que le navigateur prépare le téléchargement
    setTimeout(() => {
      console.log("Déclenchement du téléchargement PDF", filename);
      downloadLink.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      }));
      
      // Nettoyage après un court délai
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
        cleanupPdfGeneration();
        toast.success("PDF téléchargé avec succès");
      }, 100);
    }, 200);
  } catch (error) {
    console.error("Erreur lors du téléchargement du PDF:", error);
    toast.error("Erreur lors du téléchargement du PDF");
    cleanupPdfGeneration();
  }
};

/**
 * Enregistre directement un PDF à partir d'un élément HTML sans afficher la boîte de dialogue d'enregistrement
 * Note: Cette fonction n'est plus utilisée car elle ne déclenchait pas la boîte de dialogue
 */
export const savePdfDirectly = async (
  element: HTMLElement,
  filename: string,
  onComplete?: () => void,
  onError?: (error: any) => void
): Promise<void> => {
  try {
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
