
import { StyleDictionary } from 'pdfmake/interfaces';

/**
 * Creates styles for the document
 */
export const createDocumentStyles = (): StyleDictionary => {
  return {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 5] as [number, number, number, number],
      color: '#000000'
    },
    subheader: {
      fontSize: 14,
      bold: true,
      color: '#666666',
      margin: [0, 0, 0, 5] as [number, number, number, number]
    },
    sectionHeader: {
      fontSize: 12,
      bold: true,
      margin: [0, 0, 0, 5] as [number, number, number, number],
      color: '#000000'
    },
    questionText: {
      fontSize: 11,
      bold: true,
      color: '#000000'
    },
    label: {
      fontSize: 10,
      bold: true,
      color: '#000000'
    },
    questionBlock: {
      margin: [0, 0, 0, 10] as [number, number, number, number],
      decoration: 'underline',
      decorationStyle: 'solid',
      decorationColor: '#eeeeee'
    },
    points: {
      alignment: 'right',
      fontSize: 11,
      color: '#333333'
    },
    note: {
      fontSize: 9,
      italics: true,
      color: '#666666'
    },
    footer: {
      fontSize: 8,
      color: '#666666',
      alignment: 'center'
    }
  };
};
