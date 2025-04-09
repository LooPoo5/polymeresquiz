
import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Creates a temporary container and renders a React component into it for PDF generation
 */
export const createPdfContainer = (): HTMLElement => {
  const pdfContainer = document.createElement('div');
  pdfContainer.id = 'pdf-container';
  pdfContainer.style.position = 'absolute';
  pdfContainer.style.left = '-9999px';
  pdfContainer.style.top = '0';
  pdfContainer.style.width = '210mm'; // A4 width
  pdfContainer.style.backgroundColor = 'white';
  pdfContainer.style.color = 'black';
  document.body.appendChild(pdfContainer);
  return pdfContainer;
};

/**
 * Adds styles specifically for PDF rendering
 */
export const addPdfStyles = (): HTMLStyleElement => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @page {
      size: A4;
      margin: 0.5cm;
    }
    #pdf-container {
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: black !important;
      background-color: white !important;
      padding: 10mm;
      box-sizing: border-box;
      width: 210mm;
    }
    #pdf-container img {
      max-width: 100%;
      height: auto;
    }
    #pdf-container h1, #pdf-container h2, #pdf-container h3, #pdf-container h4 {
      color: black !important;
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
    #pdf-container * {
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(styleElement);
  return styleElement;
};

/**
 * Renders a React component to a container for PDF generation
 */
export const renderComponentToContainer = (
  component: React.ReactElement,
  container: HTMLElement
): any => {
  const versionId = Date.now();
  console.log(`PDF generation version: ${versionId}`);
  
  const rootInstance = createRoot(container);
  rootInstance.render(React.cloneElement(component, { version: versionId }));
  
  return { rootInstance, versionId };
};

/**
 * Cleans up resources after PDF generation
 */
export const cleanupRenderedComponent = (
  rootInstance: any,
  container: HTMLElement | null,
  styleElement: HTMLStyleElement | null
): void => {
  try {
    // Unmount React component properly with new API
    if (rootInstance) {
      rootInstance.unmount();
    }
    
    // Remove container
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
    
    // Remove style element
    if (styleElement && document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
};
