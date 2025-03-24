
import React from 'react';
import Signature from '@/components/ui-components/Signature';

type SignatureSectionProps = {
  signature: string;
  setSignature: (signature: string) => void;
};

const SignatureSection: React.FC<SignatureSectionProps> = ({
  signature,
  setSignature,
}) => {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Signature *
      </label>
      <Signature onChange={setSignature} value={signature} width={300} height={150} />
    </div>
  );
};

export default SignatureSection;
