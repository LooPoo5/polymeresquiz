
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative flex-grow md:w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input 
        type="text" 
        placeholder="Rechercher un quiz..." 
        className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" 
        value={searchQuery} 
        onChange={e => setSearchQuery(e.target.value)} 
      />
    </div>
  );
};

export default SearchBar;
