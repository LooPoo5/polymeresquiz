
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
      // Préchargement des images avec gestion de timeout
      await Promise.all(
        Array.from(images).map(img => {
          // Si l'image est déjà chargée, on continue
          if (img.complete) {
            console.log(`Image déjà chargée: ${img.src || 'source inconnue'}`);
            return Promise.resolve();
          }
          
          // Si l'image a une source data:image, elle est déjà chargée
          if (img.src && img.src.startsWith('data:')) {
            console.log(`Image data: déjà chargée`);
            return Promise.resolve();
          }
          
          // Attendre le chargement de l'image avec timeout
          return new Promise<void>((resolve) => {
            console.log(`Chargement de l'image: ${img.src || 'source inconnue'}`);
            
            // Intercepter les événements de chargement/erreur
            img.onload = () => {
              console.log(`Image chargée: ${img.src || 'source inconnue'}`);
              resolve();
            };
            
            img.onerror = () => {
              console.warn(`Échec du chargement de l'image: ${img.src || 'source inconnue'}`);
              // Continuer même si l'image échoue
              resolve();
            };
            
            // Timeout pour éviter le blocage indéfini
            const timeout = setTimeout(() => {
              console.warn(`Timeout du chargement de l'image: ${img.src || 'source inconnue'}`);
              resolve();
            }, 3000);
            
            // Nettoyer le timeout si l'image se charge correctement
            img.onload = () => {
              clearTimeout(timeout);
              console.log(`Image chargée: ${img.src || 'source inconnue'}`);
              resolve();
            };
            
            img.onerror = () => {
              clearTimeout(timeout);
              console.warn(`Échec du chargement de l'image: ${img.src || 'source inconnue'}`);
              resolve();
            };
          });
        })
      );
      console.log('Toutes les images ont été traitées');
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
