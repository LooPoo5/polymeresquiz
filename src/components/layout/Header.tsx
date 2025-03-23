import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  const navLinks = [{
    title: "Accueil",
    path: "/"
  }, {
    title: "Créer un Quiz",
    path: "/create"
  }, {
    title: "Résultats",
    path: "/results"
  }];
  return <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold text-brand-red">Polymères Logistique</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => <NavLink key={link.path} to={link.path} className={({
            isActive
          }) => `text-base font-medium transition-all-200 subtle-underline ${isActive ? 'text-brand-red' : 'text-brand-gray hover:text-brand-red'}`}>
                {link.title}
              </NavLink>)}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && <div className="md:hidden animate-slide-in">
            <div className="px-2 pt-2 pb-4 space-y-1 border-t border-gray-100">
              {navLinks.map(link => <NavLink key={link.path} to={link.path} className={({
            isActive
          }) => `block py-3 px-3 rounded-md text-base font-medium transition-all-200 ${isActive ? 'text-white bg-brand-red' : 'text-gray-800 hover:bg-gray-100'}`}>
                  {link.title}
                </NavLink>)}
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;