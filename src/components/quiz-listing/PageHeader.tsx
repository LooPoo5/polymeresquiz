
import React from 'react';
import SearchBar from './SearchBar';

interface PageHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Liste des Quiz</h1>
        <p className="text-gray-600">Sélectionnez un quiz pour commencer</p>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </div>
  );
};

export default PageHeader;
