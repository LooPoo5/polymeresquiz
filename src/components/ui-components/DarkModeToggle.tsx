
import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user previously enabled dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    
    if (newDarkModeState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', String(newDarkModeState));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Sun size={18} className="text-gray-600 dark:text-yellow-300" />
      <Switch 
        checked={isDarkMode}
        onCheckedChange={toggleDarkMode}
      />
      <Moon size={18} className="text-gray-600 dark:text-blue-300" />
    </div>
  );
};

export default DarkModeToggle;
