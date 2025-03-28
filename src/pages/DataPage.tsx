
import React from 'react';
import DataPageTabs from '@/components/data/DataPageTabs';

const DataPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Gestion des Données</h1>
      <DataPageTabs />
    </div>
  );
};

export default DataPage;
