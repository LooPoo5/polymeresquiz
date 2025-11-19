
import React from 'react';
import { Participant } from '@/context/types';
import SummaryItem from './SummaryItem';

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
        <SummaryItem label="Nom:" value={participant.name} />
        <SummaryItem label="Date:" value={participant.date} />
        <SummaryItem label="Formateur:" value={participant.instructor} />
        {participant.filledByInstructor && (
          <div style={{ 
            marginTop: '8px',
            padding: '6px',
            backgroundColor: '#fef3c7',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#92400e'
          }}>
            Questionnaire rempli par le formateur pour calculer les points
          </div>
        )}
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

export default ParticipantInfoCard;
