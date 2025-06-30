
import React from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

// Import UI components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface FiltersPanelProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  filterInstructor: string;
  filterQuiz: string;
  filterScore: string;
  uniqueInstructors: string[];
  uniqueQuizzes: string[];
  setFromDate: (date: Date | undefined) => void;
  setToDate: (date: Date | undefined) => void;
  setFilterInstructor: (value: string) => void;
  setFilterQuiz: (value: string) => void;
  setFilterScore: (value: string) => void;
  resetFilters: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  fromDate,
  toDate,
  filterInstructor,
  filterQuiz,
  filterScore,
  uniqueInstructors,
  uniqueQuizzes,
  setFromDate,
  setToDate,
  setFilterInstructor,
  setFilterQuiz,
  setFilterScore,
  resetFilters
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filtres avancés</h3>
        <Button variant="link" size="sm" onClick={resetFilters}>
          Réinitialiser
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date range filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Plage de dates</label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left text-sm h-9",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>Date de début</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <span className="text-gray-400">→</span>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left text-sm h-9",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "dd/MM/yyyy") : <span>Date de fin</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Instructor filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Instructeur</label>
          <Select 
            value={filterInstructor} 
            onValueChange={setFilterInstructor}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tous les instructeurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les instructeurs</SelectItem>
              {uniqueInstructors.map((instructor) => (
                <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Quiz filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Quiz</label>
          <Select 
            value={filterQuiz} 
            onValueChange={setFilterQuiz}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tous les quiz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les quiz</SelectItem>
              {uniqueQuizzes.map((quiz) => (
                <SelectItem key={quiz} value={quiz}>{quiz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Score filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Performance</label>
          <Select 
            value={filterScore} 
            onValueChange={setFilterScore}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tous les scores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les scores</SelectItem>
              <SelectItem value="excellent">Excellent (≥ 16/20)</SelectItem>
              <SelectItem value="good">Bon (12-15/20)</SelectItem>
              <SelectItem value="average">Moyen (10-11/20)</SelectItem>
              <SelectItem value="poor">Insuffisant ({"<"} 10/20)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
