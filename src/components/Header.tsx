import React from 'react';
import { AlertTriangle, Search, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onSignOut }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-4 mb-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <AlertTriangle size={28} className="mr-2" />
              <h1 className="text-2xl md:text-3xl font-bold">DeepTrust</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="hover:text-blue-200 transition-colors hidden md:inline">About</Link>
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
      </div>
    </header>
  );
};

export default Header;