
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Home, PlusCircle, BarChart2, Database, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    {
      title: "Accueil",
      path: "/",
      icon: <Home size={18} />
    }, 
    {
      title: "Créer un Quiz",
      path: "/create",
      icon: <PlusCircle size={18} />
    }, 
    {
      title: "Résultats",
      path: "/results",
      icon: <BarChart2 size={18} />
    },
    {
      title: "Données",
      path: "/data",
      icon: <Database size={18} />
    },
    {
      title: "Paramètres",
      path: "/settings",
      icon: <Settings size={18} />
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm print:hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/e1de0365-26eb-4fe5-9102-b7899b2c2637.png" 
                alt="Polymères Logistique Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold text-brand-red">Polymères Logistique</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                className={({isActive}) => 
                  `text-base font-medium transition-all-200 subtle-underline flex items-center gap-2 ${
                    isActive ? 'text-brand-red' : 'text-brand-gray hover:text-brand-red'
                  }`
                }
              >
                {link.icon}
                {link.title}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden animate-slide-in">
            <div className="px-2 pt-2 pb-4 space-y-1 border-t border-gray-100">
              {navLinks.map(link => (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  className={({isActive}) => 
                    `block py-3 px-3 rounded-md text-base font-medium transition-all-200 flex items-center gap-2 ${
                      isActive ? 'text-white bg-brand-red' : 'text-gray-800 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.icon}
                  {link.title}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
