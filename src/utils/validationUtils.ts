
import { Participant } from '@/context/types';

/**
 * Validates participant information for quiz submissions
 */
export const validateParticipantInfo = (
  name: string, 
  instructor: string, 
  signature: string,
  signatureRequired: boolean = true
) => {
  if (!name.trim()) {
    return { isValid: false, message: "Le nom du participant est obligatoire." };
  }
  if (!instructor.trim()) {
    return { isValid: false, message: "Le nom du formateur est obligatoire." };
  }
  if (signatureRequired && !signature) {
    return { isValid: false, message: "La signature est obligatoire." };
  }
  return { isValid: true, message: null };
};
