
import React from 'react';
import { Filter, Download, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ExportFormat {
  label: string;
  value: string;
}

interface PageHeaderProps {
  viewMode: 'table' | 'dashboard';
  showFilters: boolean;
  exportFormats: ExportFormat[];
  setViewMode: (mode: 'table' | 'dashboard') => void;
  toggleFilters: () => void;
  handleExport: (format: string) => void;
}

const PageHeader = ({
  viewMode,
  showFilters,
  exportFormats,
  setViewMode,
  toggleFilters,
  handleExport
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col w-full md:w-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Résultats</h1>
        <p className="text-gray-600">Historique et analyse des résultats de quiz</p>
      </div>
      
      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center bg-white rounded-md border border-gray-200 overflow-hidden">
          <button 
            onClick={() => setViewMode('table')} 
            className={`px-4 py-2 text-sm font-medium ${viewMode === 'table' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Tableau
          </button>
          <button 
            onClick={() => setViewMode('dashboard')} 
            className={`px-4 py-2 text-sm font-medium ${viewMode === 'dashboard' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Tableau de bord
          </button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleFilters}
          className="flex items-center gap-2"
        >
          <Filter size={14} />
          Filtres
          <ChevronDown size={14} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download size={14} />
              Exporter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="flex flex-col gap-1">
              {exportFormats.map((format) => (
                <Button 
                  key={format.value} 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start" 
                  onClick={() => handleExport(format.value)}
                >
                  {format.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PageHeader;
