
import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLocation } from 'react-router-dom';

interface DarkModeToggleProps {
  className?: string;
  forcePage?: boolean;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '', forcePage = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const isQuizPage = location.pathname.includes('/quiz/');

  useEffect(() => {
    // Only check dark mode if we're on a quiz page or forcePage is true
    if (isQuizPage || forcePage) {
      // Check if user previously enabled dark mode for quiz pages
      const savedDarkMode = localStorage.getItem('quizDarkMode') === 'true';
      setIsDarkMode(savedDarkMode);
      
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // If not on quiz page, ensure light mode
      document.documentElement.classList.remove('dark');
    }
    
    // Cleanup function to reset to light mode when leaving component
    return () => {
      if (isQuizPage && !forcePage) {
        document.documentElement.classList.remove('dark');
      }
    };
  }, [isQuizPage, forcePage]);

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    
    if (newDarkModeState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save the setting for quiz pages only
    localStorage.setItem('quizDarkMode', String(newDarkModeState));
  };

  // Only show the toggle on quiz pages
  if (!isQuizPage && !forcePage) return null;

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
