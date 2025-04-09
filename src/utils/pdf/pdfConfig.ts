
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
    imageTimeout: 0 // No timeout for images
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
  const images = Array.from(element.querySelectorAll('img'));
  console.log(`Trouvé ${images.length} images à charger`);
  
  if (images.length === 0) {
    return Promise.resolve();
  }
  
  // Set crossorigin attribute on all images
  images.forEach(img => {
    if (!img.complete) {
      img.setAttribute('crossorigin', 'anonymous');
    }
  });
  
  // Wait for all images to load or fail
  return new Promise<void>((resolve) => {
    let loaded = 0;
    const totalImages = images.length;
    
    // Handler for both load and error events
    const handleImageEvent = () => {
      loaded++;
      console.log(`Image ${loaded}/${totalImages} traitée`);
      if (loaded === totalImages) {
        console.log('Toutes les images ont été traitées');
        resolve();
      }
    };
    
    // Add event listeners to all images
    images.forEach(img => {
      if (img.complete) {
        // Image is already loaded
        handleImageEvent();
      } else {
        // Set up event listeners for loading
        img.addEventListener('load', handleImageEvent, { once: true });
        img.addEventListener('error', handleImageEvent, { once: true });
      }
    });
    
    // Safety timeout after 5 seconds
    setTimeout(() => {
      if (loaded < totalImages) {
        console.log(`Délai dépassé, ${loaded}/${totalImages} images chargées`);
        resolve();
      }
    }, 5000);
  });
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
