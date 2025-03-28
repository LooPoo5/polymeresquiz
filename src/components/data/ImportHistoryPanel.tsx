
import React, { useEffect, useState } from 'react';
import { Clock, Download, Info } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

interface HistoryItem {
  id: string;
  date: string; // ISO string
  filename: string;
  type: 'import' | 'export';
}

const ImportHistoryPanel: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('data-history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center gap-3 mb-4 text-gray-600">
          <Clock size={20} />
          <h2 className="text-lg font-semibold">Historique des opérations</h2>
        </div>
        
        <div className="py-8 text-center text-gray-500">
          <Info className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p>Aucun historique d'importation ou d'exportation disponible</p>
          <p className="text-sm mt-1">
            L'historique sera enregistré lors de vos prochaines opérations
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Clock size={20} className="text-purple-500" />
        <h2 className="text-lg font-semibold">Historique des opérations</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Nom du fichier</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.date), 'PPP à HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${item.type === 'import' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {item.type === 'import' ? 'Import' : 'Export'}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.filename}</TableCell>
                  <TableCell className="text-right">
                    {item.type === 'export' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Download size={14} className="mr-1" />
                        <span className="text-xs">Télécharger</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ImportHistoryPanel;
