import React from 'react';
import { AlertTriangle, Search, LogOut } from 'lucide-react';

interface HeaderProps {
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isAuthenticated, 
  onSignOut, 
  currentPage = 'home',
  onNavigate
}) => {
  const handleNavigation = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-4 mb-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" onClick={handleNavigation('home')} className="flex items-center">
              <AlertTriangle size={28} className="mr-2" />
              <h1 className="text-2xl md:text-3xl font-bold">BiasDetector</h1>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              onClick={handleNavigation('about')} 
              className={`hover:text-blue-200 transition-colors hidden md:inline ${currentPage === 'about' ? 'text-blue-200 underline' : ''}`}
            >
              About
            </a>
            <a 
              href="#" 
              onClick={handleNavigation('resources')} 
              className={`hover:text-blue-200 transition-colors hidden md:inline ${currentPage === 'resources' ? 'text-blue-200 underline' : ''}`}
            >
              Resources
            </a>
            <a 
              href="#" 
              onClick={handleNavigation('faq')} 
              className={`hover:text-blue-200 transition-colors hidden md:inline ${currentPage === 'faq' ? 'text-blue-200 underline' : ''}`}
            >
              FAQ
            </a>
            {isAuthenticated && onSignOut && (
              <button 
                onClick={onSignOut}
                className="flex items-center text-white hover:text-blue-200 transition-colors"
              >
                <LogOut size={18} className="mr-1" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
        
        {currentPage === 'home' && (
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Detect Bias and Misinformation in News Articles
            </h2>
            <p className="text-blue-100 mb-6">
              Our AI-powered tool analyzes news articles to identify potential biases and factual inaccuracies, 
              helping you make more informed decisions about the information you consume.
            </p>
            <div className="flex items-center justify-center">
              <Search size={20} className="text-blue-300 mr-2" />
              <span className="text-blue-200">Paste any article to get started</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;