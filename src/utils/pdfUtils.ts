
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";
import React from 'react';
import ReactDOM from 'react-dom';

// Fonction complètement réécrite pour corriger le problème de PDF blanc
export const generatePDF = async (
  element: HTMLElement | null, 
  filename: string,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (error: any) => void
) => {
  if (!element) {
    console.error("No element to convert to PDF");
    if (onError) onError(new Error("No element to convert to PDF"));
    return;
  }
  
  try {
    if (onStart) onStart();
    document.body.classList.add('generating-pdf');
    
    // Ajouter une version pour le débogage
    const versionMarker = document.createElement('div');
    versionMarker.className = 'text-xs text-gray-300';
    versionMarker.textContent = `v${Date.now()}`;
    element.appendChild(versionMarker);
    
    const pdfOptions = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    console.log('Starting PDF generation with element:', element);

    // Donner du temps pour que les styles soient appliqués
    setTimeout(async () => {
      try {
        // Capturer toutes les images pour s'assurer qu'elles sont chargées
        const images = element.querySelectorAll('img');
        console.log(`Found ${images.length} images to load`);
        
        if (images.length > 0) {
          await Promise.all(
            Array.from(images).map(img => 
              img.complete ? Promise.resolve() : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve(); // Continuer même si l'image échoue
                setTimeout(() => resolve(), 1000); // Timeout de sécurité
              })
            )
          );
          console.log('All images loaded or timeout reached');
        }

        // Convertir en PDF
        await html2pdf().from(element).set(pdfOptions).save();
        
        // Nettoyage
        if (element.contains(versionMarker)) {
          element.removeChild(versionMarker);
        }
        
        console.log('PDF generation completed');
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
    }, 1000); // Délai plus long pour s'assurer que tout est prêt
  } catch (error) {
    console.error("PDF setup error:", error);
    if (onComplete) onComplete();
    document.body.classList.remove('generating-pdf');
    if (onError) onError(error);
    toast.error("Erreur lors de la préparation du PDF");
  }
};

// Fonction complètement réécrite pour corriger le problème de PDF blanc
export const generatePDFFromComponent = async (
  component: React.ReactElement,
  filename: string,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (error: any) => void
) => {
  try {
    if (onStart) onStart();
    console.log('Starting PDF generation from component');
    
    // Créer un conteneur temporaire pour le contenu PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-container';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.width = '210mm'; // Largeur A4
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.color = 'black';
    pdfContainer.style.zIndex = '-1000'; // Ensure it's below other content
    document.body.appendChild(pdfContainer);
    
    // Ajouter des styles spécifiques pour l'impression
    const styleElement = document.createElement('style');
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
    
    // Ajouter un identifiant de version pour tracer les générations
    const versionId = Date.now();
    console.log(`PDF generation version: ${versionId}`);
    
    // Rendre le composant dans le conteneur temporaire
    ReactDOM.render(
      React.cloneElement(component, { version: versionId }), 
      pdfContainer
    );
    
    // Attendre le rendu complet et le chargement des images
    // Délai substantiel pour s'assurer que tout est bien chargé
    setTimeout(async () => {
      try {
        document.body.classList.add('generating-pdf');
        console.log(`Starting PDF conversion after render delay (v${versionId})`);
        
        // S'assurer que les images sont chargées
        const images = pdfContainer.querySelectorAll('img');
        console.log(`Found ${images.length} images in component`);
        
        if (images.length > 0) {
          console.log('Waiting for images to load...');
          try {
            const imageLoadPromises = Array.from(images).map(img => 
              img.complete ? Promise.resolve() : new Promise<void>((resolve) => {
                console.log(`Image loading: ${img.src}`);
                img.onload = () => {
                  console.log(`Image loaded: ${img.src}`);
                  resolve();
                };
                img.onerror = () => {
                  console.log(`Image failed to load: ${img.src}`);
                  resolve(); // Continue même si l'image échoue
                };
                // Timeout pour éviter de bloquer indéfiniment
                setTimeout(() => {
                  console.log(`Image load timeout: ${img.src}`);
                  resolve();
                }, 3000);
              })
            );
            
            await Promise.all(imageLoadPromises);
            console.log('All images processed');
          } catch (err) {
            console.warn("Image loading had issues:", err);
          }
        }
        
        // Options PDF optimisées
        const pdfOptions = {
          margin: [10, 10, 10, 10],
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
            backgroundColor: '#ffffff'
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        console.log(`Starting HTML2PDF conversion (v${versionId})`);
        
        // Générer le PDF avec html2pdf
        await html2pdf().from(pdfContainer).set(pdfOptions).save();
        
        console.log(`PDF generation complete (v${versionId})`);
        
        // Nettoyage
        setTimeout(() => {
          if (document.body.contains(pdfContainer)) {
            ReactDOM.unmountComponentAtNode(pdfContainer);
            document.body.removeChild(pdfContainer);
          }
          if (document.head.contains(styleElement)) {
            document.head.removeChild(styleElement);
          }
          document.body.classList.remove('generating-pdf');
          
          if (onComplete) onComplete();
          toast.success("PDF téléchargé avec succès");
        }, 1000);
      } catch (error) {
        console.error(`PDF generation error (v${versionId}):`, error);
        document.body.classList.remove('generating-pdf');
        
        // Nettoyage en cas d'erreur
        if (document.body.contains(pdfContainer)) {
          ReactDOM.unmountComponentAtNode(pdfContainer);
          document.body.removeChild(pdfContainer);
        }
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
        
        if (onError) onError(error);
        if (onComplete) onComplete();
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 3000); // Délai augmenté pour s'assurer du rendu complet
  } catch (error) {
    console.error("PDF setup error:", error);
    document.body.classList.remove('generating-pdf');
    if (onError) onError(error);
    if (onComplete) onComplete();
    toast.error("Erreur lors de la préparation du PDF");
  }
};
