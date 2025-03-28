
import React from 'react';
import { History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/timeUtils';

interface ExportHistoryCardProps {
  exportHistory: { date: string; items: string[] }[];
}

const ExportHistoryCard = ({ exportHistory }: ExportHistoryCardProps) => {
  return (
    <Card>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-3 text-brand-red">
          <History size={20} />
          <CardTitle>Historique des exportations</CardTitle>
        </div>
        <CardDescription>
          Historique des dernières exportations de données
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {exportHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>Aucun historique d'exportation disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exportHistory.map((entry, index) => (
              <div key={index} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">Exportation du {formatDate(new Date(entry.date))}</p>
                  <p className="text-sm text-gray-500">
                    Données: {entry.items.map(item => 
                      item === 'quizzes' ? 'Quiz' : 'Résultats'
                    ).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExportHistoryCard;
