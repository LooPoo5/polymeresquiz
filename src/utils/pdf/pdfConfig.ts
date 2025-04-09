
// Configuration commune du PDF et utilitaires

// Options PDF par défaut utilisées dans les méthodes de génération
export const getDefaultPdfOptions = (filename: string) => ({
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
    letterRendering: true,
    backgroundColor: '#ffffff',
    imageTimeout: 5000 // Augmenter le timeout pour les images
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true
  },
  pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
});

// Helper to handle images loading
export const waitForImagesLoaded = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  console.log(`Trouvé ${images.length} images à charger`);
  
  if (images.length > 0) {
    try {
      // On ajoute un attribut data-loaded pour suivre le chargement
      images.forEach(img => {
        if (!img.hasAttribute('crossorigin')) {
          img.setAttribute('crossorigin', 'anonymous');
        }
        
        img.onload = function() {
          img.setAttribute('data-loaded', 'true');
          console.log(`Image chargée: ${img.src || 'source inconnue'}`);
        };
        
        img.onerror = function() {
          img.setAttribute('data-failed', 'true');
          console.warn(`Échec du chargement de l'image: ${img.src || 'source inconnue'}`);
        };
      });
      
      // Attendre que toutes les images soient chargées ou échouées
      await new Promise<void>((resolve) => {
        const checkImages = () => {
          const allProcessed = Array.from(images).every(
            img => img.hasAttribute('data-loaded') || img.hasAttribute('data-failed') || img.complete
          );
          
          if (allProcessed) {
            console.log('Toutes les images ont été traitées');
            resolve();
          } else {
            console.log('En attente du chargement des images...');
            setTimeout(checkImages, 200);
          }
        };
        
        // Vérifier immédiatement, puis à intervalles si nécessaire
        checkImages();
        
        // Délai maximum de sécurité
        setTimeout(resolve, 5000);
      });
      
      console.log('Toutes les images ont été traitées ou le délai est écoulé');
    } catch (err) {
      console.warn("Le chargement des images a rencontré des problèmes:", err);
    }
  }
};

// Common utility for PDF generation setup and cleanup
export const setupPdfGeneration = (): void => {
  document.body.classList.add('generating-pdf');
  
  // Ajout d'un style global temporaire pour le PDF
  const tempStyle = document.createElement('style');
  tempStyle.id = 'pdf-generation-style';
  tempStyle.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      #pdf-container, #pdf-container * {
        visibility: visible;
      }
      #pdf-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
    
    /* Force background colors to print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
  `;
  document.head.appendChild(tempStyle);
};

export const cleanupPdfGeneration = (): void => {
  document.body.classList.remove('generating-pdf');
  
  // Suppression du style temporaire
  const tempStyle = document.getElementById('pdf-generation-style');
  if (tempStyle) {
    document.head.removeChild(tempStyle);
  }
};
