
import React from 'react';
import { Participant } from '@/types/quiz';

interface ParticipantInfoProps {
  participant: Participant;
}

const ParticipantInfo = ({ participant }: ParticipantInfoProps) => {
  return (
    <div className="bg-brand-lightgray rounded-lg p-5">
      <h3 className="text-lg font-semibold mb-3">Informations du participant</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Nom:</span>
          <span className="font-medium">{participant.name}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">{participant.date}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Formateur:</span>
          <span className="font-medium">{participant.instructor}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-1">Signature:</div>
        <div className="border rounded-lg overflow-hidden w-48 h-20 bg-white">
          {participant.signature && (
            <img 
              src={participant.signature} 
              alt="Signature" 
              className="w-full h-full object-contain" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantInfo;
