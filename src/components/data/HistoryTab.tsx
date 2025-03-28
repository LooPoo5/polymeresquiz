
import React, { useState, useEffect } from 'react';
import { History, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/timeUtils';
import { getExportHistory, getImportHistory } from '@/utils/data';
import ExportHistoryCard from './ExportHistoryCard';
import ImportHistoryCard from './ImportHistoryCard';

const HistoryTab = () => {
  const [exportHistory, setExportHistory] = useState<{ date: string; items: string[] }[]>([]);
  const [importHistory, setImportHistory] = useState<{ 
    date: string; 
    fileName: string;
    items: string[]; 
    counts: { quizCount: number; resultCount: number } 
  }[]>([]);
  
  useEffect(() => {
    setExportHistory(getExportHistory());
    setImportHistory(getImportHistory());
  }, []);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ExportHistoryCard exportHistory={exportHistory} />
      <ImportHistoryCard importHistory={importHistory} />
    </div>
  );
};

export default HistoryTab;
