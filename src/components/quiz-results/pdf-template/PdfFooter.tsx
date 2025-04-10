
import React from 'react';

const PdfFooter: React.FC = () => {
  return (
    <div style={{
      marginTop: '20px',
      paddingTop: '10px',
      borderTop: '1px solid #eaeaea',
      fontSize: '8px',
      color: '#666666',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pageBreakInside: 'avoid'
    }}>
      <div style={{ marginBottom: '5px' }}>
        <span style={{ color: '#047857', marginRight: '10px' }}>● Réponse correcte sélectionnée</span>
        <span style={{ color: '#dc2626', marginRight: '10px' }}>● Réponse incorrecte sélectionnée</span>
        <span style={{ color: '#F97316', marginRight: '10px' }}>● Réponse correcte non sélectionnée</span>
      </div>
      <div>
        Document généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PdfFooter;
