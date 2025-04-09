
import React from 'react';
import { Participant } from '@/context/types';

interface ParticipantInfoCardProps {
  participant: Participant;
}

const ParticipantInfoCard: React.FC<ParticipantInfoCardProps> = ({ participant }) => {
  return (
    <div style={{ 
      padding: '8px',
      border: '1px solid #eaeaea',
      borderRadius: '4px'
    }}>
      <h3 style={{ 
        fontWeight: '600', 
        marginBottom: '4px',
        color: 'black',
        fontSize: '14px'
      }}>Informations du participant</h3>
      
      <div style={{ marginTop: '4px' }}>
        <ParticipantInfoItem label="Nom:" value={participant.name} />
        <ParticipantInfoItem label="Date:" value={participant.date} />
        <ParticipantInfoItem label="Formateur:" value={participant.instructor} />
      </div>
      
      <div style={{ marginTop: '8px' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          marginBottom: '4px'
        }}>Signature:</div>
        <div style={{ 
          height: '64px',
          width: '160px',
          border: '1px solid #eaeaea',
          borderRadius: '4px',
          backgroundColor: 'white'
        }}>
          {participant.signature && (
            <img 
              src={participant.signature} 
              alt="Signature" 
              style={{ 
                height: '100%',
                width: '100%',
                objectFit: 'contain'
              }}
              crossOrigin="anonymous"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for each participant info item
const ParticipantInfoItem: React.FC<{label: string; value: string}> = ({ label, value }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    marginBottom: '4px'
  }}>
    <span style={{ color: '#666' }}>{label}</span>
    <span style={{ color: 'black' }}>{value}</span>
  </div>
);

export default ParticipantInfoCard;
