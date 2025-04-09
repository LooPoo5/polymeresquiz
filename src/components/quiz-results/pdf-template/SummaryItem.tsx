
import React from 'react';
import { SummaryItemProps } from './types';

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    marginBottom: '4px'
  }}>
    <span style={{ color: '#666' }}>{label}</span>
    <span style={{ color: 'black' }}>{value}</span>
  </div>
);

export default SummaryItem;
