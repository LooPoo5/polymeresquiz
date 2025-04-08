
import React, { useEffect, useState } from 'react';
import Signature from '@/components/ui-components/Signature';
import { useQuiz } from '@/context/QuizContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ParticipantFormProps = {
  name: string;
  setName: (name: string) => void;
  date: string;
  setDate: (date: string) => void;
  instructor: string;
  setInstructor: (instructor: string) => void;
  signature: string;
  setSignature: (signature: string) => void;
};

const ParticipantForm: React.FC<ParticipantFormProps> = ({
  name,
  setName,
  date,
  setDate,
  instructor,
  setInstructor,
  signature,
  setSignature,
}) => {
  const { results } = useQuiz();
  const [participants, setParticipants] = useState<string[]>([]);

  // Extract unique participant names from results
  useEffect(() => {
    if (results && results.length > 0) {
      const uniqueParticipants = [...new Set(
        results.map(result => result.participant.name)
      )].filter(Boolean).sort();
      
      setParticipants(uniqueParticipants);
    }
  }, [results]);

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Vos informations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du participant *
          </label>
          {participants.length > 0 ? (
            <div className="flex flex-col space-y-2">
              <Select value={name} onValueChange={setName}>
                <SelectTrigger 
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                >
                  <SelectValue placeholder="Sélectionnez ou saisissez un nom" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((participant) => (
                    <SelectItem key={participant} value={participant}>
                      {participant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" 
                placeholder="Ou saisissez un nouveau nom"
                aria-label="Saisir un nouveau nom"
              />
            </div>
          ) : (
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" 
              required 
            />
          )}
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du formateur *
          </label>
          <input 
            type="text" 
            id="instructor" 
            value={instructor} 
            onChange={e => setInstructor(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" 
            required 
          />
        </div>
      </div>
    </div>
  );
};

export default ParticipantForm;
