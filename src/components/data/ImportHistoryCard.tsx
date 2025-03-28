
import React from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/timeUtils';

interface ImportHistoryCardProps {
  importHistory: { 
    date: string; 
    fileName: string; 
    items: string[]; 
    counts: { quizCount: number; resultCount: number } 
  }[];
}

const ImportHistoryCard = ({ importHistory }: ImportHistoryCardProps) => {
  return (
    <Card>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-3 text-brand-red">
          <Upload size={20} />
          <CardTitle>Historique des importations</CardTitle>
        </div>
        <CardDescription>
          Historique des dernières importations de données
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {importHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Upload className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>Aucun historique d'importation disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {importHistory.map((entry, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="font-medium">Importation du {formatDate(new Date(entry.date))}</p>
                <p className="text-sm text-gray-500 mt-1">Fichier: {entry.fileName}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {entry.items.includes('quizzes') && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Quiz: {entry.counts.quizCount}
                    </span>
                  )}
                  {entry.items.includes('results') && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Résultats: {entry.counts.resultCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportHistoryCard;
