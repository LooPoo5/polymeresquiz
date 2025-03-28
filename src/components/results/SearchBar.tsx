
import React from 'react';
import { Search, FilterX } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

const SearchBar = ({ searchQuery, onSearch, onClearSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full md:w-72 ml-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input 
        type="text" 
        placeholder="Rechercher un résultat..." 
        className="pl-10 pr-10 py-2.5 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" 
        value={searchQuery} 
        onChange={onSearch} 
      />
      {searchQuery && (
        <button 
          onClick={onClearSearch} 
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <FilterX size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
