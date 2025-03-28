
import React from 'react';
import { Participant } from '@/context/QuizContext';
import { User, Calendar, UserCog, PenTool } from 'lucide-react';

interface ParticipantInfoProps {
  participant: Participant;
}

const ParticipantInfo = ({
  participant
}: ParticipantInfoProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b dark:border-gray-700">
        Informations du participant
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-brand-red/10 p-2 rounded-full">
            <User size={18} className="text-brand-red" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Nom</div>
            <div className="font-medium">{participant.name}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-brand-red/10 p-2 rounded-full">
            <Calendar size={18} className="text-brand-red" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
            <div className="font-medium">{participant.date}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-brand-red/10 p-2 rounded-full">
            <UserCog size={18} className="text-brand-red" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Formateur</div>
            <div className="font-medium">{participant.instructor}</div>
          </div>
        </div>
      </div>
      
      {participant.signature && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-brand-red/10 p-2 rounded-full">
              <PenTool size={18} className="text-brand-red" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Signature</div>
          </div>
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-700 w-full h-24 flex items-center justify-center">
            <img src={participant.signature} alt="Signature" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantInfo;
