
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExportImportTab from './ExportImportTab';
import HistoryTab from './HistoryTab';

const DataPageTabs = () => {
  return (
    <Tabs defaultValue="import-export">
      <TabsList className="mb-6">
        <TabsTrigger value="import-export">Importation & Exportation</TabsTrigger>
        <TabsTrigger value="history">Historique</TabsTrigger>
      </TabsList>
      
      <TabsContent value="import-export">
        <ExportImportTab />
      </TabsContent>
      
      <TabsContent value="history">
        <HistoryTab />
      </TabsContent>
    </Tabs>
  );
};

export default DataPageTabs;
