
import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { ParticipantQuizSummary, formatDuration } from '@/utils/participantStats';
import { format } from 'date-fns';
import { NavigateFunction } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface QuizHistoryTableProps {
  quizzes: ParticipantQuizSummary[];
  navigate: NavigateFunction;
}

const QuizHistoryTable: React.FC<QuizHistoryTableProps> = ({ quizzes, navigate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileText size={20} className="text-brand-red" />
        Historique des quiz
      </h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Quiz</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Temps</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={quiz.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span>{format(quiz.date, 'dd/MM/yyyy')}</span>
                  <span className="text-xs text-gray-500">{quiz.timeAgo}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{quiz.title}</TableCell>
              <TableCell>
                <span className={quiz.scoreOn20 >= 10 ? 'text-green-600' : 'text-red-600'}>
                  {quiz.scoreOn20}/20
                </span>
              </TableCell>
              <TableCell>{formatDuration(quiz.durationInSeconds)}</TableCell>
              <TableCell>
                <button 
                  onClick={() => navigate(`/quiz-results/${quiz.id}`)}
                  className="inline-flex items-center text-brand-red hover:underline text-sm"
                >
                  Détails <ChevronRight size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuizHistoryTable;
