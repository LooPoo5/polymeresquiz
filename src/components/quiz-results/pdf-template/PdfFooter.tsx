
import React from 'react';
import { format } from 'date-fns';

const PdfFooter: React.FC = () => {
  return (
    <div style={{ 
      textAlign: 'center',
      fontSize: '12px',
      color: '#666',
      paddingTop: '4px',
      borderTop: '1px solid #eaeaea'
    }}>
      Document généré le {format(new Date(), 'dd/MM/yyyy à HH:mm')}
    </div>
  );
};

export default PdfFooter;
