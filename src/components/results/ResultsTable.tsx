
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizResult } from '@/context/types';
import { Calendar, Trash2, Eye, BarChart, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

interface ResultsTableProps {
  results: QuizResult[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onDeleteResult: (id: string) => void;
  onViewResult: (id: string) => void;
  onViewParticipantStats: (participantName: string) => void;
}

const ResultsTable = ({
  results,
  sortField,
  sortDirection,
  onSort,
  onDeleteResult,
  onViewResult,
  onViewParticipantStats
}: ResultsTableProps) => {
  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 
        <ChevronUp size={16} className="ml-1" /> : 
        <ChevronDown size={16} className="ml-1" />;
    }
    return <ArrowUpDown size={16} className="ml-1 opacity-50" />;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('endTime')}
            >
              <div className="flex items-center">
                Date
                {getSortIcon('endTime')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('quizTitle')}
            >
              <div className="flex items-center">
                Quiz
                {getSortIcon('quizTitle')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('participantName')}
            >
              <div className="flex items-center">
                Participant
                {getSortIcon('participantName')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('score')}
            >
              <div className="flex items-center">
                Score
                {getSortIcon('score')}
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map(result => {
            // Calculate score with one decimal place always
            const scoreOn20 = ((result.totalPoints / result.maxPoints) * 20).toFixed(1);
            const scoreClass = parseFloat(scoreOn20) >= 10 ? 'text-green-600' : 'text-red-600';
            
            return (
              <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    {formatDate(result.endTime)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{result.quizTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm text-gray-900">{result.participant.name}</div>
                      <div className="text-sm text-gray-500">Formateur: {result.participant.instructor}</div>
                    </div>
                    <button 
                      onClick={() => onViewParticipantStats(result.participant.name)}
                      className="ml-2 p-1.5 text-gray-400 hover:text-brand-red transition-colors"
                      title="Voir les statistiques du participant"
                    >
                      <BarChart size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${scoreClass}`}>
                    {scoreOn20}/20
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.totalPoints}/{result.maxPoints} points
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center gap-2">
                    <button 
                      onClick={() => onViewResult(result.id)} 
                      className="text-brand-red hover:text-opacity-80 transition-colors p-1" 
                      title="Voir le détail"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteResult(result.id)} 
                      className="text-gray-400 hover:text-brand-red transition-colors p-1" 
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
