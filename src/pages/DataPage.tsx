
import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { AlertCircle, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import DataStatsSummary from '@/components/data/DataStatsSummary';
import DataExportImportPanel from '@/components/data/DataExportImportPanel';
import ImportHistoryPanel from '@/components/data/ImportHistoryPanel';

const DataPage = () => {
  const { quizzes, results } = useQuiz();
  
  // Get unique participant names for statistics
  const uniqueParticipants = [...new Set(results.map(result => result.participant.name))];
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Gestion des Données</h1>
      
      {/* Stats summary cards */}
      <DataStatsSummary 
        quizCount={quizzes.length} 
        resultCount={results.length} 
        participantCount={uniqueParticipants.length} 
      />
      
      {/* Export/Import panel */}
      <DataExportImportPanel />
      
      {/* Import/Export history panel */}
      <ImportHistoryPanel />
    </div>
  );
};

export default DataPage;
