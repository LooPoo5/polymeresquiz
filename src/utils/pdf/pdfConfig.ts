
// Common PDF configuration and utilities

// Default PDF options used across generation methods
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
    backgroundColor: '#ffffff'
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
  console.log(`Found ${images.length} images to load`);
  
  if (images.length > 0) {
    try {
      await Promise.all(
        Array.from(images).map(img => 
          img.complete ? Promise.resolve() : new Promise<void>((resolve) => {
            console.log(`Image loading: ${img.src || 'unknown source'}`);
            img.onload = () => {
              console.log(`Image loaded: ${img.src || 'unknown source'}`);
              resolve();
            };
            img.onerror = () => {
              console.log(`Image failed to load: ${img.src || 'unknown source'}`);
              resolve(); // Continue even if image fails
            };
            // Timeout to avoid blocking indefinitely
            setTimeout(() => {
              console.log(`Image load timeout: ${img.src || 'unknown source'}`);
              resolve();
            }, 3000);
          })
        )
      );
      console.log('All images processed');
    } catch (err) {
      console.warn("Image loading had issues:", err);
    }
  }
};

// Common utility for PDF generation setup and cleanup
export const setupPdfGeneration = (): void => {
  document.body.classList.add('generating-pdf');
};

export const cleanupPdfGeneration = (): void => {
  document.body.classList.remove('generating-pdf');
};
